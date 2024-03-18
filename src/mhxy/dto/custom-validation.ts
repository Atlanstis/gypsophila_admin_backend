import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { MhxyAccountDto } from '.';
import { MHXY_ACCOUNT_ROLE_OPTS, MHXY_ACCOUNT_SECT_OPTS } from 'src/constants';

@ValidatorConstraint({ name: 'MhxyRole', async: false })

/** 角色验证 */
export class MhxyRoleValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const { role } = args.object as MhxyAccountDto;
    return !!MHXY_ACCOUNT_ROLE_OPTS.find((item) => item.value === role);
  }
}

/** 门派验证 */
export class MhxySectValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const { sect } = args.object as MhxyAccountDto;
    return !!MHXY_ACCOUNT_SECT_OPTS.find((item) => item.value === sect);
  }
}
