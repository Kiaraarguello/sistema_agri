# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# instalar dependencias
COPY package*.json ./
RUN npm install

# copiar código
COPY . .

# generar build de React
RUN npm run build


# ---------- Runtime (Nginx) ----------
FROM nginx:1.27-alpine

# borrar config default
RUN rm /etc/nginx/conf.d/default.conf

# config nginx para SPA (React Router)
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

# copiar build generado
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
