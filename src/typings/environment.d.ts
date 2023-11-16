declare namespace Environment {
  /** mysql 数据库配置 */
  interface MysqlConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
  }

  /** redis 配置 */
  interface RedisConfig {
    host: string;
    port: number;
  }
}
