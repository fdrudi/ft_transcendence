/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  export class Partecipant {
    public users : string;
    constructor(user: string)
    {
        this.users = user;
    }
  }

@Entity()
class Channel
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    ChannelName:string;

    @Column()
    Owner:string;

    @Column("simple-array")
    Admin: string[];

    @Column("simple-array")
    Partecipant : string[];

    @Column({nullable:true})
    Password?: string;
}
export default  Channel;