/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import Channel from './entities/channel.entity';
import Message from './entities/message.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserChannel from './entities/user-channel.entity';
import { Server, Socket } from 'socket.io';

@Injectable()
export class MessagesService {
	messages: Message[] = [];
	clientToUser = {};
	constructor(@InjectRepository(Channel) public channelRep: Repository<Channel>,
				@InjectRepository(UserChannel) public userChannelRep: Repository<UserChannel>) {}

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

	async createMessage(createMessageDto: CreateMessageDto, client: Socket, server:Server)
	{
		const user =  await this.userChannelRep.findOne({where: {
			socketId: client.id.toString()
		}});
		const channel =  await this.channelRep.findOne({where: {
			ChannelName: createMessageDto.channel
		}});

		if ( user.ban == true ) 
		{
			if (this.checkBanTimer(user.banDate, user.banTimer) == false)
				this.banOff(user.nickname, channel.ChannelName,channel.Admin[0]);
			else
				return false;
		}
		if (await this.checkMute(user.socketId) == true) return false;
		const message =  this.create(createMessageDto, client.id);
		server.to(createMessageDto.channel).emit('message', message);
		console.log(`User: ${createMessageDto.name} write in: ${createMessageDto.channel}`);
		return  message;
	}

	async createRoom(channel: string, name: string, password: string,client: Socket)
	{
		const toFind = await this.channelRep.findOne({
			where: { ChannelName: channel },
		});
		if (toFind == undefined) {
			if (password != null) {
				const saltOrRounds = 10;
				const hash = await bcrypt.hash(password, saltOrRounds);
				password = hash;
			}
			
			const ch = this.createChannel({
				id: 0,
				ChannelName: channel,
				Owner: name,
				Admin: [name],
				Partecipant: [name],
				Password: password,
				BanList: [],
			});

			this.createUserChannel(ch,{
				nickname: ch.Owner,
				channel:ch, id:ch.id,
				socketId: client.id,
				admin:true,
				channelId: ch.id,
			})

			console.log(`L' utente: ${name} ha creto il canale ${channel}`);
			client.join(channel);
			return name;
		}
		return undefined;
	}

	createChannel(createChannelDto: CreateChannelDto) {
		const channel = {
			id: 0,
			ChannelName: createChannelDto.ChannelName,
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

	async joinerRoom(name: string, password: string, channel: string, client: Socket)
	{
		const toFind = await this.channelRep.findOne({
			where: { ChannelName: channel },
		});
		const user = await this.userChannelRep.findOne({where: {
				nickname:name, channelId : toFind.id
		}})

		if (toFind != undefined) {
			if (toFind.Password != null) {
				console.log(toFind.Password);
				const decrypt = await bcrypt.compare(password, toFind.Password);
				if (decrypt == false) {
					console.log('password: incorrect!');
					return null;
				}
			}
			if (await this.checkNameInChannel(channel, name) == true)
			{
				console.log(user.nickname);
				let banlist = toFind.BanList;
				for(let ban of banlist)
				{
					if (ban == user.nickname)
					{
						if (this.checkBanTimer(user.banDate, user.banTimer) == false)
						{
							this.banOff(user.nickname, toFind.ChannelName, toFind.Admin[0]);
							break;
						}
						else
						{
							console.log(`user ${user.nickname} is banned`)
							return;
						}
					}
				}
					client.join(channel);
					await this.userChannelRep.update((await user).id,{
						socketId:  client.id.toString()
				})
					console.log(`user : ${name} is back to channel: ${channel}`);
					return name;
			}
			this.addUserToChannel(channel, name, (await toFind).id);
			this.createUserChannel(toFind, {nickname: name, channel:toFind, socketId: client.id})
			client.join(channel);
			return name;
		}
		console.log('channel does not found');
		return;
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

	async checkMute(id:string)
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
			return  await user;
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
			return false;
		console.log(`mute timer expires in : ${timediff-muteTimer * -1}min`);
		return true;
	}

	checkBanTimer(banDate: string, banTimer:number)
	{
		const prevdate = (new Date(banDate).getTime() / 1000) / 60;
		const now = (new Date().getTime() / 1000) / 60;
		const timediff = now - prevdate;
		if (timediff >= banTimer && banDate != "")
			return false;
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

		const boolAdmin = await this.getUserChannelById(admin, channelToFind.id);
		
		if ((await boolAdmin).admin == true)
		{
			const match =  await this.getUserChannelById(useToSilent, channelToFind.id);
			if (match.mute == true)
				if (this.checkMuteTimer(match.muteDate, match.muteTimer) == false)
					this.muteOff(useToSilent, channel, admin);
			if (match.mute == false)
			{
				const timedate = new Date();
				console.log(`admin: ${admin} mute ${match.nickname}`);
				return this.userChannelRep.update(match.id, {mute: true, 
													muteDate: timedate.toString(),
													muteTimer: timer
												});
			}
			else
				console.log(`${match.nickname} is already muted`);
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
												});
			}
			else
				console.log(`user ${match.nickname} is not banned`);
		}
		else
			console.log(`user: ${admin} is not an admin`);
		return;
	}
}