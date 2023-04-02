import { Controller, Get, Logger } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserRawDto } from './types';
import { FinancialPlanningService } from './financial-planning.service';

@ApiTags('users')
@Controller('users')
export class FinancialPlanningController {
  private readonly l = new Logger(FinancialPlanningController.name);

  constructor(
    private readonly financialPlanningService: FinancialPlanningService,
  ) {}

  @Firewall()
  @Get('/me')
  @ApiResponse({ type: UserRawDto })
  async me(@User() user: UserRawDto): Promise<any> {
    this.l.log('--- /api/users/me ---');

    return await this.financialPlanningService.plan({
      params: {
        from: 202201,
        to: 202301,
      },
    });
  }
}
