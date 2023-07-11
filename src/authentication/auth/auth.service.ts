import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: User) {
    return {
      accessToken: await this.jwtService.signAsync({ ...user }),
    };
  }

  async validateUser(signInDto: SignInDto): Promise<any> {
    const { username, password } = signInDto;
    const user = await this.userService.findOneByUsername(username);
    const isMatch = await bcrypt.compare(password, user?.password);
    if (isMatch) {
      return user;
    }
    return null;
  }
}
