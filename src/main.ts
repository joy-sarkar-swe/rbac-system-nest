/**
 * @fileoverview API Gateway bootstrap.
 *
 * Starts the HTTP server that acts as the single entry-point for all
 * client requests. Registers global middleware (Helmet, Morgan),
 * validation pipes, the response interceptor, and the HTTP exception
 * filter before listening on the configured port.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import config from './shared/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global route prefix to "api"
  app.setGlobalPrefix('api');

  // Apply security headers
  app.use(helmet());

  // Enable HTTP request logging
  app.use(morgan('dev'));

  // Register global validation pipe with strict options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => errors,
    }),
  );

  // Register global response interceptor and HTTP exception filter
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Register global HTTP exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization', // <- name important
    )
    .setVersion('1.0')
    .build();

  // Create document
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Serve Swagger UI at /api
  SwaggerModule.setup('api-doc', app, document);

  // Optional: serve raw JSON at /api-json
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.json(document); // use send, not json (sometimes works better for $ref parser)
  });

  const port = Number(config.PORT ?? 3000);
  await app.listen(port, () => {
    console.log(`🚀 API Gateway is running at http://localhost:${port}/api`);
    console.log(`📖 Swagger UI available at http://localhost:${port}/api-doc`);
  });
}
bootstrap();
