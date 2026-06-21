import React, { useState, useRef, useEffect } from "react";
import { 
  Plus, Trash2, Image as ImageIcon, MapPin, School, Users, 
  BookOpen, Heart, Compass, Sparkles, Download, Copy, Check, 
  AlertTriangle, RefreshCw, Layers, ArrowRight, Eye, Edit3, 
  Clock, CheckCircle, FileText, ChevronRight, UploadCloud, Database, ExternalLink, Save,
  Columns
} from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";
import { getTutWuriHandayaniLogo, getKemenagLogo, getDefaultSchoolLogo, compressImage } from "../utils/logoGenerator";

interface UploadedImage {
  id: string;
  name: string;
  base64: string;
  type: string;
  caption?: string;
}

export const KospGenerator: React.FC = () => {
  // Stepper state
  const [step, setStep] = useState<number>(() => {
    const saved = localStorage.getItem("kosp_last_step");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Document Bank saving states
  const [isSavedToBank, setIsSavedToBank] = useState<boolean>(false);
  const [savingToBank, setSavingToBank] = useState<boolean>(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  // Hari Kerja Select State (6 vs 5 Hari Efektif)
  const [hariKerja, setHariKerja] = useState<"6" | "5">(() => {
    const saved = localStorage.getItem("kosp_hari_kerja");
    return (saved === "6" || saved === "5") ? saved : "6";
  });

  // Primary Input States
  const [namaSekolah, setNamaSekolah] = useState<string>(() => {
    return localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai";
  });
  const [jenjang, setJenjang] = useState<string>(() => {
    return localStorage.getItem("kosp_jenjang") || "SD";
  });
  const [lokasi, setLokasi] = useState<string>(() => {
    return localStorage.getItem("kosp_lokasi") || "Desa Oehalo, Kecamatan Insana Tengah, Kabupaten Timor Tengah Utara, Provinsi Nusa Tenggara Timur, Kode Pos 856713";
  });
  const [kondisiSocioDemografi, setKondisiSocioDemografi] = useState<string>(() => {
    return localStorage.getItem("kosp_kondisi_socio_demografi") || "Mayoritas wali murid bekerja sebagai petani lahan kering, peternak sapi, dan perajin kain tenun ikat khas NTT dengan tingkat perekonomian menengah ke bawah. Budaya gotong royong dan kebersamaan kekeluargaan adat Timor sangat kental.";
  });
  const [kondisiGuruTendik, setKondisiGuruTendik] = useState<string>(() => {
    return localStorage.getItem("kosp_kondisi_guru_tendik") || "Didukung kepala sekolah berkompeten beserta guru kelas dan guru mapel yang aktif mengembangkan kurikulum merdeka guna mendukung peningkatan literasi-numerasi terpadu.";
  });
  const [fasilitasSekolah, setFasilitasSekolah] = useState<string>(() => {
    return localStorage.getItem("kosp_fasilitas_sekolah") || "Terdapat 6 ruang kelas aktif, perpustakaan penunjang literasi anak, lapangan upacara/olahraga serbaguna, sarana air bersih, serta kebun budidaya lokal untuk laboratorium kontekstual.";
  });
  const [nilaiBudayaLokal, setNilaiBudayaLokal] = useState<string>(() => {
    return localStorage.getItem("kosp_nilai_budaya_lokal") || "Penghormatan nilai adat Timor (Nekaf Mese Ansa Mese / Satu Hati Satu Tekad), pelestarian kain tenun ikat orisinal TTU, seni tari kreasi penyambutan tamu, serta kearifan lokal kelestarian alam.";
  });
  const [visiKeywords, setVisiKeywords] = useState<string>(() => {
    return localStorage.getItem("kosp_visi_keywords") || "Berakhlak Mulia, Cerdas, Berkarakter Kebangsaan, Peduli Kelestarian Lingkungan";
  });
  const [misiKeywords, setMisiKeywords] = useState<string>(() => {
    return localStorage.getItem("kosp_misi_keywords") || "Menyelenggarakan pembelajaran berkualitas ramah anak, melestarikan aset warisan adat tenun ikat daerah, membiasakan perilaku religius sejak dini, melatih kepanduan Pramuka aktif.";
  });

  // New Scientific & Detailed Profile States
  const [kepalaSekolah, setKepalaSekolah] = useState<string>(() => {
    let saved = localStorage.getItem("kosp_kepala_sekolah");
    if (!saved || saved === "Regina Alvares, S.Pd") {
      saved = "Darius Kusi, S.Pd., Gr.";
      localStorage.setItem("kosp_kepala_sekolah", saved);
    }
    return saved;
  });
  const [nipKepala, setNipKepala] = useState<string>(() => {
    let saved = localStorage.getItem("kosp_nip_kepala");
    if (!saved || saved === "19780415 200501 2 011") {
      saved = "196709192008011008";
      localStorage.setItem("kosp_nip_kepala", saved);
    }
    return saved;
  });
  const [tempatPenyusunan, setTempatPenyusunan] = useState<string>(() => {
    return localStorage.getItem("kosp_tempat_penyusunan") || "Oehalo";
  });
  const [tanggalPenyusunan, setTanggalPenyusunan] = useState<string>(() => {
    return localStorage.getItem("kosp_tanggal_penyusunan") || "13 Juli 2026";
  });
  const [ketuaTimPenyusun, setKetuaTimPenyusun] = useState<string>(() => {
    return localStorage.getItem("kosp_ketua_tim_penyusun") || "Roni Hariyanto Bhidju, S.Pd., Gr.";
  });
  const [nipKetuaTim, setNipKetuaTim] = useState<string>(() => {
    return localStorage.getItem("kosp_nip_ketua_tim") || "198603012020121005";
  });
  const [anggota1, setAnggota1] = useState<string>(() => {
    return localStorage.getItem("kosp_anggota_1") || "Fransiskus Seda, S.Pd., Gr.";
  });
  const [anggota2, setAnggota2] = useState<string>(() => {
    return localStorage.getItem("kosp_anggota_2") || "Maria Krisanti Seo, S.Pd.";
  });
  const [anggota3, setAnggota3] = useState<string>(() => {
    return localStorage.getItem("kosp_anggota_3") || "Victoria Abi, S.Pd., Gr.";
  });
  const [khasSatuan, setKhasSatuan] = useState<string>(() => {
    return localStorage.getItem("kosp_khas_satuan") || "Satuan pendidikan khas pedesaan Timor Tengah Utara yang memprioritaskan integrasi kearifan lokal tenun ikat TTU dan pembentukan karakter Pancasila luhur.";
  });
  const [kemitraanSatuan, setKemitraanSatuan] = useState<string>(() => {
    return localStorage.getItem("kosp_kemitraan_satuan") || "Puskesmas Kecamatan Insana Tengah (layanan skrining anak), Kelompok Pengrajin Tenun Ikat Oehalo (mitra kearifan lokal), Komite Sekolah SD Negeri Fatubai.";
  });
  const [jumlahRombel, setJumlahRombel] = useState<string>(() => {
    return localStorage.getItem("kosp_jumlah_rombel") || "6 Rombongan Belajar (Rombel) dengan total proyeksi siswa aktif guna pelayanan sistematis.";
  });
  const [p5Themes, setP5Themes] = useState<string>(() => {
    return localStorage.getItem("kosp_p5_themes") || "Kearifan Lokal dan Kewirausahaan";
  });

  // Valid Teacher Academic Qualifications and Professional Certifications States
  const [jumlahGuruTotal, setJumlahGuruTotal] = useState<number>(() => {
    const val = localStorage.getItem("kosp_jumlah_guru_total");
    return val ? parseInt(val, 10) : 12;
  });
  const [jumlahS1, setJumlahS1] = useState<number>(() => {
    const val = localStorage.getItem("kosp_jumlah_s1");
    return val ? parseInt(val, 10) : 10;
  });
  const [jumlahS2, setJumlahS2] = useState<number>(() => {
    const val = localStorage.getItem("kosp_jumlah_s2");
    return val ? parseInt(val, 10) : 2;
  });
  const [jumlahS3, setJumlahS3] = useState<number>(() => {
    const val = localStorage.getItem("kosp_jumlah_s3");
    return val ? parseInt(val, 10) : 0;
  });
  const [jumlahSertifikasi, setJumlahSertifikasi] = useState<number>(() => {
    const val = localStorage.getItem("kosp_jumlah_sertifikasi");
    return val ? parseInt(val, 10) : 6;
  });

  // Interfaces and helper functions for Class Curriculum allocation
  const [customSubjects, setCustomSubjects] = useState<{ [key: string]: { label: string; jp: number } }>(() => {
    const saved = localStorage.getItem("kosp_custom_subjects");
    return saved ? JSON.parse(saved) : {};
  });

  const [customExtracurriculars, setCustomExtracurriculars] = useState<{ [key: string]: { label: string } }>(() => {
    const saved = localStorage.getItem("kosp_custom_extracurriculars");
    return saved ? JSON.parse(saved) : {};
  });

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  const [newManualSubjectName, setNewManualSubjectName] = useState<string>("");
  const [newManualSubjectJp, setNewManualSubjectJp] = useState<number>(2);
  const [newManualExtraName, setNewManualExtraName] = useState<string>("");

  const removeCustomSubject = (key: string) => {
    const label = customSubjects[key]?.label || key;
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus mata pelajaran "${label}" dari seluruh jenjang kelas secara permanen?`);
    setDeleteConfirmCallback(() => () => {
      setCustomSubjects((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setClassConfigs((prev) => {
        const updated = { ...prev };
        [1, 2, 3, 4, 5, 6].forEach((g) => {
          if (updated[g]?.subjects) {
            const subjectsCopy = { ...updated[g].subjects };
            delete subjectsCopy[key];
            updated[g] = { ...updated[g], subjects: subjectsCopy };
          }
        });
        return updated;
      });
    });
    setDeleteConfirmId(key);
  };

  const removeCustomExtra = (key: string) => {
    const label = customExtracurriculars[key]?.label || key;
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus ekstrakurikuler "${label}" dari seluruh jenjang kelas secara permanen?`);
    setDeleteConfirmCallback(() => () => {
      setCustomExtracurriculars((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setClassConfigs((prev) => {
        const updated = { ...prev };
        [1, 2, 3, 4, 5, 6].forEach((g) => {
          if (updated[g]?.extracurriculars) {
            const extraCopy = { ...updated[g].extracurriculars };
            delete extraCopy[key];
            updated[g] = { ...updated[g], extracurriculars: extraCopy };
          }
        });
        return updated;
      });
    });
    setDeleteConfirmId(key);
  };

  const addCustomSubject = () => {
    if (!newManualSubjectName.trim()) return;
    const newKey = `custom_subj_${Date.now()}`;
    const newLabel = newManualSubjectName.trim();
    const newJp = newManualSubjectJp || 2;

    setCustomSubjects((prev) => {
      const updated = { ...prev, [newKey]: { label: newLabel, jp: newJp } };
      localStorage.setItem("kosp_custom_subjects", JSON.stringify(updated));
      return updated;
    });

    setClassConfigs((prev) => {
      const updated = { ...prev };
      if (updated[activeGradeTab]) {
        updated[activeGradeTab] = {
          ...updated[activeGradeTab],
          subjects: {
            ...updated[activeGradeTab].subjects,
            [newKey]: true
          }
        };
      }
      return updated;
    });

    setNewManualSubjectName("");
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
    alert(`✓ Mapel "${newLabel}" Berhasil Ditambahkan ke Kelas ${activeGradeTab}!`);
  };

  const addCustomExtra = () => {
    if (!newManualExtraName.trim()) return;
    const newKey = `custom_extra_${Date.now()}`;
    const newLabel = newManualExtraName.trim();

    setCustomExtracurriculars((prev) => {
      const updated = { ...prev, [newKey]: { label: newLabel } };
      localStorage.setItem("kosp_custom_extracurriculars", JSON.stringify(updated));
      return updated;
    });

    setClassConfigs((prev) => {
      const updated = { ...prev };
      if (updated[activeGradeTab]) {
        updated[activeGradeTab] = {
          ...updated[activeGradeTab],
          extracurriculars: {
            ...updated[activeGradeTab].extracurriculars,
            [newKey]: true
          }
        };
      }
      return updated;
    });

    setNewManualExtraName("");
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
    alert(`✓ Ekskul "${newLabel}" Berhasil Ditambahkan ke Kelas ${activeGradeTab}!`);
  };

  const getSubjectJp = (subjectKey: string, grade: number): number => {
    if (subjectKey.startsWith("custom_")) {
      return customSubjects[subjectKey]?.jp || 2;
    }
    switch (subjectKey) {
      case "agamaIslam":
      case "agamaKristen":
      case "agamaKatolik":
        return 3;
      case "pancasila":
        return 4;
      case "indonesia":
        if (grade === 1) return 8;
        if (grade === 2) return 10;
        return 6;
      case "matematika":
        if (grade === 1) return 4;
        return 5;
      case "ipas":
        return grade >= 3 ? 6 : 0;
      case "seniMusik":
      case "seniTari":
      case "seniRupa":
        return 3;
      case "kka":
        return 2;
      case "pjok":
        return 4;
      case "inggris":
        return 2;
      default:
        return 0;
    }
  };

  const getSubjectLabel = (subjectKey: string): string => {
    if (subjectKey.startsWith("custom_")) {
      return customSubjects[subjectKey]?.label || subjectKey.replace("custom_", "");
    }
    switch (subjectKey) {
      case "agamaIslam": return "Pendidikan Agama Islam";
      case "agamaKristen": return "Pendidikan Agama Kristen";
      case "agamaKatolik": return "Pendidikan Agama Katolik";
      case "pancasila": return "Pendidikan Pancasila";
      case "indonesia": return "Bahasa Indonesia";
      case "matematika": return "Matematika";
      case "ipas": return "IPAS (Ilmu Pengetahuan Alam & Sosial)";
      case "seniMusik": return "Seni Musik";
      case "seniTari": return "Seni Tari (Intra)";
      case "seniRupa": return "Seni Rupa";
      case "kka": return "KKA / Prakarya / Keterampilan";
      case "pjok": return "PJOK (Jasmani & Kesehatan)";
      case "inggris": return "Bahasa Inggris (Pilihan)";
      default: return "";
    }
  };

  const getExtraLabel = (extraKey: string): string => {
    if (extraKey.startsWith("custom_extra_")) {
      return customExtracurriculars[extraKey]?.label || extraKey.replace("custom_extra_", "");
    }
    switch (extraKey) {
      case "pramuka": return "Karakter Pramuka (Wajib)";
      case "olahraga": return "Olahraga (Futsal, Bola Sepak)";
      case "seniTari": return "Seni Tari (Ekskul Pilihan)";
      default: return "";
    }
  };

  const [activeGradeTab, setActiveGradeTab] = useState<number>(1);
  const [classConfigs, setClassConfigs] = useState<{
    [grade: number]: {
      subjects: { [key: string]: boolean };
      extracurriculars: { [key: string]: boolean };
    };
  }>(() => {
    // 1. Get profiles config
    const activeStandardRaw = localStorage.getItem("profile_active_subjects");
    const activeCustomRaw = localStorage.getItem("profile_custom_subjects");
    const activeStandardExtrasRaw = localStorage.getItem("profile_active_extras");
    const activeCustomExtrasRaw = localStorage.getItem("profile_custom_extras");

    let activeStandardList: string[] = [];
    if (activeStandardRaw) {
      try { activeStandardList = JSON.parse(activeStandardRaw); } catch(e){}
    }
    if (activeStandardList.length === 0) {
      activeStandardList = ["agamaIslam", "agamaKristen", "agamaKatolik", "pancasila", "indonesia", "matematika", "ipas", "seniMusik", "seniTari", "seniRupa", "pjok", "inggris"];
    }

    let activeCustomList: any[] = [];
    if (activeCustomRaw) {
      try { activeCustomList = JSON.parse(activeCustomRaw); } catch(e){}
    }

    const allowedSubjKeys = new Set<string>();
    activeStandardList.forEach(k => allowedSubjKeys.add(k));
    activeCustomList.forEach(item => allowedSubjKeys.add(item.id));

    let activeExtStandardList: string[] = [];
    if (activeStandardExtrasRaw) {
      try { activeExtStandardList = JSON.parse(activeStandardExtrasRaw); } catch(e){}
    }
    if (activeExtStandardList.length === 0) {
      activeExtStandardList = ["pramuka", "olahraga", "seniTari"];
    }

    let activeExtCustomList: any[] = [];
    if (activeCustomExtrasRaw) {
      try { activeExtCustomList = JSON.parse(activeCustomExtrasRaw); } catch(e){}
    }

    const allowedExtraKeys = new Set<string>();
    activeExtStandardList.forEach(k => allowedExtraKeys.add(k));
    activeExtCustomList.forEach(item => allowedExtraKeys.add(item.id));

    // 2. Load existing or build default
    const saved = localStorage.getItem("kosp_class_configs");
    let configs: any = null;
    if (saved) {
      try {
        configs = JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    if (!configs) {
      configs = {};
      [1, 2, 3, 4, 5, 6].forEach((g) => {
        configs[g] = { subjects: {}, extracurriculars: {} };
      });
    }

    // 3. Filter strictly based on allowed standard + custom keys
    [1, 2, 3, 4, 5, 6].forEach((g) => {
      if (!configs[g]) {
        configs[g] = { subjects: {}, extracurriculars: {} };
      }
      
      const filteredSub: Record<string, boolean> = {};
      allowedSubjKeys.forEach((key) => {
        // preserve existing grade assignment if it exists, otherwise true (default active) unless it's IPAS for grade < 3
        const defaultVal = key === "ipas" ? g >= 3 : true;
        filteredSub[key] = configs[g]?.subjects?.[key] ?? defaultVal;
      });
      configs[g].subjects = filteredSub;

      const filteredExt: Record<string, boolean> = {};
      allowedExtraKeys.forEach((key) => {
        filteredExt[key] = configs[g]?.extracurriculars?.[key] ?? true;
      });
      configs[g].extracurriculars = filteredExt;
    });

    return configs;
  });

  const getDailyDistributionText = (totalJp: number, mode: "5" | "6"): string => {
    if (mode === "6") {
      const baseValue = Math.floor(totalJp / 6);
      const remainder = totalJp % 6;
      if (remainder === 0) {
        return `Senin s.d Sabtu: ${baseValue} JP/hari`;
      } else {
        return `Senin s.d Kamis: ${baseValue + 1} JP/hari, Jumat & Sabtu: ${baseValue} JP/hari`;
      }
    } else {
      // 5-day week mode
      const baseValue = Math.floor(totalJp / 5);
      const remainder = totalJp % 5;
      if (remainder === 0) {
        return `Senin s.d Jumat: ${baseValue} JP/hari (Pembelajaran Padat/Intensif)`;
      } else if (remainder === 1) {
        return `Senin s.d Kamis: ${baseValue} JP/hari, Jumat: ${baseValue + 1} JP/hari (Pembelajaran Padat/Intensif)`;
      } else if (remainder === 2) {
        return `Senin s.d Rabu: ${baseValue + 1} JP/hari, Kamis & Jumat: ${baseValue} JP/hari (Pembelajaran Padat/Intensif)`;
      } else if (remainder === 3) {
        return `Senin s.d Kamis: ${baseValue + 1} JP/hari, Jumat: ${baseValue} JP/hari (Pembelajaran Padat/Intensif)`;
      } else {
        return `Senin s.d Kamis: ${baseValue + 1} JP/hari, Jumat: ${baseValue} JP/hari (Pembelajaran Padat/Intensif)`;
      }
    }
  };

  const serializeAlokasiWaktu = () => {
    let md = "";
    md += `\n**PONDASI DURASI BELAJAR (HARI EFEKTIF SEKOLAH)**\n`;
    md += `Satuan pendidikan menyepakati dan menetapkan pilihan operasional **${hariKerja === "5" ? "5 HARI KERJA (Senin s.d. Jumat)" : "6 HARI KERJA (Senin s.d. Sabtu)"}** sebagai basis alokasi waktu.\n`;
    if (hariKerja === "5") {
      md += `Kebijakan operasional 5 Hari Kerja (Senin s.d. Jumat) dipilih dengan landasan sosiologis, psikologis, dan akademis yang kuat. Pendekatan ini dirancang untuk menciptakan keseimbangan yang harmonis antara intensitas belajar di sekolah (school-life balance) dan hak sosial anak untuk berinteraksi lebih intim bersama keluarga di akhir pekan (Sabtu-Minggu). Alokasi total Jam Pelajaran (JP) tahunan untuk seluruh mata pelajaran tetap dipenuhi secara akurat 100% mengacu pada standar Kurikulum Merdeka nasional tanpa dikurangi satu menit pun. Strategi ini diwujudkan dengan memadatkan jadwal pembelajaran harian (rata-rata 6 s.d. 7.2 JP per hari) secara dinamis, inovatif, dan berkala. Hal ini memastikan bahwa hak konstitusional belajar peserta didik terpenuhi secara sah di mata hukum, sekaligus merawat kebugaran mental peserta didik agar tidak mengalami kejenuhan akademis.\n`;
    } else {
      md += `Kebijakan operasional 6 Hari Kerja (Senin s.d. Sabtu) disepakati sebagai pilihan paling kontekstual untuk mengoptimalkan ritme belajar harian di satuan pendidikan kami. Pembagian materi ajar ke dalam 6 hari efektif memastikan beban kognitif (cognitive load) peserta didik setiap harinya terdistribusi secara seimbang, berkala, dan tidak menumpuk. Dengan jam belajar harian yang relatif lebih santai, tenang, dan bersahabat, pendidik memiliki waktu transisi yang cukup untuk menyisipkan pendekatan pembelajaran yang terdiferensiasi (differentiated learning) serta bimbingan individual secara lebih intensif. Beban jam pelajaran per hari yang terukur ini sangat mendukung efektivitas penyerapan materi serta penyelarasan kondisi psikologis peserta didik di daerah pedesaan, di mana pembelajaran dapat diwarnai dengan eksplorasi lingkungan alam sekitar tanpa tergesa-gesa oleh tenggat waktu jam belajar harian yang padat.\n`;
    }

    for (let grade = 1; grade <= 6; grade++) {
      const config = classConfigs[grade];
      md += `\n\n<!-- PAGE_BREAK -->\n**STRUKTUR KURIKULUM & ALOKASI WAKTU KELAS ${grade}**\n`;
      md += `| Pelajaran / Kegiatan | Sifat | Alokasi JP / Minggu | Proyeksi JP / Tahun (36 Pekan Efektif) |\n`;
      md += `| --- | --- | --- | --- |\n`;
      
      let totalIntra = 0;
      let hasAddedReligionVal = false;
      let hasAddedSeniVal = false;

      Object.keys(config.subjects).forEach((subKey) => {
        if (config.subjects[subKey]) {
          const jp = getSubjectJp(subKey, grade);
          if (jp > 0) {
            md += `| ${getSubjectLabel(subKey)} | Intrakurikuler | ${jp} JP/minggu | ${jp * 36} JP/tahun |\n`;
            
            // Correct the math to align with Kurikulum Merdeka standards: Agama options are alternative (one selected),
            // and Arts (Seni) is a "pilih salah satu" (choose one) 3 JP block.
            if (subKey.startsWith("agama")) {
              if (!hasAddedReligionVal) {
                totalIntra += jp;
                hasAddedReligionVal = true;
              }
            } else if (subKey.startsWith("seni")) {
              if (!hasAddedSeniVal) {
                totalIntra += jp;
                hasAddedSeniVal = true;
              }
            } else {
              totalIntra += jp;
            }
          }
        }
      });
      
      let totalExtra = 0;
      Object.keys(config.extracurriculars).forEach((exKey) => {
        if (config.extracurriculars[exKey]) {
          md += `| ${getExtraLabel(exKey)} | Ekstrakurikuler | 2 JP/minggu | 72 JP/tahun |\n`;
          totalExtra += 2;
        }
      });
      
      const totalCombinedWeekly = totalIntra + totalExtra;
      md += `| **TOTAL BEBAN BELAJAR EFEKTIF/MURID** | **Intra + Ekskul** | **${totalCombinedWeekly} JP/minggu** | **${totalCombinedWeekly * 36} JP/tahun** |\n`;
      md += `\n**Metode Pembagian Beban Harian (Hari Efektif: ${hariKerja} Hari):**\n`;
      md += `- **Sistem Efektif Kerja**: ${hariKerja === "5" ? "5 Hari Kerja Seminggu (Senin s.d. Jumat)" : "6 Hari Kerja Seminggu (Senin s.d. Sabtu)"}\n`;
      md += `- **Rata-rata JP Harian**: ~${(totalCombinedWeekly / (hariKerja === "5" ? 5 : 6)).toFixed(2)} JP per hari\n`;
      md += `- **Distribusi Distribusi Riil**: ${getDailyDistributionText(totalCombinedWeekly, hariKerja)}\n`;
      md += `\n*Catatan Regulasi: Beban belajar siswa dihitung berdasarkan satu pilihan Agama (3 JP) dan satu pilihan matapelajaran Seni (3 JP) sesuai ketentuan Standar Isi Kurikulum Merdeka.*\n`;
    }
    return md;
  };

  // Logo & Supporting Images States
  const [logoType, setLogoType] = useState<"kemdikbud" | "kemenag">(() => {
    const saved = localStorage.getItem("kosp_logo_type");
    return (saved === "kemdikbud" || saved === "kemenag") ? (saved as "kemdikbud" | "kemenag") : "kemdikbud";
  });
  const [customMinistryLogo, setCustomMinistryLogo] = useState<string | null>(() => {
    return localStorage.getItem("kosp_custom_ministry_logo");
  });
  const [schoolLogo, setSchoolLogo] = useState<string | null>(() => {
    return localStorage.getItem("kosp_school_logo");
  });
  const [isMinistryLogoEnabled, setIsMinistryLogoEnabled] = useState<boolean>(() => {
    return localStorage.getItem("kosp_ministry_logo_enabled") !== "false";
  });
  const [isSchoolLogoEnabled, setIsSchoolLogoEnabled] = useState<boolean>(() => {
    return localStorage.getItem("kosp_school_logo_enabled") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("kosp_ministry_logo_enabled", String(isMinistryLogoEnabled));
  }, [isMinistryLogoEnabled]);

  useEffect(() => {
    localStorage.setItem("kosp_school_logo_enabled", String(isSchoolLogoEnabled));
  }, [isSchoolLogoEnabled]);
  const [supportingImages, setSupportingImages] = useState<UploadedImage[]>(() => {
    const saved = localStorage.getItem("kosp_supporting_images");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    return [];
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ministryLogoInputRef = useRef<HTMLInputElement>(null);
  const supportImagesInputRef = useRef<HTMLInputElement>(null);

  // Result output State
  const [kospMarkup, setKospMarkup] = useState<string>(() => {
    return localStorage.getItem("kosp_markup") || "";
  });
  const [activeViewTab, setActiveViewTab] = useState<"preview" | "raw" | "split">("preview");
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("kosp_last_step", String(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem("kosp_hari_kerja", hariKerja);
  }, [hariKerja]);

  useEffect(() => {
    localStorage.setItem("kosp_nama_sekolah", namaSekolah);
  }, [namaSekolah]);

  useEffect(() => {
    localStorage.setItem("kosp_jenjang", jenjang);
  }, [jenjang]);

  useEffect(() => {
    localStorage.setItem("kosp_lokasi", lokasi);
  }, [lokasi]);

  useEffect(() => {
    localStorage.setItem("kosp_kondisi_socio_demografi", kondisiSocioDemografi);
  }, [kondisiSocioDemografi]);

  useEffect(() => {
    localStorage.setItem("kosp_kondisi_guru_tendik", kondisiGuruTendik);
  }, [kondisiGuruTendik]);

  useEffect(() => {
    localStorage.setItem("kosp_fasilitas_sekolah", fasilitasSekolah);
  }, [fasilitasSekolah]);

  useEffect(() => {
    localStorage.setItem("kosp_nilai_budaya_lokal", nilaiBudayaLokal);
  }, [nilaiBudayaLokal]);

  useEffect(() => {
    localStorage.setItem("kosp_visi_keywords", visiKeywords);
  }, [visiKeywords]);

  useEffect(() => {
    localStorage.setItem("kosp_misi_keywords", misiKeywords);
  }, [misiKeywords]);

  useEffect(() => {
    localStorage.setItem("kosp_kepala_sekolah", kepalaSekolah);
  }, [kepalaSekolah]);

  useEffect(() => {
    localStorage.setItem("kosp_nip_kepala", nipKepala);
  }, [nipKepala]);

  useEffect(() => {
    localStorage.setItem("kosp_tempat_penyusunan", tempatPenyusunan);
  }, [tempatPenyusunan]);

  useEffect(() => {
    localStorage.setItem("kosp_tanggal_penyusunan", tanggalPenyusunan);
  }, [tanggalPenyusunan]);

  useEffect(() => {
    localStorage.setItem("kosp_ketua_tim_penyusun", ketuaTimPenyusun);
    localStorage.setItem("kosp_ketua_tim", ketuaTimPenyusun);
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [ketuaTimPenyusun]);

  useEffect(() => {
    localStorage.setItem("kosp_nip_ketua_tim", nipKetuaTim);
    localStorage.setItem("kosp_nip_ketua", nipKetuaTim);
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [nipKetuaTim]);

  useEffect(() => {
    localStorage.setItem("kosp_anggota_1", anggota1);
    localStorage.setItem("kosp_anggota_2", anggota2);
    localStorage.setItem("kosp_anggota_3", anggota3);
    localStorage.setItem("kosp_anggota_tim", `${anggota1}; ${anggota2}; ${anggota3}`);
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [anggota1, anggota2, anggota3]);

  useEffect(() => {
    localStorage.setItem("kosp_khas_satuan", khasSatuan);
  }, [khasSatuan]);

  useEffect(() => {
    localStorage.setItem("kosp_kemitraan_satuan", kemitraanSatuan);
  }, [kemitraanSatuan]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_rombel", jumlahRombel);
  }, [jumlahRombel]);

  useEffect(() => {
    localStorage.setItem("kosp_p5_themes", p5Themes);
  }, [p5Themes]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_guru_total", String(jumlahGuruTotal));
  }, [jumlahGuruTotal]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_s1", String(jumlahS1));
  }, [jumlahS1]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_s2", String(jumlahS2));
  }, [jumlahS2]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_s3", String(jumlahS3));
  }, [jumlahS3]);

  useEffect(() => {
    localStorage.setItem("kosp_jumlah_sertifikasi", String(jumlahSertifikasi));
  }, [jumlahSertifikasi]);

  useEffect(() => {
    localStorage.setItem("kosp_class_configs", JSON.stringify(classConfigs));
  }, [classConfigs]);

  useEffect(() => {
    localStorage.setItem("kosp_custom_subjects", JSON.stringify(customSubjects));
  }, [customSubjects]);

  useEffect(() => {
    localStorage.setItem("kosp_custom_extracurriculars", JSON.stringify(customExtracurriculars));
  }, [customExtracurriculars]);

  useEffect(() => {
    localStorage.setItem("kosp_logo_type", logoType);
  }, [logoType]);

  useEffect(() => {
    if (customMinistryLogo) {
      localStorage.setItem("kosp_custom_ministry_logo", customMinistryLogo);
    } else {
      localStorage.removeItem("kosp_custom_ministry_logo");
    }
  }, [customMinistryLogo]);

  useEffect(() => {
    if (schoolLogo) {
      localStorage.setItem("kosp_school_logo", schoolLogo);
    } else {
      localStorage.removeItem("kosp_school_logo");
    }
  }, [schoolLogo]);

  useEffect(() => {
    localStorage.setItem("kosp_supporting_images", JSON.stringify(supportingImages));
  }, [supportingImages]);

  useEffect(() => {
    localStorage.setItem("kosp_markup", kospMarkup);
  }, [kospMarkup]);

  // Premium Activation state synchronization & data locking
  const [isActivated, setIsActivated] = useState(() => localStorage.getItem("omega_is_activated") === "true");

  const isKospUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("kosp");
    } catch {
      return true;
    }
  })();

  useEffect(() => {
    const handleSync = () => {
      const active = localStorage.getItem("omega_is_activated") === "true";
      setIsActivated(active);
      if (active) {
        const premiumSchool = localStorage.getItem("omega_school_name");
        const premiumKepsek = localStorage.getItem("omega_kepala_sekolah");
        const premiumKepsekNip = localStorage.getItem("omega_nip_kepala");
        const premiumGuru = localStorage.getItem("omega_nama_guru");
        const premiumGuruNip = localStorage.getItem("omega_nip_guru");

        if (premiumSchool) setNamaSekolah(premiumSchool);
        if (premiumKepsek) setKepalaSekolah(premiumKepsek);
        if (premiumKepsekNip) setNipKepala(premiumKepsekNip);
        if (premiumGuru) setKetuaTimPenyusun(premiumGuru);
        if (premiumGuruNip) setNipKetuaTim(premiumGuruNip);
      } else {
        setNamaSekolah("SD Negeri Fatubai");
        setKepalaSekolah("Darius Kusi, S.Pd., Gr.");
        setNipKepala("196709192008011008");
        setKetuaTimPenyusun("Roni Hariyanto Bhidju, S.Pd., Gr.");
        setNipKetuaTim("198603012020121005");
      }
    };

    handleSync();
    window.addEventListener("omega-state-updated", handleSync);
    return () => {
      window.removeEventListener("omega-state-updated", handleSync);
    };
  }, []);

  useEffect(() => {
    const handleProfileSync = () => {
      const schName = localStorage.getItem("kosp_nama_sekolah");
      if (schName) setNamaSekolah(schName);
      
      const kepSek = localStorage.getItem("kosp_kepala_sekolah");
      if (kepSek) setKepalaSekolah(kepSek);
      
      const nipKep = localStorage.getItem("kosp_nip_kepala");
      if (nipKep) setNipKepala(nipKep);
      
      const kTim = localStorage.getItem("kosp_ketua_tim") || localStorage.getItem("kosp_nama_guru");
      if (kTim) setKetuaTimPenyusun(kTim);
      
      const nipKTim = localStorage.getItem("kosp_nip_ketua") || localStorage.getItem("kosp_nip_guru");
      if (nipKTim) setNipKetuaTim(nipKTim);
      
      const tgl = localStorage.getItem("kosp_tanggal");
      if (tgl) setTanggalPenyusunan(tgl);
      
      const tmp = localStorage.getItem("kosp_tempat");
      if (tmp) setTempatPenyusunan(tmp);
      
      const mLType = localStorage.getItem("kosp_logo_type") as "kemdikbud" | "kemenag";
      if (mLType) setLogoType(mLType);
      
      const customML = localStorage.getItem("kosp_custom_ministry_logo");
      setCustomMinistryLogo(customML);
      
      const sLogo = localStorage.getItem("kosp_school_logo") || localStorage.getItem("kosp_logo_sekolah");
      setSchoolLogo(sLogo);
      
      const a1 = localStorage.getItem("kosp_anggota_1");
      if (a1) setAnggota1(a1);
      const a2 = localStorage.getItem("kosp_anggota_2");
      if (a2) setAnggota2(a2);
      const a3 = localStorage.getItem("kosp_anggota_3");
      if (a3) setAnggota3(a3);
    };

    window.addEventListener("omega-school-profile-updated", handleProfileSync);
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleProfileSync);
    };
  }, []);

  const saveToDocumentBank = () => {
    if (!kospMarkup) return;
    const checkFn = (window as any).checkActivation;
    const executeAction = () => {
      setSavingToBank(true);
      try {
        const storedDocs = localStorage.getItem("omega_db_documents");
        const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
        
        const newDoc = {
          id: "doc-kosp-" + Date.now(),
          name: `Draf KOSP - ${namaSekolah} (${tanggalPenyusunan || '2026'})`,
          category: "kosp",
          folderId: "f-kosp", // Save in KOSP Merdeka folder
          content: kospMarkup,
          size: kospMarkup.length,
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

    if (checkFn) {
      checkFn(executeAction);
    } else {
      executeAction();
    }
  };

  // Handler for custom Ministry Logo Upload
  const handleMinistryLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressImage(file, 256, 256);
        setCustomMinistryLogo(compressedBase64);
      } catch (error) {
        console.error(error);
        alert("⚠️ Gagal memproses gambar logo kementerian.");
      } finally {
        e.target.value = "";
      }
    }
  };

  // Handler for custom School Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressImage(file, 256, 256);
        setSchoolLogo(compressedBase64);
      } catch (error) {
        console.error(error);
        alert("⚠️ Gagal memproses gambar logo sekolah.");
      } finally {
        e.target.value = "";
      }
    }
  };

  // Handler for Supporting Images Upload
  const handleSupportImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // Compress supporting images to 800x800 max to keep premium detail but safe from local storage quota crash
          const compressedBase64 = await compressImage(file, 800, 800);
          setSupportingImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              base64: compressedBase64,
              type: file.type,
            },
          ]);
        } catch (error) {
          console.error(error);
          alert(`⚠️ Gagal memproses gambar lampiran: ${file.name}`);
        }
      }
      e.target.value = "";
    }
  };

  const removeSupportingImage = (id: string) => {
    setSupportingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearSchoolLogo = () => {
    setSchoolLogo(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const clearMinistryLogo = () => {
    setCustomMinistryLogo(null);
    if (ministryLogoInputRef.current) ministryLogoInputRef.current.value = "";
  };

  // Preset configuration setups for Fast Filling
  const fillPreset = (type: "desa" | "kota" | "pesisir") => {
    if (type === "desa") {
      setNamaSekolah("SD Negeri Fatubai");
      setJenjang("SD");
      setLokasi("Desa Oehalo, Kecamatan Insana Tengah, Kabupaten Timor Tengah Utara, Provinsi Nusa Tenggara Timur, Kode Pos 856713");
      setKondisiSocioDemografi("Mayoritas wali murid bekerja sebagai petani lahan kering, peternak sapi, dan perajin kain tenun ikat khas NTT dengan tingkat perekonomian menengah ke bawah. Budaya gotong royong dan adat Timor sangat kental.");
      setKondisiGuruTendik("Didukung kepala sekolah berkompeten beserta guru kelas dan guru mapel yang aktif mengembangkan kurikulum merdeka guna mendukung peningkatan literasi-numerasi terpadu.");
      setFasilitasSekolah("Terdapat 6 ruang kelas aktif, perpustakaan penunjang literasi anak, lapangan upacara/olahraga serbaguna, sarana air bersih, serta kebun budidaya lokal untuk laboratorium kontekstual.");
      setNilaiBudayaLokal("Penghormatan nilai adat Timor (Nekaf Mese Ansa Mese / Satu Hati Satu Tekad), pelestarian kain tenun ikat orisinal TTU, seni tari kreasi penyambutan tamu, serta kearifan lokal kelestarian alam.");
      setVisiKeywords("Berakhlak Mulia, Cerdas, Berkarakter Kebangsaan, Peduli Kelestarian Lingkungan");
      setMisiKeywords("Menyelenggarakan pembelajaran berkualitas ramah anak, melestarikan aset warisan adat tenun ikat daerah, membiasakan perilaku religius sejak dini, melatih kepanduan Pramuka aktif.");
      setKepalaSekolah("Darius Kusi, S.Pd., Gr.");
      setNipKepala("196709192008011008");
      setTempatPenyusunan("Oehalo");
      setTanggalPenyusunan("13 Juli 2026");
      setKetuaTimPenyusun("Roni Hariyanto Bhidju, S.Pd., Gr.");
      setNipKetuaTim("198603012020121005");
      setAnggota1("Fransiskus Seda, S.Pd., Gr.");
      setAnggota2("Maria Krisanti Seo, S.Pd.");
      setAnggota3("Victoria Abi, S.Pd., Gr.");
      setKhasSatuan("Satuan pendidikan khas pedesaan Timor Tengah Utara yang memprioritaskan integrasi kearifan lokal tenun ikat TTU dan pembentukan karakter Pancasila luhur.");
      setKemitraanSatuan("Puskesmas Kecamatan Insana Tengah (layanan skrining anak), Kelompok Pengrajin Tenun Ikat Oehalo (mitra kearifan lokal), Komite Sekolah SD Negeri Fatubai.");
      setJumlahRombel("6 Rombongan Belajar (Rombel) dengan total proyeksi siswa aktif guna pelayanan sistematis.");
      setP5Themes("Kearifan Lokal dan Kewirausahaan");
      setJumlahGuruTotal(12);
      setJumlahS1(10);
      setJumlahS2(2);
      setJumlahS3(0);
      setJumlahSertifikasi(6);
    } else if (type === "kota") {
      setNamaSekolah("SMP Merdeka Utama Surabaya");
      setJenjang("SMP");
      setLokasi("Kawasan perkotaan padat industri dan pemukiman modern di pusat kota Surabaya.");
      setKondisiSocioDemografi("Wali murid mayoritas berprofesi sebagai karyawan swasta, wiraswasta, dan buruh industri. Akses perangkat digital murid sangat tinggi.");
      setKondisiGuruTendik("24 guru sarjana, 5 Guru Penggerak, memiliki koordinator IT handal, aktif merancang bahan ajar mandiri digital di Canva.");
      setFasilitasSekolah("Laboratorium IPA dan komputer ber-AC, proyektor LCD di setiap kelas, lapangan futsal/basket berpagar, sanggar seni tari.");
      setNilaiBudayaLokal("Budaya arek yang asertif, komunikatif, dan toleran tinggi. Pelestarian sastra drama tradisional ludruk.");
      setVisiKeywords("Cerdas Teknologi, Kompetitif Global, Berintegritas, Kebhinekaan Global");
      setMisiKeywords("Melatih keahlian digital coding dasar, mengoptimalkan olimpiade sains/Seni, menumbuhkan jiwa bersaing jujur melalui asesmen transparan, melestarikan ludruk modern.");
      setKepalaSekolah("Hj. Retno Wardhani, S.Pd., M.M.");
      setNipKepala("198211042008122001");
      setTempatPenyusunan("Surabaya");
      setTanggalPenyusunan("14 Juli 2026");
      setKetuaTimPenyusun("Ir. Bambang Triyono, M.T.");
      setNipKetuaTim("197906232006041005");
      setAnggota1("Widya Ningrum, S.Kom.");
      setAnggota2("Rian Hidayat, S.Pd.");
      setAnggota3("Siti Rahma, S.Pd.");
      setKhasSatuan("Sekolah rujukan teknologi informatika terapan, penguatan kebhinekaan perkotaan, dan kepemimpinan kewirausahaan digital.");
      setKemitraanSatuan("Dinas Lingkungan Hidup Kota Surabaya, Institut Teknologi Sepuluh Nopember (ITS) untuk pengenalan robotika, Asosiasi Pengusaha Muda Kota Surabaya.");
      setJumlahRombel("12 Rombongan Belajar (Rombel) dengan rata-rata 32 siswa per kelas (Total 384 siswa aktif).");
      setP5Themes("Kewirausahaan dan Rekayasa Teknologi (Perancangan aplikasi mini e-commerce rintisan sekolah)");
      setJumlahGuruTotal(24);
      setJumlahS1(18);
      setJumlahS2(5);
      setJumlahS3(1);
      setJumlahSertifikasi(15);
    } else if (type === "pesisir") {
      setNamaSekolah("SMK Bahari Maritim Wakatobi");
      setJenjang("SMK");
      setLokasi("Kawasan pesisir laut kepulauan Wakatobi, Sulawesi Tenggara. Relevan dengan pariwisata laut.");
      setKondisiSocioDemografi("Masyarakat sekitar mayoritas nelayan tradisional, budidaya rumput laut, dan pengrajin tenun laut. Kehidupan agamis yang kokoh.");
      setKondisiGuruTendik("15 guru produktif rumpun kelautan, 3 instruktur praktisi dari asosiasi perikanan setempat, adatif melatih di pantai.");
      setFasilitasSekolah("Bengkel motor perahu, laboratorium oseanografi sederhana di tepi pantai, 1 perahu latih ekosistem mangrove.");
      setNilaiBudayaLokal("Adat kelautan Bajo, nilai harmoni terhadap alam laut, pelestarian tarian lariangi, tenunan motif biota laut.");
      setVisiKeywords("Terdepan Bidang Kelautan, Berwawasan Bahari Hijau, Mandiri Wirausaha");
      setMisiKeywords("Membangun keahlian navigasi kemaritiman yang aman, merancang bisnis budidaya lobster ramah lingkungan, menyelenggarakan pameran rajutan bernuansa wisata pesisir.");
      setKepalaSekolah("La Ode Kamaruddin, S.St.Pi., M.Si.");
      setNipKepala("197503152002101004");
      setTempatPenyusunan("Wakatobi");
      setTanggalPenyusunan("15 Juli 2026");
      setKetuaTimPenyusun("La Ode Hasni, S.Pd.");
      setNipKetuaTim("198812022015031001");
      setAnggota1("Wa Ode Hasnia, S.Pi.");
      setAnggota2("Aris Munandar, S.Pd.");
      setAnggota3("Fajar Siddiq, S.Kel.");
      setKhasSatuan("Satuan pendidikan vokasi kelautan tropis berwawasan maritim adiluhung, konservasi terumbu karang, dan pemanfaatan wisata pesisir.");
      setKemitraanSatuan("Taman Nasional Wakatobi (konservasi), Himpunan Nelayan Seluruh Indonesia (HNSI) Wakatobi, PT Wakatobi Dive Center.");
      setJumlahRombel("9 Rombongan Belajar (Rombel) dengan rata-rata 25 siswa per kelas (Total 225 siswa aktif).");
      setP5Themes("Gaya Hidup Berkelanjutan dan Kebekerjaan (Restorasi transplantasi terumbu karang dan pemandu ekowisata)");
      setJumlahGuruTotal(15);
      setJumlahS1(12);
      setJumlahS2(3);
      setJumlahS3(0);
      setJumlahSertifikasi(8);
    }
  };

  // server-side generation bridge
  const generateKosp = async () => {
    if (!isKospUnlocked) {
      setErrorMessage("Paket Belum Aktif: Silakan beli paket APLIKASI KOSP untuk menggunakan fitur penulisan draft KOSP.");
      setStatus("error");
      return;
    }
    setStatus("generating");
    setErrorMessage("");
    setKospMarkup("");

    const milestones = [
      "Menganalisis karakteristik demografi & sosiokultural...",
      "Merumuskan strategi SWOT penentu arah institusi...",
      "Menyusun visualisasi harmoni Visi & Misi...",
      "Menyusun skema mata pelajaran Kurikulum Merdeka...",
      "Merancang 2 Projek Kokurikuler selaras 8 Dimensi Profil Lulusan...",
      "Menyusun draf final KOSP secara sistematis & mendetail..."
    ];

    let currentMilestone = 0;
    setProgressMsg(milestones[0]);

    const timer = setInterval(() => {
      if (currentMilestone < milestones.length - 1) {
        currentMilestone++;
        setProgressMsg(milestones[currentMilestone]);
      }
    }, 2800);

    try {
      const localKey = (localStorage.getItem("custom_gemini_api_key") || "").trim();
      const response = await fetch("/api/generate-kosp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(localKey ? { "x-gemini-key": localKey } : {})
        },
        body: JSON.stringify({
          namaSekolah,
          jenjang,
          lokasi,
          kondisiSocioDemografi,
          kondisiGuruTendik,
          fasilitasSekolah,
          nilaiBudayaLokal,
          visiKeywords,
          misiKeywords,
          kepalaSekolah,
          nipKepala,
          khasSatuan,
          kemitraanSatuan,
          jumlahRombel,
          p5Themes,
          tempatPenyusunan,
          tanggalPenyusunan,
          ketuaTimPenyusun,
          nipKetuaTim,
          anggota1,
          anggota2,
          anggota3,
          alokasiWaktuKelas: serializeAlokasiWaktu(),
          jumlahGuruTotal,
          jumlahS1,
          jumlahS2,
          jumlahS3,
          jumlahSertifikasi,
          hariKerja,
        }),
      });

      clearInterval(timer);

      const contentType = response.headers.get("content-type");
      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (e) {
          console.error("Gagal mengurai respon JSON:", e);
        }
      }

      if (!response.ok) {
        const timeoutDetail = response.status === 504 
          ? "504 Gateway Timeout (Batas waktu tunggu koneksi server habis karena dokumen KOSP sangat besar & tebal)" 
          : `${response.status}`;
        const errMsg = data?.error || `Trafik padat atau batas waktu tunggu server terlampaui (Kode Status: ${timeoutDetail}). Silakan coba sesaat lagi, atau pasang API Key Anda secara mandiri di beranda untuk prioritas prioritas transaksi bebas hambatan.`;
        const errMsgLower = errMsg.toLowerCase();
        if (response.status === 429 || errMsgLower.includes("quota") || errMsgLower.includes("exhausted") || errMsgLower.includes("rate limit") || errMsgLower.includes("limit") || errMsgLower.includes("429")) {
          window.dispatchEvent(new CustomEvent("gemini-quota-exhausted"));
        } else if (response.status === 403 || response.status === 400 || errMsg.includes("403") || errMsg.includes("400") || errMsg.includes("PERMISSION_DENIED") || errMsg.includes("TERBATAS") || errMsg.includes("DITOLAK") || errMsg.includes("KUNCI API") || errMsg.includes("api_key_invalid") || errMsg.includes("API key not valid")) {
          window.dispatchEvent(new CustomEvent("gemini-api-error-403"));
        }
        throw new Error(errMsg);
      }

      if (!data) {
        throw new Error("Respon server tidak valid atau tidak berformat JSON. Hal ini terjadi ketika gerbang server (gateway) memutus koneksi sebelum model selesai menulis seluruh materi KOSP. Silakan coba pasang API Key mandiri Anda di beranda untuk memperoleh kecepatan/otoritas tinggi tanpa batas waktu tunggu.");
      }
      if (data.success && data.text) {
        setKospMarkup(data.text);
        setStatus("success");
        setStep(4); // Advance to output step
      } else {
        throw new Error("Respon server kosong atau tidak lengkap.");
      }
    } catch (err: any) {
      clearInterval(timer);
      console.error(err);
      setErrorMessage(err.message || "Trafik server padat atau koneksi internet bermasalah. Sila coba beberapa saat lagi.");
      setStatus("error");
    }
  };

  const checkActivationAndRun = (action: () => void) => {
    const checkFn = (window as any).checkActivation;
    if (checkFn) {
      checkFn(action);
    } else {
      action();
    }
  };

  const copyToClipboard = () => {
    if (!kospMarkup) return;
    const checkFn = (window as any).checkActivation;
    const executeAction = () => {
      navigator.clipboard.writeText(kospMarkup);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    };

    if (checkFn) {
      checkFn(executeAction);
    } else {
      executeAction();
    }
  };

  const handleDownloadWord = () => {
    if (!kospMarkup) return;

    // Convert markdown to super-clean Word compatible HTML
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

      lines.forEach(line => {
        let trimmed = line.trim();

        // Check for page breaks
        if (trimmed === "<!-- PAGE_BREAK -->") {
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

        // Check headings structured as **BAB** etc.
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          const headingText = trimmed.replace(/\*\*/g, "");
          const isSecondPartBab4 = headingText.trim() === "DAN PENGEMBANGAN PROFESIONAL" || headingText.includes("DAN PENGEMBANGAN PROFESIONAL");
          const isBab = headingText.startsWith("BAB") || headingText.includes("LEMBAR PENETAPAN") || headingText.includes("DOKUMEN KURIKULUM") || isSecondPartBab4;
          if (isBab) {
            html += `<h2 style="font-family:Arial,sans-serif;font-size:14pt;font-weight:bold;color:#0f172a;text-align:center;margin:18pt 0 12pt 0;text-transform:uppercase;">${headingText}</h2>`;
          } else {
            html += `<h3 style="font-family:Arial,sans-serif;font-size:12pt;font-weight:bold;color:#1e293b;margin:14pt 0 8pt 0;">${headingText}</h3>`;
          }
          return;
        }

        // Also support standard markdown headers if any exist
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

        // Paragraph with inline bolding parsing
        let inlineFormatted = trimmed
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/<br\s*\/?>/gi, "<br/>");
        html += `<p style="margin:0 0 12pt 0;line-height:1.5;text-align:justify;font-family:Arial,sans-serif;font-size:11pt;">${inlineFormatted}</p>`;
      });

      flushList();
      flushTable();

      return html;
    };

    const htmlBodyContent = convMarkdownToHtmlForWord(kospMarkup);

    const coverPageHtml = `
      <div style="text-align:center; padding-top:80px; margin-bottom:120px; page-break-after:always;">
        
        <div style="margin-top:80px; margin-bottom:40px;">
          <!-- Large centered bold title -->
          <h1 style="font-family:Arial,sans-serif;font-size:18pt;font-weight:bold;color:#0f172a;line-height:1.4;">
            DOKUMEN KURIKULUM OPERASIONAL<br/>SATUAN PENDIDIKAN (KOSP)
          </h1>
          <h2 style="font-family:Arial,sans-serif;font-size:13pt;font-weight:bold;color:#d97706;margin-top:10px;text-transform:uppercase;">
            KURIKULUM MERDEKA
          </h2>
        </div>
        
        <div style="margin-top:100px; margin-bottom:60px;">
          <div style="font-family:Arial,sans-serif;font-size:16pt;font-weight:bold;color:#1e293b;text-transform:uppercase;">
            ${namaSekolah.toUpperCase()}
          </div>
          <div style="font-family:Arial,sans-serif;font-size:11pt;color:#475569;margin-top:4px;">
            Tahun Ajaran 2026/2027
          </div>
          <div style="font-family:Arial,sans-serif;font-size:11pt;color:#475569;margin-top:4px;">
            Jenjang: ${jenjang}
          </div>
        </div>
        
        <div style="margin-top:120px; font-family:Arial,sans-serif;font-size:9.5pt;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:10px;width:70%;margin-left:auto;margin-right:auto;">
          Dihasilkan secara cerdas bersama Cyber Crypt KOSP Engine v3.2
        </div>
      </div>
      <br clear="all" style="page-break-before:always" />
    `;

    // MS Word document template package wrapping around our html body content
    const documentTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
      <title>Dokumen Kurikulum Operasional Satuan Pendidikan (KOSP)</title>
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
        size: 21cm 29.7cm; /* A4 size */
        margin: 2.54cm 2.54cm 2.54cm 2.54cm; /* Standard 1 inch margins */
      }
      div.Section1 {
        page: Section1;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000000;
      }
      p {
        margin: 0 0 12pt 0;
        text-align: justify;
      }
      h2 {
        text-align: center;
        font-size: 14pt;
        font-weight: bold;
        margin-top: 18pt;
        margin-bottom: 12pt;
      }
      h3 {
        font-size: 12pt;
        font-weight: bold;
        margin-top: 14pt;
        margin-bottom: 8pt;
      }
      li {
        margin-bottom: 6pt;
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

    const element = document.createElement("a");
    const file = new Blob([documentTemplate], { type: "application/msword;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `KOSP_Final_${namaSekolah.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const drawKemdikbudVector = (doc: any, centerX: number, centerY: number, radius = 13) => {
    // Elegant educational Tut Wuri Handayani emblem centered at (centerX, centerY)
    doc.setFillColor(30, 58, 138); // navy blue
    doc.setDrawColor(245, 158, 11); // gold
    doc.setLineWidth(0.5);
    doc.ellipse(centerX, centerY, radius, radius, "F");
    doc.ellipse(centerX, centerY, radius + 0.8, radius + 0.8, "D");
    
    // Star/Torch in gold
    doc.setFillColor(245, 158, 11); // gold
    const scale = radius / 15;
    doc.triangle(centerX - 3 * scale, centerY + 6 * scale, centerX + 3 * scale, centerY + 6 * scale, centerX, centerY - 2 * scale, "F");
    doc.ellipse(centerX, centerY - 5 * scale, 2.5 * scale, 4 * scale, "F");
    doc.ellipse(centerX - 3.5 * scale, centerY - 3 * scale, 2 * scale, 3.5 * scale, "F");
    doc.ellipse(centerX + 3.5 * scale, centerY - 3 * scale, 2 * scale, 3.5 * scale, "F");
    
    // Book line
    doc.setDrawColor(254, 243, 199);
    doc.setLineWidth(0.35);
    doc.line(centerX - 5 * scale, centerY + 7.5 * scale, centerX + 5 * scale, centerY + 7.5 * scale);
    
    // Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5 * scale);
    doc.setTextColor(254, 243, 199);
    doc.text("TUT WURI", centerX, centerY + 2.5 * scale, { align: "center" });
    doc.setFontSize(4.5 * scale);
    doc.text("HANDAYANI", centerX, centerY + 5 * scale, { align: "center" });
  };

  const drawKemenagVector = (doc: any, centerX: number, centerY: number, radius = 13) => {
    // Beautiful green & gold Kemenag emblem
    doc.setFillColor(6, 95, 70); // deep emerald green
    doc.setDrawColor(245, 158, 11); // gold
    doc.setLineWidth(0.5);
    doc.ellipse(centerX, centerY, radius, radius, "F");
    doc.ellipse(centerX, centerY, radius + 0.8, radius + 0.8, "D");
    
    const scale = radius / 15;
    // Golden Scales and Book design
    doc.setFillColor(245, 158, 11); // gold
    doc.rect(centerX - 0.6, centerY - 7 * scale, 1.2, 12 * scale, "F");
    doc.rect(centerX - 5 * scale, centerY - 2.5 * scale, 10 * scale, 0.8 * scale, "F");
    doc.triangle(centerX - 5 * scale, centerY - 1.5 * scale, centerX - 6.5 * scale, centerY + 1.5 * scale, centerX - 3.5 * scale, centerY + 1.5 * scale, "F");
    doc.triangle(centerX + 5 * scale, centerY - 1.5 * scale, centerX + 3.5 * scale, centerY + 1.5 * scale, centerX + 6.5 * scale, centerY + 1.5 * scale, "F");
    
    // Book symbol
    doc.setFillColor(254, 254, 254);
    doc.triangle(centerX, centerY + 5.5 * scale, centerX - 3 * scale, centerY + 3 * scale, centerX, centerY + 3 * scale, "F");
    doc.triangle(centerX, centerY + 5.5 * scale, centerX + 3 * scale, centerY + 3 * scale, centerX, centerY + 3 * scale, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5 * scale);
    doc.setTextColor(254, 243, 199);
    doc.text("KEMENAG", centerX, centerY + 9.5 * scale, { align: "center" });
  };

  // PDF Generation with Custom styled Cover and Supporting Images Integration
  const handlePdfGeneration = () => {
    if (!kospMarkup) return;
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let coverY = 25;

      // ============================================
      // PAGE 1: ELEGANT COVER PAGE
      // ============================================
      
      // Decorative corner borders (thin double line in amber/gold colors)
      doc.setDrawColor(245, 158, 11); // amber-500
      doc.setLineWidth(0.65);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
      
      doc.setDrawColor(39, 39, 42); // zinc-800
      doc.setLineWidth(0.2);
      doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

      const minLogoSrc = customMinistryLogo || (logoType === "kemdikbud" ? getTutWuriHandayaniLogo() : getKemenagLogo());
      const schLogoSrc = schoolLogo || getDefaultSchoolLogo(namaSekolah);

      if (minLogoSrc || schLogoSrc) {
        // We always draw both logos to guarantee completeness as requested by the user
      // 1. Logo Kementerian at the top
      const minLogoSize = 25; // 25mm
      try {
        doc.addImage(minLogoSrc, "PNG", pageWidth / 2 - minLogoSize / 2, coverY, minLogoSize, minLogoSize);
      } catch (err) {
        console.error("Error drawing ministry logo:", err);
      }
      coverY += minLogoSize + 16;
       
      // 3. Title Block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("DOKUMEN KURIKULUM OPERASIONAL", pageWidth / 2, coverY, { align: "center" });
      coverY += 7.5;
      doc.text("SATUAN PENDIDIKAN (KOSP)", pageWidth / 2, coverY, { align: "center" });
      coverY += 10.5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(217, 119, 6); // amber-600
      doc.text("KURIKULUM MERDEKA", pageWidth / 2, coverY, { align: "center" });

      // 4. Logo Sekolah (above school name - size designed to be larger than ministry logo)
      coverY += 12;
      const schLogoSize = 34; // Larger than ministry logo as requested (34mm vs 25mm)
      try {
        doc.addImage(schLogoSrc, "PNG", pageWidth / 2 - schLogoSize / 2, coverY, schLogoSize, schLogoSize);
      } catch (err) {
        console.error("Error drawing schoolLogo:", err);
      }
      coverY += schLogoSize + 12; 

      // 5. School Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      const splitSchoolName = doc.splitTextToSize(namaSekolah.toUpperCase(), contentWidth);
      splitSchoolName.forEach((lineText: string) => {
        doc.text(lineText, pageWidth / 2, coverY, { align: "center" });
        coverY += 8;
      });
      coverY += 4;

      // 6. Year/Metadata
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(`Tahun Ajaran 2026/2027`, pageWidth / 2, coverY, { align: "center" });
      coverY += 5.5;
      doc.text(`Jenjang Pendidikan: ${jenjang}`, pageWidth / 2, coverY, { align: "center" });

      } else {
        // ============================================
        // LAYOUT 3: NO LOGOS UPLOADED
        // ============================================
        
        // Pure elegant typography cover
        coverY = 65;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("DOKUMEN KURIKULUM OPERASIONAL", pageWidth / 2, coverY, { align: "center" });
        coverY += 8;
        doc.text("SATUAN PENDIDIKAN (KOSP)", pageWidth / 2, coverY, { align: "center" });
        coverY += 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(217, 119, 6); // amber-600
        doc.text("KURIKULUM MERDEKA", pageWidth / 2, coverY, { align: "center" });

        coverY += 45;

        // School Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        const splitSchoolName = doc.splitTextToSize(namaSekolah.toUpperCase(), contentWidth);
        splitSchoolName.forEach((lineText: string) => {
          doc.text(lineText, pageWidth / 2, coverY, { align: "center" });
          coverY += 8;
        });
        coverY += 4;

        // Year/Metadata
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(`Tahun Ajaran 2026/2027`, pageWidth / 2, coverY, { align: "center" });
        coverY += 5.5;
        doc.text(`Jenjang Pendidikan: ${jenjang}`, pageWidth / 2, coverY, { align: "center" });
      }
      
      // Decore separator line
      coverY += 12;
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.8);
      doc.line(pageWidth / 2 - 30, coverY, pageWidth / 2 + 30, coverY);
      
      // Foot of cover page
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Dihasilkan secara cerdas bersama Cyber Crypt KOSP Engine v3.2", pageWidth / 2, pageHeight - 20, { align: "center" });

      // ============================================
      // PAGE 2 AND SUBSEQUENT PAGES: KOSP CONTENT BODY
      // ============================================
      
      doc.addPage();
      let currentY = 25;
      const leadingSpacing = 5.25; // Represents 1.5 spasi (9.5pt font x 1.5 spasi ~ 5mm - 5.25mm)
      let hasContentOnCurrentPage = false;

      // Clean up consecutive or double/multiple PAGE_BREAK markers to avoid blank/empty pages completely
      let kospMarkupClean = kospMarkup;
      let lastMarkup = "";
      while (kospMarkupClean !== lastMarkup) {
        lastMarkup = kospMarkupClean;
        kospMarkupClean = kospMarkupClean.replace(/<!--\s*PAGE_BREAK\s*-->\s*(?:\n\s*)*<!--\s*PAGE_BREAK\s*-->/g, "<!-- PAGE_BREAK -->");
      }

      let rawLines = kospMarkupClean.split("\n");
      
      // Failsafe: if the markup has content before BAB I, filter it out to ensure cover page flows immediately to BAB I on page 2.
      const firstBabIndex = rawLines.findIndex(l => {
        const item = l.trim().replace(/\*\*/g, "").toUpperCase();
        return item.startsWith("BAB I") || item.includes("BAB I:");
      });
      if (firstBabIndex > 0) {
        rawLines = rawLines.slice(firstBabIndex);
      }
      
      const addNewPageIfNeeded = (heightNeeded: number) => {
        if (currentY + heightNeeded > pageHeight - margin - 15) {
          doc.addPage();
          currentY = margin;
          hasContentOnCurrentPage = false;
          return true;
        }
        return false;
      };

      let isInsideLembarPenetapan = false;
      let isInsideLampiran = false;
      let lampiranLinesBuffer: string[] = [];
      let tableRowsBuffer: string[][] = [];
      let isInsideTable = false;

      const flushTableBuffer = () => {
        if (tableRowsBuffer.length === 0) return;

        const numCols = tableRowsBuffer[0].length;
        const colWidth = contentWidth / numCols;
        
        tableRowsBuffer.forEach((rowCells, rowIndex) => {
          const wrappedCells = rowCells.map(cell => {
            const cleanCell = cell.replace(/<br\s*\/?>/gi, "\n").replace(/\*\*/g, "").replace(/\*/g, "");
            return doc.splitTextToSize(cleanCell, colWidth - 3);
          });
          
          const maxLines = Math.max(...wrappedCells.map(lines => lines.length), 1);
          const rowHeight = (maxLines * 4.5) + 4;

          addNewPageIfNeeded(rowHeight);

          rowCells.forEach((_, colIndex) => {
            const xPos = margin + (colIndex * colWidth);
            
            doc.setDrawColor(80, 80, 80); // Standard crisp dark borders instead of faded gray
            doc.setLineWidth(0.22);
            
            if (rowIndex === 0) {
              doc.setFillColor(235, 235, 235); // Solid professional header background
              doc.rect(xPos, currentY, colWidth, rowHeight, "F");
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0); // Pure black standard header text
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0); // Pure black standard table body text
            }
            
            doc.rect(xPos, currentY, colWidth, rowHeight, "D");

            const lines = wrappedCells[colIndex];
            lines.forEach((lineText, lineIdx) => {
              const yOffset = currentY + 3.8 + (lineIdx * 4.5);
              doc.text(lineText, xPos + 1.5, yOffset);
            });
          });

          currentY += rowHeight;
          hasContentOnCurrentPage = true;
        });

        tableRowsBuffer = [];
        isInsideTable = false;
      };

      rawLines.forEach((rawLine) => {
        const line = rawLine.trim();

        // Check for Lampiran section FIRST, even if we were marked inside Lembar Penetapan!
        if (line.startsWith("### LAMPIRAN") || line.startsWith("**LAMPIRAN") || line.toUpperCase().startsWith("LAMPIRAN")) {
          isInsideLembarPenetapan = false;
          isInsideLampiran = true;
        }

        if (line.startsWith("### LEMBAR PENETAPAN") || line.startsWith("**LEMBAR PENETAPAN") || line.startsWith("LEMBAR PENETAPAN")) {
          isInsideLembarPenetapan = true;
          return;
        }

        if (isInsideLembarPenetapan && !isInsideLampiran) {
          return;
        }

        if (isInsideLampiran) {
          lampiranLinesBuffer.push(rawLine);
          return;
        }

        const isTableLine = line.startsWith("|") && line.endsWith("|");
        if (!isTableLine && isInsideTable) {
          flushTableBuffer();
        }

        if (line === "") {
          currentY += 4.5;
          return;
        }

        // Handle page break marker safely
        if (line === "<!-- PAGE_BREAK -->" || line.includes("<!-- PAGE_BREAK -->")) {
          if (hasContentOnCurrentPage) {
            doc.addPage();
            currentY = margin;
            hasContentOnCurrentPage = false;
          }
          return;
        }

        // Handle scientific bold headers instead of unscientific hashtags
        if (line.startsWith("**") && line.endsWith("**")) {
          const text = line.replace(/\*\*/g, "");
          const isSecondPartBab4 = text.trim() === "DAN PENGEMBANGAN PROFESIONAL" || text.includes("DAN PENGEMBANGAN PROFESIONAL");
          if (text.startsWith("BAB") || text.split(" ")[0] === "BAB" || text.startsWith("DOKUMEN KURIKULUM") || text.startsWith("LEMBAR PENETAPAN") || isSecondPartBab4) {
            if (!isSecondPartBab4) {
              addNewPageIfNeeded(35); // Generous buffer for main BAB titles
            }
            currentY += 4;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11); // Slightly compact for multi-line elegant fit
            doc.setTextColor(217, 119, 6); // amber-600
            const splitTitle = doc.splitTextToSize(text, contentWidth - 10);
            splitTitle.forEach((lineText: string) => {
              doc.text(lineText.trim(), pageWidth / 2, currentY, { align: "center" });
              currentY += 5.5;
            });
            currentY += 2.5;
            hasContentOnCurrentPage = true;
            return;
          } else {
            addNewPageIfNeeded(32); // Increased buffer to prevent subheaders from being orphaned without content below
            currentY += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.setTextColor(30, 41, 59); // slate-800
            const splitSub = doc.splitTextToSize(text, contentWidth);
            splitSub.forEach((lineText: string) => {
              doc.text(lineText, margin, currentY);
              currentY += 5.5;
            });
            currentY += 2;
            hasContentOnCurrentPage = true;
            return;
          }
        }

        // Clean out any custom inline MD syntax like asterisks for bold etc.
        const cleanText = line.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^\s*-\s*/, "");

        // H1 Title (# )
        if (line.startsWith("# ") && !line.includes("DOKUMEN KURIKULUM")) {
          const text = line.replace("# ", "").replace(/\*\*/g, "");
          addNewPageIfNeeded(35); // Increased buffer to prevent title-orphaning
          currentY += 4;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(15, 23, 42); // slate-900
          doc.text(text, margin, currentY);
          currentY += 8;
          hasContentOnCurrentPage = true;
          return;
        }

        // H2 Title (## )
        if (line.startsWith("## ")) {
          const text = line.replace("## ", "").replace(/\*\*/g, "");
          addNewPageIfNeeded(32); // Increased buffer to prevent title-orphaning
          currentY += 3;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11.5);
          doc.setTextColor(30, 41, 59); // slate-800
          doc.text(text, margin, currentY);
          currentY += 7.5;
          hasContentOnCurrentPage = true;
          return;
        }

        // H3 Title (### )
        if (line.startsWith("### ")) {
          const text = line.replace("### ", "").replace(/\*\*/g, "");
          addNewPageIfNeeded(30); // Increased buffer to prevent title-orphaning
          currentY += 2;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(180, 83, 9); // amber-700
          doc.text(text, margin, currentY);
          currentY += 6.5;
          hasContentOnCurrentPage = true;
          return;
        }

        // H4 Title or bold subpoints (#### )
        if (line.startsWith("#### ")) {
          const text = line.replace("#### ", "").replace(/\*\*/g, "");
          addNewPageIfNeeded(28); // Increased buffer to prevent title-orphaning
          currentY += 1.5;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0); // Pure black standard header 4 text
          doc.text(text, margin, currentY);
          currentY += 6;
          hasContentOnCurrentPage = true;
          return;
        }

        // Bullet lists
        if (rawLine.trim().startsWith("- ") || rawLine.trim().startsWith("* ")) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0); // Pure black standard bullet list text
          
          const fullBulletText = `•  ${cleanText}`;
          const splitText = doc.splitTextToSize(fullBulletText, contentWidth);
          const blockHeight = splitText.length * leadingSpacing;
          addNewPageIfNeeded(blockHeight);
          
          doc.text(fullBulletText, margin, currentY, {
            maxWidth: contentWidth,
            align: "justify",
            lineHeightFactor: 1.5
          });
          currentY += blockHeight;
          hasContentOnCurrentPage = true;
          return;
        }

        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0); // Pure black standard numbered list text

          const splitText = doc.splitTextToSize(cleanText, contentWidth);
          const blockHeight = splitText.length * leadingSpacing;
          addNewPageIfNeeded(blockHeight);

          doc.text(cleanText, margin, currentY, {
            maxWidth: contentWidth,
            align: "justify",
            lineHeightFactor: 1.5
          });
          currentY += blockHeight;
          hasContentOnCurrentPage = true;
          return;
        }

        // Tables parsing & formatting (intrakurikuler / Swot matrix with full multi-line cells and borders)
        if (isTableLine) {
          if (line.includes("---")) {
            isInsideTable = true;
            return;
          }
          const cells = line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          tableRowsBuffer.push(cells);
          isInsideTable = true;
          return;
        }

        // Normal text paragraph
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0); // Pure black standard paragraph text
        
        const splitText = doc.splitTextToSize(cleanText, contentWidth);
        const blockHeight = splitText.length * leadingSpacing;
        
        addNewPageIfNeeded(blockHeight);
        doc.text(cleanText, margin, currentY, {
          maxWidth: contentWidth,
          align: "justify",
          lineHeightFactor: 1.5
        });
        currentY += blockHeight;
        hasContentOnCurrentPage = true;
      });

      if (isInsideTable) {
        flushTableBuffer();
      }

      // ============================================
      // CUSTOM HIGHLY-POLISHED SIGNATURE & TEAM PENYUSUN SECTION
      // ============================================
      addNewPageIfNeeded(110); 

      // Title & Date/Place
      currentY += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("LEMBAR PENETAPAN & TIM PENYUSUN DOKUMEN", margin, currentY);
      
      currentY += 5;
      doc.setDrawColor(245, 158, 11); // Amber accent
      doc.setLineWidth(0.6);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Ditetapkan di: ${tempatPenyusunan}`, margin, currentY);
      currentY += 5;
      doc.text(`Pada Tanggal: ${tanggalPenyusunan}`, margin, currentY);
      
      currentY += 12;

      // Signing Columns layout: Left: Kepala Sekolah, Right: Ketua Tim
      const colWidthHalf = contentWidth / 2;
      const leftColX = margin;
      const rightColX = margin + colWidthHalf + 15;

      // Group Headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Mengetahui,", leftColX, currentY);
      doc.text("Dibuat Oleh,", rightColX, currentY);

      currentY += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text("Kepala Sekolah,", leftColX, currentY);
      doc.text("Ketua Tim Penyusun KOSP", rightColX, currentY);

      // Signature spacing (white space for signature/cap)
      currentY += 28;

      // Signatory names
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(kepalaSekolah, leftColX, currentY);
      doc.text(ketuaTimPenyusun, rightColX, currentY);

      // NIP
      currentY += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`NIP. ${nipKepala}`, leftColX, currentY);
      doc.text(`NIP. ${nipKetuaTim}`, rightColX, currentY);

      // Members List (Anggota) - arranged vertically, aligned with the Ketua Tim (Right side)
      currentY += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("Anggota Tim:", rightColX, currentY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      
      if (anggota1) {
        currentY += 5;
        doc.text(`- ${anggota1}`, rightColX, currentY);
      }
      if (anggota2) {
        currentY += 5;
        doc.text(`- ${anggota2}`, rightColX, currentY);
      }
      if (anggota3) {
        currentY += 5;
        doc.text(`- ${anggota3}`, rightColX, currentY);
      }

      currentY += 12;

      // ============================================
      // ATTACH TEXTUAL LAMPIRAN SECTION
      // ============================================
      if (lampiranLinesBuffer.length > 0) {
        doc.addPage();
        currentY = margin;
        hasContentOnCurrentPage = false;

        let lampiranInsideTable = false;
        let lampiranTableBuffer: string[][] = [];

        const flushLampiranTable = () => {
          if (lampiranTableBuffer.length === 0) return;
          const numCols = lampiranTableBuffer[0].length;
          const colWidth = contentWidth / numCols;
          lampiranTableBuffer.forEach((rowCells, rowIndex) => {
            const wrappedCells = rowCells.map(cell => {
              const cleanCell = cell.replace(/<br\s*\/?>/gi, "\n").replace(/\*\*/g, "").replace(/\*/g, "");
              return doc.splitTextToSize(cleanCell, colWidth - 3);
            });
            const maxLines = Math.max(...wrappedCells.map(lines => lines.length), 1);
            const rowHeight = (maxLines * 4.5) + 4;
            if (currentY + rowHeight > pageHeight - margin - 15) {
              doc.addPage();
              currentY = margin;
            }
            rowCells.forEach((_, colIndex) => {
              const xPos = margin + (colIndex * colWidth);
              doc.setDrawColor(80, 80, 80);
              doc.setLineWidth(0.22);
              if (rowIndex === 0) {
                doc.setFillColor(235, 235, 235);
                doc.rect(xPos, currentY, colWidth, rowHeight, "F");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
              } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
              }
              doc.rect(xPos, currentY, colWidth, rowHeight, "D");
              const lines = wrappedCells[colIndex];
              lines.forEach((lineText, lineIdx) => {
                const yOffset = currentY + 3.8 + (lineIdx * 4.5);
                doc.text(lineText, xPos + 1.5, yOffset);
              });
            });
            currentY += rowHeight;
          });
          lampiranTableBuffer = [];
          lampiranInsideTable = false;
        };

        lampiranLinesBuffer.forEach((rawLine) => {
          const line = rawLine.trim();
          const isTableLine = line.startsWith("|") && line.endsWith("|");
          if (!isTableLine && lampiranInsideTable) {
            flushLampiranTable();
          }

          if (line === "") {
            currentY += 4.5;
            return;
          }

          if (line === "<!-- PAGE_BREAK -->" || line.includes("<!-- PAGE_BREAK -->")) {
            doc.addPage();
            currentY = margin;
            return;
          }

          const cleanUpper = line.replace(/\*\*/g, "").toUpperCase();
          if (line.startsWith("**") && line.endsWith("**")) {
            const text = line.replace(/\*\*/g, "");
            const isHeader = text.startsWith("LAMPIRAN") || text.split(" ")[0].startsWith("LAMPIRAN");
            if (isHeader) {
              if (currentY > margin + 5) {
                doc.addPage();
                currentY = margin;
              }
              currentY += 4;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(11); // Slightly compact
              doc.setTextColor(217, 119, 6); // amber-600
              const splitTitle = doc.splitTextToSize(text, contentWidth - 10);
              splitTitle.forEach((lineText: string) => {
                doc.text(lineText.trim(), pageWidth / 2, currentY, { align: "center" });
                currentY += 5.5;
              });
              currentY += 2.5;
            } else {
              if (currentY + 25 > pageHeight - margin - 15) {
                doc.addPage();
                currentY = margin;
              }
              currentY += 2;
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10.5);
              doc.setTextColor(30, 41, 59); // slate-800
              const splitSub = doc.splitTextToSize(text, contentWidth);
              splitSub.forEach((lineText: string) => {
                doc.text(lineText, margin, currentY);
                currentY += 5.5;
              });
              currentY += 2;
            }
            return;
          }

          // Clean out any custom inline MD syntax like asterisks for bold etc.
          const cleanText = line.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^\s*-\s*/, "");

          // Lists and Paragraphs
          if (rawLine.trim().startsWith("- ") || rawLine.trim().startsWith("* ")) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(0, 0, 0);
            const fullBulletText = `•  ${cleanText}`;
            const splitText = doc.splitTextToSize(fullBulletText, contentWidth);
            const blockHeight = splitText.length * leadingSpacing;
            if (currentY + blockHeight > pageHeight - margin - 15) {
              doc.addPage();
              currentY = margin;
            }
            doc.text(fullBulletText, margin, currentY, {
              maxWidth: contentWidth,
              align: "justify",
              lineHeightFactor: 1.5
            });
            currentY += blockHeight;
            return;
          }

          if (/^\d+\.\s/.test(line)) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(0, 0, 0);
            const splitText = doc.splitTextToSize(cleanText, contentWidth);
            const blockHeight = splitText.length * leadingSpacing;
            if (currentY + blockHeight > pageHeight - margin - 15) {
              doc.addPage();
              currentY = margin;
            }
            doc.text(cleanText, margin, currentY, {
              maxWidth: contentWidth,
              align: "justify",
              lineHeightFactor: 1.5
            });
            currentY += blockHeight;
            return;
          }

          if (isTableLine) {
            if (line.includes("---")) {
              lampiranInsideTable = true;
              return;
            }
            const cells = line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            lampiranTableBuffer.push(cells);
            lampiranInsideTable = true;
            return;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(0, 0, 0);
          const splitText = doc.splitTextToSize(cleanText, contentWidth);
          const blockHeight = splitText.length * leadingSpacing;
          if (currentY + blockHeight > pageHeight - margin - 15) {
            doc.addPage();
            currentY = margin;
          }
          doc.text(cleanText, margin, currentY, {
            maxWidth: contentWidth,
            align: "justify",
            lineHeightFactor: 1.5
          });
          currentY += blockHeight;
        });

        if (lampiranInsideTable) {
          flushLampiranTable();
        }
      }

      // ============================================
      // LAST SECTION: ATTACH SUPPORTING IMAGES GALLERY
      // ============================================
      if (supportingImages.length > 0) {
        addNewPageIfNeeded(100); // Trigger page break if not enough space at bottom
        doc.addPage();
        currentY = 25;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("LAMPIRAN FOTO & DOKUMENTASI PENDUKUNG", margin, currentY);
        currentY += 5;

        // Slate line spacer
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 12;

        let imageX = margin;
        let imageY = currentY;
        const imgWidth = (contentWidth - 6) / 2; // Two columns
        const imgHeight = 50; // standard landscape aspect ratio
        const rowHeight = 78; // total height per row including image and its caption block

        supportingImages.forEach((img, idx) => {
          if (idx > 0 && idx % 2 === 0) {
            imageX = margin;
            imageY += rowHeight;
            
            // overflow check
            if (imageY + rowHeight > pageHeight - margin - 15) {
              doc.addPage();
              imageY = margin + 10;
            }
          } else if (idx > 0) {
            imageX = margin + imgWidth + 6;
          }

          try {
            // Render photo box
            doc.addImage(img.base64, "JPEG", imageX, imageY, imgWidth, imgHeight);
            
            // Fetch caption
            const captionText = img.caption && img.caption.trim() 
              ? img.caption 
              : "Dokumentasi visual pendukung keabsahan pelaksanaan kurikulum.";

            // Render static label
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`Lampiran Foto ${idx + 1}:`, imageX, imageY + imgHeight + 4);

            // Render description with split lines
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            const wrappedCaption = doc.splitTextToSize(captionText, imgWidth);
            let capY = imageY + imgHeight + 7.5;
            wrappedCaption.slice(0, 3).forEach((lineText: string) => { // slice to max 3 lines to fit beautifully
              doc.text(lineText, imageX, capY);
              capY += 3.5;
            });

          } catch (imgErr) {
            console.error(`Gagal mencetak gambar ke- ${idx + 1}`, imgErr);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8.5);
            doc.setTextColor(180, 83, 9);
            doc.text(`[Error Memuat Berkas Gambar: ${img.name}]`, imageX, imageY + 15);
          }
        });
      }

      // Elegant Foot numbering
      const totalPages = doc.internal.pages.length - 1;
      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);
        
        // Don't draw headers/footers on cover page
        if (page > 1) {
          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.35);
          doc.line(margin, margin - 10, pageWidth - margin, margin - 10);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184); // slate-400
          doc.text("KOSP - TAHUN AJARAN 2026/2027", margin, margin - 12);
          doc.text(namaSekolah.toUpperCase(), pageWidth - margin, margin - 12, { align: "right" });

          // foot
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.text(
            `Dokumen Resmi KOSP  |  Halaman ${page} dari ${totalPages}`, 
            margin, 
            pageHeight - 10
          );
          doc.text("Dihasilkan Asisten Guru", pageWidth - margin, pageHeight - 10, { align: "right" });
        }
      }

      const fileSafeName = namaSekolah.replace(/\s+/g, "_");
      doc.save(`KOSP_FINAL_${fileSafeName}.pdf`);
    } catch (pdfError) {
      console.error("Critical PDF compilation error:", pdfError);
      alert("Format konversi dokumen PDF bermasalah. Anda tetap dapat membaca konten pratinjau di layar atau menyalin teks Markdown secara manual.");
    }
  };

  // Safe block-based markdown parsing and rendering inside React screen
  const renderCustomMarkdown = (rawText: string) => {
    // Strip HTML tags like <div ...>, </div>, <b>, </b>, etc.
    const text = rawText
      .replace(/<div\b[^>]*>/gi, "")
      .replace(/<\/div>/gi, "")
      .replace(/<b\b[^>]*>/gi, "**")
      .replace(/<\/b>/gi, "**")
      .replace(/<br\s*\/?>/gi, "\n");

    const parseInlineMarkdown = (raw: string, isTable: boolean = false) => {
      // Inline sanitization of any lingering HTML tags inside text chunks
      const cleanRaw = raw
        .replace(/<div\b[^>]*>/gi, "")
        .replace(/<\/div>/gi, "")
        .replace(/<b\b[^>]*>/gi, "")
        .replace(/<\/b>/gi, "")
        .replace(/<br\s*\/?>/gi, " ");

      const parts = cleanRaw.split(/\*\*/);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className={`font-bold ${isTable ? "text-zinc-950" : "text-amber-400"}`}>{part}</strong>;
        }
        return part;
      });
    };

    // Clean up consecutive PAGE_BREAK elements
    let textClean = text;
    let lastText = "";
    while (textClean !== lastText) {
      lastText = textClean;
      textClean = textClean.replace(/<!--\s*PAGE_BREAK\s*-->\s*(?:\n\s*)*<!--\s*PAGE_BREAK\s*-->/g, "<!-- PAGE_BREAK -->");
    }

    let lines = textClean.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    const firstBabIndex = lines.findIndex(l => {
      const item = l.trim().replace(/\*\*/g, "").toUpperCase();
      return item.startsWith("BAB I") || item.includes("BAB I:");
    });

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === "") {
        elements.push(<div key={`empty-${i}`} className="h-3" />);
        i++;
        continue;
      }

      // Check for page break marker
      if (trimmed === "<!-- PAGE_BREAK -->") {
        elements.push(
          <div key={`pagebreak-${i}`} className="border-t-2 border-dashed border-zinc-850/60 my-9 pt-5 pb-3 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-zinc-900" />
            Batas Halaman Baru (Cetak)
            <span className="w-12 h-[1px] bg-zinc-900" />
          </div>
        );
        i++;
        continue;
      }

      // Major bold heading parsing (representing scientific clean headings)
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        const titleContent = trimmed.replace(/\*\*/g, "");
        const titleUpper = titleContent.toUpperCase();

        if (
          titleUpper.includes("POTENSI SUMBER DAYA MANUSIA") ||
          titleUpper.includes("ANALISIS SWOT KOMPREHENSIF") ||
          titleUpper.includes("TUJUAN SATUAN PENDIDIKAN")
        ) {
          elements.push(
            <div key={`pagebreak-force-${i}`} className="border-t-2 border-dashed border-zinc-800 my-8 pt-5 pb-3 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none flex items-center justify-center gap-3">
              <span className="w-12 h-[1px] bg-zinc-800" />
              Batas Halaman Baru (Cetak)
              <span className="w-12 h-[1px] bg-zinc-800" />
            </div>
          );
        }

        const isSecondPartBab4 = titleContent.trim() === "DAN PENGEMBANGAN PROFESIONAL" || titleContent.includes("DAN PENGEMBANGAN PROFESIONAL");
        
        if (firstBabIndex !== -1 && i < firstBabIndex) {
          elements.push(
            <h1 key={`cover-title-${i}`} className="text-amber-400 font-display text-sm md:text-base font-extrabold text-center uppercase tracking-wider my-4 select-text">
              {titleContent}
            </h1>
          );
          i++;
          continue;
        }

        if (titleContent.startsWith("BAB") || titleContent.startsWith("LEMBAR PENETAPAN") || titleContent.startsWith("DOKUMEN KURIKULUM") || isSecondPartBab4) {
          elements.push(
            <h2 key={`bold-h2-${i}`} className="text-amber-400 font-display text-sm md:text-base font-bold text-center uppercase tracking-wide my-6 border-b border-zinc-900/40 pb-2 select-text">
              {titleContent}
            </h2>
          );
          i++;
          continue;
        } else {
          // Sub-heading formatting (A., a., 1., 2. etc.)
          elements.push(
            <h3 key={`bold-h3-${i}`} className="text-zinc-100 font-mono text-xs md:text-sm font-bold tracking-tight uppercase mt-5 mb-2.5 pl-2 border-l-2 border-amber-500/40 select-text">
              {titleContent}
            </h3>
          );
          i++;
          continue;
        }
      }

      // Check for table
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines: string[] = [];
        // Gather all consecutive table lines
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        // Parse gathered table lines
        const rows = tableLines.filter(row => !row.includes("---"));
        if (rows.length > 0) {
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-5 font-sans border border-zinc-350 rounded-xl bg-white shadow-xl overflow-hidden">
              <table className="w-full border-collapse text-xs md:text-sm text-left">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-300">
                    {rows[0].split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map((col, colIdx) => (
                      <th key={`th-${colIdx}`} className="p-3.5 font-bold text-zinc-950 uppercase tracking-wider font-mono text-[10.5px] border-r border-zinc-300 last:border-0">
                        {col.replace(/\*\*/g, "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {rows.slice(1).map((row, rowIdx) => {
                    const cols = row.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
                    return (
                      <tr key={`tr-${rowIdx}`} className="bg-white hover:bg-zinc-50 transition-colors">
                        {cols.map((col, colIdx) => (
                          <td key={`td-${colIdx}`} className="p-3.5 text-zinc-900 border-r border-zinc-250 last:border-0 leading-relaxed font-sans font-medium">
                            {parseInlineMarkdown(col, true)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Header parsing with regex
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
         const level = headerMatch[1].length;
         const content = headerMatch[2].trim();
         
         if (level === 1) {
           elements.push(
             <h1 key={`h1-${i}`} className="text-lg md:text-xl font-bold font-display text-white mt-8 mb-4 border-b border-zinc-855 pb-2.5 tracking-tight uppercase">
               {parseInlineMarkdown(content)}
             </h1>
           );
         } else if (level === 2) {
           elements.push(
             <h2 key={`h2-${i}`} className="text-sm md:text-base font-bold font-display text-amber-400 mt-6 mb-3 tracking-tight flex items-center gap-2">
               <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm inline-block shrink-0 animate-pulse" />
               {parseInlineMarkdown(content)}
             </h2>
           );
         } else if (level === 3) {
           elements.push(
             <h3 key={`h3-${i}`} className="text-xs md:text-sm font-bold font-mono text-zinc-200 mt-5 mb-2.5 tracking-wide uppercase flex items-center gap-1.5 border-l border-amber-500/30 pl-2">
               {parseInlineMarkdown(content)}
             </h3>
           );
         } else {
           elements.push(
             <h4 key={`h4-${i}`} className="text-xs font-bold font-sans text-amber-300 mt-4 mb-2">
               {parseInlineMarkdown(content)}
             </h4>
           );
         }
         i++;
         continue;
      }

      // Bullet lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const listContent = trimmed.replace(/^[-*]\s+/, "");
        elements.push(
          <li key={`li-${i}`} className="ml-6 list-disc text-xs md:text-sm text-zinc-300 leading-relaxed md:leading-7 mb-2 font-sans text-justify">
            {parseInlineMarkdown(listContent)}
          </li>
        );
        i++;
        continue;
      }

      // Numbered lists
      const isNumbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (isNumbered) {
        const num = isNumbered[1];
        const content = isNumbered[2];
        elements.push(
          <div key={`ol-${i}`} className="flex items-start gap-2.5 ml-1 my-1.5 leading-relaxed md:leading-7 text-xs md:text-sm text-zinc-300 text-justify font-sans">
            <span className="font-mono font-bold text-amber-400 shrink-0 select-none">{num}.</span>
            <div className="flex-1">{parseInlineMarkdown(content)}</div>
          </div>
        );
        i++;
        continue;
      }

      // Blockquote/Excerpt hint
      if (trimmed.startsWith("> ")) {
        elements.push(
          <blockquote key={`quote-${i}`} className="pl-4 border-l-2 border-amber-500/50 italic text-zinc-400 text-xs md:text-sm my-3 font-sans py-1 bg-zinc-950/40 rounded-r-lg">
            {parseInlineMarkdown(trimmed.replace("> ", ""))}
          </blockquote>
        );
        i++;
        continue;
      }

      // Horizontal line
      if (trimmed === "---") {
        elements.push(<hr key={`hr-${i}`} className="border-zinc-850 my-6" />);
        i++;
        continue;
      }

      // Typical Paragraph Text
      elements.push(
        <p key={`p-${i}`} className="text-xs md:text-sm text-zinc-300 text-justify leading-relaxed md:leading-7 mb-4 font-sans">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
      i++;
    }

    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="premium-card premium-border-purple rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 text-purple-500/5 opacity-5 pointer-events-none">
        <Layers className="w-48 h-48" />
      </div>

      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[9px] mb-2 border border-amber-500/20 uppercase tracking-widest">
            <Sparkles className="w-2.5 h-2.5" />
            Integrasi Kurikulum Merdeka
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white font-display">
            Asisten Penyusun KOSP Cerdas
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Formulasikan draf Kurikulum Operasional Satuan Pendidikan komprehensif, relevan, bersistematika murni secara instan.
          </p>
        </div>
        
        {/* Preset quick loader for faster test fillings */}
        {step < 4 && (
          <div className="flex flex-wrap items-center gap-2 bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 ml-1">Isi Cepat:</span>
            <button 
              onClick={() => fillPreset("desa")}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/20 transition"
            >
              Pedaan/SD
            </button>
            <button 
              onClick={() => fillPreset("kota")}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/20 transition"
            >
              Kota/SMP
            </button>
            <button 
              onClick={() => fillPreset("pesisir")}
              className="px-2.5 py-1 text-[10px] rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono border border-amber-500/20 transition"
            >
              Pantai/SMK
            </button>
          </div>
        )}
      </div>

      {/* STEPPERS GRAPHIC INDICATOR */}
      <div className="mb-8 grid grid-cols-4 gap-2 text-center text-xs font-mono">
        <button 
          onClick={() => step >= 1 && setStep(1)}
          disabled={status === "generating"}
          className={`py-2 px-1 border-b-2 transition ${
            step === 1 ? "border-amber-400 text-amber-300 font-bold" : "border-zinc-800 text-zinc-500 hover:text-zinc-450"
          }`}
        >
          <span className="block text-[9px] text-zinc-600">LANGKAH 01</span>
          Profil Dasar
        </button>
        <button 
          onClick={() => step >= 2 && setStep(2)}
          disabled={status === "generating" || step < 2}
          className={`py-2 px-1 border-b-2 transition ${
            step === 2 ? "border-amber-400 text-amber-300 font-bold" : "border-zinc-800 text-zinc-500 hover:text-zinc-450"
          }`}
        >
          <span className="block text-[9px] text-zinc-600">LANGKAH 02</span>
          Kondisi & Nilai
        </button>
        <button 
          onClick={() => step >= 3 && setStep(3)}
          disabled={status === "generating" || step < 3}
          className={`py-2 px-1 border-b-2 transition ${
            step === 3 ? "border-amber-400 text-amber-300 font-bold" : "border-zinc-800 text-zinc-500"
          }`}
        >
          <span className="block text-[9px] text-zinc-600">LANGKAH 03</span>
          Lampiran Foto
        </button>
        <button 
          disabled={kospMarkup === ""}
          onClick={() => step >= 4 && setStep(4)}
          className={`py-2 px-1 border-b-2 transition ${
            step === 4 ? "border-amber-400 text-amber-300 font-bold" : "border-zinc-800 text-zinc-500"
          }`}
        >
          <span className="block text-[9px] text-zinc-600">LANGKAH 04</span>
          Hasil KOSP
        </button>
      </div>

      {/* ERROR ANNOUNCEMENT CONTAINER */}
      {errorMessage && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-xs text-red-300 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5 animate-pulse" />
          <div>
            <strong className="text-red-400 block font-mono font-bold uppercase mb-1 tracking-wide">GAGAL PROSES:</strong>
            <p className="leading-relaxed font-sans">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* STEP 1: PROFIL DASAR */}
      {step === 1 && status !== "generating" && (
        <div className="space-y-7 animate-fadeIn">
          {/* Locked fields warning banner */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-550/20 text-xs font-sans text-zinc-305 flex items-start sm:items-center gap-3">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400">🔒</span>
            <div>
              <p className="font-bold text-amber-400 uppercase tracking-widest text-[10px] font-mono">PEMBERITAHUAN KEAMANAN DATA UTAMA OMEGA</p>
              <p className="text-[10.5px] mt-0.5 leading-relaxed text-zinc-400">
                Sesuai kebijakan rintisan sekolah, data pokok (Nama Sekolah, Kepala Sekolah, NIP, serta Nama Guru/Ketua Tim) saat ini dikunci luring untuk <strong className="text-amber-400">SD NEGERI FATUBAI</strong>. Hubungi Administrator Omega atau klik <span className="text-amber-400 font-bold hover:underline cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent("open-activation-modal"))}>Konfirmasi Kode Akses</span> di sidebar kiri untuk mengaktifkan dengan data sekolah mandiri Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
                  Nama Resmi Satuan Pendidikan (Sekolah) *
                </span>
                {isActivated ? (
                  <span className="text-[9px] text-emerald-400 font-bold font-mono">✓ PREMIUM LIFETIME</span>
                ) : (
                  <span className="text-[9px] text-amber-500 font-bold font-mono">🔒 TERKUNCI DEMO</span>
                )}
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)] z-10" />
                <input
                  type="text"
                  value={namaSekolah}
                  onChange={(e) => {
                    if (isActivated) {
                      setNamaSekolah(e.target.value);
                      localStorage.setItem("omega_school_name", e.target.value);
                    }
                  }}
                  readOnly={!isActivated}
                  className={`w-full bg-zinc-950/60 border ${isActivated ? "border-zinc-800 focus:border-emerald-400 text-zinc-100" : "border-zinc-900 cursor-not-allowed opacity-80 text-zinc-455"} rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition font-semibold`}
                  placeholder="Contoh: SD Negeri 3 Cerdas Gemilangs..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.4)]" />
                Jenjang Sekolah *
              </label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value)}
                className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition cursor-pointer"
              >
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
                <option value="PAUD">Pendidikan Anak Usia Dini (PAUD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_5px_rgba(244,114,182,0.4)]" />
                  Nama Kepala Sekolah (Lengkap beserta Gelar)
                </span>
                {isActivated ? (
                  <span className="text-[9px] text-emerald-400 font-bold font-mono">✓ KREATOR PREMIUM</span>
                ) : (
                  <span className="text-[9px] text-amber-500 font-bold font-mono">🔒 LOCKED</span>
                )}
              </label>
              <input
                type="text"
                value={kepalaSekolah}
                onChange={(e) => {
                  if (isActivated) {
                    setKepalaSekolah(e.target.value);
                    localStorage.setItem("omega_kepala_sekolah", e.target.value);
                  }
                }}
                readOnly={!isActivated}
                className={`w-full bg-zinc-950/60 border ${isActivated ? "border-zinc-800 focus:border-pink-400 text-zinc-100" : "border-zinc-900 cursor-not-allowed opacity-80 text-zinc-455"} rounded-xl py-2.5 px-3 text-xs font-sans outline-none transition font-semibold`}
                placeholder="Contoh: Darius Kusi, S.Pd.,Gr"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]" />
                  NIP Kepala Sekolah
                </span>
                {isActivated ? (
                  <span className="text-[9px] text-emerald-400 font-bold font-mono">✓ SYNCED</span>
                ) : (
                  <span className="text-[9px] text-amber-500 font-bold font-mono">🔒 LOCKED</span>
                )}
              </label>
              <input
                type="text"
                value={nipKepala}
                onChange={(e) => {
                  if (isActivated) {
                    setNipKepala(e.target.value);
                    localStorage.setItem("omega_nip_kepala", e.target.value);
                  }
                }}
                readOnly={!isActivated}
                className={`w-full bg-zinc-950/60 border ${isActivated ? "border-zinc-800 focus:border-purple-400 text-zinc-100" : "border-zinc-900 cursor-not-allowed opacity-80 text-zinc-455"} rounded-xl py-2.5 px-3 text-xs font-sans outline-none transition font-semibold`}
                placeholder="Contoh: 196709192008011008"
              />
            </div>
          </div>

          {/* TIM PENYUSUN & DATA PENANDATANGANAN KOSP */}
          <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80 space-y-4">
            <h4 className="text-xs font-bold font-mono text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Users className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]" />
              Tim Penyusun & Data Lembar Penetapan KOSP
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Tentukan kota/tempat, tanggal penetapan dokumen, ketua tim penyusun beserta NIP, serta nama-nama anggota penyusun secara manual di bawah ini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.4)]" />
                  Tempat Penyusunan / Kota (Input Manual) *
                </label>
                <input
                  type="text"
                  value={tempatPenyusunan}
                  onChange={(e) => setTempatPenyusunan(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                  placeholder="Contoh: Malang"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]" />
                  Tanggal Penetapan / Waktu (Input Manual) *
                </label>
                <input
                  type="text"
                  value={tanggalPenyusunan}
                  onChange={(e) => setTanggalPenyusunan(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                  placeholder="Contoh: 13 Juli 2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.4)]" />
                    Nama Ketua Tim Penyusun *
                  </span>
                  {isActivated ? (
                    <span className="text-[9px] text-emerald-400 font-bold font-mono">✓ PREMIUM</span>
                  ) : (
                    <span className="text-[9px] text-amber-500 font-bold font-mono">🔒 LOCKED</span>
                  )}
                </label>
                <input
                  type="text"
                  value={ketuaTimPenyusun}
                  onChange={(e) => {
                    if (isActivated) {
                      setKetuaTimPenyusun(e.target.value);
                      localStorage.setItem("omega_nama_guru", e.target.value);
                    }
                  }}
                  readOnly={!isActivated}
                  className={`w-full bg-zinc-950/60 border ${isActivated ? "border-zinc-800 focus:border-teal-400 text-zinc-100" : "border-zinc-900 cursor-not-allowed opacity-80 text-zinc-455"} rounded-xl py-2.5 px-3 text-xs font-sans outline-none transition font-semibold`}
                  placeholder="Contoh: Siti Aminah, S.Pd."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-450 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]" />
                    NIP Ketua Tim Penyusun (Jika ada)
                  </span>
                  {isActivated ? (
                    <span className="text-[9px] text-emerald-400 font-bold font-mono">✓ PREMIUM</span>
                  ) : (
                    <span className="text-[9px] text-amber-500 font-bold font-mono">🔒 LOCKED</span>
                  )}
                </label>
                <input
                  type="text"
                  value={nipKetuaTim}
                  onChange={(e) => {
                    if (isActivated) {
                      setNipKetuaTim(e.target.value);
                      localStorage.setItem("omega_nip_guru", e.target.value);
                    }
                  }}
                  readOnly={!isActivated}
                  className={`w-full bg-zinc-950/60 border ${isActivated ? "border-zinc-800 focus:border-amber-455 text-zinc-100" : "border-zinc-900 cursor-not-allowed opacity-80 text-zinc-455"} rounded-xl py-2.5 px-3 text-[11px] font-sans outline-none transition font-semibold`}
                  placeholder="Contoh: 198504142010122002"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-mono text-zinc-450 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]" />
                Daftar Nama Anggota Tim
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="block text-[10px] font-mono text-zinc-500 mb-1">Nama Anggota 1 *</span>
                  <input
                    type="text"
                    value={anggota1}
                    onChange={(e) => setAnggota1(e.target.value)}
                    className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition opacity-100 placeholder-zinc-700"
                    placeholder="Nama Anggota 1"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-mono text-zinc-500 mb-1">Nama Anggota 2 *</span>
                  <input
                    type="text"
                    value={anggota2}
                    onChange={(e) => setAnggota2(e.target.value)}
                    className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition opacity-100 placeholder-zinc-700"
                    placeholder="Nama Anggota 2"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-mono text-zinc-500 mb-1">Nama Anggota 3 *</span>
                  <input
                    type="text"
                    value={anggota3}
                    onChange={(e) => setAnggota3(e.target.value)}
                    className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition opacity-100 placeholder-zinc-700"
                    placeholder="Nama Anggota 3"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-450 drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]" />
              Kondisi Geografis & Lokasi Satuan
            </label>
            <textarea
              rows={2}
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-xs font-sans text-zinc-200 outline-none transition leading-relaxed"
              placeholder="Uraikan lokasi letak geografis sekolah (Contoh: Kaki pegunungan, Pesisir pantai wisata, Daerah industri perkotaan pasca-tambang)..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
              Karakteristik Khas Satuan Pendidikan (Kekhasan Vokasi, Adiwiyata, Agama, dll)
            </label>
            <input
              type="text"
              value={khasSatuan}
              onChange={(e) => setKhasSatuan(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
              placeholder="Contoh: Sekolah Adiwiyata Mandiri, Berbasis Pesantren Ramah Lingkungan, Unggulan Vokasi Kelautan..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.4)]" />
              Kondisi Sosial-Ekonomi & Demografi Murid / Wali Murid
            </label>
            <textarea
              rows={2}
              value={kondisiSocioDemografi}
              onChange={(e) => setKondisiSocioDemografi(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-xs font-sans text-zinc-200 outline-none transition leading-relaxed"
              placeholder="Uraikan kondisi pencaharian orang tua, sosial ekonomi keluarga, dan keterlibatan budaya gotong royong..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-3">
            {isActivated ? (
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("omega_school_name", namaSekolah);
                  localStorage.setItem("omega_kepala_sekolah", kepalaSekolah);
                  localStorage.setItem("omega_nip_kepala", nipKepala);
                  localStorage.setItem("omega_nama_guru", ketuaTimPenyusun);
                  localStorage.setItem("omega_nip_guru", nipKetuaTim);
                  window.dispatchEvent(new CustomEvent("omega-state-updated"));
                  alert("✓ Perubahan data profil luring Anda disimpan! Nama Sekolah, Kepsek, NIP, & Ketua Tim berhasil diperbarui.");
                }}
                className="py-2.5 px-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/35 hover:to-teal-500/35 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 font-mono font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(16,185,129,0.05)] w-full sm:w-auto"
              >
                <Save className="w-4 h-4 text-emerald-400" /> Simpan Profil Luring
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-mono font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer w-full sm:w-auto"
            >
              Langkah Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: KONDISI INTERNAL & NILAI BUDAYA */}
      {step === 2 && status !== "generating" && (
        <div className="space-y-7 animate-fadeIn">
          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]" />
              Kapasitas Sarana & Fasilitas Pendukung Utama Sekolah
            </label>
            <textarea
              rows={2}
              value={fasilitasSekolah}
              onChange={(e) => setFasilitasSekolah(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-xs font-sans text-zinc-200 outline-none transition leading-relaxed"
              placeholder="Contoh: Jumlah ruang kelas jenuh, laboratoium IT mini, perpustakaan baca, kebun sayur, lapangan olahraga..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
              Profil Tenaga Pendidik & Kependidikan (Guru & Tendik)
            </label>
            <textarea
              rows={2}
              value={kondisiGuruTendik}
              onChange={(e) => setKondisiGuruTendik(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-xs font-sans text-zinc-200 outline-none transition leading-relaxed"
              placeholder="Uraikan karakteristik guru, jumlah sertifikasi kompetensi, porsi guru penggerak, melek teknologi informasi dasar..."
            />
          </div>

          {/* Rincian Pendidikan & Sertifikasi Guru (Validasi Data SDM) */}
          <div className="bg-[#0b0c10]/40 rounded-2xl p-5 border border-zinc-900 shadow-xl space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Tingkat Pendidikan & Sertifikasi Pendidik
            </h4>
            <p className="text-[11px] text-zinc-500 leading-normal font-sans">
              Masukkan perbandingan kualifikasi akademik guru secara valid agar lampiran tabel SDM pada bab karakteristik KOSP terisi otomatis sesuai kenyataan kondisi sekolah Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-zinc-500">Total Guru (Orang)</span>
                <input
                  type="number"
                  min={0}
                  value={jumlahGuruTotal}
                  onChange={(e) => setJumlahGuruTotal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-zinc-500">Lulusan S1 (Orang)</span>
                <input
                  type="number"
                  min={0}
                  value={jumlahS1}
                  onChange={(e) => setJumlahS1(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-zinc-500">Lulusan S2 (Orang)</span>
                <input
                  type="number"
                  min={0}
                  value={jumlahS2}
                  onChange={(e) => setJumlahS2(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-zinc-500">Lulusan S3 (Orang)</span>
                <input
                  type="number"
                  min={0}
                  value={jumlahS3}
                  onChange={(e) => setJumlahS3(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-mono text-zinc-500">Sudah Sertifikasi</span>
                <input
                  type="number"
                  min={0}
                  value={jumlahSertifikasi}
                  onChange={(e) => setJumlahSertifikasi(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                />
              </div>
            </div>
            
            {jumlahS1 + jumlahS2 + jumlahS3 !== jumlahGuruTotal && (
              <div className="text-[10px] text-amber-500/85 font-mono pt-1">
                ⚠️ Keterangan: Distribusi lulusan (S1: {jumlahS1} + S2: {jumlahS2} + S3: {jumlahS3} = {jumlahS1 + jumlahS2 + jumlahS3}) tidak sama dengan total guru ({jumlahGuruTotal}). Mohon disesuaikan secara berimbang.
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-rose-450 drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]" />
              Rombongan Belajar (Rombel) & Jumlah Siswa
            </label>
            <input
              type="text"
              value={jumlahRombel}
              onChange={(e) => setJumlahRombel(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
              placeholder="Contoh: 6 Rombel dengan rata-rata 28 siswa per kelas (Total 168 siswa aktif)..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-amber-455 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]" />
              Kemitraan Eksternal / Komunitas Mitra Sekolah
            </label>
            <input
              type="text"
              value={kemitraanSatuan}
              onChange={(e) => setKemitraanSatuan(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
              placeholder="Contoh: Puskesmas Kecamatan, PT Pertanian Jaya, Karang Taruna Kelurahan..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.4)]" />
              Nilai Kebudayaan Lokal / Tradisi Kearifan Setempat
            </label>
            <textarea
              rows={2}
              value={nilaiBudayaLokal}
              onChange={(e) => setNilaiBudayaLokal(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl p-3 text-xs font-sans text-zinc-200 outline-none transition leading-relaxed"
              placeholder="Kearifan lokal daerah yang dapat dikolaborasikan dalam intra/ekskul program (Pramuka, tarian sinoman, anyaman bambu, karawitan)..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]" />
                Visi - Kata Kunci Pembawa Karakter
              </label>
              <input
                type="text"
                value={visiKeywords}
                onChange={(e) => setVisiKeywords(e.target.value)}
                className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                placeholder="Contoh: Mandiri, Peduli Alam, Cerdas, Berakhalk..."
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.4)]" />
                Misi - Program/Langkah Inti
              </label>
              <input
                type="text"
                value={misiKeywords}
                onChange={(e) => setMisiKeywords(e.target.value)}
                className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
                placeholder="Contoh: Mengembangkan kemandirian via keaktifan Pramuka..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-450 uppercase mb-2 font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
              Pilihan Tema Utama Projek Kokurikuler Sekolah
            </label>
            <input
              type="text"
              value={p5Themes}
              onChange={(e) => setP5Themes(e.target.value)}
              className="w-full bg-[#07070a] border border-zinc-800 focus:border-amber-400 rounded-xl py-2.5 px-3 text-xs font-sans text-zinc-200 outline-none transition"
              placeholder="Contoh: Kearifan Lokal dan Gaya Hidup Berkelanjutan..."
            />
          </div>

          {/* SEPARATOR & GRADE ALLOCATION BUILDER */}
          <div className="border-t border-zinc-900 pt-5 space-y-4">
            <div>
              <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] animate-pulse" />
                Rancangan Alokasi Jam Pelajaran & Mapel Aktif (Kelas 1 s.d. 6)
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                Tentukan mata pelajaran aktif beserta kegiatan ekstrakurikuler pilihan untuk setiap jenjang kelas (Kelas 1 sampai Kelas 6). Sistem kami akan memformulasikan tabel pembagian waktu / durasi efektif JP berdasar centangan aktif Anda secara akurat!
              </p>
            </div>

            {/* HARI KERJA SELECTOR TOOL */}
            <div className="bg-[#050508] border border-zinc-900 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                SISTEM HARI KERJA & PENETAPAN ALOKASI WAKTU EFEKTIF
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHariKerja("6")}
                  className={`p-3.5 rounded-xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                    hariKerja === "6"
                      ? "bg-amber-500/10 border-amber-505/40 text-white"
                      : "bg-[#0b0c10]/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11.5px] font-bold font-mono">6 Hari Kerja (Senin - Sabtu) [Reguler]</span>
                    {hariKerja === "6" && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Aktif</span>}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 font-sans leading-relaxed">
                    Sistem reguler / alokasi umum dengan hari masuk sekolah 6 hari efektif sepekan. Durasi JP harian lebih pendek (rata-rata 5-6 JP/hari). Cocok untuk sekolah dengan shift siang atau kapasitas kelas terbagi.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHariKerja("5")}
                  className={`p-3.5 rounded-xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between ${
                    hariKerja === "5"
                      ? "bg-amber-500/10 border-amber-505/40 text-white animate-[pulse_3s_infinite]"
                      : "bg-[#0b0c10]/40 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11.5px] font-bold font-mono">5 Hari Kerja (Senin - Jumat) [Padat Intensif] ⚠️</span>
                    {hariKerja === "5" && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Aktif</span>}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-2 font-sans leading-relaxed">
                    Hari kerja dipadatkan menjadi hanya 5 hari efektif sepekan. Total JP tahunan tetap utuh sesuai kurikulum nasional, dengan memadatkan muatan belajar harian (rata-rata 6-7.2 JP/hari). Hari Sabtu sepenuhnya bersih/libur.
                  </span>
                </button>
              </div>
            </div>

            {/* PANDUAN PENGINPUTAN MANUAL GURU */}
            <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <h5 className="text-[11px] font-bold font-mono text-amber-300 uppercase tracking-wide">
                  PETUNJUK PENYUSUNAN STRUKTUR KURIKULUM & INPUT MAPEL MANUAL
                </h5>
              </div>
              <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">
                Untuk melengkapi kelengkapan data kurikulum operasional (KOSP) satuan pendidikan Anda secara presisi sesuai kenyataan di lapangan:
              </p>
              <ul className="text-[9.5px] text-zinc-400 font-sans space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">Pilih Jenjang Kelas Terlebih Dahulu:</strong> Pertama-tama, klik tombol tab kelas di bawah (<span className="text-amber-400 font-mono font-bold">Kelas 1 s.d. Kelas 6</span>) untuk mengaktifkan konfigurasi kelas yang akan Anda edit.
                </li>
                <li>
                  <strong className="text-zinc-200">Atur Keaktifan Mata Pelajaran:</strong> Centang kotak di samping nama mata pelajaran atau kegiatan ekstrakurikuler yang diajarkan pada kelas terpilih. Alokasi JP mingguan akan dikalkulasi langsung secara otomatis.
                </li>
                <li>
                  <strong className="text-zinc-200">Integrasi Muatan Lokal Kustom:</strong> Jika sekolah Anda memiliki muatan lokal bahasa daerah atau ekskul khas daerah tertentu (seperti bahasa Bali, bahasa Bugis, dsb), tambahkan terlebih dahulu melalui menu <span className="text-amber-400 font-bold">Profil Sekolah</span>. Sistem cerdas kami akan langsung mengintegrasikan materi tersebut ke dalam struktur KOSP, modul, nilai, dan analisis CP-TP-ATP secara otomatis!
                </li>
              </ul>
            </div>

            {/* CLASS GRADE TABS */}
            <div className="flex flex-wrap gap-1 bg-[#030305] border border-zinc-900 p-1 rounded-xl">
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setActiveGradeTab(grade)}
                  className={`flex-1 py-1.5 px-2 text-[10.5px] font-bold font-mono rounded-lg transition uppercase tracking-wider cursor-pointer text-center ${
                    activeGradeTab === grade
                      ? "bg-amber-500/10 text-amber-405 border border-amber-500/20 shadow-sm"
                      : "text-zinc-550 hover:text-zinc-300 hover:bg-zinc-900/35"
                  }`}
                >
                  Kelas {grade}
                </button>
              ))}
            </div>

            {/* INTRA-CURRICULUM AND EXTRA-CURRICULUM INSTRUCTOR BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-zinc-950/40 rounded-2xl border border-zinc-850">
              {/* SUBJECTS OPTIONS (LEFT) */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-900 pb-1.5">
                  1. Pilih Mata Pelajaran (Intrakurikuler) - Kelas {activeGradeTab}
                </span>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {Object.keys(classConfigs[activeGradeTab].subjects).map((subKey) => {
                    const label = getSubjectLabel(subKey);
                    const isIpas = subKey === "ipas";
                    const isDisabled = isIpas && activeGradeTab < 3;
                    const jp = getSubjectJp(subKey, activeGradeTab);
                    const isCustom = subKey.startsWith("custom_");

                    return (
                      <div key={subKey} className="relative group/subj">
                        <label
                          className={`flex items-start gap-2.5 p-2 pr-10 rounded-xl border transition text-xs select-none ${
                            isDisabled
                              ? "border-zinc-900/40 bg-zinc-950/20 text-zinc-600 opacity-40 cursor-not-allowed"
                              : classConfigs[activeGradeTab].subjects[subKey]
                              ? "border-amber-500/20 bg-amber-500/5 text-zinc-200"
                              : "border-zinc-850 hover:border-zinc-805 bg-[#050510]/30 text-zinc-450 hover:text-zinc-355 cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={isDisabled}
                            checked={isDisabled ? false : classConfigs[activeGradeTab].subjects[subKey]}
                            onChange={(e) => {
                              if (isDisabled) return;
                              const isChecked = e.target.checked;
                              setClassConfigs((prev) => ({
                                ...prev,
                                [activeGradeTab]: {
                                  ...prev[activeGradeTab],
                                  subjects: {
                                    ...prev[activeGradeTab].subjects,
                                    [subKey]: isChecked,
                                  },
                                },
                              }));
                            }}
                            className="mt-0.5 rounded border-zinc-750 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 bg-[#050508] cursor-pointer"
                          />
                          <div className="text-left leading-tight">
                            <span className="font-semibold block">{label}</span>
                            {!isDisabled ? (
                              <span className="text-[9px] font-mono text-zinc-505">
                                Beban Jam: {jp} JP/Minggu
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-amber-500/65 block">
                                (IPAS diajarkan mulai Kelas 3)
                              </span>
                            )}
                          </div>
                        </label>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => removeCustomSubject(subKey)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-550 hover:text-red-400 p-1.5 opacity-100 sm:opacity-0 group-hover/subj:opacity-100 transition rounded hover:bg-zinc-900 cursor-pointer"
                            title="Hapus permanen mapel ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Form Tambah Mata Pelajaran Baru */}
                <div className="p-4 bg-[#08080d] border border-zinc-905 hover:border-zinc-800 rounded-2xl space-y-3 mt-4 text-left">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]" />
                    Tambah Mata Pelajaran Baru (Muatan Lokal / Pendukung)
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-zinc-800 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-zinc-200 outline-none transition"
                      placeholder="Contoh: Bahasa Daerah Bali / NTT / NTB..."
                      value={newManualSubjectName}
                      onChange={(e) => setNewManualSubjectName(e.target.value)}
                    />
                    <select
                      className="bg-black border border-zinc-850 focus:border-amber-500 rounded-xl py-2 px-2.5 text-xs text-zinc-350 outline-none transition"
                      value={newManualSubjectJp}
                      onChange={(e) => setNewManualSubjectJp(parseInt(e.target.value, 10))}
                    >
                      <option value={1}>1 JP</option>
                      <option value={2}>2 JP</option>
                      <option value={3}>3 JP</option>
                      <option value={4}>4 JP</option>
                    </select>
                    <button
                      type="button"
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold text-xs rounded-xl active:scale-95 transition cursor-pointer"
                      onClick={addCustomSubject}
                    >
                      Tambah
                    </button>
                  </div>
                  <p className="text-[9.5px] text-zinc-500 mt-1 leading-normal">
                    Mata pelajaran baru yang Anda tambahkan di atas akan otomatis aktif luring pada kelas ini dan terintegrasi di seluruh daftar KOSP, Rapor, CP, TP maupun draf modul.
                  </p>
                </div>
              </div>

              {/* EXTRACURRICULAR OPTIONS & CALCULATOR TABLE (RIGHT) */}
              <div className="space-y-4 text-left">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-900 pb-1.5">
                    2. Pilih Ekstrakurikuler Wajib/Tambahan - Kelas {activeGradeTab}
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    {Object.keys(classConfigs[activeGradeTab].extracurriculars).map((exKey) => {
                      const label = getExtraLabel(exKey);
                      const isChecked = classConfigs[activeGradeTab].extracurriculars[exKey];
                      const isCustom = exKey.startsWith("custom_extra_");

                      return (
                        <div key={exKey} className="relative group/ex">
                          <label
                            className={`flex items-start gap-2.5 p-2 pr-10 rounded-xl border transition text-xs select-none cursor-pointer ${
                              isChecked
                                ? "border-amber-500/20 bg-amber-500/5 text-zinc-200"
                                : "border-zinc-850 hover:border-zinc-800 bg-[#050510]/30 text-zinc-450 hover:text-zinc-150"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setClassConfigs((prev) => ({
                                  ...prev,
                                  [activeGradeTab]: {
                                    ...prev[activeGradeTab],
                                    extracurriculars: {
                                      ...prev[activeGradeTab].extracurriculars,
                                      [exKey]: checked,
                                    },
                                  },
                                }));
                              }}
                              className="mt-0.5 rounded border-zinc-750 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 bg-[#050508] cursor-pointer"
                            />
                            <div className="text-left leading-tight">
                              <span className="font-semibold block">{label}</span>
                              <span className="text-[9px] font-mono text-zinc-505 block mt-0.5">
                                Alokasi Mandiri eksternal: 2 JP/Minggu
                              </span>
                            </div>
                          </label>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => removeCustomExtra(exKey)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-400 p-1.5 opacity-100 sm:opacity-0 group-hover/ex:opacity-100 transition rounded hover:bg-zinc-900 cursor-pointer"
                              title="Hapus permanen ekskul ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Form Tambah Ekskul Baru */}
                  <div className="p-4 bg-[#08080d] border border-zinc-905 hover:border-zinc-800 rounded-2xl space-y-3 mt-4 text-left">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]" />
                      Tambah Ekstrakurikuler Baru (Khusus / Bakat)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-black border border-zinc-800 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-zinc-200 outline-none transition"
                        placeholder="Contoh: Sanggar Tari Daerah / Coding..."
                        value={newManualExtraName}
                        onChange={(e) => setNewManualExtraName(e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold text-xs rounded-xl active:scale-95 transition cursor-pointer"
                        onClick={addCustomExtra}
                      >
                        Tambah
                      </button>
                    </div>
                    <p className="text-[9.5px] text-zinc-500 mt-1 leading-normal">
                      Menambah bakat rintisan baru langsung untuk jenjang aktif guna pelaporan resmi kurikulum operasional yang dinamis dan terarah.
                    </p>
                  </div>
                </div>

                {/* INTERACTIVE TABLE PREVIEW (REALTIME CALCULATIONS) */}
                <div className="bg-[#030305] border border-zinc-900 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-905 pb-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      REKAPITULASI JP KELAS {activeGradeTab}
                    </span>
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.25 rounded font-mono font-bold">
                      VERIFIKASI BSKAP
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>Beban Mapel Intrakurikuler:</span>
                      <span className="font-mono text-white font-bold">
                        {Object.keys(classConfigs[activeGradeTab].subjects)
                          .filter((k) => classConfigs[activeGradeTab].subjects[k])
                          .reduce((acc, k) => acc + getSubjectJp(k, activeGradeTab), 0)}{" "}
                        JP/Minggu
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-400 text-[11px]">
                      <span>Beban Kegiatan Ekstrakurikuler:</span>
                      <span className="font-mono text-white font-bold">
                        {Object.keys(classConfigs[activeGradeTab].extracurriculars)
                          .filter((k) => classConfigs[activeGradeTab].extracurriculars[k])
                          .length * 2}{" "}
                        JP/Minggu
                      </span>
                    </div>

                    <div className="border-t border-dashed border-zinc-900 pt-2 flex justify-between font-bold text-zinc-300">
                      <span>Total JP Efektif Mingguan:</span>
                      <span className="font-mono text-amber-400">
                        {Object.keys(classConfigs[activeGradeTab].subjects)
                          .filter((k) => classConfigs[activeGradeTab].subjects[k])
                          .reduce((acc, k) => acc + getSubjectJp(k, activeGradeTab), 0) +
                          Object.keys(classConfigs[activeGradeTab].extracurriculars)
                            .filter((k) => classConfigs[activeGradeTab].extracurriculars[k])
                            .length * 2}{" "}
                        JP/Minggu
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-zinc-300 text-[11px]">
                      <span>Proyeksi Tahunan (36 Pekan Efektif):</span>
                      <span className="font-mono text-orange-400">
                        {(Object.keys(classConfigs[activeGradeTab].subjects)
                          .filter((k) => classConfigs[activeGradeTab].subjects[k])
                          .reduce((acc, k) => acc + getSubjectJp(k, activeGradeTab), 0) +
                          Object.keys(classConfigs[activeGradeTab].extracurriculars)
                            .filter((k) => classConfigs[activeGradeTab].extracurriculars[k])
                            .length * 2) *
                          36}{" "}
                        JP/Tahun
                      </span>
                    </div>

                    <div className="border-t border-zinc-900 my-2 pt-2 space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Pilihan Sistem Kerja:</span>
                        <span className="text-amber-400 font-bold">{hariKerja} Hari Kerja / Minggu</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Pemberatan Harian:</span>
                        <span className="text-cyan-400 font-bold">
                          ~{(
                            (Object.keys(classConfigs[activeGradeTab].subjects)
                              .filter((k) => classConfigs[activeGradeTab].subjects[k])
                              .reduce((acc, k) => acc + getSubjectJp(k, activeGradeTab), 0) +
                              Object.keys(classConfigs[activeGradeTab].extracurriculars)
                                .filter((k) => classConfigs[activeGradeTab].extracurriculars[k])
                                .length * 2) /
                            (hariKerja === "5" ? 5 : 6)
                          ).toFixed(2)}{" "}
                          JP / Hari
                        </span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-zinc-900 border-dashed mt-1.5">
                        <span className="text-zinc-500 font-semibold block text-[9.5px] uppercase tracking-wider mb-1">Rencana Distribusi Riil Harian:</span>
                        <span className="text-emerald-400 font-bold text-[10px] leading-relaxed block">
                          {getDailyDistributionText(
                            Object.keys(classConfigs[activeGradeTab].subjects)
                              .filter((k) => classConfigs[activeGradeTab].subjects[k])
                              .reduce((acc, k) => acc + getSubjectJp(k, activeGradeTab), 0) +
                              Object.keys(classConfigs[activeGradeTab].extracurriculars)
                                .filter((k) => classConfigs[activeGradeTab].extracurriculars[k])
                                .length * 2,
                            hariKerja
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 font-mono text-xs rounded-xl transition cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-mono font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Langkah Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOGO & LAMPIRAN GAMBAR PENDUKUNG */}
      {step === 3 && status !== "generating" && (
        <div className="space-y-6 animate-fadeIn">
           {/* Logo Upload Unit */}
          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-850 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
              <div>
                <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-sm" />
                  1. LAMBANG RESMI / LOGO SAMPUL (INTEGRASI GANDA)
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Sesuai tata naskah dinas pendidikan nasional, Anda dapat menyertakan Logo Kementerian/Depag di sebelah KIRI dan Logo Sekolah Mandiri di sebelah KANAN.
                </p>
              </div>
              {isMinistryLogoEnabled && isSchoolLogoEnabled ? (
                <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 uppercase tracking-widest leading-none">
                  GANDA AKTIF (DIREKOMENDASIKAN)
                </span>
              ) : isSchoolLogoEnabled ? (
                <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest leading-none">
                  HANYA LOGO SEKOLAH AKTIF
                </span>
              ) : isMinistryLogoEnabled ? (
                <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest leading-none">
                  HANYA LOGO KEMENTERIAN AKTIF
                </span>
              ) : (
                <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800/50 border border-zinc-700/30 text-zinc-400 uppercase tracking-widest leading-none">
                  SAMPUL POLOS (TANPA LOGO)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* KOLOM A: LOGO KEMENTERIAN / DEPAG (SAMPUL KIRI) */}
              <div className={`bg-zinc-900/35 border rounded-2xl p-4.5 space-y-3.5 flex flex-col justify-between transition-all duration-200 ${
                isMinistryLogoEnabled ? "border-blue-900/40 opacity-100" : "border-zinc-900 opacity-60"
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 border-b border-zinc-900/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-blue-500 rounded-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-250 font-mono">1A. Logo Kementerian (Kiri)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMinistryLogoEnabled(!isMinistryLogoEnabled)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 border ${
                        isMinistryLogoEnabled
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                          : "bg-zinc-950 border-zinc-850 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isMinistryLogoEnabled ? "bg-blue-400 animate-pulse" : "bg-zinc-600"}`} />
                      {isMinistryLogoEnabled ? "✓ AKTIF" : "✗ NONAKTIF"}
                    </button>
                  </div>

                  {/* Selector Grid for Ministry Type */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {/* Option A: Kemdikbud */}
                    <button
                      type="button"
                      disabled={!isMinistryLogoEnabled}
                      onClick={() => setLogoType("kemdikbud")}
                      className={`p-2.5 rounded-xl border font-mono text-left transition duration-200 cursor-pointer flex items-center gap-2 ${
                        !isMinistryLogoEnabled
                          ? "bg-zinc-955/20 border-zinc-900 text-zinc-600 cursor-not-allowed"
                          : logoType === "kemdikbud"
                          ? "bg-blue-500/10 border-blue-500/40 text-white"
                          : "bg-zinc-955/40 border-zinc-850 text-zinc-450 hover:border-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <div className="w-7 h-7 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                        <span className="text-[6px] font-bold">KEMDIK</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-zinc-200 truncate font-mono">KEMDIKBUD</div>
                        <p className="text-[8px] text-zinc-550 truncate">Tut Wuri Mandiri</p>
                      </div>
                    </button>

                    {/* Option B: Kemenag */}
                    <button
                      type="button"
                      disabled={!isMinistryLogoEnabled}
                      onClick={() => setLogoType("kemenag")}
                      className={`p-2.5 rounded-xl border font-mono text-left transition duration-200 cursor-pointer flex items-center gap-2 ${
                        !isMinistryLogoEnabled
                          ? "bg-zinc-955/20 border-zinc-900 text-zinc-600 cursor-not-allowed"
                          : logoType === "kemenag"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                          : "bg-zinc-955/40 border-zinc-850 text-zinc-450 hover:border-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <div className="w-7 h-7 rounded bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                        <span className="text-[6px] font-bold text-emerald-400">DEPAG</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-zinc-200 truncate font-mono">KEMENAG RI</div>
                        <p className="text-[8px] text-zinc-550 truncate">Kementerian Agama</p>
                      </div>
                    </button>
                  </div>

                  {/* Ministry Logo State Display */}
                  <div className="bg-black/35 rounded-xl p-3 border border-zinc-950 flex items-center gap-3">
                    {customMinistryLogo ? (
                      <div className="relative w-12 h-12 bg-zinc-950 rounded-lg border border-zinc-800 p-1 flex items-center justify-center shadow-inner font-bold shrink-0">
                        <img src={customMinistryLogo} className="max-w-full max-h-full object-contain" alt="Custom Ministry Logo" />
                        <button
                          type="button"
                          disabled={!isMinistryLogoEnabled}
                          onClick={clearMinistryLogo}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-650 hover:bg-red-700 rounded-full text-white cursor-pointer transition shadow disabled:opacity-50"
                          title="Hapus Logo"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-950/55 border border-dashed border-zinc-850 flex items-center justify-center text-zinc-500 shrink-0 italic text-[8px] font-mono leading-tight text-center">
                        Belum Diunggah
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-zinc-300 font-sans">File Logo Kementerian</div>
                      <p className="text-[9px] text-zinc-450 truncate font-mono">
                        {customMinistryLogo ? "Terunggah dan Aktif" : "Kosong (Opsional - disisipkan di atas cover)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!isMinistryLogoEnabled}
                    onClick={() => ministryLogoInputRef.current?.click()}
                    className={`w-full py-1.5 px-3 border text-[10px] font-mono font-bold rounded-lg transition cursor-pointer text-center ${
                      !isMinistryLogoEnabled
                        ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-955/50 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {customMinistryLogo ? "Ganti Logo Kementerian..." : "Unggah Custom Logo Kementerian..."}
                  </button>
                </div>
              </div>

              {/* KOLOM B: LOGO SEKOLAH / SATUAN PENDIDIKAN (SAMPUL KANAN) */}
              <div className={`bg-zinc-900/35 border rounded-2xl p-4.5 space-y-3.5 flex flex-col justify-between transition-all duration-200 ${
                isSchoolLogoEnabled ? "border-amber-900/40 opacity-100" : "border-zinc-900 opacity-60"
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 border-b border-zinc-900/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-3.5 bg-amber-500 rounded-sm" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-250 font-mono">1B. Logo Sekolah (Kanan)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSchoolLogoEnabled(!isSchoolLogoEnabled)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 border ${
                        isSchoolLogoEnabled
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                          : "bg-zinc-950 border-zinc-850 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSchoolLogoEnabled ? "bg-amber-450 animate-pulse" : "bg-zinc-600"}`} />
                      {isSchoolLogoEnabled ? "✓ AKTIF" : "✗ NONAKTIF"}
                    </button>
                  </div>

                  {/* Spacer or Helper description */}
                  <p className="text-[9px] text-zinc-500 leading-relaxed mb-4">
                    Unggah lambang sekolah orisinal Anda. Logo sekolah akan terletak tepat di atas tulisan nama sekolah secara proporsional.
                  </p>

                  {/* School Logo State Display */}
                  <div className="bg-black/35 rounded-xl p-3 border border-zinc-950 flex items-center gap-3">
                    {schoolLogo ? (
                      <div className="relative w-12 h-12 bg-zinc-950 rounded-lg border border-zinc-800 p-1 flex items-center justify-center shadow-inner font-bold shrink-0">
                        <img src={schoolLogo} className="max-w-full max-h-full object-contain" alt="Custom School Logo" />
                        <button
                          type="button"
                          disabled={!isSchoolLogoEnabled}
                          onClick={clearSchoolLogo}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-red-650 hover:bg-red-700 rounded-full text-white cursor-pointer transition shadow disabled:opacity-50"
                          title="Hapus Logo"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-950/20 border border-dashed border-zinc-850 flex flex-col items-center justify-center text-zinc-650 shrink-0">
                        <School className="w-4 h-4 text-zinc-650" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-zinc-300 font-sans">File Logo Sekolah Mandiri</div>
                      <p className="text-[9px] text-zinc-450 truncate font-mono">
                        {schoolLogo ? "Terunggah dan Aktif" : "Kosong (Wajib unggah agar muncul di atas nama sekolah)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!isSchoolLogoEnabled}
                    onClick={() => logoInputRef.current?.click()}
                    className={`w-full py-1.5 px-3 border text-[10px] font-mono font-bold rounded-lg transition cursor-pointer text-center ${
                      !isSchoolLogoEnabled
                        ? "bg-zinc-950/20 border-zinc-900 text-zinc-600 cursor-not-allowed"
                        : "bg-zinc-955/50 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {schoolLogo ? "Ganti Logo Sekolah..." : "Unggah Logo Sekolah Mandiri..."}
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden inputs */}
            <input
              type="file"
              ref={ministryLogoInputRef}
              accept="image/*"
              onChange={handleMinistryLogoUpload}
              className="hidden"
            />
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Supporting Images Upload Units */}
          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-850 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
              <div>
                <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-3 bg-zinc-600 rounded-sm" />
                  2. FOTO DOKUMENTASI & GAMBAR PENDUKUNG LAPANGAN (OPSIONAL)
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Anda bisa mengunggah hingga 6 foto kegiatan (pertemuan, loka karya, rapat komite). Gambar akan diintegrasikan di halaman Lampiran akhir PDF.
                </p>
              </div>
              <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase tracking-widest leading-none">
                Opsional
              </span>
            </div>

            <p className="text-[10px] text-zinc-400/90 leading-relaxed font-sans mt-1">
              💡 <span className="font-semibold text-zinc-300">Catatan penting:</span> Keberadaan atau kepasifan foto lapangan ini <span className="text-amber-400 font-bold">tidak mempengaruhi</span> proses perakitan draf kurikulum utama maupun status pengiriman formulir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {supportingImages.map((img) => (
                <div key={img.id} className="bg-[#050508] border border-zinc-800 rounded-xl p-2.5 flex flex-col gap-2">
                  <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900">
                    <img 
                      src={img.base64} 
                      alt={img.name} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSupportingImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 rounded-lg text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-500 uppercase mb-1 font-bold">
                      Keterangan Foto / Kapsi *
                    </label>
                    <input
                      type="text"
                      value={img.caption || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSupportingImages((prev) =>
                          prev.map((item) =>
                            item.id === img.id ? { ...item, caption: val } : item
                          )
                        );
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-lg py-1 px-2.5 text-[10px] font-sans text-zinc-205 outline-none transition"
                      placeholder="Contoh: Rapat Koordinasi Penyusunan KOSP..."
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => supportImagesInputRef.current?.click()}
                className="aspect-video bg-zinc-900 border border-dashed border-zinc-800 hover:border-amber-500/40 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:text-amber-400 transition cursor-pointer min-h-[140px]"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-mono">Unggah Lampiran Baru</span>
              </button>

              <input
                type="file"
                ref={supportImagesInputRef}
                accept="image/*"
                multiple
                onChange={handleSupportImagesUpload}
                className="hidden"
              />
            </div>

            {supportingImages.length > 0 && (
              <div className="text-[10px] text-zinc-400 font-mono">
                Total dokumentasi aktif: <span className="text-amber-400 font-bold">{supportingImages.length}</span> Berkas Gambar Terunggah.
              </div>
            )}
          </div>

          <div className="flex justify-between pt-3 border-t border-zinc-900">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 font-mono text-xs rounded-xl transition cursor-pointer"
            >
              Kembali
            </button>
            
            <button
              onClick={generateKosp}
              className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:opacity-90 text-black font-mono font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              MULAI FORMULASI KOSP CERDAS
            </button>
          </div>
        </div>
      )}

      {/* RUNNING PROCESSOR SCREEN (MILSETONES INTERACTIVE ANIMATION) */}
      {status === "generating" && (
        <CinematicLoading
          title="Merakit Dokumen KOSP Kurikulum Merdeka"
          subtitle="Algoritma kami sedang menganalisis karakteristik demografis, sosiokultural, visi, dan misi sekolah untuk diselaraskan secara komprehensif Kelas 1-6"
          progressMsg={progressMsg}
        />
      )}

      {/* STEP 4: KOSP OUTPUT PREVIEW & EDIT VIEW */}
      {step === 4 && status !== "generating" && kospMarkup !== "" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Welcome & Informational Guide Banner */}
          <div className="bg-amber-500/5 border border-amber-500/20 text-zinc-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 shadow-lg shadow-amber-500/2">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1 my-auto">
              <h4 className="font-bold text-sm text-amber-300">✨ Formulasi Dokumen KOSP Berhasil Selesai!</h4>
              <p className="text-xs leading-relaxed text-zinc-400">
                Silakan periksa naskah akhir di bawah ini menggunakan tab 
                <span className="text-amber-300 font-bold mx-1">👁️ Pratinjau Hasil Dokumen</span> untuk meninjau tata letak, logo, dan lembar penetapan. 
                Jika ada detail pembahasan yang perlu disesuaikan, Anda bisa langsung mengeklik tab 
                <span className="text-amber-350 font-bold mx-1">✏️ Sunting Dokumen (Manual)</span> di bawah ini untuk mengubah isi teks secara leluasa sebelum menekan tombol simpan atau download.
              </p>
            </div>
          </div>

          {/* Export Action Controls */}
          <div className="bg-gradient-to-r from-[#0b0c11] to-[#0c0d16] rounded-2xl border border-zinc-900/95 shadow-xl overflow-hidden p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Left Selector Tab */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <button
                  onClick={() => setActiveViewTab("preview")}
                  className={`py-2 px-3.5 rounded-xl text-[11px] font-mono font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "preview" 
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5" 
                      : "border border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>👁️ Pratinjau Hasil</span>
                </button>
                <button
                  onClick={() => setActiveViewTab("raw")}
                  className={`py-2 px-3.5 rounded-xl text-[11px] font-mono font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "raw" 
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5" 
                      : "border border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>✏️ Sunting Teks</span>
                </button>
                <button
                  onClick={() => setActiveViewTab("split")}
                  className={`py-2 px-3.5 rounded-xl text-[11px] font-mono font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "split" 
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5" 
                      : "border border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Mode Layar Belah</span>
                </button>
              </div>

              {/* Right Action Tools */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={saveToDocumentBank}
                  disabled={isSavedToBank || savingToBank}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full md:w-auto ${
                    isSavedToBank 
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 cursor-default shadow-sm shadow-emerald-500/5" 
                      : "bg-amber-500/10 border-amber-500/20 text-amber-305 hover:border-amber-400 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5 shrink-0 text-amber-450" />
                  <span>{savingToBank ? "Proses..." : isSavedToBank ? "Tersimpan!" : "Simpan Bank"}</span>
                </button>
                {isSavedToBank && savedDocId && (
                  <button
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
                  onClick={copyToClipboard}
                  className="py-2 px-3 bg-[#0c0d12] hover:bg-[#12141c] text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-200 border border-zinc-850 hover:border-zinc-700 cursor-pointer w-full md:w-auto"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-450" />
                      <span>Selesai!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => checkActivationAndRun(handleDownloadWord)}
                  className="py-2 px-3 bg-[#0c0d12] hover:bg-[#12141c] text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-205 border border-zinc-850 hover:border-zinc-700 w-full md:w-auto cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Unduh Word</span>
                </button>
                <button
                  onClick={() => checkActivationAndRun(handlePdfGeneration)}
                  className="py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-205 shadow-md shadow-amber-500/10 active:scale-95 w-full md:w-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>

            </div>
          </div>

          {/* VIEW TAB 1: BEAUTIFUL SIMULATED PRINT VIEW WITH COVER */}
          {activeViewTab === "preview" && (
            <div className="space-y-6">
              
              {/* Cover Page Simulation Card */}
              <div className="bg-[#030305] border border-zinc-800/80 rounded-3xl p-8 max-w-2xl mx-auto min-h-[680px] flex flex-col justify-between shadow-2xl relative select-none">
                
                {/* Gold Frame accent */}
                <div className="absolute inset-4 border border-zinc-900 pointer-events-none rounded-2xl" />
                <div className="absolute inset-5 border border-dashed border-amber-500/10 pointer-events-none rounded-2xl" />

                {/* Top header decoration */}
                <div className="text-center font-mono text-[9px] text-zinc-650 tracking-widest mt-2 uppercase">
                  DOKUMEN INTEGRITAS PENDIDIKAN NASIONAL • RI
                </div>

                <div className="flex flex-col items-center justify-center my-auto py-6 space-y-8">
                  {/* Dynamic Logos Container */}
                  {(isMinistryLogoEnabled || isSchoolLogoEnabled) && (
                    <div className="flex items-center justify-center gap-6 animate-fadeIn">
                      {/* Ministry Logo */}
                      {isMinistryLogoEnabled && (
                        <div className="flex flex-col items-center space-y-1.5">
                          {customMinistryLogo ? (
                            <div className="relative w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 p-2 flex items-center justify-center shadow-xl">
                              <img 
                                src={customMinistryLogo} 
                                alt="Ministry Logo Preview" 
                                referrerPolicy="no-referrer"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shadow-xl ${
                              logoType === "kemenag" 
                                ? "bg-emerald-600/5 border-emerald-500/15 text-emerald-400" 
                                : "bg-blue-600/5 border-blue-500/15 text-blue-400"
                            }`}>
                              <div className="text-center font-bold font-mono text-[8px] leading-tight">
                                <span className="block text-[5px] text-zinc-500">PEMBINA</span>
                                <span className="block font-black text-[8px] uppercase tracking-wider mt-0.5">
                                  {logoType === "kemenag" ? "KEMENAG" : "KEMDIKBUD"}
                                </span>
                                <span className="block text-[8px] text-amber-400">★</span>
                              </div>
                            </div>
                          )}
                          <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Logo Kementerian</span>
                        </div>
                      )}

                      {/* School Logo */}
                      {isSchoolLogoEnabled && (
                        <div className="flex flex-col items-center space-y-1.5">
                          {schoolLogo ? (
                            <div className="relative w-16 h-16 bg-zinc-950 rounded-2xl border border-zinc-800 p-2 flex items-center justify-center shadow-xl">
                              <img 
                                src={schoolLogo} 
                                alt="School Logo Preview" 
                                referrerPolicy="no-referrer"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-[#111116] border border-zinc-900 flex flex-col items-center justify-center text-zinc-650 shadow-xl">
                              <School className="w-5 h-5 text-zinc-500 animate-pulse" />
                              <span className="text-[6px] font-mono block mt-1 uppercase tracking-wider text-zinc-400 font-bold">TEMPLAT</span>
                            </div>
                          )}
                          <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Logo Sekolah</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Curriculums Title */}
                  <div className="text-center space-y-4 px-4 w-full flex flex-col items-center">
                    <div className="space-y-1.5">
                      <h3 className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                        KURIKULUM OPERASIONAL SATUAN PENDIDIKAN (KOSP)
                      </h3>
                      <h4 className="text-amber-500 font-mono text-[11px] font-bold tracking-widest uppercase">
                        KURIKULUM MERDEKA
                      </h4>
                    </div>

                    <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 font-display uppercase tracking-wide px-3 leading-snug mt-2">
                      {namaSekolah}
                    </h1>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 font-mono text-[9px] rounded-full uppercase border border-amber-500/20">
                      Tahun Ajaran 2026/2027
                    </div>
                  </div>
                </div>

                {/* Cover school meta address */}
                <div className="text-center border-t border-zinc-900 pt-5 text-zinc-500 space-y-1">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{namaSekolah}</div>
                  <p className="text-[9px] text-zinc-550 leading-relaxed max-w-sm mx-auto font-sans">
                    Alamat/Lokasi: {lokasi}
                  </p>
                  <p className="text-[8px] text-zinc-600 font-mono mt-3">
                    Provinsi Jawa Timur - Republik Indonesia
                  </p>
                </div>
              </div>

              {/* Grid or Visualizing of supporting images inside draft cover */}
              {supportingImages.length > 0 && (
                <div className="bg-[#030305] border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-xl leading-relaxed">
                  <h4 className="text-xs font-bold font-mono text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-amber-400 rounded-sm" />
                    Lampiran Foto Lapangan ({supportingImages.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {supportingImages.map((img, idx) => (
                      <div key={img.id} className="bg-zinc-950 p-1.5 rounded-xl border border-zinc-850 flex flex-col">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-900">
                          <img 
                            src={img.base64} 
                            alt={img.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2 text-[10px] font-sans text-zinc-400 mt-1.5 leading-relaxed">
                          <span className="text-amber-500 font-mono font-bold text-[9px] uppercase tracking-wider block mb-0.5">Lampiran {idx + 1}</span>
                          {img.caption || "Dokumentasi kegiatan penunjang kurikulum."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main structured chapters */}
              <div className="p-6 md:p-8 bg-[#030305] border border-zinc-900 rounded-3xl antialiased font-sans text-zinc-300 select-text">
                {renderCustomMarkdown(kospMarkup)}
              </div>
            </div>
          )}

          {/* VIEW TAB 2: RAW EDITABLE MARKDOWN TEXT */}
          {activeViewTab === "raw" && (
            <div className="relative animate-fadeIn space-y-2">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  ✏️ EDIT DRAF KOSP KURIKULUM (PENUH)
                </span>
                <span className="text-[9px] font-mono text-zinc-500">
                  Ubah isi teks di bawah, perubahan akan disimpan otomatis saat Anda klik Simpan Bank / Download
                </span>
              </div>
              <textarea
                value={kospMarkup}
                onChange={(e) => setKospMarkup(e.target.value)}
                className="w-full bg-[#030305] border border-zinc-850 rounded-2xl p-6 text-sm font-mono text-zinc-250 outline-none focus:border-amber-400 min-h-[1500px] leading-relaxed resize-y scrollbar-thin"
                placeholder="Sesuaikan atau tambahkan draf KOSP kurikulum di sini..."
              />
              <div className="absolute top-2.5 right-2 text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md py-1 px-2.5">
                Penyunting manual aktif
              </div>
            </div>
          )}

          {/* VIEW TAB 3: SPLIT-SCREEN LIVE EDIT & FORMAT VIEW */}
          {activeViewTab === "split" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              
              {/* Left pane: Markdown Editor */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    ✏️ PENYUNTING TEKS (MARKDOWN)
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Ketik di sini untuk mengubah isi KOSP langsung
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    value={kospMarkup}
                    onChange={(e) => setKospMarkup(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 rounded-2xl p-4 text-xs font-mono text-zinc-200 outline-none focus:border-amber-400 h-[100vh] leading-relaxed resize-y scrollbar-thin sticky top-4"
                    placeholder="Gabungkan atau sesuaikan bab KOSP di sini..."
                  />
                  <div className="absolute top-2 px-2 py-0.5 right-2 text-[8px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25 rounded">
                    Auto-Sync
                  </div>
                </div>
              </div>

              {/* Right pane: Live Preview */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    👁️ PRATINJAU FORMAT (LIVE UPDATE)
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Tampilan dokumen terformat langsung sesuai suntingan
                  </span>
                </div>
                <div className="p-6 bg-[#030305] border border-zinc-900 rounded-3xl min-h-[1500px] overflow-y-visible antialiased font-sans text-zinc-300 select-text">
                  {renderCustomMarkdown(kospMarkup)}
                </div>
              </div>

            </div>
          )}

          {/* Finish Actions bottom back */}
          <div className="flex justify-between items-center py-4 border-t border-zinc-900">
            <span className="text-[10px] text-zinc-554 font-mono">
              Butuh menyesuaikan input? Sila klik Langkah 01/02 di atas.
            </span>
            <button
              onClick={() => {
                setStep(1);
                setKospMarkup("");
                setStatus("idle");
              }}
              className="py-2 px-4 bg-zinc-90 w-auto hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs rounded-xl transition cursor-pointer border border-zinc-850"
            >
              Mulai Ulang Data
            </button>
          </div>
        </div>
      )}

      {/* FOOTER METADATA GUIDE */}
      {step < 4 && (
        <div className="mt-8 pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>KOSP Standard Compliant: T.A. 2026/2027</span>
          </div>
          <div className="text-zinc-650">[SYSTEM_READY_SECURE_GENERATION]</div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-850 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans text-center space-y-4 animate-fade-in text-white">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-rose-500">Konfirmasi Hapus</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                {deleteConfirmMessage}
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteConfirmCallback(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-90 w hover:bg-zinc-900 text-zinc-400 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmCallback) deleteConfirmCallback();
                  setDeleteConfirmId(null);
                  setDeleteConfirmCallback(null);
                }}
                className="px-5 py-2 text-xs font-extrabold uppercase rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition active:scale-95 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
