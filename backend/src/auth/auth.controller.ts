/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Body, Controller, Delete, Get, HttpCode, Post, Redirect, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import fastifyCookie from '@fastify/cookie';
import { NextFunction, Request, response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { use } from 'passport';
import { decode, stringify } from 'querystring';
import CreateUserDto, { UserDto } from 'src/users/user.dto';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './guard/jwt.guard';
import RequestWithUser from './interface/requestWithUser.interface';
import { request } from 'http';
import { clear } from 'console';
import { Auth42 } from './guard/intra42.guard';
import { number } from '@hapi/joi';
import { HttpService } from '@nestjs/axios';
import { JsonContains } from 'typeorm';
import cookieParser, { JSONCookie } from 'cookie-parser';
import { json } from 'stream/consumers';
import JwtTwoFactorGuard from './guard/2fa-jwt.guard';
import { Domain } from 'domain';
import Split from 'split.js';
import TokenPayload from './interface/tokenPayload.interface';

@Controller('api/auth')
export class AuthController {
	postsService: any;
	constructor(private authService: AuthService, private userService: UsersService, private httpService: HttpService, private jwtService: JwtService) {}
	/*------------------------- LOGIN42 ------------------------------------------------------------------------
        Nella chiamata di login, attraverso Auth42Guard, estraiamo i dati utente (email, username...),
        e li attacchiamo ad una classe che estende il request (RequestWithUser),
        quindi abbiamo 2 possibili casi, l'utente può essere presente nel database o lo creiamo,
        se è quest'ultimo è presente, lo ingettiamo nel database e lo salviamo in newUser,
        (register può anche ritornare il solo costruttore CreateUserDto perchè
        magari gia presente senza salvarlo), successivamente  identifichiamo se l'email è gia presente e quindi
        esiste uno User e se questo user ha l'autenticazione a 2 fattori attiva, se è attiva andiamo
        ad attaccare i cookie con il secret di JWT_ACCESS_TOKEN_SECRET altrimenti il classico jwt
        normale
      ------------------------------------------------------------------------------------------------------------*/
	@HttpCode(301)
	@UseGuards(Auth42)
	@Get()
	async login42(@Req() _req: RequestWithUser, @Res({ passthrough: true }) response: Response) {
		let userInDatabase;
	/*		temprary creation of a real user
			let a = {
			email: 'ugo',
			username: 'ugo',
			pictureLink: 'ugo',
		};
	*/
		const newUser: CreateUserDto = await this.authService.register(new CreateUserDto(_req.user));
		if (newUser.isTwoFactorAuthenticationEnabled == undefined) {
			userInDatabase = await this.userService.getByEmail(newUser.email);
		}
		if (userInDatabase?.isTwoFactorAuthenticationEnabled == false) {
			console.log(`2factory Status: ${userInDatabase?.isTwoFactorAuthenticationEnabled}`);
			const cookie = this.authService.getCookieWithJwtToken(newUser.id);
			response.setHeader('Set-Cookie', cookie);
		} else {
			console.log(`2factory Status: ${userInDatabase?.isTwoFactorAuthenticationEnabled}`);
			const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(newUser.id, true);
			response.setHeader('Set-Cookie', [accessTokenCookie]);
		}
		return newUser;
	}

	/*------------------ 2fa/UserData -----------------------------------------
      Tester Ritorna i dati dell'utente con un'autenticazione a 2 fattori attiva
    ------------------------------------------------------------------------*/

	@UseGuards(JwtTwoFactorGuard)
	@Get('2fa/UserData')
	authenticate(@Req() request: RequestWithUser) {
		const user = request.user;
		return user;
	}

	/*----------------- log-out ---------------------------------------------
        Ripulisce i cookie e li risetta a zero attraverso la funzione
        getCookieForLogOut, una volta utilizzato devi necessariamente
        passare dal login per eseguire tutte le chiamate protette sia
        dal jwt che dall'autenticazione a 2 fattori

        ------------------------------------------------------------------------*/

	@Post('log-out')
	async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
		response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
		return response.sendStatus(200);
	}

	/*----------------- GetUserIdentity ---------------------------------------------
      Quest chiamata viene utilizzata dal front-end principalmente per ritornare
      le informazioni dell'utente che sta interagendo attraverso il cookie, ovvero
      fa il decode del cookie in arrivo e ne va ad estrapolare l'id e lo passa in
      getById per ritornare l'utente
        ------------------------------------------------------------------------*/
	@Get('getUserIdentity')
	@UseGuards(JwtService)
	async GetUserIdentity(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
		const decoded = this.authService.decodeJwt(request.headers.cookie);
		const user3 = await this.userService.getById(decoded.userId);
		console.log('getting user Identity... Done!');
		return user3;
	}
}
