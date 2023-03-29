/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import Channel, { Partecipant } from './entities/channel.entity';
import Message from './entities/message.entity';
import { Repository } from 'typeorm';
import UserChannel from './entities/user-channel.entity';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';

@Injectable()
export class MessagesService {
	//ingettare lo userservice
	//attraverso i cookie recuperare lo user che sta interagendo
	messages: Message[] = [];
	clientToUser = {};
	// channels : Channel[] = [];
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
		// console.log(channelRep.Password);
		//  console.log(password)
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

		//  const user = await this.channelRep.findOne({where : {Partecipant: name}});
	}
	createUserChannel(ch: Channel, obj: any)
	{
		const userChannelRep = {
			id:obj.id,
			nickname : obj.nickname,
			channel: ch,
			socketId: obj.socketId
		}
		this.userChannelRep.create(userChannelRep);
		this.userChannelRep.save(userChannelRep);
		return userChannelRep;
	}

	async checkIfSilenzed(socketId:string)
	{
		const user = await this.userChannelRep.findOne({where: {
			socketId: socketId
		}});

		if (user.silenzed == true)
			return true;
		return false;
	}

	/*
  async getByEmail(_email: string) {
    const user = await this.userRep.findOne({
      where: {
        email: _email,
      },
    });
    if (user)
      return user;
    return undefined;
  }
  */
}
