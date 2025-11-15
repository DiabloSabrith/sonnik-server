import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chat } from '../chat/chat.entity';

export enum MessageSender {
  USER = 'USER',
  AI = 'AI',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: MessageSender, default: MessageSender.USER })
  sender!: MessageSender;

  @Column()
  text!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat!: Chat;
}
