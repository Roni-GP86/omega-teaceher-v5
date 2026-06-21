# Panduan Pembaruan Capaian Pembelajaran (CP) Mandiri
**OMEGA Teacher Engine**

Dokumen ini menjelaskan alur kerja sistem database kurikulum serta langkah-langkah detail tahap-demi-tahap bagi Anda jika ingin memperbarui, menambah, atau mengganti Capaian Pembelajaran (CP) mata pelajaran umum (BSKAP 046/2025) maupun Agama di masa mendatang secara otomatis menggunakan API Gemini.

---

## 1. Konsep & Arsitektur Database Kurikulum

Aplikasi OMEGA menggunakan **dua tempat utama** untuk menyimpan data standar kurikulum:
1. **`src/utils/curriculumDatabase.ts` (Database Utama Aplikasi):**
   * Ini adalah berkas TypeScript statis tempat semua data kurikulum disimpan (Matematika, Bahasa Indonesia, PAI, Kristen, Katolik, dll.).
   * Keuntungannya: Aplikasi membaca data ini secara lokal, sehingga tidak membutuhkan kuota API/jaringan internet saat guru memilih mata pelajaran. Sangat cepat dan stabil.
2. **`server.ts` (Mesin Ekstraktor Otomatis):**
   * Berkas backend ini bertugas membaca PDF kurikulum fisik, mengirimkannya ke AI Gemini, merapikan strukturnya menjadi JSON, dan menggabungkannya (*merge*) ke database utama di atas.

---

## 2. Cara Memperbarui CP Mata Pelajaran Umum (BSKAP 046/2025) Secara Otomatis

Jika Anda mendapatkan berkas PDF resmi baru dari kementerian (misal: dokumen lengkap BSKAP 046/2025 atau perubahannya) dan ingin memasukkannya ke database:

### Langkah 1: Siapkan File PDF Baru
1. Salin berkas PDF baru Anda ke dalam folder utama proyek (satu folder dengan `server.ts`).
2. Sebagai contoh, beri nama berkas tersebut: `CP_UMUM_TERBARU.pdf`.

### Langkah 2: Sesuaikan Nama File di `server.ts`
1. Buka berkas `server.ts` menggunakan teks editor (seperti VS Code).
2. Cari baris fungsi `autoExtractReligionCP` (sekitar baris **1865-1880**).
3. Ubah nama berkas PDF rujukan dari:
   ```typescript
   const pdfPath = path.join(__dirname, 'CP PENDIDIKAN AGAMA TERBARU.pdf');
   ```
   menjadi nama berkas PDF baru Anda:
   ```typescript
   const pdfPath = path.join(__dirname, 'CP_UMUM_TERBARU.pdf');
   ```

### Langkah 3: Bersihkan Cache Ekstraksi Sebelumnya
Sistem ekstraksi otomatis mendeteksi apakah proses ekstraksi sudah pernah berhasil atau belum berdasarkan keberadaan file `extracted_religion_cp.json` dan backup-nya.
1. Hapus berkas `extracted_religion_cp.json.bak` jika ada di folder proyek Anda.
2. Hapus berkas `extracted_religion_cp.json` (jika ada).
*Langkah ini wajib dilakukan agar sistem menyadari bahwa ada dokumen baru yang perlu diekstrak.*

### Langkah 4: Jalankan Ulang Server Lokal
1. Tutup terminal/cmd server yang sedang berjalan saat ini.
2. Klik 2x berkas **`run_dev.bat`** di folder proyek Anda.
3. Server akan mendeteksi bahwa berkas JSON tidak ditemukan dan akan memulai proses:
   * **[Auto-Extract]:** Mengunggah `CP_UMUM_TERBARU.pdf` ke Gemini API.
   * **[Auto-Extract]:** Memproses ekstraksi materi Fase A, B, dan C.
   * **[Auto-Merge]:** Menggabungkan hasil ekstraksi baru tersebut ke dalam database `curriculumDatabase.ts` tanpa menghapus data pelajaran yang sudah ada sebelumnya.

---

## 3. Cara Mengubah Teks Rujukan Standar Secara Manual

Jika Anda hanya ingin mengubah tulisan rujukan standar di dalam antarmuka aplikasi (misal, dari BSKAP 046/2025 menjadi keputusan terbaru lainnya) tanpa melakukan ekstraksi ulang:

1. Buka berkas `src/components/LessonPlanner.tsx`.
2. Cari bagian kode rujukan dinamis berikut (sekitar baris **2409-2415**):
   ```typescript
   Rujukan Standar: <strong>{mapel.toLowerCase().includes("agama") ? "CP. 020/2026" : "CP. 046/2025"}</strong>
   ```
3. Sesuaikan teks `"CP. 046/2025"` atau `"CP. 020/2026"` ke nomor keputusan yang Anda inginkan.
4. Lakukan pencarian kata `"CP. 046/2025"` di berkas tersebut untuk memastikan Anda mengubah semua label teks terkait agar seragam di seluruh halaman.

---

## 4. Tips Mengoptimalkan Prompt AI di `server.ts`

Jika hasil ekstraksi dari PDF kurang rapi atau ada bagian elemen yang terlewat, Anda bisa mengedit prompt perintah yang dikirim ke Gemini:
1. Buka berkas `server.ts`.
2. Temukan variabel `prompt` di dalam fungsi `extractReligionCP` (sekitar baris **1890**).
3. Anda bisa memperjelas perintahnya di sana, misalnya:
   * Menambahkan instruksi spesifik: *"Pastikan elemen Bahasa Indonesia seperti Membaca, Menulis, dan Menyimak dipetakan secara detail."*
   * Mengatur batasan panjang teks atau pemotongan bab materi.

---

## 5. Mengunggah Perubahan Baru ke GitHub

Setelah data kurikulum berhasil diperbarui secara lokal, jangan lupa mengunggahnya ke repositori online Anda agar dapat dinikmati oleh versi live/produksi:

1. Buka terminal CMD pada folder proyek.
2. Jalankan perintah berurutan berikut:
   ```bash
   git add .
   git commit -m "Update database kurikulum umum dengan rujukan standar terbaru"
   git push origin main
   ```
