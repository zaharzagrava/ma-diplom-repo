import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { CreditService } from 'src/credit/credit.service';
import { ResourceService } from 'src/resource/resource.service';

@Injectable()
export class EntitiesService {
  private readonly logger = new Logger(EntitiesService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly creditService: CreditService,
    private readonly resourceService: ResourceService,
  ) {}

  public async findAllEntities() {
    const entities = await Promise.all([
      this.productService.findAll(),
      this.resourceService.findAll(),
      this.creditService.findAll(),
    ]);

    return {
      products: entities[0],
      resources: entities[1],
      credits: entities[2],
    };
  }
}
