import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  // Получение пользователя по токену
  @Get('me')
  async getUserByToken(@Query('authKey') authKey: string): Promise<User | null> {
    return this.authService.findByAuthKey(authKey);
  }

  // Обновление имени
  @Put('update-name')
  async updateName(
    @Query('authKey') authKey: string,
    @Body('name') name: string,
  ) {
    return this.authService.updateName(authKey, name);
  }

  // Обновление почты
  @Put('update-email')
  async updateEmail(
    @Query('authKey') authKey: string,
    @Body('email') email: string,
  ) {
    return this.authService.updateEmail(authKey, email);
  }

  // Обновление года рождения
  @Put('update-birth-year')
  async updateBirthYear(
    @Query('authKey') authKey: string,
    @Body('year') year: number,
  ) {
    return this.authService.updateBirthYear(authKey, year);
  }

  // Загрузка аватара
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_, file, callback) => {
          const ext = file.originalname.split('.').pop();
          const fileName = `${Date.now()}.${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadAvatar(
    @Query('authKey') authKey: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `/uploads/avatars/${file.filename}`;
    return this.authService.updateAvatar(authKey, filePath);
  }
}
