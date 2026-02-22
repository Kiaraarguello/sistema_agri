
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export const generarPresupuestoDocx = async (datos: any, overrides: any = {}) => {
    const templatePath = path.join(process.cwd(), '..', 'pdf', 'presupuesto.docx');

    if (!fs.existsSync(templatePath)) {
        throw new Error('No se encontró el archivo presupuesto.docx en la carpeta /pdf');
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // --- PARCHEO AVANZADO DEL XML ---
    let xml = zip.files['word/document.xml'].asText();

    // 1. Asegurar que existan etiquetas para Chacra y Parcela si no las hay
    // Buscamos patrones como "Chac ." o "Parc ." que no tengan una etiqueta inmediata
    xml = xml.replace(/(Chac\s*\.?\s*)(?!\(\()/gi, '$1((Chac))');
    xml = xml.replace(/(Parc\s*\.?\s*)(?!\(\()/gi, '$1((Parc))');

    // 2. Parchear el tiempo de ejecución estático (ej: "30 días aproximadamente")
    // Reemplazamos cualquier número seguido de "días aproximadamente" por la etiqueta
    xml = xml.replace(/\b\d+\s*días\s*aproximadamente\b/gi, '((tiempo_ejecucion))');

    // 3. Renombrar las etiquetas ((N)) existentes según su contexto (Dep, Mun, Secc, Mz)
    const mappings = [
        { label: /\bDep\b/i, tag: 'Dep' },
        { label: /\bMun\b/i, tag: 'Mun' },
        { label: /\bSecc\b/i, tag: 'Secc' },
        { label: /\bMz\b/i, tag: 'Mz' },
        { label: /\bChac\b/i, tag: 'Chac' },
        { label: /\bParc\b/i, tag: 'Parc' }
    ];

    xml = xml.replace(/\(\(\s*N\s*\)\)/g, (match, offset) => {
        const lookback = xml.substring(Math.max(0, offset - 150), offset);
        const cleanLookback = lookback.replace(/<[^>]+>/g, ' ');

        let bestTag = null;
        let lastIndex = -1;
        for (const m of mappings) {
            const regex = new RegExp(m.label, 'gi');
            let matchLabel;
            while ((matchLabel = regex.exec(cleanLookback)) !== null) {
                if (matchLabel.index > lastIndex) {
                    lastIndex = matchLabel.index;
                    bestTag = m.tag;
                }
            }
        }
        return bestTag ? `((${bestTag}))` : match;
    });

    zip.file('word/document.xml', xml);
    // --------------------------------

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '((', end: '))' },
        nullGetter() {
            return "";
        }
    });

    const base = { ...datos, ...overrides };

    // Formatear tiempo de ejecución: si viene solo un número, agregar la frase
    let tiempoStr = base.tiempo_ejecucion || "30";
    if (/^\d+$/.test(tiempoStr.toString().trim())) {
        tiempoStr = `${tiempoStr} días aproximadamente`;
    }

    const viewData: any = {
        dia: base.dia || new Date().getDate().toString(),
        mes: base.mes || ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][new Date().getMonth()],
        año: base.año || new Date().getFullYear().toString(),

        nombre_cliente: base.nombre_cliente || base.cliente_nombre || "",
        'nombre titular': base.nombre_cliente || base.cliente_nombre || "",
        objeto: base.objeto || "",
        'servicio a brindar': base.objeto || "",

        // Nomenclatura
        Dep: (base.depto ?? base.Dep ?? "").toString(),
        Mun: (base.municipio ?? base.Mun ?? "").toString(),
        Secc: (base.seccion ?? base.Secc ?? "").toString(),
        Chac: (base.chacra ?? base.Chac ?? "").toString(),
        Mz: (base.manzana ?? base.Mz ?? "").toString(),
        Parc: (base.parcela ?? base.Parc ?? "").toString(),

        // Honorarios y Tiempos
        total_honorarios: base.total_honorarios || base.total_a_pagar || "",
        'total_a_pagar de la tabla expediente_presupuesto': base.total_honorarios || base.total_a_pagar || "",
        tiempo_ejecucion: tiempoStr,
        requisitos: base.requisitos || "",

        forma_pago: base.forma_pago || "Contado",
    };

    // Alias extras para compatibilidad
    viewData['Honorarios más Gastos'] = viewData.total_honorarios;
    viewData['cuotas del presupuesto'] = base.cuotas_resumen || "";

    try {
        doc.render(viewData);
    } catch (error: any) {
        console.error('Error rendering docx:', error);
        throw error;
    }

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf;
};

export const generarPeticionCatastroDocx = async (datos: any, overrides: any = {}) => {
    const templatePath = path.join(process.cwd(), '..', 'pdf', 'peticion-catastro.docx');

    if (!fs.existsSync(templatePath)) {
        throw new Error('No se encontró el archivo peticion-catastro.docx en la carpeta /pdf');
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    // --- PARCHEO AVANZADO DEL XML (IGUAL QUE PRESUPUESTO) ---
    let xml = zip.files['word/document.xml'].asText();

    // 1. Asegurar que existan etiquetas para Chacra, Parcela y "A nombre de" si no las hay
    xml = xml.replace(/(Chac\s*\.?\s*)(?!\(\()/gi, '$1((Chac))');
    xml = xml.replace(/(Parc\s*\.?\s*)(?!\(\()/gi, '$1((Parc))');
    xml = xml.replace(/(A nombre de\s*:?\s*)(?!\(\()/gi, '$1((nombre_cliente))');

    // 2. Renombrar las etiquetas ((N)) existentes según su contexto (Dep, Mun, Secc, Mz, Nombre)
    const mappings = [
        { label: /\bDep\b/i, tag: 'Dep' },
        { label: /\bMun\b/i, tag: 'Mun' },
        { label: /\bSecc\b/i, tag: 'Secc' },
        { label: /\bMz\b/i, tag: 'Mz' },
        { label: /\bChac\b/i, tag: 'Chac' },
        { label: /\bParc\b/i, tag: 'Parc' },
        { label: /\bnombre\b/i, tag: 'nombre_cliente' },
        { label: /\btitular\b/i, tag: 'nombre_cliente' }
    ];

    xml = xml.replace(/\(\(\s*N\s*\)\)/g, (match, offset) => {
        const lookback = xml.substring(Math.max(0, offset - 150), offset);
        const cleanLookback = lookback.replace(/<[^>]+>/g, ' ');

        let bestTag = null;
        let lastIndex = -1;
        for (const m of mappings) {
            const regex = new RegExp(m.label, 'gi');
            let matchLabel;
            while ((matchLabel = regex.exec(cleanLookback)) !== null) {
                if (matchLabel.index > lastIndex) {
                    lastIndex = matchLabel.index;
                    bestTag = m.tag;
                }
            }
        }
        return bestTag ? `((${bestTag}))` : match;
    });

    zip.file('word/document.xml', xml);
    // -------------------------------------------------------

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '((', end: '))' },
        nullGetter() {
            return "";
        }
    });

    const base = { ...datos, ...overrides };

    const viewData: any = {
        dia: base.dia || new Date().getDate().toString(),
        mes: base.mes || ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][new Date().getMonth()],
        año: base.año || new Date().getFullYear().toString(),

        nombre_cliente: base.nombre_cliente || base.cliente_nombre || base.titular || "",
        'nombre titular': base.nombre_cliente || base.cliente_nombre || base.titular || "",
        cliente: base.nombre_cliente || base.cliente_nombre || "",
        nombre: base.nombre_cliente || base.cliente_nombre || "",
        'A nombre de': base.nombre_cliente || base.cliente_nombre || "",
        objeto: base.objeto || "",
        'servicio a brindar': base.objeto || "",

        // Nomenclatura extendida (igual que presupuesto)
        Dep: (base.depto ?? base.Dep ?? "").toString(),
        Mun: (base.municipio ?? base.Mun ?? "").toString(),
        Secc: (base.seccion ?? base.Secc ?? "").toString(),
        Chac: (base.chacra ?? base.Chac ?? "").toString(),
        Mz: (base.manzana ?? base.Mz ?? "").toString(),
        Parc: (base.parcela ?? base.Parc ?? "").toString(),
        Lote: (base.lote ?? base.Lote ?? "").toString(),
        Partida: (base.partida_inmobiliaria ?? base.Partida ?? "").toString(),

        // Campos adicionales del expediente
        expediente_n: base.expediente_n || "",
        'expediente n': base.expediente_n || "",
        'nº expte': base.expediente_n || "",
        titular: base.titular || base.nombre_cliente || base.cliente_nombre || "",
        responsable: base.responsable || "",

        // Otros campos que podrían estar en la petición
        'dni cliente': base.cliente_dni || base.dni || "",
        'domicilio cliente': base.cliente_direccion || base.direccion || "",
        'partida inmobiliaria': base.partida_inmobiliaria || "",
    };

    try {
        doc.render(viewData);
    } catch (error: any) {
        console.error('Error rendering peticion-catastro docx:', error);
        throw error;
    }

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf;
};
