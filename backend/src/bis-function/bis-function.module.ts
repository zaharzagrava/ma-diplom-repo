import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Period from 'src/models/period.model';
import { BisFunctionService } from './bis-function.service';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import Product from 'src/models/product.model';
import Resource from 'src/models/resource.model';
import Equipment from 'src/models/equipment.model';
import BisFunction from 'src/models/bis-function.model';
import { BisFunctionController } from './bis-function.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      Period,
      Product,
      Resource,
      Equipment,
      BisFunction,
    ]),
    DbUtilsModule,
  ],
  controllers: [BisFunctionController],
  providers: [BisFunctionService],
  exports: [BisFunctionService],
})
export class BisFunctionModule {}
