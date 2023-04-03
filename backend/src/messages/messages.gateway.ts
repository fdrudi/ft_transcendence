/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

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

	constructor(public messagesService: MessagesService) {}
	afterInit(server: any) {
		this.server = server;
		this.server.use((socket, next) => {
			next();
		});
	}

	@SubscribeMessage('createMessage')
	async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
		return await this.messagesService.createMessage(createMessageDto, client, this.server);
	}

	@SubscribeMessage('directMessage')
	async directMessage(@MessageBody() createMessageDto: CreateMessageDto,  @ConnectedSocket() client: Socket) {
		return await this.messagesService.directMessage(createMessageDto, client, this.server);
	}

	@SubscribeMessage('createRoom')
	async createRoom(@MessageBody('channel') channel: string,
					@MessageBody('name') name,
					@MessageBody('Password') password: string,
					@ConnectedSocket() client: Socket) {
		return await this.messagesService.createRoom(channel, name, password, client);
	}

	@SubscribeMessage('join')
	async joinRoom(@MessageBody('name') name: string,
					@MessageBody('Password') password: string,
					@MessageBody('channel') channel: string,
					@ConnectedSocket() client: Socket) {
		return await this.messagesService.joinerRoom(name, password, channel, client);
	}

	@SubscribeMessage('muteOn')
	async muteOn(@MessageBody('useToSilent') useToSilent,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@MessageBody('timer') timer:number)
	{
		return await this.messagesService.muteOn(useToSilent, channel, admin, timer);
	}

	@SubscribeMessage('muteOff')
	async muteOff(@MessageBody('useToSilent') useToSilent,
						@MessageBody('channel') channel,
						@MessageBody('name') admin)
	{
		return await this.messagesService.muteOff(useToSilent, channel, admin);
	}

	@SubscribeMessage('banUser')
	async banUser(@MessageBody('userToBan') userToBan,
						@MessageBody('channel') channel,
						@MessageBody('name') admin,
						@MessageBody('timer') timer:number)
	{
		return  await this.messagesService.banUser(userToBan, channel, admin, timer, this.server);
	}

	@SubscribeMessage('banOff')
	async banOff(@MessageBody('userToUnBan') userToUnBan,
						@MessageBody('channel') channel,
						@MessageBody('name') admin)
	{
		return  await this.messagesService.banOff(userToUnBan, channel, admin);
	}

	@SubscribeMessage('typing')
	async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
		const name = await this.messagesService.getClientByName(client.id);
		client.broadcast.emit('typing', { name, isTyping });
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel(@MessageBody('name') name,
						@MessageBody('channel') channel,
						@ConnectedSocket() client: Socket) {
		console.log("disconnecting...");
		client.disconnect(channel);
		return;
	}
}
