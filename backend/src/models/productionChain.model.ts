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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import Product from './product.model';

@Table({
  timestamps: true,
  tableName: 'ProductionChain',
})
export default class ProductionChain extends Model<
  ProductionChain,
  Partial<ProductionChain>
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Unique
  @Column
  name: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
