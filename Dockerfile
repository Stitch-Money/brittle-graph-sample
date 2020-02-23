FROM node:12-alpine as base


WORKDIR /app
ARG GITHUB_TOKEN
RUN export GITHUB_TOKEN=${GITHUB_TOKEN}
COPY .npmrc .npmrc
COPY package.json ./package.json

RUN npm install --only=prod

FROM base as builder

ARG GITHUB_TOKEN
RUN export GITHUB_TOKEN=${GITHUB_TOKEN}
RUN npm install --only=dev
COPY ./tsconfig.json ./tsconfig.json
COPY ./src/ ./src

RUN npm run build

FROM base as runner
COPY --from=builder /app/build /app/build/

ENTRYPOINT [ "/bin/sh", "-c", "npm run start" ]