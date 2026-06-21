const fs = require('fs');
const path = require('path');

const files = ['public/rpm_builder.html', 'public/rpm_builder_b.html', 'public/rpm_builder_c.html'];

// 1. First, get the Fase B database from b_part2.txt
const bPart2 = fs.readFileSync('app/applet/public/b_part2.txt', 'utf8');
const dbBStart = bPart2.indexOf('// --- DATABASE BSKAP 046 FASE B');
const dbBEnd = bPart2.indexOf('};', dbBStart) + 2;
const dbBContent = bPart2.substring(dbBStart, dbBEnd);

// 2. Process each file
for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace DB specifically for rpm_builder_b.html
    if (file === 'public/rpm_builder_b.html' && dbBContent) {
        const dbStart = content.indexOf('// --- DATABASE BSKAP 046 FASE A ---');
        if (dbStart > -1) {
            const dbEnd = content.indexOf('};\n\n        const SINTAKS_DATA', dbStart);
            if (dbEnd > -1) {
                const head = content.substring(0, dbStart);
                const tail = content.substring(dbEnd);
                content = head + dbBContent + tail;
            }
        }
    }
    
    // Replace the prompt in generateLangkah
    // OLD: 1. Model: ${d.model}.
    // NEW: 1. Model Pembelajaran: ${d.model}. WAJIB menjabarkan tepat ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.length : 'semua'} langkah sintaks yaitu: ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.join(', ') : ''}. Array "inti" HARUS berisi tepat ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.length : 'semua'} elemen. Konsistensi kelengkapan sangat diutamakan dan JANGAN memotong penjelasan.
    
    const dbSintaksReplacement = "1. Model: ${d.model}. WAJIB menjabarkan tepat ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.length : 'semua'} langkah sintaks secara berurutan yaitu: ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.join(', ') : ''}. ARRAY \\\"inti\\\" HARUS BERISI TEPAT ${SINTAKS_DATA[d.model] ? SINTAKS_DATA[d.model].steps.length : 'semua'} ITEM TANPA TERPOTONG.";
    
    if (content.includes("1. Model: ${d.model}.")) {
        content = content.replace("1. Model: ${d.model}.", dbSintaksReplacement);
    }
    
    // Also enforce validasi_evaluasi, validasi_asesmen, validasi_lkpd to not be cut off
    // Let's replace "RESPON WAJIB BERUPA ARRAY STRING JSON berisi 3 variasi paket asesmen utuh tersebut."
    // with "RESPON WAJIB BERUPA ARRAY STRING JSON berisi tepat 3 variasi paket asesmen utuh tersebut tanpa terpotong."
    content = content.replace(
        "RESPON WAJIB BERUPA ARRAY STRING JSON berisi 3 variasi paket asesmen utuh tersebut.", 
        "RESPON WAJIB BERUPA ARRAY STRING JSON berisi tepat 3 variasi paket asesmen utuh tersebut tanpa terpotong."
    );
    
    content = content.replace(
        `{"results": ["<table style='width:100%; border-collapse:collapse; margin-top:10px; table-layout:fixed; word-break:normal; overflow-wrap:break-word; border: 1px solid black;'>...</table>"]}`,
        `{"results": ["<table style='width:100%; border-collapse:collapse; margin-top:10px; table-layout:fixed; word-break:normal; overflow-wrap:break-word; border: 1px solid black;'>...</table>"]}\n                Pastikan tag HTML tertutup sempurna dan JSON tidak terpotong (konsisten).`
    );

    content = content.replace(
        `{"results": ["<table>...</table><p>...</p>"]}`,
        `{"results": ["<table>...</table><p>...</p>"]}\n                Pastikan tag HTML tertutup sempurna dan JSON tidak terpotong (konsisten).`
    );
    
    content = content.replace(
        `"kunci": "1. [Kunci Jawaban]\\n2. [Kunci Jawaban]\\n\\nJawaban ini bersifat alternatif, kebenaran dapat ditentukan guru berdasarkan hasil kerja murid"`,
        `"kunci": "1. [Kunci Jawaban]\\n2. [Kunci Jawaban]\\n\\nJawaban ini bersifat alternatif, kebenaran dapat ditentukan guru berdasarkan hasil kerja murid"\n                }\n                Pastikan semua 5 soal lengkap beserta kunci jawabannya.`
    );
    
    // AI general consistency reminder
    if (!content.includes("Pastikan respons JSON tuntas dan valid")) {
         content = content.replace(
             `return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));`,
             `return JSON.parse(rawText.substring(firstBrace, lastBrace + 1)); // Pastikan respons JSON tuntas dan valid`
         );
    }

    fs.writeFileSync(file, content);
}
console.log("Done updating HTML files.");
