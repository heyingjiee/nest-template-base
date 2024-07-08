FROM node:16

ENV PATH="$PATH:/usr/local/node/bin"

RUN mkdir /app
WORKDIR /app
COPY dist .
COPY ecosystem.config.js .

RUN ln -s /sbin/runc /usr/bin/runc

EXPOSE 3000

# docker run xxx:xx prod  生产环境
# docker run xxx:xx qa 测试环境
# 通过npm启动pm2会报错 PM2 error: TypeError: One of the pids provided is invalid
CMD ["prod"]
ENTRYPOINT ["pm2-runtime", "ecosystem.config.js", "--env"]
