# Backend Runtime
FROM node:20-alpine

# Instalamos dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiamos el package.json para instalar dependencias primero (cacheable)
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Exponemos el puerto del backend
EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Ejecutamos el inicio (ts-node según tu package.json)
CMD ["npm", "run", "start"]

