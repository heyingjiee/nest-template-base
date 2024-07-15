#FROM node:18
FROM node:18-alpine3.19
RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm config set registry https://registry.npmmirror.com && npm install -g pnpm && npm install -g pm2 && pnpm install --production

EXPOSE 3000

# docker run xxx:xx prod  生产环境
# docker run xxx:xx qa 测试环境
# 通过npm启动pm2会报错 PM2 error: TypeError: One of the pids provided is invalid
CMD ["dev"]
ENTRYPOINT ["pm2-runtime", "ecosystem.config.cjs", "--env"]


