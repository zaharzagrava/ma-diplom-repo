import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './types';
import User, { UserScope, UserWithAllFilters } from 'src/models/user.model';
import { ScopeOptions, Transaction } from 'sequelize';
import { DbUtilsService } from 'src/utils/db-utils/db-utils.service';
import { BusinessState } from 'src/business/types';
import { BisFunctionDto_HIRE_EMPLOYEE } from 'src/bis-function/bis-function.types';
import ProductionChain from 'src/models/productionChain.model';
import { ProductionChainService } from 'src/production-chain/production-chain.service';
import { UtilsService } from 'src/utils/utils/utils.service';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbU: DbUtilsService,
    private readonly u: UtilsService,
    private readonly productionChainService: ProductionChainService,

    @InjectModel(User) private userModel: typeof User,
  ) {}

  public create(user: CreateUserDto): Promise<User> {
    return this.userModel.create(user);
  }

  public getAll(userScopes?: Array<UserScope | ScopeOptions>): Promise<User[]> {
    return this.userModel.scope(userScopes || ['defaultScope']).findAll();
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

  public findAll(
    params?: UserWithAllFilters,
    tx?: Transaction,
  ): Promise<User[]> {
    return this.userModel
      .scope({
        method: [UserScope.WithAll, <UserWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
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
    tx?: Transaction;
  }): Promise<User> {
    return await this.dbU.wrapInTransaction(async (tx) => {
      if (user.employedAt) {
        throw new Error('User is already employed');
      }

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
          this.u.pushAndRecordPrompt(businessState, `- ${error.message}`);
          return businessState;
        } else if (
          error.message ===
          'Production chain already assigned, no actions taken'
        ) {
          this.u.pushAndRecordPrompt(businessState, `- ${error.message}`);
          return businessState;
        }

        throw error;
      }

      return user;
    }, tx);
  }

  public async fireEmployee({
    businessState,
    user,
    tx,
  }: {
    businessState: BusinessState;
    user: User;
    tx?: Transaction;
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
    tx?: Transaction;
  }): Promise<
    {
      amount: number;
      fullName: string;
    }[]
  > {
    return await this.dbU.wrapInTransaction(async (tx) => {
      const employedUsers = await this.findAll({ employed: true }, tx);

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
