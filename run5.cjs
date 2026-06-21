const fs = require('fs');
function processFile(path) {
  let html = fs.readFileSync(path, 'utf8');

  html = html.replace(
    /.?Penyusun: <b class="text-yellow-500">Martha Fallo, S.Pd<\/b>/g,
    '\ud83d\udc64 Penyusun: <b class="text-yellow-500">' + '${d.penyusun || \'guru\'}' + '</b>'
  );

  html = html.replace(
    /\$\{row\(\'Penyusun\', d.penyusun \|\| \'Martha Fallo, S.Pd\', false, true\)\}/g,
    "$${" + "row('Penyusun', d.penyusun || 'guru', false, true)}"
  ).replace(/\$$/, '$');

  html = html.replace(
    /\$\{row\('Nama Sekolah', d.sekolah \|| \'SD Negeri Nifuboke\', false, true\)\}/g,
    "$${" + "row('Nama Sekolah', d.sekolah || 'sekolah?', false, truei}"
  ).replace(/\$$/, '$');

  html = html.replace(
    <u><b><span>\${d.penyusun \|\| 'Martha Fallo, S.Pd'}<\/span><\/b><\/u><br>/g,
    '<u><b><span>$${" + "d.penyusun || '...........................'}" + "</span></b></u><br>"
  );

  fs.writeFileSync(path, html);
  console.log("Processed", path);
}

processFile('public/rpm_builder.html');
processFile('public/rpm_builder_b.html');
processFile('public/rpm_builder_c.html');