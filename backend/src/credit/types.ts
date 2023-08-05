import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IdField, TimestampsFields } from 'src/types';

export class CreateProductDto {
  @ApiProperty()
  period: number;

  @ApiProperty()
  closedAt: Date | null;
}

export class ProductDto extends IntersectionType(
  IntersectionType(CreateProductDto, TimestampsFields),
  IdField,
) {}
