export interface Topic {
  judul: string;
  materi: string[];
}

export interface ElemenData {
  cp: string;
  topik: Topic[];
}

export const CURRICULUM_DATABASE: Record<string, Record<string, Record<string, ElemenData>>> = {
  "Fase A": {
    "Pendidikan Pancasila": {
      "Pancasila": {
        cp: "Mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila dan simbol Pancasila beserta sila-sila Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga.",
        topik: [
          { judul: "Bendera dan Lagu Kebangsaan", materi: ["Mengenal Bendera Merah Putih", "Mengenal Lagu Indonesia Raya", "Sikap Menghormati Bendera Negara"] },
          { judul: "Garuda Pancasila", materi: ["Simbol dalam Lambang Garuda Pancasila", "Sila-Sila Pancasila", "Makna Lambang Negara"] },
          { judul: "Penerapan di Keluarga", materi: ["Nilai Pancasila di Rumah", "Contoh Sikap Sila Pertama di Keluarga", "Membantu Orang Tua sebagai Nilai Pancasila"] }
        ]
      },
      "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945": {
        cp: "Mengenal aturan di lingkungan keluarga; menunjukkan dan menceritakan sikap mematuhi aturan di lingkungan keluarga.",
        topik: [
          { judul: "Aturan di Rumah", materi: ["Mengenal Aturan dalam Keluarga", "Contoh Aturan di Pagi Hari", "Manfaat Mematuhi Aturan"] },
          { judul: "Sikap Patuh Aturan", materi: ["Sikap Disiplin di Rumah", "Tanggung Jawab Anak di Keluarga"] }
        ]
      },
      "Bhinneka Tunggal Ika": {
        cp: "Mengenal semboyan Bhinneka Tunggal Ika; mengidentifikasi dan menghargai identitas dirinya sesuai dengan jenis kelamin, hobi, bahasa, serta agama dan kepercayaan di lingkungan sekitar.",
        topik: [
          { judul: "Semboyan Bangsa", materi: ["Mengenal Kalimat Bhinneka Tunggal Ika", "Arti Berbeda-beda Tetap Satu"] },
          { judul: "Identitas Diri", materi: ["Identitas Jenis Kelamin", "Identitas Hobi dan Kegemaran", "Identitas Bahasa Daerah", "Agama dan Kepercayaan"] },
          { judul: "Menghargai Perbedaan", materi: ["Sikap Menghargai Teman", "Keberagaman di Lingkungan Sekitar"] }
        ]
      },
      "Negara Kesatuan Republik Indonesia": {
        cp: "Mengenal karakteristik lingkungan tempat tinggal dan sekolah, sebagai bagian dari wilayah Negara Kesatuan Republik Indonesia; menceritakan dan mempraktikkan bekerja sama menjaga lingkungan sekitar dalam keberagaman.",
        topik: [
          { judul: "Lingkungan Sekitar", materi: ["Karakteristik lingkungan tempat tinggal", "Karakteristik lingkungan sekolah", "Bagian Wilayah NKRI"] },
          { judul: "Kerja Sama", materi: ["Praktik Kerja Sama di Lingkungan", "Menjaga Kebersihan Bersama", "Kerja Sama dalam Keberagaman"] }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Menyimak": {
        cp: "Memahami informasi dari teks nonsastra berbentuk teks aural (teks yang dibacakan dan/atau didengarkan) berupa percakapan yang berkaitan dengan diri, keluarga, dan/atau lingkungan sekitar; dan memahami pesan teks sastra berbentuk teks aural.",
        topik: [
          { judul: "Informasi Teks Aural", materi: ["Menyimak Percakapan tentang Diri", "Menyimak Percakapan tentang Keluarga", "Informasi Lingkungan Sekitar dari Teks Lisan"] },
          { judul: "Pesan Teks Sastra Aural", materi: ["Menyimak Dongeng/Cerita Anak", "Tokoh dan Karakter dalam Sastra Aural"] }
        ]
      },
      "Membaca dan Memirsa": {
        cp: "Membaca kata-kata sederhana dengan fasih dari bacaan dan/atau tayangan yang dipirsa tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; dan memahami isi bacaan dan/atau tayangan yang dipirsa tentang diri, keluarga, kesehatan, and/atau lingkungan sekitar.",
        topik: [
          { judul: "Membaca Kata Sederhana", materi: ["Membaca Kata Bertema Diri dan Keluarga", "Membaca Kata Bertema Kesehatan", "Kefasihan Membaca Kalimat Pendek"] },
          { judul: "Memahami Isi Bacaan/Tayangan", materi: ["Menjelaskan Isi Tayangan Edukasi", "Interpretasi Lingkungan melalui Bacaan"] }
        ]
      },
      "Berbicara dan Mempresentasikan": {
        cp: "Merespons dengan bertanya tentang sesuatu, menjawab, dan menanggapi komentar orang lain (teman, pendidik, dan/atau orang dewasa) dengan baik and santun dalam suatu percakapan tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; mengungkapkan perasaan dan gagasan secara lisan dengan atau tanpa bantuan gambar; dan menceritakan kembali isi berbagai tipe teks yang dibaca, dipirsa, atau didengar tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar.",
        topik: [
          { judul: "Respons dan Tanggapan", materi: ["Tanya Jawab Santun dengan Orang Lain", "Percakapan tentang Diri dan Keluarga"] },
          { judul: "Ungkapan Perasaan dan Gagasan", materi: ["Bercerita dengan Bantuan Gambar", "Mengungkapkan Perasaan Hati"] },
          { judul: "Menceritakan Kembali", materi: ["Menceritakan Isi Teks yang Didengar", "Presentasi Sederhana Hasil Bacaan"] }
        ]
      },
      "Menulis": {
        cp: "Menulis permulaan dengan benar di atas kertas and/atau melalui media digital; mengembangkan tulisan tangan yang semakin baik; dan menulis berbagai tipe teks sederhana tentang diri, keluarga, dan/atau lingkungan sekitar dengan beberapa kalimat sederhana.",
        topik: [
          { judul: "Menulis Permulaan", materi: ["Menulis Huruf dan Kata dengan Benar", "Menulis di Kertas dan Media Digital"] },
          { judul: "Tulisan Tangan", materi: ["Melatih Kelenturan Tangan dalam Menulis"] },
          { judul: "Teks Sederhana", materi: ["Menulis Kalimat Sederhana tentang Diri", "Deskripsi Singkat Lingkungan Sekitar"] }
        ]
      }
    },
    "Matematika": {
      "Bilangan": {
        cp: "Menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100; membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan; melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret yang banyaknya sampai 20; dan menunjukkan pemahaman pecahan sebagai bagian dari keseluruhan melalui konteks membagi sebuah benda atau kumpulan benda sama banyak (pecahan yang diperkenalkan adalah setengah dan seperempat).",
        topik: [
          { judul: "Bilangan Cacah Sampai 100", materi: ["Membaca dan Menulis Bilangan Cacah sampai 100", "Membandingkan dan Mengurutkan Bilangan Cacah", "Komposisi dan Dekomposisi Bilangan"] },
          { judul: "Operasi Hitung Bilangan Cacah", materi: ["Penjumlahan Menggunakan Benda Konkret sampai 20", "Penyelesaian Masalah Penjumlahan dan Pengurangan"] },
          { judul: "Pecahan Sederhana", materi: ["Konsep Pecahan Setengah (1/2)", "Membagi Kumpulan Benda Sama Banyak"] }
        ]
      },
      "Aljabar": {
        cp: "Menunjukan pemahaman makna simbol matematika \"=\" dalam suatu kalimat matematika yang terkait dengan penjumlahan dan pengurangan bilangan cacah sampai 20 menggunakan gambar. Contoh: Murid dapat mengenali, meniru, dan melanjutkan pola bukan bilangan (misalnya, gambar, warna, bunyi/suara).",
        topik: [
          { judul: "Simbol dan Kalimat Matematika", materi: ["Pemahaman Makna Simbol Sama Dengan (=)", "Kalimat Matematika Pengurangan dengan Gambar"] },
          { judul: "Pola Bukan Bilangan", materi: ["Mengenali dan Meniru Pola Gambar", "Kreasi Pola Bukan Bilangan Sederhana"] }
        ]
      },
      "Pengukuran": {
        cp: "Membandingkan panjang dan berat benda secara langsung, dan membandingkan durasi waktu; mengukur dan mengestimasi panjang dan berat benda menggunakan satuan tidak baku.",
        topik: [
          { judul: "Perbandingan dan Durasi", materi: ["Membandingkan Panjang Benda secara Langsung", "Membandingkan Durasi Waktu Aktivitas"] },
          { judul: "Pengukuran Satuan Tidak Baku", materi: ["Mengukur Panjang dengan Satuan Tidak Baku", "Penggunaan Alat Ukur Tidak Baku di Sekitar"] }
        ]
      },
      "Geometri": {
        cp: "Mengenal berbagai bangun datar (segitiga, segiempat, segi banyak, lingkaran) and bangun ruang (balok, kubus, kerucut, dan bola); melakukan komposisi (penyusunan) dan dekomposisi (penguraian) suatu bangun datar (segitiga, segiempat, and segi banyak); dan menentukan posisi benda terhadap benda lain (kanan, kiri, depan belakang, bawah, atas).",
        topik: [
          { judul: "Bangun Datar dan Bangun Ruang", materi: ["Mengenal Dasar Geometri", "Menentukan Letak Posisi Benda"] },
          { judul: "Komposisi dan Posisi", materi: ["Menguraikan Bangun Datar", "Kanan Kiri Depan Belakang"] }
        ]
      },
      "Analisis Data dan Peluang": {
        cp: "Mengurutkan, menyortir, mengelompokkan, membandingkan, dan menyajikan data dari banyak benda dengan menggunakan turus dan piktogram paling banyak 4 kategori.",
        topik: [
          { judul: "Pengolahan Data Sederhana", materi: ["Mengelompokkan dan Membandingkan Data"] },
          { judul: "Penyajian Data", materi: ["Menyajikan Data Menggunakan Piktogram", "Membaca Data dalam 4 Kategori"] }
        ]
      }
    },
    "Seni Rupa": {
      "Mengalami (Experiencing)": {
        cp: "Mengenali dan menyebutkan unsur-unsur rupa dalam benda-benda di sekitar/karya seni rupa.",
        topik: [
          { judul: "Unsur Rupa di Sekitar", materi: ["Mengenali Garis dan Warna pada Benda", "Eksplorasi Tekstur Benda Alami"] }
        ]
      },
      "Merefleksikan (Reflecting)": {
        cp: "Merefleksikan dan mengapresiasi karya diri sendiri.",
        topik: [
          { judul: "Apresiasi Karya Pribadi", materi: ["Mengungkapkan Perasaan terhadap Karya", "Menghargai Proses Pembuatan Karya"] }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        cp: "Mengenali dan menguji coba alat dan/atau bahan yang dimiliki.",
        topik: [
          { judul: "Eksplorasi Alat dan Bahan", materi: ["Mengenali Karakter Kertas Gambar", "Penggunaan Alat Gambar secara Aman"] }
        ]
      },
      "Menciptakan (Making/Creating)": {
        cp: "Membuat karya seni rupa berdasarkan pengalaman dan hasil pengamatan terhadap lingkungan sekitar.",
        topik: [
          { judul: "Kreasi Berbasis Lingkungan", materi: ["Membuat Karya dari Bahan Alam", "Melukis Pengalaman Bermain"] }
        ]
      },
      "Berdampak (Impacting)": {
        cp: "Menghasilkan karya seni rupa yang berdampak pada perasaan dirinya.",
        topik: [
          { judul: "Dampak Emosional Karya", materi: ["Kebanggaan atas Hasil Karya Seni"] }
        ]
      }
    },
    "Seni Tari": {
      "Mengalami (Experiencing)": {
        cp: "Mengenal bentuk tari sebagai media komunikasi serta mengembangkan kesadaran diri dalam bereksplorasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah.",
        topik: [
          { judul: "Bentuk Tari dan Eksplorasi", materi: ["Eksplorasi Gerak Ruang dan Tenaga", "Gerak di tempat dan Berpindah"] }
        ]
      },
      "Merefleksikan (Reflecting)": {
        cp: "Mengidentifikasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah, serta mengemukakan pencapaian diri secara lisan, tulisan, and kinestetik.",
        topik: [
          { judul: "Identifikasi Unsur Utama", materi: ["Refleksi Pencapaian Diri Lisan", "Refleksi Pencapaian Diri Kinestetik"] }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        cp: "Meragakan hasil gerak berdasarkan etika sebagai penampil dan penonton dengan keyakinan dan percaya diri saat mengekspresikan ide, perasaan kepada penonton atau lingkungan sekitar.",
        topik: [
          { judul: "Peragaan dan Etika Tari", materi: ["Etika Penampil dan Penonton", "Ekspresi Ide kepada Lingkungan"] }
        ]
      },
      "Menciptakan (Creating)": {
        cp: "Mengembangkan unsur utama tari (gerak, ruang, waktu, and tenaga), gerak di tempat, dan gerak berpindah untuk membuat gerak sederhana yang memiliki kesatuan gerak yang indah.",
        topik: [
          { judul: "Kreasi Gerak Sederhana", materi: ["Menciptakan Kesatuan Gerak Indah", "Penyusunan Gerak Tari Sederhana"] }
        ]
      },
      "Berdampak (Impacting)": {
        cp: "Menerima proses pembelajaran sehingga tumbuh rasa ingin tahu dan dapat menunjukkan antusiasme yang berdampak pada kemampuan diri dalam menyelesaikan aktivitas pembelajaran tari.",
        topik: [
          { judul: "Dampak Pembelajaran", materi: ["Antusiasme Menyelesaikan Aktivitas"] }
        ]
      }
    },
    "Seni Musik": {
      "Mengalami (Experiencing)": {
        cp: "Mengenali unsur-unsur musik (nada dan irama) menggunakan anggota tubuh maupun alat musik.",
        topik: [
          { judul: "Pengenalan Nada dan Irama", materi: ["Mengenal Ketukan Irama Sederhana", "Eksplorasi Bunyi dengan Alat Musik"] }
        ]
      },
      "Merefleksikan (Reflecting)": {
        cp: "Melakukan umpan balik mengenai praktik bermain musik diri sendiri atau orang lain menggunakan bahasa sehari-hari.",
        topik: [
          { judul: "Upan Balik Bermusik", materi: ["Mengomentari Permainan Musik Teman", "Bahasa Sehari-hari dalam Apresiasi Musik"] }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        cp: "Menirukan pola irama dan nada menggunakan alat musik ritmis atau melodis; mengenali ragam alat musik dan bunyi yang dihasilkan; mengenali cara memainkan dan membersihkan instrumen/alat musik.",
        topik: [
          { judul: "Praktik Artistik Musik", materi: ["Mengenal Ragam Bunyi Alat Musik", "Cara Membersihkan Instrumen Musik"] }
        ]
      },
      "Menciptakan (Creating)": {
        cp: "Membuat pola irama menggunakan anggota tubuh atau alat musik ritmis yang tersedia di lingkungan sekitar.",
        topik: [
          { judul: "Kreasi Pola Irama", materi: ["Membuat Irama dengan Alat Musik Ritmis"] }
        ]
      },
      "Berdampak (Impacting)": {
        cp: "Menunjukkan ekspresi senang dalam kegiatan bermusik.",
        topik: [
          { judul: "Ekspresi Senang Bermusik", materi: ["Kegembiraan dalam Aktivitas Musik"] }
        ]
      }
    }
  },
  "Fase B": {
    "Matematika": {
      "Bilangan": {
        cp: "Peserta didik menunjukkan pemahaman perkalian dan pembagian bilangan cacah sampai 100 menggunakan benda konkret, gambar, dan simbol matematika. Mereka dapat menyelesaikan masalah sehari-hari secara kritis.",
        topik: [
          { judul: "Konsep Perkalian & Pembagian Mendalam", materi: ["Perkalian Cacah Berbasis Konkret", "Pembagian sebagai Pengulangan Terstruktur", "Kasus Konseptual Pembagian Real Menggunakan Gambar"] }
        ]
      },
      "Geometri": {
        cp: "Peserta didik dapat mendeskripsikan ciri-ciri berbagai bangun datar (segiempat, segitiga, segibanyak) dan bangun ruang (balok, kubus).",
        topik: [
          { judul: "Ciri Bangun Datar & Ruang", materi: ["Mengelompokkan Sisi Segiempat", "Mengeksplorasi Jaring-jaring Balok Sekitar", "Menghitung Sudut Sederhana"] }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Membaca dan Memirsa": {
        cp: "Peserta didik mampu memahami ide pokok, informasi tersurat dan tersirat dalam teks naratif dan informatif sederhana secara kritis.",
        topik: [
          { judul: "Ide Pokok & Literasi Kritis", materi: ["Menentukan Ide Pokok Paragraf", "Menemukan Informasi Tersurat", "Menyimpulkan Makna Tersirat di Dongeng"] }
        ]
      }
    },
    "IPAS (Ilmu Pengetahuan Alam & Sosial)": {
      "Pemahaman IPAS": {
        cp: "Peserta didik mengidentifikasi proses fotosintesis pada tumbuhan dan mengaitkannya dengan keselarasan ekosistem di bumi.",
        topik: [
          { judul: "Proses Fotosintesis & Relevansi Ekologis", materi: ["Klorofil & Ketergantungan Cahaya", "Siklus Oksigen dalam Ekosistem Kelas", "Mengamati Aliran Nutrisi Rantai Makanan"] }
        ]
      }
    }
  },
  "Fase C": {
    "Matematika": {
      "Bilangan": {
        cp: "Peserta didik mampu memahami konsep desimal, persen, dan pecahan campuran serta melakukan operasi hitung penjumlahan dan pengurangan pecahan.",
        topik: [
          { judul: "Pecahan Campuran & Desimal Kreatif", materi: ["Penjumlahan Pecahan Beda Penyebut", "Konversi Desimal ke Persen Praktikal", "Aplikasi Uang dan Persen Diskon Toko"] }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Berbicara dan Mempresentasikan": {
        cp: "Peserta didik mampu menyajikan hasil analisis ide pokok dan mempresentasikan gagasan orisinal secara lisan dengan santun dan runtut.",
        topik: [
          { judul: "Menganalisis Ide Pokok & Literasi Kritis", materi: ["Presentasi Hasil Riset Mandiri", "Gagasan Orisinal Pidato Persuasif", "Tata Cara Debat Santun Terstruktur"] }
        ]
      }
    },
    "IPAS (Ilmu Pengetahuan Alam & Sosial)": {
      "Pemahaman IPAS": {
        cp: "Peserta didik mendeskripsikan transfer energi dalam ekosistem dan mengaitkannya dengan konservasi lingkungan hidup.",
        topik: [
          { judul: "Rantai Makanan & Konservasi Alam", materi: ["Siklus Penyerapan Karbon Hutan", "Dampak Polusi pada Jaring Makanan", "Rencana Aksi Hemat Energi Rumah Tangga"] }
        ]
      }
    }
  }
};
