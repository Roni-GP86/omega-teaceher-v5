import React, { useState, useEffect } from "react";
import { 
  Users, Calendar, Download, Copy, Check, Plus, Trash2, 
  UserCheck, Percent, CheckCircle, FileText, Database, 
  HelpCircle, ChevronLeft, ChevronRight, RefreshCw, LayoutGrid,
  AlertTriangle, Save
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getTutWuriHandayaniLogo, getKemenagLogo, getDefaultSchoolLogo } from "../utils/logoGenerator";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

interface StudentAttendance {
  id: string;
  name: string;
  gender: "L" | "P";
  records: Record<number, "H" | "S" | "I" | "A">; // Day number (1-31) to status
}

const DEFAULT_ATTENDANCES: StudentAttendance[] = [
  { id: "std-1", name: "Florida Banusu", gender: "P", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-2", name: "Febrianus Hanoe", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-3", name: "Fransiskus Puatero", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-4", name: "Mateus Kause", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-5", name: "Natalia Buatefa", gender: "P", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-6", name: "Norbertus Hanoe", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-7", name: "Paskalis Hanoe", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-8", name: "Petrosia Kono Aran", gender: "P", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-9", name: "Syrilus Alexander Kosat", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-10", name: "Serilius Buatefa", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-11", name: "Yohanes Buatefa", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
  { id: "std-12", name: "Alfonsius Misa", gender: "L", records: { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H", 11: "H", 12: "H", 13: "H", 14: "H", 15: "H" } },
];

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const formatIndonesianDateOnly = (date: Date) => {
  const dayNum = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  const yearNum = date.getFullYear();
  return `${dayNum} ${monthName} ${yearNum}`;
};

export const AttendanceCard: React.FC = () => {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [namaSekolah, setNamaSekolah] = useState<string>("SD Negeri Fatubai");
  const [kelas, setKelas] = useState<string>("Fase B (Kelas 4)");
  const [tahunAjaran, setTahunAjaran] = useState<string>("2026/2027");
  const [namaGuru, setNamaGuru] = useState<string>("Roni Hariyanto Bhidju, S.Pd., Gr.");
  const [nipGuru, setNipGuru] = useState<string>("198603012020121005");
  const [kepalaSekolah, setKepalaSekolah] = useState<string>("Darius Kusi, S.Pd., Gr.");
  const [nipKepala, setNipKepala] = useState<string>("196709192008011008");
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(() => new Date().getMonth());
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [tempatPenyusunan, setTempatPenyusunan] = useState<string>("Oehalo");
  const [tanggalPenyusunan, setTanggalPenyusunan] = useState<string>(() => {
    return formatIndonesianDateOnly(new Date());
  });

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  // Work days policy & custom holidays state
  const [workDaysPolicy, setWorkDaysPolicy] = useState<"5" | "6">(() => {
    return (localStorage.getItem("omega_attendance_workdays_policy") as "5" | "6") || "5";
  });

  const [customHolidays, setCustomHolidays] = useState<Record<string, number[]>>(() => {
    try {
      const stored = localStorage.getItem("omega_attendance_custom_holidays");
      return stored ? JSON.parse(stored) : {};
    } catch (_) {
      return {};
    }
  });

  // Watch for changes to persist workDaysPolicy
  useEffect(() => {
    localStorage.setItem("omega_attendance_workdays_policy", workDaysPolicy);
  }, [workDaysPolicy]);

  // Active selected day state for daily actions, defaulting to today
  const [activeDay, setActiveDay] = useState<number>(() => {
    const today = new Date();
    return today.getDate();
  });

  // Toast feedback state and helper function
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: "success" | "info" | "warning" }>({
    message: "",
    visible: false,
    type: "success"
  });

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, visible: true, type });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const isAbsensiUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("absensi");
    } catch {
      return true;
    }
  })();

  const handleSetWorkDaysPolicy = (policy: "5" | "6") => {
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    if (workDaysPolicy === policy) return;
    setWorkDaysPolicy(policy);
    showToast(`Kebijakan kerja diubah menjadi ${policy} Hari Kerja! ⚙️`, "info");
  };

  // Sync with central SchoolProfile & Student database
  useEffect(() => {
    const loadProfile = () => {
      setNamaSekolah(localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai");
      setKelas(localStorage.getItem("kosp_fase_kelas") || "Fase B (Kelas 4)");
      setTahunAjaran(localStorage.getItem("kosp_tahun_pelajaran") || "2026/2027");
      setNamaGuru(localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.");
      setNipGuru(localStorage.getItem("kosp_nip_guru") || localStorage.getItem("omega_nip_guru") || "198603012020121005");
      setKepalaSekolah(localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.");
      setNipKepala(localStorage.getItem("kosp_nip_kepala") || "196709192008011008");
      setTempatPenyusunan(localStorage.getItem("kosp_tempat") || "Oehalo");
      setTanggalPenyusunan(localStorage.getItem("kosp_tanggal") || formatIndonesianDateOnly(new Date()));
    };

    const loadStudents = () => {
      let savedStudentsRaw = localStorage.getItem("omega_daftar_nilai_students");
      
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

      const savedAttendanceRaw = localStorage.getItem("omega_attendance_students");
      
      let parsedDaftarNilai: any[] = [];
      if (savedStudentsRaw) {
        try {
          parsedDaftarNilai = JSON.parse(savedStudentsRaw);
        } catch (e) {
          console.error(e);
        }
      }

      let existingAttendanceMap: Record<string, Record<number, "H" | "S" | "I" | "A">> = {};
      if (savedAttendanceRaw) {
        try {
          const parsed = JSON.parse(savedAttendanceRaw);
          parsed.forEach((s: any) => {
            existingAttendanceMap[s.name] = s.records || {};
          });
        } catch (e) {
          console.error(e);
        }
      }

      if (parsedDaftarNilai.length > 0) {
        const syncedStudents: StudentAttendance[] = parsedDaftarNilai.map((item: any, idx: number) => {
          const name = item.name || item.nama || `Siswa ${idx + 1}`;
          return {
            id: item.id || String(idx + 1),
            name: name,
            gender: (item.gender === "P" || item.gender === "Perempuan" || item.jenisKelamin === "P") ? "P" : "L",
            records: existingAttendanceMap[name] || { 1: "H", 2: "H", 3: "H", 4: "H", 5: "H", 6: "H", 7: "H", 8: "H", 9: "H", 10: "H" }
          };
        });
        setStudents(syncedStudents);
      } else {
        // Fallback to defaults
        setStudents(DEFAULT_ATTENDANCES);
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

  // Save changes to attendance local store whenever students state changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("omega_attendance_students", JSON.stringify(students));
    }
  }, [students]);

  // Real-time Date and clock
  const [realTimeTime, setRealTimeTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatIndonesianDateTime = (date: Date) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const yearNum = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${dayName}, ${dayNum} ${monthName} ${yearNum} - ${hours}:${minutes}:${seconds} WIB`;
  };

  // modal or editing states
  const [showAddStudentField, setShowAddStudentField] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState<"L" | "P">("L");
  const [isSavedToBank, setIsSavedToBank] = useState(false);

  // Month days count helper
  const getDaysInMonth = (monthIdx: number, yr: number) => {
    return new Date(yr, monthIdx + 1, 0).getDate();
  };

  const daysCount = getDaysInMonth(currentMonthIdx, year);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Helper to determine if a day is a weekend or a custom holiday
  const isHoliday = (d: number) => {
    const date = new Date(year, currentMonthIdx, d);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    
    if (dayOfWeek === 0) {
      return { holiday: true, type: "Minggu", label: "MI", desc: "Hari Minggu (Libur Mingguan)" };
    }
    if (workDaysPolicy === "5" && dayOfWeek === 6) {
      return { holiday: true, type: "Sabtu", label: "SA", desc: "Hari Sabtu (Kebijakan 5 Hari Kerja)" };
    }
    
    const key = `${year}_${currentMonthIdx}`;
    const activeHolidays = customHolidays[key] || [];
    if (activeHolidays.includes(d)) {
      return { holiday: true, type: "Kustom", label: "LB", desc: "Hari Libur Kustom / Khusus" };
    }
    
    return { holiday: false, type: "", label: "", desc: "" };
  };

  const getDayOfWeekName = (d: number) => {
    const date = new Date(year, currentMonthIdx, d);
    const indonesianDaysShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return indonesianDaysShort[date.getDay()];
  };

  // Sync activeDay with selected month/year/holidays
  useEffect(() => {
    const today = new Date();
    if (currentMonthIdx === today.getMonth() && year === today.getFullYear()) {
      setActiveDay(today.getDate());
    } else {
      const firstEffective = daysArray.find(d => !isHoliday(d).holiday) || 1;
      setActiveDay(firstEffective);
    }
  }, [currentMonthIdx, year, workDaysPolicy, customHolidays]);

  const toggleCustomHoliday = (d: number) => {
    const date = new Date(year, currentMonthIdx, d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return;
    if (workDaysPolicy === "5" && dayOfWeek === 6) return;

    const key = `${year}_${currentMonthIdx}`;
    const currentList = customHolidays[key] || [];
    const isAdding = !currentList.includes(d);

    setCustomHolidays(prev => {
      const list = prev[key] || [];
      const newList = isAdding
        ? [...list, d]
        : list.filter(item => item !== d);
      const nextState = { ...prev, [key]: newList };
      localStorage.setItem("omega_attendance_custom_holidays", JSON.stringify(nextState));
      return nextState;
    });

    if (isAdding) {
      showToast(`Berhasil: Tanggal ${d} ditetapkan sebagai HARI LIBUR! 📅 ✔️`, "info");
    } else {
      showToast(`Berhasil: Tanggal ${d} diaktifkan kembali sebagai HARI EFEKTIF! ⚡ ✔️`, "success");
    }
    setIsSavedToBank(false);
  };

  // Get statistics for a student
  const getStudentStats = (s: StudentAttendance) => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    daysArray.forEach(d => {
      if (!isHoliday(d).holiday) {
        const status = s.records[d] || "H"; // default present
        if (status === "H") hadir++;
        else if (status === "S") sakit++;
        else if (status === "I") izin++;
        else if (status === "A") alpa++;
      }
    });

    const totalDays = hadir + sakit + izin + alpa;
    const persentase = totalDays === 0 ? 100 : Math.round((hadir / totalDays) * 100);

    return { hadir, sakit, izin, alpa, persentase };
  };

  const handleCellClick = (studentId: string, day: number) => {
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    if (isHoliday(day).holiday) return; // Prevent action on holidays
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      
      const currentStatus = s.records[day] || "H";
      let nextStatus: "H" | "S" | "I" | "A" = "H";
      if (currentStatus === "H") nextStatus = "S";
      else if (currentStatus === "S") nextStatus = "I";
      else if (currentStatus === "I") nextStatus = "A";
      else if (currentStatus === "A") nextStatus = "H";

      return {
        ...s,
        records: {
          ...s.records,
          [day]: nextStatus
        }
      };
    }));
    setIsSavedToBank(false);
  };

  const handleSetAllHadirDay = (day: number) => {
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    if (isHoliday(day).holiday) return; // Prevent action on holidays
    setStudents(prev => prev.map(s => ({
      ...s,
      records: {
        ...s.records,
        [day]: "H"
      }
    })));
    setIsSavedToBank(false);
    showToast(`Berhasil: Semua siswa diatur HADIR pada tanggal ${day}! 👥 ✔️`, "success");
  };

  const handleSetAllHadirMonth = () => {
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    setStudents(prev => prev.map(s => {
      const fullMonthHadir: Record<number, "H" | "S" | "I" | "A"> = { ...s.records };
      daysArray.forEach(d => {
        if (!isHoliday(d).holiday) {
          fullMonthHadir[d] = "H";
        }
      });
      return {
        ...s,
        records: fullMonthHadir
      };
    }));
    setIsSavedToBank(false);
    showToast(`Berhasil: Seluruh siswa diatur HADIR di semua hari efektif bulan ini! 📅 ✔️`, "success");
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    if (!newStudentName.trim()) return;

    const newId = "std-" + Date.now();
    const newS: StudentAttendance = {
      id: newId,
      name: newStudentName,
      gender: newStudentGender,
      records: {}
    };

    // Update master list
    const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
    let masterList = [];
    if (currentMasterRaw) {
      try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
    }
    masterList.push({ id: newId, name: newStudentName, gender: newStudentGender, nisn: "" });
    localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

    setStudents(prev => [...prev, newS]);
    setNewStudentName("");
    setShowAddStudentField(false);
    setIsSavedToBank(false);
    showToast(`Berhasil menambahkan murid: ${newStudentName}! 👤 ✔️`, "success");

    // Dispatch sync event
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  };

  const handleDeleteStudent = (id: string) => {
    if (!isAbsensiUnlocked) {
      showToast("Paket Belum Aktif: Silakan beli paket ABSENSI untuk mengedit data ini.", "warning");
      return;
    }
    const student = students.find(s => s.id === id);
    const name = student ? student.name : "siswa ini";
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus ${name} dari daftar absensi harian dan registry utama?`);
    setDeleteConfirmCallback(() => () => {
      // Update master list
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList = masterList.filter((m: any) => m.id !== id);
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      setStudents(prev => prev.filter(s => s.id !== id));
      setIsSavedToBank(false);
      showToast(`Berhasil menghapus murid: ${name}! 🗑️`, "warning");

      // Dispatch sync event
      window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    });
    setDeleteConfirmId(id);
  };

  // Class summary metrics
  const totalStudents = students.length;
  const overallPresenceRate = totalStudents === 0 ? 0 : Math.round(
    students.reduce((acc, s) => acc + getStudentStats(s).persentase, 0) / totalStudents
  );

  const handleSaveToDocumentBank = () => {
    try {
      const storedDocs = localStorage.getItem("omega_db_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      
      const summaryText = students.map((s, idx) => {
        const stats = getStudentStats(s);
        return `${idx + 1}. ${s.name} (${s.gender}) - Hadir: ${stats.hadir}, Sakit: ${stats.sakit}, Izin: ${stats.izin}, Alpa: ${stats.alpa} [% Kehadiran: ${stats.persentase}%]`;
      }).join("\n");

      const newDoc = {
        id: "doc-attendance-" + Date.now(),
        name: `Laporan Absensi Kelas - ${INDONESIAN_MONTHS[currentMonthIdx]} ${year} (${kelas})`,
        category: "manual",
        content: `========================================================
DAFTAR HADIR / ABSENSI RESMI SISWA
========================================================
Sekolah: ${namaSekolah}
Kelas: ${kelas} | Tahun Ajaran: ${tahunAjaran}
Bulan: ${INDONESIAN_MONTHS[currentMonthIdx]} ${year}
Wali Kelas: ${namaGuru}

REKAPITULASI PRESENSI:
Indeks Kehadiran Kelas: ${overallPresenceRate}%
Total Murid: ${totalStudents} siswa

DAFTAR EVALUASI PENYELENGGARAAN ABSENSI SISWA:
${summaryText}
`,
        size: "3 KB",
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem("omega_db_documents", JSON.stringify([newDoc, ...currentDocs]));
      setIsSavedToBank(true);
      showToast("Berhasil: Rekapitulasi absensi disimpan ke Bank Dokumen! 💾 ✔️", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal menyimpan rekap absensi.", "warning");
    }
  };

  // Official layout formatted PDF with small grid structures
  const handleDownloadPDF = () => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Fetch logos dynamically from localStorage (matching profile)
    const isMinistryLogoEnabled = localStorage.getItem("kosp_ministry_logo_enabled") !== "false";
    const isSchoolLogoEnabled = localStorage.getItem("kosp_school_logo_enabled") !== "false";
    const customMinistryLogo = localStorage.getItem("kosp_custom_ministry_logo");
    const logoType = localStorage.getItem("kosp_logo_type") || "kemdikbud";
    const schoolLogo = localStorage.getItem("kosp_school_logo");

    const ministryLogoSrc = customMinistryLogo || (logoType === "kemenag" ? getKemenagLogo() : getTutWuriHandayaniLogo());
    const schoolLogoSrc = schoolLogo || getDefaultSchoolLogo(namaSekolah);

    const logoSize = 15; // Set to 15 to make sure it doesn't touch the line
    const logoY = 6;     // Lift Y so bottom is at 21, safely 4mm above the 25mm double line

    // 2. Render logos in the header
    if (isMinistryLogoEnabled && ministryLogoSrc) {
      try {
        doc.addImage(ministryLogoSrc, "PNG", 14, logoY, logoSize, logoSize);
      } catch (err) {
        console.error("Error drawing Ministry logo in PDF:", err);
      }
    }

    if (isSchoolLogoEnabled && schoolLogoSrc) {
      try {
        doc.addImage(schoolLogoSrc, "PNG", pageWidth - 14 - logoSize, logoY, logoSize, logoSize);
      } catch (err) {
        console.error("Error drawing School logo in PDF:", err);
      }
    }

    // 3. Render simple & scientific table title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    const cleanSchName = namaSekolah.toUpperCase().replace("SD NEGERI", "").replace("SDN", "").trim();
    doc.text(`DAFTAR KEHADIRAN MURID SD NEGERI ${cleanSchName}`, pageWidth / 2, 12, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`KELAS: ${kelas.toUpperCase()}   |   TAHUN PELAJARAN: ${tahunAjaran}   |   BULAN: ${INDONESIAN_MONTHS[currentMonthIdx].toUpperCase()} ${year}`, pageWidth / 2, 17, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`Alamat Penyusunan: ${tempatPenyusunan}  |  Sistem Informasi Presensi Berkelanjutan`, pageWidth / 2, 21, { align: "center" });

    // Draw official academic double boundary line below the header
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(14, 25, pageWidth - 14, 25);
    doc.setLineWidth(0.15);
    doc.line(14, 26.2, pageWidth - 14, 26.2);

    // Render brief stats below double line
    doc.setFontSize(8);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(`Indeks Rata-rata Kehadiran Kelas Bulanan: ${overallPresenceRate}%`, 14, 32);
    doc.setTextColor(0, 0, 0);

    // Days Grid table start
    const startY = 36;
    const rowHeight = 7;
    const daysMax = Array.from({ length: 31 }, (_, i) => i + 1);

    // Header cells background
    doc.setFillColor(31, 41, 55); // Dark Slate Blue
    doc.rect(14, startY, 268, rowHeight, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5);
    doc.setFont("Helvetica", "bold");
    
    // Centered header texts inside computed cells
    doc.text("NO", 18, startY + 4.5, { align: "center" });
    doc.text("NAMA SISWA", 24, startY + 4.5);
    doc.text("G", 74, startY + 4.5, { align: "center" });
    
    // Days index print
    daysMax.forEach(d => {
      if (d <= daysCount) {
        doc.text(String(d), 78 + (d - 1) * 5.2 + 2.6, startY + 4.5, { align: "center" });
      } else {
        doc.text("-", 78 + (d - 1) * 5.2 + 2.6, startY + 4.5, { align: "center" });
      }
    });

    // Stat headers
    const statsStartX = 239.2;
    doc.text("H", statsStartX + 4, startY + 4.5, { align: "center" });
    doc.text("S", statsStartX + 12, startY + 4.5, { align: "center" });
    doc.text("I", statsStartX + 20, startY + 4.5, { align: "center" });
    doc.text("A", statsStartX + 28, startY + 4.5, { align: "center" });
    doc.text("%", statsStartX + 37.4, startY + 4.5, { align: "center" });
    
    doc.setTextColor(0, 0, 0); // reset color

    let currentY = startY + rowHeight;
    students.forEach((s, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, currentY, 268, rowHeight, "F");
      }
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(String(idx + 1), 18, currentY + 4.5, { align: "center" });
      
      doc.setFont("Helvetica", "bold");
      const clippedName = s.name.length > 25 ? s.name.substring(0, 25) + "..." : s.name;
      doc.text(clippedName, 24, currentY + 4.5);
      
      doc.setFont("Helvetica", "normal");
      doc.text(s.gender, 74, currentY + 4.5, { align: "center" });

      // Print day records
      daysMax.forEach(d => {
        const dX = 78 + (d - 1) * 5.2;
        if (d <= daysCount) {
          const hol = isHoliday(d);
          if (hol.holiday) {
            // Draw soft-red background for holidays in PDF
            doc.setFillColor(254, 226, 226); // Soft pink/rose background
            doc.rect(dX, currentY, 5.2, rowHeight, "F");
            
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(220, 38, 38); // Dark-red/maroon colored text label
            doc.text(hol.label, dX + 2.6, currentY + 4.5, { align: "center" });
          } else {
            const val = s.records[d] || "H";
            if (val !== "H") {
              doc.setFont("Helvetica", "bold");
              if (val === "A") doc.setTextColor(220, 38, 38); // red
              else if (val === "S") doc.setTextColor(245, 158, 11); // orange
              else doc.setTextColor(59, 130, 246); // blue
            } else {
              doc.setFont("Helvetica", "normal");
              doc.setTextColor(0, 0, 0);
            }
            doc.text(val, dX + 2.6, currentY + 4.5, { align: "center" });
          }
        } else {
          // Day doesn't exist for this month (e.g. 31st of November)
          doc.setFillColor(230, 230, 235);
          doc.rect(dX, currentY, 5.2, rowHeight, "F");
        }
        doc.setTextColor(0, 0, 0); // reset
      });

      // Stats
      const stats = getStudentStats(s);
      doc.setFont("Helvetica", "normal");
      doc.text(String(stats.hadir), statsStartX + 4, currentY + 4.5, { align: "center" });
      doc.text(String(stats.sakit), statsStartX + 12, currentY + 4.5, { align: "center" });
      doc.text(String(stats.izin), statsStartX + 20, currentY + 4.5, { align: "center" });
      doc.text(String(stats.alpa), statsStartX + 28, currentY + 4.5, { align: "center" });
      
      doc.setFont("Helvetica", "bold");
      doc.text(`${stats.persentase}%`, statsStartX + 37.4, currentY + 4.5, { align: "center" });

      currentY += rowHeight;
    });

    // 4. Draw pristine grid lines (horizontal and vertical borders) for clear columns/rows
    const endTableY = currentY;
    doc.setDrawColor(120, 120, 120); // Darker gray for clear grid outlines
    doc.setLineWidth(0.2);

    // Draw all horizontal borders
    for (let currentLineY = startY; currentLineY <= endTableY; currentLineY += rowHeight) {
      doc.line(14, currentLineY, 282, currentLineY);
    }
    doc.line(14, endTableY, 282, endTableY); // redundant bottom boundary safety

    // Draw all vertical borders
    doc.line(14, startY, 14, endTableY); // Leftmost
    doc.line(22, startY, 22, endTableY); // NO-NAMA separator
    doc.line(70, startY, 70, endTableY); // NAMA-G separator
    doc.line(78, startY, 78, endTableY); // G-Day1 separator

    // 31 Days vertical borders
    for (let col = 1; col <= 31; col++) {
      const colX = 78 + col * 5.2;
      doc.line(colX, startY, colX, endTableY);
    }

    // Stats headers vertical borders
    doc.line(247.2, startY, 247.2, endTableY); // H separator
    doc.line(255.2, startY, 255.2, endTableY); // S separator
    doc.line(263.2, startY, 263.2, endTableY); // I separator
    doc.line(271.2, startY, 271.2, endTableY); // A separator
    doc.line(282, startY, 282, endTableY);     // Rightmost boundary

    // Signatures
    currentY += 10;
    if (currentY > 175) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(8.5);
    doc.setFont("Helvetica", "normal");
    doc.text(`${tempatPenyusunan}, ${tanggalPenyusunan}`, 210, currentY);
    currentY += 5;
    doc.text("Mengetahui,", 14, currentY);
    doc.text("Wali / Guru Kelas,", 210, currentY);
    currentY += 5;
    doc.text("Kepala Sekolah,", 14, currentY);
    currentY += 18;
    doc.setFont("Helvetica", "bold");
    doc.text(kepalaSekolah, 14, currentY);
    doc.text(namaGuru, 210, currentY);
    currentY += 4;
    doc.setFont("Helvetica", "normal");
    doc.text(`NIP. ${nipKepala}`, 14, currentY);
    doc.text(nipGuru && nipGuru.trim() !== "-" ? `NIP. ${nipGuru}` : "NIP. -", 210, currentY);

    // ============================================
    // PAGE 2: DIAGRAM SUMMARY AND NARRATIVE ANALYSIS
    // ============================================
    doc.addPage();

    // 1. Render Page 2 Header with Logos (Using same variables, Y position, and sizes for perfect consistency)
    if (isMinistryLogoEnabled && ministryLogoSrc) {
      try {
        doc.addImage(ministryLogoSrc, "PNG", 14, logoY, logoSize, logoSize);
      } catch (_) {}
    }
    if (isSchoolLogoEnabled && schoolLogoSrc) {
      try {
        doc.addImage(schoolLogoSrc, "PNG", pageWidth - 14 - logoSize, logoY, logoSize, logoSize);
      } catch (_) {}
    }

    // Centered Title for Page 2
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("LAMPIRAN II: RINGKASAN & ANALISIS GRAFIK PRESENSI BULANAN", pageWidth / 2, 12, { align: "center" });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(`KELAS: ${kelas.toUpperCase()}   |   TAHUN PELAJARAN: ${tahunAjaran}   |   BULAN: ${INDONESIAN_MONTHS[currentMonthIdx].toUpperCase()} ${year}`, pageWidth / 2, 17, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`Sekolah: ${namaSekolah}  |  Analisis Akurasi Administrasi Presensi Siswa`, pageWidth / 2, 21, { align: "center" });

    // Dry official academic double boundary line below header on page 2 to match page 1
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.line(14, 25, pageWidth - 14, 25);
    doc.setLineWidth(0.15);
    doc.line(14, 26.2, pageWidth - 14, 26.2);

    // Column Left: Charts & KPI (X=14 to X=149, width 135mm)
    // KPI Cards inside Left Column (Starting at Y=29 for perfect spacing below double line)
    // Card 1: Kehadiran Rata-rata
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 29, 64, 18, "F");
    doc.setDrawColor(220, 220, 225);
    doc.rect(14, 29, 64, 18);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 105);
    doc.text("RATA-RATA PRESENSI KELAS", 18, 34);
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129); // Green
    doc.text(`${overallPresenceRate}%`, 18, 43);

    // Card 2: Konsistensi Tinggi (>= 90%)
    doc.setFillColor(245, 247, 250);
    doc.rect(84, 29, 65, 18, "F");
    doc.rect(84, 29, 65, 18);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 105);
    doc.text("SISWA KONSISTENSI PRIMA (>=90%)", 88, 34);
    doc.setFontSize(13);
    doc.setTextColor(245, 158, 11); // Amber
    doc.text(`${highAttendanceStudents} Murid`, 88, 43);

    // Reset Text Color
    doc.setTextColor(0, 0, 0);

    // Chart Box background (Shifted down slightly to Y=51)
    doc.setFillColor(252, 252, 253);
    doc.rect(14, 51, 135, 135, "F");
    doc.rect(14, 51, 135, 135);

    // Chart Box Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("DIAGRAM BATANG DISTRIBUSI PRESENSI", 18, 58);

    // Draw Chart Coordinates Axes
    const axisLeft = 34;
    const axisBottom = 153;
    const axisTop = 71;
    const axisRight = 138;
    
    doc.setDrawColor(160, 160, 165);
    doc.setLineWidth(0.35);
    doc.line(axisLeft, axisTop, axisLeft, axisBottom); // Y-axis
    doc.line(axisLeft, axisBottom, axisRight, axisBottom); // X-axis

    // Draw Grid Ticks & Grid Lines for Y axis
    const maxVal = Math.max(totalHadir, totalSakit, totalIzin, totalAlpa, 1);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(110, 110, 115);

    const stepsY = 4;
    for (let i = 0; i <= stepsY; i++) {
      const tickVal = Math.round((maxVal * i) / stepsY);
      const ratio = i / stepsY;
      const tickY = axisBottom - ratio * 72; // max height is 72mm

      // Grid line
      doc.setDrawColor(240, 240, 245);
      doc.setLineWidth(0.2);
      if (i > 0) {
        doc.line(axisLeft + 1, tickY, axisRight, tickY);
      }

      // Tick marker & Label
      doc.setDrawColor(160, 160, 165);
      doc.line(axisLeft - 1.5, tickY, axisLeft, tickY);
      doc.text(String(tickVal), axisLeft - 3, tickY + 1.5, { align: "right" });
    }

    const getProporsiLocal = (val: number) => {
      return totalRecords === 0 ? "0%" : `${Math.round((val / totalRecords) * 100)}%`;
    };

    // Draw Ticks & Color-coded Bars for 4 statuses
    const barData = [
      { label: "Hadir (H)", val: totalHadir, color: [16, 185, 129], text: "H", pct: getProporsiLocal(totalHadir) },
      { label: "Sakit (S)", val: totalSakit, color: [245, 158, 11], text: "S", pct: getProporsiLocal(totalSakit) },
      { label: "Izin (I)", val: totalIzin, color: [59, 130, 246], text: "I", pct: getProporsiLocal(totalIzin) },
      { label: "Alpa (A)", val: totalAlpa, color: [239, 68, 68], text: "A", pct: getProporsiLocal(totalAlpa) }
    ];

    const barWidth = 14;
    const barGap = 10;
    let runningBarX = axisLeft + 8;

    barData.forEach((item) => {
      const barHeight = (item.val / maxVal) * 72;
      const barTopY = axisBottom - barHeight;

      // Draw color-filled bar
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(runningBarX, barTopY, barWidth, barHeight, "F");

      // Draw value of the bar
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);
      doc.text(String(item.val), runningBarX + barWidth / 2, barTopY - 2, { align: "center" });

      // Draw X-axis label
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 85);
      doc.text(item.text, runningBarX + barWidth / 2, axisBottom + 4, { align: "center" });
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text(item.pct, runningBarX + barWidth / 2, axisBottom + 8, { align: "center" });

      runningBarX += barWidth + barGap;
    });

    // Draw Legend below original axis line
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(80, 80, 85);
    doc.text("Legenda:", axisLeft + 2, axisBottom + 16);

    let legendX = axisLeft + 18;
    barData.forEach(item => {
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(legendX, axisBottom + 13.5, 3, 3, "F");
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text(item.label, legendX + 4.5, axisBottom + 16);
      legendX += 26;
    });

    // Column Right: Written Narrative Analysis & Insights
    const rightColX = 156;
    const rightColY = 29;
    const rightColWidth = 127;

    // Draw Analysis Box
    doc.setFillColor(252, 252, 253);
    doc.setDrawColor(210, 210, 215);
    doc.rect(rightColX, rightColY, rightColWidth, 154, "F");
    doc.rect(rightColX, rightColY, rightColWidth, 154);

    // Box Header banner
    doc.setFillColor(240, 240, 245);
    doc.rect(rightColX, rightColY, rightColWidth, 10, "F");
    doc.line(rightColX, rightColY + 10, rightColX + rightColWidth, rightColY + 10);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text("DIAGNOSIS & ANALISIS AKADEMIS", rightColX + 5, rightColY + 6.5);

    let currentBulletY = rightColY + 16;
    
    const drawBullet = (title: string, desc: string) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59); // Slate-850
      doc.text(`• ${title}`, rightColX + 5, currentBulletY);
      currentBulletY += 4;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(70, 70, 75);
      const wrappedLines = doc.splitTextToSize(desc, rightColWidth - 10);
      wrappedLines.forEach((line: string) => {
        doc.text(line, rightColX + 8, currentBulletY);
        currentBulletY += 3.2;
      });
      currentBulletY += 3.5; // Gap
    };

    const discPct = totalStudents > 0 ? Math.round((highAttendanceStudents / totalStudents) * 100) : 0;
    
    drawBullet(
      "Evaluasi Kehadiran Kelas Bulanan",
      `Tingkat rata-rata kehadiran peserta didik efektif bulan ini tercatat sebesar ${overallPresenceRate}%. Berdasarkan regulasi kedisiplinan sekolah dasar, indeks di atas 90% merepresentasikan operasional pembelajaran yang dinamis, kondusif, serta bebas hambatan kurikuler.`
    );

    drawBullet(
      "Indeks Konsistensi Tinggi Komunitas Siswa",
      `Berdasarkan data filter, ditemukan ${highAttendanceStudents} dari total ${totalStudents} siswa (atau setara dengan ${discPct}%) yang secara konsisten mempertahankan persentase kehadiran prima di atas 90%. Ini mencerminkan koordinasi yang kuat antara guru dan wali siswa.`
    );

    drawBullet(
      "Rincian Distribusi Alasan Ketidakhadiran Resmi",
      `Sepanjang bulan berjalan, visualisasi data akumulatif menunjukkan alasan ketidakhadiran terbagi menjadi: Sakit (S) sebanyak ${totalSakit} kali, Izin Ketidakhadiran Resmi (I) sebanyak ${totalIzin} kali, dan Alpa Tanpa Keterangan (A) sebanyak ${totalAlpa} kali.`
    );

    drawBullet(
      "Rencana Tindak Lanjut Pemulihan Siswa",
      `Bagi siswa dengan tren akumulasi alpa (A) yang signifikan, pihak wali kelas perlu menyelenggarakan program pendampingan khusus guna menghindari kesenjangan pemahaman. Tindak lanjut preventif mencakup dialog konseling personal.`
    );

    drawBullet(
      "Rekomendasi Berkelanjutan Operasional Kelas",
      "Guna memelihara kultur kedisiplinan harian, guru disarankan menyinkronkan status daftar hadir siswa secara berkala melalui fitur 'Tanggal Aktif' dan memperbaharui arsip ke Bank Dokumen secara konsisten."
    );

    // Save and export PDF under official name
    doc.save(`Daftar_Kehadiran_SD_Negeri_${cleanSchName}_Kls_${kelas.replace(/\s+/g, "_")}_${INDONESIAN_MONTHS[currentMonthIdx]}_${year}.pdf`);
    showToast("Berhasil: Mengunduh Laporan Absensi & Analisis Grafik (PDF) resmi! 📄 ✔️", "success");
  };

  const handleMonthPrev = () => {
    let targetMonth = "";
    if (currentMonthIdx === 0) {
      setCurrentMonthIdx(11);
      setYear(prev => prev - 1);
      targetMonth = INDONESIAN_MONTHS[11];
    } else {
      setCurrentMonthIdx(prev => prev - 1);
      targetMonth = INDONESIAN_MONTHS[currentMonthIdx - 1];
    }
    setIsSavedToBank(false);
    showToast(`Bulan diganti ke ${targetMonth}! 📅`, "info");
  };

  const handleMonthNext = () => {
    let targetMonth = "";
    if (currentMonthIdx === 11) {
      setCurrentMonthIdx(0);
      setYear(prev => prev + 1);
      targetMonth = INDONESIAN_MONTHS[0];
    } else {
      setCurrentMonthIdx(prev => prev + 1);
      targetMonth = INDONESIAN_MONTHS[currentMonthIdx + 1];
    }
    setIsSavedToBank(false);
    showToast(`Bulan diganti ke ${targetMonth}! 📅`, "info");
  };

  // Recalculate metrics for re-rendering Recharts bar chart
  let totalHadir = 0;
  let totalSakit = 0;
  let totalIzin = 0;
  let totalAlpa = 0;

  students.forEach(s => {
    daysArray.forEach(d => {
      if (!isHoliday(d).holiday) {
        const status = s.records[d] || "H";
        if (status === "H") totalHadir++;
        else if (status === "S") totalSakit++;
        else if (status === "I") totalIzin++;
        else if (status === "A") totalAlpa++;
      }
    });
  });

  const totalRecords = totalHadir + totalSakit + totalIzin + totalAlpa;

  const getProporsi = (val: number) => {
    return totalRecords === 0 ? "0%" : `${Math.round((val / totalRecords) * 100)}%`;
  };

  const chartData = [
    { name: "Hadir (H)", jumlah: totalHadir, proporsi: getProporsi(totalHadir), color: "#10b981", border: "#10b981" },
    { name: "Sakit (S)", jumlah: totalSakit, proporsi: getProporsi(totalSakit), color: "#f59e0b", border: "#f59e0b" },
    { name: "Izin (I)", jumlah: totalIzin, proporsi: getProporsi(totalIzin), color: "#3b82f6", border: "#3b82f6" },
    { name: "Alpa (A)", jumlah: totalAlpa, proporsi: getProporsi(totalAlpa), color: "#ef4444", border: "#ef4444" },
  ];

  const highAttendanceStudents = students.filter(s => {
    const stats = getStudentStats(s);
    return stats.persentase >= 90;
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-1 animate-fade-in relative">
      
      {/* Informational Header Hero */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0c10] via-black to-[#050508] shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9.5px] font-mono tracking-widest font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 text-glow-amber mb-1">
              <UserCheck className="w-3.5 h-3.5" /> AKADEMIS SUITE
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
              Kartu Absensi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-sans">Presensi Kelas</span>
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed font-sans">
              Pantau rincian kehadiran siswa harian dengan representasi visual interaktif, rekap otomatis persentase bulanan, dan dukung kelancaran operasional administrasi secara instan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                localStorage.setItem("omega_attendance_students", JSON.stringify(students));
                showToast(`✓ Berhasil Disimpan! Seluruh data presensi kelas untuk ${INDONESIAN_MONTHS[currentMonthIdx]} ${year} telah disimpan secara permanen luring.`, "success");
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 fill-black" /> SIMPAN PRESENSI
            </button>
            <button
              onClick={() => {
                const hol = isHoliday(activeDay);
                if (hol.holiday) {
                  showToast(`Gagal: Tanggal ${activeDay} adalah hari libur (${hol.desc})! ❌`, "warning");
                } else {
                  handleSetAllHadirDay(activeDay);
                }
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-400/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" /> JADIKAN HADIR SEMUA (TGL {activeDay})
            </button>
            <button
              onClick={handleSaveToDocumentBank}
              disabled={isSavedToBank}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-2 ${
                isSavedToBank 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                  : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-805 text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {isSavedToBank ? "TERSIPAN DI BANK" : "REKAP DI BANK"}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-[#f5a623] hover:bg-[#e0951a] text-black flex items-center gap-2 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> CETAK ABSENSI (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Real-time active period banner */}
      <div className="p-5 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-gradient-to-r from-[#060608] to-[#0d0d14] transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-extrabold uppercase bg-amber-500/10 border border-amber-500/15 text-amber-500">
              ⚡ LIVE PERIODE PRESENSI
            </span>
            <p className="text-sm font-semibold text-zinc-300 mt-1 font-mono tracking-tight text-glow-amber">
              {formatIndonesianDateTime(realTimeTime)}
            </p>
          </div>
        </div>

        {/* Selectors wrapper */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Day selector UI */}
          <div className="flex items-center gap-2 bg-black/50 py-1.5 px-3 rounded-xl border border-zinc-900 justify-between sm:justify-start">
            <span className="text-[10px] uppercase font-extrabold text-zinc-500 font-mono hidden md:inline mr-1">TANGGAL AKTIF:</span>
            <select
              value={activeDay}
              onChange={(e) => {
                const val = Number(e.target.value);
                setActiveDay(val);
                showToast(`Hari aktif diubah ke tanggal ${val}! 📅`, "info");
              }}
              className="bg-zinc-950 text-white text-xs font-black py-1 px-2.5 rounded-lg border border-zinc-805 hover:border-zinc-700 outline-none cursor-pointer font-mono text-glow-amber"
            >
              {daysArray.map(d => {
                const hol = isHoliday(d);
                return (
                  <option key={d} value={d} className={hol.holiday ? "text-rose-500 bg-zinc-950" : "text-zinc-300 bg-zinc-950"}>
                    {d < 10 ? `0${d}` : d} {hol.holiday ? ` - LIBUR (${hol.label})` : ` - AKTIF (${getDayOfWeekName(d)})`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Month selector UI */}
          <div className="flex items-center gap-1.5 bg-black/50 py-1.5 px-3 rounded-xl border border-zinc-900 justify-between sm:justify-start">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono hidden md:inline mr-1">PILIH BULAN:</span>
            <button 
              type="button"
              onClick={handleMonthPrev}
              className="p-1 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition animate-pulse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white text-center font-mono min-w-[130px]">
              {INDONESIAN_MONTHS[currentMonthIdx].toUpperCase()} {year}
            </span>
            <button 
              type="button"
              onClick={handleMonthNext}
              className="p-1 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition animate-pulse"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PENGATURAN KEBIJAKAN HARI KERJA & HARI LIBUR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Kebijakan Hari Kerja Card (5 atau 6 hari) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-gradient-to-b from-[#060608] to-[#0a0a0f] transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] uppercase font-extrabold font-mono text-amber-400 tracking-wider">
                ⚙️ KEBIJAKAN HARI KERJA
              </span>
              <span className="px-2 py-0.5 text-[8.2px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 font-extrabold uppercase">
                {workDaysPolicy} Hari Kerja
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-white">
                Sistem Kerja Mingguan
              </h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Tentukan sistem jam operasional sekolah. Berdasarkan kebijakan pilihan Anda, sistem otomatis mengunci hari libur akhir pekan agar validasi persentase kehadiran guru/siswa tetap sahih.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSetWorkDaysPolicy("5")}
                className={`py-2 px-3 text-xs font-extrabold tracking-wide uppercase rounded-xl border transition-all duration-300 font-mono flex items-center justify-center gap-1.5 ${
                  workDaysPolicy === "5"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.05)] cursor-pointer"
                    : "bg-black/60 border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-400 cursor-pointer"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${workDaysPolicy === "5" ? "bg-amber-400 animate-pulse" : "bg-zinc-700"}`}></div>
                5 HARI
              </button>

              <button
                type="button"
                onClick={() => handleSetWorkDaysPolicy("6")}
                className={`py-2 px-3 text-xs font-extrabold tracking-wide uppercase rounded-xl border transition-all duration-300 font-mono flex items-center justify-center gap-1.5 ${
                  workDaysPolicy === "6"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.05)] cursor-pointer"
                    : "bg-black/60 border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-400 cursor-pointer"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${workDaysPolicy === "6" ? "bg-amber-400 animate-pulse" : "bg-zinc-700"}`}></div>
                6 HARI
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-900 mt-4 text-[10px] text-zinc-500 leading-relaxed font-sans">
            Status: {workDaysPolicy === "5" ? (
              <span>Hari <b>Sabtu & Minggu</b> terkunci dinonaktifkan dari absensi.</span>
            ) : (
              <span>Hanya hari <b>Minggu</b> yang terkunci dinonaktifkan dari absensi.</span>
            )}
          </div>
        </div>

        {/* Dynamic Holidays Manager (Quick Calendar Click) */}
        <div className="lg:col-span-8 p-5 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-[#060608] transition-all duration-300 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-2">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-extrabold font-mono text-amber-500 tracking-wider">
                📅 PENGELOLA HARI LIBUR & KALENDER EFEKTIF
              </span>
              <h4 className="text-xs font-black font-sans uppercase tracking-tight text-white">
                Klik Tanggal Bulalan untuk Meliburkan Sekolah
              </h4>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-black/80 px-2.5 py-1 rounded border border-zinc-900">
              HARI EFEKTIF BULAN INI: <span className="font-extrabold text-amber-400">{daysArray.filter(d => !isHoliday(d).holiday).length} HARI</span>
            </span>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
            Klik kotak tanggal di bawah untuk meliburkan tanggal reguler tertentu (misal: libur merah nasional, libur kurikulum, cuti bersama, atau hari khusus daerah). Kolom tanggal tersebut otomatis terkunci demi perhitungan indeks kehadiran presensi yang 100% valid!
          </p>

          {/* Mini Calendar Clicker Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-11 gap-1 pt-1.5">
            {daysArray.map(d => {
              const holidayStatus = isHoliday(d);
              const isWeekend = holidayStatus.type === "Minggu" || holidayStatus.type === "Sabtu";
              const isCustom = holidayStatus.type === "Kustom";
              const dayName = getDayOfWeekName(d);

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => !isWeekend && toggleCustomHoliday(d)}
                  disabled={isWeekend}
                  title={holidayStatus.desc || `Klik untuk meliburkan / mengaktifkan tanggal ${d}`}
                  className={`p-1.5 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-300 select-none cursor-pointer ${
                    isWeekend
                      ? "bg-rose-500/20 border-white text-rose-300 opacity-80 cursor-not-allowed"
                      : isCustom
                      ? "bg-rose-600 border-white text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.55)] scale-[1.03]"
                      : "bg-[#0c0c12]/80 border-white text-zinc-350 hover:text-white hover:scale-105 hover:bg-[#12121c]"
                  }`}
                >
                  <span className="text-[10px] font-black">{d}</span>
                  <span className="text-[7.2px] font-extrabold uppercase mt-0.5 opacity-85">
                    {isWeekend ? holidayStatus.label : isCustom ? "LIBUR" : dayName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid Configuration Options */}
      <div className="grid grid-cols-1 gap-5 items-stretch">
        
        {/* Attendance Matrix Core Grid Table */}
        <div className="col-span-12">
          <div className="p-5 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-[#060608] space-y-4 h-full flex flex-col justify-between transition-all duration-300 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-2.5">
                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2 font-display">
                    <LayoutGrid className="w-4 h-4 text-amber-500" /> MATRIKS KEHADIRAN HARIAN
                  </h3>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                    Metode Toggling: Klik sel bertanggal pada daftar siswa untuk bertransisi status: <span className="text-emerald-400 font-bold">H</span> → <span className="text-amber-500 font-bold">S</span> → <span className="text-blue-400 font-bold">I</span> → <span className="text-rose-500 font-bold">A</span>.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAddStudentField(prev => !prev)}
                    className="px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> TAMBAH SISWA
                  </button>
                </div>
              </div>

            {/* Quick Add Student Mini Form Inline */}
            {showAddStudentField && (
              <form onSubmit={handleAddStudent} className="p-4 rounded-xl bg-black border border-zinc-850 flex flex-wrap gap-4 items-end animate-fade-in font-sans">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider">Nama Siswa Baru</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Margaretha"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-900 bg-zinc-950 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-bold text-zinc-400 mb-1 uppercase font-mono tracking-wider">G</label>
                  <select 
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as "L" | "P")}
                    className="px-3 py-1.5 text-xs rounded-lg border border-zinc-900 bg-zinc-950 text-white focus:border-amber-500 focus:outline-none h-8 font-mono"
                  >
                    <option value="L">L</option>
                    <option value="P">P</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase transition cursor-pointer"
                  >
                    SIMPAN
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddStudentField(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-bold uppercase transition cursor-pointer"
                  >
                    BATAL
                  </button>
                </div>
              </form>
            )}

            {/* Attendance Matrix Core Grid (Overflow Scrollable) */}
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left table-fixed min-w-[950px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 font-mono text-[9px] uppercase text-zinc-550 leading-relaxed">
                    <th className="w-10 pb-2.5">No</th>
                    <th className="w-44 pb-2.5">Nama Siswa</th>
                    <th className="w-10 pb-2.5 text-center">G</th>
                    
                    {/* Days column headers */}
                    {daysArray.map(d => {
                      const hol = isHoliday(d);
                      const isHol = hol.holiday;
                      const dayNameShort = getDayOfWeekName(d);
                      return (
                        <th 
                          key={d} 
                          onClick={() => {
                            if (!isHol) {
                              setActiveDay(d);
                              handleSetAllHadirDay(d);
                            }
                          }}
                          className={`w-[22px] text-center pb-2.5 transition-all font-mono select-none relative cursor-pointer ${
                            isHol 
                              ? "text-rose-500/40 cursor-not-allowed" 
                              : d === activeDay
                              ? "text-[#f5a623] font-black scale-110"
                              : "text-zinc-500 hover:text-white hover:scale-105"
                          }`}
                          title={isHol ? `${hol.desc}` : `Klik untuk pilih Tgl ${d} & Set Hadir Semua`}
                        >
                          <span className="block text-[7.5px] opacity-75 font-bold uppercase tracking-tighter">{dayNameShort}</span>
                          <span className={`block text-[11px] font-black mt-0.5 ${d === activeDay ? "text-[#f5a623] scale-110 font-extrabold" : ""}`}>{d}</span>
                          {d === activeDay && !isHol && (
                            <span className="absolute bottom-0 left-[2px] right-[2px] h-0.5 bg-[#f5a623] rounded-full shadow-[0_0_8px_#f5a623]" />
                          )}
                        </th>
                      );
                    })}
                    
                    {/* Rekap metrics columns headers */}
                    <th className="w-10 pb-2.5 text-center text-emerald-400 font-bold">H</th>
                    <th className="w-10 pb-2.5 text-center text-amber-500 font-bold">S</th>
                    <th className="w-10 pb-2.5 text-center text-blue-400 font-bold">I</th>
                    <th className="w-10 pb-2.5 text-center text-rose-500 font-bold">A</th>
                    <th className="w-14 pb-2.5 text-right font-black">%</th>
                    <th className="w-10 pb-2.5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-950 font-sans text-xs">
                  {students.map((s, idx) => {
                    const stats = getStudentStats(s);
                    return (
                      <tr key={s.id} className="hover:bg-zinc-950/40 transition-colors">
                        <td className="py-2 text-center">
                          <span className="inline-flex w-5.5 h-5.5 rounded-full items-center justify-center font-mono text-[9px] font-black bg-black border border-yellow-400 text-yellow-400 select-none shadow-[0_0_8px_rgba(250,204,21,0.2)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-white truncate pr-2 text-left" title={s.name}>{s.name}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-zinc-500">{s.gender}</td>
                        
                        {/* Day checkboxes toggle cells */}
                        {daysArray.map(d => {
                          const status = s.records[d] || "H";
                          const hol = isHoliday(d);
                          const isHol = hol.holiday;
                          return (
                            <td 
                              key={d} 
                              onClick={() => {
                                if (!isHol) {
                                  setActiveDay(d);
                                  handleCellClick(s.id, d);
                                }
                              }}
                              className={`py-1 text-center font-mono font-extrabold transition-all ${
                                isHol 
                                  ? "bg-rose-950/25 cursor-not-allowed" 
                                  : d === activeDay
                                  ? "bg-amber-500/5 cursor-pointer border-x border-amber-500/10" 
                                  : "cursor-pointer hover:bg-zinc-900/50"
                              }`}
                            >
                              {isHol ? (
                                <span className="inline-flex items-center justify-center w-[18px] h-[18px] text-[7.5px] rounded border bg-rose-600/25 border-rose-500/40 text-rose-450 font-black font-mono font-bold" title={hol.desc}>
                                  {hol.label}
                                </span>
                              ) : (
                                <span className={`inline-block w-[18px] h-[18px] leading-[18px] text-[10px] rounded text-center transition-all ${
                                  status === "H" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15" :
                                  status === "S" ? "bg-amber-500/20 text-amber-500 border border-amber-500/20" :
                                  status === "I" ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" :
                                  "bg-rose-500/20 text-rose-500 border border-rose-500/20"
                                }`}>
                                  {status}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {/* Summary Metrics values */}
                        <td className="py-2.5 text-center font-mono font-bold text-zinc-400 bg-neutral-900/10">{stats.hadir}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-amber-500 bg-neutral-900/10">{stats.sakit}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-blue-450 bg-neutral-900/10">{stats.izin}</td>
                        <td className="py-2.5 text-center font-mono font-bold text-rose-550 bg-neutral-900/10">{stats.alpa}</td>
                        <td className={`py-2.5 text-right font-mono font-black ${
                          stats.persentase >= 90 ? "text-emerald-400" : stats.persentase >= 75 ? "text-amber-500" : "text-rose-500"
                        }`}>{stats.persentase}%</td>
                        <td className="py-2.5 text-right">
                          <button 
                            onClick={() => handleDeleteStudent(s.id)}
                            className="p-1 hover:bg-rose-500/15 rounded text-rose-500 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan={daysCount + 9} className="text-center py-8 text-zinc-650 font-mono uppercase tracking-widest text-[9px]">
                        Daftar absensi kosong. Hubungkan siswa melalui pemicu form.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom mini-summary legend of indicators */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-zinc-550 border-t border-zinc-950 pt-3">
              <span className="font-bold">LEGENDA STATUS:</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-center font-bold text-[8.5px] rounded inline-block leading-2">H</span> HADIR</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500/20 border border-amber-500/20 text-amber-500 text-center font-bold text-[8.5px] rounded inline-block leading-2">S</span> SAKIT</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500/20 border border-blue-500/20 text-blue-400 text-center font-bold text-[8.5px] rounded inline-block leading-2">I</span> IZIN</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500/20 border border-rose-500/20 text-rose-500 text-center font-bold text-[8.5px] rounded inline-block leading-2">A</span> ALPA</span>
              <span className="text-zinc-450 font-bold ml-auto hidden sm:inline">|</span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-rose-950/10 border border-rose-950/15 text-rose-500/60 text-center font-bold text-[7.5px] rounded inline-block">MI</span> MINGGU (LIBUR)</span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-rose-950/10 border border-rose-950/15 text-rose-500/60 text-center font-bold text-[7.5px] rounded inline-block">SA</span> SABTU (LIBUR)</span>
              <span className="flex items-center gap-1"><span className="w-4 h-3 bg-rose-600 border border-white text-white text-center font-bold text-[7.5px] rounded inline-block">LB</span> LIBUR KUSTOM</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Summary: Recharts Bar Chart */}
      <div className="p-6 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-gradient-to-b from-[#060608] to-[#0a0a0f] transition-all duration-300 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500">
              📊 RECHARTS ENGINE
            </span>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f5a623] font-display">
              Ringkasan & Analisis Grafik Presensi
            </h3>
          </div>
          <div className="text-[10px] font-mono text-zinc-550 bg-black px-3 py-1.5 rounded-lg border border-zinc-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            TOTAL ABSENSI DIPROSES: <span className="font-extrabold text-white">{totalRecords} RECORD</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Chart visualizers block */}
          <div className="lg:col-span-8 bg-black/40 border border-zinc-900 rounded-xl p-4 sm:p-5">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#121217" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525b" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: '#1c1917' }}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={11} 
                    tickLine={false}
                    allowDecimals={false}
                    axisLine={{ stroke: '#1c1917' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl shadow-2xl font-mono text-[11px] space-y-1">
                            <p className="text-zinc-450 uppercase font-black" style={{ color: data.color }}>{data.name}</p>
                            <p className="text-white font-sans text-xs">
                              Jumlah: <span className="font-extrabold text-white">{data.jumlah}</span> Kali
                            </p>
                            <p className="text-zinc-500 text-[10px]">
                              Persentase: <span className="text-amber-500 font-bold">{data.proporsi}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.15} stroke={entry.color} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KPI and analytical insights text description card */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-zinc-950/70 border border-zinc-900 rounded-xl p-4.5 space-y-3.5">
              <h4 className="text-[11px] font-extrabold font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">
                Analitik Kunci Kelas
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/60 p-3 rounded-lg border border-zinc-900 text-left">
                  <span className="block text-[8px] text-zinc-550 font-bold uppercase font-mono">Kehadiran Kelas</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-white">{overallPresenceRate}%</span>
                  </div>
                </div>

                <div className="bg-black/60 p-3 rounded-lg border border-zinc-900 text-left">
                  <span className="block text-[8px] text-zinc-550 font-bold uppercase font-mono">Konsistensi Tinggi</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-amber-500">{highAttendanceStudents}</span>
                    <span className="text-[9px] text-zinc-550 font-mono font-bold">Murid</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-zinc-900 text-left space-y-1">
                <span className="block text-[8px] text-zinc-550 font-bold uppercase font-mono">Keterangan Akumulasi (Bulan Ini)</span>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500"></span><span className="text-zinc-300">H: {totalHadir}</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-500"></span><span className="text-zinc-300">S: {totalSakit}</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500"></span><span className="text-zinc-300">I: {totalIzin}</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rose-500"></span><span className="text-zinc-300">A: {totalAlpa}</span></div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 leading-relaxed font-sans bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                💡 <span className="font-bold text-amber-500">TIPS:</span> Rata-rata kehadiran &gt; 90% menandakan disiplin kelas yang prima untuk kelancaran pembelajaran di <span className="font-bold text-white">{kelas}</span>.
              </div>
            </div>

          </div>

        </div>
      </div>

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

      {/* GLOBAL TOAST FLOATING ALERTS */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[9999] transition-all duration-300 animate-slide-in">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 shadow-2xl bg-zinc-950/95 backdrop-blur-md ${
            toast.type === "success" 
              ? "border-emerald-500 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)]" 
              : toast.type === "warning"
              ? "border-rose-500 text-rose-300 shadow-[0_0_25px_rgba(239,68,68,0.3)]"
              : "border-amber-500 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          }`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-lg font-black text-xs ${
              toast.type === "success" 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : toast.type === "warning"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {toast.type === "success" ? "✓" : toast.type === "warning" ? "✕" : "ℹ"}
            </span>
            <div className="font-mono text-xs font-black tracking-wide uppercase">
              {toast.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
