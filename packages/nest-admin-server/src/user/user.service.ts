import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AuthenticationException } from './Exception/AuthenticationException';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectEntityManager()
  entityManager: EntityManager;

  async login(loginUser: LoginDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new AuthenticationException('用户名不存在');
    }
    if (user.password !== md5(loginUser.password)) {
      throw new AuthenticationException('密码错误');
    }
    return user;
  }

  async findRolesByIds(roleIds: number[]) {
    return this.entityManager.find(Role, {
      where: {
        id: In(roleIds),
      },
      relations: {
        permissions: true,
      },
    });
  }

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new AuthenticationException('用户已存在');
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
