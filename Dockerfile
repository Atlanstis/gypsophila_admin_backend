# build stage
FROM node:21-alpine3.17 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:21-alpine3.17 as production-stage

COPY --from=build-stage /app/config /app/config
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --omit=dev

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]