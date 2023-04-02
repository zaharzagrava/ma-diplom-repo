import { ApiProperty } from '@nestjs/swagger';
import User from 'src/models/user.model';

export class DbCredsDto {
  @ApiProperty()
  port: number;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  database: string;

  @ApiProperty()
  host: string;
}
