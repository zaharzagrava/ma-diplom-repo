import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import Product from 'src/models/product.model';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly dbUtilsService: DbUtilsService,

    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  public async sellProduct({
    product,
    sellAmount,
    tx,
  }: {
    product: Product;
    sellAmount: number;
    tx?: Transaction;
  }): Promise<{
    product: Product;
    income: number;
  }> {
    return await this.dbUtilsService.wrapInTransaction(async (tx) => {
      await this.productModel.findByPk();

      if (product.amount <= sellAmount) {
        await this.productModel.update(
          {
            amount: product.amount - sellAmount,
          },
          {
            where: { id: product.id },
            returning: true,
          },
        );
      }

      return {
        product,
        income: product.amount * sellAmount,
      };
    });
  }
}
