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
import { SyncDto } from './types';

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
    this.quizzSeed1();
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
  public async seed(params: SyncDto) {
    try {
      this.l.log(`--- Running seeds ---`);

      switch (params.mode) {
        case 'default':
          return await this.defaultSeed();

        default:
          break;
      }
    } catch (error) {
      console.log('Admin seeding error');
      console.log(error);
    }
  }

  private async quizzSeed1() {
    // Evaluate when you can start expanding your production chain
    // Evaluate when you can start start second production chain

    try {
      await this.cleanup();

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
        type: UserType.SEAMSTRESS,
        salary: 0,
      });

      console.log('@user1');
      const user1 = await this.userModel.create({
        email: 'ivanpetrovych@gmail.com',
        fullName: 'Ivan Petrovych',
        type: UserType.SEAMSTRESS,
        salary: 400,
        employedAt: null,
      });

      console.log('@user2');
      const user2 = await this.userModel.create({
        email: 'petroivanobych@gmail.com',
        fullName: 'Petro Ivanovych',
        type: UserType.SEAMSTRESS,
        salary: 400,
        employedAt: null,
      });

      // --- Resource
      console.log('@equipment1');
      const equipment1 = await this.equipmentModel.create({
        name: 'Робочий стіл',
        amount: 0,
        price: 1000,
      });
      const resource = await this.resourceModel.create({
        name: 'Тканина',
        amount: 0,
        price: 10,
      });

      // --- Product

      console.log('@tableProduct');
      const tableProduct = await this.productModel.create({
        name: 'Послуги з пошиття одягу',
        amount: 0,
        price: 500,
      });

      // --- ProductionChain

      const productionChain = await this.productionChainModel.create({
        name: 'Пошиття одягу',
        productId: tableProduct.id,
      });

      await this.productionChainEquipmentModel.create({
        amount: 1,
        equipmentId: equipment1.id,
        productionChainId: productionChain.id,
      });
      await this.productionChainResourceModel.create({
        amount: 5,
        resourceId: resource.id,
        productionChainId: productionChain.id,
      });

      //
      // --- ProductionChainUser

      await this.productionChainUserModel.create({
        userId: null,
        productionChainId: productionChain.id,
        type: UserType.SEAMSTRESS,
      });
      await this.productionChainUserModel.create({
        userId: null,
        productionChainId: productionChain.id,
        type: UserType.SEAMSTRESS,
      });

      // --- Credit

      const credit = await this.creditModel.create({
        name: 'NBU Credit',
        startPeriod: null,
        sum: 3000,
        rate: 0.8,
      });

      const credit2 = await this.creditModel.create({
        name: 'Privatbank credit',
        startPeriod: null,
        sum: 2500,
        rate: 0.2,
      });

      // --- BisFunction

      await this.bisFunctionModel.create({
        name: 'Hire SEAMSTRESS 1',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 1,
        userId: user1.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Hire SEAMSTRESS 2',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 2,
        userId: user2.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Buy Equipment',
        type: BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202201,
        meta: {
          amount: 2,
        },
        order: 3,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Buy resources',
        type: BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202312,
        meta: {
          amount: 2,
        },
        order: 4,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Шити Одяг',
        type: BisFunctionType.PRODUCE_PRODUCTS,
        startPeriod: 202201,
        endPeriod: 202312,
        meta: {
          amount: 1,
        },
        order: 5,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Sell products',
        type: BisFunctionType.SELL_PRODUCT_FIXED,
        startPeriod: 202201,
        endPeriod: 202312,
        meta: {
          amount: 10,
        },
        order: 6,
        productId: tableProduct.id,
      });

      await this.bisFunctionModel.create({
        name: 'Payout Salaries',
        type: BisFunctionType.PAYOUT_SALARIES,
        startPeriod: 202201,
        endPeriod: 202312,
        order: 7,
      });
    } catch (error) {
      console.log('@error');
      console.log(error);
      console.log(JSON.stringify(error, null, 2));
    }
  }

  private async defaultSeed() {
    try {
      await this.cleanup();

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
        salary: 400,
        employedAt: null,
      });

      console.log('@user2');
      const user2 = await this.userModel.create({
        email: 'petroivanobych@gmail.com',
        fullName: 'Petro Ivanovych',
        type: UserType.CUTTER,
        salary: 300,
        employedAt: null,
      });

      console.log('@user3');
      const user3 = await this.userModel.create({
        email: 'annakarenina@gmail.com',
        fullName: 'Anna Karenina',
        type: UserType.SEAMSTRESS,
        salary: 400,
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
        price: 1000,
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
        userId: null,
        productionChainId: productionChain.id,
        type: UserType.SEAMSTRESS,
      });
      await this.productionChainUserModel.create({
        userId: null,
        productionChainId: productionChain.id,
        type: UserType.CUTTER,
      });

      // --- Credit

      const credit = await this.creditModel.create({
        name: 'NBU Credit',
        startPeriod: 202201,
        sum: 3000,
        rate: 0.02,
      });

      const credit2 = await this.creditModel.create({
        name: 'Privatbank credit',
        startPeriod: null,
        sum: 5000,
        rate: 0.05,
      });

      // --- BisFunction

      await this.bisFunctionModel.create({
        name: 'Hire SEAMSTRESS',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 1,
        userId: user1.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Hire CUTTER',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 2,
        userId: user2.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Hire SEAMSTRESS 2',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 3,
        userId: user1.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Hire CUTTER 2',
        type: BisFunctionType.HIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 4,
        userId: user2.id,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Fire Anna',
        type: BisFunctionType.FIRE_EMPLOYEE,
        startPeriod: 202201,
        endPeriod: 202201,
        order: 5,
        userId: user3.id,
      });

      await this.bisFunctionModel.create({
        name: 'Buy resources',
        type: BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202212,
        meta: {
          amount: 1,
        },
        order: 6,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Buy Equipment',
        type: BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202201,
        meta: {
          amount: 1,
        },
        order: 7,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Produce tables',
        type: BisFunctionType.PRODUCE_PRODUCTS,
        startPeriod: 202201,
        endPeriod: 202212,
        meta: {
          amount: 1,
        },
        order: 8,
        productionChainId: productionChain.id,
      });

      await this.bisFunctionModel.create({
        name: 'Sell products',
        type: BisFunctionType.SELL_PRODUCT_FIXED,
        startPeriod: 202201,
        endPeriod: 202212,
        meta: {
          amount: 40,
        },
        order: 9,
        productId: tableProduct.id,
      });

      await this.bisFunctionModel.create({
        name: 'Payout NBU credit',
        type: BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT,
        startPeriod: 202201,
        endPeriod: 202205,
        meta: {
          amount: 200,
        },
        order: 10,
        creditId: credit.id,
      });

      await this.bisFunctionModel.create({
        name: 'Take PrivatBank Credit',
        type: BisFunctionType.TAKE_CREDIT,
        startPeriod: 202205,
        endPeriod: 202205,
        order: 11,
        creditId: credit2.id,
      });

      await this.bisFunctionModel.create({
        name: 'Payout Salaries',
        type: BisFunctionType.PAYOUT_SALARIES,
        startPeriod: 202201,
        endPeriod: 202212,
        order: 12,
      });
    } catch (error) {
      console.log('@error');
      console.log(error);
      console.log(JSON.stringify(error, null, 2));
    }
  }

  private async cleanup() {
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
  }
}
