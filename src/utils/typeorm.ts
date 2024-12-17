import { BusinessException } from 'src/core';
import type {
  DataSource,
  EntityManager,
  EntityTarget,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

/**
 * 根据条件查找单个资源
 * @param dataSource 数据库资源
 * @param entityTarget 对应的实体
 * @param where 查询条件
 * @param judgeFn 报错条件
 * @param errorMsg 报错信息
 * @param relations 关联查询
 * @returns 相应的资源
 */
export async function findOneBy<T>(
  dataSource: DataSource,
  entityTarget: EntityTarget<T>,
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  judgeFn: (entity: T | null) => boolean,
  errorMsg = '',
  relations: FindOptionsRelations<T> = {},
): Promise<T | null> {
  const repository: Repository<T> = dataSource.getRepository(entityTarget);
  const entity = await repository.findOne({ where, relations });
  if (judgeFn(entity)) {
    throw new BusinessException(errorMsg);
  }
  return entity;
}

/**
 *  数据库，事务操作
 * @param dataSource 数据库资源
 * @param inTransaction 在事务中执行的函数
 */
export async function useTransaction(
  dataSource: DataSource,
  inTransaction: (manage: EntityManager) => Promise<void>,
) {
  // 使用事务，发生错误时，回滚操作
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.startTransaction();
    await inTransaction(queryRunner.manager);
    // 提交事务
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
