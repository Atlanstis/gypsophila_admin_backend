/**
 * 获取存入 redis 缓存中，token 的键值
 * @param id 用户id
 * @param type token 类型
 * @returns redis 中存的键值
 */
export function getTokenKeyName(id: string, type: 'access_token' | 'refresh_token') {
  return `${type}-${id}`;
}
