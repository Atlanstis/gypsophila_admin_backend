import { BusinessException } from 'src/core';
import type {
  DataSource,
  EntityManager,
  EntityTarget,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

/**
 * 计算分页的跳过和获取数量。
 * @param page 当前页码，从 1 开始。
 * @param size 每页显示的记录数。
 * @returns 一个对象，包含 `skip` 和 `take` 属性。
 */
export function getSkipTake(page: number, size: number) {
  page = Math.max(1, page);
  size = Math.max(1, size);
  return {
    skip: (page - 1) * size,
    take: size,
  };
}

export async function findOneByNotExistError<T extends ObjectLiteral>(
  dataSource: DataSource,
  entityTarget: EntityTarget<T>,
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  errorMsg = '',
  relations: FindOptionsRelations<T> = {},
): Promise<T> {
  const repository: Repository<T> = dataSource.getRepository(entityTarget);
  const entity = await repository.findOne({ where, relations });
  if (!entity) {
    throw new BusinessException(errorMsg);
  }
  return entity;
}

export async function findOneByExistError<T extends ObjectLiteral>(
  dataSource: DataSource,
  entityTarget: EntityTarget<T>,
  where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  errorMsg = '',
  relations: FindOptionsRelations<T> = {},
) {
  const repository: Repository<T> = dataSource.getRepository(entityTarget);
  const entity = await repository.findOne({ where, relations });
  if (entity) {
    throw new BusinessException(errorMsg);
  }
}

/**
 *  使用事务处理数据源中的操作。
 * @param dataSource 数据源实例
 * @param inTransaction 在事务中执行的操作
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
    // 如果发生错误，回滚事务
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
