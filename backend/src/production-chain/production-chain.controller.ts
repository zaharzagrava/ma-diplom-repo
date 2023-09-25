import { Body, Controller, Logger, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { ProductionChainService } from './production-chain.service';
import { UpsertProductionChainDto } from './types';

@ApiTags('production-chain')
@Controller('production-chain')
export class ProductionChainController {
  private readonly l = new Logger(ProductionChainController.name);

  constructor(
    private readonly productionChainService: ProductionChainService,
  ) {}

  @Firewall() // Виклик декоратору для ендпоінту
  @Put('/')
  @ApiResponse({ type: UpsertProductionChainDto })
  async me(@Body() user: UpsertProductionChainDto): Promise<any> {
    this.l.log('--- PUT /api/production-chain ---');

    return await this.productionChainService.upsert(user);
  }
}
