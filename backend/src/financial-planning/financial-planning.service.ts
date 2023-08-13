import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from 'src/models/user.model';
import { Transaction } from 'sequelize';
import { PeriodService } from 'src/period/period.service';
import { BisFunctionService } from 'src/bis-function/bis-function.service';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import BisFunction, { BisFunctionType } from 'src/models/bis-function.model';
import { BusinessState } from 'src/business/types';
import Business from 'src/models/business.model';
import { CreditService } from 'src/credit/credit.service';

@Injectable()
export class FinancialPlanningService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Business) private businessModel: typeof Business,
    @InjectModel(BisFunction)
    private readonly bisFunctionModel: typeof BisFunction,
    private readonly periodService: PeriodService,
    private readonly bisFunctionService: BisFunctionService,
    private readonly dbUtilsService: DbUtilsService,

    private readonly creditService: CreditService,
  ) {}

  public async plan({
    params,
    tx,
  }: {
    params: {
      from?: number;
      to?: number;
    };
    tx?: Transaction;
  }): Promise<any> {
    let bisMetrics: {
      balance: BusinessState[];
    } = {
      balance: [],
    };

    try {
      await this.dbUtilsService.wrapInTransaction(async (tx) => {
        const fromPeriod = params.from ?? 202201;
        const toPeriod = params.to ?? 202212;
        const bisFunctions = await this.bisFunctionModel.findAll();

        const business = await this.businessModel.findOne();

        if (!business) {
          throw new InternalServerErrorException(
            'Business record is not found',
          );
        }

        // We will have a set of functions: produce goods, sell goods etc. and each function will accept all data needed and change it accorddingly
        const state: BusinessState[] = [
          { balance: business.balance, period: fromPeriod, prompts: [] },
        ];
        let iPeriod = fromPeriod;
        while (iPeriod !== toPeriod) {
          const prevState = state[state.length - 1];
          let iState: BusinessState = {
            balance: prevState.balance,
            period: iPeriod,
            prompts: [],
          };

          // Execute ticks
          await this.tickCredits(iState, tx);

          // Execute business functions
          for (const bisFunction of bisFunctions
            .filter((x) => {
              return this.periodService.between(
                x.startPeriod,
                x.endPeriod,
                iPeriod,
              );
            })
            .sort((a, b) => {
              return a.order - b.order;
            })) {
            console.log('@bisFunction.name');
            console.log(bisFunction.name);
            iState = await this.bisFunctionService.exec(
              iState,
              bisFunction,
              tx,
            );

            console.log('@iState');
            console.log(iState);
          }

          state.push(iState);
          iPeriod = this.periodService.next(iPeriod);
        }

        bisMetrics = {
          balance: state,
        };

        throw new InternalServerErrorException('Cancel this transaction');
      });
    } catch (error) {
      if (
        !(
          error instanceof InternalServerErrorException &&
          error.message === 'Cancel this transaction'
        )
      ) {
        console.log('Financial Planning Error');
        console.log(JSON.stringify(error, null, 2));
      }
    }

    return bisMetrics;
  }

  /**
   * @description
   *    - tick all environment triggers
   */
  public async tickCredits(businessState: BusinessState, tx?: Transaction) {
    const credits = await this.creditService.findAll({}, tx);

    for (const credit of credits) {
      await this.creditService.tick(businessState, credit, tx);
    }

    return businessState;
  }
}
