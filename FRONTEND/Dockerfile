FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN printf "server { \n\
  listen 80; \n\
  server_name _; \n\
\n\
  root /usr/share/nginx/html; \n\
  index index.html; \n\
\n\
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ { \n\
    expires 1y; \n\
    add_header Cache-Control \"public, immutable\"; \n\
    try_files \$uri =404; \n\
  } \n\
\n\
  location / { \n\
    try_files \$uri \$uri/ /index.html; \n\
  } \n\
}" > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
