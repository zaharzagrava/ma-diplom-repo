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
} from './bis-function.types';
import Credit from 'src/models/credit.model';
import { BusinessState } from 'src/business/types';

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

  public async exec(businessState: BusinessState, bisFunction: BisFunction) {
    switch (bisFunction.type) {
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT =
          await this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction);
        return this.exec_PAYOUT_CREDIT_FIXED_AMOUNT(
          businessState,
          bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
        );
    }

    return businessState;
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
