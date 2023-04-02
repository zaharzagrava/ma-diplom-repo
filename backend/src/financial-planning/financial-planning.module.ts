import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/models/user.model';
import { FinancialPlanningController } from './financial-planning.controller';
import { FinancialPlanningService } from './financial-planning.service';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([User])],
  providers: [FinancialPlanningService],
  exports: [FinancialPlanningService],
  controllers: [FinancialPlanningController],
})
export class FinancialPlanningModule {}
