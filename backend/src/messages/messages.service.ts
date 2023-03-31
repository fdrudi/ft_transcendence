/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import Channel, { Partecipant } from './entities/channel.entity';
import Message from './entities/message.entity';
import { Repository } from 'typeorm';
import UserChannel from './entities/user-channel.entity';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { time } from 'console';
import { Server, Socket } from 'socket.io';

@Injectable()
export class MessagesService {
	messages: Message[] = [];
	clientToUser = {};
	constructor(@InjectRepository(Channel) public channelRep: Repository<Channel>, @InjectRepository(UserChannel) public userChannelRep: Repository<UserChannel>) {}

	identify(name: string, clientId: string) {
		this.clientToUser[clientId] = name;
		return Object.values(this.clientToUser);
	}

	getClientByName(clientId: string) {
		return this.clientToUser[clientId];
	}

	create(createMessageDto: CreateMessageDto, clientId: string) {
		const message = {
			id: 0,
			name: createMessageDto.name, //this.clientToUser[clientId],
			text: createMessageDto.text,
			channel: createMessageDto.channel,
		};
		this.messages.push(message);
		return message;
	}

	createChannel(createChannelDto: CreateChannelDto) {
		const channel = {
			id: 0,
			ChannelName: createChannelDto.ChannelName, //this.clientToUser[clientId],
			Owner: createChannelDto.Owner,
			Admin: createChannelDto.Admin,
			Partecipant: createChannelDto.Partecipant,
			Password: createChannelDto.Password,
			BanList: createChannelDto.BanList,
		};
		this.channelRep.create(channel);
		this.channelRep.save(channel);
		return channel;
	}

	async addUserToChannel(channel: string, username: string, channelId: number) {
		const Part: string[] = (await this.findChannel(channel)).Partecipant;
		const newPart = Part.concat(username);
		console.log(`new partecipant joined chat\nchat-list:${newPart}`);
		return this.channelRep.update(channelId, { Partecipant: newPart });
	}

	async addAdminToChannel(channel: string, username: string, channelId: number) {
		const Admin: string[] = (await this.findChannel(channel)).Admin;
		const newAdmin = Admin.concat(username);
		console.log(`new partecipant joined chat\nchat-list:${newAdmin}`);
		return this.channelRep.update(channelId, { Admin: newAdmin });
	}

	async addUserToBanList(channel: string, username: string) {
		const ban: string[] = (await this.findChannel(channel)).BanList;
		const newBanList = ban.concat(username);
		return this.channelRep.update((await this.findChannel(channel)).id, { BanList: newBanList });
	}

	findAllChannels() {
		return this.channelRep.find();
	}

	async findChannel(channel: string): Promise<CreateChannelDto> {
		const room = this.channelRep.findOne({
			where: { ChannelName: channel },
		});
		if (room) return room;
		return undefined;
	}

	async checkPassword(password: string, channel: string) {
		const channelRep = await this.findChannel(channel);
		if (password == channelRep.Password) return true;
		return false;
	}

	async removeUser(name: string, channel: string) {
		const ch = await this.findChannel(channel);
		for (let i = 0; i < ch.Partecipant.length; i++) {
			if (ch.Partecipant[i] == name) {
				ch.Partecipant.splice(i, 1);
				this.channelRep.update(ch.id, { Partecipant: ch.Partecipant });
				console.log(`Partecipant: ${name} gone from Room: ${channel}`);
			}
		}
	}

	async checkNameInChannel(channel:string, name:string)
	{
		const ch = await this.channelRep.findOne({where: {
			ChannelName: channel
		}})

		for(let p of ch.Partecipant)
		{
			if (p == name)
				return true;
		}
		return false;
	}
	createUserChannel(ch: Channel, obj: any)
	{
		const userChannelRep = {
			id:obj.id,
			nickname : obj.nickname,
			channel: ch,
			socketId: obj.socketId,
			admin: obj.admin,
			channelId: obj.id,
		}
		this.userChannelRep.create(userChannelRep);
		this.userChannelRep.save(userChannelRep);
		return userChannelRep;
	}

	async checkIfSilenzed(id:string)
	{
		const user = await this.userChannelRep.findOne({where: {
			socketId: id
		}});
		if (user.mute != false)
		{
			if (this.checkMuteTimer(user.muteDate, user.muteTimer) == false)
			{
				this.userChannelRep.update(user.id, {
					mute:false,
					muteDate:"",
					muteTimer:0
				})
			}
			return true;
		}
		return false;
	}

	async getUserChannelById(name:string, channelId:number)
	{
		try {
			const user = await this.userChannelRep.findOne({where: {
				channelId: channelId, nickname: name
			}})
			return user;
		} catch (error) {
			throw NotFoundException
		}
	}

	checkMuteTimer(muteDate: string, muteTimer:number)
	{
		const prevdate = (new Date(muteDate).getTime() / 1000) / 60;
		const now = (new Date().getTime() / 1000) / 60;
		const timediff = now - prevdate;
		if (timediff >= muteTimer && muteDate != "")
		{
			return false;
		}
		console.log(`mute timer expires in : ${timediff-muteTimer * -1}min`);
		return true;
	}

	checkBanTimer(banDate: string, banTimer:number)
	{
		const prevdate = (new Date(banDate).getTime() / 1000) / 60;
		const now = (new Date().getTime() / 1000) / 60;
		const timediff = now - prevdate;
		console.log(timediff);
		console.log(banTimer);
		if (timediff >= banTimer && banDate != "")
		{
			return false;
		}
		console.log(`ban timer expires in : ${timediff-banTimer * -1}min`);
		return true;
	}

	async muteOff(userToUnMute:string, channel:string, admin:string)
	{
		const channelToFind = await this.channelRep.findOne({where: {
			ChannelName: channel, 
		}}) 

		const boolAdmin = this.getUserChannelById(admin, channelToFind.id);
		if ((await boolAdmin).admin == true)
		{
			const match = await this.userChannelRep.findOne({
				where : {nickname: userToUnMute, channelId: channelToFind.id }
			})

			if (match.mute == true)
			{
				console.log(`admin: ${admin} leaved mute option to ${match.nickname}`);
				return  await this.userChannelRep.update(match.id, {mute: false, 
													muteDate: "",
													muteTimer: 0
												});
			}
			else
				console.log(`user ${match.nickname} is not muted`);
		}
		else
			console.log(`user: ${admin} is not an admin`);
		return;
	}

	async muteOn(useToSilent:string, channel:string, admin:string, timer:number)
	{
		const channelToFind = await this.channelRep.findOne({where: {
			ChannelName: channel, 
		}}) 

		const boolAdmin = this.getUserChannelById(admin, channelToFind.id);
		
		if ((await boolAdmin).admin == true)
		{
			const match = await this.userChannelRep.findOne({
				where : {nickname: useToSilent, channelId: channelToFind.id }
			})
			if (this.checkMuteTimer(match.muteDate, match.muteTimer) == false)
				return this.muteOff(useToSilent, channel, admin);
			if (match.mute == false)
			{
				const timedate = new Date();
				console.log(`admin: ${admin} silenced ${match.nickname}`);
				return this.userChannelRep.update(match.id, {mute: true, 
													muteDate: timedate.toString(),
													muteTimer: timer
												});
			}
			else
				console.log(`${match.nickname} is already silenced`);
		}
		else
			console.log(`user: ${admin} is not an admin`);
		return;
	}

	async banUser(userToBan: string, channel: string, admin: string, timer:number, server: Server)
	{
		const channelToFind = await this.channelRep.findOne({where: {
			ChannelName: channel, 
		}}) 

		const boolAdmin = this.getUserChannelById(admin, channelToFind.id);
		
		if ((await boolAdmin).admin == true)
		{
			const match = await this.userChannelRep.findOne({
				where : {nickname: userToBan, channelId: channelToFind.id }
			})
			if (match.ban == false)
			{
				const timedate = new Date();
				console.log(`admin: ${admin} ban ${match.nickname}`);
				this.userChannelRep.update(match.id, {ban: true, 
													banDate: timedate.toString(),
													banTimer: timer,
													status:false
												});
				const sockets = await server.in(channel).fetchSockets();
				this.addUserToBanList(channel, userToBan)
				for(let socket of sockets)
				{
					if (socket.id == match.socketId)
					{
						console.log("socket id: "+ match.nickname);
						socket.leave(channel);
						return;
					}
				}
			}
			else
				console.log(`${match.nickname} is already banned`);
		}
		else
			console.log(`user: ${admin} is not an admin`);
		return;
	}

	async banOff(userToBan:string, channel:string, admin:string)
	{
		const channelToFind = await this.channelRep.findOne({where: {
			ChannelName: channel, 
		}}) 

		const boolAdmin = this.getUserChannelById(admin, channelToFind.id);
		if ((await boolAdmin).admin == true)
		{
			const match = await this.userChannelRep.findOne({
				where : {nickname: userToBan, channelId: channelToFind.id }
			})

			if (match.ban == true)
			{
				console.log(`admin: ${admin} leaved ban option to ${match.nickname}`);
				const index = channelToFind.BanList.indexOf(match.nickname);
				await channelToFind.BanList.splice(index, 1);
				await this.channelRep.update(channelToFind.id, {
					BanList: channelToFind.BanList
				})
				return  await this.userChannelRep.update(match.id, {ban: false, 
													banDate: "",
													banTimer: 0,
													status:false
												});
			}
			else
				console.log(`user ${match.nickname} is not banned`);
		}
		else
			console.log(`user: ${admin} is not an admin`);
		return;
	}

	async setStatus(bool: boolean, userId:number)
	{
		console.log("in setStatus: is "+ userId )
		return await this.userChannelRep.update(userId, {
			status: bool
		})

	}

	async getStatus(userId:number)
	{
		const user= await this.userChannelRep.findOne({where: {
			id: userId
		}})
		if (user.status == false)
			return await false;
		return await true;
	}
}