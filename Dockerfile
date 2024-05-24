# build stage
FROM node:21-alpine3.17 as build-stage

WORKDIR /app

COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm build

# production stage
FROM node:21-alpine3.17 as production-stage

COPY --from=build-stage /app/config /app/config
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/migrations /app/migrations
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm i -g pnpm
RUN pnpm install


# 安装 tzdata 包以及其他必要的工具
RUN apk add --no-cache tzdata

# 设置时区为上海
ENV TZ=Asia/Shanghai

# 更新并安装 tzdata 包
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


EXPOSE 3000

CMD [ "pnpm", "run", "start:prod" ]