import { Injectable } from '@nestjs/common';
import { RoleService } from './modules';

@Injectable()
export class AppService {
  constructor(private readonly roleService: RoleService) {
    this.load2Redis();
  }

  /** 加载数据到 redis */
  load2Redis() {
    this.roleService.loadRMPs2Redis();
    this.roleService.loadRM2Redis();
  }
}
