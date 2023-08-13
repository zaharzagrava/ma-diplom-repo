import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { CreditService } from 'src/credit/credit.service';
import { ResourceService } from 'src/resource/resource.service';
import { UsersService } from 'src/users/users.service';
import { ProductionChainService } from 'src/production-chain/production-chain.service';

@Injectable()
export class EntitiesService {
  private readonly logger = new Logger(EntitiesService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly creditService: CreditService,
    private readonly resourceService: ResourceService,
    private readonly usersService: UsersService,
    private readonly productionChainService: ProductionChainService,
  ) {}

  public async findAllEntities() {
    const entities = await Promise.all([
      this.productService.findAll(),
      this.resourceService.findAll(),
      this.creditService.findAll(),
      this.usersService.findAll(),
      this.productionChainService.findAll(),
    ]);

    return {
      products: entities[0],
      resources: entities[1],
      credits: entities[2],
      users: entities[3],
      productionChains: entities[4],
    };
  }
}
