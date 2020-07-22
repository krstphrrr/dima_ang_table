FROM node:latest as compile-image

RUN mkdir /opt/ng 
WORKDIR /opt/ng
COPY . ./


RUN npm install
RUN npm install -g @angular/cli
# # building angular
RUN ng build --prod

# RUN vue-cli
# IMAGE 2: setting up the webserver
FROM nginx

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
# VOLUME /etc/apache2/ssl.crt:/etc/apache2/ssl.crt
# VOLUME ./apache2nginx/apache:/etc/apache2
# VOLUME /etc/apache2/ssl.priv:/etc/apache2/ssl.priv

COPY --from=compile-image /opt/ng/dist/angdimatable /usr/share/nginx/html
COPY --from=compile-image /opt/ng/nginx/conf.d/default.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# sudo docker container run --rm -d --name dima_check -p 4201:80 dima_check