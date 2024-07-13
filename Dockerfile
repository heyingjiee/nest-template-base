# build stage
FROM node:18 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/ecosystem.config.cjs  /app/ecosystem.config.cjs

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/ && npm install -g pnpm && pnpm install --production

EXPOSE 3000

# docker run xxx:xx prod  生产环境
# docker run xxx:xx qa 测试环境
# 通过npm启动pm2会报错 PM2 error: TypeError: One of the pids provided is invalid
CMD ["dev"]
ENTRYPOINT ["pm2-runtime", "ecosystem.config.cjs", "--env"]


