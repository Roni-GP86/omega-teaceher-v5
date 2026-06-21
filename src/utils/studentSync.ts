/**
 * Student data synchronization utility for Omega Guru Application
 */

export interface Student {
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
  grades: any[];
  photo?: string;
}

export function synchronizeLegacyStudentRosters(updatedList: Student[]) {
  if (!updatedList || !Array.isArray(updatedList)) return;

  // 1. Synchronize "omega_daftar_nilai_students" roster (used by DaftarNilai, CharacterAssessment, AttendanceCard, LitNumProgress)
  const legacyRoster = updatedList.map((st, index) => {
    const nisnSamples = (st.nisnNis || "").split("/");
    const nisn = nisnSamples[0] || "";
    return {
      id: st.id || `std-${index + 1}`,
      name: st.namaLengkap,
      gender: st.jenisKelamin === "Perempuan" || st.jenisKelamin === "P" ? "P" : "L",
      nisn: nisn
    };
  });
  localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(legacyRoster));

  // 2. Synchronize "omega_attendance_students"
  try {
    const rawAttendance = localStorage.getItem("omega_attendance_students");
    let attendanceList: any[] = [];
    if (rawAttendance) {
      try { attendanceList = JSON.parse(rawAttendance); } catch (e) {}
    }
    const updatedAttendance = updatedList.map(st => {
      const existing = attendanceList.find(a => a && (a.id === st.id || (a.name && a.name.trim().toLowerCase() === st.namaLengkap.trim().toLowerCase())));
      return {
        id: st.id,
        name: st.namaLengkap,
        gender: st.jenisKelamin === "Perempuan" || st.jenisKelamin === "P" ? "P" : "L",
        records: existing ? existing.records : {}
      };
    });
    localStorage.setItem("omega_attendance_students", JSON.stringify(updatedAttendance));
  } catch (e) {
    console.error("Gagal sinkronisasi absensi:", e);
  }

  // 3. Synchronize "omega_character_students"
  try {
    const rawCharacter = localStorage.getItem("omega_character_students");
    let characterList: any[] = [];
    if (rawCharacter) {
      try { characterList = JSON.parse(rawCharacter); } catch (e) {}
    }
    const updatedCharacter = updatedList.map(st => {
      const existing = characterList.find(c => c && (c.id === st.id || (c.name && c.name.trim().toLowerCase() === st.namaLengkap.trim().toLowerCase())));
      return {
        id: st.id,
        name: st.namaLengkap,
        gender: st.jenisKelamin === "Perempuan" || st.jenisKelamin === "P" ? "P" : "L",
        religius: existing ? existing.religius : "BSH",
        jujur: existing ? existing.jujur : "BSH",
        disiplin: existing ? existing.disiplin : "BSH",
        peduli: existing ? existing.peduli : "BSH",
        tanggung_jawab: existing ? existing.tanggung_jawab : "BSH",
        santun: existing ? existing.santun : "BSH",
        catatanKarakter: existing?.catatanKarakter || "Menunjukkan pembiasaan karakter yang baik dan santun selama proses bimbingan kelas."
      };
    });
    localStorage.setItem("omega_character_students", JSON.stringify(updatedCharacter));
  } catch (e) {
    console.error("Gagal sinkronisasi karakter:", e);
  }

  // 4. Synchronize "omega_litnum_students"
  try {
    const rawLitNum = localStorage.getItem("omega_litnum_students");
    let litnumList: any[] = [];
    if (rawLitNum) {
      try { litnumList = JSON.parse(rawLitNum); } catch (e) {}
    }
    const updatedLitNum = updatedList.map(st => {
      const existing = litnumList.find(l => l && (l.id === st.id || (l.name && l.name.trim().toLowerCase() === st.namaLengkap.trim().toLowerCase())));
      return {
        id: st.id,
        name: st.namaLengkap,
        gender: st.jenisKelamin === "Perempuan" || st.jenisKelamin === "P" ? "P" : "L",
        lit1: existing ? existing.lit1 : "M",
        lit2: existing ? existing.lit2 : "M",
        num1: existing ? existing.num1 : "M",
        num2: existing ? existing.num2 : "M",
        capaianS1: existing ? existing.capaianS1 : "Tercapai",
        capaianS2: existing ? existing.capaianS2 : "Sangat Baik"
      };
    });
    localStorage.setItem("omega_litnum_students", JSON.stringify(updatedLitNum));
  } catch (e) {
    console.error("Gagal sinkronisasi litnum:", e);
  }

  // 5. Synchronize Daftar Nilai subjects list
  try {
    const activeRaw = localStorage.getItem("profile_active_subjects");
    let subjects = ["Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila", "Bahasa Inggris", "PJOK", "Seni Rupa", "Seni Musik", "Seni Tari", "Seni Teater", "Agama Katolik", "Agama Islam", "Agama Kristen", "Agama Hindu", "Agama Buddha", "Agama Khonghucu"];
    if (activeRaw) {
      try {
        const parsedSub = JSON.parse(activeRaw);
        if (Array.isArray(parsedSub)) {
          subjects = [...new Set([...subjects, ...parsedSub])];
        }
      } catch (e) {}
    }
    subjects.forEach(mapelId => {
      const rawMapel = localStorage.getItem(`omega_daftar_nilai_students_${mapelId}`);
      if (!rawMapel) return;
      let mapelStudents: any[] = [];
      try { mapelStudents = JSON.parse(rawMapel); } catch (e) {}
      
      const updatedMapel = updatedList.map(st => {
        const existing = mapelStudents.find(s => s && (s.id === st.id || (s.name && s.name.trim().toLowerCase() === st.namaLengkap.trim().toLowerCase())));
        return {
          id: st.id,
          name: st.namaLengkap,
          gender: st.jenisKelamin === "Perempuan" || st.jenisKelamin === "P" ? "P" : "L",
          sem1: existing ? existing.sem1 : {
            tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" },
            sumatifTopik: { tema1: "", tema2: "", tema3: "" },
            sts: "", sas: ""
          },
          sem2: existing ? existing.sem2 : {
            tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" },
            sumatifTopik: { tema1: "", tema2: "", tema3: "" },
            sts: "", sas: ""
          }
        };
      });
      localStorage.setItem(`omega_daftar_nilai_students_${mapelId}`, JSON.stringify(updatedMapel));
    });
  } catch (e) {
    console.error("Gagal sinkronisasi nilai mapel:", e);
  }

  // Synchronize School Profile mirror key-compatibilities with legacy ones
  try {
    const schoolMap = {
      "kosp_nama_sekolah": "omega_school_name",
      "kosp_fase_kelas": "omega_school_class",
      "kosp_kepala_sekolah": "omega_principal_name",
      "kosp_nip_kepala": "omega_principal_nip",
      "kosp_nama_guru": "omega_teacher_name"
    };
    Object.entries(schoolMap).forEach(([kospKey, legacyKey]) => {
      const val = localStorage.getItem(kospKey);
      if (val) {
        localStorage.setItem(legacyKey, val);
        // Also save to standard omega prefixes
        const standardOmegaKey = legacyKey.replace("omega_", "omega_student_");
        localStorage.setItem(standardOmegaKey, val);
      }
    });
  } catch (e) {
    // ignore
  }

  // Dispatch global state update triggers so that all listeners auto-reload immediately
  window.dispatchEvent(new CustomEvent("omega-state-updated"));
  window.dispatchEvent(new CustomEvent("omega-student-profile-updated"));
  window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
}
