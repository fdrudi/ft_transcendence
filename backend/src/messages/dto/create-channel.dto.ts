/* eslint-disable prettier/prettier */
import Channel from '../entities/channel.entity';

export class CreateChannelDto extends Channel {
	constructor(obj: any) {
		super(),
			(this.ChannelName = obj.ChannelName),
			(this.Owner = obj.Owner),
			(this.BanList = obj.BanList),
			(this.Partecipant = obj.Partecipant),
			(this.id = obj.id),
			(this.Admin = obj.Admin),
			(this.Password = obj.Password);
	}
}
