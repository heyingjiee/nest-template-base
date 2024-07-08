import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../user/entities/permission.entity';
import { Role } from '../../user/entities/role.entity';

const baseConfig: DataSourceOptions = {
  type: 'mysql', // 数据库类型，TypeORM目前支持mysql、 postgres、oracle、sqllite等
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'hedaodao',
  database: 'nest_practice', // 数据库名（也叫schema）。这里指定的数据库需要存在，否则会报错
  synchronize: true, // 是否自动同步entities内的实体到数据库
  logging: true, // 打印生成的sql语句
  entities: [User, Role, Permission], // 支持glob ['./**/entities/*.ts']、实体Class。注意配置为glob，synchronize失效，无法自动同步
  subscribers: [],
  poolSize: 10, // 连接池中连接的最大数量
  connectorPackage: 'mysql2', // 指定用什么驱动包。这里用的是mysql2，所以需要安装 npm install --save mysql2
};

// orm全局模块配置
const ormConfig = baseConfig;

// package脚本中typeorm生成migrations文件使用
const ormConfigForCLI = new DataSource({
  ...baseConfig,
  // synchronize:true自动将表结构的变动同步到数据库，这十分不安全的。migrations会生成sql文件，我们手动修改数据库
  // 注意这个只在script脚本migration:run、migration:revert中使用。如果放在baseConfig中，orm读取这个文件会报错
  migrations: ['./src/migrations/*.ts'],
});

export { ormConfig };

export default ormConfigForCLI;
