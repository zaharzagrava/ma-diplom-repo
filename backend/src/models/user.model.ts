import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  Scopes,
  DefaultScope,
  DataType,
} from 'sequelize-typescript';
import { Includeable, Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Department from './department.model';

export enum UserType {
  // Швея
  SEAMSTRESS = 'SEAMSTRESS',
  // Закройщик
  CUTTER = 'CUTTER',
  // Закройщик
  MANAGER = 'MANAGER',
}

export const UserTypes = Object.values(UserType);

export enum UserScope {
  WithDepartment = 'WithDepartment',
  WithAll = 'WithAll',
}

export interface UserWithAllFilters {
  id?: string | string[];
  employed?: boolean;
}

@DefaultScope(() => ({
  attributes: {
    exclude: ['refreshToken'],
  },
}))
@Scopes(() => ({
  [UserScope.WithDepartment]: () => ({
    include: [
      {
        model: Department,
        as: 'department',
      },
    ],
    attributes: {
      exclude: ['refreshToken'],
    },
  }),
  [UserScope.WithAll]: ({ id, employed }: UserWithAllFilters = {}) => {
    return {
      where: {
        ...(id && { id }),
        ...(employed !== undefined && {
          employedAt: employed ? { [Op.not]: null } : null,
        }),
      },
      attributes: {
        exclude: ['refreshToken'],
      },
    };
  },
}))
@Table({
  modelName: 'User',
  timestamps: true,
  tableName: 'User',
})
export default class User extends Model<User, Partial<User>> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Unique
  @IsEmail
  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  fullName: string;

  @Column(DataType.ENUM(...UserTypes))
  type: UserType;

  @Column({ type: DataType.INTEGER })
  salary: number;

  @Column({ type: DataType.INTEGER })
  employedAt: number | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date | null;
}

// Resource1 - 50
// Resource2 - 10
// Resource3 - 100

// Equipment1 - 1
// Equipment2 - 2

// User - 100
