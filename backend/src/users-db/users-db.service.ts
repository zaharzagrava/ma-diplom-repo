import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import User, { UserScope, UserWithAllFilters } from 'src/models/user.model';
import { Transaction } from 'sequelize';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import * as _ from 'lodash';
import { UserUpsertDto } from 'src/entities/types';
import { CreateUserDto } from 'src/users/types';

@Injectable()
export class UsersDbService {
  constructor(
    private readonly dbU: DbUtilsService,

    @InjectModel(User) private userModel: typeof User,
  ) {}

  public create(user: CreateUserDto): Promise<User> {
    return this.userModel.create(user);
  }

  public async upsert(entityUpsert: UserUpsertDto): Promise<User> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const user = await this.userModel.findOne({
        where: { email: entityUpsert.email },
        transaction: tx,
      });

      if (!user) {
        await this.userModel.create(entityUpsert, {
          transaction: tx,
        });
      } else {
        await this.userModel.update(entityUpsert, {
          where: { email: entityUpsert.email },
          transaction: tx,
        });
      }

      return await this.userModel.findOne({
        where: { email: entityUpsert.email },
        transaction: tx,
      });
    });
  }

  public findOne(
    params?: UserWithAllFilters,
    tx?: Transaction,
  ): Promise<User | null> {
    return this.userModel
      .scope({
        method: [UserScope.WithAll, <UserWithAllFilters>params],
      })
      .findOne({
        transaction: tx,
      });
  }

  public async findAll(
    params?: UserWithAllFilters,
    tx?: Transaction,
  ): Promise<User[]> {
    const users = await this.userModel
      .scope({
        method: [UserScope.WithAll, <UserWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });

    return users.filter((x) => x.email !== 'zaharzagrava@gmail.com');
  }
}
