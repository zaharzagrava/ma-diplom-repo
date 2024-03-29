import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import Product from 'src/models/product.model';
import { AuthModule } from 'src/auth/auth.module';
import { ProductService } from './product.service';
import { UtilsModule } from 'src/utils/utils/utils.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Product]),
    DbUtilsModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
