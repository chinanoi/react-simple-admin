import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { createClient } from 'redis';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
// import { RedisModule } from './redis/redis.module';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'baiyi',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'baiyi',
      database: 'my_admin',
      synchronize: true,
      logging: true,
      entities: [User, Permission, Role],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    RoleModule,
    DepartmentModule,
    // RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
