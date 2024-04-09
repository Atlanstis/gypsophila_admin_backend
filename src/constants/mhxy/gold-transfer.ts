type MhxyGoldTransferPolicyKey = 'NAME_MAX';

export const MHXY_GOLD_TRANSFER_POLICY_LENGTH: Record<MhxyGoldTransferPolicyKey, number> = {
  /** 名称最大长度 */
  NAME_MAX: 32,
};

export enum ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS {
  /** 开启 */
  OPEN = 'open',
  /** 关闭 */
  CLOSE = 'close',
}
