import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PsnProfileGameGuideDto } from '.';
import { PSN_PROFILE_GAME_GUIDE_TYPE_ENUM } from 'src/constants';

@ValidatorConstraint({ name: 'GameGuideUrl', async: false })
/** URL 验证 */
export class GameGuideUrlValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const object = args.object as PsnProfileGameGuideDto;
    if (object.type === PSN_PROFILE_GAME_GUIDE_TYPE_ENUM.URL) {
      const constraints = args.constraints as [number, number];
      return text && text.length >= constraints[0] && text.length <= constraints[1];
    }
    return true;
  }
}
