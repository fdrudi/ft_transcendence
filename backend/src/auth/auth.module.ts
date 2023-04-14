import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { TwoFactorAuthenticationController } from './2fa/twofactor.controller';
import { TwoFactorAuthenticationService } from './2fa/twoFactorAuthentication.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Auth42Strategy } from './strategies/intra42.strategy';
import { JwtTwoFactorStrategy } from './strategies/2fa-jwt.strategy';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
	imports: [
		UsersModule,
		HttpModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}d`,
				},
			}),
		}),
		/* JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60s'}
    })]*/
	],
	providers: [AuthService, JwtStrategy, ConfigService, TwoFactorAuthenticationService, Auth42Strategy, JwtTwoFactorStrategy],
	exports: [AuthService],
	controllers: [AuthController, TwoFactorAuthenticationController],
})
export class AuthModule {}
