FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
ARG GOOGLE_PLACES_API_KEY=""
RUN sed -i "s|__GOOGLE_PLACES_API_KEY__|${GOOGLE_PLACES_API_KEY}|g" src/environments/environment.ts
RUN npm run build

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/sunisland-staff/browser /usr/share/nginx/html
