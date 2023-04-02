import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User from 'src/models/user.model';
import { Transaction } from 'sequelize';
import { PeriodService } from 'src/period/period.service';
import { BisFunctionService } from 'src/bis-function/bis-function.service';

@Injectable()
export class FinancialPlanningService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly periodService: PeriodService,
    private readonly bisFunctionService: BisFunctionService,
  ) {}

  public async plan({
    params,
    tx,
  }: {
    params: {
      from: number;
      to: number;
    };
    tx?: Transaction;
  }): Promise<any> {
    const bisFunctions = await this.bisFunctionService.findAll();

    // We will have a set of functions: produce goods, sell goods etc. and each function will accept all data needed and change it accorddingly
    const state: number[] = [];
    let iPeriod = params.from;
    while (iPeriod !== params.to) {
      state.push(0);

      // ---

      // Buy, repair equipment

      // Buy products

      // Produce goods

      // Sell goods

      // ---

      // Increase all credits amounts
      // amount * (1 + rate)

      // Payout all credits

      // Payout salaries

      // ---

      iPeriod = this.periodService.next(iPeriod);
    }

    return [0, 0, 0, 0];
  }
}
