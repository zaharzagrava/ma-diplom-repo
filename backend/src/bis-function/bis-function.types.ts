import { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';

export interface BisFunctionUpsertDto {
  name: string;
  type: BisFunctionType;
  startPeriod: number;
  endPeriod: number | null;
}

export interface BisFunctionDto extends BisFunctionUpsertDto {
  id: string;
}

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionUpsertDto_PAYOUT_CREDIT_FIXED_AMOUNT
  extends BisFunctionUpsertDto {
  creditId: string;
  amount: number;
}

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT extends BisFunctionDto {
  credit: Credit;
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