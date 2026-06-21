
const fs = require('fs');

function processFile(path) {
  let html = fs.readFileSync(path, 'utf8');
  
  html = html.replace(
    /\${row('Penyusun', d.penyusun || '.*?', false, true)}/g,
    '535153515351{row('Penyusun', d.penyusun || 'Guru/Penyusun', false, true)}'
  );

  html = html.replace(
    /\${row('Nama Sekolah', d.sekolah || '.*?', false, true)}/g,
    '535153515351{row('Nama Sekolah', d.sekolah || 'Nama Sekolah', false, true)}'
  );

  html = html.replace(
    /<u><b><span>\${d.penyusun || '.*?'}</span></b></u><br>/g,
    '<u><b><span>535153515351{d.penyusun || '................................'}</span></b></u><br>'
  );

  fs.writeFileSync(path, html);
  console.log('Processed', path);
}

processFile('public/rpm_builder.html');
processFile('public/rpm_builder_b.html');
processFile('public/rpm_builder_c.html');
