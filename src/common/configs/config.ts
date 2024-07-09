import env from './env';
import * as process from 'node:process';
import { GlobalConfigType, GlobalEnvConfigType } from './type';

const envConfig: GlobalEnvConfigType = env[process.env.NODE_ENV];
console.log('环境', process.env.NODE_ENV);

const appConfig: GlobalConfigType = {
  ...envConfig,
};

export default appConfig;
