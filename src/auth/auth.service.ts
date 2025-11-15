import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./create-user.dto";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Регистрация
  async register(createUserDto: CreateUserDto): Promise<User> {
    const authKey = randomBytes(16).toString('hex');

    const user = this.usersRepository.create({
      name: createUserDto.name,
      phone: createUserDto.phone,
      email: createUserDto.email,
      authKey,
    });

    return this.usersRepository.save(user);
  }

  // Получение по токену
  async findByAuthKey(authKey: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { authKey },
      relations: ['chats', 'chats.messages'],
    });
  }

  // Обновление имени
  async updateName(authKey: string, name: string): Promise<User> {
    const user = await this.findByAuthKey(authKey);
    if (!user) throw new NotFoundException('User not found');

    user.name = name;
    return this.usersRepository.save(user);
  }

  // Обновление e-mail
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
