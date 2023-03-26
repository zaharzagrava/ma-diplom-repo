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

export enum UserScope {
  WithDepartment = 'WithDepartment',
  WithAll = 'WithAll',
}

export interface UserWithAllFilters {
  id?: string | string[];
  departmentId?: string[];
  country?: string[] | string;
  legalLocation?: string[] | string;
  email?: string[] | string;
  active?: boolean;

  includeDepartment?: boolean;
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
  [UserScope.WithAll]: ({
    id,
    active,
    departmentId,
    country,
    legalLocation,
    email,
    includeDepartment = true,
  }: UserWithAllFilters = {}) => {
    const includes: Includeable[] = [];

    if (includeDepartment) {
      includes.push({
        model: Department,
        as: 'department',
      });
    }

    return {
      where: {
        ...(active !== undefined && {
          deactivatedAt: active ? null : { [Op.not]: null },
        }),
        ...(id && { id }),
        ...(departmentId && { departmentId }),
        ...(country && { country }),
        ...(legalLocation && { legalLocation }),
        ...(email && { email }),
      },
      include: includes,
      attributes: {
        exclude: ['refreshToken'],
      },
    };
  },
}))
@Table({
  modelName: 'User',
  timestamps: true,
  paranoid: true,
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
  @Column
  email: string;

  @Column
  fullName: string;

  @Column({ allowNull: false })
  country: string;

  @Column
  city: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date | null;
}
