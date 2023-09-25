import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './types';
import User from 'src/models/user.model';
import { Transaction } from 'sequelize';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { BusinessState } from 'src/business/types';
import ProductionChain from 'src/models/productionChain.model';
import { ProductionChainService } from 'src/production-chain/production-chain.service';
import { UtilsService } from 'src/utils/utils/utils.service';
import * as _ from 'lodash';
import { UserUpsertDto } from 'src/entities/types';
import { UsersDbService } from 'src/users-db/users-db.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbU: DbUtilsService,
    private readonly u: UtilsService,
    private readonly usersDbService: UsersDbService,
    private readonly productionChainService: ProductionChainService,

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

  public async hireEmployee({
    businessState,
    user,
    productionChain,
    tx,
  }: {
    businessState: BusinessState;
    user: User;
    productionChain: ProductionChain;
    tx: Transaction;
  }): Promise<{
    user: User;
    otherLogs: string[];
  }> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const otherLogs: string[] = [];
      await this.userModel.update(
        { employedAt: businessState.period },
        {
          where: { id: user.id },
          returning: true,
          transaction: tx,
        },
      );

      try {
        const { reassignedFrom } =
          await this.productionChainService.hireEmployee({
            businessState,
            productionChain,
            user,
            tx,
          });
      } catch (error) {
        if (
          error.message.includes('cannot be assigned to the production chain')
        ) {
          otherLogs.push(error.message);
          return { user, otherLogs };
        } else if (
          error.message ===
          'Production chain already assigned, no actions taken'
        ) {
          otherLogs.push(error.message);
          return { user, otherLogs };
        }

        throw error;
      }

      return { user, otherLogs };
    }, tx);
  }

  public async fireEmployee({
    businessState,
    user,
    tx,
  }: {
    businessState: BusinessState;
    user: User;
    tx: Transaction;
  }): Promise<User> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      if (!user.employedAt) {
        throw new Error('User is already fired');
      }

      await this.userModel.update(
        { employedAt: null },
        {
          where: { id: user.id },
          returning: true,
          transaction: tx,
        },
      );

      await this.productionChainService.fireEmployee({
        businessState,
        user,
        tx,
      });

      return user;
    }, tx);
  }

  public async payoutSalaries({
    businessState,
    tx,
  }: {
    businessState: BusinessState;
    tx: Transaction;
  }): Promise<
    {
      amount: number;
      fullName: string;
    }[]
  > {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const employedUsers = await this.usersDbService.findAll(
        { employed: true },
        tx,
      );

      const paidUsers = [];
      for (const user of employedUsers) {
        businessState.balance = _.round(businessState.balance - user.salary, 2);

        paidUsers.push({
          amount: user.salary,
          fullName: user.fullName,
        });
      }

      return paidUsers;
    }, tx);
  }
}
