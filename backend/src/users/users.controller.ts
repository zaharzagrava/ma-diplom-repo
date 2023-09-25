import { Controller, Get, Logger } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Firewall } from 'src/auth/decorators/firewall.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UsersDbService } from 'src/users-db/users-db.service';
import { UserRawDto } from './types';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly l = new Logger(UsersController.name);

  constructor(private readonly usersDbService: UsersDbService) {}

  @Firewall() // Виклик декоратору для ендпоінту
  @Get('/me')
  @ApiResponse({ type: UserRawDto })
  async me(@User() user: UserRawDto): Promise<any> {
    this.l.log('--- /api/users/me ---');

    return await this.usersDbService.findOne({
      id: user.id,
    });
  }
}
