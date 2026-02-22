# Guía de Inicio - Backend de Agrimensura 

Esta guía detalla los pasos necesarios para configurar y ejecutar el servidor de la aplicación desde cero.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 16 o superior.
- **PostgreSQL**: Servidor de base de datos relacional.
- **npm**: Manejador de paquetes (se instala con Node.js).

---

## 2. Configuración de la Base de Datos

1. Abre tu gestor de base de datos (ej. pgAdmin o terminal `psql`).
2. Crea una base de datos llamada: `agrimensura`.
3. Asegúrate de tener a mano el usuario y la contraseña de PostgreSQL.

---

## 3. Configuración del Entorno (`.env`)

Dentro de la carpeta `BACKEND`, encontrarás un archivo llamado `.env`. Debes configurarlo con tus credenciales:

```env
# Formato: postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/DATABASE
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/agrimensura"

PORT=4000
```

> **Importante**: Cambia `tu_password` por la contraseña real de tu usuario `postgres`.

---

## 4. Instalación de Dependencias

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
cd BACKEND
npm install
```

Esto instalará:
- **Express**: Framework para el servidor.
- **Prisma**: ORM para interactuar con la base de datos.
- **TypeScript**: Para un desarrollo más seguro y ordenado.
- **xlsx**: Librería para la importación de datos desde Excel.

---

## 5. Preparación de la Base de Datos (Migraciones)

Para crear las tablas automáticamente en PostgreSQL basándose en nuestro esquema, ejecuta:

```bash
npx prisma migrate dev --name init
```

---

## 6. Ejecución del Servidor

Para iniciar el servidor en modo desarrollo (con auto-recargado):

```bash
npm run dev
```

El servidor estará escuchando en: `http://localhost:4000`

---

## 7. Scripts Adicionales

- **Prisma Studio**: Una interfaz visual para ver y editar tus datos de la BD:
  ```bash
  npm run studio
  ```
- **Importación de Excel**: (Próximamente) El script de importación se ejecutará para cargar los datos del archivo `.xlsx` de clientes.

---

## Notas para Desarrolladores

El backend está construido con:
- **Express.js**: Manejo de rutas.
- **Prisma ORM**: Modelado y consultas a BD.
- **TypeScript**: Tipado estático.
- **CORS**: Configurado para permitir peticiones desde el frontend (puerto 5173).
