import React, { useState, useEffect } from "react";
import { 
  Key, ShieldCheck, Check, Clock, AlertTriangle, Trash2, 
  User, School, Phone, CheckCircle, ExternalLink, Image as ImageIcon, Copy,
  MessageSquare, Send, ShieldAlert, Download, X
} from "lucide-react";
import { 
  db,
  updateRequestStatusInFirebase,
  deleteRequestFromFirebase,
  saveSupportMessageToFirebase,
  saveRegisteredCodeToFirebase
} from "../utils/firebase";
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chat/Support Hub Admin States
  const [activeChatReqCode, setActiveChatReqCode] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([]);

  // Delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<string>("");

  // Receipt viewing modal states
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [viewViewingSchool, setViewingSchool] = useState<string>("");

  // Load support messages
  const loadMessages = () => {
    try {
      const stored = localStorage.getItem("omega_support_messages");
      if (stored) {
        setAllMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAdminMessage = (messageId: string) => {
    try {
      const stored = localStorage.getItem("omega_support_messages");
      if (!stored) return;
      const current = JSON.parse(stored);
      const updated = current.filter((m: any) => m.id !== messageId);
      localStorage.setItem("omega_support_messages", JSON.stringify(updated));
      setAllMessages(updated);
      window.dispatchEvent(new CustomEvent("omega-support-message-received"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Check if admin is currently authenticated in session
    const isAuth = sessionStorage.getItem("omega_admin_logged_in") === "true";
    setIsSuperAdmin(isAuth);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;

    // Attach real-time listener for activation requests
    const qRequests = query(collection(db, "activation_requests"));
    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort requested: same school sorted together, unactivated (PENDING) first, then others
      const sorted = list.sort((a: any, b: any) => {
        const aIsPending = a.status === "PENDING";
        const bIsPending = b.status === "PENDING";
        
        if (aIsPending && !bIsPending) return -1;
        if (!aIsPending && bIsPending) return 1;

        // Group by schoolName
        const schoolA = (a.schoolName || "").trim().toLowerCase();
        const schoolB = (b.schoolName || "").trim().toLowerCase();
        if (schoolA < schoolB) return -1;
        if (schoolA > schoolB) return 1;

        // Group by time
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      
      setRequests(sorted);
      // Synchronize with local storage as secondary backup
      localStorage.setItem("omega_activation_requests", JSON.stringify(sorted));
    }, (err) => {
      console.error("Gagal listen data permohonan:", err);
    });

    // Attach real-time listener for support messages
    const qMessages = query(collection(db, "support_messages"));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllMessages(list);
      // Synchronize with local storage as secondary backup
      localStorage.setItem("omega_support_messages", JSON.stringify(list));
    }, (err) => {
      console.warn("Gagal listen bungkusan chat:", err);
    });

    return () => {
      unsubRequests();
      unsubMessages();
    };
  }, [isSuperAdmin]);

  const handleSendAdminReply = async (requestCode: string) => {
    const text = adminReplyText.trim();
    if (!text) return;

    try {
      const newMsg = {
        id: "msg-admin-reply-" + Date.now(),
        requestId: requestCode,
        sender: "admin",
        text,
        timestamp: new Date().toISOString(),
        readByAdmin: true,
        readByUser: false
      };

      await saveSupportMessageToFirebase(newMsg);
      setAdminReplyText("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = adminCodeInput.trim().toUpperCase();
    if (trimmedInput === "OTE-GP017" || trimmedInput === "OTE-GP19S" || trimmedInput === "GP-RHB86") {
      sessionStorage.setItem("omega_admin_logged_in", "true");
      setIsSuperAdmin(true);
      setErrorMsg(null);
    } else {
      setErrorMsg("Kode sandi admin tidak valid. Silakan hubungi pengembang.");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("omega_admin_logged_in");
    setIsSuperAdmin(false);
    setAdminCodeInput("");
  };

  const handleApproveRequest = async (reqId: string) => {
    try {
      const req = requests.find((r) => r.id === reqId);
      if (!req) return;

      const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      const basePrefix = Math.random() < 0.5 ? "OTE-GP017" : "OTE-GP19S";
      // Reuse existing activationCode, or generate if none exists
      const activeCode = req.activationCode || `${basePrefix}-${randStr}`;

      // 1. Update in Firebase (the message/request record)!
      await updateRequestStatusInFirebase(reqId, "ACTIVE", {
        activationCode: activeCode,
        activatedAt: new Date().toISOString()
      });

      // 2. Write to registered_codes permanently so deleting the request archive doesn't affect user login!
      await saveRegisteredCodeToFirebase({
        id: req.id || req.requestCode,
        requestCode: req.requestCode,
        activationCode: activeCode,
        schoolName: req.schoolName || "",
        principalName: req.principalName || "",
        principalNip: req.principalNip || "",
        teacherName: req.teacherName || "",
        teacherNip: req.teacherNip || "",
        jabatan: req.jabatan || "",
        faseKelas: req.faseKelas || "",
        waNumber: req.waNumber || "",
        selectedPackages: req.selectedPackages || ["premium"],
        totalAmount: req.totalAmount || 0,
        createdAt: req.createdAt || new Date().toISOString(),
        activatedAt: new Date().toISOString(),
        status: "ACTIVE"
      });

      // 3. Make sure to update the status to ACTIVE in registered_codes just in case it was DISABLED
      const pRef = doc(db, "registered_codes", activeCode);
      await updateDoc(pRef, { status: "ACTIVE" }).catch(() => {});

      alert("Berhasil mengaktifkan kode untuk permohonan ini!");
    } catch (e) {
      console.error(e);
      alert("Gagal melakukan persetujuan kode akses.");
    }
  };

  const handleDisableRequest = async (reqId: string) => {
    try {
      const req = requests.find((r) => r.id === reqId);
      if (!req) return;

      // 1. Update status to DISABLED in activation_requests
      await updateRequestStatusInFirebase(reqId, "DISABLED");

      // 2. Update status to DISABLED in registered_codes
      if (req.activationCode) {
        const pRef = doc(db, "registered_codes", req.activationCode);
        await updateDoc(pRef, { status: "DISABLED" }).catch((err) => {
          console.warn("Gagal menonaktifkan kode di registered_codes:", err);
        });
      }

      alert(`Status permohonan sekolah ${req.schoolName || ""} berhasil ditangguhkan/dinonaktifkan sementara di server!`);
    } catch (e) {
      console.error(e);
      alert("Gagal menonaktifkan kode sementara.");
    }
  };

  const handleDeleteRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    const text = req ? `${req.schoolName} (${req.teacherName})` : "arsip permohonan ini";
    
    const isAlreadyActive = req && req.status === "ACTIVE";
    const statusNote = isAlreadyActive 
      ? "\n\n⚠️ PERINGATAN: Menghapus permohonan AKTIF juga akan MENCABUT/MELEPAS seluruh hak akses Premium sekolah ini secara permanen dari server!" 
      : " (Catatan: Permohonan ini belum diaktifkan, menghapusnya akan membersihkan berkas permanen).";

    setDeleteConfirmMessage(`Apakah Anda yakin ingin menghapus permohonan dari ${text}?${statusNote}`);
    setDeleteConfirmCallback(() => async () => {
      try {
        await deleteRequestFromFirebase(reqId);

        // Remove from registered_codes to completely revoke the code permanent login
        if (req && req.activationCode) {
          await deleteDoc(doc(db, "registered_codes", req.activationCode)).catch((err) => {
            console.warn("Gagal menghapus kode permanen dari registered_codes:", err);
          });
        }

        alert("Permohonan & lisensi kode akses berhasil dicabut/dihapus secara permanen dari Firebase!");
      } catch (e) {
        console.error(e);
        alert("Gagal menghapus permohonan dari Firebase.");
      }
    });
    setDeleteConfirmId(reqId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Kode aktivasi berhasil disalin ke clipboard!");
  };

  // Login Gate
  if (!isSuperAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-amber-500/5 blur-[50px] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-505/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Key className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Kode Akses Super Admin</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">SESSION AUTHENTICATION REQUIRED</p>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Masukkan Kode Akses Master Administrator untuk membuka Panel Verifikasi Kode Akses Pembelian Server Omega.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-400 text-xs text-center font-sans">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider mb-2">
              Masukan Kode Akses Master:
            </label>
            <input
              type="password"
              placeholder="•••••••••"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              className="w-full bg-[#030305] border border-zinc-800 focus:border-amber-400 rounded-2xl py-3 px-4 font-mono text-center text-sm font-bold tracking-widest text-amber-300 uppercase outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black font-mono transition uppercase shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer"
          >
            Masuk Console Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900 gap-4">
        <div>
          <h3 className="text-sm font-bold font-mono text-amber-400 flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            CONSOLE ADMIN KODE AKSES
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Kelola dan konfirmasikan dokumen permohonan guru serta aktivasi lisensi sekolah Omega.
          </p>
        </div>
        <button
          onClick={handleAdminLogout}
          className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition rounded-xl text-xs font-semibold cursor-pointer"
        >
          Keluar Admin
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Daftar Antrean Permohonan Aktivasi ({requests.length})
        </h4>

        {requests.length === 0 ? (
          <div className="p-8 border border-zinc-900 bg-zinc-950/20 text-center rounded-2xl text-zinc-550 space-y-2">
            <p className="text-xs">Tidak ada data antrean permohonan kode akses yang masuk.</p>
            <p className="text-[10px] font-mono uppercase tracking-wider">NO REQUEST RECORDS FOUND</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className={`p-5 rounded-3xl border transition relative overflow-hidden flex flex-col md:flex-row gap-5 ${
                  req.status === "ACTIVE" 
                    ? "bg-emerald-950/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                    : "bg-[#0b0c10] border-zinc-905"
                }`}
              >
                
                {/* Visual Status Indicator Belt */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${req.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`} />

                {/* Form Data Block */}
                <div className="flex-1 space-y-3 font-sans text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-550 font-bold tracking-wider uppercase block">REQ CODE:</span>
                      <strong className="text-white font-mono text-xs tracking-wider">{req.requestCode}</strong>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                      req.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : req.status === "DISABLED"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {req.status === "ACTIVE" 
                        ? "AKTIF / PREMIUM" 
                        : req.status === "DISABLED" 
                          ? "NONAKTIF SEMENTARA" 
                          : "MENUNGGU TRANSFER"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-zinc-300">
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Sekolah: <strong>{req.schoolName}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Kepsek: <strong>{req.principalName}</strong> (NIP: {req.principalNip})</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Guru: <strong>{req.teacherName}</strong> (NIP: {req.teacherNip})</span>
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p>Jabatan: <strong>{req.jabatan}</strong></p>
                      <p>Fase / Sasaran Kelas: <strong className="text-amber-400">{req.faseKelas}</strong></p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-green-500" />
                        <span>WhatsApp WA: <strong className="text-zinc-200">{req.waNumber}</strong></span>
                      </p>
                      {req.selectedPackages && req.selectedPackages.length > 0 && (
                        <p className="text-[10px] text-zinc-400 font-mono mt-1">
                          Paket: <span className="text-amber-400 font-bold uppercase">{req.selectedPackages.map((p: string) => p.replace(/_/g, ' ')).join(', ')}</span>
                        </p>
                      )}
                      {req.totalAmount !== undefined && (
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          Total Pembayaran: <span className="text-emerald-400 font-bold">Rp. {req.totalAmount.toLocaleString("id-ID")}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {req.status === "ACTIVE" && req.activationCode && (
                    <div className="mt-3 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-emerald-500">DITERBITKAN KODE AKTIF:</span>
                        <span className="text-emerald-400 font-bold block text-sm tracking-widest uppercase">{req.activationCode}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(req.activationCode)}
                        className="p-1.5 bg-[#0b0c10] border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500 hover:border-transparent transition rounded-lg"
                        title="Salin Kode Aktif"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Receipt Image / Simulation & Actions Column */}
                <div className="w-full md:w-48 shrink-0 flex flex-col justify-between items-stretch gap-3 border-t md:border-t-0 md:border-l border-zinc-900 pt-3 md:pt-0 md:pl-5">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-550 font-bold uppercase block">Lampiran Bukti:</span>
                    
                    {req.receiptBase64 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setViewingReceipt(req.receiptBase64);
                          setViewingSchool(req.schoolName || "Sekolah");
                        }}
                        className="relative group overflow-hidden border border-amber-500/30 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent p-2 h-16 flex items-center justify-center cursor-pointer transition hover:scale-[1.03] active:scale-97 hover:border-amber-400/60 w-full"
                        title="Klik untuk melihat bukti transfer asli"
                      >
                        <ImageIcon className="w-5 h-5 text-amber-500 mr-2 shrink-0 animate-pulse" />
                        <div className="text-left overflow-hidden">
                          <span className="text-[9px] text-amber-500 font-mono font-bold block leading-none">BUKTI_TRANSFER.PNG</span>
                          <span className="text-[9px] text-zinc-400 font-mono font-bold block truncate mt-1 underline decoration-dotted">Klik untuk Lihat &rarr;</span>
                        </div>
                      </button>
                    ) : (
                      <div className="border border-zinc-900 border-dashed rounded-xl p-2 text-center text-zinc-600 text-[10px] h-16 flex items-center justify-center font-mono w-full">
                        Belum Diunggah
                      </div>
                    )}
                  </div>

                   <div className="flex gap-2">
                    {req.status === "PENDING" && (
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="flex-1 py-1 px-2.5 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-[#090a0d] text-[10.5px] font-black uppercase tracking-wider transition rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Aktifkan
                      </button>
                    )}
                    {req.status === "DISABLED" && (
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="flex-1 py-1 px-2.5 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-[#090a0d] text-[10.5px] font-black uppercase tracking-wider transition rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Aktifkan
                      </button>
                    )}
                    {req.status === "ACTIVE" && (
                      <div className="flex-1 flex gap-1">
                        <div className="flex-1 py-1 px-2 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-mono tracking-wider font-bold rounded-xl text-center flex items-center justify-center gap-0.5 bg-emerald-500/5">
                          <Check className="w-3 h-3" /> Aktif
                        </div>
                        <button
                          onClick={() => handleDisableRequest(req.id)}
                          className="px-2 py-1 bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-black hover:border-transparent transition rounded-xl text-[9px] font-bold font-mono uppercase"
                          title="Nonaktifkan Sementara"
                        >
                          Tangguhkan
                        </button>
                      </div>
                    )}
                    
                    {/* Support Chat toggle button */}
                    <button
                      onClick={() => {
                        const nextCode = activeChatReqCode === req.requestCode ? null : req.requestCode;
                        setActiveChatReqCode(nextCode);
                        if (nextCode) {
                          // Mark messages as read by admin when admin loads the thread
                          const updated = allMessages.map((m: any) => {
                            if (m.requestId === req.requestCode && m.sender === "user") {
                              return { ...m, readByAdmin: true };
                            }
                            return m;
                          });
                          localStorage.setItem("omega_support_messages", JSON.stringify(updated));
                          setAllMessages(updated);
                          window.dispatchEvent(new CustomEvent("omega-support-message-received"));
                        }
                      }}
                      className={`p-2 border rounded-xl flex items-center justify-center gap-1 transition text-xs font-mono font-bold relative cursor-pointer ${
                        activeChatReqCode === req.requestCode
                          ? "bg-indigo-600 border-indigo-505 text-white"
                          : "border-zinc-800 text-indigo-405 hover:text-white hover:bg-zinc-950"
                      }`}
                      title="Chat Bantuan"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {(() => {
                        const unreadCount = allMessages.filter((m: any) => m.requestId === req.requestCode && m.sender === "user" && !m.readByAdmin).length;
                        return unreadCount > 0 ? (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                            {unreadCount}
                          </span>
                        ) : null;
                      })()}
                    </button>

                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-2 border border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 transition rounded-xl cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapse Expandable Chat Panel */}
                {activeChatReqCode === req.requestCode && (
                  <div className="w-full mt-4 p-4 rounded-2xl bg-[#05060b] border border-zinc-850 space-y-3 font-sans md:col-span-2">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2">
                      <span className="text-[10px] font-mono text-indigo-400 tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                        SALURAN CHAT AKTIF: <strong className="text-zinc-200">{req.requestCode}</strong>
                      </span>
                      <button 
                        onClick={() => setActiveChatReqCode(null)}
                        className="text-[9.5px] text-zinc-500 hover:text-zinc-350 hover:underline cursor-pointer"
                      >
                        Tutup Chat
                      </button>
                    </div>

                    {/* Message list container */}
                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                      {allMessages.filter((m: any) => m.requestId === req.requestCode).length === 0 ? (
                        <p className="text-[10px] text-zinc-650 text-center py-4 font-mono">BELUM ADA DATA PESAN AKTIF</p>
                      ) : (
                        allMessages
                          .filter((m: any) => m.requestId === req.requestCode)
                          .map((m: any) => {
                            const isAdminMsg = m.sender === "admin";
                            const isSysMsg = m.sender === "system";
                            return (
                              <div key={m.id} className={`flex flex-col group ${isAdminMsg ? "items-end" : "items-start"}`}>
                                <div className={`p-2 rounded-xl text-xs max-w-[85%] leading-normal ${
                                  isAdminMsg 
                                    ? "bg-indigo-600 text-indigo-50" 
                                    : isSysMsg 
                                      ? "bg-zinc-950 border border-violet-500/15 text-violet-300 text-[10px] font-mono" 
                                      : "bg-zinc-90 text-zinc-300"
                                }`}>
                                  {m.text}
                                </div>
                                <span className="text-[8px] font-mono text-zinc-600 mt-0.5 px-1 flex items-center gap-1">
                                  <span>{isAdminMsg ? "Tim Admin" : isSysMsg ? "Omega AI" : "Guru"} • {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ""}</span>
                                  <button
                                    onClick={() => handleDeleteAdminMessage(m.id)}
                                    className="opacity-0 group-hover:opacity-100 transition p-0.5 text-rose-500 hover:text-rose-400 rounded hover:bg-rose-500/10 cursor-pointer"
                                    title="Hapus pesan"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              </div>
                            );
                          })
                      )}
                    </div>

                    {/* Admin typing field */}
                    <div className="flex gap-2 border-t border-zinc-900 pt-3">
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Balas permohonan guru ini resmi..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendAdminReply(req.requestCode);
                          }
                        }}
                        className="flex-1 bg-[#020204] border border-zinc-850 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all placeholder-zinc-650"
                      />
                      <button
                        onClick={() => handleSendAdminReply(req.requestCode)}
                        className="p-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-[#090a0d] hover:from-amber-400 hover:to-orange-405 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Kirim
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-zinc-850 max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl p-6 font-sans text-center space-y-4 animate-fade-in">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Konfirmasi Hapus</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                {deleteConfirmMessage}
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteConfirmCallback(null);
                }}
                className="px-4 py-2 text-xs font-bold uppercase rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmCallback) deleteConfirmCallback();
                  setDeleteConfirmId(null);
                  setDeleteConfirmCallback(null);
                }}
                className="px-5 py-2 text-xs font-extrabold uppercase rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition active:scale-95 cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof of Transfer Viewer Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-black/92 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
            <a
              href={viewingReceipt}
              download={`BUKTI_TRANSFER_${viewViewingSchool.replace(/\s+/g, "_").toUpperCase()}.png`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh Gambar
            </a>
            <button
              type="button"
              onClick={() => {
                setViewingReceipt(null);
                setViewingSchool("");
              }}
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl transition cursor-pointer"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-3 pointer-events-auto mt-10">
            <p className="text-sm font-mono tracking-wide text-amber-500 font-extrabold uppercase">
              BUKTI TRANSFER: {viewViewingSchool}
            </p>
            <div className="border-4 border-zinc-900 bg-[#060709] rounded-2xl overflow-auto max-w-full max-h-[70vh] flex items-center justify-center shadow-2xl p-2">
              <img 
                src={viewingReceipt} 
                alt="Bukti Transfer" 
                className="max-h-[60vh] object-contain rounded-lg"
              />
            </div>
            <p className="text-[11px] text-zinc-550 font-sans text-center">
              Gunakan klik kanan & simpan, atau klik tombol Unduh Gambar di kanan atas untuk menyimpannya ke komputer Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
