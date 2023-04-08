import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Department from 'src/models/department.model';
import User from 'src/models/user.model';
import * as _ from 'lodash';
import BisFunction, { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';

@Injectable()
export class AdminService {
  private readonly l = new Logger(AdminService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(BisFunction) private bisFunctionModel: typeof BisFunction,
    @InjectModel(Credit) private creditModel: typeof Credit,
    @InjectModel(Department) private departmentModel: typeof Department,
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
        meta: {
          amount: 1000,
        },
        creditId: credit.id,
      });
    } catch (error) {
      console.log('@error');
      console.log(error);
    }
  }
}
