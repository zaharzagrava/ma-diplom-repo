import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import BisFunction, {
  BisFunctionType,
  BisFunctionWithAll,
} from 'src/models/bis-function.model';
import Product from 'src/models/product.model';
import Resource from 'src/models/resource.model';
import Equipment from 'src/models/equipment.model';
import { BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT } from './bis-function.types';
import Credit from 'src/models/credit.model';

@Injectable()
export class BisFunctionService {
  private readonly logger = new Logger(BisFunctionService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,

    @InjectModel(BisFunction)
    private readonly bisFunctionModel: typeof BisFunction,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(Resource)
    private readonly resourceModel: typeof Resource,

    @InjectModel(Credit)
    private readonly creditModel: typeof Credit,
    @InjectModel(Equipment)
    private readonly equipmentModel: typeof Equipment,
    @InjectConnection() private readonly sequelizeInstance: Sequelize,
  ) {}

  public async findAll(params?: BisFunctionWithAll, postProcess = true) {
    const bisFunctions = await this.bisFunctionModel.findAll();

    return bisFunctions.map((bisFunction) => {
      switch (bisFunction.type) {
        case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
          return this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction);

        default:
          return bisFunction;
      }
    });
  }

  private async postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(
    bisFunction: BisFunction,
  ): Promise<BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT> {
    if (bisFunction.type !== BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.creditId)
      throw new Error('Invalid PAYOUT_CREDIT_FIXED_AMOUNT record');

    const credit = await this.creditModel.findByPk(bisFunction.creditId);

    if (!credit) throw new Error('Credit not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      amount: bisFunction.meta.amount,
      type: bisFunction.type,
      credit,
    };
  }

  public exec(
    bisFunction: BisFunction,
    productionChain: {
      products: Product[];
      resources: Resource[];
      equipment: Equipment[];
    },
  ) {
    switch (bisFunction.type) {
      case BisFunctionType.BUY_RESOURCE_PRODUCT_FIXED_AMOUNT:
        this.buyProductResultFixedAmount();
        break;

      default:
        break;
    }
  }

  /**
   * @description
   *    - buys enough products to produce a given amount of Products in a give ProductionChain
   *
   */
  private buyProductResultFixedAmount() {
    //
  }
}
