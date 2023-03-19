import { Body, Controller, Get, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { send } from 'process';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import User from './user.entity';
import { UsersService } from './users.service';
import CreateUserDto from './user.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

/*
      implementazioni Base delle chiamate Users
    */
@Controller('users')
export class UserController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getAllusers(): Promise<User[]> {
		const user = await this.usersService.getAllUsers();
		return user;
	}

	@Get(':id')
	async getUsersById(@Param('id') id: string): Promise<User> {
		const user = await this.usersService.getById(Number(id));
		return user;
	}

	@Post()
	async createUser(@Body() user: CreateUserDto) {
		const new_user = await this.usersService.create(user);
		return new_user;
	}

	/*-----------------------uploadedAvatar-----------------------
    Carica un immagine nel path uploads e la setta come avatar
   ---------------------------------------------------------------*/
	@UseGuards(JwtAuthenticationGuard)
	@Post('upload/image')
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: editFileName,
			}),
			fileFilter: imageFileFilter,
		}),
	)
	async uploadedAvatar(@Req() req: RequestWithUser, @UploadedFile() file: any) {
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		this.usersService.setAvatar(req.user.id, `./uploads/${response.filename}`);
		return response;
	}

	/*------------------------seeUploadedFile----------------------
  Rimanda al path dell'immagine caricata
  ---------------------------------------------------------------*/
	//TODO: verificare l'utilità di questa chiamata
	@UseGuards(JwtAuthenticationGuard)
	@Get('download/:imgpath')
	seeUploadedFile(@Param('imgpath') image: string, @Res() res: any) {
		return res.sendFile(image, { root: './uploads' });
	}

	@UseGuards(JwtAuthenticationGuard)
	@Post('setname')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				username: { type: 'string' },
			},
		},
	})
	async SetUsername(@Body() body: any, @Req() req: RequestWithUser) {
		let old_username = req.user.username;
		await this.usersService.setUsername(req.user.id, body.username);
		return `Username changed from ${old_username} to ${body.username}`;
	}

	@Post('request')
	@UseGuards(JwtAuthenticationGuard)
	async getRequest(@Req() req: RequestWithUser) {
		return req.user;
	}
}
