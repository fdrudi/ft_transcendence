/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Channel from './channel.entity';
import { Server, Socket } from 'socket.io';
import { channel } from 'diagnostics_channel';

@Entity('UserChannel')
class UserChannel
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nickname: string;

    @Column({default: false})
    admin: boolean;

    @Column()
    socketId: string;

    @Column({default:false})
    mute: boolean;

    @Column({default:0})
    muteTimer?: number;

    @Column({default:""})
    muteDate?: string;
    
    @ManyToOne(() => Channel, (channel: Channel) => channel.userChannel)
    channel: Channel;

    @Column({default: 0})
    channelId: number;
}
export default UserChannel;