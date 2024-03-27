import { DataSource, EntityManager } from 'typeorm';

/** 数据库，事务操作 */
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
