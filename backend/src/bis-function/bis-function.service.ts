import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  BisFunctionDto_SELL_PRODUCT_FIXED,
  BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunctionUpsertDto_SELL_PRODUCT_FIXED,
  BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunctionChangeOrderDto,
} from './bis-function.types';
import Credit from 'src/models/credit.model';
import { BusinessState } from 'src/business/types';
import { ProductService } from 'src/product/product.service';
import { CreationAttributes, Transaction } from 'sequelize';
import { PeriodService } from 'src/period/period.service';
import { CreditService } from 'src/credit/credit.service';
import { ResourceService } from 'src/resource/resource.service';
import * as _ from 'lodash';

@Injectable()
export class BisFunctionService {
  private readonly logger = new Logger(BisFunctionService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,
    private readonly productService: ProductService,
    private readonly periodService: PeriodService,
    private readonly creditService: CreditService,
    private readonly resourceService: ResourceService,

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

  public async findAllEntities() {
    return await Promise.all([
      this.productService.findAll(),
      this.resourceService.findAll(),
      this.creditService.findAll(),
    ]);
  }

  public async findAll(params?: BisFunctionWithAll, postProcess = true) {
    const bisFunctions = (await this.bisFunctionModel.findAll()).sort(
      (a, b) => a.order - b.order,
    );

    const processedBisFunctions = bisFunctions.map(async (bisFunction) =>
      this.postProcessBisFunction(bisFunction),
    );

    return await Promise.all(processedBisFunctions);
  }

  private postProcessBisFunction(bisFunction: BisFunction, tx?: Transaction) {
    switch (bisFunction.type) {
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        return this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction, tx);
      case BisFunctionType.SELL_PRODUCT_FIXED:
        return this.postProcess_SELL_PRODUCT_FIXED(bisFunction, tx);
      default:
        return bisFunction;
    }
  }

  public async changeOrder({
    bisFunctionChangeOrder,
  }: {
    bisFunctionChangeOrder: BisFunctionChangeOrderDto;
  }) {
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      try {
        const bisFunction = await this.bisFunctionModel.findOne({
          where: { name: bisFunctionChangeOrder.name },
          transaction: tx,
        });

        if (!bisFunction) {
          throw new NotFoundException('Bis function is not found');
        }

        let movedBisFunction: { newOrder: number; id: string };
        if (bisFunctionChangeOrder.dir === 'up') {
          const upperBisFunction = await this.bisFunctionModel.findOne({
            where: { order: bisFunction.order - 1 },
            transaction: tx,
          });

          if (!upperBisFunction) return;

          const newUpperBisFunctionOrder = upperBisFunction.order + 1;
          const newBisFunctionOrder = bisFunction.order - 1;

          await upperBisFunction.update(
            { order: _.random(-100, -1, false) },
            { transaction: tx },
          );
          await bisFunction.update(
            { order: newBisFunctionOrder },
            { transaction: tx },
          );
          await upperBisFunction.update(
            { order: newUpperBisFunctionOrder },
            { transaction: tx },
          );

          movedBisFunction = {
            newOrder: upperBisFunction.order,
            id: upperBisFunction.id,
          };
        } else {
          const lowerBisFunction = await this.bisFunctionModel.findOne({
            where: { order: bisFunction.order + 1 },
            transaction: tx,
          });

          if (!lowerBisFunction) return;

          const newLowerBisFunctionOrder = lowerBisFunction.order - 1;
          const newBisFunctionOrder = bisFunction.order + 1;

          await lowerBisFunction.update(
            { order: _.random(-100, -1, false) },
            { transaction: tx },
          );
          await bisFunction.update(
            { order: newBisFunctionOrder },
            { transaction: tx },
          );
          await lowerBisFunction.update(
            { order: newLowerBisFunctionOrder },
            { transaction: tx },
          );

          movedBisFunction = {
            newOrder: lowerBisFunction.order,
            id: lowerBisFunction.id,
          };
        }

        const alpha = {
          updated: await this.postProcessBisFunction(
            (await this.bisFunctionModel.findOne({
              where: { name: bisFunctionChangeOrder.name },
              transaction: tx,
            })) as BisFunction,
          ),
          moved: movedBisFunction,
        };

        console.log('@udpated');
        console.log(123);

        return alpha;
      } catch (error) {
        console.log('Bis function upsert error');
        console.log(error);
        console.log(JSON.stringify(error, null, 2));
      }
    });
  }

  public async upsert({
    bisFunctionUpsert,
  }: {
    bisFunctionUpsert: BisFunctionUpsertDto;
  }) {
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      try {
        const bisFunction = await this.bisFunctionModel.findOne({
          where: { name: bisFunctionUpsert.name },
          transaction: tx,
        });

        const bisFunctionCount = await this.bisFunctionModel.count({
          transaction: tx,
        });

        const upsertBody: CreationAttributes<BisFunction> = {
          startPeriod:
            bisFunctionUpsert.startPeriod ?? bisFunction?.startPeriod,
          ...(bisFunctionUpsert.endPeriod && {
            endPeriod: bisFunctionUpsert.endPeriod,
          }),
          name: bisFunction?.name ?? bisFunctionUpsert.name,
          order: bisFunction?.order ?? bisFunctionCount + 1,
          type: bisFunction?.type ?? bisFunctionUpsert.type,
        };

        switch (bisFunctionUpsert.type) {
          case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
            this.prepareUpsert_PAYOUT_CREDIT_FIXED_AMOUNT(
              bisFunctionUpsert as BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT,
              upsertBody,
            );
            break;
          case BisFunctionType.SELL_PRODUCT_FIXED:
            this.prepareUpsert_SELL_PRODUCT_FIXED(
              bisFunctionUpsert as BisFunctionUpsertDto_SELL_PRODUCT_FIXED,
              upsertBody,
            );
            break;
        }

        if (!bisFunction) {
          await this.bisFunctionModel.create(upsertBody, {
            transaction: tx,
          });
        } else {
          await this.bisFunctionModel.update(upsertBody, {
            where: { name: bisFunction.name },
            transaction: tx,
          });
        }

        return await this.postProcessBisFunction(
          (await this.bisFunctionModel.findOne({
            where: { name: bisFunctionUpsert.name },
            transaction: tx,
          })) as BisFunction,
        );
      } catch (error) {
        console.log('Bis function upsert error');
        console.log(error);
        console.log(JSON.stringify(error, null, 2));
      }
    });
  }

  private prepareUpsert_PAYOUT_CREDIT_FIXED_AMOUNT(
    _bisFunctionUpsert: BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.meta = {
      ...(_bisFunctionUpsert.amount && {
        amount: _bisFunctionUpsert.amount,
      }),
    };

    upsertBody.creditId = _bisFunctionUpsert.creditId;

    return _bisFunctionUpsert;
  }

  private prepareUpsert_SELL_PRODUCT_FIXED(
    _bisFunctionUpsert: BisFunctionUpsertDto_SELL_PRODUCT_FIXED,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.meta = {
      ...(_bisFunctionUpsert.amount && {
        amount: _bisFunctionUpsert.amount,
      }),
      ...(_bisFunctionUpsert.productId && {
        productId: _bisFunctionUpsert.productId,
      }),
    };

    return _bisFunctionUpsert;
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
  ): Promise<BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT> {
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
    bisFunction: BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT,
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
