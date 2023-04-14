import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: any;

	@Column()
	text: any;

	@Column()
	dest?: string;

	@Column()
	channel?: string;
}
export default Message;
