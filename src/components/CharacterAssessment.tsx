import React, { useState, useEffect } from "react";
import { 
  Users, Sparkles, Download, Copy, Check, Plus, Trash2, Edit2, 
  Award, Heart, Shield, Star, HelpCircle, Database, CheckCircle2,
  RefreshCw, ClipboardList, Layers, AlertTriangle, Save
} from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";

interface StudentCharacter {
  id: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  religius: "BB" | "MB" | "BSH" | "SB";
  jujur: "BB" | "MB" | "BSH" | "SB";
  disiplin: "BB" | "MB" | "BSH" | "SB";
  peduli: "BB" | "MB" | "BSH" | "SB";
  gotongRoyong: "BB" | "MB" | "BSH" | "SB";
  catatanKarakter: string;
}

const DEFAULT_CHARACTERS: StudentCharacter[] = [
  { 
    id: "char-1", 
    nisn: "3155685577",
    name: "Florida Banusu", 
    gender: "P", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "SB", 
    peduli: "BSH", 
    gotongRoyong: "SB", 
    catatanKarakter: "Sangat aktif dalam kegiatan keagamaan, jujur, disiplin serta tinggi rasa gotong royong luar biasa luring."
  },
  { 
    id: "char-2", 
    nisn: "0164310989",
    name: "Febrianus Hanoe", 
    gender: "L", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "BSH", 
    peduli: "SB", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Sangat peduli terhadap teman sekelas dan menunjukkan perilaku jujur serta bertanggung jawab."
  },
  { 
    id: "char-3", 
    nisn: "3148133459",
    name: "Fransiskus Puatero", 
    gender: "L", 
    religius: "MB", 
    jujur: "BSH", 
    disiplin: "MB", 
    peduli: "BSH", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Menunjukkan perilaku jujur yang baik, perlu pendampingan untuk peningkatan disiplin mandiri."
  },
  { 
    id: "char-4", 
    nisn: "3157174153",
    name: "Mateus Kause", 
    gender: "L", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "BSH", 
    peduli: "BSH", 
    gotongRoyong: "SB", 
    catatanKarakter: "Mampu bekerja sama dalam gotong royong dengan sangat baik serta rajin dalam ibadah harian."
  },
  { 
    id: "char-5", 
    nisn: "3151880167",
    name: "Natalia Buatefa", 
    gender: "P", 
    religius: "SB", 
    jujur: "BSH", 
    disiplin: "BSH", 
    peduli: "SB", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Menjadi teladan bagi teman lainnya dalam hal sikap religius, peduli sesama, dan jujur."
  },
  { 
    id: "char-6", 
    nisn: "",
    name: "Norbertus Hanoe", 
    gender: "L", 
    religius: "BSH", 
    jujur: "MB", 
    disiplin: "BSH", 
    peduli: "BSH", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Disiplin mengikuti instruksi luring, perlu motivasi untuk terus bertindak jujur dalam ujian."
  },
  { 
    id: "char-7", 
    nisn: "3141294287",
    name: "Paskalis Hanoe", 
    gender: "L", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "SB", 
    peduli: "BSH", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Memiliki tingkat kedisiplinan yang sangat luar biasa dan bergotong royong secara tulus."
  },
  { 
    id: "char-8", 
    nisn: "3157126495",
    name: "Petrosia Kono Aran", 
    gender: "P", 
    religius: "BSH", 
    jujur: "SB", 
    disiplin: "BSH", 
    peduli: "BSH", 
    gotongRoyong: "SB", 
    catatanKarakter: "Sangat jujur dalam menyajikan laporan kegiatan luring dan cekatan bergotong royong bersama tim."
  },
  { 
    id: "char-9", 
    nisn: "0154241594",
    name: "Syrilus Alexander Kosat", 
    gender: "L", 
    religius: "MB", 
    jujur: "BSH", 
    disiplin: "BSH", 
    peduli: "MB", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Perlu pendampingan berkala dalam mengasah kepedulian sosial di lingkungan sekolah harian."
  },
  { 
    id: "char-10", 
    nisn: "3157245047",
    name: "Serilius Buatefa", 
    gender: "L", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "BSH", 
    peduli: "BSH", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Menunjukkan perilaku religius, jujur, disiplin, peduli dan gotong royong secara merata."
  },
  { 
    id: "char-11", 
    nisn: "",
    name: "Yohanes Buatefa", 
    gender: "L", 
    religius: "BSH", 
    jujur: "BSH", 
    disiplin: "MB", 
    peduli: "MB", 
    gotongRoyong: "BSH", 
    catatanKarakter: "Bergotong royong dengan baik di kelas, perlu didorong untuk lebih disiplin waktu."
  },
  { 
    id: "char-12", 
    nisn: "",
    name: "Alfonsius Misa", 
    gender: "L", 
    religius: "MB", 
    jujur: "MB", 
    disiplin: "BSH", 
    peduli: "BSH", 
    gotongRoyong: "MB", 
    catatanKarakter: "Mulai menunjukkan peningkatan dalam sikap peduli dan kebersihan lewat disiplin luring."
  }
];

export interface CharacterCriterion {
  name: string;
  short: string;
  desc: string;
}

export interface CharacterCriteria {
  religius: CharacterCriterion;
  jujur: CharacterCriterion;
  disiplin: CharacterCriterion;
  peduli: CharacterCriterion;
  gotongRoyong: CharacterCriterion;
}

export const DEFAULT_CRITERIA: CharacterCriteria = {
  religius: { name: "Religiusitas", short: "RELIGIUS", desc: "Beriman, bertaqwa kepada Tuhan YME, dan berakhlak mulia harian." },
  jujur: { name: "Kejujuran", short: "JUJUR", desc: "Integritas diri, menjunjung nilai kebenaran dalam perkataan & perbuatan." },
  disiplin: { name: "Kedisiplinan", short: "DISIPLIN", desc: "Kepatuhan tata tertib sekolah, ketepatan waktu, dan kemandirian." },
  peduli: { name: "Sikap Kepedulian", short: "PEDULI", desc: "Kepekaan sosial tinggi terhadap sesama teman dan guru." },
  gotongRoyong: { name: "Gotong Royong", short: "G. ROYONG", desc: "Kemampuan kolaborasi, kerja sama tim, dan kepatuhan mufakat." }
};

const METRIC_LABELS = {
  BB: { label: "Belum Berkembang", color: "bg-red-500/10 text-red-500 border-red-550/20 text-glow-red" },
  MB: { label: "Mulai Berkembang", color: "bg-amber-500/10 text-amber-555 border-amber-550/20 text-glow-amber" },
  BSH: { label: "Berkembang Sesuai Harapan", color: "bg-blue-500/10 text-blue-400 border-blue-550/20 text-glow-blue" },
  SB: { label: "Sangat Berkembang", color: "bg-emerald-500/10 text-emerald-400 border-emerald-550/20 text-glow-emerald" }
};

export const CharacterAssessment: React.FC = () => {
  const [students, setStudents] = useState<StudentCharacter[]>([]);
  const [namaSekolah, setNamaSekolah] = useState<string>("SD Negeri Fatubai");
  const [kelas, setKelas] = useState<string>("Fase B (Kelas 4)");
  const [semester, setSemester] = useState<string>("Semester 1 (Ganjil)");
  const [tahunAjaran, setTahunAjaran] = useState<string>("2026/2027");
  const [namaGuru, setNamaGuru] = useState<string>("Roni Hariyanto Bhidju, S.Pd., Gr.");
  const [kepalaSekolah, setKepalaSekolah] = useState<string>("Darius Kusi, S.Pd., Gr.");
  const [nipKepala, setNipKepala] = useState<string>("196709192008011008");
  const [tempatPenyusunan, setTempatPenyusunan] = useState<string>("Oehalo");
  const [tanggalPenyusunan, setTanggalPenyusunan] = useState<string>("13 November 2026");
  const [schoolAddress, setSchoolAddress] = useState<string>("Dusun Oehalo, Desa Fatubai, Kec. Insana, Kab. TTU, Prov. NTT - Kode Pos: 85671");

  // Character criteria customization states
  const [criteria, setCriteria] = useState<CharacterCriteria>(() => {
    const raw = localStorage.getItem("omega_character_criteria");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          religius: parsed.religius || DEFAULT_CRITERIA.religius,
          jujur: parsed.jujur || DEFAULT_CRITERIA.jujur,
          disiplin: parsed.disiplin || DEFAULT_CRITERIA.disiplin,
          peduli: parsed.peduli || DEFAULT_CRITERIA.peduli,
          gotongRoyong: parsed.gotongRoyong || DEFAULT_CRITERIA.gotongRoyong
        };
      } catch (e) {
        console.error("Gagal membaca kriteria kustom:", e);
      }
    }
    return DEFAULT_CRITERIA;
  });

  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

  // Temporary editing state for criteria
  const [editReligiusName, setEditReligiusName] = useState(criteria.religius.name);
  const [editReligiusShort, setEditReligiusShort] = useState(criteria.religius.short);
  const [editReligiusDesc, setEditReligiusDesc] = useState(criteria.religius.desc);

  const [editJujurName, setEditJujurName] = useState(criteria.jujur.name);
  const [editJujurShort, setEditJujurShort] = useState(criteria.jujur.short);
  const [editJujurDesc, setEditJujurDesc] = useState(criteria.jujur.desc);

  const [editDisiplinName, setEditDisiplinName] = useState(criteria.disiplin.name);
  const [editDisiplinShort, setEditDisiplinShort] = useState(criteria.disiplin.short);
  const [editDisiplinDesc, setEditDisiplinDesc] = useState(criteria.disiplin.desc);

  const [editPeduliName, setEditPeduliName] = useState(criteria.peduli.name);
  const [editPeduliShort, setEditPeduliShort] = useState(criteria.peduli.short);
  const [editPeduliDesc, setEditPeduliDesc] = useState(criteria.peduli.desc);

  const [editGotongName, setEditGotongName] = useState(criteria.gotongRoyong.name);
  const [editGotongShort, setEditGotongShort] = useState(criteria.gotongRoyong.short);
  const [editGotongDesc, setEditGotongDesc] = useState(criteria.gotongRoyong.desc);

  // Sync criteria to local storage when saved
  useEffect(() => {
    localStorage.setItem("omega_character_criteria", JSON.stringify(criteria));
    window.dispatchEvent(new CustomEvent("omega-character-criteria-updated"));
  }, [criteria]);

  // Sync editing state with criteria changes
  useEffect(() => {
    setEditReligiusName(criteria.religius.name);
    setEditReligiusShort(criteria.religius.short);
    setEditReligiusDesc(criteria.religius.desc);

    setEditJujurName(criteria.jujur.name);
    setEditJujurShort(criteria.jujur.short);
    setEditJujurDesc(criteria.jujur.desc);

    setEditDisiplinName(criteria.disiplin.name);
    setEditDisiplinShort(criteria.disiplin.short);
    setEditDisiplinDesc(criteria.disiplin.desc);

    setEditPeduliName(criteria.peduli.name);
    setEditPeduliShort(criteria.peduli.short);
    setEditPeduliDesc(criteria.peduli.desc);

    setEditGotongName(criteria.gotongRoyong.name);
    setEditGotongShort(criteria.gotongRoyong.short);
    setEditGotongDesc(criteria.gotongRoyong.desc);
  }, [criteria]);

  // Sync with central SchoolProfile & Student database
  useEffect(() => {
    const loadProfile = () => {
      setNamaSekolah(localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai");
      setKelas(localStorage.getItem("kosp_fase_kelas") || "Fase B (Kelas 4)");
      setSemester(localStorage.getItem("kosp_semester") || "Semester 1 (Ganjil)");
      setTahunAjaran(localStorage.getItem("kosp_tahun_pelajaran") || "2026/2027");
      setNamaGuru(localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.");
      setKepalaSekolah(localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.");
      setNipKepala(localStorage.getItem("kosp_nip_kepala") || "196709192008011008");
      setTempatPenyusunan(localStorage.getItem("kosp_tempat") || "Oehalo");
      setTanggalPenyusunan(localStorage.getItem("kosp_tanggal") || "13 November 2026");
      setSchoolAddress(localStorage.getItem("kosp_lokasi") || "Dusun Oehalo, Desa Fatubai, Kec. Insana, Kab. TTU, Prov. NTT - Kode Pos: 85671");
    };

    const loadStudents = () => {
      let savedStudentsRaw = localStorage.getItem("omega_daftar_nilai_students");
      const savedCharacterRaw = localStorage.getItem("omega_character_students");
      
      // Seed central registry if totally absent
      if (!savedStudentsRaw) {
        const defaultRoster = [
          { id: "std-1", name: "Florida Banusu", gender: "P", nisn: "3155685577" },
          { id: "std-2", name: "Febrianus Hanoe", gender: "L", nisn: "0164310989" },
          { id: "std-3", name: "Fransiskus Puatero", gender: "L", nisn: "3148133459" },
          { id: "std-4", name: "Mateus Kause", gender: "L", nisn: "3157174153" },
          { id: "std-5", name: "Natalia Buatefa", gender: "P", nisn: "3151880167" },
          { id: "std-6", name: "Norbertus Hanoe", gender: "L", nisn: "" },
          { id: "std-7", name: "Paskalis Hanoe", gender: "L", nisn: "3141294287" },
          { id: "std-8", name: "Petrosia Kono Aran", gender: "P", nisn: "3157126495" },
          { id: "std-9", name: "Syrilus Alexander Kosat", gender: "L", nisn: "0154241594" },
          { id: "std-10", name: "Serilius Buatefa", gender: "L", nisn: "3157245047" },
          { id: "std-11", name: "Yohanes Buatefa", gender: "L", nisn: "" },
          { id: "std-12", name: "Alfonsius Misa", gender: "L", nisn: "" }
        ];
        localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(defaultRoster));
        savedStudentsRaw = JSON.stringify(defaultRoster);
      }

      let parsedDaftarNilai: any[] = [];
      if (savedStudentsRaw) {
        try {
          parsedDaftarNilai = JSON.parse(savedStudentsRaw);
        } catch (e) {
          console.error(e);
        }
      }

      let existingCharacterMap: Record<string, any> = {};
      if (savedCharacterRaw) {
        try {
          const parsed = JSON.parse(savedCharacterRaw);
          parsed.forEach((s: any) => {
            existingCharacterMap[s.name] = s;
          });
        } catch (e) {
          console.error(e);
        }
      }

      if (parsedDaftarNilai.length > 0) {
        const syncedStudents: StudentCharacter[] = parsedDaftarNilai.map((item: any, idx: number) => {
          const name = item.name || item.nama || `Siswa ${idx + 1}`;
          const existing = existingCharacterMap[name] || {};
          return {
            id: item.id || String(idx + 1),
            nisn: item.nisn || existing.nisn || "0123456789",
            name: name,
            gender: (item.gender === "P" || item.gender === "Perempuan" || item.jenisKelamin === "P") ? "P" : "L",
            religius: existing.religius || "BSH",
            jujur: existing.jujur || "BSH",
            disiplin: existing.disiplin || "BSH",
            peduli: existing.peduli || "BSH",
            gotongRoyong: existing.gotongRoyong || "BSH",
            catatanKarakter: existing.catatanKarakter || "Menunjukkan pembiasaan karakter yang baik dan santun selama proses bimbingan kelas."
          };
        });
        setStudents(syncedStudents);
      } else {
        setStudents(DEFAULT_CHARACTERS);
      }
    };

    loadProfile();
    loadStudents();

    const handleProfileUpdate = () => {
      loadProfile();
      loadStudents();
    };

    window.addEventListener("omega-school-profile-updated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, []);

  // Save changes to character local store whenever students state changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("omega_character_students", JSON.stringify(students));
    }
  }, [students]);

  // modal & loading states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalNisn, setModalNisn] = useState("");
  const [modalGender, setModalGender] = useState<"L" | "P">("L");
  const [modalReligius, setModalReligius] = useState<"BB" | "MB" | "BSH" | "SB">("BSH");
  const [modalJujur, setModalJujur] = useState<"BB" | "MB" | "BSH" | "SB">("BSH");
  const [modalDisiplin, setModalDisiplin] = useState<"BB" | "MB" | "BSH" | "SB">("BSH");
  const [modalPeduli, setModalPeduli] = useState<"BB" | "MB" | "BSH" | "SB">("BSH");
  const [modalGotongRoyong, setModalGotongRoyong] = useState<"BB" | "MB" | "BSH" | "SB">("BSH");
  const [modalCatatan, setModalCatatan] = useState("");

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [aiReport, setAiReport] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [isSavedToBank, setIsSavedToBank] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
  };

  const isKarakterUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("nilai_karakter");
    } catch {
      return true;
    }
  })();

  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setModalName("");
    setModalNisn("");
    setModalGender("L");
    setModalReligius("BSH");
    setModalJujur("BSH");
    setModalDisiplin("BSH");
    setModalPeduli("BSH");
    setModalGotongRoyong("BSH");
    setModalCatatan("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (s: StudentCharacter) => {
    setEditingStudentId(s.id);
    setModalName(s.name);
    setModalNisn(s.nisn || "");
    setModalGender(s.gender);
    setModalReligius(s.religius);
    setModalJujur(s.jujur);
    setModalDisiplin(s.disiplin);
    setModalPeduli(s.peduli);
    setModalGotongRoyong(s.gotongRoyong);
    setModalCatatan(s.catatanKarakter);
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKarakterUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI KARAKTER untuk mengedit data ini.");
      return;
    }
    if (!modalName.trim()) return;

    if (editingStudentId) {
      // Update master registry
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList = masterList.map((m: any) => m.id === editingStudentId ? { ...m, name: modalName, gender: modalGender, nisn: modalNisn } : m);
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      setStudents(prev => prev.map(s => s.id === editingStudentId ? {
        ...s,
        name: modalName,
        nisn: modalNisn,
        gender: modalGender,
        religius: modalReligius,
        jujur: modalJujur,
        disiplin: modalDisiplin,
        peduli: modalPeduli,
        gotongRoyong: modalGotongRoyong,
        catatanKarakter: modalCatatan
      } : s));
      triggerToast(`✓ Berhasil Diupdate! Penilaian karakter siswa "${modalName}" telah disimpan secara permanen luring.`);
    } else {
      const newId = "std-" + Date.now();
      // Update master registry
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList.push({ id: newId, name: modalName, gender: modalGender, nisn: modalNisn });
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      const newS: StudentCharacter = {
        id: newId,
        nisn: modalNisn,
        name: modalName,
        gender: modalGender,
        religius: modalReligius,
        jujur: modalJujur,
        disiplin: modalDisiplin,
        peduli: modalPeduli,
        gotongRoyong: modalGotongRoyong,
        catatanKarakter: modalCatatan || "Perkembangan umum berjalan kondusif sesuai target pembelajaran."
      };
      setStudents(prev => [...prev, newS]);
      triggerToast(`✓ Berhasil Ditambahkan! Murid baru "${modalName}" beserta data penilaian karakternya telah disimpan secara permanen.`);
    }
    setShowAddModal(false);
    setIsSavedToBank(false);

    // Dispatch sync event
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  };

  const handleDeleteStudent = (id: string) => {
    if (!isKarakterUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI KARAKTER untuk mengedit data ini.");
      return;
    }
    const student = students.find(s => s.id === id);
    const name = student ? student.name : "murid ini";
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus data penilaian karakter untuk ${name} beserta registry utamanya?`);
    setDeleteConfirmCallback(() => () => {
      // Update master registry
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList = masterList.filter((m: any) => m.id !== id);
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      setStudents(prev => prev.filter(s => s.id !== id));
      setIsSavedToBank(false);

      // Dispatch sync event
      window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    });
    setDeleteConfirmId(id);
  };

  // Metrics calculation
  const getDimensionStatPercent = (dim: keyof StudentCharacter) => {
    const total = students.length || 1;
    const bshOrSb = students.filter(s => {
      const val = s[dim];
      return val === "BSH" || val === "SB";
    }).length;
    return Math.round((bshOrSb / total) * 100);
  };

  const avgReligius = getDimensionStatPercent("religius");
  const avgJujur = getDimensionStatPercent("jujur");
  const avgDisiplin = getDimensionStatPercent("disiplin");
  const avgPeduli = getDimensionStatPercent("peduli");
  const avgGotong = getDimensionStatPercent("gotongRoyong");

  const totalMinBshCount = students.filter(s => {
    const values = [s.religius, s.jujur, s.disiplin, s.peduli, s.gotongRoyong];
    return values.filter(v => v === "BB" || v === "MB").length >= 3;
  }).length;

  const handleRequestAiDiagnose = async () => {
    if (!isKarakterUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI KARAKTER untuk mengedit data ini.");
      return;
    }
    setLoading(true);
    setLoadingStatus("Menyiapkan pilar penilaian karakter...");

    try {
      setTimeout(() => {
        setLoadingStatus("Mengevaluasi pilar karakter & keselarasan kemendikbud...");
      }, 1500);
      setTimeout(() => {
        setLoadingStatus("Merumuskan strategi penguatan perilaku & karakter...");
      }, 3000);

      const response = await fetch("/api/generate-character-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaSekolah,
          kelas,
          tahunAjaran,
          namaGuru,
          kepalaSekolah,
          students,
          metrics: {
            avgReligius,
            avgJujur,
            avgDisiplin,
            avgPeduli,
            avgGotong,
            totalMinBshCount
          },
          criteria
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Gagal menghasilkan evaluasi.");
      }

      setAiReport(resData.text);
      setIsSavedToBank(false);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Gagal menghubungi Gemini AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSaveToDocumentBank = () => {
    if (!aiReport) return;
    try {
      const storedDocs = localStorage.getItem("omega_db_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      const newDoc = {
        id: "doc-char-" + Date.now(),
        name: `Laporan Penilaian Karakter - ${kelas}`,
        category: "manual",
        content: `========================================================
LAPORAN HASIL PENILAIAN KARAKTER SISWA
========================================================
Sekolah: ${namaSekolah}
Kelas: ${kelas} | Tahun Ajaran: ${tahunAjaran}
Guru Kelas: ${namaGuru}

Ulasan Karakter & Evaluasi Perilaku:
- Rerata Dimensi Religius: ${avgReligius}%
- Rerata Dimensi Jujur: ${avgJujur}%
- Rerata Dimensi Disiplin: ${avgDisiplin}%
- Rerata Dimensi Peduli: ${avgPeduli}%
- Rerata Dimensi Gotong Royong: ${avgGotong}%

REKOMENDASI PEDAGOGIAI:
${aiReport}
`,
        size: "4 KB",
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem("omega_db_documents", JSON.stringify([newDoc, ...currentDocs]));
      setIsSavedToBank(true);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan ke Bank Dokumen.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    
    // --- PAGE 1: KOP SURAT FORMAL, TITLE, METADATA & GRID TABLE ---
    const kopBaris1 = localStorage.getItem("kosp_kop_baris1") || "PEMERINTAH KABUPATEN TIMOR TENGAH UTARA";
    const kopBaris2 = localStorage.getItem("kosp_kop_baris2") || "DINAS PENDIDIKAN DAN KEBUDAYAAN";
    const kopBaris4 = localStorage.getItem("kosp_kop_baris4") || schoolAddress;

    // Elegant Sejajar Kop Surat Sekolah - aligned to center, symmetrical
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text(kopBaris1.toUpperCase(), 105, 12, { align: "center" });
    doc.text(kopBaris2.toUpperCase(), 105, 17, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(namaSekolah.toUpperCase(), 105, 23, { align: "center" });
    
    // Address detail in Kop under school name
    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(8);
    doc.text(`Alamat: ${kopBaris4}`, 105, 27.5, { align: "center" });
    
    // Thick double line dividers (classic Indonesian Kop Surat separator)
    doc.setLineWidth(0.8);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 30.2, 196, 30.2);
    doc.setLineWidth(0.25);
    doc.line(14, 31.2, 196, 31.2);
    
    // Capitalized Title, centered
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    const docTitle = `LAPORAN REKAPITULASI & EVALUASI PENILAIAN KARAKTER SISWA`;
    const docSubtitle = `TAHUN AJARAN ${tahunAjaran.toUpperCase()}`;
    doc.text(docTitle, 105, 39.5, { align: "center" });
    doc.text(docSubtitle, 105, 44.5, { align: "center" });
    
    // Document Meta Info Row
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Kelas/Fase: ${kelas}`, 14, 51.5);
    doc.text(`Semester: ${semester}`, 196, 51.5, { align: "right" });
    
    // Light table separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 55.5, 196, 55.5);
    
    // Section A: Grid Table Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text("A. DAFTAR REKAPITULASI CAPAIAN INDIVIDU MURID", 14, 61.5);
    doc.setTextColor(0, 0, 0); // reset

    // Legend / Keterangan Box (to clarify abbreviations for readers)
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Keterangan Kriteria Capaian: BB = Belum Berkembang  |  MB = Mulai Berkembang  |  BSH = Berkembang Sesuai Harapan  |  SB = Sangat Berkembang", 14, 66.5);
    doc.setTextColor(0, 0, 0); // reset
    
    const startY = 70.5;
    doc.setFillColor(30, 41, 59); // Indigo/Slate dark header matching LitNumProgress
    doc.rect(14, startY, 182, 8.5, "F");
    
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.35);
    doc.line(14, startY, 196, startY);
    doc.line(14, startY + 8.5, 196, startY + 8.5);
    
    // Draw white dividers in header for visual symmetry (fully framed on all sides)
    doc.line(14, startY, 14, startY + 8.5);
    doc.line(196, startY, 196, startY + 8.5);
    doc.line(23, startY, 23, startY + 8.5);
    doc.line(91, startY, 91, startY + 8.5);
    doc.line(101, startY, 101, startY + 8.5);
    doc.line(120, startY, 120, startY + 8.5);
    doc.line(139, startY, 139, startY + 8.5);
    doc.line(158, startY, 158, startY + 8.5);
    doc.line(177, startY, 177, startY + 8.5);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.0);
    doc.text("NO", 18.5, startY + 5.5, { align: "center" });
    doc.text("NAMA LENGKAP SISWA & NISN", 25, startY + 5.5);
    doc.text("L/P", 96, startY + 5.5, { align: "center" });
    doc.text(criteria.religius.short.toUpperCase(), 110.5, startY + 5.5, { align: "center" });
    doc.text(criteria.jujur.short.toUpperCase(), 129.5, startY + 5.5, { align: "center" });
    doc.text(criteria.disiplin.short.toUpperCase(), 148.5, startY + 5.5, { align: "center" });
    doc.text(criteria.peduli.short.toUpperCase(), 167.5, startY + 5.5, { align: "center" });
    doc.text(criteria.gotongRoyong.short.toUpperCase(), 186.5, startY + 5.5, { align: "center" });
    
    doc.setTextColor(0, 0, 0); // reset
    
    // Render Grid Cells
    let currentY = startY + 8.5;
    
    students.forEach((s, idx) => {
      const rowHeight = 8.5;
      
      // Page Break Guard inside table
      if (currentY + rowHeight > 275) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.35);
        doc.line(14, currentY, 196, currentY); // Cap the boundary line on current page
        
        doc.addPage();
        
        // Print continued title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text("A. DAFTAR REKAPITULASI CAPAIAN INDIVIDU MURID (LANJUTAN)", 14, 15);
        
        // Redraw table headers on new page
        const startNewY = 20;
        doc.setFillColor(30, 41, 59); // Indigo/Slate dark header
        doc.rect(14, startNewY, 182, 8.5, "F");
        
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.35);
        doc.line(14, startNewY, 196, startNewY);
        doc.line(14, startNewY + 8.5, 196, startNewY + 8.5);
        
        // Column separators on new page header
        doc.line(14, startNewY, 14, startNewY + 8.5);
        doc.line(196, startNewY, 196, startNewY + 8.5);
        doc.line(23, startNewY, 23, startNewY + 8.5);
        doc.line(91, startNewY, 91, startNewY + 8.5);
        doc.line(101, startNewY, 101, startNewY + 8.5);
        doc.line(120, startNewY, 120, startNewY + 8.5);
        doc.line(139, startNewY, 139, startNewY + 8.5);
        doc.line(158, startNewY, 158, startNewY + 8.5);
        doc.line(177, startNewY, 177, startNewY + 8.5);
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.0);
        doc.text("NO", 18.5, startNewY + 5.5, { align: "center" });
        doc.text("NAMA LENGKAP SISWA & NISN", 25, startNewY + 5.5);
        doc.text("L/P", 96, startNewY + 5.5, { align: "center" });
        doc.text(criteria.religius.short.toUpperCase(), 110.5, startNewY + 5.5, { align: "center" });
        doc.text(criteria.jujur.short.toUpperCase(), 129.5, startNewY + 5.5, { align: "center" });
        doc.text(criteria.disiplin.short.toUpperCase(), 148.5, startNewY + 5.5, { align: "center" });
        doc.text(criteria.peduli.short.toUpperCase(), 167.5, startNewY + 5.5, { align: "center" });
        doc.text(criteria.gotongRoyong.short.toUpperCase(), 186.5, startNewY + 5.5, { align: "center" });
        
        doc.setTextColor(0, 0, 0); // reset
        currentY = startNewY + 8.5;
      }
      
      // Draw row backgrounds (Zebra style)
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, rowHeight, "F");
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(14, currentY, 182, rowHeight, "F");
      }
      
      // Draw grid cell boundaries
      doc.setDrawColor(180, 180, 180); // beautiful, clear, balanced grid lines
      doc.setLineWidth(0.35);
      doc.rect(14, currentY, 182, rowHeight, "S");
      
      // Draw cell column split dividers
      doc.line(23, currentY, 23, currentY + rowHeight);
      doc.line(91, currentY, 91, currentY + rowHeight);
      doc.line(101, currentY, 101, currentY + rowHeight);
      doc.line(120, currentY, 120, currentY + rowHeight);
      doc.line(139, currentY, 139, currentY + rowHeight);
      doc.line(158, currentY, 158, currentY + rowHeight);
      doc.line(177, currentY, 177, currentY + rowHeight);
      
      // Fill values
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.0);
      doc.text(String(idx + 1), 18.5, currentY + 5.5, { align: "center" });
      
      doc.setFont("Helvetica", "bold");
      let nameText = s.name;
      if (nameText.length > 34) {
        nameText = nameText.substring(0, 32) + "...";
      }
      doc.text(nameText, 25, currentY + 4.2);
      
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(s.nisn ? `NISN: ${s.nisn}` : "NISN: -", 25, currentY + 7.2);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.0);
      doc.setTextColor(0, 0, 0); // reset
      
      doc.text(s.gender, 96, currentY + 5.5, { align: "center" });
      
      // Print 5 Dimensions with beautiful color-codes
      const dims = [s.religius, s.jujur, s.disiplin, s.peduli, s.gotongRoyong];
      const dimOffsets = [110.5, 129.5, 148.5, 167.5, 186.5];
      
      dims.forEach((val, dIdx) => {
        const colX = dimOffsets[dIdx];
        if (val === "SB" || val === "BSH") {
          doc.setFont("Helvetica", "bold");
          if (val === "SB") {
            doc.setTextColor(16, 185, 129); // emerald
          } else {
            doc.setTextColor(37, 99, 235); // blue
          }
        } else {
          doc.setFont("Helvetica", "normal");
          if (val === "MB") {
            doc.setTextColor(217, 119, 6); // amber
          } else {
            doc.setTextColor(220, 38, 38); // red
          }
        }
        
        doc.text(val, colX, currentY + 5.5, { align: "center" });
        doc.setTextColor(0, 0, 0); // reset
      });
      
      currentY += rowHeight;
    });
    
    // Close the table with a matching border style
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.35);
    doc.line(14, currentY, 196, currentY);

    // --- PAGE 2: DIAGRAM KETERCAPAIAN DIMENSI KARAKTER ---
    doc.addPage();
    
    // Custom header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // light template slate
    doc.text(`KARAKTER PROFIL LULUSAN - ${namaSekolah.toUpperCase()}`, 14, 12);
    doc.setLineWidth(0.2);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 14, 196, 14);
    
    // Section B: Graphical Progress Diagram
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59); // Aligned deep slate color
    doc.text("B. DIAGRAM KETERCAPAIAN 5 DIMENSI KARAKTER (% MINIMAL BSH/SB)", 14, 23);
    doc.setTextColor(0, 0, 0); // reset
    
    // Bento-style rounded card around the diagram
    doc.setDrawColor(226, 232, 240); // Soft color border
    doc.setFillColor(248, 250, 252); // extremely soft off-white fill
    doc.roundedRect(14, 28, 182, 58, 4, 4, "FD");
    
    // Draw 5 horizontal progress bars with elegant vertical spacing
    const dimensions = [
      { name: `1. ${criteria.religius.short.toUpperCase()}`, val: avgReligius },
      { name: `2. ${criteria.jujur.short.toUpperCase()}`, val: avgJujur },
      { name: `3. ${criteria.disiplin.short.toUpperCase()}`, val: avgDisiplin },
      { name: `4. ${criteria.peduli.short.toUpperCase()}`, val: avgPeduli },
      { name: `5. ${criteria.gotongRoyong.short.toUpperCase()}`, val: avgGotong }
    ];
    
    dimensions.forEach((dim, dIdx) => {
      const yOffset = 37.5 + (dIdx * 9.5);
      
      // Label
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.0);
      doc.setTextColor(51, 65, 85);
      doc.text(dim.name, 19, yOffset);
      
      // Shaded progress bar background
      doc.setFillColor(226, 232, 240); // empty track gray
      doc.roundedRect(56, yOffset - 3, 100, 3.5, 1.2, 1.2, "F");
      
      // Active progress bar fill
      const fillWidth = Math.max(2, (dim.val * 100) / 100);
      doc.setFillColor(16, 185, 129); // Beautiful emerald green
      doc.roundedRect(56, yOffset - 3, fillWidth, 3.5, 1.2, 1.2, "F");
      
      // Percentage indicator & rating text on right
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      let cat = "Perlu Bimbingan";
      if (dim.val >= 75) {
        doc.setTextColor(16, 185, 129); // emerald Green
        cat = "Sangat Baik";
      } else if (dim.val >= 50) {
        doc.setTextColor(37, 99, 235); // Blue
        cat = "Berkembang";
      } else {
        doc.setTextColor(220, 38, 38); // Red
      }
      doc.text(`${dim.val}% (${cat})`, 160, yOffset);
    });
    
    doc.setTextColor(0, 0, 0); // reset
    
    // --- SECTION C: ANALISIS DESKRIPTIF & REKOMENDASI PEMBINAAN KARAKTER (AI) ---
    // Combined on the same page as Point B (Diagram)
    currentY = 92;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text("C. ANALISIS DESKRIPTIF & REKOMENDASI PEMBINAAN KARAKTER (AI)", 14, currentY);
    doc.setTextColor(0, 0, 0); // reset
    currentY += 6;

    // --- EVALUATIONS & AI REPORT GENERATION SECTION ---
    // Fallback template is free of teacher/headmaster names and extremely dynamic
    const finalReportText = aiReport || `Berdasarkan rekapitulasi data penilaian karakter di ${namaSekolah} kelas ${kelas} Semester Ganjil Tahun Pelajaran ${tahunAjaran}, diperoleh kesimpulan pembinaan perilaku sebagai berikut:

===================================================================
1. EVALUASI DAN INTERPRETASI TREN PERILAKU KELAS
===================================================================
Pembagian dinamika karakter di dalam kelas menunjukkan capaian yang signifikan. Rata-rata persentase ketercapaian siswa (kategori minimal BSH/SB) adalah: ${criteria.religius.name} berada pada tingkat ${avgReligius}%, ${criteria.jujur.name} pada level ${avgJujur}%, tingkat ${criteria.disiplin.name} mencapai ${avgDisiplin}%, Sikap ${criteria.peduli.name} ${avgPeduli}%, serta dimensi ${criteria.gotongRoyong.name} mencapai ${avgGotong}%. Secara agregat, mayoritas murid telah menunjukkan kedewasaan karakter yang ajek. Tantangan atau pilar yang paling butuh pembinaan berkesinambungan adalah pilar kedisiplinan mandiri serta kemandirian perilaku, yang memerlukan pengawasan asertif di lingkungan kelas harian.

===================================================================
2. STRATEGI PEMBELAJARAN DIFERENSIASI PROJEK KOKURIKULER (3 PILAR UTAMA)
===================================================================
Terapkan perbaikan pilar karakter murid secara berkala lintas kelas harian:
- Pendekatan Mindful: Pendidik membiasakan rutinitas ibadah, program harian "Refleksi Sukacita", empati antarsebaya di awal sesi pelajaran, dan kontrol diri siswa sebelum masuk kelas.
- Pendekatan Meaningful: Merancang proyek piket kolaboratif kelas, pembiasaan berbagi bekal bersama, melatih ketulusan saling menolong rekan sakit, serta melestarikan aksi kepedulian di kelas.
- Pendekatan Joyful: Merancang permainan penguatan karakter interaktif tanpa kompetisi fisik yang menegangkan, seperti "Estafet Bintang Karakter" serta "Pohon Empati Sahabat" guna menautkan persahabatan serta merangsang kesetiakawanan anak diiringi riang gembira.

===================================================================
3. REKOMENDASI KHUSUS DAN ACTION PLAN PERSONAL SISWA
===================================================================
Bagi siswa terdeteksi yang masih berada pada tingkat Belum Berkembang (BB) atau Mulai Berkembang (MB) pada pilar mayoritas harian, wali kelas disarankan menerapkan model dialog asertif personal, menyusun lembar pembiasaan mandiri terpadu sinkron dengan pihak orang tua murid di rumah. Berikan apresiasi langsung yang tulus sekecil apa pun kemajuan perilakunya guna membakar motivasi internal murid secara berkelanjutan.`;

    // Strict cleaning filter for any names in description just to be absolutely bulletproof
    let cleanReportText = finalReportText;
    if (namaGuru) {
      const escapedGuru = namaGuru.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      cleanReportText = cleanReportText.replace(new RegExp(escapedGuru, 'g'), "Wali Kelas");
    }
    if (kepalaSekolah) {
      const escapedKepala = kepalaSekolah.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      cleanReportText = cleanReportText.replace(new RegExp(escapedKepala, 'g'), "Kepala Sekolah");
    }
    
    cleanReportText = cleanReportText
      .replace(/Bapak Roni Hariyanto Bhidju, S\.Pd\.,Gr\./g, "Wali Kelas")
      .replace(/Bapak Roni Hariyanto Bhidju/g, "Wali Kelas")
      .replace(/Roni Hariyanto Bhidju, S\.Pd\.,Gr\./g, "Wali Kelas")
      .replace(/Roni Hariyanto Bhidju/g, "Wali Kelas")
      .replace(/Bapak Roni/g, "Wali Kelas")
      .replace(/Bapak Darius Kusi, S\.Pd\.,Gr\./g, "Kepala Sekolah")
      .replace(/Bapak Darius Kusi/g, "Kepala Sekolah")
      .replace(/Darius Kusi, S\.Pd\.,Gr\./g, "Kepala Sekolah")
      .replace(/Darius Kusi/g, "Kepala Sekolah")
      .replace(/Bapak Darius/g, "Kepala Sekolah")
      .replace(/namaGuru/g, "Guru Kelas")
      .replace(/kepalaSekolah/g, "Kepala Sekolah");

    const writeReportLine = (lineText: string, cursorY: number, pageHeightLimit = 275, lineSpacing = 5.2): number => {
      const cleanLine = lineText.replace(/[*`_-]/g, "").trim();
      if (!cleanLine) return cursorY + 2;

      const isHeader = lineText.startsWith("===") || lineText.startsWith("---") || (lineText.match(/^\d+\./) && lineText.toUpperCase() === lineText);
      const isBullet = lineText.startsWith("-") || lineText.startsWith("*");

      if (isHeader) {
        if (cursorY + 12 > pageHeightLimit) {
          doc.addPage();
          cursorY = 22;
        }
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(cleanLine, 14, cursorY + 4);
        doc.setTextColor(0, 0, 0); // reset
        doc.setFont("Helvetica", "normal");
        return cursorY + 10;
      }

      doc.setFontSize(8.5);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(51, 65, 85); // elegant charcoal gray

      const leftMargin = isBullet ? 18 : 14;
      const textWidth = isBullet ? 178 : 182;
      
      if (isBullet) {
        doc.text("•", 14, cursorY);
      }

      const lines = doc.splitTextToSize(cleanLine, textWidth);
      lines.forEach((line: string) => {
        if (cursorY + lineSpacing > pageHeightLimit) {
          doc.addPage();
          cursorY = 22;
          
          doc.setFontSize(7.5);
          doc.setFont("Helvetica", "bold");
          doc.setTextColor(150, 150, 150);
          doc.text("C. ANALISIS DESKRIPTIF & REKOMENDASI PEMBINAAN KARAKTER AI (LANJUTAN)", 14, 14);
          doc.setFontSize(8.5);
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(51, 65, 85);
        }
        doc.text(line, leftMargin, cursorY);
        cursorY += lineSpacing;
      });

      doc.setTextColor(0, 0, 0); // reset
      return cursorY + 1.5;
    };

    let forcePageBreakForPoint3 = false;
    const reportLines = cleanReportText.split("\n");
    for (let i = 0; i < reportLines.length; i++) {
      const line = reportLines[i];
      // If of the divider line immediately preceding Point 3, or Point 3 line itself, force page split
      const isPrecedingDivider = line.startsWith("===") && i + 1 < reportLines.length && reportLines[i + 1].includes("3. REKOMENDASI KHUSUS");
      const isPoint3Line = line.includes("3. REKOMENDASI KHUSUS");

      if ((isPrecedingDivider || isPoint3Line) && !forcePageBreakForPoint3) {
        doc.addPage();
        currentY = 22;
        forcePageBreakForPoint3 = true;

        // Print header on new page
        doc.setFontSize(7.5);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(150, 150, 150);
        doc.text("C. ANALISIS DESKRIPTIF & REKOMENDASI PEMBINAAN KARAKTER AI (LANJUTAN)", 14, 14);
      }
      currentY = writeReportLine(line, currentY);
    }
    
    // --- SIGNATURES SECTION ---
    if (currentY + 42 > 275) {
      doc.addPage();
      currentY = 25;
    } else {
      currentY += 15;
    }
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`${tempatPenyusunan}, ${tanggalPenyusunan}`, 165, currentY, { align: "center" });
    
    currentY += 6;
    doc.text("Mengetahui,", 14, currentY);
    doc.text("Guru Kelas,", 165, currentY, { align: "center" });
    
    currentY += 5;
    doc.text("Kepala Sekolah,", 14, currentY); // Aligned cleanly to 'Mengetahui, Kepala Sekolah,'
    
    currentY += 21; // signature white space
    
    doc.setFont("Helvetica", "bold");
    doc.text(kepalaSekolah, 14, currentY);
    doc.text(namaGuru, 165, currentY, { align: "center" });
    
    doc.setFont("Helvetica", "normal");
    currentY += 4.5;
    doc.text(nipKepala ? `NIP. ${nipKepala}` : "NIP. -", 14, currentY);
    doc.text("NIP. -", 165, currentY, { align: "center" });
    
    doc.save(`Laporan_Penilaian_Karakter_${kelas.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-1 animate-fade-in relative">
      {loading && (
        <CinematicLoading 
          title="Asisten Penilaian Karakter" 
          subtitle={loadingStatus}
        />
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0c10] via-black to-[#050508] shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9.5px] font-mono tracking-widest font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 text-glow-amber mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-500/20" /> AKADEMIS SUITE
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
              Penilaian Karakter <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Siswa Sekolah</span>
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed font-sans">
              Evaluasi perkembangan dimensi karakter profil lulusan siswa secara objektif untuk merancang pembelajaran personal dan pembinaan budi pekerti secara holistik.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                localStorage.setItem("omega_character_students", JSON.stringify(students));
                triggerToast("✓ Berhasil Disimpan! Seluruh data penilaian karakter dan catatan wali kelas telah tersimpan secara permanen luring.");
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" /> SIMPAN DATA KARAKTER
            </button>
            <button
              onClick={handleRequestAiDiagnose}
              disabled={students.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 hover:text-white text-zinc-300 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> ANALISIS DESKRIPTIF AI
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 flex items-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-zinc-400" /> DOWNLOAD RAPOR (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Murid Dinilai</span>
            <p className="text-xl font-black text-white">{students.length} <span className="text-xs text-zinc-650 font-normal">Siswa</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">{criteria.religius.short} & {criteria.jujur.short}</span>
            <p className="text-xl font-black text-emerald-400">{Math.round((avgReligius + avgJujur) / 2)}% <span className="text-xs text-zinc-650 font-normal">BSH / SB</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-550 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">{criteria.disiplin.short} & {criteria.peduli.short}</span>
            <p className="text-xl font-black text-amber-500">{Math.round((avgDisiplin + avgPeduli) / 2)}% <span className="text-xs text-zinc-650 font-normal">BSH / SB</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Perlu Bimbingan Ekstra</span>
            <p className="text-xl font-black text-rose-500">{totalMinBshCount} <span className="text-xs text-zinc-650 font-normal">Siswa</span></p>
          </div>
        </div>
      </div>

      {/* Interactive Student List - Full Width */}
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> REKAP NILAI KARAKTER MURID
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCriteriaModal(true)}
                  className="px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> SUNTING KRITERIA
                </button>
                <button 
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-[#f59e0b] border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> TAMBAH MURID
                </button>
              </div>
            </div>
 
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    <th className="pb-2.5 font-bold">No</th>
                    <th className="pb-2.5 font-bold">Nama Murid & NISN</th>
                    <th className="pb-2.5 font-bold text-center">G</th>
                    <th className="pb-2.5 text-center font-bold">{criteria.religius.short}</th>
                    <th className="pb-2.5 text-center font-bold">{criteria.jujur.short}</th>
                    <th className="pb-2.5 text-center font-bold">{criteria.disiplin.short}</th>
                    <th className="pb-2.5 text-center font-bold">{criteria.peduli.short}</th>
                    <th className="pb-2.5 text-center font-bold">{criteria.gotongRoyong.short}</th>
                    <th className="pb-2.5 text-right font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-950 font-sans text-xs">
                  {students.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-zinc-900/30 transition-all">
                      <td className="py-2 text-center text-zinc-500">
                        <span className="inline-flex w-5.5 h-5.5 rounded-full items-center justify-center font-mono text-[9px] font-black bg-black border border-yellow-400 text-yellow-400 select-none shadow-[0_0_8px_rgba(250,204,21,0.2)]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-left">
                        <span className="font-extrabold text-white block truncate max-w-[200px]" title={s.name}>{s.name}</span>
                        {s.nisn && <span className="text-[10px] text-zinc-500 block font-mono">NISN: {s.nisn}</span>}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-zinc-400">{s.gender}</td>
                      
                      {/* Scores Cells */}
                      <td className="py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${METRIC_LABELS[s.religius].color}`}>
                          {s.religius}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${METRIC_LABELS[s.jujur].color}`}>
                          {s.jujur}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${METRIC_LABELS[s.disiplin].color}`}>
                          {s.disiplin}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${METRIC_LABELS[s.peduli].color}`}>
                          {s.peduli}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-extrabold ${METRIC_LABELS[s.gotongRoyong].color}`}>
                          {s.gotongRoyong}
                        </span>
                      </td>
 
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleOpenEditModal(s)}
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-850 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(s.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 hover:text-rose-450 rounded border border-rose-500/15 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-8 text-zinc-650 tracking-wider uppercase font-mono text-[10px]">
                        Belum ada siswa terdaftar dalam penilaian karakter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Skoring Indikator Section below table */}
            <div className="mt-6 pt-4 border-t border-zinc-900">
              <span className="block text-[10.5px] font-extrabold text-[#f5a623] uppercase font-mono tracking-wider mb-2.5">
                Panduan Skoring Indikator Karakter:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-[11px] font-sans">
                <div className="bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 p-2.5 rounded-xl transition duration-250">
                  <span className="font-extrabold text-red-500 font-mono block mb-0.5">BB (Belum Berkembang)</span>
                  <span className="text-zinc-400">Siswa belum memperlihatkan perilaku yang diharapkan pada lembar karakter.</span>
                </div>
                <div className="bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 p-2.5 rounded-xl transition duration-250">
                  <span className="font-extrabold text-amber-500 font-mono block mb-0.5">MB (Mulai Berkembang)</span>
                  <span className="text-zinc-400">Siswa baru menunjukkan kemunculan awal tanda-tanda perilaku yang diharapkan.</span>
                </div>
                <div className="bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/10 p-2.5 rounded-xl transition duration-250">
                  <span className="font-extrabold text-blue-400 font-mono block mb-0.5">BSH (Sesuai Harapan)</span>
                  <span className="text-[#93c5fd] font-medium">Siswa secara mandiri dan ajek memperlihatkan perilaku secara berulang.</span>
                </div>
                <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 p-2.5 rounded-xl transition duration-250">
                  <span className="font-extrabold text-emerald-400 font-mono block mb-0.5">SB (Sangat Berkembang)</span>
                  <span className="text-zinc-350">Siswa melampaui standar, bahkan bersedia menjadi tutor sebaya bagi rekan kelas.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AI Diagnostik & Analysis Output Board */}
      {aiReport && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" /> HASIL DIAGNOSIS KARAKTER & STRATEGI PEMBELAJARAN AI
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleCopyToClipboard}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-850 hover:border-zinc-700 flex items-center gap-1.5"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> TERSALIN
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" /> SALIN TEKS
                  </>
                )}
              </button>
              <button 
                onClick={handleSaveToDocumentBank}
                disabled={isSavedToBank}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
                  isSavedToBank 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                    : "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-850 hover:border-zinc-700"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                {isSavedToBank ? "TERSIPAN DI BANK" : "SIMPAN DI BANK"}
              </button>
            </div>
          </div>

          <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-5 space-y-4 font-sans text-sm leading-relaxed text-zinc-300">
            <div className="prose prose-invert max-w-none text-zinc-300 space-y-4 min-h-48 pt-1">
              <div className="p-5 rounded-xl bg-black/40 border border-zinc-900 text-xs whitespace-pre-wrap leading-relaxed font-mono text-zinc-300">
                {aiReport}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-800 max-w-lg w-full rounded-2xl shadow-2xl p-6 font-sans flex flex-col max-h-[90vh] my-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3 flex items-center gap-2 flex-shrink-0">
              <Award className="w-4 h-4 text-amber-500" /> {editingStudentId ? "SUNTING DESKRIPSI KARAKTER SISWA" : "TAMBAH DATA MURID BARU"}
            </h3>

            <form onSubmit={handleSaveStudent} className="flex-1 flex flex-col overflow-hidden min-h-0 mt-3 pt-1">
              {/* Scrollable Form Body Container */}
              <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">Nama Lengkap Murid</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">G</label>
                    <select 
                      value={modalGender}
                      onChange={(e) => setModalGender(e.target.value as "L" | "P")}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">NISN (Kosongkan jika belum ada)</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 3155685577"
                    value={modalNisn}
                    onChange={(e) => setModalNisn(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="border-t border-zinc-900 pt-3 space-y-3.5">
                  <span className="block text-[10px] font-extrabold text-[#f5a623] uppercase tracking-widest font-mono">5 Pilar Dimensi Karakter Siswa</span>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">1. {criteria.religius.name}</label>
                      <select 
                        value={modalReligius} 
                        onChange={(e) => setModalReligius(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-900 bg-black text-white"
                      >
                        <option value="BB">Belum Berkembang (BB)</option>
                        <option value="MB">Mulai Berkembang (MB)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH)</option>
                        <option value="SB">Sangat Berkembang (SB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">2. {criteria.jujur.name}</label>
                      <select 
                        value={modalJujur} 
                        onChange={(e) => setModalJujur(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-900 bg-black text-white"
                      >
                        <option value="BB">Belum Berkembang (BB)</option>
                        <option value="MB">Mulai Berkembang (MB)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH)</option>
                        <option value="SB">Sangat Berkembang (SB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">3. {criteria.disiplin.name}</label>
                      <select 
                        value={modalDisiplin} 
                        onChange={(e) => setModalDisiplin(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-900 bg-black text-white"
                      >
                        <option value="BB">Belum Berkembang (BB)</option>
                        <option value="MB">Mulai Berkembang (MB)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH)</option>
                        <option value="SB">Sangat Berkembang (SB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">4. {criteria.peduli.name}</label>
                      <select 
                        value={modalPeduli} 
                        onChange={(e) => setModalPeduli(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-900 bg-black text-white"
                      >
                        <option value="BB">Belum Berkembang (BB)</option>
                        <option value="MB">Mulai Berkembang (MB)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH)</option>
                        <option value="SB">Sangat Berkembang (SB)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">5. {criteria.gotongRoyong.name}</label>
                      <select 
                        value={modalGotongRoyong} 
                        onChange={(e) => setModalGotongRoyong(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-900 bg-black text-white"
                      >
                        <option value="BB">Belum Berkembang (BB)</option>
                        <option value="MB">Mulai Berkembang (MB)</option>
                        <option value="BSH">Berkembang Sesuai Harapan (BSH)</option>
                        <option value="SB">Sangat Berkembang (SB)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono">Catatan Karakter Anektodal / Kualitatif</label>
                    <textarea 
                      value={modalCatatan}
                      onChange={(e) => setModalCatatan(e.target.value)}
                      rows={3}
                      placeholder="Contoh: Selalu giat berkolaborasi membantu pengerjaan prakarya luring..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="flex gap-2 justify-end border-t border-zinc-900 pt-3.5 flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 transition cursor-pointer"
                >
                  BATAL
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold uppercase rounded-xl bg-[#f5a623] hover:bg-[#e0951a] text-black transition active:scale-95 space-x-1 cursor-pointer"
                >
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Character Criteria Settings Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-800 max-w-2xl w-full rounded-2xl shadow-2xl p-6 font-sans flex flex-col max-h-[90vh] my-auto">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 flex-shrink-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" /> SUNTING KRITERIA KARAKTER SEKOLAH
              </h3>
              <button 
                type="button"
                onClick={() => {
                  if (!isKarakterUnlocked) {
                    triggerToast("Paket Belum Aktif: Silakan beli paket NILAI KARAKTER untuk mengedit data ini.");
                    return;
                  }
                  setCriteria(DEFAULT_CRITERIA);
                  triggerToast("✓ Kriteria diset ulang ke standar Kemendikbud!");
                }}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-zinc-900 hover:bg-zinc-850 text-amber-500 border border-zinc-855 cursor-pointer"
              >
                Reset ke Default
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1.5 space-y-5 my-4 pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Sesuaikan nama pilar karakter, singkatan kode rekapitulasi, dan uraian indikator perilaku berdasarkan kebutuhan asesmen karakter murid di sekolah Anda.
              </p>

              {/* Grid block per criteria */}
              <div className="space-y-4">
                {/* 1. Religius */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 flex items-center justify-center font-mono text-[10px] font-bold text-indigo-400">1</span>
                    <span className="text-xs font-bold text-zinc-200">Kriteria Religiusitas</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Nama Panjang Kriteria</label>
                      <input 
                        type="text"
                        value={editReligiusName}
                        onChange={(e) => setEditReligiusName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Kode Singkat (Max 12 hrf)</label>
                      <input 
                        type="text"
                        value={editReligiusShort}
                        maxLength={12}
                        onChange={(e) => setEditReligiusShort(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Keterangan / Deskripsi Panduan Penilai</label>
                      <input 
                        type="text"
                        value={editReligiusDesc}
                        onChange={(e) => setEditReligiusDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Jujur */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 flex items-center justify-center font-mono text-[10px] font-bold text-indigo-400">2</span>
                    <span className="text-xs font-bold text-zinc-200">Kriteria Kejujuran</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Nama Panjang Kriteria</label>
                      <input 
                        type="text"
                        value={editJujurName}
                        onChange={(e) => setEditJujurName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Kode Singkat</label>
                      <input 
                        type="text"
                        value={editJujurShort}
                        maxLength={12}
                        onChange={(e) => setEditJujurShort(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Keterangan / Deskripsi Panduan Penilai</label>
                      <input 
                        type="text"
                        value={editJujurDesc}
                        onChange={(e) => setEditJujurDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Disiplin */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 flex items-center justify-center font-mono text-[10px] font-bold text-indigo-400">3</span>
                    <span className="text-xs font-bold text-zinc-200">Kriteria Kedisiplinan</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Nama Panjang Kriteria</label>
                      <input 
                        type="text"
                        value={editDisiplinName}
                        onChange={(e) => setEditDisiplinName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Kode Singkat</label>
                      <input 
                        type="text"
                        value={editDisiplinShort}
                        maxLength={12}
                        onChange={(e) => setEditDisiplinShort(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Keterangan / Deskripsi Panduan Penilai</label>
                      <input 
                        type="text"
                        value={editDisiplinDesc}
                        onChange={(e) => setEditDisiplinDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Peduli */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 flex items-center justify-center font-mono text-[10px] font-bold text-indigo-400">4</span>
                    <span className="text-xs font-bold text-zinc-200">Kriteria Kepedulian</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Nama Panjang Kriteria</label>
                      <input 
                        type="text"
                        value={editPeduliName}
                        onChange={(e) => setEditPeduliName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Kode Singkat</label>
                      <input 
                        type="text"
                        value={editPeduliShort}
                        maxLength={12}
                        onChange={(e) => setEditPeduliShort(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Keterangan / Deskripsi Panduan Penilai</label>
                      <input 
                        type="text"
                        value={editPeduliDesc}
                        onChange={(e) => setEditPeduliDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Gotong Royong */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 flex items-center justify-center font-mono text-[10px] font-bold text-indigo-400">5</span>
                    <span className="text-xs font-bold text-zinc-200">Kriteria Gotong Royong</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Nama Panjang Kriteria</label>
                      <input 
                        type="text"
                        value={editGotongName}
                        onChange={(e) => setEditGotongName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Kode Singkat</label>
                      <input 
                        type="text"
                        value={editGotongShort}
                        maxLength={12}
                        onChange={(e) => setEditGotongShort(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[9px] font-bold uppercase text-zinc-500 mb-1">Keterangan / Deskripsi Panduan Penilai</label>
                      <input 
                        type="text"
                        value={editGotongDesc}
                        onChange={(e) => setEditGotongDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-905 bg-black text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-zinc-900 pt-3.5 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setShowCriteriaModal(false)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 text-glow-none cursor-pointer"
              >
                BATAL
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (!isKarakterUnlocked) {
                    triggerToast("Paket Belum Aktif: Silakan beli paket NILAI KARAKTER untuk mengedit data ini.");
                    return;
                  }
                  setCriteria({
                    religius: { name: editReligiusName || DEFAULT_CRITERIA.religius.name, short: editReligiusShort || DEFAULT_CRITERIA.religius.short, desc: editReligiusDesc || DEFAULT_CRITERIA.religius.desc },
                    jujur: { name: editJujurName || DEFAULT_CRITERIA.jujur.name, short: editJujurShort || DEFAULT_CRITERIA.jujur.short, desc: editJujurDesc || DEFAULT_CRITERIA.jujur.desc },
                    disiplin: { name: editDisiplinName || DEFAULT_CRITERIA.disiplin.name, short: editDisiplinShort || DEFAULT_CRITERIA.disiplin.short, desc: editDisiplinDesc || DEFAULT_CRITERIA.disiplin.desc },
                    peduli: { name: editPeduliName || DEFAULT_CRITERIA.peduli.name, short: editPeduliShort || DEFAULT_CRITERIA.peduli.short, desc: editPeduliDesc || DEFAULT_CRITERIA.peduli.desc },
                    gotongRoyong: { name: editGotongName || DEFAULT_CRITERIA.gotongRoyong.name, short: editGotongShort || DEFAULT_CRITERIA.gotongRoyong.short, desc: editGotongDesc || DEFAULT_CRITERIA.gotongRoyong.desc }
                  });
                  setShowCriteriaModal(false);
                  triggerToast("✓ Berhasil menyimpan kriteria kustomisasi sekolah Anda!");
                }}
                className="px-5 py-2 text-xs font-extrabold uppercase rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
              >
                TERAPKAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-850 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Konfirmasi Hapus</h4>
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
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 transition cursor-pointer"
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

      {/* Floating Toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-55 bg-black border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] px-4 py-3.5 rounded-xl flex items-center gap-2.5 animate-slide-in font-sans">
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-400 font-extrabold" />
          </div>
          <span className="text-white text-xs font-bold leading-normal">{showToast}</span>
        </div>
      )}
    </div>
  );
};
