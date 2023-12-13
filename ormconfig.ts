import { DataSource, DataSourceOptions } from 'typeorm';
import config from 'src/utils/config';
// import { Menu, Role, User, Permission, RoleMenuPermission } from 'src/entities';

const mysqlConfing = config().mysql as Environment.MysqlConfig;

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  entities: [],
  ...mysqlConfing,
};

export default new DataSource({ ...ormConfig, migrations: ['src/migrations/** '] });
