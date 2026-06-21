const fs = require('fs');

const s1 = fs.readFileSync('/app/applet/public/build_c1.js', 'utf8');
const s2 = fs.readFileSync('/app/applet/public/build_c2.js', 'utf8');
const s3 = fs.readFileSync('/app/applet/public/build_c3.js', 'utf8');

function extractHtml(jsStr) {
    const startIdx = jsStr.indexOf('`');
    const endIdx = jsStr.lastIndexOf('`');
    return jsStr.substring(startIdx + 1, endIdx);
}

const html1 = extractHtml(s1);
const html2 = extractHtml(s2);
const html3 = extractHtml(s3);

let combined = html1 + html2 + html3;

const d1 = JSON.parse(fs.readFileSync('/app/applet/c_data_1.json', 'utf8'));
const d2 = JSON.parse(fs.readFileSync('/app/applet/c_data_2.json', 'utf8'));

const combinedDB = { ...d1, ...d2 };

const finalHtml = combined.replace('__DATABASE_PLACEHOLDER__', JSON.stringify(combinedDB, null, 2));

fs.writeFileSync('/app/applet/public/rpm_builder_c.html', finalHtml);
console.log('Successfully combined and wrote rpm_builder_c.html', finalHtml.length);
