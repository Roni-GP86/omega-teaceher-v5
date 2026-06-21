const fs = require('fs');

const originalHtml = fs.readFileSync('public/rpm_builder.html', 'utf8');

// The DB content for Fase B is in app/applet/public/b_part2.txt
const bPart2 = fs.readFileSync('app/applet/public/b_part2.txt', 'utf8');
const dbBStart = bPart2.indexOf('// --- DATABASE BSKAP 046 FASE B');
const dbBEnd = bPart2.indexOf('};', dbBStart) + 2;
const dbBContent = bPart2.substring(dbBStart, dbBEnd);

let bHtml = originalHtml;

// 1. Replace the Edition Text
bHtml = bHtml.replace(
    'Edisi Fase A (Kelas 1 & 2) BSKAP 046',
    'Edisi Fase B (Kelas 3 & 4) BSKAP 046'
);

// 2. Replace the defaults in currentModuleData
bHtml = bHtml.replace(
    'fase_kelas: "Fase A / Kelas 1"',
    'fase_kelas: "Fase B / Kelas 3"'
);

// 3. Replace the class options
bHtml = bHtml.replace(
    '<option value="Fase A / Kelas 1" ${d.fase_kelas === \'Fase A / Kelas 1\' ? \'selected\' : \'\'}>Fase A / Kelas 1</option><option value="Fase A / Kelas 2" ${d.fase_kelas === \'Fase A / Kelas 2\' ? \'selected\' : \'\'}>Fase A / Kelas 2</option>',
    '<option value="Fase B / Kelas 3" ${d.fase_kelas === \'Fase B / Kelas 3\' ? \'selected\' : \'\'}>Fase B / Kelas 3</option><option value="Fase B / Kelas 4" ${d.fase_kelas === \'Fase B / Kelas 4\' ? \'selected\' : \'\'}>Fase B / Kelas 4</option>'
);

// 4. Replace Karakteristik Murid section
bHtml = bHtml.replace(
    '👦 Karakteristik Murid Fase A',
    '👦 Karakteristik Murid Fase B'
);
bHtml = bHtml.replace(
    'Karakteristik murid Fase A secara umum',
    'Karakteristik murid Fase B secara umum'
);

// 5. Replace Database
const dbCStart = bHtml.indexOf('const CP_DATABASE_FASE_C = {');
if (dbCStart > -1) {
    const possibleCommentStart = bHtml.lastIndexOf('// --- DATABASE', dbCStart);
    if (possibleCommentStart > -1) {
        const dbCEnd = bHtml.indexOf('};\n\n        const SINTAKS_DATA', dbCStart);
        if (dbCEnd > -1) {
            bHtml = bHtml.substring(0, possibleCommentStart) + dbBContent + bHtml.substring(dbCEnd);
        }
    }
}

fs.writeFileSync('public/rpm_builder_b.html', bHtml);
console.log('✅ Generated public/rpm_builder_b.html');
