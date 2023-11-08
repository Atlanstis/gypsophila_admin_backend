import { rimraf } from 'rimraf';
import { join } from 'path';

console.log('Cleaning logs...');
rimraf(join(process.cwd(), `logs`)).then(() => {
  console.log('Cleaning Done');
});
