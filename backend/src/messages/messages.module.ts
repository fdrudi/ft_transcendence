import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { MessagesController } from './messages.controller';
import Channel from './entities/channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel])],
	controllers: [MessagesController],
	providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
