import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/models/user.model';
import { FinancialPlanningController } from './financial-planning.controller';
import { FinancialPlanningService } from './financial-planning.service';
import { PeriodModule } from 'src/period/period.module';
import { BisFunctionModule } from 'src/bis-function/bis-function.module';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';

@Module({
  imports: [
    AuthModule,
    PeriodModule,
    BisFunctionModule,
    SequelizeModule.forFeature([User]),
    DbUtilsModule,
  ],
  providers: [FinancialPlanningService],
  exports: [FinancialPlanningService],
  controllers: [FinancialPlanningController],
})
export class FinancialPlanningModule {}
