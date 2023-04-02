import { Module } from '@nestjs/common';
import { DbUtilsService } from './db-utils.service';

@Module({
  imports: [],
  providers: [DbUtilsService],
  exports: [DbUtilsService],
})
export class DbUtilsModule {}
