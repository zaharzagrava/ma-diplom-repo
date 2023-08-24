import { Credit, FormFieldType, Product, ProductionChain, User } from "./types";
import * as joi from 'joi';

export enum BisFunctionType {
  // Take a credit
  TAKE_CREDIT = 'TAKE_CREDIT',
  // Pays out a fixed amount of credit sum
  PAYOUT_CREDIT_FIXED_AMOUNT = 'PAYOUT_CREDIT_FIXED_AMOUNT',

  // (Re)Hire 1 employee to 1 ProductionChain, one employee can only be assigned to 1 ProdutionChain at the same time
  HIRE_EMPLOYEE = 'HIRE_EMPLOYEE',
  // Fire an employee, making him inactive. Inactive employees do not receive salaries
  FIRE_EMPLOYEE = 'FIRE_EMPLOYEE',
  // Payout salaries to all active employees
  PAYOUT_SALARIES = 'PAYOUT_SALARIES',

  // Buy enough resources to produce X products in one period
  BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT = 'BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT',
  // Buy enough equipment to produce X products in one period
  BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT = 'BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT',
  // Produce goods according to instructions of the given ProductionChain
  PRODUCE_PRODUCTS = 'PRODUCE_PRODUCTS',
  // Function that sells a given amount of products, amount.null for selling all products
  SELL_PRODUCT_FIXED = 'SELL_PRODUCT_FIXED',

  // Function that marks change of the Product / Resource / Equipment change, meta.table defines which price is changed
  CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE = 'CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE',
}

export interface BisFunctionTypeDescDto {
  label: string;
  type: BisFunctionType;
  description?: string;
}

export const bisFunctionTypes: BisFunctionTypeDescDto[] = [
  {
    label: 'Credit: Tale',
    type: BisFunctionType.TAKE_CREDIT,
    description: `Takes a given credit, icnreases balance by the sum, and starts paying out interest from the same period`
  },
  {
    label: 'Credit: Payout',
    type: BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT,
    description: `Pays out a fixed amount of credit sum`
  },
  {
    label: 'User: Hire',
    type: BisFunctionType.HIRE_EMPLOYEE,
    description: `(Re)Hire 1 employee to 1 ProductionChain, one employee can only be assigned to 1 ProdutionChain at the same time`
  },
  {
    label: 'User: Fire',
    type: BisFunctionType.FIRE_EMPLOYEE,
    description: `Fire an employee, making him inactive. Inactive employees do not receive salaries`
  },
  {
    label: 'User: Payout salaries',
    type: BisFunctionType.PAYOUT_SALARIES,
    description: `Payout salaries to all active employees`
  },
  {
    label: 'Resource: buy enough for X products',
    type: BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
    description: `Buy enough resources to produce X products in one period`
  },
  {
    label: 'Eqipment: buy enough for X products',
    type: BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
    description: `Buy enough equipment to produce X products in one period`
  },
  {
    label: 'Product: produce',
    type: BisFunctionType.PRODUCE_PRODUCTS,
    description: `Produce goods according to instructions of the given Production Chain`
  },
  {
    label: 'Product: Sell fixed amount',
    type: BisFunctionType.SELL_PRODUCT_FIXED,
  },
];

export type BisFunctionSettings = Record<BisFunctionType, {
  customValidation?: (...args: any[]) => any;
  fields: Record<string, {
    type: FormFieldType;
    label: string;
    placeholder?: string;
    validate: joi.AnySchema;
    default: any;
  }>
} | undefined>

export type BisFunctionToEditTransform = Record<BisFunctionType, {
  transform: (bisFunction: BisFunctionDto) => BisFunctionEditDto;
} | undefined>

export interface BisFunctionDto extends BisFunctionUpsertDto {
  id: string;
  order: number;
}

export interface BisFunctionEditDto {
  name?: string;
  type: BisFunctionType;
  startPeriod?: number;
  endPeriod?: number | null;
}

export interface BisFunctionChangeOrderDto {
  name: string;
  dir: 'up' | 'down';
}

export interface BisFunctionDeleteDto {
  name: string;
}

export interface BisFunctionUpsertDto {
  name: string;
  type: BisFunctionType;
  startPeriod: number;
  endPeriod: number | null;
}


/**
 * @description
 *    - TAKE_CREDIT
 *    - takes credit
 */
export interface BisFunctionDto_TAKE_CREDIT extends BisFunctionDto {
  credit: Credit;
}

export interface BisFunctionEditDto_TAKE_CREDIT extends BisFunctionEditDto {
  creditId?: string;
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

export interface BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT
  extends BisFunctionEditDto {
  creditId?: string;
  amount?: number;
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

export interface BisFunctionEditDto_HIRE_EMPLOYEE extends BisFunctionEditDto {
  userId?: string;
  productionChainId?: string;
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

export interface BisFunctionEditDto_FIRE_EMPLOYEE extends BisFunctionEditDto {
  userId?: string;
}

export interface BisFunctionUpsertDto_FIRE_EMPLOYEE extends BisFunctionDto {
  userId: string;
}

/**
 * @description
 *    - PAYOUT_SALARIES
 */
export type BisFunctionDto_PAYOUT_SALARIES = BisFunctionDto;

export type BisFunctionEditDto_PAYOUT_SALARIES = BisFunctionEditDto;

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

export interface BisFunctionEditDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionEditDto {
  productionChainId?: string;
  amount?: number;
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

export interface BisFunctionEditDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT
  extends BisFunctionEditDto {
  productionChainId?: string;
  amount?: number;
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

export interface BisFunctionEditDto_PRODUCE_PRODUCTS extends BisFunctionEditDto {
  productionChainId?: string;
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

export interface BisFunctionEditDto_SELL_PRODUCT_FIXED extends BisFunctionEditDto {
  productId?: string;
  amount?: number;
}

export interface BisFunctionUpsertDto_SELL_PRODUCT_FIXED
  extends BisFunctionDto {
  productId: string;
  amount: number;
}
