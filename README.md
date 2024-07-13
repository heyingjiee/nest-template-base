<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[![Deploy](https://github.com/heyingjiee/nest-template-base/actions/workflows/deploy.yml/badge.svg)](https://github.com/heyingjiee/nest-template-base/actions/workflows/deploy.yml)
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
