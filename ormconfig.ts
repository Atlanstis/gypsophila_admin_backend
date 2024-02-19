import { DataSource, DataSourceOptions } from 'typeorm';
import config from './src/utils/config';
import {
  Menu,
  Role,
  User,
  Permission,
  RoleMenuPermission,
  SystemSetting,
  PsnProfile,
  PsnGame,
  PsnGameLink,
  PsnTrophyGroup,
  PsnTrophy,
  PsnTrophyLink,
  PsnProfileGame,
  PsnProfileGameTrophy,
  PsnProfileGameGuide,
} from './src/entities';

const mysqlConfing = config().mysql as {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

export const ormConfig: DataSourceOptions = {
  type: 'mysql',
  entities: [
    Menu,
    Role,
    User,
    Permission,
    RoleMenuPermission,
    SystemSetting,
    PsnProfile,
    PsnGame,
    PsnGameLink,
    PsnTrophyGroup,
    PsnTrophy,
    PsnTrophyLink,
    PsnProfileGame,
    PsnProfileGameTrophy,
    PsnProfileGameGuide,
  ],
  ...mysqlConfing,
  dateStrings: true,
  poolSize: 10,
  logging: true,
};

export default new DataSource({ ...ormConfig, migrations: ['migrations/**'] });
