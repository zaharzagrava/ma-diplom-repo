import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbUtilsModule } from 'src/utils/db-utils/db-utils.module';
import { AuthModule } from 'src/auth/auth.module';
import { EquipmentService } from './equipment.service';
import Equipment from 'src/models/equipment.model';
import { UtilsModule } from 'src/utils/utils/utils.module';
import ProductionChainEquipment from 'src/models/productionChainEquipment.model';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Equipment, ProductionChainEquipment]),
    DbUtilsModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [EquipmentService],
  exports: [EquipmentService],
})
export class EquipmentModule {}
