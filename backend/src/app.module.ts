/* eslint-disable @typescript-eslint/no-empty-function */

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { MessagesModule } from './messages/messages.module';
import { MessagesGateway } from './messages/messages.gateway';
import path from 'path';

@Module({
	imports: [
		MessagesModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_TIME: Joi.string().required(),
				POSTGRES_HOST: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
				PORT: Joi.number(),
			}),
		}),
		MulterModule.register({
			dest: './uploads/',
		}),
		DatabaseModule,
		UsersModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService, JwtService],
})
export class AppModule {}
