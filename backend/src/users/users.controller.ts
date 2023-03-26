import { Controller, Get, Logger } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserRawDto } from './types';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly l = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Firewall()
  @Get('/me')
  @ApiResponse({ type: UserRawDto })
  async me(@User() user: UserRawDto): Promise<any> {
    this.l.log('--- /api/users/me ---');

    return await this.usersService.findOne({
      id: user.id,
    });
  }
}
