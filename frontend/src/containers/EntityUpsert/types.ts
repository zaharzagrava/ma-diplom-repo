import Joi from "joi";
import { Entities, EntitiesUpsertable, EntityUpsertable, FormFieldType, UserType } from "../../store/types";

export enum EntityUpsertType {
  USER = "USER",
  CREDIT = "CREDIT",
  EQUIPMENT = "EQUIPMENT",
  PRODUCT = "PRODUCT",
  RESOURCE = "RESOURCE",
}

export const upsertTypeToKey = (entityUpsertType: EntityUpsertType): keyof EntitiesUpsertable => {
  switch(entityUpsertType) {
    case EntityUpsertType.USER: return 'users';
    case EntityUpsertType.CREDIT: return 'credits';
    case EntityUpsertType.EQUIPMENT: return 'equipment';
    case EntityUpsertType.PRODUCT: return 'products';
    case EntityUpsertType.RESOURCE: return 'resources';
  }
}

export const upsertTypeToHeader = (entityUpsertType: EntityUpsertType): string => {
  switch(entityUpsertType) {
    case EntityUpsertType.USER: return 'Користувачі';
    case EntityUpsertType.CREDIT: return 'Кредити';
    case EntityUpsertType.EQUIPMENT: return 'Обладнання';
    case EntityUpsertType.PRODUCT: return 'Продукти';
    case EntityUpsertType.RESOURCE: return 'Ресурси';
  }
}

export type EntityUpsertSettings = Record<
    EntityUpsertType,
    | {
        customValidation?: (...args: any[]) => any;
        fields: Record<
          string,
          {
            type: FormFieldType;
            label: string;
            placeholder?: string;
            validate: Joi.AnySchema;
            default: any;
          }
        >;
      }
    | undefined
  >;

export type EntityEditDto =
  | UserEditDto
  | CreditEditDto
  | EquipmentEditDto
  | ProductEditDto
  | ResourceEditDto;

export type EntityUpsertDto =
  | UserUpsertDto
  | CreditUpsertDto
  | EquipmentUpsertDto
  | ProductUpsertDto
  | ResourceUpsertDto;

export interface UserEditDto {
  __type__: EntityUpsertType.USER;
  email?: string;
  fullName?: string;
  type?: UserType;
  salary?: string;
  employedAt?: number | null;
}

export interface UserUpsertDto {
  __type__: EntityUpsertType.USER;
  email: string;
  fullName: string;
  type: UserType;
  salary: number;
  employedAt: number | null;
}

export interface CreditEditDto {
  __type__: EntityUpsertType.CREDIT;
  name?: string;
  sum?: string;
  rate?: string;
  startPeriod?: number | null;
}

export interface CreditUpsertDto {
  __type__: EntityUpsertType.CREDIT;
  name: string;
  sum: number;
  rate: number;
  startPeriod: number | null;
}

export interface EquipmentEditDto {
  __type__: EntityUpsertType.EQUIPMENT;
  name?: string;
  price?: string;
  amount?: string;
}

export interface EquipmentUpsertDto {
  __type__: EntityUpsertType.EQUIPMENT;
  name: string;
  price: number;
  amount: number;
}

export interface ProductEditDto {
  __type__: EntityUpsertType.PRODUCT;
  name?: string;
  price?: string;
  amount?: string;
}

export interface ProductUpsertDto {
  __type__: EntityUpsertType.PRODUCT;
  name: string;
  price: number;
  amount: number;
}

export interface ResourceEditDto {
  __type__: EntityUpsertType.RESOURCE;
  name?: string;
  price?: string;
  amount?: string;
}

export interface ResourceUpsertDto {
  __type__: EntityUpsertType.RESOURCE;
  name: string;
  price: number;
  amount: number;
}

interface BusinessEditDto {
  // __type__: EntityUpsertType.BUSINESS;
  name?: string;
  balance?: string;
}

interface BusinessUpsertDto {
  // __type__: EntityUpsertType.BUSINESS;
  name: string;
  balance: number;
}
