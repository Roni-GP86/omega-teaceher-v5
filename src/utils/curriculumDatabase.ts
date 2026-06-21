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
        "cp": "Mengenal bendera negara, lagu kebangsaan, simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila dan simbol Pancasila beserta sila-sila Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga.",
        "topik": [
          {
            "judul": "Bendera dan Lagu Kebangsaan",
            "materi": [
              "Mengenal Bendera Merah Putih",
              "Mengenal Lagu Indonesia Raya",
              "Sikap Menghormati Bendera Negara"
            ]
          },
          {
            "judul": "Garuda Pancasila",
            "materi": [
              "Simbol dalam Lambang Garuda Pancasila",
              "Sila-Sila Pancasila",
              "Makna Lambang Negara"
            ]
          },
          {
            "judul": "Penerapan di Keluarga",
            "materi": [
              "Nilai Pancasila di Rumah",
              "Contoh Sikap Sila Pertama di Keluarga",
              "Membantu Orang Tua sebagai Nilai Pancasila"
            ]
          }
        ]
      },
      "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945": {
        "cp": "Mengenal aturan di lingkungan keluarga; menunjukkan dan menceritakan sikap mematuhi aturan di lingkungan keluarga.",
        "topik": [
          {
            "judul": "Aturan di Rumah",
            "materi": [
              "Mengenal Aturan dalam Keluarga",
              "Contoh Aturan di Pagi Hari",
              "Manfaat Mematuhi Aturan"
            ]
          },
          {
            "judul": "Sikap Patuh Aturan",
            "materi": [
              "Sikap Disiplin di Rumah",
              "Tanggung Jawab Anak di Keluarga"
            ]
          }
        ]
      },
      "Bhinneka Tunggal Ika": {
        "cp": "Mengenal semboyan Bhinneka Tunggal Ika; mengidentifikasi dan menghargai identitas dirinya sesuai dengan jenis kelamin, hobi, bahasa, serta agama dan kepercayaan di lingkungan sekitar.",
        "topik": [
          {
            "judul": "Semboyan Bangsa",
            "materi": [
              "Mengenal Kalimat Bhinneka Tunggal Ika",
              "Arti Berbeda-beda Tetap Satu"
            ]
          },
          {
            "judul": "Identitas Diri",
            "materi": [
              "Identitas Jenis Kelamin",
              "Identitas Hobi dan Kegemaran",
              "Identitas Bahasa Daerah",
              "Agama dan Kepercayaan"
            ]
          },
          {
            "judul": "Menghargai Perbedaan",
            "materi": [
              "Sikap Menghargai Teman",
              "Keberagaman di Lingkungan Sekitar"
            ]
          }
        ]
      },
      "Negara Kesatuan Republik Indonesia": {
        "cp": "Mengenal karakteristik lingkungan tempat tinggal dan sekolah, sebagai bagian dari wilayah Negara Kesatuan Republik Indonesia; menceritakan dan mempraktikkan bekerja sama menjaga lingkungan sekitar dalam keberagaman.",
        "topik": [
          {
            "judul": "Lingkungan Sekitar",
            "materi": [
              "Karakteristik lingkungan tempat tinggal",
              "Karakteristik lingkungan sekolah",
              "Bagian Wilayah NKRI"
            ]
          },
          {
            "judul": "Kerja Sama",
            "materi": [
              "Praktik Kerja Sama di Lingkungan",
              "Menjaga Kebersihan Bersama",
              "Kerja Sama dalam Keberagaman"
            ]
          }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Menyimak": {
        "cp": "Memahami informasi dari teks nonsastra berbentuk teks aural (teks yang dibacakan dan/atau didengarkan) berupa percakapan yang berkaitan dengan diri, keluarga, dan/atau lingkungan sekitar; dan memahami pesan teks sastra berbentuk teks aural.",
        "topik": [
          {
            "judul": "Informasi Teks Aural",
            "materi": [
              "Menyimak Percakapan tentang Diri",
              "Menyimak Percakapan tentang Keluarga",
              "Informasi Lingkungan Sekitar dari Teks Lisan"
            ]
          },
          {
            "judul": "Pesan Teks Sastra Aural",
            "materi": [
              "Menyimak Dongeng/Cerita Anak",
              "Tokoh dan Karakter dalam Sastra Aural"
            ]
          }
        ]
      },
      "Membaca dan Memirsa": {
        "cp": "Membaca kata-kata sederhana dengan fasih dari bacaan dan/atau tayangan yang dipirsa tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; dan memahami isi bacaan dan/atau tayangan yang dipirsa tentang diri, keluarga, kesehatan, and/atau lingkungan sekitar.",
        "topik": [
          {
            "judul": "Membaca Kata Sederhana",
            "materi": [
              "Membaca Kata Bertema Diri dan Keluarga",
              "Membaca Kata Bertema Kesehatan",
              "Kefasihan Membaca Kalimat Pendek"
            ]
          },
          {
            "judul": "Memahami Isi Bacaan/Tayangan",
            "materi": [
              "Menjelaskan Isi Tayangan Edukasi",
              "Interpretasi Lingkungan melalui Bacaan"
            ]
          }
        ]
      },
      "Berbicara dan Mempresentasikan": {
        "cp": "Merespons dengan bertanya tentang sesuatu, menjawab, dan menanggapi komentar orang lain (teman, pendidik, dan/atau orang dewasa) dengan baik and santun dalam suatu percakapan tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar; mengungkapkan perasaan dan gagasan secara lisan dengan atau tanpa bantuan gambar; dan menceritakan kembali isi berbagai tipe teks yang dibaca, dipirsa, atau didengar tentang diri, keluarga, kesehatan, dan/atau lingkungan sekitar.",
        "topik": [
          {
            "judul": "Respons dan Tanggapan",
            "materi": [
              "Tanya Jawab Santun dengan Orang Lain",
              "Percakapan tentang Diri dan Keluarga"
            ]
          },
          {
            "judul": "Ungkapan Perasaan dan Gagasan",
            "materi": [
              "Bercerita dengan Bantuan Gambar",
              "Mengungkapkan Perasaan Hati"
            ]
          },
          {
            "judul": "Menceritakan Kembali",
            "materi": [
              "Menceritakan Isi Teks yang Didengar",
              "Presentasi Sederhana Hasil Bacaan"
            ]
          }
        ]
      },
      "Menulis": {
        "cp": "Menulis permulaan dengan benar di atas kertas and/atau melalui media digital; mengembangkan tulisan tangan yang semakin baik; dan menulis berbagai tipe teks sederhana tentang diri, keluarga, dan/atau lingkungan sekitar dengan beberapa kalimat sederhana.",
        "topik": [
          {
            "judul": "Menulis Permulaan",
            "materi": [
              "Menulis Huruf dan Kata dengan Benar",
              "Menulis di Kertas dan Media Digital"
            ]
          },
          {
            "judul": "Tulisan Tangan",
            "materi": [
              "Melatih Kelenturan Tangan dalam Menulis"
            ]
          },
          {
            "judul": "Teks Sederhana",
            "materi": [
              "Menulis Kalimat Sederhana tentang Diri",
              "Deskripsi Singkat Lingkungan Sekitar"
            ]
          }
        ]
      }
    },
    "Matematika": {
      "Bilangan": {
        "cp": "Menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100; membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan; melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret yang banyaknya sampai 20; dan menunjukkan pemahaman pecahan sebagai bagian dari keseluruhan melalui konteks membagi sebuah benda atau kumpulan benda sama banyak (pecahan yang diperkenalkan adalah setengah dan seperempat).",
        "topik": [
          {
            "judul": "Bilangan Cacah Sampai 100",
            "materi": [
              "Membaca dan Menulis Bilangan Cacah sampai 100",
              "Membandingkan dan Mengurutkan Bilangan Cacah",
              "Komposisi dan Dekomposisi Bilangan"
            ]
          },
          {
            "judul": "Operasi Hitung Bilangan Cacah",
            "materi": [
              "Penjumlahan Menggunakan Benda Konkret sampai 20",
              "Penyelesaian Masalah Penjumlahan dan Pengurangan"
            ]
          },
          {
            "judul": "Pecahan Sederhana",
            "materi": [
              "Konsep Pecahan Setengah (1/2)",
              "Membagi Kumpulan Benda Sama Banyak"
            ]
          }
        ]
      },
      "Aljabar": {
        "cp": "Menunjukan pemahaman makna simbol matematika \"=\" dalam suatu kalimat matematika yang terkait dengan penjumlahan dan pengurangan bilangan cacah sampai 20 menggunakan gambar. Contoh: Murid dapat mengenali, meniru, dan melanjutkan pola bukan bilangan (misalnya, gambar, warna, bunyi/suara).",
        "topik": [
          {
            "judul": "Simbol dan Kalimat Matematika",
            "materi": [
              "Pemahaman Makna Simbol Sama Dengan (=)",
              "Kalimat Matematika Pengurangan dengan Gambar"
            ]
          },
          {
            "judul": "Pola Bukan Bilangan",
            "materi": [
              "Mengenali dan Meniru Pola Gambar",
              "Kreasi Pola Bukan Bilangan Sederhana"
            ]
          }
        ]
      },
      "Pengukuran": {
        "cp": "Membandingkan panjang dan berat benda secara langsung, dan membandingkan durasi waktu; mengukur dan mengestimasi panjang dan berat benda menggunakan satuan tidak baku.",
        "topik": [
          {
            "judul": "Perbandingan dan Durasi",
            "materi": [
              "Membandingkan Panjang Benda secara Langsung",
              "Membandingkan Durasi Waktu Aktivitas"
            ]
          },
          {
            "judul": "Pengukuran Satuan Tidak Baku",
            "materi": [
              "Mengukur Panjang dengan Satuan Tidak Baku",
              "Penggunaan Alat Ukur Tidak Baku di Sekitar"
            ]
          }
        ]
      },
      "Geometri": {
        "cp": "Mengenal berbagai bangun datar (segitiga, segiempat, segi banyak, lingkaran) and bangun ruang (balok, kubus, kerucut, dan bola); melakukan komposisi (penyusunan) dan dekomposisi (penguraian) suatu bangun datar (segitiga, segiempat, and segi banyak); dan menentukan posisi benda terhadap benda lain (kanan, kiri, depan belakang, bawah, atas).",
        "topik": [
          {
            "judul": "Bangun Datar dan Bangun Ruang",
            "materi": [
              "Mengenal Dasar Geometri",
              "Menentukan Letak Posisi Benda"
            ]
          },
          {
            "judul": "Komposisi dan Posisi",
            "materi": [
              "Menguraikan Bangun Datar",
              "Kanan Kiri Depan Belakang"
            ]
          }
        ]
      },
      "Analisis Data dan Peluang": {
        "cp": "Mengurutkan, menyortir, mengelompokkan, membandingkan, dan menyajikan data dari banyak benda dengan menggunakan turus dan piktogram paling banyak 4 kategori.",
        "topik": [
          {
            "judul": "Pengolahan Data Sederhana",
            "materi": [
              "Mengelompokkan dan Membandingkan Data"
            ]
          },
          {
            "judul": "Penyajian Data",
            "materi": [
              "Menyajikan Data Menggunakan Piktogram",
              "Membaca Data dalam 4 Kategori"
            ]
          }
        ]
      }
    },
    "Seni Rupa": {
      "Mengalami (Experiencing)": {
        "cp": "Mengenali dan menyebutkan unsur-unsur rupa dalam benda-benda di sekitar/karya seni rupa.",
        "topik": [
          {
            "judul": "Unsur Rupa di Sekitar",
            "materi": [
              "Mengenali Garis dan Warna pada Benda",
              "Eksplorasi Tekstur Benda Alami"
            ]
          }
        ]
      },
      "Merefleksikan (Reflecting)": {
        "cp": "Merefleksikan dan mengapresiasi karya diri sendiri.",
        "topik": [
          {
            "judul": "Apresiasi Karya Pribadi",
            "materi": [
              "Mengungkapkan Perasaan terhadap Karya",
              "Menghargai Proses Pembuatan Karya"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        "cp": "Mengenali dan menguji coba alat dan/atau bahan yang dimiliki.",
        "topik": [
          {
            "judul": "Eksplorasi Alat dan Bahan",
            "materi": [
              "Mengenali Karakter Kertas Gambar",
              "Penggunaan Alat Gambar secara Aman"
            ]
          }
        ]
      },
      "Menciptakan (Making/Creating)": {
        "cp": "Membuat karya seni rupa berdasarkan pengalaman dan hasil pengamatan terhadap lingkungan sekitar.",
        "topik": [
          {
            "judul": "Kreasi Berbasis Lingkungan",
            "materi": [
              "Membuat Karya dari Bahan Alam",
              "Melukis Pengalaman Bermain"
            ]
          }
        ]
      },
      "Berdampak (Impacting)": {
        "cp": "Menghasilkan karya seni rupa yang berdampak pada perasaan dirinya.",
        "topik": [
          {
            "judul": "Dampak Emosional Karya",
            "materi": [
              "Kebanggaan atas Hasil Karya Seni"
            ]
          }
        ]
      }
    },
    "Seni Tari": {
      "Mengalami (Experiencing)": {
        "cp": "Mengenal bentuk tari sebagai media komunikasi serta mengembangkan kesadaran diri dalam bereksplorasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah.",
        "topik": [
          {
            "judul": "Bentuk Tari dan Eksplorasi",
            "materi": [
              "Eksplorasi Gerak Ruang dan Tenaga",
              "Gerak di tempat dan Berpindah"
            ]
          }
        ]
      },
      "Merefleksikan (Reflecting)": {
        "cp": "Mengidentifikasi unsur utama tari meliputi gerak, ruang, tenaga, waktu, gerak di tempat dan gerak berpindah, serta mengemukakan pencapaian diri secara lisan, tulisan, and kinestetik.",
        "topik": [
          {
            "judul": "Identifikasi Unsur Utama",
            "materi": [
              "Refleksi Pencapaian Diri Lisan",
              "Refleksi Pencapaian Diri Kinestetik"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        "cp": "Meragakan hasil gerak berdasarkan etika sebagai penampil dan penonton dengan keyakinan dan percaya diri saat mengekspresikan ide, perasaan kepada penonton atau lingkungan sekitar.",
        "topik": [
          {
            "judul": "Peragaan dan Etika Tari",
            "materi": [
              "Etika Penampil dan Penonton",
              "Ekspresi Ide kepada Lingkungan"
            ]
          }
        ]
      },
      "Menciptakan (Creating)": {
        "cp": "Mengembangkan unsur utama tari (gerak, ruang, waktu, and tenaga), gerak di tempat, dan gerak berpindah untuk membuat gerak sederhana yang memiliki kesatuan gerak yang indah.",
        "topik": [
          {
            "judul": "Kreasi Gerak Sederhana",
            "materi": [
              "Menciptakan Kesatuan Gerak Indah",
              "Penyusunan Gerak Tari Sederhana"
            ]
          }
        ]
      },
      "Berdampak (Impacting)": {
        "cp": "Menerima proses pembelajaran sehingga tumbuh rasa ingin tahu dan dapat menunjukkan antusiasme yang berdampak pada kemampuan diri dalam menyelesaikan aktivitas pembelajaran tari.",
        "topik": [
          {
            "judul": "Dampak Pembelajaran",
            "materi": [
              "Antusiasme Menyelesaikan Aktivitas"
            ]
          }
        ]
      }
    },
    "Seni Musik": {
      "Mengalami (Experiencing)": {
        "cp": "Mengenali unsur-unsur musik (nada dan irama) menggunakan anggota tubuh maupun alat musik.",
        "topik": [
          {
            "judul": "Pengenalan Nada dan Irama",
            "materi": [
              "Mengenal Ketukan Irama Sederhana",
              "Eksplorasi Bunyi dengan Alat Musik"
            ]
          }
        ]
      },
      "Merefleksikan (Reflecting)": {
        "cp": "Melakukan umpan balik mengenai praktik bermain musik diri sendiri atau orang lain menggunakan bahasa sehari-hari.",
        "topik": [
          {
            "judul": "Upan Balik Bermusik",
            "materi": [
              "Mengomentari Permainan Musik Teman",
              "Bahasa Sehari-hari dalam Apresiasi Musik"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": {
        "cp": "Menirukan pola irama dan nada menggunakan alat musik ritmis atau melodis; mengenali ragam alat musik dan bunyi yang dihasilkan; mengenali cara memainkan dan membersihkan instrumen/alat musik.",
        "topik": [
          {
            "judul": "Praktik Artistik Musik",
            "materi": [
              "Mengenal Ragam Bunyi Alat Musik",
              "Cara Membersihkan Instrumen Musik"
            ]
          }
        ]
      },
      "Menciptakan (Creating)": {
        "cp": "Membuat pola irama menggunakan anggota tubuh atau alat musik ritmis yang tersedia di lingkungan sekitar.",
        "topik": [
          {
            "judul": "Kreasi Pola Irama",
            "materi": [
              "Membuat Irama dengan Alat Musik Ritmis"
            ]
          }
        ]
      },
      "Berdampak (Impacting)": {
        "cp": "Menunjukkan ekspresi senang dalam kegiatan bermusik.",
        "topik": [
          {
            "judul": "Ekspresi Senang Bermusik",
            "materi": [
              "Kegembiraan dalam Aktivitas Musik"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Islam dan Budi Pekerti": {
      "Al-Qur'an Hadis": {
        "cp": "Membaca dan membedakan huruf hijaiah berharakat, huruf hijaiah bersambung; menghafal Surah al-Fatihah, beberapa surah pendek Al-Qur'an, dan hadis tentang kebersihan.",
        "topik": [
          {
            "judul": "Mengenal Huruf Hijaiah",
            "materi": [
              "Membaca huruf hijaiah berharakat",
              "Membedakan huruf hijaiah berharakat",
              "Membaca huruf hijaiah bersambung"
            ]
          },
          {
            "judul": "Menghafal Surah dan Hadis",
            "materi": [
              "Menghafal Surah al-Fatihah",
              "Menghafal beberapa surah pendek Al-Qur'an",
              "Menghafal hadis tentang kebersihan"
            ]
          }
        ]
      },
      "Akidah": {
        "cp": "Menjelaskan dan meyakini rukun iman, iman kepada Allah Swt., beberapa asmaulhusna, dan iman kepada malaikat.",
        "topik": [
          {
            "judul": "Memahami Rukun Iman",
            "materi": [
              "Menjelaskan rukun iman",
              "Meyakini rukun iman"
            ]
          },
          {
            "judul": "Iman kepada Allah Swt.",
            "materi": [
              "Meyakini Allah Swt.",
              "Mengenal beberapa Asmaulhusna"
            ]
          },
          {
            "judul": "Iman kepada Malaikat",
            "materi": [
              "Meyakini keberadaan malaikat"
            ]
          }
        ]
      },
      "Akhlak": {
        "cp": "Menerapkan akhlak terhadap Allah Swt. dengan menyucikan dan memuji-Nya, dan akhlak terhadap diri sendiri.",
        "topik": [
          {
            "judul": "Akhlak kepada Allah Swt.",
            "materi": [
              "Menyucikan Allah Swt.",
              "Memuji Allah Swt."
            ]
          },
          {
            "judul": "Akhlak terhadap Diri Sendiri",
            "materi": [
              "Menerapkan akhlak baik untuk diri sendiri"
            ]
          }
        ]
      },
      "Fikih": {
        "cp": "Menerapkan rukun Islam, syahadatain, tata cara bersuci, salat fardu, zikir dan berdoa setelah salat.",
        "topik": [
          {
            "judul": "Memahami Rukun Islam",
            "materi": [
              "Menerapkan rukun Islam",
              "Melafalkan syahadatain"
            ]
          },
          {
            "judul": "Praktik Ibadah Dasar",
            "materi": [
              "Memahami tata cara bersuci",
              "Menerapkan salat fardu",
              "Melakukan zikir setelah salat",
              "Berdoa setelah salat"
            ]
          }
        ]
      },
      "Sejarah Peradaban Islam": {
        "cp": "Menceritakan kisah keteladanan beberapa nabi dan rasul.",
        "topik": [
          {
            "judul": "Kisah Teladan Nabi dan Rasul",
            "materi": [
              "Menceritakan kisah nabi-nabi",
              "Menceritakan kisah rasul-rasul"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Kristen dan Budi Pekerti": {
      "Allah Berkarya - Allah Pencipta": {
        "cp": "Murid memahami Allah menciptakan dirinya sebagai pribadi yang istimewa dan membangun interaksi dengan lingkungan terdekat.",
        "topik": [
          {
            "judul": "Memahami Allah sebagai Pencipta Diri",
            "materi": [
              "Memahami diri sebagai pribadi istimewa ciptaan Allah",
              "Membangun interaksi positif dengan lingkungan terdekat"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Pemelihara": {
        "cp": "Murid memahami pemeliharaan Allah pada dirinya melalui kehadiran keluarga.",
        "topik": [
          {
            "judul": "Pemeliharaan Allah dalam Keluarga",
            "materi": [
              "Memahami bahwa Allah memelihara diri",
              "Mengenali peran keluarga dalam pemeliharaan Allah"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia": {
        "cp": "Murid memahami diri sebagai pribadi yang bertumbuh dan berkembang.",
        "topik": [
          {
            "judul": "Memahami Diri sebagai Individu",
            "materi": [
              "Memahami diri sebagai pribadi yang bertumbuh",
              "Memahami diri sebagai pribadi yang berkembang"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani": {
        "cp": "Murid memahami makna kebaikan, ramah dan sopan di rumah dan di sekolah.",
        "topik": [
          {
            "judul": "Menerapkan Nilai Kebaikan",
            "materi": [
              "Memahami makna kebaikan",
              "Bersikap ramah di rumah dan di sekolah",
              "Bersikap sopan di rumah dan di sekolah"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja": {
        "cp": "Murid memahami keberadaan gereja sebagai wadah berkumpul dan beribadah serta kewajiban berdoa dan memuji Tuhan.",
        "topik": [
          {
            "judul": "Peran Gereja dan Ibadah",
            "materi": [
              "Memahami gereja sebagai tempat berkumpul dan beribadah",
              "Memahami kewajiban berdoa",
              "Memahami kewajiban memuji Tuhan"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk": {
        "cp": "Murid memahami keragaman suku bangsa sebagai anugerah Allah.",
        "topik": [
          {
            "judul": "Menghargai Keragaman",
            "materi": [
              "Memahami keragaman suku bangsa",
              "Menyadari keragaman sebagai anugerah Allah"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Alam Ciptaan Allah": {
        "cp": "Murid memahami alam dan lingkungan hidup sebagai ciptaan Allah.",
        "topik": [
          {
            "judul": "Memahami Ciptaan Alam",
            "materi": [
              "Memahami alam sebagai ciptaan Allah",
              "Memahami lingkungan hidup sebagai ciptaan Allah"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam": {
        "cp": "Murid memahami tugas memelihara alam dan lingkungan hidup di rumah dan di sekolah.",
        "topik": [
          {
            "judul": "Tanggung Jawab Lingkungan",
            "materi": [
              "Memahami tugas memelihara alam di rumah",
              "Memahami tugas memelihara lingkungan hidup di sekolah"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Katolik dan Budi Pekerti": {
      "Pribadi murid": {
        "cp": "Murid memahami dirinya sebagai pribadi yang dicintai Tuhan, memiliki anggota tubuh yang berguna, memahami cara merawat tubuhnya; memahami teman-teman, lingkungan rumah dan sekolah sebagai tempat mengembangkan potensi diri.",
        "topik": [
          {
            "judul": "Diri sebagai Ciptaan Tuhan",
            "materi": [
              "Memahami diri dicintai Tuhan",
              "Memahami anggota tubuh berguna"
            ]
          },
          {
            "judul": "Merawat Diri dan Lingkungan",
            "materi": [
              "Memahami cara merawat tubuh",
              "Memahami teman-teman dan lingkungan sebagai tempat mengembangkan potensi diri"
            ]
          }
        ]
      },
      "Yesus Kristus": {
        "cp": "Murid memahami bahwa Tuhan menciptakan langit, bumi, dan seluruh isinya; memahami tokoh-tokoh iman di dalam Perjanjian Lama (Nuh, Abraham, Ishak dan Yakub); memahami kisah kelahiran Tuhan Yesus, kisah tiga orang Majus, masa kanak-kanak Yesus di Nazaret, Yesus dipersembahkan di Bait Allah, dan berada di Bait Allah pada umur 12 tahun.",
        "topik": [
          {
            "judul": "Tuhan Sang Pencipta",
            "materi": [
              "Memahami Tuhan menciptakan langit dan bumi beserta isinya"
            ]
          },
          {
            "judul": "Tokoh Iman Perjanjian Lama",
            "materi": [
              "Memahami kisah Nuh",
              "Memahami kisah Abraham",
              "Memahami kisah Ishak",
              "Memahami kisah Yakub"
            ]
          },
          {
            "judul": "Kisah Kelahiran dan Masa Kecil Yesus",
            "materi": [
              "Memahami kisah kelahiran Tuhan Yesus",
              "Memahami kisah tiga orang Majus",
              "Memahami masa kanak-kanak Yesus di Nazaret",
              "Memahami Yesus dipersembahkan di Bait Allah",
              "Memahami Yesus berada di Bait Allah pada umur 12 tahun"
            ]
          }
        ]
      },
      "Gereja": {
        "cp": "Murid memahami imannya dengan cara membuat tanda salib, berdoa Bapa Kami, Salam Maria, dan Kemuliaan; memahami iman dengan melaksanakan perintah Allah, dan membiasakan diri dengan berdoa pujian, syukur dan permohonan.",
        "topik": [
          {
            "judul": "Praktik Iman dan Doa",
            "materi": [
              "Membuat tanda salib",
              "Berdoa Bapa Kami",
              "Berdoa Salam Maria",
              "Berdoa Kemuliaan"
            ]
          },
          {
            "judul": "Pelaksanaan Perintah Allah dan Jenis Doa",
            "materi": [
              "Memahami iman dengan melaksanakan perintah Allah",
              "Membiasakan diri dengan berdoa pujian",
              "Membiasakan diri dengan berdoa syukur",
              "Membiasakan diri dengan berdoa permohonan"
            ]
          }
        ]
      },
      "Masyarakat": {
        "cp": "Murid memahami lingkungan keluarga, dan teman-teman, memiliki kebiasaan bekerja sama dengan anggota keluarga dan teman-teman; memahami iman di tengah masyarakat melalui kebiasaan hidup rukun dengan tetangga dan bergotong royong merawat lingkungan.",
        "topik": [
          {
            "judul": "Interaksi Sosial dan Kerjasama",
            "materi": [
              "Memahami lingkungan keluarga dan teman-teman",
              "Bekerja sama dengan anggota keluarga",
              "Bekerja sama dengan teman-teman"
            ]
          },
          {
            "judul": "Iman dan Kehidupan Bermasyarakat",
            "materi": [
              "Hidup rukun dengan tetangga",
              "Bergotong royong merawat lingkungan"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Hindu dan Budi Pekerti": {
      "Kitab Suci Weda": {
        "cp": "Mengenali Kitab Rāmāyaņa dan Kitab Mahābhārata.",
        "topik": [
          {
            "judul": "Mengenal Kitab Suci Hindu",
            "materi": [
              "Mengenali Kitab Rāmāyaņa",
              "Mengenali Kitab Mahābhārata"
            ]
          }
        ]
      },
      "Śraddhā dan Bhakti": {
        "cp": "Memahami Hyang Widhi Wasa sebagai pencipta dan sumber hidup.",
        "topik": [
          {
            "judul": "Konsep Hyang Widhi Wasa",
            "materi": [
              "Memahami Hyang Widhi Wasa sebagai pencipta",
              "Memahami Hyang Widhi Wasa sebagai sumber hidup"
            ]
          }
        ]
      },
      "Susila": {
        "cp": "Mengenali Subha Karma dan Asubha Karma, serta Tri Kaya Parisudha.",
        "topik": [
          {
            "judul": "Etika Perilaku",
            "materi": [
              "Mengenali Subha Karma (perbuatan baik)",
              "Mengenali Asubha Karma (perbuatan tidak baik)",
              "Mengenali Tri Kaya Parisudha"
            ]
          }
        ]
      },
      "Acara": {
        "cp": "Mengenali Dainika Upasana dan sarana persembahyangan.",
        "topik": [
          {
            "judul": "Ritual Keagamaan",
            "materi": [
              "Mengenali Dainika Upasana (sembahyang harian)",
              "Mengenali sarana persembahyangan"
            ]
          }
        ]
      },
      "Sejarah Agama Hindu": {
        "cp": "Mengenali Kerajaan-kerajaan Hindu di Indonesia.",
        "topik": [
          {
            "judul": "Sejarah Hindu Nusantara",
            "materi": [
              "Mengenali kerajaan Hindu di Indonesia"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Buddha dan Budi Pekerti": {
      "Sejarah": {
        "cp": "Mengenali keragaman identitas, menyayangi diri sendiri, mengenali cara berkomunikasi yang baik, mengenali bodhisattva, para Buddha, dan tokoh dalam kisah jataka.",
        "topik": [
          {
            "judul": "Identitas Diri dan Komunikasi",
            "materi": [
              "Mengenali keragaman identitas",
              "Menyayangi diri sendiri",
              "Mengenali cara berkomunikasi yang baik"
            ]
          },
          {
            "judul": "Tokoh Teladan Buddhis",
            "materi": [
              "Mengenali Bodhisattva",
              "Mengenali para Buddha",
              "Mengenali tokoh dalam kisah Jataka"
            ]
          }
        ]
      },
      "Ritual": {
        "cp": "Mengingat identitas agama Buddha, mengenali simbol-simbol keagamaan Buddha dan alat-alat ritual di lingkungan rumah dan sekolahnya.",
        "topik": [
          {
            "judul": "Simbol dan Identitas Agama Buddha",
            "materi": [
              "Mengingat identitas agama Buddha",
              "Mengenali simbol-simbol keagamaan Buddha"
            ]
          },
          {
            "judul": "Alat Ritual Buddhis",
            "materi": [
              "Mengenali alat-alat ritual di rumah",
              "Mengenali alat-alat ritual di sekolah"
            ]
          }
        ]
      },
      "Etika": {
        "cp": "Meniru sopan santun, mengenali prinsip pergaulan yang harmonis berdasarkan empat sifat luhur dan hukum karma di lingkungan rumah, sekolah, dan tempat ibadah.",
        "topik": [
          {
            "judul": "Sopan Santun dan Pergaulan Harmonis",
            "materi": [
              "Meniru sopan santun",
              "Mengenali prinsip pergaulan yang harmonis"
            ]
          },
          {
            "judul": "Etika Berdasarkan Ajaran Buddha",
            "materi": [
              "Memahami empat sifat luhur dalam pergaulan",
              "Memahami hukum karma",
              "Menerapkan etika di lingkungan rumah",
              "Menerapkan etika di lingkungan sekolah",
              "Menerapkan etika di tempat ibadah"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Khonghucu dan Budi Pekerti": {
      "Sejarah Suci": {
        "cp": "Menjelaskan keteladanan masa kecil Nabi Kōngzi (孔子).",
        "topik": [
          {
            "judul": "Kisah Teladan Nabi Kōngzi",
            "materi": [
              "Menjelaskan masa kecil Nabi Kōngzi"
            ]
          }
        ]
      },
      "Kitab Suci": {
        "cp": "Menjelaskan kitab suci agama Khonghucu.",
        "topik": [
          {
            "judul": "Mengenal Kitab Suci Khonghucu",
            "materi": [
              "Menjelaskan kitab suci agama Khonghucu"
            ]
          }
        ]
      },
      "Keimanan": {
        "cp": "Menjelaskan Tiān(天)Maha Pencipta dan orang tua sebagai wakil Tian (天) di dunia.",
        "topik": [
          {
            "judul": "Konsep Tiān sebagai Pencipta",
            "materi": [
              "Menjelaskan Tiān (天) sebagai Maha Pencipta"
            ]
          },
          {
            "judul": "Peran Orang Tua sebagai Wakil Tiān",
            "materi": [
              "Menjelaskan orang tua sebagai wakil Tiān (天) di dunia"
            ]
          }
        ]
      },
      "Tata Ibadah": {
        "cp": "Mendemonstrasikan sikap bào xīn bādé (抱心八德) dan bào tàijí bādé (抱太極八德).",
        "topik": [
          {
            "judul": "Sikap Ibadah",
            "materi": [
              "Mendemonstrasikan sikap bào xīn bādé (delapan kebajikan dalam hati)",
              "Mendemonstrasikan sikap bào tàijí bādé (delapan kebajikan dalam tindakan)"
            ]
          }
        ]
      },
      "Perilaku Jūnzi (君子)": {
        "cp": "Mendemonstrasikan merawat tubuh sebagai awal laku bakti kepada orang tua.",
        "topik": [
          {
            "judul": "Bakti kepada Orang Tua",
            "materi": [
              "Merawat tubuh sebagai bentuk bakti",
              "Menunjukkan hormat kepada orang tua"
            ]
          }
        ]
      }
    }
  },
  "Fase B": {
    "Pendidikan Pancasila": {
      "Pancasila": {
        "cp": "Memahami dan menjelaskan makna sila-sila Pancasila serta menceritakan hubungannya dalam kehidupan sehari-hari.",
        "topik": [
          {
            "judul": "Makna Sila Pancasila",
            "materi": [
              "Arti Sila Pertama dan Kedua",
              "Simbol Sila Pancasila",
              "Hubungan Antar Sila"
            ]
          }
        ]
      },
      "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945": {
        "cp": "Mengidentifikasi aturan di keluarga, sekolah, dan lingkungan sekitar serta melaksanakan aturan tersebut.",
        "topik": [
          {
            "judul": "Aturan di Sekitar Kita",
            "materi": [
              "Aturan Tertulis dan Tidak Tertulis",
              "Melaksanakan Aturan Sekolah",
              "Disiplin di Lingkungan Rumah"
            ]
          }
        ]
      },
      "Bhinneka Tunggal Ika": {
        "cp": "Mengidentifikasi keberagaman suku, bangsa, budaya, sosial, dan agama di lingkungan sekitar.",
        "topik": [
          {
            "judul": "Indahnya Keberagaman",
            "materi": [
              "Keberagaman Budaya Daerah",
              "Saling Menghargai Perbedaan",
              "Agama dan Kepercayaan di Indonesia"
            ]
          }
        ]
      },
      "Negara Kesatuan Republik Indonesia": {
        "cp": "Mengenal bentuk kerja sama dalam menjaga persatuan dan kesatuan bangsa di lingkungan sekitar.",
        "topik": [
          {
            "judul": "Kerja Sama NKRI",
            "materi": [
              "Gotong Royong di Sekolah",
              "Menjaga Persatuan",
              "Sikap Peduli Lingkungan"
            ]
          }
        ]
      }
    },
    "Seni Rupa": {
      "Mengalami": {
        "cp": "Mengamati dan mengenali berbagai unsur rupa (garis, bentuk, warna, tekstur) dalam lingkungan sekitar.",
        "topik": [
          {
            "judul": "Unsur Rupa Alam",
            "materi": [
              "Garis dan Bidang pada Daun",
              "Kombinasi Warna Alami"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Mengapresiasi dan menjelaskan proses pembuatan karya seni rupa milik sendiri dan orang lain.",
        "topik": [
          {
            "judul": "Apresiasi Seni Rupa",
            "materi": [
              "Menjelaskan Karya Sendiri",
              "Memberi Masukan Positif"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Memilih dan menggunakan berbagai alat dan bahan menggambar atau mewarnai secara tepat.",
        "topik": [
          {
            "judul": "Eksplorasi Media Gambar",
            "materi": [
              "Mewarnai dengan Krayon",
              "Teknik Menempel (Kolase)"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Membuat karya seni rupa dua dimensi atau tiga dimensi berdasarkan tema alam atau cerita.",
        "topik": [
          {
            "judul": "Penciptaan Karya Dua Dimensi",
            "materi": [
              "Gambar Pemandangan Alam",
              "Membuat Kolase Kertas"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Mengekspresikan emosi diri secara positif melalui karya seni rupa.",
        "topik": [
          {
            "judul": "Ekspresi Positif",
            "materi": [
              "Perasaan Bangga atas Karya"
            ]
          }
        ]
      }
    },
    "Seni Tari": {
      "Mengalami": {
        "cp": "Mengenali gerak tari bertema hewan, tumbuhan, atau alam sekitar.",
        "topik": [
          {
            "judul": "Eksplorasi Gerak Alam",
            "materi": [
              "Menirukan Gerakan Kupu-Kupu",
              "Menirukan Pohon Tertiup Angin"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Mengamati gerakan tari tradisional daerah setempat dan mendiskusikannya.",
        "topik": [
          {
            "judul": "Apresiasi Tari Tradisional",
            "materi": [
              "Mengenali Kostum Tari Daerah",
              "Menceritakan Makna Tari"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Menirukan gerak berirama secara percaya diri baik secara mandiri maupun berkelompok.",
        "topik": [
          {
            "judul": "Kekompakan Gerak",
            "materi": [
              "Menari Bersama Teman",
              "Percaya Diri Tampil"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Merangkai gerak tari sederhana menggunakan level, arah hadap, dan ruang gerak secara ekspresif.",
        "topik": [
          {
            "judul": "Kombinasi Gerak",
            "materi": [
              "Mengatur Level Atas dan Bawah",
              "Menentukan Arah Hadap"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Menumbuhkan rasa bangga dan antusias terhadap kebudayaan tari tradisional daerah.",
        "topik": [
          {
            "judul": "Cinta Seni Budaya",
            "materi": [
              "Antusiasme Belajar Tari Daerah"
            ]
          }
        ]
      }
    },
    "Seni Musik": {
      "Mengalami": {
        "cp": "Mendengarkan dan mengidentifikasi unsur-unsur musik (melodi, harmoni, tempo) sederhana.",
        "topik": [
          {
            "judul": "Unsur Nada",
            "materi": [
              "Mengenal Nada Tinggi Rendah",
              "Ketukan Tempo Cepat Lambat"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Mengapresiasi pertunjukan musik sederhana dan memberikan umpan balik menggunakan bahasa sederhana.",
        "topik": [
          {
            "judul": "Umpan Balik Positif",
            "materi": [
              "Apresiasi Lagu Anak",
              "Pendapat tentang Suara Musik"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Menyanyikan lagu anak-anak dengan intonasi yang tepat dan menirukan pola irama.",
        "topik": [
          {
            "judul": "Bernyanyi Tepat Nada",
            "materi": [
              "Teknik Vokal Sederhana",
              "Meniru Ketukan Melodi"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Menyusun pola irama sederhana menggunakan alat musik perkusi atau barang bekas.",
        "topik": [
          {
            "judul": "Eksplorasi Ritme",
            "materi": [
              "Bermain Musik dengan Botol Bekas",
              "Membuat Pola Tepuk Tangan"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Merasakan kegembiraan dan kebersamaan saat bernyanyi atau bermain musik bersama teman.",
        "topik": [
          {
            "judul": "Ekspresi Gembira",
            "materi": [
              "Kerjasama Bernyanyi Kelompok"
            ]
          }
        ]
      }
    },
    "Matematika": {
      "Bilangan": {
        "cp": "Peserta didik menunjukkan pemahaman perkalian dan pembagian bilangan cacah sampai 100 menggunakan benda konkret, gambar, dan simbol matematika. Mereka dapat menyelesaikan masalah sehari-hari secara kritis.",
        "topik": [
          {
            "judul": "Konsep Perkalian & Pembagian Mendalam",
            "materi": [
              "Perkalian Cacah Berbasis Konkret",
              "Pembagian sebagai Pengulangan Terstruktur",
              "Kasus Konseptual Pembagian Real Menggunakan Gambar"
            ]
          }
        ]
      },
      "Geometri": {
        "cp": "Peserta didik dapat mendeskripsikan ciri-ciri berbagai bangun datar (segiempat, segitiga, segibanyak) dan bangun ruang (balok, kubus).",
        "topik": [
          {
            "judul": "Ciri Bangun Datar & Ruang",
            "materi": [
              "Mengelompokkan Sisi Segiempat",
              "Mengeksplorasi Jaring-jaring Balok Sekitar",
              "Menghitung Sudut Sederhana"
            ]
          }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Membaca dan Memirsa": {
        "cp": "Peserta didik mampu memahami ide pokok, informasi tersurat dan tersirat dalam teks naratif dan informatif sederhana secara kritis.",
        "topik": [
          {
            "judul": "Ide Pokok & Literasi Kritis",
            "materi": [
              "Menentukan Ide Pokok Paragraf",
              "Menemukan Informasi Tersurat",
              "Menyimpulkan Makna Tersirat di Dongeng"
            ]
          }
        ]
      }
    },
    "IPAS (Ilmu Pengetahuan Alam & Sosial)": {
      "Pemahaman IPAS": {
        "cp": "Peserta didik mengidentifikasi proses fotosintesis pada tumbuhan dan mengaitkannya dengan keselarasan ekosistem di bumi.",
        "topik": [
          {
            "judul": "Proses Fotosintesis & Relevansi Ekologis",
            "materi": [
              "Klorofil & Ketergantungan Cahaya",
              "Siklus Oksigen dalam Ekosistem Kelas",
              "Mengamati Aliran Nutrisi Rantai Makanan"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Islam dan Budi Pekerti": {
      "Al-Qur'an Hadis": {
        "cp": "Membaca, menulis, dan membedakan huruf hijaiah bersambung; menghafal dan menjelaskan beberapa surah pendek, hadis tentang kewajiban salat dan menjaga hubungan baik dengan sesama.",
        "topik": [
          {
            "judul": "Keterampilan Al-Qur'an Hadis",
            "materi": [
              "Membaca huruf hijaiah bersambung",
              "Menulis huruf hijaiah bersambung",
              "Membedakan huruf hijaiah bersambung"
            ]
          },
          {
            "judul": "Memahami Surah Pendek dan Hadis",
            "materi": [
              "Menghafal beberapa surah pendek Al-Qur'an",
              "Menjelaskan beberapa surah pendek Al-Qur'an",
              "Menghafal hadis tentang kewajiban salat",
              "Menjelaskan hadis tentang kewajiban salat",
              "Menghafal hadis tentang menjaga hubungan baik dengan sesama",
              "Menjelaskan hadis tentang menjaga hubungan baik dengan sesama"
            ]
          }
        ]
      },
      "Akidah": {
        "cp": "Menjelaskan dan meyakini sifat-sifat Allah Swt., iman kepada kitab-kitab Allah Swt., beberapa asmaulhusna, dan iman kepada rasul-rasul Allah Swt.",
        "topik": [
          {
            "judul": "Memahami Sifat Allah",
            "materi": [
              "Menjelaskan sifat-sifat Allah Swt.",
              "Meyakini sifat-sifat Allah Swt."
            ]
          },
          {
            "judul": "Iman kepada Kitab dan Rasul",
            "materi": [
              "Meyakini kitab-kitab Allah Swt.",
              "Mengenal beberapa Asmaulhusna",
              "Meyakini rasul-rasul Allah Swt."
            ]
          }
        ]
      },
      "Akhlak": {
        "cp": "Menerapkan akhlak terhadap Allah Swt. dengan berbaik sangka kepada-Nya, akhlak terhadap orang tua, keluarga, dan guru.",
        "topik": [
          {
            "judul": "Akhlak kepada Allah",
            "materi": [
              "Berbaik sangka kepada Allah Swt."
            ]
          },
          {
            "judul": "Akhlak Sosial",
            "materi": [
              "Menerapkan akhlak baik kepada orang tua",
              "Menerapkan akhlak baik kepada keluarga",
              "Menerapkan akhlak baik kepada guru"
            ]
          }
        ]
      },
      "Fikih": {
        "cp": "Menerapkan azan dan ikamah, salat jumat dan salat sunah; menjelaskan balig dan tanggung jawab yang menyertainya (taklif).",
        "topik": [
          {
            "judul": "Praktik Ibadah Lanjutan",
            "materi": [
              "Menerapkan azan",
              "Menerapkan ikamah",
              "Menerapkan salat jumat",
              "Menerapkan salat sunah"
            ]
          },
          {
            "judul": "Konsep Balig",
            "materi": [
              "Menjelaskan balig (dewasa)",
              "Memahami tanggung jawab (taklif) setelah balig"
            ]
          }
        ]
      },
      "Sejarah Peradaban Islam": {
        "cp": "Menceritakan dan menjelaskan kisah Nabi Muhammad saw. sebelum dan sesudah menjadi rasul periode Makkah.",
        "topik": [
          {
            "judul": "Sirah Nabi Muhammad di Makkah",
            "materi": [
              "Menceritakan kisah Nabi Muhammad saw. sebelum menjadi rasul di Makkah",
              "Menjelaskan kisah Nabi Muhammad saw. sesudah menjadi rasul di Makkah"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Kristen dan Budi Pekerti": {
      "Allah Berkarya - Allah Pencipta": {
        "cp": "Murid memahami Allah menciptakan flora dan fauna, serta manusia (perempuan dan laki-laki).",
        "topik": [
          {
            "judul": "Memahami Allah sebagai Pencipta Kehidupan",
            "materi": [
              "Memahami Allah menciptakan flora dan fauna",
              "Memahami Allah menciptakan manusia (perempuan dan laki-laki)"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Pemelihara": {
        "cp": "Murid memahami pemeliharaan Allah pada dirinya dan melalui kehadiran orang-orang di sekitarnya.",
        "topik": [
          {
            "judul": "Pemeliharaan Allah dalam Diri dan Sesama",
            "materi": [
              "Memahami pemeliharaan Allah pada diri",
              "Memahami pemeliharaan Allah melalui kehadiran orang-orang di sekitar"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Penyelamat": {
        "cp": "Murid memahami Allah sebagai penyelamat.",
        "topik": [
          {
            "judul": "Memahami Konsep Penyelamatan",
            "materi": [
              "Memahami Allah sebagai penyelamat"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Pembaru": {
        "cp": "Murid mengenal Allah pembaru.",
        "topik": [
          {
            "judul": "Mengenal Allah sebagai Pembaru",
            "materi": [
              "Mengenal sifat Allah sebagai pembaru"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia": {
        "cp": "Murid memahami diri sebagai makhluk individu dan sosial yang dapat bergaul dan bekerja sama dengan teman, saudara, dan orang tua.",
        "topik": [
          {
            "judul": "Memahami Diri sebagai Individu dan Sosial",
            "materi": [
              "Memahami diri sebagai makhluk individu",
              "Memahami diri sebagai makhluk sosial"
            ]
          },
          {
            "judul": "Keterampilan Bergaul dan Bekerja Sama",
            "materi": [
              "Mampu bergaul dengan teman, saudara, dan orang tua",
              "Mampu bekerja sama dengan teman, saudara, dan orang tua"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani": {
        "cp": "Murid memahami sikap disiplin di rumah dan di sekolah.",
        "topik": [
          {
            "judul": "Menerapkan Disiplin",
            "materi": [
              "Memahami sikap disiplin di rumah",
              "Memahami sikap disiplin di sekolah"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja": {
        "cp": "Murid memahami tugas panggilan gereja untuk bersekutu, bersaksi, dan melayani.",
        "topik": [
          {
            "judul": "Tiga Tugas Panggilan Gereja",
            "materi": [
              "Memahami tugas gereja untuk bersekutu",
              "Memahami tugas gereja untuk bersaksi",
              "Memahami tugas gereja untuk melayani"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk": {
        "cp": "Murid memahami keragaman budaya dan agama sebagai anugerah Allah.",
        "topik": [
          {
            "judul": "Menghargai Keragaman",
            "materi": [
              "Memahami keragaman budaya sebagai anugerah Allah",
              "Memahami keragaman agama sebagai anugerah Allah"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Alam Ciptaan Allah": {
        "cp": "Murid memahami Allah hadir dalam berbagai fenomena alam.",
        "topik": [
          {
            "judul": "Kehadiran Allah dalam Alam",
            "materi": [
              "Memahami Allah hadir dalam fenomena alam"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam": {
        "cp": "Murid memahami upaya memelihara alam dan lingkungan sekitarnya.",
        "topik": [
          {
            "judul": "Tanggung Jawab Lingkungan",
            "materi": [
              "Memahami upaya memelihara alam sekitar",
              "Memahami upaya memelihara lingkungan sekitar"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Katolik dan Budi Pekerti": {
      "Pribadi murid": {
        "cp": "Murid memahami dirinya sebagai pribadi yang tumbuh dan berkembang, mewujudkan iman dengan cara melakukan perbuatan baik; memahami diri sebagai pribadi yang unik, bersyukur dan bersedia mengembangkan keunikan diri bersama orang lain dan lingkungan sekitar.",
        "topik": [
          {
            "judul": "Pertumbuhan Diri dan Iman",
            "materi": [
              "Memahami diri sebagai pribadi yang tumbuh dan berkembang",
              "Mewujudkan iman melalui perbuatan baik"
            ]
          },
          {
            "judul": "Keunikan dan Perkembangan Diri",
            "materi": [
              "Memahami diri sebagai pribadi yang unik",
              "Bersyukur atas keunikan diri",
              "Mengembangkan keunikan diri bersama orang lain",
              "Mengembangkan keunikan diri di lingkungan sekitar"
            ]
          }
        ]
      },
      "Yesus Kristus": {
        "cp": "Murid memahami karya keselamatan Allah melalui tokoh-tokoh Yusuf, Musa, dan Yosua; memahami Sepuluh Perintah Allah sebagai pedoman hidup; memahami bangsa Israel memasuki tanah terjanji, Allah memberkati pemimpin Israel (Samuel, Saul, dan Daud); memahami Yesus sebagai pemenuhan janji Allah yang mewartakan Kerajaan Allah melalui perkataan, perbuatan, dan mukjizat.",
        "topik": [
          {
            "judul": "Karya Keselamatan Allah di Perjanjian Lama",
            "materi": [
              "Memahami kisah Yusuf",
              "Memahami kisah Musa",
              "Memahami kisah Yosua",
              "Memahami Sepuluh Perintah Allah sebagai pedoman hidup",
              "Memahami bangsa Israel memasuki tanah terjanji",
              "Memahami berkat Allah kepada pemimpin Israel (Samuel, Saul, Daud)"
            ]
          },
          {
            "judul": "Yesus Mewartakan Kerajaan Allah",
            "materi": [
              "Memahami Yesus sebagai pemenuhan janji Allah",
              "Memahami Yesus mewartakan Kerajaan Allah melalui perkataan",
              "Memahami Yesus mewartakan Kerajaan Allah melalui perbuatan",
              "Memahami Yesus mewartakan Kerajaan Allah melalui mukjizat"
            ]
          }
        ]
      },
      "Gereja": {
        "cp": "Murid memahami Sakramen Baptis, Sakramen Ekaristi, dan Sakramen Tobat; mengungkapkan rasa syukur dalam doa pribadi dan doa bersama, mewujudkan makna doa melalui sikap dan tindakan dalam kehidupan sehari-hari.",
        "topik": [
          {
            "judul": "Mengenal Sakramen Gereja",
            "materi": [
              "Memahami Sakramen Baptis",
              "Memahami Sakramen Ekaristi",
              "Memahami Sakramen Tobat"
            ]
          },
          {
            "judul": "Doa dan Ucapan Syukur",
            "materi": [
              "Mengungkapkan rasa syukur dalam doa pribadi",
              "Mengungkapkan rasa syukur dalam doa bersama",
              "Mewujudkan makna doa melalui sikap sehari-hari",
              "Mewujudkan makna doa melalui tindakan sehari-hari"
            ]
          }
        ]
      },
      "Masyarakat": {
        "cp": "Murid mewujudkan imannya di tengah masyarakat melalui kebiasaan menghormati pemimpin masyarakat, menghargai tradisi masyarakat, melestarikan lingkungan alam; mewujudkan rasa hormat terhadap orang tua, menghormati hidup pribadi, menghormati milik orang lain.",
        "topik": [
          {
            "judul": "Iman dan Tanggung Jawab Sosial",
            "materi": [
              "Menghormati pemimpin masyarakat",
              "Menghargai tradisi masyarakat",
              "Melestarikan lingkungan alam"
            ]
          },
          {
            "judul": "Sikap Hormat dan Menghargai",
            "materi": [
              "Menghormati orang tua",
              "Menghormati hidup pribadi orang lain",
              "Menghormati milik orang lain"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Hindu dan Budi Pekerti": {
      "Kitab Suci Weda": {
        "cp": "Mengenali Kitab Purāņa",
        "topik": [
          {
            "judul": "Mengenal Kitab Purāņa",
            "materi": [
              "Mengenali Kitab Purāņa"
            ]
          }
        ]
      },
      "Śraddhā dan Bhakti": {
        "cp": "Memahami Hyang Widhi Wasa sebagai Tri Murti dan Cadu Sakti.",
        "topik": [
          {
            "judul": "Konsep Ketuhanan Hindu",
            "materi": [
              "Memahami Hyang Widhi Wasa sebagai Tri Murti",
              "Memahami Hyang Widhi Wasa sebagai Cadu Sakti"
            ]
          }
        ]
      },
      "Susila": {
        "cp": "Menerapkan Ajaran Tri Parartha dan Catur Paramitha.",
        "topik": [
          {
            "judul": "Ajaran Moral Hindu",
            "materi": [
              "Menerapkan Tri Parartha (tiga perbuatan mulia)",
              "Menerapkan Catur Paramitha (empat kebaikan)"
            ]
          }
        ]
      },
      "Acara": {
        "cp": "Mengenali Hari Suci dan Tempat Suci Agama Hindu sesuai kearifan lokal.",
        "topik": [
          {
            "judul": "Hari Suci dan Tempat Ibadah",
            "materi": [
              "Mengenali hari suci agama Hindu",
              "Mengenali tempat suci agama Hindu sesuai kearifan lokal"
            ]
          }
        ]
      },
      "Sejarah Agama Hindu": {
        "cp": "Mengenali Tokoh Penyebar Agama Hindu di Indonesia.",
        "topik": [
          {
            "judul": "Tokoh Penyebar Hindu",
            "materi": [
              "Mengenali tokoh penyebar agama Hindu di Indonesia"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Buddha dan Budi Pekerti": {
      "Sejarah": {
        "cp": "Mengenali identitas Buddha Sakyamuni sebagai dasar keyakinan. Mengenali bahasa dalam agama Buddha. Meniru cara Buddha Sakyamuni dalam menghargai dan menyelesaikan masalah pergaulan di lingkungan terdekatnya, lingkungan sekolah dan rumah ibadah.",
        "topik": [
          {
            "judul": "Identitas dan Ajaran Buddha Sakyamuni",
            "materi": [
              "Mengenali identitas Buddha Sakyamuni sebagai dasar keyakinan",
              "Mengenali bahasa dalam agama Buddha"
            ]
          },
          {
            "judul": "Teladan Buddha Sakyamuni dalam Pergaulan",
            "materi": [
              "Meniru cara Buddha Sakyamuni menghargai sesama",
              "Meniru cara Buddha Sakyamuni menyelesaikan masalah pergaulan di lingkungan terdekat",
              "Meniru cara Buddha Sakyamuni menyelesaikan masalah pergaulan di lingkungan sekolah",
              "Meniru cara Buddha Sakyamuni menyelesaikan masalah pergaulan di rumah ibadah"
            ]
          }
        ]
      },
      "Ritual": {
        "cp": "Menirukan doa-doa Buddhis dalam kegiatan sehari-hari dan mengenali aliran atau tradisi dalam agama Buddha untuk menerapkan sikap bersatu dalam perbedaan di komunitas yang beragam.",
        "topik": [
          {
            "judul": "Praktik Doa Buddhis",
            "materi": [
              "Menirukan doa-doa Buddhis dalam kegiatan sehari-hari"
            ]
          },
          {
            "judul": "Keragaman dalam Buddha Dharma",
            "materi": [
              "Mengenali aliran atau tradisi dalam agama Buddha",
              "Menerapkan sikap bersatu dalam perbedaan di komunitas yang beragam"
            ]
          }
        ]
      },
      "Etika": {
        "cp": "Meniru penerapan aturan dan sopan santun berlandaskan pada nilai-nilai Pancasila Buddhis. Meniru penerapan sikap tolong menolong dalam menyelesaikan masalah sosial, kebersihan dan kelestarian lingkungan di rumah, sekolah, dan rumah ibadah sebagai manifestasi keyakinan terhadap Agama Buddha.",
        "topik": [
          {
            "judul": "Etika Berlandaskan Pancasila Buddhis",
            "materi": [
              "Meniru penerapan aturan dan sopan santun",
              "Menerapkan nilai-nilai Pancasila Buddhis"
            ]
          },
          {
            "judul": "Sikap Tolong Menolong dan Lingkungan",
            "materi": [
              "Meniru sikap tolong menolong dalam menyelesaikan masalah sosial",
              "Meniru sikap tolong menolong dalam kebersihan lingkungan",
              "Meniru sikap tolong menolong dalam kelestarian lingkungan di rumah, sekolah, dan rumah ibadah"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Khonghucu dan Budi Pekerti": {
      "Sejarah Suci": {
        "cp": "Menjelaskan tentang watak sejati (xìng 性) menurut pendapat Mèngzi (孟子), Zhū Xī (朱熹) sebagai tokoh pembaharuan agama Khonghucu (Rújiào 儒教), keteladanan ibunda Nabi Kōngzi (孔子), ibunda Mèngzi (孟子), ibunda Õuyáng Xiū (欧阳修), dan ibunda Yuè Fēi (岳飛); menginterpretasikan sikap teladan dari murid-murid Nabi Kōngzi (孔子), riwayat Nabi Kōngzi (孔子) sebagai Genta Rohani Tiān (天) (Tiān Zhī Mùduó 天之木铎),",
        "topik": [
          {
            "judul": "Watak Sejati dan Tokoh Pembaharuan",
            "materi": [
              "Menjelaskan watak sejati (xìng 性) menurut Mèngzi",
              "Menjelaskan watak sejati (xìng 性) menurut Zhū Xī",
              "Mengenal Zhū Xī sebagai tokoh pembaharuan agama Khonghucu"
            ]
          },
          {
            "judul": "Teladan Ibunda Para Tokoh",
            "materi": [
              "Mengenal keteladanan ibunda Nabi Kōngzi",
              "Mengenal keteladanan ibunda Mèngzi",
              "Mengenal keteladanan ibunda Õuyáng Xiū",
              "Mengenal keteladanan ibunda Yuè Fēi"
            ]
          },
          {
            "judul": "Teladan Murid dan Riwayat Nabi Kōngzi",
            "materi": [
              "Menginterpretasikan sikap teladan murid-murid Nabi Kōngzi",
              "Menginterpretasikan riwayat Nabi Kōngzi sebagai Genta Rohani Tiān (天)"
            ]
          }
        ]
      },
      "Kitab Suci": {
        "cp": "Menjelaskan bagian-bagian kitab suci yang pokok (Sìshū 四书) dan yang mendasari (Wŭjīng 五经), ayat dalam kitab Sìshū (四书) yang berkaitan dengan delapan kebajikan (bādé 八德); menginterpretasikan tiga kesukaan yang membawa faedah dan tiga kesukaan yang membawa celaka.",
        "topik": [
          {
            "judul": "Struktur Kitab Suci",
            "materi": [
              "Menjelaskan bagian pokok kitab Sìshū (Empat Kitab)",
              "Menjelaskan bagian mendasari kitab Wŭjīng (Lima Klasik)"
            ]
          },
          {
            "judul": "Delapan Kebajikan (Bādé)",
            "materi": [
              "Menjelaskan ayat Sìshū yang berkaitan dengan delapan kebajikan (bādé 八德)"
            ]
          },
          {
            "judul": "Tiga Kesukaan",
            "materi": [
              "Menginterpretasikan tiga kesukaan yang membawa faedah",
              "Menginterpretasikan tiga kesukaan yang membawa celaka"
            ]
          }
        ]
      },
      "Keimanan": {
        "cp": "Menjelaskan makna persembahyangan kepada Tiān (天), Nabi Kōngzi (孔子), para suci (shénmíng 神明) dan leluhur, tanda-tanda khusus menjelang wafat Nabi Kōngzi (孔子); menginterpretasikan cita-cita mulia dan semangat belajar Nabi Kōngzi (孔子); menerapkan nilai-nilai delapan keimanan (bāchéngzhēnguī 八诚箴规).",
        "topik": [
          {
            "judul": "Makna Persembahyangan",
            "materi": [
              "Menjelaskan makna persembahyangan kepada Tiān (天)",
              "Menjelaskan makna persembahyangan kepada Nabi Kōngzi (孔子)",
              "Menjelaskan makna persembahyangan kepada para suci (shénmíng 神明)",
              "Menjelaskan makna persembahyangan kepada leluhur"
            ]
          },
          {
            "judul": "Cita-cita dan Semangat Nabi Kōngzi",
            "materi": [
              "Menjelaskan tanda-tanda khusus menjelang wafat Nabi Kōngzi",
              "Menginterpretasikan cita-cita mulia Nabi Kōngzi",
              "Menginterpretasikan semangat belajar Nabi Kōngzi"
            ]
          },
          {
            "judul": "Penerapan Delapan Keimanan",
            "materi": [
              "Menerapkan nilai-nilai delapan keimanan (bāchéngzhēnguī 八诚箴规)"
            ]
          }
        ]
      },
      "Tata Ibadah": {
        "cp": "Menjelaskan peralatan dan perlengkapan sembahyang, penataan altar leluhur; menerapkan sikap berdoa (bào xīn bādé 抱心八德), tata cara pelaksanaan ibadah kepada Tiān (天), Nabi Kōngzi (孔子), para suci (shénmíng 神明) dan leluhur di kelenteng/klenteng/bio/miào (庙) dan lītáng (礼堂).",
        "topik": [
          {
            "judul": "Peralatan dan Penataan Ibadah",
            "materi": [
              "Menjelaskan peralatan sembahyang",
              "Menjelaskan perlengkapan sembahyang",
              "Menata altar leluhur"
            ]
          },
          {
            "judul": "Tata Cara Ibadah dan Lokasi",
            "materi": [
              "Menerapkan sikap berdoa (bào xīn bādé)",
              "Menerapkan tata cara ibadah kepada Tiān (天)",
              "Menerapkan tata cara ibadah kepada Nabi Kōngzi (孔子)",
              "Menerapkan tata cara ibadah kepada para suci (shénmíng 神明)",
              "Menerapkan tata cara ibadah kepada leluhur di kelenteng/klenteng/bio/miào (庙) dan lītáng (礼堂)"
            ]
          }
        ]
      },
      "Perilaku Jūnzi (君子)": {
        "cp": "Menerapkan sikap dan perilaku luhur Nabi Kōngzi (孔子), teladan murid-murid Nabi Kōngzi (孔子), menghargai waktu, berhati-hati, saling mengasihi sesama manusia, perilaku sesuai dengan delapan kebajikan (bādé八德), mudah bergaul tanpa membeda-bedakan, berani mengakui kesalahan dan memperbaiki diri.",
        "topik": [
          {
            "judul": "Teladan Perilaku Luhur",
            "materi": [
              "Menerapkan sikap luhur Nabi Kōngzi",
              "Menerapkan perilaku luhur Nabi Kōngzi",
              "Menerapkan teladan murid-murid Nabi Kōngzi"
            ]
          },
          {
            "judul": "Nilai-nilai Sosial dan Etika",
            "materi": [
              "Menghargai waktu",
              "Berhati-hati",
              "Saling mengasihi sesama manusia",
              "Berperilaku sesuai delapan kebajikan (bādé 八德)",
              "Mudah bergaul tanpa membeda-bedakan",
              "Berani mengakui kesalahan",
              "Berani memperbaiki diri"
            ]
          }
        ]
      }
    }
  },
  "Fase C": {
    "Pendidikan Pancasila": {
      "Pancasila": {
        "cp": "Menganalisis perumusan Pancasila dan meneladani karakter para tokoh perumus Pancasila dalam kehidupan sehari-hari.",
        "topik": [
          {
            "judul": "Sejarah Perumusan Pancasila",
            "materi": [
              "BPUPKI dan PPKI",
              "Karakter Tokoh Bangsa",
              "Nilai Perjuangan Perumus Pancasila"
            ]
          }
        ]
      },
      "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945": {
        "cp": "Menganalisis norma, hak, dan kewajiban sebagai anggota keluarga, warga sekolah, dan warga masyarakat.",
        "topik": [
          {
            "judul": "Norma dan Hak Kewajiban",
            "materi": [
              "Norma Kesusilaan dan Kesopanan",
              "Hak Anak di Sekolah dan Rumah",
              "Kewajiban Sosial Warga Negara"
            ]
          }
        ]
      },
      "Bhinneka Tunggal Ika": {
        "cp": "Menganalisis cara menghargai keberagaman budaya, adat istiadat, dan agama dalam bingkai Bhinneka Tunggal Ika.",
        "topik": [
          {
            "judul": "Harmoni Keberagaman",
            "materi": [
              "Melestarikan Adat Istiadat",
              "Toleransi Antar Umat Beragama",
              "Sikap Inklusif di Sekolah"
            ]
          }
        ]
      },
      "Negara Kesatuan Republik Indonesia": {
        "cp": "Menganalisis peran wilayah NKRI dan pentingnya persatuan kesatuan dalam mempertahankan keutuhan wilayah.",
        "topik": [
          {
            "judul": "Keutuhan NKRI",
            "materi": [
              "Pentingnya Persatuan Kesatuan",
              "Peran Wilayah Perbatasan",
              "Bela Negara dalam Keseharian"
            ]
          }
        ]
      }
    },
    "Seni Rupa": {
      "Mengalami": {
        "cp": "Menganalisis unsur rupa dan prinsip desain (keseimbangan, proporsi) pada karya seni rupa.",
        "topik": [
          {
            "judul": "Analisis Prinsip Desain",
            "materi": [
              "Proporsi dalam Menggambar Wajah",
              "Keseimbangan Simetris dan Asimetris"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Merefleksikan makna budaya atau pesan sosial dalam karya seni rupa daerah.",
        "topik": [
          {
            "judul": "Apresiasi Seni Daerah",
            "materi": [
              "Makna Batik Nusantara",
              "Pesan Sosial Lukisan Tema Gotong Royong"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Membuat desain sketsa dan memadukan teknik menggambar dengan cat atau media campuran secara mandiri.",
        "topik": [
          {
            "judul": "Teknik Seni Rupa",
            "materi": [
              "Menggambar Perspektif",
              "Membuat Lukisan Cat Air"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Membuat karya seni rupa (lukisan, kriya) yang mengekspresikan kepedulian terhadap lingkungan sosial.",
        "topik": [
          {
            "judul": "Karya Seni Peduli Lingkungan",
            "materi": [
              "Kriya dari Plastik Daur Ulang",
              "Poster Kampanye Lingkungan"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Menghasilkan karya seni rupa yang memberikan inspirasi positif bagi lingkungan sekolah.",
        "topik": [
          {
            "judul": "Karya Inspiratif",
            "materi": [
              "Pameran Karya Kelas",
              "Menghias Sudut Kelas"
            ]
          }
        ]
      }
    },
    "Seni Tari": {
      "Mengalami": {
        "cp": "Menganalisis elemen-elemen keindahan gerak tari daerah nusantara beserta propertinya.",
        "topik": [
          {
            "judul": "Analisis Tari Nusantara",
            "materi": [
              "Mengenali Properti Kipas dan Piring",
              "Harmoni Riasan dan Busana"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Mengapresiasi pertunjukan tari tradisional nusantara dan memahami pesan moral di dalamnya.",
        "topik": [
          {
            "judul": "Apresiasi Pesan Tari",
            "materi": [
              "Pesan Moral Tari Tradisional",
              "Menulis Resensi Pertunjukan Tari"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Memperagakan gerak tari kreasi baru nusantara dengan kelenturan dan keselarasan tempo musik pengiring.",
        "topik": [
          {
            "judul": "Praktik Penampilan Tari",
            "materi": [
              "Kelenturan Tubuh",
              "Keselarasan Ketukan Musik"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Menyusun koreografi tari kelompok sederhana berdasarkan ragam gerak tari nusantara secara kreatif.",
        "topik": [
          {
            "judul": "Koreografi Kelompok",
            "materi": [
              "Menyusun Pola Lantai Kreatif",
              "Merangkai Ragam Gerak Nusantara"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Mencintai dan melestarikan budaya tari tradisional nusantara melalui unjuk kerja penampilan seni.",
        "topik": [
          {
            "judul": "Melestarikan Seni",
            "materi": [
              "Percaya Diri Tampil di Panggung Sekolah"
            ]
          }
        ]
      }
    },
    "Seni Musik": {
      "Mengalami": {
        "cp": "Mengidentifikasi genre musik daerah dan lagu wajib nasional secara kritis.",
        "topik": [
          {
            "judul": "Apresiasi Genre Musik",
            "materi": [
              "Mengenal Musik Keroncong/Gamelan",
              "Makna Lagu Wajib Nasional"
            ]
          }
        ]
      },
      "Merefleksikan": {
        "cp": "Mengapresiasi pertunjukan musik dengan menganalisis keselarasan vokal dan instrumen.",
        "topik": [
          {
            "judul": "Analisis Harmoni",
            "materi": [
              "Keseimbangan Suara Paduan Suara",
              "Kesesuaian Pengiring Musik"
            ]
          }
        ]
      },
      "Berpikir dan Bekerja Artistik": {
        "cp": "Membaca notasi angka atau notasi balok sederhana dan memainkan instrumen musik pengiring.",
        "topik": [
          {
            "judul": "Membaca Notasi",
            "materi": [
              "Membaca Notasi Angka Sederhana",
              "Memainkan Rekorder/Pianika"
            ]
          }
        ]
      },
      "Menciptakan": {
        "cp": "Menciptakan komposisi musik lagu anak-anak dengan lirik bertema persahabatan atau sekolah.",
        "topik": [
          {
            "judul": "Cipta Lagu Sederhana",
            "materi": [
              "Membuat Lirik Persahabatan",
              "Menyusun Melodi Pengiring"
            ]
          }
        ]
      },
      "Berdampak": {
        "cp": "Menunjukkan sikap toleransi dan kerja sama dalam ansambel musik kelas.",
        "topik": [
          {
            "judul": "Toleransi Bermusik",
            "materi": [
              "Kekompakan Kelompok Musik Ansambel"
            ]
          }
        ]
      }
    },
    "Matematika": {
      "Bilangan": {
        "cp": "Peserta didik mampu memahami konsep desimal, persen, dan pecahan campuran serta melakukan operasi hitung penjumlahan dan pengurangan pecahan.",
        "topik": [
          {
            "judul": "Pecahan Campuran & Desimal Kreatif",
            "materi": [
              "Penjumlahan Pecahan Beda Penyebut",
              "Konversi Desimal ke Persen Praktikal",
              "Aplikasi Uang dan Persen Diskon Toko"
            ]
          }
        ]
      }
    },
    "Bahasa Indonesia": {
      "Berbicara dan Mempresentasikan": {
        "cp": "Peserta didik mampu menyajikan hasil analisis ide pokok dan mempresentasikan gagasan orisinal secara lisan dengan santun dan runtut.",
        "topik": [
          {
            "judul": "Menganalisis Ide Pokok & Literasi Kritis",
            "materi": [
              "Presentasi Hasil Riset Mandiri",
              "Gagasan Orisinal Pidato Persuasif",
              "Tata Cara Debat Santun Terstruktur"
            ]
          }
        ]
      }
    },
    "IPAS (Ilmu Pengetahuan Alam & Sosial)": {
      "Pemahaman IPAS": {
        "cp": "Peserta didik mendeskripsikan transfer energi dalam ekosistem dan mengaitkannya dengan konservasi lingkungan hidup.",
        "topik": [
          {
            "judul": "Rantai Makanan & Konservasi Alam",
            "materi": [
              "Siklus Penyerapan Karbon Hutan",
              "Dampak Polusi pada Jaring Makanan",
              "Rencana Aksi Hemat Energi Rumah Tangga"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Islam dan Budi Pekerti": {
      "Al-Qur'an Hadis": {
        "cp": "Membaca, menulis, dan membedakan huruf hijaiah bersambung; menjelaskan beberapa surah pendek dan hadis tentang berbuat baik kepada orang tua, guru, dan teman.",
        "topik": [
          {
            "judul": "Keterampilan Al-Qur'an Hadis Lanjutan",
            "materi": [
              "Membaca huruf hijaiah bersambung dengan lancar",
              "Menulis huruf hijaiah bersambung dengan benar",
              "Membedakan huruf hijaiah bersambung dengan teliti"
            ]
          },
          {
            "judul": "Memahami Ajaran Kebaikan",
            "materi": [
              "Menjelaskan surah pendek tentang berbuat baik kepada orang tua",
              "Menjelaskan hadis tentang berbuat baik kepada orang tua",
              "Menjelaskan surah pendek tentang berbuat baik kepada guru",
              "Menjelaskan hadis tentang berbuat baik kepada guru",
              "Menjelaskan surah pendek tentang berbuat baik kepada teman",
              "Menjelaskan hadis tentang berbuat baik kepada teman"
            ]
          }
        ]
      },
      "Akidah": {
        "cp": "Menjelaskan dan meyakini beberapa asmaulhusna, iman kepada hari akhir, iman kepada qada' dan qadar.",
        "topik": [
          {
            "judul": "Memahami Asmaulhusna",
            "materi": [
              "Menjelaskan beberapa Asmaulhusna",
              "Meyakini beberapa Asmaulhusna"
            ]
          },
          {
            "judul": "Iman kepada Hari Akhir",
            "materi": [
              "Menjelaskan hari akhir",
              "Meyakini hari akhir"
            ]
          },
          {
            "judul": "Iman kepada Qada' dan Qadar",
            "materi": [
              "Menjelaskan qada' dan qadar",
              "Meyakini qada' dan qadar"
            ]
          }
        ]
      },
      "Akhlak": {
        "cp": "Menerapkan akhlak terhadap Allah Swt. dengan berdoa dan bertawakal kepada-Nya, akhlak terhadap teman, tetangga, non-muslim, hewan, dan tumbuhan.",
        "topik": [
          {
            "judul": "Akhlak kepada Allah",
            "materi": [
              "Berdoa kepada Allah Swt.",
              "Bertawakal kepada Allah Swt."
            ]
          },
          {
            "judul": "Akhlak Sosial dan Lingkungan",
            "materi": [
              "Menerapkan akhlak baik kepada teman",
              "Menerapkan akhlak baik kepada tetangga",
              "Menerapkan akhlak baik kepada non-muslim",
              "Menerapkan akhlak baik kepada hewan",
              "Menerapkan akhlak baik kepada tumbuhan"
            ]
          }
        ]
      },
      "Fikih": {
        "cp": "Menerapkan puasa wajib dan sunah, makanan minuman yang halal dan haram, zakat, infak, sedekah, dan wakaf.",
        "topik": [
          {
            "judul": "Praktik Ibadah Puasa",
            "materi": [
              "Menerapkan puasa wajib",
              "Menerapkan puasa sunah"
            ]
          },
          {
            "judul": "Hukum Halal Haram",
            "materi": [
              "Memahami makanan halal dan haram",
              "Memahami minuman halal dan haram"
            ]
          },
          {
            "judul": "Sedekah dan Amal",
            "materi": [
              "Menerapkan zakat",
              "Menerapkan infak",
              "Menerapkan sedekah",
              "Menerapkan wakaf"
            ]
          }
        ]
      },
      "Sejarah Peradaban Islam": {
        "cp": "Menceritakan dan menjelaskan kisah Nabi Muhammad saw. periode Madinah dan khulafaurasyidin.",
        "topik": [
          {
            "judul": "Sirah Nabi Muhammad di Madinah",
            "materi": [
              "Menceritakan kisah Nabi Muhammad saw. periode Madinah",
              "Menjelaskan kisah Nabi Muhammad saw. periode Madinah"
            ]
          },
          {
            "judul": "Sejarah Khulafaur Rasyidin",
            "materi": [
              "Menceritakan kisah Khulafaur Rasyidin",
              "Menjelaskan kisah Khulafaur Rasyidin"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Kristen dan Budi Pekerti": {
      "Allah Berkarya - Allah Pencipta": {
        "cp": "Murid memahami Allah Pencipta berkarya melalui keluarga, sekolah, dan masyarakat.",
        "topik": [
          {
            "judul": "Karya Allah dalam Kehidupan",
            "materi": [
              "Memahami karya Allah Pencipta melalui keluarga",
              "Memahami karya Allah Pencipta melalui sekolah",
              "Memahami karya Allah Pencipta melalui masyarakat"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Pemelihara": {
        "cp": "Murid memahami Allah memelihara seluruh umat manusia termasuk mereka yang berkebutuhan khusus.",
        "topik": [
          {
            "judul": "Pemeliharaan Allah untuk Semua",
            "materi": [
              "Memahami pemeliharaan Allah untuk seluruh umat manusia",
              "Memahami pemeliharaan Allah untuk mereka yang berkebutuhan khusus"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Penyelamat": {
        "cp": "Murid memahami Allah menyelamatkan manusia melalui Yesus Kristus.",
        "topik": [
          {
            "judul": "Penyelamatan melalui Yesus Kristus",
            "materi": [
              "Memahami Allah menyelamatkan manusia melalui Yesus Kristus"
            ]
          }
        ]
      },
      "Allah Berkarya - Allah Pembaru": {
        "cp": "Murid memahami Allah membarui hidup Manusia.",
        "topik": [
          {
            "judul": "Pembaharuan Hidup oleh Allah",
            "materi": [
              "Memahami Allah membarui hidup manusia"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Hakikat Manusia": {
        "cp": "Murid memahami bahwa manusia adalah makhluk terbatas.",
        "topik": [
          {
            "judul": "Memahami Keterbatasan Manusia",
            "materi": [
              "Memahami manusia sebagai makhluk terbatas"
            ]
          }
        ]
      },
      "Manusia dan Nilai-nilai Kristiani - Nilai-nilai Kristiani": {
        "cp": "Murid memahami buah Roh dalam interaksi antar sesama.",
        "topik": [
          {
            "judul": "Buah Roh dalam Interaksi Sosial",
            "materi": [
              "Memahami buah Roh dalam interaksi antar sesama"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Tugas Panggilan Gereja": {
        "cp": "Murid memahami pelayanan terhadap sesama sebagai tanggung jawab orang beriman dalam kehidupan.",
        "topik": [
          {
            "judul": "Tanggung Jawab Pelayanan Gereja",
            "materi": [
              "Memahami pelayanan terhadap sesama sebagai tanggung jawab orang beriman"
            ]
          }
        ]
      },
      "Gereja dan Masyarakat Majemuk - Masyarakat Majemuk": {
        "cp": "Murid memahami hidup rukun dan toleransi dalam masyarakat majemuk.",
        "topik": [
          {
            "judul": "Hidup Rukun dan Toleransi",
            "materi": [
              "Memahami hidup rukun dalam masyarakat majemuk",
              "Memahami toleransi dalam masyarakat majemuk"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Alam Ciptaan Allah": {
        "cp": "Murid memahami Allah hadir melalui alam ciptaan.",
        "topik": [
          {
            "judul": "Kehadiran Allah dalam Alam",
            "materi": [
              "Memahami Allah hadir melalui alam ciptaan"
            ]
          }
        ]
      },
      "Alam dan Lingkungan Hidup - Tanggung Jawab Manusia Terhadap Alam": {
        "cp": "Murid memahami tanggung jawab orang beriman dalam memelihara alam dan lingkungan hidup.",
        "topik": [
          {
            "judul": "Tanggung Jawab Pemeliharaan Alam",
            "materi": [
              "Memahami tanggung jawab orang beriman dalam memelihara alam",
              "Memahami tanggung jawab orang beriman dalam memelihara lingkungan hidup"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Katolik dan Budi Pekerti": {
      "Pribadi murid": {
        "cp": "Murid memahami diri sebagai perempuan atau laki-laki sebagai citra Allah yang sederajat dan saling melengkapi; memahami hak dan kewajiban dirinya sebagai warga negara dan bangga sebagai bangsa Indonesia; memahami diri sebagai warga dunia.",
        "topik": [
          {
            "judul": "Diri sebagai Citra Allah",
            "materi": [
              "Memahami diri sebagai perempuan atau laki-laki sebagai citra Allah",
              "Memahami kesederajatan dan saling melengkapi"
            ]
          },
          {
            "judul": "Hak dan Kewajiban Warga Negara",
            "materi": [
              "Memahami hak dan kewajiban sebagai warga negara",
              "Bangga sebagai bangsa Indonesia"
            ]
          },
          {
            "judul": "Warga Dunia",
            "materi": [
              "Memahami diri sebagai warga dunia"
            ]
          }
        ]
      },
      "Yesus Kristus": {
        "cp": "Murid memahami perjuangan tokoh-tokoh Kitab Suci: Daud sebagai pemimpin yang tangguh; Salomo yang bijaksana, dan Ester perempuan pemberani, serta tokoh Maria dan Elisabet yang setia dan berserah kepada Allah; meneladani Yesus yang taat kepada Allah; mengajarkan pengampunan, memanggil orang berdosa; menderita, wafat, dan bangkit; mengutus Roh Kudus untuk menguatkan para rasul, dan orang yang beriman kepada-Nya; memahami perjuangan Nabi Elia yang menobatkan bangsa Israel; Nabi Amos sebagai pejuang keadilan; dan Nabi Yesaya yang me-nubuat-kan kedatangan Juru Selamat; memahami Yesus yang mewartakan kerajaan Allah dengan perkataan dan perbuatan.",
        "topik": [
          {
            "judul": "Tokoh Teladan Kitab Suci",
            "materi": [
              "Memahami Daud sebagai pemimpin tangguh",
              "Memahami Salomo yang bijaksana",
              "Memahami Ester perempuan pemberani",
              "Memahami Maria yang setia dan berserah kepada Allah",
              "Memahami Elisabet yang setia dan berserah kepada Allah"
            ]
          },
          {
            "judul": "Ketaatan dan Pelayanan Yesus",
            "materi": [
              "Meneladani Yesus yang taat kepada Allah",
              "Yesus mengajarkan pengampunan",
              "Yesus memanggil orang berdosa"
            ]
          },
          {
            "judul": "Paskah dan Peran Roh Kudus",
            "materi": [
              "Yesus menderita, wafat, dan bangkit",
              "Yesus mengutus Roh Kudus untuk menguatkan para rasul",
              "Yesus mengutus Roh Kudus untuk menguatkan orang beriman kepada-Nya"
            ]
          },
          {
            "judul": "Nabi-nabi Pejuang Keadilan dan Pewartaan",
            "materi": [
              "Memahami perjuangan Nabi Elia menobatkan bangsa Israel",
              "Memahami Nabi Amos sebagai pejuang keadilan",
              "Memahami Nabi Yesaya menubuatkan kedatangan Juru Selamat",
              "Memahami Yesus mewartakan kerajaan Allah dengan perkataan dan perbuatan"
            ]
          }
        ]
      },
      "Gereja": {
        "cp": "Murid mewujudkan iman dalam kehidupan sehari-hari, melibatkan diri dalam kehidupan menggereja, sebagai wujud kehidupan bersama yang dijiwai oleh Roh Kudus; memahami gereja yang satu, kudus, katolik, dan apostolik; persekutuan para kudus; pengampunan dosa, kebangkitan badan dan kehidupan kekal.",
        "topik": [
          {
            "judul": "Iman dalam Kehidupan Menggereja",
            "materi": [
              "Mewujudkan iman dalam kehidupan sehari-hari",
              "Melibatkan diri dalam kehidupan menggereja",
              "Hidup bersama yang dijiwai Roh Kudus"
            ]
          },
          {
            "judul": "Sifat dan Kepercayaan Gereja",
            "materi": [
              "Memahami gereja yang satu, kudus, katolik, dan apostolik",
              "Memahami persekutuan para kudus",
              "Memahami pengampunan dosa",
              "Memahami kebangkitan badan",
              "Memahami kehidupan kekal"
            ]
          }
        ]
      },
      "Masyarakat": {
        "cp": "Murid memahami pentingnya terlibat aktif dalam pelestarian lingkungan, bersikap jujur, bertindak menurut hati nurani, menegakkan keadilan dalam hidup sehari-hari sebagai orang beriman Kristiani, melakukan dialog antarumat beragama.",
        "topik": [
          {
            "judul": "Tanggung Jawab Lingkungan dan Moral",
            "materi": [
              "Terlibat aktif dalam pelestarian lingkungan",
              "Bersikap jujur",
              "Bertindak menurut hati nurani",
              "Menegakkan keadilan dalam hidup sehari-hari sebagai orang beriman Kristiani"
            ]
          },
          {
            "judul": "Dialog Antarumat Beragama",
            "materi": [
              "Melakukan dialog antarumat beragama"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Hindu dan Budi Pekerti": {
      "Kitab Suci Weda": {
        "cp": "Memahami Kitab Weda Śruti dan Kitab Weda Smrti.",
        "topik": [
          {
            "judul": "Klasifikasi Kitab Weda",
            "materi": [
              "Memahami Kitab Weda Śruti",
              "Memahami Kitab Weda Smrti"
            ]
          }
        ]
      },
      "Śraddhā dan Bhakti": {
        "cp": "Memahami Bhuana Agung dan Bhuana Alit.",
        "topik": [
          {
            "judul": "Konsep Kosmologi Hindu",
            "materi": [
              "Memahami Bhuana Agung (makrokosmos)",
              "Memahami Bhuana Alit (mikrokosmos)"
            ]
          }
        ]
      },
      "Susila": {
        "cp": "Menerapkan ajaran Catur Guru dan Catur Asrama.",
        "topik": [
          {
            "judul": "Ajaran Etika Hidup",
            "materi": [
              "Menerapkan Catur Guru (empat guru)",
              "Menerapkan Catur Asrama (empat tahapan hidup)"
            ]
          }
        ]
      },
      "Acara": {
        "cp": "Menjelaskan Pañca Yajña dan Manggalaning Yajña.",
        "topik": [
          {
            "judul": "Ritual Yajña",
            "materi": [
              "Menjelaskan Pañca Yajña (lima persembahan suci)",
              "Menjelaskan Manggalaning Yajña (tujuan Yajña)"
            ]
          }
        ]
      },
      "Sejarah Agama Hindu": {
        "cp": "Menceritakan Sejarah Perkembangan Agama Hindu di Indonesia.",
        "topik": [
          {
            "judul": "Sejarah Hindu di Indonesia",
            "materi": [
              "Menceritakan sejarah perkembangan agama Hindu di Indonesia"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Buddha dan Budi Pekerti": {
      "Sejarah": {
        "cp": "Menganalisis strategi Buddha Sakyamuni dalam menghadapi hambatan untuk meraih kesuksesan dan mengadaptasi pendekatan tersebut untuk mengatasi tantangan personal mereka. Mengevaluasi efektivitas cara Buddha Sakyamuni menyelesaikan masalah kehidupan individu dan sosial, kemudian mengkreasi solusi inovatif berdasarkan kebijaksanaan tersebut untuk konteks modern. Mengintegrasikan konsep dasar musyawarah mufakat dalam kehidupan Buddha Sakyamuni dengan mensintesis prinsip tersebut dalam praktik pengambilan keputusan demokratis di lingkungan keluarga, sekolah, dan masyarakat.",
        "topik": [
          {
            "judul": "Strategi Buddha Sakyamuni Mengatasi Tantangan",
            "materi": [
              "Menganalisis strategi Buddha Sakyamuni menghadapi hambatan",
              "Mengadaptasi pendekatan Buddha Sakyamuni mengatasi tantangan personal"
            ]
          },
          {
            "judul": "Solusi Inovatif Berdasarkan Kebijaksanaan Buddha",
            "materi": [
              "Mengevaluasi efektivitas cara Buddha Sakyamuni menyelesaikan masalah individu dan sosial",
              "Mengkreasi solusi inovatif berdasarkan kebijaksanaan Buddha untuk konteks modern"
            ]
          },
          {
            "judul": "Musyawarah Mufakat dalam Kehidupan Buddha",
            "materi": [
              "Mengintegrasikan konsep dasar musyawarah mufakat dalam kehidupan Buddha Sakyamuni",
              "Mensintesis prinsip musyawarah mufakat dalam pengambilan keputusan demokratis di lingkungan keluarga, sekolah, dan masyarakat"
            ]
          }
        ]
      },
      "Ritual": {
        "cp": "Menganalisis keragaman upacara puja dan meditasi ketenangan dari berbagai aliran atau tradisi agama Buddha. Merefleksikan sikap bersatu dalam perbedaan dengan berperan serta melakukan dialog moderasi beragama.",
        "topik": [
          {
            "judul": "Keragaman Upacara dan Meditasi Buddha",
            "materi": [
              "Menganalisis keragaman upacara puja dari berbagai aliran atau tradisi agama Buddha",
              "Menganalisis meditasi ketenangan dari berbagai aliran atau tradisi agama Buddha"
            ]
          },
          {
            "judul": "Sikap Moderasi Beragama",
            "materi": [
              "Merefleksikan sikap bersatu dalam perbedaan",
              "Berperan serta melakukan dialog moderasi beragama"
            ]
          }
        ]
      },
      "Etika": {
        "cp": "Menganalisis nilai-nilai Buddhadharma, Pancasila Buddhis, dan nilai-nilai Pancasila dasar negara berlandaskan pada nilai-nilai Hukum Sebab Akibat yang Saling Bergantungan. Menerapkan hak dan kewajiban, permasalahan dan solusinya di rumah, sekolah, dan rumah ibadah sebagai dasar keyakinan terhadap agama Buddha, melalui pembelajaran ramah anak serta mencerminkan kehidupan yang moderat.",
        "topik": [
          {
            "judul": "Nilai-nilai Etika Buddhis dan Pancasila",
            "materi": [
              "Menganalisis nilai-nilai Buddhadharma",
              "Menganalisis nilai-nilai Pancasila Buddhis",
              "Menganalisis nilai-nilai Pancasila dasar negara berlandaskan Hukum Sebab Akibat yang Saling Bergantungan"
            ]
          },
          {
            "judul": "Penerapan Hak, Kewajiban, dan Solusi Masalah",
            "materi": [
              "Menerapkan hak dan kewajiban di rumah, sekolah, dan rumah ibadah",
              "Menerapkan solusi permasalahan di rumah, sekolah, dan rumah ibadah"
            ]
          },
          {
            "judul": "Pembelajaran Ramah Anak dan Moderasi",
            "materi": [
              "Mewujudkan keyakinan terhadap agama Buddha melalui pembelajaran ramah anak",
              "Mencerminkan kehidupan yang moderat"
            ]
          }
        ]
      }
    },
    "Pendidikan Agama Khonghucu dan Budi Pekerti": {
      "Sejarah Suci": {
        "cp": "Menjelaskan wahyu Tiān (天) yang diterima oleh para nabi dan raja suci, tokoh-tokoh Rújiào (儒教) serta sumbangsih pemikirannya, sejarah perkembangan agama Khonghucu di Indonesia.",
        "topik": [
          {
            "judul": "Wahyu Tiān dan Tokoh Rújiào",
            "materi": [
              "Menjelaskan wahyu Tiān (天) yang diterima nabi dan raja suci",
              "Menjelaskan tokoh-tokoh Rújiào (儒教) dan sumbangsih pemikirannya"
            ]
          },
          {
            "judul": "Sejarah Khonghucu di Indonesia",
            "materi": [
              "Menjelaskan sejarah perkembangan agama Khonghucu di Indonesia"
            ]
          }
        ]
      },
      "Kitab Suci": {
        "cp": "Menginterpretasikan ayat-ayat dalam kitab Sishū (四书) dan Wŭjīng (五经) tentang Nabi Kōngzi (孔子) sebagai Tiān Zhī Mùduó (天之木铎), persaudaraan dalam pergaulan, rasa cinta tanah air, empat pantangan sìwù (四勿), dan yang berhubungan dengan konsep sāncái (三才).",
        "topik": [
          {
            "judul": "Nabi Kōngzi dan Ajaran Dasar",
            "materi": [
              "Menginterpretasikan ayat Sishū dan Wŭjīng tentang Nabi Kōngzi sebagai Tiān Zhī Mùduó",
              "Menginterpretasikan ayat Sishū dan Wŭjīng tentang persaudaraan dalam pergaulan",
              "Menginterpretasikan ayat Sishū dan Wŭjīng tentang rasa cinta tanah air"
            ]
          },
          {
            "judul": "Empat Pantangan dan Konsep Sāncái",
            "materi": [
              "Menginterpretasikan ayat Sishū dan Wŭjīng tentang empat pantangan sìwù (四勿)",
              "Menginterpretasikan ayat Sishū dan Wŭjīng tentang konsep sāncái (三才)"
            ]
          }
        ]
      },
      "Keimanan": {
        "cp": "Menginterpretasikan bahwa sembahyang adalah pokok dari agama, definisi iman, hukum yīnyáng (阴阳) sebagai dasar hukum alam semesta, konsep Tiga Dasar Kenyataan (sāncái 三才).",
        "topik": [
          {
            "judul": "Sembahyang dan Iman",
            "materi": [
              "Menginterpretasikan sembahyang sebagai pokok dari agama",
              "Menginterpretasikan definisi iman"
            ]
          },
          {
            "judul": "Konsep Dasar Alam Semesta",
            "materi": [
              "Menginterpretasikan hukum yīnyáng (阴阳) sebagai dasar hukum alam semesta",
              "Menginterpretasikan konsep Tiga Dasar Kenyataan (sāncái 三才)"
            ]
          }
        ]
      },
      "Tata Ibadah": {
        "cp": "Menginterpretasikan hari raya/sembahyang kepada Tiān (天), Nabi Kōngzi (孔子), shénmíng (神明), dan leluhur sebagai wujud kesusilaan (lī 礼); menjelaskan perlengkapan dan peralatan sembahyang sehingga menumbuhkan keimanan dan kepribadian luhur.",
        "topik": [
          {
            "judul": "Makna Hari Raya dan Persembahyangan",
            "materi": [
              "Menginterpretasikan hari raya",
              "Menginterpretasikan sembahyang kepada Tiān (天) sebagai wujud kesusilaan",
              "Menginterpretasikan sembahyang kepada Nabi Kōngzi (孔子) sebagai wujud kesusilaan",
              "Menginterpretasikan sembahyang kepada shénmíng (神明) sebagai wujud kesusilaan",
              "Menginterpretasikan sembahyang kepada leluhur sebagai wujud kesusilaan"
            ]
          },
          {
            "judul": "Perlengkapan Ibadah dan Pembinaan Diri",
            "materi": [
              "Menjelaskan perlengkapan sembahyang",
              "Menjelaskan peralatan sembahyang",
              "Menumbuhkan keimanan melalui tata ibadah",
              "Menumbuhkan kepribadian luhur melalui tata ibadah"
            ]
          }
        ]
      },
      "Perilaku Jūnzi (君子)": {
        "cp": "Menerapkan sikap cinta kasih kepada seluruh makhluk ciptaan Tiān (天), cinta tanah air, hidup tepasalira dan harmonis kepada sesama, bakti kepada Tiāndirén (天地人), prinsip empat pantangan (sìwù 四勿) dan lima hubungan kemasyarakatan (wùlún 五伦) dalam keseharian.",
        "topik": [
          {
            "judul": "Cinta Kasih dan Patriotisme",
            "materi": [
              "Menerapkan sikap cinta kasih kepada seluruh makhluk ciptaan Tiān (天)",
              "Menerapkan rasa cinta tanah air"
            ]
          },
          {
            "judul": "Harmoni Sosial dan Bakti",
            "materi": [
              "Hidup tepasalira dan harmonis kepada sesama",
              "Bakti kepada Tiāndirén (天地人)"
            ]
          },
          {
            "judul": "Prinsip Etika Keseharian",
            "materi": [
              "Menerapkan prinsip empat pantangan (sìwù 四勿) dalam keseharian",
              "Menerapkan lima hubungan kemasyarakatan (wùlún 五伦) dalam keseharian"
            ]
          }
        ]
      }
    }
  }
};
