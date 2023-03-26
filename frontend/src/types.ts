/* General Types */
export enum ServiceType {
  SUPPORT_SERVICES = 'SUPPORT_SERVICES',
  HOME_IMPROVEMENTS = 'HOME_IMPROVEMENTS',
  IN_HOME_SUPPORT = 'IN_HOME_SUPPORT',
  IN_HOME_CARE = 'IN_HOME_CARE',
  TECH_SUPPORT = 'TECH_SUPPORT',
}

export enum GuardianType {
  RELATIVE = 'RELATIVE',
  TRUSTEE = 'TRUSTEE',
}

export enum GeneralNeeds {
  TRANSPORTATION = 'TRANSPORTATION',
  HEALTHCARE_SUPPORT = 'HEALTHCARE_SUPPORT',
  TECHNOLOGY_SUPPORT = 'TECHNOLOGY_SUPPORT',
  SHOPPING = 'SHOPPING',
  GENERAL_CAREGIVING = 'GENERAL_CAREGIVING',
  COMPANIONSHIP = 'COMPANIONSHIP',
  FOOD_SUPPORT = 'FOOD_SUPPORT',
}

export enum ServiceSubType {
  HOUSE_CLEANING = 'HOUSE_CLEANING',
  YARD_CLEANING = 'YARD_CLEANING',
  SINGLE_ROOM = 'SINGLE_ROOM',
  ATTIC_CLEANING = 'ATTIC_CLEANING',
}

export enum SettingsOption {
  ACCOUNT = 'ACCOUNT',
  PASSWORD = 'PASSWORD',
  HELP = 'HELP',
}


export interface AdminDB {
  id: string;
  email: string;
  password: string;
}

export interface EnduserDB {
  id: string;

  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  avatar: string | null;

  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  gender: 'M' | 'F';
  special_needs: string[];
  general_needs: GeneralNeeds[];
  advice: string | null;

  guardian_type: GuardianType | null;

  guarded_email: string | null;
  /**
   * Always stores first name of the person being guarded,
   * whether it the same person as account manager or different
   */
  guarded_first_name: string;
  /**
   * Always stores last name of the person being guarded,
   * whether it the same person as account manager or different
   */
  guarded_last_name: string;
  guarded_phone_number: string | null;

  age: number;
  confirmed_at: string | null;
  created_at: string;
}

export interface ProviderDB {
  id: string;

  name: string;
  email: string;
  password: string;
  website: string;
  phone_number: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  contact_full_name: string;
  contact_phone_number: string;
  contact_email: string;

  description: string;
  confirmed_at: string | null;
  created_at: string;
}

export interface ProviderServiceDB {
  id: string;
  provider_id: string;
  service_id: string;
}

export interface ServiceDB {
  id: string;

  service_type: ServiceType;

  description: string | null;
  price: number | null;

  created_at: string;
}

export type TableDB = EnduserDB | ProviderDB | ServiceDB | ProviderServiceDB | AdminDB;

export enum EnduserFields {
  id = 'id',

  email = 'email',
  password = 'password',
  first_name = 'first_name',
  last_name = 'last_name',
  phone_number = 'phone_number',
  avatar = 'avatar',

  address = 'address',
  city = 'city',
  state = 'state',
  country = 'country',
  postal_code = 'postal_code',

  gender = 'gender',
  special_needs = 'special_needs',
  general_needs = 'general_needs',
  advice = 'advice',

  guardian_type = 'guardian_type',

  guarded_email = 'guarded_email',
  guarded_first_name = 'guarded_first_name',
  guarded_last_name = 'guarded_last_name',
  guarded_phone_number = 'guarded_phone_number',

  age = 'age',
  confirmed_at = 'confirmed_at',
  created_at = 'created_at',
}

export enum ProviderFields {
  id = 'id',

  name = 'name',
  email = 'email',
  password = 'password',
  website = 'website',
  phone_number = 'phone_number',

  address = 'address',
  city = 'city',
  state = 'state',
  country = 'country',
  postal_code = 'postal_code',

  contact_full_name = 'contact_full_name',
  contact_phone_number = 'contact_phone_number',
  contact_email = 'contact_email',

  description = 'description',
  confirmed_at = 'confirmed_at',
  created_at = 'created_at',
}

export enum ServiceFields {
  id = 'id',

  service_type = 'service_type',

  description = 'description',
  price = 'price',

  created_at = 'created_at',
}

export enum ProviderServiceFields {
  id = 'id',

  provider_id = 'provider_id',
  service_id = 'service_id',
}

export enum AdminFields {
  id = 'id',

  email = 'email',
  password = 'password',
}

export function isProviderFields(tableFields: TableFields): tableFields is ProviderFields {
  if (Object.values(tableFields).length !== Object.values(ProviderFields).length) return false;

  return Object.values(ProviderFields).filter((providerField) => !tableFields.includes(providerField)).length === 0;
}

export function isServiceFields(tableFields: TableFields): tableFields is ServiceFields {
  if (Object.values(tableFields).length !== Object.values(ServiceFields).length) return false;

  return Object.values(ServiceFields).filter((serviceField) => !tableFields.includes(serviceField)).length === 0;
}

export function isProviderServiceFields(tableFields: TableFields): tableFields is ProviderServiceFields {
  if (Object.values(tableFields).length !== Object.values(ProviderServiceFields).length) return false;

  return Object.values(ProviderServiceFields).filter((providerServiceField) => !tableFields.includes(providerServiceField)).length === 0;
}

export function isEnduserFields(tableFields: TableFields): tableFields is EnduserFields {
  if (Object.values(tableFields).length !== Object.values(EnduserFields).length) return false;

  return Object.values(EnduserFields).filter((enduserField) => !tableFields.includes(enduserField)).length === 0;
}

export type TableFields = EnduserFields | ProviderFields | ServiceFields | ProviderServiceFields | AdminFields;

/** GraphQL enums */
export enum ProviderGraphQLFields {
  service_provided = 'service_provided',
}

/* Front Types */
export type EnduserDT = EnduserDB & {
  is_guardian: 'yes' | null;
};

export type ProviderDT = ProviderDB & {
  service_provided: ServiceDB;
};

export interface CreditCardInfo {
  number: string;
  expiration_date: string;
  cvc: string;
}

/* Form Types */
export type CreateErrorObject<T extends { [key: string]: any }> = {
  [actionName in keyof T]?: string | string[];
};

export enum LoginFields {
  EMAIL = 'email',
  PASSWORD = 'password',
}

export interface LoginValues {
  email: string;
  password: string;
}

export enum EnduserRegisterFields {
  // yes means that enduser is a guardian, null means they are not
  IS_GUARDIAN = 'is_guardian',

  PAYMENT_TYPE = 'payment_type',
  CREDIT_CARD = 'credit_card',

  EMAIL = 'email',
  PASSWORD = 'password',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  PHONE_NUMBER = 'phone_number',

  ADDRESS = 'address',
  CITY = 'city',
  STATE = 'state',
  COUNTRY = 'country',
  POSTAL_CODE = 'postal_code',

  GENDER = 'gender',
  GENERAL_NEEDS = 'general_needs',
  SPECIAL_NEEDS = 'special_needs',
  ADVICE = 'advice',

  GUARDIAN_TYPE = 'guardian_type',

  GUARDED_EMAIL = 'guarded_email',
  GUARDED_FIRST_NAME = 'guarded_first_name',
  GUARDED_LAST_NAME = 'guarded_last_name',
  GUARDED_PHONE_NUMBER = 'guarded_phone_number',

  AGE = 'age',
}

export type PostEnduserValues = Omit<EnduserDB, '' | 'id' | 'avatar' | 'created_at' | 'confirmed_at'> & {
  is_guardian: 'yes' | null;

  payment_type: 'visa' | 'mastercard' | 'paypal' | 'stripe'; // only frontend is implemented
  credit_card: CreditCardInfo; // only frontend is implemented
};

export type AdminPostPutAdminValues = Omit<AdminDB, 'id' | 'password'> & {
  password: string | null;
};

export type AdminPostPutEnduserValues = Omit<EnduserDB, 'id' | 'password' | 'avatar' | 'confirmed_at' | 'created_at'> & {
  password: string | null;
  is_guardian: 'yes' | null;
  confirmed_at: Date | null;
  created_at: Date;
};

export type AdminPostPutProviderValues = Partial<Omit<ProviderDB, 'id' | 'password' | 'confirmed_at' | 'created_at'> & {
  password: string | null;
  confirmed_at: Date | null;
  created_at: Date;
  service_provided_service_type: ServiceType;
  service_provided_description: string | null;
  service_provided_price: number | null;
  service_provided_created_at: Date;
}>;

export type AdminPostPutServiceValues = Omit<ServiceDB, 'id' | 'password' | 'created_at'> & {
  password?: string;
  created_at: Date;
};

export type AdminPostPutProviderServiceValues = Omit<ProviderServiceDB, 'id'>;

export type PostProviderValues = Omit<ProviderDB, 'id' | 'confirmed_at' | 'created_at'> & {
  service_provided_service_type: ServiceType;
};

export interface EnterEmailValues {
  email: string;
}

export enum ChangePasswordFields {
  NEW_PASSWORD = 'new_password',
  NEW_PASSWORD_REPEAT = 'new_password_repeat',
}

export interface ChangePasswordValues {
  new_password: string;
  new_password_repeat: string;
}

export enum SubscriptionFields {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL = 'email',
}

export interface SubscriptionValues {
  first_name: string;
  last_name: string;
  email: string;
}

export enum ContactUsFields {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL = 'email',
  TEXT = 'text',
}

export interface ContactUsValues {
  first_name: string;
  last_name: string;
  email: string;
  text: string;
}

export interface PutEnduserValues {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  gender: 'M' | 'F';

  age: number;
}

export enum CurrPasswordField {
  CURR_PASSWORD = 'curr_password',
}

export const ChangePasswordByCurrPasswordFields = { ...CurrPasswordField, ...ChangePasswordFields };

export type ChangePasswordByCurrPasswordValues = {
  curr_password: string;
} & ChangePasswordValues;

export enum ProviderViewFields {
  SUBSERVICE_TYPE = 'subserviceType',
  PROVIDER_INDEX = 'providerIndex',
}

export interface ProviderViewValues {
  providerIndex: string;
  subserviceType: ServiceSubType;
}

export type Order = 'asc' | 'desc';

/* Constants types */

export enum TableKebabName {
  enduser = 'enduser',
  provider = 'provider',
  service = 'service',
  admin = 'admin',

  providerService = 'provider-service',
}

export enum TableName {
  enduser = 'enduser',
  provider = 'provider',
  service = 'service',
  admin = 'admin',

  providerService = 'providerService',
}

export enum TableCamelName {
  Enduser = 'Enduser',
  Provider = 'Provider',
  Service = 'Service',
  Admin = 'Admin',

  ProviderService = 'ProviderService',
}

export interface TableInfo {
  tableKebabName: TableKebabName;
  tableName: TableName;
  tableCamelName: TableCamelName;
  label: string;
  description: string;
  columns: {
    id: TableFields;
    label: string;
  }[]
}

/* View Types */
