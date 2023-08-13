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

export enum EquipmentScope {
  WithAll = 'WithAll',
}

export interface EquipmentWithAllFilters {
  id?: string | string[];
}

@Scopes(() => ({
  [EquipmentScope.WithAll]: ({ id }: EquipmentWithAllFilters = {}) => {
    return {
      where: {
        ...(id && { id }),
      },
    };
  },
}))
@Table({
  timestamps: true,
  tableName: 'Equipment',
})
export default class Equipment extends Model<Equipment, Partial<Equipment>> {
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
