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
  Scopes,
  Unique,
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

export enum BisFunctionScope {
  WithAll = 'WithAll',
}

export interface BisFunctionWithAll {
  id?: string | string[];
}

@Scopes(() => ({
  [BisFunctionScope.WithAll]: ({ id }: BisFunctionWithAll = {}) => {
    return {
      where: {
        ...(id && { id }),
      },
    };
  },
}))
@Table({
  timestamps: true,
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

  @Unique
  @Column({ type: DataType.STRING })
  name: string;

  @Unique
  @Column({ type: DataType.INTEGER })
  order: number;

  @Column(DataType.ENUM(...BisFunctionTypes))
  type: BisFunctionType;

  @Column(DataType.JSON)
  meta: Record<string, any>;

  @Column({ type: DataType.INTEGER })
  startPeriod: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  endPeriod: number | null;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING, allowNull: true })
  productId: string | null;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.STRING, allowNull: true })
  resourceId: string | null;

  @ForeignKey(() => Credit)
  @Column({ type: DataType.STRING, allowNull: true })
  creditId: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
