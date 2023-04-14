/* eslint-disable prettier/prettier */
import Channel from '../entities/channel.entity';
import UserChannel from '../entities/user-channel.entity';

export class CreateUserChannelDto extends UserChannel {
	constructor(obj: any) {
		super(),
        this.id = obj.id;
        this.nickname= obj.nickname;
        this.channel = obj.channel;
	}
}
