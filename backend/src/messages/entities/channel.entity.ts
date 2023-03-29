/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import UserChannel from './user-channel.entity';

export class Partecipant {
	public users: string;
	constructor(user: string) {
		this.users = user;
	}
}

@Entity('Channel')
class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	ChannelName: string;

	@Column()
	Owner: string;

	@Column('simple-array')
	Admin: string[];

	@Column('simple-array')
	Partecipant: string[];

	@Column({ nullable: true })
	Password?: string;

	@OneToMany(() => UserChannel, (userChannel: UserChannel) => userChannel.channel)
	userChannel?: UserChannel[];
}
export default Channel;
