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
import Credit from 'src/models/credit.model';
import { ProductModule } from 'src/product/product.module';
import { PeriodModule } from 'src/period/period.module';
import { CreditModule } from 'src/credit/credit.module';
import { ResourceModule } from 'src/resource/resource.module';
import { UtilsModule } from 'src/utils/utils/utils.module';
import { ProductionChainModule } from 'src/production-chain/production-chain.module';
import { UsersModule } from 'src/users/users.module';
import { EquipmentModule } from 'src/equipment/equipment.module';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      Period,
      Product,
      Resource,
      Credit,
      Equipment,
      BisFunction,
    ]),
    DbUtilsModule,
    ProductModule,
    PeriodModule,
    CreditModule,
    ResourceModule,
    UtilsModule,
    UsersModule,
    ProductionChainModule,
    EquipmentModule,
  ],
  controllers: [BisFunctionController],
  providers: [BisFunctionService],
  exports: [BisFunctionService],
})
export class BisFunctionModule {}
