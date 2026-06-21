import React, { useState, useEffect } from "react";
import { 
  Sparkles, Download, Copy, Check, Info, FileText, Cpu, Shield, HelpCircle,
  Plus, Trash2, Layers, BookOpen, Clock, CheckCircle, ArrowRight, Save, Database,
  Archive, AlertTriangle, Calendar, Award, UserCheck, RefreshCw, Edit3, Eye
} from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";
import { getTutWuriHandayaniLogo, getKemenagLogo, getDefaultSchoolLogo } from "../utils/logoGenerator";

interface ProjectThemeData {
  key: string;
  label: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultDescription: string;
  defaultTarget: string;
  defaultTime: string;
  dimensions: string[]; // default checked dimensions
  subelements: { dim: string; sub: string; target: string }[];
  schedule: { 
    week: number; 
    title: string; 
    mainActivity: string; 
    detail: string;
    objective?: string;
    expectedValues?: string;
    toolsNeeded?: string;
    estimatedCost?: string;
  }[];
}

const MASTER_MERDEKA_THEMES = [
  { id: "p5_gaya_hidup", label: "Gaya Hidup Berkelanjutan" },
  { id: "p5_kearifan_lokal", label: "Kearifan Lokal" },
  { id: "p5_bhinneka", label: "Bhinneka Tunggal Ika" },
  { id: "p5_bangun_jiwa", label: "Bangunlah Jiwa dan Raganya" },
  { id: "p5_suara_demokrasi", label: "Suara Demokrasi" },
  { id: "p5_rekayasa_tekno", label: "Rekayasa dan Teknologi" },
  { id: "p5_kewirausahaan", label: "Kewirausahaan" },
  { id: "p5_kebekerjaan", label: "Kebekerjaan (Khusus SMK)" }
];

const DIMENSION_SUBELEMENTS_CATALOG: Record<string, {sub: string, target: string}[]> = {
  "Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa": [
    { sub: "Spiritualitas & Pendalaman Agama/Kepercayaan", target: "Mengembangkan landasan spiritual personal, mempraktikkan ibadah harian secara disiplin, dan menghayati kehadiran Tuhan dalam kehidupan." },
    { sub: "Akhlak Mulia kepada Sesama Manusia", target: "Membiasakan perkataan jujur, menghormati hak sesama tanpa memandang latar belakang, serta aktif mendamaikan perselisihan." },
    { sub: "Akhlak Mulia kepada Alam Semesta", target: "Menjaga kebersihan dan kelestarian ekosistem terdekat, menghemat sumber daya air dan energi sebagai bentuk syukur kepada Sang Pencipta." },
    { sub: "Toleransi dan Keberagamaan", target: "Menghargai tradisi keagamaan rekan sekitar, merayakan keberagaman dengan ikhlas, dan menjalin kerukunan antarumat beragama." }
  ],
  "Kewargaan": [
    { sub: "Tanggung Jawab Sosial & Pengambilan Peran", target: "Mengidentifikasi kebutuhan bersama di sekolah/komunitas, berpartisipasi aktif dalam kegiatan gotong-royong lingkungan." },
    { sub: "Kepedulian Lingkungan & Geografis", target: "Menyusun peta kerentanan masalah sampah/kekeringan lokal di lingkungan sekitar dan aktif menjalankan aksi mitigasi." },
    { sub: "Cinta Tanah Air & Kesadaran Nasional", target: "Mengapresiasi lambang negara, melestarikan sejarah perjuangan pahlawan daerah, serta berpartisipasi dalam upacara bendera secara khidmat." }
  ],
  "Penalaran Kritis": [
    { sub: "Memproses Informasi, Data, dan Gagasan", target: "Mengumpulkan data objektif harian, mengklarifikasi fakta dari opini, serta menyusun kesimpulan logis non-bias." },
    { sub: "Menganalisis dan Mengevaluasi Masalah", target: "Menjelaskan hubungan sebab-akibat dari masalah nyata di sekolah, menguji argumen dari berbagai sudut pandang." },
    { sub: "Refleksi Pemikiran dan Pengambilan Keputusan", target: "Menimbang pro-kontra opsi solusi sebelum mengambil tindakan bersama demi kepentingan kelompok." }
  ],
  "Kreativitas": [
    { sub: "Menghasilkan Gagasan Orisinal", target: "Menggabungkan beberapa gagasan berbeda untuk menciptakan gagasan baru yang aplikatif dan tak terbatas." },
    { sub: "Menciptakan Karya & Tindakan Orisinal", target: "Merancang dan memproduksi purwarupa kerajinan, produk pangan, atau media kampanye yang estetik dan ramah lingkungan." },
    { sub: "Keluwesan Berpikir / Adaptasi Alternatif", target: "Menemukan jalur alternatif memecahkan masalah ketika rencana awal mengalami kegagalan di lapangan." }
  ],
  "Kolaborasi": [
    { sub: "Kerja Sama Tim & Koordinasi Sosial", target: "Membagi peran kelompok secara adil, menyelaraskan kecepatan kerja tim, dan berkoordinasi santun demi kelancaran tugas bersama." },
    { sub: "Saling Menghormati & Sinergi Gotong Royong", target: "Mengapresiasi kontribusi/pendapat rekan kelompok, bersikap suportif, dan membantu rekan yang mengalami kesulitan." },
    { sub: "Resolusi Konflik Konstruktif", target: "Mendiskusikan perbedaan pendapat secara kepala dingin, mengutamakan mufakat dalam perselisihan kelompok." }
  ],
  "Kemandirian": [
    { sub: "Inisiatif Kerja & Motivasi Diri", target: "Memulai tugas-tugas projek secara mandiri tanpa menunggu perintah terus-menerus dari guru pendamping." },
    { sub: "Regulasi Diri & Disiplin Waktu Kerja", target: "Mengelola jadwal kerja harian, mengumpulkan lembar progres tepat waktu, dan mempertahankan fokus di tengah distraksi." },
    { sub: "Adaptasi & Ketangguhan Menghadapi Hambatan", target: "Menerima umpan balik perbaikan dari guru dengan lapang dada, bangkit kembali mengevaluasi kesalahan produk projek." }
  ],
  "Kesehatan": [
    { sub: "Kesejahteraan Lahir Batin (Well-being)", target: "Mengidentifikasi kondisi emosi diri harian, mengekspresikan keluh kesah secara sehat, serta menjaga kebahagiaan psikososial." },
    { sub: "Kebugaran Fisik & Pembiasaan Hidup Bersih", target: "Menjaga stamina fisik melalui istirahat teratur, memilah asupan gizi bergizi, serta membudayakan cuci tangan dan kelola sanitasi personal." },
    { sub: "Kestabilan Emosi & Pengendalian Diri", target: "Melatih ketenangan nafas saat tertekan, mengelola rasa marah/kecewa agar tidak merugikan diri sendiri maupun kawan sebaya." }
  ],
  "Komunikasi": [
    { sub: "Penyampaian Gagasan & Pendapat Terstruktur", target: "Mempresentasikan hasil riset projek secara runut, komprehensif, dan menggunakan bahasa Indonesia yang baik serta sopan." },
    { sub: "Mendengarkan secara Aktif & Empatik", target: "Menyimak pemaparan rekan kelompok dengan penuh perhatian, memberikan umpan balik tanggapan secara sopan tanpa memotong pembicaraan." },
    { sub: "Pengekspresian Gagasan Non-Verbal & Visual", target: "Merancang diagram grafik, poster pameran, atau media kampanye digital yang jelas, informatif, dan mudah dipahami khalayak." }
  ]
};

const getDynamicThemeDetails = (themeKey: string, profileObj: any): ProjectThemeData => {
  const schoolName = profileObj.schoolName || "SD NEGERI FATUBAI";
  const kecamatan = profileObj.kecamatan || "Insana Tengah";
  const kabupaten = profileObj.kabupaten || "Timor Tengah Utara";
  const provinsi = profileObj.provinsi || "Nusa Tenggara Timur";
  const tempat = profileObj.tempat || "Fatubai";
  const teacherName = profileObj.teacherName || "Roni Hariyanto Bhidju, S.Pd., Gr";
  const principalName = profileObj.principalName || "Darius Kusi, S.Pd., Gr";
  const faseKelas = profileObj.faseKelas || "Kelas IV / Fase B";

  // Infer jenjang
  let jenjang = "SD";
  const sNameUpper = schoolName.toUpperCase();
  if (sNameUpper.includes("SMP") || sNameUpper.includes("MTS")) {
    jenjang = "SMP";
  } else if (sNameUpper.includes("SMA") || sNameUpper.includes("SMK") || sNameUpper.includes("MAN")) {
    jenjang = "SMA/SMK";
  }

  // Set default hours based on jenjang
  const defaultTime = jenjang === "SD" 
    ? "54 JP (Jam Pelajaran) Efektif" 
    : jenjang === "SMP" 
      ? "72 JP (Jam Pelajaran) Efektif" 
      : "108 JP (Jam Pelajaran) Efektif";

  switch (themeKey) {
    case "p5_gaya_hidup":
      return {
        key: "p5_gaya_hidup",
        label: "Gaya Hidup Berkelanjutan",
        defaultTitle: "Pilah Sampah, Kelola Kompos Lahan Kering",
        defaultSubtitle: "Gerakan Hijau dan Manajemen Sampah Lestari Terintegrasi",
        defaultDescription: `Projek ini bertujuan membangun kesadaran pelestarian alam serta mitigasi perubahan iklim di wilayah Kecamatan ${kecamatan}, Kabupaten ${kabupaten}. Murid diajak mengamati timbunan sampah kantin di ${schoolName}, mengeksperimen pengolahan sampah daun organik menjadi pupuk kompos guna menyuburkan tanah pekarangan sekolah yang tandus, serta memilah sampah plastik untuk diubah menjadi produk ecobrick fungsional yang estetik.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", "Kewargaan", "Kreativitas"],
        subelements: [
          { dim: "Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", sub: "Akhlak Mulia kepada Alam Semesta", target: "Membiasakan tindakan penjagaan kelestarian lingkungan alam sekitar sebagai perwujudan syukur kepada Tuhan." },
          { dim: "Kewargaan", sub: "Kepedulian Lingkungan & Geografis", target: `Mengidentifikasi kerentanan ekologis sampah basah-kering di Kecamatan ${kecamatan} dan meresponnya melalui gerakan pemilahan.` },
          { dim: "Kreativitas", sub: "Menciptakan Karya & Tindakan Orisinal", target: "Merakit limbah botol PET bersih menjadi kursi ecobrick kokoh penunjang fasilitas membaca kelas." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Eksplorasi Ekologi Lokal", mainActivity: `Sosialisasi dampak timbunan plastik pada ekosistem Kabupaten ${kabupaten} yang marak kekeringan.`, detail: "Siswa menyimak materi bahaya mikroplastik, menyortir bahan ajar visual, dan merumuskan komitmen bersama menyukseskan hidup minim plastik." },
          { week: 2, title: "Tahap Kontekstualisasi: Audit Sampah Kelas", mainActivity: `Mencatat timbunan sampah harian yang dihasilkan oleh kantin dan kelas di ${schoolName}.`, detail: "Siswa secara berkelompok menimbang sampah bekal harian selama 5 hari berturut-turut, menyusun diagram garis progres penyusutan sampah harian kelas." },
          { week: 3, title: "Tahap Perencanaan Teknis & Kemitraan", mainActivity: "Diskusi menyusun sketsa tong sampah terpilah bermedia warna", detail: "Mengundang komite sekolah atau penjaga sekolah membicarakan lokasi pengerjaan kompos terisolasi yang aman dan higienis harian bagi sekolah." },
          { week: 4, title: "Tahap Aksi Nyata I: Produksi Wadah Pilah", mainActivity: "Menghias kaleng cat bekas / kardus bekas tebal menjadi tong sampah artistik", detail: "Siswa mengecat tong kelola sampah dengan sandi warna internasional (Hijau: Organik, Kuning: Anorganik) disertai tulisan penjelas lisan." },
          { week: 5, title: "Tahap Aksi Nyata II: Reaktor Kompos Lahan Sederhana", mainActivity: "Praktik mencampur sisa buah kantin dengan dedaunan kering", detail: "Siswa mengaduk bahan kompos, menambahkan cairan ragi EM4, dan menutup rapat dalam ember berlubang udara untuk fermentasi 3 pekan berjalan." },
          { week: 6, title: "Tahap Evaluasi & Refleksi Keberlanjutan", mainActivity: "Sidang keliling kelas memantau ketaatan pemakaian tong sampah baru", detail: "Setiap kelas mendiskusikan penurunan persentase sampah plastik campur aduk setelah orasi kampanye aksi damai kokurikuler." },
          { week: 7, title: "Tahap Gelar Karya & Ekshibisi Hijau", mainActivity: `Pameran hasil komposting dan ecobrick di pelataran ${tempat}`, detail: `Siswa memajang produk, membagikan sampel kompos gratis ke warga sekitar, serta menyajikan presentasi di hadapan Kepala Sekolah ${principalName}.` }
        ]
      };
    
    case "p5_kearifan_lokal":
      return {
        key: "p5_kearifan_lokal",
        label: "Kearifan Lokal",
        defaultTitle: "Pelestarian Tenun Ikat Buna dan Budaya Warisan Timor",
        defaultSubtitle: "Pewarisan Seni Tenun dan Tradisi Mulia Nusantara Generasi Emas",
        defaultDescription: `Mendalami sejarah luhur kebudayaan tenun buna khas adat ${kecamatan}, Kabupaten ${kabupaten}. Murid diajak mewawancarai maestro pengrajin tenun sekitar, melukis corak geometris tarian adat, memahami filosofi rukun guyub gotong royong Timor, serta mendaur ulang perca kain tenun sisa menjadi aksesoris bernilai tinggi.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Kewargaan", "Kolaborasi", "Kreativitas"],
        subelements: [
          { dim: "Kewargaan", sub: "Cinta Tanah Air & Kesadaran Nasional", target: `Menghargai warisan tenun ikat Buna Sotis di ${kabupaten} sebagai khazanah identitas kebangsaan Indonesia yang agung.` },
          { dim: "Kolaborasi", sub: "Sikap Bergotong Royong & Menghargai Peran Sesama", target: "Berkoordinasi aktif dalam merangkum cerita lisan sejarah asal usul raja/feto adat setempat." },
          { dim: "Kreativitas", sub: "Menghasilkan Gagasan Orisinal", target: "Membuat aksesoris kerajinan tangan trendi dengan sentuhan corak tektun tenunan lokal." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Warisan Emas Leluhur Timor", mainActivity: `Mengkaji ragam hias kain tenun ikat lambang status adat di ${provinsi}.`, detail: "Siswa mengamati contoh lembar tenun pusaka, mencermati makna simbol geometris flora-fauna tameng adat di depan kelas." },
          { week: 2, title: "Tahap Kontekstualisasi: Bertamu ke Maestro Tenun", mainActivity: `Melakukan wawancara kelompok dengan penenun tradisional di Kecamatan ${kecamatan}.`, detail: "Menelisik proses panjang pemintalan kapas, pencarian pewarna akar tarum alamiah, serta menulis catatan kesabaran penenun." },
          { week: 3, title: "Tahap Perancang Corak & Desain Kliping", mainActivity: "Menggambar visualisasi corak tenunan buna di kertas kotak grafis", detail: "Siswa mewarnai pola rancangan dengan pensil warna, menyusun kliping penjelasan makna filosofi tatanan adat lering." },
          { week: 4, title: "Tahap Aksi Nyata: Transformasi Perca Tenun", mainActivity: "Menjahit manual perca tenun menjadi gantungan kunci / pembatas buku", detail: "Kelompok menyatukan sisa potongan kain tenun luring, menghiasnya dengan manik-manik tali rami ramah lingkungan." },
          { week: 5, title: "Tahap Evaluasi & Penulisan Lembar Refleksi", mainActivity: "Mengisi esai reflektif bertajuk Aku Cinta Produk Warisan Nusantara dalam Jurnal", detail: "Guru kelas mengisi lembar asesmen berjalan melihat rasa bangga budaya siswa." },
          { week: 6, title: "Tahap Gelar Pesta Budaya Adat Timor", mainActivity: `Pentas mini busana adat Timor dan ekshibisi kerajinan di ${schoolName}`, detail: `Siswa memamerkan aksesoris perca tenun, berpose mengenakan selendang adat, diiringi instrumen musik gong tradisional TTU.` }
        ]
      };

    case "p5_kewirausahaan":
      return {
        key: "p5_kewirausahaan",
        label: "Kewirausahaan",
        defaultTitle: "Market Day: Kuliner Tradisional Timor yang Bergizi",
        defaultSubtitle: "Melatih Kemandirian Finansial Lewat Olahan Pangan Lokal Resilient",
        defaultDescription: `Memupuk mental mandiri dan integritas jujur bertransaksi sejak dini. Mengingat letak geografis ${kecamatan} yang kaya komoditas hortikultura lahan kering, murid diajak mengolah bahan baku lokal pangan seperti ubi madu, pisang savanna, atau jagung menjadi olahan kuliner sehat higienis (keripik/bose renyah), merencanakan anggaran kas modal, serta mendagangkannya pada festival Market Day sekolah.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Kemandirian", "Kreativitas", "Komunikasi"],
        subelements: [
          { dim: "Kemandirian", sub: "Regulasi Diri & Disiplin Waktu Kerja", target: "Mengatur penggunaan modal patungan berbelanja bahan baku secara cermat tanpa pemborosan surplus." },
          { dim: "Kreativitas", sub: "Menciptakan Karya & Tindakan Orisinal", target: "Mengembangkan resep jualan sehat berbahan ubi/pisang lokal NTT berkemasan daun pisang estetik." },
          { dim: "Komunikasi", sub: "Penyampaian Gagasan & Pendapat Terstruktur", target: "Mempromosikan kelebihan gizi pangan lokal kreasi kelompok sewaktu bazar berlangsung secara sopan." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Integritas Berdagang Jujur", mainActivity: "Edukasi nilai mata uang, laba-rugi, dan pencegahan kecurangan tim", detail: "Siswa berdiskusi tentang teladan kejujuran pedagang, mengidentifikasi pentingnya pelayanan ramah lisan." },
          { week: 2, title: "Tahap Kontekstualisasi: Survei Selera Konsumen", mainActivity: `Menyebarkan kuisioner lisan sederhana ke murid kelas lain di ${schoolName}.`, detail: "Menganalisis jenis camilan sehat non-pewarna kimia yang diminati, mengelompokkannya dalam statistik sederhana." },
          { week: 3, title: "Tahap Pemetaan Budget & Formula Menu", mainActivity: "Pembagian tugas operasional (koki, kasir pencatat, promosi tim)", detail: "Menyusun lembar rincian belanja modal kontribusi maksimal Rp 10.000 per siswa dengan bimbingan Guru S2/Pembina." },
          { week: 4, title: "Tahap Praktik Produksi Higienis", mainActivity: "Uji coba mengolah pisang tanduk / singkong madu menjadi keripik gurih", detail: "Aspek kebersihan memasak ditekankan penuh, melarang pemakaian plastik pembungkus sekali pakai (mengganti daun/kertas)." },
          { week: 5, title: "Tahap Gelar Akbar Festival Market Day", mainActivity: "Bazar riang niaga di koridor kelas bersandi stan hiasan lokal", detail: "Siswa melayani pembeli, mengoperasikan catatan transaksi di papan kasir transparan, mempraktikkan pengembalian uang koin secara presisi." },
          { week: 6, title: "Tahap Audit Laba & Jurnal Evaluasi Akhir", mainActivity: `Perhitungan total margin keuntungan dipandu Guru ${teacherName}`, detail: "Siswa merapikan inventaris dagang, menghitung pembagian hasil secara jujur, mengalokasikan infak sosial." }
        ]
      };

    case "p5_bhinneka":
      return {
        key: "p5_bhinneka",
        label: "Bhinneka Tunggal Ika",
        defaultTitle: "Turnamen Harmoni Permainan Rakyat Tradisional",
        defaultSubtitle: "Merayakan Kebersamaan Inklusif Melalui Olahraga Fisik Nusantara",
        defaultDescription: `Projek inklusif pembina karakter persaudaraan dan anti-diskriminasi. Di tengah kemajuan teknologi gawai luring, murid ${schoolName} digandeng menggali asal-usul filosofis olahraga rakyat seperti bakiak tandem, bentengan, dan egrang batok kelapa khas daerah ${tempat}, lalu menyelenggarakan kejuaraan persahabatan ramah anak lintas kelas demi memupuk toleransi nyata.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Kewargaan", "Kolaborasi", "Komunikasi"],
        subelements: [
          { dim: "Kewargaan", sub: "Cinta Tanah Air & Kesadaran Nasional", target: "Menjunjung nilai persatuan dengan melestarikan permainan rakyat fisik peninggalan leluhur nusantara." },
          { dim: "Kolaborasi", sub: "Saling Menghormati & Sinergi Gotong Royong", target: "Berkoordinasi langkah menyelaraskan ritme gerak kaki bakiak tandem kelompok tanpa saling menyalahkan." },
          { dim: "Komunikasi", sub: "Mendengarkan secara Aktif & Empatik", target: "Mendiskusikan takti bermain tim secara santun, mendengarkan saran teman yang berkapasitas gerak lambat." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Eksplorasi Khazanah Dolanan Rakyat", mainActivity: "Bedah sejarah permainan bakiak tim, egrang batok, dan bentengan nusantara", detail: "Menonton video animasi permainan massa, mendiskusikan nilai keakraban sosial luring dibanding game ponsel." },
          { week: 2, title: "Tahap Kontekstualisasi: Polling Durasi Bermain Gawai", mainActivity: "Menyusun komparasi jam gerak tubuh murid harian dibanding menatap layar ponsel", detail: "Siswa menulis refleksi kegundahan berkurangnya interaksi fisik di rumah masing-masing." },
          { week: 3, title: "Tahap Perakitan Alat Permainan", mainActivity: "Membuat bilah bakiak tandem kayu atau egrang batok kelapa pekarangan", detail: "Menggunakan bambu sisa bangunan, meraut batok kelapa, melubanginya, memasang tali rami secara kokoh dan aman." },
          { week: 4, title: "Tahap Sosialisasi Aturan & Sumpah Atlet Ramah", mainActivity: "Pembagian tim regu secara acak lintas agama, suku, dan taraf belajar siswa", detail: "Membacakan maklumat sportivitas: menang berlapang dada, kalah tersenyum sportif." },
          { week: 5, title: "Tahap Festival Gelar Bhinneka Ceria", mainActivity: `Turnamen persahabatan di lapangan rumput ${schoolName}`, detail: "Pertandingan bakiak, keliling lintasan estafet batok kelapa keliling, dihiasi sorak-sorai yel-yel kebanggaan kekompakan." },
          { week: 6, title: "Tahap Refleksi: Jurnal Foto & Penyerahan Piagam Toleransi", mainActivity: "Menempel kesan foto keceriaan bersama di mading koridor sekolah", detail: "Siswa saling menulis apresiasi moral di carik kertas berpola bunga persahabatan." }
        ]
      };

    case "p5_bangun_jiwa":
      return {
        key: "p5_bangun_jiwa",
        label: "Bangunlah Jiwa dan Raganya",
        defaultTitle: "Sekolah Damai Bebas Perundungan dan Sehat Raga",
        defaultSubtitle: "Rukun Bersahabat Anti Bullying Menuju Sekolah Sehat Bahagia NTT",
        defaultDescription: `Merajut iklim sekolah aman bermental positif dan bugar jasmani di ${schoolName}. Berlandaskan geofisikal daerah ${kabupaten} dalam menjaga nutrisi tumbuh kembang anak, murid dididik menolak aksi intimidasi (bullying verbal/fisik) siber maupun luring, mengampanyekan persahabatan tulus, sekalian membiasakan sarapan bergizi gizi seimbang lokal luring PHBS.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", "Kesehatan", "Kolaborasi"],
        subelements: [
          { dim: "Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", sub: "Akhlak Mulia kepada Sesama Manusia", target: "Memelihara pertemanan setara bebas ejekan, menolak perilaku intimidasi yang menyakiti raga kawan." },
          { dim: "Kesehatan", sub: "Kestabilan Emosi & Pengendalian Diri", target: "Mengindikasikan emosi marah harian pribadi dan melatih meredamnya tanpa pelampiasan kekerasan." },
          { dim: "Kolaborasi", sub: "Kerja Sama Tim & Koordinasi Sosial", target: "Menggalang agen damai persahabatan anti-bullying yang aktif merangkul anak penyendiri." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Mengenali Luka Batin Korban Bully", mainActivity: "Bedah kasus perundungan verbal lewat tontonan pendek / kasus fiktif", detail: "Siswa mencermati akibat hancurnya rasa percaya diri korban ejekan nama orang tua atau fisik." },
          { week: 2, title: "Tahap Kontekstualisasi: Denah Zona Rawan Ejekan", mainActivity: `Menggambar peta sosiogram kerawanan bullying di koridor kelas ${schoolName}.`, detail: "Siswa mengidentifikasi waktu istirahat yang sering terjadi candaan berlebih yang menjerumus intimidasi." },
          { week: 3, title: "Tahap Edukasi Pangan Bergizi & PHBS Sehat", mainActivity: "Penyuluhan gizi seimbang: telur rebus, kelor NTT pencegah stunting fisik", detail: "Mengampanyekan minum air putih bersih higienis dan rutin mencuci tangan pakai sabun di air mengalir." },
          { week: 4, title: "Tahap Aksi Nyata I: Spanduk Cap Ibu Jari Sejuta Sahabat", mainActivity: "Mengecap sidik jari bermedia warna di spanduk Kampanye Damai", detail: "Setiap guru, staf, Kepsek Darius Kusi, dan murid menandatangani deklarasi luring bersama." },
          { week: 5, title: "Tahap Simulasi Bermain Peran (Sosio-Drama)", mainActivity: "Pementasan memerankan aksi melerai ejekan kawan secara persuasif", detail: "Melatih siswa berani bersuara berkata 'Hentikan, Candamu Tidak Lucu!' dengan tegas." },
          { week: 6, title: "Tahap Rekonsiliasi & Refleksi Hati Nurani", mainActivity: "Menulis surat permohonan maaf rahasia berselimut coklat/makanan kecil lokal", detail: "Siswa saling berjabat tangan mengubur permusuhan lama dipandu Guru Wali Kelas." }
        ]
      };

    case "p5_suara_demokrasi":
      return {
        key: "p5_suara_demokrasi",
        label: "Suara Demokrasi",
        defaultTitle: "Demokrasi Cilik: Musyawarah Adat Timor dalam Memiih Pemimpin",
        defaultSubtitle: "Melatih Musyawarah Mufakat Jujur serta Pemilu Kelas Berintegritas",
        defaultDescription: `Membumikan pilar kedaulatan musyawarah mufakat di ${schoolName}. Menyadari besarnya nilai adat kekeluargaan di Kecamatan ${kecamatan}, murid diajak mensimulasikan tata cara pemilihan ketua kelas/OSIS terintegrasi musyawarah adat Timor, orasi visi-misi secara asertif, coblos tertib rahasia, dan menerima hasil mufakat akhir bermoral tinggi.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Kewargaan", "Kolaborasi", "Komunikasi"],
        subelements: [
          { dim: "Kewargaan", sub: "Tanggung Jawab Sosial & Pengambilan Peran", target: "Mengambil bagian merundingkan tata tertib bersama menuju iklim kelas aman kondusif." },
          { dim: "Kolaborasi", sub: "Sikap Bergotong Royong & Menghargai Peran Sesama", target: "Menghargai hak veto dan hak usulan suara kandidat saingan dalam diskusi mufakat." },
          { dim: "Komunikasi", sub: "Penyampaian Gagasan & Pendapat Terstruktur", target: "Orasi mempresentasikan visi perbaikan kelas di depan umum secara santun bebas provokasi." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Nilai Pemimpin Adil", mainActivity: "Mendengarkan kisah tokoh pemimpin daerah NTT yang berintegritas tinggi", detail: "Siswa mendiskusikan kriteria pemimpin idaman: jujur, adil, mendengar keluhan, bugar lahir batin." },
          { week: 2, title: "Tahap Kontekstualisasi: Menelaah Perdebatan Kelas", mainActivity: "Simulasi membagi jadwal piket yang memuaskan seluruh pihak", detail: "Memahami esensi musyawarah mufakat mengesampingkan keegoisan kelompok pribadi." },
          { week: 3, title: "Tahap Pembentukan Komisi Pemilihan Kelas (KPK)", mainActivity: "Siswa menunjuk penyelenggara independen, menetapkan logo panggung", detail: "Merumuskan kriteria ketat calon ketua (tidak pernah merundung, berakhlak mulia)." },
          { week: 4, title: "Tahap Kampanye Debat & Orasi Visi-Misi", mainActivity: "Penyampaian gagasan sudut mading kreatif dan pojok literasi kelas", detail: "Siswa menjawab pertanyaan dari rekan pemilih secara tenang dan bermartabat lisan." },
          { week: 5, title: "Tahap Pemungutan Suara Terbuka & Tinta Biru", mainActivity: "Simulasi menyalurkan hak suara secara luber jurdil di bilik kardus bekas", detail: "Penghitungan papan tulis raksasa secara berurutan 'SAH!' disaksikan Wali Kelas." },
          { week: 6, title: "Tahap Tindak Lanjut: Pelantikan Damai Pemimpin Baru", mainActivity: "Serah terima jabatan simbolis, pidato janji bakti ketua terpilih", detail: `Kepala Sekolah ${principalName} memberikan sambutan peneguhan kepedulian kepemimpinan.` }
        ]
      };

    case "p5_rekayasa_tekno":
      return {
        key: "p5_rekayasa_tekno",
        label: "Rekayasa dan Teknologi",
        defaultTitle: "Instalasi Filtrasi Penjernih Air Savana Timor",
        defaultSubtitle: "Solusi Teknologi Tepat Guna Penyelaras Higiene Lahan Tandus NTT",
        defaultDescription: `Merespon kondisi klimatologi geografis di Kabupaten ${kabupaten} yang kering berselimut savana. Murid dibimbing menerapkan nalar kritis engineering fisika murni untuk merakit instalasi penjernih air non-kimiawi menggunakan susunan ijuk serat, arang batok kelapa pekarangan, kerikil, dan pasir kwarsa guna menyaring air parit keruh menjadi jernih layak guna siram pembibitan kelor sekolah.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Penalaran Kritis", "Kreativitas", "Kolaborasi"],
        subelements: [
          { dim: "Penalaran Kritis", sub: "Menganalisis dan Mengevaluasi Masalah", target: "Mengidentifikasi faktor kekeruhan air dan menentukan komposisi tumpukan media filter air bertingkat." },
          { dim: "Kreativitas", sub: "Menciptakan Karya & Tindakan Orisinal", target: "Mengeksplorasi susunan filtrasi botol air bekas gantung vertikal berdaya saring jernih tinggi." },
          { dim: "Kolaborasi", sub: "Kerja Sama Tim & Koordinasi Sosial", target: "Melakukan instalasi tabung pipa bersama kelompok secara sinergi fungsional secara aman." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Geografi Kering Savana Timor", mainActivity: `Mencermati kelangkaan air bersih sanitasi di dataran NTT waktu musim kemarau`, detail: "Diskusi kebutuhan air mandi sehat, cuci tangan penumpas stunting lahir batin." },
          { week: 2, title: "Tahap Kontekstualisasi: Pengambilan Contoh Air Keruh", mainActivity: "Mengambil air tampungan parit berdebu tanah dari parit sekitar pemukiman", detail: "Menakar parameter kekeruhan awal (warna coklat pekat, bau tanah lembab)." },
          { week: 3, title: "Tahap Teori Saring Alami Non-Kimia", mainActivity: "Mempelajari tumpukan media berpori: arang penumpas bakteri, ijuk penahan debu", detail: "Kelompok menyusun draf gambar teknik instalasi gantung botol penyaring harian." },
          { week: 4, title: "Tahap Perakitan Tabung Saring Vertikal", mainActivity: "Mengisi botol mineral kosong jumbo 1.5L dengan media filter bertingkat", detail: "Siswa menata ketebalan pasir 5cm, arang 10cm, ijuk 5cm, dan kerikil halus di paling dasar." },
          { week: 5, title: "Tahap Uji Coba Penyaringan Air Riil", mainActivity: "Mengalirkan air keruh secara perlahan menembus reaktor buatan kelompok", detail: "Menghitung durasi tetesan keluar, membandingkan derajat kejernihan air filtrasi saringan murni." },
          { week: 6, title: "Tahap Evaluasi & Gelar Purwarupa Engineering", mainActivity: `Pameran instalasi air fungsional di depan Guru ${teacherName} dan Komite`, detail: "Koran air hasil sulingan luring digunakan menyiram tanaman cabai pekarangan sekolah secara aman." }
        ]
      };

    case "p5_kebekerjaan":
      return {
        key: "p5_kebekerjaan",
        label: "Kebekerjaan",
        defaultTitle: "Kesiapan Karir Madani dan Potensi Koperasi Kreatif Lokal",
        defaultSubtitle: "Inkubasi Portofolio Produktif Menuju Kemandirian Industri Timor NTT",
        defaultDescription: `Projek khusus penyiapan kompetensi karir masa depan selaras potensi sub-sektor ekonomi kreatif daerah NTT. Murid dilatih mengaitkan minat bakat personal, merancang profil CV visual representatif, mempraktikkan simulasi interview kerja santun-profesional, serta memahami manajemen mutu produksi kerajinan lokal Buna bernilai jual ekspor.`,
        defaultTarget: `Seluruh Peserta Didik ${faseKelas}`,
        defaultTime,
        dimensions: ["Kemandirian", "Komunikasi", "Penalaran Kritis"],
        subelements: [
          { dim: "Kemandirian", sub: "Inisiatif Kerja & Motivasi Diri", target: "Menyusun draf peta jalan pencapaian kecakapan mandiri penopang sertifikasi siap kerja." },
          { dim: "Komunikasi", sub: "Penyampaian Gagasan & Pendapat Terstruktur", target: "Mengartikulasikan portofolio praktek kerja kelompok secara asertif, lugas, berpola lisan tertata harian." },
          { dim: "Penalaran Kritis", sub: "Refleksi Pemikiran dan Pengambilan Keputusan", target: `Menganalisis serapan modal koperasi tenun serta tantangan digital perkantoran di Kabupaten ${kabupaten}.` }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Etos Kerja Disiplin 5.0", mainActivity: "Sosialisasi loyalitas profesional, ketepatan waktu kerja, dan etika komunikasi lisan", detail: "Siswa menyimak studi kasus kriteria karyawan sukses di berbagai ekosistem modern." },
          { week: 2, title: "Tahap Kontekstualisasi: Telaah Industri Lokal", mainActivity: `Menganalisis pertumbuhan MSME / Koperasi Tenun Adat di Nusa Tenggara Timur`, detail: "Siswa merinci peluang komersialisasi produk adat menggunakan sentuhan branding digital modern." },
          { week: 3, title: "Tahap Penyusunan Portofolio Menarik", mainActivity: "Merancang draf CV visual pribadi berisi minat, bakat, kejuaraan sekolah", detail: "Dipandu secara luring, menyusun lembar karya yang bersih, estetik, berdasar objektivitas." },
          { week: 4, title: "Tahap Kelas Simulasi Interview Kerja", mainActivity: "Praktik wawancara tatap muka: berpakaian sopan, postur tegap, nada asertif", detail: "Melatih siswa mempercayai diri menjawab soalan tantangan adaptasi dunia kerja nyata harian." },
          { week: 5, title: "Tahap Refleksi Hambatan & Unjuk Kompetensi", mainActivity: `Gelar stan pameran CV portofolio kelas ditinjau langsung Guru ${teacherName}`, detail: "Siswa mengoleksi saran perbaikan, menandatangani komitmen integritas pekerja madani." }
        ]
      };

    default:
      return {
        key: "p5_gaya_hidup",
        label: "Gaya Hidup Berkelanjutan",
        defaultTitle: "Pilah Sampah, Selamatkan Bumi",
        defaultSubtitle: "Pengelolaan Sampah Terpadu di Lingkungan Sekolah",
        defaultDescription: "Siswa diajak mengenali jenis-jenis sampah di sekitarnya, mengukur volume sampah harian kelas, berkolaborasi membuat wadah pilah organik-nonorganik, dan mengolahnya menjadi barang berdaya guna (kompos/ecobrick), demi memupuk kepedulian lingkungan secara nyata.",
        defaultTarget: "Seluruh Peserta Didik Fase Aktif",
        defaultTime: "54 JP (Jam Pelajaran)",
        dimensions: ["Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", "Kolaborasi", "Kreativitas"],
        subelements: [
          { dim: "Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa", sub: "Akhlak Mulia kepada Alam Semesta", target: "Membiasakan tindakan pelestarian alam dan kebersihan lingkungan sekolah." },
          { dim: "Kolaborasi", sub: "Kerja Sama Tim & Koordinasi Sosial", target: "Menampilkan tindakan kerja sama tim guna mencapai hasil kelompok yang terbaik." },
          { dim: "Kreativitas", sub: "Menciptakan Karya & Tindakan Orisinal", target: "Mengeksplorasi bahan bekas untuk didaur ulang menjadi produk fungsional ramah lingkungan." }
        ],
        schedule: [
          { week: 1, title: "Tahap Pengenalan: Eksplorasi Ancaman Sampah", mainActivity: "Sosialisasi dampak limbah plastik bagi kesehatan", detail: "Siswa menyimak paparan materi mengenai bahaya pencemaran lingkungan, penayangan video pendek akumulasi sampah plastik di laut, serta melakukan diskusi tanya jawab interaktif." },
          { week: 2, title: "Tahap Kontekstualisasi: Detektif Sampah Sekolah", mainActivity: "Observasi dan pendataan sampah harian kelas", detail: "Siswa secara berkelompok menimbang dan menyortir jenis sampah yang dihasilkan kelas mereka selama 5 hari berturut-turut, lalu menyusunnya dalam tabel diagram sederhana." },
          { week: 3, title: "Tahap Perencanaan Teknis", mainActivity: "Membangun sketsa tong sampah terpilah bermedia warna", detail: "Siswa mendesain wadah sampah kreatif berbahan barang bekas." },
          { week: 4, title: "Tahap Aksi Nyata I: Pembuatan Wadah Pilah", mainActivity: "Pembuatan tempat sampah kreatif dari barang bekas", detail: "Siswa menghias tong cat bekas atau kardus kokoh bekas untuk dijadikan tong sampah terpilah bersandi warna yang menarik di koridor sekolah." },
          { week: 5, title: "Tahap Aksi Nyata II: Reaktor Kompos", mainActivity: "Praktik pembuatan pupuk kompos cair / ecobrick multifungsi", detail: "Siswa mengumpulkan dedaunan kering dicampur sisa buah kantin sekolah untuk difermentasi jadi pupuk cair." },
          { week: 6, title: "Tahap Refleksi & Gelar Karya", mainActivity: "Review keberlanjutan kebiasaan membuang sampah", detail: "Setiap kelas mendiskusikan penurunan volume sampah plastik setelah kampanye aksi dan mencatat perubahan perilaku positif teman sekelas." }
        ]
      };
  }
};

function parseTeamMembers(str: string): string[] {
  if (!str) return [];
  // If user used semicolons, split by semicolon
  if (str.includes(";")) {
    return str.split(";").map(s => s.trim()).filter(Boolean);
  }
  // If user used newlines, split by newline
  if (str.includes("\n")) {
    return str.split("\n").map(s => s.trim()).filter(Boolean);
  }
  
  // Otherwise, split by comma, but be smart! Let's not split a name away from its titles.
  const rawParts = str.split(",");
  const members: string[] = [];
  let currentMember = "";

  // Standard Indonesian title segments to attach to the previous name segment if they occur
  const titleKeywords = [
    "s.pd", "m.pd", "gr", "s.ag", "s.si", "s.kom", "s.teh", "s.th", "s.t", "s.e", "s.h", "s.ip", "s.sos", "s.psi", "s.stat", "s.hum", "m.si", "m.kom", "s.s", "s.ked", "s.farm", "s.pi", "s.kh", "s.p", "s.hut", "a.ma", "a.md", "dra", "drs", "prof", "dr", "b.at", "b.sc", "m.sc", "ph.d", "lc"
  ];

  rawParts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    
    const isTitle = titleKeywords.some(title => {
      const cleanTitle = title.replace(/\./g, "");
      const cleanLower = lower.replace(/\./g, "");
      return cleanLower === cleanTitle || cleanLower.startsWith(cleanTitle) || cleanLower.endsWith(cleanTitle);
    }) || 
    /^[A-Z]\.[A-Z][a-z]?\.?$/i.test(trimmed) ||
    /^(gr|dr|lc|ir)\.?$/i.test(trimmed) ||
    /^[S|M|A]\.[A-Z][a-z]?/i.test(trimmed);

    if (isTitle && currentMember) {
      currentMember += ", " + trimmed;
    } else {
      if (currentMember) {
        members.push(currentMember);
      }
      currentMember = trimmed;
    }
  });

  if (currentMember) {
    members.push(currentMember);
  }

  return members.map(m => m.trim()).filter(Boolean);
}

export default function ProjectModuleGenerator() {
  const [activeStep, setActiveStep] = useState<"input" | "generation" | "success">("input");
  
  // Loaded profiles
  const [profile, setProfile] = useState(() => {
    const schoolName = localStorage.getItem("omega_school_name") || localStorage.getItem("kosp_nama_sekolah") || "SD NEGERI FATUBAI";
    const teacherName = localStorage.getItem("omega_teacher_name") || localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr";
    const teacherNip = localStorage.getItem("omega_teacher_nip") || localStorage.getItem("kosp_nip_guru") || "198603012020121005";
    const principalName = localStorage.getItem("omega_principal_name") || localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr";
    const principalNip = localStorage.getItem("omega_principal_nip") || localStorage.getItem("kosp_nip_kepala") || "196709192008011008";
    const faseKelas = localStorage.getItem("omega_school_class") || localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B";
    const semester = localStorage.getItem("kosp_semester") || "Semester 2 (Genap)";
    const tahunPelajaran = localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025";
    const tempat = localStorage.getItem("kosp_tempat") || "Fatubai";
    const npsn = localStorage.getItem("kosp_npsn") || "50300960";
    const kecamatan = localStorage.getItem("kosp_kecamatan") || "Insana Tengah";
    const kabupaten = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";
    const provinsi = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";

    let activeProjects: string[] = [];
    try {
      const savedProjs = localStorage.getItem("profile_active_projects");
      if (savedProjs) {
        activeProjects = JSON.parse(savedProjs);
      }
    } catch (e) {
      console.error(e);
    }
    if (activeProjects.length === 0) {
      activeProjects = ["p5_kearifan_lokal", "p5_kewirausahaan"];
    }

    return {
      schoolName,
      teacherName,
      teacherNip,
      principalName,
      principalNip,
      faseKelas,
      semester,
      tahunPelajaran,
      tempat,
      npsn,
      kecamatan,
      kabupaten,
      provinsi,
      activeProjects
    };
  });

  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  // Target values that can be customized
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSubtitle, setProjectSubtitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [targetSiswa, setTargetSiswa] = useState("");
  const [alokasiWaktu, setAlokasiWaktu] = useState("");
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [subelements, setSubelements] = useState<{ dim: string; sub: string; target: string }[]>([]);
  const [schedule, setSchedule] = useState<{ 
    week: number; 
    title: string; 
    mainActivity: string; 
    detail: string;
    objective?: string;
    expectedValues?: string;
    toolsNeeded?: string;
    estimatedCost?: string;
  }[]>([]);
  
  const [logoOption, setLogoOption] = useState<"two" | "one_ministry" | "one_school" | "none">("two");
  const [includeTeam, setIncludeTeam] = useState(true);
  const [teamLeaderName, setTeamLeaderName] = useState(() => {
    return localStorage.getItem("omega_teacher_name") || localStorage.getItem("kosp_ketua_tim_penyusun") || localStorage.getItem("kosp_ketua_tim") || "Roni Hariyanto Bhidju, S.Pd., Gr";
  });
  const [teamLeaderNip, setTeamLeaderNip] = useState(() => {
    return localStorage.getItem("omega_teacher_nip") || localStorage.getItem("kosp_nip_ketua_tim") || localStorage.getItem("kosp_nip_guru") || "198603012020121005";
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    const raw = localStorage.getItem("kosp_anggota_tim") || "Maria G. Bano, S.Pd; Yustina A. Sila, S.Pd";
    if (raw.includes(",") && !raw.includes(";")) {
      return raw.split(",").map(s => s.trim()).filter(Boolean).join("; ");
    }
    return raw;
  });

  const [newWeekTitle, setNewWeekTitle] = useState("");
  const [newWeekActivity, setNewWeekActivity] = useState("");
  const [newWeekDetail, setNewWeekDetail] = useState("");
  const [newWeekObjective, setNewWeekObjective] = useState("");
  const [newWeekValues, setNewWeekValues] = useState("");
  const [newWeekTools, setNewWeekTools] = useState("");
  const [newWeekCost, setNewWeekCost] = useState("");

  const [progressMsg, setProgressMsg] = useState("");
  const [generatedMd, setGeneratedMd] = useState("");
  const [isPreviewEditMode, setIsPreviewEditMode] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [isSavedToBank, setIsSavedToBank] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load actual student profiles list for dynamic high-end diagnostics
  const getStudentsFromStorage = () => {
    try {
      const raw = localStorage.getItem("omega_students_list");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: any) => ({
            namaLengkap: s.namaLengkap || s.nama || "Siswa Tanpa Nama",
            nisnNis: s.nisnNis || ""
          }));
        }
      }
    } catch (e) {
      console.error("Gagal load daftar murid:", e);
    }
    // High quality fallback Indonesian school roster
    return [
      { namaLengkap: "FLORIDA BANUSU" },
      { namaLengkap: "ADRIANO BRUNO" },
      { namaLengkap: "ALFRENDO PINTO" },
      { namaLengkap: "JEFRIANUS NAHAK" },
      { namaLengkap: "MARIA GALDINA" },
      { namaLengkap: "YUDITHA KOLO" }
    ];
  };

  // Load School profile configurations
  const loadProfile = () => {
    const schoolName = localStorage.getItem("omega_school_name") || localStorage.getItem("kosp_nama_sekolah") || "SD NEGERI FATUBAI";
    const teacherName = localStorage.getItem("omega_teacher_name") || localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr";
    const teacherNip = localStorage.getItem("omega_teacher_nip") || localStorage.getItem("kosp_nip_guru") || "198603012020121005";
    const principalName = localStorage.getItem("omega_principal_name") || localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr";
    const principalNip = localStorage.getItem("omega_principal_nip") || localStorage.getItem("kosp_nip_kepala") || "196709192008011008";
    const faseKelas = localStorage.getItem("omega_school_class") || localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B";
    const semester = localStorage.getItem("kosp_semester") || "Semester 2 (Genap)";
    const tahunPelajaran = localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025";
    const tempat = localStorage.getItem("kosp_tempat") || "Fatubai";
    const npsn = localStorage.getItem("kosp_npsn") || "50300960";
    const kecamatan = localStorage.getItem("kosp_kecamatan") || "Insana Tengah";
    const kabupaten = localStorage.getItem("kosp_kabupaten") || "Timor Tengah Utara";
    const provinsi = localStorage.getItem("kosp_provinsi") || "Nusa Tenggara Timur";

    let activeProjects: string[] = [];
    try {
      const savedProjs = localStorage.getItem("profile_active_projects");
      if (savedProjs) {
        activeProjects = JSON.parse(savedProjs);
      }
    } catch (e) {
      console.error(e);
    }

    if (activeProjects.length === 0) {
      // Force default ones chosen if totally empty
      activeProjects = ["p5_kearifan_lokal", "p5_kewirausahaan"];
    }

    const freshProfile = {
      schoolName,
      teacherName,
      teacherNip,
      principalName,
      principalNip,
      faseKelas,
      semester,
      tahunPelajaran,
      tempat,
      npsn,
      kecamatan,
      kabupaten,
      provinsi,
      activeProjects
    };

    setProfile(freshProfile);
    setAvailableThemes(activeProjects);
    
    // Select first or saved
    const lastTheme = localStorage.getItem("p5_selected_theme_active_id") || activeProjects[0] || "p5_gaya_hidup";
    const selectedActiveTheme = activeProjects.includes(lastTheme) ? lastTheme : (activeProjects[0] || "p5_gaya_hidup");
    
    handleThemeSelection(selectedActiveTheme, freshProfile);
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("omega-school-profile-updated", loadProfile);
    window.addEventListener("omega-state-updated", loadProfile);
    return () => {
      window.removeEventListener("omega-school-profile-updated", loadProfile);
      window.removeEventListener("omega-state-updated", loadProfile);
    };
  }, []);

  // Dynamic draft persistence per theme
  useEffect(() => {
    if (selectedTheme) {
      const draft = {
        projectTitle,
        projectSubtitle,
        projectDescription,
        targetSiswa,
        alokasiWaktu,
        selectedDimensions,
        subelements,
        schedule,
        generatedMd
      };
      localStorage.setItem(`omega_p5_draft_${selectedTheme}`, JSON.stringify(draft));
    }
  }, [selectedTheme, projectTitle, projectSubtitle, projectDescription, targetSiswa, alokasiWaktu, selectedDimensions, subelements, schedule, generatedMd]);

  const handleThemeSelection = (themeKey: string, customProf?: any) => {
    setSelectedTheme(themeKey);
    localStorage.setItem("p5_selected_theme_active_id", themeKey);
    const activeProf = customProf || profile;

    // Load draft if exists
    const savedDraftRaw = localStorage.getItem(`omega_p5_draft_${themeKey}`);
    if (savedDraftRaw) {
      try {
        const draft = JSON.parse(savedDraftRaw);
        setProjectTitle(draft.projectTitle ?? "");
        setProjectSubtitle(draft.projectSubtitle ?? "");
        setProjectDescription(draft.projectDescription ?? "");
        setTargetSiswa(draft.targetSiswa ?? "");
        setAlokasiWaktu(draft.alokasiWaktu ?? "");
        setSelectedDimensions(draft.selectedDimensions ?? []);
        setSubelements(draft.subelements ?? []);
        setSchedule(draft.schedule ?? []);
        setGeneratedMd(draft.generatedMd ?? "");
        return;
      } catch (e) {
        console.error("Gagal load draft P5:", e);
      }
    }

    const detail = getDynamicThemeDetails(themeKey, activeProf);

    setProjectTitle(detail.defaultTitle);
    setProjectSubtitle(detail.defaultSubtitle);
    setProjectDescription(detail.defaultDescription);
    setTargetSiswa(detail.defaultTarget);
    setAlokasiWaktu(detail.defaultTime);
    setSelectedDimensions(detail.dimensions);
    setSubelements([...detail.subelements]);
    setSchedule([...detail.schedule]);
    setGeneratedMd("");
  };

  const handleToggleDimension = (dim: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
    );
  };

  const handleRemoveSubelement = (idx: number) => {
    setSubelements(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddCustomSubelement = (dimOnNewSub: string) => {
    const catalogItems = DIMENSION_SUBELEMENTS_CATALOG[dimOnNewSub] || [];
    if (catalogItems.length > 0) {
      const promptText = `Pilih Subelemen BSKAP Terbaru untuk Dimensi "${dimOnNewSub}":\n\n` + 
        catalogItems.map((item, id) => `${id + 1}. ${item.sub}`).join("\n") + 
        `\n\nKetik nomor (1-${catalogItems.length}) untuk memilih otomatis harian, atau ketik bebas untuk kustom baru/manual:`;
      const selection = prompt(promptText);
      if (!selection) return;

      const num = parseInt(selection.trim(), 10);
      if (!isNaN(num) && num >= 1 && num <= catalogItems.length) {
        const item = catalogItems[num - 1];
        setSubelements(prev => [...prev, {
          dim: dimOnNewSub,
          sub: item.sub,
          target: item.target
        }]);
        triggerToast("✓ Subelemen BSKAP Berhasil Ditambahkan!");
        return;
      } else {
        const targetText = prompt("Masukkan target pencapaian pada akhir Fase:");
        if (!targetText) return;
        setSubelements(prev => [...prev, {
          dim: dimOnNewSub,
          sub: selection,
          target: targetText
        }]);
        triggerToast("✓ Subelemen Kustom Berhasil Ditambahkan!");
      }
    } else {
      const subText = prompt("Masukkan deskripsi Subelemen baru (Kurikulum Merdeka):");
      if (!subText) return;
      const targetText = prompt("Masukkan target pencapaian pada akhir Fase:");
      if (!targetText) return;

      setSubelements(prev => [...prev, {
        dim: dimOnNewSub,
        sub: subText,
        target: targetText
      }]);
      triggerToast("✓ Subelemen Kustom Berhasil Ditambahkan!");
    }
  };

  const handleRemoveScheduleWeek = (idx: number) => {
    setSchedule(prev => {
      const filtered = prev.filter((_, i) => i !== idx);
      return filtered.map((item, id) => ({ ...item, week: id + 1 }));
    });
  };

  const handleAddWeek = () => {
    if (!newWeekTitle.trim() || !newWeekActivity.trim()) {
      alert("Harap isi Judul Tahap dan nama Aktivitas Utama.");
      return;
    }
    const newWeekNum = schedule.length + 1;
    setSchedule(prev => [...prev, {
      week: newWeekNum,
      title: newWeekTitle,
      mainActivity: newWeekActivity,
      detail: newWeekDetail || "Siswa mengerjakan tantangan mandiri di bawah pengawasan Guru Adat.",
      objective: newWeekObjective.trim() || undefined,
      expectedValues: newWeekValues.trim() || undefined,
      toolsNeeded: newWeekTools.trim() || undefined,
      estimatedCost: newWeekCost.trim() || undefined
    }]);

    setNewWeekTitle("");
    setNewWeekActivity("");
    setNewWeekDetail("");
    setNewWeekObjective("");
    setNewWeekValues("");
    setNewWeekTools("");
    setNewWeekCost("");
    triggerToast("✓ Aktivitas Pekan Berhasil Ditambahkan!");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const compileMarkdownDocument = () => {
    const activeThemeLabel = getDynamicThemeDetails(selectedTheme, profile)?.label || selectedTheme;
    const timeString = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    // Premium stable defaults representing the authentic original templates
    const introNote = "Dokumen ini disusun sebagai panduan integratif pendidik dalam mengarahkan pembiasaan karakter luhur murid melalui alur inkuiri berkelanjutan.";
    const pedagogicNote = "Secara pedagogis, rancangan ini mengedepankan prinsip student-centered learning (pembelajaran berpusat pada murid), mendorong kemampuan berpikir kritis, serta memupuk nalar kemainan/kemanusiaan yang selaras dengan tantangan abad ke-21.";

    const diagnosticQ1 = "Apakah kamu menyukai pengerjaan karya seni/kriya/praktik fisik kelompok?";
    const diagnosticAction1 = "Pengelompokan heterogen untuk menyeimbangkan minat dan kecakapan murid.";

    const followUpSuggestions = `## V. REKOMENDASI TINDAK LANJUT PASCA-PROJEK (SUSTAINABILITY PLAN)
1. **Integrasi ke Budaya Sekolah**: Membiasakan karakter luhur yang dirintis selama projek ini ke dalam kesepakatan kelas harian di ${profile.schoolName}.
2. **Refleksi Berkelanjutan**: Mengadakan forum mufakat refleksi ringan bulanan bersama wali kelas guna menjaga konsistensi sikap dan perilaku murid.
3. **Pemberdayaan Berkelanjutan**: Mendorong dibentuknya duta-duta kecil pelopor kebaikan untuk mengimbaskan keteladanan yang diperoleh kepada adik kelas.`;

    let md = `# LAPORAN RESMI MODUL PROJEK KOKURIKULER
## SATUAN PENDIDIKAN ${profile.schoolName.toUpperCase()}

| INFORMASI CORE PROFIL | NILAI DATA UTAMA AKTIF |
| :--- | :--- |
| **Nama Satuan Pendidikan** | ${profile.schoolName} |
| **Profil NPSN** | ${profile.npsn} |
| **Kecamatan / Kabupaten** | Kec. ${profile.kecamatan}, Kab. ${profile.kabupaten} |
| **Provinsi Wilayah** | ${profile.provinsi} |
| **Fase / Kelas Struktur** | ${profile.faseKelas} |
| **Tahun Pelajaran / Sem.** | ${profile.tahunPelajaran} &bull; ${profile.semester} |
| **Departemen Penanggungjawab** | KEMENTERIAN PENDIDIKAN NASIONAL RI |

---

${introNote}

---

## I. IDENTITAS STRUKTURAL KOKURIKULER
* **Tema Projek**: **${activeThemeLabel}**
* **Judul Projek Utama**: **"${projectTitle}"**
* **Sub-Tema Kegiatan**: *"${projectSubtitle}"*
* **Target Kelompok Peserta Didik**: ${targetSiswa}
* **Durasi Alokasi Waktu**: ${alokasiWaktu}

### DESKRIPSI SINGKAT PROJEK (LATAR BELAKANG PEDAGOGIS)
${projectDescription}

${pedagogicNote}

---

## II. DIMENSI, ELEMEN, DAN SUBELEMEN DIMENSI PROFIL LULUSAN
Projek ini secara khusus dirancang untuk menumbuhkan dimensi kepribadian murid berikut ini:

${selectedDimensions.map(dim => {
  const matchingSubs = subelements.filter(s => s.dim === dim);
  return `### Dimensi: ${dim}
${matchingSubs.map((s, id) => `${id + 1}. **Subelemen**: ${s.sub}
   * **Target Sasaran Pencapaian Akhir Fase**: ${s.target}`).join("\n")}`;
}).join("\n\n")}

---

## III. ALUR JADWAL AKTIVITAS DAN STRUKTUR AKTIVITAS PROGRAMMING (WEEKLY SCHEDULE)
Langkah konkret pelaksanaan dibagi menjadi beberapa pekan efektif pembelajaran secara runtut:

${schedule.map(wk => {
  const objText = wk.objective || `Menguatkan nalar kemanusiaan, kolaborasi aktif, serta keterampilan praktis secara terarah.`;
  const valText = wk.expectedValues || `Gotong Royong, Mandiri, Kreatif, dan Tanggung Jawab.`;
  const toolsText = wk.toolsNeeded || `Materi ajar luring, buku pemantau progres siswa, instrumen refleksi harian.`;
  const costText = wk.estimatedCost || `Rp 0 (Memanfaatkan fasilitas luring sekolah & barang guna ulang)`;

  return `### Pekan ke-${wk.week}: ${wk.title}
* **Aktivitas Inti Utama**: ${wk.mainActivity}
* **Rincian Aktivitas Lapangan**: ${wk.detail}
* **Tujuan Aktivitas Pekan**: ${objText}
* **Nilai Karakter yang Diharapkan**: ${valText}
* **Alat dan Bahan yang Dibutuhkan**: ${toolsText}
* **Prakiraan Kebutuhan Biaya (Besaran)**: ${costText}
* **Metode Interaksi**: Observasi aktif, Praktik Kontekstual, Refleksi Kelompok.`;
}).join("\n\n")}

---

## IV. ALAT DIAGNOSTIK DAN SISTEM ASESMEN PROJEK KOKURIKULER
### 1. Rubrik Penilaian Penyelarasan Subelemen

| Subelemen Profil | Mulai Berkembang (MB) | Sedang Berkembang (SB) | Berkembang Sesuai Harapan (BSH) | Sangat Berkembang (SAB) |
| :--- | :--- | :--- | :--- | :--- |
${subelements.map(s => {
  const dMb = `Mulai menyadari konsep ${s.sub}, memerlukan bimbingan rutin penuh dari guru dalam proses harian.`;
  const dSb = `Memahami nilai utama ${s.sub} dan mampu mempraktikkannya sesekali secara mandiri dengan baik.`;
  const dBsh = `Secara mandiri dan konsisten mengimplementasikan target harian: ${s.target || s.sub}`;
  const dSab = `Sangat terampil melampaui target ${s.sub}, berinisiatif, serta memberi teladan positif bagi kawan sebaya.`;
  return `| **${s.sub}** | ${dMb} | ${dSb} | ${dBsh} | ${dSab} |`;
}).join("\n")}

### 2. Lembar Rekomendasi Penilaian Akhir (Metode Evaluatif)
* **Asesmen Diagnostik luring**: Dilakukan minggu awal melalui tanya jawab minat siswa.
* **Asesmen Formatif berjalan**: Dilakukan melalui pengamatan berkala guru selama pengerjaan kelompok harian.
* **Asesmen Sumatif Akhir**: Berupa rubrik produk kriya atau presentasi stan Gelar Karya yang dibuat.

### 3. LAMPIRAN INSTRUMEN ASESMEN

#### LAMPIRAN A: INSTRUMEN ASESMEN DIAGNOSTIK (NON-KOGNITIF)
*Tujuan: Memetakan minat, modalitas belajar, dan kesiapan awal murid sebelum projek dimulai harian.*
*Waktu Pelaksanaan: Pekan Pertama (Awal Projek).*

| No | Pernyataan / Indikator Pertanyaan | Pilihan Jawaban / Respon Siswa | Tindak Lanjut Pedagogis |
| :--- | :--- | :--- | :--- |
| 1 | ${diagnosticQ1} | [ ] Sangat Suka [ ] Biasa Saja [ ] Kurang Suka | ${diagnosticAction1} |
| 2 | Bagaimana cara belajar yang paling membuatmu nyaman? | [ ] Melihat gambar/video [ ] Mendengarkan penjelasan [ ] Langsung mempraktikkannya | Desain instruksi aktivitas menggunakan multi-modalitas (visual, audio, kinestetik). |
| 3 | Apa tantangan terbesar yang kamu rasakan saat bekerja kelompok? | [ ] Berbagi tugas [ ] Menyampaikan pendapat [ ] Merasa malu/kurang percaya diri | Guru mengintervensi dengan menetapkan peran spesifik yang adil bagi setiap anggota. |

*Panduan Wawancara Diagnostik Singkat Guru:*
1. "Dari tema projek yang kita pilih hari ini, bagian aktivitas mana yang paling membuatmu penasaran?"
2. "Bahan-bahan di sekitar kita apa saja yang kira-kira bisa kita manfaatkan secara hemat?"

---

#### LAMPIRAN B: INSTRUMEN ASESMEN FORMATIF
*Tujuan: Memantau keterlibatan, kerjasama, dan perkembangan Dimensi Profil Lulusan selama aktivitas projek berjalan.*
*Waktu Pelaksanaan: Berkala setiap akhir pekan harian (jurnal & asesmen diri).*

##### 1. Jurnal Observasi Perkembangan Karakter Guru (Format Kontinu)
*Petunjuk: Guru memberikan tanda centang (V) pada deskripsi pencapaian karakter siswa harian.*

| Nama Siswa | Dimensi / Subelemen | MB (Mulai Berkembang) | SB (Sedang Berkembang) | BSH (Berkembang Sesuai Harapan) | SAB (Sangat Berkembang) | Catatan Perilaku Meninjau |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${getStudentsFromStorage().map((s, idx) => `| ${idx + 1}. ${s.namaLengkap} | Gotong Royong / Kolaborasi | [ ] | [ ] | [ ] | [ ] | ___________________________ |`).join("\n")}

##### 2. Lembar Refleksi Diri Siswa (Self-Assessment Sheet) - Siap Cetak
*Nama Siswa: ______________________*  
*Kelas/Fase: ______________________*  

Jawablah pertanyaan berikut dengan jujur sesuai pengalaman belajarmu:
1. **Pernyataan A**: Saya ikut menyumbangkan ide/tenaga dalam kelompok projek pekan ini.  
   *Pilihan*: [ ] Belum Melakukan [ ] Sudah Melakukan [ ] Sangat Baik  
2. **Pernyataan B**: Saya menghargai pendapat teman dalam kelompok meskipun berbeda dengan pendapat saya pribadi.  
   *Pilihan*: [ ] Belum Melakukan [ ] Sudah Melakukan [ ] Sangat Baik  
3. **Pertanyaan Reflektif**:  
   - "Hal paling menarik yang saya temukan dari aktivitas pekan ini adalah..."  
     *Jawaban*: ________________________________________________________________________  
   - "Tantangan yang saya hadapi dan cara saya menyelesaikannya adalah..."  
     *Jawaban*: ________________________________________________________________________  

---

#### LAMPIRAN C: INSTRUMEN ASESMEN SUMATIF (AKHIR PROJEK)
*Tujuan: Menilai capaian kulminasi projek melalui presentasi stan Gelar Karya secara holistik.*
*Waktu Pelaksanaan: Pekan Akhir (Kulminasi Projek).*

| Kriteria Penyesuaian | Nilai Kurang (MB - Skor 1) | Cukup Baik (SB - Skor 2) | Sangat Memuaskan (BSH - Skor 3) | Istimewa (SAB - Skor 4) |
| :--- | :--- | :--- | :--- | :--- |
| **Kreativitas Produk Hasil** | Produk kurang orisinal, meniru mentah contoh tanpa inovasi. | Produk memiliki variasi kecil tapi kurang rapi dalam finishing. | Produk orisinal, rapi, dan mencerminkan esensi kegunaan lokal. | Karya sangat inovatif, estetik luar biasa, serta bernilai ekonomis tinggi. |
| **Kemampuan Komunikasi** | Siswa pasif dan tidak bisa menjelaskan proses pembuatan produk. | Siswa mampu menjelaskan tapi terbata-bata atau kurang percaya diri. | Menjelaskan proses pembuatan dan manfaat projek secara runtut & lugas. | Presentasi sangat jujur, komunikatif penuh, dan meyakinkan khalayak. |
| **Kolaborasi & Kerja Tim** | Dominasi individu atau ada anggota yang tidak ikut berpartisipasi. | Berbagi tugas tapi koordinasi antar anggota sering terputus. | Bekerja sama dengan pembagian peran yang adil dan saling menghormati. | Sinergi tim luar biasa, saling melengkapi, dan memecahkan masalah bersama. |

---

${followUpSuggestions}

---

### LEMBAR KESEPAKATAN DAN PENGESAHAN DOKUMEN

Disahkan secara resmi di kota luring **${profile.tempat}**, tanggal **${timeString}**

${includeTeam ? `
**Mengetahui,**
**Kepala Sekolah**

*(Tanda Tangan & Cap Lembaga Resmi)*

<u>**${profile.principalName}**</u>
NIP. ${profile.principalNip || "-"}

**Ketua Tim Pengembang Projek**

*(Tanda Tangan)*

<u>**${teamLeaderName}**</u>
NIP. ${teamLeaderNip || "-"}

**Anggota Tim Pelaksana:**
${teamMembers.trim() ? parseTeamMembers(teamMembers).map((m, idx) => `${idx + 1}. ${m}`).join("\n") : "1. (Tidak mengisi)"}
` : `
**Mengetahui,**
**Kepala Sekolah**

*(Tanda Tangan & Cap Lembaga Resmi)*

<u>**${profile.principalName}**</u>
NIP. ${profile.principalNip || "-"}
`}
`;
    return md;
  };

  const handleStartGeneration = () => {
    setActiveStep("generation");
    setProgressMsg("Sinkronisasi core data guru & profil sekolah...");
    
    // Smooth custom stepper to keep teachers highly engaged
    setTimeout(() => {
      setProgressMsg("Memetakan subelemen BSKAP Merdeka Nasional sesuai tema...");
      setTimeout(() => {
        setProgressMsg("Menyusun rincian aktivitas pembelajaran kokurikuler...");
        setTimeout(() => {
          setProgressMsg("Merumuskan indikator asesmen & rubrik penilaian...");
          setTimeout(() => {
            const result = compileMarkdownDocument();
            setGeneratedMd(result);
            setActiveStep("success");
            setIsSavedToBank(false);
            triggerToast("✓ Modul Projek Kokurikuler Sukses Disusun Sempurna!");
          }, 800);
        }, 800);
      }, 700);
    }, 600);
  };

  const handleSaveToDocumentBank = () => {
    try {
      const activeThemeLabel = getDynamicThemeDetails(selectedTheme, profile)?.label || selectedTheme;
      const storedDocs = localStorage.getItem("omega_db_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];

      const newDoc = {
        id: "doc-kokurikuler-" + Date.now(),
        name: `Modul Projek Kokurikuler Tema: ${activeThemeLabel} (${profile.faseKelas})`,
        category: "lesson_plan", // align categorized
        folderId: "f-general", // Put under General Dokumen Umum
        content: generatedMd,
        size: generatedMd.length,
        createdAt: new Date().toISOString()
      };

      const updatedDocs = [newDoc, ...currentDocs];
      localStorage.setItem("omega_db_documents", JSON.stringify(updatedDocs));
      
      setSavedDocId(newDoc.id);
      setIsSavedToBank(true);
      
      // Dispatch events
      window.dispatchEvent(new CustomEvent("omega-state-updated"));
      triggerToast("✓ Tersimpan Sukses di Bank Dokumen Luring Anda!");
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan dokumen.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMd);
    triggerToast("✓ Teks Berhasil Disalin ke Clipboard!");
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([generatedMd], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Modul_Projek_Kokurikuler_${selectedTheme}_integrated.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("✓ File Markdown Sukses Terunduh!");
  };

  const downloadAsWord = () => {
    // Elegant parser that compiles Markdown elements, including complex multi-column grids, into standards-compliant HTML tables which MS Word reads flawlessly on Windows 10/11
    const parseMarkdownToWordHtml = (md: string): string => {
      const lines = md.split("\n");
      let html = "";
      let inList = false;
      let inTable = false;
      let tableRows: string[][] = [];

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Handle Horizontal Rule
        if (line === "---" || line === "---") {
          if (inList) { html += "</ul>"; inList = false; }
          if (inTable) { html += flushTableHtml(tableRows); inTable = false; tableRows = []; }
          html += '<hr style="border: 0; border-top: 1.5px double #cbd5e1; margin: 24px 0;" />';
          continue;
        }

        // Handle Table
        if (line.startsWith("|") && line.endsWith("|")) {
          if (inList) { html += "</ul>"; inList = false; }
          if (!inTable) {
            inTable = true;
            tableRows = [];
          }
          const cols = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const isSeparator = cols.every(c => /^:?-+:?$/.test(c));
          if (!isSeparator) {
            tableRows.push(cols);
          }
          continue;
        } else {
          if (inTable) {
            html += flushTableHtml(tableRows);
            inTable = false;
            tableRows = [];
          }
        }

        // Handle Lists
        if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("+ ")) {
          if (!inList) {
            html += '<ul style="margin-top: 6px; margin-bottom: 6px; padding-left: 24px; color: #334155;">';
            inList = true;
          }
          let content = line.substring(2).trim();
          content = processInlineFormatting(content);
          html += `<li style="margin-bottom: 4px; line-height: 1.6; font-size: 11pt;">${content}</li>`;
          continue;
        } else if (inList) {
          html += "</ul>";
          inList = false;
        }

        // Handle Headers
        if (line.startsWith("# ")) {
          const content = processInlineFormatting(line.substring(2));
          html += `<h1 style="color: #1e3a8a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 6px; margin-top: 30px; margin-bottom: 12px;">${content}</h1>`;
        } else if (line.startsWith("## ")) {
          const content = processInlineFormatting(line.substring(3));
          html += `<h2 style="color: #2563eb; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15pt; font-weight: bold; border-bottom: 1.5px solid #93c5fd; padding-bottom: 4px; margin-top: 24px; margin-bottom: 10px;">${content}</h2>`;
        } else if (line.startsWith("### ")) {
          const content = processInlineFormatting(line.substring(4));
          html += `<h3 style="color: #1e293b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; font-weight: bold; margin-top: 18px; margin-bottom: 8px;">${content}</h3>`;
        } else if (line.startsWith("#### ")) {
          const content = processInlineFormatting(line.substring(5));
          html += `<h4 style="color: #475569; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11.5pt; font-weight: bold; margin-top: 14px; margin-bottom: 6px;">${content}</h4>`;
        } else if (line.startsWith("##### ")) {
          const content = processInlineFormatting(line.substring(6));
          html += `<h5 style="color: #64748b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; font-weight: bold; margin-top: 12px; margin-bottom: 4px;">${content}</h5>`;
        } else if (line !== "") {
          const content = processInlineFormatting(line);
          html += `<p style="margin-bottom: 10px; line-height: 1.6; font-size: 11pt; color: #334155; font-family: Calibri, 'Segoe UI', sans-serif;">${content}</p>`;
        }
      }

      // Final leftovers flushing
      if (inTable) { html += flushTableHtml(tableRows); }
      if (inList) { html += "</ul>"; }

      return html;
    };

    const flushTableHtml = (rows: string[][]): string => {
      if (rows.length === 0) return "";
      let html = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-family: Calibri, \'Segoe UI\', sans-serif;">';
      rows.forEach((row, rIdx) => {
        if (rIdx === 0) {
          html += '<tr style="background-color: #1e3a8a; color: #ffffff; font-weight: bold;">';
          row.forEach(col => {
            const formatted = processInlineFormatting(col);
            html += `<th style="border: 1px solid #94a3b8; padding: 10px; text-align: left; font-size: 10.5pt;">${formatted}</th>`;
          });
          html += '</tr>';
        } else {
          const bg = rIdx % 2 === 0 ? "background-color: #f8fafc;" : "background-color: #ffffff;";
          html += `<tr style="${bg}">`;
          row.forEach(col => {
            const formatted = processInlineFormatting(col);
            html += `<td style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 10.5pt; color: #334155;">${formatted}</td>`;
          });
          html += '</tr>';
        }
      });
      html += '</table>';
      return html;
    };

    const processInlineFormatting = (text: string): string => {
      let temp = text;
      // Bold **text**
      temp = temp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic *text*
      temp = temp.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Bullet circles or indicators
      temp = temp.replace(/&bull;/g, '•');
      return temp;
    };

    const bodyHtml = parseMarkdownToWordHtml(generatedMd);

    const documentTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Modul Projek Kokurikuler</title>
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
            size: A4;
            margin: 2cm 2cm 2cm 2cm;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          body {
            font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
            line-height: 1.25;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 11pt;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
            font-weight: bold;
            color: #1e3a8a;
            margin-top: 12pt;
            margin-bottom: 6pt;
          }
          p, li {
            font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.35;
            color: #334155;
            margin-bottom: 8pt;
          }
          table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%;
            margin-top: 12pt;
            margin-bottom: 12pt;
          }
          th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: bold;
            font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
            border: 1px solid #1e3a8a;
            mso-border-alt: solid windowtext .5pt;
            padding: 8px;
            text-align: left;
            font-size: 10.5pt;
          }
          td {
            font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
            border: 1px solid #cbd5e1;
            mso-border-alt: solid windowtext .5pt;
            padding: 6px;
            text-align: left;
            font-size: 10.5pt;
            color: #334155;
          }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
      </html>
    `;

    const blob = new Blob([documentTemplate], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Modul_Projek_Kokurikuler_${selectedTheme}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("✓ File Dokumen Word Sukses Terunduh!");
  };

  const downloadAsPdf = () => {
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

      // Draw Grid Helper for PDF Doc
      const drawBeautifulPdfTable = (
        startX: number,
        startY: number,
        headers: string[],
        widths: number[],
        rows: string[][],
        options: { rowHeight?: number; headerBg?: number[]; rowBgOdd?: number[]; fontSize?: number; headerFontSize?: number } = {}
      ) => {
        const {
          rowHeight = 8,
          headerBg = [15, 23, 42], // Slate-900 / Navy
          rowBgOdd = [248, 250, 252], // Slate-50
          fontSize = 7.5,
          headerFontSize = 8
        } = options;

        let curY = startY;

        // Check page overflow for header
        if (curY > 270) {
          doc.addPage();
          curY = 22;
        }

        // Draw Headers
        doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
        doc.setDrawColor(71, 85, 105);
        doc.setLineWidth(0.2);

        // Header Background
        const totalWidth = widths.reduce((sum, w) => sum + w, 0);
        doc.rect(startX, curY, totalWidth, rowHeight + 2, "F");

        // Text & Border
        let curX = startX;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(headerFontSize);
        doc.setTextColor(255, 255, 255);
        headers.forEach((h, idx) => {
          doc.rect(curX, curY, widths[idx], rowHeight + 2, "S");
          doc.text(h, curX + 2, curY + (rowHeight + 2) / 2 + 1);
          curX += widths[idx];
        });

        curY += rowHeight + 2;

        // Draw Rows
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        rows.forEach((row, rowIndex) => {
          // Calculate row height based on cell with maximum wrapped text lines
          let maxLines = 1;
          const cellLines: string[][] = [];

          row.forEach((cell, cellIndex) => {
            const splitText = doc.splitTextToSize(cell || "", widths[cellIndex] - 4);
            cellLines.push(splitText);
            if (splitText.length > maxLines) {
              maxLines = splitText.length;
            }
          });

          const currentCellHeight = Math.max(rowHeight, maxLines * 4.2 + 2);

          // Check page overflow
          if (curY + currentCellHeight > 275) {
            doc.addPage();
            curY = 22;

            // Redraw Header on new page
            doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
            doc.rect(startX, curY, totalWidth, rowHeight + 2, "F");
            let tX = startX;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(headerFontSize);
            doc.setTextColor(255, 255, 255);
            headers.forEach((h, idx) => {
              doc.rect(tX, curY, widths[idx], rowHeight + 2, "S");
              doc.text(h, tX + 2, curY + (rowHeight + 2) / 2 + 1);
              tX += widths[idx];
            });
            curY += rowHeight + 2;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(fontSize);
          }

          // Row background alternation
          if (rowIndex % 2 === 1) {
            doc.setFillColor(rowBgOdd[0], rowBgOdd[1], rowBgOdd[2]);
            doc.rect(startX, curY, totalWidth, currentCellHeight, "F");
          } else {
            doc.setFillColor(255, 255, 254);
            doc.rect(startX, curY, totalWidth, currentCellHeight, "F");
          }

          let drawX = startX;
          row.forEach((_, cellIndex) => {
            doc.setDrawColor(148, 163, 184); // Slate-300 fine lines
            doc.setLineWidth(0.15);
            doc.rect(drawX, curY, widths[cellIndex], currentCellHeight, "S");
            doc.setTextColor(30, 41, 59); // Slate-800

            // Draw multi-line text
            const lines = cellLines[cellIndex];
            lines.forEach((lineText, lineIdx) => {
              doc.text(lineText, drawX + 2, curY + 4 + lineIdx * 4);
            });

            drawX += widths[cellIndex];
          });

          curY += currentCellHeight;
        });

        return curY;
      };

      // Define internal drawing helpers
      const drawKemdikbudVector = (doc: any, centerX: number, centerY: number, radius = 13) => {
        doc.setFillColor(30, 58, 138); // navy blue
        doc.setDrawColor(245, 158, 11); // gold
        doc.setLineWidth(0.5);
        doc.ellipse(centerX, centerY, radius, radius, "F");
        doc.ellipse(centerX, centerY, radius + 0.8, radius + 0.8, "D");
        doc.setFillColor(245, 158, 11); 
        const scale = radius / 15;
        doc.triangle(centerX - 3 * scale, centerY + 6 * scale, centerX + 3 * scale, centerY + 6 * scale, centerX, centerY - 2 * scale, "F");
        doc.ellipse(centerX, centerY - 5 * scale, 2.5 * scale, 4 * scale, "F");
        doc.ellipse(centerX - 3.5 * scale, centerY - 3 * scale, 2 * scale, 3.5 * scale, "F");
        doc.ellipse(centerX + 3.5 * scale, centerY - 3 * scale, 2 * scale, 3.5 * scale, "F");
        doc.setDrawColor(254, 243, 199);
        doc.setLineWidth(0.35);
        doc.line(centerX - 5 * scale, centerY + 7.5 * scale, centerX + 5 * scale, centerY + 7.5 * scale);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.5 * scale);
        doc.setTextColor(254, 243, 199);
        doc.text("TUT WURI", centerX, centerY + 2.5 * scale, { align: "center" });
        doc.setFontSize(4.5 * scale);
        doc.text("HANDAYANI", centerX, centerY + 5 * scale, { align: "center" });
      };

      const drawKemenagVector = (doc: any, centerX: number, centerY: number, radius = 13) => {
        doc.setFillColor(6, 95, 70); // deep emerald green
        doc.setDrawColor(245, 158, 11); // gold
        doc.setLineWidth(0.5);
        doc.ellipse(centerX, centerY, radius, radius, "F");
        doc.ellipse(centerX, centerY, radius + 0.8, radius + 0.8, "D");
        const scale = radius / 15;
        doc.setFillColor(245, 158, 11); 
        doc.rect(centerX - 0.6, centerY - 7 * scale, 1.2, 12 * scale, "F");
        doc.rect(centerX - 5 * scale, centerY - 2.5 * scale, 10 * scale, 0.8 * scale, "F");
        doc.triangle(centerX - 5 * scale, centerY - 1.5 * scale, centerX - 6.5 * scale, centerY + 1.5 * scale, centerX - 3.5 * scale, centerY + 1.5 * scale, "F");
        doc.triangle(centerX + 5 * scale, centerY - 1.5 * scale, centerX + 3.5 * scale, centerY + 1.5 * scale, centerX + 6.5 * scale, centerY + 1.5 * scale, "F");
        doc.setFillColor(254, 254, 254);
        doc.triangle(centerX, centerY + 5.5 * scale, centerX - 3 * scale, centerY + 3 * scale, centerX, centerY + 3 * scale, "F");
        doc.triangle(centerX, centerY + 5.5 * scale, centerX + 3 * scale, centerY + 3 * scale, centerX, centerY + 3 * scale, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5 * scale);
        doc.setTextColor(254, 243, 199);
        doc.text("KEMENAG", centerX, centerY + 9.5 * scale, { align: "center" });
      };

      // PAGE 1: ELEGANT OFFICIAL COVER (like KOSP doc)
      // Draw super premium luxurious gold-bronze border frame (Double-layered with ornate corners)
      doc.setDrawColor(180, 83, 9); // Deep Gold/Bronze
      doc.setLineWidth(0.6);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setDrawColor(245, 158, 11); // Amber / Bright Gold
      doc.setLineWidth(1.1);
      doc.rect(12.5, 12.5, pageWidth - 25, pageHeight - 25);

      doc.setDrawColor(71, 85, 105); // Slate slate-600 fine inner line
      doc.setLineWidth(0.2);
      doc.rect(15.5, 15.5, pageWidth - 31, pageHeight - 31);

      // Ornate classical corner brackets
      const corners = [
        { x: 12.5, y: 12.5, dx: 1, dy: 1 },
        { x: pageWidth - 12.5, y: 12.5, dx: -1, dy: 1 },
        { x: 12.5, y: pageHeight - 12.5, dx: 1, dy: -1 },
        { x: pageWidth - 12.5, y: pageHeight - 12.5, dx: -1, dy: -1 },
      ];
      corners.forEach((c) => {
        // Solid accent corner square
        doc.setFillColor(217, 119, 6);
        doc.rect(c.x - (c.dx > 0 ? 0 : 3.5), c.y - (c.dy > 0 ? 0 : 3.5), 3.5, 3.5, "F");

        // L-shape outer elegant bands
        doc.setDrawColor(180, 83, 9);
        doc.setLineWidth(0.8);
        doc.line(c.x, c.y, c.x + c.dx * 18, c.y);
        doc.line(c.x, c.y, c.x, c.y + c.dy * 18);

        // Nested fine inner gold-band
        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(0.3);
        doc.line(c.x + c.dx * 3, c.y + c.dy * 3, c.x + c.dx * 13, c.y + c.dy * 3);
        doc.line(c.x + c.dx * 3, c.y + c.dy * 3, c.x + c.dx * 3, c.y + c.dy * 13);

        // Faint decorative micro-dot
        doc.setFillColor(180, 83, 9);
        doc.rect(c.x + c.dx * 5.5, c.y + c.dy * 5.5, 1.2, 1.2, "F");
      });

      // Subtle background watermark concentric circles & diagonals for depth and prestige
      doc.setDrawColor(251, 244, 228); // extremely faint golden pastel
      doc.setLineWidth(0.1);
      doc.ellipse(pageWidth / 2, pageHeight / 2, 60, 60, "D");
      doc.ellipse(pageWidth / 2, pageHeight / 2, 58, 58, "D");
      doc.ellipse(pageWidth / 2, pageHeight / 2, 40, 40, "D");
      doc.ellipse(pageWidth / 2, pageHeight / 2, 20, 20, "D");

      doc.setDrawColor(253, 248, 235);
      doc.setLineWidth(0.08);
      doc.line(18, 18, pageWidth - 18, pageHeight - 18);
      doc.line(pageWidth - 18, 18, 18, pageHeight - 18);

      const drawMinistryLogo = (x: number, y: number, size: number) => {
        const customMinistryLogo = localStorage.getItem("kosp_custom_ministry_logo");
        const logoType = localStorage.getItem("kosp_logo_type") || "kemdikbud";
        if (customMinistryLogo) {
          try {
            doc.addImage(customMinistryLogo, "PNG", x, y, size, size);
          } catch (err) {
            console.error("Custom minLogo error, fallback to vector:", err);
            if (logoType === "kemenag") drawKemenagVector(doc, x + size / 2, y + size / 2, size / 2);
            else drawKemdikbudVector(doc, x + size / 2, y + size / 2, size / 2);
          }
        } else {
          if (logoType === "kemenag") drawKemenagVector(doc, x + size / 2, y + size / 2, size / 2);
          else drawKemdikbudVector(doc, x + size / 2, y + size / 2, size / 2);
        }
      };

      const drawSchoolLogo = (x: number, y: number, size: number) => {
        const schoolLogo = localStorage.getItem("kosp_school_logo") || localStorage.getItem("kosp_logo_sekolah");
        if (schoolLogo) {
          try {
            doc.addImage(schoolLogo, "PNG", x, y, size, size);
          } catch (err) {
            console.error("School logo error, fallback to vector default:", err);
            try {
              const schDefault = getDefaultSchoolLogo(profile.schoolName);
              doc.addImage(schDefault, "PNG", x, y, size, size);
            } catch(e) {}
          }
        } else {
          try {
            const schDefault = getDefaultSchoolLogo(profile.schoolName);
            doc.addImage(schDefault, "PNG", x, y, size, size);
          } catch(e) {}
        }
      };

      // Depending on Logo Option:
      let coverY = 25;
      if (logoOption === "two") {
        const minLogoSize = 18; // Elegant and not oversized
        drawMinistryLogo(pageWidth / 2 - minLogoSize / 2, coverY, minLogoSize);
        coverY += minLogoSize + 12;
      } else if (logoOption === "one_ministry") {
        const minLogoSize = 20;
        drawMinistryLogo(pageWidth / 2 - minLogoSize / 2, coverY, minLogoSize);
        coverY += minLogoSize + 12;
      } else if (logoOption === "one_school") {
        const schLogoSize = 20;
        drawSchoolLogo(pageWidth / 2 - schLogoSize / 2, coverY, schLogoSize);
        coverY += schLogoSize + 12;
      } else {
        coverY = 35; // No logos, header starts lower
      }

      // 2. Main Large Title Line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42); // Slate-900
      doc.text("DOKUMEN MODUL PROJEK KOKURIKULER", pageWidth / 2, coverY, { align: "center" });
      coverY += 6.2;
      
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9); // Warm Gold Accent
      doc.text("STANDAR PROGRAM PEMBELAJARAN KOKURIKULER", pageWidth / 2, coverY, { align: "center" });
      coverY += 3.8;

      // Decorative golden dividers under title
      doc.setDrawColor(217, 119, 6); // Amber Gold
      doc.setLineWidth(0.4);
      doc.line(pageWidth / 2 - 40, coverY, pageWidth / 2 + 40, coverY);
      doc.setDrawColor(180, 83, 9);
      doc.setLineWidth(0.15);
      doc.line(pageWidth / 2 - 35, coverY + 1.2, pageWidth / 2 + 35, coverY + 1.2);
      coverY += 12;

      // 3. School Logo (drawn in center only if two logos option is selected)
      if (logoOption === "two") {
        const schLogoSize = 28; // Elegant middle size
        drawSchoolLogo(pageWidth / 2 - schLogoSize / 2, coverY, schLogoSize);
        coverY += schLogoSize + 12;
      } else {
        coverY += 10;
      }

      // 4. SATUAN PENDIDIKAN ....... (ISI NAMA SEKOLAH)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      const splitSchoolName = doc.splitTextToSize(`SATUAN PENDIDIKAN ${profile.schoolName.toUpperCase()}`, contentWidth - 10);
      splitSchoolName.forEach((lineText: string) => {
        doc.text(lineText, pageWidth / 2, coverY, { align: "center" });
        coverY += 7;
      });
      coverY += 5;

      // 5. Box Details (Vertical List, Not Divided Left and Right!)
      const availableValWidthFull = 114;
      const tUtamaLines = doc.splitTextToSize(`${getDynamicThemeDetails(selectedTheme, profile)?.label || selectedTheme}`, availableValWidthFull);
      const tJudulLines = doc.splitTextToSize(`"${projectTitle}"`, availableValWidthFull);
      const tFaseLines = doc.splitTextToSize(`${profile.faseKelas}`, availableValWidthFull);
      const tSemesterLines = doc.splitTextToSize(`${profile.semester}`, availableValWidthFull);
      const tAlokasiLines = doc.splitTextToSize(`${alokasiWaktu || "Sesuai petunjuk modul"}`, availableValWidthFull);
      const tTahunLines = doc.splitTextToSize(`${profile.tahunPelajaran}`, availableValWidthFull);

      // Calculate dynamic line heights for 6 vertical rows
      const r1Lines = tUtamaLines.length;
      const r2Lines = tJudulLines.length;
      const r3Lines = tFaseLines.length;
      const r4Lines = tSemesterLines.length;
      const r5Lines = tAlokasiLines.length;
      const r6Lines = tTahunLines.length;

      const r1Height = (r1Lines - 1) * 3.8 + 8.2;
      const r2Height = (r2Lines - 1) * 3.8 + 8.2;
      const r3Height = (r3Lines - 1) * 3.8 + 8.2;
      const r4Height = (r4Lines - 1) * 3.8 + 8.2;
      const r5Height = (r5Lines - 1) * 3.8 + 8.2;
      const r6Height = (r6Lines - 1) * 3.8 + 8.2;

      const headerHeight = 9.0;
      const boxHeight = headerHeight + r1Height + r2Height + r3Height + r4Height + r5Height + r6Height;

      // Draw the beautiful outer box outline
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(30, 41, 59); // Slate-800
      doc.setLineWidth(0.4);
      doc.rect(22, coverY, 166, boxHeight, "FD");

      // Draw top header accent strip with elegant theme color
      doc.setFillColor(30, 41, 59); // Slate-800 deep aesthetic header
      doc.rect(22, coverY, 166, headerHeight, "F");

      // Header title with no unicode symbols
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(251, 191, 36); // Amber gold accent text
      doc.text("IDENTITAS TEKNIS DOKUMEN RESMI", pageWidth / 2, coverY + 6.0, { align: "center" });

      // Draw crisp light grid lines
      doc.setDrawColor(226, 232, 240); // Slate-200 thin border dividers
      doc.setLineWidth(0.25);

      const headerEnd = coverY + headerHeight;
      const r1End = headerEnd + r1Height;
      const r2End = r1End + r2Height;
      const r3End = r2End + r3Height;
      const r4End = r3End + r4Height;
      const r5End = r4End + r5Height;

      // Horizontal dividers
      doc.line(22, r1End, 188, r1End);
      doc.line(22, r2End, 188, r2End);
      doc.line(22, r3End, 188, r3End);
      doc.line(22, r4End, 188, r4End);
      doc.line(22, r5End, 188, r5End);

      // Helper function to draw cells elegantly with vertical padding
      const drawCellTextFull = (label: string, lines: string[], startY: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text(label, 25, startY + 5.0);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42); // Slate-900
        lines.forEach((lineText: string, idx: number) => {
          doc.text(idx === 0 ? `:  ${lineText}` : `   ${lineText}`, 55, startY + 5.0 + (idx * 3.8));
        });
      };

      // Draw all 6 cells fully vertically beautifully
      drawCellTextFull("Tema Utama", tUtamaLines, headerEnd);
      drawCellTextFull("Nama Projek", tJudulLines, r1End);
      drawCellTextFull("Fase / Kelas", tFaseLines, r2End);
      drawCellTextFull("Semester", tSemesterLines, r3End);
      drawCellTextFull("Alokasi", tAlokasiLines, r4End);
      drawCellTextFull("Tahun Ajaran", tTahunLines, r5End);

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Dibuat Secara Resmi Menggunakan Asisten Omega Guru AI", 105, 272, { align: "center" });

      // PAGE 2: TEKNIS OPERASIONAL DYNAMIC FROM PREVIEW (generatedMd)
      doc.addPage();
      let currentY = 22;
      doc.setTextColor(0, 0, 0);

      const lines = generatedMd.split("\n");

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Handle Horizontal Rule
        if (line === "---" || line === "---") {
          if (currentY > 265) {
            doc.addPage();
            currentY = 22;
          } else {
            doc.setDrawColor(220, 225, 230);
            doc.setLineWidth(0.4);
            doc.line(20, currentY + 2, 190, currentY + 2);
            currentY += 8;
          }
          continue;
        }

        // Handle Table
        if (line.startsWith("|") && line.endsWith("|")) {
          let tableLines: string[] = [];
          while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
            tableLines.push(lines[i].trim());
            i++;
          }
          i--; // Adjust index back

          if (tableLines.length > 0) {
            const parseColumns = (l: string) => {
              const rawCols = l.split("|").map(col => col.trim());
              if (rawCols[0] === "") rawCols.shift();
              if (rawCols[rawCols.length - 1] === "") rawCols.pop();
              return rawCols.map(c => c
                .replace(/\*\*/g, "")
                .replace(/<\/?u>/g, "")
                .replace(/<br\s*\/?>/gi, "\n")
              );
            };

            const headers = parseColumns(tableLines[0]);
            const rows: string[][] = [];
            for (let j = 2; j < tableLines.length; j++) {
              rows.push(parseColumns(tableLines[j]));
            }

            const numCols = headers.length;
            let colWidths: number[] = [];
            if (numCols > 0) {
              if (numCols === 2) {
                colWidths = [45, 125];
              } else if (numCols === 4) {
                colWidths = [10, 60, 50, 50];
              } else if (numCols === 7) {
                colWidths = [38, 30, 8, 8, 8, 8, 70];
              } else if (numCols === 5) {
                colWidths = [34, 34, 34, 34, 34];
              } else {
                const avgWidth = 170 / numCols;
                colWidths = Array(numCols).fill(avgWidth);
              }

              if (currentY > 230) {
                doc.addPage();
                currentY = 22;
              }

              currentY = drawBeautifulPdfTable(20, currentY, headers, colWidths, rows);
              currentY += 6;
            }
          }
          continue;
        }

        // Handle Lists (* or - or numbered list)
        if (line.startsWith("* ") || line.startsWith("- ") || /^\d+\.\s+/.test(line)) {
          let listSymbol = "•";
          let content = "";
          if (line.startsWith("* ") || line.startsWith("- ")) {
            content = line.substring(2).trim();
          } else {
            const match = line.match(/^(\d+\.)\s+(.*)/);
            if (match) {
              listSymbol = match[1];
              content = match[2].trim();
            } else {
              content = line;
            }
          }

          if (currentY > 270) {
            doc.addPage();
            currentY = 22;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);

          doc.setFont("helvetica", "bold");
          doc.text(listSymbol, 22, currentY);
          doc.setFont("helvetica", "normal");

          const cleanContent = content
            .replace(/\*\*/g, "")
            .replace(/<\/?u>/g, "")
            .replace(/&bull;/g, "•");

          const splitLines = doc.splitTextToSize(cleanContent, contentWidth - 10);
          splitLines.forEach((splitLine: string) => {
            if (currentY > 274) {
              doc.addPage();
              currentY = 22;
            }
            doc.text(splitLine, 28, currentY);
            currentY += 4.5;
          });

          currentY += 1.5;
          continue;
        }

        // Handle Headers
        if (line.startsWith("# ")) {
          // Level 1 Header (usually Title) - Skip showing redundant main doc title on page 2 since we have covers,
          // but if it's not the initial main redundant title of cover, draw it beautifully.
          const content = line.substring(2).replace(/\*\*/g, "").trim();
          if (content.toUpperCase().includes("LAPORAN RESMI")) {
            // Put an elegant subtitle or skip to keep aesthetic clean
            continue;
          }
          if (currentY > 240) {
            doc.addPage();
            currentY = 22;
          } else {
            currentY += 6;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.setTextColor(15, 23, 42); // slate 900
          doc.text(content, 20, currentY);
          
          doc.setDrawColor(217, 119, 6); // amber line under major header
          doc.setLineWidth(0.4);
          doc.line(20, currentY + 2.2, 190, currentY + 2.2);
          
          currentY += 9;
          continue;
        } else if (line.startsWith("## ")) {
          // Level 2 Header
          const content = line.substring(3).replace(/\*\*/g, "").trim();
          if (currentY > 250) {
            doc.addPage();
            currentY = 22;
          } else {
            currentY += 5;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(29, 78, 216); // deep blue
          doc.text(content, 20, currentY);
          
          doc.setDrawColor(147, 197, 253); // blue-300 line
          doc.setLineWidth(0.2);
          doc.line(20, currentY + 1.8, 190, currentY + 1.8);

          currentY += 8;
          continue;
        } else if (line.startsWith("### ")) {
          // Level 3 Header
          const content = line.substring(4).replace(/\*\*/g, "").replace(/<\/?u>/g, "").trim();
          if (currentY > 255) {
            doc.addPage();
            currentY = 22;
          } else {
            currentY += 4;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(30, 41, 59); // slate-800
          doc.text(content, 20, currentY);
          currentY += 6;
          continue;
        } else if (line.startsWith("#### ")) {
          // Level 4 Header
          const content = line.substring(5).replace(/\*\*/g, "").replace(/<\/?u>/g, "").trim();
          if (currentY > 260) {
            doc.addPage();
            currentY = 22;
          } else {
            currentY += 3;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105); // slate-600
          doc.text(content, 20, currentY);
          currentY += 5;
          continue;
        } else if (line.startsWith("##### ")) {
          // Level 5 Header
          const content = line.substring(6).replace(/\*\*/g, "").replace(/<\/?u>/g, "").trim();
          if (currentY > 260) {
            doc.addPage();
            currentY = 22;
          } else {
            currentY += 3;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139); // slate-500
          doc.text(content, 20, currentY);
          currentY += 4.5;
          continue;
        }

        // Handle normal paragraph
        if (line !== "") {
          if (currentY > 270) {
            doc.addPage();
            currentY = 22;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);

          const cleanLineText = line
            .replace(/\*\*/g, "")
            .replace(/<\/?u>/g, "")
            .replace(/&bull;/g, "•");

          const splitLines = doc.splitTextToSize(cleanLineText, contentWidth);
          splitLines.forEach((splitLine: string) => {
            if (currentY > 274) {
              doc.addPage();
              currentY = 22;
            }
            doc.text(splitLine, 20, currentY);
            currentY += 4.5;
          });
          currentY += 2.5; // space after paragraph
        }
      }

      // Add page numbers and uniform header/footers on all pages except the cover page (Page 1)
      const totalPages = doc.getNumberOfPages();
      for (let p = 2; p <= totalPages; p++) {
        doc.setPage(p);
        
        // Header
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text(`Modul Projek Kokurikuler - ${profile.schoolName}`, 20, 12);
        doc.text(`Tahun Pelajaran ${profile.tahunPelajaran}`, pageWidth - 20, 12, { align: "right" });
        doc.setDrawColor(226, 232, 240); // Slate-200 line
        doc.setLineWidth(0.15);
        doc.line(20, 13.5, pageWidth - 20, 13.5);

        // Footer
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Halaman ${p} dari ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
        doc.text("Asisten Omega Guru AI - Standar Kurikulum Merdeka", 20, pageHeight - 10);
      }

      doc.save(`Modul_Projek_Kokurikuler_Integrated_${profile.schoolName.replace(/\s+/g, "_")}.pdf`);
      triggerToast("✓ Dokumen PDF Berhasil Diekspor Guna Dicetak!");
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan teknis saat mengekspor PDF.");
    }
  };

  return (
    <div className="space-y-6 text-left" id="p5-project-generator">
      {/* Toast Notif */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#0c1a12] border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold px-4 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stepper Content */}
      {activeStep === "input" && (
        <div className="space-y-6">
          {/* Top Banner Alert Info */}
          <div className="p-4 rounded-2xl border border-zinc-900 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
              <div className="text-left font-sans">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  SINKRONISASI DATA AKTIF TERVERIFIKASI
                </h4>
                <p className="text-[10px] text-zinc-500 leading-normal max-w-xl">
                  Sistem otomatis mendeteksi profil sekolah: <strong className="text-zinc-350">{profile.schoolName}</strong>, Guru: <strong className="text-zinc-350">{profile.teacherName}</strong>. Pilihan tema kokurikuler ditarik langsung dari preferensi projek di menu Profil Sekolah.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>TERINTEGRASI PENUH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Parameters Config Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-4">
                <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase border-b border-zinc-900 pb-2 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-amber-500" /> 
                  PILIH TEMA PROJEK KOKURIKULER
                </h3>

                <div className="space-y-3.5 text-xs text-sans">
                  {/* Dropdown themes */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                      Tema Projek Mandiri Aktif
                    </label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => handleThemeSelection(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                    >
                      {MASTER_MERDEKA_THEMES.map((themeItem) => {
                        const themeKey = themeItem.id;
                        const themeLabel = themeItem.label;
                        const isActive = profile.activeProjects.includes(themeKey);
                        return (
                          <option key={themeKey} value={themeKey} className="text-xs bg-black py-2">
                            {themeLabel} {isActive ? " (Pilihan Profil Sekolah ★)" : " (Kerangka Lain)"}
                          </option>
                        );
                      })}
                    </select>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[9.5px] text-zinc-500 leading-normal flex-1">
                        Menampilkan tanda <span className="text-amber-500 font-bold">★</span> untuk tema kokurikuler yang selaras / dipilih pada Profil Sekolah Anda saat ini.
                      </p>
                      {selectedTheme && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Apakah Anda yakin ingin memulihkan draf tema ini kembali ke dokumen bawaan standar? Perubahan yang telah Anda edit secara manual akan hilang.")) {
                              localStorage.removeItem(`omega_p5_draft_${selectedTheme}`);
                              handleThemeSelection(selectedTheme);
                            }
                          }}
                          className="px-2 py-0.5 text-[8.5px] font-medium rounded bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-400 border border-zinc-800 transition-colors cursor-pointer ml-2 whitespace-nowrap"
                        >
                          Reset ke Bawaan
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Judul Projek */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                      Judul Projek Utama / Nama Kegiatan
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Masukkan nama judul projek"
                    />
                  </div>

                  {/* Sub-Tema */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                      Sub-Tema / Semboyan Projek
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                      value={projectSubtitle}
                      onChange={(e) => setProjectSubtitle(e.target.value)}
                      placeholder="Contoh: Mengolah Sampah Organik Menjadi Eko-Enzim Berdaya Guna"
                    />
                  </div>

                  {/* target & JP */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                        Target Peserta
                      </label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                        value={targetSiswa}
                        onChange={(e) => setTargetSiswa(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                        Durasi Projek
                      </label>
                      <input
                        type="text"
                        className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                        value={alokasiWaktu}
                        onChange={(e) => setAlokasiWaktu(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                      Latar Belakang / Deskripsi Singkat Kegiatan
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-950 outline-none focus:border-amber-500 font-sans text-xs leading-normal resize-none"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                    />
                  </div>

                  {/* Logo Options */}
                  <div className="pt-2 border-t border-zinc-900/50">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase font-mono tracking-wider">
                      Konfigurasi Logo Pada Sampul Cover
                    </label>
                    <select
                      value={logoOption}
                      onChange={(e) => setLogoOption(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                    >
                      <option value="two">2 Logo (Kementerian &amp; Sekolah - Bersisian)</option>
                      <option value="one_ministry">1 Logo (Kementerian Saja - Tengah Atas)</option>
                      <option value="one_school">1 Logo (Sekolah Saja - Tengah Atas)</option>
                      <option value="none">Tanpa Logo pada Sampul</option>
                    </select>
                  </div>

                  {/* Team Developers Options */}
                  <div className="pt-2 border-t border-zinc-900/50 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeTeam}
                        onChange={(e) => setIncludeTeam(e.target.checked)}
                        className="rounded border-zinc-850 text-amber-500 focus:ring-amber-500 bg-black w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-zinc-300 uppercase font-mono tracking-wider">
                        Sertakan Tim Pengembang (Ketua &amp; Anggota)
                      </span>
                    </label>

                    {includeTeam && (
                      <div className="p-3.5 bg-black/50 border border-zinc-900 rounded-xl space-y-3 text-xs">
                        <div>
                          <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                            Nama Ketua Tim Penyusun
                          </label>
                          <input
                            type="text"
                            className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                            value={teamLeaderName}
                            onChange={(e) => setTeamLeaderName(e.target.value)}
                            placeholder="Nama Lengkap &amp; Gelar Ketua"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                            NIP Ketua Tim (Nama &amp; NIP beda baris di naskah!)
                          </label>
                          <input
                            type="text"
                            className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs"
                            value={teamLeaderNip}
                            onChange={(e) => setTeamLeaderNip(e.target.value)}
                            placeholder="NIP Ketua"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                            Anggota Tim Lain (Pisahkan dengan Titik Koma ;)
                          </label>
                          <textarea
                            rows={2}
                            className="w-full px-3.5 py-2 rounded-xl bg-black text-white border border-zinc-900 outline-none focus:border-amber-500 font-sans text-xs leading-normal resize-none"
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            placeholder="Contoh: Maria G. Bano, S.Pd; Yustina A. Sila, S.Pd"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dimensi Profil Lulusan Selector */}
              <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-3.5">
                <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase pb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  PILIH DIMENSI PROFIL LULUSAN
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Keimanan dan Ketakwaan kepada Tuhan Yang Maha Esa",
                    "Kewargaan",
                    "Penalaran Kritis",
                    "Kreativitas",
                    "Kolaborasi",
                    "Kemandirian",
                    "Kesehatan",
                    "Komunikasi"
                  ].map((dim) => {
                    const isChecked = selectedDimensions.includes(dim);
                    return (
                      <button
                        key={dim}
                        type="button"
                        onClick={() => handleToggleDimension(dim)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs cursor-pointer text-left transition select-none ${
                          isChecked 
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold" 
                            : "bg-black/35 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>{dim}</span>
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-zinc-800" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Interactive Subelemens & Schedule Week Config */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Subelements list mapper */}
                <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-1">
                    <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-500" />
                      SUBELEMEN & AMP; SASARAN TARGET BSKAP
                    </h3>
                  </div>

                  <div className="space-y-2 p-1 max-h-[190px] overflow-y-auto scrollbar-thin">
                    {subelements.map((sub, sidx) => (
                      <div key={sidx} className="bg-black/45 p-3 rounded-xl border border-zinc-920 flex justify-between gap-3 text-xs">
                        <div className="text-left space-y-1">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[8px] font-bold uppercase">{sub.dim}</span>
                          <p className="font-semibold text-zinc-100">{sub.sub}</p>
                          <p className="text-[10px] text-zinc-500 leading-normal"><b className="text-zinc-400">Target Akhir Fase:</b> {sub.target}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubelement(sidx)}
                          className="text-zinc-600 hover:text-rose-400 p-1 shrink-0 h-fit cursor-pointer"
                          title="Hapus Subelemen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {subelements.length === 0 && (
                      <div className="text-zinc-500 text-center py-6 text-[11px] font-mono">[Tidak ada subelemen aktif, disarankan pilih satu dimensi]</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-900 text-xs">
                    <span className="text-[10px] text-zinc-400 font-mono">Tambah Sasaran:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {selectedDimensions.map(dim => (
                        <button
                          key={dim}
                          type="button"
                          onClick={() => handleAddCustomSubelement(dim)}
                          className="px-2 py-1 rounded bg-[#10132b] border border-zinc-800 hover:border-amber-500 text-zinc-300 text-[9.5px] font-mono flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5 text-amber-400" />
                          <span>+ {dim}</span>
                        </button>
                      ))}
                      {selectedDimensions.length === 0 && (
                        <span className="text-rose-400 text-[10px]">Aktifkan dimensi di kiri terlebih dahulu!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scheduller Editor */}
                <div className="p-5 rounded-2xl border border-zinc-900 bg-[#060608] space-y-4">
                  <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase border-b border-zinc-900 pb-2">
                    JADWAL & AMP; ALUR AKTIVITAS PELAKSANAAN ({schedule.length} PEKAN AKTIF)
                  </h3>

                  <div className="space-y-2.5 p-1 max-h-[350px] overflow-y-auto scrollbar-thin">
                    {schedule.map((item, id) => (
                      <div key={id} className="bg-black/40 p-3.5 rounded-xl border border-zinc-920 flex justify-between gap-3 text-xs leading-normal">
                        <div className="text-left space-y-2 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono text-amber-500 bg-amber-550/10 px-2 py-0.5 rounded">PEKAN {item.week}</span>
                            <span className="font-semibold text-zinc-200">{item.title}</span>
                          </div>
                          <p className="text-zinc-300 text-[10.5px] font-medium"><strong className="text-zinc-500">Aksi:</strong> {item.mainActivity}</p>
                          <p className="text-[10px] text-zinc-400 leading-normal"><strong className="text-zinc-500">Aktivitas:</strong> {item.detail}</p>
                          
                          {/* Rich expanded elements block */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-900/40 text-[9.5px] font-mono text-zinc-500">
                            <div>
                              <span className="text-amber-500/80 font-semibold">Tujuan:</span> {item.objective || "Karakter mandiri, gotong royong terarah."}
                            </div>
                            <div>
                              <span className="text-amber-500/80 font-semibold">Nilai:</span> {item.expectedValues || "Kreatif, Gotong-royong, Bernalar Kritis."}
                            </div>
                            <div>
                              <span className="text-amber-500/80 font-semibold">Alat/Bahan:</span> {item.toolsNeeded || "Materi ajar, instrumen refleksi harian."}
                            </div>
                            <div>
                              <span className="text-amber-500/80 font-semibold">Estimasi Biaya:</span> {item.estimatedCost || "Rp 0 (Menggunakan fasilitas sekolah)"}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveScheduleWeek(id)}
                          className="text-zinc-600 hover:text-rose-400 p-1.5 shrink-0 hover:bg-rose-500/10 rounded h-fit cursor-pointer align-top"
                          title="Hapus Minggu ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Form to add week */}
                  <div className="bg-black/60 p-3.5 rounded-xl border border-zinc-920 space-y-2.5 text-xs text-left">
                    <span className="text-[9.5px] font-bold font-mono text-zinc-400 uppercase tracking-widest block mb-1">FORM INSERT PEKAN BARU</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Tahapan (Misal: Tahap Aksi Nyata)"
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekTitle}
                        onChange={(e) => setNewWeekTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Nama Aktivitas Sederhana"
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekActivity}
                        onChange={(e) => setNewWeekActivity(e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Uraian aktivitas di lapangan secara singkat..."
                      className="w-full p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                      value={newWeekDetail}
                      onChange={(e) => setNewWeekDetail(e.target.value)}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tujuan aktivitas pekan ini..."
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekObjective}
                        onChange={(e) => setNewWeekObjective(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Nilai yang diharapkan (Contoh: Mandiri, Kreatif)"
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekValues}
                        onChange={(e) => setNewWeekValues(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Alat &amp; bahan jika ada aktivitas fisik..."
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekTools}
                        onChange={(e) => setNewWeekTools(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Rincian &amp; besaran biaya jika berbiaya..."
                        className="p-2 rounded bg-zinc-950 border border-zinc-900 outline-none text-xs text-white"
                        value={newWeekCost}
                        onChange={(e) => setNewWeekCost(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddWeek}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-zinc-200 text-[10px] font-mono flex items-center justify-center gap-1.5 cursor-pointer ml-auto transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Masukan Aktivitas Pekan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Big Generate Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleStartGeneration}
                  className="w-full py-4.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-150"
                  id="btn-trigger-p5-gen"
                >
                  <Sparkles className="w-5 h-5 text-zinc-950 animate-pulse" />
                  <span>SUSUN SECARA OTOMATIS MODUL PROJEK KOKURIKULER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Loading Sequence */}
      {activeStep === "generation" && (
        <CinematicLoading
          title="Engine Omega Mensimulasikan Dokumen Projek Kokurikuler"
          subtitle={`Merajut ${getDynamicThemeDetails(selectedTheme, profile)?.label || selectedTheme} yang sinkron bersanding data di ${profile.schoolName}.`}
          progressMsg={progressMsg}
        />
      )}

      {/* Generation Success Preview Window */}
      {activeStep === "success" && (
        <div className="space-y-6 animate-fade-in-slide-up">
          {/* Action Box Panel */}
          <div className="bg-[#05060d] border border-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1.5 flex-1 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>COMPILATION_COMPLETE</span>
              </div>
              <h3 className="text-md font-bold text-white uppercase tracking-tight font-mono">
                PENYUSUNAN KHAS DRAF MODUL KOKURIKULER SUKSES!
              </h3>
              <p className="text-[10px] text-zinc-400 max-w-2xl font-sans leading-relaxed">
                Dokumen ini telah disesuaikan berkat integrasi luring Data Profil Sekolah & Guru. Silakan simpan modul ini ke <strong>Bank Dokumen Privat</strong> agar tersimpan luring, atau langsung ekspor sebagai Word (.doc) dan PDF cetak berkualitas tinggi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto self-stretch lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => setActiveStep("input")}
                className="py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#0c0d12] hover:bg-[#12141c] hover:border-zinc-700 text-[11px] font-bold font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Atur Ulang Parameter</span>
              </button>

              <button
                type="button"
                disabled={isSavedToBank}
                onClick={handleSaveToDocumentBank}
                className={`py-2.5 px-4 rounded-xl border text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer w-full ${
                  isSavedToBank
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-80"
                    : "bg-zinc-950 border-zinc-800 text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10"
                }`}
              >
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>{isSavedToBank ? "✓ Tersimpan di Bank" : "Simpan ke Bank"}</span>
              </button>

              <button
                type="button"
                onClick={copyToClipboard}
                className="py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#0c0d12] hover:bg-[#12141c] hover:border-zinc-700 text-[11px] font-bold font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full"
              >
                <Copy className="w-3.5 h-3.5 text-amber-500" />
                <span>Salin Teks</span>
              </button>

              <button
                type="button"
                onClick={downloadAsWord}
                className="py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#0c0d12] hover:bg-[#12141c] hover:border-zinc-700 text-[11px] font-bold font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Unduh Word</span>
              </button>

              <button
                type="button"
                onClick={downloadAsPdf}
                className="py-2.5 px-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 tracking-wide transition shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer w-full"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Format PDF</span>
              </button>
            </div>
          </div>
          
          {/* Editor/Preview Mode Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
            <div className="flex items-center gap-1 bg-[#090a0f] p-1 rounded-xl border border-zinc-900 self-start">
              <button
                type="button"
                onClick={() => setIsPreviewEditMode(false)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold font-mono transition cursor-pointer ${
                  !isPreviewEditMode
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md"
                    : "text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>👁 Pratinjau Hasil</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewEditMode(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10.5px] font-bold font-mono transition cursor-pointer ${
                  isPreviewEditMode
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md"
                    : "text-zinc-400 hover:text-white border border-transparent"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>✍ Edit Teks Modul</span>
              </button>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono italic">
              {isPreviewEditMode 
                ? "💡 Seluruh draf teks di bawah dapat diedit bebas & tersinkronisasi saat didownload!" 
                : "💡 Klik 'Edit Teks Modul' di atas untuk memodifikasi konten sebelum diekspor"
              }
            </div>
          </div>

          {/* Document visual render box */}
          {isPreviewEditMode ? (
            <div className="bg-[#030305] border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  DRAFT EDITOR MODUL (FORMAT MARKDOWN)
                </label>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                  {generatedMd.length.toLocaleString()} KARAKTER
                </span>
              </div>
              <textarea
                className="w-full min-h-[580px] p-5 rounded-2xl bg-[#010103] text-zinc-300 font-mono text-[11px] leading-relaxed border border-zinc-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 scrollbar-thin resize-y focus:bg-[#040407]"
                value={generatedMd}
                onChange={(e) => setGeneratedMd(e.target.value)}
                placeholder="Tulis atau edit rancangan modul di sini sebelum mendownload..."
              />
            </div>
          ) : (
            <div className="bg-[#030305] border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed text-zinc-300 font-sans text-xs select-text">
              <div className="prose prose-invert prose-zinc max-w-none space-y-5 text-[11px]">
                {generatedMd.split("\n\n").map((chunk, idx) => {
                  const trimmed = chunk.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith("# ")) {
                    return (
                      <h1 key={idx} className="text-lg md:text-xl font-bold font-display text-white border-b border-zinc-900 pb-3 mt-8 mb-4 tracking-tight">
                        {trimmed.replace("# ", "").replace(/\*\*/g, "")}
                      </h1>
                    );
                  }

                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-xs font-bold font-display text-zinc-200 mt-6 mb-3 tracking-wide flex items-center gap-2 uppercase">
                        <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm" />
                        {trimmed.replace("## ", "").replace(/\*\*/g, "")}
                      </h2>
                    );
                  }

                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-[11.5px] font-bold font-mono text-amber-400 mt-5 mb-2 flex items-center gap-1.5">
                        <span>▪</span>
                        {trimmed.replace("### ", "").replace(/\*\*/g, "")}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                    const cleanedLines = trimmed.split("\n").map(l => l.replace(/^[\*\-]\s+/, ""));
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1.5 text-zinc-400 font-sans leading-relaxed">
                        {cleanedLines.map((line, liIdx) => (
                          <li key={liIdx} dangerouslySetInnerHTML={{ 
                            __html: line
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200 font-bold">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="text-zinc-300 italic">$1</em>')
                          }} />
                        ))}
                      </ul>
                    );
                  }

                  // Table parsing mapping (markdown to simple table)
                  if (trimmed.startsWith("|")) {
                    const rows = trimmed.split("\n").filter(Boolean);
                    const parsedRows = rows.map(r => r.split("|").map(c => c.trim()).filter((_, i) => i > 0 && i < r.split("|").length - 1));
                    
                    // Detect split separator row, don't render it
                    const contentRows = parsedRows.filter(r => !r.every(c => c.startsWith(":") || c.startsWith("-")));
                    if (contentRows.length === 0) return null;

                    return (
                      <div key={idx} className="overflow-x-auto my-3 border border-zinc-900 rounded-xl bg-black/30">
                        <table className="w-full text-left font-sans text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-zinc-950 border-b border-zinc-900">
                              {contentRows[0].map((th, thIdx) => (
                                <th key={thIdx} className="p-3 font-semibold text-zinc-300 uppercase tracking-wider">{th.replace(/\*\*/g, "")}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900 bg-black/10">
                            {contentRows.slice(1).map((tr, trIdx) => (
                              <tr key={trIdx} className="hover:bg-zinc-900/20">
                                {tr.map((td, tdIdx) => (
                                  <td key={tdIdx} className="p-3 text-zinc-400" dangerouslySetInnerHTML={{ 
                                    __html: td
                                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200 font-bold">$1</strong>')
                                      .replace(/\*(.*?)\*/g, '<em class="text-zinc-300 italic">$1</em>')
                                  }} />
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-zinc-400 font-sans leading-relaxed text-justify" dangerouslySetInnerHTML={{ 
                      __html: trimmed
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200 font-bold">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="text-zinc-300 italic">$1</em>')
                    }} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
