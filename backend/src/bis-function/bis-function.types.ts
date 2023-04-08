import { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';

export interface BisFunctionDto {
  id: string;
  name: string;
  type: BisFunctionType;
  period?:
    | number
    | {
        from?: number;
        to?: number;
      };
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
