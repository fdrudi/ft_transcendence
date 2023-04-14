import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// passport-42 doesn't have @type module for typescript
/* eslint-disable */
// @ts-ignore
import { Strategy, VerifyCallback } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.clientID, //'u-s4t2ud-486c6f85713f6717cf7e6d9f24b1341dda235d72c48733f53ed404b038f1b787',
			clientSecret: process.env.clientSecret, //'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',
			callbackURL: 'http://localhost:8081/api/auth', //"http://localhost:3000/",
			scope: ['public'],
			provider: '42/redirect',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		try {
			const { username, name, emails, _json } = profile;
			const user = {
				username: username,
				email: emails[0].value,
				pictureLink: _json?.image?.link,
				accessToken,
				refreshToken,
			};
			done(null, user);
		} catch (error) {
			throw error;
		}
	}
}
