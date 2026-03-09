# Usa una imagen de Node.js ligera basada en Alpine
FROM node:20-alpine

# Instalamos dependencias del sistema necesarias para Prisma y otras librerías
RUN apk add --no-cache libc6-compat openssl

# Seteamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para usar ts-node)
RUN npm install

# Copiamos el resto de los archivos del backend
COPY . .

# Generamos el cliente de Prisma para interactuar con la base de datos
RUN npx prisma generate

# Exponemos el puerto 4000 (el que usa tu servidor Express)
EXPOSE 4000

# Definimos las variables de entorno recomendadas
ENV NODE_ENV=production
ENV PORT=4000

# Iniciamos el servidor usando el script definido en package.json
# Nota: "start" usa ts-node en este proyecto. Para producción real, lo ideal sería compilarlo.
CMD ["npm", "run", "start"]
