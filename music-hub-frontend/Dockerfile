FROM nginx:1.20.2-alpine

RUN apk update && apk add nginx-mod-http-headers-more

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
#COPY musichub.test.crt /etc/nginx/musichub.test.crt
#COPY musichub.test.key /etc/nginx/musichub.test.key

COPY dist/angular-registration-login-example/ /usr/share/nginx/html/music-hub-app/
COPY entrypoint-client.sh /entrypoint-client.sh

COPY package*.json /usr/share/nginx/html/music-hub-app/

RUN apk add bash
RUN dos2unix -u entrypoint-client.sh

CMD ["/entrypoint-client.sh"]
