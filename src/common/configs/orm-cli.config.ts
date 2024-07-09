// package脚本中typeorm生成migrations文件使用
import { DataSource } from 'typeorm';
import env from './env';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

const ormConfig = env['prod'].ormConfig as DataSourceOptions;
const ormConfigForCLI = new DataSource({
  ...ormConfig,
  // synchronize:true自动将表结构的变动同步到数据库，这十分不安全的。migrations会生成sql文件，我们手动修改数据库
  // 注意这个只在script脚本migration:run、migration:revert中使用。如果放在baseConfig中，orm读取这个文件会报错
  migrations: ['./src/migrations/*.ts'],
});

export default ormConfigForCLI;
