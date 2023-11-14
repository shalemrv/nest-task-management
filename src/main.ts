import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  
  app.enableCors();

  const logger = new Logger();
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.useGlobalInterceptors(new TransformInterceptor);
  
  const port = 54321;

  await app.listen(port);
  
  logger.log(`Application listening on port - ${port}`);
  
}
bootstrap();
