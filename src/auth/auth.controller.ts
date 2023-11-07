import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** 用户登录 */
  @Post('/login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user.username, user.password);
  }

  /** 用户注册 */
  @Post('/register')
  register(@Body() user: RegisterDto) {
    this.authService.register(user.username, user.password);
  }
}
