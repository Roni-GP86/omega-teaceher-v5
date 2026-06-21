const fs = require('fs'); 
['public/rpm_builder.html', 'public/rpm_builder_b.html', 'public/rpm_builder_c.html'].forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    
    // Remove the block in Karakteristik
    html = html.replace(/if \(\!d\.selected_materi \|\| d\.selected_materi\.length === 0\) \{ showToast\(\"⚠️ Pilih Materi Ajar di kiri\!\"\); return; \}/g, '');

    // The old prompt text with join (we used old and new, let's just make it broad)
    html = html.replace(/\$\{d\.selected_materi\.join\(\"\, \"\)\}/g, '${(d.selected_materi && d.selected_materi.length > 0 ? d.selected_materi.join(", ") : (d.materi || d.mapel || "Materi Ujicoba"))}');

    // Remove the same block in generateTP
    // Wait, generateTP has: if (!d.selected_materi || d.selected_materi.length === 0) { showToast("⚠️ Pilih materi di Langkah 2!"); return; }
    html = html.replace(/if \(\!d\.selected_materi \|\| d\.selected_materi\.length === 0\) \{ showToast\(\"⚠️ Pilih materi di Langkah 2\!\"\); return; \}/g, '');
    
    fs.writeFileSync(f, html);
    console.log(f + ' selection block removed');
});
