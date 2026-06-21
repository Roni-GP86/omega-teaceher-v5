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
  Shield
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

export const RPMGenerator: React.FC = () => {
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
    return sessionStorage.getItem('omega_rpm_admin_verified') === 'true';
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
      'omega_rpm_link_sd_a', 'omega_rpm_link_sd_b', 'omega_rpm_link_sd_c',
      'omega_rpm_link_smp_7', 'omega_rpm_link_smp_8', 'omega_rpm_link_smp_9',
      'omega_rpm_link_sma_10', 'omega_rpm_link_sma_11', 'omega_rpm_link_sma_12'
    ];
    const loaded: Record<string, string> = {};
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) loaded[k] = val;
    });
    setCustomLinks(loaded);
  }, []);

  // Standard menu data
  const studiosSD: StudioOption[] = [
    {
      id: 'sd-a',
      name: 'STUDIO FASE A',
      sub: 'Modul Ajar Kelas I & II',
      defaultUrl: 'https://rpm-fase-a.netlify.app/',
      customKey: 'omega_rpm_link_sd_a',
      color: 'from-amber-600 to-amber-500'
    },
    {
      id: 'sd-b',
      name: 'STUDIO FASE B',
      sub: 'Modul Ajar Kelas III & IV',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_sd_b',
      color: 'from-orange-600 to-orange-500'
    },
    {
      id: 'sd-c',
      name: 'STUDIO FASE C',
      sub: 'Modul Ajar Kelas V & VI',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_sd_c',
      color: 'from-yellow-600 to-yellow-500'
    }
  ];

  const studiosSMP: StudioOption[] = [
    {
      id: 'smp-7',
      name: 'STUDIO KELAS VII',
      sub: 'Fase D - Tingkat Pertama',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_smp_7',
      color: 'from-blue-600 to-blue-500'
    },
    {
      id: 'smp-8',
      name: 'STUDIO KELAS VIII',
      sub: 'Fase D - Tingkat Menengah',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_smp_8',
      color: 'from-indigo-600 to-indigo-500'
    },
    {
      id: 'smp-9',
      name: 'STUDIO KELAS IX',
      sub: 'Fase D - Tingkat Akhir',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_smp_9',
      color: 'from-purple-600 to-purple-500'
    }
  ];

  const studiosSMA: StudioOption[] = [
    {
      id: 'sma-10',
      name: 'STUDIO FASE E (KELAS X)',
      sub: 'Fondasi Pendidikan Menengah',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_sma_10',
      color: 'from-emerald-600 to-emerald-500'
    },
    {
      id: 'sma-11',
      name: 'STUDIO FASE F (KELAS XI)',
      sub: 'Siswa Tingkat Lanjut',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_sma_11',
      color: 'from-teal-600 to-teal-500'
    },
    {
      id: 'sma-12',
      name: 'STUDIO FASE F (KELAS XII)',
      sub: 'Siswa Persiapan Karier/PT',
      defaultUrl: 'https://guru.kemdikbud.go.id/perangkat-ajar/',
      customKey: 'omega_rpm_link_sma_12',
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

    // 1.5. Package Selection Check
    let phaseKey = "";
    if (option.id === 'sd-a') phaseKey = "rpm_fase_a";
    else if (option.id === 'sd-b') phaseKey = "rpm_fase_b";
    else if (option.id === 'sd-c') phaseKey = "rpm_fase_c";
    else if (option.id.startsWith('smp')) phaseKey = "rpm_fase_d";
    else if (option.id === 'sma-10') phaseKey = "rpm_fase_e";
    else if (option.id === 'sma-11' || option.id === 'sma-12') phaseKey = "rpm_fase_f";

    let hasPackage = false;
    const purchasedStr = localStorage.getItem("omega_purchased_packages");
    if (purchasedStr) {
      try {
        const list = JSON.parse(purchasedStr) as string[];
        if (list.includes("premium") || (phaseKey && list.includes(phaseKey))) {
          hasPackage = true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!hasPackage) {
      return { allowed: false, reason: 'NOT_PURCHASED' };
    }

    const isClassTeacher = /guru kelas|wali kelas/i.test(profile.jabatan);
    if (!isClassTeacher) {
      // Guru Mapel can access all classes for their specific mapel!
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
          details: 'Sistem mendeteksi bahwa perangkat Anda belum terdaftar dengan lisensi Premium penuh yang sah. Untuk mengakses tautan pembuatan RPM, harap minta Kode Akses atau aktifkan melalui menu aktivasi terlebih dahulu.',
          type: 'unactivated',
          badge: 'STATUS: LISENSI BELUM TERVERIFIKASI'
        });
      } else if (check.reason === 'NOT_PURCHASED') {
        setAccessAlertMessage({
          title: 'Fase Belum Terpilih',
          details: 'Sistem mendeteksi bahwa akun Premium Anda tidak mengaktifkan paket untuk Fase ini pada saat mengajukan pendaftaran Kode Akses Premium. Anda tetap menggunakan data sekolah bawaan sistem yang ada, namun untuk mengedit dan memiliki izin input kustom lengkap pada fase ini silakan lakukan upgrade paket.',
          type: 'restricted_fase',
          badge: 'OTORISASI: PAKET BELUM DIAKTIFKAN'
        });
      } else {
        setAccessAlertMessage({
          title: 'Akses Dibatasi Jabatan',
          details: `Sebagai Guru Kelas / Wali Kelas dengan penugasan terdaftar "${profile.faseKelas}", Anda hanya diizinkan untuk mengakses Studio RPM yang sesuai dengan Fase ajar Anda (${check.reason}). Hal ini membantu mencegah potensi konflik penyusunan data KOSP & perangkat ajar milik guru kelas lain.`,
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
      // Just directly open for Class Teacher to avoid multi clicks
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Show Mapel success verification screen for double security & user feedback
      setAccessAlertMessage({
        title: 'Akses Spesialis Aktif',
        details: `Halo Bapak/Ibu Guru, akun Anda terdeteksi sebagai Guru Mata Pelajaran dengan spesialisasi: "${profile.jabatan}". Anda memiliki izin penuh murni lintas kelas, disaring khusus untuk seluruh materi mata pelajaran yang Anda ampu secara aman.`,
        type: 'subject_success',
        badge: 'OTORISASI: GURU MATA PELAJARAN',
        actionUrl: finalUrl
      });
    }
  };

  const verifyAdminCode = () => {
    const trimmedInput = authCodeInput.trim().toUpperCase();
    if (trimmedInput === 'OTE-GP017' || trimmedInput === 'OTE-GP19S' || trimmedInput === 'GP-RHB86') {
      sessionStorage.setItem('omega_rpm_admin_verified', 'true');
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

  // Quick resource links below
  const sourceResources = [
    { name: 'Platform Merdeka Mengajar', url: 'https://guru.kemdikbud.go.id/', desc: 'Kanal resmi Modul Ajar, Asesmen & Materi Kemdikbudristek.' },
    { name: 'Pusat Kurikulum Merdeka', url: 'https://kurikulum.kemdikbud.go.id/', desc: 'Unduh CP resmi, Panduan KOSP, Pembelajaran, & Asesmen.' },
    { name: 'Rujukan Canva Pembelajaran', url: 'https://www.canva.com/id_id/pendidikan/', desc: 'Hasilkan materi presentasi, LKPD, visual ajar kaya ekspresi.' }
  ];

  const getStudioList = () => {
    if (selectedLevel === 'SD') return studiosSD;
    if (selectedLevel === 'SMP') return studiosSMP;
    if (selectedLevel === 'SMA') return studiosSMA;
    return [];
  };

  return (
    <div id="rpm-hub-container" className="w-full min-h-[calc(100vh-6rem)] bg-zinc-950 rounded-[2.5rem] border border-zinc-900/60 p-6 md:p-10 text-white font-sans overflow-hidden shadow-2xl relative">
      
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-12 -left-24 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8 relative z-10 select-none">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black uppercase text-amber-500 tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Studio RPM Global Hub
          </div>
          <h1 className="text-3xl md:text-4.5xl font-black italic tracking-tight text-white uppercase flex items-center gap-3">
            🎯 OMEGA STUDIO RPM
          </h1>
          <p className="text-zinc-500 text-xs font-medium max-w-2xl leading-relaxed">
            Portal premium integrasi rencana dan modul aktivitas pembelajaran (RPM) lintas jenjang. 
            Terhubung langsung dengan platform penyedia ajar resmi dan dapat Anda sesuaikan menggunakan link khusus.
          </p>
        </div>

        {selectedLevel && (
          <button 
            id="btn-kembali-hub"
            onClick={() => setSelectedLevel(null)}
            className="self-start md:self-center flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" /> Kembali ke Menu
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
                
                {/* CARD FOR JOURNAL LEVEL SD */}
                <button
                  id="card-level-sd"
                  onClick={() => setSelectedLevel('SD')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-amber-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 text-amber-500 transition-colors mb-6">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase">
                      STUDIO RPM SD
                    </h3>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1.5">
                      Fase A, Fase B & Fase C
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900/80 w-full text-zinc-400 group-hover:text-amber-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <span>Akses Studio</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </button>

                {/* CARD FOR JOURNAL LEVEL SMP */}
                <button
                  id="card-level-smp"
                  onClick={() => setSelectedLevel('SMP')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-blue-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 text-blue-400 transition-colors mb-6">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-blue-400 transition-colors uppercase">
                      STUDIO RPM SMP
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

                {/* CARD FOR JOURNAL LEVEL SMA */}
                <button
                  id="card-level-sma"
                  onClick={() => setSelectedLevel('SMA')}
                  className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-850 hover:border-emerald-500/55 p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[260px]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300" />
                  
                  <div>
                    <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 text-emerald-400 transition-colors mb-6">
                      <Bookmark className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-wide text-white group-hover:text-emerald-400 transition-colors uppercase">
                      STUDIO RPM SMA/SMK
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
                  📂 Menu Studio Aktif: <span className="text-amber-500 text-base font-black italic ml-1">STUDIO RPM {selectedLevel}</span>
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
                            <span className="text-xl font-black italic text-zinc-100 uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                              {studio.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 font-medium mb-5">{studio.sub}</p>

                        {/* Status information badge showing current state */}
                        <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/60 mb-5 text-[11px] space-y-1">
                          <div className="flex justify-between text-zinc-500 font-bold uppercase tracking-wider">
                            <span>Status:</span>
                            <span className={hasCustom ? 'text-amber-400' : 'text-zinc-400'}>
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
                          <ExternalLink className="w-4 h-4" /> Buka Studio RPM <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>

                        <div className="flex gap-2">
                          <button
                            title="Atur Kunci API / Link Kustom"
                            onClick={(e) => handleStartEditing(studio, e)}
                            className="flex-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                          >
                            <Settings className="w-3.5 h-3.5 text-amber-500" /> Atur Link
                          </button>

                          {hasCustom && (
                            <button
                              title="Reset to Default"
                              onClick={(e) => handleResetLink(studio, e)}
                              className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-2.5 rounded-xl transition-all flex items-center justify-center text-red-400 hover:text-red-300"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {copiedKey === studio.customKey && (
                          <div className="text-center text-[10px] text-emerald-400 font-black tracking-widest uppercase animate-fade-in">
                            ✓ Berhasil Diperbarui!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CUSTOM URL SETTING MODAL INJECTOR */}
        {editingKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-900 border-2 border-zinc-800/80 rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative space-y-6">
              <div className="space-y-2">
                <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500">
                  <Settings className="w-6 h-6 animate-spin-slow" />
                </div>
                <h3 className="text-xl font-black italic tracking-wide uppercase text-white">Konfigurasi Alamat Kustom</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-semibold uppercase tracking-wider">
                  Masukkan URL Aplikasi Penyedia RPM/Modul Ajar pilihan sekolah Anda.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Tujuan Alamat Web (Link):</label>
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://contoh-aplikasi-penyedia.com/atau-drive"
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-amber-500/50 p-4 rounded-xl text-sm font-semibold tracking-wide text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-0 transition-colors"
                />
                <p className="text-[10px] text-zinc-500 leading-normal font-medium">
                  Atur link kustom untuk diarahkan ke lembar kerja platform eksternal, web sekolah, folder penyimpanan Google Drive berisi contoh RPM lengkap, ataupun aplikasi lokal buatan sendiri.
                </p>
              </div>

              {/* SECURITY / COPY BYPASS LOCKING MANUAL FOR NETWORK ADMINS */}
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850/50 space-y-2">
                <div className="flex items-center gap-1.5 text-red-400">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Praktek Penguncian Anti-Bypass (Rekomendasi Admin)</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                  Untuk mengunci aplikasi tujuan Anda agar hanya terakses via platform OMEGA (tidak bisa dicopas langsung di browser), tambahkan skrip di file <code className="text-zinc-200 font-mono">index.html</code> pada aplikasi Netlify penerima:
                </p>
                <pre className="text-[9px] bg-zinc-900 text-amber-500/90 p-2.5 rounded-lg overflow-x-auto font-mono leading-normal select-all">
{`const params = new URLSearchParams(window.location.search);
if (params.get('token_key') !== 'GP-RHB86-VERIFIED') {
  document.body.innerHTML = '<h3 style="color:red;font-family:sans-serif;text-align:center;margin-top:20%;">Akses Diblokir! Silakan buka melalui Aplikasi OMEGA.</h3>';
}`}
                </pre>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingKey(null)}
                  className="flex-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-855 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveLink}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-[0.98] py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black transition-all shadow-md"
                >
                  Simpan Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM ADMIN PASSCODE MODAL */}
        {authModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-zinc-900 border-2 border-red-500/20 rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative space-y-6 text-center">
              <div className="space-y-2">
                <div className="inline-flex p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 mx-auto">
                  <Settings className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black italic tracking-wide uppercase text-white">Verifikasi Otoritas Admin</h3>
                <p className="text-zinc-400 text-xs font-semibold leading-relaxed tracking-wider uppercase">
                  Menu konfigurasi ini hanya dapat diakses oleh Administrator Sistem OMEGA dengan kode akses yang sah.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Kode Akses Admin:</label>
                  <input
                    type="password"
                    value={authCodeInput}
                    onChange={(e) => {
                      setAuthCodeInput(e.target.value);
                      setAuthErrorMessage('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') verifyAdminCode();
                    }}
                    placeholder="Masukkan Kode Akses..."
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-500/50 p-4 rounded-xl text-center text-sm font-bold tracking-widest text-zinc-105 placeholder-zinc-700 focus:outline-none focus:ring-0 transition-all uppercase"
                  />
                </div>

                {authErrorMessage && (
                  <p className="text-xs text-red-400 font-bold tracking-wide uppercase animate-pulse">
                    ⚠️ {authErrorMessage}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setAuthModalOpen(false);
                    setPendingAdminAction(null);
                    setAuthCodeInput('');
                    setAuthErrorMessage('');
                  }}
                  className="flex-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={verifyAdminCode}
                  className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 active:scale-[0.98] py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-md"
                >
                  Konfirmasi GP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM USER ACCESS CONTROL MODAL (PREMIUM & PROFILE LOCKING) */}
        {accessAlertMessage && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in animate-duration-200">
            <div className={`bg-zinc-900 border-2 ${accessAlertMessage.type === 'subject_success' ? 'border-emerald-500/20' : 'border-amber-500/20'} rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative space-y-6 text-center`}>
              <div className="space-y-2">
                <div className={`inline-flex p-4 ${accessAlertMessage.type === 'subject_success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} border rounded-full mx-auto`}>
                  {accessAlertMessage.type === 'unactivated' ? (
                    <Lock className="w-8 h-8" />
                  ) : accessAlertMessage.type === 'restricted_fase' ? (
                    <Shield className="w-8 h-8" />
                  ) : (
                    <Sparkles className="w-8 h-8" />
                  )}
                </div>
                
                <div className="pt-2">
                  {accessAlertMessage.badge && (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border inline-block select-none ${accessAlertMessage.type === 'subject_success' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/5 text-amber-500 border-amber-500/20'}`}>
                      {accessAlertMessage.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black italic tracking-wide uppercase text-white pt-2">{accessAlertMessage.title}</h3>
                
                <p className="text-zinc-400 text-xs font-semibold leading-relaxed tracking-wide text-center">
                  {accessAlertMessage.details}
                </p>
              </div>

              {accessAlertMessage.type === 'restricted_fase' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850/50 space-y-1.5 text-left">
                  <div className="flex items-center gap-1 text-zinc-400 font-bold uppercase text-[9px]">
                    <Info className="w-3.5 h-3.5 text-amber-500" /> Profil Aktif Anda:
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium space-y-1 font-mono">
                    <div>✏️ Jabatan: <span className="text-zinc-300 font-bold font-sans">{profile.jabatan}</span></div>
                    <div>📂 Fase/Kelas: <span className="text-zinc-300 font-bold font-sans">{profile.faseKelas}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {accessAlertMessage.type === 'subject_success' ? (
                  <>
                    <button
                      onClick={() => setAccessAlertMessage(null)}
                      className="flex-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (accessAlertMessage.actionUrl) {
                          window.open(accessAlertMessage.actionUrl, '_blank', 'noopener,noreferrer');
                        }
                        setAccessAlertMessage(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-[0.98] py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      Buka Studio Mapel <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAccessAlertMessage(null)}
                    className="w-full bg-gradient-to-r from-zinc-900 to-zinc-950 hover:bg-zinc-850 border border-zinc-850 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-all shadow-md"
                  >
                    Tutup & Pahami
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: EDUCATION RESOURCE PLATFORM ACCELERATORS */}
        <div className="mt-14 border-t border-zinc-900 pt-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3 space-y-4">
              <h4 className="text-lg font-black italic text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Referensi Pendidikan Nasional
              </h4>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                Pendidik dapat mengakses rujukan materi ajar, asesmen, modul pembelajaran Kurikulum Merdeka, serta platform edukasi visual pendukung dengan jaminan keandalan kuota langsung dari kanal resmi kementerian.
              </p>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
              {sourceResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between transition-all hover:bg-zinc-900 shadow-md transform hover:-translate-y-1"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">Akselerasi Edu</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <h5 className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
                      {res.name}
                    </h5>
                    <p className="text-zinc-500 text-[11px] leading-relaxed font-medium">
                      {res.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
