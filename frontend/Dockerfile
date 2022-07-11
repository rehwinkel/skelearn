FROM node:17 as build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install

COPY tsconfig.json babel.config.js webpack.config.ts ./
COPY src/ ./src/
ARG SKELEARN_HOST
RUN SKELEARN_HOST=$SKELEARN_HOST yarn build

FROM httpd:2.4-bullseye

COPY skelearn.conf /tmp/
ARG SKELEARN_HOST
RUN cat /tmp/skelearn.conf | sed "s/SKELEARN_HOST/${SKELEARN_HOST}/g" > /usr/local/apache2/conf/skelearn.conf
RUN echo "Include conf/skelearn.conf" >> /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule proxy_module/LoadModule proxy_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule proxy_http_module/LoadModule proxy_http_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/#LoadModule ssl_module/LoadModule ssl_module/g' /usr/local/apache2/conf/httpd.conf
RUN sed -i 's/Listen 80/Listen 80\nListen 443/g' /usr/local/apache2/conf/httpd.conf

COPY ssl/skelearn.key ssl/skelearn.cert /etc/apache2/certificate/
COPY images/ /var/www/img/
COPY --from=build /build/dist /var/www/html/