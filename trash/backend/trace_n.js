
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'pdf', 'presupuesto.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.files['word/document.xml'].asText();

const clean = xml.replace(/<[^>]+>/g, ' ');
let n = 0;
let lastIdx = 0;
while (true) {
    const idx = xml.indexOf('((N))', lastIdx);
    if (idx === -1) break;
    n++;
    const before = xml.substring(0, idx).replace(/<[^>]+>/g, ' ').slice(-20).trim();
    console.log(`Match ${n}: ${before} -> ((N))`);
    lastIdx = idx + 1;
}
