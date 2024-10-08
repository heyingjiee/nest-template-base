<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[![Deploy](https://github.com/heyingjiee/nest-template-base/actions/workflows/deploy.yml/badge.svg)](https://github.com/heyingjiee/nest-template-base/actions/workflows/deploy.yml)

## 待办
- [x] 日志集成链路追踪
- [x] 上传文件Demo
- [x] 分片上传、下载文件Demo 
- [ ] 验签
- [ ] 用户鉴权
  - [x] 账号密码登录
  - [x] Github登录
  - [ ] 扫码登录
  - [ ] 邮箱/短信验证登录
  - [ ] 登录审计（判定是否常用 IP 、邮件通知）
- [ ] 微服务、Monorepo模版
- [ ] 集成爬虫模块


## 集成工具

### Husky
项目已集成 Eslint、Prettier、Commitlint，Git提交时进行校验

### Swagger
```text
http://127.0.0.1:3000/doc
```

### Compodoc
```bash
$ pnpm run compodoc
```

### Typeorm、Redis
Typeorm使用nest提供的动态模块   
项目中将Redis也封装为了动态模块
```ts
export class Xxx {
  @Inject()
  private readonly redis: Redis;
}
```

### Axios请求工具
参考接口：/axios-example
```ts
export class Xxx {
  @Inject('Axios')
  private readonly axios: AxiosInstance;
}
```

### 日志
```ts
export class Xxx {
  @Inject()
  private readonly logger: CustomLogger;
}
```

项目接口请求、响应日志已集成到日志中
```text
[Nest] [2024-07-17 10:25:56.913] [2e81f11d-d3d6-45f1-b692-53f07c175fde] [info] [请求] [POST][/user/login]
[Nest] [2024-07-17 10:25:56.929] [2e81f11d-d3d6-45f1-b692-53f07c175fde] [info] [响应] [POST][/user/login][201] 接口响应内容
```
提供装饰器 @NoResponseLog() 关闭项目接口响应日志

发起三方请求、响应日志已集成到日志中(使用Axios发起请求)
```text
[Nest] [2024-07-17 10:27:10.126] [616864ba-45f6-4768-8747-c66ad5e97e46] [info] [外部请求] [GET][https://httpbin.org/get]
[Nest] [2024-07-17 10:27:11.326] [616864ba-45f6-4768-8747-c66ad5e97e46] [info] [外部响应] [GET][https://httpbin.org/get][200] 接口响应内容
```

日志已集成traceId链路追踪
```text
Console输出第三位 [616864ba-45f6-4768-8747-c66ad5e97e46] 就是traceId
```

### 静态资源服务器
资源放置于 /src/public/ 目录下
```text
# 请求静态资源
http://127.0.0.1:3000/static/xxx
```


## Demo样例

### 基于角色鉴权
```text
src/user # user模块实现了 登录拦截器、鉴权拦截器
```

### 邮件样例
```text
src/email/email.module.ts
```

### 定时任务样例
```text
src/scheduler/scheduler.controller.ts
```

### SSE样例
```text
src/app.controller.ts
```
接口：/real-time-log   
前端页面：http://127.0.0.1:3000/static/real-time-log.html

### WebSocket样例
```text
src/socket/socket.gateway.ts 
```
参考接口：socket.gateway.ts下全部接口  
前端页面：http://127.0.0.1:3000/static/socket.html


## 安装依赖

```bash
$ pnpm install
```

## 运行App
```bash
# 本地开发模式
$ pnpm start:dev

# 生产模式
$ pnpm start:prod
```

## 部署App
本项目使用 Github Action部署 ，提交PR到deploy分支即可自动部署  

注意1：请提前配置`.github/workflows/deploy.yml` 文件中的secret字段

注意2：Dockerfile、ecosystem.config.cjs的路径均是相对于构建目录dist



## 项目结构依赖
```bash
$ pnpm compodoc
```

## 数据库迁移
```bash
# 生成迁移文件
$ migration:generate

# 执行迁移文件
$ migration:run

# 撤回迁移
$ migration:revert
```

## 测试

```bash
# 单元测试
$ pnpm run test

# e2e测试
$ pnpm run test:e2e

# 覆盖率
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
