/** mysql 数据库配置 */
interface Mysql {
  /** 数据库主机地址 */
  host: string;
  /** 数据库端口号 */
  port: number;
  /** 数据库用户名 */
  username: string;
  /** 数据库密码 */
  password: string;
  /** 数据库名称 */
  database: string;
  /** 是否自动同步数据库结构 */
  synchronize: boolean;
}

/** redis 配置 */
interface Redis {
  /** Redis 服务器主机地址 */
  host: string;
  /** Redis 服务器端口号 */
  port: number;
}

/** jwt 配置 */
interface Jwt {
  /** JWT 密钥 */
  secret: string;
  /** 访问令牌过期时间（秒） */
  accessExpire: number;
  /** 刷新令牌过期时间（秒） */
  refreshExpire: number;
}

/** 应用程序配置 */
export interface Configuration {
  /** 应用程序监听端口 */
  port: number;
  /** MySQL 数据库配置 */
  mysql: Mysql;
  /** Redis 配置 */
  redis: Redis;
  /** JWT 配置 */
  jwt: Jwt;
}
