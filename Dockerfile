FROM node:22-alpine AS build
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/app/build /usr/share/nginx/html
EXPOSE 80
