import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
  IsUUID,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import Equipment from './equipment.model';
import ProductionChain from './productionChain.model';

@Table({
  timestamps: true,
  tableName: 'ProductionChainEquipment',
})
export default class ProductionChainEquipment extends Model<
  ProductionChainEquipment,
  Partial<ProductionChainEquipment>
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  /**
   * @description
   *    - how much equpiment is needed to be used to produce 1 Product
   *
   */
  @Column({ type: DataType.NUMBER })
  amount: number;

  @BelongsTo(() => Equipment)
  equipment: Equipment;

  @ForeignKey(() => Equipment)
  @Column
  equipmentId: string;

  @ForeignKey(() => ProductionChain)
  @Column
  productionChainId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
