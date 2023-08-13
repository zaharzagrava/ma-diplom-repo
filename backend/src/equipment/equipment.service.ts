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
import { UtilsService } from 'src/utils/utils/utils.service';

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name);

  constructor(
    private readonly dbU: DbUtilsService,
    private readonly u: UtilsService,

    @InjectModel(Equipment)
    private readonly creditModel: typeof Equipment,
    @InjectModel(ProductionChainEquipment)
    private readonly productionChainEquipmentModel: typeof ProductionChainEquipment,
  ) {}

  public findOne(
    params?: EquipmentWithAllFilters,
    tx?: Transaction,
  ): Promise<Equipment | null> {
    return this.creditModel
      .scope({
        method: [EquipmentScope.WithAll, <EquipmentWithAllFilters>params],
      })
      .findOne({
        transaction: tx,
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
    tx?: Transaction;
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
          equipmentId: prodChainEquipment.equipmentId,
          amount: amount * prodChainEquipment.amount,
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
    equipmentId,
    amount,
  }: {
    equipmentId: string;
    amount: number;
  }) {
    return 'stub';
  }
}
