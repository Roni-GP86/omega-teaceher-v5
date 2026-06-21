import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ShieldAlert, 
  Check, 
  Save, 
  Printer, 
  Plus, 
  Trash2, 
  Info,
  Layers,
  Award,
  Users,
  Brain,
  MessageSquare,
  Sparkles,
  School,
  Lock,
  Compass,
  FileText,
  Download,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as XLSX from "xlsx";
// @ts-ignore
import XLSXStyle from "xlsx-js-style";
import { getTutWuriHandayaniLogo, getKemenagLogo } from "../utils/logoGenerator";
import { synchronizeLegacyStudentRosters } from "../utils/studentSync";

interface SubjectGrade {
  id: number;
  name: string;
  materi1: string;
  score1: number;
  materi2: string;
  score2: number;
}

const defaultGrades: SubjectGrade[] = [
  {
    id: 1,
    name: "Pendidikan Agama dan Budi Pekerti",
    materi1: "memahami bahwa Yesus mewartakan Kerajaan Allah melalui mukjizat-mukjizat-Nya",
    score1: 76,
    materi2: "memahami kisah hidup para tokoh iman Kristiani dalam menyebarkan ajaran kasih",
    score2: 66
  },
  {
    id: 2,
    name: "Pendidikan Pancasila",
    materi1: "mengidentifikasi bentuk norma di lingkungan sekolah",
    score1: 80,
    materi2: "menghargai keberagaman melalui sikap mencintai sesama dan lingkungannya",
    score2: 66
  },
  {
    id: 3,
    name: "Bahasa Indonesia",
    materi1: "memilih kata yang sesuai norma sosial budaya",
    score1: 81,
    materi2: "menyampaikan informasi secara lisan untuk tujuan tertentu",
    score2: 65
  },
  {
    id: 4,
    name: "Matematika",
    materi1: "membandingkan dua pecahan dengan pembilang satu",
    score1: 75,
    materi2: "membandingkan dua pecahan dengan penyebut yang sama",
    score2: 61
  },
  {
    id: 5,
    name: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
    materi1: "mengidentifikasi ragam transformasi energi pada kehidupan sehari-hari",
    score1: 82,
    materi2: "menganalisis siklus air dan dampaknya pada kehidupan bumi",
    score2: 66
  },
  {
    id: 6,
    name: "Seni Rupa",
    materi1: "membuat satu karya seni kerajinan dengan memanfaatkan bahan lokal",
    score1: 86,
    materi2: "mengenal berbagai macam warna dan garis dasar seni dekoratif",
    score2: 76
  },
  {
    id: 7,
    name: "Pendidikan Jasmani, Olahraga dan Kesehatan",
    materi1: "menjelaskan dan mampu mempraktikkan pola gerak dominan senam",
    score1: 87,
    materi2: "mempraktikkan pengenalan aktivitas air secara aman",
    score2: 75
  },
  {
    id: 8,
    name: "Bahasa Inggris",
    materi1: "menggunakan bahasa Inggris untuk berinteraksi di dalam kelas",
    score1: 84,
    materi2: "membaca teks cerita sederhana dengan intonasi yang tepat",
    score2: 74
  },
  {
    id: 9,
    name: "Muatan Lokal (Kerajinan Tangan)",
    materi1: "membuat prakarya berbahan alam organik",
    score1: 85,
    materi2: "membuat anyaman bambu atau jerami tradisional sederhana",
    score2: 75
  }
];

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
  grades: SubjectGrade[];
  photo?: string;
}

const DEFAULT_STUDENTS: Omit<Student, "grades">[] = [
  {
    id: "3155685577",
    namaLengkap: "FLORIDA BANUSU",
    panggilan: "Jian",
    nisnNis: "3155685577/258",
    tempatLahir: "Oehoso",
    tanggalLahir: "21 Januari 2015",
    jenisKelamin: "Perempuan",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Florianus Banusu",
    pekerjaanAyah: "Tani",
    namaIbu: "Mincesia Kause",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "2",
    izin: "0",
    alpa: "3",
    ekstraNama: "Olahraga",
    ekstraKet: "Sangat baik dalam ketahanan fisik",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Secara keseluruhan dalam segi akademis, Jian sudah bagus dan cukup baik. Tingkatkan lagi prestasi dengan rajin belajar supaya nilai yang dicapai lebih baik dari pada nilai sebelumnya. Lebih semangat lagi belajarnya"
  },
  {
    id: "0164310989",
    namaLengkap: "FEBRIANUS HANOE",
    panggilan: "Defan",
    nisnNis: "0164310989/276",
    tempatLahir: "Maubesi",
    tanggalLahir: "26 Februari 2016",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Fatubai",
    namaAyah: "Ferdinandus Buatefa",
    pekerjaanAyah: "Wiraswasta",
    namaIbu: "Maria Fatima buatefa",
    pekerjaanIbu: "Pegawai Swasta",
    ortuJalan: "Fatubai",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "0",
    izin: "1",
    alpa: "1",
    ekstraNama: "Kesenian",
    ekstraKet: "Aktif mengkreasikan kerajinan bambu",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Defan menunjukkan performa akademis yang luar biasa di semester ini. Kemampuan motorik dan tingkat kognitif dalam berhitung sudah sangat unggul. Selamat dan sukses selalu!"
  },
  {
    id: "3148133459",
    namaLengkap: "FRANSISKUS PUATERO",
    panggilan: "Notger",
    nisnNis: "3148133459/256",
    tempatLahir: "Oehoso",
    tanggalLahir: "29 November 2014",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Odifianus Mei",
    pekerjaanAyah: "Tani",
    namaIbu: "Aurelia Sengkoen",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "1",
    izin: "2",
    alpa: "0",
    ekstraNama: "Olahraga",
    ekstraKet: "Gemar berolahraga dan sangat kompak",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Notger memiliki semangat belajar yang menonjol terutama dalam mata pelajaran IPAS dan PJOK. Kembangkan terus bakatmu di kelas berikutnya."
  },
  {
    id: "3157174153",
    namaLengkap: "MATEUS KAUSE",
    panggilan: "Rizki",
    nisnNis: "3157174153/-",
    tempatLahir: "Oehoso",
    tanggalLahir: "09 Juni 2016",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Nikodemus Manus",
    pekerjaanAyah: "Tani",
    namaIbu: "Metriana Leu",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Fafinesu A",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "0",
    izin: "0",
    alpa: "0",
    ekstraNama: "Pramuka",
    ekstraKet: "Aktif mengikuti latihan kepramukaan",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Rizki menunjukkan kedisiplinan tingkat tinggi dengan kehadiran 100%. Kemampuan komunikasinya berkembang pesat semester ini. Pertahankan prestasimu!"
  },
  {
    id: "3151880167",
    namaLengkap: "NATALIA BUATEFA",
    panggilan: "Nata",
    nisnNis: "3151880167/-",
    tempatLahir: "Fatubai",
    tanggalLahir: "21 November 2015",
    jenisKelamin: "Perempuan",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Fatubai",
    namaAyah: "Lambertus Fina",
    pekerjaanAyah: "Tani",
    namaIbu: "Venidora Noetef",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Fatubai",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "1",
    izin: "1",
    alpa: "2",
    ekstraNama: "Kesenian",
    ekstraKet: "Sangat antusias dalam melukis kerajinan tangan",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Nata adalah anak yang sopan dan rajin membantu teman kelas. Pembawaannya ceria dan memiliki imajinasi kritis yang luar biasa di mata pelajaran Seni Rupa."
  },
  {
    id: "norbertus_hanoe",
    namaLengkap: "NORBERTUS HANOE",
    panggilan: "Noger",
    nisnNis: "-/245",
    tempatLahir: "Fatubai",
    tanggalLahir: "22 Juni 2025",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Fatubai",
    namaAyah: "Wilhelmus Leu",
    pekerjaanAyah: "Tani",
    namaIbu: "Hendrika Tane",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Fatubai",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "3",
    izin: "0",
    alpa: "4",
    ekstraNama: "Olahraga",
    ekstraKet: "Pemain sepakbola tim kelas yang lincah",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Noger memiliki bakat fisik yang baik. Tetap tekun belajar di rumah agar hasil ujian semester depan bisa lebih memuaskan lagi."
  },
  {
    id: "3141294287",
    namaLengkap: "PASKALIS HANOE",
    panggilan: "Haki",
    nisnNis: "3141294287/261",
    tempatLahir: "Fatubai",
    tanggalLahir: "04 Maret 2015",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Fatubai",
    namaAyah: "Alfridus Luis",
    pekerjaanAyah: "Tani",
    namaIbu: "Imelda Sau",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Fatubai",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "1",
    izin: "1",
    alpa: "0",
    ekstraNama: "Pramuka",
    ekstraKet: "Memiliki kepemimpinan regu yang andal",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Haki menunjukkan sikap tanggung jawab yang tinggi di kelas. Kemampuannya memimpin kelompok diskusi sangat membantu dalam belajar kelompok."
  },
  {
    id: "3157126495",
    namaLengkap: "PETROSIA KONO ARAN",
    panggilan: "Eci",
    nisnNis: "3157126495/-",
    tempatLahir: "Fatubai",
    tanggalLahir: "24 Juli 2015",
    jenisKelamin: "Perempuan",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Fransiskus Siki Aran",
    pekerjaanAyah: "Tani",
    namaIbu: "Elisabeth Maumabe",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "2",
    izin: "0",
    alpa: "1",
    ekstraNama: "Kesenian",
    ekstraKet: "Aktif mengkreasikan anyaman dari daun lontar",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Eci memiliki rasa ingin tahu yang besar. Nilai rapor di semester ini sudah memuaskan, pertahankan di kelas V!"
  },
  {
    id: "0154241594",
    namaLengkap: "SYRILUS ALEXANDER KOSAT",
    panggilan: "Alan",
    nisnNis: "0154241594/-",
    tempatLahir: "Maubesi",
    tanggalLahir: "13 Juni 2015",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Fatubai",
    namaAyah: "Primus Kosat",
    pekerjaanAyah: "Pegawai Swasta",
    namaIbu: "Yulitha Malafu",
    pekerjaanIbu: "ASN/PPPK",
    ortuJalan: "Fatubai",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "0",
    izin: "0",
    alpa: "0",
    ekstraNama: "Pramuka",
    ekstraKet: "Sangat mandiri dan disiplin",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Alan menunjukkan keterampilan analisis logika matematis yang cemerlang. Sangat berbakat di bidang eksakta!"
  },
  {
    id: "3157245047",
    namaLengkap: "SERILIUS BUATEFA",
    panggilan: "Seri",
    nisnNis: "3157245047/263",
    tempatLahir: "Oehoso",
    tanggalLahir: "06 Juni 2015",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Lasarus Abi",
    pekerjaanAyah: "Tani",
    namaIbu: "Maria R. Buatefa",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "1",
    izin: "2",
    alpa: "0",
    ekstraNama: "Olahraga",
    ekstraKet: "Latihan fisik lempar tangkap bola sangat baik",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Seri adalah pribadi tenang yang supel dan mudah bergaul. Nilai akademik yang prima mencerminkan kerja keras belajarnya selama ini."
  },
  {
    id: "yohanes_buatefa",
    namaLengkap: "YOHANES BUATEFA",
    panggilan: "Marton",
    nisnNis: "-/260",
    tempatLahir: "Oehoso",
    tanggalLahir: "04 Maret 2015",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Ainmolo",
    namaAyah: "Yoseph Buatefa",
    pekerjaanAyah: "Tani",
    namaIbu: "Yulita Hati",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Ainmolo",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "4",
    izin: "1",
    alpa: "0",
    ekstraNama: "Olahraga",
    ekstraKet: "Berpartisipasi aktif dalam kegiatan senam",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Marton menunjukkan peningkatan pemahaman sosiokultural yang pesat pada pelajaran Pendidikan Pancasila. Terus tingkatkan belajar."
  },
  {
    id: "alfonsius_misa",
    namaLengkap: "ALFONSIUS MISA",
    panggilan: "Alfons",
    nisnNis: "-/-",
    tempatLahir: "Punya Mas",
    tanggalLahir: "27 April 2013",
    jenisKelamin: "Laki-laki",
    agama: "Katolik",
    pendidikanSebelum: "TK",
    alamatSiswa: "Ainmolo",
    namaAyah: "Alexander Keke",
    pekerjaanAyah: "Tani",
    namaIbu: "Margaretha Seo",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Ainmolo",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    sakit: "0",
    izin: "1",
    alpa: "2",
    ekstraNama: "Kesenian",
    ekstraKet: "Suka menyanyi lagu tradisional",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Alfons cerdas dalam memecahkan soal cerita matematika secara mandiri. Sangat membanggakan, sukses selalu!"
  }
];

export function getInitialStudents(): Student[] {
  return DEFAULT_STUDENTS.map(st => ({
    ...st,
    grades: JSON.parse(JSON.stringify(defaultGrades))
  })) as Student[];
}

export default function StudentProfile() {
  const [activeSubTab, setActiveSubTab] = useState<'biodata' | 'nilai' | 'ekstra' | 'catatan' | 'print_rapor'>('biodata');
  const [printMode, setPrintMode] = useState<'full' | 'cover' | 'content'>('full');
  const [previewTab, setPreviewTab] = useState<'cover' | 'content'>('cover');

  const KOSP_SUBJECT_MAPPING: Record<string, { name: string; fallbackMateri1: string; fallbackMateri2: string }> = {
    agamaIslam: {
      name: "Pendidikan Agama Islam dan Budi Pekerti",
      fallbackMateri1: "memahami tata cara bersuci, rukun Islam, dan rukun Iman",
      fallbackMateri2: "meneladani kisah keteladanan para Nabi terkemuka dalam ibadah sehari-hari"
    },
    agamaKristen: {
      name: "Pendidikan Agama Kristen dan Budi Pekerti",
      fallbackMateri1: "memahami kehadiran Allah dalam alam semesta dan perlindungan-Nya",
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

  const getSubjectRaporInfo = (key: string) => {
    if (KOSP_SUBJECT_MAPPING[key]) return KOSP_SUBJECT_MAPPING[key];
    let label = key;
    if (key.startsWith("custom_")) {
      const savedCustom = localStorage.getItem("kosp_custom_subjects");
      if (savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (parsed[key] && parsed[key].label) label = parsed[key].label;
        } catch (e) {}
      }
    }
    return {
      name: label,
      fallbackMateri1: "memahami lingkup asasi kompetensi dasar tujuan pembelajaran materi kesatu",
      fallbackMateri2: "menerapkan kaidah konseptual capaian pembelajaran pokok bahasan kedua"
    };
  };

  const fetchRealGradeFromDaftarNilai = (subjectKey: string, studentName: string) => {
    let mapelId = "";
    if (subjectKey === "matematika") mapelId = "Matematika";
    else if (subjectKey === "indonesia") mapelId = "Bahasa Indonesia";
    else if (subjectKey === "ipas") mapelId = "IPAS";
    else if (subjectKey === "pancasila") mapelId = "Pendidikan Pancasila";
    else if (subjectKey === "inggris") mapelId = "Bahasa Inggris";
    else if (subjectKey === "pjok") mapelId = "PJOK";
    else if (["seniRupa", "seniMusik", "seniTari", "seniTeater"].includes(subjectKey)) mapelId = "Seni Budaya";

    if (!mapelId) return null;

    const rawData = localStorage.getItem(`omega_daftar_nilai_students_${mapelId}`);
    if (rawData) {
      try {
        const list = JSON.parse(rawData);
        if (Array.isArray(list)) {
          const match = list.find((s: any) => s && s.name && s.name.trim().toLowerCase() === studentName.trim().toLowerCase());
          if (match) {
            const activeSemesterNum: number = 2; // Rapor Merdeka asks for Semester 1 or 2
            const semKey = activeSemesterNum === 1 ? "sem1" : "sem2";
            const semData = match[semKey];
            if (semData) {
              const keys = ["tugas1", "tugas2", "tugas3", "tugas4"];
              let tugasSum = 0, tugasCount = 0;
              if (semData.tugas) {
                keys.forEach(k => {
                  const v = semData.tugas[k];
                  if (v !== undefined && v !== "") {
                    tugasSum += Number(v);
                    tugasCount++;
                  }
                });
              }
              const avgTugas = tugasCount > 0 ? (tugasSum / tugasCount) : 0;

              const temaKeys = ["tema1", "tema2", "tema3"];
              let temaSum = 0, temaCount = 0;
              if (semData.sumatifTopik) {
                temaKeys.forEach(k => {
                  const v = semData.sumatifTopik[k];
                  if (v !== undefined && v !== "") {
                    temaSum += Number(v);
                    temaCount++;
                  }
                });
              }
              const avgSum = temaCount > 0 ? (temaSum / temaCount) : 0;

              const stsVal = semData.sts !== undefined && semData.sts !== "" ? Number(semData.sts) : 0;
              const sasVal = semData.sas !== undefined && semData.sas !== "" ? Number(semData.sas) : 0;

              // standard Kurikulum Merdeka weights: tugas 30%, sumatif 30%, sts 20%, sas 20%
              const wTugas = 30, wSumatif = 30, wSts = 20, wSas = 20;
              const totalW = wTugas + wSumatif + wSts + wSas;
              const finalScore = totalW > 0 ? (
                (avgTugas * wTugas) + 
                (avgSum * wSumatif) + 
                (stsVal * wSts) + 
                (sasVal * wSas)
              ) / totalW : 0;

              return {
                score1: Math.round(avgTugas) || 75,
                score2: Math.round(avgSum) || 78,
                score: Math.round(finalScore) || 76
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

  const getActiveGradeNum = () => {
    const raw = schoolProfile.faseKelas || "";
    if (raw.includes("VI") || raw.includes("6")) return 6;
    if (raw.includes("IV") || raw.includes("4")) return 4;
    if (raw.includes("V") || raw.includes("5")) return 5;
    if (raw.includes("III") || raw.includes("3")) return 3;
    if (raw.includes("II") || raw.includes("2")) return 2;
    if (raw.includes("I") || raw.includes("1")) return 1;
    return 4;
  };

  const getKospSelectedSubjectsForRapor = () => {
    const gradeNum = getActiveGradeNum();
    const kospConfigsRaw = localStorage.getItem("kosp_class_configs");
    let activeKeys: string[] = [];
    if (kospConfigsRaw) {
      try {
        const parsed = JSON.parse(kospConfigsRaw);
        const gradeConfig = parsed[gradeNum];
        if (gradeConfig && gradeConfig.subjects) {
          activeKeys = Object.keys(gradeConfig.subjects).filter(key => gradeConfig.subjects[key]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (activeKeys.length === 0) {
      activeKeys = ["agamaKatolik", "pancasila", "indonesia", "matematika", "ipas", "seniRupa", "pjok", "inggris"];
    }

    const studentReligion = (studentBio.agama || "Katolik").toLowerCase();
    let finalKeys = activeKeys.filter(key => {
      if (key.startsWith("agama")) {
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

    const hasReligionSubject = finalKeys.some(key => key.startsWith("agama"));
    if (!hasReligionSubject) {
      if (studentReligion.includes("islam")) finalKeys.unshift("agamaIslam");
      else if (studentReligion.includes("kristen") || studentReligion.includes("protestan")) finalKeys.unshift("agamaKristen");
      else finalKeys.unshift("agamaKatolik");
    }

    return finalKeys;
  };

  const getKospSelectedExtras = () => {
    const gradeNum = getActiveGradeNum();
    const kospConfigsRaw = localStorage.getItem("kosp_class_configs");
    let activeExtras: string[] = [];
    if (kospConfigsRaw) {
      try {
        const parsed = JSON.parse(kospConfigsRaw);
        const gradeConfig = parsed[gradeNum];
        if (gradeConfig && gradeConfig.extracurriculars) {
          activeExtras = Object.keys(gradeConfig.extracurriculars).filter(key => gradeConfig.extracurriculars[key]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (activeExtras.length === 0) {
      activeExtras = ["pramuka", "olahraga", "seniTari"];
    }
    return activeExtras;
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

  const getSubjectAtpMapping = (key: string) => {
    switch (key) {
      case "matematika":
        return {
          materi1: "mengidentifikasi pecahan senilai menggunakan representasi gambar visual",
          materi2: "menyelesaikan perkalian dan pembagian bilangan cacah sampai dengan 100"
        };
      case "indonesia":
        return {
          materi1: "mengidentifikasi gagasan pokok narasi fiksi maupun non-fiksi",
          materi2: "menulis deskripsi runtut tentang peristiwa sosial atau budaya sekitar"
        };
      case "ipas":
        return {
          materi1: "mengidentifikasi transformasi jenis energi pada alat sehari-hari",
          materi2: "menganalisis proses siklus air dan dampaknya bagi bumi secara fungsional"
        };
      case "pancasila":
        return {
          materi1: "mengidentifikasi makna simbol sila Pancasila di luhur gotong royong",
          materi2: "mematuhi kesepakatan tertib sekolah tata susila warga kelas merdeka"
        };
      case "inggris":
        return {
          materi1: "menggunakan kosakata pengenalan diri santun untuk sapaan lisan",
          materi2: "mengucapkan nama hari bulan serta angka ordinal sederhana terpilih"
        };
      case "pjok":
        return {
          materi1: "memperagakan variasi gerak lokomotor berpindah tempat secara aman",
          materi2: "memahami aneka asupan makanan bergizi penopang kebugaran prima"
        };
      case "seniRupa":
        return {
          materi1: "memahami padu padan warna dekoratif geometris ragam hias daerah",
          materi2: "membuat origami kerajinan terapan anyaman bambu bernilai guna"
        };
      case "seniMusik":
        return {
          materi1: "menyanyikan lagu daerah selaras berbirama tempo ketukan stabil",
          materi2: "mengenali suara ketukan alat musik gesek tiup khas Indonesia"
        };
      case "seniTari":
        return {
          materi1: "mengidentifikasi hadap penari pola garis lurus lingkaran tarian NTT",
          materi2: "mempergelagakan tari tunggal ekspresif berdasar ketukan irama meriah"
        };
      default:
        return {
          materi1: "memahami kompetensi dasar tujuan utama pembelajaran materi pokok kesatu",
          materi2: "menerapkan kaidah konseptual capaian pembelajaran mandiri terpadu kedua"
        };
    }
  };

  // Multiple Student Database List State
  const [studentsList, setStudentsList] = useState<Student[]>(() => {
    const saved = localStorage.getItem("omega_students_list");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Format list murid salah, menginisialisasi ulang...");
      }
    }
    // Set 12 DEFAULT STUDENTS and assign full grades
    const list = DEFAULT_STUDENTS.map(st => ({
      ...st,
      grades: JSON.parse(JSON.stringify(defaultGrades))
    })) as Student[];
    localStorage.setItem("omega_students_list", JSON.stringify(list));
    // Run initial synchronization for legacy profiles
    setTimeout(() => { synchronizeLegacyStudentRosters(list); }, 50);
    return list;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem("omega_active_student_id") || "3155685577";
  });

  // State management to edit single student
  const [studentBio, setStudentBio] = useState({
    namaLengkap: "FLORIDA BANUSU",
    panggilan: "Jian",
    nisnNis: "3155685577/258",
    tempatLahir: "Oehoso",
    tanggalLahir: "21 Januari 2015",
    jenisKelamin: "Perempuan",
    agama: "Katolik",
    pendidikanSebelum: "-",
    alamatSiswa: "Oehoso",
    namaAyah: "Florianus Banusu",
    namaIbu: "Mincesia Kause",
    pekerjaanAyah: "Tani",
    pekerjaanIbu: "Ibu Rumah Tangga",
    ortuJalan: "Oehoso",
    ortuKelurahan: "Oehalo",
    ortuKecamatan: "Insana Tengah",
    ortuKabupaten: "Timor Tengah Utara",
    ortuProvinsi: "Nusa Tenggara Timur",
    waliNama: "-",
    waliPekerjaan: "-",
    waliAlamat: "-",
    photo: ""
  });

  const [extraInfo, setExtraInfo] = useState({
    sakit: "2",
    izin: "0",
    alpa: "3",
    ekstraNama: "Olahraga",
    ekstraKet: "Sudah Baik",
    naikKeKelas: "V (Lima)",
    tinggalDiKelas: "-",
    catatanGuru: "Secara keseluruhan dalam segi akademis, Jian sudah bagus dan cukup baik. Tingkatkan lagi prestasi dengan rajin belajar."
  });

  const [grades, setGrades] = useState<SubjectGrade[]>(defaultGrades);

  // Sync state whenever active student changes
  useEffect(() => {
    const current = studentsList.find(s => s.id === activeStudentId);
    if (current) {
      setStudentBio({
        namaLengkap: current.namaLengkap,
        panggilan: current.panggilan,
        nisnNis: current.nisnNis,
        tempatLahir: current.tempatLahir,
        tanggalLahir: current.tanggalLahir,
        jenisKelamin: current.jenisKelamin,
        agama: current.agama,
        pendidikanSebelum: current.pendidikanSebelum,
        alamatSiswa: current.alamatSiswa,
        namaAyah: current.namaAyah,
        namaIbu: current.namaIbu,
        pekerjaanAyah: current.pekerjaanAyah,
        pekerjaanIbu: current.pekerjaanIbu,
        ortuJalan: current.ortuJalan,
        ortuKelurahan: current.ortuKelurahan,
        ortuKecamatan: current.ortuKecamatan,
        ortuKabupaten: current.ortuKabupaten,
        ortuProvinsi: current.ortuProvinsi,
        waliNama: current.waliNama,
        waliPekerjaan: current.waliPekerjaan,
        waliAlamat: current.waliAlamat,
        photo: (current as any).photo || ""
      });
      setExtraInfo({
        sakit: current.sakit || "0",
        izin: current.izin || "0",
        alpa: current.alpa || "0",
        ekstraNama: current.ekstraNama || "-",
        ekstraKet: current.ekstraKet || "-",
        naikKeKelas: current.naikKeKelas || "V (Lima)",
        tinggalDiKelas: current.tinggalDiKelas || "-",
        catatanGuru: current.catatanGuru || ""
      });
      setGrades(current.grades || defaultGrades);
      localStorage.setItem("omega_active_student_id", activeStudentId);
      window.dispatchEvent(new CustomEvent("omega-state-updated"));
    }
  }, [activeStudentId, studentsList]);

  // Listener to synchronize student list & active state with other components
  useEffect(() => {
    const handleEventsSynchronized = () => {
      const activeId = localStorage.getItem("omega_active_student_id");
      if (activeId && activeId !== activeStudentId) {
        if (studentsList.some(s => s.id === activeId)) {
          setActiveStudentId(activeId);
        }
      }
      
      const savedList = localStorage.getItem("omega_students_list");
      if (savedList) {
        try {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudentsList(parsed);
          }
        } catch (e) {}
      }
    };
    window.addEventListener("omega-state-updated", handleEventsSynchronized);
    window.addEventListener("omega-student-profile-updated", handleEventsSynchronized);
    return () => {
      window.removeEventListener("omega-state-updated", handleEventsSynchronized);
      window.removeEventListener("omega-student-profile-updated", handleEventsSynchronized);
    };
  }, [activeStudentId, studentsList]);

  // Character evaluation checkboxes
  const [selectedTraits, setSelectedTraits] = useState<Record<string, boolean>>({
    "Beriman & Bertakwa": true,
    "Gotong Royong": true,
    "Mandiri": false,
    "Bernalar Kritis": true,
    "Kreatif": false,
    "Berkebinekaan Global": false
  });

  // School Profile values from LocalStorage (to mirror on report page)
  const [schoolProfile, setSchoolProfile ] = useState(() => {
    return {
      namaSekolah: localStorage.getItem("kosp_nama_sekolah") || "SEKOLAH DASAR NEGERI FATUBAI",
      npsn: localStorage.getItem("kosp_npsn") || "50300960",
      telp: localStorage.getItem("kosp_telp") || "082236015517",
      email: localStorage.getItem("kosp_email") || "sdnfatubai@gmail.com",
      website: localStorage.getItem("kosp_website") || "https://sdn-fatubai-official.netlify.app/",
      namaKepala: localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr",
      nipKepala: localStorage.getItem("kosp_nip_kepala") || "196709192008011008",
      namaGuru: localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr",
      nipGuru: localStorage.getItem("kosp_nip_guru") || "198603012020121005",
      faseKelas: localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B",
      tahunPelajaran: localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025",
      tempatLaporan: localStorage.getItem("kosp_tempat") || "Fatubai",
      tanggalLaporan: localStorage.getItem("kosp_tanggal") || "26 Juni 2025",
      semester: localStorage.getItem("kosp_semester") || "Semester 2 (Genap)"
    };
  });

  // Adding Form Local State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    namaLengkap: "",
    panggilan: "",
    nisn: "",
    nis: "",
    jk: "Laki-laki",
    agama: "Katolik"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Sync school profile dynamically
  useEffect(() => {
    const handleSchoolUpdate = () => {
      setSchoolProfile({
        namaSekolah: localStorage.getItem("kosp_nama_sekolah") || "SEKOLAH DASAR NEGERI FATUBAI",
        npsn: localStorage.getItem("kosp_npsn") || "50300960",
        telp: localStorage.getItem("kosp_telp") || "082236015517",
        email: localStorage.getItem("kosp_email") || "sdnfatubai@gmail.com",
        website: localStorage.getItem("kosp_website") || "https://sdn-fatubai-official.netlify.app/",
        namaKepala: localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr",
        nipKepala: localStorage.getItem("kosp_nip_kepala") || "196709192008011008",
        namaGuru: localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr",
        nipGuru: localStorage.getItem("kosp_nip_guru") || "198603012020121005",
        faseKelas: localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B",
        tahunPelajaran: localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025",
        tempatLaporan: localStorage.getItem("kosp_tempat") || "Fatubai",
        tanggalLaporan: localStorage.getItem("kosp_tanggal") || "26 Juni 2025",
        semester: localStorage.getItem("kosp_semester") || "Semester 2 (Genap)"
      });
    };

    window.addEventListener("omega-school-profile-updated", handleSchoolUpdate);
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleSchoolUpdate);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  const handleAddStudent = (newS: { namaLengkap: string; panggilan: string; nisn: string; nis: string; jk: string; agama: string }) => {
    const defaultGrList = JSON.parse(JSON.stringify(defaultGrades)) as SubjectGrade[];
    // create slightly offset scores as variety if needed, or keep standard
    const newSt: Student = {
      id: newS.nisn || "st_" + Date.now(),
      namaLengkap: newS.namaLengkap.toUpperCase(),
      panggilan: newS.panggilan,
      nisnNis: `${newS.nisn || "-"}/${newS.nis || "-"}`,
      tempatLahir: "Oehoso",
      tanggalLahir: "21 Januari 2015",
      jenisKelamin: newS.jk,
      agama: newS.agama,
      pendidikanSebelum: "-",
      alamatSiswa: "Oehoso",
      namaAyah: "",
      pekerjaanAyah: "Tani",
      namaIbu: "",
      pekerjaanIbu: "Ibu Rumah Tangga",
      ortuJalan: "Oehoso",
      ortuKelurahan: "Oehalo",
      ortuKecamatan: "Insana Tengah",
      ortuKabupaten: "Timor Tengah Utara",
      ortuProvinsi: "Nusa Tenggara Timur",
      waliNama: "-",
      waliPekerjaan: "-",
      waliAlamat: "-",
      sakit: "0",
      izin: "0",
      alpa: "0",
      ekstraNama: "Pramuka",
      ekstraKet: "Baik",
      naikKeKelas: "V (Lima)",
      tinggalDiKelas: "-",
      catatanGuru: `Secara keseluruhan akademis ${newS.panggilan} sudah cukup baik. Pertahankan terus belajarnya.`,
      grades: defaultGrList
    };

    const updatedList = [...studentsList, newSt];
    setStudentsList(updatedList);
    localStorage.setItem("omega_students_list", JSON.stringify(updatedList));
    synchronizeLegacyStudentRosters(updatedList);
    setActiveStudentId(newSt.id);
    triggerToast(`✓ Murid baru "${newSt.namaLengkap}" berhasil ditambahkan!`);
  };

  const handleDeleteStudent = (idToDelete: string) => {
    if (studentsList.length <= 1) {
      alert("Gagal menghapus. Harus ada minimal satu siswa terdaftar di dalam sistem.");
      return;
    }
    const student = studentsList.find(s => s.id === idToDelete);
    if (!student) return;
    
    if (confirm(`Apakah Anda yakin ingin menghapus siswa "${student.namaLengkap}" secara permanen? Data nilai & rapornya akan hilang.`)) {
      const updatedList = studentsList.filter(s => s.id !== idToDelete);
      setStudentsList(updatedList);
      localStorage.setItem("omega_students_list", JSON.stringify(updatedList));
      synchronizeLegacyStudentRosters(updatedList);
      // Set active student to the first one in the new list
      setActiveStudentId(updatedList[0].id);
      triggerToast(`✓ Siswa "${student.namaLengkap}" berhasil dihapus.`);
    }
  };

  const downloadExcelTemplate = () => {
    const titleRow1 = ["DATA MURID KELAS VI"];
    const titleRow2 = ["KONSOL ADMINISTRASI RAPOR KURIKULUM MERDEKA"];
    const titleRow3 = ["Sesuai Keputusan Kepala BSKAP Nomor 046 Tahun 2025"];
    const emptyRow = [];
    const instructionHeader = ["PETUNJUK PENGISIAN:"];
    const headers = [
      "No", "NISN", "NIS", "Nama Lengkap", "Panggilan", "Tempat Lahir", "Tanggal Lahir",
      "Jenis Kelamin", "Agama", "Pendidikan Sebelumnya", "Alamat Siswa",
      "Nama Ayah", "Pekerjaan Ayah", "Nama Ibu", "Pekerjaan Ibu",
      "Jalan/Dusun", "Kelurahan/Desa", "Kecamatan", "Kabupaten/Kota", "Provinsi",
      "Wali Nama", "Wali Pekerjaan", "Wali Alamat"
    ];

    // Prepare rows for exactly 16 default student entries to match template bounds exactly
    const rows: any[][] = [];
    const totalTemplateRows = Math.max(16, studentsList.length);

    for (let i = 0; i < totalTemplateRows; i++) {
      const st = studentsList[i];
      if (st) {
        const parts = (st.nisnNis || "").split('/');
        rows.push([
          i + 1, // Regular number digits with no leading zeroes so that 0 is not confused with 8
          parts[0] || "",
          parts[1] || "",
          st.namaLengkap,
          st.panggilan,
          st.tempatLahir,
          st.tanggalLahir,
          st.jenisKelamin,
          st.agama,
          st.pendidikanSebelum,
          st.alamatSiswa,
          st.namaAyah,
          st.pekerjaanAyah,
          st.namaIbu,
          st.pekerjaanIbu,
          st.ortuJalan,
          st.ortuKelurahan,
          st.ortuKecamatan,
          st.ortuKabupaten,
          st.ortuProvinsi,
          st.waliNama,
          st.waliPekerjaan,
          st.waliAlamat
        ]);
      } else {
        // Empty template rows styled with numbers to guide fill-up
        rows.push([
          i + 1, // Row number
          "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
        ]);
      }
    }

    // Direct match to A26:A29 instruction box where it flows across the columns correctly in the provided screenshot
    const notesRows = [
      [], // Row 23 (index 22) - spacer
      [], // Row 24 (index 23) - spacer
      [], // Row 25 (index 24) - spacer
      ["Isi semua data di dalam kolom tersedia"], // Row 26 in column A
      ["Tambah tabel murid jika jumlah murid melebihi tabel"], // Row 27 in column A
      ["Format awal terdata 16 murid, jika murid tidak mencukupi, hapus tabel lainnya!"], // Row 28 in column A
      ["Sangat penting lalu inpor ke aplikasi"] // Row 29 in column A
    ];

    const worksheetData = [
      titleRow1,
      titleRow2,
      titleRow3,
      emptyRow,
      instructionHeader,
      headers,
      ...rows,
      ...notesRows
    ];

    const wb = XLSXStyle.utils.book_new();
    const ws = XLSXStyle.utils.aoa_to_sheet(worksheetData);

    // Merge titles cleanly across the page
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 22 } }, // Title merged
      { s: { r: 1, c: 0 }, e: { r: 1, c: 22 } }, // Subtitle 1 merged
      { s: { r: 2, c: 0 }, e: { r: 2, c: 22 } }, // Subtitle 2 merged
      { s: { r: 4, c: 0 }, e: { r: 4, c: 22 } },  // Instructions label merged
    ];

    // Elegant column widths to prevent squeezed text or overlapping values
    ws['!cols'] = [
      { wch: 6 },   // No
      { wch: 16 },  // NISN
      { wch: 13 },  // NIS
      { wch: 30 },  // Nama Lengkap
      { wch: 15 },  // Panggilan
      { wch: 16 },  // Tempat Lahir
      { wch: 18 },  // Tanggal Lahir
      { wch: 15 },  // Jenis Kelamin
      { wch: 12 },  // Agama
      { wch: 22 },  // Pendidikan Sebelumnya
      { wch: 30 },  // Alamat Siswa
      { wch: 22 },  // Nama Ayah
      { wch: 18 },  // Pekerjaan Ayah
      { wch: 22 },  // Nama Ibu
      { wch: 18 },  // Pekerjaan Ibu
      { wch: 18 },  // Jalan/Dusun
      { wch: 15 },  // Kelurahan/Desa
      { wch: 15 },  // Kecamatan
      { wch: 18 },  // Kabupaten/Kota
      { wch: 18 },  // Provinsi
      { wch: 18 },  // Wali Nama
      { wch: 15 },  // Wali Pekerjaan
      { wch: 22 }   // Wali Alamat
    ];

    // Set custom row heights for professional layout spacing
    const rowsHeights = [
      { hpt: 26 }, // Title Row 1
      { hpt: 22 }, // Title Row 2
      { hpt: 18 }, // Title Row 3
      { hpt: 12 }, // Empty Row
      { hpt: 20 }, // Instruction Header
      { hpt: 30 }, // Table Headers
    ];
    for (let r = 0; r < totalTemplateRows; r++) {
      rowsHeights.push({ hpt: 22 }); // Spacious data rows
    }
    ws['!rows'] = rowsHeights;

    // Apply premium Excel styling (colors, borders, alignments, and fonts)
    const borderThin = {
      style: "thin",
      color: { rgb: "2B3E50" }
    };
    const borderLight = {
      style: "thin",
      color: { rgb: "D1D5DB" } // Soft light gray for inside gridlines
    };

    const range = XLSXStyle.utils.decode_range(ws['!ref'] || "A1:W40");
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellRef = XLSXStyle.utils.encode_cell({ r, c });
        
        // Ensure even empty cells in the table range are instantiated to guarantee grid borders are drawn
        if (!ws[cellRef] && r >= 5 && r < 5 + 1 + totalTemplateRows) {
          ws[cellRef] = { t: 's', v: '' };
        }

        const cell = ws[cellRef];
        if (!cell) continue;

        // Initialize style object
        cell.s = {};

        if (r === 0) {
          // Document Title
          cell.s = {
            font: { name: "Arial", sz: 14, bold: true, color: { rgb: "1A365D" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        } else if (r === 1) {
          // Subtitle 1
          cell.s = {
            font: { name: "Arial", sz: 11, bold: true, color: { rgb: "2B6CB0" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        } else if (r === 2) {
          // Subtitle 2
          cell.s = {
            font: { name: "Arial", sz: 9.5, italic: true, color: { rgb: "718096" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        } else if (r === 4) {
          // Instructions Header Label
          cell.s = {
            font: { name: "Arial", sz: 10.5, bold: true, color: { rgb: "3182CE" } },
            alignment: { horizontal: "left", vertical: "center" }
          };
        } else if (r === 5) {
          // Professional Blue Header row (A6:W6)
          cell.s = {
            font: { name: "Arial", sz: 10, bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "3182CE" } }, // Cool Corporate Blue
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
              top: borderThin,
              bottom: borderThin,
              left: borderThin,
              right: borderThin
            }
          };
        } else if (r >= 6 && r < 6 + totalTemplateRows) {
          // Table Data Rows
          const isEven = (r % 2 === 0);
          const bgC = isEven ? "F7FAFC" : "FFFFFF"; // High-quality subtle alternating zebra rows
          
          let align = "left";
          if (c === 0 || c === 1 || c === 2 || c === 6 || c === 7 || c === 8) {
            align = "center"; // Center numbers, dates, gender, and religion
          }

          cell.s = {
            font: { name: "Arial", sz: 10, color: { rgb: "2D3748" } },
            fill: { fgColor: { rgb: bgC } },
            alignment: { horizontal: align, vertical: "center" },
            border: {
              top: borderLight,
              bottom: borderLight,
              left: borderLight,
              right: borderLight
            }
          };
        } else if (r >= 6 + totalTemplateRows) {
          // Notes rows at the bottom (Instructions details)
          if (cell.v) {
            const isWarning = cell.v.includes("Sangat penting") || cell.v.includes("Format awal");
            cell.s = {
              font: { 
                name: "Arial", 
                sz: 9.5, 
                italic: true, 
                bold: isWarning, 
                color: { rgb: isWarning ? "C53030" : "4A5568" } 
              },
              alignment: { horizontal: "left", vertical: "center" }
            };
          }
        }
      }
    }

    // Named "Sheet1" exactly as shown on the Excel tab bar in the user's screenshot
    XLSXStyle.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSXStyle.writeFile(wb, "Template_Data_Murid_Rapor.xlsx");
    triggerToast("✓ Template Excel rapi & bergaris berhasil diunduh!");
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length <= 1) {
          alert("File Excel kosong atau tidak memiliki data.");
          return;
        }

        // Dynamically find the header row index to adapt to any title spacing elegantly
        let headerRowIndex = -1;
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.some(cell => cell && typeof cell === 'string' && (
            cell.trim().toLowerCase() === "nama lengkap" || 
            cell.trim().toLowerCase() === "nama murid" ||
            cell.trim().toLowerCase() === "nisn" ||
            cell.trim().toLowerCase() === "nis"
          ))) {
            headerRowIndex = i;
            break;
          }
        }

        // Fallback to row index 0 if header scanner fails to hit exact keywords
        if (headerRowIndex === -1) {
          headerRowIndex = 0;
        }

        const headers = jsonData[headerRowIndex];
        const headerIndices: Record<string, number> = {};
        headers.forEach((h, idx) => {
          if (h) headerIndices[h.toString().trim().toLowerCase()] = idx;
        });

        const importedStudents: Student[] = [];
        
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const r = jsonData[i];
          if (!r || r.length === 0) continue;

          // Intelligently skip the static instruction notes rows at the bottom
          const isRowInstruction = r.some(cell => 
            cell && typeof cell === 'string' && (
              cell.includes("kolom tersedia") || 
              cell.includes("melebihi tabel") || 
              cell.includes("tidak mencukupi") || 
              cell.includes("inpor ke aplikasi") ||
              cell.includes("Format awal")
            )
          );
          if (isRowInstruction) continue;

          // Helper with array matching to support multiple possible variations of column labels
          const val = (idxNames: string[], fallback = "-") => {
            for (const name of idxNames) {
              const idx = headerIndices[name.toLowerCase()];
              if (idx !== undefined && r[idx] !== undefined && r[idx] !== null) {
                return r[idx].toString().trim();
              }
            }
            return fallback;
          };

          const name = val(["Nama Lengkap", "Nama Siswa", "Nama Murid", "Nama"], "").toUpperCase();
          // Skip empty placeholder lines or guide captions
          if (!name || name === "-" || name.includes("ISI SEMUA") || name.includes("TAMBAHKAN") || name.includes("FORMAT AWAL")) {
            continue;
          }

          const nisn = val(["NISN", "nisn", "Nomor Induk Siswa Nasional"], "");
          const nis = val(["NIS", "nis", "Nomor Induk Siswa"], "");
          const nickname = val(["Panggilan", "Nama Panggilan", "Panggil"], name.split(" ")[0]);
          const ttl_place = val(["Tempat Lahir", "Tempat", "Lahir Tempat"], "Oehoso");
          const ttl_date = val(["Tanggal Lahir", "Tgl Lahir", "Tanggal"], "21 Januari 2015");

          const studentId = (nisn || nis || "st_" + Date.now() + "_" + i).trim();

          // Preserve existing student ID and scores if editing/merging via excel update (case-insensitive and trim match)
          const existing = studentsList.find(s => 
            (s.id && s.id.trim().toLowerCase() === studentId.toLowerCase()) || 
            (s.namaLengkap && name && s.namaLengkap.trim().toLowerCase() === name.trim().toLowerCase())
          );
          
          const studentIdToUse = existing ? existing.id : studentId;
          const currentGradesList = existing ? existing.grades : JSON.parse(JSON.stringify(defaultGrades));

          importedStudents.push({
            id: studentIdToUse,
            namaLengkap: name,
            panggilan: nickname,
            nisnNis: `${nisn || "-"}/${nis || "-"}`,
            tempatLahir: ttl_place,
            tanggalLahir: ttl_date,
            jenisKelamin: val(["Jenis Kelamin", "JK", "Gender", "L/P"], "Laki-laki"),
            agama: val(["Agama"], "Katolik"),
            pendidikanSebelum: val(["Pendidikan Sebelumnya", "Pendidikan", "Asal Sekolah"], "-"),
            alamatSiswa: val(["Alamat Siswa", "Alamat"], "Oehoso"),
            namaAyah: val(["Nama Ayah", "Ayah"], ""),
            pekerjaanAyah: val(["Pekerjaan Ayah", "Kerja Ayah"], "Tani"),
            namaIbu: val(["Nama Ibu", "Ibu"], ""),
            pekerjaanIbu: val(["Pekerjaan Ibu", "Kerja Ibu"], "Ibu Rumah Tangga"),
            ortuJalan: val(["Jalan/Dusun", "Ortu Jalan", "Jalan", "Dusun", "Alamat Orang Tua", "Alamat Ortu"], "Oehoso"),
            ortuKelurahan: val(["Kelurahan/Desa", "Desa/Kelurahan", "Ortu Kelurahan", "Kelurahan", "Desa", "Kelurahan Ortu", "Kelurahan Orang Tua"], "Oehalo"),
            ortuKecamatan: val(["Kecamatan", "Ortu Kecamatan", "Kecamatan Ortu", "Kecamatan Orang Tua"], "Insana Tengah"),
            ortuKabupaten: val(["Kabupaten/Kota", "Kabupaten", "Ortu Kabupaten", "Kota/Kabupaten", "Kabupaten Ortu", "Kabupaten Orang Tua"], "Timor Tengah Utara"),
            ortuProvinsi: val(["Provinsi", "Ortu Provinsi", "Provinsi Ortu", "Provinsi Orang Tua"], "Nusa Tenggara Timur"),
            waliNama: val(["Wali Nama", "Nama Wali", "Wali"], "-"),
            waliPekerjaan: val(["Wali Pekerjaan", "Pekerjaan Wali"], "-"),
            waliAlamat: val(["Wali Alamat", "Alamat Wali"], "-"),
            sakit: val(["Sakit", "Absen Sakit"], existing ? existing.sakit : "0"),
            izin: val(["Izin", "Absen Izin"], existing ? existing.izin : "0"),
            alpa: val(["Alpa", "Absen Alpa"], existing ? existing.alpa : "0"),
            ekstraNama: val(["Ekstrakurikuler Nama", "Ekstra", "Nama Ekstrakurikuler"], existing ? existing.ekstraNama : "Pramuka"),
            ekstraKet: val(["Ekstrakurikuler Keterangan", "Nilai Ekstra", "Ket Ekstra"], existing ? existing.ekstraKet : "Baik"),
            naikKeKelas: existing ? existing.naikKeKelas : "V (Lima)",
            tinggalDiKelas: existing ? existing.tinggalDiKelas : "-",
            catatanGuru: val(["Catatan Guru", "Catatan Wali Kelas", "Catatan"], existing ? existing.catatanGuru : `Secara keseluruhan akademis ${nickname} sudah cukup baik. Pertahankan terus belajarnya.`),
            grades: currentGradesList
          });
        }

        if (importedStudents.length === 0) {
          alert("Tidak ada data murid valid yang ditemukan di file Excel.");
          return;
        }

        // Merge imported students with current school registers with robust case-insensitive verification
        const mergedList = [...studentsList];
        importedStudents.forEach(imp => {
          const idx = mergedList.findIndex(x => 
            (x.id && imp.id && x.id.trim().toLowerCase() === imp.id.trim().toLowerCase()) || 
            (x.namaLengkap && imp.namaLengkap && x.namaLengkap.trim().toLowerCase() === imp.namaLengkap.trim().toLowerCase())
          );
          if (idx > -1) {
            mergedList[idx] = imp;
          } else {
            mergedList.push(imp);
          }
        });

        setStudentsList(mergedList);
        localStorage.setItem("omega_students_list", JSON.stringify(mergedList));
        synchronizeLegacyStudentRosters(mergedList);
        setActiveStudentId(importedStudents[0].id);
        triggerToast(`✓ Berhasil mengimpor ${importedStudents.length} siswa secara massal!`);
      } catch (err) {
        console.error(err);
        alert("Gagal memproses file Excel. Pastikan header kolom sesuai dengan format template.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file picker value
    e.target.value = "";
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      // Save current form into List
      const updatedList = studentsList.map(item => {
        if (item.id === activeStudentId) {
          return {
            ...item,
            ...studentBio,
            ...extraInfo,
            grades: grades
          };
        }
        return item;
      });

      setStudentsList(updatedList);
      localStorage.setItem("omega_students_list", JSON.stringify(updatedList));
      synchronizeLegacyStudentRosters(updatedList);

      // Mirror Active Student fields to legacy keys for compatibility
      Object.entries(studentBio).forEach(([key, val]) => {
        const localKey = "omega_student_" + key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        localStorage.setItem(localKey, val as string);
      });
      localStorage.setItem("omega_student_name", studentBio.namaLengkap);
      localStorage.setItem("omega_student_nickname", studentBio.panggilan);

      Object.entries(extraInfo).forEach(([key, val]) => {
        const localKey = "omega_student_" + key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        localStorage.setItem(localKey, val as string);
      });
      localStorage.setItem("omega_student_catatan_guru", extraInfo.catatanGuru);
      localStorage.setItem("omega_student_grades_s2", JSON.stringify(grades));

      // Emit platform event
      window.dispatchEvent(new CustomEvent("omega-student-profile-updated"));
      window.dispatchEvent(new CustomEvent("omega-state-updated"));

      triggerToast("✓ Data Profil Murid & Tabel Nilai Capaian Semester 2 Berhasil Disimpan!");
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan profil.");
    }
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleBioChange = (field: keyof typeof studentBio, val: string) => {
    setStudentBio(prev => ({ ...prev, [field]: val }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
      alert("Format berkas harus berupa JPG atau PNG!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleBioChange("photo", base64);
      
      // AUTO PERSIST PROTOCOL: Save immediately to master list
      const savedList = localStorage.getItem("omega_students_list");
      if (savedList) {
        try {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed)) {
            const updated = parsed.map(std => {
              if (std.id === activeStudentId) {
                return { ...std, photo: base64 };
              }
              return std;
            });
            localStorage.setItem("omega_students_list", JSON.stringify(updated));
            setStudentsList(updated);
            synchronizeLegacyStudentRosters(updated);
          }
        } catch (err) {
          console.error(err);
        }
      }
      
      // Dispatch events to instantly update other views (e.g., RaporPanel)
      window.dispatchEvent(new CustomEvent("omega-student-profile-updated"));
      window.dispatchEvent(new CustomEvent("omega-state-updated"));
      
      triggerToast("✓ Foto 3x4 berhasil diunggah & tersimpan otomatis secara permanen!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleExtraChange = (field: keyof typeof extraInfo, val: string) => {
    setExtraInfo(prev => ({ ...prev, [field]: val }));
  };

  const handleGradeChange = (id: number, field: 'materi1' | 'score1' | 'materi2' | 'score2', val: string | number) => {
    setGrades(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, [field]: val };
      }
      return g;
    }));
  };

  const handleGenerateCatatanGuru = () => {
    const activeTraits = Object.entries(selectedTraits)
      .filter(([_, active]) => active)
      .map(([name]) => name);

    let traitsSentence = "";
    if (activeTraits.length > 0) {
      if (activeTraits.length === 1) {
        traitsSentence = `Ananda ${studentBio.panggilan} menunjukkan perkembangan karakter ${activeTraits[0]} yang sangat baik selama semester ini.`;
      } else {
        const last = activeTraits.pop();
        traitsSentence = `Ananda ${studentBio.panggilan} menunjukkan perkembangan karakter ${activeTraits.join(", ")} serta ${last} yang sangat istimewa dan terpuji.`;
      }
    } else {
      traitsSentence = `Ananda ${studentBio.panggilan} menunjukkan perilaku dan integrasi karakter yang santun, tertib, serta kooperatif dalam pembelajaran.`;
    }

    const academicSummary = `Secara keseluruhan dalam segi akademis, ${studentBio.panggilan} sudah bagus dan cukup baik. Tingkatkan lagi prestasi dengan rajin belajar supaya nilai yang dicapai lebih baik dari pada nilai sebelumnya. Tetap pertahankan kedisiplinan dan lebih semangat lagi belajarnya di kelas V (Lima)!`;

    const finalNote = `${traitsSentence} ${academicSummary}`;
    handleExtraChange("catatanGuru", finalNote);
    triggerToast("✓ Asisten AI berhasil meramu catatan berdasarkan karakter terpilih!");
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper logic for grade calculation and descriptions
  // Satisfies requested logic: highest score materi -> Capaian Tertinggi, lowest score materi -> Capaian Terendah.
  const computeGradeInfo = (item: SubjectGrade) => {
    const nilaiAkhir = Math.round((item.score1 + item.score2) / 2);
    
    let tertinggiDesc = "";
    let terendahDesc = "";

    const userNick = studentBio.panggilan || "siswa";

    if (item.score1 > item.score2) {
      tertinggiDesc = `${userNick} menunjukkan penguasaan dalam ${item.materi1.trim()}.`;
      terendahDesc = `${userNick} perlu bimbingan dalam ${item.materi2.trim()}.`;
    } else if (item.score2 > item.score1) {
      tertinggiDesc = `${userNick} menunjukkan penguasaan dalam ${item.materi2.trim()}.`;
      terendahDesc = `${userNick} perlu bimbingan dalam ${item.materi1.trim()}.`;
    } else {
      // Equal scores
      tertinggiDesc = `${userNick} menunjukkan penguasaan yang sangat memadai dalam seluruh materi ${item.name.replace(/Pendidikan|Bahasa|Ilmu/g, "").trim()}.`;
      terendahDesc = `${userNick} menunjukkan perkembangan kompetensi yang stabil. Pertahankan konsistensi belajar.`;
    }

    return {
      nilaiAkhir,
      tertinggiDesc,
      terendahDesc
    };
  };

  return (
    <div id="student-profile-module-root" className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="p-6 rounded-3xl border border-zinc-900 bg-gradient-to-b from-[#0a0a0f] to-[#040406] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="text-left space-y-1">
            <h2 className="text-xl font-black italic tracking-wide uppercase text-white font-display flex items-center gap-2">
              PROFIL INTEGRASI MURID
              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                RAPOR S2
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans max-w-xl">
              Identitas murid yang disinkronkan langsung dari dokumen rapor Semester 2 untuk akurasi data KOSP, daftar nilai, kartu absensi, serta deskripsi capaian otomatis berbasis nilai tertinggi/terendah.
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 md:flex-none px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-[0.98] select-none shadow-lg cursor-pointer cursor-pointer"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-black" />
                <span>Simpan Semua Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold leading-normal tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* STUDENT DATABASE MANAGER AND SELECTOR BAR */}
      <div className="p-4 rounded-2xl border border-zinc-900 bg-black/40 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm text-left">
            <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Pilih Siswa Aktif</label>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold outline-none focus:border-amber-500 text-xs"
            >
              {studentsList.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  {String(idx + 1).padStart(2, "0")} {s.namaLengkap} ({s.nisnNis || "Tanpa NISN"})
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-900 px-4 py-2 rounded-xl flex items-center gap-3 shrink-0 self-end lg:self-auto h-10 mt-5">
            <Users className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-left font-mono text-[10px]">
              <span className="text-zinc-500 block text-[8px]">TOTAL DATABASE</span>
              <span className="text-white font-black">{studentsList.length} SISWA</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs transition flex items-center gap-1.5 h-10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Murid</span>
          </button>
          
          <button
            onClick={downloadExcelTemplate}
            className="px-3.5 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-black font-black text-xs transition flex items-center gap-1.5 h-10 cursor-pointer"
            title="Unduh Format File Excel untuk pengisian data massal"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Template</span>
          </button>
          
          <label className="px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black font-black text-xs transition flex items-center gap-1.5 h-10 cursor-pointer select-none">
            <Upload className="w-4 h-4" />
            <span>Impor Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleDeleteStudent(activeStudentId)}
            className="px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-black text-xs transition flex items-center gap-1.5 h-10 cursor-pointer"
            title="Hapus data murid ini secara permanen"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {/* QUICK BENTO GRID - CIRCULAR STUDENT CARD SELECTOR ("KARTU ANGKA BULAT") */}
      <div className="p-4 rounded-2xl border border-zinc-900 bg-black/30 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-extrabold text-yellow-400 tracking-wider font-mono uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            ⚡ PANEL SELEKTOR CEPAT MURID (KARTU ANGKA BULAT)
          </label>
          <span className="text-[9px] text-zinc-500 font-mono">KLIK UNTUK MEMILIH SISWA AKTIF</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full text-left">
          {studentsList.map((s, idx) => {
            const numStr = String(idx + 1).padStart(2, "0");
            const isActive = s.id === activeStudentId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStudentId(s.id)}
                className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 min-h-[52px] select-none text-left cursor-pointer ${
                  isActive
                    ? "bg-[#0f1d3a]/65 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.22)]"
                    : "bg-zinc-950/65 border-zinc-900 hover:bg-[#0c1324]/40 hover:border-yellow-400/40"
                }`}
              >
                {/* Round circular number icon (Kartu Angka Bulat) */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-black shrink-0 border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-yellow-400 text-black border-yellow-400 scale-105 shadow-[0_0_10px_rgba(250,204,21,0.45)] animate-pulse"
                    : "bg-black text-yellow-400 border-yellow-400/50 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black"
                }`}>
                  {numStr}
                </div>

                <div className="min-w-0 flex-1">
                  <div className={`text-[10px] font-black uppercase tracking-wide truncate ${isActive ? "text-yellow-400" : "text-zinc-300"}`}>
                    {s.namaLengkap}
                  </div>
                  <div className="text-[8.5px] text-zinc-500 font-mono truncate">
                    {s.nisnNis ? s.nisnNis.split("/")[0] : s.id ? s.id.substring(0, 8) : "Tanpa NISN"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPACT TAMBAH DATA MURID INLINE FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 text-xs overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              <span className="font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5">
                📝 TAMBAH DATA MURID BARU
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Nilai & rapor akan diinisialisasi otomatis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={newStudentForm.namaLengkap}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, namaLengkap: e.target.value }))}
                  placeholder="Contoh: FLORIDA BANUSU"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">Nama Panggilan</label>
                <input
                  type="text"
                  value={newStudentForm.panggilan}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, panggilan: e.target.value }))}
                  placeholder="Contoh: Jian"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">NISN</label>
                <input
                  type="text"
                  value={newStudentForm.nisn}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, nisn: e.target.value }))}
                  placeholder="Contoh: 3155685577"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">NIS (Nomor Induk)</label>
                <input
                  type="text"
                  value={newStudentForm.nis}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, nis: e.target.value }))}
                  placeholder="Contoh: 258"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">Jenis Kelamin</label>
                <select
                  value={newStudentForm.jk}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, jk: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase font-mono">Agama</label>
                <input
                  type="text"
                  value={newStudentForm.agama}
                  onChange={(e) => setNewStudentForm(p => ({ ...p, agama: e.target.value }))}
                  placeholder="Contoh: Katolik"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-900 text-white outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newStudentForm.namaLengkap || !newStudentForm.panggilan) {
                    alert("Nama lengkap dan panggilan wajib diisi!");
                    return;
                  }
                  handleAddStudent(newStudentForm);
                  setShowAddForm(false);
                  setNewStudentForm({
                    namaLengkap: "",
                    panggilan: "",
                    nisn: "",
                    nis: "",
                    jk: "Laki-laki",
                    agama: "Katolik"
                  });
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold transition text-xs"
              >
                Simpan Murid
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUB-MENU TABS */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-2 overflow-x-auto no-scrollbar justify-start">
        <button
          onClick={() => setActiveSubTab('biodata')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'biodata' 
              ? 'bg-zinc-900 border border-zinc-800 text-amber-500 font-extrabold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📂 1. Identitas Siswa
        </button>
        <button
          onClick={() => setActiveSubTab('nilai')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'nilai' 
              ? 'bg-zinc-900 border border-zinc-800 text-amber-500 font-extrabold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📊 2. Nilai & Capaian S2
        </button>
        <button
          onClick={() => setActiveSubTab('ekstra')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'ekstra' 
              ? 'bg-zinc-900 border border-zinc-800 text-amber-500 font-extrabold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🏅 3. Ekstra & Kehadiran
        </button>
        <button
          onClick={() => setActiveSubTab('catatan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'catatan' 
              ? 'bg-zinc-900 border border-zinc-800 text-amber-500 font-extrabold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ✍️ 4. Asisten Karakter Guru
        </button>
        <button
          onClick={() => setActiveSubTab('print_rapor')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'print_rapor' 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black' 
              : 'text-amber-500/60 hover:text-amber-400 bg-amber-500/5'
          }`}
        >
          🖨️ 5. Cetak Rapor Merdeka S2
        </button>
      </div>

      {/* FORM CONTENTS */}
      <div className="grid grid-cols-1 gap-6 text-left">
        
        {/* SUBTAB 1: BIODATA IDENTITAS SISWA */}
        {activeSubTab === 'biodata' && (
          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#060608] space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5">
              <User className="w-4 h-4 text-amber-500" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                IDENTITAS MURID (RAPOR_METADATA)
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Box Unggah Foto 3x4 */}
              <div id="student-photo-sidebar" className="w-full lg:w-48 shrink-0 flex flex-col items-center p-4 rounded-2xl border border-zinc-900 bg-black/60 text-center space-y-3">
                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase font-mono">
                  Foto Resmi 3x4
                </span>
                
                {/* 3x4 frame (approx 113px x 151px) */}
                <div 
                  id="student-photo-frame"
                  className="relative border border-zinc-800 bg-zinc-950/80 rounded-xl overflow-hidden flex flex-col items-center justify-center transition duration-300 hover:border-amber-500/50 shadow-inner group"
                  style={{ width: "113px", height: "151px" }}
                >
                  {studentBio.photo ? (
                    <img 
                      src={studentBio.photo} 
                      alt="Foto Murid" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-zinc-600">
                      <User className="w-8 h-8 text-zinc-700 mb-1" />
                      <span className="text-[8px] font-bold text-zinc-500 leading-tight">
                        PAS FOTO<br />3 X 4
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-2">
                  <label className="block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-[10px] text-center uppercase tracking-wider transition cursor-pointer select-none">
                    📁 Unggah Foto
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                  {studentBio.photo && (
                    <button
                      type="button"
                      onClick={() => handleBioChange("photo", "")}
                      className="w-full py-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 font-bold text-[9px] uppercase tracking-wider transition border border-rose-900/30 cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                  <p className="text-[9px] text-zinc-500 leading-normal">
                    Format JPG/PNG. Otomatis masuk ke bingkai rapor.
                  </p>
                </div>
              </div>

              {/* Grid Input Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans w-full">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Nama Lengkap Murid</label>
                  <input
                    type="text"
                    value={studentBio.namaLengkap}
                    onChange={(e) => handleBioChange("namaLengkap", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono flex items-center justify-between">
                    <span>Nama Panggilan</span>
                    <span className="text-[8px] text-amber-500">DIGUNAKAN UNTUK DESKRIPSI CAPAIAN</span>
                  </label>
                  <input
                    type="text"
                    value={studentBio.panggilan}
                    onChange={(e) => handleBioChange("panggilan", e.target.value)}
                    placeholder="Contoh: Jian"
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">NISN / NIS</label>
                  <input
                    type="text"
                    value={studentBio.nisnNis}
                    onChange={(e) => handleBioChange("nisnNis", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Tempat Lahir</label>
                  <input
                    type="text"
                    value={studentBio.tempatLahir}
                    onChange={(e) => handleBioChange("tempatLahir", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={studentBio.tanggalLahir}
                    onChange={(e) => handleBioChange("tanggalLahir", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Jenis Kelamin</label>
                  <select
                    value={studentBio.jenisKelamin}
                    onChange={(e) => handleBioChange("jenisKelamin", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  >
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Agama</label>
                  <input
                    type="text"
                    value={studentBio.agama}
                    onChange={(e) => handleBioChange("agama", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Pendidikan Sebelumnya</label>
                  <input
                    type="text"
                    value={studentBio.pendidikanSebelum}
                    onChange={(e) => handleBioChange("pendidikanSebelum", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Alamat Peserta Didik</label>
                  <input
                    type="text"
                    value={studentBio.alamatSiswa}
                    onChange={(e) => handleBioChange("alamatSiswa", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5 pt-4">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                IDENTITAS ORANG TUA / WALI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Nama Lengkap Ayah</label>
                <input
                  type="text"
                  value={studentBio.namaAyah}
                  onChange={(e) => handleBioChange("namaAyah", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Pekerjaan Ayah</label>
                <input
                  type="text"
                  value={studentBio.pekerjaanAyah}
                  onChange={(e) => handleBioChange("pekerjaanAyah", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Nama Lengkap Ibu</label>
                <input
                  type="text"
                  value={studentBio.namaIbu}
                  onChange={(e) => handleBioChange("namaIbu", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase font-mono">Pekerjaan Ibu</label>
                <input
                  type="text"
                  value={studentBio.pekerjaanIbu}
                  onChange={(e) => handleBioChange("pekerjaanIbu", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-900 bg-black grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-sans">
              <div className="col-span-1 sm:col-span-5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Alamat Orang Tua</div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Jalan / Dusun</label>
                <input
                  type="text"
                  value={studentBio.ortuJalan}
                  onChange={(e) => handleBioChange("ortuJalan", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-850 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Kelurahan / Desa</label>
                <input
                  type="text"
                  value={studentBio.ortuKelurahan}
                  onChange={(e) => handleBioChange("ortuKelurahan", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-850 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Kecamatan</label>
                <input
                  type="text"
                  value={studentBio.ortuKecamatan}
                  onChange={(e) => handleBioChange("ortuKecamatan", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-850 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Kabupaten / Kota</label>
                <input
                  type="text"
                  value={studentBio.ortuKabupaten}
                  onChange={(e) => handleBioChange("ortuKabupaten", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-850 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Provinsi</label>
                <input
                  type="text"
                  value={studentBio.ortuProvinsi}
                  onChange={(e) => handleBioChange("ortuProvinsi", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white border border-zinc-850 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="col-span-1 sm:col-span-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Informasi Wali Peserta Didik</div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Nama Wali</label>
                <input
                  type="text"
                  value={studentBio.waliNama}
                  onChange={(e) => handleBioChange("waliNama", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 text-white border border-zinc-900 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Pekerjaan Wali</label>
                <input
                  type="text"
                  value={studentBio.waliPekerjaan}
                  onChange={(e) => handleBioChange("waliPekerjaan", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 text-white border border-zinc-900 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 mb-1 uppercase font-mono">Alamat Wali</label>
                <input
                  type="text"
                  value={studentBio.waliAlamat}
                  onChange={(e) => handleBioChange("waliAlamat", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 text-white border border-zinc-900 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: TABEL NILAI ACAPKALI CAPAIAN KOMPETENSI */}
        {activeSubTab === 'nilai' && (
          <div className="space-y-4">
            
            <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3.5 text-xs text-amber-200 text-left">
              <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wide block">RUMUS UNTUK NILAI AKHIR & DESKRIPSI OTOMATIS (KURIKULUM MERDEKA SEMESTER 2)</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Sesuai arahan, <strong>Nilai Akhir Rapor</strong> dihitung secermat mungkin menggunakan rumusan rata-rata valid dari materi-materi ajar: <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-amber-400">NA = (Materi 1 + Materi 2) / 2</code>. 
                  Sistem kami yang cerdas secara otomatis akan mengekstrak <strong>materi dengan nilai tertinggi</strong> sebagai redaksi <strong>Capaian Tertinggi</strong>, serta mendeteksi <strong>materi dengan nilai terendah</strong> untuk diplot ke dalam redaksi <strong>Capaian Terendah</strong> agar sejalan sepenuhnya dengan format Rapor Merdeka.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-900 bg-[#060608] space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5 justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                    TABEL NILAI MATA PELAJARAN & DESKRIPSI CAPAIAN
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider">
                  FASE: B (KELAS IV) MERDEKA
                </span>
              </div>

              <div className="space-y-6">
                {grades.map((item) => {
                  const info = computeGradeInfo(item);
                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-zinc-900 bg-black/80 space-y-4 shadow-md transition hover:border-zinc-850">
                      
                      {/* Name of subject */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900 pb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-500 font-mono flex items-center justify-center w-5 h-5 bg-amber-500/10 rounded">
                            {item.id}
                          </span>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">{item.name}</h4>
                        </div>
                        {/* computed score badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Nilai Akhir Rapor:</span>
                          <span className="px-3 py-1 font-mono text-xs font-black bg-amber-500 text-black rounded-lg shadow-sm">
                            {info.nilaiAkhir}
                          </span>
                        </div>
                      </div>

                      {/* Chapters Details Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        
                        {/* Chapter 1 */}
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Lingkup Materi 1 (Kognitif/Tinggi)</span>
                            <span className="text-[10px] font-mono text-zinc-500">Nilai</span>
                          </div>
                          <div className="flex gap-2">
                            <textarea
                              rows={2}
                              value={item.materi1}
                              onChange={(e) => handleGradeChange(item.id, "materi1", e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 text-xs text-zinc-300 border border-zinc-900 focus:border-amber-500 outline-none leading-relaxed transition"
                              placeholder="Fokus ajar materi pertama"
                            />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.score1}
                              onChange={(e) => handleGradeChange(item.id, "score1", parseInt(e.target.value) || 0)}
                              className="w-16 h-10 px-1 py-1 text-center font-mono font-black text-white bg-zinc-950 rounded-lg border border-zinc-900 focus:border-amber-500 outline-none text-xs"
                            />
                          </div>
                        </div>

                        {/* Chapter 2 */}
                        <div className="md:col-span-5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono uppercase">Lingkup Materi 2 (Kognitif/Rendah)</span>
                            <span className="text-[10px] font-mono text-zinc-500">Nilai</span>
                          </div>
                          <div className="flex gap-2">
                            <textarea
                              rows={2}
                              value={item.materi2}
                              onChange={(e) => handleGradeChange(item.id, "materi2", e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 text-xs text-zinc-300 border border-zinc-900 focus:border-amber-500 outline-none leading-relaxed transition"
                              placeholder="Fokus ajar materi kedua"
                            />
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.score2}
                              onChange={(e) => handleGradeChange(item.id, "score2", parseInt(e.target.value) || 0)}
                              className="w-16 h-10 px-1 py-1 text-center font-mono font-black text-white bg-zinc-950 rounded-lg border border-zinc-900 focus:border-amber-500 outline-none text-xs"
                            />
                          </div>
                        </div>

                        {/* Automated Realtime Descriptions Preview */}
                        <div className="md:col-span-2 flex flex-col justify-center bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 space-y-2">
                          <div className="text-center font-mono text-[9px] font-bold tracking-widest text-[#555] uppercase">Preview Output</div>
                          <div className="space-y-1">
                            {/* tertinggi badge */}
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 py-0.25 rounded font-black font-mono">MAX</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{Math.max(item.score1, item.score2)}</span>
                            </div>
                            {/* terendah badge */}
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 py-0.25 rounded font-black font-mono">MIN</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{Math.min(item.score1, item.score2)}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Read-Only generated text review */}
                      <div className="p-2 bg-black/40 rounded-xl space-y-1.5 text-[10.5px] border border-zinc-950">
                        <div className="leading-snug text-zinc-400">
                          🟢 <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8.5px] font-mono">Tertinggi:</span> {info.tertinggiDesc}
                        </div>
                        <div className="leading-snug text-zinc-400">
                          🔴 <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8.5px] font-mono">Terendah:</span> {info.terendahDesc}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 3: EKSTRAKURIKULER & RETIDAKHADIRAN */}
        {activeSubTab === 'ekstra' && (
          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#060608] space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                KEGIATAN EKSTRAKURIKULER & ABSENSI KETIDAKHADIRAN
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Absensi */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Tingkat Ketidakhadiran (Semester 2)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase font-mono">Sakit (Hari)</label>
                    <input
                      type="text"
                      value={extraInfo.sakit}
                      onChange={(e) => handleExtraChange("sakit", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase font-mono">Izin (Hari)</label>
                    <input
                      type="text"
                      value={extraInfo.izin}
                      onChange={(e) => handleExtraChange("izin", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase font-mono">Tanpa Keterangan</label>
                    <input
                      type="text"
                      value={extraInfo.alpa}
                      onChange={(e) => handleExtraChange("alpa", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Ekstrakurikuler */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Kegiatan Ekstrakurikuler</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase font-mono">Nama Kegiatan</label>
                    <input
                      type="text"
                      value={extraInfo.ekstraNama}
                      onChange={(e) => handleExtraChange("ekstraNama", e.target.value)}
                      placeholder="Olahraga"
                      className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase font-mono">Keterangan / Deskripsi</label>
                    <input
                      type="text"
                      value={extraInfo.ekstraKet}
                      onChange={(e) => handleExtraChange("ekstraKet", e.target.value)}
                      placeholder="Sudah Baik"
                      className="w-full px-3 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5 pt-4">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                KEPUTUSAN AKHIR TAHUN AJARAN (UNTUK RAPOR SEMESTER 2!)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Naik Ke Kelas
                </label>
                <input
                  type="text"
                  value={extraInfo.naikKeKelas}
                  onChange={(e) => handleExtraChange("naikKeKelas", e.target.value)}
                  placeholder="Misal: V (Lima)"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                  Tinggal Di Kelas
                </label>
                <input
                  type="text"
                  value={extraInfo.tinggalDiKelas}
                  onChange={(e) => handleExtraChange("tinggalDiKelas", e.target.value)}
                  placeholder="Misal: -"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-black text-white border border-zinc-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ASISTEN KARAKTER GURU */}
        {activeSubTab === 'catatan' && (
          <div className="p-6 rounded-2xl border border-zinc-900 bg-[#060608] space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-950 pb-2.5 justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-500" />
                <span className="text-[10.5px] font-extrabold text-white tracking-widest font-mono uppercase">
                  ASISTEN KARAKTER & AKUMULASI CATATAN GURU
                </span>
              </div>
              <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold font-mono">
                PROJEK CO-PILOT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs font-sans">
              
              {/* Traits checklist */}
              <div className="md:col-span-5 space-y-4 bg-black/60 p-4 rounded-xl border border-zinc-900">
                <span className="text-[10px] font-extrabold text-[#777] block font-mono uppercase tracking-wider">Pilih Nilai Karakter Murid Terpuji:</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(selectedTraits).map((trait) => (
                    <label 
                      key={trait} 
                      className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer select-none transition ${
                        selectedTraits[trait] 
                          ? 'bg-amber-500/5 text-amber-400 border-amber-500/30' 
                          : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTraits[trait]}
                        onChange={(e) => {
                          setSelectedTraits(prev => ({ ...prev, [trait]: e.target.checked }));
                        }}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                        selectedTraits[trait] ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700'
                      }`}>
                        {selectedTraits[trait] && <Check className="w-3 h-3 text-black font-black" />}
                      </div>
                      <span className="text-[11px] font-semibold">{trait}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateCatatanGuru}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-black uppercase text-[10px] tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ramu Catatan Karakter AI
                </button>
              </div>

              {/* Result Notes editor */}
              <div className="md:col-span-7 space-y-3">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono tracking-wider">
                  Isi Catatan Guru / Akumulasi Penilaian Karakter (Diterbitkan di Rapor)
                </label>
                <textarea
                  value={extraInfo.catatanGuru}
                  onChange={(e) => handleExtraChange("catatanGuru", e.target.value)}
                  rows={8}
                  placeholder="Ketik catatan manual di sini atau gunakan asisten di samping..."
                  className="w-full px-4 py-3 rounded-xl bg-black text-xs text-zinc-200 border border-zinc-900 outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
                
                <div className="text-[10px] text-zinc-500 italic leading-relaxed flex items-start gap-1">
                  💡 <span>Catatan ini memuat deskripsi akumulasi karakter serta dorongan prestasi belajar murid yang dicetak di barisan terbawah laporan rapor semester genap.</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUBTAB 5: CETAK RAPOR MERDEKA SEMESTER 2 PRINT PREVIEW (HIGH-FIDELITY) */}
        {activeSubTab === 'print_rapor' && (
          <div className="space-y-4">
            
            {/* Contrl tools */}
            <div className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">Modul Laporan Cetak Rapor Cetak Luring</h4>
                <p className="text-[10.5px] text-zinc-500 font-sans">
                  Pratinjau di bawah dirancang khusus dengan lembar CSS Print agar saat dicetak lewat tombol di kanan, layout tabel, margin, dan tanda tangan pas persis sesuai bentuk kertas A4 standar dinas.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Cetak Rapor Luring (A4)</span>
              </button>
            </div>

            {/* REAL PRINT FRAME (HIGH FIDELITY) */}
            <div className="bg-white p-8 sm:p-12 text-[#111] max-w-[21cm] mx-auto shadow-2xl relative border border-zinc-200 font-serif text-[11px] leading-relaxed select-text text-left print:p-0 print:border-none print:shadow-none print:max-w-none">
              
              {/* PAGE 1: IDENTITAS HEADER */}
              <div className="space-y-4 border-b-2 border-black pb-4 text-xs font-sans">
                <div className="text-center font-bold text-sm tracking-wide">
                  RAPOR DAN PROFIL PESERTA DIDIK
                </div>
                
                <table className="w-full border-collapse text-[10.5px]">
                  <tbody>
                    <tr>
                      <td className="py-1 pr-2 font-bold w-[18%]">Nama Peserta Didik</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400 font-bold uppercase w-[32%]">{studentBio.namaLengkap}</td>
                      <td className="py-1 pr-2 font-bold w-[15%] pl-4">Kelas</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400 w-[30%]">{schoolProfile.faseKelas.replace(/\/ Fase.*/i, "").trim()}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 font-bold">NISN / NIS</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400 font-mono">{studentBio.nisnNis}</td>
                      <td className="py-1 pr-2 font-bold pl-4">Fase</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400">
                        {schoolProfile.faseKelas.includes("Fase") ? schoolProfile.faseKelas.split("Fase")[1].trim() : "B"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 font-bold">Nama Sekolah</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400 uppercase">{schoolProfile.namaSekolah}</td>
                      <td className="py-1 pr-2 font-bold pl-4">Semester</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400">{schoolProfile.semester}</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 font-bold">Alamat Sekolah</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400">{schoolProfile.tempatLaporan}</td>
                      <td className="py-1 pr-2 font-bold pl-4">Tahun Pelajaran</td>
                      <td className="py-1 px-1">:</td>
                      <td className="py-1 px-2 border-b border-dotted border-zinc-400 font-mono">{schoolProfile.tahunPelajaran}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* PAGE 1: CONTENT TABEL NILAI */}
              <div className="pt-4 space-y-4">
                
                {/* TABLE OF GRADES */}
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="bg-zinc-100">
                      <th className="border border-black py-2.5 px-2 text-center w-[5%]" rowSpan={2}>No</th>
                      <th className="border border-black py-2.5 px-3 text-left w-[25%]" rowSpan={2}>Mata Pelajaran</th>
                      <th className="border border-black py-2.5 px-2 text-center w-[10%]" rowSpan={2}>Nilai Akhir</th>
                      <th className="border border-black py-1.5 px-3 text-center" colSpan={2}>Capaian Kompetensi</th>
                    </tr>
                    <tr className="bg-zinc-50">
                      <th className="border border-black py-1 px-2 text-left w-[30%]">Capaian Tertinggi</th>
                      <th className="border border-black py-1 px-2 text-left w-[30%]">Capaian Terendah (Perlu Bimbingan)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((item, index) => {
                      const computed = computeGradeInfo(item);
                      return (
                        <tr key={item.id} className="align-top">
                          <td className="border border-black py-2 px-1 text-center font-mono">{index + 1}</td>
                          <td className="border border-black py-2 px-2.5 font-sans font-semibold leading-relaxed text-zinc-900">{item.name}</td>
                          <td className="border border-black py-2 px-1 text-center font-mono font-bold text-sm bg-zinc-50/40">{computed.nilaiAkhir}</td>
                          <td className="border border-black py-2 px-2 text-[9.5px] leading-relaxed font-sans text-zinc-800">
                            {computed.tertinggiDesc}
                          </td>
                          <td className="border border-black py-2 px-2 text-[9.5px] leading-relaxed font-sans text-zinc-800">
                            {computed.terendahDesc}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* EXTRA-CURRICULAR & ATTENDANCE BOXES IN ROW */}
                <div className="grid grid-cols-12 gap-4 pt-2">
                  
                  {/* Ekstrakurikuler Table */}
                  <div className="col-span-7 space-y-2">
                    <span className="text-[10px] font-bold uppercase font-sans text-black block">🗳️ Kegiatan Ekstrakurikuler</span>
                    <table className="w-full border-collapse border border-black text-[10px]">
                      <thead>
                        <tr className="bg-zinc-100">
                          <th className="border border-black py-1.5 px-2 text-center w-[10%]">No</th>
                          <th className="border border-black py-1.5 px-3 text-left w-[45%]">Kegiatan Ekstrakurikuler</th>
                          <th className="border border-black py-1.5 px-3 text-left w-[45%]">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black py-2 text-center font-mono">1</td>
                          <td className="border border-black py-2 px-3 font-sans font-semibold">{extraInfo.ekstraNama || "-"}</td>
                          <td className="border border-black py-2 px-3 font-sans">{extraInfo.ekstraKet || "-"}</td>
                        </tr>
                        <tr>
                          <td className="border border-black py-1.5 text-center font-mono text-zinc-400">2</td>
                          <td className="border border-black py-1.5 px-3 text-zinc-400">-</td>
                          <td className="border border-black py-1.5 px-3 text-zinc-400">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Absent Box Table */}
                  <div className="col-span-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase font-sans text-black block">📅 Ketidakhadiran (Absensi)</span>
                    <table className="w-full border-collapse border border-black text-[10px]">
                      <tbody>
                        <tr>
                          <td className="border border-black py-2 px-3 font-sans font-semibold w-[60%]">Sakit</td>
                          <td className="border border-black py-2 px-3 text-center font-mono font-bold w-[40%]">{extraInfo.sakit} hari</td>
                        </tr>
                        <tr>
                          <td className="border border-black py-2 px-3 font-sans font-semibold">Izin</td>
                          <td className="border border-black py-2 px-3 text-center font-mono font-bold">{extraInfo.izin} hari</td>
                        </tr>
                        <tr>
                          <td className="border border-black py-2 px-3 font-sans font-semibold">Tanpa Keterangan</td>
                          <td className="border border-black py-2 px-3 text-center font-mono font-bold">{extraInfo.alpa} hari</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Catatan Guru Box */}
                <div className="p-3 border border-black rounded bg-zinc-50/20 text-[10px] space-y-1">
                  <span className="font-bold uppercase font-sans text-black block">📝 CATATAN GURU WALI KELAS:</span>
                  <p className="font-sans italic leading-relaxed text-zinc-800 text-[10.5px]">
                    &quot;{extraInfo.catatanGuru}&quot;
                  </p>
                </div>

                {/* keputusan semester 2 */}
                <div className="p-3 border border-black rounded text-[10px] font-sans flex items-center justify-between">
                  <div>
                    <span className="font-bold text-black uppercase">Keputusan Semester 2:</span>
                    <span className="ml-2 font-normal text-zinc-700">Berdasarkan pencapaian kompetensi pada semester ke-1 dan ke-2, peserta didik dinyatakan:</span>
                  </div>
                  <div className="border-2 border-black px-4 py-1.5 font-bold uppercase tracking-wide bg-zinc-100 text-black">
                    {extraInfo.tinggalDiKelas && extraInfo.tinggalDiKelas !== "-" ? (
                      <span>Tinggal di kelas: {extraInfo.tinggalDiKelas}</span>
                    ) : (
                      <span>Naik ke kelas: {extraInfo.naikKeKelas}</span>
                    )}
                  </div>
                </div>

                {/* SIGNATURES SECTION */}
                <div className="pt-8 text-[10.5px] font-sans">
                  
                  <div className="grid grid-cols-3 text-center gap-4">
                    
                    {/* Parent */}
                    <div className="flex flex-col justify-between h-24">
                      <span>Mengetahui,<br />Orang Tua / Wali Siswa,</span>
                      <div className="border-b border-black w-40 mx-auto pt-10" />
                    </div>

                    {/* Principal */}
                    <div className="flex flex-col justify-between h-24">
                      <span>Mengetahui,<br />Kepala Sekolah</span>
                      <div className="font-bold flex flex-col items-center">
                        <span className="underline uppercase font-bold">{schoolProfile.namaKepala}</span>
                        {schoolProfile.nipKepala && schoolProfile.nipKepala !== "-" && (
                          <span className="text-[9px] font-mono font-normal">NIP. {schoolProfile.nipKepala}</span>
                        )}
                      </div>
                    </div>

                    {/* Teacher */}
                    <div className="flex flex-col justify-between h-24">
                      <span>{schoolProfile.tempatLaporan}, {schoolProfile.tanggalLaporan}<br />Guru Kelas,</span>
                      <div className="font-bold flex flex-col items-center">
                        <span className="underline uppercase font-bold">{schoolProfile.namaGuru}</span>
                        {schoolProfile.nipGuru && schoolProfile.nipGuru !== "-" && (
                          <span className="text-[9px] font-mono font-normal">NIP. {schoolProfile.nipGuru}</span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
              
              {/* PRINT STYLE INJECT */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #student-profile-module-root, #student-profile-module-root * {
                    visibility: hidden;
                  }
                  #student-profile-module-root .print\\:p-0, 
                  #student-profile-module-root .print\\:p-0 * {
                    visibility: visible;
                  }
                  #student-profile-module-root .print\\:p-0 {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    border: none !important;
                    box-shadow: none !important;
                  }
                }
              `}</style>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
