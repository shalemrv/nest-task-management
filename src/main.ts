import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  const logger = new Logger();
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.useGlobalInterceptors(new TransformInterceptor);
  
  const port = 3000;

  await app.listen(port);
  
  logger.log(`Application listening on port - ${port}`);
  
}
bootstrap();
