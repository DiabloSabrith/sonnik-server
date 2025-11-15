import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Регистрация с проверкой уникальности email и phone
  async register(createUserDto: CreateUserDto): Promise<User> {
    // Проверка email
    if (createUserDto.email) {
      const existingEmailUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingEmailUser) {
        throw new ConflictException('Пользователь с такой почтой уже существует');
      }
    }

    // Проверка phone
    if (createUserDto.phone) {
      const existingPhoneUser = await this.usersRepository.findOne({
        where: { phone: createUserDto.phone },
      });

      if (existingPhoneUser) {
        throw new ConflictException('Пользователь с таким номером телефона уже существует');
      }
    }

    const authKey = randomBytes(16).toString('hex');

    const user = this.usersRepository.create({
      name: createUserDto.name,
      phone: createUserDto.phone,
      email: createUserDto.email,
      authKey,
    });

    return this.usersRepository.save(user);
  }

  // Получение пользователя по authKey
  async findByAuthKey(authKey: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { authKey },
      relations: ['chats', 'chats.messages'],
    });
  }

  // Примитивный логин по имени, телефону или email
  async login(identifier: string): Promise<{ authKey: string; user: User }> {
    const user = await this.usersRepository.findOne({
      where: [
        { name: identifier },
        { phone: identifier },
        { email: identifier },
      ],
      relations: ['chats', 'chats.messages'],
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return { authKey: user.authKey, user };
  }

  // Обновление имени
  async updateName(authKey: string, name: string): Promise<User> {
    const user = await this.findByAuthKey(authKey);
    if (!user) throw new NotFoundException('User not found');

    user.name = name;
    return this.usersRepository.save(user);
  }

  // Обновление email
  async updateEmail(authKey: string, email: string): Promise<User> {
    const user = await this.findByAuthKey(authKey);
    if (!user) throw new NotFoundException('User not found');

    user.email = email;
    return this.usersRepository.save(user);
  }

  // Обновление года рождения
  async updateBirthYear(authKey: string, year: number): Promise<User> {
    const user = await this.findByAuthKey(authKey);
    if (!user) throw new NotFoundException('User not found');

    user.birthYear = year;
    return this.usersRepository.save(user);
  }

  // Обновление аватара
  async updateAvatar(authKey: string, filePath: string): Promise<User> {
    const user = await this.findByAuthKey(authKey);
    if (!user) throw new NotFoundException('User not found');

    user.avatar = filePath;
    return this.usersRepository.save(user);
  }
}
