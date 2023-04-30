import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Department from 'src/models/department.model';
import User from 'src/models/user.model';
import * as _ from 'lodash';
import BisFunction, { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';
import Business from 'src/models/business.model';
import Resource from 'src/models/resource.model';
import Product from 'src/models/product.model';
import ProductionChain from 'src/models/productionChain.model';
import ProductionChainEquipment from 'src/models/productionChainEquipment.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import Equipment from 'src/models/equipment.model';

@Injectable()
export class AdminService {
  private readonly l = new Logger(AdminService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(BisFunction) private bisFunctionModel: typeof BisFunction,
    @InjectModel(Credit) private creditModel: typeof Credit,
    @InjectModel(Department) private departmentModel: typeof Department,
    @InjectModel(Business) private businessModel: typeof Business,
    @InjectModel(Resource) private resourceModel: typeof Resource,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(Equipment) private equipmentModel: typeof Equipment,
    @InjectModel(ProductionChain)
    private productionChainModel: typeof ProductionChain,
    @InjectModel(ProductionChainEquipment)
    private productionChainEquipmentModel: typeof ProductionChainEquipment,
    @InjectModel(ProductionChainResource)
    private productionChainResourceModel: typeof ProductionChainResource,
  ) {
    this.seed();
  }

  public alpha() {
    this.l.log(`--- Alpha ---`);
  }

  /**
   * @description - this is an example implementation of an admin command that you can execute
   *
   * @param email
   * @param password
   */
  public async seed() {
    try {
      this.l.log(`--- Running seeds ---`);

      await this.userModel.destroy({ where: {} });
      await this.creditModel.destroy({ where: {} });
      await this.bisFunctionModel.destroy({ where: {} });
      await this.businessModel.destroy({ where: {} });
      await this.resourceModel.destroy({ where: {} });
      await this.productModel.destroy({ where: {} });
      await this.productionChainModel.destroy({ where: {} });
      await this.productionChainEquipmentModel.destroy({ where: {} });
      await this.productionChainResourceModel.destroy({ where: {} });

      // ---

      // ---
      const resource1 = await this.resourceModel.create({
        name: 'Деревяні дощечки',
        amount: 100,
        price: 10,
      });

      const resource2 = await this.resourceModel.create({
        name: 'Клей',
        amount: 10,
        price: 2,
      });

      const resource3 = await this.resourceModel.create({
        name: 'Шуруп',
        amount: 500,
        price: 0.5,
      });

      const tableProduct = await this.productModel.create({
        name: 'Стіл',
        amount: 120,
        price: 50,
      });

      const productionChain = await this.productionChainModel.create({
        name: 'Стіл',
        productId: tableProduct.id,
      });

      await this.productionChainResourceModel.create({
        amount: 3,
        resourceId: resource1.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainResourceModel.create({
        amount: 1,
        resourceId: resource2.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainResourceModel.create({
        amount: 10,
        resourceId: resource3.id,
        productionChainId: productionChain.id,
      });

      await this.businessModel.create({
        name: 'My business',
        balance: 10000,
      });

      await this.userModel.create({
        email: 'zaharzagrava@gmail.com',
        fullName: 'Alpha Userus',
      });

      const credit = await this.creditModel.create({
        name: 'Credit from Bank of America',
        startPeriod: 202201,
        sum: 10000,
        rate: 0.05,
      });

      await this.bisFunctionModel.create({
        name: 'Payout credit',
        type: BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202205,
        meta: {
          amount: 500,
        },
        order: 1,
        creditId: credit.id,
      });

      await this.bisFunctionModel.create({
        name: 'Sell products',
        type: BisFunctionType.SELL_PRODUCT_FIXED,
        startPeriod: 202203,
        endPeriod: 202203,
        meta: {
          amount: 100,
        },
        order: 2,
        productId: tableProduct.id,
      });
    } catch (error) {
      console.log('@error');
      console.log(error);
    }
  }
}
