-- CreateEnum
CREATE TYPE "Etapa" AS ENUM ('Catastro', 'Presupuesto', 'Relevamiento', 'Plano', 'Presentacion', 'Certificado', 'Visado', 'Mojones', 'Archivo');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni_cuit" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terreno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "codigo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Terreno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expediente" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "etapa" "Etapa" NOT NULL DEFAULT 'Presupuesto',
    "clienteId" TEXT NOT NULL,
    "terrenoId" TEXT NOT NULL,
    "tipoTramite" TEXT,
    "notas" TEXT,
    "presupuesto" JSONB,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expediente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_dni_cuit_key" ON "Cliente"("dni_cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Terreno_codigo_key" ON "Terreno"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Expediente_numero_key" ON "Expediente"("numero");

-- AddForeignKey
ALTER TABLE "Expediente" ADD CONSTRAINT "Expediente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expediente" ADD CONSTRAINT "Expediente_terrenoId_fkey" FOREIGN KEY ("terrenoId") REFERENCES "Terreno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
