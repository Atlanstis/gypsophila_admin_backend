import { Injectable } from '@nestjs/common';
import { RoleService } from './modules';
import { RedisService } from './modules/auxiliary';

@Injectable()
export class AppService {
  constructor(
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
  ) {
    this.loadRMPs2Redis();
  }

  /** 加载权限关系到 redis 中 */
  loadRMPs2Redis() {
    this.roleService.loadRMPs2Redis();
  }
}
