import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import * as _ from 'lodash';
import ProductionChain, {
  ProductionChainScope,
  ProductionChainWithAllFilters,
} from 'src/models/productionChain.model';
import User from 'src/models/user.model';
import { BusinessState } from 'src/business/types';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import ProductionChainUser from 'src/models/productionChainUser.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import { ProductService } from 'src/product/product.service';
import { ResourceService } from 'src/resource/resource.service';
import Resource from 'src/models/resource.model';
import { SpentResourceDto } from 'src/resource/types';

@Injectable()
export class ProductionChainService {
  private readonly logger = new Logger(ProductionChainService.name);

  constructor(
    private readonly dbU: DbUtilsService,

    private readonly productService: ProductService,
    private readonly resourceService: ResourceService,

    @InjectModel(ProductionChain)
    private readonly productionChainModel: typeof ProductionChain,
    @InjectModel(ProductionChainUser)
    private readonly productionChainUserModel: typeof ProductionChainUser,
    @InjectModel(ProductionChainResource)
    private readonly productionChainResourceModel: typeof ProductionChainResource,
  ) {}

  public findOne(
    params?: ProductionChainWithAllFilters,
    tx?: Transaction,
  ): Promise<ProductionChain | null> {
    return this.productionChainModel
      .scope({
        method: [
          ProductionChainScope.WithAll,
          <ProductionChainWithAllFilters>params,
        ],
      })
      .findOne({
        transaction: tx,
      });
  }

  public findAll(
    params?: ProductionChainWithAllFilters,
    tx?: Transaction,
  ): Promise<ProductionChain[]> {
    return this.productionChainModel
      .scope({
        method: [
          ProductionChainScope.WithAll,
          <ProductionChainWithAllFilters>params,
        ],
      })
      .findAll({
        transaction: tx,
      });
  }

  /**
   * hireEmployee
   */
  public async hireEmployee({
    businessState,
    user,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    user: User;
    productionChain: ProductionChain;
    tx?: Transaction;
  }): Promise<{
    user: User;
    reassignedFrom: string;
  }> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      let reassignedFrom;

      const prodChainUser = await this.productionChainUserModel.findOne({
        where: { userId: user.id },
        include: [{ model: this.productionChainModel, required: true }],
        transaction: tx,
      });

      const prodChainUsers = await this.productionChainUserModel.findAll({
        where: { userId: null, productionChainId: productionChain.id },
        transaction: tx,
      });

      if (!prodChainUsers.find((x) => x.type === user.type)) {
        throw new Error(
          `User of type ${user.type} cannot be assigned to the production chain`,
        );
      }

      if (prodChainUser) {
        if (prodChainUser.productionChain.id === productionChain.id) {
          throw new Error(
            'Production chain already assigned, no actions taken',
          );
        }

        await prodChainUser.destroy({ transaction: tx });

        reassignedFrom = prodChainUser.productionChain.name;
      }

      await this.productionChainUserModel.create(
        {
          userId: user.id,
          type: user.type,
          productionChainId: productionChain.id,
        },
        {
          returning: true,
          transaction: tx,
        },
      );

      const asd = await this.productionChainUserModel.findAll({
        where: { productionChainId: productionChain.id },
        transaction: tx,
      });

      console.log('@asd');
      console.log(asd);

      return {
        user,
        reassignedFrom,
      };
    }, tx);
  }

  /**
   * fireEmployee
   */
  public async fireEmployee({
    businessState,
    user,
    tx,
  }: {
    businessState: BusinessState;
    user: User;
    tx?: Transaction;
  }): Promise<boolean> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const prodChainUsers = await this.productionChainUserModel.findAll({
        where: { userId: user.id },
        transaction: tx,
      });

      await this.productionChainUserModel.destroy({
        where: { id: prodChainUsers.map((x) => x.id) },
        transaction: tx,
      });

      return true;
    }, tx);
  }

  /**
   * fireEmployee
   */
  public async produce({
    businessState,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    productionChain: ProductionChain;
    tx?: Transaction;
  }): Promise<{
    typesCount: Record<string, number>;
    minUsersCount: number;
    minEnoughForXProducts: number;
    minProducable: number;
    spentResources: SpentResourceDto[];
  }> {
    return await this.dbU.wrapInTransaction(
      async (
        tx,
      ): Promise<{
        typesCount: Record<string, number>;
        minUsersCount: number;
        minEnoughForXProducts: number;
        minProducable: number;
        spentResources: SpentResourceDto[];
      }> => {
        const [prodChainUsers, prodChainResources] = await Promise.all([
          this.productionChainUserModel.findAll({
            where: {
              productionChainId: productionChain.id,
              userId: { [Op.not]: null },
            },
            transaction: tx,
          }),
          this.productionChainResourceModel.findAll({
            where: { productionChainId: productionChain.id },
            include: [{ model: Resource }],
            transaction: tx,
          }),
        ]);

        if (prodChainUsers.length === 0) {
          throw new Error('No users assigned to this production chain');
        }

        if (prodChainResources.length === 0) {
          throw new Error('No resources assigned to this production chain');
        }

        const typesCount: Record<string, number> = {};
        for (const prodChainUser of prodChainUsers) {
          typesCount[prodChainUser.type] =
            (typesCount[prodChainUser.type] ?? 0) + 1;
        }
        const minUsersCount = Math.min(...Object.values(typesCount));

        if (!minUsersCount) {
          throw new Error('Not enough users for at least 1 product');
        }

        let minEnoughForXProducts = Infinity;
        console.log(
          prodChainResources.map((x) => ({
            resourceAmount: x.resource.amount,
            amount: x.amount,
          })),
        );
        for (const prodChainResource of prodChainResources) {
          const enoughForXProducts = Math.floor(
            prodChainResource.resource.amount / prodChainResource.amount,
          );

          minEnoughForXProducts = Math.min(
            minEnoughForXProducts,
            enoughForXProducts,
          );
        }

        if (!minEnoughForXProducts) {
          throw new Error('Not enough resources for at least 1 product');
        }

        const minProducable = Math.min(minEnoughForXProducts, minUsersCount);

        const spentResources: SpentResourceDto[] =
          await this.resourceService.spendOnProducts({
            prodChainResources,
            amount: minProducable,
            tx,
          });

        await this.productService.increaseAmount({
          id: productionChain.productId,
          amount: minProducable,
          tx,
        });

        return {
          typesCount,
          minUsersCount,
          minEnoughForXProducts,
          minProducable,
          spentResources,
        };
      },
      tx,
    );
  }
}
