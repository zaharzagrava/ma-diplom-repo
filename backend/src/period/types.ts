import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IdField, TimestampsFields } from 'src/types';

export class CreatePeriodDto {
  @ApiProperty()
  period: number;

  @ApiProperty()
  closedAt: Date | null;
}

export class PeriodDto extends IntersectionType(
  IntersectionType(CreatePeriodDto, TimestampsFields),
  IdField,
) {}

export interface QuarterRange {
  end: number;
  start: number;
}
