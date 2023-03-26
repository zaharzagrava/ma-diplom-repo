export class TimestampsFields {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class IdField {
  id: string;
}

export enum StringifiedBoolean {
  true = 'true',
  false = 'false',
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum Environment {
  local = 'local',
  development = 'development',
  staging = 'staging',
  test = 'test',
  production = 'production',
}

export interface RequestArgs {
  url: string;
  params?: any;
  headers?: any;
  data?: any;
}
