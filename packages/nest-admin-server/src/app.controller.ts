import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }

  @Get('sissionLogin')
  sss(@Session() session) {
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
}
