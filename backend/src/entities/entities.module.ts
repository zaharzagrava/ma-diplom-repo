import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';
import { CreditModule } from 'src/credit/credit.module';
import { ResourceModule } from 'src/resource/resource.module';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { UsersModule } from 'src/users/users.module';
import { ProductionChainModule } from 'src/production-chain/production-chain.module';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { UsersDbModule } from 'src/users-db/users-db.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    CreditModule,
    ResourceModule,
    UsersModule,
    UsersDbModule,
    ProductionChainModule,
    EquipmentModule,
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
