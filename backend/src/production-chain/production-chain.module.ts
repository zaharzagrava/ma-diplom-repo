import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductionChainService } from './production-chain.service';
import ProductionChain from 'src/models/productionChain.model';
import { UtilsModule } from 'src/utils/utils/utils.module';
import ProductionChainUser from 'src/models/productionChainUser.model';
import { ProductModule } from 'src/product/product.module';
import { ResourceModule } from 'src/resource/resource.module';
import ProductionChainResource from 'src/models/productionChainResource.model';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([
      ProductionChain,
      ProductionChainUser,
      ProductionChainResource,
    ]),
    DbUtilsModule,
    UtilsModule,
    ProductModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [ProductionChainService],
  exports: [ProductionChainService],
})
export class ProductionChainModule {}
