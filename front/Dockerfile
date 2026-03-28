FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html style.css script.js /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html/

EXPOSE 80