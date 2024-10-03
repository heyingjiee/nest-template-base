import env from './env';
import * as process from 'node:process';
import { GlobalConfigType, GlobalEnvConfigType } from './type';
import { resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// 项目根目录
const rootDir = resolve(__dirname, '../../../');

// 与根目录同级。将日志等文件放在这里放置重新部署后删除
const rootPeerDir = resolve(rootDir, '../persist');
if (!existsSync(rootPeerDir)) {
  mkdirSync(rootPeerDir, { recursive: true });
}

const sourceDir = `${rootDir}/src`;

const envConfig: GlobalEnvConfigType = env[process.env.NODE_ENV];
console.log(`环境:${process.env.NODE_ENV} | 端口：${envConfig.port}`);

const appConfig: GlobalConfigType = {
  rootDir,
  sourceDir,
  logDir: `${rootPeerDir}/logs`,
  uploadDir: `${rootPeerDir}/upload`,
  staticAssetDir: `${sourceDir}/public`,
  applicationName: 'Nest',
  ...envConfig,
};

export default appConfig;
