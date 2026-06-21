const fs = require('fs');

function applyOverrides(file) {
  let content = fs.readFileSync(file, 'utf8');
  let DOLLAR = String.fromCharCode(36);

  content = content.replace(
      '👤 Penyusun: <b class="text-yellow-500">Martha Fallo, S.Pd</b>', 
      '👤 Penyusun: <b class="text-yellow-500">' + DOLLAR + '{d.penyusun || \'\'}</b>'
  );

  content = content.replace(
      DOLLAR + '{row(\'Penyusun\', d.penyusun || \'Martha Fallo, S.Pd\', false, true)}', 
      DOLLAR + '{row(\'Penyusun\', d.penyusun || \'Guru/Penyusun\', false, true)}'
  );

  content = content.replace(
      DOLLAR + '{row(\'Nama Sekolah\', d.sekolah || \'SD Negeri Nifuboke\', false, true)}', 
      DOLLAR + '{row(\'Nama Sekolah\', d.sekolah || \'Nama Sekolah\', false, true)}'
  );

  content = content.replace(
      '<u><b><span>' + DOLLAR + '{d.penyusun || \'Martha Fallo, S.Pd\'}</span></b></u><br>', 
      '<u><b><span>' + DOLLAR + '{d.penyusun || \'...........................\'}</span></b></u><br>'
  );

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

applyOverrides('public/rpm_builder.html');
applyOverrides('public/rpm_builder_b.html');
applyOverrides('public/rpm_builder_c.html');
