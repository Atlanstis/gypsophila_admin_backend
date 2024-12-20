import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsMPsArray implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.every((item) => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.menuId === 'number' &&
        Array.isArray(item.permissionIds) &&
        item.permissionIds.every((id) => typeof id === 'number')
      );
    });
  }

  defaultMessage() {
    return '数据格式错误';
  }
}
