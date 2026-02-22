
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import { PDFExtract } from 'pdf.js-extract';
import fs from 'fs';
import path from 'path';

const pdfExtract = new PDFExtract();

export const generarPDFPersonalizado = async (datos: any) => {
    const templatePath = path.join(process.cwd(), '..', 'pdf', 'presupuesto.pdf');
    if (!fs.existsSync(templatePath)) {
        throw new Error('No se encontró el archivo presupuesto.pdf en la carpeta /pdf');
    }

    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Extraer posiciones de los placeholders
    const extraction: any = await new Promise((resolve, reject) => {
        pdfExtract.extract(templatePath, {}, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Mapeo de datos
    const hoy = new Date();
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const mapping: any = {
        '((dia))': hoy.getDate().toString(),
        '((mes))': meses[hoy.getMonth()],
        '((año))': hoy.getFullYear().toString(),
        '((nombre_cliente))': datos.cliente_nombre || datos.cliente || "S/D",
        '((dni_cliente))': datos.cliente_dni || "S/D",
        '((telefono_cliente))': datos.cliente_telefono || "S/D",
        '((objeto_presupuesto))': datos.objeto || "S/D",
        '((total_honorarios))': `$ ${Number(datos.presupuesto_detalle?.total_a_pagar || 0).toLocaleString()}`,
        '((senas))': `$ ${Number(datos.presupuesto_detalle?.senas || 0).toLocaleString()}`,
        '((saldo_total))': `$ ${(Number(datos.presupuesto_detalle?.total_a_pagar || 0) - Number(datos.presupuesto_detalle?.senas || 0)).toLocaleString()}`,
        '((cuotas del presupuesto))': (datos.presupuesto_detalle?.cuotas || []).map((c: any) => `Cuota ${c.numero}: $${Number(c.monto).toLocaleString()}${c.pagado ? ' (Pagada)' : ''}`).join('\n')
    };

    // Si hay items, podemos intentar mapear los primeros o hacer algo más complejo.
    // Para simplificar, si vemos ((nombre_item...)) reemplazamos con una lista.
    if (datos.presupuesto_detalle?.items) {
        mapping['((nombre_item_expediente_presupuesto))'] = datos.presupuesto_detalle.items.map((i: any) => i.nombre).join('\n');
        mapping['((monto_item_expediente_presupuesto))'] = datos.presupuesto_detalle.items.map((i: any) => `$ ${Number(i.total_item).toLocaleString()}`).join('\n');
    }

    // Procesar cada elemento de texto extraído
    for (const pageExtraction of extraction.pages) {
        for (const item of pageExtraction.content) {
            let textoOriginal = item.str;
            let huboCambio = false;

            // Buscar si contiene algún placeholder del mapping
            for (const placeholder in mapping) {
                if (textoOriginal.includes(placeholder)) {
                    textoOriginal = textoOriginal.replace(placeholder, mapping[placeholder]);
                    huboCambio = true;
                }
            }

            if (huboCambio) {
                // 1. Tapar el original con un rectángulo blanco
                // Nota: Las coordenadas de pdf.js-extract y pdf-lib son diferentes.
                // pdf-lib usa el origen en la esquina inferior izquierda.
                // pdf.js-extract usa el origen en la esquina superior izquierda.

                const x = item.x;
                const y = height - item.y - (item.height * 0.8); // Ajuste empírico

                firstPage.drawRectangle({
                    x: x - 2,
                    y: y - 2,
                    width: (item.width || 100) + 4,
                    height: (item.height || 12) + 4,
                    color: rgb(1, 1, 1),
                });

                // 2. Escribir el nuevo texto
                firstPage.drawText(textoOriginal, {
                    x: x,
                    y: y,
                    size: item.height || 10,
                    font: item.str.includes('((año))') || item.str.includes('TOTAL') ? fontBold : font,
                    color: rgb(0, 0, 0),
                });
            }
        }
    }

    return await pdfDoc.save();
};

export const generarFichaPDF = async (datos: any) => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const margin = 50;
    let y = height - margin;

    // Helper para formatear fechas de manera prolija (YYYY-MM-DD)
    const formatSimpleDate = (val: any) => {
        if (!val || val === "-" || val === "S/D") return "-";
        try {
            const date = new Date(val);
            if (isNaN(date.getTime())) return val;
            return date.toISOString().split('T')[0];
        } catch (e) {
            return val;
        }
    };

    const drawText = (text: string, isBold = false, size = 11) => {
        if (y < margin + 40) {
            page = pdfDoc.addPage(PageSizes.A4);
            y = height - margin;
        }
        page.drawText(text, {
            x: margin,
            y: y,
            size: size,
            font: isBold ? fontBold : font,
            color: rgb(0, 0, 0)
        });
        y -= (size + 8);
    };

    const drawHeader = (text: string) => {
        y -= 10;
        drawText(text.toUpperCase(), true, 14);
        page.drawLine({
            start: { x: margin, y: y + 2 },
            end: { x: width - margin, y: y + 2 },
            thickness: 1,
            color: rgb(0, 0, 0)
        });
        y -= 10;
    };

    // Título principal
    drawText(`FICHA DE EXPEDIENTE #${datos.numero || datos.id}`, true, 20);
    drawText(`${datos.objeto || "S/D"}`, true, 12);
    y -= 10;

    // Secciones
    drawHeader("Datos Generales del Proyecto");
    drawText(`Objeto: ${datos.objeto || "S/D"}`);
    drawText(`Titular / Cliente: ${datos.cliente_nombre || datos.cliente || "S/D"}`);
    drawText(`DNI/CUIL: ${datos.cliente_dni || "S/D"}`);
    drawText(`Responsable: ${datos.responsable || "S/D"}`);
    drawText(`Fecha Apertura: ${formatSimpleDate(datos.fecha_apertura)}`);
    drawText(`Estado Actual: ${datos.terminado ? "FINALIZADO" : "EN PROCESO"}`);

    drawHeader("Ubicación y Terreno");
    drawText(`Designación: ${datos.terreno || datos.designacion || "-"}`);
    drawText(`Dirección: ${datos.terreno_direccion || datos.direccion || datos.ubicacion || "-"}`);
    drawText(`Coordenadas: Lat: ${datos.latitud || "-"}, Lng: ${datos.longitud || "-"}`);

    drawHeader("Nomenclatura Catastral");
    drawText(`Departamento: ${datos.depto || "-"}`);
    drawText(`Municipio: ${datos.municipio || "-"}`);
    drawText(`Sección: ${datos.seccion || "-"}`);
    drawText(`Chacra: ${datos.chacra || "-"}`);
    drawText(`Manzana: ${datos.manzana || "-"}`);
    drawText(`Parcela: ${datos.parcela || "-"}`);
    drawText(`Lote: ${datos.lote || "-"}`);
    drawText(`Partida Inmobiliaria: ${datos.partida_inmobiliaria || "-"}`);

    drawHeader("Trámite Catastro (DGC)");
    drawText(`Número de Expediente: ${datos.expediente_n || "-"}`);
    drawText(`Presentación DGC: ${formatSimpleDate(datos.presentacion_dgc)}`);
    drawText(`Previa DGC: ${formatSimpleDate(datos.previa_dgc)}`);
    drawText(`Definitiva DGC: ${formatSimpleDate(datos.definitiva_dgc)}`);
    drawText(`Visado DGC: ${formatSimpleDate(datos.visado_dgc)}`);

    drawHeader("Relevamiento y Campo");
    drawText(`Fecha Relevamiento: ${formatSimpleDate(datos.fecha_relevamiento)}`);
    drawText(`Mojones: ${datos.mojones ? "SÍ" : "NO"} ${datos.fecha_mojones ? `(Fecha: ${formatSimpleDate(datos.fecha_mojones)})` : ""}`);
    drawText(`Notas Relevamiento: ${datos.notas_relevamiento || "Sin notas"}`);

    drawHeader("Presupuesto y Servicios");
    const items = datos.presupuesto_detalle?.items || [];
    if (items.length > 0) {
        for (const item of items) {
            drawText(`- ${item.nombre}: $ ${Number(item.total_item).toLocaleString()} (${item.realizado ? 'REALIZADO' : 'PENDIENTE'})`);
        }
        y -= 5;
        drawText(`TOTAL PRESUPUESTADO: $ ${Number(datos.presupuesto_detalle?.total_a_pagar || 0).toLocaleString()}`, true);
        drawText(`SEÑA RECIBIDA: $ ${Number(datos.presupuesto_detalle?.senas || 0).toLocaleString()}`);
        drawText(`SALDO PENDIENTE: $ ${(Number(datos.presupuesto_detalle?.total_a_pagar || 0) - Number(datos.presupuesto_detalle?.senas || 0)).toLocaleString()}`, true);
    } else {
        drawText("No hay servicios cargados en el presupuesto.");
    }

    drawHeader("Notas y Materiales");
    drawText(`Notas: ${datos.notas || "-"}`);
    drawText(`Materiales: ${datos.materiales || "-"}`);

    y -= 30;
    drawText(`Documento generado el: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`, false, 9);

    return await pdfDoc.save();
};
