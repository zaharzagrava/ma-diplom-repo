import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/models/user.model';

export enum EntityUpsertType {
  USER = 'USER',
  CREDIT = 'CREDIT',
  EQUIPMENT = 'EQUIPMENT',
  PRODUCT = 'PRODUCT',
  RESOURCE = 'RESOURCE',
}

export class EntityDeleteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  __type__: EntityUpsertType;
}

export type EntityUpsertDto =
  | UserUpsertDto
  | CreditUpsertDto
  | EquipmentUpsertDto
  | ProductUpsertDto
  | ResourceUpsertDto;

export class UserUpsertDto {
  __type__: EntityUpsertType.USER;
  email: string;
  fullName: string;
  type: UserType;
  salary: number;
  employedAt: number | null;
}

export class CreditUpsertDto {
  __type__: EntityUpsertType.CREDIT;
  name: string;
  sum: number;
  rate: number;
  startPeriod: number | null;
}

export class EquipmentUpsertDto {
  __type__: EntityUpsertType.EQUIPMENT;
  name: string;
  price: number;
  amount: number;
}

export class ProductUpsertDto {
  __type__: EntityUpsertType.PRODUCT;
  name: string;
  price: number;
  amount: number;
}

export class ResourceUpsertDto {
  __type__: EntityUpsertType.RESOURCE;
  name: string;
  price: number;
  amount: number;
}
