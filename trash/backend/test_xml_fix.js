
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'pdf', 'presupuesto.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.files['word/document.xml'].asText();

let counter = 0;
const newXml = xml.replace(/\(\(N\)\)/g, (match) => {
    counter++;
    const tags = ['N', 'Mun', 'Secc', 'Chac', 'Mz', 'Parc'];
    return `((${tags[counter - 1] || 'N'}))`;
});

console.log("Replaced:", counter, "tags");
if (counter > 0) {
    // Show a snippet of the result
    const idx = newXml.indexOf('((Mun))');
    if (idx !== -1) {
        console.log(newXml.substring(idx - 50, idx + 200));
    }
}
