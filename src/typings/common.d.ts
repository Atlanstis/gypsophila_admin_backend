declare namespace Common {
  /** 加密数据 */
  interface EncryptData {
    data: string;
    iv: string;
    key: string;
  }

  /** 可空类型 */
  type Nullable<T> = null | T;

  /** 单策略 */
  type SingleStrategy = () => boolean;
}
