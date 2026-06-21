const fs = require('fs');
const htmlContent = `

    function stepPendekatan() {
        const d = currentModuleData;
        return \`
        <div class="font-black italic">
            <h3 class="text-xl font-black text-emerald-900 mb-6 uppercase tracking-tighter">⚙️ Model & Metode</h3>

            <div class="mb-8 p-6 bg-emerald-50 rounded-3xl border-4 border-emerald-400">
                <label class="block text-xs uppercase font-black mb-3 text-emerald-900">🏛️ Model Pembelajaran Utama</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    \${MODELS.map(m => \\\`
                        <label class="cursor-pointer">
                            <input type="radio" name="model_radio" value="\${m}" class="hidden" onchange="window.updateStep3Model('\${m}')" \${d.model===m?'checked':''}>
                            <div class="border-4 p-4 rounded-2xl flex items-center gap-2 transition-all \${d.model===m?'border-emerald-600 bg-white shadow-xl scale-[1.02] text-emerald-900':'border-emerald-400 bg-emerald-100 opacity-80 text-emerald-800'}">
                                <span class="bg-emerald-200 text-emerald-800 p-2 rounded-lg text-xs">✅</span>
                                <span class="text-[10px] uppercase font-black">\${m}</span>
                            </div>
                        </label>
                    \\\`).join('')}
                </div>
                <div id="recommendation-area-container" class="mt-4">
                    \${(!d.pendekatan && d.model) ? (()=>{
                        const r = getRekomendasiPendekatan();
                        return \`<div class="p-6 bg-blue-100 border-4 border-blue-300 rounded-3xl shadow-lg animate-fade-in"><p class="text-[11px] uppercase font-black text-blue-900 mb-3 flex items-center gap-2"><span>💡</span> Rekomendasi Pendekatan:</p><button onclick="window.applyRecPendekatan('\${r.pendekatan}')" class="w-full text-left p-3 bg-white rounded-2xl border-2 border-blue-400 hover:scale-[1.02] transition-all"><p class="text-[10px] font-black text-blue-700 uppercase">\${r.pendekatan}</p><p class="text-[8px] text-blue-500 italic mt-1 leading-tight">\${r.alasan}</p></button></div>\`;
                    })() : ''}
                </div>
                <div id="sintaks-area-container" class="mt-4">
                    \${(d.model && SINTAKS_DATA[d.model]) ? \`<div class="p-6 bg-white border-4 border-emerald-200 rounded-3xl shadow-inner animate-fade-in"><h4 class="text-xs font-black uppercase text-emerald-900 mb-3">📌 Alur Sintak:</h4><div class="text-[10px] font-extrabold uppercase leading-relaxed text-emerald-700">\${SINTAKS_DATA[d.model].steps.join(" ▶ ")}</div></div>\` : ''}
                </div>
            </div>

            <div class="mb-8 p-6 bg-indigo-50 rounded-3xl border-4 border-indigo-400">
                <label class="block text-xs uppercase font-black mb-3 text-indigo-900">🧭 Pendekatan Pembelajaran</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    \${APPROACHES.map(a => \\\`
                        <label class="cursor-pointer">
                            <input type="radio" name="pendekatan_radio" value="\${a}" class="hidden" onchange="window.updateStep3Pendekatan('\${a}')" \${d.pendekatan===a?'checked':''}>
                            <div class="border-4 p-3 rounded-2xl transition-all text-[10px] font-black uppercase text-center \${d.pendekatan===a?'border-indigo-600 bg-white text-indigo-900 shadow-xl scale-[1.02]':'border-indigo-300 bg-indigo-100 opacity-80 text-indigo-800'}">
                                \${a}
                            </div>
                        </label>
                    \\\`).join('')}
                </div>
                <div id="metode-rec-area" class="mt-4">
                    \${(d.pendekatan) ? (()=>{
                         const recs = getRekomendasiMetode();
                         return \`<div class="p-6 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-lg animate-fade-in"><p class="text-[11px] uppercase font-black text-slate-700 mb-3 flex items-center gap-2"><span>🛠️</span> Rekomendasi Metode:</p><div class="flex flex-wrap gap-2">\${recs.map(met=>{ const isSel = (d.metode||[]).includes(met); return \\\`<button onclick="window.toggleArrStatic('metode', '\${met}')" class="metode-rec-btn px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border-2 \${isSel ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-200'}" data-metode="\${met}">\${met}</button>\\\`}).join('')}</div><p class="text-[8px] mt-3 text-slate-500 italic">*Klik tombol otomatis menambah metode</p></div>\`;
                    })() : ''}
                </div>
            </div>

            <div class="mb-4 p-6 bg-orange-50 rounded-3xl border-4 border-orange-400">
                <label class="block text-xs uppercase font-black mb-3 text-orange-900">🛠️ Metode Penunjang (Max 4)</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    \${METHODS_WITH_DESC.map(({label, icon}) => {
                        const sel = (d.metode || []).includes(label);
                        return \\\`<label class="cursor-pointer" data-key="metode" data-val="\${label}" onclick="event.preventDefault(); window.toggleArrStatic('metode', '\${label}')">
                            <input type="checkbox" class="hidden" \${sel ? 'checked' : ''}>
                            <div class="border-4 p-3 rounded-2xl flex items-center justify-center gap-2 transition-all h-full \${sel ? 'border-orange-600 bg-white shadow-xl scale-[1.03]' : 'border-orange-400 bg-orange-50 opacity-80'}">
                                <span class="text-xl">\${icon}</span>
                                <span class="text-[9px] uppercase font-black text-center">\${label}</span>
                            </div>
                        </label>\\\`
                    }).join('')}
                </div>
            </div>
        </div>\`;
    }

    function stepManajemenKelas() {
        const d = currentModuleData;
        return \`<div class="font-black italic">
            <h3 class="text-xl font-black text-indigo-900 mb-6 uppercase tracking-tighter">🤝 Mitra Pembelajaran</h3>
            
            <div class="mb-8">
                <label class="block text-xs uppercase font-black mb-3 flex items-center gap-2"><span class="bg-blue-100 text-blue-700 p-2 rounded-lg">🏫</span> Mitra Internal Sekolah</label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    \${MITRA_INTERNAL_DATA.map((item, idx) => {
                        const sel = (d.mitra_internal || []).includes(item.label);
                        const c = ITEM_PALETTE[idx % ITEM_PALETTE.length];
                        return \\\`<label class="cursor-pointer group" data-key="mitra_internal" data-val="\${item.label}" onclick="event.preventDefault(); window.toggleArrStatic('mitra_internal', '\${item.label}')">
                            <input type="checkbox" class="hidden" \${sel ? 'checked' : ''}>
                            <div class="border-4 p-4 rounded-3xl h-full flex flex-col items-center text-center transition-all \${sel ? \`\${c.borderStrong} bg-white shadow-xl scale-[1.05]\` : \`\${c.border} \${c.bg} opacity-70 group-hover:opacity-100\`}">
                                <div class="text-4xl mb-2">\${item.icon}</div>
                                <h4 class="text-[10px] font-black uppercase \${c.text} mb-1">\${item.label}</h4>
                                <p class="text-[8px] text-slate-500 leading-tight italic">\${item.role}</p>
                            </div>
                        </label>\\\`
                    }).join('')}
                </div>
            </div>

            <div>
                <label class="block text-xs uppercase font-black mb-3 flex items-center gap-2"><span class="bg-rose-100 text-rose-700 p-2 rounded-lg">🏘️</span> Mitra Eksternal Sekolah</label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    \${MITRA_EKSTERNAL_DATA.map((item, idx) => {
                        const sel = (d.mitra_eksternal || []).includes(item.label);
                        const c = ITEM_PALETTE[(idx+5) % ITEM_PALETTE.length];
                        return \\\`<label class="cursor-pointer group" data-key="mitra_eksternal" data-val="\${item.label}" onclick="event.preventDefault(); window.toggleArrStatic('mitra_eksternal', '\${item.label}')">
                            <input type="checkbox" class="hidden" \${sel ? 'checked' : ''}>
                            <div class="border-4 p-4 rounded-3xl h-full flex flex-col items-center text-center transition-all \${sel ? \`\${c.borderStrong} bg-white shadow-xl scale-[1.05]\` : \`\${c.border} \${c.bg} opacity-70 group-hover:opacity-100\`}">
                                <div class="text-4xl mb-2">\${item.icon}</div>
                                <h4 class="text-[10px] font-black uppercase \${c.text} mb-1">\${item.label}</h4>
                                <p class="text-[8px] text-slate-500 leading-tight italic">\${item.role}</p>
                            </div>
                        </label>\\\`
                    }).join('')}
                </div>
            </div>
        </div>\`;
    }

    function stepLingkunganBudaya() {
        const d = currentModuleData;
        const renderGrid = (data, key) => data.map((item, idx) => {
            const sel = (d[key] || []).includes(item.label);
            const c = ITEM_PALETTE[(idx * 3) % ITEM_PALETTE.length];
            return \`<label class="cursor-pointer group" data-key="\${key}" data-val="\${item.label}" onclick="event.preventDefault(); window.toggleArrStatic('\${key}', '\${item.label}')">
                <input type="checkbox" class="hidden" \${sel ? 'checked' : ''}>
                <div class="border-4 p-4 rounded-3xl h-full flex flex-col items-center justify-center text-center transition-all \${sel ? \`\${c.borderStrong} bg-white shadow-xl scale-[1.05]\` : \`\${c.border} \${c.bg} opacity-70 group-hover:opacity-100\`}">
                    <span class="text-3xl mb-2">\${item.icon}</span>
                    <span class="text-[9px] font-black uppercase \${c.text}">\${item.label}</span>
                </div>
            </label>\`;
        }).join('');

        return \`<div class="font-black italic">
            <h3 class="text-xl font-black text-teal-900 mb-6 uppercase tracking-tighter">🏫 Lingkungan & Budaya</h3>
            <div class="mb-8">
                <label class="block text-xs uppercase font-black mb-3">🌳 Lingkungan Fisik</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">\${renderGrid(LINGKUNGAN_FISIK, 'lingkungan_fisik')}</div>
            </div>
            <div>
                <label class="block text-xs uppercase font-black mb-3">🤝 Budaya Belajar</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">\${renderGrid(BUDAYA_BELAJAR, 'budaya_belajar')}</div>
            </div>
        </div>\`;
    }

    function stepMediaDigital() {
        const d = currentModuleData;
        const renderGrid = (data, key) => data.map((item, idx) => {
            const sel = (d[key] || []).includes(item.label);
            const c = ITEM_PALETTE[(idx * 2 + 5) % ITEM_PALETTE.length];
            return \`<label class="cursor-pointer group" data-key="\${key}" data-val="\${item.label}" onclick="event.preventDefault(); window.toggleArrStatic('\${key}', '\${item.label}')">
                <input type="checkbox" class="hidden" \${sel ? 'checked' : ''}>
                <div class="border-4 py-3 px-2 rounded-2xl h-full flex items-center justify-center gap-2 transition-all \${sel ? \`\${c.borderStrong} bg-white shadow-xl scale-[1.05]\` : \`\${c.border} \${c.bg} opacity-70 group-hover:opacity-100\`}">
                    <span class="text-xl">\${item.icon}</span>
                    <span class="text-[9px] font-black uppercase \${c.text} text-center leading-tight">\${item.label}</span>
                </div>
            </label>\`;
        }).join('');

        return \`<div class="font-black italic">
            <h3 class="text-xl font-black text-rose-900 mb-6 uppercase tracking-tighter">💻 Media & Perangkat</h3>
            <div class="mb-6"><label class="block text-[10px] uppercase font-black mb-2 text-rose-900">📚 Media Non-Digital</label><div class="grid grid-cols-2 md:grid-cols-3 gap-2">\${renderGrid(NON_DIGITAL_MEDIA, 'media_non_digital')}</div></div>
            <div class="mb-6"><label class="block text-[10px] uppercase font-black mb-2 text-blue-900">🌐 Platform Aplikasi (Opsional)</label><div class="grid grid-cols-2 md:grid-cols-3 gap-2">\${renderGrid(DIGITAL_PLATFORM, 'platform_aplikasi')}</div></div>
            <div class="mb-6"><label class="block text-[10px] uppercase font-black mb-2 text-indigo-900">📱 Perangkat Digital</label><div class="grid grid-cols-2 md:grid-cols-3 gap-2">\${renderGrid(DIGITAL_DEVICE, 'perangkat_digital')}</div></div>
            <div><label class="block text-[10px] uppercase font-black mb-2 text-emerald-900">🎞️ Media Digital</label><div class="grid grid-cols-2 md:grid-cols-3 gap-2">\${renderGrid(DIGITAL_MEDIA, 'media_digital')}</div></div>
        </div>\`;
    }

    function stepAIGenerateModal() {
        const d = currentModuleData;
        const gLabel = (val) => val ? '<span class="text-emerald-600 font-black">✅ Siap</span>' : '<span class="text-rose-500 font-bold">❌ Belum</span>';
        
        return \`<div class="font-black italic text-center">
            <div class="mb-8">
                <span class="text-6xl mb-4 inline-block drop-shadow-md">✨</span>
                <h3 class="text-3xl font-black text-blue-900 uppercase tracking-tighter">Generate Pakar</h3>
                <p class="text-xs text-blue-600 uppercase mt-2 tracking-widest">Biarkan AI menyusun komponen inti modul</p>
            </div>
            
            <div class="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200 max-w-lg mx-auto text-left mb-8 shadow-inner">
                <ul class="space-y-4 text-xs font-black uppercase text-blue-900">
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>🎯</span> Tujuan Pembelajaran</div> \${gLabel(d.tp)}
                    </li>
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>👣</span> Langkah (Sintaks)</div> \${gLabel(d.validasi_langkah)}
                    </li>
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>📝</span> Instrumen Asesmen</div> \${gLabel(d.validasi_asesmen)}
                    </li>
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>📄</span> LKPD Pemahaman</div> \${gLabel(d.validasi_lkpd)}
                    </li>
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>📏</span> Rubrik Penilaian</div> \${gLabel(d.validasi_rubrik)}
                    </li>
                    <li class="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border-2 border-blue-100">
                        <div class="flex items-center gap-2"><span>📊</span> Soal Evaluasi / Sumatif</div> \${gLabel(d.validasi_evaluasi)}
                    </li>
                </ul>
            </div>

            <button onclick="window.runAIGenerateFull()" id="btn-generate-ai" class="btn-primary w-full max-w-lg mx-auto text-white font-black py-4 px-8 rounded-2xl shadow-xl uppercase italic text-sm flex items-center justify-center gap-3 border-2 border-blue-400">
                <div class="loader hidden" id="spinner-ai"></div>
                <span id="text-ai">🤖 Generate Semua Komponen</span>
            </button>
            <p class="text-[9px] text-slate-400 mt-4 uppercase">*Proses membutuhkan waktu ~30 detik</p>
        </div>\`;
    }

    window.runAIGenerateFull = async function() {
        const d = currentModuleData;
        const btn = document.getElementById('btn-generate-ai');
        const spinner = document.getElementById('spinner-ai');
        const text = document.getElementById('text-ai');

        if(typeof __initial_auth_token === 'undefined') {
            showToast("❌ Mode Preview - Tidak Dapat Memanggil AI");
            return;
        }

        btn.classList.add('opacity-70', 'cursor-not-allowed', 'pointer-events-none');
        spinner.classList.remove('hidden');
        text.innerText = 'MEMPROSES RAG & EXPERT PROMPT...';
        showToast("⏳ Sedang menyusun modul via AI...");

        const formatHtml = (t) => {
             return t.replace(/\n\n/g, '<br><br>')
                     .replace(/\n/g, '<br>')
                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        };

        const jsonPrompt = \`Anda adalah pakar pembuat Modul Ajar Kurikulum Merdeka BSKAP 046 Tahun 2025.
        
DATA MODUL:
- Mapel: \${d.mapel}
- Fase/Kelas: \${d.fase_kelas} (\${d.semester})
- Materi: \${d.materi} (\${(d.selected_materi || []).map(x=>x.label).join(', ')})
- CP: \${d.cp}
- Prasyarat: \${d.pengetahuan_awal}
- Kebutuhan Murid: \${d.kebutuhan_murid}
- Lintas Disiplin/Pemantik: \${d.lintas_disiplin}
- Model: \${d.model}
- Metode: \${(d.metode||[]).join(', ')}

Hasilkan JSON dengan format EXACTLY:
{
  "judul": "String pendek kreatif untuk Modul (Jika sebelumnya kosong)",
  "tujuan": "String HTML format list <ol> untuk Tujuan Pembelajaran ABCD (Audience, Behavior, Condition, Degree).",
  "langkah": "String HTML langkah kegiatan mulai dari Pendahuluan, Inti (\${d.model}), epilog (mengacu SINTAKS KEMENDIKBUD). Gunakan <table class='kegiatan-table'> dengan th dan td.",
  "asesmen": "String format <ol> untuk instrumen asesmen Formatif (Awal & Proses) dan Sumatif.",
  "lkpd": "String tabel HTML form LKPD singkat untuk siswa.",
  "rubrik": "String tabel HTML untuk rubrik penilaian.",
  "evaluasi": "String format <ol> untuk 5 soal evaluasi sumatif (pilihan ganda/isian singkat)."
}\`;

        try {
            const aiResult = await callGemini(jsonPrompt);
            if (!d.judul_modul && aiResult.judul) d.judul_modul = aiResult.judul;
            d.tp = formatHtml(aiResult.tujuan);
            d.validasi_langkah = aiResult.langkah.replace(/\n/g, ''); 
            d.validasi_asesmen = formatHtml(aiResult.asesmen);
            d.validasi_lkpd = aiResult.lkpd.replace(/\n/g, '');
            d.validasi_rubrik = aiResult.rubrik.replace(/\n/g, '');
            d.validasi_evaluasi = formatHtml(aiResult.evaluasi);
            
            showToast("✅ Berhasil Dibuat oleh AI!");
            render();
        } catch (e) {
            console.error(e);
            showToast("❌ Gagal. Coba lagi!");
        } finally {
            btn.classList.remove('opacity-70', 'cursor-not-allowed', 'pointer-events-none');
            spinner.classList.add('hidden');
            text.innerText = '🤖 GENERATE ULANG (BILA PERLU)';
        }
    }

    function stepHasilModul() {
        const d = currentModuleData;
        window.saveDataToFB();
        return \`<div class="font-black italic print-container">
            <div class="flex justify-between items-center mb-6 no-print bg-indigo-50 p-4 rounded-2xl border-4 border-indigo-200 shadow-md">
                <button onclick="window.downloadPdf()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl shadow-lg uppercase flex items-center justify-center gap-2 transition-transform hover:scale-105 border-2 border-indigo-800">
                    <span class="text-xl">📄</span> CETAK PDF BSKAP 046
                </button>
            </div>
            
            <div id="pdf-content" class="a4-paper shadow-2xl relative bg-white">
                <div class="doc-main-title">
                    MODUL PEMBELAJARAN KURIKULUM MERDEKA<br>EDISI BSKAP 046
                </div>
                
                <h3 class="doc-section-title">A. INFORMASI UMUM</h3>
                <table class="doc-table">
                    <tr><td class="label">1. Institusi Pembina</td><td class="colon">:</td><td class="value">\${d.sekolah || ''}</td></tr>
                    <tr><td class="label">2. Penyusun</td><td class="colon">:</td><td class="value">\${d.penyusun || ''} \${d.penyusun_nip ? '(NIP. '+d.penyusun_nip+')' : ''}</td></tr>
                    <tr><td class="label">3. Tahun Pelajaran</td><td class="colon">:</td><td class="value">\${d.tahun_ajar || ''}</td></tr>
                    <tr><td class="label">4. Fase / Kelas</td><td class="colon">:</td><td class="value">\${d.fase_kelas || ''}</td></tr>
                    <tr><td class="label">5. Semester</td><td class="colon">:</td><td class="value">\${d.semester || ''}</td></tr>
                    <tr><td class="label">6. Alokasi Waktu</td><td class="colon">:</td><td class="value">\${d.alokasi_waktu || ''}</td></tr>
                    <tr><td class="label">7. Mata Pelajaran</td><td class="colon">:</td><td class="value">\${d.mapel || ''}</td></tr>
                </table>

                <h3 class="doc-section-title">B. KOMPONEN INTI: TUJUAN DAN INDIKATOR</h3>
                <div class="doc-sub-section">Capaian Pembelajaran (Elemen: \${d.elemen}):</div>
                <div style="margin-left: 20px; margin-bottom:12px; text-align:justify;">\${d.cp || ''}</div>
                <div class="doc-sub-section">Tujuan Pembelajaran Khusus:</div>
                <div style="margin-left: 20px;">\${d.tp || '-'}</div>

                <h3 class="doc-section-title">C. PEMAHAMAN BERMAKNA & PRASYARAT</h3>
                <table class="doc-table" style="margin-bottom:0;">
                    <tr><td class="label" style="width:25%;">Relevansi Materi</td><td class="colon" style="width:10px;">:</td><td class="value" style="width:auto;">\${d.relevansi_materi || '-'}</td></tr>
                    <tr><td class="label">Pengetahuan Awal</td><td class="colon">:</td><td class="value">\${d.pengetahuan_awal || '-'}</td></tr>
                    <tr><td class="label">Pertanyaan Pemantik</td><td class="colon">:</td><td class="value">\${d.lintas_disiplin || '-'}</td></tr>
                    <tr><td class="label">Profil Pelajar Pancasila</td><td class="colon">:</td><td class="value">\${(d.profil_lulusan||[]).join(', ')}</td></tr>
                </table>

                <h3 class="doc-section-title">D. STRATEGI PELAKSANAAN</h3>
                <table class="doc-table">
                    <tr><td class="label">Model Pembelajaran</td><td class="colon">:</td><td class="value">\${d.model || '-'}</td></tr>
                    <tr><td class="label">Pendekatan</td><td class="colon">:</td><td class="value">\${d.pendekatan || '-'}</td></tr>
                    <tr><td class="label">Metode Pembelajaran</td><td class="colon">:</td><td class="value">\${(d.metode||[]).join(', ')}</td></tr>
                </table>

                <h3 class="doc-section-title">E. LANGKAH-LANGKAH PEMBELAJARAN</h3>
                <div class="shadow-inner" style="box-shadow:none;">
                    \${d.validasi_langkah || '-'}
                </div>

                <div class="html2pdf__page-break"></div>

                <h3 class="doc-section-title">F. ASESMEN & PEMBELAJARAN BERDIFERENSIASI</h3>
                <div class="doc-sub-section">Kebutuhan Murid (Diferensiasi):</div>
                <div style="margin-left:20px; font-style:italic;">\${d.kebutuhan_murid || '-'}</div>
                <div class="doc-sub-section" style="margin-top:15px;">Instrumen Asesmen (Formatif & Sumatif):</div>
                <div style="margin-left: 20px;">\${d.validasi_asesmen || '-'}</div>

                <h3 class="doc-section-title">G. RUBRIK PENILAIAN & EVALUASI</h3>
                <div class="shadow-inner" style="box-shadow:none;">\${d.validasi_rubrik || '-'}</div>
                <div class="doc-sub-section" style="margin-top:15px;">Soal Evaluasi Sumatif:</div>
                <div style="margin-left: 20px;">\${d.validasi_evaluasi || '-'}</div>

                <h3 class="doc-section-title">H. LAMPIRAN MEDIA & SUMBER BELAJAR</h3>
                <div class="doc-sub-section">Lembar Kerja Peserta Didik (LKPD):</div>
                <div class="lkpd-container shadow-inner" style="box-shadow:none; overflow-x:hidden;">\${d.validasi_lkpd || '-'}</div>
                
                <table class="doc-table" style="margin-top: 20px;">
                    <tr><td class="label">Media Non-Digital</td><td class="colon">:</td><td class="value">\${(d.media_non_digital||[]).join(', ') || '-'}</td></tr>
                    <tr><td class="label">Perangkat Digital</td><td class="colon">:</td><td class="value">\${(d.perangkat_digital||[]).join(', ') || '-'}</td></tr>
                    <tr><td class="label">Lingkungan Fisik</td><td class="colon">:</td><td class="value">\${(d.lingkungan_fisik||[]).join(', ') || '-'}</td></tr>
                </table>

                <div style="margin-top: 50pt; text-align: right; margin-right: 50pt;">
                \${d.konfirmasi_tempat || '...................'}, \${d.konfirmasi_tanggal || '................... 2026'}<br>
                Mengetahui,<br>
                Kepala Sekolah <br><br><br><br>
                <b><u>\${d.kepala_sekolah_nama || '...........................................'}</u></b><br>
                NIP. \${d.kepala_sekolah_nip || '...........................................'}<br>
                <div style="margin-top: -120px; text-align: left; margin-left: 50pt;">
                <br>
                <br>
                Penyusun<br><br><br><br>
                <b><u>\${d.penyusun || '...........................................'}</u></b><br>
                NIP. \${d.penyusun_nip || '...........................................'}<br>
                </div>
                </div>
            </div>
        </div>\`;
    }

    window.saveDataToFB = function() {
        if (window.dataSdk && window.dataSdk.create) {
            window.dataSdk.create(currentModuleData);
        }
    };

    window.downloadPdf = function() {
        const element = document.getElementById('pdf-content');
        const originalWidth = element.style.width;
        
        element.style.width = '210mm';
        
        const opt = {
            margin: 0,
            filename: \`Modul Ajar_\${currentModuleData.judul_modul || 'Fase C'}.pdf\`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 794 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.style.width = originalWidth;
            showToast("📥 PDF Sedang Diunduh!");
        });
    }

    function showToast(msg) {
        const body = document.body;
        const toast = document.createElement('div');
        toast.className = 'toast z-[6000]';
        toast.innerText = msg;
        body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    window.showToast = showToast;
    
    window.closeModal = function() { const modal = document.getElementById('modal-container'); if(modal) modal.innerHTML = ''; };
    
    window.onload = () => { navigateTo('home'); };
    </script>
</body>
</html>
`;
fs.writeFileSync('/app/applet/public/build_c3.js', htmlContent);
console.log('Part 3 saved.');
