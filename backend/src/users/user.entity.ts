import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from './user.enums';

@Entity('users')
class User {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public email: string;

	@Column()
	public username: string;

	@Column({ nullable: true })
	public twoFactorAuthenticationSecret?: string;

	@Column({ default: false })
	public isTwoFactorAuthenticationEnabled: boolean;

	@Column()
	public pictureLink: string;

	@Column({ default: Status.OFFLINE })
	public status: Status;

	@Column({ default: 0 })
	victories: number;

	@Column({ default: 0 })
	losses: number;

	@Column({ default: 0 })
	level: number;

	@Column({ default: 0 })
	achievements: number;

	@Column({ default: 0 })
	matchs: number;

	//@Column({})
	//publicSocketId: string;
}

export default User;
