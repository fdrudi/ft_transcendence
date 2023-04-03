import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import Channel from './entities/channel.entity';
import UserChannel from './entities/user-channel.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, UserChannel]), UsersModule],
	controllers: [MessagesController],
	providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
