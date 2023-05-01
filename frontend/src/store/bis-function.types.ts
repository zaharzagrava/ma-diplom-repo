import { Credit, Product } from "./types";
import * as joi from 'joi';

export enum BisFunctionType {
  PAYOUT_CREDIT_FIXED_AMOUNT = 'PAYOUT_CREDIT_FIXED_AMOUNT',

  // Function that instructs the business to buy that much products that would result in a given amount of goods produced
  BUY_RESOURCE_PRODUCT_FIXED_AMOUNT = 'BUY_RESOURCE_PRODUCT_FIXED_AMOUNT',
  // Function that sells a given amount of products, amount.null for selling all products
  SELL_PRODUCT_FIXED = 'SELL_PRODUCT_FIXED',
  // Function that marks change of the Product / Resource / Equipment change, meta.table defines which price is changed
  CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE = 'CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE',
}

export type BisFunctionSettings = Record<BisFunctionType, {
  customValidation?: (...args: any[]) => any;
  fields: Record<string, {
    label: string;
    validate: joi.AnySchema;
    default: any;
  }>
} | undefined>

export type BisFunctionToEditTransform = Record<BisFunctionType, {
  transform: (bisFunction: BisFunctionDto) => BisFunctionEditDto;
} | undefined>

export interface BisFunctionEditDto {
  name: string;
  type: BisFunctionType;
  startPeriod?: number;
  endPeriod?: number | null;
}

export interface BisFunctionUpsertDto {
  name: string;
  type: BisFunctionType;
  startPeriod: number;
  endPeriod: number | null;
}

export interface BisFunctionDto extends BisFunctionUpsertDto {
  id: string;
  order: number;
}

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT
  extends BisFunctionEditDto {
  creditId?: string;
  amount?: number;
}

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT extends BisFunctionDto {
  credit: Credit;
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

/**
 * @description
 *    - pays out a fixed amount of the credit each period
 */
export interface BisFunctionEditDto_SELL_PRODUCT_FIXED extends BisFunctionDto {
  productId?: string;
  amount?: number;
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
