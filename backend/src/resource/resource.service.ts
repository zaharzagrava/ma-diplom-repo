import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import Resource, {
  ResourceScope,
  ResourceWithAllFilters,
} from 'src/models/resource.model';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(
    @InjectModel(Resource)
    private readonly resourceModel: typeof Resource,
  ) {}

  public findAll(
    params?: ResourceWithAllFilters,
    tx?: Transaction,
  ): Promise<Resource[] | null> {
    return this.resourceModel
      .scope({
        method: [ResourceScope.WithAll, <ResourceWithAllFilters>params],
      })
      .findAll({
        transaction: tx,
      });
  }
}
