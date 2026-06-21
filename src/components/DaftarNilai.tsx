import React, { useState, useEffect } from "react";
import { 
  Users, Sparkles, Download, Copy, Check, Plus, Trash2, Edit2, 
  Award, FileSpreadsheet, Percent, HelpCircle, Save, ArrowRight,
  TrendingUp, FileDown, ArrowUpDown, ChevronDown, CheckCircle2, AlertCircle, Star
} from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";
import { SmartTooltip } from "./SmartTooltip";

interface StudentGrade {
  id: string;
  name: string;
  gender: "L" | "P";
  nisn?: string;
  // Semester 1 Grades
  sem1: {
    tugas: { [key: string]: number | "" }; // e.g. "tugas1": 80, "tugas2": 85, "tugas3": 90, "tugas4": 75
    sumatifTopik: { [key: string]: number | "" }; // e.g. "sum1": 80, "sum2": 85
    sts: number | "";
    sas: number | "";
  };
  // Semester 2 Grades
  sem2: {
    tugas: { [key: string]: number | "" };
    sumatifTopik: { [key: string]: number | "" };
    sts: number | "";
    sas: number | "";
  };
}

const DEFAULT_STUDENTS: StudentGrade[] = [
  {
    id: "std-1",
    name: "Florida Banusu",
    nisn: "3155685577",
    gender: "P",
    sem1: {
      tugas: { tugas1: 85, tugas2: 80, tugas3: 90, tugas4: 78 },
      sumatifTopik: { tema1: 82, tema2: 86, tema3: 80 },
      sts: 84,
      sas: 88
    },
    sem2: {
      tugas: { tugas1: 88, tugas2: 82, tugas3: 92, tugas4: 80 },
      sumatifTopik: { tema1: 85, tema2: 89, tema3: 84 },
      sts: 86,
      sas: 90
    }
  },
  {
    id: "std-2",
    name: "Febrianus Hanoe",
    nisn: "0164310989",
    gender: "L",
    sem1: {
      tugas: { tugas1: 82, tugas2: 85, tugas3: 80, tugas4: 88 },
      sumatifTopik: { tema1: 84, tema2: 80, tema3: 83 },
      sts: 85,
      sas: 82
    },
    sem2: {
      tugas: { tugas1: 84, logout: 86, tugas3: 82, tugas4: 89 },
      sumatifTopik: { tema1: 85, tema2: 82, tema3: 85 },
      sts: 86,
      sas: 84
    }
  },
  {
    id: "std-3",
    name: "Fransiskus Puatero",
    nisn: "3148133459",
    gender: "L",
    sem1: {
      tugas: { tugas1: 78, tugas2: 83, tugas3: 87, tugas4: 80 },
      sumatifTopik: { tema1: 80, tema2: 82, tema3: 79 },
      sts: 81,
      sas: 85
    },
    sem2: {
      tugas: { tugas1: 80, tugas2: 85, tugas3: 89, tugas4: 82 },
      sumatifTopik: { tema1: 82, tema2: 84, tema3: 81 },
      sts: 83,
      sas: 87
    }
  },
  {
    id: "std-4",
    name: "Mateus Kause",
    nisn: "3157174153",
    gender: "L",
    sem1: {
      tugas: { tugas1: 90, tugas2: 91, tugas3: 93, tugas4: 89 },
      sumatifTopik: { tema1: 91, tema2: 90, tema3: 92 },
      sts: 91,
      sas: 93
    },
    sem2: {
      tugas: { tugas1: 91, tugas2: 92, tugas3: 93, tugas4: 90 },
      sumatifTopik: { tema1: 92, tema2: 91, tema3: 93 },
      sts: 92,
      sas: 93
    }
  },
  {
    id: "std-5",
    name: "Natalia Buatefa",
    nisn: "3151880167",
    gender: "P",
    sem1: {
      tugas: { tugas1: 88, tugas2: 86, tugas3: 90, tugas4: 92 },
      sumatifTopik: { tema1: 89, tema2: 87, tema3: 90 },
      sts: 88,
      sas: 91
    },
    sem2: {
      tugas: { tugas1: 90, tugas2: 88, tugas3: 92, tugas4: 93 },
      sumatifTopik: { tema1: 91, tema2: 89, tema3: 92 },
      sts: 90,
      sas: 93
    }
  },
  {
    id: "std-6",
    name: "Norbertus Hanoe",
    nisn: "",
    gender: "L",
    sem1: {
      tugas: { tugas1: 75, tugas2: 78, tugas3: 80, tugas4: 77 },
      sumatifTopik: { tema1: 76, tema2: 78, tema3: 75 },
      sts: 78,
      sas: 80
    },
    sem2: {
      tugas: { tugas1: 77, tugas2: 80, tugas3: 82, tugas4: 79 },
      sumatifTopik: { tema1: 78, tema2: 80, tema3: 77 },
      sts: 80,
      sas: 82
    }
  },
  {
    id: "std-7",
    name: "Paskalis Hanoe",
    nisn: "3141294287",
    gender: "L",
    sem1: {
      tugas: { tugas1: 86, tugas2: 84, tugas3: 88, tugas4: 85 },
      sumatifTopik: { tema1: 85, tema2: 86, tema3: 84 },
      sts: 87,
      sas: 89
    },
    sem2: {
      tugas: { tugas1: 88, tugas2: 86, tugas3: 90, tugas4: 87 },
      sumatifTopik: { tema1: 87, tema2: 88, tema3: 86 },
      sts: 89,
      sas: 91
    }
  },
  {
    id: "std-8",
    name: "Petrosia Kono Aran",
    nisn: "3157126495",
    gender: "P",
    sem1: {
      tugas: { tugas1: 91, tugas2: 90, tugas3: 93, tugas4: 92 },
      sumatifTopik: { tema1: 91, tema2: 92, tema3: 90 },
      sts: 91,
      sas: 93
    },
    sem2: {
      tugas: { tugas1: 92, tugas2: 91, tugas3: 93, tugas4: 91 },
      sumatifTopik: { tema1: 91, tema2: 92, tema3: 93 },
      sts: 92,
      sas: 93
    }
  },
  {
    id: "std-9",
    name: "Syrilus Alexander Kosat",
    nisn: "0154241594",
    gender: "L",
    sem1: {
      tugas: { tugas1: 80, tugas2: 82, tugas3: 78, tugas4: 84 },
      sumatifTopik: { tema1: 81, tema2: 80, tema3: 82 },
      sts: 83,
      sas: 85
    },
    sem2: {
      tugas: { tugas1: 82, tugas2: 84, tugas3: 80, tugas4: 86 },
      sumatifTopik: { tema1: 83, tema2: 82, tema3: 84 },
      sts: 85,
      sas: 87
    }
  },
  {
    id: "std-10",
    name: "Serilius Buatefa",
    nisn: "3157245047",
    gender: "L",
    sem1: {
      tugas: { tugas1: 84, tugas2: 80, tugas3: 86, tugas4: 85 },
      sumatifTopik: { tema1: 83, tema2: 84, tema3: 82 },
      sts: 85,
      sas: 88
    },
    sem2: {
      tugas: { tugas1: 86, tugas2: 82, tugas3: 88, tugas4: 87 },
      sumatifTopik: { tema1: 85, tema2: 86, tema3: 84 },
      sts: 87,
      sas: 90
    }
  },
  {
    id: "std-11",
    name: "Yohanes Buatefa",
    nisn: "",
    gender: "L",
    sem1: {
      tugas: { tugas1: 79, tugas2: 82, tugas3: 80, tugas4: 81 },
      sumatifTopik: { tema1: 80, tema2: 81, tema3: 79 },
      sts: 82,
      sas: 84
    },
    sem2: {
      tugas: { tugas1: 81, tugas2: 84, tugas3: 82, tugas4: 83 },
      sumatifTopik: { tema1: 82, tema2: 83, tema3: 81 },
      sts: 84,
      sas: 86
    }
  },
  {
    id: "std-12",
    name: "Alfonsius Misa",
    nisn: "",
    gender: "L",
    sem1: {
      tugas: { tugas1: 83, tugas2: 80, tugas3: 85, tugas4: 82 },
      sumatifTopik: { tema1: 82, tema2: 84, tema3: 81 },
      sts: 84,
      sas: 86
    },
    sem2: {
      tugas: { tugas1: 85, tugas2: 82, tugas3: 87, tugas4: 84 },
      sumatifTopik: { tema1: 84, tema2: 86, tema3: 83 },
      sts: 86,
      sas: 88
    }
  }
];

const migrateSumatif = (stdList: StudentGrade[] | null | undefined): StudentGrade[] => {
  if (!Array.isArray(stdList)) return [];
  return stdList.map(std => {
    if (!std || typeof std !== "object") {
      return {
        id: "std-" + Math.random().toString(36).substring(2, 9),
        name: "Siswa Tanpa Nama",
        gender: "L",
        nisn: "",
        sem1: { tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" }, sumatifTopik: { tema1: "", tema2: "", tema3: "" }, sts: "", sas: "" },
        sem2: { tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" }, sumatifTopik: { tema1: "", tema2: "", tema3: "" }, sts: "", sas: "" }
      };
    }

    const defaultSem = () => ({
      tugas: { tugas1: "" as number | "", tugas2: "" as number | "", tugas3: "" as number | "", tugas4: "" as number | "" },
      sumatifTopik: { tema1: "" as number | "", tema2: "" as number | "", tema3: "" as number | "" },
      sts: "" as number | "",
      sas: "" as number | ""
    });

    const sem1Obj = (std.sem1 && typeof std.sem1 === "object") ? std.sem1 : null;
    const sem1 = sem1Obj ? { 
      tugas: { ...defaultSem().tugas, ...(sem1Obj.tugas && typeof sem1Obj.tugas === "object" ? sem1Obj.tugas : {}) },
      sumatifTopik: { ...defaultSem().sumatifTopik, ...(sem1Obj.sumatifTopik && typeof sem1Obj.sumatifTopik === "object" ? sem1Obj.sumatifTopik : {}) },
      sts: sem1Obj.sts !== undefined ? sem1Obj.sts : "",
      sas: sem1Obj.sas !== undefined ? sem1Obj.sas : ""
    } : defaultSem();

    const sem2Obj = (std.sem2 && typeof std.sem2 === "object") ? std.sem2 : null;
    const sem2 = sem2Obj ? { 
      tugas: { ...defaultSem().tugas, ...(sem2Obj.tugas && typeof sem2Obj.tugas === "object" ? sem2Obj.tugas : {}) },
      sumatifTopik: { ...defaultSem().sumatifTopik, ...(sem2Obj.sumatifTopik && typeof sem2Obj.sumatifTopik === "object" ? sem2Obj.sumatifTopik : {}) },
      sts: sem2Obj.sts !== undefined ? sem2Obj.sts : "",
      sas: sem2Obj.sas !== undefined ? sem2Obj.sas : ""
    } : defaultSem();

    const processSem = (sem: typeof sem1) => {
      if (!sem || typeof sem !== "object") return;
      const topiks: any = (sem.sumatifTopik && typeof sem.sumatifTopik === "object") ? { ...sem.sumatifTopik } : {};
      const hasTema = "tema1" in topiks;
      if (!hasTema) {
        const s1 = topiks.sum1 !== undefined && topiks.sum1 !== "" ? topiks.sum1 : 80;
        const s2 = topiks.sum2 !== undefined && topiks.sum2 !== "" ? topiks.sum2 : 82;
        const s3 = topiks.sum3 !== undefined && topiks.sum3 !== "" ? topiks.sum3 : 84;
        
        delete topiks.sum1;
        delete topiks.sum2;
        delete topiks.sum3;
        
        topiks.tema1 = s1;
        topiks.tema2 = s2;
        topiks.tema3 = s3;
      } else {
        if (!("tema3" in topiks) || topiks.tema3 === undefined) {
          topiks.tema3 = 82;
        }
      }
      sem.sumatifTopik = topiks;
    };

    processSem(sem1);
    processSem(sem2);

    return {
      id: std.id || "std-" + Math.random().toString(36).substring(2, 9),
      name: std.name || "Siswa Tanpa Nama",
      gender: std.gender || "L",
      nisn: std.nisn || "",
      sem1,
      sem2
    };
  });
};

const getRandomStudentGradesForMapel = (studentName: string, mapelName: string) => {
  const combinedStr = studentName + mapelName;
  let hash = 0;
  for (let i = 0; i < combinedStr.length; i++) {
    hash = (hash << 5) - hash + combinedStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const getClampedGrade = (offset: number) => {
    return 63 + ((absHash + offset) % 31);
  };

  return {
    sem1: {
      tugas: {
        tugas1: getClampedGrade(1),
        tugas2: getClampedGrade(2),
        tugas3: getClampedGrade(3),
        tugas4: getClampedGrade(4)
      },
      sumatifTopik: {
        tema1: getClampedGrade(5),
        tema2: getClampedGrade(6),
        tema3: getClampedGrade(5) + 3 > 93 ? 91 : getClampedGrade(5) + 3
      },
      sts: getClampedGrade(7),
      sas: getClampedGrade(8)
    },
    sem2: {
      tugas: {
        tugas1: getClampedGrade(9),
        tugas2: getClampedGrade(10),
        tugas3: getClampedGrade(11),
        tugas4: getClampedGrade(12)
      },
      sumatifTopik: {
        tema1: getClampedGrade(13),
        tema2: getClampedGrade(14),
        tema3: getClampedGrade(13) + 2 > 93 ? 90 : getClampedGrade(13) + 2
      },
      sts: getClampedGrade(15),
      sas: getClampedGrade(16)
    }
  };
};

const ensureFullyPopulatedStudents = (stdList: StudentGrade[], subjectName: string): StudentGrade[] => {
  if (!Array.isArray(stdList)) return [];
  const migrated = migrateSumatif(stdList);
  
  // If the user deliberately selected to clear all values, keep it cleared/empty!
  const isManuallyWiped = localStorage.getItem(`omega_daftar_nilai_manually_wiped_${subjectName}`) === "true";
  if (isManuallyWiped) {
    return migrated;
  }

  return migrated.map(std => {
    const sem1Empty = !std.sem1 || (
      Object.values(std.sem1.tugas || {}).every(v => v === "" || v === null || v === undefined) &&
      Object.values(std.sem1.sumatifTopik || {}).every(v => v === "" || v === null || v === undefined) &&
      (std.sem1.sts === "" || std.sem1.sts === null || std.sem1.sts === undefined) &&
      (std.sem1.sas === "" || std.sem1.sas === null || std.sem1.sas === undefined)
    );
    
    const sem2Empty = !std.sem2 || (
      Object.values(std.sem2.tugas || {}).every(v => v === "" || v === null || v === undefined) &&
      Object.values(std.sem2.sumatifTopik || {}).every(v => v === "" || v === null || v === undefined) &&
      (std.sem2.sts === "" || std.sem2.sts === null || std.sem2.sts === undefined) &&
      (std.sem2.sas === "" || std.sem2.sas === null || std.sem2.sas === undefined)
    );

    let finalSem1 = { ...std.sem1 };
    let finalSem2 = { ...std.sem2 };
    
    if (sem1Empty || sem2Empty) {
      const defaults = getRandomStudentGradesForMapel(std.name, subjectName);
      if (sem1Empty) finalSem1 = defaults.sem1;
      if (sem2Empty) finalSem2 = defaults.sem2;
    }

    return {
      ...std,
      sem1: finalSem1,
      sem2: finalSem2
    };
  });
};

const getMapelDefaultStudents = (mapelName: string): StudentGrade[] => {
  return DEFAULT_STUDENTS.map(std => {
    const combinedStr = std.name + mapelName;
    let hash = 0;
    for (let i = 0; i < combinedStr.length; i++) {
      hash = (hash << 5) - hash + combinedStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const getClampedGrade = (offset: number) => {
      return 63 + ((absHash + offset) % 31);
    };

    return {
      ...std,
      sem1: {
        tugas: {
          tugas1: getClampedGrade(1),
          tugas2: getClampedGrade(2),
          tugas3: getClampedGrade(3),
          tugas4: getClampedGrade(4)
        },
        sumatifTopik: {
          tema1: getClampedGrade(5),
          tema2: getClampedGrade(6),
          tema3: getClampedGrade(5) + 3 > 93 ? 91 : getClampedGrade(5) + 3
        },
        sts: getClampedGrade(7),
        sas: getClampedGrade(8)
      },
      sem2: {
        tugas: {
          tugas1: getClampedGrade(9),
          tugas2: getClampedGrade(10),
          tugas3: getClampedGrade(11),
          tugas4: getClampedGrade(12)
        },
        sumatifTopik: {
          tema1: getClampedGrade(13),
          tema2: getClampedGrade(14),
          tema3: getClampedGrade(13) + 2 > 93 ? 90 : getClampedGrade(13) + 2
        },
        sts: getClampedGrade(15),
        sas: getClampedGrade(16)
      }
    };
  });
};

const getSubjectAtpMapping = (mapel: string) => {
  switch (mapel) {
    case "Matematika":
      return {
        tugas1: "TP 4.1: Memahami intuisi & membaca/menulis bilangan cacah s.d 10.000",
        tugas2: "TP 4.2: Menentukan nilai tempat & melakukan dekomposisi bilangan cacah",
        tugas3: "TP 4.3: Menyelesaikan masalah perkalian & pembagian bilangan cacah s.d 100",
        tugas4: "TP 4.4: Memecahkan masalah kalkulasi keuangan sehari-hari terkait uang Rupiah",
        tema1: "Elemen Bilangan",
        tema2: "Elemen Aljabar",
        tema3: "Elemen Geometri & Pengukuran"
      };
    case "Bahasa Indonesia":
      return {
        tugas1: "TP 4.1: Menentukan gagasan pokok & ide pendukung dari teks narasi naratif",
        tugas2: "TP 4.2: Memaknai kosakata baru & istilah ilmiah dalam teks informatif digital",
        tugas3: "TP 4.3: Menulis laporan teks deskriptif dengan kaidah kalimat yang runtut",
        tugas4: "TP 4.4: Menyampaikan presentasi lisan dengan gestur tubuh yang sopan",
        tema1: "Elemen Membaca & Memirsa",
        tema2: "Elemen Menulis",
        tema3: "Elemen Berbicara & Menyimak"
      };
    case "IPAS":
    case "IPAS (Sains & Sosial)":
      return {
        tugas1: "TP 4.1: Menganalisis hubungan antara bentuk & fungsi organ tubuh tumbuhan",
        tugas2: "TP 4.2: Menjelaskan peranan pancaindra manusia dalam merespons stimulus luar",
        tugas3: "TP 4.3: Memetakan siklus makhluk hidup (metamorfosis) di lingkungan terdekat",
        tugas4: "TP 4.4: Membedakan pengaruh gaya otot & gaya gesek pada aktivitas sehari-hari",
        tema1: "Elemen Fungsi Organ",
        tema2: "Elemen Metamorfosis & Ekologi",
        tema3: "Elemen Gaya & Energi"
      };
    case "Pendidikan Pancasila":
      return {
        tugas1: "TP 4.1: Menjelaskan arti simbol lambang pancasila sila kesatu s.d kelima",
        tugas2: "TP 4.2: Mempraktikkan aturan norma kehidupan bermasyarakat & di sekolah",
        tugas3: "TP 4.3: Mengidentifikasi keragaman budaya di lingkungan kabupaten/provinsi",
        tugas4: "TP 4.4: Menunjukkan sikap bersatu & gotong royong dalam kebhinnekaan NKRI",
        tema1: "Elemen Pancasila",
        tema2: "Elemen Undang-Undang & Norma",
        tema3: "Elemen NKRI & Kebhinnekaan"
      };
    case "Bahasa Inggris":
      return {
        tugas1: "TP 4.1: Identify various daily activities using simple present tense verbs",
        tugas2: "TP 4.2: Read aloud and comprehend short paragraphs about children life",
        tugas3: "TP 4.3: Write very simple greeting messages and descriptions of body parts",
        tugas4: "TP 4.4: Present elementary level spoken commands in classroom interactions",
        tema1: "Elemen Listening & Speaking",
        tema2: "Elemen Reading & Viewing",
        tema3: "Elemen Writing & Presenting"
      };
    case "PJOK":
    case "PJOK (Jasmani & Kesehatan)":
      return {
        tugas1: "TP 4.1: Mempraktikkan variasi gerak dasar lokomotor lari rintangan & loncat",
        tugas2: "TP 4.2: Mempraktikkan kombinasi gerak manipulatif melempar & menangkap bola",
        tugas3: "TP 4.3: Mengidentifikasi asupan makanan bergizi untuk menunjang tumbuh kembang",
        tugas4: "TP 4.4: Menunjukkan nilai sportivitas, tanggung jawab & toleransi kawan",
        tema1: "Elemen Gerak Lokomotor",
        tema2: "Elemen Gerak Manipulatif",
        tema3: "Elemen Pola Hidup Sehat"
      };
    case "Seni Budaya":
    case "Seni Rupa":
    case "Seni Musik":
    case "Seni Tari":
    case "Seni Teater":
      return {
        tugas1: "TP 4.1: Membuat sketsa gambar dekoratif bermotif flora & fauna nusantara",
        tugas2: "TP 4.2: Merancang karya seni tempel atau kolase dwimatra dari rona alam",
        tugas3: "TP 4.3: Menyanyikan lagu daerah sesuai dengan tinggi rendah nada & birama",
        tugas4: "TP 4.4: Mempraktikkan gerak tari kreasi baru berdasar ketukan irama dinamis",
        tema1: "Elemen Seni Rupa Dekoratif",
        tema2: "Elemen Seni Musik & Ketukan",
        tema3: "Elemen Seni Tari Ekspresif"
      };
    default: {
      const prov = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";
      const kab = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";
      return {
        tugas1: `TP 4.1: Mengenal & melestarikan tradisi luhur sastra/karya lokal ${mapel} khas daerah ${kab}, ${prov}`,
        tugas2: `TP 4.2: Memahami ungkapan kesopanan, struktur tutur kata, dan budi pekerti daerah berbasis kearifan lokal`,
        tugas3: `TP 4.3: Mempraktikkan percakapan lisan dan ekspresi seni budaya ${mapel} dalam interaksi sosial sehari-hari`,
        tugas4: `TP 4.4: Menulis teks ringkas atau cerita rakyat terkait kearifan lokal warga ${kab} secara kreatif`,
        tema1: "Elemen Kebahasaan & Sastra",
        tema2: "Elemen Nilai & Budi Pekerti",
        tema3: "Elemen Kreasi & Apresiasi Budaya"
      };
    }
  }
};

export function DaftarNilai() {
  const [mapelList, setMapelList] = useState<{ id: string; name: string; icon: string }[]>(() => {
    try {
      const activeRaw = localStorage.getItem("profile_active_subjects");
      if (activeRaw) {
        const activeIds = JSON.parse(activeRaw);
        if (Array.isArray(activeIds) && activeIds.length > 0) {
          const customSubRaw = localStorage.getItem("profile_custom_subjects") || localStorage.getItem("kosp_custom_subjects");
          let customListObj: Record<string, any> = {};
          if (customSubRaw) {
            try {
              const parsed = JSON.parse(customSubRaw);
              if (Array.isArray(parsed)) {
                parsed.forEach(p => { customListObj[p.id] = p.label || p.name; });
              } else {
                Object.keys(parsed).forEach(k => { customListObj[k] = parsed[k].label || parsed[k].name; });
              }
            } catch(e) {}
          }

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

          return activeIds.map((id: string) => {
            const name = customListObj[id] || standardMap[id] || id;
            let icon = "📚";
            if (id.toLowerCase().includes("matematika")) icon = "📐";
            else if (id.toLowerCase().includes("indonesia") || id.toLowerCase().includes("inggris")) icon = "📖";
            else if (id.toLowerCase().includes("ipa") || id.toLowerCase().includes("fisika") || id.toLowerCase().includes("kimia") || id.toLowerCase().includes("biologi") || id.toLowerCase().includes("ipas")) icon = "🔬";
            else if (id.toLowerCase().includes("pancasila")) icon = "🛡️";
            else if (id.toLowerCase().includes("pjok") || id.toLowerCase().includes("olahraga")) icon = "⚽";
            else if (id.toLowerCase().includes("seni") || id.toLowerCase().includes("rupa") || id.toLowerCase().includes("musik")) icon = "🎨";
            else if (id.toLowerCase().includes("agama") || id.toLowerCase().includes("islam") || id.toLowerCase().includes("kristen") || id.toLowerCase().includes("katolik")) icon = "🕌";
            else if (id.toLowerCase().includes("sejarah") || id.toLowerCase().includes("ips") || id.toLowerCase().includes("sosiologi") || id.toLowerCase().includes("geografi")) icon = "🗺️";
            return { id: name, name, icon };
          });
        }
      }
    } catch(e) {
      console.error(e);
    }
    // Fallback if none exist yet
    return [
      { id: "Matematika", name: "Matematika", icon: "📐" },
      { id: "Bahasa Indonesia", name: "Bahasa Indonesia", icon: "📖" },
      { id: "IPAS", name: "IPAS (Sains & Sosial)", icon: "🔬" },
      { id: "Pendidikan Pancasila", name: "Pendidikan Pancasila", icon: "🛡️" },
      { id: "Bahasa Inggris", name: "Bahasa Inggris", icon: "🗣️" },
      { id: "PJOK", name: "PJOK (Olahraga)", icon: "⚽" },
      { id: "Seni Budaya", name: "Seni Budaya", icon: "🎨" }
    ];
  });

  const [selectedMapel, setSelectedMapel] = useState<string>(() => {
    const stored = localStorage.getItem("omega_daftar_nilai_selected_mapel");
    try {
      const activeRaw = localStorage.getItem("profile_active_subjects");
      if (activeRaw) {
        const activeIds = JSON.parse(activeRaw);
        if (Array.isArray(activeIds) && activeIds.length > 0) {
          // Check if stored is matches id or parsed label
          return stored || activeIds[0];
        }
      }
    } catch (e) {}
    return "Matematika";
  });

  const [hasConfiguredCurriculum, setHasConfiguredCurriculum] = useState<boolean>(() => {
    try {
      const activeRaw = localStorage.getItem("profile_active_subjects");
      return !!(activeRaw && JSON.parse(activeRaw).length > 0);
    } catch (e) { return false; }
  });

  useEffect(() => {
    const reloadMapels = () => {
      try {
        const activeRaw = localStorage.getItem("profile_active_subjects");
        if (activeRaw) {
          const activeIds = JSON.parse(activeRaw);
          if (Array.isArray(activeIds) && activeIds.length > 0) {
            setHasConfiguredCurriculum(true);
            const customSubRaw = localStorage.getItem("profile_custom_subjects") || localStorage.getItem("kosp_custom_subjects");
            let customListObj: Record<string, any> = {};
            if (customSubRaw) {
              try {
                const parsed = JSON.parse(customSubRaw);
                if (Array.isArray(parsed)) {
                  parsed.forEach(p => { customListObj[p.id] = p.label || p.name; });
                } else {
                  Object.keys(parsed).forEach(k => { customListObj[k] = parsed[k].label || parsed[k].name; });
                }
              } catch(e) {}
            }

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

            const newList = activeIds.map((id: string) => {
              const name = customListObj[id] || standardMap[id] || id;
              let icon = "📚";
              if (id.toLowerCase().includes("matematika")) icon = "📐";
              else if (id.toLowerCase().includes("indonesia") || id.toLowerCase().includes("inggris")) icon = "📖";
              else if (id.toLowerCase().includes("ipa") || id.toLowerCase().includes("fisika") || id.toLowerCase().includes("kimia") || id.toLowerCase().includes("biologi") || id.toLowerCase().includes("ipas")) icon = "🔬";
              else if (id.toLowerCase().includes("pancasila")) icon = "🛡️";
              else if (id.toLowerCase().includes("pjok") || id.toLowerCase().includes("olahraga")) icon = "⚽";
              else if (id.toLowerCase().includes("seni") || id.toLowerCase().includes("rupa") || id.toLowerCase().includes("musik")) icon = "🎨";
              else if (id.toLowerCase().includes("agama") || id.toLowerCase().includes("islam") || id.toLowerCase().includes("kristen") || id.toLowerCase().includes("katolik")) icon = "🕌";
              else if (id.toLowerCase().includes("sejarah") || id.toLowerCase().includes("ips") || id.toLowerCase().includes("sosiologi") || id.toLowerCase().includes("geografi")) icon = "🗺️";
              return { id: name, name, icon };
            });

            setMapelList(newList);

            // Re-validate selectedMapel
            const valid = newList.map(n => n.id);
            setSelectedMapel(prev => valid.includes(prev) ? prev : newList[0]?.id || "Matematika");
          } else {
            setHasConfiguredCurriculum(false);
          }
        } else {
          setHasConfiguredCurriculum(false);
        }
      } catch(e) {
        console.error(e);
      }
    };

    window.addEventListener("omega-school-profile-updated", reloadMapels);
    return () => window.removeEventListener("omega-school-profile-updated", reloadMapels);
  }, []);

  const [students, setStudents] = useState<StudentGrade[]>(() => {
    const activeMapel = localStorage.getItem("omega_daftar_nilai_selected_mapel") || "Matematika";
    const localMapel = localStorage.getItem(`omega_daftar_nilai_students_${activeMapel}`);
    if (localMapel) {
      try {
        const parsed = JSON.parse(localMapel);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return ensureFullyPopulatedStudents(parsed, activeMapel);
        }
      } catch (e) {}
    }
    
    // Fallback: If legacy general list exists and activeMapel is "Matematika", use it
    if (activeMapel === "Matematika") {
      const localLegacy = localStorage.getItem("omega_daftar_nilai_students");
      if (localLegacy) {
        try {
          const parsed = JSON.parse(localLegacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasLegacyStudents = parsed.some((s: any) => s && (s.name === "Budi Santoso" || s.name === "Siti Aminah"));
            if (!hasLegacyStudents) {
              const migrated = ensureFullyPopulatedStudents(parsed, activeMapel);
              if (migrated.length > 0) {
                return migrated;
              }
            }
          }
        } catch(e) {}
      }
    }

    return ensureFullyPopulatedStudents(getMapelDefaultStudents(activeMapel), activeMapel);
  });

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  const changeMapel = (newMapel: string) => {
    // 1. Save current state first
    localStorage.setItem(`omega_daftar_nilai_students_${selectedMapel}`, JSON.stringify(students));
    if (selectedMapel === "Matematika") {
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(students));
    }
    
    // 2. Select new mapel
    setSelectedMapel(newMapel);
    localStorage.setItem("omega_daftar_nilai_selected_mapel", newMapel);
    
    // 3. Load or generate students template grades
    const localMapel = localStorage.getItem(`omega_daftar_nilai_students_${newMapel}`);
    if (localMapel) {
      try {
        const parsed = JSON.parse(localMapel);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(ensureFullyPopulatedStudents(parsed, newMapel));
          return;
        }
      } catch (e) {}
    }
    setStudents(ensureFullyPopulatedStudents(getMapelDefaultStudents(newMapel), newMapel));
  };

  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [isSavedToBank, setIsSavedToBank] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
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

  const handleManualSave = () => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    // 1. Save state
    localStorage.setItem(`omega_daftar_nilai_students_${selectedMapel}`, JSON.stringify(students));
    
    // 2. Propagate master roster info to 'omega_daftar_nilai_students' as central list
    const masterInfo = students.map((s) => ({
      id: s.id,
      name: s.name,
      gender: s.gender,
      nisn: s.nisn || ""
    }));
    localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterInfo));

    // 3. Dispatch global sync event
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    window.dispatchEvent(new CustomEvent("omega-state-updated"));

    triggerToast(`✓ Berhasil Disimpan! Seluruh data nilai mata pelajaran ${selectedMapel} Semester ${activeSemester} telah tersimpan permanen luring.`);
  };

  // Form states
  const [formName, setFormName] = useState("");
  const [formGender, setFormGender] = useState<"L" | "P">("L");
  const [formNisn, setFormNisn] = useState("");
  
  // Custom Weights configuration
  const [weightTugas, setWeightTugas] = useState(30);  // 30%
  const [weightSumatif, setWeightSumatif] = useState(30); // 30%
  const [weightSts, setWeightSts] = useState(20); // 20%
  const [weightSas, setWeightSas] = useState(20); // 20%

  // Learning Objectives (TP) Descriptions - Sourced dynamically from Perencana Ajar
  const [tpHeaders, setTpHeaders] = useState<{ [key: string]: string }>(() => {
    return getSubjectAtpMapping(selectedMapel);
  });

  // Metadata
  const [namaSekolah, setNamaSekolah] = useState(() => localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai");
  const [alamatSekolah, setAlamatSekolah] = useState(() => localStorage.getItem("kosp_lokasi") || "Dusun Oehalo, Desa Fatubai, Kec. Insana, Kab. TTU, Prov. NTT");
  const [kelas, setKelas] = useState(() => localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B");
  const [tahunAjaran, setTunAjaran] = useState(() => localStorage.getItem("kosp_tahun_pelajaran") || "2025/2026");
  const [namaGuru, setNamaGuru] = useState(() => localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd");
  const [kepalaSekolah, setKepalaSekolah] = useState(() => localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd.,Gr.");
  const [nipKepala, setNipKepala] = useState(() => localStorage.getItem("kosp_nip_kepala") || "196709192008011008");
  const [tempatPenyusunan, setTempatPenyusunan] = useState(() => localStorage.getItem("kosp_tempat") || "Fatubai");
  const [tanggalPenyusunan, setTanggalPenyusunan] = useState(() => localStorage.getItem("kosp_tanggal") || "12 Juni 2026");
  const [kktp, setKktp] = useState(() => {
    const savedKktpMapping = localStorage.getItem("omega_kktp_mapping");
    if (savedKktpMapping) {
      try {
        const parsed = JSON.parse(savedKktpMapping);
        const mapel = localStorage.getItem("omega_daftar_nilai_selected_mapel") || "Matematika";
        if (parsed && typeof parsed === "object" && parsed[mapel] !== undefined) {
          return Number(parsed[mapel]);
        }
      } catch (e) {}
    }
    const mapel = localStorage.getItem("omega_daftar_nilai_selected_mapel") || "Matematika";
    return mapel === "Matematika" ? 65 : 70;
  });

  const [localKktpText, setLocalKktpText] = useState(String(kktp));

  useEffect(() => {
    setLocalKktpText(String(kktp));
  }, [kktp]);

  const handleKktpTextChange = (valStr: string) => {
    setLocalKktpText(valStr);
    const num = parseInt(valStr);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setKktp(num);
    }
  };

  const [showResetModal, setShowResetModal] = useState(false);

  const handleWipeGrades = () => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      setShowResetModal(false);
      return;
    }
    const wiped = students.map(s => ({
      ...s,
      sem1: {
        tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" },
        sumatifTopik: { tema1: "", tema2: "", tema3: "" },
        sts: "",
        sas: ""
      },
      sem2: {
        tugas: { tugas1: "", tugas2: "", tugas3: "", tugas4: "" },
        sumatifTopik: { tema1: "", tema2: "", tema3: "" },
        sts: "",
        sas: ""
      }
    }));
    // Mark as manually wiped so pre-populator/seeding doesn't auto-fill these empty rows
    localStorage.setItem(`omega_daftar_nilai_manually_wiped_${selectedMapel}`, "true");
    setStudents(wiped);
    localStorage.setItem(`omega_daftar_nilai_students_${selectedMapel}`, JSON.stringify(wiped));
    if (selectedMapel === "Matematika") {
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(wiped));
    }
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
    triggerToast(`✓ Berhasil Mengosongkan Nilai! Seluruh rincian nilai rumpang/kosong. Anda dapat memasukkan nilai baru.`);
    setShowResetModal(false);
  };

  const handleRestoreDefaultGrades = () => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      setShowResetModal(false);
      return;
    }
    // Clear the manually wiped flag
    localStorage.removeItem(`omega_daftar_nilai_manually_wiped_${selectedMapel}`);
    const defaults = ensureFullyPopulatedStudents(getMapelDefaultStudents(selectedMapel), selectedMapel);
    setStudents(defaults);
    localStorage.setItem(`omega_daftar_nilai_students_${selectedMapel}`, JSON.stringify(defaults));
    if (selectedMapel === "Matematika") {
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(defaults));
    }
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    window.dispatchEvent(new CustomEvent("omega-state-updated"));
    triggerToast(`✓ Berhasil Memulihkan Nilai Bawaan! Seluruh rincian nilai kembali ke standar bawaan sistem (kisaran 63-93).`);
    setShowResetModal(false);
  };

  // Smart calculation helpers that avoid penalizing pupils (pembagi bukan total, tapi kolom yang benar terisi!)
  const getTugasStats = (tugas: { [key: string]: number | "" } | undefined) => {
    let sum = 0;
    let count = 0;
    const keys = ["tugas1", "tugas2", "tugas3", "tugas4"];
    if (tugas) {
      keys.forEach(k => {
        const v = tugas[k];
        if (v !== undefined && v !== "") {
          const num = Number(v);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      });
    }
    return {
      sum: count > 0 ? sum : 0,
      count,
      avg: count > 0 ? parseFloat((sum / count).toFixed(1)) : 0
    };
  };

  const getTemaStats = (sumatifTopik: { [key: string]: number | "" } | undefined) => {
    let sum = 0;
    let count = 0;
    const keys = ["tema1", "tema2", "tema3"];
    if (sumatifTopik) {
      keys.forEach(k => {
        const v = sumatifTopik[k];
        if (v !== undefined && v !== "") {
          const num = Number(v);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      });
    }
    return {
      sum: count > 0 ? sum : 0,
      count,
      avg: count > 0 ? parseFloat((sum / count).toFixed(1)) : 0
    };
  };

  // Dynamically update ATP descriptions and KKTP whenever subject changes
  useEffect(() => {
    setTpHeaders(getSubjectAtpMapping(selectedMapel));
    
    const savedKktpMapping = localStorage.getItem("omega_kktp_mapping");
    let currentKktp = selectedMapel === "Matematika" ? 65 : 70;
    if (savedKktpMapping) {
      try {
        const parsed = JSON.parse(savedKktpMapping);
        if (parsed && typeof parsed === "object" && parsed[selectedMapel] !== undefined) {
          currentKktp = Number(parsed[selectedMapel]);
        }
      } catch (e) {}
    }
    setKktp(currentKktp);
  }, [selectedMapel]);

  // Synchronize KKTP edits with localStorage
  useEffect(() => {
    const savedKktpMapping = localStorage.getItem("omega_kktp_mapping");
    let currentMap: Record<string, number> = {};
    if (savedKktpMapping) {
      try {
        currentMap = JSON.parse(savedKktpMapping) || {};
      } catch (e) {}
    }
    currentMap[selectedMapel] = kktp;
    localStorage.setItem("omega_kktp_mapping", JSON.stringify(currentMap));
  }, [kktp, selectedMapel]);

  useEffect(() => {
    const loadProfile = () => {
      setNamaSekolah(localStorage.getItem("kosp_nama_sekolah") || "SD Negeri Fatubai");
      setAlamatSekolah(localStorage.getItem("kosp_lokasi") || "Dusun Oehalo, Desa Fatubai, Kec. Insana, Kab. TTU, Prov. NTT");
      setKelas(localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B");
      setTunAjaran(localStorage.getItem("kosp_tahun_pelajaran") || "2025/2026");
      setNamaGuru(localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd");
      setKepalaSekolah(localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd.,Gr.");
      setNipKepala(localStorage.getItem("kosp_nip_kepala") || "196709192008011008");
      setTempatPenyusunan(localStorage.getItem("kosp_tempat") || "Fatubai");
      setTanggalPenyusunan(localStorage.getItem("kosp_tanggal") || "12 Juni 2026");
    };
    loadProfile();
    window.addEventListener("omega-school-profile-updated", loadProfile);
    window.addEventListener("storage", loadProfile);
    return () => {
      window.removeEventListener("omega-school-profile-updated", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  // Database pre-populator/seeding for ALL active/standard subjects on mount!
  useEffect(() => {
    try {
      const activeRaw = localStorage.getItem("profile_active_subjects");
      let activeIds: string[] = [];
      if (activeRaw) {
        try {
          activeIds = JSON.parse(activeRaw);
        } catch (e) {}
      }
      
      if (!Array.isArray(activeIds) || activeIds.length === 0) {
        activeIds = ["Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila", "Bahasa Inggris", "PJOK", "Seni Budaya"];
      }

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

      const customSubRaw = localStorage.getItem("profile_custom_subjects") || localStorage.getItem("kosp_custom_subjects");
      let customListObj: Record<string, any> = {};
      if (customSubRaw) {
        try {
          const parsed = JSON.parse(customSubRaw);
          if (Array.isArray(parsed)) {
            parsed.forEach(p => { customListObj[p.id] = p.label || p.name; });
          } else {
            Object.keys(parsed).forEach(k => { customListObj[k] = parsed[k].label || parsed[k].name; });
          }
        } catch(e) {}
      }

      activeIds.forEach((id) => {
        const name = customListObj[id] || standardMap[id] || id;
        const storageKey = `omega_daftar_nilai_students_${name}`;
        const existing = localStorage.getItem(storageKey);
        if (!existing) {
          const defaults = ensureFullyPopulatedStudents(getMapelDefaultStudents(name), name);
          localStorage.setItem(storageKey, JSON.stringify(defaults));
          if (name === "Matematika") {
            localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(defaults));
          }
        } else {
          // If it already exists, automatically repair any blank elements
          try {
            const parsed = JSON.parse(existing);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const repaired = ensureFullyPopulatedStudents(parsed, name);
              localStorage.setItem(storageKey, JSON.stringify(repaired));
            }
          } catch (e) {}
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // 1. Save current state for the selected mapel
    localStorage.setItem(`omega_daftar_nilai_students_${selectedMapel}`, JSON.stringify(students));

    // 2. Extract standard simplified info (id, name, gender, nisn) for general attendance and other lists
    const masterInfo = students.map((s) => ({
      id: s.id,
      name: s.name,
      gender: s.gender,
      nisn: s.nisn || "",
    }));

    // Always update 'omega_daftar_nilai_students' as the central registry
    localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterInfo));

    // 3. Propagate student names, genders, IDs and NISNs to all other subjects (retaining their grades)
    mapelList.forEach((m) => {
      if (m.id === selectedMapel) return;

      const otherRaw = localStorage.getItem(`omega_daftar_nilai_students_${m.id}`);
      let otherStudents: StudentGrade[] = [];

      if (otherRaw) {
        try {
          otherStudents = JSON.parse(otherRaw);
        } catch (e) {
          otherStudents = [];
        }
      }

      // Reconcile other subjects' lists with the authorative order and students from the active state
      const reconciledRaw: StudentGrade[] = students.map((mStd) => {
        const exist = otherStudents.find((o) => o.id === mStd.id);
        if (exist) {
          return {
            ...exist, // Keep their subject grades
            name: mStd.name,
            gender: mStd.gender,
            nisn: mStd.nisn || "",
          };
        } else {
          // Instead of empty templates, return default deterministic grades based on name and that subject
          const defaults = getRandomStudentGradesForMapel(mStd.name, m.id);
          return {
            id: mStd.id,
            name: mStd.name,
            gender: mStd.gender,
            nisn: mStd.nisn || "",
            sem1: defaults.sem1,
            sem2: defaults.sem2
          };
        }
      });

      const reconciled = ensureFullyPopulatedStudents(reconciledRaw, m.id);
      localStorage.setItem(`omega_daftar_nilai_students_${m.id}`, JSON.stringify(reconciled));
    });

    // Notify other components (Absensi, Capaian LitNum, Karakter) of student roster updates
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  }, [students, selectedMapel]);

  // Handle value modifications directly in the table cells
  const handleCellChange = (
    studentId: string, 
    semester: 1 | 2, 
    type: "tugas" | "sumatifTopik" | "sts" | "sas", 
    key: string, 
    value: string
  ) => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    const cleanDigits = value.replace(/[^0-9]/g, "");
    const rawVal = cleanDigits === "" ? "" : Math.min(100, Math.max(0, parseInt(cleanDigits, 10)));
    
    setStudents(prev => prev.map(std => {
      if (!std || std.id !== studentId) return std;
      
      const semKey = semester === 1 ? "sem1" : "sem2";
      const semesterData = std[semKey] ? { ...std[semKey] } : { tugas: {}, sumatifTopik: {}, sts: "" as number | "", sas: "" as number | "" };
      
      if (type === "tugas") {
        semesterData.tugas = { ...(semesterData.tugas || {}), [key]: rawVal };
      } else if (type === "sumatifTopik") {
        semesterData.sumatifTopik = { ...(semesterData.sumatifTopik || {}), [key]: rawVal };
      } else if (type === "sts") {
        semesterData.sts = rawVal;
      } else if (type === "sas") {
        semesterData.sas = rawVal;
      }

      return {
        ...std,
        [semKey]: semesterData
      };
    }));
  };

  // Grade calculation logic based on current weights - Smart calculation (does not penalize pupils)
  const calculateFinalGrade = (std: StudentGrade, sem: 1 | 2) => {
    if (!std) return 0;
    const semData = sem === 1 ? std.sem1 : std.sem2;
    if (!semData) return 0;
    
    // Average Tugas using smart helper
    const tugasStats = getTugasStats(semData.tugas);
    const avgTugas = tugasStats.avg;
      
    // Average Sumatif using smart helper
    const temaStats = getTemaStats(semData.sumatifTopik);
    const avgSum = temaStats.avg;

    const stsVal = semData.sts !== undefined && semData.sts !== "" ? semData.sts : 0;
    const sasVal = semData.sas !== undefined && semData.sas !== "" ? semData.sas : 0;

    // Total weights normalisation
    const totalW = weightTugas + weightSumatif + weightSts + weightSas;
    if (totalW === 0) return 0;

    const finalScore = (
      (avgTugas * weightTugas) + 
      (avgSum * weightSumatif) + 
      (stsVal * weightSts) + 
      (sasVal * weightSas)
    ) / totalW;

    return parseFloat(finalScore.toFixed(1));
  };

  // Compute stats
  const getStats = () => {
    const filtered = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length === 0) return { avg: 0, max: 0, min: 0, tuntasCount: 0, tuntasPercent: 0 };

    const grades = filtered.map(s => calculateFinalGrade(s, activeSemester));
    const sum = grades.reduce((a, b) => a + b, 0);
    const avg = parseFloat((sum / filtered.length).toFixed(1));
    const max = Math.max(...grades);
    const min = Math.min(...grades);

    const tuntasCount = grades.filter(g => g >= kktp).length;
    const tuntasPercent = parseFloat(((tuntasCount / filtered.length) * 100).toFixed(1));

    return { avg, max, min, tuntasCount, tuntasPercent };
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      setShowAddStudentModal(false);
      return;
    }
    if (!formName.trim()) return;

    if (editingStudentId) {
      setStudents(prev => prev.map(s => s.id === editingStudentId ? { ...s, name: formName, gender: formGender, nisn: formNisn } : s));
      setEditingStudentId(null);
    } else {
      const newStudent: StudentGrade = {
        id: "std-" + Date.now(),
        name: formName,
        gender: formGender,
        nisn: formNisn,
        sem1: {
          tugas: { tugas1: 0, tugas2: 0, tugas3: 0, tugas4: 0 },
          sumatifTopik: { tema1: 0, tema2: 0, tema3: 0 },
          sts: 0,
          sas: 0
        },
        sem2: {
          tugas: { tugas1: 0, tugas2: 0, tugas3: 0, tugas4: 0 },
          sumatifTopik: { tema1: 0, tema2: 0, tema3: 0 },
          sts: 0,
          sas: 0
        }
      };
      setStudents(prev => [...prev, newStudent]);
    }

    setFormName("");
    setFormGender("L");
    setFormNisn("");
    setShowAddStudentModal(false);
  };

  const handleEditStudent = (std: StudentGrade) => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    setEditingStudentId(std.id);
    setFormName(std.name);
    setFormGender(std.gender);
    setFormNisn(std.nisn || "");
    setShowAddStudentModal(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    const student = students.find(s => s.id === studentId);
    const name = student ? student.name : "murid ini";
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus data murid ${name} beserta seluruh nilainya?`);
    setDeleteConfirmCallback(() => () => {
      setStudents(prev => prev.filter(s => s.id !== studentId));
    });
    setDeleteConfirmId(studentId);
  };

  const handleRequestAiEvaluation = async () => {
    if (!isNilaiRaporUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket NILAI & RAPOR untuk mengedit data ini.");
      return;
    }
    setLoading(true);
    setLoadingStatus("Menganalisis pencapaian kompetensi...");
    
    try {
      setTimeout(() => {
        setLoadingStatus("Mengalkulasi standar deviasi & penguasaan TP...");
      }, 1500);
      setTimeout(() => {
        setLoadingStatus("Memformulasikan rekomendasi pembelajaran guru...");
      }, 3000);

      // Simple local simulated AI synthesis to work purely offline
      setTimeout(() => {
        const stats = getStats();
        const tuntasNames = students.filter(s => calculateFinalGrade(s, activeSemester) >= kktp).map(s => s.name);
        const remidialNames = students.filter(s => calculateFinalGrade(s, activeSemester) < kktp).map(s => s.name);

        const aiOutput = `REKAPITULASI DIAGNOSTIK KELAS (${kelas} - MATA PELAJARAN: ${selectedMapel.toUpperCase()} - SEMESTER ${activeSemester})
----------------------------------------------------------------------
1. KEADAAN UMUM KELAS:
   • Rerata Kelas: ${stats.avg}
   • Nilai Tertinggi: ${stats.max}
   • Nilai Terendah: ${stats.min}
   • Persentase Ketuntasan Kriteria (KKTP: ${kktp}): ${stats.tuntasPercent}% (${stats.tuntasCount} dari ${students.length} Siswa)

2. DISIPLIN & ASESMEN FORMATIF (TUGAS):
   Kompetensi siswa secara dominan stabil di elemen tugas untuk mata pelajaran ${selectedMapel}. Strategi remedial
   difokuskan pada siswa dengan performa tugas di bawah target.

3. REKOMENDASI PENGAYAAN & REMEDIAL:
   • Kelompok Pengayaan (Siap untuk materi lebih lanjut):
     ${tuntasNames.length > 0 ? tuntasNames.join(", ") : "Tidak ada"}
   • Kelompok Remedial (Butuh bimbingan terintegrasi):
     ${remidialNames.length > 0 ? remidialNames.join(", ") : "Tidak ada"}

4. TINDAK LANJUT INSTRUKTUR:
   Mengingat nilai tengah semester dan sumatif akhir semester memberikan kontribusi signifikan terhadap pencapaian belajar total pada mata pelajaran ${selectedMapel}, disarankan untuk memberikan bimbingan individual bagi kelompok remedial setidaknya 2 kali seminggu pada topik yang rendah.`;

        // Store to local document bank
        const storedDocs = localStorage.getItem("omega_db_documents");
        const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
        const newDoc = {
          id: "doc-grade-" + Date.now(),
          name: `Analisis Nilai ${selectedMapel} Semester ${activeSemester} - ${kelas}`,
          category: "manual",
          content: aiOutput,
          size: "3 KB",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("omega_db_documents", JSON.stringify([newDoc, ...currentDocs]));
        setIsSavedToBank(true);
        setLoading(false);
        alert("Analisis dan Rekomendasi berhasil dirumuskan luring dan otomatis disimpan ke Bank Dokumen privat!");
      }, 4500);

    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Gagal merumuskan analisis.");
    }
  };

  const drawLandscapeKop = (doc: any, title: string, subtitle: string) => {
    const kopBaris1 = localStorage.getItem("kosp_kop_baris1") || "PEMERINTAH KABUPATEN TIMOR TENGAH UTARA";
    const kopBaris2 = localStorage.getItem("kosp_kop_baris2") || "DINAS PENDIDIKAN DAN KEBUDAYAAN";
    const kopBaris4 = localStorage.getItem("kosp_kop_baris4") || alamatSekolah;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(kopBaris1.toUpperCase(), 148.5, 12, { align: "center" });
    doc.text(kopBaris2.toUpperCase(), 148.5, 17, { align: "center" });
    
    doc.setFontSize(13);
    doc.text(namaSekolah.toUpperCase(), 148.5, 23, { align: "center" });
    
    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(8.5);
    doc.text(`Alamat: ${kopBaris4}`, 148.5, 27.5, { align: "center" });
    
    // Thick double line dividers (classic Indonesian Kop Surat separator for Landscape)
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.85);
    doc.line(14, 30.2, 283, 30.2);
    doc.setLineWidth(0.25);
    doc.line(14, 31.2, 283, 31.2);
    
    // Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, 148.5, 38.5, { align: "center" });
    doc.setFontSize(9);
    doc.text(subtitle, 148.5, 43.5, { align: "center" });
    
    // Four requested metadata fields of the report with perfectly aligned colons (:)
    const metadata = [
      { label: "Mata Pelajaran", value: selectedMapel.toUpperCase() },
      { label: "Kelas / Fase", value: kelas },
      { label: "Semester", value: `Semester ${activeSemester} (${activeSemester === 1 ? "Ganjil" : "Genap"})` },
      { label: "Target KKTP", value: String(kktp) }
    ];

    let metaY = 51.5;
    metadata.forEach((item) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(item.label, 14, metaY);
      doc.text(":", 42, metaY); // perfectly aligned vertically!
      doc.setFont("Helvetica", "normal");
      doc.text(item.value, 46, metaY);
      metaY += 4.5;
    });
    
    // Separator line
    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.35);
    doc.line(14, 69, 283, 69);
  };

  const triggerDownloadPDF = (type: "global" | "tugas" | "tema" | "sts" | "sas") => {
    const doc = new jsPDF("landscape");
    doc.setFont("Helvetica", "normal");

    let title = "";
    let subtitle = `TAHUN AJARAN ${tahunAjaran.toUpperCase()}`;
    
    if (type === "global") {
      title = `REKAPITULASI HASIL CAPAIAN AKADEMIK DAN NILAI AKHIR SISWA`;
    } else if (type === "tugas") {
      title = `LAPORAN CAPAIAN NILAI PENUGASAN HARIAN SISWA (ASESMEN FORMATIF)`;
    } else if (type === "tema") {
      title = `LAPORAN CAPAIAN NILAI UTAS LINGKUP MATERI SEMESTER (ASESMEN SUMATIF TEMA)`;
    } else if (type === "sts") {
      title = `REKAPITULASI REKOR NILAI SUMATIF TENGAH SEMESTER (STS)`;
    } else if (type === "sas") {
      title = `REKAPITULASI REKOR NILAI SUMATIF AKHIR SEMESTER (SAS)`;
    }

    drawLandscapeKop(doc, title, subtitle);

    let colBoundaries: number[] = [];
    if (type === "global") {
      colBoundaries = [14, 22, 46, 108, 118, 148, 178, 206, 234, 258, 283];
    } else if (type === "tugas") {
      colBoundaries = [14, 22, 46, 108, 118, 144, 170, 196, 222, 252, 283];
    } else if (type === "tema") {
      colBoundaries = [14, 22, 46, 108, 118, 150, 182, 214, 248, 283];
    } else { // sts or sas
      colBoundaries = [14, 22, 46, 108, 118, 168, 220, 283];
    }

    let headerTexts: string[] = [];
    if (type === "global") {
      headerTexts = [
        "No",
        "NISN",
        "Nama Murid",
        "L/P",
        "Rerata Tugas (30%)",
        "Rerata Tema (30%)",
        "Nilai STS (20%)",
        "Nilai SAS (20%)",
        "Nilai Akhir",
        "Status Akhir"
      ];
    } else if (type === "tugas") {
      headerTexts = [
        "No",
        "NISN",
        "Nama Murid",
        "L/P",
        "Tugas 1",
        "Tugas 2",
        "Tugas 3",
        "Tugas 4",
        "Jumlah",
        "Rerata Tugas"
      ];
    } else if (type === "tema") {
      headerTexts = [
        "No",
        "NISN",
        "Nama Murid",
        "L/P",
        "Tema 1",
        "Tema 2",
        "Tema 3",
        "Jumlah",
        "Rerata Tema"
      ];
    } else if (type === "sts") {
      headerTexts = [
        "No",
        "NISN",
        "Nama Murid",
        "L/P",
        "Nilai Murni STS",
        "Kriteria Ketuntasan (KKTP)",
        "Status Pencapaian Siswa"
      ];
    } else if (type === "sas") {
      headerTexts = [
        "No",
        "NISN",
        "Nama Murid",
        "L/P",
        "Nilai Murni SAS",
        "Kriteria Ketuntasan (KKTP)",
        "Status Pencapaian"
      ];
    }

    const drawTableRow = (
      doc: any,
      y: number,
      texts: string[],
      isHeader: boolean = false,
      rowColors: { [key: number]: [number, number, number] } = {}
    ) => {
      const rowHeight = isHeader ? 9 : 7.5;
      const textOffset = isHeader ? 6 : 5;
      
      // Draw background if header
      if (isHeader) {
        doc.setFillColor(240, 243, 246);
        doc.rect(colBoundaries[0], y, colBoundaries[colBoundaries.length - 1] - colBoundaries[0], rowHeight, "F");
      }

      // Draw custom cell background colors if specified
      Object.keys(rowColors).forEach(colIndexStr => {
        const colIdx = parseInt(colIndexStr, 10);
        if (colIdx >= 0 && colIdx < colBoundaries.length - 1) {
          const color = rowColors[colIdx];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(colBoundaries[colIdx], y, colBoundaries[colIdx + 1] - colBoundaries[colIdx], rowHeight, "F");
        }
      });

      // Draw horizontal borders
      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(isHeader ? 0.45 : 0.25);
      doc.line(colBoundaries[0], y, colBoundaries[colBoundaries.length - 1], y); // top line
      doc.line(colBoundaries[0], y + rowHeight, colBoundaries[colBoundaries.length - 1], y + rowHeight); // bottom line

      // Draw text and vertical lines
      doc.setFont("Helvetica", isHeader ? "bold" : "normal");
      doc.setFontSize(8);

      for (let i = 0; i < colBoundaries.length - 1; i++) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.25);
        doc.line(colBoundaries[i], y, colBoundaries[i], y + rowHeight);
        
        const txt = texts[i] || "";
        const xStart = colBoundaries[i];
        const xEnd = colBoundaries[i+1];
        const cellWidth = xEnd - xStart;

        if (i === 2) {
          doc.text(txt, xStart + 2.5, y + textOffset);
        } else {
          doc.text(txt, xStart + (cellWidth / 2), y + textOffset, { align: "center" });
        }
      }
      
      doc.setDrawColor(180, 180, 180);
      doc.line(colBoundaries[colBoundaries.length - 1], y, colBoundaries[colBoundaries.length - 1], y + rowHeight);
    };

    let currentY = 75;
    drawTableRow(doc, currentY, headerTexts, true);
    currentY += 9;

    students.forEach((std, index) => {
      const semData = activeSemester === 1 ? std.sem1 : std.sem2;
      const finalGrade = calculateFinalGrade(std, activeSemester);
      
      let rowTexts: string[] = [];
      let rowColors: { [key: number]: [number, number, number] } = {};

      if (type === "global") {
        const tStats = getTugasStats(semData.tugas);
        const mStats = getTemaStats(semData.sumatifTopik);
        const isTuntas = finalGrade >= kktp;
        const statusText = isTuntas ? "TUNTAS" : "REMEDIAL";
        
        rowTexts = [
          String(index + 1),
          std.nisn || "—",
          std.name,
          std.gender,
          String(tStats.avg),
          String(mStats.avg),
          String(semData.sts !== "" ? semData.sts : "—"),
          String(semData.sas !== "" ? semData.sas : "—"),
          String(finalGrade),
          statusText
        ];
        
        if (isTuntas) {
          rowColors[9] = [225, 245, 230];
        } else {
          rowColors[9] = [255, 230, 230];
        }
      } else if (type === "tugas") {
        const tStats = getTugasStats(semData.tugas);
        rowTexts = [
          String(index + 1),
          std.nisn || "—",
          std.name,
          std.gender,
          String(semData.tugas.tugas1 !== "" ? semData.tugas.tugas1 : "—"),
          String(semData.tugas.tugas2 !== "" ? semData.tugas.tugas2 : "—"),
          String(semData.tugas.tugas3 !== "" ? semData.tugas.tugas3 : "—"),
          String(semData.tugas.tugas4 !== "" ? semData.tugas.tugas4 : "—"),
          String(tStats.sum),
          String(tStats.avg)
        ];
      } else if (type === "tema") {
        const mStats = getTemaStats(semData.sumatifTopik);
        rowTexts = [
          String(index + 1),
          std.nisn || "—",
          std.name,
          std.gender,
          String(semData.sumatifTopik.tema1 !== "" ? semData.sumatifTopik.tema1 : "—"),
          String(semData.sumatifTopik.tema2 !== "" ? semData.sumatifTopik.tema2 : "—"),
          String(semData.sumatifTopik.tema3 !== "" ? semData.sumatifTopik.tema3 : "—"),
          String(mStats.sum),
          String(mStats.avg)
        ];
      } else if (type === "sts") {
        const isTuntas = (semData.sts !== "" ? Number(semData.sts) : 0) >= kktp;
        let statusText = "BELUM ADA DATA";
        if (semData.sts !== "") {
          statusText = isTuntas ? "MELAMPAUI TARGET KKTP" : "REMEDIAL / INTERVENSI";
          if (isTuntas) {
            rowColors[6] = [225, 245, 230];
          } else {
            rowColors[6] = [255, 230, 230];
          }
        }
        rowTexts = [
          String(index + 1),
          std.nisn || "—",
          std.name,
          std.gender,
          String(semData.sts !== "" ? semData.sts : "—"),
          String(kktp),
          statusText
        ];
      } else if (type === "sas") {
        const isTuntas = (semData.sas !== "" ? Number(semData.sas) : 0) >= kktp;
        let statusText = "BELUM ADA DATA";
        if (semData.sas !== "") {
          statusText = isTuntas ? "MELAMPAUI TARGET KKTP" : "REMEDIAL / INTERVENSI";
          if (isTuntas) {
            rowColors[6] = [225, 245, 230];
          } else {
            rowColors[6] = [255, 230, 230];
          }
        }
        rowTexts = [
          String(index + 1),
          std.nisn || "—",
          std.name,
          std.gender,
          String(semData.sas !== "" ? semData.sas : "—"),
          String(kktp),
          statusText
        ];
      }

      // Check if we need to add a new page
      if (currentY > 175) {
        doc.addPage("landscape");
        doc.setFont("Helvetica", "oblique");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 110);
        doc.text(`Lanjutan: Daftar Nilai - ${selectedMapel.toUpperCase()} (Semester ${activeSemester}) - Halaman ${doc.getNumberOfPages()}`, 14, 11);
        doc.line(14, 13, 283, 13);

        currentY = 22;
        drawTableRow(doc, currentY, headerTexts, true);
        currentY += 9;
      }

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);

      drawTableRow(doc, currentY, rowTexts, false, rowColors);
      currentY += 7.5;
    });

    currentY += 4;

    // --- Dynamic TP descriptions (Sourced from Perencana Ajar - JANGAN KARANG BEBAS) ---
    if (type === "tugas") {
      if (currentY > 165) { doc.addPage("landscape"); currentY = 22; }
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 269, 29, "F");
      doc.setDrawColor(200, 210, 220);
      doc.setLineWidth(0.35);
      doc.rect(14, currentY, 269, 29, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("RUMUSAN TUJUAN PEMBELAJARAN (TP) RESMI PADA MENU PERENCANA AJAR:", 18, currentY + 6);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Tugas 1 (TP 1): ${tpHeaders.tugas1}`, 18, currentY + 11.5);
      doc.text(`Tugas 2 (TP 2): ${tpHeaders.tugas2}`, 18, currentY + 15.5);
      doc.text(`Tugas 3 (TP 3): ${tpHeaders.tugas3}`, 18, currentY + 19.5);
      doc.text(`Tugas 4 (TP 4): ${tpHeaders.tugas4}`, 18, currentY + 23.5);
      currentY += 34;
    } else if (type === "tema") {
      if (currentY > 165) { doc.addPage("landscape"); currentY = 22; }
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 269, 24, "F");
      doc.setDrawColor(200, 210, 220);
      doc.setLineWidth(0.35);
      doc.rect(14, currentY, 269, 24, "S");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text("NAMA ELEMEN MATA PELAJARAN YANG DINILAI RELEVAN DENGAN JENJANG & FASE:", 18, currentY + 6);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Tema 1 (Elemen 1): ${tpHeaders.tema1}`, 18, currentY + 11.5);
      doc.text(`Tema 2 (Elemen 2): ${tpHeaders.tema2}`, 18, currentY + 15.5);
      doc.text(`Tema 3 (Elemen 3): ${tpHeaders.tema3}`, 18, currentY + 19.5);
      currentY += 29;
    }

    // Add Stats box
    const totalStats = getStats();
    if (currentY > 175) { doc.addPage("landscape"); currentY = 22; }
    
    doc.setFillColor(242, 245, 248);
    doc.rect(14, currentY, 269, 10, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`Rerata Kelas: ${totalStats.avg}    |    Nilai Tertinggi: ${totalStats.max}    |    Nilai Terendah: ${totalStats.min}    |    Persentase Ketuntasan Siswa: ${totalStats.tuntasPercent}% (${totalStats.tuntasCount} Siswa Tuntas)`, 18, currentY + 6.5);
    doc.setTextColor(0, 0, 0);

    currentY += 16;
    if (currentY > 175) {
      doc.addPage("landscape");
      currentY = 22;
    }
    
    // Signatures
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`${tempatPenyusunan}, ${tanggalPenyusunan}`, 210, currentY);
    currentY += 5;
    doc.text("Mengetahui,", 14, currentY);
    doc.text("Guru Kelas,", 210, currentY);
    currentY += 5;
    doc.text("Kepala Sekolah,", 14, currentY);
    currentY += 16;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text(kepalaSekolah, 14, currentY);
    doc.text(namaGuru, 210, currentY);
    currentY += 4.5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`NIP. ${nipKepala}`, 14, currentY);
    doc.text(`NIP. —`, 210, currentY);

    const docName = type === "global" ? "Daftar_Nilai_Global" : `Daftar_Nilai_${type}`;
    doc.save(`${docName}_${selectedMapel.replace(/\s+/g, "_")}_Semester_${activeSemester}_${kelas.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownloadPDF = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadCSV = () => {
    let csvContent = `DAFTAR NILAI RESMI - ${selectedMapel.toUpperCase()} (SEMESTER ${activeSemester})\n`;
    csvContent += `Sekolah: ${namaSekolah}, Kelas: ${kelas}, Tahun Ajaran: ${tahunAjaran}, Target KKTP: ${kktp}\n`;
    csvContent += `Direkam secara otomatis berdasarkan kurikulum merdeka pada Perencana Ajar\n\n`;
    
    csvContent += `No,NISN,Nama Siswa,L/P,Tugas 1 (TP: ${tpHeaders.tugas1.replace(/,/g, " ")}),Tugas 2 (TP: ${tpHeaders.tugas2.replace(/,/g, " ")}),Tugas 3 (TP: ${tpHeaders.tugas3.replace(/,/g, " ")}),Tugas 4 (TP: ${tpHeaders.tugas4.replace(/,/g, " ")}),Rata-Rata Tugas,Tema 1 (${tpHeaders.tema1.replace(/,/g, " ")}),Tema 2 (${tpHeaders.tema2.replace(/,/g, " ")}),Tema 3 (${tpHeaders.tema3.replace(/,/g, " ")}),Rata-Rata Tema,STS,SAS,Nilai Akhir,Keterangan\n`;
    
    students.forEach((std, index) => {
      const semData = activeSemester === 1 ? std.sem1 : std.sem2;
      const finalGrade = calculateFinalGrade(std, activeSemester);
      const isTuntas = finalGrade >= kktp;
      
      const tStats = getTugasStats(semData.tugas);
      const mStats = getTemaStats(semData.sumatifTopik);
      
      csvContent += `${index + 1},${std.nisn || ""},${std.name},${std.gender},${semData.tugas.tugas1 !== undefined ? semData.tugas.tugas1 : ""},${semData.tugas.tugas2 !== undefined ? semData.tugas.tugas2 : ""},${semData.tugas.tugas3 !== undefined ? semData.tugas.tugas3 : ""},${semData.tugas.tugas4 !== undefined ? semData.tugas.tugas4 : ""},${tStats.avg},${semData.sumatifTopik.tema1 !== undefined ? semData.sumatifTopik.tema1 : ""},${semData.sumatifTopik.tema2 !== undefined ? semData.sumatifTopik.tema2 : ""},${semData.sumatifTopik.tema3 !== undefined ? semData.sumatifTopik.tema3 : ""},${mStats.avg},${semData.sts !== undefined ? semData.sts : ""},${semData.sas !== undefined ? semData.sas : ""},${finalGrade},${isTuntas ? "TUNTAS" : "REMEDIAL"}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Daftar_Nilai_Seimbang_${selectedMapel.replace(/\s+/g, "_")}_Semester_${activeSemester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = getStats();
  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const gradeA = calculateFinalGrade(a, activeSemester);
      const gradeB = calculateFinalGrade(b, activeSemester);
      return gradeB - gradeA;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-1 animate-fade-in relative">
      {loading && (
        <CinematicLoading 
          title="Asisten Daftar Nilai" 
          subtitle={loadingStatus}
        />
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0c10] via-black to-[#050508] shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9.5px] font-mono tracking-widest font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-glow-emerald mb-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500/20" /> AKADEMIS SUITE
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
              Daftar Nilai <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Siswa Komprehensif</span>
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed font-sans">
              Rekapitulasi terstruktur untuk nilai tugas (berdasarkan TP), nilai sumatif topik/tema, nilai sumatif tengah semester (STS), dan sumatif akhir semester (SAS) terbagi dalam Semester 1 & Semester 2.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleManualSave}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" /> SIMPAN DATA NILAI
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> RESET NILAI...
            </button>
            <button
              onClick={handleRequestAiEvaluation}
              disabled={students.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-450" /> ANALISIS KELAS AI
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={students.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" /> UNDUH PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={students.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" /> EKSPOR EXCEL/CSV
            </button>
          </div>
        </div>
      </div>

      {/* TOP CONFIGURATION AREA (FULL WIDTH SELECTORS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Semester Selector Card */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans space-y-3 shadow-md text-left">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="text-[10px] font-extrabold text-emerald-500 tracking-wider font-mono">PILIH SEMESTER</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">AKTIF: SEM. {activeSemester}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveSemester(1)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeSemester === 1 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                : "bg-black border-zinc-900 text-zinc-450 hover:bg-zinc-900/30 hover:text-zinc-200"
              }`}
            >
              🎓 SEMESTER 1
            </button>
            <button
              onClick={() => setActiveSemester(2)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeSemester === 2 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                : "bg-black border-zinc-900 text-zinc-450 hover:bg-zinc-900/30 hover:text-zinc-200"
              }`}
            >
              🏫 SEMESTER 2
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal font-sans">
            Mempengaruhi pemetaan nilai Tugas, Sumatif, STS, dan SAS yang tersimpan pada database semester bersangkutan.
          </p>
        </div>

        {/* Mata Pelajaran Selector Card */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans space-y-3 shadow-md text-left">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="text-[10px] font-extrabold text-emerald-500 tracking-wider font-mono uppercase">DAFTAR MATA PELAJARAN</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold uppercase">{selectedMapel}</span>
          </div>
          
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {mapelList.map((m) => (
              <button
                key={m.id}
                onClick={() => changeMapel(m.id)}
                className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                  selectedMapel === m.id 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                  : "bg-black border-zinc-900 text-zinc-450 hover:bg-zinc-900/30 hover:text-zinc-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{m.icon}</span>
                  <span>{m.name}</span>
                </span>
                {selectedMapel === m.id && (
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Config Pembobotan Nilai & Kriteria Ketuntasan */}
        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans space-y-3.5 shadow-md text-left">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <span className="text-[10px] font-extrabold text-[#f5a623] tracking-widest font-mono uppercase">BOBOT NILAI & Target KKTP</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">KKTP: {kktp}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div>
              <SmartTooltip type="kktp-target">
                <label className="text-[9px] font-bold text-zinc-500 block mb-0.5 uppercase mb-1">Target KKTP</label>
              </SmartTooltip>
              <input 
                type="text"
                inputMode="numeric"
                pattern="[0-9]*" 
                value={localKktpText} 
                onChange={(e) => handleKktpTextChange(e.target.value)}
                className="w-full px-2 py-1 text-xs text-white bg-black border border-zinc-900 rounded-lg focus:border-emerald-500 focus:outline-none font-mono font-bold"
              />
            </div>
            <div>
              <SmartTooltip type="kktp-weight-tugas">
                <label className="text-[9px] font-bold text-zinc-500 block mb-0.5 uppercase mb-1">Bobot Tugas (%)</label>
              </SmartTooltip>
              <input 
                type="number" value={weightTugas} onChange={(e) => setWeightTugas(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs text-white bg-black border border-zinc-900 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <SmartTooltip type="kktp-weight-sumatif">
                <label className="text-[9px] font-bold text-zinc-500 block mb-0.5 uppercase mb-1">Bobot Sumatif (%)</label>
              </SmartTooltip>
              <input 
                type="number" value={weightSumatif} onChange={(e) => setWeightSumatif(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-xs text-white bg-black border border-zinc-900 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-1 text-left">
                <div>
                  <SmartTooltip type="kktp-weight-sts-sas">
                    <label className="text-[9px] font-bold text-zinc-500 block mb-0.5 uppercase mb-1">STS</label>
                  </SmartTooltip>
                  <input 
                    type="number" value={weightSts} onChange={(e) => setWeightSts(parseInt(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs text-white bg-black border border-zinc-900 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <SmartTooltip type="kktp-weight-sts-sas">
                    <label className="text-[9px] font-bold text-zinc-500 block mb-0.5 uppercase mb-1">SAS</label>
                  </SmartTooltip>
                  <input 
                    type="number" value={weightSas} onChange={(e) => setWeightSas(parseInt(e.target.value) || 0)}
                    className="w-full px-1 py-1 text-xs text-white bg-black border border-zinc-900 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-zinc-900 flex justify-between font-mono font-bold text-[9.5px] text-zinc-400">
            <span>TOTAL BOBOT:</span>
            <span className={`${(weightTugas + weightSumatif + weightSts + weightSas) === 100 ? 'text-emerald-400' : 'text-amber-500'}`}>
              {weightTugas + weightSumatif + weightSts + weightSas}%
            </span>
          </div>
        </div>

      </div>

      {/* METRICS & TABLE SECTION (FULL WIDTH) */}
      <div className="space-y-4">
          
          {/* Mini Dashboard Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans text-left">
              <span className="text-[8.5px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono block">Rata-Rata Kelas</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">{stats.avg}</span>
              <span className="text-[9px] text-[#55ea90] font-mono mt-0.5 block">⚡ Rerata Komprehensif</span>
            </div>

            <div className="p-3 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans text-left">
              <span className="text-[8.5px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono block">Nilai Tertinggi</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">{stats.max}</span>
              <span className="text-[9px] text-emerald-400 font-mono mt-0.5 block">🏆 Prestasi Puncak</span>
            </div>

            <div className="p-3 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans text-left">
              <span className="text-[8.5px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono block">Nilai Terendah</span>
              <span className="text-xl font-black text-white font-mono mt-0.5 block">{stats.min}</span>
              <span className="text-[9px] text-amber-500 font-mono mt-0.5 block">⚠️ Perlu Stimulus</span>
            </div>

            <div className="p-3 rounded-xl border border-zinc-900 bg-[#060608]/90 font-sans text-left">
              <span className="text-[8.5px] font-extrabold text-zinc-500 uppercase tracking-widest font-mono block">Persen Ketuntasan</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">{stats.tuntasPercent}%</span>
              <span className="text-[9px] text-emerald-500/80 font-mono mt-0.5 block">✔ {stats.tuntasCount} Siswa &ge; KKTP</span>
            </div>
          </div>

          {/* SPREADSHEET TABLE CARD */}
          <div className="p-5 rounded-2xl border-2 border-zinc-800 hover:border-zinc-700 bg-[#060608] space-y-4 shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-2.5">
              <div className="flex items-center gap-2 text-left">
                <Users className="w-4 h-4 text-emerald-500" />
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5a623] font-mono">
                    TABEL INPUT NILAI {selectedMapel.toUpperCase()} - SEMESTER {activeSemester}
                  </h3>
                  <span className="text-[9.5px] text-zinc-500 block leading-tight font-sans">
                    Ubah nilai langsung secara interaktif pada sel tabel di bawah ini.
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input 
                  type="text"
                  placeholder="Cari Murid..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-zinc-900 bg-black text-white placeholder-zinc-650 tracking-wider max-w-[130px]"
                />
                <button 
                  onClick={() => {
                    setDeleteConfirmMessage(`Apakah Anda yakin ingin mengisi/me-reset daftar nilai ${selectedMapel} dengan data nilai contoh yang terisi lengkap?`);
                    setDeleteConfirmCallback(() => () => {
                      setStudents(getMapelDefaultStudents(selectedMapel));
                    });
                    setDeleteConfirmId("RESET_MAPEL");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-all flex items-center gap-1 cursor-pointer"
                  title="Isi otomatis kolom nilai dengan data contoh bergradasi realistis"
                >
                  <Sparkles className="w-3 h-3" /> Nilai Contoh
                </button>
                <button 
                  onClick={() => {
                    setEditingStudentId(null);
                    setFormName("");
                    setFormGender("L");
                    setShowAddStudentModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3" /> Tambah Siswa
                </button>
              </div>
            </div>

            {/* RESPONSIVE TABLE CONTAINER */}
            <div className="overflow-x-auto border border-zinc-900 rounded-xl">
              <table className="w-full text-left border-collapse table-auto text-xs min-w-[850px] font-sans">
                <thead>
                  <tr className="bg-black/80 text-zinc-400 font-mono text-[10px] border-b border-zinc-900 select-none">
                    <th className="p-2.5 text-center w-8">No</th>
                    <th className="p-2.5 text-left w-24">NISN</th>
                    <th className="p-2.5">Nama Murid</th>
                    <th className="p-2.5 text-center w-12">L/P</th>
                    <th className="p-2.5 text-center bg-zinc-950/40" title={tpHeaders.tugas1}>
                      Tugas 1 (TP1.1)
                    </th>
                    <th className="p-2.5 text-center bg-zinc-950/40" title={tpHeaders.tugas2}>
                      Tugas 2 (TP1.2)
                    </th>
                    <th className="p-2.5 text-center bg-zinc-950/40" title={tpHeaders.tugas3}>
                      Tugas 3 (TP1.3)
                    </th>
                    <th className="p-2.5 text-center bg-zinc-950/40" title={tpHeaders.tugas4}>
                      Tugas 4 (TP1.4)
                    </th>
                    <th className="p-2.5 text-center bg-amber-950/20" title={tpHeaders.tema1}>Tema 1</th>
                    <th className="p-2.5 text-center bg-amber-950/20" title={tpHeaders.tema2}>Tema 2</th>
                    <th className="p-2.5 text-center bg-amber-950/20" title={tpHeaders.tema3}>Tema 3</th>
                    <th className="p-2.5 text-center bg-indigo-950/15">STS</th>
                    <th className="p-2.5 text-center bg-rose-950/15">SAS</th>
                    <th className="p-2.5 text-center text-emerald-400 bg-emerald-950/10 font-bold">NILAI AKHIR</th>
                    <th className="p-2.5 text-center w-12">Deteksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredStudents.map((std, idx) => {
                    const semData = activeSemester === 1 ? std.sem1 : std.sem2;
                    const finalGrade = calculateFinalGrade(std, activeSemester);
                    const isTuntas = finalGrade >= kktp;

                    return (
                      <tr key={std.id} className="hover:bg-zinc-950/40 transition">
                        <td className="p-2 text-center text-zinc-550 font-mono">{idx + 1}</td>
                        <td className="p-2 text-zinc-400 font-mono select-all text-left">{std.nisn || "—"}</td>
                        <td className="p-2 font-semibold text-white truncate max-w-[180px] text-left flex items-center gap-1.5" title={std.name}>
                          <span className="inline-flex shrink-0 w-5 h-5 rounded-full items-center justify-center font-mono text-[9px] font-black bg-black border border-yellow-400/50 text-yellow-400 shrink-0 select-none">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{std.name}</span>
                        </td>
                        <td className="p-2 text-center text-zinc-400 font-mono">{std.gender}</td>
                        
                        {/* Tugas Inputs */}
                        {["tugas1", "tugas2", "tugas3", "tugas4"].map((key) => (
                          <td key={key} className="p-1 bg-zinc-950/20">
                            <input 
                              type="text"
                              inputMode="numeric"
                              value={semData.tugas[key] ?? ""}
                              onChange={(e) => handleCellChange(std.id, activeSemester, "tugas", key, e.target.value)}
                              className="w-14 px-1 py-1 font-mono text-center text-xs bg-black text-white border border-zinc-900 rounded focus:border-emerald-500 focus:outline-none font-bold placeholder:text-zinc-700"
                              placeholder="0"
                            />
                          </td>
                        ))}

                        {/* Tema Inputs */}
                        {["tema1", "tema2", "tema3"].map((key) => (
                          <td key={key} className="p-1 bg-amber-500/5">
                            <input 
                              type="text"
                              inputMode="numeric"
                              value={semData.sumatifTopik[key] ?? ""}
                              onChange={(e) => handleCellChange(std.id, activeSemester, "sumatifTopik", key, e.target.value)}
                              className="w-14 px-1 py-1 font-mono text-center text-xs bg-black text-white border border-zinc-800 rounded focus:border-[#f5a623] focus:outline-none font-bold placeholder:text-zinc-700"
                              placeholder="0"
                            />
                          </td>
                        ))}

                        {/* STS */}
                        <td className="p-1 bg-indigo-950/10">
                          <input 
                            type="text"
                            inputMode="numeric"
                            value={semData.sts ?? ""}
                            onChange={(e) => handleCellChange(std.id, activeSemester, "sts", "", e.target.value)}
                            className="w-14 px-1 py-1 font-mono text-center text-xs bg-black text-white border border-indigo-900/40 rounded focus:border-indigo-400 focus:outline-none font-bold placeholder:text-zinc-700"
                            placeholder="0"
                          />
                        </td>

                        {/* SAS */}
                        <td className="p-1 bg-rose-950/10">
                          <input 
                            type="text"
                            inputMode="numeric"
                            value={semData.sas ?? ""}
                            onChange={(e) => handleCellChange(std.id, activeSemester, "sas", "", e.target.value)}
                            className="w-14 px-1 py-1 font-mono text-center text-xs bg-black text-white border border-rose-900/40 rounded focus:border-rose-400 focus:outline-none font-bold placeholder:text-zinc-700"
                            placeholder="0"
                          />
                        </td>

                        {/* Nilai Akhir Display */}
                        <td className={`p-2 font-black font-mono text-center text-xs ${isTuntas ? "text-emerald-400" : "text-amber-500"}`}>
                          {finalGrade}
                        </td>

                        {/* Operations cells */}
                        <td className="p-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => handleEditStudent(std)}
                              className="p-1 text-zinc-500 hover:text-white transition"
                              title="Sunting Nama Siswa"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(std.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition"
                              title="Hapus Murid"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={13} className="text-center py-6 text-zinc-650 tracking-wider uppercase font-mono text-[10px]">
                        Tidak ada data siswa yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      {/* Add/Edit modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-800 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-5 font-sans space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" /> {editingStudentId ? "SUNTING SISWA" : "TAMBAH SISWA BARU"}
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-left">Nama Lengkap Murid</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Siti Julaikah"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-left">NISN (Kosongkan jika belum ada)</label>
                <input 
                  type="text"
                  placeholder="Contoh: 3155685577"
                  value={formNisn}
                  onChange={(e) => setFormNisn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider text-left">Jenis Kelamin</label>
                <select 
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as "L" | "P")}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex justify-end gap-2 text-xs font-semibold">
                <button 
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-950 text-zinc-400 border border-zinc-900 hover:text-white transition cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-450 transition font-bold"
                >
                  {editingStudentId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Nilai Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-800 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <Trash2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">PILIH METODE RESET DATA NILAI</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Tindakan ini akan mempengaruhi data seketika untuk mata pelajaran <strong className="text-yellow-400">{selectedMapel}</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleWipeGrades}
                className="w-full py-3 px-4 rounded-xl border border-rose-500/30 hover:border-rose-500 bg-rose-950/20 hover:bg-rose-950/50 text-rose-300 hover:text-white transition text-xs font-extrabold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                🧹 Kosongkan Semua Nilai (Mulai Lembar Baru)
              </button>
              <button
                type="button"
                onClick={handleRestoreDefaultGrades}
                className="w-full py-3 px-4 rounded-xl border border-amber-500/30 hover:border-amber-500 bg-amber-950/20 hover:bg-amber-950/50 text-amber-300 hover:text-white transition text-xs font-extrabold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                🔄 Kembalikan Nilai Bawaan (Simulasi 63 - 93)
              </button>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition text-xs font-bold uppercase cursor-pointer"
              >
                Batal
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
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Konfirmasi Tindakan</h4>
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
                Setuju
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Choose Report Download Format Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-850 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wider uppercase">MODUL CETAK LAPORAN NILAI</span>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">PILIH FORMAT CETAK DOKUMEN PDF</h3>
              </div>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="text-zinc-500 hover:text-white transition text-xs font-sans p-1.5 rounded-lg border border-zinc-900 hover:bg-zinc-950 cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal">
              Silakan pilih cakupan analisis dokumen yang ingin Anda unduh secara resmi. Seluruh dokumen akan dilengkapi dengan <strong>Kop Surat Dinas Pendidikan</strong>, logo pemerintah daerah, kriteria ketuntasan (KKTP), dan kolom tanda tangan yang sah pengesahan kepala sekolah.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1.5">
              {/* Option 1: Global */}
              <button
                onClick={() => {
                  triggerDownloadPDF("global");
                  setShowDownloadModal(false);
                }}
                className="col-span-2 p-3 rounded-xl border border-zinc-850 hover:border-emerald-500/50 bg-black hover:bg-emerald-950/10 transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                  🌐
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-all block mb-0.5">1. Laporan Lengkap Rekapitulasi Global (Semua Nilai)</span>
                  <span className="text-[10px] text-zinc-400 block font-normal leading-relaxed">
                    Mencakup ringkasan akumulatif: Rerata Tugas, Rerata Nilai Tema, Nilai Murni STS dan SAS, Bobot Kalkulasi, Nilai Akhir, dan Status Ketuntasan Murid.
                  </span>
                </div>
              </button>

              {/* Option 2: Tugas Only */}
              <button
                onClick={() => {
                  triggerDownloadPDF("tugas");
                  setShowDownloadModal(false);
                }}
                className="col-span-1 p-2.5 rounded-xl border border-zinc-850 hover:border-sky-500/50 bg-black hover:bg-sky-950/10 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-450 flex items-center justify-center font-bold text-xs shrink-0">
                  📁
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-all block mb-0.5">2. Laporan Nilai Tugas</span>
                  <span className="text-[10px] text-zinc-400 block font-normal leading-relaxed">
                    Menampilkan nilai Tugas 1 - Tugas 4 serta rata-ratanya yang dihitung adil dengan deskripsi Tujuan Pembelajaran (TP).
                  </span>
                </div>
              </button>

              {/* Option 3: Tema Only */}
              <button
                onClick={() => {
                  triggerDownloadPDF("tema");
                  setShowDownloadModal(false);
                }}
                className="col-span-1 p-2.5 rounded-xl border border-zinc-850 hover:border-amber-500/50 bg-black hover:bg-amber-950/10 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                  🎯
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-500 transition-all block mb-0.5">3. Laporan Nilai Tema</span>
                  <span className="text-[10px] text-zinc-400 block font-normal leading-relaxed">
                    Menampilkan rekor Sumatif Tema 1 - Tema 3, jumlah & rata-rata materi, dilengkapi nama Elemen Kurikulum Merdeka.
                  </span>
                </div>
              </button>

              {/* Option 4: STS Only */}
              <button
                onClick={() => {
                  triggerDownloadPDF("sts");
                  setShowDownloadModal(false);
                }}
                className="col-span-1 p-2.5 rounded-xl border border-zinc-850 hover:border-purple-500/50 bg-black hover:bg-purple-950/10 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                  📊
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-400 transition-all block mb-0.5">4. Rekapitulasi STS</span>
                  <span className="text-[10px] text-zinc-400 block font-normal leading-relaxed">
                    Merangkum nilai murni STS pertengahan semester, Kriteria Ketuntasan (KKTP), dan status capaian individu.
                  </span>
                </div>
              </button>

              {/* Option 5: SAS Only */}
              <button
                onClick={() => {
                  triggerDownloadPDF("sas");
                  setShowDownloadModal(false);
                }}
                className="col-span-1 p-2.5 rounded-xl border border-zinc-850 hover:border-rose-500/50 bg-black hover:bg-rose-950/10 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center justify-center font-bold text-xs shrink-0">
                  🏆
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-rose-450 transition-all block mb-0.5">5. Rekapitulasi SAS</span>
                  <span className="text-[10px] text-zinc-400 block font-normal leading-relaxed">
                    Mendaftarkan nilai murni SAS akhir periode, target KKTP kelas, serta status pencapaian dan rekomendasi.
                  </span>
                </div>
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex justify-end gap-2 text-xs font-semibold">
              <button 
                type="button" 
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-950 text-zinc-400 border border-zinc-900 hover:text-white transition cursor-pointer"
              >
                Batal
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
}
