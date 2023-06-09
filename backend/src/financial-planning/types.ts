import { IntersectionType } from '@nestjs/swagger';
import { IdField, TimestampsFields } from 'src/types';

export class CreateUserDto {
  email: string;

  fullName: string;

  country: string;

  city: string;

  designation: string;

  departmentId: string;
}

export interface PlanDto {
  from?: number;
  to?: number;
}

/**
 * @description - user with no related info attached
 */
export class UserRawDto extends IntersectionType(
  IntersectionType(CreateUserDto, TimestampsFields),
  IdField,
) {}
