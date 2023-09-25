import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IdField, TimestampsFields } from 'src/types';

export class CreateProductionChainDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  productId: string;
}

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

export class UpsertProductionChainDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  productId?: string;

  @ApiProperty()
  equipments: { id: string; amount: number }[];

  @ApiProperty()
  users: { id: string }[];

  @ApiProperty()
  resources: { id: string; amount: number }[];
}
