/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Body, Header, Headers, HttpServer, Redirect, Req, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { request } from 'http';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { channel } from 'diagnostics_channel';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as bcrypt from 'bcrypt';
import UserChannel from './entities/user-channel.entity';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import Channel from './entities/channel.entity';

/*
  
    * Uno User deve essere in grado di creare un canale, che può essere publico, privato 
      o protetto da una password
  
    * uno user può essere in grado di mandare messaggi diretti agli altri user, 
  
    * uno user è in grado di bloccare altri user e non vedere più i loro messaggi
  
    * Lo user che crea il canale è in automatico settato come Owner fino a quando lo lascia
  
    * L'admin è lo stesso owner e può nominare altri admin
  
    * l'owner può settare una password per accedere al canale, cambiarla e rimuoverla.
  
    * un admin può bannare, silenziare e rimuovere uno user per un tempo limitato
  
    * uno user può invitare altri user a giocare a pong
  
    * uno user può accedere al profilo degli altri utenti attraverso la chat
*/

/*
  Il compito del WebSocketGateway il suo compito è di ricevere e mandare messaggi
*/

@WebSocketGateway({
	cors: {
		origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
		credentials: true,
	},
})
export class MessagesGateway implements OnGatewayInit {
	@WebSocketServer()
	server: Server;

	constructor(private readonly messagesService: MessagesService) {}
	afterInit(server: any) {
		this.server = server;
		this.server.use((socket, next) => {
			next();
		});
	}

	@SubscribeMessage('createMessage')
	async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {

		const clientId = await client.id.toString();
		const user = await this.messagesService.userChannelRep.findOne({where: {
			socketId: clientId
		}});
		const channel = await this.messagesService.channelRep.findOne({where: {
			ChannelName: createMessageDto.channel
		}});

	//	console.log(clientId + "|||" + user.socketId);
		if (await this.messagesService.getStatus(user.id) == false)
		{
			console.log(`user ${user.nickname} is not active`);
			return;
		}
		if (await (user.ban) == true ) 
		{
			if (this.messagesService.checkBanTimer(user.banDate, user.banTimer) == false)
			{
				this.messagesService.banOff(user.nickname, channel.ChannelName, channel.Admin[0]);
			}
			else
				return false;
		}
		//if (await this.messagesService.checkBanTimer(user.banDate, user.banTimer) == false) return false;
		if (await this.messagesService.checkIfSilenzed(await clientId) == true) return false;
		const message = this.messagesService.create(createMessageDto, client.id);
		this.server.to(createMessageDto.channel).emit('message', message);
		console.log(`l'utente ${createMessageDto.name} scrive nel channel: ${createMessageDto.channel}`);
		return message;
	}

	/*
  creo una channel-list e vado a pushare ogni nuovo canale,
  un canale è un' entity al cui interno ha definito l'owner,
  gli admin, utente bannato, utente silenziato
  */
	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody('channel') channel: string, @MessageBody('name') name, @MessageBody('Password') password: string, @ConnectedSocket() client: Socket) {
		const toFind = await this.messagesService.channelRep.findOne({
			where: { ChannelName: channel },
		});
		if (toFind == undefined) {
			//se l'utente ha passato una password il canale diventa
			//protetto
			if (password != null) {
				const saltOrRounds = 10;
				const hash = await bcrypt.hash(password, saltOrRounds);
				password = hash;
			}
			
			const ch = this.messagesService.createChannel({
				id: name,
				ChannelName: channel,
				Owner: name,
				Admin: name,
				Partecipant: name,
				Password: password,
				BanList: [],
			});

			this.messagesService.createUserChannel(ch,{
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

	@SubscribeMessage('join')
	async joinRoom(@MessageBody('name') name: string, @MessageBody('Password') password: string, @MessageBody('channel') channel: string, @ConnectedSocket() client: Socket) {
		const toFind = await this.messagesService.channelRep.findOne({
			where: { ChannelName: channel },
		});
		const user = await this.messagesService.getUserChannelById(name, toFind.id);

		if (toFind != undefined) {
			if (toFind.Password != null) {
				console.log(toFind.Password);
				const decrypt = await bcrypt.compare(password, toFind.Password);
				if (decrypt == false) {
					console.log('password: incorrect!');
					return null;
				}
			}
			if (await this.messagesService.checkNameInChannel(channel, name) == true)
			{
				console.log(user.nickname);
				let banlist = toFind.BanList;
				for(let ban of banlist)
				{
					if (ban == user.nickname)
					{
						if (this.messagesService.checkBanTimer(user.banDate, user.banTimer) == false)
						{
							this.messagesService.banOff(user.nickname, toFind.ChannelName, toFind.Admin[0]);
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
					await this.messagesService.userChannelRep.update((await user).id,{
						socketId:  client.id.toString(), status:true
				})
					console.log(`user : ${name} is back to channel: ${channel}`);
					return name;
			}
			this.messagesService.setStatus(true, user.id);
			this.messagesService.addUserToChannel(channel, name, (await toFind).id);
			this.messagesService.createUserChannel(toFind, {nickname: name, channel:toFind, socketId: client.id})
			client.join(channel);
			return name;
		}
		console.log('channel does not found');
		return;
	}

	@SubscribeMessage('typing')
	async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
		const name = await this.messagesService.getClientByName(client.id);

		client.broadcast.emit('typing', { name, isTyping });
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel(@MessageBody('name') name, @MessageBody('channel') channel, @ConnectedSocket() client: Socket) {
		console.log("disconnecting...");
		 const user = await this.messagesService.userChannelRep.findOne({where:{
			nickname: name
		}})
		await this.messagesService.setStatus(false, (await user).id);
		client.leave(channel);
		return;
	}

	@SubscribeMessage('silentUser')
	async silentUser(@MessageBody('useToSilent') useToSilent,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@MessageBody('timer') timer:number,
						@ConnectedSocket() client: Socket)
	{
		return await this.messagesService.muteOn(useToSilent, channel, admin, timer);
	}

	@SubscribeMessage('muteOff')
	async muteOff(@MessageBody('useToSilent') useToSilent,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@ConnectedSocket() client: Socket)
	{
		return await this.messagesService.muteOff(useToSilent, channel, admin);
	}

	@SubscribeMessage('banUser')
	async banUser(@MessageBody('userToBan') userToBan,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@MessageBody('timer') timer:number,
						@ConnectedSocket() client: Socket)
	{
		return  await this.messagesService.banUser(userToBan, channel, admin, timer, this.server);
	}

	@SubscribeMessage('banOff')
	async banOff(@MessageBody('userToUnBan') userToUnBan,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@ConnectedSocket() client: Socket)
	{
		return  await this.messagesService.banOff(userToUnBan, channel, admin);
	}
	/*
		TODO: ban, silenziatore e disconnect DONE!
		- fare un refactory del codice, ed iniziare ad implementare i directMessage
	*/
}
