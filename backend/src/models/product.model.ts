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
  Scopes,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum ProductScope {
  WithDepartment = 'WithDepartment',
  WithAll = 'WithAll',
}

export interface ProductWithAllFilters {
  id?: string | string[];
}

@Scopes(() => ({
  [ProductScope.WithAll]: ({ id }: ProductWithAllFilters = {}) => {
    return {
      where: {
        ...(id && { id }),
      },
    };
  },
}))
@Table({
  timestamps: true,
  tableName: 'Product',
})
export default class Product extends Model<Product, Partial<Product>> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Unique
  @Column
  name: string;

  @Column({ type: DataType.NUMBER })
  price: number;

  @Column({ type: DataType.NUMBER })
  amount: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
