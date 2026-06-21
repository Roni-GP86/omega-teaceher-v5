const fs = require('fs');

const htmlContent = `<!doctype html>
<html lang="id" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RonAI ASISTEN AI CERDAS UNTUK MODUL AJAR - Modul Ajar Builder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; height: 100%; margin: 0; overflow: hidden; }
    #app { height: 100%; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: auto; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #e0f2fe; }
    ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #2563eb; }
    .gradient-bg-primary { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); }
    .input-modern, .select-modern, textarea { border: 2px solid #bfdbfe; transition: all 0.2s; outline: none; width: 100%; line-height: 1.5; }
    .input-modern:focus, .select-modern:focus, textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
    .btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); transition: all 0.2s; cursor: pointer; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
    .progress-bar { height: 8px; background: #bfdbfe; border-radius: 99px; overflow: hidden; }
    .progress-fill { height: 100%; background: #2563eb; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    .toast { position: fixed; bottom: 24px; right: 24px; background: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-left: 6px solid #ef4444; animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 5000; font-weight: 600; color: #1e3a8a; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 4000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 1.25rem; width: 280px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 2px solid #3b82f6; animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .tp-modal-content { background: white; padding: 2rem; border-radius: 2rem; width: 90%; max-width: 800px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 4px solid #4f46e5; animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .menu-card { position: relative; overflow: hidden; border-radius: 1.5rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 4px solid transparent; }
    .menu-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); }
    .menu-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent); transform: skewX(-25deg); transition: 0.5s; }
    .menu-card:hover::before { left: 150%; }

    .a4-paper { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; padding: 2.54cm; box-shadow: 0 0 15px rgba(0,0,0,0.1); font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; text-align: justify; outline: none; }
    .doc-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; border: none; }
    .doc-table td { vertical-align: top; padding: 4px 0; border: none; line-height: 1.5; font-family: 'Times New Roman', serif; }
    .doc-table td.label { width: 30%; font-weight: normal; }
    .doc-table td.colon { width: 15px; text-align: center; }
    .doc-table td.value { width: auto; font-weight: normal; }
    
    .kegiatan-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12pt; font-family: 'Times New Roman', Times, serif; border: 1px solid #000; table-layout: fixed; }
    .kegiatan-table th, .kegiatan-table td { border: 1px solid #000; padding: 10px; text-align: justify; vertical-align: top; line-height: 1.5; word-wrap: break-word; overflow-wrap: break-word; }
    .kegiatan-table th { background: #f2f2f2; text-align: center; font-weight: bold; text-transform: uppercase; }

    .doc-section-title { font-weight: bold; text-transform: uppercase; margin-top: 24pt; margin-bottom: 12pt; font-size: 14pt; display: block; line-height: 1.5; clear: both; }
    .doc-sub-section { font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; line-height: 1.5; display: block; }
    .doc-main-title { text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 30pt; text-transform: uppercase; line-height: 1.5; }

    .rubrik-table { width: 100% !important; border-collapse: collapse !important; margin-top: 10px; font-family: 'Times New Roman', serif; font-size: 11pt; color: black; line-height: 1.5; table-layout: fixed; border: 1px solid black; max-width: 100%; box-sizing: border-box; overflow: visible; }
    .rubrik-table th, .rubrik-table td { border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle; line-height: 1.5; word-wrap: break-word; word-break: normal; overflow: visible; }
    .rubrik-table th { background-color: #f2f2f2; font-weight: bold; text-transform: uppercase; }

    .shadow-inner .rubrik-table { font-family: inherit !important; font-size: inherit !important; }

    .loader { border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 18px; height: 18px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .progress-table { width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 9px; }
    .progress-table th, .progress-table td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    .progress-table th { background-color: #1e3a8a; color: white; text-transform: uppercase; }
    .row-completed { background-color: #dcfce7 !important; }
    .text-completed { color: #166534; font-weight: 800; }

    @media print {
      @page { size: A4 portrait; margin: 1cm; }
      body { background: white; font-family: 'Times New Roman', Times, serif; }
      #app { overflow: visible; height: auto; }
      .no-print, .btn-primary, .progress-bar, .toast, .builder-ui { display: none !important; }
      .a4-paper { width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
      .rubrik-table { width: 100% !important; table-layout: fixed !important; overflow: visible !important; }
      .rubrik-table td, .rubrik-table th { word-break: normal !important; word-wrap: break-word !important; }
      .lkpd-container table { width: 100% !important; table-layout: fixed !important; }
      .lkpd-container td { word-wrap: break-word !important; word-break: break-all !important; overflow-wrap: anywhere !important; }
    }
  </style>
</head>
<body class="h-full bg-blue-50 text-slate-800">
  <div id="app" class="w-full h-full"></div>
  <div id="modal-container"></div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    let allModulesSynced = [];

    const dataSdk = {
      init: async (handler) => {
        const initAuth = async () => {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        };

        await initAuth();
        
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'modules'));
            onSnapshot(q, (snapshot) => {
              allModulesSynced = snapshot.docs.map(doc => ({ ...doc.data() }));
              handler.onDataChanged(allModulesSynced);
              if (typeof window.render === 'function') window.render();
            }, (err) => {
              console.error("Firestore Error:", err);
            });
          }
        });
        return { isOk: true };
      },
      create: async (data) => {
        if (!auth.currentUser) return { isOk: false };
        try {
          const docId = data.__backendId || 'modul_' + Date.now();
          data.__backendId = docId;
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'modules', docId), data);
          return { isOk: true };
        } catch (e) { return { isOk: false }; }
      },
      delete: async (docId) => {
        if (!auth.currentUser) return { isOk: false };
        try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'modules', docId));
          return { isOk: true };
        } catch (e) { return { isOk: false }; }
      }
    };
    window.dataSdk = dataSdk;
    window.getAllModules = () => allModulesSynced;

    window.dataSdk.init({ onDataChanged: (data) => { allModulesSynced = data; } });
  </script>

  <script>
    const apiKey = "";
    async function callGemini(prompt) {
      const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=\${apiKey}\`;
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
          const firstBracket = rawText.indexOf('[');
          
          let startIdx = -1;
          let endChar = '';
          
          if (firstBrace !== -1 && (firstBracket === -1 || (firstBrace < firstBracket))) {
              startIdx = firstBrace;
              endChar = '}';
          } else if (firstBracket !== -1) {
              startIdx = firstBracket;
              endChar = ']';
          }
          
          if (startIdx === -1) throw new Error("Format Salah");
          const endIdx = rawText.lastIndexOf(endChar);
          if (endIdx === -1) throw new Error("Format Salah");
          
          const cleanJson = rawText.substring(startIdx, endIdx + 1);
          return JSON.parse(cleanJson);
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      throw new Error("Gagal menghubungi AI.");
    }

    const CP_DATABASE_FASE_C = __DATABASE_PLACEHOLDER__;

    const SINTAKS_DATA = {
        "Problem Based Learning (PBL)": { steps: ["Orientasi Masalah", "Mengorganisasi Siswa", "Membimbing Penyelidikan", "Mengembangkan Karya", "Analisis & Evaluasi"] },
        "Project Based Learning (PjBL)": { steps: ["Pertanyaan Mendasar", "Desain Proyek", "Menyusun Jadwal", "Memonitor Kemajuan", "Menguji Hasil", "Evaluasi Pengalaman"] },
        "Discovery Learning": { steps: ["Pemberian Rangsangan", "Identifikasi Masalah", "Pengumpulan Data", "Pengolahan Data", "Pembuktian", "Menarik Kesimpulan"] },
        "Inquiry Learning": { steps: ["Orientasi", "Rumusan Masalah", "Hipotesis", "Pengumpulan Data", "Uji Hipotesis", "Kesimpulan"] },
        "Problem Solving": { steps: ["Identifikasi Masalah", "Alternatif Solusi", "Pemilihan Solusi", "Uji Coba", "Evaluasi"] },
        "Cooperative Learning": { steps: ["Tujuan & Motivasi", "Penyajian Informasi", "Kelompok Belajar", "Bimbingan Kerja", "Evaluasi", "Penghargaan"] }
    };

    const ITEM_PALETTE = [{ bg: "bg-rose-50", border: "border-rose-400", borderStrong: "border-rose-600", text: "text-rose-900", icon: "text-rose-600", hex: "#e11d48" }, { bg: "bg-orange-50", border: "border-orange-400", borderStrong: "border-orange-600", text: "text-orange-900", icon: "text-orange-600", hex: "#ea580c" }, { bg: "bg-amber-50", border: "border-amber-400", borderStrong: "border-amber-600", text: "text-orange-900", icon: "text-orange-600", hex: "#d97706" }, { bg: "bg-yellow-50", border: "border-yellow-400", borderStrong: "border-yellow-600", text: "text-yellow-900", icon: "text-yellow-900", hex: "#ca8a04" }, { bg: "bg-lime-50", border: "border-lime-400", borderStrong: "border-lime-600", text: "text-lime-900", icon: "text-lime-600", hex: "#65a30d" }, { bg: "bg-green-50", border: "border-green-400", borderStrong: "border-green-600", text: "text-green-900", icon: "text-green-900", hex: "#16a34a" }, { bg: "bg-emerald-50", border: "border-emerald-400", borderStrong: "border-emerald-600", text: "text-emerald-900", icon: "text-emerald-600", hex: "#059669" }, { bg: "bg-teal-50", border: "border-teal-400", borderStrong: "border-teal-600", text: "text-teal-900", icon: "text-teal-600", hex: "#0d9488" }, { bg: "bg-cyan-50", border: "border-cyan-400", borderStrong: "border-cyan-600", text: "text-cyan-900", icon: "text-cyan-600", hex: "#0891b2" }, { bg: "bg-sky-50", border: "border-sky-400", borderStrong: "border-sky-600", text: "text-sky-900", icon: "text-sky-600", hex: "#0284c7" }, { bg: "bg-blue-50", border: "border-blue-400", borderStrong: "border-blue-600", text: "text-blue-900", icon: "text-blue-600", hex: "#2563eb" }, { bg: "bg-indigo-50", border: "border-indigo-400", borderStrong: "border-indigo-600", text: "text-indigo-900", icon: "text-indigo-900", hex: "#4f46e5" }, { bg: "bg-violet-50", border: "border-violet-400", borderStrong: "border-violet-600", text: "text-violet-900", icon: "text-violet-600", hex: "#7c3aed" }, { bg: "bg-purple-50", border: "border-purple-400", borderStrong: "border-purple-600", text: "text-purple-900", icon: "text-purple-600", hex: "#9333ea" }, { bg: "bg-fuchsia-50", border: "border-fuchsia-400", borderStrong: "border-fuchsia-600", text: "text-fuchsia-900", icon: "text-fuchsia-600", hex: "#c026d3" }, { bg: "bg-pink-50", border: "border-pink-400", borderStrong: "border-pink-600", text: "text-pink-900", icon: "text-pink-600", hex: "#db2777" }];

    const MODELS = ["Problem Based Learning (PBL)", "Discovery Learning", "Inquiry Learning", "Project Based Learning (PjBL)", "Problem Solving", "Cooperative Learning"];
    const APPROACHES = ["Pembelajaran Mendalam (Deep Learning)", "Saintifik (Scientific)", "Kontekstual (CTL)", "Berorientasi pada Murid (Student-Centered)", "Diferensiasi (Differentiated Instruction)", "Konstruktivisme"];
    const KARAKTERISTIK_SISWA_LIST = [{ title: "Rasa Ingin Tahu Tinggi", icon: "🤔" }, { title: "Suka Belajar Konkret", icon: "🧱" }, { title: "Rentang Konsentrasi Pendek", icon: "⏳" }, { title: "Aktif Secara Fisik", icon: "🏃" }, { title: "Senang Berkelompok", icon: "👨‍👧‍👦" }, { title: "Butuh Penguatan Positif", icon: "🌟" }];
    
    const PROFIL_LULUSAN_DATA = [
        { title: "Keimanan dan Ketakwaan", icon: "🙏", desc: "Berakhlak mulia kepada Tuhan YME dan sesama manusia." },
        { title: "Kewargaan", icon: "🇮🇩", desc: "Cinta tanah air dan sadar akan hak serta kewajiban negara." },
        { title: "Penalaran Kritis", icon: "🧠", desc: "Mampu menganalisis informasi secara objektif dan logis." },
        { title: "Kreativitas", icon: "💡", desc: "Menghasilkan gagasan orisinal dan karya yang bermakna." },
        { title: "Kolaborasi", icon: "🤝", desc: "Bekerja sama secara efektif untuk mencapai tujuan bersama." },
        { title: "Kemandirian", icon: "👤", desc: "Bertanggung jawab penuh atas proses dan hasil belajarnya." },
        { title: "Kesehatan", icon: "💪", desc: "Menyaga keseimbangan jasmani dan rohani secara optimal." },
        { title: "Komunikasi", icon: "🤝", desc: "Menyampaikan ide dan perasaan secara santun dan jelas." }
    ];

    const MITRA_INTERNAL_DATA = [
      { label: "Guru Kelas", icon: "👨‍🏫", role: "perancang utama dan fasilitator pembelajaran" }, 
      { label: "Guru Mapel", icon: "👩‍🔬", role: "pemberi materi spesifik dan kolaborator instruksional" }, 
      { label: "Kepala Sekolah", icon: "🏫", role: "pembina kurikulum dan penyedia sarana prasarana" }, 
      { label: "Peserta Dididk", icon: "🎒", role: "subjek aktif yang mengkonstruksi pengetahuan" }, 
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
    const METHODS_WITH_DESC = [{ label: "Metode Diskusi", icon: "💬" }, { label: "Metode Tanya Jawab", icon: "❓" }, { label: "Metode Demonstrasi", icon: "👁️" }, { label: "Metode Diskusi Kelompok", icon: "👥" }, { label: "Metode Bermain Peran", icon: "🎭" }, { label: "Metode Observasi", icon: "🔍" }];
    const BUDAYA_BELAJAR = [{ label: "Budaya Belajar", icon: "⏱️" }, { label: "Saling Menghargai", icon: "🙏" }, { label: "Aktif Bertanya", icon: "🙋‍♂️" }, { label: "Kerja Sama", icon: "👥" }, { label: "Refleksi Diri", icon: "🧘" }, { label: "Jujur & Tanggung Jawab", icon: "✅" }];
    const LINGKUNGAN_FISIK = [{ label: "Ruang Kelas", icon: "🏫" }, { label: "Halaman Sekolah", icon: "🌳" }, { label: "Lapangan Sekolah", icon: "⚽" }, { label: "Laboratorium", icon: "🧪" }, { label: "Ruang Seni", icon: "🎨" }, { label: "Kebun Sekolah", icon: "🌿" }];
    const NON_DIGITAL_MEDIA = [{ label: "Buku Teks / LKS", icon: "📚" }, { label: "Alat Peraga Konkret", icon: "🧱" }, { label: "Papan Tulis & Spidol", icon: "✍️" }, { label: "Gambar / Poster Cetak", icon: "🖼️" }, { label: "Flashcards / Kartu", icon: "🃏" }, { label: "Lingkungan Sekitar", icon: "🌳" }];
    const DIGITAL_PLATFORM = [{ label: "Quizizz / Kahoot", icon: "🎮" }, { label: "Google Workspace", icon: "☁️" }, { label: "Canva Pendidikan", icon: "🎨" }, { label: "YouTube Eduasi", icon: "📺" }, { label: "Zoom / G-Meet", icon: "📹" }, { label: "WhatsApp Group", icon: "💬" }];
    const DIGITAL_DEVICE = [{ label: "Laptop / Komputer", icon: "💻" }, { label: "Smartphone / Tablet", icon: "📱" }, { label: "LCD Proyektor", icon: "📽️" }, { label: "Speaker Aktif", icon: "🔊" }, { label: "Jaringan Internet", icon: "🌐" }, { label: "Papan Tulis Digital", icon: "🖊️" }];
    const DIGITAL_MEDIA = [{ label: "Video Pembelajaran", icon: "🎞️" }, { label: "Slide Presentasi", icon: "📽️" }, { label: "E-Book / Modul PDF", icon: "📄" }, { label: "Game Eduasi", icon: "🧩" }, { label: "Infografis Digital", icon: "🖼️" }, { label: "Podcast / Audio", icon: "🎙️" }];

    let currentModuleData = { custom_data: {} };
    let isProcessing = false;

    window.saveInputs = function() { 
        const inputs = document.querySelectorAll('input[type="text"], textarea, select'); 
        inputs.forEach(i => { if(i.id && i.id !== 'cp_preview') currentModuleData[i.id] = i.value; }); 
    }

    function getRekomendasiPendekatan() {
        const m = currentModuleData.model;
        const mat = (currentModuleData.materi || "").toLowerCase();
        const mapel = (currentModuleData.mapel || "").toLowerCase();
        if (mat.includes("ka") || mat.includes("koding") || mat.includes("artifisial") || mapel.includes("koding & kecerdasan artificial (kka)")) return { pendekatan: "Pembelajaran Mendalam (Deep Learning)", alasan: "Materi Kecerdasan Artifisial membutuhkan pemahaman konseptual yang mendalam." };
        if (m && m.includes("Problem Based")) return { pendekatan: (mapel.includes("ilmu pengetahuan alam & sosial") || mapel.includes("matematika")) ? "Saintifik (Scientific)" : "Konstruktivisme", alasan: "Mendorong siswa membangun solusi atas permasalahan secara mendiri." };
        if (m && m.includes("Project Based")) return { pendekatan: "Kontekstual (CTL)", alasan: "Menghubungkan proyek nyata dengan lingkungan sekitar siswa." };
        if (m && (m.includes("Discovery") || m.includes("Inquiry"))) return { pendekatan: "Saintifik (Scientific)", alasan: "Mendukung tahapan observasi dan nalar sistematis." };
        return { pendekatan: "Berorientasi pada Murid (Student-Centered)", alasan: "Mengutamakan partisipasi aktif siswa dalam proses belajar." };
    }

    function getRekomendasiMetode() {
        const p = currentModuleData.pendekatan;
        if (!p) return null;
        const map = {
            "Pembelajaran Mendalam (Deep Learning)": ["Metode Diskusi", "Metode Demonstrasi", "Metode Observasi"],
            "Saintifik (Scientific)": ["Metode Observasi", "Metode Tanya Jawab", "Metode Diskusi Kelompok"],
            "Kontekstual (CTL)": ["Metode Observasi", "Metode Bermain Peran", "Metode Diskusi"],
            "Berorientasi pada Murid (Student-Centered)": ["Metode Diskusi Kelompok", "Metode Tanya Jawab", "Metode Bermain Peran"],
            "Diferensiasi (Differentiated Instruction)": ["Metode Diskusi Kelompok", "Metode Demonstrasi", "Metode Tanya Jawab"],
            "Konstruktivisme": ["Metode Diskusi", "Metode Observasi", "Metode Dasar"]
        };
        return map[p] || ["Metode Diskusi", "Metode Tanya Jawab", "Metode Diskusi Kelompok"];
    }

    function navigateTo(page) {
      if (page === 'create') {
        currentStep = 0;
        currentModuleData = { judul_modul: '', penyusun: 'Roni H. Bhidju, S.Pd.,Gr.', sekolah: 'SD Negeri Fatubai', kepala_sekolah_nama: 'Darius Kusi, S.Pd., Gr.', kepala_sekolah_nip: '196709102008011008', penyusun_nip: '198603012020121005', tahun_ajar: '2024/2025', fase_kelas: 'Fase C / Kelas 5', semester: '1 (Ganjil)', mapel: '', elemen: '', materi: '', alokasi_waktu: '2 x 35 Menit (1 kali pertemuan)', cp: '', tp: '', pendekatan: '', model: '', metode: [], profil_lulusan: [], mitra_internal: [], mitra_eksternal: [], lingkungan_fisik: [], budaya_belajar: [], media_non_digital: [], platform_aplikasi: [], perangkat_digital: [], media_digital: [], selected_materi: [], selected_karakteristik: [], pengetahuan_awal: '', lintas_disiplin: '', kebutuhan_murid: '', validasi_langkah: '', validasi_asesmen: '', validasi_lkpd: '', validasi_rubrik: '', validasi_evaluasi: '', relevansi_materi: '', custom_data: { karakteristik: [], metode: [], mitra_internal: [], mitra_eksternal: [], lingkungan_fisik: [], budaya_belajar: [], media_non_digital: [], platform_aplikasi: [], perangkat_digital: [], media_digital: [] }, history: {}, history_idx: {} };
      } else if (page === 'archive') currentStep = -2; else if (page === 'contact') currentStep = -3; else if (page === 'progress') currentStep = -4; else currentStep = -1;
      render();
    }
    window.navigateTo = navigateTo;

    window.setJudul = function(val) {
        currentModuleData.judul_modul = val;
        const el = document.getElementById('judul_modul');
        if(el) el.value = val;
        showToast("✅ Judul Diatur!");
    };

    window.updateStep0 = function() {
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

    window.updateStep3Model = function(val) {
        currentModuleData.model = val;
        const sintaksArea = document.getElementById('sintaks-area-container');
        if (sintaksArea) {
            if (val && SINTAKS_DATA[val]) {
                sintaksArea.innerHTML = \`<div class="p-6 bg-white border-4 border-slate-200 rounded-3xl shadow-inner animate-fade-in"><h4 class="text-xs font-black uppercase mb-3">📌 Alur Sintak:</h4><div class="text-[10px] font-extrabold uppercase leading-relaxed text-slate-700">\${SINTAKS_DATA[val].steps.join(" ▶ ")}</div></div>\`;
            } else {
                sintaksArea.innerHTML = '';
            }
        }
        const recArea = document.getElementById('recommendation-area-container');
        if (recArea) {
            if (val && !currentModuleData.pendekatan) {
                const recPendekatan = getRekomendasiPendekatan();
                recArea.innerHTML = \`
                    <div class="p-6 bg-blue-100 border-4 border-blue-300 rounded-3xl shadow-lg animate-fade-in">
                        <p class="text-[11px] uppercase font-black text-blue-900 mb-3 flex items-center gap-2"><span>💡</span> Rekomendasi Pendekatan:</p>
                        <button onclick="window.applyRecPendekatan('\${recPendekatan.pendekatan}')" class="w-full text-left p-3 bg-white rounded-2xl border-2 border-blue-400 hover:scale-[1.02] transition-all">
                            <p class="text-[10px] font-black text-blue-700 uppercase">\${recPendekatan.pendekatan}</p>
                            <p class="text-[8px] text-blue-500 italic mt-1 leading-tight">\${recPendekatan.alasan}</p>
                        </button>
                    </div>
                \`;
            } else {
                recArea.innerHTML = '';
            }
        }
        if (currentModuleData.pendekatan) window.updateStep3Pendekatan(currentModuleData.pendekatan);
    };

    window.applyRecPendekatan = function(p) {
        currentModuleData.pendekatan = p;
        const pSelect = document.getElementById('pendekatan');
        if (pSelect) pSelect.value = p;
        window.updateStep3Pendekatan(p);
        const recArea = document.getElementById('recommendation-area-container');
        if (recArea) recArea.innerHTML = '';
        showToast('✅ Pendekatan Terpilih!');
    };

    window.updateStep3Pendekatan = function(val) {
        currentModuleData.pendekatan = val;
        const recMetodeArea = document.getElementById('metode-rec-area');
        if (recMetodeArea) {
            if (val) {
                const recommendedMethods = getRekomendasiMetode();
                recMetodeArea.innerHTML = \`
                    <div class="p-6 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-lg animate-fade-in">
                        <p class="text-[11px] uppercase font-black text-slate-700 mb-3 flex items-center gap-2"><span>🛠️</span> Rekomendasi Metode:</p>
                        <div class="flex flex-wrap gap-2">
                            \${(() => {
                                const recMethods = getRekomendasiMetode();
                                return recMethods.map(met => {
                                    const isAlreadySelected = (currentModuleData.metode || []).includes(met);
                                    return \\\`<button onclick="window.toggleArrStatic('metode', '\${met}')" class="metode-rec-btn px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border-2 \${isAlreadySelected ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-200'}" data-metode="\${met}">\${met}</button>\\\`;
                                }).join('');
                            })()}
                        </div>
                        <p class="text-[8px] mt-3 text-slate-500 italic">*Klik tombol di atas untuk menambah metode secara otomatis</p>
                    </div>
                \`;
            } else {
                recMetodeArea.innerHTML = '';
            }
        }
    };

    window.toggleArrStatic = function(key, v) {
        if(!currentModuleData[key]) currentModuleData[key] = [];
        const idx = currentModuleData[key].indexOf(v);
        if(idx > -1) {
            currentModuleData[key].splice(idx,1);
        } else {
            const limit = (key === 'profil_lulusan') ? 3 : (key === 'metode') ? 4 : 99;
            if(currentModuleData[key].length < limit) {
                currentModuleData[key].push(v);
            } else {
                showToast(\`⚠️ Batas \${limit}!\`);
                return;
            }
        }
        const allLabels = document.querySelectorAll(\`[data-key="\${key}"][data-val="\${v}"]\`);
        allLabels.forEach(label => {
            const isSelected = currentModuleData[key].includes(v);
            if (isSelected) {
                label.classList.remove('border-orange-400', 'bg-orange-50');
                label.classList.add('border-orange-600', 'bg-white', 'shadow-xl', 'scale-[1.03]');
                label.querySelector('input').checked = true;
            } else {
                label.classList.add('border-orange-400', 'bg-orange-50');
                label.classList.remove('border-orange-600', 'bg-white', 'shadow-xl', 'scale-[1.03]');
                label.querySelector('input').checked = false;
            }
        });
        const recBtns = document.querySelectorAll(\`.metode-rec-btn[data-metode="\${v}"]\`);
        recBtns.forEach(btn => {
            if (currentModuleData[key].includes(v)) {
                btn.classList.add('bg-slate-700', 'text-white', 'border-slate-700');
                btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-300');
            } else {
                btn.classList.remove('bg-slate-700', 'text-white', 'border-slate-700');
                btn.classList.add('bg-white', 'text-slate-600', 'border-slate-300');
            }
        });
        
        if (key === 'profil_lulusan') {
            const profileLabels = document.querySelectorAll(\`[data-key="profil_lulusan"][data-val="\${v}"]\`);
            profileLabels.forEach(lbl => {
                const check = currentModuleData.profil_lulusan.includes(v);
                if (check) {
                    lbl.classList.add('border-emerald-600', 'bg-white', 'shadow-xl', 'scale-[1.05]');
                    lbl.querySelector('input').checked = true;
                } else {
                    lbl.classList.remove('border-emerald-600', 'bg-white', 'shadow-xl', 'scale-[1.05]');
                    lbl.querySelector('input').checked = false;
                }
            });
        }
    };

    let currentStep = -1;
    let lastRenderedStep = -99;

    window.nextStep = function() { 
        window.saveInputs(); 
        const d = currentModuleData;
        
        if (currentStep === 0) {
            if (!d.judul_modul || !d.penyusun || !d.sekolah || !d.mapel || !d.elemen || !d.materi) {
                showToast("⚠️ Lengkapi seluruh data Langkah 1!");
                return;
            }
        }
        
        if (currentStep === 1) {
            if (!d.selected_materi?.length || !d.relevansi_materi || !d.selected_karakteristik?.length || !d.profil_lulusan?.length || !d.pengetahuan_awal || !d.kebutuhan_murid) {
                showToast("⚠️ Lengkapi seluruh data Langkah 2!");
                return;
            }
        }
        
        if (currentStep === 2) {
            if (!d.model || !d.pendekatan || !d.metode?.length) {
                showToast("⚠️ Lengkapi seluruh data Langkah 3!");
                return;
            }
        }

        if (currentStep === 3) {
            if (!d.mitra_internal?.length) {
                showToast("⚠️ Wajib memilih Mitra Internal!");
                return;
            }
        }

        if (currentStep === 4) {
            if (!d.lingkungan_fisik?.length || !d.budaya_belajar?.length) {
                showToast("⚠️ Pilih Lingkungan Fisik & Budaya Belajar!");
                return;
            }
        }

        if (currentStep === 5) {
            if (!(d.platform_aplikasi?.length || d.perangkat_digital?.length || d.media_digital?.length || d.media_non_digital?.length)) {
                showToast("⚠️ Pilih minimal 1 Platform/Perangkat/Media!");
                return;
            }
        }

        if (currentStep < 7) { currentStep++; render(); } 
    }
    window.prevStep = function() { if (currentStep > 0) { currentStep--; render(); } else { currentStep = -1; render(); } }
    
    function render() {
      const app = document.getElementById('app');
      if (!app) return;
      const scrollPos = app.scrollTop;
      if (currentStep === -1) renderHome();
      else if (currentStep === -2) renderArchive();
      else if (currentStep === -3) renderContact();
      else if (currentStep === -4) renderProgress();
      else if (currentStep >= 0) renderCreate();
      app.scrollTop = scrollPos;
      requestAnimationFrame(() => { app.scrollTop = scrollPos; });
      setTimeout(() => { if (app.scrollTop !== scrollPos) app.scrollTop = scrollPos; }, 0);
      lastRenderedStep = currentStep;
    }

    function renderHome() { 
        document.getElementById('app').innerHTML = \`
        <div class="w-full h-full gradient-bg-primary overflow-auto flex items-center justify-center p-4 builder-ui">
            <div class="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-blue-200 flex flex-col animate-fade-in relative">
                <div class="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center select-none">
                    <span class="text-[20rem] font-black">AI</span>
                </div>
                <div class="pt-16 pb-12 px-8 md:px-12 bg-blue-600 text-center border-b-8 border-blue-700 font-black relative overflow-hidden">
                    <div class="absolute inset-0 bg-white/5 skew-y-3 translate-y-12"></div>
                    <div class="flex items-center justify-center gap-6 whitespace-nowrap overflow-hidden relative z-10">
                        <span class="text-5xl md:text-7xl shrink-0 font-black italic drop-shadow-lg">🤖</span>
                        <h2 class="text-4xl md:text-5xl font-black text-[#FFD700] drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] italic tracking-tighter">RonAI ASISTEN</h2>
                    </div>
                </div>
                <div class="p-8 md:p-14 text-center bg-white flex-1 relative z-10">
                    <div class="mb-10">
                        <div class="text-4xl text-blue-600 mb-3">📘</div>
                        <h1 class="text-2xl md:text-4xl font-black text-blue-900 mb-2 uppercase tracking-tight italic">AI CERDAS UNTUK MODUL AJAR</h1>
                        <p class="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs font-black">EDISI FASE C (KELAS 5 & 6) - BSKAP 046/2025</p>
                    </div>
                    <div class="max-w-4xl mx-auto space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6">
                            <button onclick="navigateTo('create')" class="menu-card bg-blue-600 text-white font-black py-3 px-2 border-blue-800 flex flex-col items-center justify-center gap-1">
                                <span class="text-3xl">➕</span>
                                <span class="text-[10px] uppercase italic tracking-widest">Buat Modul</span>
                            </button>
                            <button onclick="navigateTo('archive')" class="menu-card bg-indigo-600 text-white font-black py-3 px-2 border-indigo-800 flex flex-col items-center justify-center gap-1">
                                <span class="text-3xl">📂</span>
                                <span class="text-[10px] uppercase italic tracking-widest">Arsip Modul</span>
                            </button>
                            <button onclick="navigateTo('contact')" class="menu-card bg-blue-600 text-white font-black py-3 px-2 border-blue-800 flex flex-col items-center justify-center gap-1">
                                <span class="text-3xl">👤</span>
                                <span class="text-[10px] uppercase italic tracking-widest">Contact</span>
                            </button>
                        </div>
                        <div class="flex flex-col md:flex-row gap-6 justify-center px-4 md:px-12">
                            <button onclick="navigateTo('progress')" class="flex-1 menu-card bg-emerald-600 text-white font-black py-3 px-2 border-emerald-800 flex flex-col items-center justify-center gap-1">
                                <span class="text-3xl">📈</span>
                                <span class="text-[10px] uppercase italic tracking-widest">Progress Materi</span>
                            </button>
                            <button onclick="window.open('https://youtu.be/7zNqKZTS8w4', '_blank')" class="flex-1 menu-card bg-red-600 text-white font-black py-3 px-2 border-red-800 flex flex-col items-center justify-center gap-1">
                                <span class="text-3xl">📽️</span>
                                <span class="text-[10px] uppercase italic tracking-widest">Tutorial App</span>
                            </button>
                        </div>
                    </div>
                    <div class="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        Designed for Professional Educators
                    </div>
                </div>
            </div>
        </div>\`; 
    }

    function renderContact() {
        document.getElementById('app').innerHTML = \`
        <div class="w-full h-full gradient-bg-primary overflow-auto flex items-center justify-center p-4 builder-ui">
            <div class="max-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-indigo-200 animate-fade-in relative p-8 text-center flex flex-col items-center">
                <div class="w-48 h-48 bg-indigo-50 rounded-full mb-6 border-4 border-indigo-500 shadow-xl flex items-center justify-center overflow-hidden">
                    <svg class="w-28 h-28 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h2 class="text-xl md:text-2xl font-black text-indigo-900 italic leading-tight mb-2 whitespace-nowrap">Roni Hariyanto Bhidju, S.Pd.,Gr.</h2>
                <div class="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 mb-8 shadow-sm">
                   <p class="text-[14px] font-black text-[#FFD700] italic leading-relaxed uppercase text-center">
                    * Guru SD DEDIKATIF NTT 2023<br>
                    * Guru SD TRANSFORMATIF NTT 2025
                   </p>
                </div>
                <div class="flex flex-col w-full gap-3">
                    <button onclick="window.open('https://www.facebook.com/share/1DXzxmC4oN/', '_blank')" class="w-full btn-primary text-white font-black py-4 rounded-2xl shadow-lg uppercase italic flex items-center justify-center gap-2 tracking-tighter"><span>🌐</span> Hubungi</button>
                    <button onclick="navigateTo('home')" class="w-full bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl uppercase text-xs italic hover:bg-slate-200 transition-all">Kembali</button>
                </div>
            </div>
        </div>\`;
    }

    function renderProgress() {
        const modules = typeof window.getAllModules !== 'undefined' ? window.getAllModules() : [];
        const isModuleExist = (mapel, topic, subMaterial) => {
            return modules.some(m => m.mapel === mapel && m.materi === topic && (m.selected_materi || []).includes(subMaterial));
        };
        let tableRows = '';
        let globalIdx = 1;
        Object.keys(CP_DATABASE_FASE_C).forEach(mapel => {
            const elemenData = CP_DATABASE_FASE_C[mapel].elemen;
            Object.keys(elemenData).forEach(elemen => {
                const topiks = elemenData[elemen].topik;
                topiks.forEach(topik => {
                    topik.materi.forEach(sub => {
                        const exists = isModuleExist(mapel, topik.judul, sub.label);
                        tableRows += \`
                            <tr class="\${exists ? 'row-completed' : ''} font-bold italic">
                                <td class="text-center font-black">\${globalIdx++}</td>
                                <td>\${mapel}</td>
                                <td>\${topik.judul}</td>
                                <td>\${sub.label}</td>
                                <td class="text-center text-[14px]">
                                    \${exists ? '<span class="text-completed">✅ SUDAH</span>' : '<span class="text-slate-300">❌ BELUM</span>'}
                                </td>
                            </tr>
                        \`;
                    });
                });
            });
        });
        document.getElementById('app').innerHTML = \`
        <div class="min-h-screen bg-slate-50 p-6 md:p-12 builder-ui animate-fade-in">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-wrap justify-between items-center mb-10 gap-4 font-black italic">
                    <div>
                        <h2 class="text-4xl font-black text-indigo-900 uppercase">📈 Progress Perencanaan</h2>
                        <p class="text-sm text-indigo-500 uppercase tracking-widest mt-1">Pemetaan Materi & Sub-Materi Ter-Generate</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.downloadProgressPDF()" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:scale-105 transition-all">📥 Download PDF (Landscape)</button>
                        <button onclick="navigateTo('home')" class="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-bold uppercase text-xs">Kembali</button>
                    </div>
                </div>
                <div id="progress-capture-area" class="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-indigo-100 overflow-x-auto progress-container-print">
                    <h3 class="doc-main-title no-print hidden !mb-10 text-center font-black italic">DAFTAR MATA PELAJARAN, MATERI POKOK DAN SUB MATERI</h3>
                    <table class="progress-table">
                        <thead>
                            <tr class="font-black italic">
                                <th class="text-center w-12">No</th>
                                <th class="w-1/4">Mata Pelajaran</th>
                                <th class="w-1/4">Topik / Materi Pokok</th>
                                <th class="w-1/4">Sub Materi (Materi Ajar)</th>
                                <th class="text-center w-24">Status Modul</th>
                            </tr>
                        </thead>
                        <tbody>\${tableRows}</tbody>
                    </table>
                </div>
                <div class="mt-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200 font-black italic">
                    <p class="text-[10px] text-blue-800 uppercase leading-relaxed">
                        💡 Catatan: Penandaan hijau otomatis aktif jika Anda telah menyimpan modul di menu Arsip. Gunakan data ini untuk memastikan seluruh elemen Capaian Pembelajaran Fase C terpenuhi 100%.
                    </p>
                </div>
            </div>
        </div>\`;
    }

    window.downloadProgressPDF = function() {
        const element = document.getElementById('progress-capture-area');
        const opt = { margin: 10, filename: 'Progress_Modul_Ajar_Fase_C.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, logging: false, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true } };
        const title = element.querySelector('.doc-main-title');
        title.classList.remove('hidden'); title.style.display = 'block';
        html2pdf().set(opt).from(element).save().then(() => { title.classList.add('hidden'); title.style.display = 'none'; });
    }

    window.showKonfirmasiModal = function() {
        window.saveInputs();
        const d = currentModuleData;
        if (!d.tp || !d.validasi_langkah || !d.validasi_asesmen || !d.validasi_rubrik) { showToast("⚠️ Wajib Generate Tujuan, Langkah, Asesmen & Rubrik!"); return; }
        const modal = document.getElementById('modal-container');
        modal.innerHTML = \`
        <div class="modal-overlay">
            <div class="modal-content !w-[450px] font-black italic">
                <h3 class="text-xl font-black text-indigo-900 mb-6 text-center uppercase tracking-tighter italic">⚙️ Konfirmasi Identitas</h3>
                <div class="space-y-4 mb-8">
                    <div class="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                        <label class="block text-[10px] uppercase text-indigo-600 mb-1">📍 tempat & Tanggal Pembuatan</label>
                        <input type="text" id="konfirmasi_tempat_val" class="input-modern p-2 rounded-xl mb-2 text-sm" placeholder="Contoh: Kefamenanu" value="\${d.konfirmasi_tempat || ''}">
                        <input type="text" id="konfirmasi_tanggal_val" class="input-modern p-2 rounded-xl text-sm" placeholder="Contoh: 14 Januari 2026" value="\${d.konfirmasi_tanggal || ''}">
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                        <label class="block text-[10px] uppercase text-indigo-600 mb-1">👤 Penyusun: <b>\${d.penyusun || '-'}</b></label>
                        <input type="text" id="penyusun_nip_val" class="input-modern p-3 rounded-xl text-sm" placeholder="NIP/NUPTK Penyusun" value="\${d.penyusun_nip || ''}">
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                        <label class="block text-[10px] uppercase text-indigo-600 mb-1">🏫 Kepala Sekolah</label>
                        <input type="text" id="ks_nama_val" class="input-modern p-2 rounded-xl mb-2 text-sm" placeholder="Nama Kepala Sekolah" value="\${d.kepala_sekolah_nama || ''}">
                        <input type="text" id="ks_nip_val" class="input-modern p-2 rounded-xl text-sm" placeholder="NIP Kepala Sekolah" value="\${d.kepala_sekolah_nip || ''}">
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <button onclick="window.processKonfirmasi()" class="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase italic tracking-tighter">💾 Simpan & Generate Modul</button>
                    <button onclick="window.closeModal()" class="w-full bg-slate-100 text-slate-500 font-bold py-2 rounded-xl text-[10px] italic">Batal</button>
                </div>
            </div>
        </div>\`;
    };

    window.processKonfirmasi = function() {
        currentModuleData.konfirmasi_tempat = document.getElementById('konfirmasi_tempat_val').value;
        currentModuleData.konfirmasi_tanggal = document.getElementById('konfirmasi_tanggal_val').value;
        currentModuleData.penyusun_nip = document.getElementById('penyusun_nip_val').value;
        currentModuleData.kepala_sekolah_nama = document.getElementById('ks_nama_val').value;
        currentModuleData.kepala_sekolah_nip = document.getElementById('ks_nip_val').value;
        closeModal(); window.nextStep();
    };
    
    function renderArchive() { 
        const modules = typeof window.getAllModules !== 'undefined' ? window.getAllModules() : []; 
        document.getElementById('app').innerHTML = \`
        <div class="min-h-screen bg-slate-50 p-6 md:p-12 builder-ui font-black italic animate-fade-in">
            <div class="max-w-5xl mx-auto">
                <div class="flex flex-wrap justify-between items-center mb-10 gap-4">
                    <h2 class="text-4xl font-black text-blue-900 uppercase">📂 Arsip Modul</h2>
                    <div class="flex gap-2">
                        <button onclick="navigateTo('progress')" class="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold uppercase text-xs shadow-md hover:scale-105 transition-all">📈 Cek Progress</button>
                        <button onclick="navigateTo('home')" class="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl font-bold uppercase text-xs">Kembali</button>
                    </div>
                </div>
                \${modules.length === 0 ? \`<h3 class="text-center text-slate-400 font-black italic">Arsip Kosong</h3>\` : \`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-black italic">\${modules.map((m, i) => { const theme = ITEM_PALETTE[i % ITEM_PALETTE.length]; return \`<div class="bg-white p-6 rounded-[2rem] shadow-lg border-4 \${theme.border} flex flex-col justify-between italic"><div><h3 class="text-xl font-black text-blue-900 uppercase mb-2 font-black italic">\${m.judul_modul || 'Untitled'}</h3><p class="text-xs italic font-black">\${m.mapel} | \${m.penyusun}</p></div><div class="flex gap-2 mt-4"><button onclick="window.openModule('\${m.__backendId}')" class="flex-1 btn-primary text-white font-bold py-3 rounded-xl uppercase italic font-black italic">Buka File</button><button onclick="window.deleteModule('\${m.__backendId}')" class="bg-red-50 text-red-500 px-4 rounded-xl border-2 border-red-100 hover:bg-red-100 transition-colors italic">🗑️</button></div></div>\`; }).join('')}</div>\`}
            </div>
        </div>\`; 
    }

    window.openModule = function(id) { const modules = typeof window.getAllModules !== 'undefined' ? window.getAllModules() : []; const found = modules.find(m => m.__backendId === id); if (found) { currentModuleData = found; currentStep = 7; render(); showToast("📂 Modul Berhasil Dibuka!"); } }
    window.deleteModule = function(id) { if (window.dataSdk) { window.dataSdk.delete(id); showToast("🗑️ Modul Dihapus!"); } }
`;

fs.writeFileSync('/app/applet/public/build_c1.js', htmlContent);
console.log('Part 1 saved.');
