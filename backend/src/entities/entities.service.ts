import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { CreditService } from 'src/credit/credit.service';
import { ResourceService } from 'src/resource/resource.service';
import { UsersService } from 'src/users/users.service';
import { ProductionChainService } from 'src/production-chain/production-chain.service';
import { EntityDeleteDto, EntityUpsertDto, EntityUpsertType } from './types';
import { EquipmentService } from 'src/equipment/equipment.service';

@Injectable()
export class EntitiesService {
  private readonly logger = new Logger(EntitiesService.name);

  constructor(
    private readonly productService: ProductService,
    private readonly creditService: CreditService,
    private readonly equipmentService: EquipmentService,
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
      this.equipmentService.findAll(),
    ]);

    // TODO: add __type__ property to differentiate
    // TODO: add all types
    return {
      products: entities[0],
      resources: entities[1],
      credits: entities[2],
      users: entities[3],
      productionChains: entities[4],
      equipment: entities[5],
    };
  }

  public async upsert(entityUpsert: EntityUpsertDto) {
    let resp: any;
    switch (entityUpsert.__type__) {
      case EntityUpsertType.USER:
        resp = await this.usersService.upsert(entityUpsert);
        resp = resp.get({ plain: true });
        resp.__type__ = EntityUpsertType.USER;
        return resp;
      case EntityUpsertType.CREDIT:
        resp = await this.creditService.upsert(entityUpsert);
        resp = resp.get({ plain: true });
        resp.__type__ = EntityUpsertType.CREDIT;
        return resp;
      case EntityUpsertType.EQUIPMENT:
        resp = await this.equipmentService.upsert(entityUpsert);
        resp = resp.get({ plain: true });
        resp.__type__ = EntityUpsertType.EQUIPMENT;
        return resp;
      case EntityUpsertType.PRODUCT:
        resp = await this.productService.upsert(entityUpsert);
        resp = resp.get({ plain: true });
        resp.__type__ = EntityUpsertType.PRODUCT;
        return resp;
      case EntityUpsertType.RESOURCE:
        resp = await this.resourceService.upsert(entityUpsert);
        resp = resp.get({ plain: true });
        resp.__type__ = EntityUpsertType.RESOURCE;
        return resp;
    }
  }

  // public async delete(entityDelete: EntityDeleteDto) {
  //   switch (entityDelete.__type__) {
  //     case EntityUpsertType.USER:
  //       return await this.usersService.delete(entityDelete);
  //     case EntityUpsertType.CREDIT:
  //       return await this.creditService.delete(entityDelete);
  //     case EntityUpsertType.EQUIPMENT:
  //       return await this.equipmentService.delete(entityDelete);
  //     case EntityUpsertType.PRODUCT:
  //       return await this.productService.delete(entityDelete);
  //     case EntityUpsertType.RESOURCE:
  //       return await this.resourceService.delete(entityDelete);
  //   }
  // }
}
