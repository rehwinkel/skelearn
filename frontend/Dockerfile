FROM node:17 as build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM httpd:2.4-alpine

COPY .htaccess /usr/local/apache2/htdocs/
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf
COPY --from=build /build/dist /usr/local/apache2/htdocs/