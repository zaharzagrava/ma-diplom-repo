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
  BisFunctionDto_TAKE_CREDIT,
  BisFunctionDto_HIRE_EMPLOYEE,
  BisFunctionDto_FIRE_EMPLOYEE,
  BisFunctionDto_PAYOUT_SALARIES,
  BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionDto_PRODUCE_PRODUCTS,
  BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionUpsertDto_TAKE_CREDIT,
  BisFunctionUpsertDto_HIRE_EMPLOYEE,
  BisFunctionUpsertDto_FIRE_EMPLOYEE,
  BisFunctionUpsertDto_PAYOUT_SALARIES,
  BisFunctionUpsertDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionUpsertDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionUpsertDto_PRODUCE_PRODUCTS,
  BisFunctionDeleteDto,
} from './bis-function.types';
import Credit from 'src/models/credit.model';
import { BusinessState } from 'src/business/types';
import { ProductService } from 'src/product/product.service';
import { CreationAttributes, Transaction } from 'sequelize';
import { PeriodService } from 'src/period/period.service';
import { CreditService } from 'src/credit/credit.service';
import { ResourceService } from 'src/resource/resource.service';
import * as _ from 'lodash';
import { UtilsService } from 'src/utils/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { ProductionChainService } from 'src/production-chain/production-chain.service';
import { EquipmentService } from 'src/equipment/equipment.service';
import { UsersDbService } from 'src/users-db/users-db.service';

@Injectable()
export class BisFunctionService {
  private readonly logger = new Logger(BisFunctionService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,
    private readonly productService: ProductService,
    private readonly creditService: CreditService,
    private readonly resourceService: ResourceService,
    private readonly usersDbService: UsersDbService,
    private readonly usersService: UsersService,
    private readonly equipmentService: EquipmentService,
    private readonly productionChainService: ProductionChainService,
    private readonly u: UtilsService,

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
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      const bisFunctions = (await this.bisFunctionModel.findAll()).sort(
        (a, b) => a.order - b.order,
      );

      const processedBisFunctions = bisFunctions.map(async (bisFunction) =>
        this.postProcessBisFunction(bisFunction, tx),
      );

      return await Promise.all(processedBisFunctions);
    });
  }

  private async postProcess_TAKE_CREDIT(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_TAKE_CREDIT> {
    if (bisFunction.type !== BisFunctionType.TAKE_CREDIT) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.creditId) throw new Error('Invalid TAKE_CREDIT record');

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
    };
  }

  private async postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(
    bisFunction: BisFunction,
    tx: Transaction,
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
      amount: (bisFunction.meta as any).amount,
    };
  }

  private async postProcess_HIRE_EMPLOYEE(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_HIRE_EMPLOYEE> {
    if (bisFunction.type !== BisFunctionType.HIRE_EMPLOYEE) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.userId)
      throw new Error('Invalid HIRE_EMPLOYEE record, no userId field');

    if (!bisFunction.productionChainId)
      throw new Error(
        'Invalid HIRE_EMPLOYEE record, not productionChainId field',
      );

    const user = await this.usersDbService.findOne(
      { id: bisFunction.userId },
      tx,
    );

    if (!user) throw new Error('user not found');

    const productionChain = await this.productionChainService.findOne(
      { id: bisFunction.productionChainId },
      tx,
    );

    if (!productionChain) throw new Error('productionChain not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      user,
      productionChain,
    };
  }

  private async postProcess_FIRE_EMPLOYEE(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_FIRE_EMPLOYEE> {
    if (bisFunction.type !== BisFunctionType.FIRE_EMPLOYEE) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.userId) throw new Error('Invalid FIRE_EMPLOYEE record');

    const user = await this.usersDbService.findOne(
      { id: bisFunction.userId },
      tx,
    );

    if (!user) throw new Error('user not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      user,
    };
  }

  private async postProcess_PAYOUT_SALARIES(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_PAYOUT_SALARIES> {
    if (bisFunction.type !== BisFunctionType.PAYOUT_SALARIES) {
      throw new Error('Not a valid type');
    }

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
    };
  }

  private async postProcess_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT> {
    if (
      bisFunction.type !== BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT
    ) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.productionChainId)
      throw new Error('Invalid BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT record');

    const productionChain = await this.productionChainService.findOne(
      { id: bisFunction.productionChainId },
      tx,
    );

    if (!productionChain) throw new Error('productionChain not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      productionChain,
      amount: (bisFunction.meta as any).amount,
    };
  }

  private async postProcess_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT> {
    if (
      bisFunction.type !==
      BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT
    ) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.productionChainId)
      throw new Error('Invalid BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT record');

    const productionChain = await this.productionChainService.findOne(
      { id: bisFunction.productionChainId },
      tx,
    );

    if (!productionChain) throw new Error('productionChain not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      productionChain,
      amount: (bisFunction.meta as any).amount,
    };
  }

  private async postProcess_PRODUCE_PRODUCTS(
    bisFunction: BisFunction,
    tx: Transaction,
  ): Promise<BisFunctionDto_PRODUCE_PRODUCTS> {
    if (bisFunction.type !== BisFunctionType.PRODUCE_PRODUCTS) {
      throw new Error('Not a valid type');
    }

    if (!bisFunction.productionChainId)
      throw new Error('Invalid PRODUCE_PRODUCTS record');

    const productionChain = await this.productionChainService.findOne(
      { id: bisFunction.productionChainId },
      tx,
    );

    if (!productionChain) throw new Error('productionChain not found');

    return {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      order: bisFunction.order,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
      productionChain,
    };
  }

  private async postProcess_SELL_PRODUCT_FIXED(
    bisFunction: BisFunction,
    tx: Transaction,
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
      amount: (bisFunction.meta as any).amount,
    };
  }

  private postProcessBisFunction(bisFunction: BisFunction, tx: Transaction) {
    switch (bisFunction.type) {
      case BisFunctionType.TAKE_CREDIT:
        return this.postProcess_TAKE_CREDIT(bisFunction, tx);
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        return this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction, tx);
      case BisFunctionType.HIRE_EMPLOYEE:
        return this.postProcess_HIRE_EMPLOYEE(bisFunction, tx);
      case BisFunctionType.FIRE_EMPLOYEE:
        return this.postProcess_FIRE_EMPLOYEE(bisFunction, tx);
      case BisFunctionType.PAYOUT_SALARIES:
        return this.postProcess_PAYOUT_SALARIES(bisFunction, tx);
      case BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT:
        return this.postProcess_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
          bisFunction,
          tx,
        );
      case BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT:
        return this.postProcess_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
          bisFunction,
          tx,
        );
      case BisFunctionType.PRODUCE_PRODUCTS:
        return this.postProcess_PRODUCE_PRODUCTS(bisFunction, tx);
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
            tx,
          ),
          moved: movedBisFunction,
        };

        return alpha;
      } catch (error) {
        console.log('Bis function upsert error');
        console.log(error);
        console.log(JSON.stringify(error, null, 2));
      }
    });
  }

  public async delete({ name }: BisFunctionDeleteDto) {
    await this.bisFunctionModel.destroy({ where: { name } });

    return name;
  }

  public async upsert({
    bisFunctionUpsert,
  }: {
    bisFunctionUpsert: BisFunctionUpsertDto;
  }) {
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      const bisFunction = await this.bisFunctionModel.findOne({
        where: { name: bisFunctionUpsert.name },
        transaction: tx,
      });

      const bisFunctionCount = await this.bisFunctionModel.count({
        transaction: tx,
      });

      const upsertBody: CreationAttributes<BisFunction> = {
        startPeriod: bisFunctionUpsert.startPeriod ?? bisFunction?.startPeriod,
        ...(bisFunctionUpsert.endPeriod && {
          endPeriod: bisFunctionUpsert.endPeriod,
        }),
        name: bisFunction?.name ?? bisFunctionUpsert.name,
        order: bisFunction?.order ?? bisFunctionCount + 1,
        type: bisFunction?.type ?? bisFunctionUpsert.type,
      };

      switch (bisFunctionUpsert.type) {
        case BisFunctionType.TAKE_CREDIT:
          this.prepareUpsert_TAKE_CREDIT(
            bisFunctionUpsert as BisFunctionUpsertDto_TAKE_CREDIT,
            upsertBody,
          );
          break;
        case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
          this.prepareUpsert_PAYOUT_CREDIT_FIXED_AMOUNT(
            bisFunctionUpsert as BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT,
            upsertBody,
          );
          break;

        case BisFunctionType.HIRE_EMPLOYEE:
          this.prepareUpsert_HIRE_EMPLOYEE(
            bisFunctionUpsert as BisFunctionUpsertDto_HIRE_EMPLOYEE,
            upsertBody,
          );
          break;
        case BisFunctionType.FIRE_EMPLOYEE:
          this.prepareUpsert_FIRE_EMPLOYEE(
            bisFunctionUpsert as BisFunctionUpsertDto_FIRE_EMPLOYEE,
            upsertBody,
          );
          break;
        case BisFunctionType.PAYOUT_SALARIES:
          this.prepareUpsert_PAYOUT_SALARIES(
            bisFunctionUpsert as BisFunctionUpsertDto_PAYOUT_SALARIES,
            upsertBody,
          );
          break;

        case BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT:
          this.prepareUpsert_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
            bisFunctionUpsert as BisFunctionUpsertDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
            upsertBody,
          );
          break;
        case BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT:
          this.prepareUpsert_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
            bisFunctionUpsert as BisFunctionUpsertDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
            upsertBody,
          );
          break;
        case BisFunctionType.PRODUCE_PRODUCTS:
          this.prepareUpsert_PRODUCE_PRODUCTS(
            bisFunctionUpsert as BisFunctionUpsertDto_PRODUCE_PRODUCTS,
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
        tx,
      );
    });
  }

  private prepareUpsert_TAKE_CREDIT(
    _bisFunctionUpsert: BisFunctionUpsertDto_TAKE_CREDIT,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.creditId = _bisFunctionUpsert.creditId;

    return _bisFunctionUpsert;
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

  private prepareUpsert_HIRE_EMPLOYEE(
    _bisFunctionUpsert: BisFunctionUpsertDto_HIRE_EMPLOYEE,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.userId = _bisFunctionUpsert.userId;
    upsertBody.productionChainId = _bisFunctionUpsert.productionChainId;

    return _bisFunctionUpsert;
  }

  private prepareUpsert_FIRE_EMPLOYEE(
    _bisFunctionUpsert: BisFunctionUpsertDto_FIRE_EMPLOYEE,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.userId = _bisFunctionUpsert.userId;

    return _bisFunctionUpsert;
  }

  private prepareUpsert_PAYOUT_SALARIES(
    _bisFunctionUpsert: BisFunctionUpsertDto_PAYOUT_SALARIES,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    return _bisFunctionUpsert;
  }

  private prepareUpsert_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
    _bisFunctionUpsert: BisFunctionUpsertDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.meta = {
      ...(_bisFunctionUpsert.amount && {
        amount: _bisFunctionUpsert.amount,
      }),
    };

    upsertBody.productionChainId = _bisFunctionUpsert.productionChainId;

    return _bisFunctionUpsert;
  }

  private prepareUpsert_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
    _bisFunctionUpsert: BisFunctionUpsertDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.meta = {
      ...(_bisFunctionUpsert.amount && {
        amount: _bisFunctionUpsert.amount,
      }),
    };

    upsertBody.productionChainId = _bisFunctionUpsert.productionChainId;

    return _bisFunctionUpsert;
  }

  private prepareUpsert_PRODUCE_PRODUCTS(
    _bisFunctionUpsert: BisFunctionUpsertDto_PRODUCE_PRODUCTS,
    upsertBody: CreationAttributes<BisFunction>,
  ) {
    upsertBody.productionChainId = _bisFunctionUpsert.productionChainId;

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
    tx: Transaction,
  ) {
    switch (bisFunction.type) {
      case BisFunctionType.TAKE_CREDIT:
        const bisFunction_TAKE_CREDIT = await this.postProcess_TAKE_CREDIT(
          bisFunction,
          tx,
        );

        return this.exec_TAKE_CREDIT(
          businessState,
          bisFunction_TAKE_CREDIT,
          tx,
        );
      case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
        const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT =
          await this.postProcess_PAYOUT_CREDIT_FIXED_AMOUNT(bisFunction, tx);
        return this.exec_PAYOUT_CREDIT_FIXED_AMOUNT(
          businessState,
          bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT,
          tx,
        );

      case BisFunctionType.HIRE_EMPLOYEE:
        const bisFunction_HIRE_EMPLOYEE = await this.postProcess_HIRE_EMPLOYEE(
          bisFunction,
          tx,
        );

        return this.exec_HIRE_EMPLOYEE(
          businessState,
          bisFunction_HIRE_EMPLOYEE,
          tx,
        );
      case BisFunctionType.FIRE_EMPLOYEE:
        const bisFunction_FIRE_EMPLOYEE = await this.postProcess_FIRE_EMPLOYEE(
          bisFunction,
          tx,
        );

        return this.exec_FIRE_EMPLOYEE(
          businessState,
          bisFunction_FIRE_EMPLOYEE,
          tx,
        );
      case BisFunctionType.PAYOUT_SALARIES:
        const bisFunction_PAYOUT_SALARIES =
          await this.postProcess_PAYOUT_SALARIES(bisFunction, tx);

        return this.exec_PAYOUT_SALARIES(
          businessState,
          bisFunction_PAYOUT_SALARIES,
          tx,
        );

      case BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT:
        const bisFunction_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT =
          await this.postProcess_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
            bisFunction,
            tx,
          );

        return this.exec_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
          businessState,
          bisFunction_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
          tx,
        );
      case BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT:
        const bisFunction_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT =
          await this.postProcess_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
            bisFunction,
            tx,
          );

        return this.exec_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
          businessState,
          bisFunction_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
          tx,
        );

      case BisFunctionType.PRODUCE_PRODUCTS:
        const bisFunction_PRODUCE_PRODUCTS =
          await this.postProcess_PRODUCE_PRODUCTS(bisFunction, tx);

        return this.exec_PRODUCE_PRODUCTS(
          businessState,
          bisFunction_PRODUCE_PRODUCTS,
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

  /**
   * @description
   *    - activates credit, increases balance - and next 'tick' methods start accumulating interest from next period
   *
   */
  private async exec_TAKE_CREDIT(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_TAKE_CREDIT,
    tx: Transaction,
  ): Promise<BusinessState> {
    const beforeBalance = businessState.balance;

    try {
      await this.creditService.takeCredit({
        businessState,
        credit: bisFunction.credit,
        tx,
      });

      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}] Credit was taken, the balance is increased: ${beforeBalance} + ${bisFunction.credit.sum} = ${businessState.balance}`,
      );
    } catch (error) {
      if (error.message === 'Credit is already taken') {
        this.u.pushAndRecordPrompt(
          businessState,
          `[${bisFunction.name}] Credit is already taken, balance isn't changed`,
        );

        return businessState;
      }

      throw error;
    }

    return businessState;
  }

  private async exec_PAYOUT_CREDIT_FIXED_AMOUNT(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT,
    tx: Transaction,
  ): Promise<BusinessState> {
    try {
      const resp = await this.creditService.payoutCredit({
        businessState,
        amount: bisFunction.amount,
        credit: bisFunction.credit,
        tx,
      });

      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}] Credit is paid out: ${resp.oldCreditSum} - ${resp.payoutAmount} = ${resp.newCreditSum}. New balance: ${businessState.balance}`,
      );
    } catch (error) {
      if (error.message === 'Credit is already paid out') {
        this.u.pushAndRecordPrompt(
          businessState,
          `[${bisFunction.name}] Credit is already paid out, no actions done`,
        );

        return businessState;
      } else if (error.message === 'Credit is not taken, no need to payout') {
        this.u.pushAndRecordPrompt(
          businessState,
          `[${bisFunction.name}] Credit is not taken, no need to payout, no actions done`,
        );

        return businessState;
      }

      throw error;
    }

    return businessState;
  }

  private async exec_HIRE_EMPLOYEE(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_HIRE_EMPLOYEE,
    tx: Transaction,
  ): Promise<BusinessState> {
    try {
      const { otherLogs } = await this.usersService.hireEmployee({
        businessState,
        user: bisFunction.user,
        productionChain: bisFunction.productionChain,
        tx,
      });

      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}] ${bisFunction.user.fullName} was hired on ${bisFunction.productionChain.name}`,
      );

      otherLogs.forEach((x) =>
        this.u.pushAndRecordPrompt(businessState, `- ${x}`),
      );
    } catch (error) {
      if (
        [
          'User is already employed',
          'Credit is already paid out',
          'Credit is not taken, no need to payout',
        ].includes(error.message)
      ) {
        this.u.pushAndRecordPrompt(
          businessState,
          `[${bisFunction.name}] ${error.message}`,
        );

        return businessState;
      }

      throw error;
    }

    return businessState;
  }

  private async exec_FIRE_EMPLOYEE(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_FIRE_EMPLOYEE,
    tx: Transaction,
  ): Promise<BusinessState> {
    try {
      await this.usersService.fireEmployee({
        businessState,
        user: bisFunction.user,
        tx,
      });

      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}] ${bisFunction.user.fullName} was fired, and unassigned from all production chains`,
      );
    } catch (error) {
      if (error.message === 'User is already fired') {
        this.u.pushAndRecordPrompt(businessState, error.message);
        return businessState;
      }

      throw error;
    }

    return businessState;
  }

  private async exec_PAYOUT_SALARIES(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_PAYOUT_SALARIES,
    tx: Transaction,
  ): Promise<BusinessState> {
    const prevBalance = businessState.balance;

    const paidUsers = await this.usersService.payoutSalaries({
      businessState,
      tx,
    });

    this.u.pushAndRecordPrompt(
      businessState,
      `[${
        bisFunction.name
      }] Salaries are paid out to all active users: ${prevBalance} - ${
        prevBalance - businessState.balance
      } = ${businessState.balance}`,
    );

    paidUsers.forEach((x) => {
      this.u.pushAndRecordPrompt(
        businessState,
        `- ${x.fullName} was paid ${x.amount}`,
      );
    });

    return businessState;
  }

  private async exec_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
    tx: Transaction,
  ): Promise<BusinessState> {
    const prevBalance = businessState.balance;

    const boughtResources =
      await this.resourceService.buyResourcesForProductionChain({
        businessState,
        amount: bisFunction.amount,
        productionChain: bisFunction.productionChain,
        tx,
      });

    this.u.pushAndRecordPrompt(
      businessState,
      `[${bisFunction.name}] Resources were bought: ${prevBalance} - ${
        prevBalance - businessState.balance
      } = ${businessState.balance}`,
    );

    boughtResources.forEach((x) => {
      this.u.pushAndRecordPrompt(
        businessState,
        `- ${x.buyAmount} of '${x.name}' was bought at ${x.price}$`,
      );
    });

    return businessState;
  }

  private async exec_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
    tx: Transaction,
  ): Promise<BusinessState> {
    const prevBalance = businessState.balance;

    const boughtEquipment =
      await this.equipmentService.buyEquipmentForProductionChain({
        businessState,
        amount: bisFunction.amount,
        productionChain: bisFunction.productionChain,
        tx,
      });

    this.u.pushAndRecordPrompt(
      businessState,
      `[${bisFunction.name}] Equipment were bought: ${prevBalance} - ${
        prevBalance - businessState.balance
      } = ${businessState.balance}`,
    );

    boughtEquipment.forEach((x) => {
      this.u.pushAndRecordPrompt(
        businessState,
        `- ${x.buyAmount} of '${x.name}' was bought at ${x.price}`,
      );
    });

    return businessState;
  }

  private async exec_PRODUCE_PRODUCTS(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_PRODUCE_PRODUCTS,
    tx: Transaction,
  ): Promise<BusinessState> {
    const prevBalance = businessState.balance;

    try {
      const {
        otherLogs,
        usersTypesCount,
        minProductsFromUsers,
        minProductsFromResources,
        minProductsFromEquipment,
        minProducable,
        spentResources,
      } = await this.productionChainService.produce({
        businessState,
        productionChain: bisFunction.productionChain,
        tx,
      });

      const produceReasons = () => {
        let reason = '';
        if (minProductsFromUsers !== null)
          reason += `users - for ${minProductsFromUsers}. `;

        if (minProductsFromResources !== null)
          reason += `resources - for ${minProductsFromResources}. `;

        if (minProductsFromEquipment !== null)
          reason += `equipment - for ${minProductsFromEquipment}. `;

        return reason;
      };

      this.u.pushAndRecordPrompt(
        businessState,
        `[${
          bisFunction.name
        }] Will produce: ${minProducable}, since components are enough for: ${produceReasons()}`,
      );

      spentResources.forEach((x) => {
        this.u.pushAndRecordPrompt(
          businessState,
          `- ${x.newAmount} of '${x.name}' is left`,
        );
      });

      otherLogs.forEach((x) => this.u.pushAndRecordPrompt(businessState, x));

      return businessState;
    } catch (error) {
      if (
        [
          'No users assigned to this production chain',
          'No resources assigned to this production chain',
          'Not enough users for at least 1 product',
          'Not enough resources for at least 1 product',
        ].includes(error.message)
      ) {
        this.u.pushAndRecordPrompt(
          businessState,
          `[${bisFunction.name}] ${error.message}`,
        );
        return businessState;
      }

      throw error;
    }
  }

  /**
   * @description
   *    - buys enough products to produce a given amount of Products in a give ProductionChain
   *
   */
  private async exec_SELL_PRODUCT_FIXED(
    businessState: BusinessState,
    bisFunction: BisFunctionDto_SELL_PRODUCT_FIXED,
    tx: Transaction,
  ): Promise<BusinessState> {
    const { product, income, sold } = await this.productService.sellProduct({
      businessState,
      product: bisFunction.product,
      sellAmount: bisFunction.amount,
      tx,
    });

    const newBalance = _.round(businessState.balance + income, 2);

    if (income === 0) {
      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}]: No '${product.name}' products to sell`,
      );
    } else {
      this.u.pushAndRecordPrompt(
        businessState,
        `[${bisFunction.name}] Balance was increased by ${sold} sold products: ${businessState.balance} + ${income} = ${newBalance}`,
      );
    }

    businessState.balance = newBalance;

    return businessState;
  }
}
