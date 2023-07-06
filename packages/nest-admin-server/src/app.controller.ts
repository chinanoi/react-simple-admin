import {
  Controller,
  Get,
  Headers,
  Inject,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }

  @Get('aaa')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb';
  }

  @Get('sss')
  sss(@Session() session) {
    console.log(session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
}
