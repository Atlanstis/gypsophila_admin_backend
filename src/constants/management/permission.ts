type permissionKey = 'KEY_MAX' | 'NAME_MAX';

/** 权限各键值长度枚举 */
export const PERMISSION_LENGTH: Record<permissionKey, number> = {
  /** 权限 key 最大长度 */
  KEY_MAX: 32,
  /** 权限名称最大长度 */
  NAME_MAX: 16,
};

/** 权限操作类型 */
export enum PermissionTypeMenu {
  /** 查看列表 */
  List = 1,
  /** 新增 */
  Add = 2,
  /** 编辑 */
  Edit = 3,
  /** 删除 */
  Delete = 4,
  /** 其他 */
  Other = 0,
}
