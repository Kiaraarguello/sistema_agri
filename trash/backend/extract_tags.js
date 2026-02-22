
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'pdf', 'presupuesto.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.files['word/document.xml'].asText();

const clean = xml.replace(/<[^>]+>/g, ' ');
const segment = clean.substring(clean.indexOf('Dep'), clean.indexOf('Honorarios'));
console.log("Segment:", JSON.stringify(segment));
