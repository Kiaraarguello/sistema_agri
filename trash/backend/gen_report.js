
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'pdf', 'presupuesto.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.files['word/document.xml'].asText();

const clean = xml.replace(/<[^>]+>/g, ' ');
let i = 0;
const re = /\(\(N\)\)/g;
let m;
const report = [];
while ((m = re.exec(xml)) !== null) {
    i++;
    // Get more context to be sure
    const before = xml.substring(m.index - 200, m.index).replace(/<[^>]+>/g, ' ').trim();
    report.push(`${i}: "...${before.slice(-40)}" -> ((N))`);
}
fs.writeFileSync('full_n_report.txt', report.join('\n'));
