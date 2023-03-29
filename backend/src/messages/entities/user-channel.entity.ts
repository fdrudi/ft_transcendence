/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Channel from './channel.entity';
import { Server, Socket } from 'socket.io';

@Entity('UserChannel')
class UserChannel
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nickname: string;

    @Column()
    socketId: string;

    @Column({default:false})
    silenzed: boolean;
    
    @ManyToOne(() => Channel, (channel: Channel) => channel.userChannel)
    channel: Channel;
}
export default UserChannel;