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
  paranoid: true,
  tableName: 'Credit',
})
export default class Credit extends Model<Credit, Partial<Credit>> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Unique
  @Column
  name: string;

  /**
   * @description - how much money is left to be paid out
   */
  @Column({ type: DataType.NUMBER })
  sum: number;

  /**
   * @description - amount of interest (e.g. 0.05)
   */
  @Column({ type: DataType.NUMBER })
  rate: number;

  /**
   * @description - when this credit was taked
   */
  @Column({ type: DataType.INTEGER })
  startPeriod: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
