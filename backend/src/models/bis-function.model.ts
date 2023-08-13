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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import Product from './product.model';
import Resource from './resource.model';
import Credit from './credit.model';
import User from './user.model';
import ProductionChain from './productionChain.model';
import Equipment from './equipment.model';

export enum BisFunctionType {
  // Take a credit
  TAKE_CREDIT = 'TAKE_CREDIT',
  // Pays out a fixed amount of credit sum
  PAYOUT_CREDIT_FIXED_AMOUNT = 'PAYOUT_CREDIT_FIXED_AMOUNT',

  // (Re)Hire 1 employee to 1 ProductionChain, one employee can only be assigned to 1 ProdutionChain at the same time
  HIRE_EMPLOYEE = 'HIRE_EMPLOYEE',
  // Fire an employee, making him inactive. Inactive employees do not receive salaries
  FIRE_EMPLOYEE = 'FIRE_EMPLOYEE',
  // Payout salaries to all active employees
  PAYOUT_SALARIES = 'PAYOUT_SALARIES',

  // Buy enough resources to produce X products in one period
  BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT = 'BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT',
  // Buy enough equipment to produce X products in one period
  BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT = 'BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT',
  // Produce goods according to instructions of the given ProductionChain
  PRODUCE_PRODUCTS = 'PRODUCE_PRODUCTS',
  // Function that sells a given amount of products, amount.null for selling all products
  SELL_PRODUCT_FIXED = 'SELL_PRODUCT_FIXED',

  // Function that marks change of the Product / Resource / Equipment change, meta.table defines which price is changed
  CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE = 'CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE',
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

  @Column({ type: DataType.JSON, allowNull: true })
  meta: Record<string, any> | null;

  @Column({ type: DataType.INTEGER })
  startPeriod: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  endPeriod: number | null;

  @BelongsTo(() => Equipment, { foreignKey: 'equipmentId' })
  equipment: Equipment;

  @ForeignKey(() => Equipment)
  @Column({ type: DataType.STRING, allowNull: true })
  equipmentId: string | null;

  @BelongsTo(() => Product, { foreignKey: 'productId' })
  product: Product;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING, allowNull: true })
  productId: string | null;

  @BelongsTo(() => Resource, { foreignKey: 'resourceId' })
  resource: Resource;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.STRING, allowNull: true })
  resourceId: string | null;

  @BelongsTo(() => Credit, { foreignKey: 'creditId' })
  credit: Credit;

  @ForeignKey(() => Credit)
  @Column({ type: DataType.STRING, allowNull: true })
  creditId: string | null;

  @BelongsTo(() => ProductionChain, { foreignKey: 'productionChainId' })
  productionChain: ProductionChain;

  @ForeignKey(() => ProductionChain)
  @Column({ type: DataType.STRING, allowNull: true })
  productionChainId: string | null;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: true })
  userId: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
