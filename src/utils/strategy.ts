/**
 * 执行策略。
 *
 * @param strategies - 策略数组。
 * @returns 如果所有策略都返回 true，则返回 true，否则返回 false。
 */
export function execSingleStrategy(
  strategies: Common.SingleStrategy[],
): boolean {
  return strategies.every((strategy) => strategy());
}
