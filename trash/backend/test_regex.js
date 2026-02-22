
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'pdf', 'presupuesto.docx');
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
const xml = zip.files['word/document.xml'].asText();

const labels = {
    'Dep': 'Dep',
    'Mun': 'Mun',
    'Secc': 'Secc',
    'Chac': 'Chac',
    'Mz': 'Mz',
    'Parc': 'Parc'
};

// Replace ((N)) based on preceding label
const newXml = xml.replace(/(Dep|Mun|Secc|Chac|Mz|Parc)\s*\.?\s*<[^>]+>\s*\(\(N\)\)/g, (match, label) => {
    console.log(`Found label "${label}" for ((N))`);
    return `${label}. ((${label}))`;
});

// If labels are inside the same <w:t>
const newXml2 = xml.replace(/(Dep|Mun|Secc|Chac|Mz|Parc)\s*\.?\s*\(\(N\)\)/g, (match, label) => {
    console.log(`Found inline label "${label}" for ((N))`);
    return `${label}. ((${label}))`;
});
