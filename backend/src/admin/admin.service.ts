import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Department from 'src/models/department.model';
import User, { UserType } from 'src/models/user.model';
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
import ProductionChainUser from 'src/models/productionChainUser.model';

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
    @InjectModel(ProductionChainUser)
    private productionChainUserModel: typeof ProductionChainUser,
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

      await this.userModel.destroy({ where: {}, force: true });
      await this.creditModel.destroy({ where: {}, force: true });
      await this.equipmentModel.destroy({ where: {}, force: true });
      await this.bisFunctionModel.destroy({ where: {}, force: true });
      await this.businessModel.destroy({ where: {}, force: true });
      await this.resourceModel.destroy({ where: {}, force: true });
      await this.productModel.destroy({ where: {}, force: true });
      await this.productionChainModel.destroy({ where: {}, force: true });
      await this.productionChainEquipmentModel.destroy({
        where: {},
        force: true,
      });
      await this.productionChainResourceModel.destroy({
        where: {},
        force: true,
      });
      await this.productionChainUserModel.destroy({
        where: {},
        force: true,
      });

      // ---

      // --- Business

      await this.businessModel.create({
        name: 'My business',
        balance: 1000,
      });

      // --- User

      console.log('@main user');
      await this.userModel.create({
        email: 'zaharzagrava@gmail.com',
        fullName: 'Alpha Userus',
        type: UserType.CUTTER,
        salary: 0,
      });

      console.log('@user1');
      const user1 = await this.userModel.create({
        email: 'ivanpetrovych@gmail.com',
        fullName: 'Ivan Petrovych',
        type: UserType.SEAMSTRESS,
        salary: 1000,
        employedAt: 202201,
      });

      console.log('@user2');
      const user2 = await this.userModel.create({
        email: 'petroivanobych@gmail.com',
        fullName: 'Petro Ivanovych',
        type: UserType.CUTTER,
        salary: 1200,
        employedAt: 202201,
      });

      // --- Resource
      console.log('@resource1');
      const resource1 = await this.resourceModel.create({
        name: 'Нитки',
        amount: 10,
        price: 1,
      });

      console.log('@resource2');
      const resource2 = await this.resourceModel.create({
        name: 'Клей',
        amount: 3,
        price: 2,
      });

      console.log('@resource3');
      const resource3 = await this.resourceModel.create({
        name: 'Кришки',
        amount: 1,
        price: 10,
      });

      // --- Equipment

      console.log('@equipment1');
      const equipment1 = await this.equipmentModel.create({
        name: 'Швейні інструменти',
        amount: 0,
        price: 20,
      });

      const equipment2 = await this.equipmentModel.create({
        name: 'Робочий стіл',
        amount: 0,
        price: 200,
      });

      // --- Product

      console.log('@tableProduct');
      const tableProduct = await this.productModel.create({
        name: 'Мішок з кришкою',
        amount: 0,
        price: 200,
      });

      // --- ProductionChain

      const productionChain = await this.productionChainModel.create({
        name: 'Виробництво мішків',
        productId: tableProduct.id,
      });

      // --- ProductionChainResource

      await this.productionChainResourceModel.create({
        amount: 10,
        resourceId: resource1.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainResourceModel.create({
        amount: 3,
        resourceId: resource2.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainResourceModel.create({
        amount: 1,
        resourceId: resource3.id,
        productionChainId: productionChain.id,
      });

      // --- ProductionChainResource

      await this.productionChainEquipmentModel.create({
        amount: 2,
        equipmentId: equipment1.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainEquipmentModel.create({
        amount: 1,
        equipmentId: equipment2.id,
        productionChainId: productionChain.id,
      });

      // --- ProductionChainUser

      await this.productionChainUserModel.create({
        userId: user1.id,
        productionChainId: productionChain.id,
        type: UserType.SEAMSTRESS,
      });
      await this.productionChainUserModel.create({
        userId: user2.id,
        productionChainId: productionChain.id,
        type: UserType.CUTTER,
      });

      // --- Credit

      const credit = await this.creditModel.create({
        name: 'Кредит з НБУ',
        startPeriod: 202201,
        sum: 10000,
        rate: 0.05,
      });

      const credit2 = await this.creditModel.create({
        name: 'Кредит з Приват Банку',
        startPeriod: null,
        sum: 1000,
        rate: 0.05,
      });

      // --- BisFunction

      await this.bisFunctionModel.create({
        name: 'Payout NBU credit',
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
      console.log('Admin seeding error');
      console.log(error);
    }
  }
}
