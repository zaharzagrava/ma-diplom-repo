import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreditService } from './credit.service';
import Credit from 'src/models/credit.model';
import { UtilsModule } from 'src/utils/utils/utils.module';

@Module({
  imports: [
    DbUtilsModule,
    UtilsModule,
    AuthModule,
    SequelizeModule.forFeature([Credit]),
  ],
  controllers: [],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
