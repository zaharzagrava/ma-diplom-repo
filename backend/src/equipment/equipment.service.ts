import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import * as _ from 'lodash';
import Equipment, {
  EquipmentScope,
  EquipmentWithAllFilters,
} from 'src/models/equipment.model';
import ProductionChainEquipment from 'src/models/productionChainEquipment.model';
import { BusinessState } from 'src/business/types';
import ProductionChain from 'src/models/productionChain.model';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { EquipmentUpsertDto } from 'src/entities/types';

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name);

  constructor(
    private readonly dbU: DbUtilsService,

    @InjectModel(Equipment)
    private readonly equipmentModel: typeof Equipment,
    @InjectModel(ProductionChainEquipment)
    private readonly productionChainEquipmentModel: typeof ProductionChainEquipment,
  ) {}

  public findAll(
    params?: EquipmentWithAllFilters,
    tx?: Transaction,
  ): Promise<Equipment[]> {
    return this.equipmentModel
      .scope({
        method: [EquipmentScope.WithAll, <EquipmentWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }

  public findOne(
    params?: EquipmentWithAllFilters,
    tx?: Transaction,
  ): Promise<Equipment | null> {
    return this.equipmentModel
      .scope({
        method: [EquipmentScope.WithAll, <EquipmentWithAllFilters>params],
      })
      .findOne({
        transaction: tx,
      });
  }

  public async upsert(entityUpsert: EquipmentUpsertDto) {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const equipment = await this.equipmentModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });

      if (!equipment) {
        await this.equipmentModel.create(entityUpsert, {
          transaction: tx,
        });
      } else {
        await this.equipmentModel.update(entityUpsert, {
          where: { name: entityUpsert.name },
          transaction: tx,
        });
      }

      return await this.equipmentModel.findOne({
        where: { name: entityUpsert.name },
        transaction: tx,
      });
    });
  }

  public async buyEquipmentForProductionChain({
    businessState,
    amount,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    amount: number;
    productionChain: ProductionChain;
    tx: Transaction;
  }): Promise<
    {
      buyAmount: number;
      price: number;
      name: string;
    }[]
  > {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const prodChainEquipments =
        await this.productionChainEquipmentModel.findAll({
          where: { productionChainId: productionChain.id },
          include: [{ model: Equipment }],
          transaction: tx,
        });

      const boughtEquipment = [];
      for (const prodChainEquipment of prodChainEquipments) {
        const buyAmount = amount * prodChainEquipment.amount;
        const price = buyAmount * prodChainEquipment.equipment.price;

        businessState.balance -= price;

        await this.buyEquipment({
          equipment: prodChainEquipment.equipment,
          buyAmount,
          tx,
        });

        boughtEquipment.push({
          buyAmount,
          price,
          name: prodChainEquipment.equipment.name,
        });
      }

      return boughtEquipment;
    }, tx);
  }

  private async buyEquipment({
    equipment,
    buyAmount,
    tx,
  }: {
    equipment: Equipment;
    buyAmount: number;
    tx: Transaction;
  }) {
    return await equipment.update(
      { amount: equipment.amount + buyAmount },
      { transaction: tx },
    );
  }
}
