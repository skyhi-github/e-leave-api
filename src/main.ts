import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });

  const config = new DocumentBuilder()
    .setTitle('E-Leave')
    .setDescription('E-Leave API')
    .setVersion('1.0')
    .addSecurity('JWT', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { 
    customSiteTitle: 'E-Leave API',
  });

  await app.listen(parseInt(process.env.APP_PORT));
}
bootstrap();
