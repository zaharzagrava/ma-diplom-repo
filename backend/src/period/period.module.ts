import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import Period from 'src/models/period.model';
import { PeriodService } from './period.service';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';

@Module({
  imports: [SequelizeModule.forFeature([Period]), AuthModule, DbUtilsModule],
  controllers: [],
  providers: [PeriodService],
  exports: [PeriodService],
})
export class PeriodModule {}
