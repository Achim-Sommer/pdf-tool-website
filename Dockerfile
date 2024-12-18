# Build Stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
# Kopiere die benutzerdefinierte Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Stelle sicher, dass .mjs-Dateien korrekt ausgeliefert werden
RUN echo 'application/javascript mjs;' >> /etc/nginx/mime.types

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
