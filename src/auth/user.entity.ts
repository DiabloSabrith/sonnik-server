// src/auth/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from '../chat/chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  authKey!: string;

  // Новый столбец — год рождения
  @Column({ type: 'int', nullable: true })
  birthYear?: number;

  // Новый столбец — путь к аватару
  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Chat, chat => chat.user)
  chats!: Chat[];
}
