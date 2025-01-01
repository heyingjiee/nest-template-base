#FROM node:18
FROM node:18-alpine3.19
RUN mkdir /app
WORKDIR /app
COPY . .

# --ignore-scripts 是用来忽略 prepare 脚本的，install时会触发 husky ，但其生产依赖中没有所以会报错
RUN npm config set registry https://registry.npmmirror.com && npm install -g pnpm && npm install -g pm2 && pnpm install --production --ignore-scripts


EXPOSE 3000

# docker run xxx:xx prod  生产环境
# docker run xxx:xx qa 测试环境
# 通过npm启动pm2会报错 PM2 error: TypeError: One of the pids provided is invalid
CMD ["dev"]
ENTRYPOINT ["pm2-runtime", "ecosystem.config.cjs", "--env"]


