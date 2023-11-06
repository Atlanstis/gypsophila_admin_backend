import * as yml from 'js-yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * 根据环境变量，读取 yml 环境中的参数
 */
export default async () => {
  const envConfigFilePath = join(
    process.cwd(),
    `config/${process.env.NODE_ENV || 'development'}.yml`,
  );
  const envConfigFile = await readFile(envConfigFilePath, 'utf-8');
  const envConfig = yml.load(envConfigFile);
  return envConfig;
};
