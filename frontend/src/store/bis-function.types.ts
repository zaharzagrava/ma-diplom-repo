import { Credit } from "./types";

export enum BisFunctionType {
  PAYOUT_CREDIT_FIXED_AMOUNT = 'PAYOUT_CREDIT_FIXED_AMOUNT',

  // Function that instructs the business to buy that much products that would result in a given amount of goods produced
  BUY_RESOURCE_PRODUCT_FIXED_AMOUNT = 'BUY_RESOURCE_PRODUCT_FIXED_AMOUNT',
}

export interface BisFunctionDto {
  id: string;
  name: string;
  type: BisFunctionType;
  period?: number | {
    from?: number;
    to?: number;
  };
}

/**
 * @description
 *    - pays out a fixed amount of the credit
 */
export interface BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT extends BisFunctionDto {
  credit: Credit;
  amount: number;
  from?: number;
  to?: number;
}

/**
 * @description
 *    - amount is the amount of products that should be possible to create from purchased resources
 *    - from by default is from current period
 *    - to by default is until the last period planned
 */
export interface BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT extends BisFunctionDto  {
  productId: string;
  amount: number;
  from?: number;
  to?: number;
}
