import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  Settings, 
  Link, 
  RotateCcw, 
  BookOpen, 
  Plus, 
  GraduationCap, 
  ArrowLeft, 
  Check, 
  Info, 
  FileText,
  Bookmark,
  Lock,
  Shield,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudioOption {
  id: string;
  name: string;
  sub: string;
  defaultUrl: string;
  customKey: string;
  color: string;
}

export const SoalGenerator: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'SD' | 'SMP' | 'SMA' | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customLinks, setCustomLinks] = useState<Record<string, string>>({});

  // User Profile and Activation States from LocalStorage
  const [profile, setProfile] = useState(() => {
    const activeCodeCheck = localStorage.getItem("omega_active_activation_code");
    const isAdminCode = activeCodeCheck === "OTE-GP017" || activeCodeCheck === "OTE-GP19S";
    return {
      jabatan: localStorage.getItem("kosp_jabatan_guru") || "Guru Kelas",
      faseKelas: localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B",
      isActivated: localStorage.getItem("omega_is_activated") === "true",
      isSuperAdmin: isAdminCode || (localStorage.getItem("omega_is_activated") === "true" && isAdminCode),
    };
  });

  // State to manage access error/success message modal
  const [accessAlertMessage, setAccessAlertMessage] = useState<{
    title: string;
    details: string;
    type: 'unactivated' | 'restricted_fase' | 'subject_success';
    badge?: string;
    actionUrl?: string;
  } | null>(null);

  // Keep profile synchronized in real-time with app updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const activeCodeCheck = localStorage.getItem("omega_active_activation_code");
      const isAdminCode = activeCodeCheck === "OTE-GP017" || activeCodeCheck === "OTE-GP19S";
      setProfile({
        jabatan: localStorage.getItem("kosp_jabatan_guru") || "Guru Kelas",
        faseKelas: localStorage.getItem("kosp_fase_kelas") || "Kelas IV / Fase B",
        isActivated: localStorage.getItem("omega_is_activated") === "true",
        isSuperAdmin: isAdminCode || (localStorage.getItem("omega_is_activated") === "true" && isAdminCode),
      });
    };
    window.addEventListener("omega-school-profile-updated", handleProfileUpdate);
    window.addEventListener("omega-state-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleProfileUpdate);
      window.removeEventListener("omega-state-updated", handleProfileUpdate);
    };
  }, []);

  // Admin access validation states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('omega_soal_admin_verified') === 'true';
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authCodeInput, setAuthCodeInput] = useState<string>('');
  const [authErrorMessage, setAuthErrorMessage] = useState<string>('');
  const [pendingAdminAction, setPendingAdminAction] = useState<{
    type: 'edit' | 'reset';
    option: StudioOption;
  } | null>(null);

  // Fetch saved links from localStorage on mount
  useEffect(() => {
    const keys = [
      'omega_soal_link_sd_a', 'omega_soal_link_sd_b', 'omega_soal_link_sd_c',
      'omega_soal_link_smp_7', 'omega_soal_link_smp_8', 'omega_soal_link_smp_9',
      'omega_soal_link_sma_10', 'omega_soal_link_sma_11', 'omega_soal_link_sma_12'
    ];
    const loaded: Record<string, string> = {};
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) loaded[k] = val;
    });
    setCustomLinks(loaded);
  }, []);

  // Standard menu data (Buat Soal)
  const studiosSD: StudioOption[] = [
    {
      id: 'sd-a',
      name: 'STUDIO SOAL FASE A',
      sub: 'Asesmen & Bank Soal Kelas I & II',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sd_a',
      color: 'from-amber-600 to-amber-500'
    },
    {
      id: 'sd-b',
      name: 'STUDIO SOAL FASE B',
      sub: 'Asesmen & Bank Soal Kelas III & IV',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sd_b',
      color: 'from-orange-600 to-orange-500'
    },
    {
      id: 'sd-c',
      name: 'STUDIO SOAL FASE C',
      sub: 'Asesmen & Bank Soal Kelas V & VI',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sd_c',
      color: 'from-yellow-600 to-yellow-500'
    }
  ];

  const studiosSMP: StudioOption[] = [
    {
      id: 'smp-7',
      name: 'STUDIO SOAL KELAS VII',
      sub: 'Asesmen Fase D - Tingkat Pertama',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_smp_7',
      color: 'from-blue-600 to-blue-500'
    },
    {
      id: 'smp-8',
      name: 'STUDIO SOAL KELAS VIII',
      sub: 'Asesmen Fase D - Tingkat Menengah',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_smp_8',
      color: 'from-indigo-600 to-indigo-500'
    },
    {
      id: 'smp-9',
      name: 'STUDIO SOAL KELAS IX',
      sub: 'Asesmen Fase D - Tingkat Akhir',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_smp_9',
      color: 'from-purple-600 to-purple-500'
    }
  ];

  const studiosSMA: StudioOption[] = [
    {
      id: 'sma-10',
      name: 'STUDIO SOAL FASE E (X)',
      sub: 'Asesmen Pendidikan Kelas X',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sma_10',
      color: 'from-emerald-600 to-emerald-500'
    },
    {
      id: 'sma-11',
      name: 'STUDIO SOAL FASE F (XI)',
      sub: 'Asesmen Lanjutan Kelas XI',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sma_11',
      color: 'from-teal-600 to-teal-500'
    },
    {
      id: 'sma-12',
      name: 'STUDIO SOAL FASE F (XII)',
      sub: 'Asesmen Persiapan Kelulusan Kelas XII',
      defaultUrl: 'https://guru.kemdikbud.go.id/assessment/',
      customKey: 'omega_soal_link_sma_12',
      color: 'from-cyan-600 to-cyan-500'
    }
  ];

  const checkAccessPermission = (option: StudioOption): { allowed: boolean; reason?: string } => {
    // 1. Check if the user is activated
    if (!profile.isActivated) {
      return { allowed: false, reason: 'UNACTIVATED' };
    }

    // Super Admin check - Bypasses all limitations completely!
    if (profile.isSuperAdmin) {
      return { allowed: true };
    }

    // Package Selection Check
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (purchasedStr) {
      try {
        const list = JSON.parse(purchasedStr) as string[];
        if (!list.includes("premium") && !list.includes("pembuat_soal")) {
          return { allowed: false, reason: 'NOT_PURCHASED' };
        }
      } catch (e) {
        console.error(e);
      }
    }

    const isClassTeacher = /guru kelas|wali kelas/i.test(profile.jabatan);
    if (!isClassTeacher) {
      return { allowed: true };
    }

    // 2. Class Teacher Limitation
    const fk = (profile.faseKelas || '').toLowerCase();
    
    // Check SD-A
    if (option.id === 'sd-a') {
      const isAllowed = fk.includes('fase a') || fk.includes('kelas 1') || fk.includes('kelas 2') || fk.includes('kelas i') || fk.includes('kelas ii') || fk.includes('kelas 01') || fk.includes('kelas 02');
      return { allowed: isAllowed, reason: 'Fase A (Kelas I & II)' };
    }
    // Check SD-B
    if (option.id === 'sd-b') {
      const isAllowed = fk.includes('fase b') || fk.includes('kelas 3') || fk.includes('kelas 4') || fk.includes('kelas iii') || fk.includes('kelas iv') || fk.includes('kelas 03') || fk.includes('kelas 04');
      return { allowed: isAllowed, reason: 'Fase B (Kelas III & IV)' };
    }
    // Check SD-C
    if (option.id === 'sd-c') {
      const isAllowed = fk.includes('fase c') || fk.includes('kelas 5') || fk.includes('kelas 6') || fk.includes('kelas v') || fk.includes('kelas vi') || fk.includes('kelas 05') || fk.includes('kelas 06');
      return { allowed: isAllowed, reason: 'Fase C (Kelas V & VI)' };
    }

    // Check SMP
    if (option.id.startsWith('smp')) {
      const isSmp = fk.includes('smp') || fk.includes('fase d') || fk.includes('kelas 7') || fk.includes('kelas 8') || fk.includes('kelas 9') || fk.includes('vii') || fk.includes('viii') || fk.includes('ix');
      if (!isSmp) return { allowed: false, reason: 'Jenjang SMP' };

      if (option.id === 'smp-7') {
        const isAllowed = fk.includes('7') || fk.includes('vii') || (!fk.includes('8') && !fk.includes('ix') && !fk.includes('9') && !fk.includes('viii'));
        return { allowed: isAllowed, reason: 'Kelas VII (Fase D)' };
      }
      if (option.id === 'smp-8') {
        const isAllowed = fk.includes('8') || fk.includes('viii');
        return { allowed: isAllowed, reason: 'Kelas VIII (Fase D)' };
      }
      if (option.id === 'smp-9') {
        const isAllowed = fk.includes('9') || fk.includes('ix');
        return { allowed: isAllowed, reason: 'Kelas IX (Fase D)' };
      }
    }

    // Check SMA
    if (option.id.startsWith('sma')) {
      const isSma = fk.includes('sma') || fk.includes('smk') || fk.includes('fase e') || fk.includes('fase f') || fk.includes('kelas 10') || fk.includes('kelas 11') || fk.includes('kelas 12') || fk.includes('x');
      if (!isSma) return { allowed: false, reason: 'Jenjang SMA/SMK' };

      if (option.id === 'sma-10') {
        const isAllowed = fk.includes('10') || fk.includes('kelas x') || fk.includes('fase e');
        return { allowed: isAllowed, reason: 'Fase E (Kelas X)' };
      }
      if (option.id === 'sma-11') {
        const isAllowed = fk.includes('11') || fk.includes('kelas xi');
        return { allowed: isAllowed, reason: 'Fase F (Kelas XI)' };
      }
      if (option.id === 'sma-12') {
        const isAllowed = fk.includes('12') || fk.includes('kelas xii');
        return { allowed: isAllowed, reason: 'Fase F (Kelas XII)' };
      }
    }

    return { allowed: true };
  };

  const handleOpenLink = (option: StudioOption) => {
    // 1. Perform Access Control Checks first
    const check = checkAccessPermission(option);
    
    if (!check.allowed) {
      if (check.reason === 'UNACTIVATED') {
        setAccessAlertMessage({
          title: 'Akses Premium Belum Aktif',
          details: 'Sistem mendeteksi bahwa perangkat Anda belum terdaftar dengan lisensi Premium penuh yang sah. Untuk mengakses pembuatan soal, harap minta Kode Akses atau aktifkan melalui menu aktivasi terlebih dahulu.',
          type: 'unactivated',
          badge: 'STATUS: LISENSI BELUM TERVERIFIKASI'
        });
      } else if (check.reason === 'NOT_PURCHASED') {
        setAccessAlertMessage({
          title: 'Paket Belum Terpilih',
          details: 'Sistem mendeteksi bahwa akun Premium Anda belum mengaktifkan paket Pembuat Soal pada saat pendaftaran Kode Akses Premium. Silakan lakukan upgrade paket atau beli satuan paket PEMBUAT SOAL untuk mengakses fitur kustom pembuatan soal cerdas ini.',
          type: 'restricted_fase',
          badge: 'OTORISASI: PAKET BELUM DIAKTIFKAN'
        });
      } else {
        setAccessAlertMessage({
          title: 'Akses Dibatasi Jabatan',
          details: `Sebagai Guru Kelas / Wali Kelas dengan penugasan terdaftar "${profile.faseKelas}", Anda hanya diizinkan untuk mengakses Studio Soal yang sesuai dengan Fase ajar Anda (${check.reason}). Hal ini membantu mencegah potensi konflik penyusunan materi & bank soal milik guru kelas lain.`,
          type: 'restricted_fase',
          badge: 'OTORISASI: TERBATAS GURU KELAS'
        });
      }
      return;
    }

    // Construct the locked, secure link to be open
    const baseUrl = customLinks[option.customKey] || option.defaultUrl;
    let finalUrl = '';
    const isClassTeacher = /guru kelas|wali kelas/i.test(profile.jabatan);

    try {
      const urlObj = new URL(baseUrl);
      urlObj.searchParams.set('auth_gateway', 'omega-authorized-app');
      urlObj.searchParams.set('token_key', 'GP-RHB86-VERIFIED');
      urlObj.searchParams.set('secure_origin', 'omega_platform_exclusive_gate');
      urlObj.searchParams.set('timestamp', Date.now().toString());
      if (!isClassTeacher) {
        urlObj.searchParams.set('subject_only', profile.jabatan);
        urlObj.searchParams.set('subject_mode', 'exclusive');
      }
      finalUrl = urlObj.toString();
    } catch (e) {
      const sep = baseUrl.includes('?') ? '&' : '?';
      let params = `auth_gateway=omega-authorized-app&token_key=GP-RHB86-VERIFIED&secure_origin=omega_platform_exclusive_gate&timestamp=${Date.now()}`;
      if (!isClassTeacher) {
        params += `&subject_only=${encodeURIComponent(profile.jabatan)}&subject_mode=exclusive`;
      }
      finalUrl = `${baseUrl}${sep}${params}`;
    }

    // 2. Clear route flow for Class Teacher, Super Admin vs Guru Mapel
    if (profile.isSuperAdmin || isClassTeacher) {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Show Mapel success verification screen for double security & user feedback
      setAccessAlertMessage({
        title: 'Akses Spesialis Aktif',
        details: `Halo Bapak/Ibu Guru, akun Anda terdeteksi sebagai Guru Mata Pelajaran dengan spesialisasi: "${profile.jabatan}". Anda memiliki izin penuh murni lintas kelas, disaring khusus untuk pembuatan soal mata pelajaran yang Anda ampu secara aman.`,
        type: 'subject_success',
        badge: 'OTORISASI: GURU MATA PELAJARAN',
        actionUrl: finalUrl
      });
    }
  };

  const verifyAdminCode = () => {
    const trimmedInput = authCodeInput.trim().toUpperCase();
    if (trimmedInput === 'OTE-GP017' || trimmedInput === 'OTE-GP19S' || trimmedInput === 'GP-RHB86') {
      sessionStorage.setItem('omega_soal_admin_verified', 'true');
      setIsAdminUnlocked(true);
      setAuthModalOpen(false);
      setAuthErrorMessage('');
      const action = pendingAdminAction;
      setPendingAdminAction(null);
      setAuthCodeInput('');
      
      if (action) {
        if (action.type === 'edit') {
          setEditingKey(action.option.customKey);
          setTempUrl(customLinks[action.option.customKey] || action.option.defaultUrl);
        } else if (action.type === 'reset') {
          performResetLink(action.option);
        }
      }
    } else {
      setAuthErrorMessage('Kode Akses Admin salah! Akses ditolak.');
    }
  };

  const handleStartEditing = (option: StudioOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdminUnlocked) {
      setPendingAdminAction({ type: 'edit', option });
      setAuthModalOpen(true);
      setAuthErrorMessage('');
      setAuthCodeInput('');
    } else {
      setEditingKey(option.customKey);
      setTempUrl(customLinks[option.customKey] || option.defaultUrl);
    }
  };

  const handleSaveLink = () => {
    if (!editingKey) return;
    if (tempUrl.trim()) {
      localStorage.setItem(editingKey, tempUrl.trim());
      setCustomLinks(prev => ({ ...prev, [editingKey]: tempUrl.trim() }));
    } else {
      localStorage.removeItem(editingKey);
      setCustomLinks(prev => {
        const copy = { ...prev };
        delete copy[editingKey];
        return copy;
      });
    }
    setEditingKey(null);
    setCopiedKey(editingKey);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleResetLink = (option: StudioOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdminUnlocked) {
      setPendingAdminAction({ type: 'reset', option });
      setAuthModalOpen(true);
      setAuthErrorMessage('');
      setAuthCodeInput('');
    } else {
      performResetLink(option);
    }
  };

  const performResetLink = (option: StudioOption) => {
    localStorage.removeItem(option.customKey);
    setCustomLinks(prev => {
      const copy = { ...prev };
      delete copy[option.customKey];
      return copy;
    });
    setCopiedKey(option.customKey);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getStudioList = () => {
    if (selectedLevel === 'SD') return studiosSD;
    if (selectedLevel === 'SMP') return studiosSMP;
    if (selectedLevel === 'SMA') return studiosSMA;
    return [];
  };

  return (
    <div id="soal-hub-container" className="w-full min-h-[calc(100vh-6rem)] bg-zinc-950 rounded-[2.5rem] border border-zinc-900/60 p-6 md:p-10 text-white font-sans overflow-hidden shadow-2xl relative">
      
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-12 -left-24 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8 relative z-10 select-none">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase text-yellow-500 tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Studio Pembuat Soal Cerdas
          </div>
          <h1 className="text-3xl md:text-4.5xl font-black italic tracking-tight text-white uppercase flex items-center gap-3">
            ⚡ OMEGA STUDIO BUAT SOAL
          </h1>
          <p className="text-zinc-500 text-xs font-medium max-w-2xl leading-relaxed">
            Portal premium integrasi pembuatan asesmen, instrumen penilaian, dan bank soal interaktif luring & daring.
            Terhubung langsung dengan portal premium dan dapat disesuaikan menggunakan tautan luring khusus.
          </p>
        </div>

        {selectedLevel && (
          <button 
            id="btn-kembali-soal-hub"
            onClick={() => setSelectedLevel(null)}
            className="self-start md:self-center flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-500" /> Kembali ke Jenjang
          </button>
        )}
      </div>

      <div className="mt-8 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedLevel ? (
            /* JENJANG SELECTION VIEW */
            <motion.div 
              key="level-selector"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARD FOR LEVEL SD */}
                <button
                  id="card-level-sd-soal"
                  onClick={() => setSelectedLevel('SD')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-yellow-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-yellow-500/30 group-hover:bg-yellow-500/5 text-yellow-500 transition-colors mb-6">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-yellow-400 transition-colors uppercase">
                      STUDIO SOAL SD
                    </h3>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1.5">
                      Fase A, Fase B & Fase C
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900/80 w-full text-zinc-400 group-hover:text-yellow-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <span>Akses Studio</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>

                {/* CARD FOR LEVEL SMP */}
                <button
                  id="card-level-smp-soal"
                  onClick={() => setSelectedLevel('SMP')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-blue-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 text-blue-400 transition-colors mb-6">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-blue-400 transition-colors uppercase">
                      STUDIO SOAL SMP
                    </h3>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1.5">
                      Fase D - Kelas 7, 8, & 9
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900/80 w-full text-zinc-400 group-hover:text-blue-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <span>Akses Studio</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>

                {/* CARD FOR LEVEL SMA */}
                <button
                  id="card-level-sma-soal"
                  onClick={() => setSelectedLevel('SMA')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-emerald-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 text-emerald-400 transition-colors mb-6">
                      <Bookmark className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-emerald-400 transition-colors uppercase">
                      STUDIO SOAL SMA/SMK
                    </h3>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1.5">
                      Fase E & Fase F (Kelas 10 - 12)
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900/80 w-full text-zinc-400 group-hover:text-emerald-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <span>Akses Studio</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>

              </div>
            </motion.div>
          ) : (
            /* SUB-LEVEL PHASE CARDS */
            <motion.div
              key="phase-selector"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="mb-4">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest bg-zinc-900 py-2.5 px-6 rounded-full inline-block border border-zinc-850">
                  📁 Menu Studio Aktif: <span className="text-yellow-500 text-base font-black italic ml-1">STUDIO SOAL {selectedLevel}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getStudioList().map((studio) => {
                  const savedUrl = customLinks[studio.customKey];
                  const hasCustom = !!savedUrl;
                  const activeUrl = savedUrl || studio.defaultUrl;

                  return (
                    <div 
                      key={studio.id}
                      className="group bg-zinc-900 border border-zinc-850 hover:border-zinc-700 p-6 rounded-[2.2rem] transition-all duration-300 flex flex-col justify-between min-h-[240px] shadow-lg relative"
                    >
                      <div>
                        {/* Upper Header strip */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest block">ROUTING PORTAL</span>
                            <span className="text-xl font-black italic text-zinc-100 uppercase tracking-tight group-hover:text-yellow-400 transition-colors">
                              {studio.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 font-medium mb-5">{studio.sub}</p>

                        {/* Status information badge showing current state */}
                        <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/60 mb-5 text-[11px] space-y-1">
                          <div className="flex justify-between text-zinc-500 font-bold uppercase tracking-wider">
                            <span>Status:</span>
                            <span className={hasCustom ? 'text-yellow-400' : 'text-zinc-400'}>
                              {hasCustom ? 'LINK KUSTOM AKTIF' : 'LINK DEFAULT'}
                            </span>
                          </div>
                          <p className="font-semibold text-[10px] text-emerald-450 tracking-tight flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Terintegrasi & Terkoneksi Aman
                          </p>
                        </div>
                      </div>

                      {/* Controls and trigger actions */}
                      <div className="space-y-3.5">
                        <button
                          onClick={() => handleOpenLink(studio)}
                          className={`w-full bg-gradient-to-r ${studio.color} hover:brightness-110 active:scale-[0.98] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-black transition-all shadow-md`}
                        >
                          <ExternalLink className="w-4 h-4" /> Buka Studio Soal <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>

                        <div className="flex gap-2">
                          <button
                            title="Atur Kunci API / Link Kustom"
                            onClick={(e) => handleStartEditing(studio, e)}
                            className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Edit Link</span>
                          </button>
                          
                          {hasCustom && (
                            <button
                              title="Reset Link ke Default"
                              onClick={(e) => handleResetLink(studio, e)}
                              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-rose-450 hover:text-rose-400 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action status notification overlay */}
                      {copiedKey === studio.customKey && (
                        <div className="absolute inset-0 bg-black/90 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center animate-fade-in z-20">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Konfigurasi Disimpan</span>
                          <p className="text-[10px] text-zinc-500 mt-1">Konfigurasi link studio soal berhasil diperbarui lokal.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER INFO CORNER */}
      <div className="mt-12 border-t border-zinc-900 pt-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 text-zinc-600">
          <Shield className="w-5 h-5 text-yellow-500" />
          <span className="text-[10px] font-mono tracking-widest uppercase">OMEGA SECURITY HIGH-GATE ACTIVE</span>
        </div>
        <p className="text-[10px] text-zinc-600 max-w-md md:text-right leading-relaxed font-sans">
          Seluruh tautan yang Anda simpan disimpan secara offline sepenuhnya di browser ini, 
          tanpa risiko sinkronisasi awan eksternal yang tidak sah.
        </p>
      </div>

      {/* PORTAL LINK EDITOR MODAL */}
      {editingKey && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-55 animate-fade-in text-left">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Link className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider text-white uppercase italic">KUSTOMISASI TAUTAN STUDIO</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Beralih ke Google Forms, Quizizz, Wordwall, atau server lokal Anda.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 block mb-2">Tautan URL Baru (Harus diawali https://)</label>
                <input 
                  type="url" 
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/... atau link bank soal Anda"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 font-sans"
                />
                <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  Tautan baru ini hanya akan berlaku di komputer/perangkat lokal Anda saat ini. Kosongkan isian untuk mereset kembali ke standard.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setEditingKey(null)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-855 text-zinc-400 hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveLink}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SECURITY LOCK MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-55 animate-fade-in text-left">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wider text-rose-500 uppercase italic">KONTROL ADMINISTRATOR UTAMA</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Diperlukan autentikasi pengembang Omega Engine.</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Untuk mengubah, menimpa tautan default, atau meretas konfigurasi studio, 
                harap masukkan <strong>KODE LISENSI PREMIUM</strong> (Kode Akses Anda) sebagai bentuk otorisasi pengembang legal.
              </p>

              <div>
                <input 
                  type="password" 
                  value={authCodeInput}
                  onChange={(e) => setAuthCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyAdminCode()}
                  placeholder="Masukkan Lisensi Premium (e.g. GP-XXXXX)"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono tracking-widest text-center"
                />
                {authErrorMessage && (
                  <p className="text-[10px] text-rose-500 font-bold mt-2 animate-shake text-center">{authErrorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => {
                  setAuthModalOpen(false);
                  setPendingAdminAction(null);
                  setAuthCodeInput('');
                  setAuthErrorMessage('');
                }}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-855 text-zinc-400 hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Batal
              </button>
              <button 
                onClick={verifyAdminCode}
                className="bg-rose-500 hover:bg-rose-400 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                Buka Gembok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC ACCESS MODAL DIALOGS */}
      {accessAlertMessage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-55 animate-fade-in text-left">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Conditional colorful top glow */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              accessAlertMessage.type === 'unactivated' ? 'bg-amber-500' :
              accessAlertMessage.type === 'restricted_fase' ? 'bg-orange-500' : 'bg-emerald-500'
            }`} />

            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  accessAlertMessage.type === 'unactivated' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' :
                  accessAlertMessage.type === 'restricted_fase' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' :
                  'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}>
                  {accessAlertMessage.type === 'unactivated' && <Lock className="w-5 h-5" />}
                  {accessAlertMessage.type === 'restricted_fase' && <Shield className="w-5 h-5" />}
                  {accessAlertMessage.type === 'subject_success' && <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wider text-white uppercase italic">{accessAlertMessage.title}</h3>
                  <span className="text-[8px] font-mono font-bold tracking-wider text-zinc-500 uppercase block mt-0.5">{accessAlertMessage.badge}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              {accessAlertMessage.details}
            </p>

            <div className="flex gap-3 justify-end pt-2 border-t border-zinc-900">
              <button 
                onClick={() => setAccessAlertMessage(null)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-855 text-zinc-400 hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
              >
                {accessAlertMessage.type === 'subject_success' ? 'Batal' : 'Mengerti'}
              </button>
              
              {accessAlertMessage.type === 'subject_success' && accessAlertMessage.actionUrl && (
                <button 
                  onClick={() => {
                    window.open(accessAlertMessage.actionUrl, '_blank', 'noopener,noreferrer');
                    setAccessAlertMessage(null);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-zinc-950 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95"
                >
                  Buka Portal Sekarang →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
