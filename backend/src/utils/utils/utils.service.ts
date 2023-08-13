import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { BusinessState } from 'src/business/types';

@Injectable()
export class UtilsService {
  constructor(
    @InjectConnection() private readonly sequelizeInstance: Sequelize,
  ) {}

  public async wrapInTransaction(
    fun: (transaction: Transaction) => any,
    transaction?: Transaction,
  ) {
    if (transaction) {
      return await fun(transaction);
    }

    return await this.sequelizeInstance.transaction(async (transaction) => {
      return fun(transaction);
    });
  }

  public pushAndRecordPrompt(businessState: BusinessState, prompt: string) {
    businessState.prompts.push(prompt);
    return businessState;
  }
}
