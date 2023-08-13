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

export interface Credit {
  id: string;
  name: string;
  sum: number;
  rate: number;
  startPeriod: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  name: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
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

export interface ProductionChain {
  id: string;
  name: string;
  productId: string;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export type Entity = Credit | Product | Resource | User | ProductionChain;

export interface Entities {
  products: Product[];
  resources: Resource[];
  credits: Credit[];
  users: User[];
  productionChains: ProductionChain[];
}

export type CreateErrorObject<T extends { [key: string]: any }> = {
  [actionName in keyof T]?: string | string[];
};
