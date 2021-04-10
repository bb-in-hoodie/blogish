# build client
FROM node:15.11.0-alpine3.13 AS build
WORKDIR /client

# install dependencies
COPY ./package*.json .
RUN ["npm", "install"]

# build frontend
COPY . .
RUN ["npm", "run", "build"]

# serve client using nginx
FROM nginx:1.18
COPY --from=build /client/build /usr/share/nginx/html
COPY --from=build /client/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80