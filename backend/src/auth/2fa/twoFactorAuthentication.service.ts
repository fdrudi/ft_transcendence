import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpAuthUrl = authenticator.keyuri(user.email, 'generate2fa', secret);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

		return {
			secret,
			otpAuthUrl,
		};
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, userSecret: string) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: userSecret,
		});
	}
}
