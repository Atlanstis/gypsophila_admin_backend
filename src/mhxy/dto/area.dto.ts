import { Allow } from 'class-validator';

export class AreaDto {
  id: number;

  @Allow()
  name: string;

  @Allow()
  openDate: Date;
}
