import React, { useState, useRef, useMemo, useEffect } from "react";
import { 
  BookOpen, Sparkles, Download, Copy, Check, AlertTriangle, 
  RefreshCw, ArrowRight, Eye, Edit3, HelpCircle, FileText, CheckCircle,
  UploadCloud, File, Database, School, Users, Clock, Layers, ExternalLink
} from "lucide-react";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { CinematicLoading } from "./CinematicLoading";
import { SmartTooltip } from "./SmartTooltip";

const CP_PRESETS = [
  {
    id: "matematika-b",
    mapel: "Matematika",
    faseKelas: "Fase B (Kelas 4)",
    alokasiJp: "4",
    title: "Matematika - Fase B (Bilangan & Cacah)",
    cpText: "Elemen Bilangan: Peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000. Mereka dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi dan dekomposisi bilangan tersebut. Mereka juga dapat menyelesaikan masalah berkaitan dengan uang, perkalian, dan pembagian bilangan cacah sampai 100."
  },
  {
    id: "bahasa-c",
    mapel: "Bahasa Indonesia",
    faseKelas: "Fase C (Kelas 5)",
    alokasiJp: "5",
    title: "Bahasa Indonesia - Fase C (Membaca & Memaknai)",
    cpText: "Elemen Membaca dan Memirsa: Peserta didik mampu membaca teks dengan pola suku kata kompleks dan membaca cepat secara lancar. Peserta didik mampu memaknai kosakata baru dan istilah ilmiah dalam teks informatif dari tayangan digital / cetak, serta mengidentifikasi gagasan pokok, ide pendukung, dan pesan moral dari teks narasi sastra."
  },
  {
    id: "ipas-b",
    mapel: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    faseKelas: "Fase B (Kelas 4)",
    alokasiJp: "4",
    title: "IPAS - Fase B (Fungsi Tubuh & Ekologi)",
    cpText: "Elemen Pemahaman IPAS: Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia (pancaindra) dan tumbuhan. Mereka mampu mendeskripsikan tahapan siklus hidup makhluk hidup dan mengaitkannya dengan upaya pelestarian lingkungan biotik dan abiotik di sekitarnya."
  },
  {
    id: "pancasila-d",
    mapel: "Pendidikan Pancasila",
    faseKelas: "Fase D (Kelas 8)",
    alokasiJp: "3",
    title: "Pendidikan Pancasila - Fase D (UUD 1945)",
    cpText: "Elemen Undang-Undang Dasar Negara Republik Indonesia Tahun 1945: Peserta didik mampu menganalisis kronologi perumusan dan pengesahan UUD NRI Tahun 1945. Peserta didik juga memahami fungsi penting kesepakatan bersama, tata tertib norma di sekolah dan masyarakat luas, serta berpartisipasi aktif merancang solusi atas dinamika pelanggaran aturan kelas."
  }
];

const DEFAULT_SD_SUBJECTS: Record<string, string> = {
  agamaIslam: "Pendidikan Agama Islam dan Budi Pekerti",
  agamaKristen: "Pendidikan Agama Kristen dan Budi Pekerti",
  agamaKatolik: "Pendidikan Agama Katolik dan Budi Pekerti",
  agamaHindu: "Pendidikan Agama Hindu dan Budi Pekerti",
  agamaBudha: "Pendidikan Agama Buddha dan Budi Pekerti",
  agamaKonghucu: "Pendidikan Agama Khonghucu dan Budi Pekerti",
  pancasila: "Pendidikan Pancasila",
  indonesia: "Bahasa Indonesia",
  matematika: "Matematika",
  ipas: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
  pjok: "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  seniMusik: "Seni Musik",
  seniRupa: "Seni Rupa",
  seniTari: "Seni Tari",
  seniTeater: "Seni Teater",
  inggris: "Bahasa Inggris (Muatan Lokal)",
  mulok: "Bahasa Daerah / Muatan Lokal Lainnya"
};

const DEFAULT_SMP_SUBJECTS: Record<string, string> = {
  agamaIslam: "Pendidikan Agama Islam dan Budi Pekerti",
  agamaKristen: "Pendidikan Agama Kristen dan Budi Pekerti",
  agamaKatolik: "Pendidikan Agama Katolik dan Budi Pekerti",
  agamaHindu: "Pendidikan Agama Hindu dan Budi Pekerti",
  agamaBudha: "Pendidikan Agama Buddha dan Budi Pekerti",
  agamaKonghucu: "Pendidikan Agama Khonghucu dan Budi Pekerti",
  pancasila: "Pendidikan Pancasila",
  indonesia: "Bahasa Indonesia",
  matematika: "Matematika",
  ipa: "Ilmu Pengetahuan Alam (IPA)",
  ips: "Ilmu Pengetahuan Sosial (IPS)",
  inggris: "Bahasa Inggris",
  pjok: "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  informatika: "Informatika",
  seniMusik: "Seni Musik",
  seniRupa: "Seni Rupa",
  seniTari: "Seni Tari",
  seniTeater: "Seni Teater",
  prakarya: "Prakarya / Keterampilan",
  mulok: "Muatan Lokal / Bahasa Daerah"
};

const DEFAULT_SMA_SUBJECTS: Record<string, string> = {
  agamaIslam: "Pendidikan Agama Islam dan Budi Pekerti",
  agamaKristen: "Pendidikan Agama Kristen dan Budi Pekerti",
  agamaKatolik: "Pendidikan Agama Katolik dan Budi Pekerti",
  agamaHindu: "Pendidikan Agama Hindu dan Budi Pekerti",
  agamaBudha: "Pendidikan Agama Buddha dan Budi Pekerti",
  agamaKonghucu: "Pendidikan Agama Khonghucu dan Budi Pekerti",
  pancasila: "Pendidikan Pancasila",
  indonesia: "Bahasa Indonesia",
  matematika: "Matematika",
  inggris: "Bahasa Inggris",
  pjok: "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  sejarah: "Sejarah",
  seniMusik: "Seni Musik",
  seniRupa: "Seni Rupa",
  seniTari: "Seni Tari",
  seniTeater: "Seni Teater",
  pkwu: "Prakarya dan Kewirausahaan (PKWU)",
  informatika: "Informatika",
  pilihanFisika: "Fisika (Mapel Pilihan)",
  pilihanKimia: "Kimia (Mapel Pilihan)",
  pilihanBiologi: "Biologi (Mapel Pilihan)",
  pilihanEkonomi: "Ekonomi (Mapel Pilihan)",
  pilihanSosiologi: "Sosiologi (Mapel Pilihan)",
  pilihanGeografi: "Geografi (Mapel Pilihan)",
  pilihanAntropologi: "Antropologi (Mapel Pilihan)",
  mulok: "Muatan Lokal / Bahasa Daerah"
};

const DEFAULT_SMK_SUBJECTS: Record<string, string> = {
  agamaIslam: "Pendidikan Agama Islam dan Budi Pekerti",
  agamaKristen: "Pendidikan Agama Kristen dan Budi Pekerti",
  agamaKatolik: "Pendidikan Agama Katolik dan Budi Pekerti",
  agamaHindu: "Pendidikan Agama Hindu dan Budi Pekerti",
  agamaBudha: "Pendidikan Agama Buddha dan Budi Pekerti",
  agamaKonghucu: "Pendidikan Agama Khonghucu dan Budi Pekerti",
  pancasila: "Pendidikan Pancasila",
  indonesia: "Bahasa Indonesia",
  sejarah: "Sejarah",
  pjok: "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  seniMusik: "Seni Musik (Seni Budaya)",
  seniRupa: "Seni Rupa (Seni Budaya)",
  seniTari: "Seni Tari (Seni Budaya)",
  seniTeater: "Seni Teater (Seni Budaya)",
  matematikaKejuruan: "Matematika Kejuruan",
  inggrisKejuruan: "Bahasa Inggris Kejuruan",
  informatika: "Informatika",
  projekIpas: "Projek Ilmu Pengetahuan Alam dan Sosial (IPAS)",
  dasarKejuruan: "Dasar-Dasar Program Keahlian (Kelas X)",
  konsentrasiKeahlian: "Mata Pelajaran Konsentrasi Keahlian (Kelas XI/XII)",
  projekKreatif: "Projek Kreatif dan Kewirausahaan (PKK)",
  pkl: "Praktik Kerja Lapangan (PKL - Kelas XII)",
  kejuruanPilihan: "Mata Pelajaran Pilihan Kejuruan",
  mulok: "Muatan Lokal / Bahasa Daerah"
};

const STANDARD_MAPELS = [
  "Matematika",
  "Bahasa Indonesia",
  "IPAS (Ilmu Pengetahuan Alam & Sosial)",
  "Pendidikan Pancasila",
  "Bahasa Inggris",
  "Pendidikan Agama Islam",
  "Pendidikan Agama Kristen",
  "Pendidikan Agama Katolik",
  "Pendidikan Agama Hindu",
  "Pendidikan Agama Buddha",
  "PJOK (Jasmani & Kesehatan)",
  "Seni Rupa",
  "Seni Musik",
  "Seni Tari",
  "Seni Teater"
];

const getPresetStyler = (id: string) => {
  switch (id) {
    case "matematika-b":
      return {
        borderColor: "hover:border-blue-500/60 hover:shadow-blue-500/10",
        badgeBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        accentLine: "bg-blue-500/80",
        label: "Numerasi",
      };
    case "bahasa-c":
      return {
        borderColor: "hover:border-emerald-500/60 hover:shadow-emerald-500/10",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        accentLine: "bg-emerald-500/80",
        label: "Literasi & Bahasa",
      };
    case "ipas-b":
      return {
        borderColor: "hover:border-cyan-500/60 hover:shadow-cyan-500/10",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
        accentLine: "bg-cyan-500/80",
        label: "Sains & Alam",
      };
    default:
      return {
        borderColor: "hover:border-purple-500/60 hover:shadow-purple-500/10",
        badgeBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        accentLine: "bg-purple-500/80",
        label: "Karakter Pancasila",
      };
  }
};

const kkoCollection = [
  "menganalisis", "mengidentifikasi", "memahami", "menjelaskan", "membandingkan", 
  "menerapkan", "menyelesaikan", "membaca", "menulis", "menyajikan", "merancang", 
  "mengevaluasi", "membuat", "mempraktikkan", "demonstrasikan", "mendemonstrasikan", 
  "merumuskan", "menguraikan", "mengklasifikasikan", "menghubungkan", "menghitung", 
  "memprediksi"
];

export const LessonPlanner: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(() => {
    const saved = localStorage.getItem("omega_lp_step");
    return saved === "2" ? 2 : 1;
  });
  const [activeGuideTab, setActiveGuideTab] = useState<"bskap" | "tp" | "atp" | "sandbox">(() => {
    const saved = localStorage.getItem("omega_lp_active_guide_tab");
    return (saved === "bskap" || saved === "tp" || saved === "atp" || saved === "sandbox") ? saved : "bskap";
  });
  const [sandboxText, setSandboxText] = useState<string>(() => {
    return localStorage.getItem("omega_lp_sandbox_text") || "";
  });
  const [mapel, setMapel] = useState<string>(() => {
    const savedLpMapel = localStorage.getItem("omega_lp_mapel");
    if (savedLpMapel) return savedLpMapel;

    const activeStandardRaw = localStorage.getItem("profile_active_subjects");
    const jenjang = localStorage.getItem("profile_jenjang") || "SD";
    let activeStandardList: string[] = [];
    if (activeStandardRaw) {
      try { activeStandardList = JSON.parse(activeStandardRaw); } catch(e){}
    }
    const standardMap = jenjang === "SMA" 
      ? DEFAULT_SMA_SUBJECTS 
      : jenjang === "SMK"
        ? DEFAULT_SMK_SUBJECTS
        : jenjang === "SMP" 
          ? DEFAULT_SMP_SUBJECTS 
          : DEFAULT_SD_SUBJECTS;
    if (activeStandardList.length > 0 && standardMap[activeStandardList[0] as keyof typeof standardMap]) {
      return standardMap[activeStandardList[0] as keyof typeof standardMap];
    }
    return "Matematika";
  });
  const [faseKelas, setFaseKelas] = useState<string>(() => {
    return localStorage.getItem("omega_lp_fase_kelas") || "Fase B (Kelas 4)";
  });
  const [alokasiJp, setAlokasiJp] = useState<string>(() => {
    return localStorage.getItem("omega_lp_alokasi_jp") || "4";
  });

  // Synchronized Active Subjects from Profil Sekolah
  const activeSubjectsList = useMemo(() => {
    const activeStandardRaw = localStorage.getItem("profile_active_subjects");
    const activeCustomRaw = localStorage.getItem("profile_custom_subjects");
    const jenjang = localStorage.getItem("profile_jenjang") || "SD";

    let activeStandardList: string[] = [];
    if (activeStandardRaw) {
      try { activeStandardList = JSON.parse(activeStandardRaw); } catch(e){}
    }
    const standardMap = jenjang === "SMA" 
      ? DEFAULT_SMA_SUBJECTS 
      : jenjang === "SMK"
        ? DEFAULT_SMK_SUBJECTS
        : jenjang === "SMP" 
          ? DEFAULT_SMP_SUBJECTS 
          : DEFAULT_SD_SUBJECTS;

    if (activeStandardList.length === 0) {
      activeStandardList = Object.keys(standardMap);
    }

    const list: { id: string; label: string; isCustom?: boolean }[] = [];
    activeStandardList.forEach(key => {
      if (standardMap[key]) {
        list.push({ id: key, label: standardMap[key] });
      }
    });

    let activeCustomList: any[] = [];
    if (activeCustomRaw) {
      try { activeCustomList = JSON.parse(activeCustomRaw); } catch(e){}
    }
    activeCustomList.forEach(item => {
      list.push({ id: item.id, label: item.label, isCustom: true });
    });

    return list;
  }, []);
  const [cpText, setCpText] = useState<string>(() => {
    return localStorage.getItem("omega_lp_cp_text") || CP_PRESETS[0].cpText;
  });
  const [tahunAjaran, setTahunAjaran] = useState<string>(() => {
    return localStorage.getItem("omega_lp_tahun_ajaran") || "2026/2027";
  });
  const [namaSekolah, setNamaSekolah] = useState<string>(() => {
    return localStorage.getItem("omega_lp_nama_sekolah") || localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai";
  });
  const [namaGuru, setNamaGuru] = useState<string>(() => {
    return localStorage.getItem("omega_lp_nama_guru") || localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd.,Gr.";
  });
  const [kepalaSekolah, setKepalaSekolah] = useState<string>(() => {
    return localStorage.getItem("omega_lp_kepala_sekolah") || localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd.,Gr";
  });
  const [nipKepala, setNipKepala] = useState<string>(() => {
    return localStorage.getItem("omega_lp_nip_kepala") || localStorage.getItem("kosp_nip_kepala") || "196709192008011008";
  });
  const [tempatPenyusunan, setTempatPenyusunan] = useState<string>(() => {
    return localStorage.getItem("omega_lp_tempat_penyusunan") || localStorage.getItem("kosp_tempat") || "Oehalo";
  });
  const [tanggalPenyusunan, setTanggalPenyusunan] = useState<string>(() => {
    return localStorage.getItem("omega_lp_tanggal_penyusunan") || localStorage.getItem("kosp_tanggal") || "13 Juli 2026";
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [generatedMd, setGeneratedMd] = useState<string>(() => {
    return localStorage.getItem("omega_lp_generated_md") || "";
  });
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("Ready");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-saving updates to localStorage as they occur
  useEffect(() => {
    localStorage.setItem("omega_lp_step", String(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem("omega_lp_active_guide_tab", activeGuideTab);
  }, [activeGuideTab]);

  useEffect(() => {
    localStorage.setItem("omega_lp_sandbox_text", sandboxText);
  }, [sandboxText]);

  useEffect(() => {
    localStorage.setItem("omega_lp_mapel", mapel);
  }, [mapel]);

  useEffect(() => {
    localStorage.setItem("omega_lp_fase_kelas", faseKelas);
  }, [faseKelas]);

  useEffect(() => {
    localStorage.setItem("omega_lp_alokasi_jp", alokasiJp);
  }, [alokasiJp]);

  useEffect(() => {
    localStorage.setItem("omega_lp_cp_text", cpText);
  }, [cpText]);

  useEffect(() => {
    localStorage.setItem("omega_lp_tahun_ajaran", tahunAjaran);
  }, [tahunAjaran]);

  useEffect(() => {
    localStorage.setItem("omega_lp_nama_sekolah", namaSekolah);
  }, [namaSekolah]);

  useEffect(() => {
    localStorage.setItem("omega_lp_nama_guru", namaGuru);
  }, [namaGuru]);

  useEffect(() => {
    localStorage.setItem("omega_lp_kepala_sekolah", kepalaSekolah);
  }, [kepalaSekolah]);

  useEffect(() => {
    localStorage.setItem("omega_lp_nip_kepala", nipKepala);
  }, [nipKepala]);

  useEffect(() => {
    localStorage.setItem("omega_lp_tempat_penyusunan", tempatPenyusunan);
  }, [tempatPenyusunan]);

  useEffect(() => {
    localStorage.setItem("omega_lp_tanggal_penyusunan", tanggalPenyusunan);
  }, [tanggalPenyusunan]);

  useEffect(() => {
    localStorage.setItem("omega_lp_generated_md", generatedMd);
  }, [generatedMd]);

  // Document Bank saving states
  const [isSavedToBank, setIsSavedToBank] = useState<boolean>(false);
  const [savingToBank, setSavingToBank] = useState<boolean>(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  const saveToDocumentBank = () => {
    if (!generatedMd) return;
    setSavingToBank(true);
    try {
      const storedDocs = localStorage.getItem("omega_db_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      
      const newDoc = {
        id: "doc-lp-" + Date.now(),
        name: `Matrik Rencana Ajar - ${mapel} (${faseKelas})`,
        category: "lesson_plan",
        folderId: "f-prota-promes", // Save in Prota & Promes folder
        content: generatedMd,
        size: generatedMd.length,
        createdAt: new Date().toISOString()
      };
      
      const updatedDocs = [...currentDocs, newDoc];
      localStorage.setItem("omega_db_documents", JSON.stringify(updatedDocs));
      setSavedDocId(newDoc.id);
      setIsSavedToBank(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan dokumen ke bank lokal.");
    } finally {
      setSavingToBank(false);
    }
  };

  // File upload state for CP document parsing
  const [cpInputMode, setCpInputMode] = useState<"file" | "text" | "bank">("file");
  const [cpFile, setCpFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string | null>(null);
  const [fileReadingStatus, setFileReadingStatus] = useState<string>("");

  // Bank of Documents list state
  const [bankDocs, setBankDocs] = useState<any[]>([]);
  const [selectedBankDocId, setSelectedBankDocId] = useState<string>("");

  React.useEffect(() => {
    if (cpInputMode === "bank") {
      try {
        const storedDocs = localStorage.getItem("omega_db_documents");
        if (storedDocs) {
          setBankDocs(JSON.parse(storedDocs));
        }
      } catch (err) {
        console.error("Gagal memuat dokumen dari bank:", err);
      }
    }
  }, [cpInputMode]);

  const handleFileRead = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (ext === "pdf" || selectedFile.type === "application/pdf") {
      setCpFile(selectedFile);
      setErrorMsg(null);
      setFileReadingStatus("Membaca berkas PDF...");
      
      const reader = new FileReader();
      reader.onerror = () => {
        setErrorMsg("Gagal membaca file lokal.");
        setFileReadingStatus("");
      };
      reader.onload = (e) => {
        try {
          const resultStr = e.target?.result as string;
          const b64 = resultStr.split(",")[1];
          setFileBase64(b64);
          setFileMime("application/pdf");
          setCpText(""); // Clear text since we will process PDF on the server
          setFileReadingStatus("Dokumen PDF siap diproses.");
        } catch (err) {
          setErrorMsg("Gagal memproses berkas PDF.");
          setFileReadingStatus("");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else if (ext === "txt" || selectedFile.type === "text/plain") {
      setCpFile(selectedFile);
      setErrorMsg(null);
      setFileReadingStatus("Membaca berkas TXT...");
      
      const reader = new FileReader();
      reader.onerror = () => {
        setErrorMsg("Gagal membaca file TXT.");
        setFileReadingStatus("");
      };
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          setCpText(text);
          setFileBase64(null);
          setFileMime(null);
          setFileReadingStatus("Teks dari berkas TXT berhasil dimuat.");
        } catch (err) {
          setErrorMsg("Gagal memproses berkas TXT.");
          setFileReadingStatus("");
        }
      };
      reader.readAsText(selectedFile);
    } else if (ext === "docx" || ext === "doc") {
      setCpFile(selectedFile);
      setErrorMsg(null);
      setFileReadingStatus("Membaca berkas Word (.docx)...");
      
      const reader = new FileReader();
      reader.onerror = () => {
        setErrorMsg("Gagal membaca file Word.");
        setFileReadingStatus("");
      };
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const zip = await JSZip.loadAsync(arrayBuffer);
          const docXmlFile = zip.file("word/document.xml");
          if (!docXmlFile) {
            throw new Error("File word/document.xml tidak ditemukan di dalam berkas .docx.");
          }
          const docXml = await docXmlFile.async("string");
          
          // Regex to extract XML texts inside <w:t> tags
          const textMatches = docXml.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
          const extractedText = textMatches
            .map(val => val.replace(/<[^>]+>/g, "").trim())
            .filter(Boolean)
            .join(" ");
            
          if (!extractedText.trim()) {
            throw new Error("Teks kosong atau tidak ditemukan. Jika file lama (.doc), harap simpan ulang sebagai (.docx).");
          }
          
          setCpText(extractedText);
          setFileBase64(null);
          setFileMime(null);
          setFileReadingStatus("Teks dari berkas Word (.docx) berhasil diekstrak.");
        } catch (err: any) {
          console.error("Docx extraction error:", err);
          setErrorMsg(`Gagal memproses berkas Word: ${err?.message || err}. Pastikan menggunakan format .docx standar.`);
          setFileReadingStatus("");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setErrorMsg("Format file tidak didukung. Harap unggah berkas bertipe PDF, Word (.docx), atau Teks (.txt).");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0]);
    }
  };

  // Apply a Preset CP
  const applyPreset = (presetId: string) => {
    const p = CP_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setMapel(p.mapel);
      setFaseKelas(p.faseKelas);
      setAlokasiJp(p.alokasiJp);
      setCpText(p.cpText);
      setCpInputMode("text"); // Auto-switch to text mode so teachers can see/edit the preset's Capaian Pembelajaran text
    }
  };

  const isPerencanaAjarUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("perencana_ajar");
    } catch {
      return true;
    }
  })();

  // Launch Generator
  const generateLessonPlan = async () => {
    if (!isPerencanaAjarUnlocked) {
      setErrorMsg("Paket Belum Aktif: Silakan beli paket PERENCANA AJAR untuk menggunakan fitur pembuatan RPP.");
      return;
    }
    if (cpInputMode === "file" && !fileBase64 && !cpText) {
      setErrorMsg("Harap unggah naskah dokumen Capaian Pembelajaran (CP) bertipe PDF, Word (.docx), atau Teks (.txt) terlebih dahulu.");
      return;
    }
    if (cpInputMode === "text" && !cpText) {
      setErrorMsg("Harap isi teks Capaian Pembelajaran (CP) terlebih dahulu.");
      return;
    }
    if (cpInputMode === "bank" && !cpText) {
      setErrorMsg("Harap pilih dokumen dari Bank Dokumen terlebih dahulu.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setIsSavedToBank(false);
    setLoadingStatus("Menganalisis matriks Capaian Pembelajaran...");
    
    try {
      const statusTimeouts = [
        setTimeout(() => {
          setLoadingStatus("Menguraikan Kompetensi KKO & Lingkup Materi Inti...");
        }, 2000),
        setTimeout(() => {
          setLoadingStatus("Menyusun draf Tujuan Pembelajaran (TP) & Alur Tujuan Pembelajaran (ATP)...");
        }, 4500),
        setTimeout(() => {
          setLoadingStatus("Merumuskan Kriteria Ketercapaian (KKTP) & Rubrik Interval...");
        }, 7000),
        setTimeout(() => {
          setLoadingStatus("Mendistribusikan program tahunan (Prota) & program semester (Promes) di tahun ajaran...");
        }, 9500)
      ];

      const localKey = (localStorage.getItem("custom_gemini_api_key") || "").trim();
      const provinsiStr = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";
      const kabupatenStr = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";

      const response = await fetch("/api/generate-lesson-plan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(localKey ? { "x-gemini-key": localKey } : {})
        },
        body: JSON.stringify({
          namaSekolah,
          kepalaSekolah,
          nipKepala,
          mapel,
          faseKelas,
          cpText: (cpInputMode === "text" || cpInputMode === "bank" || cpText) ? cpText : "",
          alokasiJp,
          tahunAjaran,
          namaGuru,
          fileBase64: cpInputMode === "file" && fileBase64 ? fileBase64 : null,
          mimeType: cpInputMode === "file" && fileMime ? fileMime : null,
          tempatPenyusunan,
          tanggalPenyusunan,
          provinsi: provinsiStr,
          kabupaten: kabupatenStr,
        }),
      });

      // Clear the timeouts so they don't fire unexpectedly while viewing the result
      statusTimeouts.forEach(clearTimeout);

      const contentType = response.headers.get("content-type");
      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (e) {
          console.error("Gagal mengurai JSON perencanaan:", e);
        }
      }

      if (!response.ok) {
        const errMsg = data?.error || `Server bermasalah atau sedang offline (Kode Status: ${response.status}). Silakan coba sesaat lagi atau pastikan API Key Gemini terisi dengan benar.`;
        const errMsgLower = errMsg.toLowerCase();
        if (response.status === 429 || errMsgLower.includes("quota") || errMsgLower.includes("exhausted") || errMsgLower.includes("rate limit") || errMsgLower.includes("limit") || errMsgLower.includes("429")) {
          window.dispatchEvent(new CustomEvent("gemini-quota-exhausted"));
        } else if (response.status === 403 || response.status === 400 || errMsg.includes("403") || errMsg.includes("400") || errMsg.includes("PERMISSION_DENIED") || errMsg.includes("TERBATAS") || errMsg.includes("DITOLAK") || errMsg.includes("KUNCI API") || errMsg.includes("api_key_invalid") || errMsg.includes("API key not valid")) {
          window.dispatchEvent(new CustomEvent("gemini-api-error-403"));
        }
        setErrorMsg(errMsg);
        return;
      }

      if (data && data.success && data.text) {
        setGeneratedMd(data.text);
        setStep(2);
      } else {
        setErrorMsg(data?.error || "Gagal mendapatkan hasil dari mesin pemroses otomatis.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Koneksi gagal atau server terputus. Silakan coba sesaat lagi.");
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  // Helpers to copy md
  const copyToClipboard = () => {
    if (!generatedMd) return;
    navigator.clipboard.writeText(generatedMd);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Sync credentials on mount
  React.useEffect(() => {
    const sc = localStorage.getItem("omega_school_name");
    const ng = localStorage.getItem("omega_nama_guru");
    const ks = localStorage.getItem("omega_kepala_sekolah");
    const nk = localStorage.getItem("omega_nip_kepala");
    if (sc) setNamaSekolah(sc);
    if (ng) setNamaGuru(ng);
    if (ks) setKepalaSekolah(ks);
    if (nk) setNipKepala(nk);
  }, []);



  const downloadAsWord = () => {
    if (!generatedMd) return;

    // Convert markdown to clean Word compatible HTML
    const convMarkdownToHtmlForWord = (mdText: string) => {
      const lines = mdText.split("\n");
      let html = "";
      let inList = false;
      let listType: "ul" | "ol" | null = null;
      let inTable = false;
      let tableRows: string[][] = [];

      const flushList = () => {
        if (inList) {
          html += listType === "ul" ? "</ul>" : "</ol>";
          inList = false;
          listType = null;
        }
      };

      const flushTable = () => {
        if (inTable && tableRows.length > 0) {
          html += '<table border="1" style="border-collapse:collapse;width:100%;font-size:11pt;margin-bottom:12pt;border:1px solid #cbd5e1;font-family:Arial,sans-serif;">';
          tableRows.forEach((row, rIdx) => {
            const isHeader = rIdx === 0;
            const bg = isHeader ? ' background-color="#f1f5f9"' : '';
            const weight = isHeader ? 'font-weight:bold;' : '';
            html += `<tr${bg}>`;
            row.forEach(cell => {
              const cleanCell = cell.replace(/\*\*/g, "").trim();
              if (isHeader) {
                html += `<th style="border:1px solid #cbd5e1;padding:8px;text-align:left;font-family:Arial,sans-serif;${weight}">${cleanCell}</th>`;
              } else {
                html += `<td style="border:1px solid #cbd5e1;padding:8px;text-align:left;font-family:Arial,sans-serif;">${cleanCell}</td>`;
              }
            });
            html += '</tr>';
          });
          html += '</table>';
          inTable = false;
          tableRows = [];
        }
      };

      let reachedSignature = false;

      lines.forEach(line => {
        let trimmed = line.trim();

        if (reachedSignature) {
          return;
        }

        if (trimmed.toLowerCase().includes("lembar pengesahan")) {
          flushList();
          flushTable();
          html += `
            <br clear="all" style="page-break-before:always" />
            <div style="margin-top:40pt;text-align:center;">
              <h2 style="font-family:Arial,sans-serif;font-size:14pt;font-weight:bold;color:#0f172a;margin-bottom:6pt;text-transform:uppercase;">LEMBAR PENGESAHAN DOKUMEN</h2>
              <p style="font-family:Arial,sans-serif;font-size:10pt;color:#475569;margin-bottom:30pt;">Perencanaan pembelajaran ini disahkan dan dinyatakan berlaku efektif untuk Tahun Ajaran ${tahunAjaran}.</p>
            </div>
            
            <p style="font-family:Arial,sans-serif;font-size:11pt;color:#1d2939;margin-bottom:20pt;line-height:1.6;">
              Ditetapkan di  : <strong>${tempatPenyusunan || "Oehalo"}</strong><br/>
              Pada Tanggal   : <strong>${tanggalPenyusunan || "13 Juli 2026"}</strong>
            </p>
            
            <hr style="border:none; border-top:1px solid #e2e8f0; margin-bottom:30pt;" />
            
            <table border="0" cellpadding="0" cellspacing="0" style="width:100%;font-family:Arial,sans-serif;font-size:11pt;margin-top:30pt;line-height:1.6;">
              <tr>
                <td style="width:50%;vertical-align:top;padding-right:20pt;">
                  <p style="margin-bottom:60pt;"><strong>Mengetahui,</strong><br/>Kepala Sekolah,</p>
                  <p style="margin-bottom:2pt;"><u><strong>${kepalaSekolah}</strong></u></p>
                  <p style="margin:0;color:#475569;">NIP. ${nipKepala}</p>
                </td>
                <td style="width:50%;vertical-align:top;padding-left:20pt;">
                  <p style="margin-bottom:60pt;"><strong>Disetujui Oleh,</strong><br/>Guru Pengampu,</p>
                  <p style="margin-bottom:2pt;"><u><strong>${namaGuru}</strong></u></p>
                  <p style="margin:0;color:#475569;">NIP/NUPTK: -</p>
                </td>
              </tr>
            </table>
          `;
          reachedSignature = true;
          return;
        }

        if (trimmed === "<!-- PAGE_BREAK -->" || trimmed === "---") {
          flushList();
          flushTable();
          html += '<br clear="all" style="page-break-before:always" />';
          return;
        }

        // Checking table lines
        if (trimmed.startsWith("|")) {
          flushList();
          if (trimmed.includes("---")) {
            inTable = true;
            return; // skip separator
          }
          const cells = trimmed.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          tableRows.push(cells);
          inTable = true;
          return;
        } else {
          if (inTable) {
            flushTable();
          }
        }

        // Checking lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          if (!inList || listType !== "ul") {
            flushList();
            html += '<ul style="margin-top:0;margin-bottom:12pt;font-family:Arial,sans-serif;font-size:11pt;">';
            inList = true;
            listType = "ul";
          }
          const content = trimmed.substring(2).replace(/\*\*/g, "");
          html += `<li>${content}</li>`;
          return;
        }

        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          if (!inList || listType !== "ol") {
            flushList();
            html += '<ol style="margin-top:0;margin-bottom:12pt;font-family:Arial,sans-serif;font-size:11pt;">';
            inList = true;
            listType = "ol";
          }
          const content = numMatch[2].replace(/\*\*/g, "");
          html += `<li>${content}</li>`;
          return;
        }

        // Regular line, hence no lists active
        flushList();

        if (!trimmed) {
          html += '<p style="margin:0 0 12pt 0;line-height:1.5;font-family:Arial,sans-serif;font-size:11pt;">&nbsp;</p>';
          return;
        }

        // Check headings structured as H1, H2, H3
        if (trimmed.startsWith("# ")) {
          html += `<h1 style="font-family:Arial,sans-serif;font-size:16pt;font-weight:bold;color:#0f172a;margin:20pt 0 12pt 0;">${trimmed.replace("# ", "").replace(/\*\*/g, "")}</h1>`;
          return;
        }
        if (trimmed.startsWith("## ")) {
          html += `<h2 style="font-family:Arial,sans-serif;font-size:14pt;font-weight:bold;color:#0f172a;margin:16pt 0 10pt 0;">${trimmed.replace("## ", "").replace(/\*\*/g, "")}</h2>`;
          return;
        }
        if (trimmed.startsWith("### ")) {
          html += `<h3 style="font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#1e293b;margin:12pt 0 8pt 0;">${trimmed.replace("### ", "").replace(/\*\*/g, "")}</h3>`;
          return;
        }

        // Inline formatting
        let inlineFormatted = trimmed
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/<br\s*\/?>/gi, "<br/>");
        html += `<p style="margin:0 0 12pt 0;line-height:1.5;text-align:justify;font-family:Arial,sans-serif;font-size:11pt;">${inlineFormatted}</p>`;
      });

      flushList();
      flushTable();

      return html;
    };

    const htmlBodyContent = convMarkdownToHtmlForWord(generatedMd);

    // Dynamic clean cover block
    const coverPageHtml = `
      <div style="text-align:center; padding-top:40px; margin-bottom:60px; page-break-after:always;">
        
        <div style="margin-top:40px; margin-bottom:30px;">
          <h1 style="font-family:'Times New Roman',serif;font-size:16pt;font-weight:bold;color:#000000;line-height:1.4;text-transform:uppercase;margin:0 0 10px 0;">
            ANALISIS CP, TP, ATP, KKTP, PROMES DAN PROTA
          </h1>
          <h2 style="font-family:'Times New Roman',serif;font-size:12pt;font-weight:bold;color:#000000;margin:0 0 5px 0;text-transform:uppercase;">
            MATA PELAJARAN: ${mapel.toUpperCase()}
          </h2>
          <h3 style="font-family:'Times New Roman',serif;font-size:11pt;font-weight:bold;color:#000000;margin-top:4px;">
            FASE / KELAS: ${faseKelas.toUpperCase()}
          </h3>
        </div>
        
        <div style="margin-top:50px; margin-bottom:40px;">
          <div style="font-family:'Times New Roman',serif;font-size:14pt;font-weight:bold;color:#000000;text-transform:uppercase;">
            ${namaSekolah.toUpperCase()}
          </div>
          <div style="font-family:'Times New Roman',serif;font-size:11pt;color:#000000;margin-top:6px;">
            Penyusun: <strong>${namaGuru}</strong>
          </div>
          <div style="font-family:'Times New Roman',serif;font-size:11pt;color:#000000;margin-top:4px;">
            Tahun Pelajaran: ${tahunAjaran}
          </div>
        </div>
        
        <div style="margin-top:60px; font-family:'Times New Roman',serif;font-size:9.5pt;color:#333333;border-top:1px solid #000000;padding-top:10px;width:70%;margin-left:auto;margin-right:auto;">
          Dokumen Kurikulum Perencanaan Akademik  |  Omega Guru Merdeka Engine
        </div>
      </div>
      <br clear="all" style="page-break-before:always" />
    `;

    const documentTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
      <title>Analisis CP TP ATP KKTP PROMES PROTA - ${mapel}</title>
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
      @page {
        size: 29.7cm 21cm; /* A4 Landscape size */
        margin: 2.0cm 2.0cm 2.0cm 2.0cm; /* Standard margins */
      }
      div.Section1 {
        page: Section1;
      }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000000;
      }
      p {
        margin: 0 0 12pt 0;
        text-align: justify;
      }
      h1 {
        font-size: 14pt;
        font-weight: bold;
        margin-top: 20pt;
        margin-bottom: 12pt;
        color: #000000;
        text-transform: uppercase;
      }
      h2 {
        font-size: 12pt;
        font-weight: bold;
        margin-top: 16pt;
        margin-bottom: 10pt;
        color: #000000;
      }
      h3 {
        font-size: 11pt;
        font-weight: bold;
        margin-top: 12pt;
        margin-bottom: 8pt;
        color: #000000;
      }
      li {
        margin-bottom: 6pt;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 15pt;
      }
      th, td {
        border: 1px solid #000000;
        padding: 6px 8px;
        font-size: 10pt;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      </style>
      </head>
      <body>
      <div class="Section1">
        ${coverPageHtml}
        ${htmlBodyContent}
      </div>
      </body>
      </html>
    `;

    const blob = new Blob([documentTemplate], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Analisis_CP_TP_ATP_KKTP_PROMES_PROTA_${mapel.replace(/\s+/g, '_')}_${faseKelas.replace(/\s+/g, '_')}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe scientific PDF generation with Page-1 Elegant Cover sheet
  const downloadAsPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      let currentOrientation: "portrait" | "landscape" = "landscape";
      let pageHeight = 210;
      let pageWidth = 297;
      const margin = 20;
      let contentWidth = pageWidth - margin * 2;
      let currentY = margin;

      const switchToOrientation = (orientation: "portrait" | "landscape") => {
        // Enforce strictly landscape layout for this entire document
        currentOrientation = "landscape";
        pageWidth = 297;
        pageHeight = 210;
        contentWidth = pageWidth - margin * 2;
      };

      const customMinistryLogo = localStorage.getItem("kosp_custom_ministry_logo");
      const schoolLogo = localStorage.getItem("kosp_school_logo");

      const hasMinistry = !!customMinistryLogo;
      const hasSchool = !!schoolLogo;

      // Wrap-secure helper for centering text
      const drawCenteredWrappedText = (text: string, fontSize: number, style: "bold" | "normal" | "italic", maxW: number, yPos: number): number => {
        doc.setFont("times", style);
        doc.setFontSize(fontSize);
        const split = doc.splitTextToSize(text, maxW);
        let runY = yPos;
        split.forEach((lineText: string) => {
          doc.text(lineText, pageWidth / 2, runY, { align: "center" });
          runY += (fontSize * 0.35) + 1.2;
        });
        return runY; // returns the new Y position
      };

      // ============================================
      // PAGE 1: ELEGANT COVER PAGE
      // ============================================
      // Set elegant gold border
      doc.setDrawColor(217, 119, 6); // gold/amber-600
      doc.setLineWidth(0.65);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
      
      doc.setDrawColor(0, 0, 0); // black inner border
      doc.setLineWidth(0.25);
      doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

      let coverY = 16;

      if (hasMinistry && hasSchool) {
        // Mode 1: Kedua logo aktif (Kementerian & Sekolah)
        const minLogoSize = 16;
        try {
          doc.addImage(customMinistryLogo!, "PNG", pageWidth / 2 - minLogoSize / 2, coverY, minLogoSize, minLogoSize);
        } catch (err) {
          console.error("Error drawing ministry logo:", err);
        }
        coverY += minLogoSize + 6;

        coverY = drawCenteredWrappedText("ANALISIS CP, TP, ATP, KKTP, PROMES DAN PROTA", 13, "bold", pageWidth - 36, coverY);
        coverY += 0.5;
        coverY = drawCenteredWrappedText("KURIKULUM MERDEKA", 10, "bold", pageWidth - 36, coverY);

        coverY += 4;
        const schLogoSize = 20;
        try {
          doc.addImage(schoolLogo!, "PNG", pageWidth / 2 - schLogoSize / 2, coverY, schLogoSize, schLogoSize);
        } catch (err) {
          console.error("Error drawing school logo:", err);
        }
        coverY += schLogoSize + 6;

        coverY = drawCenteredWrappedText(namaSekolah.toUpperCase(), 12, "bold", pageWidth - 36, coverY);
        coverY += 6;

        coverY = drawCenteredWrappedText(`MATA PELAJARAN: ${mapel.toUpperCase()}  |  ${faseKelas.toUpperCase()}`, 10, "normal", pageWidth - 40, coverY);
        coverY += 1.2;
        coverY = drawCenteredWrappedText(`Penyusun: ${namaGuru}  |  Tahun Pelajaran: ${tahunAjaran}`, 10, "normal", pageWidth - 40, coverY);

      } else if (hasMinistry || hasSchool) {
        // Mode 2: Hanya satu logo (Kementerian ATAU Sekolah)
        coverY = 22;
        coverY = drawCenteredWrappedText("ANALISIS CP, TP, ATP, KKTP, PROMES DAN PROTA", 13, "bold", pageWidth - 36, coverY);
        coverY += 0.5;
        coverY = drawCenteredWrappedText("KURIKULUM MERDEKA", 10, "bold", pageWidth - 36, coverY);

        coverY += 8;
        const singleLogoSize = 24;
        const activeLogo = customMinistryLogo || schoolLogo;
        try {
          doc.addImage(activeLogo!, "PNG", pageWidth / 2 - singleLogoSize / 2, coverY, singleLogoSize, singleLogoSize);
        } catch (err) {
          console.error("Error drawing single logo:", err);
        }
        coverY += singleLogoSize + 8;

        coverY = drawCenteredWrappedText(namaSekolah.toUpperCase(), 12, "bold", pageWidth - 36, coverY);
        coverY += 6;

        coverY = drawCenteredWrappedText(`MATA PELAJARAN: ${mapel.toUpperCase()}  |  ${faseKelas.toUpperCase()}`, 10, "normal", pageWidth - 40, coverY);
        coverY += 1.2;
        coverY = drawCenteredWrappedText(`Penyusun: ${namaGuru}  |  Tahun Pelajaran: ${tahunAjaran}`, 10, "normal", pageWidth - 40, coverY);
      } else {
        // Mode 3: Tanpa logo
        coverY = 30;
        coverY = drawCenteredWrappedText("ANALISIS CP, TP, ATP, KKTP, PROMES DAN PROTA", 14, "bold", pageWidth - 36, coverY);
        coverY += 0.5;
        coverY = drawCenteredWrappedText("KURIKULUM MERDEKA", 10, "bold", pageWidth - 36, coverY);

        coverY += 14;
        coverY = drawCenteredWrappedText(namaSekolah.toUpperCase(), 13, "bold", pageWidth - 36, coverY);
        coverY += 8;

        coverY = drawCenteredWrappedText(`MATA PELAJARAN: ${mapel.toUpperCase()}  |  ${faseKelas.toUpperCase()}`, 10, "normal", pageWidth - 40, coverY);
        coverY += 1.2;
        coverY = drawCenteredWrappedText(`Penyusun: ${namaGuru}  |  Tahun Pelajaran: ${tahunAjaran}`, 10, "normal", pageWidth - 40, coverY);
      }

      // Decorative center line
      coverY = pageHeight - 35;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(pageWidth / 2 - 30, coverY, pageWidth / 2 + 30, coverY);
      
      // Bottom of cover
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      doc.text("Dihasilkan secara otomatis oleh Omega Guru Merdeka Engine", pageWidth / 2, pageHeight - 20, { align: "center" });

      let pageCreatedIndex = 1;

      // Standard central triggers for unified pagination and layout headers
      const triggerNewPage = (targetOrientation?: "portrait" | "landscape") => {
        pageCreatedIndex = 2;
        const targetO = "landscape";
        switchToOrientation(targetO);
        doc.addPage("a4", targetO);
        currentY = margin + 10;
        
        // Small Header/Footer on every multi-page
        doc.setFont("times", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(60, 60, 60);
        doc.text(`Analisis CP, TP, ATP, KKTP, PROMES & PROTA - ${mapel} ${faseKelas}`, margin, margin - 5);
        doc.line(margin, margin - 3, pageWidth - margin, margin - 3);

        // Elegant solid bottom footer with page indexing
        const pageNum = doc.getNumberOfPages();
        doc.setFont("times", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 110);
        doc.text(`Halaman ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);
        doc.text("Dihasilkan secara otomatis oleh Omega Guru Merdeka Engine", margin, pageHeight - 10);
      };

      const ensureContentPage = () => {
        if (pageCreatedIndex === 1) {
          triggerNewPage("landscape");
        }
      };

      const addNewPageIfNeeded = (heightNeeded: number, forceOrientation?: "portrait" | "landscape") => {
        const targetO = forceOrientation || currentOrientation;
        const limitY = pageHeight - margin - 15;
        if (currentY + heightNeeded > limitY || (forceOrientation && forceOrientation !== currentOrientation)) {
          // Safety guard to avoid consecutive double page break blank loops:
          const isTopOfPage = currentY === margin + 10;
          if (!isTopOfPage || (forceOrientation && forceOrientation !== currentOrientation)) {
            triggerNewPage(targetO);
          }
        }
      };

      let activeTableColWidths: number[] | null = null;
      let activeTableOrientation: "portrait" | "landscape" | null = null;

      const lines = generatedMd.split("\n");
      let hasHitBabI = false;
      
      for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();

        // Reset active table caches first before any conditional skips
        if (!line.startsWith("|")) {
          // Keep strictly in landscape layout, do not transition back to portrait
          activeTableColWidths = null;
          activeTableOrientation = null;
        }

        if (line === "" || line === "---") continue;

        // Support explicit manual/automatic page breaks in markdown
        if (line.includes("<!-- PAGE_BREAK -->") || line.includes("PAGE_BREAK")) {
          triggerNewPage();
          continue;
        }

        // Skip everything until we see BAB I
        if (!hasHitBabI) {
          const cleanLineForMatch = line.replace(/^[#\s\*\_]+/g, "").trim().toUpperCase();
          if (
            cleanLineForMatch.startsWith("BAB I:") || 
            cleanLineForMatch.startsWith("BAB I ") || 
            cleanLineForMatch.startsWith("BAB 1:") || 
            cleanLineForMatch.startsWith("BAB 1 ") || 
            cleanLineForMatch === "BAB I" || 
            cleanLineForMatch === "BAB 1"
          ) {
            hasHitBabI = true;
          } else {
            continue; // Skip any introductory titles or headers before Bab I
          }
        }

        // Skip redundant Document Level Title headers since we already have an elegant Cover Page!
        const upperLine = line.toUpperCase();
        if (
          upperLine.includes("DOKUMEN PERENCANAAN PEMBELAJARAN") || 
          upperLine.includes("STANDAR MUTAKHIR STANDAR BSKAP") ||
          upperLine.includes("MATA PELAJARAN:") ||
          upperLine.includes("TAHUN AJARAN") ||
          upperLine.includes("PENYUSUN:") ||
          upperLine.includes("NAMA SEKOLAH:") ||
          upperLine.includes("KEPALA SEKOLAH")
        ) {
          continue;
        }

        // Clean paragraph text replacing <br> and stripping HTML entirely
        const cleanText = line
          .replace(/<br\s*\/?>/gi, " ")
          .replace(/<[^>]*>/g, "")
          .replace(/[\*\_]/g, "")
          .trim();

        // H1 Title (# )
        if (line.startsWith("# ")) {
          ensureContentPage();
          const text = line.replace("# ", "").replace(/\*\//g, "").replace(/<[^>]*>/g, "").replace(/[\*\_]/g, "").trim();
          const isBab = text.toUpperCase().includes("BAB ");
          if (isBab && currentY > margin + 18) {
            triggerNewPage("landscape");
          }
          const splitTitle = doc.splitTextToSize(text.toUpperCase(), contentWidth);
          // Standard book typesetting: ensure space for heading + 35mm of content to prevent orphan overlaps
          addNewPageIfNeeded((splitTitle.length * 6) + 35);
          currentY += 4;
          doc.setFont("times", "bold");
          doc.setFontSize(13);
          doc.setTextColor(0, 0, 0);
          
          splitTitle.forEach((tLine: string) => {
            doc.text(tLine, margin, currentY);
            currentY += 6;
          });
          currentY += 4;
          continue;
        }

        // H2 Title (## )
        if (line.startsWith("## ")) {
          ensureContentPage();
          const text = line.replace("## ", "").replace(/\*\//g, "").replace(/<[^>]*>/g, "").replace(/[\*\_]/g, "").trim();
          const isBab = text.toUpperCase().includes("BAB ");
          if (isBab && currentY > margin + 18) {
            triggerNewPage("landscape");
          }
          const splitTitle = doc.splitTextToSize(text, contentWidth);
          // Ensure space for heading + 30mm of content to prevent orphan overlaps
          addNewPageIfNeeded((splitTitle.length * 5.5) + 30);
          currentY += 3;
          doc.setFont("times", "bold");
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          
          splitTitle.forEach((tLine: string) => {
            doc.text(tLine, margin, currentY);
            currentY += 5.5;
          });
          currentY += 3.5;
          continue;
        }

        // H3 Title (### )
        if (line.startsWith("### ")) {
          ensureContentPage();
          const text = line.replace("### ", "").replace(/\*\//g, "").replace(/<[^>]*>/g, "").replace(/[\*\_]/g, "").trim();
          const isBab = text.toUpperCase().includes("BAB ");
          if (isBab && currentY > margin + 18) {
            triggerNewPage("landscape");
          }
          const splitTitle = doc.splitTextToSize(text, contentWidth);
          // Ensure space for heading + 25mm of content to prevent orphan overlaps
          addNewPageIfNeeded((splitTitle.length * 5) + 25);
          currentY += 2;
          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          
          splitTitle.forEach((tLine: string) => {
            doc.text(tLine, margin, currentY);
            currentY += 5;
          });
          currentY += 3;
          continue;
        }

        // Bullet lists
        if (rawLine.trim().startsWith("- ") || rawLine.trim().startsWith("* ")) {
          ensureContentPage();
          const splitText = doc.splitTextToSize(`•  ${cleanText}`, contentWidth);
          
          splitText.forEach((textLine: string) => {
            if (currentY > pageHeight - margin - 15) {
              triggerNewPage();
            }
            doc.setFont("times", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(0, 0, 0);
            doc.text(textLine, margin, currentY);
            currentY += 4.5;
          });
          continue;
        }

        // Tables parsing & formatting (Variable widths + Clean up cell breaks)
        if (line.startsWith("|") && line.endsWith("|")) {
          ensureContentPage();
          if (line.includes("---")) continue; // skip divider lines
          let cells = line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          
          if (cells.length === 0) continue;
          
          const isHeader = i > 0 && (lines[i - 1].trim() === "" || lines[i - 1].startsWith("###") || lines[i - 1].includes("BAB")) && lines[i + 1]?.includes("---");

          // Determine column widths on table start
          if (!activeTableColWidths) {
            const totalCols = cells.length;
            const headerTexts = cells.map(c => c.toLowerCase());
            const isATP = headerTexts.some(h => h.includes("kode") || h.includes("atp") || h.includes("rumusan tp"));
            const isCPDekonstruksi = headerTexts.some(h => h.includes("dekonstruksi") || h.includes("elemen cp") || h.includes("kalimat cp"));
            const isKKTP = headerTexts.some(h => h.includes("kktp") || h.includes("berkembang") || h.includes("layak") || h.includes("cakap"));
            
            activeTableOrientation = "landscape";

            let colWidthsList: number[] = [];
            if (isATP && totalCols === 6) {
              // ATP table: [No, Kode TP, Rumusan TP, JP, Indikator, Semester]
              colWidthsList = [0.05, 0.10, 0.42, 0.08, 0.27, 0.08];
            } else if (isCPDekonstruksi && totalCols === 4) {
              // CP Dekonstruksi: [Elemen CP, Kompetensi Utama, Lingkup Materi, Perumusan Kalimat TP]
              colWidthsList = [0.18, 0.20, 0.18, 0.44];
            } else if (isCPDekonstruksi && totalCols === 5) {
              colWidthsList = [0.15, 0.20, 0.13, 0.18, 0.34];
            } else if (isKKTP && totalCols === 6) {
              colWidthsList = [0.22, 0.18, 0.15, 0.15, 0.15, 0.15];
            } else if (isKKTP && totalCols === 5) {
              colWidthsList = [0.36, 0.16, 0.16, 0.16, 0.16];
            } else if (totalCols === 4 && (headerTexts.some(h => h.includes("semester")) || headerTexts.some(h => h.includes("prota")) || headerTexts.some(h => h.includes("tahunan")))) {
              // PROTA table: [No, Semester, Kode & Bunyi TP, JP]
              colWidthsList = [0.05, 0.12, 0.73, 0.10];
            } else if (totalCols > 7) {
              // PROMES: [No, TP Lengkap, JP, Jul, Agu, Sep, Okt, Nov, Des]
              const noW = 0.05;
              const tpW = 0.42;
              const jpW = 0.05;
              const remainingW = 1.0 - (noW + tpW + jpW);
              const otherColW = remainingW / (totalCols - 3);

              colWidthsList.push(noW);
              colWidthsList.push(tpW);
              colWidthsList.push(jpW);
              for (let c = 3; c < totalCols; c++) {
                colWidthsList.push(otherColW);
              }
            } else {
              // Equal fallback
              const equalW = 1.0 / totalCols;
              for (let c = 0; c < totalCols; c++) {
                colWidthsList.push(equalW);
              }
            }
            activeTableColWidths = colWidthsList;
          }

          // Force cells list length to exactly match target columns count to prevent misalignment
          const targetColsCount = activeTableColWidths.length;
          if (cells.length > targetColsCount) {
            // Drop empty cells first, starting from columns > 0
            const emptyIndices: number[] = [];
            cells.forEach((c, idx) => {
              if (c === "" && idx > 0 && idx < cells.length - 1) {
                emptyIndices.push(idx);
              }
            });
            for (let j = emptyIndices.length - 1; j >= 0; j--) {
              if (cells.length > targetColsCount) {
                cells.splice(emptyIndices[j], 1);
              }
            }
            if (cells.length > targetColsCount) {
              cells = cells.slice(0, targetColsCount);
            }
          } else if (cells.length < targetColsCount) {
            while (cells.length < targetColsCount) {
              cells.push("");
            }
          }

          const colWidthsList = activeTableColWidths;
          const targetRowOrientation = activeTableOrientation || "portrait";
          const totalCols = targetColsCount;
          
          // Set correct font metrics before splitting text to get precise wrapping dimensions
          if (isHeader) {
            doc.setFont("times", "bold");
            doc.setFontSize(totalCols > 7 ? 8.5 : 9);
          } else {
            doc.setFont("times", "normal");
            doc.setFontSize(totalCols > 7 ? 7.5 : 8);
          }

          let maxCellLines = 1;
          const formattedCells = cells.map((cell, colIdx) => {
            const colW = (colWidthsList[colIdx] ?? (1.0 / totalCols)) * contentWidth;
            const cleanCell = cell
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/\t/g, "  ")
              .replace(/[\*\_]/g, "");
            const wrap = doc.splitTextToSize(cleanCell, colW - 3.5);
            if (wrap.length > maxCellLines) maxCellLines = wrap.length;
            return wrap;
          });

          const rowPadding = totalCols > 7 ? 2.5 : 3.5;
          const rowLineHeight = totalCols > 7 ? 3.6 : 4.2;
          const rowHeight = (maxCellLines * rowLineHeight) + rowPadding;
          
          // Row overflow protection supporting dynamic orientation transition
          if (currentY + rowHeight > pageHeight - margin - 15 || targetRowOrientation !== currentOrientation) {
            const isTopOfPage = currentY === margin + 10;
            if (!isTopOfPage || targetRowOrientation !== currentOrientation) {
              triggerNewPage(targetRowOrientation);
            }
          }

          if (isHeader) {
            doc.setFillColor(230, 230, 230); // solid clear light gray header fill
            doc.rect(margin, currentY, contentWidth, rowHeight, "F");
            doc.setFont("times", "bold");
            doc.setFontSize(totalCols > 7 ? 7 : 8);
            doc.setTextColor(0, 0, 0); // Bold black
          } else {
            doc.setFont("times", "normal");
            doc.setFontSize(totalCols > 7 ? 6.5 : 7.5);
            doc.setTextColor(0, 0, 0); // Clear black

            // subtle alternating rows
            if (i % 2 === 0) {
              doc.setFillColor(250, 250, 250);
              doc.rect(margin, currentY, contentWidth, rowHeight, "F");
            }
          }

          // draw cell content and high-contrast solid borders
          doc.setDrawColor(40, 40, 40); // Very clear high contrast border color
          doc.setLineWidth(0.25);
          doc.rect(margin, currentY, contentWidth, rowHeight);

          let cellXProgress = margin;
          formattedCells.forEach((linesArr, colIdx) => {
            const colW = (colWidthsList[colIdx] ?? (1.0 / totalCols)) * contentWidth;
            const cellX = cellXProgress + 1.8;
            let cellY = currentY + (totalCols > 7 ? 2.8 : 3.8);
            
            linesArr.forEach(textLine => {
              doc.text(textLine, cellX, cellY);
              cellY += rowLineHeight;
            });
            
            cellXProgress += colW;
            // vertical grid lines separator
            if (colIdx < totalCols - 1) {
              doc.line(cellXProgress, currentY, cellXProgress, currentY + rowHeight);
            }
          });

          currentY += rowHeight;
          continue;
        }

        // Check for Lembar Pengesahan (Signature Block Intercept)
        if (line.toLowerCase().includes("lembar pengesahan")) {
          // Keep landscape active for Lembar Pengesahan
          switchToOrientation("landscape");
          doc.addPage("a4", "landscape");
          currentY = margin + 12;
          
          doc.setFont("times", "bold");
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text("LEMBAR PENGESAHAN DOKUMEN", pageWidth / 2, currentY, { align: "center" });
          currentY += 8;
          
          doc.setFont("times", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          doc.text(`Analisis Kurikulum Perencanaan ini disahkan untuk digunakan pada Tahun Pelajaran ${tahunAjaran}`, pageWidth / 2, currentY, { align: "center" });
          currentY += 12;
          
          // Metadata (Ditetapkan di...)
          doc.setFont("times", "normal");
          doc.setFontSize(9.5);
          doc.text(`Ditetapkan di  :  ${tempatPenyusunan || "Oehalo"}`, margin, currentY);
          currentY += 5.5;
          doc.text(`Pada Tanggal   :  ${tanggalPenyusunan || "13 Juli 2026"}`, margin, currentY);
          currentY += 15;

          // Draw school logo in Lembar Pengesahan if available
          if (schoolLogo) {
            try {
              doc.addImage(schoolLogo, "PNG", pageWidth - margin - 35, currentY - 24, 20, 20);
            } catch (err) {
              console.error("Error drawing logo in Lembar Pengesahan:", err);
            }
          }

          // Draw a standard black horizontal rule
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.4);
          doc.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 12;

          // Side-by-side signature columns - Width limited to prevent clipping
          const leftColX = margin + 12;
          const rightColX = pageWidth - margin - 68;
          const colLimitW = 65;

          // Left Box: Kepala Sekolah
          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.text("Mengetahui,", leftColX, currentY);
          
          // Split title to prevent overflow
          const leftSchoolLines = doc.splitTextToSize("Kepala Sekolah,", colLimitW);
          let lY = currentY + 5;
          leftSchoolLines.forEach((l: string) => {
            doc.text(l, leftColX, lY);
            lY += 4.5;
          });
          
          // Sign gap
          doc.setFont("times", "italic");
          doc.setFontSize(8);
          doc.setTextColor(110, 110, 110);
          doc.text("( Tanda Tangan & Cap Resmi )", leftColX, currentY + 23);

          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          
          const leftNameLines = doc.splitTextToSize(kepalaSekolah, colLimitW);
          let lNameY = currentY + 33;
          leftNameLines.forEach((n: string) => {
            doc.text(n, leftColX, lNameY);
            lNameY += 4.5;
          });
          
          doc.setFont("times", "normal");
          doc.setFontSize(9);
          doc.text(`NIP. ${nipKepala}`, leftColX, lNameY);

          // Right Box: Guru Pengampu
          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          doc.text("Disetujui Oleh,", rightColX, currentY);
          
          const rightTitleLines = doc.splitTextToSize("Guru Pengampu / Mata Pelajaran", colLimitW);
          let rY = currentY + 5;
          rightTitleLines.forEach((l: string) => {
            doc.text(l, rightColX, rY);
            rY += 4.5;
          });
          
          // Sign gap
          doc.setFont("times", "italic");
          doc.setFontSize(8);
          doc.setTextColor(110, 110, 110);
          doc.text("( Tanda Tangan Guru )", rightColX, currentY + 23);

          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          
          const rightNameLines = doc.splitTextToSize(namaGuru, colLimitW);
          let rNameY = currentY + 33;
          rightNameLines.forEach((n: string) => {
            doc.text(n, rightColX, rNameY);
            rNameY += 4.5;
          });
          
          doc.setFont("times", "normal");
          doc.setFontSize(9);
          
          const cleanNipGuru = nipKepala.startsWith("1986") ? "198603012020121005" : "-";
          doc.text(`NIP. ${cleanNipGuru}`, rightColX, rNameY);

          break; // successfully structured the signature professionally
        }

        // Standard Paragraph text with loop pagination safety
        ensureContentPage();
        const splitText = doc.splitTextToSize(cleanText, contentWidth);
        
        splitText.forEach((textLine: string) => {
          if (currentY > pageHeight - margin - 15) {
            triggerNewPage();
          }
          doc.setFont("times", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(0, 0, 0);
          
          doc.text(textLine, margin, currentY);
          currentY += 4.5;
        });
        currentY += 1.5; // space after paragraph
      }

      switchToOrientation("landscape"); // keep landscape
      doc.save(`Analisis-CP-TP-ATP-KKTP-PROMES-PROTA-${mapel}-${faseKelas.replace(/[\s\(\)]/g, "")}.pdf`);
    } catch (pdfErr) {
      console.error(pdfErr);
      alert("Terjadi kesalahan saat memproses PDF. Silakan salin draf menggunakan tombol salin.");
    }
  };

  return (
    <div id="lesson_planner_container" className="premium-card premium-border-gold rounded-3xl p-5 md:p-8 space-y-6">
      {/* Upper header block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-sans text-xs font-semibold tracking-wider">
              Asisten Kurikulum Merdeka
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">Asisten Perencana Pembelajaran</h2>
          <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Formulasikan Capaian Pembelajaran (CP) menjadi dokumen kurikulum komparatif KOSP secara utuh: TP, ATP, KKTP interval, Program Tahunan (Prota), & Program Semester (Promes) instan.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setGeneratedMd("");
            }}
            className={`py-2.5 px-5 rounded-2xl border text-xs font-bold transition font-sans uppercase tracking-wider ${
              step === 1 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Form Parameter
          </button>
          {generatedMd && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`py-2.5 px-5 rounded-2xl border text-xs font-bold transition font-sans uppercase tracking-wider ${
                step === 2 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Lihat Dokumen
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <CinematicLoading
          title="Memformulasikan Rencana Kurikulum Merdeka"
          subtitle="Sistem sedang mengurai kalimat kompetensi KKO, merumuskan silabus, TP, ATP, KKTP interval, serta Prota dan Promes secara otomatis"
          progressMsg={loadingStatus || "Memetakan capaian pembelajaran..."}
        />
      ) : step === 1 ? (
        <div className="w-full space-y-8 animate-fade-in text-zinc-300">
          
          {/* Interactive Guide Banner (Top of Form) */}
          <div className="w-full bg-[#0a0a0f] border border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col space-y-6 shadow-xl relative overflow-hidden">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />
            
            <div className="border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-sans text-xs font-bold tracking-wider animate-pulse">
                  BSKAP 046/2025
                </span>
                <span className="text-xs text-zinc-550 font-sans font-semibold">
                  SINKRON AKTIF
                </span>
              </div>
              <h3 className="text-sm font-sans text-zinc-200 uppercase tracking-wider font-bold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Panduan Interaktif TP & ATP
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
                Alur cerdas perumusan administrasi pembelajaran berdasarkan standar kemendikdasmen regulasi terbaru.
              </p>
            </div>

            {/* Quick Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-zinc-900/60 max-w-xl">
              {(["bskap", "tp", "atp", "sandbox"] as const).map((tab) => {
                const displayLabel = tab === "bskap" ? "Dasar" : tab === "tp" ? "TP" : tab === "atp" ? "ATP" : "Uji TP";
                const isActive = activeGuideTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveGuideTab(tab)}
                    className={`py-2 px-1.5 rounded-lg text-xs font-sans font-bold transition text-center cursor-pointer ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                        : "text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/40"
                    }`}
                  >
                    {displayLabel}
                  </button>
                );
              })}
            </div>

            {/* Content Sheets */}
            {activeGuideTab === "bskap" && (
              <div className="space-y-3.5 text-left animate-fade-in text-xs leading-relaxed text-zinc-400">
                <div className="bg-[#030305] p-3 rounded-xl border border-zinc-900 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider font-sans">
                    SISTEM DEKRET KEPUTUSAN
                  </div>
                  <p className="text-[11px] text-zinc-300 font-bold">
                    Keputusan BSKAP No. 046/H/2025
                  </p>
                  <p className="text-[10.5px] leading-relaxed">
                    Penyempurnaan menyeluruh atas target Capaian Pembelajaran (CP) dengan perampingan konten esensial agar memberi ruang luang bagi asesmen formatif-sumatif yang mendalam.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-[9.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest pl-1 font-sans">
                    ALUR PERENCANAAN
                  </div>
                  <div className="relative pl-4 space-y-3 border-l border-zinc-850">
                    <div className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-[#0a0a0f]" />
                      <strong className="text-zinc-350 block text-[11px] font-semibold">1. Pahami CP Elemen</strong>
                      <span className="text-[10.5px]">Deteksi kata kerja tindakan kompetensi dan lingkup materi dalam regulasi.</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-[#0a0a0f]" />
                      <strong className="text-amber-400 block text-[11px] font-semibold">2. Formulasi TP</strong>
                      <span className="text-[10.5px]">Petakan menjadi butir-butir Tujuan Pembelajaran yang konkret dan terukur.</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-[#0a0a0f]" />
                      <strong className="text-zinc-350 block text-[11px] font-semibold">3. Urutkan ATP</strong>
                      <span className="text-[10.5px]">Susun TP secara linear dan kronologis dari mudah ke kompleks tanpa percabangan.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === "tp" && (
              <div className="space-y-3 text-left animate-fade-in text-xs leading-relaxed text-zinc-400">
                <div className="bg-[#030305] p-3 rounded-xl border border-zinc-900 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-sans">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    SYARAT MINIMAL RUMUSAN TP
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Sesuai Standar Panduan Pembelajaran & Asesmen, TP wajib mengandung:
                  </p>
                  <ul className="space-y-1.5 pl-1 text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Kompetensi:</strong> Kata Kerja yang dapat memperagakan kebolehan murid (misal: <em>menganalisis</em>).
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Lingkup Materi:</strong> Batasan konten ilmiah esensial dari kurikulum (misal: <em>fotosintesis</em>).
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl space-y-1.5">
                  <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider block font-bold font-sans">
                    CONTOH TARGET TP IDEAL
                  </span>
                  <div className="font-sans text-[11px] text-zinc-300 leading-snug">
                    "Peserta didik mampu <strong className="text-amber-400 font-bold">mengidentifikasi</strong> (Kompetensi) <strong className="text-blue-400 font-bold">komponen biotik dan abiotik</strong> (Lingkup Materi) di ekosistem sekolah."
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === "atp" && (
              <div className="space-y-3.5 text-left animate-fade-in text-xs leading-relaxed text-zinc-400">
                <div className="bg-[#030305] p-3 rounded-xl border border-zinc-900 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1 font-sans">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    PRINSIP ALUR (ATP)
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Mengurutkan urutan kegiatan belajar secara terstruktur:
                  </p>
                  <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                    <li className="flex gap-1.5">
                      <span className="text-amber-500 font-bold font-mono">1.</span>
                      <span><strong>Linearitas:</strong> Alur harus berjalan linear lurus tanpa percabangan bercabang.</span>
                    </li>
                    <li className="flex gap-1.5">
                      <span className="text-amber-500 font-bold font-mono">2.</span>
                      <span><strong>Tuntas Fase:</strong> Menampung seluruh TP di kelas sasar agar tidak ada materi tertinggal.</span>
                    </li>
                    <li className="flex gap-1.5">
                      <span className="text-amber-500 font-bold font-mono">3.</span>
                      <span><strong>Kesinambungan:</strong> Saling mengikat dinamis antar-tahun ajaran (seperti Prota & Promes).</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5 bg-[#07070a]/55 p-2.5 rounded-xl border border-zinc-900/50">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold font-sans">
                    4 METODE PENGURUTAN ATP
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] leading-tight">
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-900">
                      <span className="text-amber-400 font-semibold block text-[10.5px]">① Konkret - Abstrak</span>
                      Mulai dari inderawi yang nyata ke teori tingkat tinggi.
                    </div>
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-900">
                      <span className="text-amber-400 font-semibold block text-[10.5px]">② Deduktif</span>
                      Dari materi umum ke penerapan khusus dalam latihan kasus.
                    </div>
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-900">
                      <span className="text-amber-400 font-semibold block text-[10.5px]">③ Hierarki</span>
                      Konseptual dasar dikuasai mutlak sebagai syarat belajar lanjut.
                    </div>
                    <div className="p-1.5 rounded bg-zinc-950/60 border border-zinc-900">
                      <span className="text-amber-400 font-semibold block text-[10.5px]">④ Prosedural</span>
                      Mengikuti langkah urut operasional kerja terstruktur.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeGuideTab === "sandbox" && (() => {
              const getSandboxFeedbackLocal = (text: string) => {
                if (!text.trim()) {
                  return {
                    status: "idle",
                    hasKko: false,
                    kkoFound: "",
                    hasLength: false,
                    scoreText: "Belum Diuji",
                    message: "Masukkan draf pernyataan Tujuan Pembelajaran (TP) Anda pada kotak di atas untuk menganalisis kesesuaiannya."
                  };
                }

                const cleanText = text.toLowerCase();
                let foundKko = "";
                for (const verb of kkoCollection) {
                  if (cleanText.includes(verb)) {
                    foundKko = verb;
                    break;
                  }
                }

                const hasLength = text.trim().length >= 20;
                const hasKko = foundKko !== "";

                if (hasKko && hasLength) {
                  return {
                    status: "success",
                    hasKko: true,
                    kkoFound: foundKko,
                    hasLength: true,
                    scoreText: "Sangat Baik (Sesuai)",
                    message: `Rumusan TP Anda dinilai sangat baik! Kompetensi KKO terdeteksi "${foundKko}" dan draf memiliki deskripsi spesifikasi lingkup materi yang cukup mendalam berdasarkan Keputusan BSKAP 046/2025.`
                  };
                }

                if (hasKko && !hasLength) {
                  return {
                    status: "warning",
                    hasKko: true,
                    kkoFound: foundKko,
                    hasLength: false,
                    scoreText: "Atribut Kurang Spesifik",
                    message: `Kompetensi terdeteksi: "${foundKko}". Namun kalimat TP terlalu pendek. Tambahkan rincian lingkup materi esensial secara spesifik agar Tujuan Pembelajaran lebih terukur.`
                  };
                }

                if (!hasKko && hasLength) {
                  return {
                    status: "warning",
                    hasKko: false,
                    kkoFound: "",
                    hasLength: true,
                    scoreText: "KKO Tidak Terdeteksi",
                    message: "Uraian materi sudah cukup detail, tapi belum mendeteksi Kata Kerja Operasional (KKO) yang terukur. Gunakan kata kerja tindakan konkret seperti 'menyusun', 'mengidentifikasi', atau 'menerapkan' agar tujuan dapat dievaluasi."
                  };
                }

                return {
                  status: "danger",
                  hasKko: false,
                  kkoFound: "",
                  hasLength: false,
                  scoreText: "Perlu Direvisi",
                  message: "Kalimat terlalu pendek dan belum terdeteksi KKO kurikulum. Rumusan TP yang baik harus mengombinasikan Kompetensi (tindakan terukur) + Lingkup Materi (konten ilmiah)."
                };
              };

              const feedback = getSandboxFeedbackLocal(sandboxText);

              return (
                <div className="space-y-3 text-left animate-fade-in text-xs leading-relaxed text-zinc-400">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      Kotak Uji Coba Rumusan TP Anda
                    </label>
                    <textarea
                      rows={3}
                      value={sandboxText}
                      onChange={(e) => setSandboxText(e.target.value)}
                      className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl p-2.5 text-[11px] text-zinc-200 outline-none transition leading-relaxed font-sans placeholder:text-zinc-700"
                      placeholder="Contoh: Peserta didik mampu menganalisis siklus hidrologi..."
                    />
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] text-zinc-550 font-mono">Preset uji coba:</span>
                      <button
                        type="button"
                        onClick={() => setSandboxText("Peserta didik menganalisis organ pencernaan manusia.")}
                        className="text-[9px] font-mono bg-zinc-905 hover:bg-zinc-850 text-zinc-300 py-0.5 px-2 rounded border border-zinc-800 cursor-pointer"
                      >
                        Sampel A
                      </button>
                      <button
                        type="button"
                        onClick={() => setSandboxText("Bilangan cacah besar.")}
                        className="text-[9px] font-mono bg-zinc-905 hover:bg-[#121319] text-zinc-300 py-0.5 px-2 rounded border border-zinc-800 cursor-pointer"
                      >
                        Sampel B
                      </button>
                    </div>
                  </div>

                  {/* Feedback Panel */}
                  <div className={`p-3 rounded-xl border flex flex-col space-y-1.5 transition-all duration-300 ${
                    feedback.status === "success"
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-300"
                      : feedback.status === "warning"
                      ? "bg-amber-950/10 border-amber-500/20 text-amber-305"
                      : feedback.status === "danger"
                      ? "bg-red-950/10 border-red-500/20 text-red-300"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-500"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider">
                        HASIL ANALISATOR
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.25 rounded border ${
                        feedback.status === "success"
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                          : feedback.status === "warning"
                          ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                          : feedback.status === "danger"
                          ? "bg-red-500/10 border-red-500/25 text-red-400"
                          : "bg-zinc-900 border-zinc-850 text-zinc-550"
                      }`}>
                        {feedback.scoreText}
                      </span>
                    </div>

                    <p className="text-[10.5px] leading-relaxed">
                      {feedback.message}
                    </p>

                    {sandboxText.trim() && (
                      <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[9px] font-mono">
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${feedback.hasKko ? "bg-emerald-500" : "bg-red-500"}`} />
                          KKO: {feedback.hasKko ? "TERDETEKSI" : "NIHIL"}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${feedback.hasLength ? "bg-emerald-500" : "bg-red-500"}`} />
                          LENGKAP: {feedback.hasLength ? "YA" : "TIDAK"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Main Form Block (Fullscreen Layout Stack) */}
          <div className="w-full flex flex-col space-y-8">
          
          {/* Preset Buttons - Re-styled as an Elegant, Eye-Catching Academic Deck */}
          <div className="bg-gradient-to-b from-[#0c0d15] to-[#040508] border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
            {/* Glowing top line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-extrabold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    Rekomendasi Dokumen Capaian (CP)
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/25 animate-pulse">SIAP PAKAI</span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
                    Pilih standar Capaian Pembelajaran Kurikulum Merdeka nasional di bawah ini untuk mengisi formulir secara instan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CP_PRESETS.map((p) => {
                const style = getPresetStyler(p.id);
                // Custom theme background & accent for the presets to make them pop!
                const getPresetBg = (id: string) => {
                  switch (id) {
                    case "matematika-b": return "from-[#08152c]/50 to-[#03060c]/55 hover:from-[#0a1e3e]/65 border-blue-500/20 hover:border-blue-500/50";
                    case "bahasa-c": return "from-[#082015]/50 to-[#020a06]/55 hover:from-[#0c3020]/65 border-emerald-500/20 hover:border-emerald-500/50";
                    case "ipas-b": return "from-[#061e24]/50 to-[#02090b]/55 hover:from-[#092a33]/65 border-cyan-500/20 hover:border-cyan-500/50";
                    default: return "from-[#1b0d26]/50 to-[#08040b]/55 hover:from-[#29143a]/65 border-purple-500/20 hover:border-purple-500/50";
                  }
                };
                
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className={`p-6 rounded-2xl border bg-gradient-to-br ${getPresetBg(p.id)} text-left transition-all duration-300 relative group overflow-hidden flex flex-col justify-between min-h-[185px] cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.65)] hover:-translate-y-1`}
                  >
                    {/* Glowing Accent strip */}
                    <div className={`absolute top-0 left-0 w-[4px] h-full ${style.accentLine} transition-all group-hover:w-[6px]`} />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-sans font-semibold tracking-wide ${style.badgeBg}`}>
                          {style.label}
                        </span>
                        <span className="text-xs text-zinc-400 group-hover:text-amber-400 transition-colors font-sans font-medium">
                          {p.alokasiJp} JP/Mg
                        </span>
                      </div>
                      
                      <p className="font-bold text-zinc-100 group-hover:text-white text-sm leading-relaxed font-sans tracking-tight">
                        {p.title}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-900/60 flex items-center justify-between w-full">
                      <span className="text-xs text-zinc-400 font-medium font-sans group-hover:text-zinc-200">
                        {p.faseKelas}
                      </span>
                      <span className="text-xs text-amber-400 font-bold font-sans group-hover:translate-x-1.5 transition-transform flex items-center gap-1 shrink-0">
                        Gunakan <ArrowRight className="w-4 h-4 text-amber-400" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Bento-Grid styled forms with customizable beautiful variations */}
          <div className="space-y-6">

            {/* Selector Card for Fase & Sasaran Kelas (Warm Amber Sunset Theme) */}
            <div className="bg-gradient-to-br from-[#241205] via-[#0f0702] to-[#050201] border border-amber-600/25 p-6 md:p-8 rounded-3xl space-y-6 shadow-[0_15px_40px_rgba(245,158,11,0.08)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-950/40 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 shadow-lg shadow-amber-500/5">
                    <School className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <SmartTooltip type="atp-fase">
                      <h4 className="text-base font-sans font-bold text-amber-300 tracking-wide">
                        Sasaran Fase & Tingkat Kelas
                      </h4>
                    </SmartTooltip>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Tentukan tingkat kompetensi dan materi ajar esensial yang ingin diampu.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Sasaran Aktif:</span>
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-305 font-sans text-xs uppercase font-extrabold border border-amber-500/35 shadow-inner">
                    {faseKelas || "Belum Dipilih"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-6 pt-1">
                
                {/* 1. JENJANG SD */}
                <div className="bg-[#020a07]/50 border border-emerald-950/40 p-5 md:p-6 rounded-2xl relative shadow-md hover:border-emerald-500/30 transition duration-300 flex flex-col xl:flex-row xl:items-center gap-6 justify-between">
                  <div className="flex items-center gap-3 xl:w-[220px] shrink-0">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="text-xs font-mono font-bold">FASE A-C</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-sans font-bold text-emerald-300 font-extrabold">Jenjang SD</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Sekolah Dasar</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1 w-full">
                    {[
                      "Fase A (Kelas 1)",
                      "Fase A (Kelas 2)",
                      "Fase B (Kelas 3)",
                      "Fase B (Kelas 4)",
                      "Fase C (Kelas 5)",
                      "Fase C (Kelas 6)",
                    ].map((val) => {
                      const isActive = faseKelas === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFaseKelas(val)}
                          className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-center border cursor-pointer leading-snug flex items-center justify-center min-h-[48px] ${
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/25 to-teal-500/10 text-emerald-300 border-emerald-400 shadow-[0_6px_22px_rgba(16,185,129,0.32)] scale-[1.04]"
                              : "bg-[#020403] text-zinc-400 border-emerald-950/65 hover:text-emerald-300 hover:bg-[#020907] hover:border-emerald-500/30"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. JENJANG SMP */}
                <div className="bg-[#020a10]/50 border border-cyan-950/40 p-5 md:p-6 rounded-2xl relative shadow-md hover:border-cyan-500/30 transition duration-300 flex flex-col xl:flex-row xl:items-center gap-6 justify-between">
                  <div className="flex items-center gap-3 xl:w-[220px] shrink-0">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <span className="text-xs font-mono font-bold">FASE D</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-sans font-bold text-cyan-300 font-extrabold">Jenjang SMP</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Sekolah Menengah Pertama</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 w-full">
                    {[
                      "Fase D (Kelas 7)",
                      "Fase D (Kelas 8)",
                      "Fase D (Kelas 9)",
                    ].map((val) => {
                      const isActive = faseKelas === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFaseKelas(val)}
                          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-center border cursor-pointer leading-snug flex items-center justify-center min-h-[48px] ${
                            isActive
                              ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/10 text-cyan-300 border-cyan-400 shadow-[0_6px_22px_rgba(6,182,212,0.32)] scale-[1.04]"
                              : "bg-[#010305] text-zinc-400 border-cyan-950/65 hover:text-cyan-300 hover:bg-[#010810] hover:border-cyan-500/30"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. JENJANG SMA/SMK */}
                <div className="bg-[#07020d]/50 border border-purple-950/40 p-5 md:p-6 rounded-2xl relative shadow-md hover:border-purple-500/30 transition duration-300 flex flex-col xl:flex-row xl:items-center gap-6 justify-between">
                  <div className="flex items-center gap-3 xl:w-[220px] shrink-0">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <span className="text-xs font-mono font-bold">FASE E-F</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-sans font-bold text-violet-300 font-extrabold">Jenjang SMA/SMK</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Sekolah Menengah Atas / Kejuruan</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 w-full">
                    {[
                      "Fase E (Kelas 10)",
                      "Fase F (Kelas 11)",
                      "Fase F (Kelas 12)",
                    ].map((val) => {
                      const isActive = faseKelas === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFaseKelas(val)}
                          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-center border cursor-pointer leading-snug flex items-center justify-center min-h-[48px] ${
                            isActive
                              ? "bg-gradient-to-r from-violet-500/25 to-fuchsia-500/10 text-violet-300 border-purple-400 shadow-[0_6px_22px_rgba(139,92,246,0.32)] scale-[1.04]"
                              : "bg-[#030105] text-zinc-400 border-purple-950/65 hover:text-purple-300 hover:bg-[#08020f] hover:border-purple-500/30"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>

            {/* Integrated Subject Selector (Emerald Green/Teal Theme) */}
            <div className="bg-[#030706] border border-emerald-900/35 p-6 md:p-8 rounded-3xl space-y-6 shadow-[0_15px_40px_rgba(16,185,129,0.05)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] hover:border-emerald-500/35 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-950/40 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-sans font-bold text-emerald-300 tracking-wide">
                      Mata Pelajaran Terintegrasi
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed font-sans">
                      Hanya menampilkan mata pelajaran yang telah diaktifkan pada <strong>Profil Sekolah</strong> demi konsistensi kurikulum dan perencanaan pembelajaran.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* 1. DROP DROP MATA PELAJARAN */}
                <div className="space-y-2 text-left">
                  <SmartTooltip type="atp-mapel">
                    <label className="block text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      Pilih Mata Pelajaran
                    </label>
                  </SmartTooltip>
                  <select
                    value={mapel}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setMapel(selectedVal);
                      
                      // Auto-generate or set a custom advice message if custom local subject is chosen
                      const isCustom = activeSubjectsList.find(s => s.label === selectedVal || s.id === selectedVal)?.isCustom;
                      if (isCustom) {
                        const prov = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";
                        const kab = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";
                        setCpText(`Siswa mempelajari nilai-nilai kearifan lokal muatan lokal "${selectedVal}" di wilayah Kabupaten/Kota ${kab}, Provinsi ${prov}. Siswa mampu memahami sastra lisan, cerita rakyat, seni tradisi daerah, adat istiadat setempat, serta menerapkan pembiasaan luhur kehidupan sosial budaya sesuai karakteristik wilayah ${kab}, ${prov}.`);
                        setCpInputMode("text");
                      }
                    }}
                    className="w-full bg-[#030504] border border-emerald-950/65 focus:border-emerald-500 focus:bg-[#030705] rounded-xl p-3.5 text-sm text-zinc-250 outline-none transition"
                  >
                    {activeSubjectsList.map((subj) => (
                      <option key={subj.id} value={subj.label} className="bg-black text-zinc-300">
                        {subj.label} {subj.isCustom ? "★ (Kustom Muatan Lokal)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. ALOKASI JP MINGGUAN */}
                <div className="space-y-2 text-left">
                  <SmartTooltip type="atp-jp">
                    <label className="block text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      Alokasi JP per Minggu
                    </label>
                  </SmartTooltip>
                  <select
                    value={alokasiJp}
                    onChange={(e) => setAlokasiJp(e.target.value)}
                    className="w-full bg-[#030504] border border-emerald-950/65 focus:border-emerald-500 focus:bg-[#030705] rounded-xl p-3.5 text-sm text-zinc-250 outline-none transition font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num.toString()} className="bg-black text-zinc-300">{num} JP / Minggu</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          <div>
            <div className="border border-rose-500/20 bg-gradient-to-br from-[#20070e] via-[#0c0205] to-[#040102] rounded-3xl p-6 md:p-8 space-y-5 shadow-[0_15px_40px_rgba(244,63,94,0.08)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.15)] hover:border-rose-450/45 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/50 pb-5">
                <div>
                  <SmartTooltip type="atp-cp">
                    <h4 className="text-sm font-sans font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                      Sumber Data Capaian Pembelajaran (CP)
                    </h4>
                  </SmartTooltip>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    Rujukan Standar: <strong>BSKAP No. 046 Tahun 2025</strong> (Kurikulum Merdeka Terbaru)
                  </p>
                </div>
                
                <div className="flex bg-[#040102]/95 border border-rose-950/80 p-1.5 rounded-2xl shrink-0 space-x-1 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCpInputMode("file");
                      setErrorMsg(null);
                    }}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition font-sans uppercase cursor-pointer ${
                      cpInputMode === "file" 
                        ? "bg-rose-500/20 text-rose-350 border border-rose-500/30 shadow-inner" 
                        : "text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    Unggah Berkas CP
                  </button>
                  <button
                        type="button"
                        onClick={() => {
                          setCpInputMode("text");
                          setErrorMsg(null);
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition font-sans uppercase cursor-pointer ${
                          cpInputMode === "text" 
                            ? "bg-rose-500/20 text-rose-350 border border-rose-500/30 shadow-inner" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Tempel Teks CP
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCpInputMode("bank");
                          setErrorMsg(null);
                        }}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 uppercase cursor-pointer shadow-sm ${
                          cpInputMode === "bank" 
                            ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white border border-sky-450 shadow-[0_0_12px_rgba(59,130,246,0.6)] font-extrabold" 
                            : "bg-blue-955/20 text-blue-400 border border-blue-900/40 hover:border-blue-500/60 hover:text-blue-300 hover:bg-blue-955/35"
                        }`}
                      >
                        Ambil Dari Bank 📁
                      </button>
                    </div>
                  </div>

                  {cpInputMode === "file" ? (
                    <div className="space-y-3">
                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        💡 <strong>Sistem Otomatis BSKAP 046/2025:</strong> Unggah naskah dokumen PDF, Word (.docx), atau Teks (.txt) CP resmi. Sistem kami akan secara otomatis mengekstrak dan menganalisis materi kurikulum secara dinamis berlandaskan pilihan <strong>Fase/Kelas</strong> dan <strong>Mata Pelajaran</strong> Anda.
                      </p>

                      {!cpFile ? (
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
                            dragActive
                              ? "border-rose-455 bg-rose-500/10 animate-pulse"
                              : "border-rose-950/65 bg-[#050102]/65 hover:border-rose-700/60 font-sans"
                          }`}
                        >
                          <input
                            id="planner-pdf-uploader"
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={handleFileInput}
                          />
                          <label htmlFor="planner-pdf-uploader" className="cursor-pointer space-y-2 block">
                            <UploadCloud className="w-6 h-6 text-rose-450 mx-auto animate-bounce shrink-0" />
                            <div>
                              <p className="text-xs text-zinc-200 font-bold font-sans">Seret berkas PDF, Word (.docx), atau Teks (.txt) ke sini atau klik untuk menelusuri</p>
                              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Format didukung: .pdf, .docx, .doc, .txt (Maks. 30MB)</p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-[#050102]/80 border border-rose-950/60 rounded-xl font-mono text-[11px] gap-2 leading-relaxed">
                          <div className="flex items-center gap-2.5 truncate">
                            <File className="w-4 h-4 text-rose-405 shrink-0 animate-pulse" />
                            <div className="truncate text-left">
                              <span className="text-zinc-200 font-semibold truncate block">{cpFile.name}</span>
                              <span className="text-[9px] text-zinc-500 font-mono block mt-1">
                                {(cpFile.size / (1024 * 1024)).toFixed(2)} MB • {fileReadingStatus}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCpFile(null);
                              setFileBase64(null);
                              setFileMime(null);
                              setCpText("");
                              setFileReadingStatus("");
                            }}
                            className="py-1.5 px-3.5 bg-rose-955/40 border border-rose-900/40 hover:bg-rose-900/60 hover:text-white text-rose-350 rounded-lg text-xs transition shrink-0 font-sans font-bold uppercase cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ) : cpInputMode === "bank" ? (
                    <div className="space-y-3 animate-fade-in text-left">
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        💡 Pilih dokumen naskah CP atau hasil ekstraksi PDF yang telah disimpan sebelumnya di Bank Dokumen Premium untuk langsung dimuat.
                      </p>
                      
                      {bankDocs.length === 0 ? (
                        <div className="p-5 border border-dashed border-rose-955/40 rounded-xl text-center space-y-2 bg-[#050102]/40">
                          <p className="text-sm text-zinc-500 font-medium">Bank Dokumen lokal Anda kosong.</p>
                          <p className="text-xs text-zinc-400 font-sans">Ekstrak berkas terlebih dahulu di menu <strong>Sari Dokumen Cerdas</strong> atau tulis draf baru di <strong>Bank Dokumen</strong>.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <select
                            value={selectedBankDocId}
                            onChange={(e) => {
                              const docId = e.target.value;
                              setSelectedBankDocId(docId);
                              const found = bankDocs.find(d => d.id === docId);
                              if (found) {
                                setCpText(found.content);
                              }
                            }}
                            className="w-full bg-[#050102]/95 border border-rose-950/60 hover:border-rose-800 focus:border-rose-500 rounded-xl p-3.5 text-sm text-zinc-205 outline-none transition"
                          >
                            <option value="" disabled>-- Pilih Dokumen dari Bank --</option>
                            {bankDocs.map(doc => (
                              <option key={doc.id} value={doc.id}>
                                {doc.name} ({doc.category.toUpperCase()})
                              </option>
                            ))}
                          </select>
 
                          {cpText && (
                            <div className="p-4 bg-black/50 border border-rose-950/40 rounded-xl max-h-[160px] overflow-y-auto font-sans text-xs text-rose-200 whitespace-pre-wrap leading-relaxed">
                              {cpText}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5 animate-fade-in text-left">
                      <textarea
                        rows={6}
                        value={cpText}
                        onChange={(e) => setCpText(e.target.value)}
                        className="w-full bg-[#050102]/95 border border-rose-950/60 focus:border-rose-450 rounded-xl p-4 text-sm text-zinc-200 outline-none transition leading-relaxed font-sans placeholder:text-zinc-600 focus:ring-1 focus:ring-rose-500/20"
                        placeholder="Rekatkan kalimat utuh Capaian Pembelajaran atau potongan bab kurikulum dari naskah BSKAP No 046/2025 di sini..."
                        required={cpInputMode === "text"}
                      />
                    </div>
                  )}
            </div>
          </div>
 
          {errorMsg && (
            <div className="flex gap-2.5 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200 font-sans leading-relaxed text-left">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <strong>Gagal Melakukan Rumusan:</strong> {errorMsg}
              </div>
            </div>
          )}
 
          <div className="flex justify-end pt-5">
            <button
              onClick={generateLessonPlan}
              disabled={loading || (cpInputMode === "text" && !cpText) || (cpInputMode === "file" && !fileBase64 && !cpText) || (cpInputMode === "bank" && !cpText)}
              className={`py-4 px-10 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 text-black font-extrabold font-sans text-sm flex items-center gap-2.5 shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 transition-all cursor-pointer tracking-wide uppercase ${
                loading || (cpInputMode === "text" && !cpText) || (cpInputMode === "file" && !fileBase64 && !cpText) || (cpInputMode === "bank" && !cpText) ? "opacity-40 cursor-not-allowed" : "hover:brightness-110 hover:shadow-[0_12px_40px_rgba(245,158,11,0.4)]"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span className="animate-pulse">{loadingStatus || "Memformulasikan Rencana..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-black shrink-0 animate-pulse" />
                  <span>Formulasikan TP, ATP, KKTP, PROTA & PROMES (Mutakhir)</span>
                </>
              )}
            </button>
          </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in text-zinc-300">
          
          {/* Action Control Panel */}
          <div className="bg-gradient-to-r from-[#0b0c11] to-[#0c0d16] rounded-2xl border border-zinc-900/90 shadow-xl overflow-hidden p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Badge & Info */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  MATRIKS AJAR AKTIF
                </span>
                <span className="text-[11px] text-zinc-400 font-mono bg-[#030305] px-2.5 py-1 rounded-lg border border-zinc-900/60">
                  Terdistribusi: <strong className="text-zinc-200 font-extrabold font-mono">{(parseInt(alokasiJp) || 4) * 36} JP</strong> Efektif / Tahun
                </span>
              </div>
              
              {/* Actions Grid / Row */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={saveToDocumentBank}
                  disabled={isSavedToBank || savingToBank}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 tracking-wide transition-all duration-200 active:scale-95 cursor-pointer w-full md:w-auto ${
                    isSavedToBank 
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 cursor-default shadow-sm shadow-emerald-500/5" 
                      : "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:border-amber-400 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5 shrink-0 text-amber-450" />
                  <span>{savingToBank ? "Proses..." : isSavedToBank ? "Tersimpan!" : "Simpan Bank"}</span>
                </button>
                {isSavedToBank && savedDocId && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("omega_db_selected_doc_id", savedDocId);
                      window.dispatchEvent(new CustomEvent("navigate-to-tool", { detail: "doc_bank" }));
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-[pulse_2s_infinite] cursor-pointer w-full md:w-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Dokumen 🔓</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="py-2 px-3 rounded-xl border border-zinc-800 bg-[#0c0d12] hover:bg-[#12141c] hover:border-zinc-700 text-[11px] font-bold font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full md:w-auto"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-450" />
                      <span className="text-emerald-450 animate-pulse">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-550 shrink-0" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={downloadAsWord}
                  className="py-2 px-3 rounded-xl border border-zinc-800 bg-[#0c0d12] hover:bg-[#12141c] hover:border-zinc-700 text-[11px] font-bold font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full md:w-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Unduh Word</span>
                </button>

                <button
                  type="button"
                  onClick={downloadAsPdf}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 tracking-wide transition-all duration-205 shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer w-full md:w-auto"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>Format PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Academic markdown render container */}
          <div className="bg-[#030305] border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed text-zinc-350 max-h-[800px] overflow-y-auto font-sans text-xs select-text scrollbar-thin">
            
            <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-[12px]">
              
              {/* Parse headers dynamically for nice visual card mapping */}
              {generatedMd.split("\n\n").map((chunk, idx) => {
                const trimmed = chunk.trim();
                if (!trimmed) return null;

                // Title H1
                if (trimmed.startsWith("# ")) {
                  return (
                    <h1 key={idx} className="text-xl md:text-2xl font-bold font-display text-white border-b border-zinc-900 pb-3 mt-8 mb-4 tracking-tight">
                      {trimmed.replace("# ", "").replace(/\*\*/g, "")}
                    </h1>
                  );
                }

                // Title H2
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-md font-bold font-display text-zinc-200 mt-6 mb-3 tracking-wide flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm" />
                      {trimmed.replace("## ", "").replace(/\*\*/g, "")}
                    </h2>
                  );
                }

                // Title H3
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-xs font-bold text-amber-400 font-mono mt-5 mb-2.5 uppercase tracking-wider flex items-center gap-1.5 bg-amber-500/5 py-1 px-2.5 rounded-lg border border-amber-500/20 w-fit">
                      {trimmed.replace("### ", "").replace(/\*\*/g, "")}
                    </h3>
                  );
                }

                // Bullet Lists
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-2 text-zinc-300">
                      {trimmed.split("\n").map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {li.replace(/^[\-\*]\s+/, "").replace(/\*\*/g, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Multi-line Markdown Tables formatting (beautiful bento table cells look)
                if (trimmed.startsWith("|")) {
                  const rows = trimmed.split("\n").filter(row => row.trim() && !row.includes("---"));
                  if (rows.length === 0) return null;

                  const headers = rows[0].split("|").map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
                  const dataRows = rows.slice(1).map(row => 
                    row.split("|").map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
                  );

                  return (
                    <div key={idx} className="overflow-x-auto w-full my-6 border border-zinc-900 rounded-xl bg-zinc-950/60 shadow-lg">
                      <table className="min-w-full text-left border-collapse font-sans text-[11px]">
                        <thead>
                          <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-300 font-bold">
                            {headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3 text-[10px] uppercase font-mono tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataRows.map((r, rIdx) => (
                            <tr key={rIdx} className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors">
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="p-3 text-zinc-400 font-sans leading-relaxed align-top">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                // General paragraphs
                return (
                  <p key={idx} className="leading-relaxed text-zinc-300 font-sans">
                    {trimmed.replace(/\*\*/g, "")}
                  </p>
                );
              })}

            </div>

          </div>

          {/* Action Footer row */}
          <div className="flex justify-between items-center bg-[#07070c] border border-zinc-900 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[11px] font-sans text-zinc-400">
                Penyusunan telah diselaraskan dengan aman menurut prinsip operasional Kurikulum Merdeka Kemendikdasmen RI.
              </p>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setGeneratedMd("");
              }}
              className="py-2 px-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white transition text-xs font-bold shrink-0 shadow-lg"
            >
              Re-formulasi Ulang
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
