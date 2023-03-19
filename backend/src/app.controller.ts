
import { Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { response, Response } from 'express';
import { stringify } from 'querystring';
import { AuthService } from './auth/auth.service';
//import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
	@Get('error')
	error() {
		return 'oh something went wrong';
	}
}
