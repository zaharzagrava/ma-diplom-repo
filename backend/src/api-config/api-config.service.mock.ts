import * as _ from 'lodash';
import { EnvConfig } from './types';
import { ApiConfigService } from './api-config.service';
import { ConfigUtilsService } from 'src/utils/config-utils/config-utils.service';

export class MockApiConfigService extends ApiConfigService {
  public initialConfig: EnvConfig;

  reset() {
    this.config = _.cloneDeep(this.initialConfig);
  }

  public async init(): Promise<void> {
    await super.init();

    this.initialConfig = this.config;
  }

  set<K extends keyof EnvConfig>(key: K, value: any) {
    this.config[key] = value;
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }
}

export const MockApiConfigServiceFactory = async (
  configUtilsService: ConfigUtilsService,
) => {
  const mockApiConfigService = new MockApiConfigService(configUtilsService);
  await mockApiConfigService.init();
  return mockApiConfigService;
};
