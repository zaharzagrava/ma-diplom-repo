import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { EnvConfig } from './types';
import { ConfigUtilsService } from 'src/utils/config-utils/config-utils.service';

dotenv.config({
  /**
   * This path is relative to /backend/src/config/config.ts file
   *    - in test / local we get .env from backend folder
   *    - in other environments we dont use .env file, instead we use env variables
   *      provided by Elastic Beanstalk + we combine them with secrets provided
   *      from AWS Secrets Manager. Our gitlab deployment machine has a role that
   *      allows it to read from AWS Secrets Manager, so no aws api keys should
   *      be provided for it
   */
  path: path.resolve(
    __dirname,
    (() => {
      switch (process.env.NODE_ENV) {
        case 'test':
          return '../../.test.env';
        case 'local':
          return '../../.env';
        default:
          return '../.env';
      }
    })(),
  ),
});

@Injectable()
export class ApiConfigService {
  protected config: EnvConfig;

  constructor(private readonly configUtilsService: ConfigUtilsService) {}

  public get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.config[key];
  }

  public async init() {
    const localConfigValues: EnvConfig =
      this.configUtilsService.parseSrc<EnvConfig>(
        {
          node_env: {
            name: 'NODE_ENV',
            verify: joi
              .string()
              .valid('local', 'staging', 'development', 'production', 'test')
              .required(),
          },

          port: {
            verify: joi.number().positive().required(),
            name: 'PORT',
            postProcess: (v: string) => Number(v),
          },

          db_port: {
            verify: joi.number().positive().required(),
            name: 'DB_PORT',
          },
          db_password: {
            verify: joi.string().required(),
            name: 'DB_PASSWORD',
          },
          db_username: {
            verify: joi.string().required(),
            name: 'DB_USERNAME',
          },
          db_name: {
            verify: joi.string().required(),
            name: 'DB_NAME',
          },
          db_host: {
            verify: joi.string().required(),
            name: 'DB_HOST',
          },

          firebase_client_email: {
            verify: joi.string().required(),
            name: 'FIREBASE_CLIENT_EMAIL',
          },
          firebase_private_key: {
            verify: joi.string().required(),
            name: 'FIREBASE_PRIVATE_KEY',
            postProcess: (v: any) => v?.replace(/\\n/g, '\n'),
          },
          firebase_project_id: {
            verify: joi.string().required(),
            name: 'FIREBASE_PROJECT_ID',
          },

          front_host: {
            verify: joi.string().required(),
            name: 'FRONT_HOST',
          },
          backend_host: {
            verify: joi.string().required(),
            name: 'BACKEND_HOST',
          },
        },
        [process.env],
      );

    // Combine all config vars and execute final transforms
    this.config = <EnvConfig>{
      ...localConfigValues,

      // Derived
      front_domain: new URL(localConfigValues.front_host).hostname,
      backend_domain: new URL(localConfigValues.backend_host).hostname,
    };
  }
}
