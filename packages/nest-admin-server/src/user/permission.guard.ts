import { RedisService } from './../redis/redis.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { AuthenticationException } from './Exception/AuthenticationException';
import { PermissionException } from './Exception/PermissionException';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.header('authorization') || '';

    if (!authHeader) {
      throw new AuthenticationException('用户未登录');
    }

    const bearer = authHeader.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new AuthenticationException('登录 token 错误');
    }

    const token = bearer[1];

    const info = this.jwtService.verify(token);

    const user = info.user;

    let permissions = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );

    if (permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map((item) => item.name);

      this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissions,
        60 * 30,
      );
    }

    const permission = this.reflector.get('permission', context.getHandler());

    if (permissions.some((item) => item === permission)) {
      return true;
    } else {
      throw new PermissionException('没有权限访问该接口');
    }
  }
}
