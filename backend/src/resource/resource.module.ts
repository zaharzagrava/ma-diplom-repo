import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { ResourceService } from './resource.service';
import Resource from 'src/models/resource.model';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Resource]), DbUtilsModule],
  controllers: [],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
