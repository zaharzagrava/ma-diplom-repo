import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import Department from 'src/models/department.model';
import Period from 'src/models/period.model';
import User from 'src/models/user.model';
import { PeriodModule } from 'src/period/period.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([User, Department, Period]),
    PeriodModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
