import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/models/user.model';
import { ProductionChainModule } from 'src/production-chain/production-chain.module';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { UtilsModule } from 'src/utils/utils/utils.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ProductionChainModule,
    DbUtilsModule,
    UtilsModule,
    AuthModule,
    SequelizeModule.forFeature([User]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
