/** 环境变量枚举 */
export enum ENV_VARS {
  /** mysql 配置 */
  MYSQL = 'mysql',
  /** 运行端口 */
  PORT = 'port',
  /** jwt 密钥 */
  JWT_SECRET = 'jwtSecret',
  /** jwt 密钥过期时间 */
  JWT_EXPIRES_IN = 'jwtExpiresIn',
}

/** mysql 数据库配置 */
export interface MysqlConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}
