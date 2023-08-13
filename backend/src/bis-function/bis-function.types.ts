import { BisFunctionType } from 'src/models/bis-function.model';
import Credit from 'src/models/credit.model';
import Equipment from 'src/models/equipment.model';
import Product from 'src/models/product.model';
import ProductionChain from 'src/models/productionChain.model';
import User from 'src/models/user.model';

export interface BisFunctionUpsertDto {
  name: string;
  type: BisFunctionType;
  startPeriod: number;
  endPeriod: number | null;
}

export interface BisFunctionDeleteDto {
  name: string;
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
 *    - TAKE_CREDIT
 *    - takes credit
 */
export interface BisFunctionDto_TAKE_CREDIT extends BisFunctionDto {
  credit: Credit;
}

export interface BisFunctionUpsertDto_TAKE_CREDIT extends BisFunctionUpsertDto {
  creditId: string;
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
 *    - HIRE_EMPLOYEE
 */
export interface BisFunctionDto_HIRE_EMPLOYEE extends BisFunctionDto {
  user: User;
  productionChain: ProductionChain;
}

export interface BisFunctionUpsertDto_HIRE_EMPLOYEE extends BisFunctionDto {
  userId: string;
  productionChainId: string;
}

/**
 * @description
 *    - FIRE_EMPLOYEE
 */
export interface BisFunctionDto_FIRE_EMPLOYEE extends BisFunctionDto {
  user: User;
}

export interface BisFunctionUpsertDto_FIRE_EMPLOYEE extends BisFunctionDto {
  userId: string;
}

/**
 * @description
 *    - PAYOUT_SALARIES
 */
export type BisFunctionDto_PAYOUT_SALARIES = BisFunctionDto;

export type BisFunctionUpsertDto_PAYOUT_SALARIES = BisFunctionDto;

/**
 * @description
 *    - BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT
 *    - amount is the amount of products that should be possible to create from purchased resources
 *
 */
export interface BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionDto {
  productionChain: ProductionChain;
  amount: number;
}

export interface BisFunctionUpsertDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionDto {
  productionChainId: string;
  amount: number;
}

/**
 * @description
 *    - BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT
 *    - amount is the amount of products that should be possible to create from purchased resources
 *
 */
export interface BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionDto {
  productionChain: ProductionChain;
  amount: number;
}

export interface BisFunctionUpsertDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionDto {
  productionChainId: string;
  amount: number;
}

/**
 * @description
 *    - PRODUCE_PRODUCTS
 *    - amount is the amount of products that should be possible to create from purchased resources
 *
 */
export interface BisFunctionDto_PRODUCE_PRODUCTS extends BisFunctionDto {
  productionChain: ProductionChain;
}

export interface BisFunctionUpsertDto_PRODUCE_PRODUCTS extends BisFunctionDto {
  productionChainId: string;
}

/**
 * @description
 *    - SELL_PRODUCT_FIXED
 *
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
