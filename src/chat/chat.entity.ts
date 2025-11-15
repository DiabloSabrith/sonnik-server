// src/chat/chat.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../auth/user.entity';
import { Message } from '../message/message.entity';


@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  title?: string; // Имя чата для списка

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.chats, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Message, message => message.chat)
  messages!: Message[];
}
