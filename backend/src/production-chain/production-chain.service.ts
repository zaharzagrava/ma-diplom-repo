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

@Injectable()
export class ProductionChainService {
  private readonly logger = new Logger(ProductionChainService.name);

  constructor(
    private readonly dbU: DbUtilsService,

    @InjectModel(ProductionChain)
    private readonly productionChainModel: typeof ProductionChain,
    @InjectModel(ProductionChainUser)
    private readonly productionChainUserModel: typeof ProductionChainUser,
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

      return {
        user,
        reassignedFrom,
      };
    }, tx);
  }

  /**
   * hireEmployee
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
}
