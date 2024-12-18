import { Injectable } from '@nestjs/common';
import { RoleService } from './modules/role/role.service';

@Injectable()
export class AppService {
  constructor(private readonly roleService: RoleService) {
    this.loadRedisCache();
  }

  /** 加载 redis 缓存 */
  loadRedisCache() {
    this.roleService.loadRMPs2Redis();
  }
}
