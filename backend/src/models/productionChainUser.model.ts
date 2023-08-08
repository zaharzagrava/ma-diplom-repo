import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
  IsUUID,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User, { UserType, UserTypes } from './user.model';
import ProductionChain from './productionChain.model';

@Table({
  timestamps: true,
  tableName: 'ProductionChainUser',
})
export default class ProductionChainUser extends Model<
  ProductionChainUser,
  Partial<ProductionChainUser>
> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => ProductionChain)
  @Column
  productionChainId: string;

  @Column(DataType.ENUM(...UserTypes))
  type: UserType;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
