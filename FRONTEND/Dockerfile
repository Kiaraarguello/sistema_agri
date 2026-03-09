# Usamos Nginx para servir el contenido estático
FROM nginx:stable-alpine

# Copiamos directamente tu carpeta dist al directorio de Nginx
COPY dist/ /usr/share/nginx/html

# Configuración para soportar React Router (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    client_max_body_size 50M; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

