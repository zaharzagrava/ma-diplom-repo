import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Department from 'src/models/department.model';
import User from 'src/models/user.model';
import * as _ from 'lodash';

@Injectable()
export class AdminService {
  private readonly l = new Logger(AdminService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Department) private departmentModel: typeof Department,
  ) {}

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
    this.l.log(`--- Running departments seeds ---`);

    try {
      await this.userModel.create({
        email: 'zaharzagrava@gmail.com',
        country: 'Alpha',
        city: 'Alpha',
        fullName: 'Alpha Userus',
      });
    } catch (error) {
      console.log('@error');
      console.log(error);
    }
  }
}
