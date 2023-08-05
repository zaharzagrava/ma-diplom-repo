import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';
import { CreditModule } from 'src/credit/credit.module';
import { ResourceModule } from 'src/resource/resource.module';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';

@Module({
  imports: [AuthModule, ProductModule, CreditModule, ResourceModule],
  controllers: [EntitiesController],
  providers: [EntitiesService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
