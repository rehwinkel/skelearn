FROM node:17 as build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM httpd:2.4-alpine
COPY --from=build /build/dist /usr/local/apache2/htdocs/