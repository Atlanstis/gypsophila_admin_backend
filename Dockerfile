# build stage
FROM node:21-alpine3.17 as build-stage

WORKDIR /app

COPY . .

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

RUN npm i -g pnpm
RUN pnpm install

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]