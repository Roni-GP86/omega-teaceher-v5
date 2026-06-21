import React, { useState, useEffect, useRef } from "react";
import { 
  X, Send, HelpCircle, ShieldCheck, Clock, User, MessageSquare, 
  Sparkles, Check, ChevronRight, Zap, RefreshCw, AlertCircle, Trash2, Lock
} from "lucide-react";
import { 
  db,
  saveSupportMessageToFirebase, 
  deleteSupportMessageFromFirebase, 
  clearSupportChatFromFirebase 
} from "../utils/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenActivationModal?: () => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({ 
  isOpen, 
  onClose,
  onOpenActivationModal
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [userCode, setUserCode] = useState("GENERAL");
  const [requestStatus, setRequestStatus] = useState<"NONE" | "PENDING" | "ACTIVE">("NONE");
  const [activeRequestDetails, setActiveRequestDetails] = useState<any | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load user session / request code focus
  const loadChatContext = () => {
    try {
      // 1. Check if already activated
      const isActivated = localStorage.getItem("omega_is_activated") === "true";
      const activeCode = localStorage.getItem("omega_active_activation_code") || "";
      
      // 2. See if there is a pending request in system
      const pendingStr = localStorage.getItem("omega_pending_request_active_editor");
      let pendingCode = "";
      let pendingData = null;
      if (pendingStr) {
        try {
          pendingData = JSON.parse(pendingStr);
          pendingCode = pendingData.requestCode || "";
        } catch (e) {}
      }

      // Check current active request code (helper key saved from activation form)
      const currentSavedCode = localStorage.getItem("omega_current_active_request_code") || "";

      // Prioritize the code to organize correct channel
      let resolvedCode = "GENERAL";
      if (activeCode) {
        resolvedCode = activeCode;
        setRequestStatus("ACTIVE");
      } else if (pendingCode) {
        resolvedCode = pendingCode;
        setRequestStatus("PENDING");
        setActiveRequestDetails(pendingData);
      } else if (currentSavedCode) {
        resolvedCode = currentSavedCode;
        setRequestStatus("PENDING");
      } else {
        // Generate a sticky guest support code so they don't lose logs
        let guestCode = localStorage.getItem("omega_support_guest_code");
        if (!guestCode) {
          guestCode = "REQ-GUEST-" + Math.random().toString(36).substring(2, 7).toUpperCase();
          localStorage.setItem("omega_support_guest_code", guestCode);
        }
        resolvedCode = guestCode;
        setRequestStatus("NONE");
      }

      setUserCode(resolvedCode);

      // Load messages
      const msgsStr = localStorage.getItem("omega_support_messages");
      let allMsgs = msgsStr ? JSON.parse(msgsStr) : [];
      
      // Filter messages for THIS specific request code/session (Beda kode beda data percakapan!)
      let filtered = allMsgs.filter((m: any) => m.requestId === resolvedCode);
      
      // If empty for this session, seed initial greeting
      if (filtered.length === 0) {
        const welcomeMsg = {
          id: "welcome-" + Date.now(),
          requestId: resolvedCode,
          sender: "system",
          text: activeCode 
            ? "Selamat! Akun Omega Teacher Anda telah AKTIF dengan status **LISENSI PREMIUM**. Ada yang bisa kami bantu seputar penggunaan modul **Aplikasi KOSP**, **Modul RPM (Rencana Pembelajaran Mendalam)** atau **Daftar Nilai & Rapor Otomatis** kami hari ini?"
            : "Selamat datang di Pusat Bantuan Omega Teacher. Ada kendala seputar pengajuan **LISENSI PREMIUM** atau aktivasi lisensi sekolah Anda? Silakan kirimkan keluhan atau pertanyaan Anda di sini.",
          timestamp: new Date().toISOString(),
          readByAdmin: true,
          readByUser: true
        };
        
        const updated = [...allMsgs, welcomeMsg];
        localStorage.setItem("omega_support_messages", JSON.stringify(updated));
        filtered = [welcomeMsg];
      }

      // Mark unread messages as read by user
      const markedRead = allMsgs.map((m: any) => {
        if (m.requestId === resolvedCode && m.sender !== "user") {
          return { ...m, readByUser: true };
        }
        return m;
      });
      localStorage.setItem("omega_support_messages", JSON.stringify(markedRead));
      
      setMessages(filtered);
      
      // Dispatch an event to clear badge counts in other components
      window.dispatchEvent(new CustomEvent("omega-support-messages-read"));
      
    } catch (e) {
      console.error("Gagal memuat chat context:", e);
    }
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const executeClearChat = async () => {
    try {
      // Clear from Firebase permanently
      await clearSupportChatFromFirebase(userCode);

      const msgsStr = localStorage.getItem("omega_support_messages");
      let allMsgs = msgsStr ? JSON.parse(msgsStr) : [];
      
      // Simpan pesan sesi lain, hapus pesan sesi ini
      const remaining = allMsgs.filter((m: any) => m.requestId !== userCode);
      localStorage.setItem("omega_support_messages", JSON.stringify(remaining));
      
      // Reload context (ini akan membuat salam pembuka baru)
      loadChatContext();
      window.dispatchEvent(new CustomEvent("omega-support-message-received"));
      setShowClearConfirm(false);
    } catch (e) {
      console.error("Gagal menghapus chat:", e);
    }
  };

  const handleDeleteSingleMessage = async (messageId: string) => {
    try {
      // Delete from Firebase
      await deleteSupportMessageFromFirebase(messageId);

      const msgsStr = localStorage.getItem("omega_support_messages");
      if (!msgsStr) return;
      const allMsgs = JSON.parse(msgsStr);
      
      const indexToDelete = allMsgs.findIndex((m: any) => m.id === messageId);
      if (indexToDelete === -1) return;
      
      const targetMsg = allMsgs[indexToDelete];
      let idsToRemove = [messageId];
      
      // Jika yang dihapus adalah pertanyaan (user), cari respon sistem pasangannya
      if (targetMsg.sender === "user") {
        // 1. Cari pesan dengan flag replyTo yang cocok
        const explicitReplies = allMsgs.filter((m: any) => m.replyTo === messageId);
        explicitReplies.forEach((r: any) => {
          idsToRemove.push(r.id);
          deleteSupportMessageFromFirebase(r.id).catch(() => {});
        });
        
        // 2. Fallback untuk pesan lama: jika pesan berikutnya adalah system response dalam hitungan detik
        if (indexToDelete + 1 < allMsgs.length) {
          const nextMsg = allMsgs[indexToDelete + 1];
          if (nextMsg.sender === "system") {
            const timeDiff = Math.abs(new Date(nextMsg.timestamp).getTime() - new Date(targetMsg.timestamp).getTime());
            if (timeDiff < 10000) { // kurang dari 10 detik
              idsToRemove.push(nextMsg.id);
              deleteSupportMessageFromFirebase(nextMsg.id).catch(() => {});
            }
          }
        }
      }
      
      const updated = allMsgs.filter((m: any) => !idsToRemove.includes(m.id));
      localStorage.setItem("omega_support_messages", JSON.stringify(updated));
      
      // Reload context
      loadChatContext();
      window.dispatchEvent(new CustomEvent("omega-support-message-received"));
    } catch (e) {
      console.error("Gagal menghapus pesan:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadChatContext();
    }
  }, [isOpen]);

  // Real-time listener for support chats corresponding to current logged request code
  useEffect(() => {
    if (!isOpen || !userCode || userCode === "GENERAL") return;

    const q = query(
      collection(db, "support_messages"),
      where("requestId", "==", userCode)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort messages by timestamp
      const sorted = list.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (sorted.length > 0) {
        setMessages(sorted);
        // Sync with local storage
        const storedStr = localStorage.getItem("omega_support_messages") || "[]";
        let allMsgs = JSON.parse(storedStr);
        const filteredOut = allMsgs.filter((m: any) => m.requestId !== userCode);
        localStorage.setItem("omega_support_messages", JSON.stringify([...filteredOut, ...sorted]));
      }
    }, (err) => {
      console.warn("Gagal listen bungkusan chat luring,", err);
    });

    return () => {
      unsub();
    };
  }, [isOpen, userCode]);

  useEffect(() => {
    const handleRemoteUpdate = () => {
      loadChatContext();
    };
    window.addEventListener("omega-support-message-received", handleRemoteUpdate);
    window.addEventListener("omega-state-updated", handleRemoteUpdate);
    return () => {
      window.removeEventListener("omega-support-message-received", handleRemoteUpdate);
      window.removeEventListener("omega-state-updated", handleRemoteUpdate);
    };
  }, [userCode]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    try {
      const storedMsgs = localStorage.getItem("omega_support_messages");
      const currentMsgs = storedMsgs ? JSON.parse(storedMsgs) : [];
      
      const newMsg = {
        id: "msg-" + Date.now(),
        requestId: userCode,
        sender: "user",
        text: content,
        timestamp: new Date().toISOString(),
        readByAdmin: false,
        readByUser: true
      };

      // 1. Save user's message to Firebase!
      await saveSupportMessageToFirebase(newMsg);

      const updated = [...currentMsgs, newMsg];
      localStorage.setItem("omega_support_messages", JSON.stringify(updated));
      setInputText("");
      
      // Instant automated system answer simulations on user message triggers!
      let simulatedReply: any = null;
      
      const lcContent = content.toLowerCase();

      // Check if user is asking about access codes (especially admin or user access codes) - PRIVASI TERTINGGI!
      if (
        lcContent.includes("kode akses") ||
        lcContent.includes("kode admin") ||
        lcContent.includes("kode aktivasi") ||
        lcContent.includes("akses admin") ||
        (lcContent.includes("kode") && (lcContent.includes("rahasia") || lcContent.includes("privasi") || lcContent.includes("akun") || lcContent.includes("sandi") || lcContent.includes("bocor") || lcContent.includes("orang")))
      ) {
        simulatedReply = {
          id: "sim-reply-access-code-" + (Date.now() + 101),
          requestId: userCode,
          sender: "system",
          text: "PERTANYAAN ANDA TIDA TERDIDIK, BUKANKAH INI RANAH PRIVASI? TERMASUK PRIVASI ANDA?\n\nPada intinya, informasi lisensi kode akses and hak akses administrator bersifat sangat rahasia & dilindungi regulasi privasi demi keamanan luring data Bapak/Ibu Guru. Jika ada hal lain yang tidak Anda ketahui, mohon menanti balasan manual dari pihak Admin. Sekali lagi, jawaban asisten otomatis di sini hanya sebatas pemanfaatan fitur dan rincian harga paket aplikasi saja!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      } 
      // Check if user is asking about the developer / pengembang
      else if (
        lcContent.includes("pengembang") ||
        lcContent.includes("pencipta") ||
        lcContent.includes("pembuat") ||
        lcContent.includes("roni") ||
        lcContent.includes("bhidju") ||
        lcContent.includes("developer") ||
        lcContent.includes("author") ||
        lcContent.includes("siapa yang buat") ||
        lcContent.includes("siapa yang menciptakan")
      ) {
        simulatedReply = {
          id: "sim-reply-developer-" + (Date.now() + 116),
          requestId: userCode,
          sender: "system",
          text: "PENGEMBANG APLIKASI ADALAH SEORANG **GURU PELOSOK** BERDEDIKASI TINGGI DALAM DUNIA PENDIDIKAN. SEPAK TERJANG BELIAU CUKUP DIKENAL BUKAN HANYA DI WILAYAH TUGAS TETAPI KABUPATEN, PROVINSI, DAN TINGKAT NASIONAL.\n\nBeliau adalah **Roni Hariyanto Bhidju, S.Pd., Gr.**, guru di **SD Negeri Fatubai**, penerima penghargaan **Guru Dedikasi 2023** dan **Guru Transformatif 2025 Provinsi NTT**.\n\nSepak terjang beliau dalam dunia pendidikan sangatlah besar, membawa perubahan nyata di tengah keterbatasan sebagai guru di daerah pelosok!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user is asking about how this app/Omega was created/made
      else if (
        (lcContent.includes("bagaimana") && (lcContent.includes("dibuat") || lcContent.includes("diciptakan") || lcContent.includes("dibangun") || lcContent.includes("dirancang"))) ||
        (lcContent.includes("omega") && (lcContent.includes("dibuat") || lcContent.includes("diciptakan") )) ||
        lcContent.includes("pembuat aplikasi") ||
        lcContent.includes("pencipta aplikasi") ||
        lcContent.includes("dibuat oleh siapa")
      ) {
        simulatedReply = {
          id: "sim-reply-creation-" + (Date.now() + 115),
          requestId: userCode,
          sender: "system",
          text: "Aplikasi ini dirancang tentunya dengan perencanaan dan pengalaman pengembang yang sangat profesional. Melalui pengalaman nyata sebagai guru, beliau berhasil membuat perencanaan alur dan desain yang sangat detail.\n\nAda 2 unsur utama dalam pembuatan aplikasi, yaitu skill individu pengembang yang sangat mumpuni dan pemanfaatan teknologi AI.\n\nBerbeda dengan aplikasi di luar sana, aplikasi Omega tidak menggunakan referensi liar tak tentu arah, tetapi berdiri tegak di atas fondasi sumber resmi yang valid seperti **CP BSKAP 046/2025** dan Panduan Pembelajaran serta Asesmen Resmi dari Kementerian Pendidikan.\n\nIngatlah selalu: tanpa pengalaman mendalam dan skill individu, semua potensi kecanggihan AI akan berakhir sia-sia. Teknologi hanya bekerja atas perintah manusia; namun, arahan atau perintah yang salah justru akan menghasilkan kesalahan fatal. Di balik kesuksesan teknologi, kualitas skill kepemimpinan kitalah yang memegang kendali penuh!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user is asking about how to generate/make KOSP (Strict domain local mapping only)
      else if (lcContent.includes("kosp") || lcContent.includes("langkah membuat kosp") || lcContent.includes("cara buat kosp") || lcContent.includes("bikin kosp")) {
        simulatedReply = {
          id: "sim-reply-kosp-" + (Date.now() + 110),
          requestId: userCode,
          sender: "system",
          text: "Langkah Menyusun KOSP di aplikasi Omega Teacher (berdasarkan cara kerja sistem luring):\n\n1. Masuk ke bar menu utama dan pilih menu **Asisten KOSP**.\n2. Isi Profil & Karakteristik Satuan Pendidikan Anda secara rinci.\n3. Masukkan landasan Visi, Misi, dan Tujuan Satuan Pendidikan Anda.\n4. Atur Pengorganisasian Pembelajaran (Struktur Kurikulum Intra/Ekstra/Projek).\n5. Rancang Rencana Pembelajaran & Evaluasi pendampingan.\n6. Tekan tombol 'Proses via AI Merdeka' di bagian bawah agar asisten melengkapi draf KOSP kurikulum BSKAP 046/2025 secara utuh.\n7. Klik tombol 'Unduh Dokumen KOSP (.doc)' untuk mengunduh dokumen KOSP yang berformat rapi dengan Kop resmi.\n\nSistem Omega diprogram murni mengikuti regulasi resmi Kemendikbud secara tertutup, bebas dari referensi luar tak terpercaya!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user is asking about how to generate/make KKTP (Strict domain local mapping only)
      else if (lcContent.includes("kktp") || lcContent.includes("kriteria ketuntasan") || lcContent.includes("cara buat kktp") || lcContent.includes("bikin kktp") || lcContent.includes("langkah kktp")) {
        simulatedReply = {
          id: "sim-reply-kktp-" + (Date.now() + 112),
          requestId: userCode,
          sender: "system",
          text: "Langkah Merumuskan KKTP di aplikasi Omega Teacher (berdasarkan cara kerja sistem luring):\n\n1. Masuk ke menu **Perencana Ajar** di bar menu utama.\n2. Pilih/ketik mata pelajaran dan tingkat sasaran kelas Anda.\n3. Klik tombol 'Formulasikan TP, ATP, KKTP, PROTA & PROMES' di bagian bawah.\n4. Sistem kami secara otomatis merumuskan Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), dan melengkapinya dengan **Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)** berbasis interval kriteria (Remedial, Layak, Cakap, Mahir) beserta Rubrik Penilaian.\n5. Rumusan KKTP ini dapat diekspor langsung ke berkas .doc/.pdf atau terhubung otomatis pada modul **Daftar Nilai** untuk mempermudah penilaian harian Anda secara luring!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user is asking about how to generate/make RPM (Strict domain local mapping only)
      else if (
        lcContent.includes("rpm") || 
        lcContent.includes("rencana pelaksanaan mingguan") || 
        lcContent.includes("rencana pembelajaran mendalam") || 
        lcContent.includes("buat rpm") || 
        lcContent.includes("langkah rpm")
      ) {
        simulatedReply = {
          id: "sim-reply-rpm-" + (Date.now() + 113),
          requestId: userCode,
          sender: "system",
          text: "Cara Mengakses & Menyusun RPM (Rencana Pembelajaran Mendalam) di Aplikasi Omega Teacher:\n\n1. **Akses Modul**: Bapak/Ibu Guru yang memiliki kode akses mumpuni tinggal memilih menu **Modul RPM** di bar menu utama.\n2. **Pilih Sasaran**: Tentukan **Fase Belajar** sasaran Anda (Fase A s/d Fase F), lalu akses dan unduh draft atau materinya secara langsung.\n3. **Tutorial Penyusunan**: Untuk tutorial menghasilkan RPM yang kontekstual, sebenarnya di dalam aplikasi itu sendiri (pada fitur modul RPM) sudah disediakan panduan/tutorial interaktif terintegrasi yang berisikan langkah detail untuk membantu Bapak/Ibu menyusun RPM yang kontekstual dan relevan.\n\nSistem Omega dirancang sangat sederhana untuk mengefektifkan administrasi ajar Bapak/Ibu secara mandiri dan offline!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user is asking about how to generate/make Rapor/Nilai (Strict domain local mapping only)
      else if (lcContent.includes("rapor") || lcContent.includes("daftar nilai") || lcContent.includes("input nilai") || lcContent.includes("cetak rapor")) {
        simulatedReply = {
          id: "sim-reply-rapor-" + (Date.now() + 114),
          requestId: userCode,
          sender: "system",
          text: "Cara Penggunaan Daftar Nilai & Rapor Otomatis di Omega Teacher (berdasarkan cara kerja sistem luring):\n\n1. Buka menu **Daftar Nilai** di bar menu utama.\n2. Masukkan daftar siswa kelas Anda secara luring (atau sinkronisasikan dari Profil Murid).\n3. Input nilai formatif (lingkup materi) dan nilai sumatif (STS/SAS).\n4. Atur Target **KKTP** kelas dan Bobot Nilai Akhir sesuai kriteria.\n5. Sistem secara otomatis menganalisis tingkat ketuntasan murid.\n6. Masuk ke panel **Rapor Panel** untuk mencetak lembaran Rapor Kurikulum Merdeka yang lengkap dengan deskripsi capaian kompetensi otomatis dari draf nilai luring Anda!",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user complains that the price is too expensive (mahal / kemahalan)
      else if (
        lcContent.includes("mahal") || 
        lcContent.includes("kemahalan") ||
        lcContent.includes("mahal sekali") ||
        lcContent.includes("harga mahal")
      ) {
        simulatedReply = {
          id: "sim-reply-pricing-mahal-" + (Date.now() + 121),
          requestId: userCode,
          sender: "system",
          text: "Pernahkah Bapak/Ibu berpikir untuk memerdekakan diri dari beban administrasi? Pengembang mencoba memposisikan hal itu bahwa menjadi guru tidaklah mudah, ada pengorbanan besar di sana.\n\nPernahkah Bapak/Ibu berpikir seberapa banyak waktu, tenaga, biaya, dan pikiran yang dikorbankan untuk menghasilkan aplikasi ini? Pernahkah berpikir agar bagaimana data Bapak/Ibu tetap aman dan terjaga?\n\nMungkin kita hanyalah penikmat, tetapi pengembang memikirkan semuanya demi kenyamanan Anda, termasuk perlindungan privasi & penyimpanan data luring (offline) Anda. Dan semua pertimbangan itu tentu membutuhkan biaya pengembangan, di mana kita sendiri bahkan belum tahu berapa dana mandiri yang telah dikeluarkan pengembang demi menciptakan sebuah fitur!\n\nInvestasi satu kali ini sesungguhnya adalah bentuk kemerdekaan, ketenangan pikiran, dan penghargaan tertinggi atas waktu berharga Anda selaku pendidik.",
          timestamp: new Date(Date.now() + 300).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if user says or appreciates that the price is cheap / reasonable (murah / hemat)
      else if (
        lcContent.includes("murah") || 
        lcContent.includes("terjangkau") || 
        lcContent.includes("hemat") || 
        lcContent.includes("sangat murah") || 
        lcContent.includes("harga murah")
      ) {
        simulatedReply = {
          id: "sim-reply-pricing-murah-" + (Date.now() + 122),
          requestId: userCode,
          sender: "system",
          text: "Anda luar biasa!\n\nOmega AI mewakili seluruh tim pengembang menyampaikan apresiasi setinggi-tingginya untuk Bapak/Ibu Guru yang bijak. Anda mampu menempatkan diri sebagai pengembang yang luar biasa memahami betapa sulitnya proses, seberapa besar pengorbanan, dan dedikasi waktu yang dicurahkan demi melahirkan sebuah aplikasi berkualitas tinggi yang tetap aman & beroperasi luring.\n\nSaling menghargai sesama pejuang dunia pendidikan adalah dorongan terbesar bagi kami untuk terus berinovasi!",
          timestamp: new Date(Date.now() + 300).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      // Check if asking about pricing, packages or premium options
      else if (
        lcContent.includes("harga") || 
        lcContent.includes("paket") || 
        lcContent.includes("premium") || 
        lcContent.includes("tarif") || 
        lcContent.includes("bayar") || 
        lcContent.includes("biaya") || 
        lcContent.includes("daftar harga") || 
        lcContent.includes("ongkir")
      ) {
        simulatedReply = {
          id: "sim-reply-pricing-" + (Date.now() + 120),
          requestId: userCode,
          sender: "system",
          text: "Berikut adalah daftar harga resmi paket lisensi Omega Teacher (Sekali Bayar / Lifetime & Luring):\n\n• **LISENSI PREMIUM LENGKAP (LIFETIME)**: Rp 125.000 (Promo, normal Rp 225.000) — Membuka akses penuh ke seluruh menu (KOSP, TP/ATP/KKTP, RPM, Absensi, Karakter P5, Daftar Nilai, dan Cetak Rapor otomatis) selamanya tanpa batas!\n\n• **Paket Satuan Eceran (Lifetime)**:\n  1. **Aplikasi KOSP**: Rp 25.000\n  2. **Perencana Ajar (TP/ATP/KKTP/Prota/Promes)**: Rp 25.050\n  3. **Literasi & Numerasi (Asesmen Diagnostik)**: Rp 25.000\n  4. **Pembuat Soal Cerdas otomatis**: Rp 25.000\n  5. **Nilai Karakter (Observasi P5 harian)**: Rp 25.000\n  6. **Absensi Kelas luring**: Rp 25.005\n  7. **Daftar Nilai & Rapor Otomatis (1 Paket)**: Rp 50.000\n  8. **Modul RPM (Rencana Pembelajaran Mendalam)**: Rp 50.000 per Fase pilihan Anda (Fase A s/d Fase F).\n\nSemua lisensi bersifat Lifetime (sekali beli aktif selamanya) dan dioperasikan 100% luring (offline) untuk keamanan privasi penuh data sekolah Bapak/Ibu Guru.",
          timestamp: new Date(Date.now() + 300).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }
      else if (lcContent.includes("belum aktif") || lcContent.includes("1 jam") || lcContent.includes("kapan")) {
        simulatedReply = {
          id: "sim-reply-delayed-" + (Date.now() + 100),
          requestId: userCode,
          sender: "system",
          text: "Halo Bapak/Ibu Guru, tim verifikasi kami sedang melakukan pengecekan data transaksi secara berkala. Mohon pastikan bukti pengiriman Anda valid. Silakan menanti balasan manual dari tim Admin di ruangan obrolan ini, verifikasi akan selesai maksimal beberapa menit ke depan.",
          timestamp: new Date(Date.now() + 200).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      } 
      else {
        // Fallback default helpful acknowledgment
        simulatedReply = {
          id: "sim-reply-default-" + (Date.now() + 150),
          requestId: userCode,
          sender: "system",
          text: "Terimakasih atas pesan Anda! Asisten otomatis telah merekam pesan Anda di dalam sistem. Mengenai pertanyan di luar kebutuhan pemanfaatan fitur atau harga paket di atas, mohon kesediaan Bapak/Ibu Guru untuk menanti balasan manual dari pihak Admin yang akan segera hadir meninjau ruang obrolan Anda.",
          timestamp: new Date(Date.now() + 400).toISOString(),
          readByAdmin: true,
          readByUser: false
        };
      }

      if (simulatedReply) {
        simulatedReply.replyTo = newMsg.id;
        // 2. Save simulated system response to Firebase too so admin can see it in real-time!
        await saveSupportMessageToFirebase(simulatedReply);
      }

      setTimeout(() => {
        const msgsAfterSim = [...updated, simulatedReply];
        localStorage.setItem("omega_support_messages", JSON.stringify(msgsAfterSim));
        loadChatContext();
        window.dispatchEvent(new CustomEvent("omega-support-message-received"));
      }, 1500);

      loadChatContext();
      window.dispatchEvent(new CustomEvent("omega-support-message-received"));

    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    
    // Split by lines to preserve paragraph structure
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Find all matches of **bold text**
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      const regex = /\*\*(.*?)\*\*/g;
      let match;

      while ((match = regex.exec(line)) !== null) {
        const matchIndex = match.index;
        const matchedText = match[1];

        // Push text before match
        if (matchIndex > lastIndex) {
          parts.push(<span key={`text-${lastIndex}`}>{line.substring(lastIndex, matchIndex)}</span>);
        }

        // Color highlighting depending on key feature names
        let colorClass = "text-yellow-400 font-extrabold"; // Default color (yellow)
        const lowerMatched = matchedText.toLowerCase();

        if (lowerMatched.includes("kosp")) {
          colorClass = "text-amber-400 font-black tracking-wide bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20";
        } else if (lowerMatched.includes("perencana ajar") || lowerMatched.includes("tp/atp/kktp")) {
          colorClass = "text-[#4dabf7] font-black tracking-wide bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20";
        } else if (lowerMatched.includes("literasi & numerasi") || lowerMatched.includes("literasi dan numerasi")) {
          colorClass = "text-[#a9e34b] font-black tracking-wide bg-lime-500/10 px-1.5 py-0.5 rounded border border-lime-500/20";
        } else if (lowerMatched.includes("pembuat soal")) {
          colorClass = "text-[#f06595] font-black tracking-wide bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20";
        } else if (lowerMatched.includes("nilai karakter") || lowerMatched.includes("karakter p5")) {
          colorClass = "text-[#20c997] font-black tracking-wide bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20";
        } else if (lowerMatched.includes("absensi")) {
          colorClass = "text-[#3b5bdb] font-black tracking-wide bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20";
        } else if (lowerMatched.includes("rapor") || lowerMatched.includes("daftar nilai")) {
          colorClass = "text-[#ff6b6b] font-black tracking-wide bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20";
        } else if (lowerMatched.includes("rpm") || lowerMatched.includes("rencana pelaksanaan mingguan") || lowerMatched.includes("rencana pembelajaran mendalam")) {
          colorClass = "text-[#ff922b] font-black tracking-wide bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20";
        } else if (lowerMatched.includes("lisensi premium")) {
          colorClass = "text-amber-450 font-black bg-amber-500/15 px-1.5 py-1 rounded border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
        } else if (lowerMatched.includes("paket satuan eceran")) {
          colorClass = "text-indigo-300 font-black tracking-wide border-b border-indigo-500/20";
        } else if (lowerMatched.includes("roni hariyanto bhidju")) {
          colorClass = "text-[#ffd43b] font-black tracking-wide bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15 inline-block drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] animate-pulse";
        } else if (lowerMatched.includes("sd negeri fatubai") || lowerMatched.includes("guru pelosok")) {
          colorClass = "text-yellow-400 font-extrabold";
        } else if (lowerMatched.includes("guru dedikasi") || lowerMatched.includes("guru transformatif")) {
          colorClass = "text-[#20c997] font-extrabold";
        }

        parts.push(
          <strong key={`match-${matchIndex}`} className={colorClass}>
            {matchedText}
          </strong>
        );

        lastIndex = regex.lastIndex;
      }

      // Push remaining text inside line
      if (lastIndex < line.length) {
        parts.push(<span key={`text-end`}>{line.substring(lastIndex)}</span>);
      }

      const isEmpty = line.trim() === "";
      return (
        <div key={lineIdx} className={`${isEmpty ? "h-2" : "min-h-[1.125rem]"} leading-relaxed text-xs`}>
          {parts.length > 0 ? parts : line}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center p-0 bg-black/85 backdrop-blur-[3px] font-sans overflow-hidden">
      {/* Background backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300 cursor-pointer bg-transparent"
      />

      {/* Cyber Panel Drawer Container */}
      <div className="relative w-full max-w-xl h-full bg-[#070913] border-x border-[#1a1b35] shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col justify-between z-10 overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Glowing cyber light effects */}
        <div className="absolute top-0 right-0 w-[220px] h-[220px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] rounded-full bg-pink-500/5 blur-[70px] pointer-events-none" />

        {/* Header bar of Live Chat */}
        <div className="p-4 border-b border-zinc-910 bg-[#090b1a]/95 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative">
              <MessageSquare className="w-5 h-5 animate-pulse" />
              <span className="absolute bottom-0.5 right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
            </div>
            <div>
              <h3 className="text-xs font-black font-mono text-white tracking-wide uppercase flex items-center gap-1.5 leading-none">
                Live Support Omega
              </h3>
              <p className="text-[9.5px] text-zinc-500 font-mono tracking-widest mt-1">
                ONLINE • CHAT SUPPORT
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleClearChat}
              className="p-2 text-rose-500/80 hover:text-white rounded-xl hover:bg-rose-500/10 transition"
              title="Hapus Seluruh Obrolan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => {
                loadChatContext();
                window.dispatchEvent(new CustomEvent("omega-state-updated"));
              }}
              className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-950/60 transition"
              title="Refresh Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-950/60 transition"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Hub Badge bar */}
        <div className="px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-915 text-[10.5px] flex items-center justify-between relative z-10 font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-[9.5px] text-zinc-650">KODE SESI:</span>
            <span className="text-indigo-400 font-extrabold tracking-wide text-[10px] bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase">
              {userCode}
            </span>
          </div>

          <div>
            {requestStatus === "ACTIVE" ? (
              <span className="text-emerald-400 font-black flex items-center gap-1.5 text-[9.5px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> PREMIUM AKTIF
              </span>
            ) : requestStatus === "PENDING" ? (
              <span className="text-amber-450 font-black flex items-center gap-1.5 text-[9.5px] animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> MENUNGGU AKTIVASI
              </span>
            ) : (
              <button 
                onClick={() => {
                  onClose();
                  if (onOpenActivationModal) onOpenActivationModal();
                }}
                className="text-amber-500 hover:text-amber-400 font-extrabold flex items-center gap-0.5 text-[9.5px] hover:underline"
              >
                MINTA KODE AKSES <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#05060b]/30">
          
          {/* Informational intro banner inside chat box */}
          <div className="p-3 bg-gradient-to-r from-zinc-950 to-zinc-90 w-full rounded-2xl border border-zinc-900 shadow-sm space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-[10px] font-mono uppercase">
              <Lock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> PROTEKSI PRIVASI ENKRIPSI
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
              Sesuai protokol keamanan Omega, kolom chat ini bersifat sepenuhnya privat & aman luring. Percakapan ini <strong>hanya bisa dipantau secara langsung oleh tim Admin (Roni Hariyanto Bhidju, S.Pd., Gr.) dan Anda sendiri</strong> selaku pemilik sah kode akses <strong className="text-indigo-300 font-mono">{userCode}</strong>.
            </p>
          </div>

          {messages.map((m: any) => {
            const isUser = m.sender === "user";
            const isSystem = m.sender === "system";
            
            return (
              <div 
                key={m.id}
                className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser 
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-300"
                    : isSystem 
                      ? "bg-violet-500/20 border-violet-500/30 text-violet-400"
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                }`}>
                  {isUser ? <User className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[75%] space-y-1 relative group">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-md ${
                    isUser 
                      ? "bg-indigo-600 text-white rounded-tr-xs" 
                      : isSystem 
                        ? "bg-[#0b0f24] border border-violet-500/20 text-indigo-100 rounded-tl-xs"
                        : "bg-zinc-90 text-zinc-200 rounded-tl-xs"
                  }`}>
                    {isSystem ? renderFormattedMessage(m.text) : m.text}
                  </div>
                  
                  {/* Timestamp and Delivery Tag */}
                  <div className={`flex items-center gap-1.5 text-[8.5px] text-zinc-500 font-mono ${isUser ? "justify-end" : "justify-start"}`}>
                    <span className={`font-extrabold text-[8.5px] uppercase tracking-wider ${isUser ? "text-amber-400" : isSystem ? "text-violet-400" : "text-indigo-400"}`}>
                      {isUser ? "Anda" : isSystem ? "Omega AI" : "Tim Admin"}
                    </span>
                    <span className="text-zinc-700 font-extrabold">•</span>
                    <span>
                      {m.timestamp ? new Date(m.timestamp).toLocaleTimeString("id-ID", { hour: "numeric", minute: "numeric" }) : ""}
                    </span>
                    {isUser && m.readByAdmin && (
                      <>
                        <span className="text-zinc-700 font-extrabold">•</span>
                        <span className="text-emerald-400 text-[8px] font-black uppercase">Dilihat</span>
                      </>
                    )}

                    {/* Hapus pesan tunggal */}
                    <button
                      onClick={() => handleDeleteSingleMessage(m.id)}
                      className="opacity-0 group-hover:opacity-100 transition duration-150 p-0.5 text-rose-500/80 hover:text-rose-450 ml-1 rounded hover:bg-rose-500/10 cursor-pointer"
                      title="Hapus pesan ini"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggest Question Chips */}
        {messages.length <= 3 && (
          <div className="p-3 bg-[#060815]/90 border-t border-zinc-910 space-y-2 shrink-0">
            <span className="text-[9px] font-mono text-zinc-550 uppercase font-black tracking-wide block">
              Pertanyaan yang Sering Diajukan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickQuestion("Mengapa kode saya belum aktif setelah 1 jam?")}
                className="p-1.5 px-2.5 rounded-lg border border-zinc-850 hover:border-indigo-500/30 bg-zinc-950/60 hover:bg-zinc-900 text-[10px] text-zinc-300 transition text-left cursor-pointer"
              >
                ⏱️ Mengapa kode belum aktif?
              </button>
              <button
                onClick={() => handleQuickQuestion("Bagaimana aktivasi paket kustom Pembuat Soal?")}
                className="p-1.5 px-2.5 rounded-lg border border-zinc-850 hover:border-indigo-500/30 bg-zinc-950/60 hover:bg-zinc-900 text-[10px] text-zinc-300 transition text-left cursor-pointer"
              >
                ✏️ Aktivasi Pembuat Soal
              </button>
              <button
                onClick={() => handleQuickQuestion("Apakah admin bisa membantu pengeditan link di RPM?")}
                className="p-1.5 px-2.5 rounded-lg border border-zinc-850 hover:border-indigo-500/30 bg-zinc-950/60 hover:bg-zinc-900 text-[10px] text-zinc-300 transition text-left cursor-pointer"
              >
                ⚙️ Bantuan Atur Link RPM
              </button>
            </div>
          </div>
        )}

        {/* Text Input Footer Bar */}
        <div className="p-3 bg-[#080a18] border-t border-zinc-915 flex gap-2 relative z-10 shrink-0">
          <input
            type="text"
            placeholder="Tulis pesan atau pertanyaan Anda di sini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 bg-[#030409] border border-zinc-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition duration-150 disabled:opacity-40 disabled:hover:bg-indigo-600 cursor-pointer shadow-lg font-extrabold flex items-center justify-center"
            title="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Confirmation Modal for Clear Chat */}
        {showClearConfirm && (
          <div className="absolute inset-0 bg-[#020205]/95 backdrop-blur-[6px] z-50 flex items-center justify-center p-6 transition-all duration-300">
            <div className="w-full max-w-sm bg-[#090b16] border border-zinc-800 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-black font-mono text-zinc-100 uppercase tracking-wider mb-2">Hapus Riwayat Obrolan</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Apakah Anda yakin ingin menghapus seluruh riwayat obrolan pada sesi <span className="font-extrabold text-indigo-400 font-mono">{userCode}</span>?
                <br />
                <span className="text-rose-400 text-[11px] mt-1.5 block font-extrabold uppercase">Tindakan ini permanen dan tidak dapat dibatalkan!</span>
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 w-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 rounded-xl text-xs text-zinc-300 font-black cursor-pointer transition uppercase"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    executeClearChat();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2 w-full bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-lg shadow-rose-950/20 transition uppercase"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
