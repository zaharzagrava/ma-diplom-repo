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
import {
  BisFunctionUpsertDto,
  BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunction_SELL_PRODUCT_FIXED,
} from './bis-function.types';
import Credit from 'src/models/credit.model';
import { BusinessState } from 'src/business/types';
import { ProductService } from 'src/product/product.service';
import { Transaction } from 'sequelize';
import { PeriodService } from 'src/period/period.service';

@Injectable()
export class BisFunctionService {
  private readonly logger = new Logger(BisFunctionService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,
    private readonly productService: ProductService,
    private readonly periodService: PeriodService,

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

    const processedBisFunctions = bisFunctions.map(async (bisFunction) => {
      switch (bisFunction.type) {
        case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
          return this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction);
        default:
          return bisFunction;
      }
    });

    return await Promise.all(processedBisFunctions);
  }

  public async upsert({
    bisFunctionUpsert,
  }: {
    bisFunctionUpsert: BisFunctionUpsertDto;
  }) {
    const bisFunctions = await this.findAll();

    return bisFunctions.find((x) => x.name);
  }

  private async postProcess(
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
      type: bisFunction.type,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      credit,
      amount: bisFunction.meta.amount,
    };
  }

  public async exec(
    businessState: BusinessState,
    bisFunction: BisFunction,
    period: number,
  ) {
    if (
      !this.periodService.between(
        bisFunction.startPeriod,
        bisFunction.endPeriod,
        period,
      )
    ) {
      return businessState;
    }

    switch (bisFunction.type) {
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT =
          await this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction);
        return this.exec_PAYOUT_CREDIT_FIXED_AMOUNT(
          businessState,
          bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
        );
      case BisFunctionType.SELL_PRODUCT_FIXED:
        const bisFunction_SELL_PRODUCT_FIXED =
          await this.postProcess_SELL_PRODUCT_FIXED(bisFunction);
        return this.exec_SELL_PRODUCT_FIXED(
          businessState,
          bisFunction_SELL_PRODUCT_FIXED,
        );
    }

    return businessState;
  }

  private async postProcess_SELL_PRODUCT_FIXED(
    bisFunction: BisFunction,
  ): Promise<BisFunction_SELL_PRODUCT_FIXED> {
    if (bisFunction.type !== BisFunctionType.SELL_PRODUCT_FIXED) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.productId)
      throw new Error('Invalid SELL_PRODUCT_FIXED record');

    const product = await this.productModel.findByPk(bisFunction.productId);

    if (!product) throw new Error('Product not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      product,
      amount: bisFunction.meta.amount,
    };
  }

  /**
   * @description
   *    - buys enough products to produce a given amount of Products in a give ProductionChain
   *
   */
  private async exec_SELL_PRODUCT_FIXED(
    businessState: BusinessState,
    bisFunction: BisFunction_SELL_PRODUCT_FIXED,
    tx?: Transaction,
  ): Promise<BusinessState> {
    const { product, income } = await this.productService.sellProduct({
      product: bisFunction.product,
      sellAmount: bisFunction.amount,
      tx,
    });

    businessState.balance += income;

    return businessState;
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
      type: bisFunction.type,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      credit,
      amount: bisFunction.meta.amount,
    };
  }

  /**
   * @description
   *    - buys enough products to produce a given amount of Products in a give ProductionChain
   *
   */
  private exec_PAYOUT_CREDIT_FIXED_AMOUNT(
    businessState: BusinessState,
    bisFunction: BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
  ): BusinessState {
    businessState.balance -= bisFunction.amount;

    return businessState;
  }
}
