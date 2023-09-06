import { EntityUpsertType } from "../containers/EntityUpsert/types";

/**
 * Data types that are result of frontend quires
 * @description Stored in redux. Serve as single source of truth about data
 * on frontend. Are different from view data types, that are transformed version
 * of these data types, user for showing data
 */
export interface Myself {
  id: string;

  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar: string | null;

  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  gender: "M" | "F";
  advice: string;

  guarded_email: string | null;
  guarded_first_name: string;
  guarded_last_name: string;
  guarded_phone_number: string | null;

  age: number;
}

export enum FormFieldType {
  DROPDOWN = 'DROPDOWN',
  STRING = 'STRING',
  PERIOD = 'PERIOD'
}

export enum UserType {
  // Швея
  SEAMSTRESS = 'SEAMSTRESS',
  // Закройщик
  CUTTER = 'CUTTER',
  // Закройщик
  MANAGER = 'MANAGER',
}

export const UserTypes = Object.values(UserType);

export interface BisMetriscDto {
  balance: { balance: number; period: number; prompts: string[] }[];
}

export interface User {
  __type__: EntityUpsertType.USER;
  id: string;
  email: string;
  fullName: string;
  type: UserType;
  salary: number;
  employedAt: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Credit {
  __type__: EntityUpsertType.CREDIT;
  id: string;
  name: string;
  sum: number;
  rate: number;
  startPeriod: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Equipment {
  __type__: EntityUpsertType.EQUIPMENT;
  id: string;
  name: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  __type__: EntityUpsertType.PRODUCT;
  id: string;
  name: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  __type__: EntityUpsertType.RESOURCE;
  id: string;
  name: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  // __type__: EntityUpsertType.BUSINESS;
  id: string;
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionChain {
  id: string;
  name: string;
  productId: string;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export type Entity = Credit | Product | Resource | User | Business | ProductionChain;

export type EntityUpsertable = Credit | Product | Resource | User | Equipment;

export interface Entities {
  credits: Credit[];
  products: Product[];
  resources: Resource[];
  users: User[];
  equipment: Equipment[];
  productionChains: ProductionChain[];
}

export interface EntitiesUpsertable {
  products: Product[];
  resources: Resource[];
  credits: Credit[];
  users: User[];
  equipment: Equipment[];
}

export type CreateErrorObject<T extends { [key: string]: any }> = {
  [actionName in keyof T]?: string | string[];
};
