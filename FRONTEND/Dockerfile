# Runtime (Nginx)
FROM nginx:1.27-alpine

# Borramos la configuración por defecto y escribimos la nueva
RUN rm /etc/nginx/conf.d/default.conf

# Escribimos la configuración directamente en el Dockerfile (requiere BuildKit)
RUN printf "server { \n\
  listen 80; \n\
  server_name _; \n\
\n\
  root /usr/share/nginx/html; \n\
  index index.html; \n\
\n\
  # Cache static assets aggressively \n\
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ { \n\
    expires 1y; \n\
    add_header Cache-Control \"public, immutable\"; \n\
    try_files \$uri =404; \n\
  } \n\
\n\
  # SPA fallback \n\
  location / { \n\
    try_files \$uri \$uri/ /index.html; \n\
  } \n\
}" > /etc/nginx/conf.d/default.conf

# Copiamos tu carpeta dist local (que es lo que subiste)
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


