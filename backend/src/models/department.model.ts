import {
  Column,
  Model,
  Table,
  Default,
  IsUUID,
  PrimaryKey,
  BelongsTo,
  HasMany,
  ForeignKey,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import User from './user.model';

@Table({
  timestamps: true, // add the timestamp attributes (updatedAt, createdAt)
  paranoid: true, // don't delete database entries but set the newly added attribute deletedAt
  tableName: 'Department',
  modelName: 'Department',
})
export default class Department extends Model<Department, Partial<Department>> {
  @IsUUID(4)
  @PrimaryKey
  @Default(uuidv4)
  @Column
  id: string;

  @Unique
  @Column
  name: string;

  @ForeignKey(() => Department)
  @Column({ type: DataType.STRING, allowNull: true })
  parentId: string | null;

  @HasMany(() => User, 'departmentId')
  members: User[];

  @BelongsTo(() => Department, { foreignKey: 'parentId' })
  parentDepartment: Department;

  @HasMany(() => Department, 'parentId')
  subDepartments: Department[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date | null;
}
