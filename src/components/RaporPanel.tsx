import React, { useState, useEffect } from "react";
import { 
  FileText, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Printer, Settings, CheckCircle2, AlertCircle, Info, User, Save, Sparkles
} from "lucide-react";
import { getTutWuriHandayaniLogo, getKemenagLogo } from "../utils/logoGenerator";
import { getInitialStudents } from "./StudentProfile";

const COVER_THEMES = [
  { id: "putih", name: "Hitam/Putih Standar", bg: "#ffffff", text: "#111827", border: "#111827", isLight: true, itemBg: "#ffffff" },
  { id: "merah", name: "Merah Elit (SD)", bg: "#440b0b", text: "#fffffc", border: "#ffffff", isLight: false, itemBg: "#7f1d1d" },
  { id: "biru", name: "Biru Navy (SMP)", bg: "#0f1c2e", text: "#ffffff", border: "#ffffff", isLight: false, itemBg: "#1e293b" },
  { id: "hijau", name: "Hijau Emerald", bg: "#062419", text: "#ffffff", border: "#fcd34d", isLight: false, itemBg: "#065f46" },
  { id: "gold", name: "Emas / Gold", bg: "#271206", text: "#fde047", border: "#fde047", isLight: false, itemBg: "#451a03" },
  { id: "cokelat", name: "Cokelat Klasik", bg: "#2c1202", text: "#fff7ed", border: "#ffffff", isLight: false, itemBg: "#431407" }
];

interface SubjectGrade {
  id: number;
  name: string;
  score1: number;
  score2: number;
  score: number;
  materi1: string;
  materi2: string;
}

interface Student {
  id: string;
  namaLengkap: string;
  panggilan: string;
  nisnNis: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  pendidikanSebelum: string;
  alamatSiswa: string;
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  ortuJalan: string;
  ortuKelurahan: string;
  ortuKecamatan: string;
  ortuKabupaten: string;
  ortuProvinsi: string;
  waliNama: string;
  waliPekerjaan: string;
  waliAlamat: string;
  sakit: string;
  izin: string;
  alpa: string;
  ekstraNama: string;
  ekstraKet: string;
  naikKeKelas: string;
  tinggalDiKelas: string;
  catatanGuru: string;
  grades: SubjectGrade[];
  photo?: string;
}

export function RaporPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudentIdx, setActiveStudentIdx] = useState<number>(() => {
    const saved = localStorage.getItem("omega_rapor_selected_student_idx");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [semester, setSemester] = useState<1 | 2>(() => {
    const saved = localStorage.getItem("omega_rapor_selected_semester");
    return saved === "1" ? 1 : 2;
  });
  
  const [tahunPelajaran, setTahunPelajaran] = useState<string>(() => {
    return localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025";
  });

  const [tanggalLaporan, setTanggalLaporan] = useState<string>(() => {
    return localStorage.getItem("kosp_tanggal") || "26 Juni 2025";
  });

  const [activePage, setActivePage] = useState<'all' | 'cover' | 'school' | 'student' | 'nilai1' | 'nilai2' | 'cover_back'>('all');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [coverTheme, setCoverTheme] = useState<string>(() => {
    return localStorage.getItem("omega_rapor_cover_theme") || "putih";
  });

  // Individual School & Teacher states - Editable directly, immune to reboot/laptop shutdown
  const [namaSekolah, setNamaSekolah] = useState(() => localStorage.getItem("kosp_nama_sekolah") || "SEKOLAH DASAR NEGERI FATUBAI");
  const [npsn, setNpsn] = useState(() => localStorage.getItem("kosp_npsn") || "50300960");
  const [alamat, setAlamat] = useState(() => localStorage.getItem("kosp_lokasi") || localStorage.getItem("kosp_alamat_sekolah") || "Fatubai");
  const [kelurahan, setKelurahan] = useState(() => localStorage.getItem("kosp_kelurahan") || "Oehalo");
  const [kecamatan, setKecamatan] = useState(() => localStorage.getItem("kosp_kecamatan") || "Insana Tengah");
  const [kabupaten, setKabupaten] = useState(() => localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara");
  const [provinsi, setProvinsi] = useState(() => localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur");
  const [email, setEmail] = useState(() => localStorage.getItem("kosp_email") || "sdnfatubai@gmail.com");
  const [website, setWebsite] = useState(() => localStorage.getItem("kosp_website") || "https://sdn-fatubai-official.netlify.app/");
  const [telp, setTelp] = useState(() => localStorage.getItem("kosp_telp") || "082236015517");
  const [kodepos, setKodepos] = useState(() => localStorage.getItem("kosp_kode_pos") || localStorage.getItem("kosp_kodepos") || "85673");
  const [tempatLaporan, setTempatLaporan] = useState(() => localStorage.getItem("kosp_tempat") || "Fatubai");
  const [kepalaSekolah, setKepalaSekolah] = useState(() => localStorage.getItem("kosp_kepala_sekolah") || localStorage.getItem("omega_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.");
  const [nipKepala, setNipKepala] = useState(() => localStorage.getItem("kosp_nip_kepala") || localStorage.getItem("omega_nip_kepala") || "196709192008011008");
  const [namaGuru, setNamaGuru] = useState(() => localStorage.getItem("kosp_nama_guru") || localStorage.getItem("omega_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.");
  const [nipGuru, setNipGuru] = useState(() => localStorage.getItem("kosp_nip_guru") || localStorage.getItem("omega_nip_guru") || "198603012020121005");
  const [faseKelas, setFaseKelas] = useState(() => localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B");


  // Character criteria state synchronized dynamically
  const [criteria, setCriteria] = useState(() => {
    const raw = localStorage.getItem("omega_character_criteria");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          religius: parsed.religius || { name: "Religiusitas", short: "RELIGIUS", desc: "Beriman, bertaqwa kepada Tuhan YME, dan berakhlak mulia harian." },
          jujur: parsed.jujur || { name: "Kejujuran", short: "JUJUR", desc: "Integritas diri, menjunjung nilai kebenaran dalam perkataan & perbuatan." },
          disiplin: parsed.disiplin || { name: "Kedisiplinan", short: "DISIPLIN", desc: "Kepatuhan tata tertib sekolah, ketepatan waktu, dan kemandirian." },
          peduli: parsed.peduli || { name: "Sikap Kepedulian", short: "PEDULI", desc: "Kepekaan sosial tinggi terhadap sesama teman dan guru." },
          gotongRoyong: parsed.gotongRoyong || { name: "Gotong Royong", short: "G. ROYONG", desc: "Kemampuan kolaborasi, kerja sama tim, dan kepatuhan mufakat." }
        };
      } catch (e) {
        console.error("Gagal memuat kriteria kustom di RaporPanel:", e);
      }
    }
    return {
      religius: { name: "Religiusitas", short: "RELIGIUS", desc: "Beriman, bertaqwa kepada Tuhan YME, dan berakhlak mulia harian." },
      jujur: { name: "Kejujuran", short: "JUJUR", desc: "Integritas diri, menjunjung nilai kebenaran dalam perkataan & perbuatan." },
      disiplin: { name: "Kedisiplinan", short: "DISIPLIN", desc: "Kepatuhan tata tertib sekolah, ketepatan waktu, dan kemandirian." },
      peduli: { name: "Sikap Kepedulian", short: "PEDULI", desc: "Kepekaan sosial tinggi terhadap sesama teman dan guru." },
      gotongRoyong: { name: "Gotong Royong", short: "G. ROYONG", desc: "Kemampuan kolaborasi, kerja sama tim, dan kepatuhan mufakat." }
    };
  });

  useEffect(() => {
    const handleCriteriaUpdate = () => {
      const raw = localStorage.getItem("omega_character_criteria");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCriteria({
            religius: parsed.religius || { name: "Religiusitas", short: "RELIGIUS", desc: "Beriman, bertaqwa kepada Tuhan YME, dan berakhlak mulia harian." },
            jujur: parsed.jujur || { name: "Kejujuran", short: "JUJUR", desc: "Integritas diri, menjunjung nilai kebenaran dalam perkataan & perbuatan." },
            disiplin: parsed.disiplin || { name: "Kedisiplinan", short: "DISIPLIN", desc: "Kepatuhan tata tertib sekolah, ketepatan waktu, dan kemandirian." },
            peduli: parsed.peduli || { name: "Sikap Kepedulian", short: "PEDULI", desc: "Kepekaan sosial tinggi terhadap sesama teman dan guru." },
            gotongRoyong: parsed.gotongRoyong || { name: "Gotong Royong", short: "G. ROYONG", desc: "Kemampuan kolaborasi, kerja sama tim, dan kepatuhan mufakat." }
          });
        } catch (e) {}
      }
    };
    window.addEventListener("omega-character-criteria-updated", handleCriteriaUpdate);
    return () => window.removeEventListener("omega-character-criteria-updated", handleCriteriaUpdate);
  }, []);

  // Keep identical schoolProfile layout for downstream references
  const schoolProfile = {
    namaSekolah,
    npsn,
    alamat,
    kelurahan,
    kecamatan,
    kabupaten,
    provinsi,
    email,
    website,
    telp,
    kodepos,
    tempatLaporan,
    kepalaSekolah,
    nipKepala,
    namaGuru,
    nipGuru,
    faseKelas
  };

  // Sync school profile state on dynamic events
  useEffect(() => {
    const handleSchoolProfileUpdated = () => {
      setNamaSekolah(localStorage.getItem("kosp_nama_sekolah") || "SEKOLAH DASAR NEGERI FATUBAI");
      setNpsn(localStorage.getItem("kosp_npsn") || "50300960");
      setAlamat(localStorage.getItem("kosp_lokasi") || localStorage.getItem("kosp_alamat_sekolah") || "Fatubai");
      setKelurahan(localStorage.getItem("kosp_kelurahan") || "Oehalo");
      setKecamatan(localStorage.getItem("kosp_kecamatan") || "Insana Tengah");
      setKabupaten(localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara");
      setProvinsi(localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur");
      setEmail(localStorage.getItem("kosp_email") || "sdnfatubai@gmail.com");
      setWebsite(localStorage.getItem("kosp_website") || "https://sdn-fatubai-official.netlify.app/");
      setTelp(localStorage.getItem("kosp_telp") || "082236015517");
      setKodepos(localStorage.getItem("kosp_kode_pos") || localStorage.getItem("kosp_kodepos") || "85673");
      setTempatLaporan(localStorage.getItem("kosp_tempat") || "Fatubai");
      setKepalaSekolah(localStorage.getItem("kosp_kepala_sekolah") || localStorage.getItem("omega_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.");
      setNipKepala(localStorage.getItem("kosp_nip_kepala") || localStorage.getItem("omega_nip_kepala") || "196709192008011008");
      setNamaGuru(localStorage.getItem("kosp_nama_guru") || localStorage.getItem("omega_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.");
      setNipGuru(localStorage.getItem("kosp_nip_guru") || localStorage.getItem("omega_nip_guru") || "198603012020121005");
      setFaseKelas(localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B");
    };

    window.addEventListener("omega-school-profile-updated", handleSchoolProfileUpdated);
    window.addEventListener("omega-state-updated", handleSchoolProfileUpdated);
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleSchoolProfileUpdated);
      window.removeEventListener("omega-state-updated", handleSchoolProfileUpdated);
    };
  }, []);

  const updateMetadataField = (key: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(value);
    localStorage.setItem(key, value);
    
    // Write mirror keys for security, integration & compatibility
    if (key === "kosp_nama_sekolah") localStorage.setItem("omega_school_name", value);
    if (key === "kosp_fase_kelas") localStorage.setItem("omega_school_class", value);
    if (key === "omega_nama_guru") localStorage.setItem("kosp_nama_guru", value);
    if (key === "omega_nip_guru") localStorage.setItem("kosp_nip_guru", value);
    if (key === "omega_kepala_sekolah") localStorage.setItem("kosp_kepala_sekolah", value);
    if (key === "omega_nip_kepala") localStorage.setItem("kosp_nip_kepala", value);
    if (key === "kosp_lokasi" || key === "kosp_alamat_sekolah") {
      localStorage.setItem("kosp_lokasi", value);
      localStorage.setItem("kosp_alamat_sekolah", value);
    }
    
    window.dispatchEvent(new Event("omega-school-profile-updated"));
    window.dispatchEvent(new Event("omega-state-updated"));
  };

  const isNilaiRaporUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("nilai_rapor");
    } catch {
      return true;
    }
  })();

  const handleUpdateStudentField = (field: keyof Student, value: string) => {
    if (!isNilaiRaporUnlocked) {
      alert("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    const updatedStudents = students.map((s, idx) => {
      if (idx === activeStudentIdx) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setStudents(updatedStudents);
    localStorage.setItem("omega_students_list", JSON.stringify(updatedStudents));
    window.dispatchEvent(new Event("omega-state-updated"));
  };

  // Load students on mount
  useEffect(() => {
    const loadStudents = () => {
      let saved = localStorage.getItem("omega_students_list");
      if (!saved) {
        const initial = getInitialStudents();
        localStorage.setItem("omega_students_list", JSON.stringify(initial));
        saved = JSON.stringify(initial);
      }
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
          
          // CRITICAL BUG FIX & USER INTENT INTEGRATION: 
          // Automatically focus on the globally selected student from Student Profile tab!
          const globalActiveId = localStorage.getItem("omega_active_student_id");
          if (globalActiveId) {
            const foundIdx = parsed.findIndex((s: any) => s.id === globalActiveId);
            if (foundIdx > -1) {
              setActiveStudentIdx(foundIdx);
              localStorage.setItem("omega_rapor_selected_student_idx", foundIdx.toString());
            }
          }
        }
      } catch (e) {
        console.error("Format list murid salah:", e);
      }
    };
    loadStudents();
    window.addEventListener("omega-state-updated", loadStudents);
    window.addEventListener("omega-student-profile-updated", loadStudents);
    return () => {
      window.removeEventListener("omega-state-updated", loadStudents);
      window.removeEventListener("omega-student-profile-updated", loadStudents);
    };
  }, []);

  // Save selected configs
  useEffect(() => {
    localStorage.setItem("omega_rapor_selected_semester", semester.toString());
  }, [semester]);

  if (students.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-12 text-center rounded-3xl mt-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Belum Ada Data Siswa</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          Silakan lengkapi terlebih dahulu biodata nama-nama siswa di menu <b>Profil Murid & Karakter</b> agar dapat merumuskan rapor secara otomatis.
        </p>
      </div>
    );
  }

  const activeStudent = students[activeStudentIdx] || students[0];

  const getActiveStudentCharacter = () => {
    try {
      const savedCharacterRaw = localStorage.getItem("omega_character_students");
      if (savedCharacterRaw && activeStudent) {
        const parsed = JSON.parse(savedCharacterRaw);
        if (Array.isArray(parsed)) {
          return parsed.find(
            (item: any) => 
              item.name && 
              item.name.trim().toLowerCase() === activeStudent.namaLengkap.trim().toLowerCase()
          );
        }
      }
    } catch (e) {
      console.error("Gagal memuat data karakter siswa:", e);
    }
    return null;
  };

  const getCharacterNarrative = (charData: any) => {
    if (!charData) return "";
    
    const translateLabel = (val: string) => {
      if (val === "SB") return "Sangat Berkembang";
      if (val === "BSH") return "Berkembang Sesuai Harapan";
      if (val === "MB") return "Mulai Berkembang";
      return "Belum Berkembang";
    };

    const dimensions = [
      { name: criteria.religius.name, val: charData.religius },
      { name: criteria.jujur.name, val: charData.jujur },
      { name: criteria.disiplin.name, val: charData.disiplin },
      { name: criteria.peduli.name, val: charData.peduli },
      { name: criteria.gotongRoyong.name, val: charData.gotongRoyong }
    ];

    const sbList = dimensions.filter(d => d.val === "SB").map(d => d.name);
    const bshList = dimensions.filter(d => d.val === "BSH").map(d => d.name);
    const mbList = dimensions.filter(d => d.val === "MB" || d.val === "BB").map(d => d.name);

    let parts: string[] = [];
    if (sbList.length > 0) {
      parts.push(`sangat berkembang pada pilar ${sbList.join(", ")}`);
    }
    if (bshList.length > 0) {
      parts.push(`berkembang sesuai harapan pada dimensi ${bshList.join(", ")}`);
    }
    if (mbList.length > 0) {
      parts.push(`serta mulai menunjukkan perkembangan yang baik pada sikap ${mbList.join(", ")}`);
    }

    if (parts.length === 0) return "Menunjukkan pembiasaan karakter yang baik dan santun selama proses bimbingan kelas.";

    let sentence = "Siswa " + parts.join(", ") + ".";
    
    if (charData.catatanKarakter && charData.catatanKarakter !== "Menunjukkan pembiasaan karakter yang baik dan santun selama proses bimbingan kelas.") {
      sentence += ` Catatan perkembangan khusus: ${charData.catatanKarakter}`;
    }
    
    return sentence;
  };

  const getParentSignatureName = () => {
    if (!activeStudent) return "Orang Tua / Wali";
    const ayah = activeStudent.namaAyah ? activeStudent.namaAyah.trim() : "";
    const ibu = activeStudent.namaIbu ? activeStudent.namaIbu.trim() : "";
    const wali = activeStudent.waliNama ? activeStudent.waliNama.trim() : "";
    
    if (ayah && ayah !== "" && ayah !== "-") return ayah;
    if (ibu && ibu !== "" && ibu !== "-") return ibu;
    if (wali && wali !== "" && wali !== "-") return wali;
    return "Orang Tua / Wali";
  };

  const handlePrevStudent = () => {
    setActiveStudentIdx((prev) => {
      const nextIdx = prev > 0 ? prev - 1 : students.length - 1;
      localStorage.setItem("omega_rapor_selected_student_idx", nextIdx.toString());
      const selectedStudent = students[nextIdx];
      if (selectedStudent) {
        localStorage.setItem("omega_active_student_id", selectedStudent.id);
        window.dispatchEvent(new CustomEvent("omega-student-profile-updated"));
      }
      return nextIdx;
    });
  };

  const handleNextStudent = () => {
    setActiveStudentIdx((prev) => {
      const nextIdx = prev < students.length - 1 ? prev + 1 : 0;
      localStorage.setItem("omega_rapor_selected_student_idx", nextIdx.toString());
      const selectedStudent = students[nextIdx];
      if (selectedStudent) {
        localStorage.setItem("omega_active_student_id", selectedStudent.id);
        window.dispatchEvent(new CustomEvent("omega-student-profile-updated"));
      }
      return nextIdx;
    });
  };

  // Resolve KOSP class config & active subjects
  const getActiveGradeNum = () => {
    const raw = schoolProfile.faseKelas || "";
    if (raw.includes("VI") || raw.includes("6")) return 6;
    if (raw.includes("V") || raw.includes("5")) return 5;
    if (raw.includes("IV") || raw.includes("4")) return 4;
    if (raw.includes("III") || raw.includes("3")) return 3;
    if (raw.includes("II") || raw.includes("2")) return 2;
    if (raw.includes("I") || raw.includes("1")) return 1;
    return 4;
  };

  const getDaftarNilaiMapelName = (key: string) => {
    // 1. Check custom subjects from profile first
    const customSubRaw = localStorage.getItem("profile_custom_subjects") || localStorage.getItem("kosp_custom_subjects");
    if (customSubRaw) {
      try {
        const parsed = JSON.parse(customSubRaw);
        if (Array.isArray(parsed)) {
          const match = parsed.find(p => p.id === key);
          if (match) return match.label || match.name;
        } else {
          if (parsed[key]) return parsed[key].label || parsed[key].name;
        }
      } catch(e) {}
    }

    // 2. Standard map keys matching DaftarNilai.tsx EXACTLY
    const standardMap: Record<string, string> = {
      agamaIslam: "Pendidikan Agama Islam",
      agamaKristen: "Pendidikan Agama Kristen",
      agamaKatolik: "Pendidikan Agama Katolik",
      agamaHindu: "Pendidikan Agama Hindu",
      agamaBudha: "Pendidikan Agama Buddha",
      agamaKonghucu: "Pendidikan Agama Khonghucu",
      pancasila: "Pendidikan Pancasila",
      indonesia: "Bahasa Indonesia",
      matematika: "Matematika",
      ipas: "IPAS (Sains & Sosial)",
      ipa: "IPA",
      ips: "IPS",
      inggris: "Bahasa Inggris",
      pjok: "PJOK (Olahraga)",
      seniMusik: "Seni Musik",
      seniRupa: "Seni Rupa",
      seniTari: "Seni Tari",
      seniTeater: "Seni Teater",
      informatika: "Informatika",
      prakarya: "Prakarya / Keterampilan",
      sejarah: "Sejarah",
      pkwu: "Prakarya dan Kewirausahaan (PKWU)",
      pilihanFisika: "Fisika",
      pilihanKimia: "Kimia",
      pilihanBiologi: "Biologi",
      pilihanEkonomi: "Ekonomi",
      pilihanSosiologi: "Sosiologi",
      pilihanGeografi: "Geografi",
      kejuruanProduktif: "Kelompok Kejuruan",
      mulok: "Muatan Lokal"
    };

    return standardMap[key] || key;
  };

  const getTugasStatsHelper = (tugas: any) => {
    let sum = 0;
    let count = 0;
    const keys = ["tugas1", "tugas2", "tugas3", "tugas4"];
    if (tugas) {
      keys.forEach(k => {
        const v = tugas[k];
        if (v !== undefined && v !== "" && v !== null) {
          const num = Number(v);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      });
    }
    return {
      avg: count > 0 ? (sum / count) : 0,
      count
    };
  };

  const getTemaStatsHelper = (sumatifTopik: any) => {
    let sum = 0;
    let count = 0;
    const keys = ["tema1", "tema2", "tema3"];
    if (sumatifTopik) {
      keys.forEach(k => {
        const v = sumatifTopik[k];
        if (v !== undefined && v !== "" && v !== null) {
          const num = Number(v);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      });
    }
    return {
      avg: count > 0 ? (sum / count) : 0,
      count
    };
  };

  const formatCompetencyText = (prefix: string, material: string) => {
    if (!material) return prefix + ".";
    const cleanMat = material.trim();
    if (cleanMat.length === 0) return prefix + ".";
    
    let firstChar = cleanMat.charAt(0).toLowerCase();
    let rest = cleanMat.slice(1);
    
    // Honor capital proper nouns in Indonesian grammar
    const properNouns = ["Yesus", "Alkitab", "Kristen", "Katolik", "Islam", "Hindu", "Buddha", "Khonghucu", "Quran", "Nabi", "Allah", "Tuhan", "Pancasila", "Nusantara", "Indonesia", "NTT", "IPAS", "PJOK"];
    const firstWord = cleanMat.split(/[\s,]+/)[0];
    if (properNouns.some(noun => firstWord === noun)) {
      firstChar = cleanMat.charAt(0);
    }
    
    let text = `${prefix} dalam hal ${firstChar}${rest}`;
    if (!text.endsWith(".")) {
      text += ".";
    }
    return text;
  };

  const getKospSelectedSubjectsForRapor = () => {
    let activeKeys: string[] = [];
    try {
      const activeRaw = localStorage.getItem("profile_active_subjects");
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeKeys = parsed;
        }
      }
    } catch (e) {
      console.error("Gagal memuat profile_active_subjects:", e);
    }

    if (activeKeys.length === 0) {
      activeKeys = ["agamaKatolik", "pancasila", "indonesia", "matematika", "ipas", "seniRupa", "pjok", "inggris"];
    }

    // Filter religion based on active student's specific religion
    const studentReligion = (activeStudent.agama || "Katolik").toLowerCase();
    let finalKeys = activeKeys.filter(key => {
      if (key.startsWith("agama") || key.toLowerCase().includes("religion") || key.toLowerCase().includes("agama")) {
        if (key === "agamaIslam" && studentReligion.includes("islam")) return true;
        if (key === "agamaKristen" && (studentReligion.includes("kristen") || studentReligion.includes("protestan"))) return true;
        if (key === "agamaKatolik" && studentReligion.includes("katolik")) return true;
        if (key === "agamaHindu" && studentReligion.includes("hindu")) return true;
        if (key === "agamaBudha" && studentReligion.includes("budha")) return true;
        if (key === "agamaKonghucu" && studentReligion.includes("konghucu")) return true;
        return false;
      }
      return true;
    });

    // Support auto fallback mapping
    const hasReligionSubject = finalKeys.some(key => key.startsWith("agama") || key.toLowerCase().includes("religion") || key.toLowerCase().includes("agama"));
    if (!hasReligionSubject) {
      if (studentReligion.includes("islam")) finalKeys.unshift("agamaIslam");
      else if (studentReligion.includes("kristen") || studentReligion.includes("protestan")) finalKeys.unshift("agamaKristen");
      else finalKeys.unshift("agamaKatolik");
    }

    return finalKeys;
  };

  const getKospSelectedExtras = () => {
    let activeExtras: string[] = [];
    try {
      const saved = localStorage.getItem("profile_active_extras");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeExtras = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (activeExtras.length === 0) {
      activeExtras = ["pramuka", "olahraga", "seniTari"];
    }
    return activeExtras;
  };

  const getSubjectRaporInfo = (key: string) => {
    const KOSP_SUBJECT_MAPPING: Record<string, { name: string; fallbackMateri1: string; fallbackMateri2: string }> = {
      agamaIslam: {
        name: "Pendidikan Agama Islam dan Budi Pekerti",
        fallbackMateri1: "memahami tata cara bersuci, rukun Islam, dan rukun Iman secara tepat",
        fallbackMateri2: "meneladani kisah keteladanan para Nabi terkemuka dalam ibadah sehari-hari"
      },
      agamaKristen: {
        name: "Pendidikan Agama Kristen dan Budi Pekerti",
        fallbackMateri1: "memahami kehadiran Allah dalam alam semesta dan perlindungan-Nya secara tepat",
        fallbackMateri2: "menerapkan perilaku bersyukur dan toleransi antar-umat beragama"
      },
      agamaKatolik: {
        name: "Pendidikan Agama Katolik dan Budi Pekerti",
        fallbackMateri1: "memahami Yesus mewartakan Kerajaan Allah melalui sabda dan perbuatan nyata",
        fallbackMateri2: "meneladani para rasul dan tokoh kudus Alkitab dalam mewujudkan sukacita iman"
      },
      pancasila: {
        name: "Pendidikan Pancasila",
        fallbackMateri1: "mengidentifikasi makna simbol sila Pancasila serta melafalkan bunyinya secara fasih",
        fallbackMateri2: "mematuhi kesepakatan tata tertib sekolah serta norma kehidupan bermasyarakat"
      },
      indonesia: {
        name: "Bahasa Indonesia",
        fallbackMateri1: "menentukan ide pokok pikiran teks naratif fiksi maupun non-fiksi",
        fallbackMateri2: "menulis deskripsi rincian peristiwa sekitar secara naratif beruntun"
      },
      matematika: {
        name: "Matematika",
        fallbackMateri1: "membandingkan atau menyederhanakan pecahan senilai bersayarat pembilang prima",
        fallbackMateri2: "melakukan hitung pembagian atau perkalian bilangan cacah sampai dengan 100"
      },
      ipas: {
        name: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
        fallbackMateri1: "mengidentifikasi peredaran fotosintesis serta fungsi organ vital tumbuhan hijau",
        fallbackMateri2: "menganalisis fase siklus hidrologi air bumi dan imbas ekologis kelestariannya"
      },
      seniMusik: {
        name: "Seni Musik",
        fallbackMateri1: "menyanyikan ragam melodi daerah atau Nusantara sesuai birama ketukan stabil",
        fallbackMateri2: "mengidentifikasi jenis alat musik petik tiup perkusi tradisional nusantara"
      },
      seniTari: {
        name: "Seni Tari",
        fallbackMateri1: "mempraktikkan gerak improvisasi tari kreasi bertema flora fauna nusantara",
        fallbackMateri2: "menyusun pola lintasan garis lurus melengkung pada tarian kelompok kolosal"
      },
      seniRupa: {
        name: "Seni Rupa",
        fallbackMateri1: "memahami rona warna primer komplementer untuk lukisan rupa dekoratif",
        fallbackMateri2: "membuat anyaman atau origami dwimatra berpola simetris keseimbangan rupa"
      },
      kka: {
        name: "KKA / Prakarya / Keterampilan",
        fallbackMateri1: "merancang bangun mainan miniatur tradisional berbahan bambu/kayu sisa",
        fallbackMateri2: "membuat anyaman rotan fungsional bernilai jual dari bahan daur ulang organik"
      },
      pjok: {
        name: "Pendidikan Jasmani, Olahraga dan Kesehatan",
        fallbackMateri1: "memperagakan variasi dan kombinasi gerak dasar lokomotor lari loncat terencana",
        fallbackMateri2: "memahami asupan asasi gizi seimbang harian pendukung vitalitas jasmani sehat"
      },
      inggris: {
        name: "Bahasa Inggris",
        fallbackMateri1: "menggunakan kosakata dasar perkenalan identitas pribadi lisan bersahabat",
        fallbackMateri2: "mengucapkan nama-nama hari dan bulan serta angka ordinal 1-10"
      }
    };

    if (KOSP_SUBJECT_MAPPING[key]) return KOSP_SUBJECT_MAPPING[key];
    const prov = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";
    const kab = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";
    const displayName = getDaftarNilaiMapelName(key);
    return {
      name: displayName,
      fallbackMateri1: `memahami lingkup tradisi kearifan lokal seni, budaya, sejarah, dan nilai luhur sastra ${displayName} di daerah ${kab}, ${prov}`,
      fallbackMateri2: `mempelajari pembiasaan karakter adat istiadat dan melestarikan budaya lokal ${kab} dalam kebhinnekaan`
    };
  };

  const getSubjectAtpMapping = (key: string) => {
    switch (key) {
      case "matematika":
        return {
          materi1: "Membandingkan, mengurutkan, mengomposisi, dan mendekomposisi bilangan cacah hingga 1.000.000.",
          materi2: "Membaca, menulis, and menentukan nilai tempat bilangan cacah hingga 1.000.000."
        };
      case "indonesia":
        return {
          materi1: "Menganalisis isi dan unsur-unsur intrinsik dari teks sastra berbentuk aural.",
          materi2: "Menganalisis informasi dari teks nonsastra berbentuk aural yang dibacakan/didengarkan."
        };
      case "ipas":
        return {
          materi1: "Mengidentifikasi bagian tubuh tumbuhan dan mendeskripsikan fungsinya.",
          materi2: "Mendeskripsikan proses fotosintesis dan mengaitkan pentingnya proses ini bagi makhluk hidup."
        };
      case "pancasila":
        return {
          materi1: "Menunjukkan sikap dan perilaku akhlak mulia dalam kehidupan sehari-hari.",
          materi2: "Menjelaskan arti penting keimanan kepada Tuhan Yang Maha Esa."
        };
      case "inggris":
        return {
          materi1: "Memahami alur informasi teks lisan atau multimodal sederhana.",
          materi2: "Menggunakan kosakata dasar dan struktur kalimat sederhana terkait topik harian."
        };
      case "pjok":
        return {
          materi1: "Menjelaskan dan mempraktikkan variasi dan kombinasi gerakan pola gerak dasar lokomotor.",
          materi2: "Menjelaskan dan mempraktikkan variasi dan kombinasi pola gerak dasar nonlokomotor."
        };
      case "seniRupa":
        return {
          materi1: "Memahami rona warna primer komplementer untuk rupa dekoratif.",
          materi2: "Menerapkan prinsip proporsi dan keseimbangan seni rupa dasar."
        };
      case "seniMusik":
        return {
          materi1: "Mengenali nada diatonis dan menyanyikan berirama selaras stabil.",
          materi2: "Mengenali kearifan lokal alat musik bernada tradisional nusantara."
        };
      case "seniTari":
        return {
          materi1: "Mempraktikkan gerak improvisasi tari daerah kreasi selaras.",
          materi2: "Memahami pola lantai vertikal, horisontal, dan melingkar tari berkelompok."
        };
      default:
        const subInfo = getSubjectRaporInfo(key);
        return {
          materi1: subInfo.fallbackMateri1 || "Menunjukkan penguasaan yang mumpuni terhadap pokok capaian materi penugasan dasar.",
          materi2: subInfo.fallbackMateri2 || "Mengaplikasikan kaidah teoretis pengerjaan materi pokok bahasan mandiri lanjutan."
        };
    }
  };

  // PULL REAL GRADES DYNAMICALLY
  const fetchRealGradeFromDaftarNilai = (subjectKey: string, studentName: string) => {
    const mapelId = getDaftarNilaiMapelName(subjectKey);
    if (!mapelId) return null;

    const rawData = localStorage.getItem(`omega_daftar_nilai_students_${mapelId}`);
    if (rawData) {
      try {
        const list = JSON.parse(rawData);
        if (Array.isArray(list)) {
          const match = list.find((s: any) => s && s.name && s.name.trim().toLowerCase() === studentName.trim().toLowerCase());
          if (match) {
            const semKey = semester === 1 ? "sem1" : "sem2";
            const semData = match[semKey];
            if (semData) {
              const tugasStats = getTugasStatsHelper(semData.tugas);
              const temaStats = getTemaStatsHelper(semData.sumatifTopik);

              const avgTugas = tugasStats.avg;
              const avgSum = temaStats.avg;

              const stsVal = semData.sts !== undefined && semData.sts !== "" ? Number(semData.sts) : 0;
              const sasVal = semData.sas !== undefined && semData.sas !== "" ? Number(semData.sas) : 0;

              // Kurikulum Merdeka weights: tugas 30%, sumatif 30%, sts 20%, sas 20%
              const wTugas = 30, wSumatif = 30, wSts = 20, wSas = 20;
              const totalW = wTugas + wSumatif + wSts + wSas;
              const finalScore = totalW > 0 ? (
                (avgTugas * wTugas) + 
                (avgSum * wSumatif) + 
                (stsVal * wSts) + 
                (sasVal * wSas)
              ) / totalW : 0;

              const isTaskEmpty = Object.values(semData.tugas || {}).every(v => v === "" || v === undefined || v === null);
              const isTemaEmpty = Object.values(semData.sumatifTopik || {}).every(v => v === "" || v === undefined || v === null);
              const isStsEmpty = semData.sts === "" || semData.sts === undefined || semData.sts === null;
              const isSasEmpty = semData.sas === "" || semData.sas === undefined || semData.sas === null;

              if (isTaskEmpty && isTemaEmpty && isStsEmpty && isSasEmpty) {
                return {
                  score1: 0,
                  score2: 0,
                  score: 0,
                  isEmpty: true
                };
              }

              return {
                score1: Math.round(avgTugas) || 75,
                score2: Math.round(avgSum) || 78,
                score: Math.round(finalScore) || 76,
                isEmpty: false
              };
            }
          }
        }
      } catch (e) {
        console.error("Error parsing grades from DaftarNilai", e);
      }
    }
    return null;
  };

  // FETCH REAL ATTENDANCE TOTALS
  const getRealAttendanceTotals = (studentName: string) => {
    const raw = localStorage.getItem("omega_attendance_students");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const student = parsed.find(s => s && s.name && s.name.trim().toLowerCase() === studentName.trim().toLowerCase());
          if (student && student.records) {
            let sakit = 0;
            let izin = 0;
            let alpa = 0;
            Object.values(student.records).forEach((val) => {
              if (val === "S") sakit++;
              if (val === "I") izin++;
              if (val === "A") alpa++;
            });
            return { sakit, izin, alpa };
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const getExtraInfoForKey = (key: string) => {
    let label = "";
    if (key === "pramuka") label = "Karakter Pramuka (Wajib)";
    else if (key === "olahraga") label = "Olahraga (Futsal, Atletik)";
    else if (key === "seniTari") label = "Seni Tari Kreasi";
    else {
      label = key.startsWith("custom_extra_") ? key.replace("custom_extra_", "").toUpperCase() : key;
    }
    let value = "";
    if (key === "pramuka") {
      value = `Sangat aktif dalam latihan kepramukaan, menunjukkan kedisiplinan tingkat tinggi, jiwa kepemimpinan Pancasila, dan kepedulian sosial yang membanggakan.`;
    } else if (key === "olahraga") {
      value = `Menunjukkan stamina prima, sportivitas tinggi, serta kerja sama tim yang solid dalam setiap latihan ketangkasan fisik.`;
    } else if (key === "seniTari") {
      value = `Menunjukkan keluwesan gerak tari kreasi daerah NTT dan antusiasme tinggi dalam melestarikan ragam tari Nusantara.`;
    } else {
      value = `Menunjukkan keaktifan berpartisipasi dan menyelesaikan setiap agenda program kegiatan terarah dengan penuh kedisiplinan.`;
    }
    return { name: label, value };
  };

  const handlePrintCoverOnly = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Mohon izinkan pop-up (Pop-up Blocker) di browser Anda untuk mencetak atau mengunduh PDF secara langsung.");
      return;
    }

    const cleanFileName = `COVER RAPOR - ${activeStudent.namaLengkap}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>\${cleanFileName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono&display=swap');
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: ${currentTheme.bg};
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .wrapper-cover {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0;
            }
             .rapor-page-cover {
              position: relative;
              background: ${currentTheme.bg} !important;
              background-color: ${currentTheme.bg} !important;
              color: ${currentTheme.text} !important;
              border: 12px double ${currentTheme.border} !important;
              box-sizing: border-box !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              padding: 1.5cm 1.2cm !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              align-items: center !important;
              text-align: center !important;
              page-break-after: always !important;
              overflow: hidden !important;
            }
            .rapor-page-cover:last-child {
              page-break-after: avoid !important;
            }
            /* Absolute borders inside */
            .border-double-amber {
              position: absolute;
              top: 10mm;
              bottom: 10mm;
              left: 10mm;
              right: 10mm;
              border: 6px double ${currentTheme.border} !important;
              pointer-events: none;
            }
            .border-single-amber {
              position: absolute;
              top: 13mm;
              bottom: 13mm;
              left: 13mm;
              right: 13mm;
              border: 1px solid rgba(0,0,0,0.08) !important;
              pointer-events: none;
            }
            /* Bracket corners */
            .corner-tl { position: absolute; top: 15mm; left: 15mm; width: 20px; height: 20px; border-top: 2px solid ${currentTheme.border}; border-left: 2px solid ${currentTheme.border}; }
            .corner-tr { position: absolute; top: 15mm; right: 15mm; width: 20px; height: 20px; border-top: 2px solid ${currentTheme.border}; border-right: 2px solid ${currentTheme.border}; }
            .corner-bl { position: absolute; bottom: 15mm; left: 15mm; width: 20px; height: 20px; border-bottom: 2px solid ${currentTheme.border}; border-left: 2px solid ${currentTheme.border}; }
            .corner-br { position: absolute; bottom: 15mm; right: 15mm; width: 20px; height: 20px; border-bottom: 2px solid ${currentTheme.border}; border-right: 2px solid ${currentTheme.border}; }
            
            .font-sans { font-family: 'Inter', sans-serif !important; }
            .font-serif { font-family: Garamond, 'Times New Roman', serif !important; }
            
            .title-rapor {
              font-size: 38px !important;
              font-weight: 900 !important;
              letter-spacing: 0.25em !important;
              color: ${currentTheme.isLight ? '#111827' : '#ffffff'} !important;
              margin: 0 0 10px 0 !important;
              text-transform: uppercase !important;
            }
            .subtitle-rapor {
              font-size: 20px !important;
              font-weight: 800 !important;
              letter-spacing: 0.2em !important;
              color: ${currentTheme.isLight ? '#1f2937' : '#f1f5f9'} !important;
              margin: 0 0 15px 0 !important;
              text-transform: uppercase !important;
            }
             .jenjang-rapor {
              font-size: 16px !important;
              font-weight: bold !important;
              letter-spacing: 0.15em !important;
              color: ${currentTheme.isLight ? '#4b5563' : '#cbd5e1'} !important;
              margin: 0 !important;
              text-transform: uppercase !important;
            }
            
            .student-box {
              width: 100% !important;
              max-width: 450px !important;
              margin: auto 0 !important;
            }
            .student-label {
              font-size: 12px !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              color: ${currentTheme.isLight ? '#4b5563' : '#cbd5e1'} !important;
              margin-bottom: 6px !important;
            }
            .student-value {
              border: 2px solid ${currentTheme.border} !important;
              background-color: ${currentTheme.isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'} !important;
              padding: 12px !important;
              font-size: 18px !important;
              font-weight: 900 !important;
              letter-spacing: 0.08em !important;
              color: ${currentTheme.isLight ? '#111827' : '#ffffff'} !important;
              text-transform: uppercase !important;
              border-radius: 8px !important;
              margin-bottom: 20px !important;
              text-align: center !important;
            }
          </style>
        </head>
        <body>
          <div class="wrapper-cover">
            <!-- PAGE 1: COVER DEPAN -->
            <div class="rapor-page-cover font-serif">
              <div class="border-double-amber"></div>
              <div class="border-single-amber"></div>
              <div class="corner-tl"></div>
              <div class="corner-tr"></div>
              <div class="corner-bl"></div>
              <div class="corner-br"></div>
              
              <div style="z-index: 10; margin-top: 15mm; display: flex; justify-content: center; width: 100%;">
                <img src="${getActiveMinistryLogo()}" alt="Logo" style="width: 100px; height: 100px; object-fit: contain; background: transparent;" />
              </div>
              
              <div style="z-index: 10; text-align: center; margin-top: 15px; width: 100%;">
                <h1 class="title-rapor">RAPOR</h1>
                <h2 class="subtitle-rapor">PESERTA DIDIK</h2>
                <h3 class="jenjang-rapor">${jenjangFull}</h3>
                <span class="font-sans" style="font-size: 14px; font-weight: 800; letter-spacing: 2px; color: ${currentTheme.isLight ? '#4b5563' : '#cbd5e1'};">${jenjangShort}</span>
              </div>
              
              <div class="student-box font-sans">
                <div class="student-label">Nama Peserta Didik</div>
                <div class="student-value">${activeStudent.namaLengkap}</div>
                
                <div class="student-label">NISN / NIS</div>
                <div class="student-value" style="margin-bottom: 0;">${activeStudent.nisnNis || "-"}</div>
              </div>
              
              <div style="z-index: 10; margin-bottom: 10mm; text-align: center; text-transform: uppercase; width: 100%;">
                <p class="font-sans" style="font-size: 12px; font-weight: 800; letter-spacing: 3px; line-height: 1.3; margin: 0; color: ${currentTheme.isLight ? '#111827' : '#ffffff'};">KEMENTERIAN PENDIDIKAN DASAR</p>
                <p class="font-sans" style="font-size: 12px; font-weight: 800; letter-spacing: 3px; line-height: 1.3; margin: 0; color: ${currentTheme.isLight ? '#111827' : '#ffffff'};">DAN MENENGAH</p>
                <p class="font-sans" style="font-size: 10px; font-weight: bold; letter-spacing: 2px; margin: 6px 0 0 0; color: ${currentTheme.isLight ? '#4b5563' : '#cbd5e1'};">REPUBLIK INDONESIA</p>
              </div>
            </div>
 
            <!-- PAGE 2: COVER BELAKANG -->
            <div class="rapor-page-cover font-serif">
              <div class="border-double-amber"></div>
              <div class="border-single-amber"></div>
              <div class="corner-tl"></div>
              <div class="corner-tr"></div>
              <div class="corner-bl"></div>
              <div class="corner-br"></div>
              
              <div style="z-index: 10; flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; max-width: 500px; margin: 0 auto; padding-top: 30mm;">
                <div style="margin-bottom: 30px; text-align: center; width: 100%;">
                  <p style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: ${currentTheme.isLight ? '#1f2937' : '#f1f5f9'};">Catatan Penggunaan :</p>
                  <div style="border: 2px dashed ${currentTheme.border}; border-radius: 8px; padding: 15px; font-size: 12px; line-height: 1.6; text-align: justify; color: ${currentTheme.isLight ? '#374151' : '#cbd5e1'}; background-color: ${currentTheme.isLight ? '#ffffff' : 'rgba(255,255,255,0.06)'};">
                    Rapor Peserta Didik ini merupakan dokumen resmi yang diterbitkan oleh Lembaga Satuan Pendidikan untuk mendokumentasikan pencapaian kompetensi intrakurikuler dan kokurikuler secara objektif. Harap disimpan dengan baik, dijaga kebersihannya, dan ditunjukkan kepada Wali Kelas apabila diperlukan untuk keperluan administrasi sekolah lebih lanjut.
                  </div>
                </div>
              </div>
              
              <!-- Logo and Ministry name at the bottom -->
              <div style="z-index: 10; margin-bottom: 10mm; text-align: center; text-transform: uppercase; width: 100%;">
                <img src="${getActiveMinistryLogo()}" alt="Logo" style="width: 42px; height: 42px; object-fit: contain; margin: 0 auto 12px auto; background: transparent;" />
                <p class="font-sans" style="font-size: 10px; font-weight: 800; letter-spacing: 2.5px; line-height: 1.3; margin: 0; color: ${currentTheme.isLight ? '#111827' : '#ffffff'};">KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH</p>
                <p class="font-sans" style="font-size: 9px; font-weight: bold; letter-spacing: 1.5px; margin: 3px 0 0 0; color: ${currentTheme.isLight ? '#4b5563' : '#cbd5e1'};">REPUBLIK INDONESIA</p>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handlePrint = () => {
    const printableArea = document.getElementById("omega-rapor-printable-root");
    if (!printableArea) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Mohon izinkan pop-up (Pop-up Blocker) di browser Anda untuk mencetak atau mengunduh PDF secara langsung.");
      window.print();
      return;
    }

    const cleanFileName = "RAPOR PESERTA DIDIK";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cleanFileName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');
            @page {
              size: A4;
              margin: 0 !important;
            }
            body {
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: Garamond, "Times New Roman", serif !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .rapor-page-break {
              page-break-after: always !important;
              page-break-inside: avoid !important;
              clear: both !important;
              position: relative !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              margin: 0 auto !important;
              padding: 15mm 20mm !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              background-color: #ffffff !important;
            }
            .rapor-page-break.print-cover-page {
              padding: 1.2cm 1cm !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: auto !important;
            }
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
            .text-center { text-align: center !important; }
            .text-left { text-align: left !important; }
            .text-right { text-align: right !important; }
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .justify-between { justify-content: space-between !important; }
            .items-center { align-items: center !important; }
            .font-bold { font-weight: bold !important; }
            .font-serif { font-family: Garamond, "Times New Roman", serif !important; }
            .font-sans { font-family: "Inter", sans-serif !important; }
            .font-mono { font-family: "JetBrains Mono", monospace !important; }
            .grid { display: grid !important; }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
            .gap-4 { gap: 1rem !important; }
            .w-full { width: 100% !important; }
            .invisible { visibility: hidden !important; }
            .underline { text-decoration: underline !important; }
            .leading-none { line-height: 1 !important; }
            .leading-normal { line-height: 1.5 !important; }
          </style>
        </head>
        <body>
          <div class="only-print">
            ${printableArea.innerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Compile active report card grades
  const resolvedSubjects = getKospSelectedSubjectsForRapor().map((key, index) => {
    const defaultMeta = getSubjectRaporInfo(key);
    const atpMeta = getSubjectAtpMapping(key);
    
    // Attempt real database load
    const realGrades = fetchRealGradeFromDaftarNilai(key, activeStudent.namaLengkap);
    
    // Fallback profile grade match
    const profileMatch = activeStudent.grades ? activeStudent.grades.find(g => {
      const gName = g.name.toLowerCase();
      const sName = defaultMeta.name.toLowerCase();
      return gName.includes(sName) || sName.includes(gName);
    }) : null;

    // Sourced strictly from database, or from manual input, else null
    // If realGrades is marked as isEmpty (manually deleted/wiped), make it null so no fake grade is displayed in the report
    const finalScoreValue = (realGrades && !realGrades.isEmpty) ? realGrades.score : (profileMatch ? profileMatch.score : null);
    
    // Build descriptive achievements based on actual scores
    let highCompetency = "Belum ada entri nilai pada lembar daftar nilai untuk deskripsi kompetensi tertinggi.";
    let lowCompetency = "Belum ada entri nilai pada lembar daftar nilai untuk deskripsi kompetensi terendah.";
    
    if (finalScoreValue !== null) {
      const scoreNum = Number(finalScoreValue);
      const highPrefix = scoreNum >= 85 
        ? "Menunjukkan penguasaan kompetensi yang sangat baik"
        : scoreNum >= 75 
          ? "Menunjukkan penguasaan kompetensi yang mumpuni"
          : "Menunjukkan penguasaan kompetensi yang cukup baik";

      const lowPrefix = scoreNum >= 85
        ? "Menunjukkan perkembangan kompetensi yang stabil"
        : scoreNum >= 75
          ? "Mulai menunjukkan perkembangan kompetensi"
          : "Perlu bimbingan intensif dan latihan mandiri";

      highCompetency = formatCompetencyText(highPrefix, atpMeta.materi1);
      lowCompetency = formatCompetencyText(lowPrefix, atpMeta.materi2);
    }

    return {
      no: index + 1,
      name: defaultMeta.name,
      score: finalScoreValue || "-",
      highCompetency,
      lowCompetency
    };
  });

  // Calculate real or manual attendance
  const realAttendance = getRealAttendanceTotals(activeStudent.namaLengkap);
  const totalSakit = realAttendance ? realAttendance.sakit : (parseInt(activeStudent.sakit) || 0);
  const totalIzin = realAttendance ? realAttendance.izin : (parseInt(activeStudent.izin) || 0);
  const totalAlpa = realAttendance ? realAttendance.alpa : (parseInt(activeStudent.alpa) || 0);

  const getActiveMinistryLogo = () => {
    const customMinistryLogo = localStorage.getItem("kosp_custom_ministry_logo");
    if (customMinistryLogo) return customMinistryLogo;
    const altLogo = localStorage.getItem("kosp_ministry_logo") || localStorage.getItem("kosp_logo_ministry") || "";
    if (altLogo) return altLogo;
    const logoType = localStorage.getItem("kosp_logo_type");
    if (logoType === "kemenag") {
      return getKemenagLogo();
    }
    return getTutWuriHandayaniLogo();
  };

  const getPageContainerStyles = (pageName: string) => {
    const isCover = pageName === 'cover' || pageName === 'cover_back';
    return {
      className: `mx-auto font-serif rounded-2xl p-[1.5cm_1.2cm] text-center relative transition-all duration-300 transform flex flex-col justify-between shrink-0 ${
        isCover 
          ? 'rapor-page-cover' 
          : 'rapor-page-paper'
      }`,
      style: { 
        boxSizing: 'border-box' as const,
        width: '210mm',
        minWidth: '210mm',
        maxWidth: '210mm',
        minHeight: '297mm',
        padding: '1.2cm 1cm'
      }
    };
  };

  const renderPage = (pageName: 'cover' | 'school' | 'student' | 'nilai1' | 'nilai2' | 'cover_back') => {
    switch (pageName) {
      case 'cover_back':
        return (
          <div className="w-full flex-1 flex flex-col justify-between items-center py-6 animate-fade-in relative text-amber-100">
            {/* Outer Decorative Certificate Border */}
            <div className="absolute inset-0 border-[4px] border-double border-amber-400/80 pointer-events-none" />
            <div className="absolute inset-2 border border-amber-600/35 pointer-events-none" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-400" />
            
            {/* Small logo and Ministry name at the bottom */}
            <div className="mt-auto mb-4 flex flex-col items-center space-y-3 z-10 w-full px-6">
              <img 
                src={getActiveMinistryLogo()} 
                alt="Logo Kementerian" 
                className="w-10 h-10 select-none object-contain"
                style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                referrerPolicy="no-referrer"
              />
              <div className="text-center">
                <p className="text-[12px] font-sans font-extrabold tracking-[0.15em] text-yellow-300 uppercase leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH
                </p>
                <p className="text-[11px] font-sans font-bold tracking-[0.15em] text-amber-100 uppercase leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  REPUBLIK INDONESIA
                </p>
              </div>
            </div>
          </div>
        );
      case 'cover':
        return (
          <div className="w-full flex-1 flex flex-col justify-between items-center py-6 animate-fade-in relative text-amber-100">
            {/* Outer Decorative Certificate Border */}
            <div className="absolute inset-0 border-[4px] border-double border-amber-400/80 pointer-events-none" />
            <div className="absolute inset-2 border border-amber-600/35 pointer-events-none" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-400" />
            
            {/* Tut Wuri Handayani Logo Top Area */}
            <div className="pt-4 relative z-10 flex flex-col items-center">
              <img 
                src={getActiveMinistryLogo()} 
                alt="KEMENDIKBUD" 
                className="w-24 h-24 select-none object-contain"
                style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title texts */}
            <div className="z-10 text-center space-y-2 pt-2">
              <h1 className="text-4xl font-extrabold tracking-[0.25em] text-yellow-300 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                RAPOR
              </h1>
              <h2 className="text-xl font-extrabold tracking-[0.2em] text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                PESERTA DIDIK
              </h2>
              <h3 className="text-lg font-bold tracking-widest text-amber-200 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                {jenjangFull}
              </h3>
              <span className="text-base font-bold tracking-widest text-amber-200">
                {jenjangShort}
              </span>
            </div>

            {/* Dynamic Student Box Name & Identifier */}
            <div className="w-full max-w-[450px] z-10 space-y-4 my-auto py-4">
              <div className="space-y-1.5">
                <p className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300/90">Nama Peserta Didik</p>
                <div className="border-2 border-amber-400 bg-amber-950/40 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] font-sans font-black text-base text-yellow-300 uppercase tracking-widest min-h-[44px] flex items-center justify-center backdrop-blur-sm rounded-lg">
                  {activeStudent.namaLengkap}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300/90">NISN / NIS</p>
                <div className="border-2 border-amber-400 bg-amber-950/40 p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] font-sans font-bold text-base text-yellow-300 uppercase tracking-widest min-h-[44px] flex items-center justify-center backdrop-blur-sm rounded-lg">
                  {activeStudent.nisnNis || "-"}
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="pb-4 z-10 text-center space-y-1">
              <p className="text-[14px] font-sans font-extrabold tracking-[0.2em] text-yellow-300 block my-0 leading-tight uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                KEMENTERIAN PENDIDIKAN DASAR
              </p>
              <p className="text-[14px] font-sans font-extrabold tracking-[0.2em] text-yellow-300 block my-0 leading-none uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                DAN MENENGAH
              </p>
              <p className="text-[11px] font-sans font-black tracking-[0.2em] text-amber-200 block my-2 uppercase">
                REPUBLIK INDONESIA
              </p>
            </div>
          </div>
        );
      case 'school':
        return (
          <div className="w-full flex-1 flex flex-col justify-start space-y-8 animate-fade-in text-left font-serif py-4">
            <div className="text-center space-y-2 pb-10">
              <h1 className="text-2xl font-black tracking-wider text-zinc-900 leading-tight text-center">
                RAPOR PESERTA DIDIK
              </h1>
              <h2 className="text-xl font-bold tracking-widest text-zinc-805 text-center">
                {jenjangCombined}
              </h2>
            </div>

            {/* Key Values List */}
            <div className="space-y-5 text-sm max-w-[650px] mx-auto pt-6 leading-relaxed">
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Nama Sekolah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans font-bold text-zinc-900">{schoolProfile.namaSekolah}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">NISN/NIS/NSS</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans"></span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">NPSN</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans font-bold">{schoolProfile.npsn}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Alamat Sekolah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans text-zinc-800">{schoolProfile.alamat}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Kode Pos / Telp.</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans text-zinc-805">{schoolProfile.kodepos} &nbsp; / &nbsp; {schoolProfile.telp}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Kelurahan/Desa</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-zinc-800">{schoolProfile.kelurahan}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Kecamatan</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-zinc-800">{schoolProfile.kecamatan}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Kabupaten/Kota</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold text-zinc-900">{schoolProfile.kabupaten}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Provinsi</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 text-zinc-800">{schoolProfile.provinsi}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">E-mail</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans font-medium text-blue-800 underline">{schoolProfile.email}</span>
              </div>
              <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                <span className="col-span-4 font-bold">Website</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans font-medium text-blue-800 underline break-all">{schoolProfile.website}</span>
              </div>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="w-full flex-1 flex flex-col justify-start space-y-3 animate-fade-in text-left font-serif py-1">
            <h2 className="text-lg font-bold tracking-widest text-zinc-900 text-center uppercase border-b-2 border-zinc-900 pb-2 mb-2">
              IDENTITAS PESERTA DIDIK
            </h2>

            <div className="space-y-1 text-[11px] w-full max-w-[650px] mx-auto leading-relaxed">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Nama Peserta Didik</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold text-zinc-950 uppercase">{activeStudent.namaLengkap}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">NISN / NIS</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold font-sans">{activeStudent.nisnNis || "-"}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Tempat, Tanggal Lahir</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-sans">{activeStudent.tempatLahir || "-"}, {activeStudent.tanggalLahir || "-"}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Jenis Kelamin</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.jenisKelamin || "-"}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Agama</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.agama || "Katolik"}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Pendidikan Sebelumnya</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.pendidikanSebelum || "-"}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 font-medium">Alamat Peserta Didik</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.alamatSiswa || "-"}</span>
              </div>

              <div className="pt-1.5 font-bold border-t border-zinc-200 mt-1">Nama Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Ayah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold">{activeStudent.namaAyah || "-"}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Ibu</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold">{activeStudent.namaIbu || "-"}</span>
              </div>

              <div className="pt-1 font-bold">Pekerjaan Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Ayah</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.pekerjaanAyah || "Tani"}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Ibu</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.pekerjaanIbu || "Ibu Rumah Tangga"}</span>
              </div>

              <div className="pt-1.5 font-bold border-t border-zinc-200">Alamat Orang Tua</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Kabupaten / Kota</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.ortuKabupaten || "Timor Tengah Utara"}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Provinsi</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.ortuProvinsi || "Nusa Tenggara Timur"}</span>
              </div>

              <div className="pt-1.5 font-bold border-t border-zinc-200">Wali Peserta Didik</div>
              <div className="grid grid-cols-12 gap-1 pl-4">
                <span className="col-span-4">Nama Wali</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7">{activeStudent.waliNama || "-"}</span>
              </div>
            </div>

            {/* Date & Signatures bottom - lowered slightly to look elegant */}
            <div className="pt-10 flex justify-center gap-24 items-end text-xs mt-6">
              {/* Visual Passport Photo Area */}
              {activeStudent.photo ? (
                <div style={{ width: '3cm', height: '4cm' }} className="border border-zinc-950 bg-zinc-50 overflow-hidden shadow-sm rounded relative">
                  <img src={activeStudent.photo} alt="Foto Murid" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div style={{ width: '3cm', height: '4cm' }} className="border-2 border-dashed border-zinc-950 bg-zinc-50 flex flex-col items-center justify-center text-center p-1.5 shadow-sm rounded">
                  <User className="w-6 h-6 text-zinc-300 mb-1" />
                  <span className="text-[9px] font-sans text-zinc-400 font-bold leading-tight">PAS FOTO<br/>3 X 4</span>
                </div>
              )}

              <div className="text-center w-48 space-y-12">
                <div>
                  <p className="font-sans text-[10px] text-zinc-700">{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
                  <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                  <p className="font-bold">Kepala Sekolah,</p>
                </div>
                <div>
                  <p className="font-bold underline text-zinc-950">{schoolProfile.kepalaSekolah}</p>
                  <p className="font-sans text-[10px] text-zinc-650 leading-none">NIP. {schoolProfile.nipKepala}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'nilai1':
        return (
          <div className="w-full flex-1 flex flex-col justify-start space-y-6 animate-fade-in text-left font-serif py-1">
            {/* Header Info Banner like Page 4 screenshot */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-1 text-xs border-b border-zinc-300 pb-4">
              <div className="col-span-6 space-y-1">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4">Nama Siswa</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-7 font-bold uppercase">{activeStudent.namaLengkap}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4">NISN/NIS</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-7 font-sans font-bold">{activeStudent.nisnNis || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4">Sekolah</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-7 font-bold">{schoolProfile.namaSekolah}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4">Alamat</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-7">{schoolProfile.alamat}</span>
                </div>
              </div>

              <div className="col-span-6 space-y-1 pl-4">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5">Kelas / Fase</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-bold">{schoolProfile.faseKelas}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5">Semester</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-bold">{semester} ({semester === 1 ? "Ganjil" : "Genap"})</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5">Tahun Pelajaran</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-sans font-bold">{tahunPelajaran}</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                DAFTAR NILAI RAPOR HASIL BELAJAR
              </h3>
            </div>

            {/* Main Subject Grades Table */}
            <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '6%' }}>No</th>
                  <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '24%' }}>Mata Pelajaran</th>
                  <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '12%' }}>Nilai Akhir</th>
                  <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '58%' }}>Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody>
                {resolvedSubjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50">
                    <td className="border-2 border-zinc-900 p-2 text-center font-mono" style={{ width: '6%' }}>{idx + 1}</td>
                    <td className="border-2 border-zinc-900 p-2 font-bold whitespace-normal break-words" style={{ width: '24%' }}>{sub.name}</td>
                    <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans text-sm" style={{ width: '12%' }}>{sub.score}</td>
                    <td className="border-2 border-zinc-900 p-2 text-[10px] leading-relaxed font-sans space-y-1 whitespace-normal break-words" style={{ width: '58%' }}>
                      <div>
                        <span className="font-bold text-zinc-950 block">Capaian Kompetensi Tertinggi:</span>
                        <span className="text-zinc-800 text-[10px] whitespace-normal break-words">{sub.highCompetency}</span>
                      </div>
                      <div className="pt-1 border-t border-dashed border-zinc-200">
                        <span className="font-bold text-zinc-950 block">Capaian Kompetensi Terendah:</span>
                        <span className="text-zinc-800 text-[10px] whitespace-normal break-words">{sub.lowCompetency}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-[10px] text-zinc-400 font-sans italic text-right mt-1 no-print">
              * Halaman 1 Nilai Rapor selesai. Klik tab 'Dua' untuk melihat Ekstrakurikuler, Absensi, & Tanda Tangan.
            </div>
          </div>
        );
      case 'nilai2': {
        const charData = getActiveStudentCharacter();
        const fallbackNarrative = charData ? getCharacterNarrative(charData) : "Tunjukkan terus kedisiplinan dan asah minat bakat belajar secara berkelanjutan untuk hasil optimal di masa mendatang.";
        const displayCatatanGuru = activeStudent.catatanGuru || fallbackNarrative;

        return (
          <div className="w-full flex-1 flex flex-col justify-start space-y-6 animate-fade-in text-left font-serif py-1">
            <div className="text-center pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-2">
                EKSTRAKURIKULER, KETIDAKHADIRAN, & CATATAN
              </h3>
            </div>

            {/* 1. EXTRACTED EXTRAS TABLE */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                A. Kegiatan Ekstrakurikuler
              </h4>
              <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '8%' }}>No</th>
                    <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '42%' }}>Kegiatan Ekstrakurikuler</th>
                    <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '50%' }}>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {getKospSelectedExtras().map((extraKey, idx) => {
                    const info = getExtraInfoForKey(extraKey);
                    return (
                      <tr key={idx}>
                        <td className="border-2 border-zinc-900 p-2 text-center font-mono" style={{ width: '8%' }}>{idx + 1}</td>
                        <td className="border-2 border-zinc-900 p-2 font-bold whitespace-normal break-words" style={{ width: '42%' }}>{info.name}</td>
                        <td className="border-2 border-zinc-900 p-2 text-[11px] leading-relaxed whitespace-normal break-words" style={{ width: '50%' }}>{info.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. CATATAN GURU */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                B. Catatan Wali Kelas
              </h4>
              <textarea
                value={displayCatatanGuru}
                onChange={(e) => handleUpdateStudentField("catatanGuru", e.target.value)}
                placeholder="Tulis catatan perkembangan karakter & akademis siswa di sini..."
                className="w-full border-2 border-zinc-950 p-3 min-h-[110px] text-xs font-sans leading-relaxed bg-white focus:bg-zinc-50 outline-none rounded-none resize-none overflow-hidden"
                rows={4}
              />
            </div>

            {/* 3. PERKEMBANGAN KARAKTER */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                C. Perkembangan Karakter
              </h4>
              <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border-2 border-zinc-900 p-2 text-center font-bold" style={{ width: '8%' }}>No</th>
                    <th className="border-2 border-zinc-900 p-2 text-left font-bold" style={{ width: '35%' }}>Dimensi Karakter</th>
                    <th className="border-2 border-zinc-900 p-2 text-center font-bold" style={{ width: '22%' }}>Predikat (Capaian)</th>
                    <th className="border-2 border-zinc-900 p-2 text-left font-bold" style={{ width: '35%' }}>Hasil Pengamatan / Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { no: 1, name: criteria.religius.name, key: "religius", desc: criteria.religius.desc },
                    { no: 2, name: criteria.jujur.name, key: "jujur", desc: criteria.jujur.desc },
                    { no: 3, name: criteria.disiplin.name, key: "disiplin", desc: criteria.disiplin.desc },
                    { no: 4, name: criteria.peduli.name, key: "peduli", desc: criteria.peduli.desc },
                    { no: 5, name: criteria.gotongRoyong.name, key: "gotongRoyong", desc: criteria.gotongRoyong.desc }
                  ].map((dim, idx) => {
                    const rating = charData ? charData[dim.key] : "BSH";
                    const translateRating = (r: string) => {
                      if (r === "SB") return "Sangat Berkembang (SB)";
                      if (r === "BSH") return "Berkembang Sesuai Harapan (BSH)";
                      if (r === "MB") return "Mulai Berkembang (MB)";
                      return "Belum Berkembang (BB)";
                    };
                    return (
                      <tr key={idx}>
                        <td className="border-2 border-zinc-900 p-1.5 text-center font-mono">{dim.no}</td>
                        <td className="border-2 border-zinc-900 p-1.5 font-bold">{dim.name}</td>
                        <td className="border-2 border-zinc-900 p-1.5 text-center text-zinc-800">{translateRating(rating)}</td>
                        <td className="border-2 border-zinc-900 p-1.5 text-[10px] leading-relaxed text-zinc-700">{dim.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!charData && (
                <p className="text-[9px] font-sans text-amber-600 italic leading-none my-1">
                  * Catatan: Tampilan di atas menggunakan nilai bawaan pratinjau. Lengkapi entri asli di menu "Nilai Karakter" untuk pencerminan data real otomatis.
                </p>
              )}
            </div>

            {/* 4. ATTENDANCE & ATTENDANCE MAP */}
            <div className="grid grid-cols-12 gap-6 pt-2">
              <div className="col-span-6 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  D. Ketidakhadiran (Absensi)
                </h4>
                {realAttendance ? (
                  <div className="space-y-1">
                    <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                      <thead>
                        <tr className="bg-zinc-100/50">
                          <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '70%', fontWeight: 'bold' }}>Keterangan</th>
                          <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%', fontWeight: 'bold' }}>Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Sakit</td>
                          <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalSakit}</td>
                        </tr>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Izin</td>
                          <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalIzin}</td>
                        </tr>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Tanpa Keterangan</td>
                          <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalAlpa}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                      <thead>
                        <tr className="bg-zinc-100/50">
                          <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '70%', fontWeight: 'bold' }}>Keterangan</th>
                          <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%', fontWeight: 'bold' }}>Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Sakit</td>
                          <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                            <input
                              type="number"
                              min="0"
                              value={activeStudent.sakit || "0"}
                              onChange={(e) => handleUpdateStudentField("sakit", e.target.value)}
                              className="rapor-cell-input w-full"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Izin</td>
                          <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                            <input
                              type="number"
                              min="0"
                              value={activeStudent.izin || "0"}
                              onChange={(e) => handleUpdateStudentField("izin", e.target.value)}
                              className="rapor-cell-input w-full"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Tanpa Keterangan</td>
                          <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                            <input
                              type="number"
                              min="0"
                              value={activeStudent.alpa || "0"}
                              onChange={(e) => handleUpdateStudentField("alpa", e.target.value)}
                              className="rapor-cell-input w-full"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* DECISION AREA IF SEMESTER 2 AREA */}
              <div className="col-span-6 space-y-2 flex flex-col justify-end">
                {semester === 2 ? (
                  <div className="border-2 border-zinc-900 p-3 bg-zinc-50 flex flex-col justify-center min-h-[90px]">
                    <span className="text-[10px] uppercase font-bold text-zinc-650 block mb-1">Keputusan Kelulusan / Kenaikan Kelas:</span>
                    <div className="text-xs font-bold text-zinc-900 leading-normal font-sans">
                      Berdasarkan pencapaian hasil belajar, ditetapkan: <br/>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-300 py-1 px-2 rounded font-black inline-block text-[11px]">
                          NAIK KE KELAS:
                        </span>
                        <input
                          type="text"
                          value={activeStudent.naikKeKelas || "V (Lima)"}
                          onChange={(e) => handleUpdateStudentField("naikKeKelas", e.target.value)}
                          placeholder="V (Lima)"
                          className="bg-white border-2 border-emerald-600 text-emerald-800 font-extrabold px-2 py-1 rounded text-xs w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-zinc-900 p-3 bg-zinc-50 flex items-center justify-center min-h-[90px] italic text-zinc-500 text-xs text-center leading-relaxed">
                    Keputusan Kenaikan kelas atau kelulusan ditentukan pada laporan penilaian Semester Akhir (Semester 2).
                  </div>
                )}
              </div>
            </div>

            {/* 4. SIGNATURES AREA FOR OFFICIAL RECORD - SIDE BY SIDE FOR COMPACT ELEGANCE */}
            <div className="pt-4 text-[11px] font-serif leading-normal" style={{ marginTop: 'auto' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col justify-between h-[110px]">
                  <div>
                    <p className="invisible text-[8px]">Date Space Placeholder</p>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Orang Tua/Wali,</p>
                  </div>
                  <div>
                    <p className="font-bold underline text-zinc-950 truncate max-w-[180px] mx-auto leading-tight" title={getParentSignatureName()}>{getParentSignatureName()}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between h-[110px]">
                  <div>
                    <p className="invisible text-[8px]">Date Space Placeholder</p>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah,</p>
                  </div>
                  <div>
                    <p className="p-0 m-0 font-bold underline text-zinc-950 truncate leading-none" title={schoolProfile.kepalaSekolah}>{schoolProfile.kepalaSekolah}</p>
                    <p className="font-sans text-[8px] text-zinc-500 leading-none mt-0.5">NIP. {schoolProfile.nipKepala}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between h-[110px]">
                  <div>
                    <p className="font-sans text-[9px] text-zinc-500 leading-none block mb-0.5">{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
                    <p>Wali Kelas / Guru Kelas,</p>
                  </div>
                  <div>
                    <p className="p-0 m-0 font-bold underline text-zinc-950 truncate leading-none" title={schoolProfile.namaGuru}>{schoolProfile.namaGuru}</p>
                    <p className="font-sans text-[8px] text-zinc-500 leading-none mt-0.5">NIP. {schoolProfile.nipGuru}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const isSma = schoolProfile.namaSekolah.toUpperCase().includes("SMA") || 
                schoolProfile.namaSekolah.toUpperCase().includes("SMK") || 
                schoolProfile.namaSekolah.toUpperCase().includes("MAN ") || 
                schoolProfile.namaSekolah.toUpperCase().includes("MENENGAH ATAS") || 
                schoolProfile.faseKelas.toUpperCase().includes("FASE E") ||
                schoolProfile.faseKelas.toUpperCase().includes("FASE F") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS X") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS XI") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS XII") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 10") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 11") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 12");

  const isSmp = !isSma && (schoolProfile.namaSekolah.toUpperCase().includes("SMP") || 
                schoolProfile.namaSekolah.toUpperCase().includes("MENENGAH PERTAMA") || 
                schoolProfile.namaSekolah.toUpperCase().includes("MTS") ||
                schoolProfile.faseKelas.toUpperCase().includes("FASE D") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS VII") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS VIII") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS IX") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 7") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 8") ||
                schoolProfile.faseKelas.toUpperCase().includes("KELAS 9"));

  const levelBorderColor = isSma ? "#475569" : (isSmp ? "#1e3a8a" : "#ca8a04");
  const computedThemeId = isSmp ? "biru" : (isSma ? "putih" : "merah");
  const currentTheme = COVER_THEMES.find(t => t.id === coverTheme) || COVER_THEMES.find(t => t.id === computedThemeId) || COVER_THEMES[0];

  const jenjangFull = isSma ? "SEKOLAH MENENGAH ATAS" : (isSmp ? "SEKOLAH MENENGAH PERTAMA" : "SEKOLAH DASAR");
  const jenjangShort = isSma ? "(SMA)" : (isSmp ? "(SMP)" : "(SD)");
  const jenjangCombined = isSma ? "SEKOLAH MENENGAH ATAS (SMA)" : (isSmp ? "SEKOLAH MENENGAH PERTAMA (SMP)" : "SEKOLAH DASAR (SD)");

  const isDefaultWhiteCover = activePage === 'all';
  const previewBgColor = isDefaultWhiteCover ? '#ffffff' : currentTheme.bg;
  const previewBorderColor = isDefaultWhiteCover ? levelBorderColor : currentTheme.border;
  const previewTextColor = isDefaultWhiteCover ? '#111827' : currentTheme.text;
  const previewIsLight = isDefaultWhiteCover ? true : currentTheme.isLight;

  return (
    <div className="space-y-6">
      {/* Dynamic style sheet to force exact white-paper and cover representations, overriding any main workspace dark classes */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* POWERFUL HIGHER-SPECIFICITY CELL OVERRIDES FOR COLOR ACCURACY */
        .rapor-page-cover {
          background: ${previewBgColor} !important;
          background-color: ${previewBgColor} !important;
          color: ${previewTextColor} !important;
          border: 12px double ${previewBorderColor} !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          box-sizing: border-box !important;
          width: 210mm !important;
          min-width: 210mm !important;
          max-width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
        }
        .rapor-page-cover * {
          color: ${previewTextColor} !important;
        }
        .rapor-page-cover h1, .rapor-page-cover h1 * {
          color: ${previewIsLight ? '#111827' : '#ffffff'} !important;
        }
        .rapor-page-cover h2, .rapor-page-cover h2 * {
          color: ${previewIsLight ? '#374151' : '#f1f5f9'} !important;
        }
        .rapor-page-cover h3, .rapor-page-cover h3 * {
          color: ${previewIsLight ? '#4b5563' : '#cbd5e1'} !important;
        }
        .rapor-page-cover span {
          color: ${previewIsLight ? '#4b5563' : '#cbd5e1'} !important;
        }
        .rapor-page-cover .border-amber-400 {
          border-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-amber-400"] {
          border-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-amber-600"] {
          border-color: ${previewBorderColor}30 !important;
        }
        .rapor-page-cover div[class*="border-t-2"] {
          border-top-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-l-2"] {
          border-left-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-r-2"] {
          border-right-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-b-2"] {
          border-bottom-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="border-double"] {
          border-style: double !important;
          border-color: ${previewBorderColor} !important;
        }
        .rapor-page-cover div[class*="bg-amber-950"] {
          background-color: ${previewIsLight ? '#ffffff' : 'rgba(255,255,255,0.06)'} !important;
          border-color: ${previewBorderColor} !important;
          color: ${previewIsLight ? '#111827' : '#ffffff'} !important;
        }
        .rapor-page-cover .student-value {
          border: 2px solid ${previewBorderColor} !important;
          background-color: ${previewIsLight ? '#ffffff' : 'rgba(255,255,255,0.08)'} !important;
          color: ${previewIsLight ? '#111827' : '#ffffff'} !important;
        }

        .rapor-page-paper,
        div.rapor-page-paper,
        main .rapor-page-paper,
        #root .rapor-page-paper {
          background-color: #ffffff !important;
          background: #ffffff !important;
          background-image: none !important;
          color: #111111 !important;
          border: 4px solid #111111 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15) !important;
          box-sizing: border-box !important;
          width: 210mm !important;
          min-width: 210mm !important;
          max-width: 210mm !important;
          min-height: 297mm !important;
          color-scheme: light !important;
        }
        
        /* Strict high specificity child selectors to force pure white paper styling on screen */
        .rapor-page-paper *,
        div.rapor-page-paper *,
        main .rapor-page-paper *,
        #root .rapor-page-paper *,
        main .rapor-page-paper table,
        main .rapor-page-paper tr,
        main .rapor-page-paper td,
        main .rapor-page-paper th,
        main .rapor-page-paper div,
        main .rapor-page-paper span,
        main .rapor-page-paper h1,
        main .rapor-page-paper h2,
        main .rapor-page-paper h3,
        main .rapor-page-paper h4,
        main .rapor-page-paper h5,
        main .rapor-page-paper p {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          color: #111111 !important;
          border-color: #111111 !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }

        /* Override any remaining class-level backgrounds on elements that normally have dark backgrounds in main workspace */
        main .rapor-page-paper .border-zinc-800,
        main .rapor-page-paper .border-zinc-850,
        main .rapor-page-paper .border-zinc-855,
        main .rapor-page-paper .border-zinc-900,
        main .rapor-page-paper .border-zinc-905,
        main .rapor-page-paper .border-zinc-950,
        main .rapor-page-paper [class*="border-zinc"],
        main .rapor-page-paper [class*="bg-zinc"],
        main .rapor-page-paper tr[class*="bg-zinc"],
        main .rapor-page-paper div[class*="bg-"] {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          color: #111111 !important;
        }

        /* Th background color on screen */
        main .rapor-page-paper th,
        .rapor-page-paper th {
          background-color: rgba(0, 0, 0, 0.04) !important;
          background: rgba(0, 0, 0, 0.04) !important;
          font-weight: bold !important;
          border: 2px solid #111111 !important;
          color: #111111 !important;
        }

        /* Ensure form input elements on screen paper are fully readable */
        main .rapor-page-paper input[type="text"],
        main .rapor-page-paper input[type="number"],
        main .rapor-page-paper select {
          background: #ffffff !important;
          background-color: #ffffff !important;
          background-image: none !important;
          color: #111111 !important;
          border: 1px solid #111111 !important;
          border-radius: 4px !important;
          padding: 0.125rem 0.375rem !important;
          font-size: 0.75rem !important;
          font-weight: bold !important;
          box-shadow: none !important;
          width: auto !important;
        }

        main .rapor-page-paper textarea {
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #111111 !important;
          border: 2px solid #111111 !important;
          border-radius: 0px !important;
          padding: 0.75rem !important;
          font-size: 0.75rem !important;
          font-family: sans-serif !important;
          line-height: 1.6 !important;
          box-shadow: none !important;
          width: 100% !important;
          min-height: 85px !important;
          resize: none !important;
          overflow: hidden !important;
        }

        main .rapor-page-paper input[type="text"]:focus,
        main .rapor-page-paper input[type="number"]:focus,
        main .rapor-page-paper select:focus {
          border-color: #111111 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
          outline: none !important;
        }

        main .rapor-page-paper textarea:focus {
          border-color: #111111 !important;
          background-color: #fca5a510 !important;
          outline: none !important;
        }

        /* Pure academic raw-style custom input for clean table cells */
        main .rapor-page-paper input.rapor-cell-input {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          width: 100% !important;
          text-align: center !important;
          font-weight: bold !important;
          padding: 0 !important;
          margin: 0 !important;
          color: #111111 !important;
          -webkit-appearance: none !important;
          -moz-appearance: textfield !important;
        }
        main .rapor-page-paper input.rapor-cell-input::-webkit-outer-spin-button,
        main .rapor-page-paper input.rapor-cell-input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }

        /* Clean borderless inputs inside table cells to prevent any visual box nesting */
        main .rapor-page-paper td input,
        main .rapor-page-paper td select {
          border: none !important;
          background: transparent !important;
          background-color: transparent !important;
          padding: 0 !important;
          text-align: center !important;
          width: 100% !important;
          max-width: 60px !important;
          font-weight: bold !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          color: #111111 !important;
        }
        main .rapor-page-paper td input:focus {
          outline: none !important;
          background-color: rgba(251, 191, 36, 0.1) !important;
        }

        /* Table borders and cell outlines */
        main .rapor-page-paper table,
        main .rapor-page-paper .border-2,
        main .rapor-page-paper .border-zinc-900,
        main .rapor-page-paper .border-zinc-950,
        main .rapor-page-paper tr,
        main .rapor-page-paper td,
        main .rapor-page-paper th,
        main .rapor-page-paper div[class*="border-zinc-200"],
        main .rapor-page-paper div[class*="border-b"] {
          border-color: #111111 !important;
        }

        main .rapor-page-paper table {
          border-width: 2px !important;
        }

        main .rapor-page-paper .text-emerald-800,
        main .rapor-page-paper .text-emerald-700 {
          color: #111111 !important;
        }
        main .rapor-page-paper .border-emerald-200,
        main .rapor-page-paper .border-emerald-300 {
          border-color: #111111 !important;
        }
        main .rapor-page-paper .grid-cols-3 .bg-white {
          background-color: transparent !important;
        }
      `}} />

      {/* 1. SEAMLESS INTERACTIVE CONTROL HEADER */}
      {activePage === 'all' ? (
        /* ULTRA-CLEAN PREVIEW CONTROLS: REMOVING ALL THE NOISE TOWARDS AN IMMERSIVE PAPER VIEW */
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl no-print text-left flex flex-col xl:flex-row xl:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h2 className="text-sm font-black tracking-wider text-amber-400 uppercase">
                Mode Pratinjau Bersih
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Pratinjau Rapor &bull; Kelas: <span className="text-white font-bold">{schoolProfile.faseKelas}</span> &bull; Semester {semester}
            </p>
          </div>

          {/* STUDENT QUICK NAVIGATION SWITHCER */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl self-start xl:self-center">
            <button
              type="button"
              onClick={handlePrevStudent}
              className="p-1.5 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 rounded-lg transition duration-200 cursor-pointer"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center min-w-[170px] max-w-[260px]">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono leading-none">Rapor Murid ({activeStudentIdx + 1} / {students.length})</p>
              <h4 className="font-extrabold text-white text-xs truncate uppercase mt-1.5 leading-none" title={activeStudent.namaLengkap}>{activeStudent.namaLengkap}</h4>
            </div>
            <button
              type="button"
              onClick={handleNextStudent}
              className="p-1.5 hover:bg-zinc-800 text-amber-500 hover:text-amber-400 rounded-lg transition duration-200 cursor-pointer"
              title="Siswa Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActivePage('cover')}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 cursor-pointer border border-zinc-800"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              Keluar & Edit Rapor
            </button>
            <button 
              onClick={handlePrintCoverOnly}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 cursor-pointer border border-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Cetak Cover Saja (PDF/Warna)
            </button>
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4.5 h-4.5 shrink-0" />
              Cetak Rapor Murid (PDF)
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD EDIT MODE HEADER */
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 no-print text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-wider text-amber-400 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400 shrink-0" />
              RAPOR GENERATOR INSTAN (MERDEKA)
            </h2>
            <p className="text-xs text-zinc-400">
              Cetak Cover, Lembar Biodata, & Rapor Kompetensi resmi (Tanpa Rekayasa Data)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition duration-200 active:scale-95 cursor-pointer ${
                showSettings 
                  ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 font-extrabold shadow-lg" 
                  : "bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 border border-zinc-700/60"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {showSettings ? "Tutup Pengaturan" : "Edit Profil Sekolah & TTD"}
            </button>
            <button 
              onClick={handlePrintCoverOnly}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-emerald-400 border border-zinc-700/60 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition duration-200 active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Cetak Cover Saja (PDF)
            </button>
            <button 
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              Cetak Rapor Murid (PDF)
            </button>
          </div>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* A. Student Profile Switcher */}
          <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3">
            <button 
              onClick={handlePrevStudent} 
              className="p-3 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-amber-500 rounded-xl transition duration-200"
              title="Siswa Sebelumnya"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center min-w-0">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Peserta Didik ({activeStudentIdx + 1} dari {students.length})</p>
              <h4 className="font-black text-white text-sm truncate uppercase mt-0.5">{activeStudent.namaLengkap}</h4>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">{activeStudent.nisnNis || "NISN Tidak diatur"}</p>
            </div>
            <button 
              onClick={handleNextStudent} 
              className="p-3 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-amber-500 rounded-xl transition duration-200"
              title="Siswa Selanjutnya"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          {/* B. Semester Choice Selector */}
          <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-xl flex flex-col justify-center space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Pilih Semester Penilaian</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setSemester(1)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  semester === 1 
                    ? "bg-amber-500 text-zinc-950 shadow-lg font-black" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                Semester 1 (Ganjil)
              </button>
              <button 
                onClick={() => setSemester(2)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  semester === 2 
                    ? "bg-amber-500 text-zinc-950 shadow-lg font-black" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                Semester 2 (Genap)
              </button>
            </div>
          </div>

          {/* C. School Year Options */}
          <div className="bg-zinc-900/60 p-4 border border-zinc-800/80 rounded-xl flex flex-col justify-center gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Pengaturan Tahun Ajaran & Tanggal</span>
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <input 
                type="text" 
                value={tahunPelajaran}
                onChange={(e) => {
                  setTahunPelajaran(e.target.value);
                  localStorage.setItem("kosp_tahun_pelajaran", e.target.value);
                }}
                placeholder="Tahun Ajaran"
                className="bg-zinc-850 text-white text-xs p-1.5 rounded-lg border border-zinc-700/60 focus:border-amber-400 focus:outline-none font-mono"
              />
              <input 
                type="text" 
                value={tanggalLaporan}
                onChange={(e) => {
                  setTanggalLaporan(e.target.value);
                  localStorage.setItem("kosp_tanggal", e.target.value);
                }}
                placeholder="Tanggal Rapor"
                className="bg-zinc-850 text-white text-xs p-1.5 rounded-lg border border-zinc-700/60 focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 1.1 TABS SELECTOR FOR PREVIEW PAGES */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-2 font-mono">Halaman Rapor (Preview):</span>
          <button 
            onClick={() => setActivePage('all')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'all' 
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            📋 Semua Halaman (Default)
          </button>
          <button 
            onClick={() => setActivePage('cover')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'cover' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            Halaman Cover (S1 & S2)
          </button>
          <button 
            onClick={() => setActivePage('school')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'school' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            Keterangan Sekolah
          </button>
          <button 
            onClick={() => setActivePage('student')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'student' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            Identitas Siswa
          </button>
          <button 
            onClick={() => setActivePage('nilai1')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'nilai1' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            Satu: Nilai & Capaian (Sama)
          </button>
          <button 
            onClick={() => setActivePage('nilai2')} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
              activePage === 'nilai2' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            Dua: Ekstra, Absen & Tanda Tangan
          </button>
        </div>

        {/* 1.2 COLOR SELECTOR FOR REPORT CARD COVER */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-zinc-800/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-2 font-mono">Warna Sampul Rapor:</span>
          {COVER_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setCoverTheme(theme.id);
                localStorage.setItem("omega_rapor_cover_theme", theme.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1.5 cursor-pointer border ${
                coverTheme === theme.id 
                  ? 'bg-amber-500/20 text-yellow-300 border-amber-500/80 font-black shadow-lg shadow-amber-500/5' 
                  : 'bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: theme.bg }} />
              {theme.name}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Dynamic Collapsible Settings Panel */}
      {showSettings && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 no-print text-left animate-fade-in">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/60">
            <Settings className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">PENGATURAN IDENTITAS SEKOLAH & TANDA TANGAN (PERMANEN)</h4>
              <p className="text-[10px] text-zinc-400">Semua perubahan disimpan secara otomatis ke LocalStorage dan kebal terhadap restart komputer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={namaSekolah}
                onChange={(e) => updateMetadataField("kosp_nama_sekolah", e.target.value, setNamaSekolah)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">NPSN Sekolah</label>
              <input
                type="text"
                value={npsn}
                onChange={(e) => updateMetadataField("kosp_npsn", e.target.value, setNpsn)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Fase / Kelas Rapor</label>
              <input
                type="text"
                value={faseKelas}
                onChange={(e) => updateMetadataField("kosp_fase_kelas", e.target.value, setFaseKelas)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Tempat Penerbitan</label>
              <input
                type="text"
                value={tempatLaporan}
                onChange={(e) => updateMetadataField("kosp_tempat", e.target.value, setTempatLaporan)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Alamat Sekolah (Jalan)</label>
              <input
                type="text"
                value={alamat}
                onChange={(e) => updateMetadataField("kosp_alamat_sekolah", e.target.value, setAlamat)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Kelurahan</label>
              <input
                type="text"
                value={kelurahan}
                onChange={(e) => updateMetadataField("kosp_kelurahan", e.target.value, setKelurahan)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Kecamatan</label>
              <input
                type="text"
                value={kecamatan}
                onChange={(e) => updateMetadataField("kosp_kecamatan", e.target.value, setKecamatan)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Kabupaten / Kota</label>
              <input
                type="text"
                value={kabupaten}
                onChange={(e) => updateMetadataField("kosp_kabupaten", e.target.value, setKabupaten)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Provinsi</label>
              <input
                type="text"
                value={provinsi}
                onChange={(e) => updateMetadataField("kosp_provinsi", e.target.value, setProvinsi)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Nama Guru Kelas / Wali</label>
              <input
                type="text"
                value={namaGuru}
                onChange={(e) => updateMetadataField("omega_nama_guru", e.target.value, setNamaGuru)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">NIP Guru Kelas</label>
              <input
                type="text"
                value={nipGuru}
                onChange={(e) => updateMetadataField("omega_nip_guru", e.target.value, setNipGuru)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={kepalaSekolah}
                onChange={(e) => updateMetadataField("omega_kepala_sekolah", e.target.value, setKepalaSekolah)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={nipKepala}
                onChange={(e) => updateMetadataField("omega_nip_kepala", e.target.value, setNipKepala)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 text-xs rounded-lg text-white font-sans focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 1.2 KOSP SYNC & FACTUAL INTEGRITY PANEL - Hidden inside clean preview mode */}
      {activePage !== 'all' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 no-print text-left">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 mt-0.5">
              <Sparkles className="w-5 h-5 shrink-0" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-sm tracking-wide text-zinc-100 uppercase">SINKRONISASI KOSP & VALIDASI NILAI FAKTUAL</h3>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider border ${
                  localStorage.getItem("kosp_class_configs") !== null 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {localStorage.getItem("kosp_class_configs") !== null ? "✓ KOSP TERKONEKSI" : "⚠️ KOSP FALLBACK DEFAULT"}
                </span>
              </div>
              
              <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
                Daftar mata pelajaran & ekstrakurikuler pada Lembar Rapor ini <b>WAJIB</b> diselaraskan dengan dokumen <b>Kurikulum Operasional Satuan Pendidikan (KOSP)</b>. Sebelum mengunduh atau mencetak Rapor, harap pastikan pilihan mata pelajaran di menu KOSP telah dikonfigurasi dengan benar sesuai kekhasan sekolah Anda.
              </p>
            </div>
          </div>

          {/* FACTUAL GRADE CHECKER BENTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1.5">
            {/* Left Block: Subject Sync Status */}
            <div className="bg-zinc-900/40 p-4 border border-zinc-800/60 rounded-xl">
              <h4 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black mb-2.5 flex items-center gap-1.5">
                <span>Mata Pelajaran Aktif ({faseKelas})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {getKospSelectedSubjectsForRapor().map((key) => {
                  const meta = getSubjectRaporInfo(key);
                  const realGrades = fetchRealGradeFromDaftarNilai(key, activeStudent.namaLengkap);
                  const hasRealData = realGrades !== null;
                  const score = realGrades ? realGrades.score : null;
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-2 bg-zinc-900/60 border border-zinc-850 rounded-lg">
                      <span className="text-zinc-300 font-medium truncate max-w-[170px]" title={meta.name}>{meta.name}</span>
                      <span className={`px-1.5 py-0.5 font-mono text-[9px] rounded font-bold border ${
                        hasRealData 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {hasRealData ? `Faktual: ${score}` : "Kosong: 75"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Block: Integrity Notice & Quick Checks */}
            <div className="bg-zinc-900/40 p-4 border border-zinc-800/60 rounded-xl flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h4 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-black mb-1.5 flex items-center gap-1.5">
                  <span>Pernyataan Integritas Nilai & Persistensi</span>
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Rapor ini dirancang berdasarkan nilai riil yang diinput oleh guru pada menu <b>Daftar Nilai</b> dan kehadiran dari kartu <b>Absensi</b> ("Bukan Rekayasa Generik"). Semua data tersimpan permanen di LocalStorage browser sehingga aman terhadap halaman yang disegarkan, komputer mati, atau mati lampu.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 text-[10px] font-bold font-mono">
                <div className="flex items-center gap-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded">
                  <span>✓</span> No-Print Fields Editable
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded">
                  <span>✓</span> Auto-Save Active
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded">
                  <span>✓</span> KOSP Aligned
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE PREMIUM PREVIEW CONTEXT - STRICT A4 EXPANDED NATURALLY INTO SINGLE WINDOW SCROLL */}
      {activePage === 'all' ? (
        <div className="w-full flex flex-col items-center gap-10 p-6 select-none no-print bg-zinc-200/60 rounded-3xl border border-zinc-300 shadow-inner">
          {((['cover', 'school', 'student', 'nilai1', 'nilai2', 'cover_back'] as const).map((pageName) => {
            const pageConfig = getPageContainerStyles(pageName);
            return (
              <div 
                key={pageName}
                className={`${pageConfig.className} relative`}
                style={pageConfig.style}
              >
                {renderPage(pageName)}
              </div>
            );
          }))}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8 p-6 select-none no-print bg-zinc-200/60 rounded-3xl border border-zinc-300 shadow-inner justify-center items-center">
          {activePage === 'cover' ? (
            <>
              {/* Cover Depan */}
              <div 
                className="mx-auto font-serif rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.15)] p-[1.5cm_1.2cm] text-center relative overflow-hidden transition-all duration-300 transform flex flex-col justify-between shrink-0 rapor-page-cover"
                style={{ 
                  boxSizing: 'border-box',
                  width: '210mm',
                  minWidth: '210mm',
                  maxWidth: '210mm',
                  height: '297mm',
                  minHeight: '297mm',
                  maxHeight: '297mm'
                }}
              >
                {renderPage('cover')}
              </div>

              {/* Cover Belakang */}
              <div 
                className="mx-auto font-serif rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.15)] p-[1.5cm_1.2cm] text-center relative overflow-hidden transition-all duration-300 transform flex flex-col justify-between shrink-0 rapor-page-cover"
                style={{ 
                  boxSizing: 'border-box',
                  width: '210mm',
                  minWidth: '210mm',
                  maxWidth: '210mm',
                  height: '297mm',
                  minHeight: '297mm',
                  maxHeight: '297mm'
                }}
              >
                {renderPage('cover_back')}
              </div>
            </>
          ) : (
            <div 
              className={`mx-auto font-serif rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.15)] p-[1.5cm_1.2cm] text-center relative overflow-hidden transition-all duration-300 transform flex flex-col justify-between shrink-0 ${
                activePage === 'cover_back' 
                  ? 'rapor-page-cover' 
                  : 'rapor-page-paper'
              }`} 
              style={{ 
                boxSizing: 'border-box',
                width: '210mm',
                minWidth: '210mm',
                maxWidth: '210mm',
                minHeight: '297mm',
                ...(activePage === 'cover_back' || activePage === 'cover' ? {
                  height: '297mm',
                  maxHeight: '297mm'
                } : {})
              }}
            >

          {/* PAGE 2: INFORMASI SEKOLAH */}
          {activePage === 'school' && (
            <div className="w-full flex-1 flex flex-col justify-start space-y-8 animate-fade-in text-left font-serif py-4">
              <div className="text-center space-y-2 pb-10">
                <h1 className="text-2xl font-black tracking-wider text-zinc-900 leading-tight text-center">
                  RAPOR PESERTA DIDIK
                </h1>
                <h2 className="text-xl font-bold tracking-widest text-zinc-805 text-center">
                  {jenjangCombined}
                </h2>
              </div>

              {/* Key Values List */}
              <div className="space-y-5 text-sm max-w-[650px] mx-auto pt-6 leading-relaxed">
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Nama Sekolah</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans font-bold text-zinc-900">{schoolProfile.namaSekolah}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">NISN/NIS/NSS</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans"></span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">NPSN</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans font-bold">{schoolProfile.npsn}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Alamat Sekolah</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans text-zinc-800">{schoolProfile.alamat}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Kode Pos / Telp.</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans text-zinc-805">{schoolProfile.kodepos} &nbsp; / &nbsp; {schoolProfile.telp}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Kelurahan/Desa</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-zinc-800">{schoolProfile.kelurahan}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Kecamatan</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-zinc-800">{schoolProfile.kecamatan}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Kabupaten/Kota</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold text-zinc-900">{schoolProfile.kabupaten}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Provinsi</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-zinc-800">{schoolProfile.provinsi}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">E-mail</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans font-medium text-blue-800 underline">{schoolProfile.email}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 pb-2">
                  <span className="col-span-4 font-bold">Website</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans font-medium text-blue-800 underline break-all">{schoolProfile.website}</span>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: IDENTITAS PESERTA DIDIK - COMPACTED COHESIVELY */}
          {activePage === 'student' && (
            <div className="w-full flex-1 flex flex-col justify-between animate-fade-in text-left font-serif py-1">
              <h2 className="text-lg font-bold tracking-widest text-zinc-900 text-center uppercase border-b-2 border-zinc-900 pb-2 mb-3">
                IDENTITAS PESERTA DIDIK
              </h2>

              <div className="space-y-1.5 text-[11px] w-full max-w-[650px] mx-auto leading-relaxed">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Nama Peserta Didik</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold text-zinc-950 uppercase">{activeStudent.namaLengkap}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">NISN / NIS</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold font-sans">{activeStudent.nisnNis || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Tempat, Tanggal Lahir</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-sans">{activeStudent.tempatLahir || "-"}, {activeStudent.tanggalLahir || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Jenis Kelamin</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.jenisKelamin || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Agama</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.agama || "Katolik"}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Pendidikan Sebelumnya</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.pendidikanSebelum || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-4 font-medium">Alamat Peserta Didik</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.alamatSiswa || "-"}</span>
                </div>

                <div className="pt-1.5 font-bold border-t border-zinc-200 mt-1">Nama Orang Tua</div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Ayah</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold">{activeStudent.namaAyah || "-"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Ibu</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold">{activeStudent.namaIbu || "-"}</span>
                </div>

                <div className="pt-1 font-bold">Pekerjaan Orang Tua</div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Ayah</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.pekerjaanAyah || "Tani"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Ibu</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.pekerjaanIbu || "Ibu Rumah Tangga"}</span>
                </div>

                <div className="pt-1.5 font-bold border-t border-zinc-200">Alamat Orang Tua</div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Kabupaten / Kota</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.ortuKabupaten || "Timor Tengah Utara"}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Provinsi</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.ortuProvinsi || "Nusa Tenggara Timur"}</span>
                </div>

                <div className="pt-1.5 font-bold border-t border-zinc-200">Wali Peserta Didik</div>
                <div className="grid grid-cols-12 gap-1 pl-4">
                  <span className="col-span-4">Nama Wali</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7">{activeStudent.waliNama || "-"}</span>
                </div>
              </div>

              {/* Date & Signatures bottom - closely grouped to meet strict official report layout */}
              <div className="pt-4 flex justify-center gap-24 items-end text-xs mt-3">
                {/* Visual Passport Photo Area */}
                {activeStudent.photo ? (
                  <div style={{ width: '3cm', height: '4cm' }} className="border border-zinc-950 bg-zinc-50 overflow-hidden shadow-sm rounded relative">
                    <img src={activeStudent.photo} alt="Foto Murid" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div style={{ width: '3cm', height: '4cm' }} className="border-2 border-dashed border-zinc-950 bg-zinc-50 flex flex-col items-center justify-center text-center p-1.5 shadow-sm rounded">
                    <User className="w-6 h-6 text-zinc-300 mb-1" />
                    <span className="text-[9px] font-sans text-zinc-400 font-bold leading-tight">PAS FOTO<br/>3 X 4</span>
                  </div>
                )}

                <div className="text-center w-48 space-y-12">
                  <div>
                    <p className="font-sans text-[10px] text-zinc-700">{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
                    <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah,</p>
                  </div>
                  <div>
                    <p className="font-bold underline text-zinc-950">{schoolProfile.kepalaSekolah}</p>
                    <p className="font-sans text-[10px] text-zinc-650 leading-none">NIP. {schoolProfile.nipKepala}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: NILAI & CAPAIAN */}
          {activePage === 'nilai1' && (
            <div className="w-full flex-1 flex flex-col justify-start space-y-6 animate-fade-in text-left font-serif py-1">
              {/* Header Info Banner like Page 4 screenshot */}
              <div className="grid grid-cols-12 gap-x-6 gap-y-1 text-xs border-b border-zinc-300 pb-4">
                <div className="col-span-6 space-y-1">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4">Nama Siswa</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-7 font-bold uppercase">{activeStudent.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4">NISN/NIS</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-7 font-sans font-bold">{activeStudent.nisnNis || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4">Sekolah</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-7 font-bold">{schoolProfile.namaSekolah}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4">Alamat</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-7">{schoolProfile.alamat}</span>
                  </div>
                </div>

                <div className="col-span-6 space-y-1 pl-4">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5">Kelas / Fase</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6 font-bold">{schoolProfile.faseKelas}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5">Semester</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6 font-bold">{semester} ({semester === 1 ? "Ganjil" : "Genap"})</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5">Tahun Pelajaran</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6 font-sans font-bold">{tahunPelajaran}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  DAFTAR NILAI RAPOR HASIL BELAJAR
                </h3>
              </div>

              {/* Main Subject Grades Table */}
              <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '6%' }}>No</th>
                    <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '24%' }}>Mata Pelajaran</th>
                    <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '12%' }}>Nilai Akhir</th>
                    <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '58%' }}>Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedSubjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="border-2 border-zinc-900 p-2 text-center font-mono" style={{ width: '6%' }}>{idx + 1}</td>
                      <td className="border-2 border-zinc-900 p-2 font-bold whitespace-normal break-words" style={{ width: '24%' }}>{sub.name}</td>
                      <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans text-sm" style={{ width: '12%' }}>{sub.score}</td>
                      <td className="border-2 border-zinc-900 p-2 text-[10px] leading-relaxed font-sans space-y-1 whitespace-normal break-words" style={{ width: '58%' }}>
                        <div>
                          <span className="font-bold text-zinc-950 block">Capaian Kompetensi Tertinggi:</span>
                          <span className="text-zinc-800 text-[10px] whitespace-normal break-words">{sub.highCompetency}</span>
                        </div>
                        <div className="pt-2">
                          <span className="font-bold text-zinc-950 block">Capaian Kompetensi Terendah:</span>
                          <span className="text-zinc-800 text-[10px] whitespace-normal break-words">{sub.lowCompetency}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-[10px] text-zinc-400 font-sans italic text-right mt-1 no-print">
                * Halaman 1 Nilai Rapor selesai. Klik tab 'Dua' untuk melihat Ekstrakurikuler, Absensi, & Tanda Tangan.
              </div>
            </div>
          )}

          {/* PAGE 5: EKSTRA, ABSENSI, & TANGAN */}
          {activePage === 'nilai2' && (
            <div className="w-full flex-1 flex flex-col justify-start space-y-6 animate-fade-in text-left font-serif py-1">
              <div className="text-center pb-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-2">
                  EKSTRAKURIKULER, KETIDAKHADIRAN, & CATATAN
                </h3>
              </div>

              {/* 1. EXTRACTED EXTRAS TABLE */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  A. Kegiatan Ekstrakurikuler
                </h4>
                <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                  <thead>
                    <tr className="bg-zinc-100">
                      <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '8%' }}>No</th>
                      <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '42%' }}>Kegiatan Ekstrakurikuler</th>
                      <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '50%' }}>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getKospSelectedExtras().map((extraKey, idx) => {
                      const info = getExtraInfoForKey(extraKey);
                      return (
                        <tr key={idx}>
                          <td className="border-2 border-zinc-900 p-2 text-center font-mono" style={{ width: '8%' }}>{idx + 1}</td>
                          <td className="border-2 border-zinc-900 p-2 font-bold whitespace-normal break-words" style={{ width: '42%' }}>{info.name}</td>
                          <td className="border-2 border-zinc-900 p-2 text-[11px] leading-relaxed whitespace-normal break-words" style={{ width: '50%' }}>{info.value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2. CATATAN GURU */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  B. Catatan Wali Kelas
                </h4>
                <textarea
                  value={activeStudent.catatanGuru || ""}
                  onChange={(e) => handleUpdateStudentField("catatanGuru", e.target.value)}
                  placeholder="Tulis catatan perkembangan karakter & akademis siswa di sini..."
                  className="w-full border-2 border-zinc-950 p-3 min-h-[110px] text-xs font-sans leading-relaxed bg-white focus:bg-zinc-50 outline-none rounded-none resize-none overflow-hidden"
                  rows={4}
                />
              </div>

              {/* 3. ATTENDANCE & ATTENDANCE MAP */}
              <div className="grid grid-cols-12 gap-6 pt-2">
                <div className="col-span-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    C. Ketidakhadiran (Absensi)
                  </h4>
                  {realAttendance ? (
                    <div className="space-y-1">
                      <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                        <thead>
                          <tr className="bg-zinc-100/50">
                            <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '70%', fontWeight: 'bold' }}>Keterangan</th>
                            <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%', fontWeight: 'bold' }}>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Sakit</td>
                            <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalSakit}</td>
                          </tr>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Izin</td>
                            <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalIzin}</td>
                          </tr>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Tanpa Keterangan</td>
                            <td className="border-2 border-zinc-900 p-2 text-center font-bold font-sans" style={{ width: '30%' }}>{totalAlpa}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <table className="w-full border-2 border-zinc-900 border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%', minWidth: '100%', maxWidth: '100%' }}>
                        <thead>
                          <tr className="bg-zinc-100/50">
                            <th className="border-2 border-zinc-900 p-2 text-left" style={{ width: '70%', fontWeight: 'bold' }}>Keterangan</th>
                            <th className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%', fontWeight: 'bold' }}>Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Sakit</td>
                            <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                              <input
                                type="number"
                                min="0"
                                value={activeStudent.sakit || "0"}
                                onChange={(e) => handleUpdateStudentField("sakit", e.target.value)}
                                className="rapor-cell-input w-full"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Izin</td>
                            <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                              <input
                                type="number"
                                min="0"
                                value={activeStudent.izin || "0"}
                                onChange={(e) => handleUpdateStudentField("izin", e.target.value)}
                                className="rapor-cell-input w-full"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border-2 border-zinc-900 p-2" style={{ width: '70%' }}>Tanpa Keterangan</td>
                            <td className="border-2 border-zinc-900 p-2 text-center" style={{ width: '30%' }}>
                              <input
                                type="number"
                                min="0"
                                value={activeStudent.alpa || "0"}
                                onChange={(e) => handleUpdateStudentField("alpa", e.target.value)}
                                className="rapor-cell-input w-full"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
 
                {/* DECISION AREA IF SEMESTER 2 AREA */}
                <div className="col-span-6 space-y-2 flex flex-col justify-end">
                  {semester === 2 ? (
                    <div className="border-2 border-zinc-900 p-3 bg-zinc-50 flex flex-col justify-center min-h-[90px]">
                      <span className="text-[10px] uppercase font-bold text-zinc-650 block mb-1">Keputusan Kelulusan / Kenaikan Kelas:</span>
                      <div className="text-xs font-bold text-zinc-900 leading-normal font-sans">
                        Berdasarkan pencapaian hasil belajar, ditetapkan: <br/>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-300 py-1 px-2 rounded font-black inline-block text-[11px]">
                            NAIK KE KELAS:
                          </span>
                          <input
                            type="text"
                            value={activeStudent.naikKeKelas || "V (Lima)"}
                            onChange={(e) => handleUpdateStudentField("naikKeKelas", e.target.value)}
                            placeholder="V (Lima)"
                            className="bg-white border-2 border-emerald-600 text-emerald-800 font-extrabold px-2 py-1 rounded text-xs w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-zinc-900 p-3 bg-zinc-50 flex items-center justify-center min-h-[90px] italic text-zinc-500 text-xs text-center leading-relaxed">
                      Keputusan Kenaikan kelas atau kelulusan ditentukan pada laporan penilaian Semester Akhir (Semester 2).
                    </div>
                  )}        </div>
              </div>

              {/* 4. SIGNATURES AREA FOR OFFICIAL RECORD - SIDE BY SIDE FOR COMPACT ELEGANCE */}
              <div className="pt-4 text-[11px] font-serif leading-normal" style={{ marginTop: 'auto' }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col justify-between h-[135px]">
                    <div>
                      <p className="invisible text-[8px]">Date Space Placeholder</p>
                      <p>Mengetahui,</p>
                      <p className="font-bold">Orang Tua/Wali,</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-zinc-950 truncate max-w-[180px] mx-auto leading-tight" title={getParentSignatureName()}>{getParentSignatureName()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[135px]">
                    <div>
                      <p className="invisible text-[8px]">Date Space Placeholder</p>
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala Sekolah,</p>
                    </div>
                    <div>
                      <p className="p-0 m-0 font-bold underline text-zinc-950 truncate leading-none" title={schoolProfile.kepalaSekolah}>{schoolProfile.kepalaSekolah}</p>
                      <p className="font-sans text-[8px] text-zinc-500 leading-none mt-0.5">NIP. {schoolProfile.nipKepala}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between h-[135px]">
                    <div>
                      <p className="font-sans text-[9px] text-zinc-500 leading-none block mb-0.5">{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
                      <p>Wali Kelas / Guru Kelas,</p>
                    </div>
                    <div>
                      <p className="p-0 m-0 font-bold underline text-zinc-950 truncate leading-none" title={schoolProfile.namaGuru}>{schoolProfile.namaGuru}</p>
                      <p className="font-sans text-[8px] text-zinc-500 leading-none mt-0.5">NIP. {schoolProfile.nipGuru}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )}

      {/* Dynamic Screen Style to Hide Raw Printer Element on Screen */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          #omega-rapor-printable-root {
            display: none !important;
          }
        }
      `}} />

      {/* 3. HARDCOPY STANDARD STYLING FOR ACTUAL PRINT ENGINE */}
      <div id="omega-rapor-printable-root" className="only-print bg-white text-zinc-950 font-serif">
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4;
            margin: 0 !important;
          }
          @media print {
            body {
              background-color: #ffffff !important;
              color: #000000 !important;
              font-family: Garamond, "Times New Roman", serif !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, header, nav, footer, button, select, input {
              display: none !important;
            }
            .only-print {
              display: block !important;
            }
            .rapor-page-break {
              page-break-after: always !important;
              page-break-inside: avoid !important;
              clear: both !important;
              position: relative !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              margin: 0 auto !important;
              padding: 15mm 20mm !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              background-color: #ffffff !important;
            }
            .rapor-page-break:last-child {
              page-break-after: avoid !important;
            }
            .rapor-page-break.print-cover-page {
              padding: 1.2cm 1cm !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: auto !important;
            }
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
          }
        `}} />

        {/* PRINT PAGE 1: COVER */}
        <div className="rapor-page-break print-cover-page text-center flex flex-col justify-between items-center" style={{ 
          position: 'relative',
          background: '#ffffff',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          border: `12px double ${levelBorderColor}`,
          padding: '1.2cm 1cm',
          boxSizing: 'border-box',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}>
          {/* Outer Decorative Certificate Border */}
          <div style={{ position: 'absolute', top: '10mm', bottom: '10mm', left: '10mm', right: '10mm', border: `6px double ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', top: '13mm', bottom: '13mm', left: '13mm', right: '13mm', border: '1px solid rgba(0,0,0,0.08)' }} />
          
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: '15mm', left: '15mm', width: '20px', height: '20px', borderTop: `2px solid ${levelBorderColor}`, borderLeft: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', top: '15mm', right: '15mm', width: '20px', height: '20px', borderTop: `2px solid ${levelBorderColor}`, borderRight: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', bottom: '15mm', left: '15mm', width: '20px', height: '20px', borderBottom: `2px solid ${levelBorderColor}`, borderLeft: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', bottom: '15mm', right: '15mm', width: '20px', height: '20px', borderBottom: `2px solid ${levelBorderColor}`, borderRight: `2px solid ${levelBorderColor}` }} />

          <div className="pt-12" style={{ zIndex: 10 }}>
            <img 
              src={getActiveMinistryLogo()} 
              alt="LOGO" 
              style={{ 
                width: '95px', 
                height: '95px', 
                margin: '0 auto', 
                background: 'transparent', 
                mixBlendMode: 'multiply', 
                border: 'none', 
                outline: 'none', 
                boxShadow: 'none',
                filter: 'none'
              }} 
            />
          </div>

          <div style={{ marginTop: '20px', zIndex: 10 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '4px', margin: '0 0 10px 0', color: '#111827' }}>RAPOR</h1>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '3px', margin: '0 0 10px 0', color: '#374151' }}>PESERTA DIDIK</h2>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 5px 0', color: '#4b5563' }}>{jenjangFull}</h3>
            <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: '#4b5563' }}>{jenjangShort}</span>
          </div>

          <div style={{ width: '80%', margin: '40px auto', textAlign: 'center', zIndex: 10 }}>
            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontFamily: 'sans-serif', fontSize: '13px', margin: '0 0 5px 0', color: '#4b5563' }}>Nama Peserta Didik :</p>
              <div style={{ border: `2px solid ${levelBorderColor}`, padding: '12px', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#111827', background: '#ffffff' }}>
                {activeStudent.namaLengkap}
              </div>
            </div>

            <div>
              <p style={{ fontFamily: 'sans-serif', fontSize: '13px', margin: '0 0 5px 0', color: '#4b5563' }}>NISN / NIS :</p>
              <div style={{ border: `2px solid ${levelBorderColor}`, padding: '12px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', color: '#111827', background: '#ffffff' }}>
                {activeStudent.nisnNis || "-"}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px', zIndex: 10 }}>
            <p style={{ fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px 0', color: '#111827' }}>
              KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH
            </p>
            <p style={{ fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', margin: '0', color: '#4b5563' }}>
              REPUBLIK INDONESIA
            </p>
          </div>
        </div>

        {/* PRINT PAGE 2: INFORMASI SEKOLAH */}
        <div className="rapor-page-break text-left font-serif">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>RAPOR PESERTA DIDIK</h1>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{jenjangCombined}</h2>
          </div>

          <div style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', lineHeight: '2.5' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '200px', fontWeight: 'bold' }}>Nama Sekolah</td>
                  <td style={{ width: '20px', textAlign: 'center' }}>:</td>
                  <td style={{ fontSize: '15px', fontWeight: 'bold' }}>{schoolProfile.namaSekolah}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>NISN/NIS/NSS</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>NPSN</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontFamily: 'sans-serif' }}>{schoolProfile.npsn}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Alamat Sekolah</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.alamat}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Kode Pos / Pelp.</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.kodepos} &nbsp; / &nbsp; {schoolProfile.telp}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Kelurahan/Desa</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.kelurahan}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Kecamatan</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.kecamatan}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Kabupaten/Kota</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{schoolProfile.kabupaten}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Provinsi</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.provinsi}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>E-mail</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{schoolProfile.email}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Website</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontFamily: 'sans-serif', wordBreak: 'break-all' }}>{schoolProfile.website}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PRINT PAGE 3: IDENTITAS PESERTA DIDIK */}
        <div className="rapor-page-break text-left font-serif">
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            IDENTITAS PESERTA DIDIK
          </h2>

          <div style={{ fontSize: '13px', lineHeight: '1.85' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '220px' }}>Nama Peserta Didik</td>
                  <td style={{ width: '20px', textAlign: 'center' }}>:</td>
                  <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{activeStudent.namaLengkap}</td>
                </tr>
                <tr>
                  <td>NISN / NIS</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>{activeStudent.nisnNis || "-"}</td>
                </tr>
                <tr>
                  <td>Tempat, Tanggal Lahir</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.tempatLahir || "-"}, {activeStudent.tanggalLahir || "-"}</td>
                </tr>
                <tr>
                  <td>Jenis Kelamin</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.jenisKelamin || "-"}</td>
                </tr>
                <tr>
                  <td>Agama</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.agama || "Katolik"}</td>
                </tr>
                <tr>
                  <td>Pendidikan Sebelumnya</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.pendidikanSebelum || "-"}</td>
                </tr>
                <tr>
                  <td>Alamat Peserta Didik</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.alamatSiswa || "-"}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 'bold', paddingTop: '15px' }}>Nama Orang Tua</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Ayah</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{activeStudent.namaAyah || "-"}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Ibu</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{activeStudent.namaIbu || "-"}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 'bold', paddingTop: '10px' }}>Pekerjaan Orang Tua</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Ayah</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.pekerjaanAyah || "Tani"}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Ibu</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.pekerjaanIbu || "Ibu Rumah Tangga"}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 'bold', paddingTop: '10px' }}>Alamat Orang Tua</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Kabupaten / Kota</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.ortuKabupaten || "Timor Tengah Utara"}</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Provinsi</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.ortuProvinsi || "Nusa Tenggara Timur"}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ fontWeight: 'bold', paddingTop: '10px' }}>Wali Peserta Didik</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>Nama Wali</td>
                  <td style={{ textAlign: 'center' }}>:</td>
                  <td>{activeStudent.waliNama || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Decreased spacing constraints & lowered slightly by expanding margin top */}
          <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '80px', alignItems: 'flex-end' }}>
            {activeStudent.photo ? (
              <div style={{ width: '3cm', height: '4cm', border: '1px solid #000', overflow: 'hidden', position: 'relative' }}>
                <img src={activeStudent.photo} alt="Foto Murid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ width: '3cm', height: '4cm', border: '1px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '10px', textAlign: 'center', fontFamily: 'sans-serif', color: '#000' }}>
                PAS FOTO<br/>3 X 4
              </div>
            )}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#000', width: '220px' }}>
              <p>{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
              <div style={{ margin: '5px 0 75px 0' }}>
                <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                <p style={{ fontWeight: 'bold', margin: '0' }}>Kepala Sekolah,</p>
              </div>
              <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>{schoolProfile.kepalaSekolah}</p>
              <p style={{ fontFamily: 'sans-serif', fontSize: '11px', margin: '0' }}>NIP. {schoolProfile.nipKepala}</p>
            </div>
          </div>
        </div>

        {/* PRINT PAGE 4: CONTENT VALUE 1 */}
        <div className="rapor-page-break font-serif">
          <div style={{ fontSize: '11px', borderBottom: '1px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '110px' }}>Nama Siswa</td>
                  <td style={{ width: '15px' }}>:</td>
                  <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{activeStudent.namaLengkap}</td>
                  <td style={{ width: '110px', paddingLeft: '30px' }}>Kelas / Fase</td>
                  <td style={{ width: '15px' }}>:</td>
                  <td style={{ fontWeight: 'bold' }}>{schoolProfile.faseKelas}</td>
                </tr>
                <tr>
                  <td>NISN/NIS</td>
                  <td>:</td>
                  <td style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>{activeStudent.nisnNis || "-"}</td>
                  <td style={{ paddingLeft: '30px' }}>Semester</td>
                  <td>:</td>
                  <td style={{ fontWeight: 'bold' }}>{semester} ({semester === 1 ? "Ganjil" : "Genap"})</td>
                </tr>
                <tr>
                  <td>Sekolah</td>
                  <td>:</td>
                  <td style={{ fontWeight: 'bold' }}>{schoolProfile.namaSekolah}</td>
                  <td style={{ paddingLeft: '30px' }}>Tahun Pelajaran</td>
                  <td>:</td>
                  <td style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>{tahunPelajaran}</td>
                </tr>
                <tr>
                  <td>Alamat</td>
                  <td>:</td>
                  <td>{schoolProfile.alamat}</td>
                  <td style={{ paddingLeft: '30px' }}></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: '15px' }}>
            DAFTAR NILAI RAPOR HASIL BELAJAR
          </h3>

          <table style={{ width: '100%', border: '2px solid #000', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ backgroundColor: 'transparent' }}>
                <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '30px' }}>No</th>
                <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'left', width: '220px' }}>Mata Pelajaran</th>
                <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '60px' }}>Nilai Akhir</th>
                <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'left' }}>Capaian Kompetensi</th>
              </tr>
            </thead>
            <tbody>
              {resolvedSubjects.map((sub, idx) => (
                <tr key={idx}>
                  <td style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', fontFamily: 'sans-serif' }}>{idx + 1}</td>
                  <td style={{ border: '2px solid #000', padding: '6px', fontWeight: 'bold' }}>{sub.name}</td>
                  <td style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', fontFamily: 'sans-serif' }}>{sub.score}</td>
                  <td style={{ border: '2px solid #000', padding: '6px', fontSize: '9px', lineHeight: '1.4', fontFamily: 'sans-serif' }}>
                    <div style={{ margin: '0 0 3px 0' }}>
                      <strong style={{ display: 'block', color: '#000' }}>Capaian Kompetensi Tertinggi:</strong>
                      <span style={{ color: '#111' }}>{sub.highCompetency}</span>
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <strong style={{ display: 'block', color: '#000' }}>Capaian Kompetensi Terendah:</strong>
                      <span style={{ color: '#111' }}>{sub.lowCompetency}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PRINT PAGE 5: CONTENT VALUE 2 */}
        <div className="rapor-page-break font-serif">
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '15px', textTransform: 'uppercase' }}>
            LAPORAN PERKEMBANGAN EKSTRAKURIKULER & ABSENSI
          </h3>

          <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
            A. Kegiatan Ekstrakurikuler
          </h4>
          <table style={{ width: '100%', border: '2px solid #000', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: 'transparent' }}>
                <th style={{ border: '2px solid #000', padding: '5px', textAlign: 'center', width: '35px' }}>No</th>
                <th style={{ border: '2px solid #000', padding: '5px', textAlign: 'left', width: '200px' }}>Kegiatan Ekstrakurikuler</th>
                <th style={{ border: '2px solid #000', padding: '5px', textAlign: 'left' }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {getKospSelectedExtras().map((extraKey, idx) => {
                const info = getExtraInfoForKey(extraKey);
                return (
                  <tr key={idx}>
                    <td style={{ border: '2px solid #000', padding: '5px', textAlign: 'center', fontFamily: 'sans-serif' }}>{idx + 1}</td>
                    <td style={{ border: '2px solid #000', padding: '5px', fontWeight: 'bold' }}>{info.name}</td>
                    <td style={{ border: '2px solid #000', padding: '5px', fontSize: '10px', lineHeight: '1.4' }}>{info.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
            B. Catatan Wali Kelas
          </h4>
          <div style={{ border: '2px solid #000', padding: '8px', fontSize: '11px', lineHeight: '1.5', fontFamily: 'sans-serif', marginBottom: '10px', backgroundColor: 'transparent' }}>
            {activeStudent.catatanGuru || "Tunjukkan terus kedisiplinan dan asah minat bakat belajar secara berkelanjutan untuk hasil optimal di masa mendatang."}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
            <div style={{ flex: '1' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                C. Ketidakhadiran
              </h4>
              <table style={{ width: '100%', border: '2px solid #000', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f4f4f5' }}>
                    <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'left', fontWeight: 'bold' }}>Keterangan</th>
                    <th style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '70px', fontWeight: 'bold' }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '2px solid #000', padding: '6px' }}>Sakit</td>
                    <td style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '70px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>{totalSakit}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '2px solid #000', padding: '6px' }}>Izin</td>
                    <td style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '70px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>{totalIzin}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '2px solid #000', padding: '6px' }}>Tanpa Keterangan</td>
                    <td style={{ border: '2px solid #000', padding: '6px', textAlign: 'center', width: '70px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>{totalAlpa}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {semester === 2 && (
                <div style={{ border: '2px solid #000', padding: '10px', backgroundColor: 'transparent' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '3px' }}>Keputusan Kelulusan / Kenaikan Kelas:</span>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0', fontFamily: 'sans-serif' }}>
                    Peserta didik ditetapkan: <br/>
                    <strong style={{ fontSize: '12px' }}>STATUS KELULUSAN / KENAIKAN KELAS: {activeStudent.naikKeKelas || "V (Lima)"}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3-COLUMN SIGNATURE BLOCK FOR PRECISE A4 FIT - PROPORTIONAL & STABILIZED */}
          <div style={{ marginTop: '20px', fontSize: '11px', fontFamily: 'serif', color: '#000' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '135px' }}>
                <div>
                  <p style={{ visibility: 'hidden', margin: '0', fontSize: '8px' }}>Date placeholder</p>
                  <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>Orang Tua/Wali,</p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ margin: '0', fontWeight: 'bold', textDecoration: 'underline' }}>{getParentSignatureName()}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '135px' }}>
                <div>
                  <p style={{ visibility: 'hidden', margin: '0', fontSize: '8px' }}>Date placeholder</p>
                  <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>Kepala Sekolah,</p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>{schoolProfile.kepalaSekolah}</p>
                  <p style={{ fontFamily: 'sans-serif', fontSize: '8px', margin: '2px 0 0 0', color: '#333' }}>NIP. {schoolProfile.nipKepala}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '135px' }}>
                <div>
                  <p style={{ fontFamily: 'sans-serif', fontSize: '9px', margin: '0 0 2px 0', color: '#333' }}>{schoolProfile.tempatLaporan}, {tanggalLaporan}</p>
                  <p style={{ margin: '0 0 2px 0' }}>Wali Kelas / Guru Kelas,</p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: '0' }}>{schoolProfile.namaGuru}</p>
                  <p style={{ fontFamily: 'sans-serif', fontSize: '8px', margin: '2px 0 0 0', color: '#333' }}>NIP. {schoolProfile.nipGuru}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRINT PAGE 6: COVER BELAKANG (EXACT MATCH TO FRONT COVER) */}
        <div className="rapor-page-break print-cover-page text-center flex flex-col justify-between items-center" style={{ 
          position: 'relative',
          background: '#ffffff',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          border: `12px double ${levelBorderColor}`,
          padding: '1.2cm 1cm',
          boxSizing: 'border-box',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}>
          {/* Outer Decorative Certificate Border matching screen cover */}
          <div style={{ position: 'absolute', top: '10mm', bottom: '10mm', left: '10mm', right: '10mm', border: `6px double ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', top: '13mm', bottom: '13mm', left: '13mm', right: '13mm', border: '1px solid rgba(0,0,0,0.08)' }} />
          
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: '15mm', left: '15mm', width: '20px', height: '20px', borderTop: `2px solid ${levelBorderColor}`, borderLeft: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', top: '15mm', right: '15mm', width: '20px', height: '20px', borderTop: `2px solid ${levelBorderColor}`, borderRight: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', bottom: '15mm', left: '15mm', width: '20px', height: '20px', borderBottom: `2px solid ${levelBorderColor}`, borderLeft: `2px solid ${levelBorderColor}` }} />
          <div style={{ position: 'absolute', bottom: '15mm', right: '15mm', width: '20px', height: '20px', borderBottom: `2px solid ${levelBorderColor}`, borderRight: `2px solid ${levelBorderColor}` }} />

          <div style={{ zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '500px', margin: '0 auto', paddingTop: '30mm' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center', width: '100%' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Catatan Penggunaan :</p>
              <div style={{ border: `2px dashed ${levelBorderColor}`, borderRadius: '8px', padding: '15px', fontSize: '12px', lineHeight: '1.6', textAlign: 'justify', color: '#374151', backgroundColor: '#ffffff' }}>
                Rapor Peserta Didik ini merupakan dokumen resmi yang diterbitkan oleh Lembaga Satuan Pendidikan untuk mendokumentasikan pencapaian kompetensi intrakurikuler dan kokurikuler secara objektif. Harap disimpan dengan baik, dijaga kebersihannya, dan ditunjukkan kepada Wali Kelas apabila diperlukan untuk keperluan administrasi sekolah lebih lanjut.
              </div>
            </div>
          </div>

          {/* Bottom container for small logo and Ministry text */}
          <div style={{ marginTop: 'auto', marginBottom: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            <img 
              src={getActiveMinistryLogo()} 
              alt="Logo" 
              style={{ 
                width: '35px', 
                height: '35px', 
                objectFit: 'contain', 
                background: 'transparent', 
                mixBlendMode: 'multiply', 
                border: 'none', 
                outline: 'none', 
                boxShadow: 'none',
                filter: 'none'
              }} 
            />
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '10px', fontFamily: 'sans-serif', fontWeight: '900', letterSpacing: '2px', color: '#111827', textTransform: 'uppercase' }}>
                KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontFamily: 'sans-serif', fontWeight: '700', letterSpacing: '2px', color: '#4b5563', textTransform: 'uppercase' }}>
                REPUBLIK INDONESIA
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RaporPanel;
