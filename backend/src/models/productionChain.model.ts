import { Includeable, Op } from 'sequelize';
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
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import Equipment from './equipment.model';
import Product from './product.model';
import ProductionChainEquipment from './productionChainEquipment.model';
import ProductionChainResource from './productionChainResource.model';
import ProductionChainUser from './productionChainUser.model';

export enum ProductionChainScope {
  WithDepartment = 'WithDepartment',
  WithAll = 'WithAll',
}

export interface ProductionChainWithAllFilters {
  id?: string | string[];
  name?: string | string[];
  prodChainEquipments?: boolean;
  prodChainResources?: boolean;
  prodChainUsers?: boolean;
}

@Scopes(() => ({
  [ProductionChainScope.WithAll]: ({
    id,
    name,
    prodChainEquipments,
    prodChainResources,
    prodChainUsers,
  }: ProductionChainWithAllFilters = {}) => {
    const include: Includeable[] = [];

    if (prodChainEquipments) {
      include.push({
        model: ProductionChainEquipment,
        as: 'prodChainEquipments',
      });
    }

    if (prodChainResources) {
      include.push({
        model: ProductionChainResource,
        as: 'prodChainResources',
      });
    }

    if (prodChainUsers) {
      include.push({
        model: ProductionChainUser,
        as: 'prodChainUsers',
        required: false,
        where: { userId: { [Op.not]: null } },
      });
    }

    return {
      where: {
        ...(name && { name }),
        ...(id && { id }),
      },
      include,
    };
  },
}))
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

  @HasMany(() => ProductionChainEquipment, 'productionChainId')
  prodChainEquipments: ProductionChainEquipment[];

  @HasMany(() => ProductionChainResource, 'productionChainId')
  prodChainResources: ProductionChainResource[];

  @HasMany(() => ProductionChainUser, 'productionChainId')
  prodChainUsers: ProductionChainUser[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
