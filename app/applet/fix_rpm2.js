const fs = require('fs');

function processFile(path) {
  let html = fs.readFileSync(path, 'utf8');
  
  html = html.replace(
    /👤 Penyusun: <b class="text-yellow-500">.*?<\/b>/g,
    '👤 Penyusun: <b class="text-yellow-500">${d.penyusun || \'Guru/Penyusun\'}</b>'
  );

  html = html.replace(
    /\${row\('Penyusun', d.penyusun \|\| '.*?', false, true\)}/g,
    '${row(\'Penyusun\', d.penyusun || \'Guru/Penyusun\', false, true)}'
  );

  html = html.replace(
    /\${row\('Nama Sekolah', d.sekolah \|\| '.*?', false, true\)}/g,
    '${row(\'Nama Sekolah\', d.sekolah || \'Nama Sekolah\', false, true)}'
  );

  html = html.replace(
    /<u><b><span>\${d.penyusun \|\| '.*?'}<\/span><\/b><\/u><br>/g,
    '<u><b><span>${d.penyusun || \'................................\'}</span></b></u><br>'
  );

  fs.writeFileSync(path, html);
  console.log("Processed", path);
}

processFile('public/rpm_builder.html');
processFile('public/rpm_builder_b.html');
processFile('public/rpm_builder_c.html');
