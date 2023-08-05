import { Includeable } from 'sequelize';
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

export enum ResourceScope {
  WithDepartment = 'WithDepartment',
  WithAll = 'WithAll',
}

export interface ResourceWithAllFilters {
  id?: string | string[];
}

@Scopes(() => ({
  [ResourceScope.WithAll]: ({ id }: ResourceWithAllFilters = {}) => {
    return {
      where: {
        ...(id && { id }),
      },
    };
  },
}))
@Table({
  timestamps: true,
  tableName: 'Resource',
})
export default class Resource extends Model<Resource, Partial<Resource>> {
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

  /**
   * @description - how much resources is present right now
   */
  @Column({ type: DataType.NUMBER })
  amount: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
