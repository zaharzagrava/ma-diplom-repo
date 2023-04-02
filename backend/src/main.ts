import { NestFactory } from '@nestjs/core';
import { ApiConfigService } from './api-config/api-config.service';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Setting up docs
  const config = new DocumentBuilder()
    .setTitle('Finance Kit: KPI Tool')
    .setDescription('Finance Kit: KPI Tool API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get('port'));
}
bootstrap();
