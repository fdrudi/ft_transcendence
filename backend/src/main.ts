
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			enableDebugMessages: true,
			skipNullProperties: false,
		}),
	);
	app.enableCors({ credentials: true, origin: ['http://localhost:8081', 'http://localhost:3000', 'http://localhost'] });

	app.use(cookieParser());

	/*
  Impostazione per Swagger, per usarlo e testare le API su http://localhost:3000/api
  */
	const config = new DocumentBuilder().setTitle('Trascendence').setDescription('The Trascendence API description').setVersion('1.0').addTag('ft_trascendence').build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(8081);
}
bootstrap();
