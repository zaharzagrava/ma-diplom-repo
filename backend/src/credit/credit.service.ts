import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import Credit, {
  CreditScope,
  CreditWithAllFilters,
} from 'src/models/credit.model';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(CreditService.name);

  constructor(
    @InjectModel(Credit)
    private readonly creditModel: typeof Credit,
  ) {}

  public findAll(
    params?: CreditWithAllFilters,
    tx?: Transaction,
  ): Promise<Credit[] | null> {
    return this.creditModel
      .scope({
        method: [CreditScope.WithAll, <CreditWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }
}
