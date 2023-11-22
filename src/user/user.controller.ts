import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { PageDto } from './dto/page.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 用户列表 */
  @Post('/list')
  async list(@Body() dto: PageDto) {
    return this.userService.list(dto.page, dto.size);
  }
}
