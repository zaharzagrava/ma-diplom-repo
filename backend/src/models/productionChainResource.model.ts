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
import Resource from './resource.model';
import ProductionChain from './productionChain.model';

@Table({
  timestamps: true,
  tableName: 'ProductionChainResource',
})
export default class ProductionChainResource extends Model<
  ProductionChainResource,
  Partial<ProductionChainResource>
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  /**
   * @description
   *    - how much resources is needed to be used to produce 1 Product
   *
   */
  @Column({ type: DataType.NUMBER })
  amount: number;

  @BelongsTo(() => Resource)
  resource: Resource;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.STRING, allowNull: true })
  resourceId: string;

  @ForeignKey(() => ProductionChain)
  @Column
  productionChainId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
