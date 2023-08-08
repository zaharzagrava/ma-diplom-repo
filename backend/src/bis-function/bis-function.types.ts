import { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';
import Product from 'src/models/product.model';

export interface BisFunctionUpsertDto {
  name: string;
  type: BisFunctionType;
  startPeriod: number;
  endPeriod: number | null;
}

export interface BisFunctionChangeOrderDto {
  name: string;
  dir: 'up' | 'down';
}

export interface BisFunctionDto extends BisFunctionUpsertDto {
  id: string;
  order: number;
}

/**
 * @description
 *    - PAYOUT_CREDIT_FIXED_AMOUNT
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT
  extends BisFunctionDto {
  credit: Credit;
  amount: number;
}

export interface BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT
  extends BisFunctionUpsertDto {
  creditId: string;
  amount: number;
}

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionDto_SELL_PRODUCT_FIXED extends BisFunctionDto {
  product: Product;
  amount: number;
}

export interface BisFunctionUpsertDto_SELL_PRODUCT_FIXED
  extends BisFunctionDto {
  productId: string;
  amount: number;
}

/**
 * @description
 *    - amount is the amount of products that should be possible to create from purchased resources
 *    - from by default is from current period
 *    - to by default is until the last period planned
 */
export interface BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT
  extends BisFunctionDto {
  productId: string;
  amount: number;
}
