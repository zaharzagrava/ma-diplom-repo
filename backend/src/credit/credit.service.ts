import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { BusinessState } from 'src/business/types';
import Credit, {
  CreditScope,
  CreditWithAllFilters,
} from 'src/models/credit.model';
import * as _ from 'lodash';
import { UtilsService } from 'src/utils/utils/utils.service';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { CreditUpsertDto } from 'src/entities/types';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(CreditService.name);

  constructor(
    private readonly u: UtilsService,
    private readonly dbU: DbUtilsService,

    @InjectModel(Credit)
    private readonly creditModel: typeof Credit,
  ) {}

  public findAll(
    params?: CreditWithAllFilters,
    tx?: Transaction,
  ): Promise<Credit[]> {
    return this.creditModel
      .scope({
        method: [CreditScope.WithAll, <CreditWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }

  public async upsert(entityUpsert: CreditUpsertDto) {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const credit = await this.creditModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });

      if (!credit) {
        await this.creditModel.create(entityUpsert, {
          transaction: tx,
        });
      } else {
        await this.creditModel.update(entityUpsert, {
          where: { name: entityUpsert.name },
          transaction: tx,
        });
      }

      return await this.creditModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });
    });
  }

  public async tick(
    businessState: BusinessState,
    credit: Credit,
    tx: Transaction,
  ): Promise<BusinessState> {
    // filter out inactive credits
    if (!credit.startPeriod) return businessState;

    const creditInterest = _.round((credit.rate * credit.sum) / 12, 2);
    const newBalance = _.round(businessState.balance - creditInterest, 2);

    this.u.pushAndRecordPrompt(
      businessState,
      `[${credit.name}] Balance was reduced by the interest: ${businessState.balance} - ${creditInterest} = ${newBalance}`,
    );
    this.u.pushAndRecordPrompt(
      businessState,
      `- Credit interest was calculated like: ${credit.rate} * ${credit.sum} / 12 = ${creditInterest}`,
    );

    businessState.balance = newBalance;

    return businessState;
  }

  public async takeCredit({
    businessState,
    credit,
    tx,
  }: {
    businessState: BusinessState;
    credit: Credit;
    tx: Transaction;
  }): Promise<Credit> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      if (credit.startPeriod) {
        throw new Error('Credit is already taken');
      }

      await this.creditModel.update(
        { startPeriod: businessState.period },
        {
          where: { id: credit.id },
          returning: true,
          transaction: tx,
        },
      );

      businessState.balance += credit.sum;

      return credit;
    }, tx);
  }

  public async payoutCredit({
    businessState,
    amount,
    credit,
    tx,
  }: {
    businessState: BusinessState;
    amount: number;
    credit: Credit;
    tx: Transaction;
  }): Promise<{
    credit: Credit;
    payoutAmount: number;
    oldCreditSum: number;
    newCreditSum: number;
  }> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      if (credit.sum === 0) {
        throw new Error('Credit is already paid out');
      }

      if (!credit.startPeriod) {
        throw new Error('Credit is not taken, no need to payout');
      }

      const oldCreditSum = credit.sum;
      const payoutAmount = Math.min(credit.sum, amount);
      businessState.balance = _.round(businessState.balance - payoutAmount, 2);
      credit.sum = _.round(credit.sum - payoutAmount, 2);

      await this.creditModel.update(
        { sum: credit.sum },
        {
          where: { id: credit.id },
          returning: true,
          transaction: tx,
        },
      );

      return {
        credit,
        oldCreditSum,
        newCreditSum: credit.sum,
        payoutAmount,
      };
    }, tx);
  }
}
