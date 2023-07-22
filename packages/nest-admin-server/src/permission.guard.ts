// import { RedisService } from './redis/redis.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permission } from './user/entities/permission.entity';
import { UserService } from './user/user.service';
import { AuthenticationException } from './user/Exception/AuthenticationException';
import { PermissionException } from './user/Exception/PermissionException';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  //   @Inject(RedisService)
  //   private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!(request as any).user) {
      return true;
    }

    const user = (request as any).user;

    const authHeader = request.header('authorization') || '';

    if (!authHeader) {
      throw new AuthenticationException('用户未登录');
    }

    const bearer = authHeader.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new AuthenticationException('登录 token 错误');
    }

    const roles = await this.userService.findRolesByIds(
      user.roles.map((item) => item.id),
    );

    const permissions: Permission[] = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions) {
      throw new PermissionException('您没有访问该接口的权限');
    }

    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.name === curPermission);
      if (!found) {
        throw new PermissionException('您没有访问该接口的权限');
      }
    }
    return true;
  }
}
