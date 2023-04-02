import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import Period from 'src/models/period.model';
import { DateTime } from 'luxon';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';

@Injectable()
export class PeriodService {
  private readonly logger = new Logger(PeriodService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,

    @InjectModel(Period) private readonly periodModel: typeof Period,
    @InjectConnection() private readonly sequelizeInstance: Sequelize,
  ) {}

  public async getCurrentPeriod({
    tx,
  }: {
    tx?: Transaction;
  } = {}): Promise<Period> {
    const period = await this.periodModel.findOne({
      where: {
        closedAt: null,
      },
      transaction: tx,
    });

    if (!period) {
      throw new NotFoundException("Can't find current active period");
    }

    return period;
  }

  public async isCurrentPeriod(
    period: Period,
    currentPeriod?: Period,
  ): Promise<boolean> {
    const currentPeriodI = currentPeriod || (await this.getCurrentPeriod());

    return period.period === currentPeriodI.period;
  }

  public format(period: number, format: string): string {
    const parsedPeriod = this.parse(period);

    return DateTime.fromObject({
      year: parsedPeriod[0],
      month: parsedPeriod[1],
    }).toFormat(format);
  }

  public add(period: number, { months }: { months: number }): number {
    const parsedPeriod = this.parse(period);

    const dateTime = DateTime.fromObject({
      year: parsedPeriod[0],
      month: parsedPeriod[1],
    }).plus({
      months,
    });

    return this.buildPeriodValue(dateTime.year, dateTime.month);
  }

  public subtr(period: number, { months }: { months: number }): number {
    const parsedPeriod = this.parse(period);

    const dateTime = DateTime.fromObject({
      year: parsedPeriod[0],
      month: parsedPeriod[1],
    }).minus({
      months,
    });

    return this.buildPeriodValue(dateTime.year, dateTime.month);
  }

  public buildPeriodValue(year: number, month: number): number {
    return year * 100 + month;
  }

  public parse(period: number): [year: number, month: number] {
    return [Math.floor(period / 100), period % 100];
  }

  public prev(period: number): number {
    const [year, month] = this.parse(period);
    if (month > 1) {
      return this.buildPeriodValue(year, month - 1);
    }

    return this.buildPeriodValue(year - 1, 12);
  }

  public next(period: number): number {
    const [year, month] = this.parse(period);
    if (month < 12) {
      return this.buildPeriodValue(year, month + 1);
    }

    return this.buildPeriodValue(year + 1, 1);
  }
}
