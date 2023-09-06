import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { BusinessState } from 'src/business/types';
import { EntityDeleteDto, ResourceUpsertDto } from 'src/entities/types';
import ProductionChain from 'src/models/productionChain.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import Resource, {
  ResourceScope,
  ResourceWithAllFilters,
} from 'src/models/resource.model';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { UtilsService } from 'src/utils/utils/utils.service';
import { SpentResourceDto } from './types';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(
    private readonly dbU: DbUtilsService,
    private readonly u: UtilsService,

    @InjectModel(Resource)
    private readonly resourceModel: typeof Resource,
    @InjectModel(ProductionChainResource)
    private readonly productionChainResourceModel: typeof ProductionChainResource,
  ) {}

  public findAll(
    params?: ResourceWithAllFilters,
    tx?: Transaction,
  ): Promise<Resource[] | null> {
    return this.resourceModel
      .scope({
        method: [ResourceScope.WithAll, <ResourceWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }

  public async upsert(entityUpsert: ResourceUpsertDto) {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const resource = await this.resourceModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });

      if (!resource) {
        await this.resourceModel.create(entityUpsert, {
          transaction: tx,
        });
      } else {
        await this.resourceModel.update(entityUpsert, {
          where: { name: entityUpsert.name },
          transaction: tx,
        });
      }

      return await this.resourceModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });
    });
  }

  public async delete(entityDelete: EntityDeleteDto) {
    return await this.dbU.wrapInTransaction(async (tx) => {
      return await this.resourceModel.destroy({
        where: { id: entityDelete.id },
        transaction: tx,
      });
    });
  }

  public async buyResourcesForProductionChain({
    businessState,
    amount,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    amount: number;
    productionChain: ProductionChain;
    tx: Transaction;
  }): Promise<
    {
      buyAmount: number;
      price: number;
      name: string;
    }[]
  > {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const prodChainResources =
        await this.productionChainResourceModel.findAll({
          where: { productionChainId: productionChain.id },
          include: [{ model: Resource }],
          transaction: tx,
        });

      const boughtResources = [];
      for (const prodChainResource of prodChainResources) {
        const buyAmount = amount * prodChainResource.amount;
        const price = buyAmount * prodChainResource.resource.price;

        businessState.balance -= price;

        await this.buyResource({
          resource: prodChainResource.resource,
          buyAmount,
          tx,
        });

        boughtResources.push({
          buyAmount,
          price,
          name: prodChainResource.resource.name,
        });
      }

      return boughtResources;
    }, tx);
  }

  public async spendOnProducts({
    prodChainResources,
    amount,
    tx,
  }: {
    prodChainResources: ProductionChainResource[];
    amount: number;
    tx: Transaction;
  }): Promise<SpentResourceDto[]> {
    return await this.dbU.wrapInTransaction(
      async (tx): Promise<SpentResourceDto[]> => {
        const spentResources = [];
        for (const prodChainResource of prodChainResources) {
          const toSpend = amount * prodChainResource.amount;
          const newAmount = prodChainResource.resource.amount - toSpend;

          if (newAmount < 0) {
            throw new Error(
              `Not enough amount to spend: ${prodChainResource.amount} for ${amount}`,
            );
          }

          await this.spendResource({
            resource: prodChainResource.resource,
            newAmount,
            tx,
          });

          spentResources.push({
            newAmount,
            name: prodChainResource.resource.name,
          });
        }

        return spentResources;
      },
      tx,
    );
  }

  private async buyResource({
    resource,
    buyAmount,
    tx,
  }: {
    resource: Resource;
    buyAmount: number;
    tx: Transaction;
  }) {
    return await resource.update(
      { amount: resource.amount + buyAmount },
      { transaction: tx },
    );
  }

  private async spendResource({
    resource,
    newAmount,
    tx,
  }: {
    resource: Resource;
    newAmount: number;
    tx: Transaction;
  }) {
    return await resource.update({ amount: newAmount }, { transaction: tx });
  }
}
