export const htmlPart6 = `
        window.applyAiRecommendations = function (model) {
            currentModuleData.model = model;
            showToast(\`✅ Model Terpilih!\`);
            const btn = event.currentTarget;
            btn.innerHTML = "✓ MODEL TERTERAPKAN";
            btn.classList.add('bg-green-500', 'text-white');
            btn.disabled = true;
            window.updateStep3Model(model);
        };

        window.generateTP = async function () {
            if (isProcessing) return;
            window.saveInputs();
            const btn = event.currentTarget;
            const d = currentModuleData;
            if (!d.selected_materi || d.selected_materi.length === 0) { showToast("⚠️ Pilih materi di Langkah 2!"); return; }
            setAILoading(btn, true);
            try {
                const combinedMedia = (d.media_digital || []).concat(d.media_non_digital || []).join(', ');
                const combinedMetode = (d.metode || []).join(', ');

                const prompt = \`Bertindaklah sebagai pakar Kurikulum Merdeka jenjang Sekolah Dasar (SD). Susun tepat 3 variasi Tujuan Pembelajaran (TP) yang sesuai untuk \${d.fase_kelas} pada topik materi "\${d.materi}" (\${(d.selected_materi || []).join(', ')}). 
            
            DATA RELEVAN UNTUK KORELASI:
            - Metode yang dipilih guru: \${combinedMetode || '-'}
            - Media yang dipilih guru: \${combinedMedia || '-'}

            WAJIB PATUHI INSTRUKSI RUMUSAN TP:
            1. Gunakan prinsip ABCD secara IMPLISIT dalam bentuk KALIMAT NARASI UTUH.
            2. DILARANG KERAS menyertakan label/kode teknis ABCD.
            3. VARIASI TP:
               - TP 1: Fokuskan korelasi dengan salah satu METODE paling relevan dari pilihan guru di atas (Contoh: "Setelah melakukan diskusi kelompok...").
               - TP 2: Fokuskan korelasi dengan salah satu MEDIA paling relevan dari pilihan guru di atas (Contoh: "Melalui tayangan video pembelajaran...").
               - TP 3: Gabungan atau variasi bebas yang tetap relevan dengan konteks materi and pilihan guru.
            4. SETIAP KALIMAT TUJUAN PEMBELAJARAN WAJIB DIAKHIRI dengan salah satu frase kriteria pencapaian (Degree) berikut: "dengan tepat", "dengan benar", "secara akurat", "dengan minimal 75% benar", "dengan ketepatan minimal 75%", atau "sesuai kriteria".
            
            RESPON WAJIB HANYA BERUPA ARRAY STRING JSON: ["TP 1...", "TP 2...", "TP 3..."]\`;
                const results = await callGemini(prompt);
                window.showTPPicker(results);
            } catch (e) { showToast("❌ Gagal Generate AI"); }
            setAILoading(btn, false);
        };

        window.showTPPicker = function (options) {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`<div class="modal-overlay"><div class="tp-modal-content"><h3 class="text-xl font-black text-yellow-500 mb-6 uppercase text-center font-black italic">🎯 Pilih Tujuan Pembelajaran</h3><div class="space-y-4">\${options.map((opt, i) => \`<label class="flex items-start gap-4 p-5 rounded-2xl border-2 border-white/10 bg-blue-900/10 cursor-pointer hover:bg-blue-900/20 transition-all font-black italic"><input type="checkbox" class="tp-selection-checkbox w-6 h-6 mt-1 !accent-yellow-500" value="\${opt.replace(/"/g, '&quot;')}"><div class="text-sm font-bold text-slate-200 font-black italic" style="line-height: 1.6;">\${opt}</div></label>\`).join('')}</div><div class="mt-8 flex gap-4 font-black italic"><button onclick="window.applyTPSelection()" class="flex-1 btn-gold py-5 rounded-2xl shadow-lg uppercase italic font-black italic">✅ Masukkan Pilihan</button><button onclick="window.closeModal()" class="px-8 bg-slate-900 text-slate-400 font-bold py-5 rounded-2xl italic border border-blue-900">Batal</button></div></div></div>\`;
        };

        window.applyTPSelection = function () {
            const selected = Array.from(document.querySelectorAll('.tp-selection-checkbox:checked')).map(el => el.value);
            if (selected.length === 0) return;
            let finalTP = selected.length > 1 ? selected.map((text, idx) => \`\${idx + 1}. \${text}\`).join('\\n') : selected[0];
            currentModuleData.tp = finalTP;
            const el = document.getElementById('tp'); if (el) el.value = finalTP;
            window.closeModal(); showToast(\`✨ TP Dipilih!\`);
        };

        window.generateLangkahPembelajaran = async function () {
            if (isProcessing) return;
            window.saveInputs();
            const btn = event ? event.currentTarget : null;
            const d = currentModuleData;
            if (!d.tp) { showToast("⚠️ Isi TP Dahulu!"); return; }
            if (btn) setAILoading(btn, true);
            try {
                const prompt = \`Anda bertindak sebagai perancang modul Kurikulum Merdeka tingkat mahir dengan spesialisasi Pembelajaran Mendalam (Deep Learning).
            Tugas: Susun "LANGKAH-LANGKAH PEMBELAJARAN" operasional untuk \${d.fase_kelas} materi "\${d.materi}".

            WAJIB PATUHI STRUKTUR RESPON JSON:
            {
              "pendahuluan": "WAJIB dimulai dengan Guru menyapa anak-anak, menanyakan kabar, mengecek kehadiran, dan mengajak berdoa bersama. Jangan mendeskripsikan ucapan langsung guru secara dialogis. Rincikan AKTIVITAS PEMANTIK KONKRET (seperti menayangkan media, tanya jawab, atau simulasi singkat) yang sesuai untuk murid SD. Narasi harus ringkas, tidak bertele-tele, dan fokus pada langkah operasional nyata guru dan siswa. Pastikan penggunaan huruf kapital mengikuti kaidah Bahasa Indonesia yang benar (contoh: gunakan 'berdoa', bukan 'BERDOA').",
              "inti": [
                {
                  "sintaks": "Nama Sintaks",
                  "deskripsi": "Aktivitas guru dan siswa...",
                  "pengalaman_belajar": "Wajib dimulai dengan teks 'Pengalaman Belajar: [Elemen]: [Narasi relevan]'. Elemen harus salah satu atau gabungan dari: Bermakna, Berkesadaran, atau Menggembirakan.",
                  "prinsip_deep": "Wajib dimulai with teks 'Prinsip Pembelajaran: [Elemen]: [Narasi relevan]'. Elemen harus salah satu atau gabungan dari: Memahami, Mengaplikasi, atau Merefleksi."
                }
              ],
              "penutup": "Deskripsi penutup..."
            }

            INSTRUKSI KONTEN:
            1. Model: \${d.model}.
            2. Metode: \${(d.metode || []).join(', ')}.
            3. Media: \${(d.media_digital || []).concat(d.media_non_digital || []).join(', ')}.
            4. Budaya Belajar: \${(d.budaya_belajar || []).join(', ')}.
            5. AKTIVITAS HARUS RELEVAN DAN KONKRET UNTANG JENJANG SD. DILARANG MENGGUNAKAN KATA OPSIONAL.
            6. Penutup WAJIB diakhiri doa bersama.\`;

                const results = await callGemini(prompt);
                const normalized = {
                    pendahuluan: results.pendahuluan || results.awal || "-",
                    inti: Array.isArray(results.inti) ? results.inti : [],
                    penutup: results.penutup || results.akhir || "-"
                };

                currentModuleData.validasi_langkah = JSON.stringify(normalized);
                render();
                showToast("✨ Langkah Spesifik Berhasil!");
            } catch (e) {
                showToast("❌ Gagal Generate AI, silakan coba kembali.");
            } finally {
                if (btn) setAILoading(btn, false);
            }
        };

        const aiGenericGen = async (key, context, btnElement) => {
            if (isProcessing) return;
            window.saveInputs();
            const d = currentModuleData;
            if ((key === 'validasi_asesmen' || key === 'validasi_rubrik' || key === 'validasi_lkpd' || key === 'validasi_evaluasi') && !d.validasi_langkah) {
                showToast("⚠️ Generate Langkah Pembelajaran dahulu agar data relevan!");
                return;
            }
            setAILoading(btnElement, true);
            try {
                let prompt = "";
                const activityContext = d.validasi_langkah ? \`KONTEN AKTIVITAS PEMBELAJARAN (LANGKAH-LANGKAH): \${d.validasi_langkah}\` : "";

                if (key === 'validasi_asesmen') {
                    prompt = \`Anda adalah ahli perencanaan kurikulum profesional. Susunlah paket ASESMEN LENGKAP untuk materi \${d.materi} yang WAJIB terintegrasi 100% dengan aktivitas pada \${activityContext}.
                
                ATURAN KHUSUS (WAJIB DIPATUHI):
                1. Setiap pilihan dalam array HARUS berisi paket lengkap (Diagnostik, Formatif, DAN Sumatif) dalam 1 kesatuan utuh.
                2. Gunakan format penomoran sebagai berikut (PASTIKAN penomoran 1, 2, dan 3 dimulai tepat dari margin kiri TANPA SPASI ATAU INDENTASI di depannya):
1. Asesmen Diagnostik
   (a). Bentuk/Teknik: ...
   (b). Cara/Sumber: [WAJIB bersumber dari rincian aktivitas pada Kegiatan Awal/Pendahuluan]
2. Asesmen Formatif
   (a). Bentuk/Teknik: ...
   (b). Cara/Sumber: [WAJIB bersumber dari rincian aktivitas pada Kegiatan Inti]
3. Asesmen Sumatif
   (a). Bentuk/Teknik: ...
   (b). Cara/Sumber: [WAJIB disesuaikan dengan hasil nyata aktivitas peserta didik]
                3. DILARANG KERAS mengambil instrumen/sumber dari luar rincian aktivitas pembelajaran yang telah disusun.
                4. DILARANG KERAS menggunakan format paket.

                RESPON WAJIB BERUPA ARRAY STRING JSON berisi 3 variasi paket asesmen utuh tersebut.\`;
                }
                if (key === 'validasi_rubrik') {
                    prompt = \`Anda bertindak sebagai ahli evaluasi tingkat SD. Buatkan Rubrik Penilaian HTML (<table>) materi \${d.materi} yang relevan dengan aktivitas pada \${activityContext}. Gunakan class "rubrik-table". 
                INSTRUKSI KHUSUS:
                1. Sertakan bagian identitas (Nama Murid/Kelompok: ....... dan Kelas: .......).
                2. Kriteria penilaian MAKSIMAL 3 SAJA dengan bahasa SANGAT SEDERHANA anak SD.
                3. Label kolom skor cukup tulis "SKOR".
                4. Desain tabel: Lebar 100%, border 1px solid black, TANPA WARNA background (hitam putih saja).
                5. Atur lebar kolom: Kolom No: 5%, Kriteria: 25%, SKOR: 10%, Deskripsi: 60%.
                6. PASTIKAN teks pada Deskripsi menggunakan word-break normal agar huruf terakhir tidak terpisah dari kata.
                RESPON WAJIB HANYA JSON: {"results": ["<table>...</table><p>...</p>"]}\`;
                }
                if (key === 'validasi_lkpd') {
                    prompt = \`Buatkan Lembar Kerja Peserta Didik (LKPD) materi \${d.materi} dalam format TABEL HTML profesional (<table>) yang relevan dengan tugas utama pada \${activityContext}. 
                INSTRUKSI DESAIN UNTUK SD:
                1. Sertakan bagian identitas (Nama Murid/Kelompok: ....... dan Kelas: .......).
                2. Gunakan tabel dengan kolom 'Langkah Kerja' dan 'Hasil Jawaban'.
                3. Gunakan bahasa yang sangat sederhana, instruksional, dan ramah anak kelas \${d.fase_kelas}.
                4. WAJIB Gunakan styling tabel dengan lebar 100%, border-collapse: collapse, table-layout: fixed, word-break: normal, dan overflow-wrap: break-word.
                5. Pada kolom 'Hasil Jawaban', buatlah garis titik-titik (....................) sebagai tempat murid menulis.
                6. PASTIKAN tidak ada huruf yang terpisah dari kata di akhir baris (gunakan word-break: normal).
                RESPON WAJIB HANYA JSON: {"results": ["<table style='width:100%; border-collapse:collapse; margin-top:10px; table-layout:fixed; word-break:normal; overflow-wrap:break-word; border: 1px solid black;'>...</table>"]}\`;
                }
                if (key === 'validasi_evaluasi') {
                    prompt = \`Anda adalah ahli evaluasi pendidikan SD profesional. Buatkan instrumu EVALUASI AKHIR dan KUNCI JAWABAN untuk materi \${d.materi}.
                INSTRUKSI KONTEN:
                1. Soal WAJIB berkorelasi langsung dengan CP: "\${d.cp}" dan TP: "\${d.tp}".
                2. Buat tepat 5 soal uraian pendek dengan bahasa yang sangat mudah dimengerti anak SD.
                3. Berikan ruang titik-titik (..........) di bawah setiap soal.
                4. Buatkan KUNCI JAWABAN lengkap di bagian akhir.
                5. Tambahkan teks disclaimer wajib di akhir kunci: "Jawaban ini bersifat alternatif, kebenaran dapat ditentukan guru berdasarkan hasil kerja murid".
                
                RESPON WAJIB HANYA JSON:
                {
                    "soal": "1. [Pertanyaan]?\\n\\nJawaban: ....................\\n\\n\\n\\n2. [Pertanyaan]?\\n\\nJawaban: ....................",
                    "kunci": "1. [Kunci Jawaban]\\n2. [Kunci Jawaban]\\n\\nJawaban ini bersifat alternatif, kebenaran dapat ditentukan guru berdasarkan hasil kerja murid"
                }\`;
                }
                const results = await callGemini(prompt);
                if (key === 'validasi_asesmen') {
                    window.showAsesmenPicker(results);
                } else if (key === 'validasi_evaluasi') {
                    currentModuleData[key] = JSON.stringify(results);
                    const targetEl = document.getElementById('evaluasi_preview');
                    if (targetEl) { targetEl.innerText = results.soal; targetEl.classList.remove('text-slate-400'); targetEl.classList.add('text-black'); }
                } else {
                    const finalResult = Array.isArray(results) ? results.join('\\n\\n') : (results.results ? results.results.join('\\n\\n') : "");
                    currentModuleData[key] = finalResult;
                    if (key === 'validasi_rubrik') {
                        const rubEl = document.getElementById('rubrik_preview');
                        if (rubEl) { rubEl.innerHTML = finalResult; rubEl.classList.remove('text-slate-400'); rubEl.classList.add('text-black'); }
                    }
                    else if (key === 'validasi_lkpd') {
                        const lkEl = document.getElementById('lkpd_preview');
                        if (lkEl) { lkEl.innerHTML = finalResult; lkEl.classList.remove('text-slate-400'); lkEl.classList.add('text-black'); }
                    }
                    else { const targetEl = document.getElementById(key); if (targetEl) targetEl.value = finalResult; }
                }
                showToast(\`✨ \${context} Berhasil!\`);
            } catch (e) { showToast("❌ Gagal Generate AI"); }
            setAILoading(btnElement, false);
        };
`;

export const htmlPart7 = `
        window.showAsesmenPicker = function (options) {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`<div class="modal-overlay"><div class="tp-modal-content"><h3 class="text-xl font-black text-yellow-500 mb-6 uppercase text-center font-black italic">📊 Pilih Paket Asesmen Relevan</h3><div class="space-y-4">\${options.map((opt, i) => \`<label class="flex items-start gap-4 p-6 rounded-2xl border-2 border-blue-900 bg-slate-900 cursor-pointer hover:bg-blue-900/40 transition-all font-black italic text-justify"><input type="radio" name="asesmen-radio" class="asesmen-selection-radio w-7 h-7 mt-1 !accent-yellow-500" value="\${opt.replace(/"/g, '&quot;')}"><div class="text-sm font-bold text-slate-200 font-black italic" style="line-height: 1.6; white-space: pre-wrap;">\${opt}</div></label>\`).join('')}</div><div class="mt-8 flex gap-4 font-black italic"><button onclick="window.applyAsesmenSelection()" class="flex-1 btn-gold py-5 rounded-2xl shadow-lg uppercase italic hover:bg-yellow-600 font-black italic">✅ Gunakan Paket Ini</button><button onclick="window.closeModal()" class="px-8 bg-slate-900 text-slate-400 font-bold py-5 rounded-2xl italic border border-blue-900">Batal</button></div></div></div>\`;
        };

        window.applyAsesmenSelection = function () {
            const selectedEl = document.querySelector('.asesmen-selection-radio:checked');
            if (!selectedEl) { showToast("⚠️ Pilih salah satu paket!"); return; }
            const finalAsesmen = selectedEl.value;
            currentModuleData.validasi_asesmen = finalAsesmen;
            const prevEl = document.getElementById('asesmen_content_preview');
            if (prevEl) { prevEl.innerHTML = finalAsesmen.trim(); prevEl.classList.remove('text-slate-400'); prevEl.classList.add('text-black'); }
            const areaEl = document.getElementById('validasi_asesmen');
            if (areaEl) areaEl.value = finalAsesmen.trim();
            window.closeModal(); showToast(\`✨ Asesmen Utuh Dipilih!\`);
        };

        window.generateAsesmen = (e) => aiGenericGen('validasi_asesmen', 'Asesmen', e.currentTarget);
        window.generateRubrik = (e) => aiGenericGen('validasi_rubrik', 'Rubrik', e.currentTarget);
        window.generateLKPD = (e) => { if (!currentModuleData.validasi_asesmen) { showToast("⚠️ Silakan generate Asesmen terlebih dahulu!"); return; } aiGenericGen('validasi_lkpd', 'LKPD', e.currentTarget); };
        window.generateEvaluasi = (e) => { if (!currentModuleData.validasi_asesmen) { showToast("⚠️ Silakan generate Asesmen terlebih dahulu!"); return; } aiGenericGen('validasi_evaluasi', 'Evaluasi', e.currentTarget); };

        function stepInformasiUmum() {
            const d = currentModuleData;
            const selectedMapel = d.mapel || "";
            const selectedElemen = d.elemen || "";
            const elemenData = selectedMapel ? CP_DATABASE_FASE_C[selectedMapel]?.elemen : null;
            const topikList = (elemenData && selectedElemen) ? elemenData[selectedElemen]?.topik : [];
            return \`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-black italic">
        <div class="col-span-1 md:col-span-2 bg-blue-950/20 p-5 rounded-3xl shadow-sm animate-fade-in border-l-8 border-blue-900">
            <label class="block text-xs font-black text-blue-400 uppercase mb-2">🏷️ Judul Modul</label>
            <select id="judul_modul" class="select-modern p-4 rounded-2xl font-bold">
                <option value="MODUL AJAR" \${d.judul_modul === 'MODUL AJAR' ? 'selected' : ''}>MODUL AJAR</option>
                <option value="RENCANA PEMBELAJARAN MENDALAM" \${d.judul_modul === 'RENCANA PEMBELAJARAN MENDALAM' ? 'selected' : ''}>RENCANA PEMBELAJARAN MENDALAM</option>
                <option value="RENCANA PELAKSANAAN PEMBELAJARAN" \${d.judul_modul === 'RENCANA PELAKSANAAN PEMBELAJARAN' ? 'selected' : ''}>RENCANA PELAKSANAAN PEMBELAJARAN</option>
            </select>
        </div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black uppercase text-blue-400 mb-1">👤 Penyusun</label><input type="text" id="penyusun" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value="\${d.penyusun || ''}" readonly></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black uppercase text-blue-400 mb-1">🏫 Nama Sekolah</label><input type="text" id="sekolah" class="input-modern p-4 rounded-2xl !bg-slate-900 font-bold" value="\${d.sekolah || ''}" readonly></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-yellow-500 animate-fade-in"><label class="block text-[10px] font-black uppercase text-blue-400 mb-1">📅 Tahun Pelajaran & Semester</label>
            <div class="flex gap-2 italic">
                <select id="tahun_ajar" class="select-modern p-4 rounded-2xl font-bold">
                    <option value="2024/2025" \${d.tahun_ajar === '2024/2025' ? 'selected' : ''}>2024/2025</option>
                    <option value="2025/2026" \${d.tahun_ajar === '2025/2026' ? 'selected' : ''}>2025/2026</option>
                    <option value="2026/2027" \${d.tahun_ajar === '2026/2027' ? 'selected' : ''}>2026/2027</option>
                </select>
                <select id="semester" class="select-modern p-4 rounded-2xl font-bold">
                    <option value="1 (Ganjil)" \${d.semester === '1 (Ganjil)' ? 'selected' : ''}>Ganjil</option>
                    <option value="2 (Genap)" \${d.semester === '2 (Genap)' ? 'selected' : ''}>Genap</option>
                </select>
            </div>
        </div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black text-blue-400 uppercase mb-1">🎯 Fase / Kelas</label><select id="fase_kelas" class="select-modern p-4 rounded-2xl font-bold"><option value="Fase A / Kelas 1" \${d.fase_kelas === 'Fase A / Kelas 1' ? 'selected' : ''}>Fase A / Kelas 1</option><option value="Fase A / Kelas 2" \${d.fase_kelas === 'Fase A / Kelas 2' ? 'selected' : ''}>Fase A / Kelas 2</option></select></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black text-blue-400 uppercase mb-1">📚 Mata Pelajaran</label><select id="mapel" class="select-modern p-4 rounded-2xl font-bold" onchange="window.updateStep0()"><option value="">-- Pilih --</option>\${Object.keys(CP_DATABASE_FASE_C).map(m => \`<option value="\${m}" \${selectedMapel === m ? 'selected' : ''}>\${m}</option>\`).join('')}</select></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black text-blue-400 uppercase mb-1">🧩 Elemen</label><select id="elemen" class="select-modern p-4 rounded-2xl font-bold" onchange="window.updateStep0()" \${!selectedMapel ? 'disabled' : ''}> <option value="">-- Pilih --</option> \${elemenData ? Object.keys(elemenData).map(e => \`<option value="\${e}" \${selectedElemen === e ? 'selected' : ''}>\${e}</option>\`).join('') : ''}</select></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-blue-900 animate-fade-in"><label class="block text-[10px] font-black text-blue-400 uppercase mb-1">📖 Topik Materi</label><select id="materi" class="select-modern p-4 rounded-2xl font-bold" onchange="window.saveInputs()" \${!selectedElemen ? 'disabled' : ''}> <option value="">-- Pilih --</option> \${topikList ? topikList.map(t => \`<option value="\${t.judul}" \${d.materi === t.judul ? 'selected' : ''}>\${t.judul}</option>\`).join('') : ''}</select></div>
        <div class="bg-blue-950/20 p-5 rounded-3xl border-l-8 border-yellow-500 animate-fade-in"><label class="block text-[10px] font-black text-yellow-500 uppercase mb-1">⏳ Alokasi Waktu</label><input type="text" id="alokasi_waktu" class="input-modern p-4 rounded-2xl !bg-slate-900 pointer-events-none" value="\${d.alokasi_waktu}" readonly></div>
        <div class="col-span-1 md:col-span-2 bg-black p-6 rounded-[2.5rem] shadow-sm italic animate-fade-in border-2 border-yellow-500"><label class="block text-sm font-black text-center mb-3 text-yellow-500">⭐ CAPAIAN PEMBELAJARAN (CP)</label><textarea id="cp_preview" class="input-modern p-5 rounded-2xl !bg-slate-950 !text-slate-200 font-bold text-sm italic border-none" rows="4" readonly style="line-height: 1.6;">\${d.cp || 'CP muncul otomatis...'}</textarea></div>
      </div>\`;
        }
`;

export const htmlPart8 = `
        function stepIdentifikasi() {
            const d = currentModuleData;
            const materials = d.mapel && d.elemen && d.materi ? CP_DATABASE_FASE_C[d.mapel]?.elemen?.[d.elemen]?.topik?.find(t => t.judul === d.materi)?.materi || [] : [];
            const manualMaterials = (d.custom_data?.selected_materi_manual || []).map(v => ({ label: v }));
            const customKarakteristik = (d.custom_data?.karakteristik || []).map(v => ({ title: v, icon: "➕" }));
            const fullKarakteristik = [...KARAKTERISTIK_SISWA_LIST, ...customKarakteristik];
            const numProfil = (d.profil_lulusan || []).length;
            return \`<div class="space-y-8 font-black italic animate-fade-in text-white">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-black p-6 border-2 rounded-[2.5rem] border-blue-900 flex flex-col shadow-inner">
                    <h3 class="text-xl font-black mb-6 text-center text-yellow-500 uppercase">📖 Materi Ajar</h3>
                    <div class="grid grid-cols-1 gap-4 overflow-y-auto max-h-[300px] pr-2">
                        \${materials.length > 0 || manualMaterials.length > 0 ? [...materials, ...manualMaterials].map((m, idx) => \`<label class="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all \${(d.selected_materi || []).includes(m.label || m) ? 'border-yellow-500 bg-blue-900 shadow-md scale-105' : 'border-blue-900 bg-slate-900'} cursor-pointer"><input type="checkbox" onchange="window.toggleMateri('\${m.label || m}')" \${(d.selected_materi || []).includes(m.label || m) ? 'checked' : ''} class="w-5 h-5 !accent-yellow-500"> <span class="text-[10px] font-black uppercase text-white">\${m.label || m}</span></label>\`).join('') : \`<div class="p-4 text-center text-xs opacity-50">Lengkapi Langkah 1 dahulu</div>\`}
                    </div>
                    <button onclick="window.openModal('selected_materi_manual')" class="mt-6 w-full py-3 border-2 border-dashed border-yellow-500 rounded-xl font-black text-[10px] uppercase text-yellow-500 hover:bg-blue-900 transition-all shadow-sm">+ TAMBAH MANUAL</button>
                </div>
                <div class="md:col-span-2 bg-black border-2 border-yellow-500 p-6 rounded-[2.5rem] shadow-xl">
                    <div class="flex justify-between items-center mb-6 font-black italic"><h3 class="text-xl font-black text-yellow-500 uppercase">🔍 Karakteristik Materi</h3><button onclick="window.generateKarakteristikMateri()" class="btn-gold px-6 py-2 rounded-xl text-[10px] uppercase shadow-lg border border-blue-900">RonAI Analyze</button></div>
                    <textarea id="relevansi_materi" class="input-modern p-6 !bg-slate-950 !text-slate-200 border-none font-bold text-sm rounded-3xl h-36 italic leading-relaxed" style="line-height: 1.6;" placeholder="Pilih materi di kiri lalu klik RonAI Analyze...">\${d.relevansi_materi || ''}</textarea>
                    <div id="model-rec-card-container"></div>
                </div>
            </div>
            <div class="bg-black p-8 border-2 rounded-[2.5rem] border-blue-900 shadow-sm">
                <h3 class="text-xl font-black text-center text-yellow-500 uppercase mb-8 italic">👦 Karakteristik Murid Fase A</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 font-black italic">
                    \${fullKarakteristik.map((k, i) => { const isS = (d.selected_karakteristik || []).includes(k.title); return \`<label class="flex flex-col gap-1 p-5 rounded-2xl border-2 transition-all \${isS ? 'border-yellow-500 bg-blue-900 shadow-md scale-105' : 'border-blue-900 bg-slate-900'} cursor-pointer hover:border-yellow-500"><div class="flex items-center gap-3"><input type="checkbox" onchange="window.toggleKarakteristik('\${k.title}')" \${isS ? 'checked' : ''} class="w-5 h-5 !accent-yellow-500"> <span class="text-xl">\${k.icon}</span><span class="text-[10px] uppercase text-white font-black">\${k.title}</span></div>\${k.desc ? \`<p class="text-[8px] text-slate-300 leading-tight mt-2 italic">\${k.desc}</p>\` : ''}</label>\`; }).join('')}
                </div>
                <button onclick="window.openModal('karakteristik')" class="mt-8 w-full py-4 border-2 border-dashed border-blue-900 rounded-3xl font-black text-xs uppercase text-blue-400 hover:border-yellow-500 hover:text-yellow-500 transition-all">+ TAMBAH MANUAL</button>
            </div>
            <div class="bg-black p-8 border-4 border-blue-900 rounded-[2.5rem] shadow-2xl">
                <h3 class="text-xl font-black text-center text-yellow-500 uppercase mb-4 italic">🎓 Dimensi Profil Lulusan</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-black italic">
                    \${PROFIL_LULUSAN_DATA.map((p, i) => {
                const isS = (d.profil_lulusan || []).includes(p.title);
                const isDisabled = !isS && numProfil >= 3;
                return \`<label class="flex flex-col gap-3 p-5 rounded-3xl border-2 transition-all \${isS ? 'border-yellow-500 bg-blue-900 shadow-[0_0_15px_rgba(255,215,0,0.2)] scale-105' : 'border-blue-900 bg-slate-900'} \${isDisabled ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-yellow-500'}"><div class="flex justify-between items-center"><span class="text-4xl">\${p.icon}</span><input type="checkbox" onchange="window.toggleArr('profil_lulusan', '\${p.title}')" \${isS ? 'checked' : ''} \${isDisabled ? 'disabled' : ''} class="w-6 h-6 !accent-yellow-500"></div><div class="flex flex-col"><span class="text-xs font-black uppercase mb-1 \${isS ? 'text-yellow-500' : 'text-blue-400'}">\${p.title}</span><span class="text-[10px] font-bold leading-tight text-slate-400 italic">"\${p.desc}"</span></div></label>\`;
            }).join('')}
                </div>
            </div>
        </div>\`;
        }
`;

export const htmlPart9 = `
        function stepDesain() {
            const d = currentModuleData;
            const customMetode = (d.custom_data?.metode || []).map(v => ({ label: v, icon: "➕" }));
            const fullMetode = [...METHODS_WITH_DESC, ...customMetode];
            return \`<div class="space-y-10 font-black italic animate-fade-in text-white">
            <div class="bg-black border-4 border-blue-900 p-10 rounded-[3rem] shadow-2xl">
                <h3 class="text-3xl font-black text-center uppercase mb-10 text-yellow-500 tracking-tighter">⚙️ Desain Pedagogis</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-6">
                        <label class="block text-blue-400 text-xs uppercase mb-2">Pilih Model</label>
                        <select id="model" class="select-modern p-5 rounded-2xl font-black text-white bg-slate-900 border-2 border-blue-900 shadow-md" onchange="window.updateStep3Model(this.value)"><option value="">-- PILIH MODEL --</option>\${MODELS.map(m => \`<option value="\${m}" \${d.model === m ? 'selected' : ''}>\${m}</option>\`).join('')}</select>
                        <div id="sintaks-area-container" class="space-y-4">
                            \${d.model ? \`<div class="p-6 bg-slate-900 border-2 border-blue-900 rounded-3xl shadow-inner animate-fade-in"><h4 class="text-xs font-black uppercase mb-3 text-yellow-500">📌 Alur Sintak:</h4><div class="text-[10px] font-extrabold uppercase leading-relaxed text-blue-400">\${SINTAKS_DATA[d.model].steps.join(" ▶ ")}</div></div>\` : ''}
                        </div>
                    </div>
                    <div class="space-y-6">
                        <label class="block text-blue-400 text-xs uppercase mb-2">Pilih Pendekatan</label>
                        <select id="pendekatan" class="select-modern p-5 rounded-2xl font-black text-white bg-slate-900 border-2 border-blue-900 shadow-md" onchange="window.updateStep3Pendekatan(this.value)"><option value="">-- PILIH PENDEKATAN --</option>\${APPROACHES.map(a => \`<option value="\${a}" \${d.pendekatan === a ? 'selected' : ''}>\${a}</option>\`).join('')}</select>
                        <div id="recommendation-area-container"></div>
                        <div id="metode-rec-area"></div>
                    </div>
                </div>
            </div>
            <div class="bg-black p-8 border-2 border-blue-900 rounded-[2.5rem] shadow-sm">
                <h3 class="text-xl font-black uppercase mb-8 text-center text-yellow-500 tracking-widest">🛠️ Metode Pembelajaran (Maks. 4)</h3>
                <div id="metode-grid-container" class="grid grid-cols-2 md:grid-cols-3 gap-4 font-black italic">
                    \${fullMetode.map((m, i) => {
                const isS = (d.metode || []).includes(m.label);
                const isLimitReached = !isS && (d.metode || []).length >= 4;
                return \`<label data-key="metode" data-val="\${m.label}" class="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all \${isS ? 'border-yellow-500 bg-blue-900 shadow-lg scale-105' : isLimitReached ? 'opacity-30 grayscale pointer-events-none' : 'border-blue-900 bg-slate-900 hover:border-yellow-500'} cursor-pointer"><input type="checkbox" onchange="window.toggleArrStatic('metode', '\${m.label}')" \${isS ? 'checked' : ''} \${isLimitReached ? 'disabled' : ''} class="w-6 h-6 border-2 !accent-yellow-500"> <div class="flex flex-col"><span class="text-xl">\${m.icon || '🛠️'}</span><span class="text-[11px] font-black uppercase text-white">\${m.label}</span></div></label>\`;
            }).join('')}
                </div>
                <button onclick="window.openModal('metode')" class="mt-8 w-full py-4 border-2 border-dashed border-blue-900 rounded-3xl font-black text-xs uppercase text-blue-400 transition-all">+ TAMBAH MANUAL</button>
            </div>
        </div>\`;
        }

        window.renderGridSection = function (title, key, data, color) {
            const d = currentModuleData;
            const customItems = (d.custom_data?.[key] || []).map(v => ({ label: v, icon: "➕" }));
            const fullData = [...data, ...customItems];

            const digitalKeys = ['platform_aplikasi', 'perangkat_digital', 'media_digital'];
            const isCurrentlyDigitalKey = digitalKeys.includes(key);
            const isCurrentlyNonDigitalKey = (key === 'media_non_digital');
            const anyDigitalSelected = digitalKeys.some(k => (d[k] || []).length > 0);
            const anyNonDigitalSelected = (d.media_non_digital || []).length > 0;

            let isSectionLocked = false;
            if (isCurrentlyDigitalKey && anyNonDigitalSelected) isSectionLocked = true;
            if (isCurrentlyNonDigitalKey && anyDigitalSelected) isSectionLocked = true;

            return \`<div class="bg-black p-8 border-2 rounded-[3rem] shadow-sm font-black italic transition-all \${isSectionLocked ? 'opacity-30 pointer-events-none grayscale bg-slate-950' : ''}" style="border-color: #1e3a8a">
            <h3 class="text-xl font-black mb-8 text-center uppercase text-yellow-500 tracking-widest">\${title} \${isSectionLocked ? '<span class="text-[10px] bg-slate-800 px-2 py-1 rounded-lg ml-2">(Terkunci)</span>' : ''}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 font-black italic">
                \${fullData.map((item, i) => {
                const isS = (d[key] || []).includes(item.label || item.title);
                return \`<label data-key="\${key}" data-val="\${item.label || item.title}" class="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all \${isS ? 'bg-blue-900 border-yellow-500 shadow-md scale-105' : 'bg-slate-900 border-blue-900'} cursor-pointer hover:border-yellow-500">
                        <input type="checkbox" onchange="window.toggleArr('\${key}', '\${item.label || item.title}')" \${isS ? 'checked' : ''} class="w-6 h-6 !accent-yellow-500">
                        <div class="flex flex-col">
                            <span class="text-2xl">\${item.icon || '🔹'}</span>
                            <span class="text-[10px] font-black uppercase text-white">\${item.label || item.title}</span>
                        </div>
                    </label>\`;
            }).join('')}
            </div>
            <button onclick="window.openModal('\${key}')" class="mt-8 w-full py-3 border-2 border-dashed rounded-2xl font-black text-xs uppercase text-blue-400 font-black italic border-blue-900 transition-all hover:border-yellow-500 hover:text-yellow-500">+ Tambah Manual</button>
        </div>\`;
        };
`;

export const htmlPart10 = `
        window.toggleArr = function (key, v) {
            if (!currentModuleData[key]) currentModuleData[key] = [];
            const idx = currentModuleData[key].indexOf(v);

            const digitalKeys = ['platform_aplikasi', 'perangkat_digital', 'media_digital'];
            const isDigitalKey = digitalKeys.includes(key);
            const isNonDigitalKey = (key === 'media_non_digital');

            if (idx === -1) {
                if (isDigitalKey) {
                    const hasNonDigital = (currentModuleData.media_non_digital || []).length > 0;
                    if (hasNonDigital) { showToast("⚠️ Hapus Media Nondigital dahulu!"); return; }
                } else if (isNonDigitalKey) {
                    const hasDigital = digitalKeys.some(k => (currentModuleData[k] || []).length > 0);
                    if (hasDigital) { showToast("⚠️ Hapus Media Digital/Aplikasi dahulu!"); return; }
                }
            }

            if (idx > -1) {
                currentModuleData[key].splice(idx, 1);
            } else {
                const limit = (key === 'profil_lulusan') ? 3 : 99;
                if (currentModuleData[key].length < limit) {
                    currentModuleData[key].push(v);
                } else {
                    showToast(\`⚠️ Batas \${limit}!\`);
                    return;
                }
            }

            if (digitalKeys.includes(key) || key === 'media_non_digital') render();
            else {
                const allLabels = document.querySelectorAll(\`[data-key="\${key}"]\`);
                allLabels.forEach(label => {
                    const val = label.getAttribute('data-val');
                    const isSelected = currentModuleData[key].includes(val);
                    if (isSelected) {
                        label.classList.add('bg-blue-900', 'shadow-md', 'scale-105', 'border-yellow-500');
                        label.querySelector('input').checked = true;
                    } else {
                        label.classList.remove('bg-blue-900', 'shadow-md', 'scale-105', 'border-yellow-500');
                        label.querySelector('input').checked = false;
                    }
                });
            }
        };

        function stepMitra() { return \`<div class="space-y-10 font-black italic">\${window.renderGridSection("🤝 Mitra Internal", "mitra_internal", MITRA_INTERNAL_DATA)}\${window.renderGridSection("🌍 Mitra Eksternal", "mitra_eksternal", MITRA_EKSTERNAL_DATA)}</div>\`; }
        function stepLingkungan() { return \`<div class="space-y-10 font-black italic">\${window.renderGridSection("🏘️ Lingkungan Fisik", "lingkungan_fisik", LINGKUNGAN_FISIK)}\${window.renderGridSection("🙌 Budaya Belajar", "budaya_belajar", BUDAYA_BELAJAR)}</div>\`; }
        function stepDigital() { return \`<div class="space-y-12 font-black italic pb-10">\${window.renderGridSection("💻 Aplikasi / Platform", "platform_aplikasi", DIGITAL_PLATFORM)}\${window.renderGridSection("📱 Perangkat Digital", "perangkat_digital", DIGITAL_DEVICE)}\${window.renderGridSection("🎬 Media Digital", "media_digital", DIGITAL_MEDIA)}\${window.renderGridSection("📦 Media Nondigital", "media_non_digital", NON_DIGITAL_MEDIA)}</div>\`; }

        function stepValidasiAktivitas() {
            const d = currentModuleData;
            let previewHTML = '<div class="p-12 text-center text-slate-400 italic font-black">Langkah Pembelajaran belum digenerate. Silakan klik tombol RonAI Generate di atas.</div>';
            try {
                if (d.validasi_langkah) {
                    const lp = JSON.parse(d.validasi_langkah);
                    const penutupText = lp.penutup || lp.akhir || lp.kegiatan_akhir || "-";
                    previewHTML = \`<div class="space-y-8"> 
                    <div class="p-6 bg-slate-900 text-white rounded-2xl border-l-8 border-yellow-500 shadow-lg"><h4 class="uppercase text-xs mb-3 text-yellow-500 font-black">1. Kegiatan Awal (10 menit)</h4><p class="text-sm italic leading-relaxed text-white">\${lp.pendahuluan || "-"}</p></div> 
                    <div class="p-8 bg-black border-2 border-blue-900 rounded-3xl shadow-sm"><h4 class="uppercase text-xs mb-6 text-yellow-500 font-black border-b border-blue-900 pb-2">2. Kegiatan Inti (50 menit)</h4><div class="space-y-6">\${(lp.inti || []).map((s, i) => {
                        const cleanSintaks = (s.sintaks || "-").replace(/^\\d+[\\.\\s:]+/, "");
                        return \`<div class="mb-6 group">
                            <b class="text-blue-400 group-hover:text-yellow-500 transition-colors">Sintak \${i + 1}. \${cleanSintaks}:</b> 
                            <div class="italic text-sm mt-2 text-slate-200 leading-relaxed">\${s.description || s.deskripsi || "-"}</div>
                            \${s.pengalaman_belajar ? \`<div class="mt-4 p-3 bg-blue-900/40 rounded-xl text-[10px] text-yellow-500 border-l-4 border-yellow-500">✨ \${s.pengalaman_belajar}</div>\` : ''}
                            \${s.prinsip_deep ? \`<div class="mt-2 p-3 bg-blue-950 rounded-xl text-[10px] text-blue-300 border-l-4 border-blue-400">💎 \${s.prinsip_deep}</div>\` : ''}
                        </div>\`;
                    }).join('')}</div></div> 
                    <div class="p-6 bg-slate-900 text-white rounded-2xl border-l-8 border-yellow-500 shadow-lg"><h4 class="uppercase text-xs mb-3 text-yellow-500 font-black">3. Kegiatan Akhir (10 menit)</h4><p class="text-sm italic leading-relaxed text-white">\${penutupText}</p></div> 
                </div>\`;
                }
            } catch (e) { }

            const isAssessGenerated = !!d.validasi_asesmen;
            const isRubricGenerated = !!d.validasi_rubrik;
            const isLkpdGenerated = !!d.validasi_lkpd;
            const isEvalGenerated = !!d.validasi_evaluasi;

            let evalContent = "Klik Generate...";
            try {
                if (d.validasi_evaluasi) {
                    const evalObj = JSON.parse(d.validasi_evaluasi);
                    evalContent = evalObj.soal;
                }
            } catch (e) { }

            return \`<div class="space-y-12 pb-10 font-black italic text-white">
            <div class="bg-black border-2 border-blue-900 p-8 rounded-[3rem] shadow-sm animate-fade-in"><div class="flex justify-between items-center mb-6"><label class="text-xl uppercase text-yellow-500 tracking-tighter">🎯 Tujuan Pembelajaran</label><button onclick="window.generateTP()" class="btn-gold px-8 py-2 rounded-xl text-[10px] uppercase shadow-md">RonAI Formulate</button></div><textarea id="tp" rows="4" class="input-modern p-5 bg-slate-950 font-bold text-sm italic rounded-2xl border-none shadow-inner" style="line-height: 1.6;">\${d.tp || ''}</textarea></div>
            <div class="bg-black p-8 rounded-[3rem] shadow-2xl border-4 border-blue-900"><div class="flex justify-between items-center mb-8"><h3 class="text-xl uppercase text-yellow-500 tracking-tighter">📝 Langkah Pembelajaran</h3><button onclick="window.generateLangkahPembelajaran()" class="btn-gold px-8 py-2 rounded-xl text-[10px] uppercase shadow-lg border border-blue-900">RonAI Generate</button></div><div class="max-h-[600px] overflow-y-auto p-2" style="line-height: 1.5;">\${previewHTML}</div></div>
            
            <!-- BERSUSUN KE BAWAH (VERTIKAL) -->
            <div class="flex flex-col gap-10">
                <!-- ASESMEN (Warna Kertas) -->
                <div class="bg-black p-8 rounded-[3rem] border-2 border-blue-900 shadow-sm">
                    <div class="flex justify-between items-center mb-6"><h4 class="uppercase text-xs text-yellow-500 font-black tracking-widest">📊 Asesmen Pembelajaran</h4><button onclick="window.generateAsesmen(event)" class="btn-gold px-6 py-2 rounded-xl text-[10px] uppercase">Generate</button></div>
                    <div id="asesmen_content_preview" class="p-8 bg-white text-black rounded-3xl shadow-inner min-h-[150px] text-sm leading-relaxed whitespace-pre-wrap italic border-4 border-yellow-500/20 \${!isAssessGenerated ? 'text-slate-400' : ''}">\${d.validasi_asesmen ? d.validasi_asesmen.trim() : 'Klik Generate...'}</div>
                    <textarea id="validasi_asesmen" style="display:none;">\${d.validasi_asesmen || ''}</textarea>
                </div>

                <!-- RUBRIK (Warna Kertas) -->
                <div class="bg-black p-8 rounded-[3rem] border-2 border-blue-900 shadow-sm">
                    <div class="flex justify-between items-center mb-6"><h4 class="uppercase text-xs text-yellow-500 font-black tracking-widest">✅ Rubrik Penilaian</h4><button onclick="window.generateRubrik(event)" class="btn-gold px-6 py-2 rounded-xl text-[10px] uppercase">Generate</button></div>
                    <div id="rubrik_preview" class="p-8 bg-white text-black rounded-3xl shadow-inner min-h-[150px] text-sm leading-relaxed overflow-x-auto border-4 border-yellow-500/20 \${!isRubricGenerated ? 'text-slate-400' : ''}">\${d.validasi_rubrik || '<div class="flex items-center justify-center h-full">Klik Generate...</div>'}</div>
                </div>

                <!-- LKPD (Warna Kertas) -->
                <div class="bg-black p-8 rounded-[3rem] border-2 border-blue-900 shadow-sm">
                    <div class="flex justify-between items-center mb-6"><h4 class="uppercase text-xs text-yellow-500 font-black tracking-widest">📑 Lembar Kerja Peserta Didik</h4><button onclick="window.generateLKPD(event)" class="btn-gold px-6 py-2 rounded-xl text-[10px] uppercase">Generate</button></div>
                    <div id="lkpd_preview" class="p-8 bg-white text-black rounded-3xl shadow-inner min-h-[150px] text-sm leading-relaxed overflow-x-auto border-4 border-yellow-500/20 \${!isLkpdGenerated ? 'text-slate-400' : ''}">\${d.validasi_lkpd || '<div class="flex items-center justify-center h-full">Klik Generate...</div>'}</div>
                </div>

                <!-- EVALUASI (Warna Kertas) -->
                <div class="bg-black p-8 rounded-[3rem] border-2 border-blue-900 shadow-sm">
                    <div class="flex justify-between items-center mb-6"><h4 class="uppercase text-xs text-yellow-500 font-black tracking-widest">📝 Soal Evaluasi Akhir</h4><button onclick="window.generateEvaluasi(event)" class="btn-gold px-6 py-2 rounded-xl text-[10px] uppercase">Generate</button></div>
                    <div id="evaluasi_preview" class="p-8 bg-white text-black rounded-3xl shadow-inner min-h-[150px] text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto italic border-4 border-yellow-500/20 \${!isEvalGenerated ? 'text-slate-400' : ''}">\${evalContent}</div>
                </div>
            </div>
        </div>\`;
        }
`;

export const htmlPart11 = `
        function stepReview() {
            const d = currentModuleData;
            const digitalKeys = ['platform_aplikasi', 'perangkat_digital', 'media_digital'];
            const anyDigitalSelected = digitalKeys.some(k => (d[k] || []).length > 0);
            const anyNonDigitalSelected = (d.media_non_digital || []).length > 0;

            const labelPoint6 = anyDigitalSelected ? "6. Pemanfaatan Digital" : "6. Media Pembelajaran";
            let contentPoint6 = "-";

            if (anyDigitalSelected) {
                contentPoint6 = \`
                - Platform/Aplikasi: \${(d.platform_aplikasi || []).join(', ') || '-'}<br>
                - Perangkat Digital: \${(d.perangkat_digital || []).join(', ') || '-'}<br>
                - Media Digital: \${(d.media_digital || []).join(', ') || '-'}
            \`;
            } else if (anyNonDigitalSelected) {
                contentPoint6 = \`Media Pembelajaran: Media yang digunakan \${(d.media_non_digital || []).join(', ')}!\`;
            }

            const row = (label, value, isBoldLabel = false, isPermanent = false) => \`<tr><td class="label" style="line-height: 1.5; font-family: 'Times New Roman', Times, serif; font-weight: \${isBoldLabel ? 'bold' : 'normal'}; width: 200px;">\${label}</td><td class="colon" style="line-height: 1.5; width: 15px;">:</td><td class="value" style="line-height: 1.5; font-family: 'Times New Roman', serif; font-weight: normal; \${isPermanent ? 'user-select: none !important;' : ''}" \${isPermanent ? 'contenteditable="false"' : ''}>\${value}</td></tr>\`;

            const topicMaterialsString = (d.materi || '-') + (d.selected_materi && d.selected_materi.length > 0 ? ' (' + d.selected_materi.join(', ') + ')' : '');

            const internalRoles = (d.mitra_internal || []).map(label => {
                const item = MITRA_INTERNAL_DATA.find(i => i.label === label);
                return \`\${label} (\${item ? item.role : 'pendukung proses belajar'})\`;
            }).join(', ');
            const eksternalRoles = (d.mitra_eksternal || []).map(label => {
                const item = MITRA_EKSTERNAL_DATA.find(i => i.label === label);
                return \`\${label} (\${item ? item.role : 'sumber belajar pendamping murid'})\`;
            }).join(', ');

            const budayaMerged = (d.budaya_belajar || []).length > 0
                ? \`Pada proses pembelajaran ini, budaya belajar yang harus dihadirkan adalah \${d.budaya_belajar.join(', ')} yang melatih peserta didik untuk mengembangkan karakter positif, integritas, dan kedisiplinan dalam setiap tahap aktivitas pembelajaran.\`
                : '-';

            let evaluasiSoalHtml = "-";
            let evaluasiKunciHtml = "";
            try {
                if (d.validasi_evaluasi) {
                    const obj = JSON.parse(d.validasi_evaluasi);
                    evaluasiSoalHtml = obj.soal.replace(/\\n/g, '<br>');
                    evaluasiKunciHtml = obj.kunci.replace(/\\n/g, '<br>');
                }
            } catch (e) { evaluasiSoalHtml = d.validasi_evaluasi ? d.validasi_evaluasi.replace(/\\n/g, '<br>') : "-"; }

            const combinedHtml = \`
            <div class="blok-identitas" style="page-break-inside: avoid; break-inside: avoid; padding-top: 0mm;">
                <div class="doc-main-title">\${d.judul_modul ? d.judul_modul.toUpperCase() : 'MODUL AJAR'}</div>
                <div class="doc-section-title">A. IDENTITAS</div>
                <table class="doc-table" border="0">
                    \${row('Penyusun', d.penyusun || '-', false, true)}
                    \${row('Nama Sekolah', d.sekolah || '-', false, true)}
                    \${row('Tahun Pelajaran', d.tahun_ajar || '-', false, true)}
                    \${row('Fase/Kelas/Smt', (d.fase_kelas || '-') + ' / ' + (d.semester || '-'), false, true)}
                    \${row('Mata Pelajaran', d.mapel || '-')}
                    \${row('Topik/Materi', topicMaterialsString)}
                    \${row('Alokasi Waktu', d.alokasi_waktu || '2 x 35 menit')}
                </table>
            </div>

            <div class="blok-identifikasi" style="page-break-inside: avoid; break-inside: avoid; padding-top: 5mm;">
                <div class="doc-section-title">B. IDENTIFIKASI</div>
                <table class="doc-table" border="0">
                    \${row('1. Karakteristik Materi', d.relevansi_materi || '-', true)}
                    \${row('2. Karakteristik Murid', \`Karakteristik murid Fase A secara umum memiliki karakter \${(d.selected_karakteristik || []).join(', ')} yang membutuhkan perhatian guru untuk memfasilitasi kebutuhan belajar mereka.\`, true)}
                    <tr><td class="label" style="width:200px; font-weight: bold; vertical-align: top;">3. Dimensi Profil Lulusan</td><td class="colon" style="vertical-align: top;">:</td><td class="value"><ul style="margin-left: 20px; list-style-type: disc; padding:0;">\${(d.profil_lulusan || []).map(p => {
                const item = PROFIL_LULUSAN_DATA.find(x => x.title === p);
                return \`<li>\${p}: \${item ? item.desc : '-'}</li>\`;
            }).join('') || '<li>-</li>'}</ul></td></tr>
                </table>
            </div>
            
            <div class="blok-desain-header-capaian" style="page-break-inside: avoid; break-inside: avoid; padding-top: 15mm; display: block; width: 100%; page-break-before: always;">
                <div class="doc-section-title">C. DESAIN PEMBELAJARAN</div>
                <table class="doc-table" border="0" style="width: 100%;">
                    <tr><td class="label" style="width:200px; vertical-align: top; font-weight: bold;">1. Capaian Pembelajaran</td><td class="colon" style="vertical-align: top;">:</td><td class="value" style="text-align: justify;">\${d.cp || '-'}</td></tr>
                    <tr><td class="label" style="vertical-align: top; font-weight: bold;">2. Tujuan Pembelajaran</td><td class="colon" style="vertical-align: top;">:</td><td class="value" style="white-space: pre-line;">\${(d.tp || '-').replace(/\\n/g, '<br>')}</td></tr>
                    <tr><td class="label" style="vertical-align: top; font-weight: bold; width: 200px;">3. Praktik Pedagogis</td><td class="colon" style="vertical-align: top;">:</td><td class="value">
                        <table class="doc-table" style="width:100%;">
                            <tr><td style="width:150px;">Model Pembelajaran</td><td style="width:15px; text-align:center;">:</td><td>\${d.model || '-'}</td></tr>
                            <tr><td>Pendekatan Pembelajaran</td><td style="text-align:center;">:</td><td>\${(d.pendekatan || '-')}</td></tr>
                            <tr><td>Metode Pembelajaran</td><td style="text-align:center;">:</td><td>\${(d.metode || []).join(', ') || '-'}</td></tr>
                        </table>
                    </td></tr>
                    <tr><td class="label" style="vertical-align: top; font-weight: bold; width: 200px;">4. Mitra Pembelajaran</td><td class="colon" style="vertical-align: top;">:</td><td class="value">
                        <table class="doc-table" style="width:100%;">
                            <tr><td style="width:150px;">Mitra Internal</td><td style="width:15px; text-align:center;">:</td><td>\${internalRoles || '-'}</td></tr>
                            <tr><td>Mitra Eksternal</td><td style="text-align:center;">:</td><td>\${eksternalRoles || '-'}</td></tr>
                        </table>
                    </td></tr>
                    <tr><td class="label" style="vertical-align: top; font-weight: bold; width: 200px;">5. Lingkungan belajar</td><td class="colon" style="vertical-align: top;">:</td><td class="value">
                        <table class="doc-table" style="width:100%;">
                            <tr><td style="width:150px;">Lingkungan Fisik</td><td style="width:15px; text-align:center;">:</td><td>\${(d.lingkungan_fisik || []).join(', ') || '-'}</td></tr>
                            <tr><td>Budaya Belajar</td><td style="text-align:center;">:</td><td>\${budayaMerged}</td></tr>
                        </table>
                    </td></tr>
                    \${row(labelPoint6, contentPoint6, true)}
                </table>
            </div>

            <div class="blok-langkah" style="page-break-before: always; padding-top: 10mm;">
                <div class="doc-section-title">D. LANGKAH-LANGKAH PEMBELAJARAN</div>
                <table class="kegiatan-table" border="1">
                    <thead><tr style="background-color: #f2f2f2;"><th width="20%">KEGIATAN</th><th>DESKRIPSI</th><th width="15%">WAKTU</th></tr></thead>
                    <tbody>
                        \${(() => {
                    try {
                        if (d.validasi_langkah) {
                            const lp = JSON.parse(d.validasi_langkah);
                            return \`
                                    <tr><td style="font-weight:bold;text-align:center; vertical-align: middle;">Kegiatan Awal</td><td style="text-align:justify;"><b>Aktivitas:</b> \${lp.pendahuluan || "-"}</td><td style="text-align:center; font-weight:bold; vertical-align: top;">10<br>Menit</td></tr>
                                    \${(lp.inti || []).map((s, i) => {
                                return \`<tr>
                                            <td style="font-weight:bold;text-align:center; vertical-align: middle;">\${i === 0 ? '<b>Kegiatan Inti</b><br>' : ''}Sintak \${i + 1}. \${s.sintaks}</td>
                                            <td style="text-align:justify;">
                                                <b>Aktivitas:</b> \${s.description || s.deskripsi || "-"}
                                                \${s.pengalaman_belajar ? \`<br><br><div style="font-size: 10pt; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 5px; border-radius: 4px;">✨ <b>\${s.pengalaman_belajar}</b></div>\` : ''}
                                                \${s.prinsip_deep ? \`<div style="font-size: 10pt; background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 5px; border-radius: 4px; margin-top: 3px;">💎 <b>\${s.prinsip_deep}</b></div>\` : ''}
                                            </td>
                                            \${i === 0 ? \`<td rowspan="\${lp.inti.length}" style="text-align:center;vertical-align:top; font-weight:bold;">50<br>Menit</td>\` : ''}
                                        </tr>\`;
                            }).join('')}
                                    <tr><td style="font-weight:bold;text-align:center; vertical-align: middle;">Kegiatan Akhir</td><td style="text-align:justify;"><b>Aktivitas:</b> \${lp.penutup || "-"}</td><td style="text-align:center; font-weight:bold; vertical-align: top;">10<br>Menit</td></tr>\`;
                        }
                    } catch (e) { }
                    return \`<tr><td colspan="3">\${d.validasi_langkah || '-'}</td></tr>\`;
                })()}
                    </tbody>
                </table>
            </div>

            <div class="asesmen-signature-wrapper" style="page-break-before: always; page-break-inside: avoid; break-inside: avoid;">
                <div class="blok-asesmen" style="padding-top: 10mm;">
                    <div class="doc-section-title">E. ASESMEN PEMBELAJARAN</div>
                    <div class="asesmen-container" style="text-align: justify !important; line-height: 1.5 !important; font-family: 'Times New Roman', serif; font-size: 12pt; white-space: pre-line !important; width: 100%; display: block; padding: 0 !important; margin: 0 !important;">
                        \${d.validasi_asesmen ? d.validasi_asesmen.trim() : '-'}
                    </div>
                </div>

                <div class="signature-block" contenteditable="false" style="width: 100%; font-family: 'Times New Roman', serif; padding-top: 15mm; display: block; overflow: hidden; clear: both; user-select: none !important;">
                    <div style="float: left; width: 50%; text-align: left; font-weight: normal;">
                        Mengetahui,<br>Kepala Sekolah<br><br><br><br><br>
                        <u><b>\${d.kepala_sekolah_nama || '................................'}</b></u><br>
                        NIP. \${d.kepala_sekolah_nip || '................................'}
                    </div>
                    <div style="float: right; width: 50%; display: flex; flex-direction: column; align-items: flex-end; font-weight: normal;">
                        <div style="display: inline-block; text-align: left;">
                            <div style="text-align: center; width: 100%;">
                                \${d.konfirmasi_tempat || '....'}, \${d.konfirmasi_tanggal || '..........'}<br>
                                Penyusun
                            </div>
                            <br><br><br><br>
                            <u><b><span>\${d.penyusun || ''}</span></b></u><br>
                            NIP. \${d.penyusun_nip || '................................'}
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            </div>
            
            <div class="blok-rubrik" style="page-break-before: always; padding-top: 10mm;">
                <div class="doc-sub-section">I. RUBRIK PENILAIAN</div>
                <div class="rubrik-container" style="line-height: 1.5; font-family: 'Times New Roman', serif; font-size: 12pt; width: 100%; word-break: normal !important; overflow-wrap: anywhere !important; padding: 0 !important; margin: 0 !important;">
                    \${d.validasi_rubrik || '-'}
                </div>
            </div>

            <div class="blok-lkpd" style="page-break-before: always; padding-top: 10mm;">
                <div class="doc-sub-section">II. LEMBAR KERJA PESERTA DIDIK</div>
                <div class="lkpd-container" style="line-height: 1.5; text-align: left; font-family: 'Times New Roman', serif; font-size: 12pt; width: 100%; word-break: normal !important; overflow-wrap: break-word !important; padding: 0 !important; margin: 0 !important;">
                     <div style="max-width: 100%; overflow: hidden;">
                        \${(d.validasi_lkpd || '-')}
                     </div>
                </div>
            </div>

            <div class="blok-evaluasi" style="page-break-before: always; padding-top: 10mm;">
                <div class="doc-sub-section">III. SOAL EVALUASI</div>
                <div class="evaluasi-container" style="text-align: justify; line-height: 1.8; font-family: 'Times New Roman', serif; font-size: 12pt;">
                    \${evaluasiSoalHtml}
                </div>
            </div>

            \${evaluasiKunciHtml ? \`
            <div class="blok-kunci-jawaban" style="page-break-before: always; padding-top: 10mm;">
                <div class="doc-sub-section">IV. KUNCI JAWABAN EVALUASI</div>
                <div class="evaluasi-kunci-container" style="text-align: justify; line-height: 1.8; font-family: 'Times New Roman', serif; font-size: 12pt;">
                    \${evaluasiKunciHtml}
                </div>
            </div>\` : ''}
        \`;
            return \`<div class="a4-paper" style="padding-top: 1cm !important;" contenteditable="true" spellcheck="false" title="Klik teks untuk mengedit">\${combinedHtml}</div>\`;
        }

        window.toggleKarakteristik = function (v) { window.saveInputs(); if (!currentModuleData.selected_karakteristik) currentModuleData.selected_karakteristik = []; const idx = currentModuleData.selected_karakteristik.indexOf(v); if (idx > -1) currentModuleData.selected_karakteristik.splice(idx, 1); else { if (currentModuleData.selected_karakteristik.length < 4) currentModuleData.selected_karakteristik.push(v); else showToast("⚠️ Maksimal 4!"); } render(); };
        window.toggleMateri = function (v) { window.saveInputs(); if (!currentModuleData.selected_materi) currentModuleData.selected_materi = []; const idx = currentModuleData.selected_materi.indexOf(v); if (idx > -1) currentModuleData.selected_materi.splice(idx, 1); else { if (currentModuleData.selected_materi.length < 2) currentModuleData.selected_materi.push(v); else showToast("⚠️ Maksimal 2!"); } render(); };
        window.openModal = function (key) { window.saveInputs(); const modal = document.getElementById('modal-container'); modal.innerHTML = \`<div class="modal-overlay"><div class="modal-content font-black italic !bg-black !text-white border-yellow-500"><h3 class="text-sm font-black text-yellow-500 mb-6 text-center uppercase">Input Manual</h3><input type="text" id="manual-input-val" class="input-modern p-4 rounded-xl mb-8 text-center text-sm font-bold !bg-slate-900 !text-white !border-blue-900" autofocus placeholder="Ketik di sini..."><div class="flex flex-col gap-3"><button onclick="window.processManualInput('\${key}')" class="w-full btn-gold py-4 rounded-xl shadow-lg uppercase">Simpan Data</button><button onclick="window.closeModal()" class="w-full bg-slate-900 text-slate-400 font-bold py-2 rounded-xl text-[10px] uppercase">Batalkan</button></div></div></div>\`; };

        window.processManualInput = function (key) {
            const val = document.getElementById('manual-input-val').value.trim();
            if (val) {
                if (!currentModuleData.custom_data) currentModuleData.custom_data = {};
                if (!currentModuleData.custom_data[key]) currentModuleData.custom_data[key] = [];
                currentModuleData.custom_data[key].push(val);
                const targetKey = (key === 'karakteristik') ? 'selected_karakteristik' : (key === 'selected_materi_manual' ? 'selected_materi' : key);
                if (!currentModuleData[targetKey]) currentModuleData[targetKey] = [];
                const limit = (targetKey === 'selected_materi') ? 2 : 4;
                if (currentModuleData[targetKey].length < limit) currentModuleData[targetKey].push(val);
                closeModal(); render(); showToast("✅ Berhasil!");
            }
        };

        window.closeModal = function () { document.getElementById('modal-container').innerHTML = ''; };
        function showToast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerText = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }

        window.downloadPDF = function () {
            const element = document.getElementById('capture-area');
            const style = document.createElement('style');
            style.innerHTML = \`
            * { font-family: 'Times New Roman', Times, serif !important; font-size: 12pt !important; line-height: 1.5 !important; box-sizing: border-box !important; color: black !important; } 
            .a4-paper { width: 210mm !important; margin: 0 !important; padding: 1cm 2.54cm 2.54cm 2.54cm !important; box-shadow: none !important; border: none !important; background: white !important; }
            table { table-layout: fixed !important; width: 100% !important; border-collapse: collapse !important; border: 1px solid black !important; word-wrap: break-word !important; }
            tr { page-break-inside: avoid !important; break-inside: avoid !important; }
            thead { display: table-header-group !important; }
            td, th { border: 1px solid black !important; word-wrap: break-word !important; padding: 5px !important; word-break: normal !important; overflow-wrap: break-word !important; }
            .rubrik-table, .rubrik-table td, .rubrik-table th { table-layout: fixed !important; word-break: normal !important; overflow-wrap: break-word !important; border: 1px solid black !important; background: none !important; }
            .doc-table, .doc-table td { border: none !important; }
            .signature-block { break-inside: avoid !important; margin-top: 15mm !important; }
            .blok-desain-header-capaian { page-break-before: always !important; }
            .asesmen-signature-wrapper { page-break-inside: avoid !important; break-inside: avoid !important; }
            .asesmen-container { text-align: justify !important; line-height: 1.5 !important; white-space: pre-line !important; }
            .lkpd-container table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; border: 1px solid black !important; word-break: normal !important; overflow-wrap: break-word !important; }
            .blok-evaluasi { page-break-before: always !important; }
            .blok-kunci-jawaban { page-break-before: always !important; }
        \`;
            element.appendChild(style);
            html2pdf().set({
                margin: [10, 0, 15, 0], filename: \`Modul_Ajar_\${currentModuleData.materi || 'Generated'}.pdf\`,
                html2canvas: { scale: 3 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(element).save().then(() => { style.remove(); });
        };

        window.downloadWord = function () {
            const content = document.getElementById('capture-area').innerHTML;
            const blob = new Blob(['\\ufeff', content], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = \`\${currentModuleData.judul_modul || 'Modul_Ajar'}.doc\`; link.click();
        };

        window.saveFinal = async function () { await dataSdk.create(currentModuleData); showToast("💾 Simpan di Arsip!"); };

        window.onload = function () {
            currentModuleData.sekolah = window.localStorage.getItem('kosp_nama_sekolah') || '';
            currentModuleData.kepala_sekolah_nama = window.localStorage.getItem('kosp_kepala_sekolah') || '';
            currentModuleData.kepala_sekolah_nip = window.localStorage.getItem('kosp_nip_kepala') || '';
            currentModuleData.penyusun = window.localStorage.getItem('kosp_nama_guru') || '';
            currentModuleData.penyusun_nip = window.localStorage.getItem('kosp_nip_guru') || '';
            navigateTo('home');
        };
    </script>
`;
