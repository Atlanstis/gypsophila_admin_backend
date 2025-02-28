declare namespace Util {
  /**
   * 将对象中的某些属性设置为可选
   *
   * @template T - 原始对象类型
   * @template K - 要设置为可选的属性键
   * @param {T} obj - 原始对象
   * @param {K[]} keys - 要设置为可选的属性键数组
   * @returns {SetOptional<T, K>} - 设置了某些属性为可选的新对象
   */

  type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  /** 可空类型 */
  type Nullable<T> = T | null;

  /** 将可选属性设置为必须 */
  type RequiredProperty<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
  };
}
