import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import * as _ from 'lodash';
import ProductionChain, {
  ProductionChainScope,
  ProductionChainWithAllFilters,
} from 'src/models/productionChain.model';
import User, { UserType } from 'src/models/user.model';
import { BusinessState } from 'src/business/types';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import ProductionChainUser from 'src/models/productionChainUser.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import { ProductService } from 'src/product/product.service';
import { ResourceService } from 'src/resource/resource.service';
import Resource from 'src/models/resource.model';
import { SpentResourceDto } from 'src/resource/types';
import ProductionChainEquipment from 'src/models/productionChainEquipment.model';
import Equipment from 'src/models/equipment.model';
import { UsersDbService } from 'src/users-db/users-db.service';
import { CreateProductionChainDto } from './types';

@Injectable()
export class ProductionChainService {
  private readonly logger = new Logger(ProductionChainService.name);

  constructor(
    private readonly dbU: DbUtilsService,

    private readonly productService: ProductService,
    private readonly resourceService: ResourceService,
    private readonly usersDbService: UsersDbService,

    @InjectModel(ProductionChain)
    private readonly productionChainModel: typeof ProductionChain,
    @InjectModel(ProductionChainUser)
    private readonly productionChainUserModel: typeof ProductionChainUser,
    @InjectModel(ProductionChainResource)
    private readonly productionChainResourceModel: typeof ProductionChainResource,
    @InjectModel(ProductionChainEquipment)
    private readonly productionChainEquipmentModel: typeof ProductionChainEquipment,
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

  private async dbUpsert(
    productionChainUpsert: Partial<CreateProductionChainDto>,
    tx?: Transaction,
  ) {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const productionChain = await this.productionChainModel.findOne({
        where: { name: productionChainUpsert.name },
        transaction: tx,
      });

      if (!productionChain) {
        await this.productionChainModel.create(productionChainUpsert, {
          transaction: tx,
        });
      } else {
        await this.productionChainModel.update(productionChainUpsert, {
          where: { name: productionChainUpsert.name },
          transaction: tx,
        });
      }

      return await this.productionChainModel.findOne({
        where: { name: productionChainUpsert.name },
        transaction: tx,
      });
    });
  }

  /**
   * upsert
   */
  public upsert(
    {
      name,
      productId,
      equipments,
      users,
      resources,
    }: {
      name?: string;
      productId?: string;
      equipments: { id: string; amount: number }[];
      users: { id: string }[];
      resources: { id: string; amount: number }[];
    },
    tx?: Transaction,
  ) {
    this.dbU.wrapInTransaction(async (tx) => {
      try {
        const productionChain = await this.findOne({
          name,
        });

        if (!productionChain)
          throw new NotFoundException('Production chain is not found');

        await this.cleanUpProductionChain({
          id: productionChain.id,
          tx,
        });

        await this.dbUpsert(
          {
            name,
            productId,
          },
          tx,
        );

        for (const equipment of equipments) {
          await this.productionChainEquipmentModel.create({
            equipmentId: equipment.id,
            productionChainId: productionChain.id,
            amount: equipment.amount,
          });
        }

        for (const resource of resources) {
          await this.productionChainResourceModel.create({
            resourceId: resource.id,
            productionChainId: productionChain.id,
            amount: resource.amount,
          });
        }

        const prodChainUsers = await this.getUserTypes(productionChain.id, tx);

        const dbUsers = await this.usersDbService.findAll({
          id: users.map((x) => x.id),
        });

        for (const user of users) {
          const dbUser = dbUsers.find((u) => u.id === user.id);

          if (!dbUser) {
            throw new BadRequestException(`Incorrect user id ${user.id}`);
          }

          this.ensureCorrectUserType(prodChainUsers, dbUser);

          await this.productionChainUserModel.create({
            userId: user.id,
            productionChainId: productionChain.id,
            type: dbUser.type,
          });
        }
      } catch (error) {
        console.log('@error');
        console.log(JSON.stringify(error, null, 2));
      }
    }, tx);
  }

  /**
   * cleanUpProductionChain
   */
  public async cleanUpProductionChain({
    id,
    tx,
  }: {
    id: string;
    tx?: Transaction;
  }) {
    await this.productionChainResourceModel.destroy({
      where: { productionChainId: id },
      transaction: tx,
    });

    await this.productionChainEquipmentModel.destroy({
      where: { productionChainId: id },
      transaction: tx,
    });

    await this.productionChainUserModel.destroy({
      where: {
        productionChainId: id,
        userId: {
          [Op.not]: null,
        },
      },
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
    tx: Transaction;
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

      const prodChainUsers = await this.getUserTypes(productionChain.id, tx);

      this.ensureCorrectUserType(prodChainUsers, user);

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

      return {
        user,
        reassignedFrom,
      };
    }, tx);
  }

  private ensureCorrectUserType(
    prodChainUsers: ProductionChainUser[],
    user: { type: UserType },
  ) {
    if (!prodChainUsers.find((x) => x.type === user.type)) {
      throw new Error(
        `User of type ${user.type} cannot be assigned to the production chain`,
      );
    }
  }

  private async getUserTypes(productionChainId: string, tx: Transaction) {
    return await this.productionChainUserModel.findAll({
      where: { userId: null, productionChainId },
      transaction: tx,
    });
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
    tx: Transaction;
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
    tx: Transaction;
  }): Promise<{
    otherLogs: string[];
    usersTypesCount: Record<string, number>;
    minProductsFromUsers: number;
    minProductsFromResources: number;
    minProductsFromEquipment: number;
    minProducable: number;
    spentResources: SpentResourceDto[];
  }> {
    return await this.dbU.wrapInTransaction(
      async (
        tx,
      ): Promise<{
        otherLogs: string[];
        usersTypesCount: Record<string, number>;
        minProductsFromUsers: number | null;
        minProductsFromResources: number | null;
        minProductsFromEquipment: number | null;
        minProducable: number;
        spentResources: SpentResourceDto[];
      }> => {
        const otherLogs = [];

        const [prodChainUsers, prodChainResources, prodChainEquipment] =
          await Promise.all([
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
            this.productionChainEquipmentModel.findAll({
              where: { productionChainId: productionChain.id },
              include: [{ model: Equipment }],
              transaction: tx,
            }),
          ]);

        let minProductsFromUsers = null;
        let usersTypesCount: Record<string, number> = {};
        if (prodChainUsers.length === 0) {
          otherLogs.push('No users needed for this production chain');
        } else {
          ({ minProductsFromUsers, usersTypesCount } =
            this.calcMinProductsFromUsers(prodChainUsers));
        }

        let minProductsFromResources = null;
        if (prodChainResources.length === 0) {
          otherLogs.push('No resources needed for this production chain');
        } else {
          minProductsFromResources =
            this.calcMinProductsFromResources(prodChainResources);
        }

        let minProductsFromEquipment = null;
        if (prodChainEquipment.length === 0) {
          otherLogs.push('No equipment needed for this production chain');
        } else {
          minProductsFromEquipment =
            this.calculateMinProductsFromEquipment(prodChainEquipment);
        }

        const minProducable = this.getMinProducable(
          minProductsFromResources,
          minProductsFromUsers,
          minProductsFromEquipment,
        );

        const spentResources: SpentResourceDto[] = [];
        if (prodChainResources.length !== 0) {
          await this.resourceService.spendOnProducts({
            prodChainResources,
            amount: minProducable,
            tx,
          });
        }

        await this.productService.increaseAmount({
          id: productionChain.productId,
          amount: minProducable,
          tx,
        });

        return {
          otherLogs,
          usersTypesCount,
          minProductsFromUsers,
          minProductsFromResources,
          minProductsFromEquipment,
          minProducable,
          spentResources,
        };
      },
      tx,
    );
  }

  private getMinProducable(
    minProductsFromResources: number | null,
    minProductsFromUsers: number | null,
    minProductsFromEquipment: number | null,
  ) {
    const comparisonArray: number[] = [];
    if (minProductsFromResources !== null)
      comparisonArray.push(minProductsFromResources);
    if (minProductsFromUsers !== null)
      comparisonArray.push(minProductsFromUsers);
    if (minProductsFromEquipment !== null)
      comparisonArray.push(minProductsFromEquipment);

    return Math.min(...comparisonArray);
  }

  private calcMinProductsFromUsers(prodChainUsers: ProductionChainUser[]) {
    const usersTypesCount: Record<string, number> = {};
    for (const prodChainUser of prodChainUsers) {
      usersTypesCount[prodChainUser.type] =
        (usersTypesCount[prodChainUser.type] ?? 0) + 1;
    }
    const minProductsFromUsers = Math.min(...Object.values(usersTypesCount));

    if (!minProductsFromUsers) {
      throw new Error('Not enough users for at least 1 product');
    }
    return { minProductsFromUsers, usersTypesCount };
  }

  private calcMinProductsFromResources(
    prodChainResources: ProductionChainResource[],
  ) {
    let minEnoughForXProducts = Infinity;
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

    return minEnoughForXProducts;
  }

  private calculateMinProductsFromEquipment(
    prodChainEquipments: ProductionChainEquipment[],
  ) {
    let minEnoughForXProducts = Infinity;
    for (const prodChainEquipment of prodChainEquipments) {
      const enoughForXProducts = Math.floor(
        prodChainEquipment.equipment.amount / prodChainEquipment.amount,
      );

      minEnoughForXProducts = Math.min(
        minEnoughForXProducts,
        enoughForXProducts,
      );
    }

    if (!minEnoughForXProducts) {
      throw new Error('Not enough resources for at least 1 product');
    }

    return minEnoughForXProducts;
  }
}
