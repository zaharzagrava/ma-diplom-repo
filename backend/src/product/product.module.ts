import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import Product from 'src/models/product.model';
import { AuthModule } from 'src/auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Product]), DbUtilsModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
