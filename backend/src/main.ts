import { NestFactory } from '@nestjs/core';
import { ApiConfigService } from './api-config/api-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const configService: ApiConfigService = app.get(ApiConfigService);

  // Setting up listening settings
  app.setGlobalPrefix('api');

  // Setting up CORS
  const origins = [configService.get('front_host')];
  if (configService.get('node_env') !== 'production') {
    origins.push('http://localhost:3000');
  }

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  await app.listen(configService.get('port'));
}
bootstrap();
