import env from './env';
import * as process from 'node:process';
import { GlobalConfigType, GlobalEnvConfigType } from './type';
import { resolve } from 'node:path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// 项目根目录
const rootDir = resolve(__dirname, '../../../');

const envConfig: GlobalEnvConfigType = env[process.env.NODE_ENV];
console.log('环境', process.env.NODE_ENV);

const appConfig: GlobalConfigType = {
  rootDir,
  logDir: `${rootDir}/logs`,
  ...envConfig,
};

export default appConfig;
