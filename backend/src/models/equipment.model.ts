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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

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
