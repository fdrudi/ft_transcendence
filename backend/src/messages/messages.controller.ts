/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { MessagesService } from './messages.service';
import * as bcrypt from 'bcrypt';

@Controller('messages')
export class MessagesController {
	constructor(private messageService: MessagesService) {}

	@Get('admin')
	@UseGuards(JwtAuthenticationGuard)
	async addAdmin(@Req() req: RequestWithUser) {
		const ch: string = <string>req.headers.channel;
		const channel = await this.messageService.findChannel(ch);
		const user = req.user.email;
		const addAdmin: string = <string>req.headers.admin;
		if (channel.Owner != user) {
			console.log(`Owner: ${channel.Owner} and user: ${user} does not match!`);
			return;
		}
		this.messageService.addAdminToChannel(channel.ChannelName, addAdmin, channel.id);
		return;
	}

	@Get('set-password')
	@UseGuards(JwtAuthenticationGuard)
	async set_password(@Req() req: RequestWithUser) {
		const room = await this.messageService.findChannel(<string>req.headers.channel);
		if (room.Owner == req.user.email) {
			const saltOrRounds = 10;
			const hash = await bcrypt.hash(<string>req.headers.password, saltOrRounds);
			this.messageService.channelRep.update(room.id, { Password: hash });
			console.log('Password: Password changed!');
			return true;
		}
		return false;
	}

	@Get('delete-password')
	@UseGuards(JwtAuthenticationGuard)
	async deletePassword(@Req() req: RequestWithUser) {
		const room = await this.messageService.findChannel(<string>req.headers.channel);
		if (room.Owner == req.user.email) {
			this.messageService.channelRep.update(room.id, { Password: null });
			console.log('Password: Password removed!');
			return true;
		}
		return false;
	}

	@Get('channels')
	getAllChannels() {
		return this.messageService.findAllChannels();
	}
}
