const fs = require('fs');
const htmlContent = `

    function renderCreate() {
        const steps = ['Info Umum', 'Karakteristik', 'Pendekatan', 'Mitra', 'Lingkungan', 'Media', 'AI Generate', 'Hasil'];
        let content = '';
        if (currentStep === 0) content = stepInformasiUmum();
        else if (currentStep === 1) content = stepKarakteristik();
        else if (currentStep === 2) content = stepPendekatan();
        else if (currentStep === 3) content = stepManajemenKelas();
        else if (currentStep === 4) content = stepLingkunganBudaya();
        else if (currentStep === 5) content = stepMediaDigital();
        else if (currentStep === 6) content = stepAIGenerateModal();
        else if (currentStep === 7) content = stepHasilModul();

        let width = ((currentStep + 1) / steps.length) * 100;

        document.getElementById('app').innerHTML = \`
        <div class="h-full flex flex-col bg-slate-50 builder-ui font-black italic">
            <div class="px-6 py-4 bg-white border-b-4 border-slate-200">
                <div class="max-w-4xl mx-auto flex items-center justify-between">
                    <button onclick="\${currentStep===0 ? "navigateTo('home')" : "prevStep()"}" class="text-slate-400 hover:text-slate-600 font-extrabold uppercase text-xs px-4 py-2 bg-slate-100 rounded-lg">🔙 \${currentStep === 0 ? 'Home' : 'Back'}</button>
                    <div class="text-[10px] font-black uppercase text-indigo-900 tracking-widest bg-indigo-50 px-4 py-2 rounded-full border-2 border-indigo-200">Langkah \${currentStep + 1} dari \${steps.length}</div>
                    \${currentStep < 7 ? \`<button onclick="\${currentStep === 6 ? "window.showKonfirmasiModal()" : "nextStep()"}" class="btn-primary text-white font-black italic uppercase text-xs px-6 py-2 rounded-lg">\${currentStep === 6 ? '💾 FINISH' : 'Lanjut ⏩'}</button>\` : \`<button onclick="navigateTo('home')" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-black italic uppercase text-xs px-4 py-2 rounded-lg">🏠 Home</button>\`}
                </div>
            </div>
            <div class="w-full bg-slate-200 h-2"><div class="bg-indigo-500 h-full transition-all duration-500 rounded-r-full" style="width: \${width}%"></div></div>
            <div class="flex-1 overflow-auto p-4 md:p-8">
                <div class="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border-4 border-slate-100 p-6 md:p-10 animate-fade-in">
                    \${content}
                </div>
            </div>
        </div>\`;
        if (currentStep === 0) window.updateStep0();
    }

    function stepInformasiUmum() {
      const d = currentModuleData;
      return \`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-black italic">
        <div class="col-span-1 md:col-span-2 bg-rose-50 border-4 border-rose-400 p-5 rounded-2xl shadow-sm animate-fade-in">
            <h3 class="text-sm font-black uppercase text-rose-900 mb-2">📌 Judul Modul</h3>
            <input type="text" id="judul_modul" class="input-modern p-4 text-xl md:text-2xl font-black bg-white rounded-xl placeholder-rose-200 text-rose-900 border-2 border-rose-300 focus:border-rose-500" placeholder="Ketik Judul (Misal: Modul Ajar Matematika - Pecahan)" value="\${d.judul_modul || ''}">
            <p class="text-[9px] text-rose-600 mt-2 uppercase tracking-tight font-black">*Kosongkan jika ingin digenerate AI</p>
        </div>
        <div class="bg-emerald-50 border-4 border-emerald-400 p-5 rounded-2xl animate-fade-in"><label class="block text-[10px] font-black uppercase mb-1">👤 Penyusun</label><input type="text" id="penyusun" class="input-modern p-3 rounded-xl border-emerald-300 focus:border-emerald-500" value="\${d.penyusun || ''}"></div>
        <div class="bg-violet-50 border-4 border-violet-400 p-5 rounded-2xl animate-fade-in"><label class="block text-[10px] font-black uppercase mb-1">🏫 Nama Sekolah</label><input type="text" id="sekolah" class="input-modern p-3 rounded-xl border-violet-300 focus:border-violet-500" value="\${d.sekolah || ''}"></div>
        <div class="bg-orange-50 border-4 border-orange-400 p-5 rounded-2xl animate-fade-in"><label class="block text-[10px] font-black uppercase mb-1">📅 Tahun Ajaran</label><input type="text" id="tahun_ajar" class="input-modern p-3 rounded-xl border-orange-300 focus:border-orange-500" value="\${d.tahun_ajar || ''}"></div>
        <div class="bg-cyan-50 border-4 border-cyan-400 p-5 rounded-2xl animate-fade-in">
            <label class="block text-[10px] font-black uppercase mb-1">🔰 Fase / Kelas</label>
            <select id="fase_kelas" class="select-modern p-3 rounded-xl bg-white border-cyan-300 focus:border-cyan-500"><option value="Fase C / Kelas 5" \${d.fase_kelas==='Fase C / Kelas 5'?'selected':''}>Fase C / Kelas 5</option><option value="Fase C / Kelas 6" \${d.fase_kelas==='Fase C / Kelas 6'?'selected':''}>Fase C / Kelas 6</option></select>
        </div>
        <div class="bg-lime-50 border-4 border-lime-400 p-5 rounded-2xl animate-fade-in">
            <label class="block text-[10px] font-black uppercase mb-1">⏳ Semester</label>
            <select id="semester" class="select-modern p-3 rounded-xl bg-white border-lime-300 focus:border-lime-500"><option value="1 (Ganjil)" \${d.semester==='1 (Ganjil)'?'selected':''}>1 (Ganjil)</option><option value="2 (Genap)" \${d.semester==='2 (Genap)'?'selected':''}>2 (Genap)</option></select>
        </div>
        <div class="bg-indigo-50 border-4 border-indigo-400 p-5 rounded-2xl animate-fade-in"><label class="block text-[10px] font-black uppercase mb-1">⏱️ Alokasi Waktu</label><input type="text" id="alokasi_waktu" class="input-modern p-3 rounded-xl" value="\${d.alokasi_waktu || ''}"></div>
        <div class="bg-amber-50 border-4 border-amber-400 p-5 rounded-2xl animate-fade-in col-span-1 md:col-span-2">
            <h3 class="text-sm font-black uppercase mb-2">📚 Mata Pelajaran</h3>
            <select id="mapel" class="select-modern p-3 rounded-xl bg-white border-amber-300 focus:border-amber-500" onchange="window.updateStep0()">
                <option value="">-- Pilih Mapel --</option>\${Object.keys(CP_DATABASE_FASE_C).map(m => \`<option value="\${m}" \${d.mapel===m?'selected':''}>\${m}</option>\`).join('')}
            </select>
        </div>
        <div class="bg-teal-50 border-4 border-teal-400 p-5 rounded-2xl animate-fade-in col-span-1 md:col-span-2">
            <h3 class="text-sm font-black uppercase mb-2">📑 Elemen / Domain</h3>
            <select id="elemen" class="select-modern p-3 rounded-xl bg-white border-teal-300 focus:border-teal-500" onchange="window.updateStep0()" disabled><option value="">-- Pilih Mapel Dulu --</option></select>
        </div>
        <div class="bg-yellow-50 border-4 border-yellow-400 p-5 rounded-2xl animate-fade-in col-span-1 md:col-span-2">
            <h3 class="text-sm font-black uppercase mb-2">🎯 Topik / Materi Pokok</h3>
            <select id="materi" class="select-modern p-3 rounded-xl bg-white border-yellow-300 focus:border-yellow-500" onchange="window.updateStep0()" disabled><option value="">-- Pilih Elemen Dulu --</option></select>
        </div>
        <div class="col-span-1 md:col-span-2 bg-slate-100 p-5 rounded-2xl border-4 border-slate-300 shadow-inner mt-4 animate-fade-in">
            <h4 class="text-xs uppercase font-black mb-2 text-slate-600">📖 Capaian Pembelajaran (CP)</h4>
            <textarea id="cp_preview" class="w-full text-xs p-4 bg-white border-2 border-slate-300 rounded-xl resize-none h-40 focus:border-slate-500 font-bold" readonly></textarea>
        </div>
      </div>\`;
    }

    function stepIdentifikasi() {
        const d = currentModuleData;
        
        let subMateriList = [];
        if (d.mapel && d.elemen && d.materi && CP_DATABASE_FASE_C[d.mapel]?.elemen?.[d.elemen]?.topik) {
            const t = CP_DATABASE_FASE_C[d.mapel].elemen[d.elemen].topik.find(x => x.judul === d.materi);
            if(t) subMateriList = t.materi || [];
        }

        return \`
        <div class="font-black italic">
            <h3 class="text-xl font-black text-rose-900 mb-6 uppercase tracking-tighter">🎯 Identifikasi Pembelajaran</h3>
            
            <div class="mb-8">
                <label class="block text-xs uppercase font-black mb-3">🧩 Pilih Sub Materi (Bisa > 1)</label>
                <div class="flex flex-wrap gap-2">
                    \${subMateriList.length > 0 ? subMateriList.map(s => {
                        const sel = (d.selected_materi || []).find(v => v.label === s.label) ? true : false;
                        return \\\`
                        <label class="cursor-pointer">
                            <input type="checkbox" class="hidden" onchange="window.toggleMateriCb('\${s.label}', '\${s.desc}')" \${sel ? 'checked' : ''}>
                            <div class="\${sel ? 'bg-indigo-600 text-white shadow-lg border-indigo-700' : 'bg-slate-100 text-slate-500 border-slate-300'} border-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all">
                                \${s.label}
                            </div>
                        </label>\\\`
                    }).join('') : '<p class="text-[10px] text-red-500">Pilih Mapel & Materi di Langkah 1!</p>'}
                </div>
            </div>

            <div class="mb-8">
                <label class="block text-xs uppercase font-black mb-3 text-cyan-900">🔗 Relevansi Materi (Konteks Nyata)</label>
                <textarea id="relevansi_materi" class="input-modern p-4 text-xs bg-cyan-50 rounded-xl h-24 font-bold border-cyan-300" placeholder="Ketik bagaimana materi ini relevan dengan kehidupan sehari-hari siswa... (Contoh: Menghitung kembalian uang saat jajan di kantin)"></textarea>
            </div>

            <div class="mb-8 p-6 bg-yellow-50 rounded-2xl border-4 border-yellow-400">
                <label class="block text-xs uppercase font-black mb-4">🏆 Profil Pelajar Pancasila (Max 3)</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    \${PROFIL_LULUSAN_DATA.map(p => {
                        const sel = (d.profil_lulusan || []).includes(p.title);
                        return \\\`
                        <label class="cursor-pointer w-full group" data-key="profil_lulusan" data-val="\${p.title}" onclick="event.preventDefault(); window.toggleArrStatic('profil_lulusan', '\${p.title}')">
                            <div class="\${sel ? 'border-emerald-600 bg-white shadow-xl scale-[1.05]' : 'border-emerald-400 bg-emerald-50 opacity-80 group-hover:bg-emerald-100'} border-4 p-4 rounded-2xl flex gap-3 h-full transition-all">
                                <span class="text-3xl">\${p.icon}</span>
                                <div>
                                    <h4 class="text-[10px] uppercase font-black text-emerald-900">\${p.title}</h4>
                                    <p class="text-[8px] text-emerald-700 leading-tight mt-1 truncate">\${p.desc}</p>
                                </div>
                            </div>
                            <input type="checkbox" class="hidden" value="\${p.title}" \${sel ? 'checked' : ''}>
                        </label>\\\`;
                    }).join('')}
                </div>
            </div>

            <h3 class="text-xl font-black text-blue-900 mb-6 uppercase tracking-tighter mt-12">🧠 Pemahaman Prasyarat & Kebutuhan</h3>
            
            <div class="mb-6">
                <label class="block text-xs uppercase font-black mb-2 text-blue-800">📖 Pengetahuan Awal Siswa (Prasyarat)</label>
                <textarea id="pengetahuan_awal" class="input-modern p-4 text-xs bg-blue-50 border-blue-200 rounded-xl h-24 font-bold" placeholder="Contoh: Siswa sudah memahami konsep penjumlahan dasar 1-100..."></textarea>
            </div>

            <div class="mb-6">
                <label class="block text-xs uppercase font-black mb-2 text-indigo-800">💡 Pertanyaan Pemantik</label>
                <textarea id="lintas_disiplin" class="input-modern p-4 text-xs bg-indigo-50 border-indigo-200 rounded-xl h-24 font-bold" placeholder="Tuliskan pertanyaan pemantik untuk membangkitkan rasa ingin tahu murid.."></textarea>
            </div>

            <div class="mb-6 bg-rose-50 p-6 rounded-2xl border-4 border-rose-400">
                <label class="block text-xs uppercase font-black mb-3 text-rose-900">🧩 Kebutuhan Belajar Murid</label>
                <p class="text-[9px] text-rose-700 mb-4 font-bold">*Tuliskan variasi gaya belajar, minat, atau tingkatan kesiapan murid Anda</p>
                <textarea id="kebutuhan_murid" class="input-modern p-4 text-xs bg-white border-rose-300 rounded-xl h-24 font-bold" placeholder="Contoh: Sebagian murid visual butuh gambar, murid kinestetik butuh alat peraga, ada 3 murid CIBI yang butuh tambahan soal HOTS..."></textarea>
            </div>
        </div>\`;
    }

    const stepKarakteristik = stepIdentifikasi;

    window.toggleMateriCb = function(val, desc) {
        if(!currentModuleData.selected_materi) currentModuleData.selected_materi = [];
        const idx = currentModuleData.selected_materi.findIndex(x => x.label === val);
        if(idx > -1) currentModuleData.selected_materi.splice(idx, 1);
        else currentModuleData.selected_materi.push({label: val, desc: desc});
        render();
    }
`;
fs.writeFileSync('/app/applet/public/build_c2.js', htmlContent);
console.log('Part 2 saved.');
