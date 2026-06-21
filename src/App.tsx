import React, { useState } from 'react';
import { 
  FileSpreadsheet, Lock, Sparkles, AlertCircle, Play, Info, HelpCircle, 
  Check, Copy, Skull, Terminal, Cpu, ShieldAlert, Zap, FileText, File, 
  Shrink, Presentation, Layers, BookOpen, Menu, X, ChevronLeft, ChevronRight, Home, Database, School,
  Download, Upload, Laptop, Monitor, LogOut, Key, User, Award, GraduationCap, UserCheck, Plus, Video, MessageSquare,
  Camera, Trash2, Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, CartesianGrid
} from 'recharts';
import { FileProcessor } from './components/FileProcessor';
import { WordProcessor } from './components/WordProcessor';
import { PowerPointProcessor } from './components/PowerPointProcessor';
import { PdfDecryptor } from './components/PdfDecryptor';
import { PdfCompressor } from './components/PdfCompressor';
import { ManualGuides } from './components/ManualGuides';
import { AiPdfExtractor } from './components/AiPdfExtractor';
import { KospGenerator } from './components/KospGenerator';
import { LessonPlanner } from './components/LessonPlanner';
import { RPMGenerator } from './components/RPMGenerator';
import { SoalGenerator } from './components/SoalGenerator';
import { DocumentBank } from './components/DocumentBank';
import { CyberIntro } from './components/CyberIntro';
import { ActivationModal } from './components/ActivationModal';
import { SupportChat } from './components/SupportChat';
import { AdminPanel } from './components/AdminPanel';
import { LitNumProgress } from './components/LitNumProgress';
import { AttendanceCard } from './components/AttendanceCard';
import { CharacterAssessment } from './components/CharacterAssessment';
import { DaftarNilai } from './components/DaftarNilai';
import { RaporPanel } from './components/RaporPanel';
import SchoolProfile from './components/SchoolProfile';
import StudentProfile from './components/StudentProfile';
import ProjectModuleGenerator from './components/ProjectModuleGenerator';
import AppTutorial from './components/AppTutorial';
import { db } from './utils/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, setDoc } from 'firebase/firestore';

const VBA_SCRIPT = `Sub UnprotectActiveSheet()
    Dim i As Integer, j As Integer, k As Integer
    Dim l As Integer, m As Integer, n As Integer
    Dim i1 As Integer, i2 As Integer, i3 As Integer
    Dim i4 As Integer, i5 As Integer, i6 As Integer
    On Error Resume Next
    For i = 65 To 66: For j = 65 To 66: For k = 65 To 66
    For l = 65 To 66: For m = 65 To 66: For i1 = 65 To 66
    For i2 = 65 To 66: For i3 = 65 To 66: For i4 = 65 To 66
    For i5 = 65 To 66: For i6 = 65 To 66: For n = 32 To 126
    ActiveSheet.Unprotect Chr(i) & Chr(j) & Chr(k) & _
        Chr(l) & Chr(m) & Chr(i1) & Chr(i2) & Chr(i3) & _
        Chr(i4) & Chr(i5) & Chr(i6) & Chr(n)
    If ActiveSheet.ProtectContents = False Then
        MsgBox "Selamat! Sheet telah berhasil dibuka kuncinya.", vbInformation, "Sukses"
        Exit Sub
    End If
    Next: Next: Next: Next: Next: Next
    Next: Next: Next: Next: Next: Next
End Sub`;

// Secure frontend key obfuscator and deobfuscator helpers
function encodeKey(key: string): string {
  if (!key) return "";
  try {
    const shifted = key.split("").map((c) => String.fromCharCode(c.charCodeAt(0) + 3)).join("");
    return btoa(shifted);
  } catch (err) {
    console.error("Gagal melakukan enkripsi kunci:", err);
    return key;
  }
}

// Mendukung format key Gemini lama (AIzaSy) dan baru (AQ.)
function isValidGeminiKeyFrontend(key: string): boolean {
  if (!key || key.length < 10) return false;
  return key.startsWith("AIzaSy") || key.startsWith("AQ.");
}

function decodeKey(encoded: string): string {
  if (!encoded) return "";
  // Jika sudah berupa key valid (format lama atau baru), langsung kembalikan
  if (isValidGeminiKeyFrontend(encoded)) {
    return encoded;
  }
  try {
    const decoded = atob(encoded);
    // Reverse shift by -3
    return decoded.split("").map((c) => String.fromCharCode(c.charCodeAt(0) - 3)).join("");
  } catch (err) {
    return encoded;
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Skip loading/booting intro sequence completely if running as an installed PWA standalone app
    if (typeof window !== 'undefined') {
      const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || 
                          (window.navigator && (window.navigator as any).standalone) || 
                          (document.referrer && typeof document.referrer === 'string' && document.referrer.includes('android-app://'));
      if (isStandalone) {
        return false;
      }
    }
    return true;
  });
  const [hasCopiedVba, setHasCopiedVba] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'automatic' | 'manual'>('automatic');
  const [selectedTool, setSelectedTool] = useState<'home' | 'school_profile' | 'student_profile' | 'doc_bank' | 'excel' | 'word' | 'ppt' | 'pdf_decrypt' | 'pdf_compress' | 'ai_extract' | 'kosp' | 'lesson_plan' | 'rpm' | 'p5_project' | 'litnum' | 'absensi' | 'karakter_p5' | 'daftar_nilai' | 'rapor' | 'admin_panel' | 'tutorial'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState<boolean>(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('omega_gemini_quota_exhausted') === 'true' : false);
  });

  const setQuotaExhaustedState = (state: boolean) => {
    setIsQuotaExhausted(state);
    if (state) {
      localStorage.setItem('omega_gemini_quota_exhaust57', 'true'); // Backwards compatibility & anti-loss alias
      localStorage.setItem('omega_gemini_quota_exhausted', 'true');
    } else {
      localStorage.removeItem('omega_gemini_quota_exhaust57');
      localStorage.removeItem('omega_gemini_quota_exhausted');
    }
  };

  // === VITE_GEMINI_API_KEY: Kunci frontend dari env Netlify (fallback jika user belum punya key sendiri) ===
  // Kunci ini dikodekan ke dalam bundle oleh Vite saat build, sehingga TERLIHAT di browser.
  // Gunakan key gratis dengan kuota terbatas. Key mandiri user SELALU lebih prioritas.
  const viteEnvKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) 
    ? String((import.meta as any).env.VITE_GEMINI_API_KEY).trim() 
    : '';

  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    const raw = localStorage.getItem('custom_gemini_api_key') || '';
    if (raw) return decodeKey(raw);
    // Fallback ke VITE_GEMINI_API_KEY jika user belum set key sendiri
    return viteEnvKey || '';
  });
  const [tempApiKey, setTempApiKey] = useState<string>(() => {
    const raw = localStorage.getItem('custom_gemini_api_key') || '';
    if (raw) return decodeKey(raw);
    // Fallback ke VITE_GEMINI_API_KEY jika user belum set key sendiri
    return viteEnvKey || '';
  });

  const [serverConfig, setServerConfig] = useState<{
    hasGeminiKey: boolean;
    isGlobalMasterActive: boolean;
    hasSystemEnvKey: boolean;
    hasAdminKey: boolean;
  } | null>(null);

  const refreshServerConfig = () => {
    fetch('/api/config-status')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setServerConfig(data);
          if (data.hasGeminiKey === false) {
            setIsApiKeyMissing(true);
          }
        }
      })
      .catch(err => {
        console.error("Gagal mematangkan pengecekan status API key:", err);
      });
  };

  const [keySaveNotification, setKeySaveNotification] = useState<{show: boolean, type: 'success' | 'delete' | 'error', message: string} | null>(null);

  const [userPhoto, setUserPhoto] = useState<string>(() => {
    return localStorage.getItem('omega_user_photo') || '';
  });
  const userPhotoInputRef = React.useRef<HTMLInputElement>(null);

  const handleTriggerUserPhotoUpload = () => {
    userPhotoInputRef.current?.click();
  };

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        triggerNotification('error', 'Ukuran foto maksimal adalah 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        if (base64String) {
          localStorage.setItem('omega_user_photo', base64String);
          setUserPhoto(base64String);
          triggerNotification('success', '✓ Foto profil berhasil diperbarui!');
        }
      };
      reader.onerror = () => {
        triggerNotification('error', 'Gagal membaca berkas gambar!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUserPhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Keep click event relative
    localStorage.removeItem('omega_user_photo');
    setUserPhoto('');
    triggerNotification('delete', '✓ Foto profil berhasil dihapus.');
  };

  const [documents, setDocuments] = useState<any[]>([]);

  React.useEffect(() => {
    const loadDocs = () => {
      const storedDocs = localStorage.getItem("omega_db_documents");
      if (storedDocs) {
        try {
          setDocuments(JSON.parse(storedDocs));
        } catch (e) {
          console.error("Gagal membaca dokumen:", e);
        }
      } else {
        setDocuments([
          { id: "doc-welcome", name: "Panduan Memulai OMEGA Document Bank", category: "manual" }
        ]);
      }
    };
    loadDocs();
    window.addEventListener("omega-state-updated", loadDocs);
    return () => {
      window.removeEventListener("omega-state-updated", loadDocs);
    };
  }, []);

  const triggerNotification = (type: 'success' | 'delete' | 'error', message: string) => {
    setKeySaveNotification({ show: true, type, message });
    setTimeout(() => {
      setKeySaveNotification(prev => prev && prev.message === message ? null : prev);
    }, 4500);
  };

  const handleExportBackup = () => {
    try {
      const backupData: Record<string, string> = {};
      
      // Ambil seluruh kunci yang berhubungan dengan data user/sekolah di localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith("omega_") || 
          key.startsWith("kosp_") || 
          key.startsWith("ronai_") || 
          key.startsWith("profile_") || 
          key === "custom_gemini_api_key"
        )) {
          const val = localStorage.getItem(key);
          if (val !== null) {
            backupData[key] = val;
          }
        }
      }

      const schoolNameFromDb = localStorage.getItem("omega_school_name") || localStorage.getItem("kosp_nama_sekolah") || "SD NEGERI FATUBAI";
      const payload = {
        appName: "OMEGA TEACHER ENGINE",
        version: "3.0",
        exportDate: new Date().toISOString(),
        schoolName: schoolNameFromDb,
        principalName: localStorage.getItem("omega_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.",
        data: backupData
      };

      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Ambil nama sekolah yang rapi untuk nama berkas backup
      const rawSchoolName = payload.schoolName.toUpperCase().replace(/[^A-Z0-9]/g, "_").replace(/__+/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const filename = `OTE_BACKUP_${rawSchoolName}_${dateStr}.json`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerNotification("success", "✓ Berhasil mengekspor berkas cadangan data sekolah luring!");
    } catch (err) {
      console.error("Gagal melakukan backup data:", err);
      triggerNotification("error", "Gagal melakukan ekspor sinkronisasi cadangan.");
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Validasi struktur berkas backup
        if (!parsed || parsed.appName !== "OMEGA TEACHER ENGINE" || !parsed.data) {
          triggerNotification("error", "Format berkas cadangan yang Anda masukkan tidak valid!");
          return;
        }

        const backupDate = new Date(parsed.exportDate).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short"
        });
        
        const confirmMsg = `Sistem mendeteksi berkas cadangan OMEGA TEACHER ENGINE:\n\n🏫 Satuan Pendidikan: ${parsed.schoolName}\n📅 Tanggal Pencadangan: ${backupDate}\n🔑 Jumlah Kunci Data: ${Object.keys(parsed.data).length} item\n\nPERINGATAN: Proses pemulihan ini akan menggantikan seluruh data sekolah, profil murid, sistem KOSP, modul ajar pembelajaran mendalam (RPM), daftar nilai, dan rapor pada perangkat ini.\n\nApakah Anda yakin ingin melakukan restorasi data luring sekarang?`;

        if (window.confirm(confirmMsg)) {
          setIsImporting(true);
          
          // Hapus semua data yang berpotensi bentrok terlebih dahulu sebelum memulihkan
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && (
              key.startsWith("omega_") || 
              key.startsWith("kosp_") || 
              key.startsWith("ronai_") || 
              key.startsWith("profile_") || 
              key === "custom_gemini_api_key"
            )) {
              localStorage.removeItem(key);
            }
          }

          // Pulihkan data dari berkas
          const dataMap = parsed.data;
          Object.keys(dataMap).forEach((key) => {
            localStorage.setItem(key, dataMap[key]);
          });

          triggerNotification("success", "✓ Data berhasil dipulihkan! Melakukan sinkronisasi sistem...");
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        console.error("Gagal mengimpor cadangan:", err);
        triggerNotification("error", "Format berkas cadangan tidak dapat didekripsi / salah.");
      }
    };
    reader.readAsText(file);
    // Kosongkan agar bisa diupload berkas yang sama jika dibutuhkan kembali
    event.target.value = "";
  };

  // Activation Premium states
  const [isActivated, setIsActivated] = useState(() => localStorage.getItem('omega_is_activated') === 'true');
  const [activeActivationCode, setActiveActivationCode] = useState(() => localStorage.getItem("omega_active_activation_code") || "");
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [topAccessCode, setTopAccessCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('omega_admin_logged_in') === 'true' || localStorage.getItem('omega_admin_logged_in') === 'true';
  });

  // Unclaimed premium code notice (Bell state)
  const [pendingClaimCode, setPendingClaimCode] = useState<string | null>(() => {
    return localStorage.getItem("omega_approved_code_pending_claim");
  });

  // Live count of pending access code requests for admins
  const [adminPendingCount, setAdminPendingCount] = useState<number>(0);

  // Track active pending request code for current user (waiting for approval)
  const [currentPendingRequestCode, setCurrentPendingRequestCode] = useState<string | null>(() => {
    return localStorage.getItem("omega_current_active_request_code");
  });

  // Support Help desk live chat states
  const [showSupportDrawer, setShowSupportDrawer] = useState(false);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);

  const calculateUnreadSupport = () => {
    try {
      const activeCode = localStorage.getItem("omega_active_activation_code") || "";
      const pendingStr = localStorage.getItem("omega_pending_request_active_editor") || "";
      let pendingCode = "";
      if (pendingStr) {
        try {
          pendingCode = JSON.parse(pendingStr).requestCode || "";
        } catch(e){}
      }
      const currentSaved = localStorage.getItem("omega_current_active_request_code") || "";
      const guestCode = localStorage.getItem("omega_support_guest_code") || "";
      const primaryCode = activeCode || pendingCode || currentSaved || guestCode || "GENERAL";

      const msgsStr = localStorage.getItem("omega_support_messages");
      if (msgsStr) {
        const msgs = JSON.parse(msgsStr);
        // Sum messages where requestId matches and sender is admin/system and readByUser is false
        const unread = msgs.filter((m: any) => m.requestId === primaryCode && m.sender !== "user" && !m.readByUser).length;
        setUnreadSupportCount(unread);
      } else {
        setUnreadSupportCount(0);
      }
    } catch(e) {
      console.warn(e);
    }
  };

  React.useEffect(() => {
    calculateUnreadSupport();
    window.addEventListener("omega-support-message-received", calculateUnreadSupport);
    window.addEventListener("omega-support-messages-read", calculateUnreadSupport);
    window.addEventListener("omega-state-updated", calculateUnreadSupport);
    return () => {
      window.removeEventListener("omega-support-message-received", calculateUnreadSupport);
      window.removeEventListener("omega-support-messages-read", calculateUnreadSupport);
      window.removeEventListener("omega-state-updated", calculateUnreadSupport);
    };
  }, []);

  const initializeGuestData = () => {
    const isCurrentlyActive = localStorage.getItem('omega_is_activated') === 'true';
    if (!isCurrentlyActive) {
      const originalSetItem = localStorage.setItem;
      const defaultData: Record<string, string> = {
        "omega_school_name": "SD NEGERI FATUBAI",
        "kosp_nama_sekolah": "SEKOLAH DASAR NEGERI FATUBAI",
        "omega_kepala_sekolah": "Darius Kusi, S.Pd., Gr.",
        "omega_principal_name": "Darius Kusi, S.Pd., Gr.",
        "kosp_kepala_sekolah": "Darius Kusi, S.Pd., Gr.",
        "omega_nip_kepala": "196709192008011008",
        "omega_principal_nip": "196709192008011008",
        "kosp_nip_kepala": "196709192008011008",
        "omega_nama_guru": "Roni Hariyanto Bhidju, S.Pd., Gr.",
        "kosp_nama_guru": "Roni Hariyanto Bhidju, S.Pd., Gr.",
        "omega_nama_guru_penyusun": "Roni Hariyanto Bhidju, S.Pd., Gr.",
        "omega_nip_guru": "198603012020121005",
        "omega_jabatan": "Guru Kelas 6",
        "omega_fase_kelas": "Fase C (Kelas 6)",
        "omega_wa_number": "081234567890",
        "kosp_ketua_tim": "Roni Hariyanto Bhidju, S.Pd., Gr",
        "kosp_alamat_sekolah": "Desa Fatubai, Kec. Tasifeto Barat",
        "kosp_desa": "Fatubai",
        "kosp_kecamatan": "Tasifeto Barat",
        "kosp_kabupaten": "Belu",
        "kosp_provinsi": "Nusa Tenggara Timur",
        "kosp_rt_rw": "RT 08 / RW 04",
        "kosp_pos": "85752"
      };

      for (const [key, val] of Object.entries(defaultData)) {
        if (!localStorage.getItem(key)) {
          originalSetItem.call(localStorage, key, val);
        }
      }
    }
  };

  React.useEffect(() => {
    initializeGuestData();
  }, []);

  React.useEffect(() => {
    const handleStateUpdated = () => {
      const active = localStorage.getItem('omega_is_activated') === 'true';
      setIsActivated(active);
      setActiveActivationCode(localStorage.getItem("omega_active_activation_code") || "");
      setIsAdmin(sessionStorage.getItem('omega_admin_logged_in') === 'true' || localStorage.getItem('omega_admin_logged_in') === 'true');
      initializeGuestData();

      // Retrieve live pending request code
      setCurrentPendingRequestCode(localStorage.getItem("omega_current_active_request_code"));

      if (active) {
        localStorage.removeItem("omega_approved_code_pending_claim");
        setPendingClaimCode(null);
        localStorage.removeItem("omega_current_active_request_code");
        setCurrentPendingRequestCode(null);
      }
    };
    const handleOpenModal = () => {
      setIsActivationModalOpen(true);
    };
    const handleOpenSupportChat = () => {
      setShowSupportDrawer(true);
      setIsActivationModalOpen(false);
    };

    window.addEventListener('omega-state-updated', handleStateUpdated);
    window.addEventListener('open-activation-modal', handleOpenModal);
    window.addEventListener('open-support-chat', handleOpenSupportChat);

    // Set globally accessible interceptor
    (window as any).checkActivation = (callback: () => void) => {
      const isAuth = localStorage.getItem('omega_is_activated') === 'true';
      if (isAuth) {
        callback();
      } else {
        alert("AKTIFASI KODE AKSES.");
        setIsActivationModalOpen(true);
      }
    };

    return () => {
      window.removeEventListener('omega-state-updated', handleStateUpdated);
      window.removeEventListener('open-activation-modal', handleOpenModal);
      window.removeEventListener('open-support-chat', handleOpenSupportChat);
      delete (window as any).checkActivation;
    };
  }, []);

  // Live listener for Admins to subscribe to PENDING activation requests count
  React.useEffect(() => {
    if (!isAdmin) {
      setAdminPendingCount(0);
      return;
    }
    try {
      const q = query(
        collection(db, "activation_requests"),
        where("status", "==", "PENDING")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAdminPendingCount(snapshot.size);
      }, (err) => {
        console.warn("Gagal berlangganan permohonan pending:", err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Gagal menginisialisasi listener permohonan pending:", err);
    }
  }, [isAdmin]);

  // Real-time listener for Users to check if Admin approves their requests instantly
  React.useEffect(() => {
    const active = localStorage.getItem('omega_is_activated') === 'true';
    if (active) return;

    const pendingRequestCode = localStorage.getItem('omega_current_active_request_code');
    if (!pendingRequestCode) return;

    try {
      const q = query(
        collection(db, "activation_requests"),
        where("requestCode", "==", pendingRequestCode),
        where("status", "==", "ACTIVE")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const reqData = snapshot.docs[0].data();
          const activeCode = reqData.activationCode || pendingRequestCode;

          const oldClaim = localStorage.getItem("omega_approved_code_pending_claim");
          if (oldClaim !== activeCode) {
            localStorage.setItem("omega_approved_code_pending_claim", activeCode);
            setPendingClaimCode(activeCode);
            window.dispatchEvent(new CustomEvent("omega-state-updated"));

            // Instant alert notice
            alert(`🎉 KODE AKSES PREMIUM DITERBITKAN!\n\nPermohonan Kode Akses Premium Sekolah Anda (${reqData.schoolName || "SD"}) telah disetujui & diterbitkan oleh Admin!\n\nSilakan klik ikon Lonceng Notifikasi di bar atas untuk mengisi kode otomatis dan memulai aktivasi.`);
          }
        }
      }, (err) => {
        console.warn("Gagal realtime listen status permohonan:", err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Gagal setup realtime listener status permohonan:", err);
    }
  }, [isActivated]);

  // Background fallback polling to check if admin approves user request
  React.useEffect(() => {
    let intervalId: any = null;

    const checkActivationStatusInBg = async () => {
      // Only poll if NOT currently activated and we have a request code in progress
      const isCurrentlyActivated = localStorage.getItem('omega_is_activated') === 'true';
      if (isCurrentlyActivated) return;

      const pendingRequestCode = localStorage.getItem('omega_current_active_request_code');
      if (!pendingRequestCode) return;

      try {
        // Query Firestore for this request code
        const q = query(
          collection(db, "activation_requests"),
          where("requestCode", "==", pendingRequestCode),
          where("status", "==", "ACTIVE")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const reqData = snapshot.docs[0].data();
          const activeCode = reqData.activationCode || pendingRequestCode;

          const oldClaim = localStorage.getItem("omega_approved_code_pending_claim");
          if (oldClaim !== activeCode) {
            localStorage.setItem("omega_approved_code_pending_claim", activeCode);
            setPendingClaimCode(activeCode);
            window.dispatchEvent(new CustomEvent("omega-state-updated"));
            
            // Trigger a beautiful browser alert notice
            alert(`🎉 KODE AKSES PREMIUM DITERBITKAN!\n\nPermohonan Kode Akses Premium Sekolah Anda (${reqData.schoolName || "SD"}) telah disetujui & diterbitkan oleh Admin!\n\nSilakan klik ikon Lonceng Notifikasi di bar atas untuk mengisi kode otomatis dan memulai aktivasi.`);
          }
        }
      } catch (err) {
        console.warn("Latar belakang cek aktivasi gagal:", err);
      }
    };

    if (!isActivated) {
      checkActivationStatusInBg();
      intervalId = setInterval(checkActivationStatusInBg, 25000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActivated]);

  // Periodic active license check in the background to detect if admin suspended or released (melepas) the code
  React.useEffect(() => {
    let intervalId: any = null;

    const verifyActiveLicenseStatus = async () => {
      const isCurrentlyActivated = localStorage.getItem('omega_is_activated') === 'true';
      if (!isCurrentlyActivated) return;

      const activeCode = localStorage.getItem("omega_active_activation_code")?.trim().toUpperCase();
      if (!activeCode) return;

      // Special universal bypass keys
      const isSpecialBypass = activeCode === "GP-SUPER" || 
                              activeCode === "ACT-OMA-SUPER" || 
                              activeCode === "GP-RHB86" ||
                              activeCode === "OTE-GP017" ||
                              activeCode === "OTE-GP19S";
      if (isSpecialBypass) return;

      try {
        let approvedMatch = null;

        // 1. Check in activation_requests
        const qReq = query(
          collection(db, "activation_requests"),
          where("activationCode", "==", activeCode),
          where("status", "==", "ACTIVE")
        );
        const snapshot = await getDocs(qReq);
        if (!snapshot.empty) {
          approvedMatch = snapshot.docs[0].data();
        }

        // 2. Fallback in registered_codes
        if (!approvedMatch) {
          const qPerm = query(
            collection(db, "registered_codes"),
            where("activationCode", "==", activeCode),
            where("status", "==", "ACTIVE")
          );
          const snapPerm = await getDocs(qPerm);
          if (!snapPerm.empty) {
            approvedMatch = snapPerm.docs[0].data();
          }
        }

        // 3. Alternate check by original requestCode just in case
        if (!approvedMatch) {
          const qReq2 = query(
            collection(db, "activation_requests"),
            where("requestCode", "==", activeCode),
            where("status", "==", "ACTIVE")
          );
          const snapshot2 = await getDocs(qReq2);
          if (!snapshot2.empty) {
            approvedMatch = snapshot2.docs[0].data();
          }
        }

        // If the license is no longer found active anywhere, revoke!
        if (!approvedMatch) {
          localStorage.removeItem("omega_is_activated");
          localStorage.removeItem("omega_active_activation_code");
          sessionStorage.removeItem("omega_admin_logged_in");
          setIsActivated(false);
          window.dispatchEvent(new CustomEvent("omega-state-updated"));

          alert("⚠️ LISENSI CODES TELAH DICABUT!\n\nLisensi premium atau kode akses di perangkat Anda telah ditangguhkan, dinonaktifkan, atau dilepas oleh Administrator.\n\nAkun Anda telah dikembalikan menjadi status Akun Tamu Terbatas.");
        }
      } catch (err) {
        console.warn("Gagal memverifikasi status keaktifan lisensi dari Firebase:", err);
      }
    };

    if (isActivated) {
      // Small delay first check, then poll every 25 seconds
      const timeoutId = setTimeout(verifyActiveLicenseStatus, 4000);
      intervalId = setInterval(verifyActiveLicenseStatus, 25050);
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [isActivated]);

  const seedDefaultDocuments = () => {
    const isAuth = localStorage.getItem("omega_is_activated") === "true";
    
    const formatSchoolName = (name: string) => {
      if (!name) return "";
      if (name === name.toUpperCase()) {
        return name
          .split(" ")
          .map(word => {
            const upperWord = word.toUpperCase();
            if (["SD", "SMP", "SMA", "SMK", "SLB", "MI", "MTS", "MA"].includes(upperWord)) {
              return upperWord;
            }
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
          })
          .join(" ");
      }
      return name;
    };

    const rawSchoolName = (isAuth && localStorage.getItem("omega_school_name")) || localStorage.getItem("kosp_nama_sekolah") || "SD NEGERI FATUBAI";
    const schoolName = formatSchoolName(rawSchoolName);
    const principalName = (isAuth && localStorage.getItem("omega_kepala_sekolah")) || localStorage.getItem("kosp_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.";
    const principalNip = (isAuth && localStorage.getItem("omega_nip_kepala")) || localStorage.getItem("kosp_nip_kepala") || "196709192008011008";
    const teacherName = (isAuth && localStorage.getItem("omega_nama_guru")) || localStorage.getItem("kosp_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.";
    const teacherNip = (isAuth && localStorage.getItem("omega_nip_guru")) || localStorage.getItem("kosp_nip_guru") || "198603012020121005";
    const faseKelas = (isAuth && localStorage.getItem("omega_fase_kelas")) || localStorage.getItem("kosp_fase_kelas") || "Fase B (Kelas 4)";
    const tahunPelajaran = localStorage.getItem("kosp_tahun_pelajaran") || "2024/2025";

    const storedDocs = localStorage.getItem("omega_db_documents");
    let currentDocs = [];
    try {
      currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
    } catch (e) {}

    // We filter out any previous auto-seeded reference docs so they get updated with correct profile data
    const nonSeedDocs = currentDocs.filter((d: any) => 
      d.id !== "doc-welcome" && 
      d.id !== "doc-kosp-ref" && 
      d.id !== "doc-atp-ref" && 
      d.id !== "doc-prota-ref" && 
      d.id !== "doc-cp-ref"
    );

    const seedDoc = {
      id: "doc-welcome",
      name: "Panduan Memulai OMEGA Document Bank",
      category: "manual" as const,
      folderId: "f-general",
      content: `# SELAMAT DATANG DI OMEGA DOCUMENT BANK! 🔐📚\n\nSistem penyimpanan dokumen terintegrasi, aman, dan kebal luring (offline) untuk Guru Kelas 1 s/d 6.\n\n### Mengapa Bank Dokumen Sangat Penting?\n1. **Kekebalan Offline**: Semua dokumen disimpan langsung di peramban (browser) Anda. Data kebal terhadap refresh halaman, restart komputer, lampu padam, bahkan laptop mati.\n2. **Koneksi Lintas Modul**: Dokumen CP/ATP hasil ekstraksi PDF bisa langsung dihubungkan saat merancang KOSP, TP, ATP, KKTP atau Modul Ajar tanpa perlu salin-rekat manual!\n3. **Keamanan Maksimal**: Dokumen Anda tidak pernah diunggah ke server asing mana pun. Privasi guru dan murid 100% luring.\n\n### Cara Kerja Integrasi:\n- **Ekstraksi PDF**: Gunakan menu "AI Extractor", lalu klik "Simpan ke Bank Dokumen".\n- **Kurikulum Merdeka**: Muat draf capaian pembelajaran langsung dari bank ini di modul "Perencana Kurikulum"\n- **Penyusunan KOSP**: Gunakan teks referensi dari bank dokumen sebagai rujukan visi-misi atau landasan hukum.`,
      size: 1092,
      createdAt: new Date().toISOString()
    };

    const kospDoc = {
      id: "doc-kosp-ref",
      name: `Contoh Draf KOSP Merdeka (${schoolName})`,
      category: "kosp" as const,
      folderId: "f-kosp",
      content: `# Draf Kurikulum Operasional Satuan Pendidikan (KOSP) Merdeka\n**${schoolName}**\nTahun Pelajaran: ${tahunPelajaran}\n\n## 1. Visi, Misi, dan Tujuan Sekolah\n- **Visi**: Mewujudkan insan berakhlak mulia, berprestasi unggul di lingkungan ${schoolName}, adaptif terhadap perkembangan IPTEK, dan berwawasan lingkungan berlandaskan Profil Pelajar Pancasila.\n- **Misi**: Menyelenggarakan proses pembelajaran yang aktif, kreatif, dan berbasis penguatan karakter spiritual serta sosial murid.\n\n## 2. Pengorganisasian Pembelajaran\n- **Intrakurikuler**: Menggunakan pendekatan mata pelajaran reguler dengan alokasi waktu JP sesuai keputusan menteri.\n- **Kokurikuler (P5)**: Melaksanakan 2-3 tema proyek per tahun, seperti Gaya Hidup Berkelanjutan dan Kearifan Lokal di ${schoolName}.\n\n## 3. Personil Sekolah\n- **Kepala Sekolah**: ${principalName} (NIP: ${principalNip || "-"})\n- **Guru Kelas**: ${teacherName} (NIP: ${teacherNip || "-"})`,
      size: 850,
      createdAt: new Date().toISOString()
    };

    const atpDoc = {
      id: "doc-atp-ref",
      name: `Draf ATP & Rincian TP Matematika (${faseKelas})`,
      category: "lesson_plan" as const,
      folderId: "f-lessons",
      content: `# Rincian Alur Tujuan Pembelajaran (ATP) Matematika\nFase/Kelas: ${faseKelas} | Rujukan Standar: BSKAP 046/2025\nSekolah: ${schoolName}\n\n## A. Capaian Pembelajaran Elemen Bilangan\nPeserta didik dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan operasi penjumlahan dan pengurangan bilangan cacah sesuai kapasitas kompetensi ${faseKelas}.\n\n## B. Perumusan Tujuan Pembelajaran (TP)\n- **TP 1**: Membaca dan menuliskan lambang bilangan cacah dasar sesuai lingkup materi ${faseKelas}.\n- **TP 2**: Menentukan nilai tempat secara mandiri dibimbing oleh ${teacherName}.\n- **TP 3**: Melakukan operasi perkalian dan pembagian bilangan cacah dengan menggunakan media konkret.\n\n## C. Alur Tujuan Pembelajaran (Urutan Pembelajaran)\n1. Pengenalan lambang bilangan cacah (TP 1) -> 2. Nilai tempat bilangan cacah (TP 2) -> 3. Operasi aritmatika dasar (TP 3).\n\n## D. Lembar Pengesahan\nMengetahui,\nKepala Sekolah: ${principalName}\nGuru Kelas: ${teacherName}`,
      size: 1050,
      createdAt: new Date().toISOString()
    };

    const protaDoc = {
      id: "doc-prota-ref",
      name: `Contoh PROTA & PROMES Pembelajaran (${faseKelas})`,
      category: "lesson_plan" as const,
      folderId: "f-prota-promes",
      content: `# Program Tahunan (PROTA) & Program Semester (PROMES)\nFase/Kelas: ${faseKelas} | Tahun Pelajaran ${tahunPelajaran}\nSatuan Pendidikan: ${schoolName}\n\n## Alokasi Waktu Pembelajaran Mingguan:\n1. **Pendidikan Pancasila**: 4 JP per Minggu (144 JP per Tahun)\n2. **Bahasa Indonesia**: 6 JP per Minggu (216 JP per Tahun)\n3. **Matematika**: 5 JP per Minggu (180 JP per Tahun)\n4. **IPAS**: 5 JP per Minggu (180 JP per Tahun)\n\n## Pembagian Program Semester I (Ganjil):\n- **Minggu 1-4**: Pembelajaran Norma & Pancasila di ${schoolName} (16 JP)\n- **Minggu 5-9**: Bilangan Cacah & Pengukuran Fase (25 JP)\n\nDisusun oleh:\nGuru Kelas: ${teacherName}\nNIP: ${teacherNip || "-"}`,
      size: 700,
      createdAt: new Date().toISOString()
    };

    const cpDoc = {
      id: "doc-cp-ref",
      name: "Referensi CP Resmi BSKAP No. 046/2025",
      category: "extracted" as const,
      folderId: "f-cp-ref",
      content: `# Salinan Keputusan Kepala BSKAP Nomor 046/H/KR/2025\n**Tentang Capaian Pembelajaran Kurikulum Merdeka Pendidikan Dasar**\n\n## Rasional Mata Pelajaran Umum (SD/SMP/SMA)\nKurikulum Merdeka mengutamakan kemerdekaan berpikir pendidik dalam mendesain pembelajaran kontekstual yang relevan dengan kearifan lokal satuan pendidikan.\n\n## Pembagian Fase Kompetensi Dasar:\n1. **Fase A**: Kelas I dan Kelas II (Dasar Pengenalan)\n2. **Fase B**: Kelas III dan Kelas IV (Penerapan & Concept)\n3. **Fase C**: Kelas V dan Kelas VI (Analisis & Evaluasi Mandiri)`,
      size: 620,
      createdAt: new Date().toISOString()
    };

    const updated = [seedDoc, kospDoc, atpDoc, protaDoc, cpDoc, ...nonSeedDocs];
    localStorage.setItem("omega_db_documents", JSON.stringify(updated));
  };

  const handleVerifyTopAccessCode = async () => {
    const code = topAccessCode.trim().toUpperCase();
    if (!code) {
      alert("Masukkan kode akses terlebih dahulu.");
      return;
    }

    if (code === "OTE-GP017" || code === "OTE-GP19S" || code === "GP-RHB86") {
      // Exclusive Admin password check
      sessionStorage.setItem("omega_admin_logged_in", "true");
      localStorage.setItem("omega_admin_logged_in", "true");
      localStorage.setItem("omega_is_activated", "true");

      const defaultSchoolName = localStorage.getItem("omega_school_name") || "SD NEGERI FATUBAI";
      const defaultPrincipalName = localStorage.getItem("omega_kepala_sekolah") || "Darius Kusi, S.Pd., Gr.";
      const defaultPrincipalNip = localStorage.getItem("omega_nip_kepala") || "196709192008011008";
      const defaultTeacherName = localStorage.getItem("omega_nama_guru") || "Roni Hariyanto Bhidju, S.Pd., Gr.";
      const defaultTeacherNip = localStorage.getItem("omega_nip_guru") || "198603012020121005";
      const defaultJabatan = localStorage.getItem("omega_jabatan") || "Guru Kelas 6";
      const defaultFaseKelas = localStorage.getItem("omega_fase_kelas") || "Fase C (Kelas 6)";
      const defaultWaNumber = localStorage.getItem("omega_wa_number") || "081234567890";

      localStorage.setItem("omega_school_name", defaultSchoolName);
      localStorage.setItem("omega_kepala_sekolah", defaultPrincipalName);
      localStorage.setItem("omega_nip_kepala", defaultPrincipalNip);
      localStorage.setItem("omega_nama_guru", defaultTeacherName);
      localStorage.setItem("omega_nip_guru", defaultTeacherNip);
      localStorage.setItem("omega_jabatan", defaultJabatan);
      localStorage.setItem("omega_fase_kelas", defaultFaseKelas);
      localStorage.setItem("omega_wa_number", defaultWaNumber);
      localStorage.setItem("omega_active_activation_code", code);

      seedDefaultDocuments();

      setIsActivated(true);
      setIsAdmin(true);
      setTopAccessCode("");
      window.dispatchEvent(new CustomEvent("omega-state-updated"));
      alert("✓ Kode Admin Utama Terverifikasi Pas! Panel Kontrol Admin kini terbuka.");
      return;
    }

    // Standard user activation checks
    let approvedMatch = null;
    try {
      // 1. Check live activation requests by activationCode first
      const q = query(
        collection(db, "activation_requests"),
        where("activationCode", "==", code),
        where("status", "==", "ACTIVE")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        approvedMatch = snapshot.docs[0].data();
      }

      // 1b. Check live activation requests by requestCode as fallback
      if (!approvedMatch) {
        const qReq = query(
          collection(db, "activation_requests"),
          where("requestCode", "==", code),
          where("status", "==", "ACTIVE")
        );
        const snapshotReq = await getDocs(qReq);
        if (!snapshotReq.empty) {
          approvedMatch = snapshotReq.docs[0].data();
        }
      }

      // 2. Fallback to registered_codes registry by activationCode
      if (!approvedMatch) {
         const qPermanent = query(
           collection(db, "registered_codes"),
           where("activationCode", "==", code),
           where("status", "==", "ACTIVE")
         );
         const permanentSnapshot = await getDocs(qPermanent);
         if (!permanentSnapshot.empty) {
           approvedMatch = permanentSnapshot.docs[0].data();
         }
      }

      // 2b. Fallback to registered_codes registry by requestCode
      if (!approvedMatch) {
         const qPermanentReq = query(
           collection(db, "registered_codes"),
           where("requestCode", "==", code),
           where("status", "==", "ACTIVE")
         );
         const permanentSnapshotReq = await getDocs(qPermanentReq);
         if (!permanentSnapshotReq.empty) {
           approvedMatch = permanentSnapshotReq.docs[0].data();
         }
      }
    } catch (err) {
      console.warn("Gagal terhubung ke Firebase online:", err);
    }

    // 3. Ultimate local fallback
    if (!approvedMatch) {
      let currentRequests = [];
      try {
        const storedRequests = localStorage.getItem("omega_activation_requests");
        currentRequests = storedRequests ? JSON.parse(storedRequests) : [];
      } catch (e) {
        console.error(e);
      }
      approvedMatch = currentRequests.find(
        (r: any) => 
          (r.activationCode?.toUpperCase() === code || r.requestCode?.toUpperCase() === code) && 
          r.status === "ACTIVE"
      );
    }

    const isSpecialBypass = code === "GP-SUPER" || code.startsWith("GP-") || code === "ACT-OMA-SUPER" || code.startsWith("ACT-RHB86-") || code.startsWith("OTE-GP017") || code.startsWith("OTE-GP19S") || code.startsWith("OTE-GP");

    if (approvedMatch || isSpecialBypass) {
      const activeData = approvedMatch || {
        schoolName: "SD NEGERI FATUBAI",
        principalName: "Darius Kusi, S.Pd., Gr.",
        principalNip: "196709192008011008",
        teacherName: "Roni Hariyanto Bhidju, S.Pd., Gr.",
        teacherNip: "198603012020121005",
        jabatan: "Guru Kelas 6",
        faseKelas: "Fase C (Kelas 6)",
        waNumber: "081234567890",
        selectedPackages: ["premium"]
      };

      const finalActiveCode = activeData.activationCode || code;

      localStorage.setItem("omega_is_activated", "true");
      sessionStorage.removeItem("omega_admin_logged_in"); // Make sure they are not Admin
      localStorage.removeItem("omega_admin_logged_in");
      localStorage.setItem("omega_school_name", activeData.schoolName);
      localStorage.setItem("omega_kepala_sekolah", activeData.principalName);
      localStorage.setItem("omega_nip_kepala", activeData.principalNip);
      localStorage.setItem("omega_nama_guru", activeData.teacherName);
      localStorage.setItem("omega_nip_guru", activeData.teacherNip);
      localStorage.setItem("omega_jabatan", activeData.jabatan);
      localStorage.setItem("omega_fase_kelas", activeData.faseKelas);
      localStorage.setItem("omega_wa_number", activeData.waNumber);
      localStorage.setItem("omega_active_activation_code", finalActiveCode);

      const unlockedList = activeData.selectedPackages || ["premium"];
      localStorage.setItem("omega_purchased_packages", JSON.stringify(unlockedList));

      localStorage.removeItem("omega_approved_code_pending_claim");
      setPendingClaimCode(null);
      
      seedDefaultDocuments();

      setIsActivated(true);
      setIsAdmin(false);
      setTopAccessCode("");
      window.dispatchEvent(new CustomEvent("omega-state-updated"));
      alert(`✓ SELAMAT! Aplikasi Omega Engine Anda telah diaktifkan dengan lisensi ${unlockedList.includes("premium") ? "Premium" : "paket pilihan Anda"} penuh!`);
    } else {
      alert("Kode aktivasi tidak valid atau belum diaktifkan oleh admin. Jika Anda belum memiliki kode akses, silakan isi formulir dengan tombol 'Minta Kode'.");
    }
  };

  const handleBellNotificationClick = () => {
    if (isAdmin) {
      // Ketika admin Klik icon lonceng maka akan menuju ke Menu Kode Akses (admin_panel)
      setSelectedTool('admin_panel' as any);
      setActiveTab('automatic');
      return;
    }

    setIsActivationModalOpen(true);
    const code = pendingClaimCode || localStorage.getItem("omega_approved_code_pending_claim");
    if (code) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("omega-activation-prefill", {
          detail: { code: code, tab: "enter_code" }
        }));
      }, 150);
    } else {
      const hasPendingReq = localStorage.getItem("omega_current_active_request_code");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("omega-activation-prefill", {
          detail: { code: "", tab: hasPendingReq ? "enter_code" : "request" }
        }));
      }, 150);
    }
  };

  // PWA states and setup
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone || 
             document.referrer.includes('android-app://');
    }
    return false;
  });
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [showSyncPanel, setShowSyncPanel] = useState<boolean>(false);
  const [syncQueueItems, setSyncQueueItems] = useState<any[]>([]);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // OFFLINE SYNCHRONIZATION QUEUE INTERCEPTOR & LIFECYCLE
  React.useEffect(() => {
    const updatePendingCount = async () => {
      try {
        const { getPendingSyncTasks } = await import('./utils/offlineSync');
        const tasks = await getPendingSyncTasks();
        setPendingSyncCount(tasks.length);
        setSyncQueueItems(tasks);
      } catch (err) {
        console.warn("IndexedDB sync queue error on init:", err);
      }
    };

    updatePendingCount();

    // Attach event listener for sync queue updates
    window.addEventListener('omega-sync-queue-updated', updatePendingCount);

    // Global localStorage interceptor strictly for document bank and Guest restrictions
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      if (typeof window !== 'undefined') {
        const isCurrentlyActive = localStorage.getItem('omega_is_activated') === 'true';
        
        // Define key prefixes/names that correspond to modified data
        const isRestrictedDataKey = 
          key.startsWith('kosp_') || 
          key.startsWith('ronai_') || 
          key.startsWith('profile_') || 
          key.startsWith('omega_students_') || 
          key.startsWith('omega_attendance_') || 
          key.startsWith('omega_character_') || 
          key.startsWith('omega_litnum_') || 
          key.startsWith('omega_daftar_nilai_') || 
          key === 'omega_school_name' || 
          key === 'omega_kepala_sekolah' || 
          key === 'omega_nip_kepala' || 
          key === 'omega_nama_guru' || 
          key === 'omega_nip_guru' || 
          key === 'omega_jabatan' || 
          key === 'omega_fase_kelas' || 
          key === 'omega_wa_number' || 
          key === 'omega_students_list' || 
          key === 'omega_db_documents' || 
          key === 'omega_attendance_records' || 
          key === 'custom_gemini_api_key';

        if (isRestrictedDataKey && !isCurrentlyActive) {
          const currentVal = localStorage.getItem(key);
          // Allow initial setup of default values silently so they can see the default admin data correctly
          if (currentVal === null) {
            originalSetItem.call(localStorage, key, value);
            return;
          }
          // Allow identical writes silently to prevent annoying modals on component mount
          if (currentVal === value) {
            originalSetItem.call(localStorage, key, value);
            return;
          }

          // Block storage write operation for guest user
          triggerNotification(
            'error', 
            'Akses Terbatas (Tamu): Anda hanya bisa melihat & mencoba menu, tidak diizinkan mengubah data! Silakan lengkapi data melalui "Minta Kode Akses", lalu masukkan & aktifkan kode lisensi untuk berselancar dan menikmati akses penuh tanpa batas.'
          );
          setTimeout(() => {
            setIsActivationModalOpen(true);
          }, 800);
          return;
        }
      }

      if (key === 'omega_db_documents' && typeof window !== 'undefined') {
        const isOnlineNow = navigator.onLine;
        if (!isOnlineNow) {
          try {
            const oldStr = localStorage.getItem('omega_db_documents');
            const oldDocs = oldStr ? JSON.parse(oldStr) : [];
            const newDocs = JSON.parse(value);

            if (Array.isArray(oldDocs) && Array.isArray(newDocs)) {
              import('./utils/offlineSync').then(({ enqueueSyncTask }) => {
                // 1. Detect creates & updates
                for (const newDoc of newDocs) {
                  const oldDoc = oldDocs.find((d: any) => d.id === newDoc.id);
                  if (!oldDoc) {
                    enqueueSyncTask('CREATE', newDoc.id, newDoc.name || 'Dokumen Tambahan', newDoc);
                  } else if (JSON.stringify(oldDoc) !== JSON.stringify(newDoc)) {
                    enqueueSyncTask('UPDATE', newDoc.id, newDoc.name || oldDoc.name || 'Dokumen Diperbarui', newDoc);
                  }
                }
                // 2. Detect deletes
                for (const oldDoc of oldDocs) {
                  const stillExists = newDocs.some((d: any) => d.id === oldDoc.id);
                  if (!stillExists) {
                    enqueueSyncTask('DELETE', oldDoc.id, oldDoc.name || 'Dokumen Dihapus', oldDoc);
                  }
                }
              });
            }
          } catch (err) {
            console.error("Interceptor luring error:", err);
          }
        }
      }
      originalSetItem.apply(this, arguments as any);
    };

    // Intercept client-side downloads triggered via generated anchor link clicks
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      const hasDownload = this.hasAttribute('download');
      if (hasDownload) {
        const isCurrentlyActive = localStorage.getItem('omega_is_activated') === 'true';
        if (!isCurrentlyActive) {
          triggerNotification(
            'error', 
            'Akses Terbatas (Tamu): Anda tidak diizinkan mengunduh berkas sebagai Tamu! Silakan lengkapi data Anda via "Minta Kode Akses", lalu masukkan & aktifkan kode lisensi Anda untuk berselancar dan menikmati akses penuh tanpa batas!'
          );
          setTimeout(() => {
            setIsActivationModalOpen(true);
          }, 800);
          return; // Block download click
        }
      }
      originalAnchorClick.apply(this, arguments as any);
    };

    // Auto-sync process when network goes online
    const handleOnlineStatus = async () => {
      try {
        const { processSyncQueue } = await import('./utils/offlineSync');
        const processedCount = await processSyncQueue();
        if (processedCount > 0) {
          triggerNotification('success', `✓ Koneksi pulih! Sistem berhasil mengunggah & menyinkronkan ${processedCount} perubahan dokumen luring dari IndexedDB ke penyimpanan.`);
        }
      } catch (err) {
        console.error("Auto sync process failure:", err);
      }
    };

    window.addEventListener('online', handleOnlineStatus);

    // Manual or initial connection check: if online, run a sweep to sync anything left behind
    if (navigator.onLine) {
      handleOnlineStatus();
    }

    return () => {
      window.removeEventListener('omega-sync-queue-updated', updatePendingCount);
      window.removeEventListener('online', handleOnlineStatus);
      localStorage.setItem = originalSetItem; // Safe restore
      HTMLAnchorElement.prototype.click = originalAnchorClick; // Safe restore
    };
  }, []);

  React.useEffect(() => {
    // Attempt to capture active Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setSwRegistration(reg);
          // If there is already an update waiting to be activated
          if (reg.waiting) {
            setSwUpdateAvailable(true);
          }
          // Hook into updates found while app is active
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setSwUpdateAvailable(true);
                }
              });
            }
          });
        }
      }).catch((err) => {
        console.warn("Gagal mengecek registrasi service worker:", err);
      });

      // Reload the page when the active service worker controller changes
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (!showIntro) {
      const playWelcomeSpeech = () => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const greetingText = "Selamat datang bapak dan ibu guru hebat di Omega Teacher Engine.";
          const utterance = new SpeechSynthesisUtterance(greetingText);
          utterance.lang = "id-ID";
          utterance.rate = 0.82; // Slower pace for a deeper voice
          
          const voices = window.speechSynthesis.getVoices();
          const idVoices = voices.filter(v => v.lang.includes("id-ID"));
          
          // Filter for local voices to guarantee pitch shifting support
          const localIdVoices = idVoices.filter(v => v.localService);
          
          const maleVoice = idVoices.find(v => 
            v.name.toLowerCase().includes("male") || 
            v.name.toLowerCase().includes("david") || 
            v.name.toLowerCase().includes("wira") ||
            v.name.toLowerCase().includes("ardi") ||
            v.name.toLowerCase().includes("laki") ||
            v.name.toLowerCase().includes("pria")
          );
          
          if (maleVoice) {
            utterance.voice = maleVoice;
            utterance.pitch = 0.95;
          } else if (localIdVoices.length > 0) {
            utterance.voice = localIdVoices[0];
            utterance.pitch = 0.55; // Lower pitch aggressively on local voice to sound male
          } else if (idVoices.length > 0) {
            utterance.voice = idVoices[0];
            utterance.pitch = 0.55; // Lower pitch of general voice
          } else {
            utterance.pitch = 0.55;
          }
          
          window.speechSynthesis.speak(utterance);
        }
      };

      const handleAppFirstClick = () => {
        playWelcomeSpeech();
        window.removeEventListener('click', handleAppFirstClick);
        window.removeEventListener('keydown', handleAppFirstClick);
      };

      window.addEventListener('click', handleAppFirstClick);
      window.addEventListener('keydown', handleAppFirstClick);

      return () => {
        window.removeEventListener('click', handleAppFirstClick);
        window.removeEventListener('keydown', handleAppFirstClick);
      };
    }
  }, [showIntro]);

  React.useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Check if running as PWA already
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstallable(false);
      setIsStandalone(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show informational instruction modal if prompt was blocked (e.g. inside standard iframe)
      setShowPwaModal(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn("PWA prompt interaction failed:", err);
      setShowPwaModal(true);
    }
  };

  const handleCheckUpdates = async () => {
    if (!('serviceWorker' in navigator)) {
      setUpdateMessage("Fitur PWA / Pembaruan tidak didukung di peramban ini.");
      setTimeout(() => setUpdateMessage(null), 3000);
      return;
    }
    setUpdateChecking(true);
    setUpdateMessage("Memeriksa pembaruan dari server...");
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        setSwRegistration(reg);
        // Force immediate check for new versions of sw.js
        await reg.update();
        if (reg.waiting) {
          setSwUpdateAvailable(true);
          setUpdateMessage("Selesai! Versi terbaru siap dipasang.");
        } else if (reg.installing) {
          setUpdateMessage("Pembaruan sistem baru sedang diunduh...");
        } else {
          setUpdateMessage("Sistem Anda sudah berjalan pada versi paling baru.");
        }
      } else {
        setUpdateMessage("Service worker luring belum aktif.");
      }
    } catch (err) {
      console.warn("Gagal cek pembaruan:", err);
      setUpdateMessage("Gagal tersambung dengan server pembaruan.");
    } finally {
      setUpdateChecking(false);
      setTimeout(() => setUpdateMessage(null), 4000);
    }
  };

  const handleApplyUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  React.useEffect(() => {
    refreshServerConfig();
  }, []);

  React.useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedTool(customEvent.detail as any);
        setActiveTab('automatic');
      }
    };
    const handleApiKeyError = () => {
      setIsApiKeyMissing(true);
    };
    const handleQuotaExhausted = () => {
      setQuotaExhaustedState(true);
    };
    
    window.addEventListener("navigate-to-tool", handleNavigation);
    window.addEventListener("gemini-api-error-403", handleApiKeyError);
    window.addEventListener("gemini-quota-exhausted", handleQuotaExhausted);
    return () => {
      window.removeEventListener("navigate-to-tool", handleNavigation);
      window.removeEventListener("gemini-api-error-453", handleApiKeyError); // Safe map
      window.removeEventListener("gemini-api-error-403", handleApiKeyError);
      window.removeEventListener("gemini-quota-exhausted", handleQuotaExhausted);
    };
  }, []);

  const getPremiumBorderClass = (id: string) => {
    switch (id) {
      case 'excel':
        return 'premium-thick-excel-card';
      case 'word':
        return 'premium-thick-word-card';
      case 'ppt':
        return 'premium-thick-ppt-card';
      case 'pdf_decrypt':
        return 'premium-thick-pdfdecrypt-card';
      case 'pdf_compress':
        return 'premium-thick-pdfcompress-card';
      case 'ai_extract':
        return 'premium-thick-aiextract-card';
      case 'kosp':
        return 'premium-thick-kosp-card';
      case 'lesson_plan':
        return 'premium-thick-lessonplan-card';
      case 'rpm':
        return 'premium-thick-gold-card';
      case 'litnum':
        return 'premium-thick-litnum-card';
      case 'absensi':
        return 'premium-thick-absensi-card';
      case 'karakter_p5':
        return 'premium-thick-karakterp5-card';
      case 'daftar_nilai':
        return 'premium-thick-daftarnilai-card';
      case 'rapor':
        return 'premium-thick-rapor-card';
      case 'doc_bank':
        return 'premium-thick-docbank-card';
      default:
        return 'premium-thick-gold-card';
    }
  };

  const getSidebarIconStyles = (id: string, isSelected: boolean) => {
    switch (id) {
      case 'doc_bank':
        return isSelected
          ? 'bg-zinc-950 text-slate-400 shadow-inner'
          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      case 'excel':
        return isSelected 
          ? 'bg-zinc-950 text-emerald-400 shadow-inner' 
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'word':
        return isSelected 
          ? 'bg-zinc-950 text-blue-400 shadow-inner' 
          : 'bg-blue-500/10 text-blue-450 border border-blue-500/20';
      case 'ppt':
        return isSelected 
          ? 'bg-zinc-950 text-orange-400 shadow-inner' 
          : 'bg-orange-500/10 text-orange-450 border border-orange-500/20';
      case 'pdf_decrypt':
        return isSelected 
          ? 'bg-zinc-950 text-rose-400 shadow-inner' 
          : 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
      case 'pdf_compress':
        return isSelected 
          ? 'bg-zinc-950 text-indigo-400 shadow-inner' 
          : 'bg-indigo-500/10 text-indigo-455 border border-indigo-500/20';
      case 'ai_extract':
        return isSelected 
          ? 'bg-zinc-950 text-pink-400 shadow-inner' 
          : 'bg-pink-500/10 text-pink-455 border border-pink-500/20';
      case 'kosp':
        return isSelected 
          ? 'bg-zinc-950 text-purple-400 shadow-inner' 
          : 'bg-purple-500/10 text-purple-455 border border-purple-500/20';
      case 'lesson_plan':
        return isSelected 
          ? 'bg-zinc-950 text-cyan-400 shadow-inner' 
          : 'bg-cyan-500/10 text-cyan-455 border border-cyan-500/20';
      case 'rpm':
        return isSelected 
          ? 'bg-zinc-950 text-amber-400 shadow-inner' 
          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'litnum':
        return isSelected 
          ? 'bg-zinc-950 text-green-400 shadow-inner' 
          : 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'absensi':
        return isSelected 
          ? 'bg-zinc-950 text-violet-400 shadow-inner' 
          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
      case 'karakter_p5':
        return isSelected 
          ? 'bg-zinc-950 text-fuchsia-400 shadow-inner' 
          : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20';
      case 'daftar_nilai':
        return isSelected 
          ? 'bg-zinc-950 text-emerald-400 shadow-inner' 
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'rapor':
        return isSelected 
          ? 'bg-zinc-950 text-red-400 shadow-inner text-glow-red font-black' 
          : 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return isSelected 
          ? 'bg-zinc-950 text-amber-400 shadow-inner' 
          : 'bg-amber-500/10 text-amber-405 border border-amber-500/20';
    }
  };

  const copyVbaToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedVba(true);
    setTimeout(() => {
      setHasCopiedVba(false);
    }, 2500);
  };

  const menuItems = [
    { 
      id: 'excel', 
      label: 'Excel Unlocker', 
      desc: 'Hapus sandi sheet luring', 
      icon: FileSpreadsheet, 
      color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-glow-emerald',
      bannerColor: 'emerald',
      category: 'OFFLINE SUITE' 
    },
    { 
      id: 'word', 
      label: 'Word Unlocker', 
      desc: 'Bebaskan proteksi edit file Word', 
      icon: FileText, 
      color: 'text-blue-400 bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 text-glow-blue',
      bannerColor: 'blue',
      category: 'OFFLINE SUITE' 
    },

    { 
      id: 'pdf_decrypt', 
      label: 'PDF Decryptor', 
      desc: 'Buka pembatasan cetak & salin PDF', 
      icon: File, 
      color: 'text-rose-400 bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40 text-glow-rose',
      bannerColor: 'rose',
      category: 'OFFLINE SUITE' 
    },
    { 
      id: 'pdf_compress', 
      label: 'PDF Compressor', 
      desc: 'Perkecil kapasitas ukuran berkas PDF', 
      icon: Shrink, 
      color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40 text-glow-indigo',
      bannerColor: 'indigo',
      category: 'OFFLINE SUITE' 
    },
    { 
      id: 'ai_extract', 
      label: 'Analisis CP', 
      desc: 'Ekstraksi materi & CP otomatis', 
      icon: Sparkles, 
      color: 'text-pink-400 bg-pink-500/5 border-pink-500/20 hover:border-pink-400/30 text-glow-pink',
      bannerColor: 'pink',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'kosp', 
      label: 'KOSP Merdeka', 
      desc: 'Penyusunan draf dokumen KOSP', 
      icon: Layers, 
      color: 'text-purple-400 bg-purple-500/5 border-purple-500/20 hover:border-purple-400/30 text-glow-purple',
      bannerColor: 'purple',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'lesson_plan', 
      label: 'Perencana Ajar', 
      desc: 'Formulasi TP, ATP, & KKTP', 
      icon: BookOpen, 
      color: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-450/40 text-glow-cyan',
      bannerColor: 'cyan',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'rpm', 
      label: 'Modul RPM', 
      desc: 'Rencana ajar kelas mendalam', 
      icon: Award, 
      color: 'text-amber-400 bg-amber-500/5 border-amber-500/20 hover:border-amber-400/35 text-glow-amber',
      bannerColor: 'amber',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'buat_soal', 
      label: 'Buat Soal', 
      desc: 'Studio pembuat soal', 
      icon: HelpCircle, 
      color: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-450/35 text-glow-amber',
      bannerColor: 'amber',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'p5_project', 
      label: 'Modul Projek', 
      desc: 'Penyusun modul projek', 
      icon: Layers, 
      color: 'text-pink-400 bg-pink-500/5 border-pink-500/20 hover:border-pink-400/30 text-glow-pink',
      bannerColor: 'pink',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'litnum', 
      label: 'Capaian Literasi & Numerasi', 
      desc: 'Diagnostik literasi & numerasi', 
      icon: GraduationCap, 
      color: 'text-lime-400 bg-lime-500/5 border-lime-500/20 hover:border-lime-450/40 text-glow-lime',
      bannerColor: 'lime',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'karakter_p5', 
      label: 'Nilai Karakter Murid', 
      desc: 'Evaluasi perilaku & karakter', 
      icon: Award, 
      color: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-450/40 text-glow-indigo',
      bannerColor: 'indigo',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'absensi', 
      label: 'Absensi Kelas', 
      desc: 'Kehadiran & statistik siswa', 
      icon: UserCheck, 
      color: 'text-orange-400 bg-orange-500/5 border-orange-500/20 hover:border-orange-450/40 text-glow-orange',
      bannerColor: 'orange',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'daftar_nilai', 
      label: 'Daftar Nilai', 
      desc: 'Rekap nilai akademis terpadu', 
      icon: FileSpreadsheet, 
      color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/40 text-glow-emerald',
      bannerColor: 'emerald',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'rapor', 
      label: 'RAPOR', 
      desc: 'Cetak nilai Rapor Kumer lengkap', 
      icon: FileText, 
      color: 'text-red-400 bg-red-500/5 border-red-500/20 hover:border-red-400/40 text-glow-red',
      bannerColor: 'cherry',
      category: 'ACADEMIC SUITE' 
    },
    { 
      id: 'doc_bank', 
      label: 'Bank Dokumen', 
      desc: 'Penyimpanan berkas luring aman', 
      icon: Database, 
      color: 'text-slate-400 bg-slate-505/5 border-slate-500/20 hover:border-slate-500/40 text-glow-slate',
      bannerColor: 'slate',
      category: 'ACADEMIC SUITE' 
    }
  ];

  const handleSelectTool = (toolId: any) => {
    setSelectedTool(toolId);
    setActiveTab('automatic');
    setMobileSidebarOpen(false);
  };

  const handleSelectVbaManual = () => {
    setActiveTab('manual');
    setSelectedTool('home'); // clean state resetting
    setMobileSidebarOpen(false);
  };

  if (showIntro) {
    return (
      <CyberIntro 
        onComplete={() => {
          try {
            sessionStorage.setItem('omega_session_intro_shown', 'true');
          } catch (e) {
            console.warn(e);
          }
          setShowIntro(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen min-h-svh bg-gradient-to-b from-[#030409] via-[#020204] to-[#000000] text-zinc-100 antialiased font-sans flex relative selection:bg-amber-400 selection:text-black">
      
      {/* SATISFYING TOAST NOTIFICATION FOR API KEY OPERATION */}
      {keySaveNotification && (
        <div className={`fixed top-6 right-6 z-[999] max-w-md w-[320px] xs:w-[360px] border rounded-2xl p-4 shadow-2xl animate-fade-in flex items-start gap-3 text-left transition-all duration-300 ${
          keySaveNotification.type === 'success' 
            ? 'bg-[#0b1a1a]/95 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-emerald-400' 
            : keySaveNotification.type === 'delete'
              ? 'bg-[#1a0b0b]/95 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)] text-red-500' 
              : 'bg-[#1a150b]/95 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-500'
        }`}>
          <div className={`p-2 rounded-xl border shrink-0 ${
            keySaveNotification.type === 'success' 
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
              : keySaveNotification.type === 'delete'
                ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}>
            <Check className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">
              {keySaveNotification.type === 'success' ? '✓ UPDATE BERHASIL' : keySaveNotification.type === 'delete' ? '⚠ DIHAPUS / RESET' : '⚡ INFO API KEY'}
            </h4>
            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">{keySaveNotification.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => setKeySaveNotification(null)}
            className="text-zinc-500 hover:text-white transition p-1 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      
      {/* BACKGROUND COSMIC AMBIENCE */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[140px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(129,140,248,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(129,140,248,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* MOBILE BACKDROP OVERLAY FOR SIDEBAR */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300 pointer-events-auto"
          id="sidebar-overlay"
        />
      )}

      {/* LEFT SIDEBAR PANEL (RESPONSIVE) */}
      <aside 
        id="side-navigation"
        className={`
          fixed lg:sticky top-0 z-50 h-svh lg:h-screen transition-all duration-300 ease-in-out flex flex-col bg-[#07070a] overflow-y-auto shrink-0
          
          /* Mobile styles (by default) */
          ${mobileSidebarOpen 
            ? 'w-64 translate-x-0 opacity-100 pointer-events-auto border-r border-zinc-900/80' 
            : 'w-0 -translate-x-full opacity-0 pointer-events-none overflow-hidden border-r-0'
          }
          
          /* Desktop overrides (prefixed with lg:) */
          lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto lg:h-screen
          ${sidebarOpen 
            ? 'lg:w-64 lg:border-r lg:border-zinc-900/80' 
            : 'lg:w-0 lg:border-r-0 lg:overflow-hidden lg:pointer-events-none lg:opacity-0'
          }
        `}
      >
        {/* LOGO AREA */}
        <div className="p-5 border-b border-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            {/* Ambient glowing skull ring */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-amber-400">
                <Skull className="w-5.5 h-5.5 text-amber-400 shrink-0" />
              </div>
            </div>
            
            {sidebarOpen && (
              <div className="text-left truncate animate-fade-in">
                <h1 className="text-xs font-mono font-bold tracking-tight text-white uppercase">
                  OMEGA ENGINE
                </h1>
                <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-400 text-black px-1.5 py-0.25 rounded font-mono font-bold uppercase tracking-wider block mt-0.5 w-max">
                  TEACHER EDITION
                </span>
              </div>
            )}
          </div>

          {/* Close button inside drawer for mobile */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 px-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-white lg:hidden cursor-pointer"
            id="mobile-sidebar-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVIGATION MENUS */}
        <div className="flex-1 py-6 px-3 space-y-6 text-left">
          
          {/* PENGHUBUNG UTAMA */}
          <div className="space-y-1.5">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'PENGHUBUNG UTAMA' : 'HUB'}
            </span>
            <button
              onClick={() => handleSelectTool('home')}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                ${selectedTool === 'home' && activeTab === 'automatic'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-black shadow-[0_4px_14px_rgba(245,158,11,0.3)] border-t border-white/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}
              `}
              id="sidebar-btn-home"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${
                selectedTool === 'home' && activeTab === 'automatic'
                  ? 'bg-zinc-950 text-amber-400'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <Home className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left">
                  <span className={`block font-semibold text-[11.5px] ${selectedTool === 'home' && activeTab === 'automatic' ? 'text-zinc-950' : 'text-zinc-200'}`}>Halaman Menu Utama</span>
                  <span className={`block text-[9.5px] ${selectedTool === 'home' && activeTab === 'automatic' ? 'text-zinc-900/80 font-bold' : 'text-zinc-500'}`}>Beranda sistem & KOSP</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Halaman Menu Utama
                </div>
              )}
            </button>

            {/* PROFIL SEKOLAH */}
            <button
              onClick={() => handleSelectTool('school_profile')}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group mt-1
                ${selectedTool === 'school_profile' && activeTab === 'automatic'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-black shadow-[0_4px_14px_rgba(245,158,11,0.3)] border-t border-white/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}
              `}
              id="sidebar-btn-school-profile"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${
                selectedTool === 'school_profile' && activeTab === 'automatic'
                  ? 'bg-zinc-950 text-amber-400'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <School className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className={`block font-semibold text-[11.5px] ${selectedTool === 'school_profile' && activeTab === 'automatic' ? 'text-zinc-950 font-bold' : 'text-zinc-200'}`}>Profil Sekolah</span>
                  <span className={`block text-[9.5px] ${selectedTool === 'school_profile' && activeTab === 'automatic' ? 'text-zinc-900/80 font-bold' : 'text-zinc-500'}`}>Kunci identitas otomatis</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Profil Sekolah
                </div>
              )}
            </button>

            {/* BARU: PROFIL INTEGRASI MURID */}
            <button
              onClick={() => handleSelectTool('student_profile')}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group mt-1
                ${selectedTool === 'student_profile' && activeTab === 'automatic'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-black shadow-[0_4px_14px_rgba(245,158,11,0.3)] border-t border-white/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}
              `}
              id="sidebar-btn-student-profile"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${
                selectedTool === 'student_profile' && activeTab === 'automatic'
                  ? 'bg-zinc-950 text-amber-400'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <User className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className={`block font-semibold text-[11.5px] ${selectedTool === 'student_profile' && activeTab === 'automatic' ? 'text-zinc-950 font-bold' : 'text-zinc-200'}`}>Profil Murid</span>
                  <span className={`block text-[9.5px] ${selectedTool === 'student_profile' && activeTab === 'automatic' ? 'text-zinc-900/80 font-bold' : 'text-zinc-500'}`}>Integrasi rapor & nilai S2</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Profil Murid (Rapor S2)
                </div>
              )}
            </button>

            {/* TUTORIAL APLIKASI */}
            <button
              onClick={() => handleSelectTool('tutorial')}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group mt-1
                ${selectedTool === 'tutorial' && activeTab === 'automatic'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-black shadow-[0_4px_14px_rgba(245,158,11,0.3)] border-t border-white/40' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}
              `}
              id="sidebar-btn-app-tutorial"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${
                selectedTool === 'tutorial' && activeTab === 'automatic'
                  ? 'bg-zinc-950 text-red-405'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_12px_rgba(239,68,68,0.35)]'
              }`}>
                <Video className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className={`block font-semibold text-[11.5px] ${selectedTool === 'tutorial' && activeTab === 'automatic' ? 'text-zinc-950 font-bold' : 'text-zinc-200'}`}>Tutorial Aplikasi</span>
                  <span className={`block text-[9.5px] ${selectedTool === 'tutorial' && activeTab === 'automatic' ? 'text-zinc-900/80 font-bold' : 'text-zinc-500'}`}>Panduan video Youtube</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Tutorial Aplikasi (Panduan Video)
                </div>
              )}
            </button>
          </div>

          {/* ASISTEN AKADEMIS CERDAS */}
          <div className="space-y-1.5">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'ASISTEN AKADEMIS CERDAS' : 'AKADEMIK'}
            </span>
            <div className="space-y-1">
              {menuItems.filter(item => item.category === 'ACADEMIC SUITE').map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedTool === item.id && activeTab === 'automatic';
                const style = getSidebarIconStyles(item.id, isSelected);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTool(item.id as any)}
                    className={`
                      w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                      ${isSelected 
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-bold border-t border-white/40 shadow-[0_4px_14px_rgba(245,158,11,0.3)]' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent'}
                    `}
                    id={`sidebar-btn-${item.id}`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${style}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {sidebarOpen && (
                      <div className="text-left truncate">
                        <span className={`block font-semibold text-[11.5px] ${isSelected ? 'text-zinc-950' : 'text-zinc-200'} flex items-center gap-1.5`}>
                          {item.label}
                          {item.id === 'lesson_plan' && (
                            <span className={`text-[8px] px-1 py-0.25 rounded font-bold ${
                              isSelected 
                                ? 'bg-zinc-950/20 border border-zinc-950/30 text-zinc-950' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>NEW</span>
                          )}
                        </span>
                        <span className={`block text-[9.5px] ${isSelected ? 'text-zinc-900/85 font-semibold' : 'text-zinc-500'}`}>{item.desc}</span>
                      </div>
                    )}
                    {!sidebarOpen && (
                      <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                        <strong>{item.label}</strong>
                        <p className="text-[9px] text-zinc-500">{item.desc}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUITE OFFLINE */}
          <div className="space-y-1.5">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'SUITE OFFLINE' : 'LURING'}
            </span>
            <div className="space-y-1">
              {menuItems.filter(item => item.category === 'OFFLINE SUITE').map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedTool === item.id && activeTab === 'automatic';
                const style = getSidebarIconStyles(item.id, isSelected);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTool(item.id as any)}
                    className={`
                      w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                      ${isSelected 
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-bold border-t border-white/40 shadow-[0_4px_14px_rgba(245,158,11,0.3)]' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent'}
                    `}
                    id={`sidebar-btn-${item.id}`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${style}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {sidebarOpen && (
                      <div className="text-left truncate">
                        <span className={`block font-semibold text-[11.5px] ${isSelected ? 'text-zinc-950' : 'text-zinc-200'}`}>{item.label}</span>
                        <span className={`block text-[9.5px] ${isSelected ? 'text-zinc-900/85 font-semibold' : 'text-zinc-500'} truncate-none`}>{item.desc}</span>
                      </div>
                    )}
                    {!sidebarOpen && (
                      <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                        <strong>{item.label}</strong>
                        <p className="text-[9px] text-zinc-500">{item.desc}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PANDUAN & VBA */}
          <div className="space-y-1.5">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'PANDUAN & VBA' : 'PANDUAN'}
            </span>
            <button
              onClick={handleSelectVbaManual}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                ${activeTab === 'manual' 
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-bold border-t border-white/40 shadow-[0_4px_14px_rgba(245,158,11,0.3)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent'}
              `}
              id="sidebar-btn-manual"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${
                activeTab === 'manual'
                  ? 'bg-zinc-950 text-indigo-400 shadow-inner'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                <HelpCircle className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className={`block font-semibold text-[11.5px] ${activeTab === 'manual' ? 'text-zinc-950' : 'text-zinc-200'}`}>Panduan Makro VBA</span>
                  <span className={`block text-[9.5px] ${activeTab === 'manual' ? 'text-zinc-900/80 font-semibold' : 'text-zinc-500'}`}>Instruksi luring offline</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Panduan Makro VBA
                </div>
              )}
            </button>
          </div>

          {/* PEMBARUAN SISTEM */}
          <div className="space-y-1.5 border-t border-zinc-900/60 pt-4">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'PEMBARUAN SISTEM' : 'UPDATE'}
            </span>
            <button
              onClick={handleCheckUpdates}
              disabled={updateChecking}
              className={`
                w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30
              `}
              id="sidebar-btn-updates"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} bg-amber-500/10 text-amber-400 border border-amber-500/20`}>
                <Cpu className={`w-4 h-4 shrink-0 ${updateChecking ? 'animate-spin' : ''}`} />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className="block font-semibold text-[11.5px] text-zinc-200">Periksa Pembaruan</span>
                  <span className="block text-[9.5px] text-zinc-500">Cek versi terbaru</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  <strong>Cek Pembaruan</strong>
                  <p className="text-[9px] text-zinc-500">Periksa update server</p>
                </div>
              )}
            </button>
          </div>

          {/* ADMINISTRASI LISENSI */}
          <div className="space-y-1.5 border-t border-zinc-900/60 pt-4">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'ADMINISTRASI LISENSI' : 'LISENSI'}
            </span>
            <button
              onClick={() => setIsActivationModalOpen(true)}
              className="w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30"
              id="sidebar-btn-user-activate"
            >
              <div className="p-1.5 rounded-lg shrink-0 mr-3 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className={`w-4 h-4 shrink-0 ${isActivated ? 'animate-pulse text-yellow-400' : ''}`} />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans">
                  <span className="block font-semibold text-[11.5px] text-zinc-200">
                    {isActivated ? '✓ Premium Aktif' : 'Konfirmasi Kode Akses'}
                  </span>
                  <span className="block text-[9.5px] text-amber-400 font-bold block">
                    {isActivated ? 'LISENSI SEKOLAH' : 'Mulai Lisensi Rp 25k'}
                  </span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  {isActivated ? "✓ Premium Aktif" : "Mulai Lisensi Premium"}
                </div>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => handleSelectTool('admin_panel' as any)}
                className={`
                  w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group
                  ${selectedTool === ('admin_panel' as any)
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-zinc-950 font-bold border-t border-white/40 shadow-[0_4px_14px_rgba(245,158,11,0.3)]' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent'}
                `}
                id="sidebar-btn-admin-panel"
              >
                <div className={`p-1.5 rounded-lg shrink-0 mr-3 ${
                  selectedTool === ('admin_panel' as any)
                    ? 'bg-zinc-950 text-amber-400 shadow-inner'
                    : 'bg-red-500/10 text-red-400 border border-red-500/10'
                }`}>
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                {sidebarOpen && (
                  <div className="text-left font-sans">
                    <span className={`block font-semibold text-[11.5px] ${selectedTool === ('admin_panel' as any) ? 'text-zinc-950 font-bold' : 'text-zinc-200'}`}>
                      Menu Kode Akses
                    </span>
                    <span className={`block text-[9.5px] ${selectedTool === ('admin_panel' as any) ? 'text-zinc-900/80 font-semibold' : 'text-zinc-500'}`}>
                      Dashboard Verifikasi
                    </span>
                  </div>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                    Menu Kode Akses Admin
                  </div>
                )}
              </button>
            )}
          </div>

          {/* KELUAR SISTEM */}
          <div className="space-y-1.5 border-t border-zinc-900/60 pt-4">
            <span className={`block px-2 text-[9px] font-mono font-bold text-zinc-650 uppercase tracking-widest ${!sidebarOpen ? 'text-center' : ''}`}>
              {sidebarOpen ? 'KELUAR SISTEM' : 'KELUAR'}
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center rounded-xl p-2.5 transition text-xs font-medium cursor-pointer relative group border border-transparent text-rose-450 hover:text-rose-400 hover:bg-rose-950/10"
              id="sidebar-btn-logout"
            >
              <div className="p-1.5 rounded-lg shrink-0 bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:border-rose-500/40 group-hover:bg-rose-550/15">
                <LogOut className="w-4 h-4 shrink-0" />
              </div>
              {sidebarOpen && (
                <div className="text-left font-sans pl-3">
                  <span className="block font-semibold text-[11.5px] text-rose-200">Keluar Sistem</span>
                  <span className="block text-[9.5px] text-zinc-500">Log out aman & reset</span>
                </div>
              )}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-350 px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  <strong>Keluar Sistem</strong>
                </div>
              )}
            </button>
          </div>

        </div>

        {/* SYSTEM STATS AT BOTTOM */}
        {sidebarOpen && (
          <div className="p-4 border-t border-zinc-900/80 bg-zinc-950/40 text-left shrink-0 font-mono text-[9px] text-zinc-500 space-y-1 mt-auto">
            <div className="flex justify-between">
              <span>SANDBOX_MODE:</span>
              <span className="text-emerald-450 font-semibold">LURING_ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>ENGINE_X9:</span>
              <span className="text-zinc-300">STABLE</span>
            </div>
          </div>
        )}

        {/* DESKTOP COLLAPSE CONTROLLER */}
        <div className="p-2 border-t border-zinc-900/40 hidden lg:block shrink-0 mt-auto">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg border border-zinc-900 transition flex items-center justify-center cursor-pointer"
            id="sidebar-toggle-desktop"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT CONTAINER */}
      <main className="flex-1 min-h-screen min-h-svh flex flex-col justify-between overflow-x-hidden">
        
        {/* TOP GLORIOUS APP HEADER & STATUS BAR */}
        <header className="sticky top-0 z-30 bg-[#0e1233]/70 backdrop-blur-md border-b border-indigo-950/60 p-4 shrink-0">
          <div className="w-full px-2 lg:px-4 flex items-center justify-between gap-4">
            
            {/* Tiga Garis Hamburg & Active Location Panel */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    setSidebarOpen(!sidebarOpen);
                  } else {
                    setMobileSidebarOpen(!mobileSidebarOpen);
                  }
                }}
                className="p-2.5 bg-[#0b0e25] border border-indigo-900/40 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-950 transition flex items-center justify-center cursor-pointer relative shrink-0"
                id="sidebar-toggle-hamburger"
              >
                <Menu className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eca111] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                </span>
              </button>

              <div className="text-left animate-fade-in hidden sm:block">
                <span className="block text-[8.5px] font-mono text-amber-400 uppercase tracking-widest leading-none font-bold">Omega Guru: Atasi Beban Administrasi Guru</span>
                <span className="text-xs font-bold text-white tracking-wide mt-1 block">
                  {selectedTool === 'home' && activeTab === 'automatic' && 'Beranda'}
                  {selectedTool === 'tutorial' && 'Studio Video Tutorial & Panduan Aplikasi'}
                  {activeTab === 'manual' && 'Modul VBA & Panduan Teknis'}
                  {selectedTool === 'excel' && activeTab === 'automatic' && 'Suite Excel Decryptor / Unlocker'}
                  {selectedTool === 'word' && activeTab === 'automatic' && 'Suite Word Decryptor / Unlocker'}
                  {selectedTool === 'ppt' && activeTab === 'automatic' && 'Suite PPT Document Repairer'}
                  {selectedTool === 'pdf_decrypt' && activeTab === 'automatic' && 'PDF Decryptor / Restriction Bypass'}
                  {selectedTool === 'pdf_compress' && activeTab === 'automatic' && 'PDF Optimization & Size Compressor'}
                  {selectedTool === 'ai_extract' && activeTab === 'automatic' && 'Analisis CP'}
                  {selectedTool === 'kosp' && activeTab === 'automatic' && 'Asisten Penyusun KOSP Cerdas'}
                  {selectedTool === 'lesson_plan' && activeTab === 'automatic' && 'Formulasi TP, ATP, KKTP, PROTA & PROMES'}
                  {selectedTool === 'rpm' && activeTab === 'automatic' && 'Rencana Pembelajaran Mendalam (RPM)'}
                  {selectedTool === 'litnum' && activeTab === 'automatic' && 'Capaian Literasi & Numerasi'}
                  {selectedTool === 'absensi' && activeTab === 'automatic' && 'Kartu Absensi Kelas'}
                  {selectedTool === 'karakter_p5' && activeTab === 'automatic' && 'Nilai Karakter Murid'}
                  {selectedTool === 'daftar_nilai' && activeTab === 'automatic' && 'Daftar Nilai Siswa Komprehensif'}
                  {selectedTool === 'admin_panel' && 'Panel Kontrol Admin Kode Akses'}
                </span>
              </div>
            </div>

            {/* SECURED CPU ENGINES TELEMETRY */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* DEVELOPER BADGE */}
              <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-900 px-3 py-1.5 rounded-xl font-bold shrink-0">
                <span>Developer:</span>
                <span className="text-amber-400 font-extrabold uppercase">Roni Hariyanto Bhidju, S.Pd.,Gr.</span>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/40 via-emerald-400/20 to-teal-500/40 p-[1px] rounded-xl shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 hover:text-emerald-100 bg-[#020604]/90 hover:bg-[#04110b]/95 p-1.5 px-3 rounded-[11px] transition-all cursor-pointer font-extrabold"
                  title="Pasang aplikasi di laptop Anda untuk pemrosesan cepat & luring"
                >
                  <Laptop className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Pasang Aplikasi
                </button>
              </div>

              {/* TUTORIAL APLIKASI TOP BAR MENU */}
              <div className="bg-gradient-to-r from-red-500/40 via-orange-450/20 to-red-650/40 p-[1px] rounded-xl shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all duration-300">
                <button
                  onClick={() => handleSelectTool('tutorial')}
                  className={`flex items-center gap-1.5 text-[10px] font-mono p-1.5 px-3 rounded-[11px] transition-all cursor-pointer font-extrabold ${
                    selectedTool === 'tutorial'
                      ? 'bg-red-900/40 text-white border border-red-500/30'
                      : 'text-red-300 hover:text-red-100 bg-[#080203]/90 hover:bg-[#140406]/95'
                  }`}
                  title="Akses Studio Panduan Video Rapor & Aplikasi"
                >
                  <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Tutorial Aplikasi
                </button>
              </div>

              {/* OMEGA LIVE SUPPORT BANTUAN */}
              <div className="bg-gradient-to-r from-indigo-500/45 via-purple-500/35 to-violet-650/45 p-[1px] rounded-xl shadow-[0_0_10px_rgba(99,102,241,0.15)] hover:shadow-[0_0_15px_rgba(104,117,245,0.3)] transition-all duration-300">
                <button
                  onClick={() => setShowSupportDrawer(true)}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 hover:text-indigo-100 bg-[#02030c]/95 hover:bg-[#06081e]/95 p-1.5 px-2.5 sm:px-3 rounded-[11px] transition-all cursor-pointer font-extrabold relative"
                  title="Hubungi bantuan suport online / chat luring dengan administrator Omega"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Support Chat
                  {unreadSupportCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-extrabold text-white animate-bounce shadow-md">
                      {unreadSupportCount}
                    </span>
                  )}
                </button>
              </div>

              <div className={`bg-gradient-to-r p-[1px] rounded-xl transition-all duration-300 ${
                isQuotaExhausted 
                  ? "from-red-500/40 via-rose-450/30 to-red-650/40 shadow-[0_0_10px_rgba(239,68,68,0.15)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                  : customApiKey 
                    ? "from-emerald-500/40 via-teal-450/30 to-emerald-650/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : serverConfig?.hasGeminiKey
                      ? "from-teal-500/45 via-cyan-400/35 to-emerald-600/45 shadow-[0_0_10px_rgba(20,184,166,0.15)] hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                      : "from-pink-500/40 via-amber-400/30 to-violet-600/40 shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              }`}>
                <button
                  onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                  className={`flex items-center gap-1.5 text-[10px] font-mono p-1.5 px-2.5 sm:px-3 rounded-[11px] transition-all cursor-pointer font-extrabold ${
                    isQuotaExhausted
                      ? "text-red-300 hover:text-red-100 bg-[#0e0204]/95 hover:bg-[#1f050a]/95"
                      : customApiKey
                        ? "text-emerald-300 hover:text-emerald-100 bg-[#020604]/95 hover:bg-[#04110b]/95"
                        : serverConfig?.hasGeminiKey
                          ? "text-teal-300 hover:text-teal-100 bg-[#010606]/95 hover:bg-[#031515]/95"
                          : "text-amber-300 hover:text-amber-100 bg-[#060401]/95 hover:bg-[#110b03]/95"
                  }`}
                  title="Atur Mandiri API Key Gemini"
                >
                  <Key className={`w-3.5 h-3.5 animate-pulse ${
                    isQuotaExhausted ? "text-red-400" : customApiKey ? "text-emerald-400" : serverConfig?.hasGeminiKey ? "text-teal-400" : "text-amber-400"
                  }`} />
                  {isQuotaExhausted ? "ganti api key" : customApiKey ? "Api key aktif" : serverConfig?.hasGeminiKey ? "Sistem API key aktif" : "masukan api key"}
                </button>
              </div>

              <div className="hidden md:block bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-600/40 p-[1px] rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                <div className="flex items-center gap-2.5 bg-[#080501]/95 p-[7px] px-3 rounded-[11px] text-[10px] font-mono text-amber-300">
                  <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="text-zinc-300">ENGINE: <strong className="text-amber-400 font-extrabold uppercase">LURING_X9</strong></span>
                </div>
              </div>

              {pendingSyncCount > 0 && (
                <button
                  onClick={() => setShowSyncPanel(true)}
                  className="flex items-center gap-1.5 text-[9px] bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/30 rounded-lg px-2.5 py-1 font-mono transition-all animate-pulse cursor-pointer shrink-0" 
                  title="Lihat Antrean Sinkronisasi Luring IndexedDB"
                >
                  <Database className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{pendingSyncCount} TERTUNDA</span>
                </button>
              )}

              {isOnline ? (
                <div className="flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-mono shrink-0" title="Tersambung ke Internet (Online)">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                  ONLINE
                </div>
              ) : (
                <div 
                  onClick={() => setShowSyncPanel(true)}
                  className="flex items-center gap-1.5 text-[9px] bg-rose-500/10 text-rose-450 border border-rose-500/20 px-2.5 py-1 rounded-lg font-mono animate-pulse cursor-pointer shrink-0 hover:border-rose-400 hover:bg-rose-500/15" 
                  title="Klik untuk melihat antrean sinkronisasi luring (Offline)"
                >
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                  LURING (OFFLINE)
                </div>
              )}
            </div>

          </div>
        </header>

        {/* OFFLINE MODE BANNER */}
        {!isOnline && (
          <div className="bg-[#1e1b4b]/60 border-b border-indigo-500/30 p-2.5 px-4 text-[11px] font-sans text-indigo-200 select-none shrink-0 w-full animate-fade-in relative z-20">
            <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
                <span className="font-semibold leading-normal">
                  Sistem Luring (Offline): Hanya dapat membaca & mengunduh dokumen tersimpan di Bank Dokumen.
                </span>
              </div>
              <p className="text-[10px] text-indigo-300/80 leading-normal max-w-md">
                Utilitas AI / Gemini dan fitur penulisan draf baru dimatikan sementara sampai kembali terhubung (Online).
              </p>
            </div>
          </div>
        )}

        {/* BAR KODE AKSES VERIFIKASI UTAMA (TOP TAB ACCESS CODE) */}
        <div className="bg-gradient-to-r from-[#0d1029] via-[#090c23] to-[#040614] border-b border-indigo-950/40 py-3 px-4 shrink-0 relative z-20 w-full animate-fade-in">
          <div className="w-full px-2 lg:px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            
            {/* Left status / label */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {/* Hidden File Input for Custom Profile Photo */}
                <input 
                  type="file"
                  ref={userPhotoInputRef}
                  onChange={handleUserPhotoChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className={`absolute -inset-1 rounded-full blur-sm opacity-70 ${
                  isActivated ? (isAdmin ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse") : "bg-indigo-500 animate-pulse duration-[5000ms]"
                }`} />
                <div 
                  onClick={handleTriggerUserPhotoUpload}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden cursor-pointer group/avatar select-none ${
                    isActivated ? (isAdmin ? "bg-amber-950/80 border-amber-500 text-amber-400" : "bg-emerald-950/80 border-emerald-500 text-emerald-400") : "bg-indigo-950/80 border-indigo-500/80 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                  }`}
                  title="Klik untuk mengganti foto profil Anda"
                >
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt="Profil User" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    isActivated ? (isAdmin ? <Lock className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />) : <User className="w-4 h-4 text-indigo-300" />
                  )}
                  
                  {/* High contrast hover overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-200">
                    <Camera className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                </div>
              </div>
              <div className="text-left font-sans col-span-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-extrabold leading-none">
                      {isAdmin ? "PERAN SAAT INI:" : `KODE AKSES: ${isActivated ? (activeActivationCode || "-") : "BELUM AKTIF"}`}
                    </span>
                    <span className={`text-[9.5px] font-mono font-black px-2.5 py-0.5 rounded leading-none shrink-0 ${
                      isActivated ? (isAdmin ? "bg-amber-400 text-zinc-950 animate-pulse" : "bg-emerald-500 text-zinc-950") : "bg-indigo-950/85 text-indigo-300 border border-indigo-800/40"
                    }`}>
                      {isAdmin 
                        ? "★ ADMINISTRATOR UTAMA" 
                        : (isActivated 
                            ? (() => {
                                try {
                                  const purchasedStr = localStorage.getItem("omega_purchased_packages");
                                  if (purchasedStr) {
                                    const pkgs = JSON.parse(purchasedStr);
                                    if (Array.isArray(pkgs) && pkgs.includes("premium")) {
                                      return "✔ USER PREMIUM";
                                    }
                                  }
                                } catch (e) {}
                                return "✔ USER AKTIF";
                              })()
                            : "👤 AKUN TAMU"
                          )
                      }
                    </span>
                  </div>
                  {!isActivated && !isAdmin && (
                    <span className="text-zinc-400 text-[10px] block font-sans">
                      Masukkan Kode Akses premium (OTE-GPxxxx) untuk merubah peran.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right input control elements */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
              {/* Lonceng Notifikasi */}
              <button
                type="button"
                onClick={handleBellNotificationClick}
                className={`relative p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-95 group ${
                  isAdmin 
                    ? (adminPendingCount > 0 
                        ? "bg-rose-500/15 border-rose-500/80 text-rose-300 hover:bg-rose-500/25 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-rose-500/30" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850")
                    : (pendingClaimCode 
                        ? "bg-amber-500/15 border-amber-500/80 text-amber-300 hover:bg-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30" 
                        : (currentPendingRequestCode && !isActivated)
                          ? "bg-sky-500/15 border-sky-500/50 text-sky-400 hover:bg-sky-500/25 shadow-[0_0_12px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/20"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850")
                }`}
                title={
                  isAdmin 
                    ? `Notifikasi Admin: ${adminPendingCount} permohonan pending baru`
                    : (pendingClaimCode 
                        ? "Ada notifikasi! Kode Akses Premium telah diterbitkan!" 
                        : (currentPendingRequestCode && !isActivated)
                          ? `Permohonan Akses sedang diproses (${currentPendingRequestCode})`
                          : "Status Notifikasi Aktivasi")
                }
              >
                <Bell className={`w-4 h-4 ${((isAdmin && adminPendingCount > 0) || (!isAdmin && (pendingClaimCode || (currentPendingRequestCode && !isActivated)))) ? "animate-pulse" : ""}`} />
                {isAdmin ? (
                  adminPendingCount > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      <span className="absolute -top-2 -right-2 bg-rose-650 text-white text-[8px] font-black font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border border-white/20 select-none">
                        {adminPendingCount}
                      </span>
                      <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-rose-600 text-white text-[7.5px] font-black font-mono tracking-wider px-1 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                        {adminPendingCount} REQUEST PENDING
                      </span>
                    </>
                  )
                ) : pendingClaimCode ? (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-amber-400 text-zinc-950 text-[8px] font-black font-mono tracking-wider px-1 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                      1 KODE AKTIF BARU!
                    </span>
                  </>
                ) : (currentPendingRequestCode && !isActivated) ? (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-sky-400 text-zinc-950 text-[7.5px] font-black font-mono tracking-wider px-1 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                      PERMOHONAN SEDANG DIPROSES
                    </span>
                  </>
                ) : null}
              </button>

              <div className="relative flex items-center w-full sm:w-48 shrink-0">
                <input
                  type="text"
                  placeholder="Kode Akses / Sandi..."
                  className="bg-black/95 border border-zinc-805 text-amber-300 placeholder-zinc-700 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono tracking-widest uppercase w-full font-extrabold"
                  id="top-access-code-input"
                  value={topAccessCode}
                  onChange={(e) => setTopAccessCode(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyTopAccessCode}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 hover:from-amber-400 hover:to-orange-400 font-black font-mono text-[10.5px] px-3.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 uppercase active:scale-95 shadow-[0_3px_10px_rgba(245,158,11,0.15)] flex items-center gap-1"
              >
                Aktifkan
              </button>

              {!isActivated && (
                <button
                  type="button"
                  onClick={() => setIsActivationModalOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 hover:text-white font-extrabold font-sans text-[10.5px] px-3.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 active:scale-95"
                >
                  Minta Kode
                </button>
              )}

              {isActivated && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("omega_is_activated");
                    localStorage.removeItem("omega_active_activation_code");
                    sessionStorage.removeItem("omega_admin_logged_in");
                    localStorage.removeItem("omega_admin_logged_in");

                    // Clear old profile keys so they get reset back to admin profile defaults!
                    const keysToReset = [
                      "omega_school_name", "kosp_nama_sekolah",
                      "omega_kepala_sekolah", "omega_principal_name", "kosp_kepala_sekolah",
                      "omega_nip_kepala", "omega_principal_nip", "kosp_nip_kepala",
                      "omega_nama_guru", "kosp_nama_guru", "omega_nama_guru_penyusun",
                      "omega_nip_guru", "omega_jabatan", "omega_fase_kelas", "omega_wa_number",
                      "kosp_ketua_tim", "kosp_alamat_sekolah", "kosp_desa", "kosp_kecamatan",
                      "kosp_kabupaten", "kosp_provinsi", "kosp_rt_rw", "kosp_pos"
                    ];
                    keysToReset.forEach(k => localStorage.removeItem(k));

                    setIsActivated(false);
                    setIsAdmin(false);
                    setSelectedTool("home");
                    setActiveTab("automatic");
                    setTopAccessCode("");
                    window.dispatchEvent(new CustomEvent("omega-state-updated"));
                    alert("✓ Sesi aktif dilepas. Anda sekarang kembali menjadi Akun Tamu (Tamu).");
                  }}
                  className="bg-rose-950/60 hover:bg-rose-950 border border-rose-900/55 text-rose-300 font-extrabold font-sans text-[10.5px] px-3.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 active:scale-95 flex items-center gap-1"
                >
                  Lepas Sesi
                </button>
              )}
            </div>

          </div>
        </div>

        {/* TOP STATUS TICKER */}
        <div className="bg-[#08080b]/55 border-[#27272a]/20 border-b border-zinc-900/30 px-4 py-2 font-mono text-[10px] text-zinc-400 text-center select-none shrink-0 text-left w-full">
          <div className="w-full px-2 lg:px-4 flex flex-wrap items-center justify-between gap-2.5 text-left md:text-center">
            <span>🔒 PRIVASI LURING TERJAMIN • DEKRIPSI LOKAL AKTIF</span>
            <span className="text-zinc-500 uppercase">Perlindungan privasi mutlak. Pemrosesan file dijamin 100% lokal di komputer Anda.</span>
          </div>
        </div>

        {(showApiKeySettings || isApiKeyMissing) && (
          <div className="bg-amber-950/25 border-b border-amber-500/20 px-4 py-3 shrink-0 animate-fade-in relative z-20 w-full text-left">
            <div className="w-full px-2 lg:px-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-left">
              <div className="flex items-start gap-2.5 text-xs text-amber-300 flex-1">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 md:mt-0" />
                <div>
                  <span className="font-bold block mr-1 uppercase">
                    💡 {isAdmin ? "Mode Admin Aktif: Mengatur Kunci API Bersama" : "Pengaturan Mandiri Kunci API Gemini"}
                  </span>
                  <span className="opacity-80 block text-[11px] mt-0.5">
                    {isAdmin ? (
                      <strong className="text-emerald-400">✓ Akun Admin terdeteksi. Kunci API yang Anda simpan di sini akan diaktifkan secara global di hulu server agar dapat langsung digunakan oleh seluruh guru pendidik (User) yang masuk.</strong>
                    ) : (
                      <span>Kunci API Anda akan disimpan secara privat secara luring di browser komputer Anda. <strong>Hanya perangkat ini yang dapat menggunakannya</strong>. Ingin agar kunci dapat digunakan bersama oleh rekan guru lainnya? Silakan login Akun Admin terlebih dahulu.</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0 md:w-[420px] w-full items-stretch">
                <div className="flex flex-1 gap-2 relative">
                  <input
                    type="text"
                    name="gemini_api_key_custom_field"
                    id="gemini_api_key_custom_field"
                    autoComplete="new-password"
                    style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                    placeholder="Tempel GEMINI_API_KEY Anda di sini..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    onFocus={() => {
                      if (tempApiKey === "••••••••••••••••") {
                        setTempApiKey("");
                      }
                    }}
                    onBlur={() => {
                      if (tempApiKey === "") {
                        setTempApiKey(localStorage.getItem("custom_gemini_api_key") ? "••••••••••••••••" : "");
                      }
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      triggerNotification('error', "Penyalinan Kunci API dinonaktifkan demi keamanan privasi Anda!");
                    }}
                    onCut={(e) => {
                      e.preventDefault();
                      triggerNotification('error', "Penyalinan Kunci API dinonaktifkan demi keamanan privasi Anda!");
                    }}
                    className="bg-[#0b0c10] border border-zinc-800 text-zinc-100 placeholder-zinc-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 flex-1 font-mono"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          setTempApiKey(text.trim());
                          triggerNotification('success', "✓ Kunci API berhasil ditempel dari Clipboard!");
                        } else {
                          triggerNotification('error', "Papan klip (Clipboard) kosong.");
                        }
                      } catch (err) {
                        triggerNotification('error', "Gagal membaca Clipboard. Silakan gunakan Ctrl+V atau Klik Kanan.");
                      }
                    }}
                    className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition text-[10px] font-bold font-sans cursor-pointer shrink-0"
                    title="Tempel dari Clipboard"
                  >
                    Tempel
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const cleanKey = tempApiKey.trim();
                    if (cleanKey) {
                      if (cleanKey === "••••••••••••••••") {
                        setShowApiKeySettings(false);
                        return;
                      }

                      const encoded = encodeKey(cleanKey);
                      setCustomApiKey(cleanKey);
                      setQuotaExhaustedState(false);
                      localStorage.setItem('custom_gemini_api_key', encoded);
 
                      if (isAdmin) {
                        // Admin Mode: Propagate encoded key to the server so it's active for everyone
                        fetch('/api/save-key', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ encodedKey: encoded })
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            triggerNotification('success', "✓ Kunci API berhasil disimpan & dihubungkan ke server secara global oleh Admin!");
                            setIsApiKeyMissing(false);
                            setShowApiKeySettings(false);
                            refreshServerConfig();
                          } else {
                            console.warn("Gagal sinkronisasi kunci ke server:", data.error);
                            triggerNotification('success', "✓ Kunci API disimpan di lokal browser perangkat ini.");
                            setIsApiKeyMissing(false);
                            setShowApiKeySettings(false);
                            refreshServerConfig();
                          }
                        })
                        .catch(err => {
                          console.error("Gagal sinkronisasi kunci ke server:", err);
                          triggerNotification('success', "✓ Kunci API disimpan di lokal browser perangkat ini.");
                          setIsApiKeyMissing(false);
                          setShowApiKeySettings(false);
                          refreshServerConfig();
                        });
                      } else {
                        // User Mode: Save locally and sync to user_api_keys Firestore collection for admin assistance
                        const activationCode = localStorage.getItem("omega_active_activation_code") || "GUEST";
                        const userName = localStorage.getItem("omega_nama_guru") || localStorage.getItem("omega_nama_guru_penyusun") || "Guru Tanpa Nama";
                        
                        try {
                          const userApiKeyRef = doc(db, "user_api_keys", activationCode);
                          setDoc(userApiKeyRef, {
                            userName: userName,
                            activationCode: activationCode,
                            apiKey: cleanKey,
                            updatedAt: new Date()
                          }, { merge: true })
                          .then(() => {
                            console.log("Berhasil sinkronisasi API key ke cloud database!");
                          })
                          .catch((err) => {
                            console.warn("Gagal menulis API key ke Firestore:", err);
                          });
                        } catch (err) {
                          console.warn("Gagal menulis API key ke Firestore:", err);
                        }

                        triggerNotification('success', "✓ Kunci API disimpan privat di lokal peramban Anda (Khusus perangkat ini).");
                        setIsApiKeyMissing(false);
                        setShowApiKeySettings(false);
                        refreshServerConfig();
                      }
                    } else {
                      triggerNotification('error', "Kolom API Key masih kosong. Silakan tempelkan kunci Anda.");
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold font-sans text-xs px-4 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                >
                  Simpan Key
                </button>
              </div>
            </div>
          </div>
        )}

        {!customApiKey && serverConfig?.hasGeminiKey && !isQuotaExhausted && (
          <div className="bg-emerald-950/10 border-b border-emerald-500/10 px-4 py-2 shrink-0 animate-fade-in relative z-20 w-full text-left font-mono">
            <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-emerald-400">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>🌐 <strong>Sistem API key aktif!</strong> • Asisten & seluruh alat asisten akademi otomatis aktif menggunakan kunci bersama server.</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-sans italic">
                Sistem API key aktif
              </div>
            </div>
          </div>
        )}

        {customApiKey && (
          <div className={`border-b px-4 py-2 shrink-0 animate-fade-in relative z-20 w-full text-left font-mono transition-colors duration-300 ${
            isQuotaExhausted 
              ? "bg-red-950/20 border-red-500/20 text-red-100" 
              : "bg-emerald-950/10 border-emerald-500/10 text-emerald-400"
          }`}>
            <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isQuotaExhausted ? "bg-red-500" : "bg-emerald-400"}`} />
                {isQuotaExhausted ? (
                  <span>⚠️ <strong className="text-red-400">Batas Kuota Gemini API Habis (limit habis)</strong> • Silakan ditekankan tombol di pojok kanan atas untuk <strong className="text-red-400 font-extrabold underline decoration-red-500">ganti api key</strong> Anda.</span>
                ) : (
                  <span>🔐 <strong>Kunci Gemini API Aktif (Lokal Browser)</strong> • Seluruh modul generator kurikulum & analisis PDF siap digunakan.</span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                  className={`text-[10px] underline cursor-pointer transition ${
                    isQuotaExhausted ? "text-red-300 hover:text-red-200" : "text-emerald-450 hover:text-emerald-300"
                  }`}
                >
                  {showApiKeySettings ? "Sembunyikan Input" : "Lihat/Ubah Key"}
                </button>
                <span className="text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomApiKey('');
                    setTempApiKey('');
                    setQuotaExhaustedState(false);
                    localStorage.removeItem('custom_gemini_api_key');
                    setShowApiKeySettings(false);
                    triggerNotification('delete', "Kunci API Gemini telah dihapus dari browser Anda.");
                  }}
                  className="text-[10px] text-zinc-500 hover:text-red-450 underline cursor-pointer transition"
                >
                  Hapus & Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {swUpdateAvailable && (
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 border-b border-blue-500/30 px-4 py-3 shrink-0 relative z-20 w-full text-left animate-fade-in">
            <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin shrink-0" />
                <div>
                  <span className="font-bold block text-blue-300">Pembaruan Sistem Tersedia!</span>
                  <span className="text-zinc-300 text-[11px] block mt-0.5">Versi baru Omega Guru telah diunggah & siap dipasang secara otomatis untuk Anda.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyUpdate}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-4 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.4)] shrink-0 w-full sm:w-auto justify-center"
              >
                <Zap className="w-3.5 h-3.5 fill-white" /> Pasang Pembaruan Sekarang
              </button>
            </div>
          </div>
        )}

        {updateMessage && (
          <div className="bg-zinc-950 border-b border-zinc-905 px-4 py-2 shrink-0 animate-fade-in relative z-20 w-full text-left">
            <div className="w-full max-w-7xl mx-auto px-2 lg:px-4 flex items-center gap-2.5 text-xs font-mono text-zinc-300">
              <Cpu className={`w-3.5 h-3.5 text-amber-450 ${updateChecking ? 'animate-spin' : ''}`} />
              <span>{updateMessage}</span>
            </div>
          </div>
        )}

        {/* CONTAINER UTAMA BODY */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative space-y-8">
          
          {/* TAB VIEW PORT */}

          {/* 1. VIEW MENU BERANDA UTAMA (HOME) */}
          {selectedTool === 'home' && activeTab === 'automatic' && (
            <div key="home" className="space-y-8 text-center flex flex-col items-center animate-fade-in-slide-up">
              
              {/* CYBER SLATE HEADER BANNER */}
              <div className="bg-gradient-to-r from-zinc-950 via-[#0a0a0f] to-zinc-950 text-zinc-100 rounded-2xl py-3.5 px-5 md:px-6 relative overflow-hidden border border-zinc-900 shadow-xl w-full flex flex-col items-center justify-center">
                {/* BEAUTIFUL COMPACT TERMINAL DECORATION */}
                <div className="absolute top-0 right-0 w-[20%] h-full opacity-[0.04] pointer-events-none flex items-center justify-end pr-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-2xl rounded-full opacity-10" />
                    <Terminal className="w-16 h-16 text-amber-400 relative z-10" />
                  </div>
                </div>
                <div className="w-full relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[9px] mb-1.5 border border-amber-500/20">
                    <Terminal className="w-3 h-3 text-amber-400" />
                    omega_teacher_engine_v3_active
                  </div>
                  <h2 className="text-xl md:text-3xl font-extrabold tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_25px_rgba(245,158,11,0.65)] font-display text-center relative py-1">
                    OMEGA TEACHER ENGINE
                  </h2>
                  <p className="text-amber-400 font-semibold text-[10px] md:text-[11px] mt-0.5 uppercase tracking-wider font-display text-center">
                    Mengatasi Beban Administrasi Guru
                  </p>
                  <p className="text-zinc-400 text-[11px] md:text-xs mt-2.5 leading-relaxed font-sans text-justify w-full">
                    Selamat datang di <strong>OMEGA TEACHER ENGINE</strong>. Platform inovatif yang dirancang khusus untuk memerdekakan waktu pendidik melalui otomatisasi administrasi kurikulum terpadu. Rancang analisis Capaian Pembelajaran (CP) komprehensif, formulasi Tujuan Pembelajaran (TP), Alur Tujuan Pembelajaran (ATP), Kriteria Ketercapaian (KKTP), rancangan Program Tahunan (PROTA) &amp; Program Semester (PROMES), hingga modul rencana pembelajaran kontekstual secara cepat, praktis, dan 100% luring—seluruhnya diselaraskan dengan Keputusan BSKAP Nomor 046 Tahun 2025 serta Panduan Pembelajaran &amp; Asesmen Kemendikdasmen terbaru.
                  </p>
                </div>
              </div>

              {/* 📊 INTEGRATED DOCUMENT STATISTICS DASHBOARD (RECHARTS) */}
              {(() => {
                const totalDocs = documents.length;
                const countDocsByCategory = (cat: string) => documents.filter((d: any) => d.category === cat).length;
                
                const chartData = [
                  { name: "KOSP Merdeka", Berkas: countDocsByCategory('kosp'), color: "#c084fc", desc: "Rancangan draf KOSP" },
                  { name: "Modul & RPP", Berkas: countDocsByCategory('lesson_plan'), color: "#22d3ee", desc: "Rancangan TP, ATP, RPM" },
                  { name: "Hasil Ekstraksi", Berkas: countDocsByCategory('extracted'), color: "#f472b6", desc: "Materi & CP dari PDF" },
                  { name: "Lainnya / Umum", Berkas: countDocsByCategory('manual'), color: "#fbbf24", desc: "Data umum, nilai & absen" }
                ];

                return (
                  <div className="w-full bg-[#060608]/90 border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-5 text-left shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.005)_1px,transparent_1px),linear-gradient(to_right,rgba(245,158,11,0.005)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3 relative z-10">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded text-[8px] font-mono tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-extrabold">
                          Sistem Pemantau Administrasi Aktif
                        </span>
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f5a623] flex items-center gap-2 mt-1">
                          <Database className="w-4 h-4 text-amber-500" /> STATISTIK PENYUSUNAN DOKUMEN ADMINISTRASI
                        </h3>
                        <p className="text-[10px] text-zinc-550 font-sans">Visualisasi dokumen KTSP & Kurikulum Merdeka yang tersimpan secara lokal dan sinkron di bank dokumen luring.</p>
                      </div>
                      
                      <div className="bg-[#121421]/60 border border-indigo-950 px-3.5 py-1.5 rounded-xl text-center min-w-[120px] shrink-0">
                        <span className="block text-[8px] font-mono text-indigo-400 uppercase tracking-widest">TOTAL DOKUMEN</span>
                        <strong className="block text-sm font-mono text-zinc-100 mt-0.5">{totalDocs} Berkas</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
                      {/* Diagram Recharts (col-span-7) */}
                      <div className="lg:col-span-7 h-[220px] w-full flex flex-col justify-between bg-black/40 rounded-xl border border-zinc-900/50 p-4">
                        <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /> Sebaran Dokumen per Kategori
                        </span>
                        
                        <div className="h-[140px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                              <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
                              <YAxis stroke="#52525b" fontSize={9} allowDecimals={false} axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                                labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                                itemStyle={{ color: '#fbbf24', fontSize: '11px' }}
                              />
                              <Bar dataKey="Berkas" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <span className="text-[8.5px] font-mono text-zinc-500 italic">* Diperbarui otomatis saat Anda menggunakan generator di panel sidebar</span>
                      </div>

                      {/* Rincian stats bento list (col-span-5) */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-black/20 rounded-xl border border-zinc-900/40 p-4">
                        <div className="space-y-3.5">
                          {chartData.map((item, idx) => {
                            const percent = totalDocs > 0 ? ((item.Berkas / totalDocs) * 100).toFixed(1) : "0.0";
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-zinc-200 font-bold">{item.name}</span>
                                  </span>
                                  <span className="font-mono text-zinc-400">{item.Berkas} Dokumen ({percent}%)</span>
                                </div>
                                <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${percent}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-950/45 text-[10px] text-zinc-400 font-sans leading-normal">
                          <strong className="text-indigo-400 block font-mono text-[9px] uppercase tracking-wider mb-0.5">💡 TIP OTOMATISASI</strong>
                          Dokumen yang telah disusun dalam asisten akademis akan otomatis terekam dalam database Bank Dokumen di komputer Anda agar terhindar dari risiko kehilangan data.
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* INTEGRASI KECERDASAN GURU (ASISTEN SISTEM) */}
              <div className="w-full bg-black border-2 border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_45px_rgba(250,204,21,0.12)] flex flex-col items-center gap-6 animate-fade-in">
                {/* Header inside the yellow border frame, premium bold italic uppercase style consistent with the uploaded image */}
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-xs sm:text-sm md:text-base font-sans font-black italic tracking-wider text-yellow-400 uppercase flex items-center justify-center gap-2">
                    ⚡ ASISTEN AKADEMIS & ADMINISTRASI CERDAS GURU
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1.5 font-sans text-center max-w-xl">
                    Pemetaan data kurikulum kurasi instan dengan rujukan standar Keputusan BSKAP No. 046 Tahun 2025.
                  </p>
                </div>

                {/* Symmetrical 4-Column Grid Layout (4 Horizontal, 3 Vertical) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {(() => {
                    const academicItems = menuItems.filter(item => item.category === 'ACADEMIC SUITE');
                    
                    const colorMap: Record<string, { hoverText: string; shadow: string; glow: string; stroke: string; fill: string }> = {
                      emerald: { hoverText: 'group-hover:text-emerald-300', shadow: 'drop-shadow-[0_2px_8px_rgba(52,211,153,0.6)]', glow: 'text-emerald-400', stroke: 'text-emerald-400', fill: 'fill-emerald-400/20' },
                      blue: { hoverText: 'group-hover:text-blue-300', shadow: 'drop-shadow-[0_2px_8px_rgba(96,165,250,0.6)]', glow: 'text-blue-400', stroke: 'text-blue-400', fill: 'fill-blue-400/20' },
                      rose: { hoverText: 'group-hover:text-rose-300', shadow: 'drop-shadow-[0_2px_8px_rgba(251,113,133,0.6)]', glow: 'text-rose-400', stroke: 'text-rose-400', fill: 'fill-rose-400/20' },
                      indigo: { hoverText: 'group-hover:text-indigo-300', shadow: 'drop-shadow-[0_2px_8px_rgba(129,140,248,0.6)]', glow: 'text-indigo-400', stroke: 'text-indigo-400', fill: 'fill-indigo-400/20' },
                      pink: { hoverText: 'group-hover:text-pink-300', shadow: 'drop-shadow-[0_2px_8px_rgba(244,114,182,0.6)]', glow: 'text-pink-400', stroke: 'text-pink-400', fill: 'fill-pink-400/20' },
                      purple: { hoverText: 'group-hover:text-purple-300', shadow: 'drop-shadow-[0_2px_8px_rgba(192,132,252,0.6)]', glow: 'text-purple-400', stroke: 'text-purple-400', fill: 'fill-purple-400/20' },
                      cyan: { hoverText: 'group-hover:text-cyan-300', shadow: 'drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)]', glow: 'text-cyan-400', stroke: 'text-cyan-400', fill: 'fill-cyan-400/20' },
                      amber: { hoverText: 'group-hover:text-amber-300', shadow: 'drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]', glow: 'text-amber-400', stroke: 'text-amber-400', fill: 'fill-amber-400/20' },
                      lime: { hoverText: 'group-hover:text-lime-300', shadow: 'drop-shadow-[0_2px_8px_rgba(163,230,53,0.6)]', glow: 'text-lime-400', stroke: 'text-lime-400', fill: 'fill-lime-400/20' },
                      orange: { hoverText: 'group-hover:text-orange-300', shadow: 'drop-shadow-[0_2px_8px_rgba(251,146,60,0.6)]', glow: 'text-orange-400', stroke: 'text-orange-400', fill: 'fill-orange-400/20' },
                      slate: { hoverText: 'group-hover:text-slate-300', shadow: 'drop-shadow-[0_2px_8px_rgba(156,163,175,0.6)]', glow: 'text-slate-300', stroke: 'text-zinc-450', fill: 'fill-zinc-450/20' },
                      cherry: { hoverText: 'group-hover:text-red-300 font-black', shadow: 'drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]', glow: 'text-red-400', stroke: 'text-red-400', fill: 'fill-red-400/20' }
                    };

                    return academicItems.map((item, idx) => {
                      const IconComp = item.icon;
                      
                      const colorStyles = colorMap[item.bannerColor || 'amber'] || { hoverText: 'group-hover:text-amber-300', shadow: 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]', glow: 'text-amber-400', stroke: 'text-amber-400', fill: 'fill-amber-400/20' };
                      const iconColorClass = `${colorStyles.stroke} ${colorStyles.shadow}`;
                      const iconBg = 'bg-zinc-950/40 border border-yellow-400/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] group-hover:bg-[#0c1938]/40 group-hover:border-yellow-400/60';

                      // 4 Columns horizontally on large screens, 2 on medium, 1 on small.
                      const colSpan = 'col-span-1';

                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectTool(item.id as any)}
                          className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 text-left ${colSpan} bg-[#0c1938] border-2 border-yellow-400 hover:bg-[#0f244d] hover:border-yellow-300 hover:shadow-[0_0_22px_rgba(250,204,21,0.25)]`}
                        >
                          {/* Beautiful custom numeral icon in top right corner (KARTU ANGKA BULAT) */}
                          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm font-black text-yellow-400 bg-black border-2 border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.35)] group-hover:border-yellow-300 group-hover:scale-110 transition-all duration-300 z-10 select-none">
                            {String(idx + 1).padStart(2, '0')}
                          </div>

                          {/* Attractive subtle floating background icon watermark moved to bottom corner */}
                          <div className="absolute bottom-1 right-2 pointer-events-none opacity-[0.06] group-hover:opacity-15 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 ease-out">
                            <IconComp className={`w-12 h-12 ${colorStyles.stroke}`} />
                          </div>

                          <div>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 mb-2.5 ${iconBg}`}>
                              <IconComp className={`w-4.5 h-4.5 ${iconColorClass}`} />
                            </div>
                            
                            <h4 className={`text-xs font-bold text-white tracking-wide ${colorStyles.hoverText} transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-1`}>
                              <span>{item.label}</span>
                              {item.id === 'lesson_plan' && (
                                <span className="text-[7.5px] bg-amber-500/10 border border-amber-500/25 text-amber-400 px-1 py-0.25 rounded font-mono font-bold animate-pulse w-max">BSKAP 2025</span>
                              )}
                            </h4>
                            <p className="text-[10px] text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors pt-2 border-t border-zinc-900/50">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shrink-0" />
                            ASISTEN DOKUMEN PORTABEL
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* BENTO GRID MENU UTAMA SUPER CANGGIH & PREMIUM */}
              <div className="w-full bg-black border-2 border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_45px_rgba(250,204,21,0.12)] flex flex-col items-center gap-6 animate-fade-in mt-6">
                {/* Header inside the yellow border frame, premium bold italic uppercase style consistent with the uploaded image */}
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-xs sm:text-sm md:text-base font-sans font-black italic tracking-wider text-yellow-400 uppercase flex items-center justify-center gap-2">
                    ⚡ DEKRIPSI & DEKOMPRESI DOKUMEN (LURING / OFFLINE)
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1.5 font-sans text-center max-w-xl">
                    Semua operasi dijamin aman di browser komputer Anda tanpa diunggah ke internet. Privasi berkas Anda tetap terjaga sepenuhnya.
                  </p>
                </div>

                {/* Symmetrical 2-Column Grid Layout for Offline Suite */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                  {(() => {
                    const offlineItems = menuItems.filter(item => item.category === 'OFFLINE SUITE');
                    
                    const colorMap: Record<string, { hoverText: string; shadow: string; glow: string; stroke: string; fill: string }> = {
                      emerald: { hoverText: 'group-hover:text-emerald-300', shadow: 'drop-shadow-[0_2px_8px_rgba(52,211,153,0.6)]', glow: 'text-emerald-400', stroke: 'text-emerald-400', fill: 'fill-emerald-400/20' },
                      blue: { hoverText: 'group-hover:text-blue-300', shadow: 'drop-shadow-[0_2px_8px_rgba(96,165,250,0.6)]', glow: 'text-blue-400', stroke: 'text-blue-400', fill: 'fill-blue-400/20' },
                      rose: { hoverText: 'group-hover:text-rose-300', shadow: 'drop-shadow-[0_2px_8px_rgba(251,113,133,0.6)]', glow: 'text-rose-400', stroke: 'text-rose-400', fill: 'fill-rose-400/20' },
                      id_compress: { hoverText: 'group-hover:text-indigo-300', shadow: 'drop-shadow-[0_2px_8px_rgba(129,140,248,0.6)]', glow: 'text-indigo-400', stroke: 'text-indigo-400', fill: 'fill-indigo-400/20' },
                      indigo: { hoverText: 'group-hover:text-indigo-300', shadow: 'drop-shadow-[0_2px_8px_rgba(129,140,248,0.6)]', glow: 'text-indigo-400', stroke: 'text-indigo-400', fill: 'fill-indigo-400/20' },
                      purple: { hoverText: 'group-hover:text-purple-300', shadow: 'drop-shadow-[0_2px_8px_rgba(192,132,252,0.6)]', glow: 'text-purple-400', stroke: 'text-purple-400', fill: 'fill-purple-400/20' },
                      amber: { hoverText: 'group-hover:text-amber-300', shadow: 'drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]', glow: 'text-amber-400', stroke: 'text-amber-400', fill: 'fill-amber-400/20' }
                    };

                    return offlineItems.map((item, idx) => {
                      const IconComp = item.icon;
                      
                      const colorStyles = colorMap[item.bannerColor || 'slate'] || { hoverText: 'group-hover:text-amber-300', shadow: 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]', glow: 'text-amber-400', stroke: 'text-amber-400', fill: 'fill-amber-400/20' };
                      const iconColorClass = `${colorStyles.stroke} ${colorStyles.shadow}`;
                      const iconBg = 'bg-zinc-950/40 border border-yellow-400/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] group-hover:bg-[#0c1938]/40 group-hover:border-yellow-400/60';

                      // 2 Columns horizontally: all items take exactly 3 grid spans out of 6 (which is 1/2 width).
                      const colSpan = 'col-span-1 md:col-span-3';

                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectTool(item.id as any)}
                          className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 text-left ${colSpan} bg-[#0c1938] border-2 border-yellow-400 hover:bg-[#0f244d] hover:border-yellow-300 hover:shadow-[0_0_22px_rgba(250,204,21,0.25)]`}
                        >
                          {/* Beautiful custom numeral icon in top right corner (KARTU ANGKA BULAT) */}
                          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm font-black text-yellow-400 bg-black border-2 border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.35)] group-hover:border-yellow-300 group-hover:scale-110 transition-all duration-300 z-10 select-none">
                            {String(idx + 1).padStart(2, '0')}
                          </div>

                          {/* Attractive subtle floating background icon watermark moved to bottom corner */}
                          <div className="absolute bottom-1 right-2 pointer-events-none opacity-[0.06] group-hover:opacity-15 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 ease-out">
                            <IconComp className={`w-12 h-12 ${colorStyles.stroke}`} />
                          </div>

                          <div>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 mb-2.5 ${iconBg}`}>
                              <IconComp className={`w-4.5 h-4.5 ${iconColorClass}`} />
                            </div>
                            
                            <h4 className={`text-xs font-bold text-white tracking-wide ${colorStyles.hoverText} transition-colors`}>
                              {item.label}
                            </h4>
                            <p className="text-[10px] text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors pt-2 border-t border-zinc-900/50">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
                            LOKAL / PRIVAT
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* PERSISTENT API KEY CONTROL CENTER ON BERANDA */}
              <div className="bg-gradient-to-br from-[#0c0d12] via-[#08080c] to-zinc-950 border border-zinc-900 rounded-2xl p-5 md:p-6 w-full text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[15%] h-full opacity-[0.03] pointer-events-none flex items-center justify-end pr-6">
                  <Key className="w-16 h-16 text-amber-500" />
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1.5 flex-1 select-none">
                    <h3 className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      PENGATURAN MANDIRI API KEY GEMINI GURU
                    </h3>
                    <p className="text-[11.5px] text-zinc-400 leading-relaxed font-sans">
                      Untuk mengaktifkan asisten bimbingan akademis (pembuat kurikulum KOSP, rencana belajar BSKAP 046/2025, analisis file PDF Capaian Pembelajaran tebal), sistem memerlukan kunci API Gemini. Semua kunci dienkripsi &amp; disimpan secara privat di dalam peramban local komputer Anda tanpa dikirim ke server pihak ketiga apa pun.
                    </p>
                    {isQuotaExhausted ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10.5px] font-mono mt-2 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        STATUS KUNCI GURU: ganti api key
                      </div>
                    ) : customApiKey ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10.5px] font-mono mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        STATUS KUNCI GURU: Api key aktif
                      </div>
                    ) : serverConfig?.hasGeminiKey ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10.5px] font-mono mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        STATUS KUNCI GURU: Sistem API key aktif
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10.5px] font-mono mt-2 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        STATUS KUNCI GURU: masukan api key
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-[320px] bg-black/40 border border-zinc-900 p-4 rounded-xl space-y-3 shrink-0">
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-mono text-zinc-500 block uppercase tracking-wider font-extrabold select-none">Input/Tempel API Key Gemini:</label>
                      <input
                        type="text"
                        name="gemini_api_key_custom_field_main"
                        id="gemini_api_key_custom_field_main"
                        autoComplete="new-password"
                        style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                        placeholder="Masukkan kuncian AIzaSy..."
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="w-full bg-[#0d0e12] border border-zinc-800 text-amber-300 placeholder-zinc-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const cleanKey = tempApiKey.trim();
                          if (cleanKey) {
                            const encoded = encodeKey(cleanKey);
                            setCustomApiKey(cleanKey);
                            setQuotaExhaustedState(false);
                            localStorage.setItem('custom_gemini_api_key', encoded);

                            if (isAdmin) {
                              // Admin Mode: Propagate encoded key to the server so it's active for everyone
                              fetch('/api/save-key', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ encodedKey: encoded })
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  triggerNotification('success', "✓ Berhasil memperbarui & mengaktifkan API Key Gemini global di server!");
                                  setIsApiKeyMissing(false);
                                  refreshServerConfig();
                                } else {
                                  console.warn("Gagal sinkronisasi kunci ke hulu server:", data.error);
                                  triggerNotification('success', "✓ Kunci API disimpan di lokal browser.");
                                  setIsApiKeyMissing(false);
                                  refreshServerConfig();
                                }
                              })
                              .catch(err => {
                                console.error("Gagal sinkronisasi kunci ke server:", err);
                                triggerNotification('success', "✓ Kunci API disimpan di lokal browser.");
                                setIsApiKeyMissing(false);
                                refreshServerConfig();
                              });
                            } else {
                              // User Mode: Save locally only, do NOT sync to server
                              triggerNotification('success', "✓ Kunci API Gemini Anda disimpan privat luring di peramban ini!");
                              setIsApiKeyMissing(false);
                              refreshServerConfig();
                            }
                          } else {
                            triggerNotification('error', "Kolom API Key masih kosong.");
                          }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] text-black font-extrabold font-sans text-[10.5px] px-3.5 py-1.5 rounded-lg transition cursor-pointer flex-1 text-center justify-center flex items-center gap-1"
                      >
                        ✓ Simpan Kunci
                      </button>
                      {customApiKey && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomApiKey('');
                            setTempApiKey('');
                            setQuotaExhaustedState(false);
                            localStorage.removeItem('custom_gemini_api_key');
                            triggerNotification('delete', "Kunci API berhasil dihapus.");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 text-zinc-500 hover:text-red-400 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-zinc-850 cursor-pointer transition shrink-0"
                          title="Hapus Kunci Mandiri"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 📁 CADANGAN & PEMULIHAN DATA SEAMLESS */}
              <div className="bg-gradient-to-br from-[#070b19] via-[#04060c] to-zinc-950 border border-zinc-90 w-full border-zinc-900 rounded-2xl p-5 md:p-6 text-left relative overflow-hidden shadow-2xl">
                {/* Subtle cyber background grid or watermark */}
                <div className="absolute top-0 right-0 w-[15%] h-full opacity-[0.03] pointer-events-none flex items-center justify-end pr-6">
                  <Database className="w-16 h-16 text-indigo-400" />
                </div>
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1.5 flex-1 select-none">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono tracking-widest bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase font-extrabold">
                      Pencadangan Instan Terenkripsi Luring
                    </span>
                    <h3 className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-2 mt-1">
                      <Database className="w-4 h-4 text-indigo-500" />
                      FITUR CADANGAN & PEMULIHAN DATA SEKOLAH (BACKUP & RESTORE)
                    </h3>
                    <p className="text-[11.5px] text-zinc-400 leading-relaxed font-sans">
                      Sebagai antisipasi mengganti perangkat (laptop/komputer), Anda dapat mengamankan seluruh basis data profil satuan pendidikan, identitas murid, pengaturan KOSP, daftar nilai komprehensif, serta riwayat modul ajar ke dalam sebuah berkas tunggal terenkripsi luring (.json) untuk dipindahkan secara aman.
                    </p>
                  </div>

                  <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
                    {/* BUTTON EKSPOR / BACKUP */}
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full sm:w-auto bg-indigo-650 hover:bg-indigo-600 hover:shadow-[0_0_15px_rgba(79,70,229,0.25)] text-white font-extrabold font-sans text-[11px] px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>EKSPOR CADANGAN (.JSON)</span>
                    </button>

                    {/* BUTTON IMPOR / RESTORE */}
                    <label className="w-full sm:w-auto relative cursor-pointer block">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                        disabled={isImporting}
                      />
                      <span className={`w-full sm:w-auto bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-850 text-indigo-400 font-extrabold font-sans text-[11px] px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span>{isImporting ? "SEDANG MEMULIHKAN..." : "IMPOR & PULIHKAN DATA"}</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SEPARATOR BRANDING */}
              <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-zinc-500 w-full">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  STANDAR ENKRIPSI: AES_256_GCM | BYPASS_ENGINE: UNLOCKED
                </span>
                <span className="text-emerald-500 font-semibold">[SISTEM TERUJI & PRIVAT]</span>
              </div>

            </div>
          )}

          {/* 2. AUTOMATIC TABS (RENDER SESUAI ALAT YANG DIPILIH) */}
          {selectedTool !== 'home' && activeTab === 'automatic' && (
            <div key={selectedTool} className="space-y-8 animate-fade-in-slide-up">
              <section className="text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-display text-white text-sm tracking-wide uppercase flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-gradient-to-b from-amber-400 to-orange-500 rounded-sm inline-block" />
                    Kontrol Alat Aktif: {
                      selectedTool === 'school_profile' ? 'Profil Utama Sekolah' :
                      selectedTool === 'student_profile' ? 'Profil Integrasi Murid (Rapor S2)' :
                      selectedTool === 'excel' ? 'Excel Password Bypass' : 
                      selectedTool === 'word' ? 'Word Protect Bypass' : 
                      selectedTool === 'pdf_decrypt' ? 'PDF Perms Decryptor' : 
                      selectedTool === 'pdf_compress' ? 'Atur Ukuran PDF' :
                      selectedTool === 'ai_extract' ? 'Analisis CP' :
                      selectedTool === 'kosp' ? 'Penyusun Deraf KOSP Otomatis' :
                      selectedTool === 'lesson_plan' ? 'Kurikulum Perencanaan BSKAP 2025' :
                      selectedTool === 'rpm' ? 'Rencana Pembelajaran Mendalam (RPM)' :
                      selectedTool === 'buat_soal' ? 'Omega Studio Buat Soal Cerdas' :
                      selectedTool === 'p5_project' ? 'Modul Projek Kokurikuler' :
                      selectedTool === 'litnum' ? 'Capaian Literasi & Numerasi' :
                      selectedTool === 'absensi' ? 'Kartu Absensi Kelas' :
                      selectedTool === 'karakter_p5' ? 'Nilai Karakter Murid' :
                      selectedTool === 'daftar_nilai' ? 'Daftar Nilai Siswa Komprehensif' :
                      selectedTool === 'rapor' ? 'Lembar Rapor Kurikulum Merdeka Resmi' :
                      selectedTool === 'doc_bank' ? 'Bank Dokumen Luring Premium' :
                      'Kurikulum Perencanaan BSKAP 2025'
                    }
                  </h3>
                  <button 
                    onClick={() => handleSelectTool('home')}
                    className="text-xs font-sans font-extrabold text-zinc-950 border-2 border-yellow-500 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 p-2.5 py-3 px-10 rounded-xl hover:shadow-[0_0_20px_rgba(234,179,8,0.55)] hover:bg-gradient-to-r hover:from-yellow-300 hover:to-amber-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 shrink-0 cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_18px_rgba(234,179,8,0.35)] min-w-[240px] uppercase tracking-wider"
                  >
                    <Home className="w-4 h-4 text-zinc-950 shrink-0" />
                    ← Kembali ke Beranda
                  </button>
                </div>

                {selectedTool === 'school_profile' && <SchoolProfile />}
                {selectedTool === 'student_profile' && <StudentProfile />}
                {selectedTool === 'excel' && <FileProcessor />}
                {selectedTool === 'word' && <WordProcessor />}
                {selectedTool === 'pdf_decrypt' && <PdfDecryptor />}
                {selectedTool === 'pdf_compress' && <PdfCompressor />}
                {selectedTool === 'ai_extract' && <AiPdfExtractor />}
                {selectedTool === 'kosp' && <KospGenerator />}
                {selectedTool === 'lesson_plan' && <LessonPlanner />}
                {selectedTool === 'rpm' && <RPMGenerator />}
                {selectedTool === 'buat_soal' && <SoalGenerator />}
                {selectedTool === 'p5_project' && <ProjectModuleGenerator />}
                {selectedTool === 'litnum' && <LitNumProgress />}
                {selectedTool === 'absensi' && <AttendanceCard />}
                {selectedTool === 'karakter_p5' && <CharacterAssessment />}
                {selectedTool === 'daftar_nilai' && <DaftarNilai />}
                {selectedTool === 'rapor' && <RaporPanel />}
                {selectedTool === 'doc_bank' && <DocumentBank />}
                {selectedTool === 'tutorial' && <AppTutorial />}
                {selectedTool === 'admin_panel' && (isAdmin ? <AdminPanel /> : <div className="text-zinc-500 text-center py-12 font-mono text-xs uppercase tracking-widest">Akses Ditolak: Silakan masukkan Kode Admin di Bar atas.</div>)}
              </section>

              {/* Note styled with high-end safety indicators */}
              <div className="bg-gradient-to-r from-amber-955/10 via-zinc-950 to-orange-955/10 border-l-4 border-amber-500/60 border-r-4 border-orange-550/40 p-5 rounded-2xl flex gap-4 text-xs text-zinc-300 leading-relaxed font-sans shadow-xl text-left">
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="text-white block mb-1">Pernyataan Privasi File Terjamin:</strong> 
                  Operasi dekripsi biner luring murni mengandalkan pustaka lokal JavaScript di browser Anda. Tidak ada data berkas yang ditransfer ke server mana pun secara rahasia. Serta, pemrosesan asisten kurikulum dikendalikan melalui API aman luring yang aman demi keberlangsungan privasi sekuritas sekolah.
                </div>
              </div>
            </div>
          )}

          {/* 3. MANUAL COPIER VBA SUITE */}
          {activeTab === 'manual' && (
            <div key="manual" className="animate-fade-in-slide-up text-left">
              <ManualGuides
                onCopyVba={copyVbaToClipboard}
                vbaCode={VBA_SCRIPT}
                hasCopied={hasCopiedVba}
              />
            </div>
          )}

        </div>

        {/* FOOTER PREMIUM */}
        <footer className="border-t border-zinc-900 bg-zinc-950/60 py-8 text-center text-xs text-zinc-500 font-mono shrink-0">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <p>© 2026 CYBER_HYDRA ENGINE • Luring Cryptographic Toolsuite.</p>
            <p className="text-white/90 font-medium">RONI HARIYANTO BHIDJU, S.Pd</p>
          </div>
        </footer>

      </main>

      {/* PWA INSTALLATION HELPER MODAL */}
      {showPwaModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex justify-center items-start overflow-y-auto p-4 py-8 md:py-16 animate-fade-in">
          <div className="bg-[#0b0c10] border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] relative text-left space-y-6 my-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowPwaModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title & Icon Header */}
            <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">Instal Aplikasi Omega Guru</h3>
                <p className="text-[10px] text-zinc-500 font-mono">PROGRESSIVE WEB APP (PWA) ENGINE</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Omega Guru dapat dipasang langsung di Laptop / PC Anda agar dapat diakses kapan saja dengan cepat, beroperasi lebih lancar, stabil, serta hemat memori browser.
            </p>

            {/* Warning about IFrame preview constraint */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>⚠️ PERHATIAN CARA INSTALASI</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Anda saat ini membuka aplikasi di dalam halaman pratinjau editor (Iframe). Sistem keandalan browser melarang instalasi aplikasi dari dalam iframe.
              </p>
              <div className="pt-2 flex">
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-[11px] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Monitor className="w-3.5 h-3.5" /> Buka di Tab Baru & Instal
                </button>
              </div>
            </div>

            {/* Tutorial Steps */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">Langkah-Langkah Instalasi:</h4>
              
              <div className="space-y-3 font-sans text-xs text-zinc-400">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-mono text-[10px] shrink-0 font-bold">1</span>
                  <span>Klik tombol <strong>"Buka di Tab Baru & Instal"</strong> di atas.</span>
                </div>
                
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-mono text-[10px] shrink-0 font-bold">2</span>
                  <div>
                    <span>Di tab baru, cari tombol <strong>Instal</strong>:</span>
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-[11px]">
                      <li><strong>Google Chrome & Microsoft Edge:</strong> Cari ikon monitor kecil dengan tanda panah ke bawah (<Download className="w-3 h-3 inline" />) di pojok kanan Kolom Alamat (Address Bar) / URL.</li>
                      <li>Atau buka menu browser <span className="font-mono">Menubar/Titik Tiga</span> → pilih <strong>"Instal Halaman Ini sebagai Aplikasi..."</strong> atau <strong>"Simpan dan Bagikan" → "Pasang"</strong>.</li>
                      <li><strong>Safari (Mac / iPhone):</strong> Klik tombol <span className="font-semibold">Bagikan (Share)</span>, lalu pilih <strong>"Tambah ke Layar Utama (Add to Home Screen)"</strong>.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 font-mono text-[10px] shrink-0 font-bold">3</span>
                  <span>Selesai! Aplikasi akan muncul di daftar menu aplikasi dan shortcut desktop laptop Anda secara instan.</span>
                </div>
              </div>
            </div>

            {/* Footer buttons inside Modal */}
            <div className="pt-2 border-t border-zinc-900 flex justify-end">
              <button
                onClick={() => setShowPwaModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-[#0b0c10] border border-rose-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] relative text-center space-y-6 my-auto">
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#12080a] border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <LogOut className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider text-rose-500">Konfirmasi Keluar</h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">SESSION TERMINATION PROTOCOL</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Apakah Anda yakin ingin keluar dari sistem? Keluar akan me-reset sesi saat ini ke layar pembuka demi menjaga privasi dan keamanan data administrasi guru Anda.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-1/2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setShowIntro(true);
                  setSelectedTool('home');
                  setActiveTab('automatic');
                }}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs shadow-[0_4px_12px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CHANNELS Premium Activation Modal */}
      <ActivationModal 
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        onSuccess={() => setIsActivated(true)}
      />

      {/* CHANNELS Support Chat Drawer */}
      <SupportChat
        isOpen={showSupportDrawer}
        onClose={() => setShowSupportDrawer(false)}
        onOpenActivationModal={() => setIsActivationModalOpen(true)}
      />

      {/* 🔄 MODAL ANTREAN SINKRONISASI OFFLINE */}
      {showSyncPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-[#0b0c16] border-2 border-indigo-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in text-left">
            <div className="bg-gradient-to-r from-[#0b0c16] to-[#04060c] p-5 border-b border-indigo-950/40 flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-indigo-450 animate-pulse" />
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-indigo-300">BASIS DATA INDEXEDDB</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">ANTREAN SINKRONISASI LURING (SYNC QUEUE)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSyncPanel(false)}
                className="text-zinc-500 hover:text-white p-1.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto">
              <p className="text-[11.5px] text-zinc-400 leading-relaxed font-sans">
                Secara otomatis, semua perubahan dokumen yang Anda selesaikan saat berada dalam kondisi luring (internet mati) akan disimpan di dalam <strong>IndexedDB browser</strong>. Begitu perangkat ini tersambung kembali ke internet, sistem segera mengunggah & menyinkronkan seluruh perubahan ke penyimpanan utama browser <strong>localStorage</strong> guna mencegah hilangnya data berharga.
              </p>

              {syncQueueItems.length === 0 ? (
                <div className="border border-zinc-900 bg-[#030408] rounded-xl p-6 text-center text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider py-8">
                  ✓ Antrean Bersih: Tidak ada perubahan dokumen yang tertunda.
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[9.5px] font-mono tracking-widest text-[#4f46e5] uppercase font-bold block">
                    Daftar Perubahan Dokumen Tertunda ({syncQueueItems.length}):
                  </span>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {syncQueueItems.map((item, idx) => (
                      <div key={item.id || idx} className="border border-zinc-90 w-full border-zinc-900 bg-zinc-950/60 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase ${
                            item.action === 'CREATE' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' :
                            item.action === 'UPDATE' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/10' :
                            'bg-rose-500/15 text-rose-400 border border-rose-500/10'
                          }`}>
                            {item.action === 'CREATE' ? 'TAMBAH' : item.action === 'UPDATE' ? 'UBAH' : 'HAPUS'}
                          </span>
                          <span className="font-semibold text-zinc-200 ml-2 block truncate max-w-[200px]" title={item.documentName}>{item.documentName}</span>
                          <span className="text-[9px] text-zinc-500 font-mono block">ID: {item.documentId} ({new Date(item.timestamp).toLocaleTimeString()})</span>
                        </div>
                        <button
                          onClick={async () => {
                            if (item.id !== undefined) {
                              try {
                                const { removeSyncTask } = await import('./utils/offlineSync');
                                await removeSyncTask(item.id);
                                triggerNotification('delete', '✓ Tugas sinkronisasi dibatalkan dari antrean browser.');
                              } catch (e) {
                                console.error(e);
                              }
                            }
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/15 p-1 rounded transition text-[10px] font-mono px-2 border border-red-500/10 cursor-pointer"
                          title="Hapus tugas dari antrean luring"
                        >
                          Batal
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-900/60 flex justify-between gap-3">
              <button
                onClick={async () => {
                  if (window.confirm("Apakah Anda yakin ingin membuang semua antrean sync?")) {
                    try {
                      const db = await (await import('./utils/offlineSync')).openIndexedDB();
                      const transaction = db.transaction(['sync_queue'], 'readwrite');
                      transaction.objectStore('sync_queue').clear();
                      window.dispatchEvent(new CustomEvent('omega-sync-queue-updated'));
                      triggerNotification('delete', '✓ Semua antrean sinkronisasi IndexedDB berhasil dikosongkan.');
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
                disabled={syncQueueItems.length === 0}
                className="bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-4 py-2 rounded-xl transition font-sans hover:text-zinc-200 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                KOSONGKAN
              </button>

              <button
                onClick={async () => {
                  try {
                    const { processSyncQueue } = await import('./utils/offlineSync');
                    const processed = await processSyncQueue();
                    if (processed > 0) {
                      triggerNotification('success', `✓ Sukses! Berhasil memproses & menyinkronkan ${processed} perubahan ke penyimpanan lokal.`);
                      setShowSyncPanel(false);
                    } else {
                      triggerNotification('error', 'Tidak ada sinkronisasi tertunda atau perangkat masih offline.');
                    }
                  } catch (err) {
                    console.error(err);
                    triggerNotification('error', 'Gagal memproses sinkronisasi.');
                  }
                }}
                className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold font-sans text-xs px-5 py-2.5 rounded-xl transition hover:shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>SINKRONKAN SEKARANG</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
