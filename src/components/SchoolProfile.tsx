import React, { useState, useEffect, useRef } from "react";
import { 
  School, 
  User, 
  Award, 
  Layers, 
  Calendar, 
  BookOpen, 
  Upload, 
  Lock, 
  Unlock, 
  Users, 
  FileText, 
  Check, 
  HelpCircle,
  Clock,
  Briefcase,
  Loader2,
  Save,
  Plus,
  Trash2
} from "lucide-react";
import { getTutWuriHandayaniLogo, getKemenagLogo, getDefaultSchoolLogo, compressImage } from "../utils/logoGenerator";

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

const DEFAULT_EXTRACURRICULARS: Record<string, string> = {
  pramuka: "Karakter Pramuka (Wajib)",
  paskibra: "Paskibra / PKS",
  pks: "UKS / PMR (Kesehatan)",
  olahraga: "Olahraga (Futsal, Badminton, Basket, dsb)",
  kesenian: "Seni (Paduan Suara, Tari, Teater, dsb)",
  keagamaan: "Kerohanian / Tadarus / Pendalaman Iman",
  sains: "KIR / Sains & Computer Club"
};

const DEFAULT_PROJECTS: Record<string, string> = {
  p5_gaya_hidup: "Gaya Hidup Berkelanjutan",
  p5_kearifan_lokal: "Kearifan Lokal",
  p5_bhinneka: "Bhinneka Tunggal Ika",
  p5_bangun_jiwa: "Bangunlah Jiwa dan Raganya",
  p5_suara_demokrasi: "Suara Demokrasi",
  p5_rekayasa_tekno: "Rekayasa dan Teknologi",
  p5_kewirausahaan: "Kewirausahaan",
  p5_kebekerjaan: "Kebekerjaan (Khusus SMK)"
};

interface SchoolProfileData {
  schoolName: string;
  kepalaSekolah: string;
  nipKepala: string;
  namaGuru: string;
  nipGuru: string;
  jabatan: string; // "Guru Kelas" | "Guru Mata Pelajaran"
  faseKelas: string;
  semester: string;
  tahunPelajaran: string;
  ketuaTimKosp: string;
  anggotaTimKosp: string;
  logo: string; // base64
  tempat: string;
  tanggal: string;
  alamat: string;
  npsn: string;
  website: string;
  email: string;
  telp: string;
  kelurahan: string;
  theme?: string; // fallback
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  kopBaris1: string; // Baris 1 KOP: PEMERINTAH KABUPATEN ...
  kopBaris2: string; // Baris 2 KOP: DINAS PENDIDIKAN DAN KEBUDAYAAN
  kopBaris4: string; // Baris 4 KOP: Alamat KOP Sekolah
}

export default function SchoolProfile() {
  const [activeStep, setActiveStep] = useState<"profil" | "kurikulum">("profil");

  const [jenjang, setJenjang] = useState<"SD" | "SMP" | "SMA" | "SMK">(() => {
    const saved = localStorage.getItem("profile_jenjang") || localStorage.getItem("kosp_jenjang");
    if (saved === "SD" || saved === "SMP" || saved === "SMA" || saved === "SMK") {
      return saved as "SD" | "SMP" | "SMA" | "SMK";
    }
    if (saved === "SMA/SMK") {
      const schoolName = (localStorage.getItem("kosp_nama_sekolah") || "").toUpperCase();
      if (schoolName.includes("SMK")) return "SMK";
      return "SMA";
    }
    const schoolName = (localStorage.getItem("kosp_nama_sekolah") || "").toUpperCase();
    if (schoolName.includes("SMP") || schoolName.includes("MTS")) return "SMP";
    if (schoolName.includes("SMK")) return "SMK";
    if (schoolName.includes("SMA") || schoolName.includes("MAN") || schoolName.includes("KEJURUAN")) return "SMA";
    return "SD";
  });

  const [customSubjects, setCustomSubjects] = useState<{ id: string; label: string }[]>(() => {
    try {
      const saved = localStorage.getItem("profile_custom_subjects");
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [customExtras, setCustomExtras] = useState<{ id: string; label: string }[]>(() => {
    try {
      const saved = localStorage.getItem("profile_custom_extras");
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [customProjects, setCustomProjects] = useState<{ id: string; label: string }[]>(() => {
    try {
      const saved = localStorage.getItem("profile_custom_projects");
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("profile_active_subjects");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial standard subjects default SD
    return ["agamaKatolik", "pancasila", "indonesia", "matematika", "ipas", "seniRupa", "pjok", "inggris"];
  });

  const [selectedExtras, setSelectedExtras] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("profile_active_extras");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["pramuka", "olahraga", "kesenian"];
  });

  const [selectedProjects, setSelectedProjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("profile_active_projects");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ["p5_kearifan_lokal", "p5_kewirausahaan"];
  });

  const [newSubjectText, setNewSubjectText] = useState("");
  const [newExtraText, setNewExtraText] = useState("");
  const [newProjectText, setNewProjectText] = useState("");

  const handleJenjangChange = (newJenjang: "SD" | "SMP" | "SMA" | "SMK") => {
    setJenjang(newJenjang);
    if (newJenjang === "SD") {
      setSelectedSubjects(Object.keys(DEFAULT_SD_SUBJECTS));
    } else if (newJenjang === "SMP") {
      setSelectedSubjects(Object.keys(DEFAULT_SMP_SUBJECTS));
    } else if (newJenjang === "SMA") {
      setSelectedSubjects(Object.keys(DEFAULT_SMA_SUBJECTS));
    } else {
      setSelectedSubjects(Object.keys(DEFAULT_SMK_SUBJECTS));
    }
  };

  const handleAddCustomSubject = () => {
    if (!newSubjectText.trim()) return;
    const id = `custom_subject_${Date.now()}`;
    const newObj = { id, label: newSubjectText.trim() };
    setCustomSubjects(prev => [...prev, newObj]);
    setSelectedSubjects(prev => [...prev, id]);
    setNewSubjectText("");
  };

  const handleAddCustomExtra = () => {
    if (!newExtraText.trim()) return;
    const id = `custom_extra_${Date.now()}`;
    const newObj = { id, label: newExtraText.trim() };
    setCustomExtras(prev => [...prev, newObj]);
    setSelectedExtras(prev => [...prev, id]);
    setNewExtraText("");
  };

  const handleAddCustomProject = () => {
    if (!newProjectText.trim()) return;
    const id = `custom_project_${Date.now()}`;
    const newObj = { id, label: newProjectText.trim() };
    setCustomProjects(prev => [...prev, newObj]);
    setSelectedProjects(prev => [...prev, id]);
    setNewProjectText("");
  };

  const handleRemoveCustomSubject = (id: string) => {
    setCustomSubjects(prev => prev.filter(item => item.id !== id));
    setSelectedSubjects(prev => prev.filter(key => key !== id));
  };

  const handleRemoveCustomExtra = (id: string) => {
    setCustomExtras(prev => prev.filter(item => item.id !== id));
    setSelectedExtras(prev => prev.filter(key => key !== id));
  };

  const handleRemoveCustomProject = (id: string) => {
    setCustomProjects(prev => prev.filter(item => item.id !== id));
    setSelectedProjects(prev => prev.filter(key => key !== id));
  };

  const [profile, setProfile] = useState<SchoolProfileData>(() => {
    let savedKepala = localStorage.getItem("kosp_kepala_sekolah");
    let savedNip = localStorage.getItem("kosp_nip_kepala");
    let savedSchoolName = localStorage.getItem("kosp_nama_sekolah");
    
    if (!savedSchoolName || savedSchoolName === "SDN Fatubai" || savedSchoolName === "SD Negeri Fatubai") {
      savedSchoolName = "SEKOLAH DASAR NEGERI FATUBAI";
      localStorage.setItem("kosp_nama_sekolah", savedSchoolName);
    }
    if (!savedKepala || savedKepala === "Regina Alvares, S.Pd") {
      savedKepala = "Darius Kusi, S.Pd., Gr";
      localStorage.setItem("kosp_kepala_sekolah", savedKepala);
      localStorage.setItem("omega_principal_name", savedKepala);
    }
    if (!savedNip || savedNip === "19780415 200501 2 011") {
      savedNip = "196709192008011008";
      localStorage.setItem("kosp_nip_kepala", savedNip);
      localStorage.setItem("omega_principal_nip", savedNip);
    }

    let savedKetua = localStorage.getItem("kosp_ketua_tim");
    if (!savedKetua || savedKetua === "Roni Hariyanto Bhidju, S.Pd") {
      savedKetua = localStorage.getItem("kosp_ketua_tim_penyusun") || "Roni Hariyanto Bhidju, S.Pd., Gr";
      localStorage.setItem("kosp_ketua_tim", savedKetua);
    }

    let savedAnggota = localStorage.getItem("kosp_anggota_tim");
    if (!savedAnggota || savedAnggota === "Yuliana Fatima, S.Pd; Fransiskus Xaverius, S.Pd; Maria Goreti, S.Pd") {
      const a1 = localStorage.getItem("kosp_anggota_1") || "Fransiskus Seda, S.Pd., Gr";
      const a2 = localStorage.getItem("kosp_anggota_2") || "Maria Krisanti Seo, S.Pd";
      const a3 = localStorage.getItem("kosp_anggota_3") || "Victoria Abi, S.Pd., Gr.";
      savedAnggota = `${a1}; ${a2}; ${a3}`;
      localStorage.setItem("kosp_anggota_tim", savedAnggota);
    }

    return {
      schoolName: savedSchoolName,
      kepalaSekolah: savedKepala,
      nipKepala: savedNip,
      namaGuru: localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr",
      nipGuru: localStorage.getItem("kosp_nip_guru") || "198603012020121005",
      jabatan: localStorage.getItem("kosp_jabatan_guru") || "Guru Kelas",
      faseKelas: localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B",
      semester: localStorage.getItem("kosp_semester") || "Semester 2 (Genap)",
      tahunPelajaran: localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025",
      ketuaTimKosp: savedKetua,
      anggotaTimKosp: savedAnggota,
      logo: localStorage.getItem("kosp_school_logo") || localStorage.getItem("kosp_logo_sekolah") || "",
      tempat: localStorage.getItem("kosp_tempat") || "Fatubai",
      tanggal: localStorage.getItem("kosp_tanggal") || "26 Juni 2025",
      alamat: localStorage.getItem("kosp_kop_baris4") || localStorage.getItem("kosp_lokasi") || "Fatubai, Desa Oehalo Kecamatan Insana Tengah -856713",
      npsn: localStorage.getItem("kosp_npsn") || "50300960",
      website: localStorage.getItem("kosp_website") || "https://sdn-fatubai-official.netlify.app/",
      email: localStorage.getItem("kosp_email") || "sdnfatubai@gmail.com",
      telp: localStorage.getItem("kosp_telp") || "082236015517",
      kelurahan: localStorage.getItem("kosp_kelurahan") || "Oehalo",
      kecamatan: localStorage.getItem("kosp_kecamatan") || "Insana Tengah",
      kabupaten: localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara",
      provinsi: localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur",
      kodePos: localStorage.getItem("kosp_kode_pos") || "85673",
      kopBaris1: localStorage.getItem("kosp_kop_baris1") || "PEMERINTAH KABUPATEN TIMOR TENGAH UTARA",
      kopBaris2: localStorage.getItem("kosp_kop_baris2") || "DINAS PENDIDIKAN DAN KEBUDAYAAN",
      kopBaris4: localStorage.getItem("kosp_kop_baris4") || localStorage.getItem("kosp_lokasi") || "Fatubai, Desa Oehalo Kecamatan Insana Tengah -856713"
    };
  });

  const [isLockedMode, setIsLockedMode] = useState<boolean>(true);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoType, setLogoType] = useState<"kemdikbud" | "kemenag">(() => {
    const saved = localStorage.getItem("kosp_logo_type");
    return (saved === "kemdikbud" || saved === "kemenag") ? (saved as "kemdikbud" | "kemenag") : "kemdikbud";
  });
  const [customMinistryLogo, setCustomMinistryLogo] = useState<string | null>(() => {
    return localStorage.getItem("kosp_custom_ministry_logo");
  });
  const ministryFileInputRef = useRef<HTMLInputElement>(null);

  // Trigger auto-locking of core fields if they are not empty
  const isCoreDataComplete = 
    profile.schoolName.trim() !== "" && 
    profile.kepalaSekolah.trim() !== "" && 
    profile.namaGuru.trim() !== "" &&
    profile.jabatan.trim() !== "" &&
    profile.faseKelas.trim() !== "";

  // Synchronize values to localStorage and emit custom events
  useEffect(() => {
    localStorage.setItem("kosp_nama_sekolah", profile.schoolName);
    localStorage.setItem("kosp_kepala_sekolah", profile.kepalaSekolah);
    localStorage.setItem("kosp_nip_kepala", profile.nipKepala);
    localStorage.setItem("kosp_nama_guru", profile.namaGuru);
    localStorage.setItem("kosp_nip_guru", profile.nipGuru);
    localStorage.setItem("kosp_jabatan_guru", profile.jabatan);
    localStorage.setItem("kosp_fase_kelas", profile.faseKelas);
    localStorage.setItem("kosp_semester", profile.semester);
    localStorage.setItem("kosp_tahun_pelajaran", profile.tahunPelajaran);
    localStorage.setItem("kosp_ketua_tim", profile.ketuaTimKosp);
    localStorage.setItem("kosp_ketua_tim_penyusun", profile.ketuaTimKosp);
    localStorage.setItem("kosp_anggota_tim", profile.anggotaTimKosp);

    const cleanMembers = profile.anggotaTimKosp
      .split(";")
      .map(m => m.trim())
      .filter(Boolean);
    localStorage.setItem("kosp_anggota_1", cleanMembers[0] || "");
    localStorage.setItem("kosp_anggota_2", cleanMembers[1] || "");
    localStorage.setItem("kosp_anggota_3", cleanMembers[2] || "");

    localStorage.setItem("kosp_logo_sekolah", profile.logo);
    localStorage.setItem("kosp_school_logo", profile.logo);
    localStorage.setItem("kosp_tempat", profile.tempat);
    localStorage.setItem("kosp_tanggal", profile.tanggal);
    localStorage.setItem("kosp_lokasi", profile.alamat);

    localStorage.setItem("kosp_npsn", profile.npsn);
    localStorage.setItem("kosp_website", profile.website);
    localStorage.setItem("kosp_email", profile.email);
    localStorage.setItem("kosp_telp", profile.telp);
    localStorage.setItem("kosp_kelurahan", profile.kelurahan);
    localStorage.setItem("kosp_kecamatan", profile.kecamatan);
    localStorage.setItem("kosp_kabupaten", profile.kabupaten);
    localStorage.setItem("kosp_provinsi", profile.provinsi);
    localStorage.setItem("kosp_kode_pos", profile.kodePos);
    
    localStorage.setItem("kosp_kop_baris1", profile.kopBaris1);
    localStorage.setItem("kosp_kop_baris2", profile.kopBaris2);
    localStorage.setItem("kosp_kop_baris4", profile.kopBaris4);

    // Also update legacy individual keys for high compatibility in other cards
    localStorage.setItem("omega_school_name", profile.schoolName);
    localStorage.setItem("omega_school_class", profile.faseKelas);
    localStorage.setItem("omega_teacher_name", profile.namaGuru);
    localStorage.setItem("omega_principal_name", profile.kepalaSekolah);
    localStorage.setItem("omega_principal_nip", profile.nipKepala);

    // Dispatch global event for instant updates
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("kosp_logo_type", logoType);
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [logoType]);

  useEffect(() => {
    if (customMinistryLogo) {
      localStorage.setItem("kosp_custom_ministry_logo", customMinistryLogo);
    } else {
      localStorage.removeItem("kosp_custom_ministry_logo");
    }
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [customMinistryLogo]);

  const handleFieldChange = (key: keyof SchoolProfileData, value: string) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      if (key === "kopBaris4") {
        updated.alamat = value;
      } else if (key === "alamat") {
        updated.kopBaris4 = value;
      }
      return updated;
    });
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file, 256, 256);
      handleFieldChange("logo", compressedBase64);
      triggerToast("✓ Logo sekolah berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("⚠️ Gagal memproses gambar logo sekolah.");
    }
  };

  const handleMinistryLogoUpload = async (file: File) => {
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file, 256, 256);
      setCustomMinistryLogo(compressedBase64);
      triggerToast("✓ Logo kementerian berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("⚠️ Gagal memproses gambar logo kementerian.");
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
  };

  const handleSave = (goToCurriculum: boolean = false) => {
    setIsSaving(true);
    
    // Perform sync immediately
    try {
      localStorage.setItem("kosp_nama_sekolah", profile.schoolName);
      localStorage.setItem("kosp_kepala_sekolah", profile.kepalaSekolah);
      localStorage.setItem("kosp_nip_kepala", profile.nipKepala);
      localStorage.setItem("kosp_nama_guru", profile.namaGuru);
      localStorage.setItem("kosp_nip_guru", profile.nipGuru);
      localStorage.setItem("kosp_jabatan_guru", profile.jabatan);
      localStorage.setItem("kosp_fase_kelas", profile.faseKelas);
      localStorage.setItem("kosp_semester", profile.semester);
      localStorage.setItem("kosp_tahun_pelajaran", profile.tahunPelajaran);
      localStorage.setItem("kosp_ketua_tim", profile.ketuaTimKosp);
      localStorage.setItem("kosp_ketua_tim_penyusun", profile.ketuaTimKosp);
      localStorage.setItem("kosp_anggota_tim", profile.anggotaTimKosp);

      const cleanMembers = profile.anggotaTimKosp
        .split(";")
        .map(m => m.trim())
        .filter(Boolean);
      localStorage.setItem("kosp_anggota_1", cleanMembers[0] || "");
      localStorage.setItem("kosp_anggota_2", cleanMembers[1] || "");
      localStorage.setItem("kosp_anggota_3", cleanMembers[2] || "");

      localStorage.setItem("kosp_logo_sekolah", profile.logo);
      localStorage.setItem("kosp_school_logo", profile.logo);
      localStorage.setItem("kosp_tempat", profile.tempat);
      localStorage.setItem("kosp_tanggal", profile.tanggal);
      localStorage.setItem("kosp_lokasi", profile.alamat);

      localStorage.setItem("kosp_npsn", profile.npsn);
      localStorage.setItem("kosp_website", profile.website);
      localStorage.setItem("kosp_email", profile.email);
      localStorage.setItem("kosp_telp", profile.telp);
      localStorage.setItem("kosp_kelurahan", profile.kelurahan);
      localStorage.setItem("kosp_kecamatan", profile.kecamatan);
      localStorage.setItem("kosp_kabupaten", profile.kabupaten);
      localStorage.setItem("kosp_provinsi", profile.provinsi);
      localStorage.setItem("kosp_kode_pos", profile.kodePos);
      
      localStorage.setItem("kosp_kop_baris1", profile.kopBaris1);
      localStorage.setItem("kosp_kop_baris2", profile.kopBaris2);
      localStorage.setItem("kosp_kop_baris4", profile.kopBaris4);

      // Legacy support keys
      localStorage.setItem("omega_school_name", profile.schoolName);
      localStorage.setItem("omega_school_class", profile.faseKelas);
      localStorage.setItem("omega_teacher_name", profile.namaGuru);
      localStorage.setItem("omega_principal_name", profile.kepalaSekolah);
      localStorage.setItem("omega_principal_nip", profile.nipKepala);

      localStorage.setItem("kosp_logo_type", logoType);
      if (customMinistryLogo) {
        localStorage.setItem("kosp_custom_ministry_logo", customMinistryLogo);
      } else {
        localStorage.removeItem("kosp_custom_ministry_logo");
      }

      // Save curriculum selections
      localStorage.setItem("profile_jenjang", jenjang);
      localStorage.setItem("kosp_jenjang", jenjang);
      
      localStorage.setItem("profile_active_subjects", JSON.stringify(selectedSubjects));
      localStorage.setItem("profile_active_extras", JSON.stringify(selectedExtras));
      localStorage.setItem("profile_active_projects", JSON.stringify(selectedProjects));
      
      localStorage.setItem("profile_custom_subjects", JSON.stringify(customSubjects));
      localStorage.setItem("profile_custom_extras", JSON.stringify(customExtras));
      localStorage.setItem("profile_custom_projects", JSON.stringify(customProjects));

      // Build and sync kosp custom subjects mapping
      const kospCustomSubj: Record<string, { label: string }> = {};
      customSubjects.forEach(s => {
        kospCustomSubj[s.id] = { label: s.label };
      });
      localStorage.setItem("kosp_custom_subjects", JSON.stringify(kospCustomSubj));

      // Build and sync kosp custom extras mapping
      const kospCustomExt: Record<string, { label: string }> = {};
      customExtras.forEach(e => {
        kospCustomExt[e.id] = { label: e.label };
      });
      localStorage.setItem("kosp_custom_extracurriculars", JSON.stringify(kospCustomExt));

      // Build and sync class configs for all grades
      try {
        const kospConfigsRaw = localStorage.getItem("kosp_class_configs");
        let existingConfigs: any = {};
        if (kospConfigsRaw) {
          try { existingConfigs = JSON.parse(kospConfigsRaw); } catch (e) {}
        }

        const subMapObj: Record<string, boolean> = {};
        selectedSubjects.forEach(key => {
          subMapObj[key] = true;
        });

        const extMapObj: Record<string, boolean> = {};
        selectedExtras.forEach(key => {
          extMapObj[key] = true;
        });

        for (let g = 1; g <= 12; g++) {
          if (!existingConfigs[g]) {
            existingConfigs[g] = { subjects: {}, extracurriculars: {} };
          }
          existingConfigs[g].subjects = { ...subMapObj };
          existingConfigs[g].extracurriculars = { ...extMapObj };
        }
        localStorage.setItem("kosp_class_configs", JSON.stringify(existingConfigs));
      } catch (e) {
        console.error("Gagal sinkronisasi configs:", e);
      }

      // Dispatch event to force other tabs/moduls to update instantly
      window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    // Add a satisfying short delay for the sync process visual feedback
    setTimeout(() => {
      setIsSaving(false);
      if (goToCurriculum) {
        setActiveStep("kurikulum");
        triggerToast("✓ Profil Berhasil Disimpan! Langkah 2: Silakan Pilih Mata Pelajaran, Ekskul & Projek");
        document.getElementById("school-profile-screen")?.scrollIntoView({ behavior: "smooth" });
      } else {
        triggerToast("✓ Data Profil Sekolah & Guru serta Pilihan Mata Pelajaran Berhasil Disinkronkan Permanen!");
      }
    }, 850);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 w-full text-left" id="school-profile-screen">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#0c1a12] border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold px-4 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#0a0a0f] to-zinc-950 rounded-2xl py-4 px-6 border border-zinc-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <School className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">PROFIL UTAMA SEKOLAH</h2>
            <p className="text-[10px] text-zinc-500 font-mono">PUSAT IDENTITAS TERCATAT DOKUMEN INTEGRATIF</p>
          </div>
        </div>

        {/* Lock Unlock Controller Badge */}
        {isCoreDataComplete && (
          <button
            type="button"
            onClick={() => setIsLockedMode(!isLockedMode)}
            className={`px-3.5 py-1.5 rounded-xl cursor-pointer text-[10.5px] font-sans font-extrabold border transition-all flex items-center gap-2 ${
              isLockedMode 
                ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400" 
                : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {isLockedMode ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Identitas Utama Terkunci (Ambil Otomatis)</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ubah Identitas Utama (Terbuka)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* STEP PROGRESS TRACKER */}
      <div className="flex flex-col sm:flex-row gap-3 bg-zinc-950/60 p-2 rounded-2xl border border-zinc-900 w-full mb-1">
        <button
          type="button"
          onClick={() => setActiveStep("profil")}
          className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition select-none cursor-pointer ${
            activeStep === "profil"
              ? "bg-amber-500 text-black font-extrabold shadow-[0_4px_14px_rgba(245,166,35,0.2)]"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
            activeStep === "profil" ? "border-black/30 bg-black/10 text-black font-extrabold" : "border-zinc-800 bg-zinc-900 text-zinc-400"
          }`}>
            1
          </div>
          <span>LANGKAH 1: IDENTITAS SEKOLAH & GURU</span>
        </button>

        <div className="hidden sm:flex items-center text-zinc-700 font-mono text-sm select-none">
          ➜
        </div>

        <button
          type="button"
          onClick={() => setActiveStep("kurikulum")}
          className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition select-none cursor-pointer ${
            activeStep === "kurikulum"
              ? "bg-amber-500 text-black font-extrabold shadow-[0_4px_14px_rgba(245,166,35,0.25)]"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
            activeStep === "kurikulum" ? "border-black/30 bg-black/10 text-black font-extrabold" : "border-zinc-800 bg-zinc-900 text-zinc-400"
          }`}>
            2
          </div>
          <span>LANGKAH 2: PILIHAN MAPEL, EKSKUL & PROJEK</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: School Logo and Main Lock indicators */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Logo Card */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900 pb-2 w-full text-center">
              LOGO RESMI DOKUMEN AKTIF
            </h3>

            <div className="grid grid-cols-2 gap-3 w-full animate-fade-in">
              {/* Kementerian Logo Display */}
              <div 
                className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:border-zinc-700 transition shadow-md"
                onClick={() => ministryFileInputRef.current?.click()}
                title="Klik untuk mengunggah logo kementerian kustom"
              >
                <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  {customMinistryLogo ? "Kem. Kustom" : logoType === "kemenag" ? "Kemenag RI" : "Kemdikbud"}
                </span>
                <div className="w-16 h-16 rounded-lg bg-zinc-950 p-1 border border-zinc-850 flex items-center justify-center relative group">
                  <img 
                    src={customMinistryLogo || (logoType === "kemenag" ? getKemenagLogo() : getTutWuriHandayaniLogo())} 
                    alt="Logo Kementerian" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[7px] text-blue-400 font-bold font-mono font-sans">
                    UNGGAH
                  </div>
                </div>
                <span className={`text-[7.5px] font-bold font-mono uppercase tracking-tight ${customMinistryLogo ? "text-blue-400" : "text-zinc-550"}`}>
                  {customMinistryLogo ? "KUSTOM" : "DEFAULT"}
                </span>
              </div>

              {/* School Logo upload/display */}
              <div 
                className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:border-zinc-700 transition shadow-md" 
                onClick={() => fileInputRef.current?.click()}
                title="Klik untuk mengunggah logo sekolah kustom"
              >
                <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Logo Sekolah</span>
                <div className="w-16 h-16 rounded-lg bg-zinc-950 p-1 border border-zinc-850 flex items-center justify-center relative group">
                  <img 
                    src={profile.logo || getDefaultSchoolLogo(profile.schoolName)} 
                    alt="Logo Sekolah" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[7px] text-amber-500 font-bold font-mono font-sans">
                    UNGGAH
                  </div>
                </div>
                <span className={`text-[7.5px] font-bold font-mono uppercase tracking-tight ${profile.logo ? "text-amber-500" : "text-zinc-550"}`}>
                  {profile.logo ? "KUSTOM" : "DEFAULT"}
                </span>
              </div>
            </div>

            {/* Segmented control to choose between KEMDIKBUD or KEMENAG */}
            <div className="w-full space-y-2">
              <div className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase font-mono text-left pl-1">
                Pilih Departemen:
              </div>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setLogoType("kemdikbud")}
                  className={`flex-1 py-1 rounded-lg text-[9px] font-bold font-mono border transition cursor-pointer text-center ${
                    logoType === "kemdikbud"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  KEMDIKBUD
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType("kemenag")}
                  className={`flex-1 py-1 rounded-lg text-[9px] font-bold font-mono border transition cursor-pointer text-center ${
                    logoType === "kemenag"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-zinc-950/40 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  KEMENAG RI
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleLogoUpload(e.target.files[0]);
                  }
                  e.target.value = "";
                }}
              />
              <input 
                ref={ministryFileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleMinistryLogoUpload(e.target.files[0]);
                  }
                  e.target.value = "";
                }}
              />
              <div className="flex justify-between w-full text-[9.5px] font-mono px-1">
                {customMinistryLogo && (
                  <button
                    type="button"
                    onClick={() => setCustomMinistryLogo(null)}
                    className="text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    Reset Logo Kem.
                  </button>
                )}
                {profile.logo && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("logo", "")}
                    className="text-zinc-500 hover:text-rose-400 ml-auto transition cursor-pointer"
                  >
                    Reset Logo Sekolah
                  </button>
                )}
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-[10px] text-zinc-550 leading-relaxed font-sans text-justify w-full">
              Sistem memuat <b>Logo Kementerian</b> dan <b>Logo Sekolah</b> secara lengkap pada seluruh lembar laporan, KOSP, draf administrasi secara berdampingan sesuai instruksi kurikulum pendidikan nasional terbaru.
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-3.5 text-xs text-left">
            <h3 className="text-[10px] font-extrabold text-[#f5a623] uppercase tracking-widest font-mono border-b border-zinc-900 pb-2 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-amber-550" /> STATUS SINKRONISASI
            </h3>
            
            <div className="space-y-2.5 font-sans text-zinc-400">
              <div className="flex justify-between items-center bg-black/40 p-2 border border-zinc-900/60 rounded-xl">
                <span>Sekolah</span>
                <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${profile.schoolName ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                  {profile.schoolName ? "✓ SIAP" : "✖ KOSONG"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-2 border border-zinc-900/60 rounded-xl">
                <span>Fase / Kelas</span>
                <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${profile.faseKelas ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                  {profile.faseKelas ? "✓ SIAP" : "✖ KOSONG"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-2 border border-zinc-900/60 rounded-xl">
                <span>Guru Kelas</span>
                <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${profile.namaGuru ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                  {profile.namaGuru ? "✓ SIAP" : "✖ KOSONG"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-2 border border-zinc-900/60 rounded-xl">
                <span>Jabatan</span>
                <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded ${profile.jabatan ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
                  {profile.jabatan ? "✓ SIAP" : "✖ KOSONG"}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-505 bg-black p-2.5 border border-zinc-900 rounded-xl leading-relaxed text-zinc-500">
              💡 <em>Ketika parameters ini lengkap, input pada menu pilar lain secara cerdas dikunci untuk menghindari duplikasi tempat berlebih.</em>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Registration Forms */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {activeStep === "profil" ? (
            <>
              {/* Card 1: Main School Identity */}
              <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5">
              <School className="w-4 h-4 text-amber-500" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                IDENTITAS SEKOLAH & GURU (CORE_INFO)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              
              {/* KOP SURAT ADMINISTRASI DAN RAPOR 4 BARIS INTERAKTIF */}
              <div className="md:col-span-2 bg-[#08080c] p-4 rounded-xl border border-zinc-900 space-y-3">
                <div className="text-[10px] font-extrabold text-amber-500 tracking-wider font-mono uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    KOP BARIS RESMI DOKUMEN & RAPOR (4 BARIS UTUH)
                  </span>
                  <span className="text-[8px] bg-zinc-900 text-[#f5a623] px-1.5 py-0.5 rounded border border-zinc-800">WAJIB 1 BARIS</span>
                </div>
                
                <div className="space-y-3">
                  {/* Baris 1 KOP */}
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider flex justify-between items-center">
                      <span>Baris Pertama KOP (Nama Kabupaten)</span>
                      <span className="text-[7.5px] text-zinc-550 lowercase italic">contoh: PEMERINTAH KABUPATEN TIMOR TENGAH UTARA</span>
                    </label>
                    <input
                      type="text"
                      value={profile.kopBaris1}
                      onChange={(e) => handleFieldChange("kopBaris1", e.target.value)}
                      placeholder="PEMERINTAH KABUPATEN TIMOR TENGAH UTARA"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Baris 2 KOP */}
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider flex justify-between items-center">
                      <span>Baris Kedua KOP (Nama Instansi Induk)</span>
                      <span className="text-[7.5px] text-zinc-550 lowercase italic">contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN</span>
                    </label>
                    <input
                      type="text"
                      value={profile.kopBaris2}
                      onChange={(e) => handleFieldChange("kopBaris2", e.target.value)}
                      placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Baris 3 KOP (Nama Sekolah) */}
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider flex justify-between items-center">
                      <span>Baris Ketiga KOP (Nama Sekolah)</span>
                      {isCoreDataComplete && isLockedMode ? (
                        <span className="text-[8.5px] text-amber-500 font-mono flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> SECURE ROOT
                        </span>
                      ) : (
                        <span className="text-[7.5px] text-zinc-550 lowercase italic">contoh: SD NEGERI FATUBAI</span>
                      )}
                    </label>
                    <input
                      type="text"
                      disabled={isCoreDataComplete && isLockedMode}
                      value={profile.schoolName}
                      onChange={(e) => handleFieldChange("schoolName", e.target.value)}
                      placeholder="SD NEGERI FATUBAI"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-[#030303] text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans font-bold disabled:opacity-50"
                    />
                  </div>

                  {/* Baris 4 KOP (Alamat Sekolah KOP) */}
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider flex justify-between items-center">
                      <span>Baris Keempat KOP (Alamat Surat Lengkap KOP)</span>
                      <span className="text-[7.5px] text-zinc-550 lowercase italic">contoh: Fatubai, Desa Oehalo Kecamatan Insana Tengah -856713</span>
                    </label>
                    <input
                      type="text"
                      value={profile.kopBaris4}
                      onChange={(e) => handleFieldChange("kopBaris4", e.target.value)}
                      placeholder="Fatubai, Desa Oehalo Kecamatan Insana Tengah -856713"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                {/* Simulated live visual printout preview */}
                <div className="mt-3 bg-black/60 p-3 rounded-lg border border-zinc-900/80 flex flex-col items-center justify-center select-none text-center relative group">
                  <span className="text-[7.5px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono">Simulasi Kop Dokumen Administrasi & Rapor Anda:</span>
                  <div className="mt-2 pb-1.5 w-full border-b-2 border-zinc-650 max-w-lg">
                    <div className="text-[9px] font-sans font-medium text-zinc-300 tracking-wide">{profile.kopBaris1}</div>
                    <div className="text-[9px] font-sans font-medium text-zinc-300 tracking-wide">{profile.kopBaris2}</div>
                    <div className="text-[11.5px] font-sans font-extrabold text-white tracking-widest my-0.5">{profile.schoolName.toUpperCase()}</div>
                    <div className="text-[7.5px] font-serif hover:font-sans text-zinc-400 italic">Alamat: {profile.kopBaris4}</div>
                  </div>
                  <div className="h-[1.5px] w-full border-t border-zinc-800 mt-0.5 max-w-lg"></div>
                </div>
              </div>

              {/* Jenjang Sekolah (Pilihan Utama Profil) */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Jenjang Pendidikan Sekolah</span>
                  <span className="text-[8px] text-amber-400 font-mono bg-amber-500/10 px-1 py-0.5 rounded">DINAMIS</span>
                </label>
                <div className="flex bg-black p-1 rounded-xl border border-zinc-900 gap-1.5">
                  {(["SD", "SMP", "SMA", "SMK"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleJenjangChange(lvl)}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition select-none ${
                        jenjang === lvl
                          ? "bg-amber-500 text-black shadow-md font-extrabold"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                      }`}
                    >
                      Jenjang {lvl}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-zinc-500 mt-1.5 font-sans leading-normal">
                  Sistem otomatis menyesuaikan pilihan mata pelajaran standar kurikulum merdeka pada langkah selanjutnya berdasarkan jenjang pendidikan yang Anda tetapkan di sini.
                </p>
              </div>

              {/* BARU: Detail Tambahan Pendukung Rapor dan KOSP */}
              <div className="md:col-span-2 border-t border-zinc-900 pt-4 mt-2 space-y-3">
                <div className="text-[10px] font-extrabold text-amber-500 tracking-wider font-mono uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  DETAIL IDENTITAS TAMBAHAN (RELEVAN RAPOR SEMESTER 2 & KOSP)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      NPSN Sekolah
                    </label>
                    <input
                      type="text"
                      value={profile.npsn}
                      onChange={(e) => handleFieldChange("npsn", e.target.value)}
                      placeholder="50300960"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      No. Telp Sekolah / HP
                    </label>
                    <input
                      type="text"
                      value={profile.telp}
                      onChange={(e) => handleFieldChange("telp", e.target.value)}
                      placeholder="082236015517"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider flex justify-between items-center">
                      <span>Website Sekolah</span>
                      <span className="text-[7px] text-amber-500 font-mono">rekomendasi</span>
                    </label>
                    <input
                      type="text"
                      value={profile.website}
                      onChange={(e) => handleFieldChange("website", e.target.value)}
                      placeholder="https://sdn-fatubai-official.netlify.app/"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      E-mail Sekolah
                    </label>
                    <input
                      type="text"
                      value={profile.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      placeholder="sdnfatubai@gmail.com"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      Desa / Kelurahan
                    </label>
                    <input
                      type="text"
                      value={profile.kelurahan}
                      onChange={(e) => handleFieldChange("kelurahan", e.target.value)}
                      placeholder="Oehalo"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      Kecamatan
                    </label>
                    <input
                      type="text"
                      value={profile.kecamatan}
                      onChange={(e) => handleFieldChange("kecamatan", e.target.value)}
                      placeholder="Insana Tengah"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      Kabupaten / Kota
                    </label>
                    <input
                      type="text"
                      value={profile.kabupaten}
                      onChange={(e) => handleFieldChange("kabupaten", e.target.value)}
                      placeholder="Timor Tengah Utara"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      Provinsi
                    </label>
                    <input
                      type="text"
                      value={profile.provinsi}
                      onChange={(e) => handleFieldChange("provinsi", e.target.value)}
                      placeholder="Nusa Tenggara Timur"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono tracking-wider">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={profile.kodePos}
                      onChange={(e) => handleFieldChange("kodePos", e.target.value)}
                      placeholder="85673"
                      className="w-full px-3 py-1.5 rounded-lg text-[11px] bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Kepala Sekolah */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Nama Kepala Sekolah</span>
                  {isCoreDataComplete && isLockedMode && (
                    <span className="text-[9px] text-amber-400 font-mono">
                      <Lock className="w-2.5 h-2.5" /> LOCK
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  disabled={isCoreDataComplete && isLockedMode}
                  value={profile.kepalaSekolah}
                  onChange={(e) => handleFieldChange("kepalaSekolah", e.target.value)}
                  placeholder="Nama & Gelar Kepala Sekolah"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 disabled:opacity-50 disabled:bg-[#07070a] disabled:border-zinc-950"
                />
              </div>

              {/* NIP Kepala Sekolah */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={profile.nipKepala}
                  onChange={(e) => handleFieldChange("nipKepala", e.target.value)}
                  placeholder="Format: 19xxxxxxxxxxxx"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Nama Guru */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Nama Guru Kelas / Mapel</span>
                  {isCoreDataComplete && isLockedMode && (
                    <span className="text-[9px] text-amber-400 font-mono">
                      <Lock className="w-2.5 h-2.5" /> LOCK
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  disabled={isCoreDataComplete && isLockedMode}
                  value={profile.namaGuru}
                  onChange={(e) => handleFieldChange("namaGuru", e.target.value)}
                  placeholder="Nama & Gelar Guru"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 disabled:opacity-50 disabled:bg-[#07070a] disabled:border-zinc-950"
                />
              </div>

              {/* NIP Guru */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  NIP Guru
                </label>
                <input
                  type="text"
                  value={profile.nipGuru}
                  onChange={(e) => handleFieldChange("nipGuru", e.target.value)}
                  placeholder="NIP Guru Pembina"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Jabatan Guru */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Jabatan Guru</span>
                  {isCoreDataComplete && isLockedMode && (
                    <span className="text-[9px] text-amber-400 font-mono">
                      <Lock className="w-2.5 h-2.5" /> LOCK
                    </span>
                  )}
                </label>
                <select
                  disabled={isCoreDataComplete && isLockedMode}
                  value={profile.jabatan}
                  onChange={(e) => handleFieldChange("jabatan", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 disabled:opacity-50 disabled:bg-[#07070a] disabled:border-zinc-950"
                >
                  <option value="Guru Kelas">Guru Kelas</option>
                  <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                </select>
              </div>

              {/* Fase / Kelas */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Kelas / Fase Pilihan</span>
                  {isCoreDataComplete && isLockedMode && (
                    <span className="text-[9px] text-amber-400 font-mono">
                      <Lock className="w-2.5 h-2.5" /> LOCK
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  disabled={isCoreDataComplete && isLockedMode}
                  value={profile.faseKelas}
                  onChange={(e) => handleFieldChange("faseKelas", e.target.value)}
                  placeholder="Misal: Kelas IV / Fase B"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 disabled:opacity-50 disabled:bg-[#07070a] disabled:border-zinc-950"
                />
              </div>

              {/* Pilihan Semester (Editable) */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Pilihan Semester</span>
                  <span className="text-[8px] text-emerald-400 font-mono">✓ EDITABLE</span>
                </label>
                <select
                  value={profile.semester}
                  onChange={(e) => handleFieldChange("semester", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                >
                  <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
                </select>
              </div>

              {/* Tahun Pelajaran (Editable) */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Tahun Pelajaran</span>
                  <span className="text-[8px] text-emerald-400 font-mono">✓ EDITABLE</span>
                </label>
                <input
                  type="text"
                  value={profile.tahunPelajaran}
                  onChange={(e) => handleFieldChange("tahunPelajaran", e.target.value)}
                  placeholder="Misal: 2025/2026"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Kabupaten / Kota (Tempat) */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Tempat Penyusunan Laporan (Kab/Kota)
                </label>
                <input
                  type="text"
                  value={profile.tempat}
                  onChange={(e) => handleFieldChange("tempat", e.target.value)}
                  placeholder="Contoh: Fatubai"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Tanggal Penyusunan */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Tanggal Laporan
                </label>
                <input
                  type="text"
                  value={profile.tanggal}
                  onChange={(e) => handleFieldChange("tanggal", e.target.value)}
                  placeholder="Contoh: 12 Juni 2026"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

            </div>
          </div>

          {/* Card 2: KOSP Tim Koordinator Sinergi */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase flex items-center gap-2">
                TIM PENGEMBANG KURIKULUM KOSP SEKOLAH
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-normal font-sans">100% EDITABLE</span>
              </span>
            </div>

            <p className="text-[10.5px] text-zinc-500 leading-relaxed font-sans">
              Tim pengembang yang bertanggung jawab menyusun draf Kurikulum Satuan Pendidikan (KOSP). Identitas ketua dan anggota tim akan dirangkai secara berurutan dalam lembaran penetapan, dokumen otentikasi kurikulum, dan pengajuan asesmen sekolah.
            </p>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Ketua Tim KOSP */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Ketua Tim Pengembang KOSP
                </label>
                <input
                  type="text"
                  value={profile.ketuaTimKosp}
                  onChange={(e) => handleFieldChange("ketuaTimKosp", e.target.value)}
                  placeholder="Masukkan nama lengkap Ketua Tim (beserta Gelar)"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              {/* Anggota Tim KOSP */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Anggota Tim Pengembang (Pisahkan dengan tanda titik koma &quot;;&quot;)
                </label>
                <textarea
                  value={profile.anggotaTimKosp}
                  onChange={(e) => handleFieldChange("anggotaTimKosp", e.target.value)}
                  rows={3}
                  placeholder="Contoh: Yuliana Fatima, S.Pd; Fransiskus Xaverius, S.Pd; Maria Goreti, S.Pd"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans leading-relaxed"
                />
              </div>

            </div>
          </div>

          {/* STEP 1: ACTIONS - SAVE & CONTINUE */}
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-zinc-950 via-[#0a0a0f] to-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,166,35,0.03)] animate-fade-in">
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-display flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                SINKRONISASI IDENTITAS UTAMA (LANGKAH 1)
              </h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed max-w-md font-sans">
                Klik tombol di samping untuk menyimpan pembaruan identitas sekolah, kepala sekolah, guru, dan tim pengembang KOSP ke database lokal dan beralih otomatis ke Langkah 2 (Kurikulum & Mapel).
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:border-zinc-900 border border-amber-400/20 text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(245,166,35,0.25)] hover:shadow-[0_6px_18px_rgba(245,166,35,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  <span>Menyinkronkan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Simpan & Lanjutkan ➜</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Card 2B: KURIKULUM & SELEKSI DAFTAR UTAMA */}
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-6 animate-fade-in" id="curriculum-setup-card">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase flex items-center gap-2">
                PILIHAN MAPEL, EKSTRAKURIKULER, & PROJEK
              </span>
            </div>

            <p className="text-[10.5px] text-zinc-500 leading-relaxed font-sans">
              Pilihlah daftar Mata Pelajaran, Ekstrakurikuler, dan Projek Kokurikuler yang aktif di sekolah Anda. Sistem akan menyesuaikan draf Rapor dan Daftar Nilai secara dinamis berdasarkan jenjang pendidikan yang diatur di bawah ini.
            </p>

            {/* JENJANG SECTOR SELECTOR */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">
                1. Pilih Jenjang Pendidikan Sekolah
              </label>
              <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-900/60 gap-1.5">
                {(["SD", "SMP", "SMA", "SMK"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleJenjangChange(lvl)}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-lg cursor-pointer transition select-none ${
                      jenjang === lvl
                        ? "bg-amber-500 text-black shadow-md font-extrabold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    Jenjang {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBJECTS (INTRAKURIKULER) */}
            <div className="space-y-3.5 pt-2 border-t border-zinc-950">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-amber-500 uppercase font-mono tracking-wider">
                  2. Pilih Mata Pelajaran (Intrakurikuler)
                </label>
                <span className="text-[9px] text-zinc-500 font-mono font-bold">
                  {selectedSubjects.length} Aktif
                </span>
              </div>

              {/* Grid mapel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
                {Object.entries(jenjang === "SD" ? DEFAULT_SD_SUBJECTS : jenjang === "SMP" ? DEFAULT_SMP_SUBJECTS : jenjang === "SMA" ? DEFAULT_SMA_SUBJECTS : DEFAULT_SMK_SUBJECTS).map(([key, label]) => (
                  <label key={key} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-850/60 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(key)}
                      onChange={() => {
                        if (selectedSubjects.includes(key)) {
                          setSelectedSubjects(prev => prev.filter(k => k !== key));
                        } else {
                          setSelectedSubjects(prev => [...prev, key]);
                        }
                      }}
                      className="mt-0.5 rounded border-zinc-800 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                    />
                    <span className="text-[10.5px] text-zinc-300 font-medium leading-tight">
                      {label}
                    </span>
                  </label>
                ))}

                {/* Custom manual subjects in list */}
                {customSubjects.map(subj => (
                  <div key={subj.id} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900/80">
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subj.id)}
                        onChange={() => {
                          if (selectedSubjects.includes(subj.id)) {
                            setSelectedSubjects(prev => prev.filter(k => k !== subj.id));
                          } else {
                            setSelectedSubjects(prev => [...prev, subj.id]);
                          }
                        }}
                        className="mt-0.5 rounded border-zinc-800 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                      />
                      <span className="text-[10.5px] text-amber-400 font-extrabold leading-tight">
                        {subj.label}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomSubject(subj.id)}
                      className="text-zinc-650 hover:text-red-400 p-0.5 transition cursor-pointer"
                      title="Hapus mata pelajaran manual ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Manual Input Form */}
              <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-zinc-900/50">
                <input
                  type="text"
                  value={newSubjectText}
                  onChange={(e) => setNewSubjectText(e.target.value)}
                  placeholder="Input manual mata pelajaran tambahan..."
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-white border border-zinc-900/60 outline-none focus:border-amber-500 placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-bold text-amber-500 flex items-center gap-1 cursor-pointer transition select-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Manual
                </button>
              </div>
            </div>

            {/* EXTRACURRICULARS */}
            <div className="space-y-3.5 pt-4 border-t border-zinc-950">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider">
                  3. Pilih Ekstrakurikuler (Ekskul)
                </label>
                <span className="text-[9px] text-zinc-500 font-mono font-bold">
                  {selectedExtras.length} Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1.5 custom-scrollbar">
                {Object.entries(DEFAULT_EXTRACURRICULARS).map(([key, label]) => (
                  <label key={key} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-850/60 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(key)}
                      onChange={() => {
                        if (selectedExtras.includes(key)) {
                          setSelectedExtras(prev => prev.filter(k => k !== key));
                        } else {
                          setSelectedExtras(prev => [...prev, key]);
                        }
                      }}
                      className="mt-0.5 rounded border-zinc-800 text-purple-500 focus:ring-purple-500 bg-zinc-950"
                    />
                    <span className="text-[10.5px] text-zinc-300 font-medium leading-tight">
                      {label}
                    </span>
                  </label>
                ))}

                {customExtras.map(ext => (
                  <div key={ext.id} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900">
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(ext.id)}
                        onChange={() => {
                          if (selectedExtras.includes(ext.id)) {
                            setSelectedExtras(prev => prev.filter(k => k !== ext.id));
                          } else {
                            setSelectedExtras(prev => [...prev, ext.id]);
                          }
                        }}
                        className="mt-0.5 rounded border-zinc-800 text-purple-500 focus:ring-purple-500 bg-zinc-950"
                      />
                      <span className="text-[10.5px] text-purple-450 font-extrabold leading-tight">
                        {ext.label}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomExtra(ext.id)}
                      className="text-zinc-650 hover:text-red-400 p-0.5 transition cursor-pointer"
                      title="Hapus ekskul manual ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Manual Extra Form */}
              <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-zinc-900/50">
                <input
                  type="text"
                  value={newExtraText}
                  onChange={(e) => setNewExtraText(e.target.value)}
                  placeholder="Input manual ekstrakurikuler tambahan..."
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-white border border-zinc-900/60 outline-none focus:border-amber-500 placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={handleAddCustomExtra}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-bold text-purple-400 flex items-center gap-1 cursor-pointer transition select-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Manual
                </button>
              </div>
            </div>

            {/* PROJEK KOKURIKULER */}
            <div className="space-y-3.5 pt-4 border-t border-zinc-950">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wider">
                  4. Pilih Projek Kokurikuler (Opsional)
                </label>
                <span className="text-[9px] text-zinc-550 font-mono font-bold">
                  {selectedProjects.length} Aktif &bull; Opsional
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1.5 custom-scrollbar">
                {Object.entries(DEFAULT_PROJECTS).map(([key, label]) => (
                  <label key={key} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-850/60 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(key)}
                      onChange={() => {
                        if (selectedProjects.includes(key)) {
                          setSelectedProjects(prev => prev.filter(k => k !== key));
                        } else {
                          setSelectedProjects(prev => [...prev, key]);
                        }
                      }}
                      className="mt-0.5 rounded border-zinc-800 text-blue-500 focus:ring-blue-500 bg-zinc-950"
                    />
                    <span className="text-[10.5px] text-zinc-300 font-medium leading-tight">
                      {label}
                    </span>
                  </label>
                ))}

                {customProjects.map(proj => (
                  <div key={proj.id} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900">
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(proj.id)}
                        onChange={() => {
                          if (selectedProjects.includes(proj.id)) {
                            setSelectedProjects(prev => prev.filter(k => k !== proj.id));
                          } else {
                            setSelectedProjects(prev => [...prev, proj.id]);
                          }
                        }}
                        className="mt-0.5 rounded border-zinc-800 text-blue-500 focus:ring-blue-500 bg-zinc-950"
                      />
                      <span className="text-[10.5px] text-blue-450 font-extrabold leading-tight">
                        {proj.label}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomProject(proj.id)}
                      className="text-zinc-650 hover:text-red-400 p-0.5 transition cursor-pointer"
                      title="Hapus projek manual ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Manual Project Form */}
              <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-zinc-900/50">
                <input
                  type="text"
                  value={newProjectText}
                  onChange={(e) => setNewProjectText(e.target.value)}
                  placeholder="Input manual projek kokurikuler..."
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-zinc-950 text-white border border-zinc-900/60 outline-none focus:border-amber-500 placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={handleAddCustomProject}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-bold text-blue-400 flex items-center gap-1 cursor-pointer transition select-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Manual
                </button>
              </div>
            </div>

          </div>

          {/* STEP 2: ACTIONS - BACK & SYNC ALL */}
          <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-zinc-950 via-[#0a0a0f] to-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,166,35,0.03)] animate-fade-in">
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-display flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SINKRONISASI AKHIR KURIKULUM (LANGKAH 2)
              </h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed max-w-md font-sans">
                Klik tombol di samping untuk menyimpan dan menyinkronkan seluruh pilihan draf Rapor, Mata Pelajaran, Ekstrakurikuler, dan Projek secara permanen ke seluruh modul.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveStep("profil");
                  document.getElementById("school-profile-screen")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 select-none border border-zinc-800"
              >
                <span>⬅ Edit Profil Lagi</span>
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave(false)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:border-zinc-900 border border-amber-400/20 text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(245,166,35,0.25)] hover:shadow-[0_6px_18px_rgba(245,166,35,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                    <span>Menyinkronkan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Simpan & Selesaikan Sesi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

    </div>

      </div>

    </div>
  );
}
