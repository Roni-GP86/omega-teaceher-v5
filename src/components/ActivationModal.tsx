import React, { useState, useRef, useEffect } from "react";
import { 
  X, Check, ShieldCheck, Key, Upload, FileText, Image as ImageIcon, 
  Copy, Phone, CornerDownRight, School, Users, Layers, ShieldAlert, Zap
} from "lucide-react";
import { 
  saveActivationRequest, 
  saveSupportMessageToFirebase,
  db
} from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface RpmOption {
  key: string;
  label: string;
}

const getRpmOptionsList = (jenjang: string): RpmOption[] => {
  if (jenjang === "SD") {
    return [
      { key: "rpm_sd_fase_a", label: "RPM SD Fase A (Kelas 1 & 2)" },
      { key: "rpm_sd_fase_b", label: "RPM SD Fase B (Kelas 3 & 4)" },
      { key: "rpm_sd_fase_c", label: "RPM SD Fase C (Kelas 5 & 6)" },
      { key: "rpm_sd_agama_islam", label: "RPM Agama Islam (SD)" },
      { key: "rpm_sd_agama_kristen", label: "RPM Agama Kristen (SD)" },
      { key: "rpm_sd_agama_katolik", label: "RPM Agama Katolik (SD)" },
    ];
  } else if (jenjang === "SMP") {
    return [
      { key: "rpm_smp_fase_d", label: "RPM SMP Fase D (Kelas 7, 8, & 9)" },
      { key: "rpm_smp_agama_islam", label: "RPM Agama Islam (SMP)" },
      { key: "rpm_smp_agama_kristen", label: "RPM Agama Kristen (SMP)" },
      { key: "rpm_smp_agama_katolik", label: "RPM Agama Katolik (SMP)" },
    ];
  } else if (jenjang === "SMK") {
    return [
      { key: "rpm_smk_fase_e_f", label: "RPM SMK Fase E & F (Kelas 10, 11, & 12)" },
      { key: "rpm_smk_agama_islam", label: "RPM Agama Islam (SMK)" },
      { key: "rpm_smk_agama_kristen", label: "RPM Agama Kristen (SMK)" },
      { key: "rpm_smk_agama_katolik", label: "RPM Agama Katolik (SMK)" },
    ];
  } else { // SMA
    return [
      { key: "rpm_sma_fase_e_f", label: "RPM SMA Fase E & F (Kelas 10, 11, & 12)" },
      { key: "rpm_sma_agama_islam", label: "RPM Agama Islam (SMA)" },
      { key: "rpm_sma_agama_kristen", label: "RPM Agama Kristen (SMA)" },
      { key: "rpm_sma_agama_katolik", label: "RPM Agama Katolik (SMA)" },
    ];
  }
};

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<"request" | "enter_code">("request");
  
  // Package Selection States (Premium selected by default)
  const [selectedPremium, setSelectedPremium] = useState(false);
  const [selectedKosp, setSelectedKosp] = useState(false);
  const [selectedPerencana, setSelectedPerencana] = useState(false);
  const [selectedRpmKeys, setSelectedRpmKeys] = useState<{ [key: string]: boolean }>({});
  const [selectedLitNum, setSelectedLitNum] = useState(false);
  const [selectedPembuatSoal, setSelectedPembuatSoal] = useState(false);
  const [selectedKarakter, setSelectedKarakter] = useState(false);
  const [selectedAbsensi, setSelectedAbsensi] = useState(false);
  const [selectedNilaiRapor, setSelectedNilaiRapor] = useState(false);

  // Form fields for request
  const [schoolName, setSchoolName] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalNip, setPrincipalNip] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherNip, setTeacherNip] = useState("");
  const [jabatan, setJabatan] = useState("Guru Kelas");
  const [agamaType, setAgamaType] = useState("Pendidikan Agama Islam");
  const [faseKelas, setFaseKelas] = useState("Fase C (Kelas 6)");
  const [waNumber, setWaNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [requestCode, setRequestCode] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field for pasting code
  const [codeToActivate, setCodeToActivate] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getActiveJenjang = () => {
    const fk = (faseKelas || "").toUpperCase();
    if (fk.includes("FASE A") || fk.includes("FASE B") || fk.includes("FASE C") || fk.includes("KELAS 1") || fk.includes("KELAS 2") || fk.includes("KELAS 3") || fk.includes("KELAS 4") || fk.includes("KELAS 5") || fk.includes("KELAS 6")) {
      return "SD";
    }
    if (fk.includes("FASE D") || fk.includes("KELAS 7") || fk.includes("KELAS 8") || fk.includes("KELAS 9")) {
      return "SMP";
    }
    if (fk.includes("FASE E") || fk.includes("FASE F") || fk.includes("KELAS 10") || fk.includes("KELAS 11") || fk.includes("KELAS 12")) {
      if (schoolName.toUpperCase().includes("SMK")) {
        return "SMK";
      }
      return "SMA";
    }
    // Fallback to name match
    const upName = schoolName.toUpperCase();
    if (upName.includes("SMP") || upName.includes("MTS")) return "SMP";
    if (upName.includes("SMK")) return "SMK";
    if (upName.includes("SMA") || upName.includes("MA ")) return "SMA";
    return "SD";
  };

  const getAutoDetectedRpmKey = (currentJenjang: string) => {
    const isAgama = (jabatan || "").includes("Agama");
    const isIslam = isAgama && (jabatan.includes("Islam") || (agamaType && agamaType.includes("Islam")));
    const isKristen = isAgama && (jabatan.includes("Kristen") || (agamaType && agamaType.includes("Kristen")));
    const isKatolik = isAgama && (jabatan.includes("Katolik") || (agamaType && agamaType.includes("Katolik")));

    if (currentJenjang === "SD") {
      if (isIslam) return "rpm_sd_agama_islam";
      if (isKristen) return "rpm_sd_agama_kristen";
      if (isKatolik) return "rpm_sd_agama_katolik";
      
      const fk = (faseKelas || "").toUpperCase();
      if (fk.includes("FASE A") || fk.includes("KELAS 1") || fk.includes("KELAS 2") || (jabatan && (jabatan.includes("Kelas 1") || jabatan.includes("Kelas 2")))) {
        return "rpm_sd_fase_a";
      }
      if (fk.includes("FASE B") || fk.includes("KELAS 3") || fk.includes("KELAS 4") || (jabatan && (jabatan.includes("Kelas 3") || jabatan.includes("Kelas 4")))) {
        return "rpm_sd_fase_b";
      }
      return "rpm_sd_fase_c";
    } else if (currentJenjang === "SMP") {
      if (isIslam) return "rpm_smp_agama_islam";
      if (isKristen) return "rpm_smp_agama_kristen";
      if (isKatolik) return "rpm_smp_agama_katolik";
      return "rpm_smp_fase_d";
    } else if (currentJenjang === "SMK") {
      if (isIslam) return "rpm_smk_agama_islam";
      if (isKristen) return "rpm_smk_agama_kristen";
      if (isKatolik) return "rpm_smk_agama_katolik";
      return "rpm_smk_fase_e_f";
    } else { // SMA
      if (isIslam) return "rpm_sma_agama_islam";
      if (isKristen) return "rpm_sma_agama_kristen";
      if (isKatolik) return "rpm_sma_agama_katolik";
      return "rpm_sma_fase_e_f";
    }
  };

  // Keep track of last sync autoKey to prevent overriding manual toggles in a loop
  const lastAutoKeyRef = useRef<string>("");

  useEffect(() => {
    const currentJenjang = getActiveJenjang();
    const autoKey = getAutoDetectedRpmKey(currentJenjang);
    
    if (autoKey !== lastAutoKeyRef.current) {
      lastAutoKeyRef.current = autoKey;
      if (selectedPremium) {
        setSelectedRpmKeys({ [autoKey]: true });
      } else {
        setSelectedRpmKeys({}); // If not premium, do not check anything automatically!
      }
    }
  }, [schoolName, faseKelas, jabatan, agamaType, selectedPremium]);

  // Auto-promote to premium if all individual packages are checked manually
  useEffect(() => {
    const isAllChecked = 
      selectedKosp && 
      selectedPerencana && 
      selectedLitNum && 
      selectedPembuatSoal && 
      selectedKarakter && 
      selectedAbsensi && 
      selectedNilaiRapor && 
      Object.values(selectedRpmKeys).some(Boolean);
      
    if (isAllChecked && !selectedPremium) {
      setSelectedPremium(true);
    }
  }, [
    selectedKosp, 
    selectedPerencana, 
    selectedLitNum, 
    selectedPembuatSoal, 
    selectedKarakter, 
    selectedAbsensi, 
    selectedNilaiRapor, 
    selectedRpmKeys,
    selectedPremium
  ]);

  const formatRupiah = (num: number) => {
    return "Rp. " + num.toLocaleString("id-ID");
  };

  const handlePremiumToggle = (val: boolean) => {
    setSelectedPremium(val);
    if (val) {
      setSelectedKosp(true);
      setSelectedPerencana(true);
      
      const currentJenjang = getActiveJenjang();
      const autoKey = getAutoDetectedRpmKey(currentJenjang);
      setSelectedRpmKeys({ [autoKey]: true });

      setSelectedLitNum(true);
      setSelectedPembuatSoal(true);
      setSelectedKarakter(true);
      setSelectedAbsensi(true);
      setSelectedNilaiRapor(true);
    }
  };

  const handleSubToggle = (pkg: string, val: boolean) => {
    if (!val) {
      setSelectedPremium(false);
    }
    switch (pkg) {
      case "kosp": setSelectedKosp(val); break;
      case "perencana": setSelectedPerencana(val); break;
      case "litnum": setSelectedLitNum(val); break;
      case "pembuat_soal": setSelectedPembuatSoal(val); break;
      case "karakter": setSelectedKarakter(val); break;
      case "absensi": setSelectedAbsensi(val); break;
      case "nilai_rapor": setSelectedNilaiRapor(val); break;
    }
  };

  const handleRpmKeyToggle = (key: string, val: boolean) => {
    if (!val) {
      setSelectedPremium(false);
    }
    setSelectedRpmKeys(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const calculateTotal = () => {
    const isAllChecked = 
      selectedKosp && 
      selectedPerencana && 
      selectedLitNum && 
      selectedPembuatSoal && 
      selectedKarakter && 
      selectedAbsensi && 
      selectedNilaiRapor && 
      Object.values(selectedRpmKeys).some(Boolean);

    if (selectedPremium || isAllChecked) {
      return 125000;
    }
    let sum = 0;
    if (selectedKosp) sum += 25000;
    if (selectedPerencana) sum += 25000;
    
    // Count selected RPM keys
    const rpmCount = Object.values(selectedRpmKeys).filter(Boolean).length;
    sum += rpmCount * 50000;
    
    if (selectedLitNum) sum += 25000;
    if (selectedPembuatSoal) sum += 25000;
    if (selectedKarakter) sum += 25000;
    if (selectedAbsensi) sum += 25000;
    if (selectedNilaiRapor) sum += 50000;
    
    // Cap total calculation automatically to prevent individual totals exceeding premium rates
    return Math.min(sum, 125000);
  };

  const [claimNoticeCode, setClaimNoticeCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const pendingCode = localStorage.getItem("omega_approved_code_pending_claim");
      if (pendingCode) {
        setClaimNoticeCode(pendingCode);
        setCodeToActivate(pendingCode);
        setActiveTab("enter_code");
      } else {
        setClaimNoticeCode(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePrefillEvent = (e: any) => {
      if (e.detail?.code !== undefined) {
        setCodeToActivate(e.detail.code);
      }
      if (e.detail?.tab !== undefined) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener("omega-activation-prefill", handlePrefillEvent);
    return () => {
      window.removeEventListener("omega-activation-prefill", handlePrefillEvent);
    };
  }, []);

  useEffect(() => {
    // Generate unique Request Code on loading
    if (!requestCode) {
      const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      setRequestCode(`REQ-RHB86-${randStr}`);
    }
    
    // Prefill form with requested / saved profile if already filled in past
    const pendingReqStr = localStorage.getItem("omega_pending_request_active_editor");
    if (pendingReqStr) {
      try {
        const d = JSON.parse(pendingReqStr);
        setSchoolName(d.schoolName || "");
        setPrincipalName(d.principalName || "");
        setPrincipalNip(d.principalNip || "");
        setTeacherName(d.teacherName || "");
        setTeacherNip(d.teacherNip || "");
        
        const savedJabatan = d.jabatan || "Guru Kelas 6";
        setJabatan(savedJabatan);
        if (savedJabatan.includes("Agama Islam") || savedJabatan.includes("Islam")) {
          setAgamaType("Pendidikan Agama Islam");
        } else if (savedJabatan.includes("Agama Kristen") || savedJabatan.includes("Kristen")) {
          setAgamaType("Pendidikan Agama Kristen");
        } else if (savedJabatan.includes("Agama Katolik") || savedJabatan.includes("Katolik")) {
          setAgamaType("Pendidikan Agama Katolik");
        }

        setFaseKelas(d.faseKelas || "Fase C (Kelas 6)");
        setWaNumber(d.waNumber || "");
        
        if (d.selectedPackages) {
          const list = d.selectedPackages;
          setSelectedPremium(list.includes("premium"));
          if (list.includes("premium")) {
            setSelectedKosp(true);
            setSelectedPerencana(true);
            
            const currentJenjang = getActiveJenjang();
            const autoKey = getAutoDetectedRpmKey(currentJenjang);
            setSelectedRpmKeys({ [autoKey]: true });

            setSelectedLitNum(true);
            setSelectedPembuatSoal(true);
            setSelectedKarakter(true);
            setSelectedAbsensi(true);
            setSelectedNilaiRapor(true);
          } else {
            setSelectedKosp(list.includes("kosp"));
            setSelectedPerencana(list.includes("perencana_ajar"));
            setSelectedLitNum(list.includes("literasi_numerasi"));
            setSelectedPembuatSoal(list.includes("pembuat_soal"));
            setSelectedKarakter(list.includes("nilai_karakter"));
            setSelectedAbsensi(list.includes("absensi"));
            setSelectedNilaiRapor(list.includes("nilai_rapor"));
            
            const rpmKeysObj: { [key: string]: boolean } = {};
            list.forEach((pkg: string) => {
              if (pkg.startsWith("rpm_")) {
                rpmKeysObj[pkg] = true;
              }
            });
            setSelectedRpmKeys(rpmKeysObj);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [requestCode]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setMsg({ type: "error", text: "Format berkas tidak valid. Harap unggah Gambar Bukti Transfer." });
      return;
    }
    setReceiptFile(file);
    setMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!schoolName || !principalName || !principalNip || !teacherName || !teacherNip || !waNumber) {
      setMsg({ type: "error", text: "Mohon lengkapi semua data profil aktivasi Anda terlebih dahulu." });
      return;
    }
    
    const totalToPay = calculateTotal();
    if (totalToPay <= 0) {
      setMsg({ type: "error", text: "Mohon pilih salah satu paket atau Premium terlebih dahulu sebelum mendaftar." });
      return;
    }

    if (!receiptBase64) {
      setMsg({ type: "error", text: `Harap unggah bukti transfer ${formatRupiah(totalToPay)} terlebih dahulu.` });
      return;
    }

    // Determine package list to save
    const selectedList: string[] = [];
    if (selectedPremium) {
      selectedList.push("premium");
    } else {
      if (selectedKosp) selectedList.push("kosp");
      if (selectedPerencana) selectedList.push("perencana_ajar");
      Object.entries(selectedRpmKeys).forEach(([key, checked]) => {
        if (checked) {
          selectedList.push(key);
          // Auto map to general keys
          if (key === "rpm_sd_fase_a") selectedList.push("rpm_fase_a");
          else if (key === "rpm_sd_fase_b") selectedList.push("rpm_fase_b");
          else if (key === "rpm_sd_fase_c") selectedList.push("rpm_fase_c");
          else if (key.startsWith("rpm_sd_agama_")) {
            selectedList.push("rpm_fase_a");
            selectedList.push("rpm_fase_b");
            selectedList.push("rpm_fase_c");
          }
          else if (key === "rpm_smp_fase_d" || key.startsWith("rpm_smp_agama_")) {
            selectedList.push("rpm_fase_d");
          }
          else if (key === "rpm_sma_fase_e_f" || key.startsWith("rpm_sma_agama_") || key === "rpm_smk_fase_e_f" || key.startsWith("rpm_smk_agama_")) {
            selectedList.push("rpm_fase_e");
            selectedList.push("rpm_fase_f");
          }
        }
      });
      if (selectedLitNum) selectedList.push("literasi_numerasi");
      if (selectedPembuatSoal) selectedList.push("pembuat_soal");
      if (selectedKarakter) selectedList.push("nilai_karakter");
      if (selectedAbsensi) selectedList.push("absensi");
      if (selectedNilaiRapor) selectedList.push("nilai_rapor");
    }

    const newRequest = {
      id: "req-" + Date.now(),
      schoolName,
      principalName,
      principalNip,
      teacherName,
      teacherNip,
      jabatan,
      faseKelas,
      waNumber,
      receiptBase64,
      requestCode,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      selectedPackages: selectedList,
      totalAmount: totalToPay
    };

    setIsSubmitting(true);
    setMsg(null);

    const userMsg = {
      id: "msg-user-" + Date.now(),
      requestId: requestCode,
      sender: "user",
      text: `Halo Admin Omega Teacher, saya telah mengirimkan berkas pengajuan aktivasi kode akses Premium dengan Kode Unik *${requestCode}* untuk sekolah *${schoolName}*. Mohon bantuannya untuk diperiksa dan diaktifkan. Terima kasih.`,
      timestamp: new Date().toISOString(),
      readByAdmin: false,
      readByUser: true
    };
    
    const adminReply = {
      id: "msg-admin-" + (Date.now() + 500),
      requestId: requestCode,
      sender: "system",
      text: "Terimakasih telah memilih Omega Teacher, pesanan anda akan segera ditangani team. Silakan tunggu pemeriksaan oleh Administrator kami.",
      timestamp: new Date().toISOString(),
      readByAdmin: true,
      readByUser: false
    };

    try {
      // Parallelize Firestore Writes for maximum throughput and speed!
      await Promise.all([
        saveActivationRequest(newRequest),
        saveSupportMessageToFirebase(userMsg),
        saveSupportMessageToFirebase(adminReply)
      ]);

      // Save to localStorage requests list
      const stored = localStorage.getItem("omega_activation_requests");
      const current = stored ? JSON.parse(stored) : [];
      const updated = [newRequest, ...current];
      localStorage.setItem("omega_activation_requests", JSON.stringify(updated));

      // Also save temporary active editor memory to pre-populate later
      localStorage.setItem("omega_pending_request_active_editor", JSON.stringify(newRequest));

      localStorage.setItem("omega_support_messages", JSON.stringify([...current, userMsg, adminReply]));
      localStorage.setItem("omega_current_active_request_code", requestCode);
      
      // Dispatch state updated event so the bell notification icon updates with "pending" badge immediately
      window.dispatchEvent(new CustomEvent("omega-state-updated"));

      setMsg({
        type: "success",
        text: `Sukses! Permohonan Anda dengan Kode Unik ${requestCode} telah terekam di sistem. Silakan tunggu pemeriksaan oleh Administrator untuk mengaktifkan kode akses Premium Anda.`
      });
      
      setIsSubmitting(false);

      // Auto-switch to enter code tab
      setTimeout(() => {
        setActiveTab("enter_code");
        setMsg(null);
        window.dispatchEvent(new CustomEvent("omega-support-message-received"));
      }, 3500);

    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Gagal menyimpan request data. Silakan coba kembali." });
      setIsSubmitting(false);
    }
  };

  const handleActivateWithCode = async () => {
    if (!codeToActivate.trim()) {
      setMsg({ type: "error", text: "Harap masukkan kode aktivasi Anda." });
      return;
    }

    const trimmedCode = codeToActivate.trim().toUpperCase();

    if (trimmedCode === "OTE-GP017" || trimmedCode === "OTE-GP19S" || trimmedCode === "GP-RHB86") {
      const activeData = {
        schoolName: schoolName.trim() || "SD NEGERI FATUBAI",
        principalName: principalName.trim() || "Darius Kusi, S.Pd., Gr.",
        principalNip: principalNip.trim() || "196709192008011008",
        teacherName: teacherName.trim() || "Roni Hariyanto Bhidju, S.Pd.,Gr",
        teacherNip: teacherNip.trim() || "198603012020121005",
        jabatan: jabatan || "Guru Kelas 6",
        faseKelas: faseKelas || "Fase C (Kelas 6)",
        waNumber: waNumber || "081234567890"
      };

      localStorage.setItem("omega_is_activated", "true");
      sessionStorage.setItem("omega_admin_logged_in", "true");
      localStorage.setItem("omega_admin_logged_in", "true");
      localStorage.setItem("omega_active_activation_code", trimmedCode);
      localStorage.setItem("omega_purchased_packages", JSON.stringify(["premium"]));

      localStorage.setItem("omega_school_name", activeData.schoolName);
      localStorage.setItem("omega_kepala_sekolah", activeData.principalName);
      localStorage.setItem("omega_nip_kepala", activeData.principalNip);
      localStorage.setItem("omega_nama_guru", activeData.teacherName);
      localStorage.setItem("omega_nip_guru", activeData.teacherNip);
      localStorage.setItem("omega_jabatan", activeData.jabatan);
      localStorage.setItem("omega_fase_kelas", activeData.faseKelas);
      localStorage.setItem("omega_wa_number", activeData.waNumber);

      setMsg({ type: "success", text: "✓ Kode Admin Utama Terverifikasi Pas! Panel Kontrol Admin kini terbuka." });
      setTimeout(() => {
        onSuccess();
        onClose();
        window.dispatchEvent(new CustomEvent("omega-state-updated"));
      }, 2000);
      return;
    }

    // Verify code from Firestore first!
    let approvedMatch = null;
    try {
      const q = query(
        collection(db, "activation_requests"),
        where("activationCode", "==", trimmedCode),
        where("status", "==", "ACTIVE")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        approvedMatch = snapshot.docs[0].data();
      }

      // Check if they input their requestCode instead of activationCode
      if (!approvedMatch) {
        const qReq = query(
          collection(db, "activation_requests"),
          where("requestCode", "==", trimmedCode),
          where("status", "==", "ACTIVE")
        );
        const snapReq = await getDocs(qReq);
        if (!snapReq.empty) {
          approvedMatch = snapReq.docs[0].data();
        }
      }

      // Fallback: If not found in activation_requests (e.g. deleted by admin to save space), check registered_codes!
      if (!approvedMatch) {
        const qPermanent = query(
          collection(db, "registered_codes"),
          where("activationCode", "==", trimmedCode),
          where("status", "==", "ACTIVE")
        );
        const permanentSnapshot = await getDocs(qPermanent);
        if (!permanentSnapshot.empty) {
          approvedMatch = permanentSnapshot.docs[0].data();
        }
      }

      // Check permanent registry by requestCode too
      if (!approvedMatch) {
        const qPermanentReq = query(
          collection(db, "registered_codes"),
          where("requestCode", "==", trimmedCode),
          where("status", "==", "ACTIVE")
        );
        const permanentSnapshotReq = await getDocs(qPermanentReq);
        if (!permanentSnapshotReq.empty) {
          approvedMatch = permanentSnapshotReq.docs[0].data();
        }
      }
    } catch (err) {
      console.warn("Gagal terhubung ke Firebase:", err);
    }

    // Fallback to local storage
    const storedRequests = localStorage.getItem("omega_activation_requests");
    const currentRequests = storedRequests ? JSON.parse(storedRequests) : [];
    
    if (!approvedMatch) {
      approvedMatch = currentRequests.find(
        (r: any) => 
          (r.activationCode?.toUpperCase() === trimmedCode || r.requestCode?.toUpperCase() === trimmedCode) && 
          r.status === "ACTIVE"
      );
    }

    // Or double check if they entered the general activation format or standard hash bypass
    const isSpecialBypass = trimmedCode === "GP-SUPER" || trimmedCode.startsWith("GP-") || trimmedCode === "ACT-OMA-SUPER" || trimmedCode.startsWith("ACT-RHB86-") || trimmedCode.startsWith("OTE-GP017") || trimmedCode.startsWith("OTE-GP19S") || trimmedCode.startsWith("OTE-GP");

    if (approvedMatch || isSpecialBypass) {
      const activeData = approvedMatch || {
        schoolName: schoolName || "SD NEGERI FATUBAI",
        principalName: principalName || "Darius Kusi, S.Pd., Gr.",
        principalNip: principalNip || "196709192008011008",
        teacherName: teacherName || "Roni Hariyanto Bhidju, S.Pd.,Gr",
        teacherNip: teacherNip || "198603012020121005",
        jabatan: jabatan || "Guru Kelas 6",
        faseKelas: faseKelas || "Fase C (Kelas 6)",
        waNumber: waNumber || "081234567890",
        selectedPackages: ["premium"]
      };

      // Set activated state globally!
      localStorage.setItem("omega_is_activated", "true");
      localStorage.setItem("omega_school_name", activeData.schoolName);
      localStorage.setItem("omega_kepala_sekolah", activeData.principalName);
      localStorage.setItem("omega_nip_kepala", activeData.principalNip);
      localStorage.setItem("omega_nama_guru", activeData.teacherName);
      localStorage.setItem("omega_nip_guru", activeData.teacherNip);
      localStorage.setItem("omega_jabatan", activeData.jabatan);
      localStorage.setItem("omega_fase_kelas", activeData.faseKelas);
      localStorage.setItem("omega_wa_number", activeData.waNumber);
      localStorage.setItem("omega_active_activation_code", trimmedCode);
      
      const unlockedList = activeData.selectedPackages || ["premium"];
      localStorage.setItem("omega_purchased_packages", JSON.stringify(unlockedList));

      setMsg({ type: "success", text: "SELAMAT! Aplikasi Omega Engine Anda telah diaktifkan dengan lisensi Premium / Paket pilihan Anda!" });

      // Trigger SUCCESS callback to components
      setTimeout(() => {
        onSuccess();
        onClose();
        // Dispatch window updated event
        window.dispatchEvent(new CustomEvent("omega-state-updated"));
      }, 2000);
    } else {
      setMsg({ type: "error", text: "Kode aktivasi tidak valid atau belum diaktifkan oleh admin. Silakan periksa kembali." });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin: " + text);
  };  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex justify-center items-start md:items-center overflow-y-auto p-4 py-8 pointer-events-auto animate-fade-in text-left">
      <div className="bg-[#0b0c10] border-2 border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-[0_0_80px_rgba(245,158,11,0.15)] relative my-auto space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Key className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white font-mono uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              KARTU KONFIRMASI KODE AKSES
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              PREMIUM GURU ACTIVATION MODULE • OMEGA CRYPTOGRAPHIC SYSTEM
            </p>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-[#030305] border border-zinc-900 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setActiveTab("request"); setMsg(null); }}
            className={`w-1/2 py-2 text-xs font-bold font-mono uppercase rounded-xl transition cursor-pointer ${
              activeTab === "request"
                ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            1. Form Request Akses
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("enter_code"); setMsg(null); }}
            className={`w-1/2 py-2 text-xs font-bold font-mono uppercase rounded-xl transition cursor-pointer ${
              activeTab === "enter_code"
                ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            2. Masukkan Kode Aktif
          </button>
        </div>

        {/* Error / Success Messages */}
        {msg && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed flex gap-3 ${
            msg.type === "success" 
              ? "bg-emerald-950/25 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              : "bg-rose-950/20 border-rose-500/30 text-rose-300"
          }`}>
            {msg.type === "success" ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-450 shrink-0" />
            )}
            <div>{msg.text}</div>
          </div>
        )}

        {activeTab === "request" ? (
          <form onSubmit={submitRequest} className="space-y-6 text-xs font-sans text-zinc-300">
            {/* User Request Unique Code Display */}
            <div className="bg-[#030305] border border-zinc-900 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 font-mono">KODE UNIK USER ANDA (MOHON CATAT):</p>
                <p className="text-sm font-black font-mono text-amber-400 tracking-wider mt-0.5">{requestCode}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(requestCode)}
                className="p-2 rounded-xl bg-[#0b0c10] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer"
                title="Salin Kode Req"
                id="btn-copy-reqcode"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* LANGKAH 1: DATA PROFIL SEKOLAH & GURU PEMOHON */}
            <div className="space-y-4 border-b border-zinc-900 pb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 px-2 text-[10px] font-mono bg-amber-500 text-zinc-950 font-bold rounded-md">LANGKAH 1</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Lengkapi Data Administrasi Guru Pemohon:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <School className="w-3 h-3 text-emerald-400" /> Nama Satuan Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: SD NEGERI FATUBAI"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <Users className="w-3 h-3 text-teal-400" /> Nama Kompleks Kepala Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: Darius Kusi, S.Pd., Gr."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <FileText className="w-3 h-3 text-blue-400" /> NIP Kepala Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={principalNip}
                    onChange={(e) => setPrincipalNip(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: 196709192008011008"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <Users className="w-3 h-3 text-purple-400" /> Nama Lengkap Guru Pemohon *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: Roni Hariyanto Bhidju, S.Pd.,Gr."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <FileText className="w-3 h-3 text-pink-400" /> NIP Guru Pemohon *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherNip}
                    onChange={(e) => setTeacherNip(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: 198603012020121005"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <Layers className="w-3 h-3 text-cyan-400" /> Jabatan Guru *
                  </label>
                  <select
                    value={jabatan.startsWith("Guru Mapel Agama") ? "Guru Mapel Agama" : jabatan}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Guru Mapel Agama") {
                        setJabatan(`Guru Mapel Agama (${agamaType})`);
                      } else {
                        setJabatan(val);
                      }
                    }}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium cursor-pointer"
                  >
                    <option value="Guru Kelas 6">Guru Kelas 6</option>
                    <option value="Guru Kelas 1">Guru Kelas 1</option>
                    <option value="Guru Kelas 2">Guru Kelas 2</option>
                    <option value="Guru Kelas 3">Guru Kelas 3</option>
                    <option value="Guru Kelas 4">Guru Kelas 4</option>
                    <option value="Guru Kelas 5">Guru Kelas 5</option>
                    <option value="Guru Mapel Agama">Guru Mapel Agama (Pilih di Bawah)</option>
                    <option value="Guru Mapel PJOK">Guru Mapel PJOK</option>
                    <option value="Guru Mapel Bahasa Inggris">Guru Mapel Bahasa Inggris</option>
                    <option value="Guru Mapel Seni Budaya">Guru Mapel Seni Budaya</option>
                  </select>

                  {/* Conditional selection for religion */}
                  {jabatan.startsWith("Guru Mapel Agama") && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                      <label className="text-amber-400 font-mono text-[9px] uppercase block font-bold">
                        Pilihan Pembelajaran Agama:
                      </label>
                      <select
                        value={
                          jabatan.includes("Katolik")
                            ? "Pendidikan Agama Katolik"
                            : jabatan.includes("Kristen")
                            ? "Pendidikan Agama Kristen"
                            : "Pendidikan Agama Islam"
                        }
                        onChange={(e) => {
                          const rel = e.target.value;
                          setAgamaType(rel);
                          setJabatan(`Guru Mapel Agama (${rel})`);
                        }}
                        className="w-full bg-[#030305] border border-zinc-800 focus:border-amber-400 rounded-lg py-1.5 px-2.5 text-xs text-zinc-200 cursor-pointer"
                      >
                        <option value="Pendidikan Agama Islam">Pendidikan Agama Islam</option>
                        <option value="Pendidikan Agama Kristen">Pendidikan Agama Kristen</option>
                        <option value="Pendidikan Agama Katolik">Pendidikan Agama Katolik</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <Layers className="w-3 h-3 text-amber-400" /> Sasaran Fase & Kelas *
                  </label>
                  <select
                    value={faseKelas}
                    onChange={(e) => setFaseKelas(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium cursor-pointer"
                  >
                    <option value="Fase C (Kelas 6)">Fase C (Kelas 6)</option>
                    <option value="Fase A (Kelas 1)">Fase A (Kelas 1)</option>
                    <option value="Fase A (Kelas 2)">Fase A (Kelas 2)</option>
                    <option value="Fase B (Kelas 3)">Fase B (Kelas 3)</option>
                    <option value="Fase B (Kelas 4)">Fase B (Kelas 4)</option>
                    <option value="Fase C (Kelas 5)">Fase C (Kelas 5)</option>
                    <option value="Fase D (Kelas 7)">Fase D (Kelas 7)</option>
                    <option value="Fase D (Kelas 8)">Fase D (Kelas 8)</option>
                    <option value="Fase D (Kelas 9)">Fase D (Kelas 9)</option>
                    <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                    <option value="Fase F (Kelas 11)">Fase F (Kelas 11)</option>
                    <option value="Fase F (Kelas 12)">Fase F (Kelas 12)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1">
                    <Phone className="w-3 h-3 text-green-400" /> Nomor WhatsApp Aktif (Guna Notifikasi Kode) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full bg-[#030305] border border-zinc-850 focus:border-amber-400 rounded-xl py-2 px-3 text-xs outline-none transition text-zinc-100 font-medium"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>
            </div>

            {/* LANGKAH 2: PILIHAN PAKET PERANGKAT & LISENSI SEKOLAH */}
            <div className="space-y-4 border-b border-zinc-900 pb-5">
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2 text-[10px] font-mono bg-amber-500 text-zinc-950 font-bold rounded-md">LANGKAH 2</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Pilih Paket Layanan Administrasi Anda:</span>
                </div>
                {/* Custom Highlight Subtitle requested by User */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-1 text-zinc-100 font-bold text-xs leading-relaxed text-center shadow-[0_0_12px_rgba(245,158,11,0.05)]">
                  ✨ "Memerdekakan diri dari beban administrasi dengan Omega Teacher. Silakan pilih paket Anda."
                </div>
              </div>

              {/* HIGH CONTRAST PREMIUM BANNER CARD */}
              <div 
                onClick={() => handlePremiumToggle(!selectedPremium)}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  selectedPremium 
                    ? "bg-gradient-to-r from-amber-950/30 via-[#181102] to-amber-950/20 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.15)]" 
                    : "bg-[#030305] border-zinc-850 hover:border-zinc-700"
                }`}
              >
                {/* Micro badge glow */}
                {selectedPremium && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                )}
                
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex gap-3">
                    <div className={`mt-0.5 p-1 rounded-md border-2 transition-all shrink-0 ${
                      selectedPremium 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-200 ${selectedPremium ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-black font-mono tracking-wide text-white uppercase flex items-center gap-2 flex-wrap">
                         🔥 LISENSI PREMIUM LENGKAP SEKOLAH ({getActiveJenjang()}) - LIFETIME
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded font-black uppercase animate-pulse">DISKON 58%</span>
                        <span className="px-2 py-0.5 text-[9.5px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-black uppercase">Hemat Rp 175.000</span>
                      </h4>
                      <p className="text-zinc-200 text-xs leading-relaxed max-w-lg">
                        Bebaskan diri dari pembelian eceran senilai <strong className="text-zinc-350 line-through text-[11px]">Rp. 300.000</strong>. Buka sekaligus seluruh menu lengkap (KOSP, Perencana Ajar, RPM {getActiveJenjang()}, Absensi, Nilai Karakter, Daftar Nilai, &amp; Rapor otomatis) tanpa batas selamanya dengan diskon 58%!
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono self-center shrink-0">
                    <span className="text-zinc-500 text-[10.5px] block line-through">Rp. 300.000</span>
                    <span className="text-amber-400 font-black text-base block">Rp. 125.000</span>
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL PACKAGES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. KOSP */}
                <div 
                  onClick={() => handleSubToggle("kosp", !selectedKosp)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedKosp 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedKosp 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedKosp ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">APLIKASI KOSP {getActiveJenjang()}</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Asisten penyusun dokumen Kurikulum Operasional Satuan Pendidikan {getActiveJenjang()} luring.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 2. PERENCANA AJAR */}
                <div 
                  onClick={() => handleSubToggle("perencana", !selectedPerencana)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPerencana 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedPerencana 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedPerencana ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">PERENCANA AJAR {getActiveJenjang()}</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Formulasi lengkap TP, ATP, KKTP, Program Tahunan (PROTA) &amp; Semester (PROMES) {getActiveJenjang()}.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 3. LITERASI & NUMERASI */}
                <div 
                  onClick={() => handleSubToggle("litnum", !selectedLitNum)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedLitNum 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedLitNum 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedLitNum ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">LITERASI &amp; NUMERASI</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Latihan progress asesmen diagnostik literasi dan numerasi kelas {getActiveJenjang()} mendalam.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 3b. PEMBUAT SOAL */}
                <div 
                  onClick={() => handleSubToggle("pembuat_soal", !selectedPembuatSoal)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPembuatSoal 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedPembuatSoal 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedPembuatSoal ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">PEMBUAT SOAL AUTO</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Studio cerdas pembuat soal ujian otomatis berbasis Kurikulum Merdeka {getActiveJenjang()}.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 4. NILAI KARAKTER */}
                <div 
                  onClick={() => handleSubToggle("karakter", !selectedKarakter)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedKarakter 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedKarakter 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedKarakter ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">NILAI KARAKTER (P5)</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Asesmen observasi karakteristik siswa harian / P5 secara otomatis {getActiveJenjang()}.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 5. ABSENSI */}
                <div 
                  onClick={() => handleSubToggle("absensi", !selectedAbsensi)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedAbsensi 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedAbsensi 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedAbsensi ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">ABSENSI KELAS</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Visualisasi kehadiran murid &amp; rekap bulanan luring {getActiveJenjang()} siap ekspor.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 25.000
                  </div>
                </div>

                {/* 6. NILAI & RAPOR */}
                <div 
                  onClick={() => handleSubToggle("nilai_rapor", !selectedNilaiRapor)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between sm:col-span-2 ${
                    selectedNilaiRapor 
                      ? "bg-zinc-950/60 border-amber-500/70" 
                      : "bg-[#030305]/60 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className={`mt-0.5 p-0.5 rounded border-2 transition-all shrink-0 ${
                      selectedNilaiRapor 
                        ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_6px_rgba(245,158,11,0.4)]" 
                        : "bg-black/60 border-zinc-650 text-transparent hover:border-zinc-450"
                    }`}>
                      <Check className={`w-3.5 h-3.5 stroke-[3.5] transition-all duration-205 ${selectedNilaiRapor ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">NILAI DAN RAPOR {getActiveJenjang()}</h5>
                      <p className="text-[10.5px] text-zinc-350 leading-relaxed mt-1">Panel input nilai formatif/sumatif &amp; pencetak lembaran Rapor Kurikulum Merdeka {getActiveJenjang()}.</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-400 font-black mt-3.5 pt-1.5 border-t border-zinc-900">
                    Rp. 50.000
                  </div>
                </div>

                {/* 7. RPM WITH LEVEL-BASED OPTIONS AND RELIGIONS */}
                <div className="p-4 rounded-xl border-2 border-zinc-900 bg-[#030305]/60 flex flex-col justify-between sm:col-span-2">
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] font-bold shrink-0">
                        RPM
                      </div>
                      <div>
                        <h5 className="font-extrabold text-zinc-100 uppercase tracking-wide text-xs">RENCANA PEMBELAJARAN MENDALAM (RPM) - JENJANG {getActiveJenjang()}</h5>
                        <p className="text-[10.5px] text-zinc-350 leading-relaxed">
                          Modul RPM Khusus Jenjang {getActiveJenjang()} (Rp. 50.000 per paket). System secara pintar meng-otomatisasi pilihan berdasarkan profil Anda di atas:
                        </p>
                      </div>
                    </div>
                    
                    {/* Dynamic matching options based on active jenjang */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2.5 bg-[#000]/45 rounded-lg border border-zinc-900 font-mono text-[11px]">
                      {getRpmOptionsList(getActiveJenjang()).map((rpmOpt) => {
                        const checked = !!selectedRpmKeys[rpmOpt.key];
                        return (
                          <div 
                            key={rpmOpt.key} 
                            onClick={() => handleRpmKeyToggle(rpmOpt.key, !checked)}
                            className={`p-2.5 rounded-md border flex items-center gap-2.5 cursor-pointer transition ${
                              checked 
                                ? "bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.02)]" 
                                : "bg-black/30 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            <div className={`p-0.5 rounded border-2 transition-all shrink-0 ${
                              checked 
                                ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_4px_rgba(245,158,11,0.3)]" 
                                : "bg-black/60 border-zinc-550 text-transparent hover:border-zinc-350"
                            }`}>
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            </div>
                            <span className="leading-snug leading-normal">{rpmOpt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10.5px] text-zinc-500 mt-2 pt-1.5 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-zinc-550">Subtotal RPM {getActiveJenjang()}:</span>
                    <strong className="text-amber-400 font-extrabold">
                      {formatRupiah(Object.values(selectedRpmKeys).filter(Boolean).length * 50000)}
                    </strong>
                  </div>
                </div>

              </div>

              {/* DYNAMIC TOTAL SUMMARY */}
              <div className="p-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left font-sans space-y-0.5">
                  <span className="text-[9.5px] uppercase font-bold text-zinc-400 block tracking-wide">RINGKASAN TOTAL NILAI TRANSAKSI:</span>
                  <p className="text-[10px] text-zinc-300">
                    Jumlah Paket Terpilih: <strong className="text-white">
                      {selectedPremium ? "Semua Paket (PREMIUM)" : `${(
                        (selectedKosp ? 1 : 0) + 
                        (selectedPerencana ? 1 : 0) + 
                        (selectedLitNum ? 1 : 0) + 
                        (selectedPembuatSoal ? 1 : 0) + 
                        (selectedKarakter ? 1 : 0) + 
                        (selectedAbsensi ? 1 : 0) + 
                        (selectedNilaiRapor ? 1 : 0) + 
                        Object.values(selectedRpmKeys).filter(Boolean).length
                      )} Paket`}
                    </strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9.5px] text-zinc-500 block uppercase font-mono tracking-widest font-bold">TOTAL PEMBAYARAN:</span>
                  <strong className="text-amber-400 text-lg font-black font-mono tracking-wide">
                    {formatRupiah(calculateTotal())}
                  </strong>
                </div>
              </div>

            </div>

            {/* LANGKAH 3: INFORMASI TRANSAKSI DAN UNGGAH BUKTI */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 px-2 text-[10px] font-mono bg-amber-500 text-zinc-950 font-bold rounded-md">LANGKAH 3</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Transfer &amp; Lampirkan Bukti Transaksi:</span>
              </div>

              {/* Instruction Box For Bank Transfer */}
              <div className="bg-gradient-to-br from-[#120b05] to-[#08090d] border-2 border-amber-500/35 p-5 rounded-2xl space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none font-bold"></div>
                
                <div className="flex items-center gap-2 align-middle">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                    PANDUAN PEMBAYARAN LISENSI AKTIVASI
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-white font-display uppercase tracking-wide">
                    Detail Pengiriman Biaya Lisensi Guru
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    Bebaskan diri dari beban administrasi mengajar yang rumit dan menyita waktu. Cukup lakukan <strong className="text-white">satu kali transfer</strong> biaya paket terpilih sebesar <strong className="text-amber-400 text-xs font-bold font-mono">{formatRupiah(calculateTotal())}</strong> saja untuk membuka akses input kustom data Anda <strong className="text-amber-500 font-bold underline">selamanya (Akses Lifetime)</strong> tanpa ada biaya langganan tambahan!
                  </p>
                </div>

                <div className="bg-[#030305] border border-zinc-800 p-4 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold">BANK PENERIMA:</span>
                      <span className="text-white font-bold tracking-wide">BANK RAKYAT INDONESIA (BRI)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold">ATAS NAMA PENERIMA:</span>
                      <span className="text-zinc-100 font-extrabold text-xs">RONI HARIYANTO BHIDJU</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <div>
                      <span className="text-[9px] text-zinc-500 block uppercase font-bold">NOMOR REKENING:</span>
                      <span className="text-amber-400 font-sans font-black text-base tracking-widest bg-black/40 px-2 py-0.5 rounded-md inline-block">4668 0101 4250 500</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("466801014250500")}
                      className="px-3.5 py-2 text-[10px] font-black uppercase rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-200 cursor-pointer border border-amber-500/20 flex items-center gap-1.5 focus:scale-95"
                      id="btn-copy-norek"
                    >
                      <Copy className="w-3 h-3" /> Salin Norek
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 italic text-center font-sans">
                  💡 Investasi cerdas sekali klik untuk menghemat waktu berharga Anda hingga berjam-jam setiap harinya.
                </p>
              </div>

              {/* Drag & Drop Proof of Transfer Upload */}
              <div>
                <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase mb-1.5">
                  <ImageIcon className="w-3 h-3 text-amber-400" /> Unggah Bukti Transaksi Transfer *
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-5 rounded-2xl text-center cursor-pointer transition-all duration-300 ${
                    dragActive 
                      ? "border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                      : receiptBase64 
                        ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60" 
                        : "border-zinc-800 bg-[#030305] hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  
                  {receiptBase64 ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <p className="text-emerald-400 font-bold tracking-wide">✓ BUKTI TRANSFER BERHASIL DIUNGGAH</p>
                      <p className="text-[10px] text-zinc-500 truncate max-w-xs">{receiptFile?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="p-2.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800 w-10 h-10 flex items-center justify-center mx-auto mb-1">
                        <Upload className="w-5 h-5 text-zinc-400" />
                      </div>
                      <p className="text-zinc-300">Drag & Drop atau <span className="text-amber-400 font-bold hover:underline">Klik untuk Memilih Gambar</span></p>
                      <p className="text-[9px] text-zinc-500 font-mono">Mendukung format JPG, PNG, atau PDF (Maks. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl font-black font-mono transition uppercase shadow-xl text-center flex items-center justify-center gap-2 ${
                isSubmitting 
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700 shadow-none" 
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] shadow-orange-500/15 cursor-pointer"
              }`}
              id="submit-activation-request"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-zinc-650 border-t-amber-400 rounded-full animate-spin"></div>
                  <span>Sedang Mengirim ke Admin...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-zinc-950" /> Kirim Permohonan Aktivasi Premium
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-xs text-zinc-300">
            {claimNoticeCode && (
              <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs leading-relaxed space-y-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-center animate-fade-in">
                <p className="font-extrabold text-sm uppercase text-emerald-400">🎉 SELAMAT! KODE AKSES TELAH DIAKTIFKAN</p>
                <p className="font-semibold text-[11px] text-zinc-200">Silakan konfirmasi dengan klik tombol <strong className="text-emerald-400">Validasi &amp; Aktifkan Sekarang</strong> di bawah untuk mengaktifkan status Premium Anda.</p>
                <p className="text-[11px] italic text-emerald-400 font-mono font-bold mt-1.5">"Terimakasih telah memilih OMEGA TEACHER!"</p>
              </div>
            )}
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed text-center">
              Masukkan Kode Aktif/Sertifikat Premium yang Anda dapatkan dari Admin untuk membuka kunci seluruh fitur dokumen (KOSP, TP, ATP, PDF Decrypted, dsb.) di dalam akun pembelajaran Anda.
            </p>

            <div className="space-y-2">
              <label className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <Key className="w-3.5 h-3.5 text-amber-400" /> INPUT KODE AKSES PREMIUM (OTE-GP...):
              </label>
              <input
                type="text"
                value={codeToActivate}
                onChange={(e) => setCodeToActivate(e.target.value)}
                placeholder="Contoh: OTE-GP017-X8A2Z"
                className="w-full bg-[#030305] border-2 border-zinc-800 focus:border-amber-400 rounded-2xl py-3 px-4 font-mono text-center text-sm font-bold text-amber-300 uppercase tracking-widest outline-none transition"
              />
            </div>

            <button
              type="button"
              onClick={handleActivateWithCode}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-zinc-950 font-black font-mono transition uppercase shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer text-center flex items-center justify-center gap-2"
              id="btn-trigger-activate-code"
            >
              <ShieldCheck className="w-4 h-4" /> Validasi & Aktifkan Sekarang
            </button>

            {/* Hint for verification */}
            <div className="bg-[#050c12] border border-blue-500/10 p-4 rounded-2xl space-y-1 font-sans">
              <span className="text-[9.5px] font-bold font-mono tracking-wider text-amber-500 uppercase flex items-center gap-1">
                📌 Petunjuk Verifikasi:
              </span>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Setelah mengirimkan bukti pengajuan, Anda akan segera menerima Kode Akses Premium dari Administrator. Tempelkan kode yang Anda terima ke dalam kotak input di atas untuk mengaktifkan sistem secara instan.
              </p>
            </div>

            {/* Interactive Chat Help desk / Bantuan Center banner */}
            <div 
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("open-support-chat"));
              }}
              className="bg-gradient-to-r from-violet-950/30 via-indigo-950/50 to-sky-950/30 border-2 border-indigo-500/50 hover:border-pink-500/50 p-4 rounded-2xl space-y-2 relative overflow-hidden group shadow-[0_0_20px_rgba(99,102,241,0.25)] mt-3 cursor-pointer transition hover:scale-[1.01] active:scale-98"
              title="Hubungi Admin / Support Chat"
            >
              <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-indigo-500/15 blur-[25px] pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-1.5 text-[9px] font-mono bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded animate-pulse">LIVESTREAM SUPPORT</span>
                  <span className="text-[11px] font-black tracking-wider text-indigo-300 uppercase font-mono">
                    KODE BELUM AKTIF DALAM 1 JAM?
                  </span>
                </div>
                <span className="text-[10px] text-pink-400 font-bold group-hover:translate-x-1 transition-transform font-mono flex items-center gap-1">
                  Buka Chat &rarr;
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                Apabila dalam <span className="text-amber-400 font-bold">1 Jam</span> kode akses Anda belum diaktifkan oleh admin, silakan <span className="text-pink-400 font-extrabold underline decoration-dashed">Klik Di Sini</span> untuk langsung membuka <span className="font-bold">Customer Support Live Chat</span>. Tim kami siap memproses permohonan Anda seketika.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
