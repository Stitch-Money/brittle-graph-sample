FROM node:12-alpine as build


WORKDIR /app
ARG GITHUB_TOKEN
RUN export GITHUB_TOKEN=${GITHUB_TOKEN}
COPY .npmrc .npmrc
COPY ./tsconfig.json ./tsconfig.json
COPY package.json ./package.json

RUN npm install

COPY ./src/ ./src

RUN npm run build
RUN npm run pkg

FROM alpine:latest as runner
WORKDIR /app
ENV NODE_ENV=production

# install required libs
RUN apk update && apk add --no-cache libstdc++ libgcc

# copy prebuilt binary from previous step
COPY --from=build /app/app /app/app
CMD ["/app/app"]
