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
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User, { UserType, UserTypes } from './user.model';
import ProductionChain from './productionChain.model';

// ProductionChainUser
// Has two types of records
//   - the ones with userId = null, they specify what kind of users are needed on this ProductionChain, those records are static, and should not be modified
//   - the ones with userId, they specify what users are actually working on this ProductionChain
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
  @Column({ type: DataType.STRING, allowNull: true })
  userId: string | null;

  @BelongsTo(() => ProductionChain, { foreignKey: 'productionChainId' })
  productionChain: ProductionChain;

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
