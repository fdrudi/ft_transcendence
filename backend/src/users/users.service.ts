/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import User from './user.entity';
import CreateUserDto, { UserDto } from './user.dto';
import { Status } from './user.enums';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		public userRep: Repository<User>,
	) {}

	async getAllUsers() {
		const user = this.userRep.find();
		return user;
	}

	findByEmail(obj: string) {
		const user = this.userRep.findOne({
			where: { email: obj },
		});

		if (user) return user;
		return null;
	}

	async getByEmail(_email: string) {
		const user = await this.userRep.findOne({
			where: {
				email: _email,
			},
		});
		if (user) return user;
		return undefined;
	}

	async getById(id: any) {
		const user = await this.userRep.findOne({ where: { id: id } });
		if (user) {
			return user;
		}
		throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
	}

	async getByName(name: string) {
		const user = await this.userRep.findOne({ where: { username: name } });
		if (user) {
			return user;
		}
		throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
	}

	async create(userData: CreateUserDto): Promise<CreateUserDto | User> {
		const user = await this.getByEmail(userData.email);
		if (!user) {
			//const socketId = [creare funzione che va ad aprire un socket e passarla al create. Vedi sotto]
			const newUser = await this.userRep.create(userData/*, socketId*/);
			await this.userRep.save(newUser);
			return new CreateUserDto(newUser);
		}
		return new CreateUserDto(user);
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.userRep.update(userId, {
			twoFactorAuthenticationSecret: secret,
		});
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		return this.userRep.update(userId, {
			isTwoFactorAuthenticationEnabled: true,
		});
	}

	async turnOffTwoFactorAuthentication(userId: number) {
		return this.userRep.update(userId, {
			isTwoFactorAuthenticationEnabled: false,
		});
	}
	async setAvatar(id: number, path: string) {
		await this.userRep.update(id, { pictureLink: path });
		return 'avatar changed';
	}

	async setUsername(id: number, name: string) {
		const user = this.userRep.update(id, { username: name });
		return user;
	}

	async setOffline(id: number) {
		this.userRep.update(id, { status: Status.OFFLINE });
	}

	async setOnline(id: number) {
		this.userRep.update(id, { status: Status.ONLINE });
	}
}
