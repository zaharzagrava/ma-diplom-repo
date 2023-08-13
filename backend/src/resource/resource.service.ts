import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { BusinessState } from 'src/business/types';
import ProductionChain from 'src/models/productionChain.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import Resource, {
  ResourceScope,
  ResourceWithAllFilters,
} from 'src/models/resource.model';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { UtilsService } from 'src/utils/utils/utils.service';

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

  public async buyResourcesForProductionChain({
    businessState,
    amount,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    amount: number;
    productionChain: ProductionChain;
    tx?: Transaction;
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
          resourceId: prodChainResource.resourceId,
          amount: amount * prodChainResource.amount,
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

  private async buyResource({
    resourceId,
    amount,
  }: {
    resourceId: string;
    amount: number;
  }) {
    return 'stub';
  }
}
