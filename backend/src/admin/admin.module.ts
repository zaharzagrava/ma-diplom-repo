import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import BisFunction from 'src/models/bis-function.model';
import Business from 'src/models/business.model';
import Credit from 'src/models/credit.model';
import Department from 'src/models/department.model';
import Equipment from 'src/models/equipment.model';
import Period from 'src/models/period.model';
import Product from 'src/models/product.model';
import ProductionChain from 'src/models/productionChain.model';
import ProductionChainEquipment from 'src/models/productionChainEquipment.model';
import ProductionChainResource from 'src/models/productionChainResource.model';
import ProductionChainUser from 'src/models/productionChainUser.model';
import Resource from 'src/models/resource.model';
import User from 'src/models/user.model';
import { PeriodModule } from 'src/period/period.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      User,
      BisFunction,
      Credit,
      Department,
      Period,
      Business,
      Product,
      Resource,
      Equipment,
      ProductionChain,
      ProductionChainEquipment,
      ProductionChainResource,
      ProductionChainUser,
    ]),
    PeriodModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
