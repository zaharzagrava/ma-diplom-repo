import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import User from 'src/models/user.model';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { UsersDbService } from './users-db.service';

@Module({
  imports: [DbUtilsModule, SequelizeModule.forFeature([User])],
  providers: [UsersDbService],
  exports: [UsersDbService],
  controllers: [],
})
export class UsersDbModule {}
