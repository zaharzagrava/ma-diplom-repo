import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { PlanDto, UserRawDto } from './types';
import { FinancialPlanningService } from './financial-planning.service';

@ApiTags('fin-planning')
@Controller('fin-planning')
export class FinancialPlanningController {
  private readonly l = new Logger(FinancialPlanningController.name);

  constructor(
    private readonly financialPlanningService: FinancialPlanningService,
  ) {}

  @Firewall()
  @Post('/')
  @ApiResponse({ type: UserRawDto })
  async plan(@User() user: UserRawDto, @Body() plan: PlanDto): Promise<any> {
    this.l.log('--- /api/fin-planning/plan ---');

    return await this.financialPlanningService.plan({
      params: {
        from: plan.from,
        to: plan.to,
      },
    });
  }
}
