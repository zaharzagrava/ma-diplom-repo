import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import Product, {
  ProductScope,
  ProductWithAllFilters,
} from 'src/models/product.model';
import { Transaction } from 'sequelize';
import { UtilsService } from 'src/utils/utils/utils.service';
import { BusinessState } from 'src/business/types';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,
    private readonly u: UtilsService,

    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  public findOne(
    params?: ProductWithAllFilters,
    tx?: Transaction,
  ): Promise<Product | null> {
    return this.productModel
      .scope({
        method: [ProductScope.WithAll, <ProductWithAllFilters>params],
      })
      .findOne({
        transaction: tx,
      });
  }

  public findAll(
    params?: ProductWithAllFilters,
    tx?: Transaction,
  ): Promise<Product[] | null> {
    return this.productModel
      .scope({
        method: [ProductScope.WithAll, <ProductWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }

  public async sellProduct({
    businessState,
    product,
    sellAmount,
    tx,
  }: {
    businessState: BusinessState;
    product: Product;
    sellAmount: number;
    tx?: Transaction;
  }): Promise<{
    product: Product;
    income: number;
  }> {
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      const _sellAmount = Math.min(product.amount, sellAmount);
      const income = product.price * _sellAmount;

      if (_sellAmount !== 0) {
        await this.productModel.update(
          {
            amount: product.amount - sellAmount,
          },
          {
            where: { id: product.id },
            returning: true,
            transaction: tx,
          },
        );
      }

      return {
        product,
        income,
      };
    }, tx);
  }
}
