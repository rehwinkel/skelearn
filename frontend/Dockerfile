FROM node:17 as build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install

COPY tsconfig.json babel.config.js webpack.config.ts ./
COPY src/ ./src/
RUN yarn build

FROM httpd:2.4-bullseye

COPY skelearn.conf /usr/local/apache2/conf/
RUN echo "Include conf/skelearn.conf" >> /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule proxy_module/LoadModule proxy_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule proxy_http_module/LoadModule proxy_http_module/g' /usr/local/apache2/conf/httpd.conf

COPY --from=build /build/dist /var/www/html/