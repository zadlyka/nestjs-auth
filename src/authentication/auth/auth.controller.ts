import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { WithoutJwt } from './decorators/without-jwt.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @WithoutJwt()
  @UseGuards(AuthGuard('local'))
  create(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
