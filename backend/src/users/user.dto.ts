/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { IsBoolean, IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';
import { number } from '@hapi/joi';
import { Column } from 'typeorm';

@Injectable()
export class CreateUserDto {
	id: number;
	email: string;
	username: string;
	twoFactorAuthenticationSecret?: string;
	isTwoFactorAuthenticationEnabled: boolean;
	pictureLink: string;
	constructor(user: any) {
		(this.pictureLink = user.pictureLink),
			(this.id = user.id),
			(this.email = user.email),
			(this.username = user.username),
			(this.isTwoFactorAuthenticationEnabled = user.isTwoFactorAuthenticationEnabled),
			(this.twoFactorAuthenticationSecret = user.twoFactorAuthenticationSecret);
	}
}

export default CreateUserDto;

@Injectable()
export class UserDto {
	public id: number;
	public username: string;
	public email: string;
	public twoFactorAuthenticationSecret?: string;
	public isTwoFactorAuthenticationEnabled: boolean;
	public pictureLink: string;
	constructor(user: any) {
		(this.pictureLink = user.pictureLink),
			(this.id = user.id),
			(this.username = user.username),
			(this.email = user.email),
			(this.twoFactorAuthenticationSecret = this.twoFactorAuthenticationSecret),
			(this.isTwoFactorAuthenticationEnabled = this.isTwoFactorAuthenticationEnabled);
	}
}
