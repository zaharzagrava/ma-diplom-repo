import { Body, Controller, Delete, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { EntityDeleteDto, EntityUpsertDto } from './types';

@ApiTags('entities')
@Controller('entities')
export class EntitiesController {
  private readonly logger = new Logger(EntitiesController.name);

  constructor(private readonly entitiesService: EntitiesService) {}

  @Get('/')
  public async findAllEntities() {
    // Returns all entities of the business (people, credits, etc.)
    const entities = await this.entitiesService.findAllEntities();

    return entities;
  }

  @Post('/')
  public async upsertEntity(@Body() params: EntityUpsertDto) {
    // Returns all entities of the business (people, credits, etc.)
    return await this.entitiesService.upsert(params);
  }

  // @Delete('/')
  // public async deleteEntity(@Body() params: EntityDeleteDto) {
  //   // Returns all entities of the business (people, credits, etc.)
  //   return await this.entitiesService.delete(params);
  // }
}
