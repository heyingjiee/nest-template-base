import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/entities/role.entity';
import { Permission } from '../../user/entities/permission.entity';

export default {
  dev: {
    redisConfig: {
      host: '127.0.0.1',
      port: 6379,
    },
    ormConfig: {
      type: 'mysql', // 数据库类型，TypeORM目前支持mysql、 postgres、oracle、sqllite等
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'hedaodao',
      database: 'nest_practice', // 数据库名（也叫schema）。这里指定的数据库需要存在，否则会报错
      synchronize: false, // 是否自动同步entities内的实体到数据库
      logging: false, // 打印生成的sql语句
      entities: [User, Role, Permission], // 支持glob ['./**/entities/*.ts']、实体Class。注意配置为glob，synchronize失效，无法自动同步
      poolSize: 10, // 连接池中连接的最大数量
      connectorPackage: 'mysql2', // 指定用什么驱动包。这里用的是mysql2，所以需要安装 npm install --save mysql2
    },
  },
  qa: {
    redisConfig: {
      host: '127.0.0.1',
      port: 6379,
    },
    ormConfig: {
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
    },
  },
  prod: {
    redisConfig: {
      host: '10.0.16.11',
      port: 6379,
    },
    ormConfig: {
      type: 'mysql', // 数据库类型，TypeORM目前支持mysql、 postgres、oracle、sqllite等
      host: '10.0.16.11',
      port: 3306,
      username: 'root',
      password: 'hedaodao',
      database: 'nest_practice', // 数据库名（也叫schema）。这里指定的数据库需要存在，否则会报错
      poolSize: 10, // 连接池中连接的最大数量
      connectorPackage: 'mysql2', // 指定用什么驱动包。这里用的是mysql2，所以需要安装 npm install --save mysql2
    },
  },
};
