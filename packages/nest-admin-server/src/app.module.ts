import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient } from 'redis';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { RedisModule } from './redis/redis.module';

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
      entities: [User, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    RoleModule,
    DepartmentModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
