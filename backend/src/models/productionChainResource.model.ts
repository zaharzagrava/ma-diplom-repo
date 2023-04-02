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
  Unique,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';
import Resource from './resource.model';
import Product from './product.model';
import Equipment from './equipment.model';
import ProductionChain from './productionChain.model';

@Table({
  timestamps: true,
  paranoid: true,
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

  @ForeignKey(() => Resource)
  @Column
  resourceId: string;

  @ForeignKey(() => ProductionChain)
  @Column
  productionChainId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
