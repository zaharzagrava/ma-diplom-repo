import { ApiProperty } from '@nestjs/swagger';

export class CustomLoginQueryDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  isBody?: boolean;
}

export class JwtPayloadDto {
  @ApiProperty()
  sub: string;
}

export class JwtTokenDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresIn: string | number;
}

export class RefreshDto {
  @ApiProperty()
  refreshToken: string;
}

export class LoginDto {
  @ApiProperty()
  googleIdToken: string;
}

export class LoginRespDto {
  @ApiProperty()
  accessToken: JwtTokenDto;

  @ApiProperty()
  refreshToken: JwtTokenDto;
}
