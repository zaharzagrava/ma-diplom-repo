import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import BisFunction, { BisFunctionType } from 'src/models/bis-function.model';
import Product from 'src/models/product.model';
import Resource from 'src/models/resource.model';
import Equipment from 'src/models/equipment.model';

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
    @InjectModel(Equipment)
    private readonly equipmentModel: typeof Equipment,
    @InjectConnection() private readonly sequelizeInstance: Sequelize,
  ) {}

  public findAll() {
    return this.bisFunctionModel.findAll();
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
