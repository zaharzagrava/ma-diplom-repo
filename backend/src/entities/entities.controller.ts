import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';

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
}
