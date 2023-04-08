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
  BelongsToMany,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';
import Resource from './resource.model';
import Product from './product.model';
import Equipment from './equipment.model';
import ProductionChainUser from './productionChainUser.model';
import ProductionChainResource from './productionChainResource.model';
import ProductionChainEquipment from './productionChainEquipment.model';

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

  @Column({ type: DataType.NUMBER })
  price: number;

  @Column({ type: DataType.NUMBER })
  amount: number;

  @ForeignKey(() => User)
  @Column
  prodChainUserId: string;

  @BelongsToMany(() => User, () => ProductionChainUser)
  users: User[];

  @ForeignKey(() => Resource)
  @Column({ type: DataType.STRING })
  prodChainResourceId: string;

  @BelongsToMany(() => Resource, () => ProductionChainResource)
  resources: Resource[];

  @ForeignKey(() => Product)
  @Column
  prodChainProductId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING })
  productId: Product;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Equipment)
  @Column
  prodChainEquipmentId: string;

  @BelongsToMany(() => Equipment, () => ProductionChainEquipment)
  equipments: Equipment[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
