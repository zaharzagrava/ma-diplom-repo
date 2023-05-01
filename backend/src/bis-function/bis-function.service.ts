import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
  BisFunctionDto_SELL_PRODUCT_FIXED,
  BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunctionEditDto_SELL_PRODUCT_FIXED,
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
    const bisFunctions = (await this.bisFunctionModel.findAll()).sort(
      (a, b) => a.order - b.order,
    );

    const processedBisFunctions = bisFunctions.map(async (bisFunction) => {
      switch (bisFunction.type) {
        case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
          return this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction);
        case BisFunctionType.SELL_PRODUCT_FIXED:
          return this.postProcess_SELL_PRODUCT_FIXED(bisFunction);
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
    console.log('@bisFunctionUpsert');
    console.log(JSON.stringify(bisFunctionUpsert, null, 2));

    let _bisFunctionUpsert;
    let updatedBisFunction;

    await this.bisFunctionModel.update(
      {
        ...(bisFunctionUpsert.startPeriod && {
          startPeriod: bisFunctionUpsert.startPeriod,
        }),
        ...(bisFunctionUpsert.endPeriod && {
          endPeriod: bisFunctionUpsert.endPeriod,
        }),
      },
      {
        where: { name: bisFunctionUpsert.name },
        returning: true,
      },
    );

    switch (bisFunctionUpsert.type) {
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        _bisFunctionUpsert =
          bisFunctionUpsert as BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT;

        return await this.bisFunctionModel.update(
          {
            ...(_bisFunctionUpsert.amount && {
              meta: {
                amount: _bisFunctionUpsert.amount,
              },
            }),
            creditId: _bisFunctionUpsert.creditId,
          },
          {
            where: { name: bisFunctionUpsert.name },
            returning: true,
          },
        );
      case BisFunctionType.SELL_PRODUCT_FIXED:
        _bisFunctionUpsert =
          bisFunctionUpsert as BisFunctionEditDto_SELL_PRODUCT_FIXED;

        return await this.bisFunctionModel.update(
          {
            ...(_bisFunctionUpsert.amount && {
              meta: {
                amount: _bisFunctionUpsert.amount,
              },
            }),
            productId: _bisFunctionUpsert.productId,
          },
          {
            where: { name: bisFunctionUpsert.name },
            returning: true,
          },
        );
    }

    const bisFunctions = await this.findAll();
    return bisFunctions.find((x) => x.name);
  }

  public async exec(
    businessState: BusinessState,
    bisFunction: BisFunction,
    period: number,
    tx?: Transaction,
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
          await this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction, tx);
        return this.exec_PAYOUT_CREDIT_FIXED_AMOUNT(
          businessState,
          bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
          tx,
        );
      case BisFunctionType.SELL_PRODUCT_FIXED:
        const bisFunction_SELL_PRODUCT_FIXED =
          await this.postProcess_SELL_PRODUCT_FIXED(bisFunction, tx);
        return this.exec_SELL_PRODUCT_FIXED(
          businessState,
          bisFunction_SELL_PRODUCT_FIXED,
          tx,
        );
    }

    return businessState;
  }

  private async postProcess_SELL_PRODUCT_FIXED(
    bisFunction: BisFunction,
    tx?: Transaction,
  ): Promise<BisFunctionDto_SELL_PRODUCT_FIXED> {
    if (bisFunction.type !== BisFunctionType.SELL_PRODUCT_FIXED) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.productId)
      throw new Error('Invalid SELL_PRODUCT_FIXED record');

    const product = await this.productModel.findByPk(bisFunction.productId, {
      transaction: tx,
    });

    if (!product) throw new Error('Product not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
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
    bisFunction: BisFunctionDto_SELL_PRODUCT_FIXED,
    tx?: Transaction,
  ): Promise<BusinessState> {
    const { product, income } = await this.productService.sellProduct({
      product: bisFunction.product,
      sellAmount: bisFunction.amount,
      tx,
    });

    this.pushAndRecordPrompt(
      businessState,
      `State.balance (${
        businessState.balance
      }) + Sell Product income (${income}) = ${businessState.balance + income}`,
    );

    businessState.balance += income;

    return businessState;
  }

  private async postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(
    bisFunction: BisFunction,
    tx?: Transaction,
  ): Promise<BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT> {
    if (bisFunction.type !== BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.creditId)
      throw new Error('Invalid PAYOUT_CREDIT_FIXED_AMOUNT record');

    const credit = await this.creditModel.findByPk(bisFunction.creditId, {
      transaction: tx,
    });

    if (!credit) throw new Error('Credit not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
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
    tx?: Transaction,
  ): BusinessState {
    this.pushAndRecordPrompt(
      businessState,
      `State.balance (${businessState.balance}) - Credit Amount (${
        bisFunction.amount
      }) = ${businessState.balance - bisFunction.amount}`,
    );

    businessState.balance -= bisFunction.amount;

    return businessState;
  }

  private pushAndRecordPrompt(businessState: BusinessState, prompt: string) {
    businessState.prompts.push(prompt);
    console.log(prompt);
    return businessState;
  }
}
