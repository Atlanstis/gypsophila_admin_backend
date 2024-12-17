import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** 加密数据校验 */
@ValidatorConstraint()
export class IsEncryptedData implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const { data, iv, key } = value;
    return (
      typeof data === 'string' &&
      typeof iv === 'string' &&
      typeof key === 'string'
    );
  }

  defaultMessage() {
    return '加密数据格式错误';
  }
}
