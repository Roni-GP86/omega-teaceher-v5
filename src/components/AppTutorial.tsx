import React, { useState, useEffect } from "react";
import { 
  Video, 
  Search, 
  Edit3, 
  Save, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  Info, 
  Check, 
  Undo,
  Youtube,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TutorialItem {
  id: string;
  category: "ACADEMIC" | "OFFLINE" | "GENERAL";
  label: string;
  menuName: string;
  desc: string;
  videoUrl: string;
  notes: string;
}

const DEFAULT_TUTORIALS: TutorialItem[] = [
  {
    id: "api_key",
    category: "GENERAL",
    label: "Tutorial Konfigurasi Kunci API Gemini Cerdas",
    menuName: "Penyetelan API Key",
    desc: "Prosedur pendaftaran dan input kunci API Gemini AI secara gratis guna mengaktifkan asisten AI cerdas pengurai CP/TP otomatis, perencana modul ajar RPM, serta generator kisi-kisi soal evaluasi secara instan.",
    videoUrl: "",
    notes: "Kunci API disimpan secara aman di dalam local storage browser Anda dan tidak pernah dikirim ke pihak ketiga selain Google AI."
  },
  {
    id: "school_profile",
    category: "ACADEMIC",
    label: "Tutorial Profil Utama Sekolah",
    menuName: "Profil Sekolah",
    desc: "Panduan melengkapi identitas satuan pendidikan, logo sekolah, visi-misi, serta pemilihan daftar mata pelajaran aktif yang akan dimuat di lembar rapor hasil ujian secara dinamis.",
    videoUrl: "",
    notes: "Pastikan Anda memilih mata pelajaran dengan mencentang kotak aktif agar tersaji otomatis di lembar nilai kurikulum merdeka."
  },
  {
    id: "student_profile",
    category: "ACADEMIC",
    label: "Tutorial Profil Registrasi Murid",
    menuName: "Profil Murid",
    desc: "Langkah-langkah meregistrasi data biodata identitas murid, memasukkan NISN/NIS, mengunggah pas foto resmi 3x4, serta melakukan sinkronisasi roster daftar kelas secara massal.",
    videoUrl: "",
    notes: "Gunakan fitur Impor Excel untuk memasukkan ratusan data murid secara instan dalam 3 detik."
  },
  {
    id: "ai_extract",
    category: "ACADEMIC",
    label: "Tutorial Analisis CP & Deskripsi AI",
    menuName: "Analisis CP CP/TP",
    desc: "Cara mengekstrak dokumen beralur tebal dari BSKAP Kemendikbud menggunakan asisten AI untuk merumuskan deskripsi materi kompetensi dasar pembelajaran tertinggi & terendah secara otomatis.",
    videoUrl: "",
    notes: "Kunci API Gemini harus diatur terlebih dahulu melalui tombol topbar untuk mengaktifkan parser kognitif AI."
  },
  {
    id: "kosp",
    category: "ACADEMIC",
    label: "Tutorial Penyusun Draf KOSP Otomatis",
    menuName: "KOSP Kurikulum Merdeka",
    desc: "Panduan merancang dokumen Kurikulum Operasional di Satuan Pendidikan (KOSP) yang sesuai konteks karakteristik lingkungan sekolah serta analisis kebutuhan belajar murid.",
    videoUrl: "",
    notes: "Dokumen yang tergenerate dapat diunduh luring dalam ekstensi web yang aman."
  },
  {
    id: "lesson_plan",
    category: "ACADEMIC",
    label: "Tutorial Formulasi TP, ATP & Prota/Promes",
    menuName: "Perencana Pembelajaran",
    desc: "Modul rancangan administrasi guru mencakup penyusunan Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), kriteria ketuntasan (KKTP), dan pembagian Program Tahunan & Semester.",
    videoUrl: "",
    notes: "Modul ini tervalidasi menggunakan rujukan keputusan terbaru BSKAP No. 046 Tahun 2025."
  },
  {
    id: "rpm",
    category: "ACADEMIC",
    label: "Tutorial Rencana Pembelajaran Mendalam (RPM)",
    menuName: "Modul Ajar RPM",
    desc: "Tata cara menyusun rancangan modul ajar berbasis skenario interaktif pembelajaran guru dan murid, lengkap dengan rubrik asesmen formatif sumatif mandiri.",
    videoUrl: "",
    notes: "Pilih tema sub-kriteria ajar untuk menghasilkan modul kustom sesuai tingkat fase kognitif anak didik."
  },
  {
    id: "p5_project",
    category: "ACADEMIC",
    label: "Tutorial Pembentukan Modul Projek P5",
    menuName: "Modul Projek P5",
    desc: "Langkah penyusunan skema tema projek P5, pemilihan dimensi Profil Pelajar Pancasila, pembagian alokasi waktu mingguan/blok, serta perumusan rubrik penilaian rubrik.",
    videoUrl: "",
    notes: "Sesuaikan dengan tema kearifan lokal sekolah untuk menghasilkan luaran modul projek kontekstual."
  },
  {
    id: "daftar_nilai",
    category: "ACADEMIC",
    label: "Tutorial Form Daftar Nilai Komprehensif",
    menuName: "Daftar Nilai Siswa",
    desc: "Panduan pengisian nilai formatif, sumatif materi (Sumatif 1 & 2), lingkup materi kurikulum merdeka, serta kalkulasi otomatis rata-rata akhir untuk menghasilkan nilai rapor murni secara real-time.",
    videoUrl: "",
    notes: "Cukup masukkan nilai asli maka deskripsi capaian kompetensi tertinggi & terendah murid akan terbuat secara insting robotik otomatis."
  },
  {
    id: "rapor",
    category: "ACADEMIC",
    label: "Tutorial Cetak Lembar Rapor Kurikulum Merdeka",
    menuName: "Cetak Rapor",
    desc: "Panduan mencetak lembar rapor resmi hasil belajar siswa per semester lengkap dengan catatan wali kelas, absen kehadiran, tanda tangan kepala sekolah & guru kelas.",
    videoUrl: "",
    notes: "Hanya mata pelajaran terpilih di profil sekolah dengan nilai aktif yang akan dimuat ke berkas cetakan rapor."
  },
  {
    id: "excel",
    category: "OFFLINE",
    label: "Tutorial Excel Password Bypass luring",
    menuName: "Excel Unlocker",
    desc: "Panduan membebaskan proteksi sheet password pada berkas Microsoft Excel secara instan di dalam browser komputer luring tanpa merusak rumus atau data sel di dalamnya.",
    videoUrl: "",
    notes: "File tidak diunggah ke internet, proses dekompresi biner 100% aman diselesaikan secara privat pada hardware Anda."
  },
  {
    id: "word",
    category: "OFFLINE",
    label: "Tutorial Word Pen Bypass & Restriction",
    menuName: "Word Unlocker",
    desc: "Prosedur membuka kunci edit perlindungan (Read-Only) dokumen berekstensi .docx yang dikunci oleh pembuat isi, sehingga Anda bebas melakukan modifikasi data kurikulum.",
    videoUrl: "",
    notes: "Pastikan format dokumen berakhiran .docx murni, bukan .doc format lawas."
  },
  {
    id: "pdf_decrypt",
    category: "OFFLINE",
    label: "Tutorial PDF Restrictions Decryptor",
    menuName: "PDF Decryptor",
    desc: "Menghapus batasan sanksi edit, copy teks, cetak cetakan, atau proteksi sandi izin pada file PDF milik dinas agar dapat disalin dengan fleksibel oleh para guru.",
    videoUrl: "",
    notes: "Tidak membutuhkan internet, penulisan bypass dikerjakan oleh pustaka luring murni."
  },
  {
    id: "pdf_compress",
    category: "OFFLINE",
    label: "Tutorial PDF Compressor & Optimasi Berkas",
    menuName: "PDF Compressor",
    desc: "Cara mengompres ukuran dokumen administrasi guru berkapasitas besar agar hemat penyimpanan saat diupload ke platform kementerian rujukan guru belajar (PMM).",
    videoUrl: "",
    notes: "Gunakan tingkat kompresi medium untuk mempertahankan keterbacaan teks lampiran sertifikat."
  },
  {
    id: "backup_restore",
    category: "GENERAL",
    label: "Tutorial Ekspor / Impor Backup & Restore Data",
    menuName: "Cadangan & Pemulihan (Backup/Restore)",
    desc: "Prosedur mengamankan seluruh basis data lokal sekolah, biodata murid, pengaturan kurikulum KOSP, perencana belajar TP/ATP/RPM, daftar nilai, serta cetak rapor ke dalam bentuk berkas tunggal terenkripsi (.json) untuk dipindahkan atau disinkronkan ke komputer baru secara luring tanpa memerlukan internet.",
    videoUrl: "",
    notes: "Lakukan pencadangan (backup) secara berkala (misal setiap akhir pekan). Simpan file cadangan .json Anda di flashdisk atau Google Drive sebagai cadangan utama guru pintar."
  }
];

export default function AppTutorial() {
  const [tutorials, setTutorials] = useState<TutorialItem[]>(DEFAULT_TUTORIALS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "GENERAL" | "ACADEMIC" | "OFFLINE">("ALL");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<string>("");
  const [editMenuName, setEditMenuName] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  useEffect(() => {
    // Check if user is administrator
    const checkAdmin = () => {
      const isSessionAdmin = sessionStorage.getItem("omega_admin_logged_in") === "true";
      const isLocalAdmin = localStorage.getItem("omega_admin_logged_in") === "true";
      setIsAdmin(isSessionAdmin || isLocalAdmin);
    };

    checkAdmin();
    window.addEventListener("omega-state-updated", checkAdmin);
    
    // Load local tutorials overridden values if any
    const saved = localStorage.getItem("omega_app_tutorials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTutorials(parsed);
        }
      } catch (err) {
        console.error("Gagal memuat tutorial kustom:", err);
      }
    }

    return () => {
      window.removeEventListener("omega-state-updated", checkAdmin);
    };
  }, []);

  const startEditing = (item: TutorialItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditMenuName(item.menuName);
    setEditDesc(item.desc);
    setEditUrl(item.videoUrl);
    setEditNotes(item.notes);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSaveTutorial = (id: string) => {
    if (!isAdmin) return;
    
    const updated = tutorials.map(t => {
      if (t.id === id) {
        return {
          ...t,
          label: editLabel.trim(),
          menuName: editMenuName.trim(),
          desc: editDesc.trim(),
          videoUrl: editUrl.trim(),
          notes: editNotes.trim()
        };
      }
      return t;
    });

    setTutorials(updated);
    localStorage.setItem("omega_app_tutorials", JSON.stringify(updated));
    setEditingId(null);
    
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
  };

  const handleResetToDefault = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan seluruh link panduan video tutorial ke setelan bawaan sistem?")) {
      setTutorials(DEFAULT_TUTORIALS);
      localStorage.removeItem("omega_app_tutorials");
      setEditingId(null);
    }
  };

  // Filter list
  const filteredTutorials = tutorials.filter(t => {
    const matchesSearch = t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "ALL") return matchesSearch;
    return t.category === activeFilter && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 text-left"
    >
      {/* 🔮 TOP INTRO TERMINAL BLOCK */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#0a0f24] to-zinc-950 border border-indigo-950/60 rounded-2xl p-5 md:p-6 w-full flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[15%] h-full opacity-[0.03] pointer-events-none flex items-center justify-end pr-6">
          <Youtube className="w-16 h-16 text-red-500" />
        </div>
        
        <div className="space-y-1 select-none">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-mono text-[9px] mb-1.5 border border-red-500/20">
            <Video className="w-3 h-3 text-red-400 animate-pulse" />
            live_tutorial_hub_v3
          </div>
          <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase font-display">
            ⚔️ STUDIO TUTORIAL & PANDUAN UTAMA APLIKASI
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-sans mt-0.5">
            Berikut seluruh daftar panduan visual interaktif pengerjaan menu administrasi kami. Klik langsung <b>Buka Video Tutorial</b> di bawah tiap kartu untuk memutar panduan di luar batasan proteksi sistem/jaringan Anda.
          </p>
        </div>

        {/* Admin status tag / Reset options combo */}
        <div className="shrink-0 flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleResetToDefault}
              className="text-[10px] font-mono font-bold text-zinc-500 hover:text-red-400 border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 transition px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <Undo className="w-3 h-3" /> Reset Bawaan
            </button>
          )}

          {isAdmin ? (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-2.5 px-4 rounded-xl text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] select-none">
              <div className="flex items-center gap-1.5 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase">OTORISASI ADMIN</span>
              </div>
              <span className="block text-[9px] text-zinc-500 font-sans mt-0.5">Akses Edit Tautan Terbuka</span>
            </div>
          ) : (
            <div className="bg-zinc-950/80 border border-zinc-900 text-zinc-500 p-2.5 px-4 rounded-xl text-center select-none">
              <div className="flex items-center gap-1.5 justify-center">
                <Lock className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase">LOG TAMU</span>
              </div>
              <span className="block text-[8.5px] text-zinc-600 font-sans mt-0.5">Gunakan Admin untuk Edit Link</span>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari menu tutorial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060608] border border-zinc-850 text-zinc-200 placeholder-zinc-650 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 font-sans"
          />
        </div>

        {/* Category selector */}
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {(["ALL", "GENERAL", "ACADEMIC", "OFFLINE"] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`py-1.5 px-4 rounded-lg text-[9.5px] font-bold tracking-wider uppercase transition select-none cursor-pointer whitespace-nowrap ${
                activeFilter === f
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black shadow-[0_2px_8px_rgba(245,158,11,0.08)]"
                  : "bg-[#060608] border border-zinc-900 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f === "ALL" ? "Semua" : f === "GENERAL" ? "Kunci API" : f === "ACADEMIC" ? "Akademis" : "Bypass Luring"}
            </button>
          ))}
        </div>
      </div>

      {/* TUTORIAL CARDS RESPONSIVE GRID - 100% VISIBLE WITH NO IFRAME BLOCKS OR 2 SCROLLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((t, idx) => {
              const numStr = String(idx + 1).padStart(2, "0");
              const isBeingEdited = editingId === t.id;

              return (
                <motion.div
                  layoutId={`tutorial-layout-card-${t.id}`}
                  key={t.id}
                  className="bg-[#05070d] border border-zinc-900 hover:border-yellow-400/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden group min-h-[340px]"
                >
                  {/* Glowing thin border line on hover */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* TOP HEADER SECTION */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2.5">
                      {/* Round numeric index badge, styled so 0 doesn't look like 8 (using clean font-sans text-xs) */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-extrabold bg-zinc-950 text-yellow-400 border border-yellow-400/30 shadow-[0_0_8px_rgba(250,204,21,0.15)] group-hover:border-yellow-400 transition-colors duration-300 shrink-0">
                        {numStr}
                      </div>

                      {/* Small badge tagging */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[8px] font-mono leading-none px-2 py-0.75 rounded border ${
                          t.category === "GENERAL" 
                            ? "bg-amber-950/40 text-amber-400 border-amber-900/20" 
                            : t.category === "ACADEMIC" 
                              ? "bg-indigo-950/40 text-indigo-400 border-indigo-900/20" 
                              : "bg-teal-950/40 text-teal-400 border-teal-900/20"
                        }`}>
                          {t.category === "GENERAL" ? "KUNCI API" : t.category === "ACADEMIC" ? "AKADEMIS" : "LURING SUITE"}
                        </span>

                        {/* Admin Inline Edit Button */}
                        {isAdmin && !isBeingEdited && (
                          <button
                            onClick={() => startEditing(t)}
                            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-amber-400 hover:border-amber-500/30 transition cursor-pointer"
                            title="Edit Link atau Informasi Kartu Ini"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* CARD CONTENT BODY WITH OPTIONAL EDIT FORM */}
                    {!isBeingEdited ? (
                      <div className="space-y-2">
                        <div>
                          <strong className="text-[10px] font-mono tracking-widest text-[#777] uppercase block leading-none mb-1">
                            {t.menuName}
                          </strong>
                          <h3 className="text-[13px] font-black text-white leading-snug group-hover:text-yellow-400 transition-colors duration-200">
                            {t.label}
                          </h3>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light">
                          {t.desc}
                        </p>

                        {/* Tip notes */}
                        {t.notes && (
                          <div className="bg-amber-500/[0.03] border border-amber-500/15 rounded-xl p-3 flex gap-2.5 text-[10px] text-zinc-400 font-sans leading-relaxed mt-2.5">
                            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-400 block font-mono text-[8px] tracking-wider uppercase mb-0.5">TIPS UTAMA:</strong>
                              {t.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Inline edit form inside the card
                      <div className="space-y-3 pt-1 text-xs">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Nama Menu (Atas):</label>
                          <input
                            type="text"
                            value={editMenuName}
                            onChange={(e) => setEditMenuName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-zinc-100 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Judul Panduan:</label>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Link URL YouTube:</label>
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-amber-300 font-mono rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Ringkasan Deskripsi:</label>
                          <textarea
                            rows={3}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500 resize-none font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Catatan Tips:</label>
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={cancelEditing}
                            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 text-[10px] font-medium hover:bg-zinc-850"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveTutorial(t.id)}
                            className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-[10px] px-3 py-1 rounded flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> Simpan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM BUTTON ACTION ROW */}
                  {!isBeingEdited && (
                    <div className="pt-2 border-t border-zinc-900/40 shrink-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!t.videoUrl) {
                            setNotifMessage("Mohon maaf tutorial belum tersedia, masih dalam proses perekaman!");
                          } else {
                            window.open(t.videoUrl, "_blank", "noopener,noreferrer");
                          }
                        }}
                        className="w-full bg-red-650 hover:bg-red-500 text-white font-extrabold font-sans text-[11px] py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_12px_rgba(220,38,38,0.2)] group-hover:shadow-[0_4px_16px_rgba(220,38,38,0.35)] cursor-pointer"
                      >
                        <Youtube className="w-4 h-4 text-white" />
                        <span>Buka Video Tutorial</span>
                        <ExternalLink className="w-3 h-3 text-red-100 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center p-12 bg-black/40 border border-dashed border-zinc-850 rounded-2xl text-zinc-500 font-mono text-xs">
              Tidak ada tutorial yang cocok dengan kata kunci pencarian.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER DESCLAMER SUMMARY */}
      <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-[10.5px] text-zinc-500 font-sans leading-relaxed select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>
            <b>Sistem Pembelajaran Mandiri Luring:</b> Semua link video di atas merujuk ke data resmi tutorial di platform YouTube. 
          </span>
         </div>
         <span className="text-[9px] text-[#555] font-mono leading-none tracking-wider uppercase">
           video_learning_studio_build_v3
         </span>
       </div>

      {/* GORGEOUS CUSTOM ALERT NOTIFICATION MODAL */}
      <AnimatePresence>
        {notifMessage && (
          <div className="fixed inset-0 h-screen w-screen z-[100] flex items-start justify-center p-4 pt-[12vh] md:pt-[15vh] bg-black/85 backdrop-blur-sm animate-fade-in overflow-hidden">
            <div 
              onClick={() => setNotifMessage(null)}
              className="absolute inset-0 cursor-pointer bg-transparent"
            />
            <div className="relative w-full max-w-sm bg-zinc-950 border border-red-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] text-center space-y-4 transform scale-100 transition-all duration-300">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-black font-mono text-zinc-150 uppercase tracking-wider">INFORMASI TUTORIAL</h4>
                <p className="text-[11.5px] text-zinc-300 font-sans leading-relaxed pt-1">
                  {notifMessage}
                </p>
              </div>
              <button
                onClick={() => setNotifMessage(null)}
                className="w-full py-2.5 bg-red-650 hover:bg-red-600 text-white font-extrabold text-[10.5px] font-mono uppercase rounded-xl transition duration-150 hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] active:scale-[0.98] cursor-pointer"
              >
                TUTUP PESAN
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
