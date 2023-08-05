import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreditService } from './credit.service';
import Credit from 'src/models/credit.model';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Credit]), DbUtilsModule],
  controllers: [],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
