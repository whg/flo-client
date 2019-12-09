FROM node:12.13-alpine as build
WORKDIR /client
ENV PATH /client/node_modules/.bin:$PATH
COPY package.json /client/package.json
RUN yarn install
RUN yarn add @vue/cli@3.7.0 -g
COPY . /client
RUN yarn run build

FROM nginx:1.16.1-alpine
COPY --from=build /client/dist /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
