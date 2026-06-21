const fs = require('fs');

function processFile(path) {
  let html = fs.readFileSync(path, 'utf8');
  
  html = html.replace(
    /<input type="text" id="penyusun" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value=".*?" readonly>/g,
    '<input type="text" id="penyusun" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value="${d.penyusun || \'\'}" readonly>'
  );

  html = html.replace(
    /<input type="text" id="sekolah" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value=".*?" readonly>/g,
    '<input type="text" id="sekolah" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value="${d.sekolah || \'\'}" readonly>'
  );

  html = html.replace(
    /currentModuleData = \{ judul_modul: 'MODUL AJAR', penyusun: '.*?', sekolah: '.*?',/g,
    `let _sek = ''; let _guru = ''; let _kep = ''; let _nipK = ''; let _nipG = '';
                try {
                    _sek = window.localStorage.getItem('kosp_nama_sekolah') || '';
                    _guru = window.localStorage.getItem('kosp_nama_guru') || '';
                    _kep = window.localStorage.getItem('kosp_kepala_sekolah') || '';
                    _nipK = window.localStorage.getItem('kosp_nip_kepala') || '';
                    _nipG = window.localStorage.getItem('kosp_nip_guru') || '';
                } catch(e){}
                currentModuleData = { judul_modul: 'MODUL AJAR', penyusun: _guru, sekolah: _sek, kepala_sekolah_nama: _kep, kepala_sekolah_nip: _nipK, penyusun_nip: _nipG,`
  );

  fs.writeFileSync(path, html);
  console.log("Processed", path);
}

processFile('public/rpm_builder.html');
processFile('public/rpm_builder_b.html');
processFile('public/rpm_builder_c.html');
