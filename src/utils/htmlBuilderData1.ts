export const htmlPart1 = `<!doctype html>
<html lang="id" class="h-full">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RonAI Master Generator - Modul Ajar Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            height: 100%;
            margin: 0;
            overflow: hidden;
            background-color: #000000;
        }

        #app {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: auto;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #000000;
        }

        ::-webkit-scrollbar-thumb {
            background: #FFD700;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #eab308;
        }

        /* Elegant Color Palette - Black, Blue, Gold */
        .gradient-bg-primary {
            background: linear-gradient(135deg, #000000 0%, #1e3a8a 100%);
        }

        .gold-text {
            color: #FFD700;
        }

        .gold-border {
            border-color: #FFD700;
        }

        .gold-bg {
            background-color: #FFD700;
        }

        .input-modern,
        .select-modern,
        textarea {
            border: 2px solid #1e3a8a;
            transition: all 0.2s;
            outline: none;
            width: 100%;
            line-height: 1.5;
            background: #0f172a;
            color: white;
        }

        .input-modern:focus,
        .select-modern:focus,
        textarea:focus {
            border-color: #FFD700;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
        }

        .btn-primary {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            transition: all 0.2s;
            cursor: pointer;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.4);
            border-color: #FFD700;
        }

        .btn-gold {
            background: #FFD700;
            color: #000000;
            font-weight: 800;
            transition: all 0.2s;
        }

        .btn-gold:hover {
            background: #facc15;
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .progress-bar {
            height: 10px;
            background: #1e293b;
            border-radius: 99px;
            overflow: hidden;
            border: 1px solid #1e3a8a;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #facc15);
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #1e3a8a;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            border-left: 6px solid #FFD700;
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 5000;
            font-weight: 600;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }

            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
        }

        .modal-content {
            background: #0f172a;
            padding: 2rem;
            border-radius: 1.5rem;
            width: 320px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 3px solid #FFD700;
            color: white;
            animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .tp-modal-content {
            background: #000000;
            color: white;
            padding: 2.5rem;
            border-radius: 2rem;
            width: 90%;
            max-width: 850px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            border: 4px solid #FFD700;
            animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalIn {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* CSS Dokumen Hasil Generate (Review Area) - LOCKED OUTPUT */
        .a4-paper {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 2.54cm;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            text-align: justify;
            outline: none;
        }

        .doc-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            border: none;
        }

        .doc-table td {
            vertical-align: top;
            padding: 4px 0;
            border: none;
            line-height: 1.5;
            font-family: 'Times New Roman', serif;
        }

        .doc-table td.label {
            width: 30%;
            font-weight: normal;
        }

        .doc-table td.colon {
            width: 15px;
            text-align: center;
        }

        .doc-table td.value {
            width: auto;
            font-weight: normal;
        }

        .kegiatan-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 12pt;
            font-family: 'Times New Roman', Times, serif;
            border: 1px solid #000;
            table-layout: fixed;
        }

        .kegiatan-table th,
        .kegiatan-table td {
            border: 1px solid #000;
            padding: 10px;
            text-align: justify;
            vertical-align: top;
            line-height: 1.5;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .kegiatan-table th {
            background: #f2f2f2;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            color: black !important;
        }

        .doc-section-title {
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 24pt;
            margin-bottom: 12pt;
            font-size: 14pt;
            display: block;
            line-height: 1.5;
            clear: both;
        }

        .doc-sub-section {
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
            line-height: 1.5;
            display: block;
        }

        .doc-main-title {
            text-align: center;
            font-weight: bold;
            font-size: 16pt;
            margin-bottom: 30pt;
            text-transform: uppercase;
            line-height: 1.5;
        }

        .rubrik-table {
            width: 100% !important;
            border-collapse: collapse;
            margin-top: 10px;
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            color: black;
            line-height: 1.5;
            table-layout: fixed !important;
            border: 1px solid black;
        }

        .rubrik-table th,
        .rubrik-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
            line-height: 1.5;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: normal !important;
            color: black !important;
        }

        .rubrik-table th {
            background-color: transparent !important;
            font-weight: bold;
            text-transform: uppercase;
        }

        .loader {
            border: 3px solid #1e3a8a;
            border-top: 3px solid #FFD700;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        @media print {
            @page {
                size: A4;
                margin: 2.54cm;
            }

            body {
                background: white;
                font-family: 'Times New Roman', Times, serif;
            }

            #app {
                overflow: visible;
                height: auto;
            }

            .no-print,
            .btn-primary,
            .progress-bar,
            .toast,
            .builder-ui {
                display: none !important;
            }

            .a4-paper {
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: none;
            }
        }
    </style>
</head>

<body class="h-full">
    <div id="app" class="w-full h-full"></div>
    <div id="modal-container"></div>
    <script>
        // --- STORAGE ENGINE ---
        const LocalDataSdk = {
            init: async (handler) => {
                try {
                    const data = JSON.parse(localStorage.getItem('ronai_master_v50_db') || '[]');
                    handler.onDataChanged(data);
                    return { isOk: true };
                } catch (e) { handler.onDataChanged([]); return { isOk: false }; }
            },
            create: async (data) => {
                try {
                    const modules = JSON.parse(localStorage.getItem('ronai_master_v50_db') || '[]');
                    data.__backendId = 'modul_' + Date.now();
                    modules.push(data);
                    localStorage.setItem('ronai_master_v50_db', JSON.stringify(modules));
                    return { isOk: true };
                } catch (e) { return { isOk: false }; }
            }
        };
        const dataSdk = LocalDataSdk;

        // Custom config set by Omega Teacher app before loading the iframe
        const omegaTargetConfig = window.omegaRPMConfig || null;
        let apiKey = omegaTargetConfig?.apiKey || "";
        
        async function callGemini(prompt) {
            const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            };
            for (let i = 0; i < 5; i++) {
                try {
                    const res = await fetch(url, { method: "POST", body: JSON.stringify(payload) });
                    if (!res.ok) throw new Error("Retry");
                    const json = await res.json();
                    const rawText = json.candidates[0].content.parts[0].text;
                    const firstBrace = rawText.indexOf('{');
                    const lastBrace = rawText.lastIndexOf('}');
                    if (firstBrace === -1 || lastBrace === -1) {
                        if (rawText.includes('[')) return JSON.parse(rawText.substring(rawText.indexOf('['), rawText.lastIndexOf(']') + 1));
                        throw new Error("Format Salah");
                    }
                    return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
                } catch (e) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                }
            }
            throw new Error("Gagal menghubungi AI.");
        }
`;

export const htmlPart3 = `
        const SINTAKS_DATA = {
            "Problem Based Learning (PBL)": { steps: ["Orientasi Masalah", "Mengorganisasi Siswa", "Membimbing Penyelidikan", "Mengembangkan Karya", "Analisis & Evaluasi"] },
            "Project Based Learning (PjBL)": { steps: ["Pertanyaan Mendasar", "Desain Proyek", "Menyusun Jadwal", "Memonitor Kemajuan", "Menguji Hasil", "Evaluasi Pengalaman"] },
            "Discovery Learning": { steps: ["Rangsangan", "Pernyataan Masalah", "Pengumpulan Data", "Pengolahan Data", "Pembuktian", "Menarik Kesimpulan"] },
            "Inquiry Learning": { steps: ["Orientasi", "Rumusan Masalah", "Hipotesis", "Eksplorasi Data", "Uji Hipotesis", "Kesimpulan"] },
            "Problem Solving": { steps: ["Identifikasi Masalah", "Alternatif Solusi", "Pemilihan Solusi", "Uji Coba", "Evaluasi"] },
            "Cooperative Learning": { steps: ["Tujuan & Motivasi", "Penyajian Informasi", "Kelompok Belajar", "Bimbingan Kerja", "Evaluasi", "Penghargaan"] }
        };

        const MODELS = ["Problem Based Learning (PBL)", "Discovery Learning", "Inquiry Learning", "Project Based Learning (PjBL)", "Problem Solving", "Cooperative Learning"];
        const APPROACHES = ["Pembelajaran Mendalam (Deep Learning)", "Saintifik (Scientific)", "Kontekstual (CTL)", "Berorientasi pada Murid (Student-Centered)", "Diferensiasi (Differentiated Instruction)", "Konstruktivisme"];
        const KARAKTERISTIK_SISWA_LIST = [
            { title: "Berpikir Konkrit", icon: "🧩", desc: "Membutuhkan alat peraga nyata untuk memahami konsep belajar." },
            { title: "Rentang Konsentrasi Pendek", icon: "⏳", desc: "Fokus belajar terbatas sekitar 10-15 menit per aktivitas." },
            { title: "Suka Bergerak dan Bermain", icon: "🏃", desc: "Belajar lebih efektif melalui aktivitas fisik dan permainan." },
            { title: "Emosi Masih Labil", icon: "🎭", desc: "Membutuhkan bimbingan untuk mengelola perasaan dan interaksi." },
            { title: "Motorik Halus Belum Matang", icon: "✍️", desc: "Sedang dalam proses melatih koordinasi tangan untuk menulis." },
            { title: "Motivasi Belajar Eksternal", icon: "🌟", desc: "Semangat belajar dipicu oleh pujian, hadiah, atau dukungan guru." }
        ];

        const PROFIL_LULUSAN_DATA = [
            { title: "Keimanan dan Ketakwaan", icon: "🙏", desc: "Berakhlak mulia kepada Tuhan YME dan sesama manusia." },
            { title: "Kewargaan", icon: "🇮🇩", desc: "Cinta tanah air dan sadar akan hak serta kewajiban negara." },
            { title: "Penalaran Kritis", icon: "🧠", desc: "Mampu menganalisis informasi secara objektif dan logis." },
            { title: "Kreativitas", icon: "💡", desc: "Menghasilkan gagasan orisinal dan karya yang bermakna." },
            { title: "Kolaborasi", icon: "🤝", desc: "Bekerja sama secara efektif untuk mencapai tujuan bersama." },
            { title: "Kemandirian", icon: "👤", desc: "Bertanggung jawab penuh atas proses and hasil belajarnya." },
            { title: "Kesehatan", icon: "💪", desc: "Menjaga keseimbangan jasmani dan rohani secara optimal." },
            { title: "Komunikasi", icon: "🤝", desc: "Menyampaikan ide dan perasaan secara santun dan jelas." }
        ];

        const MITRA_INTERNAL_DATA = [
            { label: "Guru Kelas", icon: "👨‍🏫", role: "perancang utama dan fasilitator pembelajaran" },
            { label: "Guru Mapel", icon: "👩‍🔬", role: "pemberi materi spesifik dan kolaborator instruksional" },
            { label: "Kepala Sekolah", icon: "🏫", role: "pembina kurikulum dan penyedia sarana prasarana" },
            { label: "Peserta Didik", icon: "🎒", role: "subjek aktif yang mengkonstruksi pengetahuan" },
            { label: "Penjaga Sekolah", icon: "🛡️", role: "penjamin keamanan dan kenyamanan lingkungan belajar" },
            { label: "Tenaga Kebersihan", icon: "🧹", role: "penjaga kebersihan dan kesehatan lingkungan belajar" },
            { label: "Teman Sebaya", icon: "🤝", role: "partner diskusi dan tutor sebaya dalam belajar" },
            { label: "Tendik", icon: "🏢", role: "pendukung administrasi proses pendidikan" },
            { label: "Perpustakaan", icon: "📚", role: "penyedia referensi dan literasi pendukung materi" }
        ];
        const MITRA_EKSTERNAL_DATA = [
            { label: "Orang Tua", icon: "👨‍👩", role: "pendamping belajar di rumah dan partner pembentukan karakter" },
            { label: "Masyarakat", icon: "🏘️", role: "sumber belajar kontekstual dan laboratorium sosial" },
            { label: "Puskesmas", icon: "🏥", role: "penyedia informasi kesehatan dan kebugaran murid" },
            { label: "Tokoh Masyarakat/Adat", icon: "👨‍💼", role: "narasumber kearifan lokal dan budaya daerah" },
            { label: "Perpustakaan Daerah", icon: "🏛️", role: "perluasan akses literasi di luar sekolah" },
            { label: "Praktisi Ahli", icon: "📋", role: "narasumber ahli yang memberikan wawasan dunia nyata" },
            { label: "Pengawas", icon: "🧐", role: "pendamping kualitas dan penjamin standar mutu pendidikan" },
            { label: "Aparat Desa", icon: "🏢", role: "pendukung keamanan dan integrasi sekolah dengan wilayah" },
            { label: "Narasumber", icon: "🗣️", role: "pakar tamu yang memperkaya pemahaman materi" }
        ];
        const METHODS_WITH_DESC = [
            { label: "Metode Bermain", icon: "🎮" },
            { label: "Metode Demonstrasi", icon: "👁️" },
            { label: "Metode Cerita", icon: "📖" },
            { label: "Metode Bernyanyi dan Bergerak", icon: "🎶" },
            { label: "Metode Praktik Langsung", icon: "🛠️" },
            { label: "Tanya Jawab Sederhana", icon: "❓" }
        ];
        const BUDAYA_BELAJAR = [{ label: "Budaya Disiplin", icon: "⏱️" }, { label: "Saling Menghargai", icon: "🙏" }, { label: "Aktif Bertanya", icon: "🙋‍♂️" }, { label: "Kerja Sama", icon: "👥" }, { label: "Refleksi Diri", icon: "🧘" }, { label: "Jujur & Tanggung Jawab", icon: "✅" }];
        const LINGKUNGAN_FISIK = [{ label: "Ruang Kelas", icon: "🏫" }, { label: "Halaman Sekolah", icon: "🌳" }, { label: "Lapangan Sekolah", icon: "⚽" }, { label: "Laboratorium", icon: "🧪" }, { label: "Ruang Seni", icon: "🎨" }, { label: "Kebun Sekolah", icon: "🌿" }];
        const NON_DIGITAL_MEDIA = [{ label: "Buku Teks / LKS", icon: "📚" }, { label: "Alat Peraga Konkret", icon: "🧱" }, { label: "Papan Tulis & Spidol", icon: "✍️" }, { label: "Gambar / Poster Cetak", icon: "🖼️" }, { label: "Flashcards / Kartu", icon: "🃏" }, { label: "Lingkungan Sekitar", icon: "🌳" }];
        const DIGITAL_PLATFORM = [{ label: "Quizizz / Kahoot", icon: "🎮" }, { label: "Google Workspace", icon: "☁️" }, { label: "Canva Pendidikan", icon: "🎨" }, { label: "YouTube Eduasi", icon: "📺" }, { label: "Zoom / G-Meet", icon: "📹" }, { label: "WhatsApp Group", icon: "💬" }];
        const DIGITAL_DEVICE = [{ label: "Laptop / Komputer", icon: "💻" }, { label: "Smartphone / Tablet", icon: "📱" }, { label: "LCD Proyektor", icon: "📽️" }, { label: "Speaker Aktif", icon: "🔊" }, { label: "Jaringan Internet", icon: "🌐" }, { label: "Papan Tulis Digital", icon: "🖊️" }];
        const DIGITAL_MEDIA = [{ label: "Video Pembelajaran", icon: "🎞️" }, { label: "Slide Presentasi", icon: "📽️" }, { label: "E-Book / Modul PDF", icon: "📄" }, { label: "Game Eduasi", icon: "🧩" }, { label: "Infografis Digital", icon: "🖼️" }, { label: "Podcast / Audio", icon: "🎙️" }];

        let currentModuleData = { custom_data: {} };
        let isProcessing = false;

        window.saveInputs = function () {
            const inputs = document.querySelectorAll('input[type="text"], textarea, select');
            inputs.forEach(i => { if (i.id && i.id !== 'cp_preview') currentModuleData[i.id] = i.value; });
        }

        function getRekomendasiPendekatan() {
            const mapel = (currentModuleData.mapel || "").toLowerCase();
            if (mapel.includes("matematika")) return { pendekatan: "Saintifik (Scientific)", alasan: "Membantu anak memahami konsep angka melalui pengamatan benda nyata secara logis." };
            if (mapel.includes("bahasa") || mapel.includes("pancasila")) return { pendekatan: "Kontekstual (CTL)", alasan: "Mengaitkan materi dengan pengalaman nyata anak di rumah dan lingkungan sekitar." };
            return { pendekatan: "Berorientasi pada Murid (Student-Centered)", alasan: "Sesuai untuk kelas rendah agar anak aktif terlibat dalam aktivitas fisik saat belajar." };
        }

        function getRekomendasiMetode() {
            const p = currentModuleData.pendekatan;
            if (!p) return null;
            const map = {
                "Saintifik (Scientific)": ["Metode Praktik Langsung", "Metode Demonstrasi", "Tanya Jawab Sederhana"],
                "Kontekstual (CTL)": ["Metode Cerita", "Metode Bermain", "Metode Praktik Langsung"],
                "Berorientasi pada Murid (Student-Centered)": ["Metode Bermain", "Metode Bernyanyi dan Bergerak", "Tanya Jawab Sederhana"],
                "Diferensiasi (Differentiated Instruction)": ["Metode Praktik Langsung", "Metode Bermain", "Metode Demonstrasi"],
                "Konstruktivisme": ["Metode Praktik Langsung", "Metode Cerita", "Tanya Jawab Sederhana"]
            };
            return map[p] || ["Metode Bermain", "Metode Cerita", "Tanya Jawab Sederhana"];
        }

        function navigateTo(page) {
            if (page === 'create') {
                currentStep = 0;
                // Omega Teacher dynamic values integration via omegaTargetConfig
                currentModuleData = { 
                    judul_modul: 'MODUL AJAR', 
                    penyusun: omegaTargetConfig?.namaGuru || 'Martha Fallo, S.Pd', 
                    sekolah: omegaTargetConfig?.namaSekolah || 'SD Negeri Nifuboke', 
                    tahun_ajar: omegaTargetConfig?.tahunAjaran || '2024/2025', 
                    fase_kelas: 'Fase A / Kelas 1', 
                    semester: '1 (Ganjil)', 
                    mapel: '', 
                    elemen: '', 
                    materi: '', 
                    alokasi_waktu: '2 x 35 Menit (1 kali pertemuan)', 
                    cp: '', 
                    tp: '', 
                    pendekatan: '', 
                    model: '', 
                    metode: [], 
                    profil_lulusan: [], 
                    mitra_internal: [], 
                    mitra_eksternal: [], 
                    lingkungan_fisik: [], 
                    budaya_belajar: [], 
                    media_non_digital: [], 
                    platform_aplikasi: [], 
                    perangkat_digital: [], 
                    media_digital: [], 
                    selected_materi: [], 
                    selected_karakteristik: [], 
                    validasi_langkah: '', 
                    validasi_asesmen: '', 
                    validasi_lkpd: '', 
                    validasi_rubrik: '', 
                    validasi_evaluasi: '', 
                    relevansi_materi: '', 
                    custom_data: { karakteristik: [], metode: [], mitra_internal: [], mitra_eksternal: [], lingkungan_fisik: [], budaya_belajar: [], media_non_digital: [], platform_aplikasi: [], perangkat_digital: [], media_digital: [], selected_materi_manual: [] }, 
                    history: {}, 
                    history_idx: {},
                    kepala_sekolah_nama: omegaTargetConfig?.kepalaSekolah || '',
                    kepala_sekolah_nip: omegaTargetConfig?.nipKepala || '',
                    penyusun_nip: omegaTargetConfig?.nipGuru || '',
                    konfirmasi_tempat: omegaTargetConfig?.tempatPenyusunan || '',
                    konfirmasi_tanggal: omegaTargetConfig?.tanggalPenyusunan || ''
                };
            } else if (page === 'archive') currentStep = -2; else if (page === 'contact') currentStep = -3; else currentStep = -1;
            render();
        }
        window.navigateTo = navigateTo;

        window.updateStep0 = function () {
            window.saveInputs();
            currentModuleData.selected_materi = [];
            const mapel = currentModuleData.mapel;
            const elemen = currentModuleData.elemen;

            if (mapel && elemen && CP_DATABASE_FASE_C[mapel]?.elemen?.[elemen]) {
                currentModuleData.cp = CP_DATABASE_FASE_C[mapel].elemen[elemen].cp;
            } else {
                currentModuleData.cp = '';
            }

            const elemenSelect = document.getElementById('elemen');
            if (elemenSelect) {
                const elemenData = CP_DATABASE_FASE_C[mapel]?.elemen;
                let optElemen = '<option value="">-- Pilih --</option>';
                if (elemenData) {
                    optElemen += Object.keys(elemenData).map(e => \`<option value="\${e}" \${elemen === e ? 'selected' : ''}>\${e}</option>\`).join('');
                }
                elemenSelect.innerHTML = optElemen;
                elemenSelect.disabled = !mapel;
            }

            const materiSelect = document.getElementById('materi');
            if (materiSelect) {
                const topikList = (CP_DATABASE_FASE_C[mapel]?.elemen && elemen) ? CP_DATABASE_FASE_C[mapel].elemen[elemen]?.topik : [];
                let optMateri = '<option value="">-- Pilih --</option>';
                if (topikList) {
                    optMateri += topikList.map(t => \`<option value="\${t.judul}" \${currentModuleData.materi === t.judul ? 'selected' : ''}>\${t.judul}</option>\`).join('');
                }
                materiSelect.innerHTML = optMateri;
                materiSelect.disabled = !elemen;
            }

            const cpTextArea = document.getElementById('cp_preview');
            if (cpTextArea) {
                cpTextArea.value = currentModuleData.cp || 'CP muncul otomatis...';
            }
        }

        window.updateStep3Model = function (val) {
            currentModuleData.model = val;
            const sintaksArea = document.getElementById('sintaks-area-container');
            if (sintaksArea) {
                if (val && SINTAKS_DATA[val]) {
                    sintaksArea.innerHTML = \`<div class="p-6 bg-slate-900 border-2 border-blue-900 rounded-3xl shadow-inner animate-fade-in"><h4 class="text-xs font-black uppercase mb-3 text-yellow-500">📌 Alur Sintak:</h4><div class="text-[10px] font-extrabold uppercase leading-relaxed text-blue-400">\${SINTAKS_DATA[val].steps.join(" ▶ ")}</div></div>\`;
                } else {
                    sintaksArea.innerHTML = '';
                }
            }
            const recArea = document.getElementById('recommendation-area-container');
            if (recArea) {
                if (val && !currentModuleData.pendekatan) {
                    const recPendekatan = getRekomendasiPendekatan();
                    recArea.innerHTML = \`
                    <div class="p-6 bg-blue-900/20 border-2 border-blue-900 rounded-3xl animate-fade-in shadow-sm">
                        <p class="text-[11px] uppercase font-black text-blue-400 mb-3 flex items-center gap-2"><span>💡</span> Rekomendasi Pendekatan:</p>
                        <button onclick="window.applyRecPendekatan('\${recPendekatan.pendekatan}')" class="w-full text-left p-4 bg-slate-900 rounded-2xl border-2 border-blue-900 hover:border-yellow-500 transition-all shadow-md">
                            <p class="text-[10px] font-black text-blue-400 uppercase">\${recPendekatan.pendekatan}</p>
                            <p class="text-[8px] text-slate-400 italic mt-1 leading-tight">\${recPendekatan.alasan}</p>
                        </button>
                    </div>
                \`;
                } else {
                    recArea.innerHTML = '';
                }
            }
            if (currentModuleData.pendekatan) window.updateStep3Pendekatan(currentModuleData.pendekatan);
        };

        window.applyRecPendekatan = function (p) {
            currentModuleData.pendekatan = p;
            const pSelect = document.getElementById('pendekatan');
            if (pSelect) pSelect.value = p;
            window.updateStep3Pendekatan(p);
            const recArea = document.getElementById('recommendation-area-container');
            if (recArea) recArea.innerHTML = '';
            showToast('✅ Pendekatan Terpilih!');
        };

        window.updateStep3Pendekatan = function (val) {
            currentModuleData.pendekatan = val;
            const recMetodeArea = document.getElementById('metode-rec-area');
            if (recMetodeArea) {
                if (val) {
                    const recommendedMethods = getRekomendasiMetode();
                    recMetodeArea.innerHTML = \`
                    <div class="p-6 bg-slate-900/50 border-2 border-blue-900 rounded-3xl animate-fade-in">
                        <p class="text-[11px] uppercase font-black text-blue-400 mb-3 flex items-center gap-2"><span>🛠️</span> Rekomendasi Metode:</p>
                        <div class="flex flex-wrap gap-2">
                            \${recommendedMethods.map(met => {
                        const isAlreadySelected = (currentModuleData.metode || []).includes(met);
                        return \`<button onclick="window.toggleArrStatic('metode', '\${met}')" class="metode-rec-btn px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border-2 \${isAlreadySelected ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-slate-900 text-slate-400 border-blue-900 hover:border-yellow-500'}" data-metode="\${met}">\${met}</button>\`;
                    }).join('')}
                        </div>
                    </div>
                \`;
                } else {
                    recMetodeArea.innerHTML = '';
                }
            }
        };

        window.toggleArrStatic = function (key, v) {
            if (!currentModuleData[key]) currentModuleData[key] = [];
            const idx = currentModuleData[key].indexOf(v);

            if (key === 'metode' && idx === -1 && currentModuleData[key].length >= 4) {
                showToast("⚠️ Maksimal 4 Metode!");
                return;
            }

            if (idx > -1) {
                currentModuleData[key].splice(idx, 1);
            } else {
                currentModuleData[key].push(v);
            }

            const allLabels = document.querySelectorAll(\`[data-key="\${key}"]\`);
            allLabels.forEach(label => {
                const val = label.getAttribute('data-val');
                const isSelected = currentModuleData[key].includes(val);
                const isLimitReached = !isSelected && currentModuleData[key].length >= 4 && key === 'metode';

                if (isSelected) {
                    label.classList.add('bg-slate-900', 'shadow-xl', 'scale-[1.03]', 'border-yellow-500');
                    label.querySelector('input').checked = true;
                } else {
                    label.classList.remove('bg-slate-900', 'shadow-xl', 'scale-[1.03]', 'border-yellow-500');
                    if (isLimitReached) label.classList.add('opacity-40', 'grayscale', 'pointer-events-none');
                    else label.classList.remove('opacity-40', 'grayscale', 'pointer-events-none');
                    label.querySelector('input').checked = false;
                }
            });

            const recBtns = document.querySelectorAll(\`.metode-rec-btn[data-metode="\${v}"]\`);
            recBtns.forEach(btn => {
                if (currentModuleData[key].includes(v)) {
                    btn.classList.add('bg-blue-900', 'text-white', 'border-blue-900');
                } else {
                    btn.classList.remove('bg-blue-900', 'text-white', 'border-blue-900');
                }
            });
        };
`;

export const htmlPart4 = `
        let currentStep = -1;
        let lastRenderedStep = -99;

        window.nextStep = function () {
            window.saveInputs();
            const d = currentModuleData;

            if (currentStep === 0) {
                if (!d.judul_modul?.trim() || !d.mapel || !d.elemen || !d.materi || !d.alokasi_waktu?.trim()) {
                    showToast("⚠️ Lengkapi data Langkah 1 (Identitas)!");
                    return;
                }
            }
            else if (currentStep === 1) {
                if ((d.selected_materi || []).length === 0 || (d.selected_karakteristik || []).length === 0 || (d.profil_lulusan || []).length === 0) {
                    showToast("⚠️ Pilih Materi Ajar di kiri!");
                    return;
                }
            }
            else if (currentStep === 2) {
                if (!d.model || !d.pendekatan || (d.metode || []).length === 0) {
                    showToast("⚠️ Pilih Model, Pendekatan, dan minimal 1 Metode!");
                    return;
                }
            }
            else if (currentStep === 3) {
                if ((d.mitra_internal || []).length === 0) {
                    showToast("⚠️ Pilih minimal 1 Mitra Internal!");
                    return;
                }
            }
            else if (currentStep === 4) {
                if ((d.lingkungan_fisik || []).length === 0 || (d.budaya_belajar || []).length === 0) {
                    showToast("⚠️ Pilih Lingkungan Fisik dan Budaya Belajar!");
                    return;
                }
            }
            else if (currentStep === 5) {
                const hasDigital = (d.platform_aplikasi || []).length > 0 || (d.perangkat_digital || []).length > 0 || (d.media_digital || []).length > 0;
                const hasNonDigital = (d.media_non_digital || []).length > 0;
                if (!hasDigital && !hasNonDigital) {
                    showToast("⚠️ Pilih minimal 1 Media Pembelajaran!");
                    return;
                }
            }

            if (currentStep < 7) { currentStep++; render(); }
        }
        window.prevStep = function () { if (currentStep > 0) { currentStep--; render(); } else { currentStep = -1; render(); } }

        function render() {
            const app = document.getElementById('app');
            if (!app) return;
            const scrollPos = app.scrollTop;
            if (currentStep === -1) renderHome();
            else if (currentStep === -2) renderArchive();
            else if (currentStep === -3) renderContact();
            else if (currentStep >= 0) renderCreate();
            app.scrollTop = scrollPos;
            lastRenderedStep = currentStep;
        }

        function renderHome() {
            document.getElementById('app').innerHTML = \`
        <div class="w-full h-full gradient-bg-primary overflow-auto flex items-center justify-center p-4 builder-ui">
            <div class="max-w-4xl w-full bg-black rounded-[3rem] shadow-2xl overflow-hidden border-4 border-yellow-500 flex flex-col animate-fade-in">
                <div class="pt-16 pb-12 px-8 md:px-12 bg-blue-900/30 text-center border-b-4 border-yellow-500 font-black">
                    <div class="flex items-center justify-center gap-4 whitespace-nowrap overflow-hidden">
                        <span class="text-4xl md:text-6xl shrink-0 font-black italic">🤖</span>
                        <h2 class="text-5xl md:text-7xl font-black text-[#FFD700] drop-shadow-md italic tracking-tighter">RonAI ASISTEN</h2>
                    </div>
                </div>
                <div class="p-8 md:p-12 text-center bg-transparent flex-1 font-black italic">
                    <div class="text-6xl mb-6 font-black text-[#FFD700]">📗</div>
                    <h1 class="text-2xl md:text-3xl font-black text-white mb-2 uppercase">AI Cerdas untuk Modul Ajar</h1>
                    <p class="text-blue-400 font-bold mb-10 tracking-widest uppercase text-sm font-black">Edisi Fase A (Kelas 1 & 2) BSKAP 046</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <button onclick="navigateTo('create')" class="btn-primary py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black italic uppercase !bg-blue-900 hover:!bg-blue-800 border-2 border-yellow-500"><span>➕</span> Buat Perencanaan</button>
                        <button onclick="navigateTo('archive')" class="btn-primary py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black italic uppercase !bg-slate-900 hover:!bg-slate-800 border-2 border-blue-900"><span>📂</span> Arsip Modul</button>
                        <button onclick="window.open('https://youtu.be/7zNqKZTS8w4', '_blank')" class="bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black italic uppercase border-2 border-yellow-500"><span>📺</span> TUTORIAL</button>
                        <button onclick="navigateTo('contact')" class="btn-primary py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black italic uppercase !bg-blue-950 hover:!bg-blue-900 border-2 border-blue-900"><span>👤</span> CONTACT</button>
                    </div>
                </div>
            </div>
        </div>\`;
        }

        function renderContact() {
            document.getElementById('app').innerHTML = \`
        <div class="w-full h-full gradient-bg-primary overflow-auto flex items-center justify-center p-4 builder-ui">
            <div class="max-w-md w-full bg-black rounded-[3rem] shadow-2xl overflow-hidden border-4 border-yellow-500 animate-fade-in relative p-8 text-center flex flex-col items-center">
                <div class="w-48 h-48 bg-blue-950 rounded-full mb-6 border-4 border-yellow-500 shadow-xl flex items-center justify-center overflow-hidden">
                    <svg class="w-28 h-28 text-yellow-500/50" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h2 class="text-xl md:text-2xl font-black text-white italic leading-tight mb-2 whitespace-nowrap">Roni Hariyanto Bhidju, S.Pd.,Gr.</h2>
                <div class="bg-blue-900/20 p-4 rounded-2xl border-2 border-yellow-500 mb-8 shadow-sm">
                   <p class="text-[14px] font-black text-[#FFD700] italic leading-relaxed uppercase text-center">
                    * Guru SD DEDIKATIF NTT 2023<br>
                    * Guru SD TRANSFORMATIF NTT 2025
                   </p>
                </div>
                <div class="flex flex-col w-full gap-3">
                    <button onclick="window.open('https://www.facebook.com/share/1DXzxmC4oN/', '_blank')" class="w-full btn-gold py-4 rounded-2xl shadow-lg uppercase italic flex items-center justify-center gap-2 tracking-tighter"><span>🌐</span> Hubungi</button>
                    <button onclick="navigateTo('home')" class="w-full bg-blue-900/20 text-blue-400 font-bold py-3 rounded-2xl uppercase text-xs italic hover:bg-blue-900/40 transition-all border border-blue-900">Kembali</button>
                </div>
            </div>
        </div>\`;
        }

        window.showKonfirmasiModal = function () {
            window.saveInputs();
            const d = currentModuleData;

            if (!d.tp || !d.validasi_langkah || !d.validasi_asesmen || !d.validasi_rubrik) {
                showToast("⚠️ Tujuan, Langkah, Asesmen, dan Rubrik wajib di-generate dahulu!");
                return;
            }

            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
        <div class="modal-overlay">
            <div class="modal-content !w-[450px] max-h-[85vh] overflow-y-auto font-black italic !bg-black !text-white border-yellow-500">
                <h3 class="text-xl font-black text-yellow-500 mb-6 text-center uppercase tracking-tighter italic">⚙️ Konfirmasi Identitas</h3>
                <div class="space-y-4 mb-8 text-white">
                    <div class="bg-blue-900/20 p-4 rounded-2xl border-2 border-blue-900">
                        <label class="block text-[10px] uppercase text-blue-400 mb-1">📍 Tempat & Tanggal Pembuatan</label>
                        <input type="text" id="konfirmasi_tempat_val" class="input-modern p-2 rounded-xl mb-2 text-sm" placeholder="Contoh: Maubesi" value="\${d.konfirmasi_tempat || ''}">
                        <input type="text" id="konfirmasi_tanggal_val" class="input-modern p-2 rounded-xl text-sm" placeholder="Contoh: 14 Januari 2026" value="\${d.konfirmasi_tanggal || ''}">
                    </div>
                    <div class="bg-blue-900/20 p-4 rounded-2xl border-2 border-blue-900">
                        <label class="block text-[10px] uppercase text-blue-400 mb-1">👤 Penyusun: <b class="text-yellow-500">\${d.penyusun || ''}</b></label>
                        <input type="text" id="penyusun_nip_val" class="input-modern p-2 rounded-xl text-sm" placeholder="NIP/NUPTK Penyusun" value="\${d.penyusun_nip || ''}">
                    </div>
                    <div class="bg-blue-900/20 p-4 rounded-2xl border-2 border-blue-900">
                        <label class="block text-[10px] uppercase text-blue-400 mb-1">🏫 Kepala Sekolah</label>
                        <input type="text" id="ks_nama_val" class="input-modern p-2 rounded-xl mb-2 text-sm" placeholder="Nama Kepala Sekolah" value="\${d.kepala_sekolah_nama || ''}">
                        <input type="text" id="ks_nip_val" class="input-modern p-2 rounded-xl text-sm" placeholder="NIP Kepala Sekolah" value="\${d.kepala_sekolah_nip || ''}">
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <button onclick="window.processKonfirmasi()" class="w-full btn-gold py-4 rounded-2xl shadow-lg uppercase italic tracking-tighter">💾 Simpan & Generate Modul</button>
                    <button onclick="window.closeModal()" class="w-full bg-slate-900 text-slate-400 font-bold py-2 rounded-xl text-[10px] italic">Batal</button>
                </div>
            </div>
        </div>\`;
        };
`;

export const htmlPart5 = `
        window.processKonfirmasi = function () {
            currentModuleData.konfirmasi_tempat = document.getElementById('konfirmasi_tempat_val').value;
            currentModuleData.konfirmasi_tanggal = document.getElementById('konfirmasi_tanggal_val').value;
            currentModuleData.penyusun_nip = document.getElementById('penyusun_nip_val').value;
            currentModuleData.kepala_sekolah_nama = document.getElementById('ks_nama_val').value;
            currentModuleData.kepala_sekolah_nip = document.getElementById('ks_nip_val').value;
            closeModal();
            currentStep++; render();
        };

        function renderArchive() {
            const modules = JSON.parse(localStorage.getItem('ronai_master_v50_db') || '[]');
            document.getElementById('app').innerHTML = \`
        <div class="min-h-screen gradient-bg-primary p-6 md:p-12 builder-ui font-black italic animate-fade-in">
            <div class="max-w-5xl mx-auto">
                <div class="flex justify-between items-center mb-10">
                    <h2 class="text-4xl font-black text-yellow-500 uppercase">📂 Arsip Modul</h2>
                    <button onclick="navigateTo('home')" class="bg-blue-900/20 text-blue-400 px-6 py-2 rounded-xl font-bold uppercase text-xs border border-blue-900">Kembali</button>
                </div>
                \${modules.length === 0 ? \`<h3 class="text-center text-slate-400 font-black italic">Arsip Kosong</h3>\` : \`
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-black italic">
                    \${modules.map((m, i) => {
                return \`
                        <div class="bg-black p-6 rounded-[2rem] shadow-lg border-2 border-blue-900 flex flex-col justify-between italic relative overflow-hidden group">
                            <div class="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div class="relative">
                                <h3 class="text-xl font-black text-white uppercase mb-2 font-black italic">\${m.judul_modul || 'Untitled'}</h3>
                                <p class="text-xs italic font-black text-blue-400">\${m.mapel} | \${m.penyusun}</p>
                            </div>
                            <div class="flex gap-2 mt-6 relative">
                                <button onclick="window.openModule('\${m.__backendId}')" class="flex-1 btn-gold py-3 rounded-xl uppercase italic font-black italic">Buka File</button>
                                <button onclick="window.deleteModule('\${m.__backendId}')" class="bg-red-900/30 text-red-500 px-4 rounded-xl border-2 border-red-900/50 hover:bg-red-900/50 transition-colors italic">🗑️</button>
                            </div>
                        </div>\`;
            }).join('')}
                </div>\`}
            </div>
        </div>\`;
        }

        window.openModule = function (id) { const modules = JSON.parse(localStorage.getItem('ronai_master_v50_db') || '[]'); const found = modules.find(m => m.__backendId === id); if (found) { currentModuleData = found; currentStep = 7; render(); showToast("📂 Modul Berhasil Dibuka!"); } }
        window.deleteModule = function (id) { let modules = JSON.parse(localStorage.getItem('ronai_master_v50_db') || '[]'); modules = modules.filter(m => m.__backendId !== id); localStorage.setItem('ronai_master_v50_db', JSON.stringify(modules)); render(); showToast("🗑️ Modul Dihapus!"); }

        function renderCreate() {
            const steps = ["Informasi Umum", "Identifikasi Peserta", "Desain Pembelajaran", "Mitra Pembelajaran", "Lingkungan Belajar", "Pemanfaatan Digital", "Validasi Aktivitas", "Review"];
            const pct = ((currentStep + 1) / steps.length) * 100;
            let content = '';
            if (currentStep === 0) content = stepInformasiUmum();
            else if (currentStep === 1) content = stepIdentifikasi();
            else if (currentStep === 2) content = stepDesain();
            else if (currentStep === 3) content = stepMitra();
            else if (currentStep === 4) content = stepLingkungan();
            else if (currentStep === 5) content = stepDigital();
            else if (currentStep === 6) content = stepValidasiAktivitas();
            else if (currentStep === 7) content = stepReview();
            const animationClass = (currentStep !== lastRenderedStep) ? 'animate-fade-in' : '';

            if (currentStep === 7) {
                document.getElementById('app').innerHTML = \`<div class="w-full h-full bg-black overflow-auto p-4 md:p-8 \${animationClass}"><div class="max-w-[210mm] mx-auto mb-6 no-print flex flex-col items-center font-black italic"><div class="flex flex-wrap justify-center gap-4 items-center mb-4"><button onclick="prevStep()" class="bg-blue-900 text-white font-bold py-3 px-6 rounded-xl shadow uppercase text-xs font-black italic border-2 border-yellow-500">⬅️ Kembali Edit</button><button onclick="window.downloadWord()" class="bg-black text-yellow-500 font-bold py-3 px-6 rounded-xl shadow uppercase text-xs hover:bg-blue-900/20 italic border-2 border-blue-900">📥 Download Word</button><button onclick="window.downloadPDF()" class="btn-gold py-3 px-6 rounded-xl shadow uppercase text-xs hover:bg-yellow-600 italic border-2 border-blue-950">📥 Download PDF</button><button onclick="window.saveFinal()" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow uppercase text-xs font-black italic hover:bg-blue-700">💾 Simpan Data</button></div><p class="text-[10px] text-yellow-500 font-bold uppercase tracking-widest italic bg-blue-950 px-4 py-1 rounded-full border border-yellow-500">✨ Mode Edit Aktif: Klik teks di bawah untuk mengubah konten sebelum diunduh.</p></div><div id="capture-area" style="line-height: 1.5;">\${content}</div></div>\`;
            } else {
                document.getElementById('app').innerHTML = \`
          <div class="min-h-screen bg-black p-4 md:p-8 overflow-auto pb-24 builder-ui \${animationClass}">
            <div class="max-w-6xl mx-auto bg-slate-900 rounded-3xl shadow-2xl min-h-[85vh] flex flex-col border-2 border-blue-900 overflow-hidden">
                <div class="p-8 border-b-2 border-blue-900 gradient-bg-primary font-black italic">
                    <div class="flex justify-between items-center mb-6">
                        <button onclick="prevStep()" class="text-blue-300 font-bold hover:text-white transition-colors font-black italic">⬅️ Kembali</button>
                        <span class="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-yellow-500 italic">Langkah \${currentStep + 1}/\${steps.length}</span>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">\${steps[currentStep]}</h2>
                    <div class="progress-bar"><div class="progress-fill" style="width: \${pct}%"></div></div>
                </div>
                <div class="p-8 flex-1 overflow-y-auto bg-black">
                    \${content}
                </div>
                <div class="p-6 border-t border-blue-900 bg-slate-950 flex \${currentStep === 6 ? 'justify-center' : 'justify-between'} items-center gap-4 font-black italic">
                    <button onclick="prevStep()" class="btn-primary py-4 px-10 rounded-xl shadow-lg font-black italic uppercase \${currentStep === 6 ? 'hidden' : ''} !bg-slate-800">⬅️ Kembali</button>
                    <div class="flex gap-4">
                        \${currentStep === 6 ? \`<button onclick="window.showKonfirmasiModal()" class="btn-gold py-5 px-16 rounded-2xl shadow-2xl uppercase italic hover:scale-105 transition-all text-lg tracking-tighter">KONFIRMASI HASIL</button>\` : ''}
                        <button onclick="window.nextStep()" class="btn-primary py-4 px-12 rounded-xl shadow-lg font-black italic uppercase \${currentStep === 6 ? 'hidden' : ''}">\${currentStep === 6 ? 'RonAI Generate' : 'Simpan & Lanjut ➡️'}</button>
                    </div>
                </div>
            </div>
          </div>\`;
            }
        }

        function setAILoading(btn, loading) {
            if (loading) { if (btn) btn.dataset.oldText = btn.innerHTML; if (btn) btn.innerHTML = \`<span class="loader"></span> Memproses...\`; if (btn) btn.disabled = true; isProcessing = true; }
            else { if (btn) btn.innerHTML = btn.dataset.oldText; if (btn) btn.disabled = false; isProcessing = false; }
        }

        window.generateKarakteristikMateri = async function () {
            if (isProcessing) return;
            window.saveInputs();
            const btn = event.currentTarget;
            const d = currentModuleData;
            if (!d.selected_materi || d.selected_materi.length === 0) { showToast("⚠️ Pilih Materi Ajar di kiri!"); return; }
            setAILoading(btn, true);
            try {
                const prompt = \`Analisis karakteristik materi ajar profesional untuk topik: \${d.selected_materi.join(", ")}. 
            INSTRUKSI:
            1. Berikan narasi padat (max 70 kata) tentang karakteristik materi.
            2. Berdasarkan karakteristik tersebut, pilih SATU Model Pembelajaran paling relevan dari daftar: \${MODELS.join(", ")}.
            3. Berikan satu alasan singkat (max 15 kata) mengapa model tersebut dipilih.
            RESPON WAJIB HANYA BERUPA JSON MURNI: {"karakteristik": "...", "model": "...", "alasan": "..."}\`;
                const results = await callGemini(prompt);
                currentModuleData.relevansi_materi = results.karakteristik;
                const el = document.getElementById('relevansi_materi');
                if (el) el.value = results.karakteristik;
                const recCardContainer = document.getElementById('model-rec-card-container');
                if (recCardContainer) {
                    recCardContainer.innerHTML = \`
                    <div class="mt-6 p-6 gradient-bg-primary rounded-[2rem] border-2 border-yellow-500 shadow-xl animate-fade-in font-black italic">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="text-2xl">💡</span>
                            <h4 class="text-yellow-500 text-xs uppercase tracking-widest">Rekomendasi Model Pilihan AI</h4>
                        </div>
                        <div class="bg-black/50 p-5 rounded-2xl mb-5 border border-blue-900">
                            <p class="text-white text-base uppercase mb-1">\${results.model}</p>
                            <p class="text-blue-200 text-[10px] leading-tight font-bold italic">"\${results.alasan}"</p>
                        </div>
                        <button onclick="window.applyAiRecommendations('\${results.model}')" class="w-full py-4 btn-gold rounded-xl text-[11px] uppercase font-black shadow-lg">Terapkan Model Ini</button>
                    </div>
                \`;
                }
                showToast("✨ Karakteristik Berhasil!");
            } catch (e) { showToast("❌ Gagal Generate AI"); }
            setAILoading(btn, false);
        };
`;
