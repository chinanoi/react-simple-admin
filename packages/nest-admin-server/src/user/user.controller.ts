import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  Controller,
  Post,
  HttpCode,
  Body,
  Inject,
  Req,
  Res,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      const token = await this.jwtService.signAsync(
        {
          user: {
            id: foundUser.id,
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        { expiresIn: '2d' },
      );
      res.setHeader('authorization', 'bearer ' + token);
      return {
        code: 200,
        data: {
          userName: foundUser.username,
        },
        message: '登录成功',
      };
    } else {
      return {
        code: 403,
        message: '登录失败, 用户名或密码错误',
      };
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }
}
