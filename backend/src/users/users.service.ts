import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './types';
import User, { UserScope } from 'src/models/user.model';
import { ScopeOptions, Transaction } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  public create(user: CreateUserDto): Promise<User> {
    return this.userModel.create(user);
  }

  public getAll(userScopes?: Array<UserScope | ScopeOptions>): Promise<User[]> {
    return this.userModel.scope(userScopes || ['defaultScope']).findAll();
  }

  public async findOne({
    id,
    userScopes,
    tx,
  }: {
    id?: string;
    userScopes?: Array<string | ScopeOptions>;
    tx?: Transaction;
  }): Promise<User | null> {
    return await this.userModel
      .scope(userScopes || ['defaultScope'])
      .findOne<User>({
        where: {
          ...(id !== undefined && { id }),
        },
        transaction: tx,
      });
  }
}
