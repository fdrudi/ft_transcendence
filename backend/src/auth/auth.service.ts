/* eslint-disable prefer-const */

import { Injectable, Res, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { toDataURL } from 'qrcode';
import CreateUserDto, { UserDto } from 'src/users/user.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './interface/tokenPayload.interface';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

	public async getAuthenticatedUser(email: string) {
		try {
			const user = await this.usersService.getByEmail(email);
			const isPasswordMatching = true;
			if (!isPasswordMatching) {
				throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
			}
			return user;
		} catch (error) {
			throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
		}
	}

	public getCookieWithJwtToken(userId: number) {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; HttpOnly=true; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}d`;
	}

	public async register(registrationData: any): Promise<UserDto> {
		const createdUser = await this.usersService.create({
			...registrationData,
		});
		return new UserDto(createdUser);
	}
	public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
		const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
			expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
	}

	public getCookieForLogOut() {
		return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
	}

	public decodeJwt(token) {
		if (token) {
			const base64Payload = token.split('.')[1];
			const payloadBuffer = Buffer.from(base64Payload, 'base64');
			return JSON.parse(payloadBuffer.toString());
		} else {
			return null;
		}
	}
}
