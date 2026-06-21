import React, { useState, useEffect } from "react";
import { 
  Users, Sparkles, Download, Copy, Check, Plus, Trash2, Edit2, 
  TrendingUp, BookOpen, GraduationCap, Percent, CheckCircle, 
  FileText, Database, AlertCircle, RefreshCw, Layers, Save
} from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, PieChart, Pie, CartesianGrid
} from "recharts";

interface Student {
  id: string;
  name: string;
  gender: "L" | "P";
  litReading: number; // Level 1-5
  litWriting: number; // Level 1-5
  numCounting: number; // Level 1-5
  numAnalysis: number; // Level 1-5
}

export const LITERASI_MEMBACA_LEVELS = [
  { level: 1, label: "Membaca Huruf", desc: "Mampu mengenali dan mengeja huruf abjad dasar" },
  { level: 2, label: "Membaca Suku Kata", desc: "Mampu merangkai huruf dan membaca suku kata dengan lancar" },
  { level: 3, label: "Membaca Kata", desc: "Mampu mengeja dan membaca kata tunggal secara utuh" },
  { level: 4, label: "Membaca Lancar", desc: "Mampu membaca kalimat utuh dan paragraf secara lancar" },
  { level: 5, label: "Membaca Pemahaman", desc: "Lancar membaca serta memahami makna, pesan, dan konteks bacaan" }
];

export const LITERASI_MENULIS_LEVELS = [
  { level: 1, label: "Menulis Huruf", desc: "Mampu meniru atau menyalin huruf dasar" },
  { level: 2, label: "Menulis Suku Kata", desc: "Mampu merangkai huruf menjadi suku kata tertulis" },
  { level: 3, label: "Menulis Kata", desc: "Mampu menulis kata tunggal secara mandiri" },
  { level: 4, label: "Menulis Kalimat Sederhana", desc: "Mampu menyusun kata menjadi kalimat sederhana yang utuh" },
  { level: 5, label: "Menulis Paragraf/Esai", desc: "Menguasai penulisan paragraf deskriptif-argumen secara mandiri" }
];

export const NUMERASI_BILANGAN_LEVELS = [
  { level: 1, label: "Mengenal Angka Satuan", desc: "Mengenal angka 0-9 dan jumlah benda satuan" },
  { level: 2, label: "Membaca Angka Puluhan", desc: "Mengenal dan membaca nilai tempat satuan dan puluhan (10-99)" },
  { level: 3, label: "Membaca Bilangan Utuh", desc: "Memahami bilangan ratusan hingga ribuan serta posisinya di garis bilangan" },
  { level: 4, label: "Kelancaran Operasi Hitung", desc: "Fasih melakukan penjumlahan, pengurangan, perkalian, dan pembagian" },
  { level: 5, label: "Penalaran & Soal Cerita", desc: "Mampu mengurai soal cerita kompleks dan merumuskan penalaran logis matematika" }
];

export const NUMERASI_ANALISIS_LEVELS = [
  { level: 1, label: "Mengenal Bentuk Dasar", desc: "Mengenal bangun datar dasar (lingkaran, segitiga, persegi) secara visual" },
  { level: 2, label: "Membandingkan Ukuran", desc: "Mampu membandingkan dimensi panjang, berat, dan volume secara visual" },
  { level: 3, label: "Mengelompokkan Bangun", desc: "Dapat mengklasifikasikan berbagai bangun datar dan bangun ruang sederhana" },
  { level: 4, label: "Analisis Pola/Spasial", desc: "Mampu menganalisis pola geometri dasar, diagram sederhana, dan orientasi spasial" },
  { level: 5, label: "Pemecahan Masalah Geometri", desc: "Menguasai rumus luas, keliling, volume, analisis data statistika, dan logika ruang" }
];

const mapScoreToLevel = (score: number): number => {
  if (score <= 5) return score; // already Level 1-5
  if (score >= 89) return 5;
  if (score >= 76) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
};

export const detectJenjangAndKelas = (faseKelas: string) => {
  const f = (faseKelas || "").toLowerCase();
  let jenjang = "SD"; // default
  let numericKelas = 4; // default
  
  if (f.includes("smp") || f.includes("kelas vii") || f.includes("kelas viii") || f.includes("kelas ix") || f.includes("kelas 7") || f.includes("kelas 8") || f.includes("kelas 9")) {
    jenjang = "SMP";
    numericKelas = 7;
    if (f.includes("8") || f.includes("viii")) numericKelas = 8;
    if (f.includes("9") || f.includes("ix")) numericKelas = 9;
  } else if (f.includes("sma") || f.includes("smk") || f.includes("kelas x") || f.includes("kelas xi") || f.includes("kelas xii") || f.includes("kelas 10") || f.includes("kelas 11") || f.includes("kelas 12")) {
    jenjang = "SMA";
    numericKelas = 10;
    if (f.includes("11") || f.includes("xi")) numericKelas = 11;
    if (f.includes("12") || f.includes("xii")) numericKelas = 12;
  } else {
    // SD
    jenjang = "SD";
    if (f.includes("kelas i") || f.includes("kelas 1")) numericKelas = 1;
    else if (f.includes("kelas ii") || f.includes("kelas 2")) numericKelas = 2;
    else if (f.includes("kelas iii") || f.includes("kelas 3")) numericKelas = 3;
    else if (f.includes("kelas iv") || f.includes("kelas 4")) numericKelas = 4;
    else if (f.includes("kelas v") || f.includes("kelas 5")) numericKelas = 5;
    else if (f.includes("kelas vi") || f.includes("kelas 6")) numericKelas = 6;
  }
  return { jenjang, numericKelas };
};

export interface RecommendationContent {
  level12: {
    literasi: string[];
    numerasi: string[];
  };
  level345: {
    literasi: string[];
    numerasi: string[];
  };
}

export const getDynamicRecommendations = (jenjang: string, numericKelas: number): RecommendationContent => {
  if (jenjang === "SMP") {
    return {
      level12: {
        literasi: [
          "Membaca Terbimbing SMP: Berikan teks remaja pendek (cerita inspiratif luring atau fakta unik daerah) dengan menyertakan glosarium kata kunci di lembar luring.",
          "Scaffolding Pemahaman Mandiri: Minta siswa membaca bergantian paragraf demi paragraf kecil lalu secara lisan menceritakan ulang isinya guna memantik logika baca.",
          "Asesmen Pronunsiasi Luring: Latih remaja melisankan frasa secara berkala demi mendeteksi struktur kata gabung yang rancu."
        ],
        numerasi: [
          "Garis Bilangan Lantai Kelas: Buatlah garis bilangan bulat positif, negatif, dan desimal di lantai kelas menggunakan selotip warna agar murid bermain peran melompat ke nilai.",
          "Manipulatif Kartu Aljabar Luring: Gunakan koin dua warna (merah positif, kuning negatif) untuk melatih konsep bilangan bulat.",
          "Kontekstual Belanja Remaja: Simulasikan transaksi luring di bioskop/kafe tiruan lengkap dengan penerapan diskon ganda guna memperlancar kalkulasi pembagian dasar."
        ]
      },
      level345: {
        literasi: [
          "Analisis Opini Berita: Mintalah siswa membaca artikel opini koran daerah dan membuat ringkasan logis pembeda antara gagasan penulis vs fakta objektif.",
          "Resensi Jurnal Singkat: Berikan buku rujukan sains luring di perpustakaan sekolah untuk diulas secara kritis terstruktur menggunakan tata bahasa baku.",
          "Forum Debat Terbimbing: Gelar diskusi luring pro-kontra mengangkat isus sosial di kalangan remaja bermodalkan landasan data riset tepercaya."
        ],
        numerasi: [
          "Proyeksi Model Matematika: Ajarkan pembuatan tabel rasio volume sampah harian sekolah luring dan hitung kebutuhan tong sampah ideal secara mandiri.",
          "Analisis Diagram Gizi: Kumpulkan bekas kemasan jajanan kesukaan kantin sekolah dan minta siswa memetakan diagram statistika kadar gula.",
          "Eksplorasi Geometri Maket: Tugaskan pembuatan model maket mini ruang kelas menggunakan kardus dengan skala penggaris rasio panjang-lebar sebenarnya."
        ]
      }
    };
  }
  
  if (jenjang === "SMA" || jenjang === "SMK") {
    return {
      level12: {
        literasi: [
          "Mind Mapping Alur Bacaan: Latih siswa memetakan ide pokok dari artikel populer koran dalam bentuk skema Mind Map berwarna luring guna mempertajam struktur pikir.",
          "Metode Scanning & Skimming: Berikan lembar riset umum luring bertema peluang kerja dan biasakan mendeteksi poin penting dalam 3 menit pertama.",
          "Tanya Jawab Interpretif Kelas: Lakukan dialog personal luring tanya-jawab makna konotatif dari teks deskripsi pendek yang dibaca berulang."
        ],
        numerasi: [
          "Geometri 3D Berbantuan Lilin: Sediakan plastisin atau lidi luring untuk membangun kerangka bangun ruang dimensi tiga agar imajinasi spasial terstimulasi.",
          "Kalkulasi Cicilan Sederhana: Simulasikan deret aritmatika/geometri dalam hitungan luring rencana pelunasan ponsel menggunakan koin tiruan.",
          "Interpretasi Infografis Publik: Latih siswa mendeteksi kecenderungan tren angka diagram statistik pemilu/inflasi dari buletin berita luring secara makro."
        ]
      },
      level345: {
        literasi: [
          "Uji Keberpihakan Media: Bandingkan dua berita dari kantor pers bertolak belakang luring untuk melatih mendeteksi bias informasi, propaganda, dan kredibilitas data.",
          "Proposal Studi Kasus Sosial: Tugaskan penulisan esai riset mandiri tentang kearifan lokal daerah Fatubai/Oehalo berpedoman pada kaidah gagasan logis.",
          "Seminar Karya Tulis Siswa: Adakan forum luring di mana siswa mempresentasikan paper solutif mereka secara argumentatif di hadapan guru."
        ],
        numerasi: [
          "Penelitian Polling Statistika: Mintalah murid menyebar angket luring mengenai pola belajar luring angkatan, mengolah simpangan baku, dan rata-rata kelas.",
          "Optimasi Koperasi Siswa: Selesaikan soal matematika program linier untuk memperkirakan keuntungan penjualan barang dengan pembatas modal luring nyata.",
          "Pemecahan Algoritma Logika: Sediakan kuis teka-teki logika pemrograman dasar dan pola deret spasial untuk memperkuat kemampuan problem-solving adaptif."
        ]
      }
    };
  }

  // default: SD (Sekolah Dasar)
  if (numericKelas <= 2) {
    return {
      level12: {
        literasi: [
          "Kartu Suku Kata (Word Wall): Mainkan susun karton kata warna-warni secara luring kelompok kecil untuk membiasakan merangkai abjad menjadi frasa tunggal.",
          "Lagu Bunyi Huruf (Phonetic Songs): Nyanyikan lagu spelling abjad sembari meraba huruf bintik timbul (tactile card) untuk melatih sensorik mengeja.",
          "Membaca Bersama Big Book: Guru mendampingi membacakan buku fiksi bergambar besar (Big Book) dengan intonasi menarik secara berulang luring."
        ],
        numerasi: [
          "Benda Konkret Sekitar Kelas: Gunakan lidi, biji saga, kerikil kelereng luring di halaman kelas untuk latihan menghitung jumlah satuan riil (0 s.d. 20).",
          "Permainan Engklek Angka: Gambar kotak-kotak nomor di semen kelas luring agar murid aktif melompat sambil membunyikan urutan angka puluhan.",
          "Mencocokkan Gambar & Lambang: Pasangkan kartu jumlah buah mangga dengan lambang bilangan tertulis di kartu pasangan secara ceria."
        ]
      },
      level345: {
        literasi: [
          "Menceritakan Gambar Komik: Berikan buku dongeng gambar luring, minta anak menceritakan kembali rangkaian peristiwa lucu di depan teman sekelas.",
          "Susun Kalimat Mandiri: Berikan 3 kata luring acak (misal: 'sekolah', 'buku', 'baca') lalu bimbing menulis kalimat sederhana yang benar.",
          "Peer Tutoring Flashcard: Pasangkan murid level tinggi dengan murid level rendah untuk mendikte flashcard gambar teka-teki kata secara gembira."
        ],
        numerasi: [
          "Ular Tangga Penjumlahan Cepat: Modifikasi ular tangga kertas luring dengan kewajiban menebak operasi hitung sebelum dadu diletakkan di petak.",
          "Eksplorasi Dimensi Panjang: Ajak murid membandingkan ukuran panjang pensil, krayon, meja, dan botol minum dengan meletakkannya berdampingan.",
          "Pencarian Pola Warna Visual: Tantang murid melengkapi rentetan pola buah-buahan atau manik-manik berwarna luring."
        ]
      }
    };
  } else {
    // SD Kelas Tinggi (Kelas 3-6)
    return {
      level12: {
        literasi: [
          "Daftar Kosakata Tematik luring: Tempel lembar kata bergambar benda-benda sekitar sekolah luring untuk membiasakan meraba suku kata lancar.",
          "Membaca Nyaring Mandiri: Dampingi murid membaca 3 kalimat utuh pendek tanpa tersendat-sendat demi melatih nafas jeda tanda baca titik.",
          "Puzzle Kejadian Kertas: Gunting 3 kalimat cerita acak di atas pita kertas luring dan bimbing menyusun urutan logis cerita."
        ],
        numerasi: [
          "Papan Flanel Bangun Datar: Gunakan guntingan kain berbentuk segitiga, lingkaran, persegi luring luring untuk mengenalkan sifat visual bangun datar.",
          "Penghitung Sempoa Luring: Selesaikan operasi penjumlahan-pengurangan ratusan dibantu sempoa manik kayu luring agar lebih mudah berpindah konkrit.",
          "Simulasi Pecahan Buah Asli: Bawa jeruk atau kue luring ke kelas, potong menjadi pecahan setengah/seperempat agar murid mudah mencerna angka pecahan."
        ]
      },
      level345: {
        literasi: [
          "Log Resensi Pojok Baca: Instruksikan murid meringkas buku kesukaan luring di buku tulis, menyebutkan tokoh utama, alur, dan pelajaran moral cerita.",
          "Paragraf Deskripsi Cita-cita: Tugaskan menulis sebuah paragraf tentang cita-cita hidupnya didukung alasan terstruktur logis.",
          "Diskusi Kecil Berargumen: Sosialisasikan forum mini kelas luring mendiskusikan topik seru, seperti 'Mengapa membuang sampah sembarangan merugikan kawan?'."
        ],
        numerasi: [
          "Pengukuran Volume Kemasan Bekas: Sediakan kardus kemasan snack luring, minta murid mengukur rusuk dengan penggaris dan menghitung keliling/volume.",
          "Problem-Solving Soal Cerita Kontekstual: Selesaikan soal matematika cerita luring secara kolaboratif membedah masalah belanja bahan kue.",
          "Pembuatan Grafik Batang Hobi: Survei kegemaran olahraga kawan sekelas luring kemudian petakan nilainya dalam grafik batang di kertas gambar."
        ]
      }
    };
  }
};

const DEFAULT_STUDENTS: Student[] = [
  { id: "std-1", name: "Florida Banusu", gender: "P", litReading: 4, litWriting: 4, numCounting: 4, numAnalysis: 3 },
  { id: "std-2", name: "Febrianus Hanoe", gender: "L", litReading: 4, litWriting: 3, numCounting: 4, numAnalysis: 4 },
  { id: "std-3", name: "Fransiskus Puatero", gender: "L", litReading: 3, litWriting: 3, numCounting: 3, numAnalysis: 3 },
  { id: "std-4", name: "Mateus Kause", gender: "L", litReading: 4, litWriting: 4, numCounting: 5, numAnalysis: 4 },
  { id: "std-5", name: "Natalia Buatefa", gender: "P", litReading: 5, litWriting: 4, numCounting: 4, numAnalysis: 4 },
  { id: "std-6", name: "Norbertus Hanoe", gender: "L", litReading: 3, litWriting: 3, numCounting: 3, numAnalysis: 3 },
  { id: "std-7", name: "Paskalis Hanoe", gender: "L", litReading: 4, litWriting: 4, numCounting: 5, numAnalysis: 4 },
  { id: "std-8", name: "Petrosia Kono Aran", gender: "P", litReading: 4, litWriting: 4, numCounting: 4, numAnalysis: 4 },
  { id: "std-9", name: "Syrilus Alexander Kosat", gender: "L", litReading: 3, litWriting: 2, numCounting: 3, numAnalysis: 3 },
  { id: "std-10", name: "Serilius Buatefa", gender: "L", litReading: 4, litWriting: 3, numCounting: 4, numAnalysis: 4 },
  { id: "std-11", name: "Yohanes Buatefa", gender: "L", litReading: 3, litWriting: 3, numCounting: 3, numAnalysis: 3 },
  { id: "std-12", name: "Alfonsius Misa", gender: "L", litReading: 3, litWriting: 3, numCounting: 3, numAnalysis: 3 },
];

export const LitNumProgress: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
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
      const savedLitNumRaw = localStorage.getItem("omega_litnum_students");
      
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

      let existingLitNumMap: Record<string, any> = {};
      if (savedLitNumRaw) {
        try {
          const parsed = JSON.parse(savedLitNumRaw);
          parsed.forEach((s: any) => {
            if (s.id) {
              existingLitNumMap[s.id] = s;
            }
            if (s.name) {
              existingLitNumMap[s.name] = s;
            }
          });
        } catch (e) {
          console.error(e);
        }
      }

      if (parsedDaftarNilai.length > 0) {
        const syncedStudents: Student[] = parsedDaftarNilai.map((item: any, idx: number) => {
          const name = item.name || item.nama || `Siswa ${idx + 1}`;
          const id = item.id || String(idx + 1);
          const existing = existingLitNumMap[id] || existingLitNumMap[name] || {};
          return {
            id: id,
            name: name,
            gender: (item.gender === "P" || item.gender === "Perempuan" || item.jenisKelamin === "P") ? "P" : "L",
            litReading: existing.litReading !== undefined ? mapScoreToLevel(existing.litReading) : 3,
            litWriting: existing.litWriting !== undefined ? mapScoreToLevel(existing.litWriting) : 3,
            numCounting: existing.numCounting !== undefined ? mapScoreToLevel(existing.numCounting) : 3,
            numAnalysis: existing.numAnalysis !== undefined ? mapScoreToLevel(existing.numAnalysis) : 3
          };
        });
        setStudents(syncedStudents);
      } else {
        setStudents(DEFAULT_STUDENTS);
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

  // Save changes to litnum local store whenever students state changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("omega_litnum_students", JSON.stringify(students));
    }
  }, [students]);

  // modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalGender, setModalGender] = useState<"L" | "P">("L");
  const [modalLitReading, setModalLitReading] = useState<number | "">(70);
  const [modalLitWriting, setModalLitWriting] = useState<number | "">(70);
  const [modalNumCounting, setModalNumCounting] = useState<number | "">(70);
  const [modalNumAnalysis, setModalNumAnalysis] = useState<number | "">(70);

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  // loading & results states
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<string>("");
  const [activeReportTab, setActiveReportTab] = useState<"diagnostik" | "intervensi" | "rekomendasi">("diagnostik");
  const [hasCopied, setHasCopied] = useState(false);
  const [isSavedToBank, setIsSavedToBank] = useState(false);
  const [chartTypeVal, setChartTypeVal] = useState<"overall" | "subskills" | "gender">("overall");
  const [showToast, setShowToast] = useState<string | null>(null);

  const isLitNumUnlocked = (() => {
    const active = localStorage.getItem("omega_is_activated") === "true";
    if (!active) return false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (!purchasedStr) return true;
    try {
      const list = JSON.parse(purchasedStr) as string[];
      return list.includes("premium") || list.includes("literasi_numerasi");
    } catch {
      return true;
    }
  })();

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
  };

  // core calculations
  const calculateAverage = (student: Student, type: "literasi" | "numerasi" | "semua"): number => {
    const r = mapScoreToLevel(student.litReading || 3);
    const w = mapScoreToLevel(student.litWriting || 3);
    const c = mapScoreToLevel(student.numCounting || 3);
    const a = mapScoreToLevel(student.numAnalysis || 3);

    if (type === "literasi") {
      return Number(((r + w) / 2).toFixed(1));
    }
    if (type === "numerasi") {
      return Number(((c + a) / 2).toFixed(1));
    }
    return Number(((r + w + c + a) / 4).toFixed(1));
  };

  const getProficiencyCategory = (score: number) => {
    // score is average level, ranging from 1.0 to 5.0
    if (score >= 4.5) {
      return { 
        label: "Mahir (Level 5)", 
        desc: "Sangat Baik", 
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
      };
    }
    if (score >= 3.5) {
      return { 
        label: "Cakap (Level 4)", 
        desc: "Baik", 
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20" 
      };
    }
    if (score >= 2.5) {
      return { 
        label: "Berkembang (Level 3)", 
        desc: "Cukup", 
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20" 
      };
    }
    if (score >= 1.5) {
      return { 
        label: "Perlu Bimbingan (Level 2)", 
        desc: "Butuh Pendampingan", 
        color: "text-orange-400 bg-orange-500/10 border-orange-500/20" 
      };
    }
    return { 
      label: "Intervensi Khusus (Level 1)", 
      desc: "Fokus Remedial", 
      color: "text-rose-450 bg-rose-500/10 border-rose-500/20" 
    };
  };

  const classAvgLit = Number(
    (students.reduce((acc, s) => acc + calculateAverage(s, "literasi"), 0) / (students.length || 1)).toFixed(1)
  );
  const classAvgNum = Number(
    (students.reduce((acc, s) => acc + calculateAverage(s, "numerasi"), 0) / (students.length || 1)).toFixed(1)
  );
  const needInterventionCount = students.filter(
    s => calculateAverage(s, "semua") < 2.5
  ).length;

  // React-state data processing for Charts & Diagrams
  const levelCounts = { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 };
  const genderLevels = {
    L: { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 },
    P: { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 }
  };
  
  students.forEach(s => {
    const combined = (s.litReading + s.litWriting + s.numCounting + s.numAnalysis) / 4;
    let lvl: 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' = 'lvl1';
    if (combined >= 4.5) lvl = 'lvl5';
    else if (combined >= 3.5) lvl = 'lvl4';
    else if (combined >= 2.5) lvl = 'lvl3';
    else if (combined >= 1.5) lvl = 'lvl2';
    else lvl = 'lvl1';
    
    levelCounts[lvl]++;
    if (s.gender === "L") {
      genderLevels.L[lvl]++;
    } else {
      genderLevels.P[lvl]++;
    }
  });

  const totalSiswa = students.length || 1;
  const levelPercentages = {
    lvl1: Number(((levelCounts.lvl1 / totalSiswa) * 100).toFixed(1)),
    lvl2: Number(((levelCounts.lvl2 / totalSiswa) * 100).toFixed(1)),
    lvl3: Number(((levelCounts.lvl3 / totalSiswa) * 100).toFixed(1)),
    lvl4: Number(((levelCounts.lvl4 / totalSiswa) * 100).toFixed(1)),
    lvl5: Number(((levelCounts.lvl5 / totalSiswa) * 100).toFixed(1))
  };

  const litReadingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.litReading, 0) / students.length).toFixed(1)) : 3;
  const litWritingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.litWriting, 0) / students.length).toFixed(1)) : 3;
  const numCountingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.numCounting, 0) / students.length).toFixed(1)) : 3;
  const numAnalysisAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.numAnalysis, 0) / students.length).toFixed(1)) : 3;

  const boysList = students.filter(s => s.gender === 'L');
  const girlsList = students.filter(s => s.gender === 'P');
  const boyLit = boysList.length > 0 ? Number((boysList.reduce((acc, s) => acc + s.litReading, 0) / boysList.length).toFixed(1)) : 3;
  const boyNum = boysList.length > 0 ? Number((boysList.reduce((acc, s) => acc + s.numCounting, 0) / boysList.length).toFixed(1)) : 3;
  const girlLit = girlsList.length > 0 ? Number((girlsList.reduce((acc, s) => acc + s.litReading, 0) / girlsList.length).toFixed(1)) : 3;
  const girlNum = girlsList.length > 0 ? Number((girlsList.reduce((acc, s) => acc + s.numCounting, 0) / girlsList.length).toFixed(1)) : 3;

  // Recharts JSON configurations
  const chartDataOverall = [
    { name: "Lvl 1 (Intervensi)", Siswa: levelCounts.lvl1, persentase: levelPercentages.lvl1, desc: "Intervensi Khusus" },
    { name: "Lvl 2 (Bimbingan)", Siswa: levelCounts.lvl2, persentase: levelPercentages.lvl2, desc: "Perlu Bimbingan" },
    { name: "Lvl 3 (Berkembang)", Siswa: levelCounts.lvl3, persentase: levelPercentages.lvl3, desc: "Berkembang" },
    { name: "Lvl 4 (Cakap)", Siswa: levelCounts.lvl4, persentase: levelPercentages.lvl4, desc: "Cakap" },
    { name: "Lvl 5 (Mahir)", Siswa: levelCounts.lvl5, persentase: levelPercentages.lvl5, desc: "Mahir" }
  ];

  const chartDataSubskills = [
    { name: "Lit Membaca", Nilai: litReadingAvg },
    { name: "Lit Menulis", Nilai: litWritingAvg },
    { name: "Num Bilangan", Nilai: numCountingAvg },
    { name: "Num Spasial", Nilai: numAnalysisAvg }
  ];

  const chartDataGender = [
    { name: "Laki-laki (L)", Literasi: boyLit, Numerasi: boyNum, Rerata: Number(((boyLit + boyNum) / 2).toFixed(1)) },
    { name: "Perempuan (P)", Literasi: girlLit, Numerasi: girlNum, Rerata: Number(((girlLit + girlNum) / 2).toFixed(1)) }
  ];

  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setModalName("");
    setModalGender("L");
    setModalLitReading(3);
    setModalLitWriting(3);
    setModalNumCounting(3);
    setModalNumAnalysis(3);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (s: Student) => {
    setEditingStudentId(s.id);
    setModalName(s.name);
    setModalGender(s.gender);
    setModalLitReading(mapScoreToLevel(s.litReading));
    setModalLitWriting(mapScoreToLevel(s.litWriting));
    setModalNumCounting(mapScoreToLevel(s.numCounting));
    setModalNumAnalysis(mapScoreToLevel(s.numAnalysis));
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLitNumUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket LITERASI & NUMERASI untuk mengedit data ini.");
      setShowAddModal(false);
      return;
    }
    if (!modalName.trim()) return;

    if (editingStudentId) {
      // Update master list
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList = masterList.map((m: any) => m.id === editingStudentId ? { ...m, name: modalName, gender: modalGender } : m);
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      const updatedStudents = students.map(s => s.id === editingStudentId ? {
        ...s,
        name: modalName,
        gender: modalGender,
        litReading: Number(modalLitReading),
        litWriting: Number(modalLitWriting),
        numCounting: Number(modalNumCounting),
        numAnalysis: Number(modalNumAnalysis)
      } : s);
      localStorage.setItem("omega_litnum_students", JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      triggerToast(`✓ Berhasil Diupdate! Data capaian Literasi & Numerasi murid "${modalName}" telah diperbarui secara permanen.`);
    } else {
      const newId = "std-" + Date.now();
      // Update master list
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList.push({ id: newId, name: modalName, gender: modalGender, nisn: "" });
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      const newStudent: Student = {
        id: newId,
        name: modalName,
        gender: modalGender,
        litReading: Number(modalLitReading),
        litWriting: Number(modalLitWriting),
        numCounting: Number(modalNumCounting),
        numAnalysis: Number(modalNumAnalysis)
      };
      const updatedStudents = [...students, newStudent];
      localStorage.setItem("omega_litnum_students", JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      triggerToast(`✓ Berhasil Disimpan! Data capaian Literasi & Numerasi murid baru "${modalName}" telah dibuat.`);
    }
    setShowAddModal(false);

    // Dispatch sync event
    window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
  };

  const handleDeleteStudent = (id: string) => {
    if (!isLitNumUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket LITERASI & NUMERASI untuk mengedit data ini.");
      return;
    }
    const student = students.find(s => s.id === id);
    const name = student ? student.name : "murid ini";
    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus data capaian literasi dan numerasi untuk ${name} beserta registry utamanya?`);
    setDeleteConfirmCallback(() => () => {
      // Update master list
      const currentMasterRaw = localStorage.getItem("omega_daftar_nilai_students");
      let masterList = [];
      if (currentMasterRaw) {
        try { masterList = JSON.parse(currentMasterRaw); } catch(_) {}
      }
      masterList = masterList.filter((m: any) => m.id !== id);
      localStorage.setItem("omega_daftar_nilai_students", JSON.stringify(masterList));

      const updatedStudents = students.filter(s => s.id !== id);
      localStorage.setItem("omega_litnum_students", JSON.stringify(updatedStudents));
      setStudents(updatedStudents);

      // Dispatch sync event
      window.dispatchEvent(new CustomEvent("omega-school-profile-updated"));
    });
    setDeleteConfirmId(id);
  };

  const handleRequestAiDiagnose = async () => {
    if (!isLitNumUnlocked) {
      triggerToast("Paket Belum Aktif: Silakan beli paket LITERASI & NUMERASI untuk menggunakan asisten AI ini.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setLoadingStatus("Menyiapkan metrik prestasi & daftar siswa...");

    try {
      // Small timeout feel
      setTimeout(() => {
        setLoadingStatus("Menganalisis disparitas literasi membaca vs menulis...");
      }, 1500);
      setTimeout(() => {
        setLoadingStatus("Mengonversikan data numerasi bilangan & analisis spasial...");
      }, 3000);
      setTimeout(() => {
        setLoadingStatus("Merumuskan strategi intervensi berbasis 3 Pilar Deep Learning...");
      }, 4500);

      const response = await fetch("/api/generate-litnum-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaSekolah,
          kelas,
          semester,
          tahunAjaran,
          namaGuru,
          kepalaSekolah,
          students,
          metrics: {
            classAvgLit,
            classAvgNum,
            needInterventionCount
          }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Gagal menghasilkan analisa dari asisten AI.");
      }

      setAiReport(resData.text);
      setIsSavedToBank(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal menghubungkan ke server AI.");
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
        id: "doc-litnum-" + Date.now(),
        name: `Laporan Hasil Literasi & Numerasi - ${kelas}`,
        category: "manual",
        content: `========================================================
LAPORAN HASIL DIAGNOSTIK CAPAIAN LITERASI & NUMERASI
========================================================
Sekolah: ${namaSekolah}
Kelas: ${kelas} | Tahun Ajaran: ${tahunAjaran}
Guru Kelas: ${namaGuru}

Rangkuman Kelas (Level 1 s.d. 5):
- Rerata Capaian Literasi Kelas: Level ${classAvgLit} / 5
- Rerata Capaian Numerasi Kelas: Level ${classAvgNum} / 5
- Siswa Perlu Bimbingan Khusus (Rerata < 2.5): ${needInterventionCount} orang

ANALISIS & DIAGNOSTIK AI:
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

  // Modern Styled PDF Generation
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    
    // Compute statistics inside PDF downloader scope
    const levelCounts = { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 };
    const genderLevels = {
      L: { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 },
      P: { lvl1: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 }
    };
    
    students.forEach(s => {
      const combined = (s.litReading + s.litWriting + s.numCounting + s.numAnalysis) / 4;
      let lvl: 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' = 'lvl1';
      if (combined >= 4.5) lvl = 'lvl5';
      else if (combined >= 3.5) lvl = 'lvl4';
      else if (combined >= 2.5) lvl = 'lvl3';
      else if (combined >= 1.5) lvl = 'lvl2';
      else lvl = 'lvl1';
      
      levelCounts[lvl]++;
      if (s.gender === "L") {
        genderLevels.L[lvl]++;
      } else {
        genderLevels.P[lvl]++;
      }
    });

    const totalSiswa = students.length || 1;
    const levelPercentages = {
      lvl1: Number(((levelCounts.lvl1 / totalSiswa) * 100).toFixed(1)),
      lvl2: Number(((levelCounts.lvl2 / totalSiswa) * 100).toFixed(1)),
      lvl3: Number(((levelCounts.lvl3 / totalSiswa) * 100).toFixed(1)),
      lvl4: Number(((levelCounts.lvl4 / totalSiswa) * 100).toFixed(1)),
      lvl5: Number(((levelCounts.lvl5 / totalSiswa) * 100).toFixed(1))
    };

    const litReadingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.litReading, 0) / students.length).toFixed(1)) : 3;
    const litWritingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.litWriting, 0) / students.length).toFixed(1)) : 3;
    const numCountingAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.numCounting, 0) / students.length).toFixed(1)) : 3;
    const numAnalysisAvg = students.length > 0 ? Number((students.reduce((acc, s) => acc + s.numAnalysis, 0) / students.length).toFixed(1)) : 3;

    // Helper to render justified paragraphs of text, keeping headings and tables well spaced
    const renderParagraph = (doc: any, text: string, startY: number, lineSpacing: number = 4.5): number => {
      const pageHeightLimit = 275;
      let cursorY = startY;

      const cleanLine = text.trim();
      if (!cleanLine) return cursorY;

      // Detect headings, list items, and table rows
      const isHeading = cleanLine.startsWith("#") || cleanLine.startsWith("1.") || cleanLine.startsWith("2.") || cleanLine.startsWith("3.");
      const isSubHeading = cleanLine.startsWith("A.") || cleanLine.startsWith("B.") || cleanLine.startsWith("C.") || cleanLine.startsWith("D.") || cleanLine.startsWith("E.") || cleanLine.startsWith("*");
      const isListItem = cleanLine.startsWith("-") || cleanLine.startsWith("•") || cleanLine.match(/^\d+\.\s/);
      const isTable = cleanLine.startsWith("|");

      if (isHeading) {
        if (cursorY + 12 > pageHeightLimit) {
          doc.addPage();
          cursorY = 20;
        }
        cursorY += 4;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);
        doc.text(cleanLine.replace(/[#*`_-]/g, "").trim(), 14, cursorY);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        cursorY += 6;
        return cursorY;
      }

      if (isSubHeading) {
        if (cursorY + 10 > pageHeightLimit) {
          doc.addPage();
          cursorY = 20;
        }
        cursorY += 2;
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(cleanLine.replace(/[#*`_-]/g, "").trim(), 14, cursorY);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        cursorY += 5;
        return cursorY;
      }

      // Restore style
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);

      if (isTable) {
        if (cursorY + lineSpacing > pageHeightLimit) {
          doc.addPage();
          cursorY = 20;
        }
        doc.setFont("Courier", "normal");
        doc.setFontSize(8);
        doc.text(cleanLine, 14, cursorY);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        cursorY += lineSpacing;
        return cursorY;
      }

      const lines = doc.splitTextToSize(cleanLine.replace(/[*`_]/g, ""), 182);

      lines.forEach((line: string, lineIdx: number) => {
        if (cursorY + lineSpacing > pageHeightLimit) {
          doc.addPage();
          cursorY = 20;
        }

        const isLastLine = lineIdx === lines.length - 1;

        if (isListItem || isLastLine || line.length < 55) {
          doc.text(line.trim(), 14, cursorY);
        } else {
          // Manual Justification (rata kiri-kanan)
          const words = line.trim().split(/\s+/);
          if (words.length <= 1) {
            doc.text(line.trim(), 14, cursorY);
          } else {
            const totalWordsWidth = words.reduce((sum: number, w: string) => sum + doc.getTextWidth(w), 0);
            const remainingSpace = 182 - totalWordsWidth;
            const gapWidth = remainingSpace / (words.length - 1);

            let currentX = 14;
            words.forEach((word: string) => {
              doc.text(word, currentX, cursorY);
              currentX += doc.getTextWidth(word) + gapWidth;
            });
          }
        }
        cursorY += lineSpacing;
      });

      cursorY += 2; // small padding
      return cursorY;
    };

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
    
    // Uppercase Title requested by the user, properly aligned below the Kop lines
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11.5);
    const docTitle = `DAFTAR CAPAIAN LITERASI DAN NUMERASI MURID ${namaSekolah.toUpperCase()}`;
    const docSubtitle = `TAHUN PELAJARAN ${tahunAjaran}`;
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
    
    // Grid Table Headers
    const startY = 60;
    doc.setFillColor(30, 41, 59); // Indigo/Slate dark header
    doc.rect(14, startY, 182, 8.5, "F");
    
    doc.setDrawColor(255, 255, 255);
    doc.line(14, startY, 196, startY);
    doc.line(14, startY + 8.5, 196, startY + 8.5);
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.0);
    doc.text("NO", 17, startY + 5.5);
    doc.text("NAMA MURID LENGKAP", 26, startY + 5.5);
    doc.text("L/P", 91, startY + 5.5);
    doc.text("LIT BACA", 104, startY + 5.5);
    doc.text("LIT TULIS", 128, startY + 5.5);
    doc.text("NUM BILANGAN", 149, startY + 5.5);
    doc.text("NUM SPASIAL", 174, startY + 5.5);
    
    // Draw white dividers in header for visual symmetry
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(24, startY, 24, startY + 8.5);
    doc.line(88, startY, 88, startY + 8.5);
    doc.line(100, startY, 100, startY + 8.5);
    doc.line(124, startY, 124, startY + 8.5);
    doc.line(148, startY, 148, startY + 8.5);
    doc.line(172, startY, 172, startY + 8.5);
    
    // Grid cells render logic
    doc.setTextColor(0, 0, 0); // reset
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    
    let currentY = startY + 8.5;
    doc.setDrawColor(180, 180, 180); // clear grid borders
    
    students.forEach((s, idx) => {
      // Row banding background
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 6.5, "F");
      }
      
      // Complete grid outline for the cell box
      doc.rect(14, currentY, 182, 6.5, "S");
      
      // Draw precise vertical cell partition columns boundaries
      doc.line(24, currentY, 24, currentY + 6.5);         // NO column cell divider
      doc.line(88, currentY, 88, currentY + 6.5);         // Name column cell divider
      doc.line(100, currentY, 100, currentY + 6.5);         // Gender column cell divider
      doc.line(124, currentY, 124, currentY + 6.5);       // Lit Baca cell divider
      doc.line(148, currentY, 148, currentY + 6.5);       // Lit Tulis cell divider
      doc.line(172, currentY, 172, currentY + 6.5);       // Num Bilangan cell divider
      
      // Print text in cells
      doc.text(String(idx + 1), 17.5, currentY + 4.5);
      
      let truncName = s.name;
      if (truncName.length > 31) {
        truncName = truncName.substring(0, 30) + "...";
      }
      doc.text(truncName, 26, currentY + 4.5);
      doc.text(s.gender, 93, currentY + 4.5);
      doc.text(`Level ${s.litReading}`, 106, currentY + 4.5);
      doc.text(`Level ${s.litWriting}`, 130, currentY + 4.5);
      doc.text(`Level ${s.numCounting}`, 154, currentY + 4.5);
      doc.text(`Level ${s.numAnalysis}`, 178, currentY + 4.5);
      
      currentY += 6.5;
    });

    // --- PAGE 2: SUMMARY METRIC CARDS & OFFLINE VECTOR CHARTS ---
    doc.addPage();
    let p2Y = 20;
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("A. DIAGRAM & METRIK CAPAIAN LITERASI & NUMERASI", 14, p2Y);
    doc.setDrawColor(30, 41, 59);
    doc.line(14, p2Y + 2.5, 196, p2Y + 2.5);
    
    p2Y += 10;
    
    // Drawn Summary statistic boxes
    doc.setFillColor(248, 250, 252);
    doc.rect(14, p2Y, 55, 18, "F");
    doc.rect(73, p2Y, 55, 18, "F");
    doc.rect(132, p2Y, 64, 18, "F");
    
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, p2Y, 55, 18, "S");
    doc.rect(73, p2Y, 55, 18, "S");
    doc.rect(132, p2Y, 64, 18, "S");
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("RERATA LITERASI", 18, p2Y + 5.5);
    doc.text("RERATA NUMERASI", 77, p2Y + 5.5);
    doc.text("BUTUH INTERVENSI KHUSUS", 136, p2Y + 5.5);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(16, 185, 129); // green
    doc.text(`Level ${classAvgLit} / 5`, 18, p2Y + 12.5);
    doc.setTextColor(245, 158, 11); // orange
    doc.text(`Level ${classAvgNum} / 5`, 77, p2Y + 12.5);
    doc.setTextColor(239, 68, 68); // red
    doc.text(`${needInterventionCount} Siswa`, 136, p2Y + 12.5);
    
    doc.setTextColor(0, 0, 0); // reset
    p2Y += 28;
    
    // Overall student level distribution bar charts in the PDF report
    doc.setFontSize(10.5);
    doc.setFont("Helvetica", "bold");
    doc.text("B. DIAGRAM PERSENTASE DISTRIBUSI LEVEL KELAS (OVERALL)", 14, p2Y);
    p2Y += 6;
    
    const overallLevels = [
      { label: "Level 5 (Mahir - PMR)", count: levelCounts.lvl5, pct: levelPercentages.lvl5, rgb: [16, 185, 129] },
      { label: "Level 4 (Cakap - PCK)", count: levelCounts.lvl4, pct: levelPercentages.lvl4, rgb: [59, 130, 246] },
      { label: "Level 3 (Berkembang - PBB)", count: levelCounts.lvl3, pct: levelPercentages.lvl3, rgb: [245, 158, 11] },
      { label: "Level 2 (Perlu Bimbingan - PPB)", count: levelCounts.lvl2, pct: levelPercentages.lvl2, rgb: [249, 115, 22] },
      { label: "Level 1 (Intervensi Khusus - PIK)", count: levelCounts.lvl1, pct: levelPercentages.lvl1, rgb: [239, 68, 68] }
    ];
    
    overallLevels.forEach(item => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(item.label, 14, p2Y + 4);
      doc.setFont("Helvetica", "normal");
      doc.text(`${item.count} Murid (${item.pct}%)`, 65, p2Y + 4);
      
      // Draw progress meter container
      doc.setDrawColor(226, 232, 240);
      doc.rect(105, p2Y, 75, 4.5);
      if (item.pct > 0) {
        doc.setFillColor(item.rgb[0], item.rgb[1], item.rgb[2]);
        doc.rect(105, p2Y, (item.pct / 100) * 75, 4.5, "F");
      }
      p2Y += 7.5;
    });
    
    p2Y += 5;
    
    // Gender Level Breakdown Chart in PDF
    doc.setFontSize(10.5);
    doc.setFont("Helvetica", "bold");
    doc.text("C. ANALISIS CAPAIAN RATA-RATA BERDASARKAN JENIS KELAMIN", 14, p2Y);
    p2Y += 6;
    
    const boys = students.filter(s => s.gender === 'L');
    const girls = students.filter(s => s.gender === 'P');
    
    const boyLit = boys.length > 0 ? Number((boys.reduce((acc, s) => acc + s.litReading, 0) / boys.length).toFixed(1)) : 3;
    const boyNum = boys.length > 0 ? Number((boys.reduce((acc, s) => acc + s.numCounting, 0) / boys.length).toFixed(1)) : 3;
    const girlLit = girls.length > 0 ? Number((girls.reduce((acc, s) => acc + s.litReading, 0) / girls.length).toFixed(1)) : 3;
    const girlNum = girls.length > 0 ? Number((girls.reduce((acc, s) => acc + s.numCounting, 0) / girls.length).toFixed(1)) : 3;
    
    // Laki Laki row
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("LAKI-LAKI (L)", 14, p2Y + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(`Rerata Literasi: Lvl ${boyLit}/5`, 45, p2Y + 4);
    doc.text(`Rerata Numerasi: Lvl ${boyNum}/5`, 95, p2Y + 4);
    
    doc.setDrawColor(226, 232, 240);
    doc.rect(145, p2Y, 40, 4.5);
    doc.setFillColor(30, 41, 59); // Slate Blue
    doc.rect(145, p2Y, (((boyLit + boyNum)/2) / 5) * 40, 4.5, "F");
    
    p2Y += 7.5;
    
    // Perempuan row
    doc.setFont("Helvetica", "bold");
    doc.text("PEREMPUAN (P)", 14, p2Y + 4);
    doc.setFont("Helvetica", "normal");
    doc.text(`Rerata Literasi: Lvl ${girlLit}/5`, 45, p2Y + 4);
    doc.text(`Rerata Numerasi: Lvl ${girlNum}/5`, 95, p2Y + 4);
    
    doc.setDrawColor(226, 232, 240);
    doc.rect(145, p2Y, 40, 4.5);
    doc.setFillColor(219, 39, 119); // Pink Theme
    doc.rect(145, p2Y, (((girlLit + girlNum)/2) / 5) * 40, 4.5, "F");
    
    p2Y += 12;
    
    // Sub-Skill breakdown charts in PDF
    doc.setFontSize(10.5);
    doc.setFont("Helvetica", "bold");
    doc.text("D. PERBANDINGAN KOMPETENSI SUB-DIAGNOSTIK (RATA-RATA)", 14, p2Y);
    p2Y += 6;
    
    const subSkills = [
      { label: "Literasi Membaca (Membaca kata/pemahaman)", val: litReadingAvg, rgb: [16, 185, 129] },
      { label: "Literasi Menulis (Kerapihan/menyusun ide)", val: litWritingAvg, rgb: [52, 211, 153] },
      { label: "Numerasi Bilangan (Mengenal/hitung utuh)", val: numCountingAvg, rgb: [245, 158, 11] },
      { label: "Numerasi Analisis/Spasial (Soal cerita/logika)", val: numAnalysisAvg, rgb: [251, 191, 36] }
    ];
    
    subSkills.forEach(skill => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(skill.label, 14, p2Y + 4);
      doc.setFont("Helvetica", "normal");
      doc.text(`Lvl ${skill.val} / 5`, 80, p2Y + 4);
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(115, p2Y, 65, 4.5);
      if (skill.val > 0) {
        doc.setFillColor(skill.rgb[0], skill.rgb[1], skill.rgb[2]);
        doc.rect(115, p2Y, (skill.val / 5) * 65, 4.5, "F");
      }
      p2Y += 7.5;
    });

    // --- PAGE 3: AI DIAGNOSTIK INSIGHTS & JUSTIFIED RECOMMENDATIONS ---
    if (aiReport) {
      doc.addPage();
      let p3Y = 20;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("E. ANALISIS STRATEGIS & IMPLEMENTASI PEMBELAJARAN AI", 14, p3Y);
      doc.setDrawColor(30, 41, 59);
      doc.line(14, p3Y + 2.5, 196, p3Y + 2.5);
      
      p3Y += 10;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0); // reset to black

      // Parse aiReport and render each segment carefully
      const rawSegments = aiReport.split(/###\s+/);
      
      rawSegments.forEach((segment) => {
        const trimmedSegment = segment.trim();
        if (!trimmedSegment) return;

        // Force a page break for Segment 2 (Peta Intervensi) on a fresh new page
        const isChapter2 = trimmedSegment.startsWith("2.") || trimmedSegment.includes("PETA INTERVENSI");
        const isChapter3 = trimmedSegment.startsWith("3.") || trimmedSegment.includes("REKOMENDASI PEDAGOGI");

        if ((isChapter2 || isChapter3) && p3Y > 30) {
          doc.addPage();
          p3Y = 20;
        }

        const paragraphs = trimmedSegment.split("\n");
        paragraphs.forEach((p) => {
          p3Y = renderParagraph(doc, p, p3Y);
        });
      });

      currentY = p3Y;
    } else {
      currentY = p2Y;
    }
    
    // --- SIGNATURES SIGN-OFF BLOCK ---
    if (currentY > 215) {
      doc.addPage();
      currentY = 25;
    } else {
      currentY += 15;
    }
    
    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`${tempatPenyusunan}, ${tanggalPenyusunan}`, 135, currentY);
    currentY += 5;
    doc.text("Mengetahui,", 14, currentY);
    doc.text("Guru Kelas,", 135, currentY);
    currentY += 5;
    doc.text("Kepala Sekolah,", 14, currentY);
    currentY += 21;
    doc.setFont("Helvetica", "bold");
    doc.text(kepalaSekolah, 14, currentY);
    doc.text(namaGuru, 135, currentY);
    currentY += 4;
    doc.setFont("Helvetica", "normal");
    doc.text(`NIP. ${nipKepala}`, 14, currentY);
    doc.text(`NIP. ${localStorage.getItem("kosp_nip_guru") || "198603012020121005"}`, 135, currentY);
    
    doc.save(`DAFTAR_CAPAIAN_LITERASI_NUMERASI_${namaSekolah.replace(/\s+/g, "_")}.pdf`);
  };

  // Helper parsing AI tabs derived from prompt segments
  const renderTabContent = () => {
    if (!aiReport) return null;
    
    // Categorize recommendations from the long generated paper
    // Tab 1: Diagnostik
    // Tab 2: Intervensi
    // Tab 3: Rekomendasi
    const segments = aiReport.split(/###\s+/);
    
    return (
      <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-5 space-y-4 font-sans text-sm leading-relaxed text-zinc-300">
        <div className="flex border-b border-zinc-900 pb-3 gap-2.5">
          <button 
            onClick={() => setActiveReportTab("diagnostik")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
              activeReportTab === "diagnostik" 
                ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            📊 Hasil Diagnostik
          </button>
          <button 
            onClick={() => setActiveReportTab("intervensi")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
              activeReportTab === "intervensi" 
                ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            🧩 Intervensi Diferensiasi
          </button>
          <button 
            onClick={() => setActiveReportTab("rekomendasi")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
              activeReportTab === "rekomendasi" 
                ? "bg-amber-500/10 border-amber-500 text-amber-400" 
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            💡 Rekomendasi Pedagogi
          </button>
        </div>

        <div className="prose prose-invert max-w-none text-zinc-300 space-y-4 min-h-48 pt-1">
          {activeReportTab === "diagnostik" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide border-l-2 border-amber-500 pl-2.5">Kondisi & Pemetaan Asesmen</h4>
              <p className="text-zinc-400 text-xs">Informasi pemetaan diagnostik kekuatan individu dan disparitas performa belajar di kelas Anda.</p>
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-900 text-xs whitespace-pre-wrap leading-relaxed font-mono text-zinc-300">
                {segments[1] || segments[0]}
              </div>
            </div>
          )}

          {activeReportTab === "intervensi" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide border-l-2 border-amber-500 pl-2.5">Pola Pembelajaran Diferensiasi</h4>
              <p className="text-zinc-400 text-xs">Peta jalur intervensi sesuai profil kebutuhan: murid mahir, cakap, layak, dan perlu bimbingan khusus.</p>
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-900 text-xs whitespace-pre-wrap leading-relaxed font-mono text-zinc-300">
                {segments[2] || "Menganalisis profil siswa... Layani siswa yang perlu bimbingan khusus terlebih dahulu melalui pendampingan individual dengan manipulatif konkrit."}
              </div>
            </div>
          )}

          {activeReportTab === "rekomendasi" && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide border-l-2 border-amber-500 pl-2.5">Integrasi 3 Pilar Kurikulum Merdeka</h4>
              <p className="text-zinc-400 text-xs">Strategi pembelajaran Mindful, Meaningful, & Joyful Learning yang dirancang oleh ahlinya untuk kelas Anda.</p>
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-900 text-xs whitespace-pre-wrap leading-relaxed font-mono text-zinc-300">
                {segments[3] || "Strategi Mindful: Atur fokus hening cipta 2 menit sebelum mulai pelajaran berbau problem-solving. Meaningful: Bawa data timbangan sachet jajan anak asli untuk numerasi spasial. Joyful: Kuis lempar bola kasti tanya jawab lari gembira."}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-1 animate-fade-in relative">
      {loading && (
        <CinematicLoading 
          title="Asisten Diagnostik Literasi & Numerasi" 
          subtitle={loadingStatus}
        />
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0c10] via-black to-[#050508] shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9.5px] font-mono tracking-widest font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 text-glow-amber mb-1">
              <GraduationCap className="w-3.5 h-3.5" /> AKADEMIS SUITE
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans flex items-center gap-2">
              Asisten Capaian <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Literasi & Numerasi</span>
            </h2>
            <p className="text-zinc-500 text-xs leading-relaxed font-sans">
              Pantau peta kompetensi literasi (membaca & menulis) dan numerasi (bilangan & spasial) murid Anda untuk menyusun strategi diferensiasi kelas merdeka yang selaras sempurna.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                localStorage.setItem("omega_litnum_students", JSON.stringify(students));
                triggerToast("✓ Berhasil Disimpan! Seluruh data capaian Literasi & Numerasi siswa telah disimpan secara permanen luring.");
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-black uppercase bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Save className="w-4 h-4 fill-black" /> SIMPAN DATA CAPAIAN
            </button>
            <button
              onClick={handleRequestAiDiagnose}
              disabled={students.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> ANALISIS DIAGNOSTIK AI
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 flex items-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-zinc-400" /> DOWNLOAD LAPORAN
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
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Jumlah Murid</span>
            <p className="text-xl font-black text-white">{students.length} <span className="text-xs text-zinc-650 font-normal">Siswa</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Indeks Literasi</span>
            <p className="text-xl font-black text-emerald-400">Lvl {classAvgLit}/5 <span className="text-xs text-zinc-650 font-normal">Rerata</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-[#f5a623] border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Indeks Numerasi</span>
            <p className="text-xl font-black text-amber-500">Lvl {classAvgNum}/5 <span className="text-xs text-zinc-650 font-normal">Rerata</span></p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-900 bg-[#060608] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500">Intervensi Khusus</span>
            <p className="text-xl font-black text-rose-450">{needInterventionCount} <span className="text-xs text-zinc-650 font-normal">Siswa</span></p>
          </div>
        </div>
      </div>

      {/* Interactive Student List / Kartu Input - Full Width */}
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-4">
          <div className="p-5 md:p-6 rounded-2xl border border-zinc-900 bg-[#060608] space-y-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.003)_1px,transparent_1px),linear-gradient(to_right,rgba(245,158,11,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3.5 relative z-10">
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded text-[8px] font-mono tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-extrabold">
                  Pengolah Lembar Evaluasi & Diagnostik
                </span>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-amber-500" /> DAFTAR CAPAIAN & EVALUASI MURID lURING
                </h3>
                <p className="text-[10px] text-zinc-500 font-sans">Kelola tingkat capaian literasi dasar & numerasi murid. Klik tombol Aksi/Edit untuk memperbarui profil kognitif.</p>
              </div>
              <button 
                onClick={handleOpenAddModal}
                className="px-3.5 py-2.5 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 shrink-0 self-start sm:self-center"
              >
                <Plus className="w-4 h-4 text-black stroke-[3]" /> TAMBAH DATA MURID
              </button>
            </div>

            {/* 📊 PERSENTASE CAPAIAN DIAGNOSTIK KELAS (UP-FRONT SUMMARY BAR) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-black/45 border border-zinc-900/60 relative z-10">
              <div className="space-y-1.5 border-r border-zinc-900/50 last:border-0 pr-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Persentase Literasi
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{((classAvgLit / 5) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(classAvgLit / 5) * 100}%` }}></div>
                </div>
                <p className="text-[9px] text-zinc-550 italic leading-none">Rerata Kognitif Kelas: Level {classAvgLit} dari 5.0 maksimal</p>
              </div>

              <div className="space-y-1.5 border-r border-zinc-900/50 last:border-0 px-1 sm:px-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" /> Persentase Numerasi
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{((classAvgNum / 5) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(classAvgNum / 5) * 100}%` }}></div>
                </div>
                <p className="text-[9px] text-zinc-550 italic leading-none">Rerata Kognitif Kelas: Level {classAvgNum} dari 5.0 maksimal</p>
              </div>

              <div className="space-y-1.5 px-1 sm:pl-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> Kemandirian Belajar
                  </span>
                  <span className="font-mono text-blue-400 font-bold">
                    {(100 - (needInterventionCount / (students.length || 1) * 100)).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${100 - (needInterventionCount / (students.length || 1) * 100)}%` }}></div>
                </div>
                <p className="text-[9px] text-zinc-550 italic leading-none">{students.length - needInterventionCount} dari {students.length} murid di atas ambang intervensi dasar</p>
              </div>
            </div>

            {/* TABEL LAPORAN INDIVIDU DENGAN KOLOM SPESIFIK & JELAS */}
            <div className="overflow-x-auto relative z-10 rounded-xl border border-zinc-900/60 bg-black/20">
              <table className="w-full text-left border-collapse table-auto min-w-[700px]">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[9.5px] font-mono uppercase text-zinc-450 tracking-wider">
                    <th className="py-3 px-3 text-center font-bold w-[4%]">No</th>
                    <th className="py-3 px-3.5 font-bold w-[25%]">Nama Lengkap Murid</th>
                    <th className="py-3 px-2 text-center font-bold w-[12%]">Lit: Membaca</th>
                    <th className="py-3 px-2 text-center font-bold w-[12%]">Lit: Menulis</th>
                    <th className="py-3 px-2 text-center font-bold w-[12%]">Num: Bilangan</th>
                    <th className="py-3 px-2 text-center font-bold w-[12%]">Num: Spasial</th>
                    <th className="py-3 px-2 text-center font-bold w-[8%]">Lvl Lit</th>
                    <th className="py-3 px-2 text-center font-bold w-[8%]">Lvl Num</th>
                    <th className="py-3 px-2 text-center font-bold w-[14%]">Status Kognitif</th>
                    <th className="py-3 px-3 text-right font-bold w-[10%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-950 font-sans text-xs">
                  {students.map((s, idx) => {
                    const avgLit = calculateAverage(s, "literasi");
                    const avgNum = calculateAverage(s, "numerasi");
                    const combined = calculateAverage(s, "semua");
                    const status = getProficiencyCategory(combined);

                    return (
                      <tr key={s.id} className="hover:bg-zinc-900/30 transition-all border-b border-zinc-950 last:border-0">
                        <td className="py-2.5 px-1.5 text-center">
                          <span className="inline-flex w-5.5 h-5.5 rounded-full items-center justify-center font-mono text-[9px] font-black bg-black border border-yellow-400 text-yellow-400 select-none shadow-[0_0_8px_rgba(250,204,21,0.2)]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-left">
                          <span className="font-extrabold text-white block text-[13px]">{s.name}</span>
                          <span className={`inline-flex items-center gap-1 text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-md mt-1 border uppercase ${
                            s.gender === "L" 
                              ? "bg-blue-500/10 border-blue-500/15 text-blue-400" 
                              : "bg-pink-500/10 border-pink-500/15 text-pink-400"
                          }`}>
                            {s.gender === "L" ? "L (Laki-laki)" : "P (Perempuan)"}
                          </span>
                        </td>
                        {/* Membaca */}
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black border ${
                            s.litReading === 5 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            s.litReading === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            s.litReading === 3 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            s.litReading === 2 ? "bg-orange-500/10 border-orange-500/20 text-orange-450" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          }`}>
                            {s.litReading}
                          </span>
                        </td>
                        {/* Menulis */}
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black border ${
                            s.litWriting === 5 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            s.litWriting === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            s.litWriting === 3 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            s.litWriting === 2 ? "bg-orange-500/10 border-orange-500/20 text-orange-450" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          }`}>
                            {s.litWriting}
                          </span>
                        </td>
                        {/* Bilangan */}
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black border ${
                            s.numCounting === 5 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            s.numCounting === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            s.numCounting === 3 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            s.numCounting === 2 ? "bg-orange-500/10 border-orange-500/20 text-orange-450" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          }`}>
                            {s.numCounting}
                          </span>
                        </td>
                        {/* Spasial */}
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black border ${
                            s.numAnalysis === 5 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            s.numAnalysis === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            s.numAnalysis === 3 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            s.numAnalysis === 2 ? "bg-orange-500/10 border-orange-500/20 text-orange-450" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          }`}>
                            {s.numAnalysis}
                          </span>
                        </td>
                        {/* Lvl Lit (%) */}
                        <td className="py-3 px-2 text-center font-mono">
                          <div className="flex flex-col items-center">
                            <span className="font-extrabold text-emerald-400 text-[13px]">{((avgLit / 5) * 100).toFixed(0)}%</span>
                            <span className="text-[9px] text-zinc-500 mt-0.5">Lvl {avgLit}</span>
                          </div>
                        </td>
                        {/* Lvl Num (%) */}
                        <td className="py-3 px-2 text-center font-mono">
                          <div className="flex flex-col items-center">
                            <span className="font-extrabold text-amber-400 text-[13px]">{((avgNum / 5) * 100).toFixed(0)}%</span>
                            <span className="text-[9px] text-zinc-500 mt-0.5">Lvl {avgNum}</span>
                          </div>
                        </td>
                        {/* Kategori status */}
                        <td className="py-3 px-2 text-center select-none">
                          <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${status.color}`}>
                            {status.label.split(" (")[0]}
                          </span>
                        </td>
                        {/* Aksi */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleOpenEditModal(s)}
                              className="p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-850 hover:border-zinc-700 transition"
                              title="Edit Data Membaca/Tulis/Numerasi"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(s.id)}
                              className="p-1.5 bg-rose-500/5 hover:bg-rose-500/20 text-rose-400/90 hover:text-rose-450 rounded-lg border border-rose-500/15 hover:border-rose-500/30 transition-all"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-zinc-500 tracking-wider uppercase font-mono text-[10px] bg-black/10">
                        Tidak ada siswa terdaftar. Klik "+ TAMBAH DATA MURID" di atas untuk mengisi data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 VISUALISASI PERSENTASE & CAPAIAN KOMPETENSI KELAS (DILETAKAN DI BAWAH KARTU INPUT) */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" /> DIAGRAM PERSENTASE & STATISTIK CAPAIAN
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans">Visualisasi sebaran kognitif murid berdasarkan level kompetensi standar nasional</p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 self-start">
            <button
              onClick={() => setChartTypeVal("overall")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                chartTypeVal === "overall"
                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-400 hover:text-white bg-zinc-90"
              }`}
            >
              📊 Sebaran Level (%)
            </button>
            <button
              onClick={() => setChartTypeVal("gender")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                chartTypeVal === "gender"
                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-400 hover:text-white bg-zinc-90"
              }`}
            >
              👫 Perbandingan Gender
            </button>
            <button
              onClick={() => setChartTypeVal("subskills")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                chartTypeVal === "subskills"
                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-400 hover:text-white bg-zinc-90"
              }`}
            >
              ⚡ Rerata Sub-Asesmen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart visual container */}
          <div className="lg:col-span-7 h-[260px] w-full flex items-center justify-center bg-black/40 rounded-xl border border-zinc-900/50 p-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartTypeVal === "overall" ? (
                <BarChart data={chartDataOverall} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                  <YAxis stroke="#71717a" fontSize={9} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#fbbf24', fontSize: '11px' }}
                  />
                  <Bar dataKey="Siswa" fill="#f5a623" radius={[4, 4, 0, 0]}>
                    {chartDataOverall.map((entry, index) => {
                      const colors = ["#f43f5e", "#f97316", "#f59e0b", "#3b82f6", "#10b981"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              ) : chartTypeVal === "gender" ? (
                <BarChart data={chartDataGender} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                  <YAxis stroke="#71717a" fontSize={9} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Literasi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Numerasi" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={chartDataSubskills} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} />
                  <YAxis stroke="#71717a" fontSize={9} domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ color: '#3b82f6', fontSize: '11px' }}
                  />
                  <Bar dataKey="Nilai" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {chartDataSubskills.map((entry, index) => {
                      const colors = ["#10b981", "#34d399", "#f59e0b", "#fbbf24"];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Details & descriptive breakdowns side-list */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-extrabold text-zinc-500">Ringkasan Interpretasi Diagram</h4>
            
            {chartTypeVal === "overall" ? (
              <div className="space-y-2.5">
                {chartDataOverall.map((item, idx) => {
                  const barColors = ["bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-zinc-350">
                        <span className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${barColors[idx]}`}></span>
                          <span className="font-bold text-white">{item.desc}</span>
                        </span>
                        <span className="font-mono text-zinc-500">{item.Siswa} Siswa ({item.persentase}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                        <div className={`h-full ${barColors[idx]}`} style={{ width: `${item.persentase}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : chartTypeVal === "gender" ? (
              <div className="space-y-3.5 text-xs text-zinc-350">
                <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-900/60 space-y-2.5">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-blue-400">🏡 CAPAIAN KELOMPOK SISWA LAKI-LAKI</p>
                  <p className="leading-relaxed">
                    Siswa laki-laki merata di indeks <strong className="text-white">Literasi: Level {boyLit}</strong> dan <strong className="text-white">Numerasi: Level {boyNum}</strong>.
                    Pola kemampuan numerasi siswa luring berkembang di level {boyNum >= 3.5 ? "Cakap/Mahir" : "Bimbingan/Berkembang"}.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-900/60 space-y-2.5">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-pink-400">🌸 CAPAIAN KELOMPOK SISWA PEREMPUAN</p>
                  <p className="leading-relaxed">
                    Siswa perempuan berada di indeks <strong className="text-white">Literasi: Level {girlLit}</strong> dan <strong className="text-white">Numerasi: Level {girlNum}</strong>.
                    Pencapaian ini melambangkan {girlLit > boyLit ? "keunggulan relatif membaca" : "kesetaraan kognitif kelas"} yang patut dikembangkan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-zinc-350">
                <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-900/60 space-y-3">
                  <p className="font-bold text-white uppercase text-[10px] tracking-widest text-[#f5a623]">⚡ DETAIL SKOR SUB-DIAGNOSTIK</p>
                  <div className="space-y-2 divide-y divide-zinc-950">
                    <div className="flex justify-between py-1.5">
                      <span>Literasi Membaca (Rerata):</span>
                      <strong className="text-emerald-400 font-mono">Level {litReadingAvg}/5</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Literasi Menulis (Rerata):</span>
                      <strong className="text-emerald-400 font-mono">Level {litWritingAvg}/5</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Numerasi Bilangan (Rerata):</span>
                      <strong className="text-amber-500 font-mono">Level {numCountingAvg}/5</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Numerasi Spasial (Rerata):</span>
                      <strong className="text-amber-500 font-mono">Level {numAnalysisAvg}/5</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💡 PANDUAN REKOMENDASI PEDAGOGI TIDAK TERCETAK (KHUSUS GURU) */}
      {(() => {
        const { jenjang, numericKelas } = detectJenjangAndKelas(localStorage.getItem("kosp_fase_kelas") || kelas);
        const recs = getDynamicRecommendations(jenjang, numericKelas);
        
        return (
          <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-4">
            <div className="border-b border-zinc-900 pb-3">
              <span className="px-2.5 py-0.5 rounded text-[8.5px] font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                Khusus Guru • Offline-Only
              </span>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2 mt-1.5">
                <Layers className="w-4 h-4 text-amber-500" /> KONSULTASI PEDAGOGIS JALUR PEMBELAJARAN
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed font-sans">
                Rekomendasi taktis luring yang disesuaikan otomatis berdasarkan jenjang <strong className="text-zinc-400">{jenjang}</strong> dan tingkatan <strong className="text-zinc-400">Kelas {numericKelas}</strong> (KOSP fase aktual: {localStorage.getItem("kosp_fase_kelas") || kelas}) untuk melayani disparitas capaian murid. <span className="text-rose-450 italic font-bold">Rekomendasi mandiri guru ini tidak ikut dicetak atau diunduh ke PDF laporan.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Box Level 1 & 2 */}
              <div className="p-4 rounded-xl border border-zinc-900/60 bg-black/30 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Mengatasi Murid di Level 1 & 2 (Intervensi Khusus)
                </div>
                <div className="space-y-3.5 text-zinc-400 leading-relaxed font-sans">
                  <div className="space-y-1.5">
                    <p className="text-white font-bold uppercase text-[9px] tracking-wider text-emerald-400">📚 Fokus Literasi Dasar:</p>
                    <ul className="list-disc list-inside pl-1 space-y-1.5">
                      {recs.level12.literasi.map((item, idx) => <li key={idx} className="leading-relaxed">{item}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-white font-bold uppercase text-[9px] tracking-wider text-amber-500">➕ Fokus Numerasi Dasar:</p>
                    <ul className="list-disc list-inside pl-1 space-y-1.5">
                      {recs.level12.numerasi.map((item, idx) => <li key={idx} className="leading-relaxed">{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Box Level 3, 4, 5 */}
              <div className="p-4 rounded-xl border border-zinc-900/60 bg-black/30 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pengayaan & Akselerasi Murid Level 3, 4 & 5 (Berdaya)
                </div>
                <div className="space-y-3.5 text-zinc-400 leading-relaxed font-sans">
                  <div className="space-y-1.5">
                    <p className="text-white font-bold uppercase text-[9px] tracking-wider text-emerald-400">📚 Pendampingan Literasi Eksploratif:</p>
                    <ul className="list-disc list-inside pl-1 space-y-1.5">
                      {recs.level345.literasi.map((item, idx) => <li key={idx} className="leading-relaxed">{item}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-white font-bold uppercase text-[9px] tracking-wider text-amber-500">➕ Pendampingan Numerasi Berpikir Kritis:</p>
                    <ul className="list-disc list-inside pl-1 space-y-1.5">
                      {recs.level345.numerasi.map((item, idx) => <li key={idx} className="leading-relaxed">{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* AI Diagnostik & Analysis Output Board */}
      {aiReport && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" /> DIAGNOSTIK & PEDAGOGI DIFERENSIASI AI
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

          {renderTabContent()}
        </div>
      )}

      {/* Add / Edit Student modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-6 sm:pt-12 md:pt-16">
          <div className="bg-[#0b0c10] border border-zinc-850 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans space-y-4 my-auto sm:my-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" /> {editingStudentId ? "SUNTING DATA MURID" : "TAMBAH MURID BARU"}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">Nama Lengkap Siswa</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-900 bg-black text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 h-9"
                  />
                </div>

                <div className="bg-black/40 border border-zinc-900 p-2.5 rounded-xl h-9 flex items-center justify-between px-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Jenis Kelamin</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={modalGender === "L"} 
                        onChange={() => setModalGender("L")}
                        className="accent-amber-500"
                      /> Laki-laki (L)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 font-medium cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        checked={modalGender === "P"} 
                        onChange={() => setModalGender("P")}
                        className="accent-amber-500"
                      /> Perempuan (P)
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-3 space-y-3">
                <span className="block text-[10px] font-extrabold text-[#f5a623] uppercase tracking-widest font-mono">Pilihan Level Capaian (Level 1 s.d. 5)</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Literasi: Membaca */}
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Literasi: Membaca</label>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                          Level {modalLitReading} / 5
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isSelected = modalLitReading === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setModalLitReading(lvl)}
                              className={`py-1.5 text-center text-xs font-black rounded-lg border transition-all ${
                                isSelected 
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                                  : "bg-zinc-950 border-zinc-900/80 hover:border-zinc-850 text-zinc-450 hover:text-white"
                              }`}
                            >
                              L-{lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-950/80 text-[10px] space-y-0.5 min-h-[48px] flex flex-col justify-center">
                      <span className="text-zinc-200 font-bold block leading-tight">
                        {LITERASI_MEMBACA_LEVELS.find(lvl => lvl.level === Number(modalLitReading))?.label}
                      </span>
                      <p className="text-zinc-550 leading-normal text-[9px]">
                        {LITERASI_MEMBACA_LEVELS.find(lvl => lvl.level === Number(modalLitReading))?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Literasi: Menulis */}
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Literasi: Menulis</label>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                          Level {modalLitWriting} / 5
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isSelected = modalLitWriting === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setModalLitWriting(lvl)}
                              className={`py-1.5 text-center text-xs font-black rounded-lg border transition-all ${
                                isSelected 
                                  ? "bg-cyan-500/15 border-cyan-500 text-cyan-400 font-extrabold shadow-[0_0_10px_rgba(34,211,238,0.15)]" 
                                  : "bg-zinc-950 border-zinc-900/80 hover:border-zinc-850 text-zinc-450 hover:text-white"
                              }`}
                            >
                              L-{lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-950/80 text-[10px] space-y-0.5 min-h-[48px] flex flex-col justify-center">
                      <span className="text-zinc-200 font-bold block leading-tight">
                        {LITERASI_MENULIS_LEVELS.find(lvl => lvl.level === Number(modalLitWriting))?.label}
                      </span>
                      <p className="text-zinc-550 leading-normal text-[9px]">
                        {LITERASI_MENULIS_LEVELS.find(lvl => lvl.level === Number(modalLitWriting))?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Numerasi: Bilangan */}
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Numerasi: Bilangan</label>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                          Level {modalNumCounting} / 5
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isSelected = modalNumCounting === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setModalNumCounting(lvl)}
                              className={`py-1.5 text-center text-xs font-black rounded-lg border transition-all ${
                                isSelected 
                                  ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
                                  : "bg-zinc-950 border-zinc-900/80 hover:border-zinc-850 text-zinc-450 hover:text-white"
                              }`}
                            >
                              L-{lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-950/80 text-[10px] space-y-0.5 min-h-[48px] flex flex-col justify-center">
                      <span className="text-zinc-200 font-bold block leading-tight">
                        {NUMERASI_BILANGAN_LEVELS.find(lvl => lvl.level === Number(modalNumCounting))?.label}
                      </span>
                      <p className="text-zinc-550 leading-normal text-[9px]">
                        {NUMERASI_BILANGAN_LEVELS.find(lvl => lvl.level === Number(modalNumCounting))?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Numerasi: Analisis / Spasial */}
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-black/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">Numerasi: Analisis / Spasial</label>
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-mono">
                          Level {modalNumAnalysis} / 5
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isSelected = modalNumAnalysis === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setModalNumAnalysis(lvl)}
                              className={`py-1.5 text-center text-xs font-black rounded-lg border transition-all ${
                                isSelected 
                                  ? "bg-purple-500/15 border-purple-500 text-purple-400 font-extrabold shadow-[0_0_10px_rgba(168,85,247,0.15)]" 
                                  : "bg-zinc-950 border-zinc-900/80 hover:border-zinc-850 text-zinc-450 hover:text-white"
                              }`}
                            >
                              L-{lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-950/80 text-[10px] space-y-0.5 min-h-[48px] flex flex-col justify-center">
                      <span className="text-zinc-200 font-bold block leading-tight">
                        {NUMERASI_ANALISIS_LEVELS.find(lvl => lvl.level === Number(modalNumAnalysis))?.label}
                      </span>
                      <p className="text-zinc-550 leading-normal text-[9px]">
                        {NUMERASI_ANALISIS_LEVELS.find(lvl => lvl.level === Number(modalNumAnalysis))?.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-zinc-900 pt-3.5">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-405 transition"
                >
                  BATAL
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold uppercase rounded-xl bg-[#f5a623] hover:bg-[#e0951a] text-black transition active:scale-95"
                >
                  SIMPAN
                </button>
              </div>
            </form>
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
