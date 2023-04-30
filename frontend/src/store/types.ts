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

  gender: 'M' | 'F';
  advice: string;

  guarded_email: string | null;
  guarded_first_name: string;
  guarded_last_name: string;
  guarded_phone_number: string | null;

  age: number;
}

export interface ProviderForEnduser {
  id: string;

  name: string;
  address: string;
  email: string;
  phone_number: string;
  website: string;

  description: string;
}

export enum NavigationTabOption {
  DASHBOARD = 'dashboard',
  SETTINGS = 'settings',
  SERVICES = 'services',
  BLOG = 'blog',
  ABOUT_US = 'about-us',
  CONTACT_US = 'contact-us',
  LOG_OUT = 'log-out',
}



export interface BisMetriscDto {
  balance: { balance: number; period: number}[]
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


export type CreateErrorObject<T extends { [key: string]: any }> = {
  [actionName in keyof T]?: string | string[];
};
