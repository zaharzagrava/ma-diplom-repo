import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  Default,
  IsUUID,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import Product from './product.model';
import Resource from './resource.model';
import Credit from './credit.model';

export enum BisFunctionType {
  PAYOUT_CREDIT_FIXED_AMOUNT = 'PAYOUT_CREDIT_FIXED_AMOUNT',

  // Function that instructs the business to buy that much products that would result in a given amount of goods produced
  BUY_RESOURCE_PRODUCT_FIXED_AMOUNT = 'BUY_RESOURCE_PRODUCT_FIXED_AMOUNT',
}

export const BisFunctionTypes = Object.values(BisFunctionType);

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'BisFunction',
})
export default class BisFunction extends Model<
  BisFunction,
  Partial<BisFunction>
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Column(DataType.ENUM(...BisFunctionTypes))
  type: BisFunctionType;

  @Column(DataType.ENUM(...BisFunctionTypes))
  meta: Record<string, any>;

  @ForeignKey(() => Product)
  @Column
  productId: string | null;

  @ForeignKey(() => Resource)
  @Column
  resourceId: string | null;

  @ForeignKey(() => Credit)
  @Column
  creditId: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
