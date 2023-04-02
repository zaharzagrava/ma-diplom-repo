import { Controller, Post, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  private readonly l = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Post('/seed')
  async syncKpisBonusshares() {
    this.l.log('--- manual sync kpis bonus shares ---');

    await this.adminService.seed();
  }
}
