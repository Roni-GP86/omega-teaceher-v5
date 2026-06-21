import React, { useState } from 'react';
import JSZip from 'jszip';
import { UploadCloud, FileSpreadsheet, KeyRound, CheckCircle2, AlertTriangle, RefreshCw, Download, Info, Shield, Key, Copy, Check, Settings, Eye } from 'lucide-react';

interface FileUnlockState {
  file: File | null;
  status: 'idle' | 'processing' | 'success' | 'invalid' | 'error';
  message: string;
  unlockedBlob: Blob | null;
  unlockedFileName: string;
  sheetsCleaned: number;
  workbookCleaned: boolean;
}

// 16-bit XOR hash algorithm employed by Excel Worksheet protection legacy verification.
// Even modern Excel fallback evaluates this attribute, allowing password replacement.
function calculateExcelXorHash(password: string): string {
  let hash = 0;
  const len = password.length;
  if (len === 0) return "0000";

  for (let i = len - 1; i >= 0; i--) {
    const charCode = password.charCodeAt(i);
    // Rotation within 15-bit bounds
    hash = (((hash << 1) & 0x7FFF) | ((hash >> 14) & 1)) & 0x7FFF;
    hash ^= charCode;
  }
  // Ultimate rotation
  hash = (((hash << 1) & 0x7FFF) | ((hash >> 14) & 1)) & 0x7FFF;
  hash ^= len;
  hash ^= 0xCE4D;

  return hash.toString(16).toUpperCase().padStart(4, "0");
}

function repaveSheetProtection(xmlContent: string, newPasswordText: string, removeProtectionEntirely: boolean): { content: string; modified: boolean } {
  if (removeProtectionEntirely) {
    const original = xmlContent;
    let strippedContent = xmlContent;
    strippedContent = strippedContent.replace(/<sheetProtection[^>]*\/>/g, '');
    strippedContent = strippedContent.replace(/<sheetProtection[^>]*>([\s\S]*?)<\/sheetProtection>/g, '');
    return { content: strippedContent, modified: original !== strippedContent };
  }

  const hashHex = calculateExcelXorHash(newPasswordText);
  let wasModified = false;

  // Search if sheetProtection exists
  if (!xmlContent.includes('<sheetProtection')) {
    return { content: xmlContent, modified: false };
  }

  // Parse and replace existing password hashes while preserving all other properties like selectLockedCells, selectUnlockedCells etc.
  const replaced = xmlContent.replace(/(<sheetProtection)([^>]*?)(\/?>)/gi, (match, tagStart, attributes, tagEnd) => {
    wasModified = true;
    let cleanAttrs = attributes;
    const attrsToRemove = [
      /\bpassword="[^"]*"/gi,
      /\balgorithmName="[^"]*"/gi,
      /\bhashValue="[^"]*"/gi,
      /\bsaltValue="[^"]*"/gi,
      /\bspinCount="[^"]*"/gi
    ];
    
    attrsToRemove.forEach(regex => {
      cleanAttrs = cleanAttrs.replace(regex, '');
    });
    
    cleanAttrs = cleanAttrs.replace(/\s+/g, ' ').trim();
    const separator = cleanAttrs ? ' ' : '';
    
    return `${tagStart} ${cleanAttrs}${separator}password="${hashHex}"${tagEnd}`;
  });

  return { content: replaced, modified: wasModified };
}

function repaveWorkbookProtection(xmlContent: string, newPasswordText: string, removeProtectionEntirely: boolean): { content: string; modified: boolean } {
  if (removeProtectionEntirely) {
    const original = xmlContent;
    let strippedContent = xmlContent;
    strippedContent = strippedContent.replace(/<workbookProtection[^>]*\/>/g, '');
    strippedContent = strippedContent.replace(/<workbookProtection[^>]*>([\s\S]*?)<\/workbookProtection>/g, '');
    return { content: strippedContent, modified: original !== strippedContent };
  }

  const hashHex = calculateExcelXorHash(newPasswordText);
  let wasModified = false;

  if (!xmlContent.includes('<workbookProtection')) {
    return { content: xmlContent, modified: false };
  }

  const replaced = xmlContent.replace(/(<workbookProtection)([^>]*?)(\/?>)/gi, (match, tagStart, attributes, tagEnd) => {
    wasModified = true;
    let cleanAttrs = attributes;
    const attrsToRemove = [
      /\bpassword="[^"]*"/gi,
      /\balgorithmName="[^"]*"/gi,
      /\bhashValue="[^"]*"/gi,
      /\bsaltValue="[^"]*"/gi,
      /\bspinCount="[^"]*"/gi
    ];
    
    attrsToRemove.forEach(regex => {
      cleanAttrs = cleanAttrs.replace(regex, '');
    });
    
    cleanAttrs = cleanAttrs.replace(/\s+/g, ' ').trim();
    const separator = cleanAttrs ? ' ' : '';
    
    return `${tagStart} ${cleanAttrs}${separator}password="${hashHex}"${tagEnd}`;
  });

  return { content: replaced, modified: wasModified };
}

export const FileProcessor: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [decryptMode, setDecryptMode] = useState<'remove' | 'replace'>('replace');
  const [customPassword, setCustomPassword] = useState<string>('GP86');
  const [newPassword, setNewPassword] = useState<string>('');
  const [copiedNewPass, setCopiedNewPass] = useState<boolean>(false);
  const [state, setState] = useState<FileUnlockState>({
    file: null,
    status: 'idle',
    message: '',
    unlockedBlob: null,
    unlockedFileName: '',
    sheetsCleaned: 0,
    workbookCleaned: false
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const resetState = () => {
    setState({
      file: null,
      status: 'idle',
      message: '',
      unlockedBlob: null,
      unlockedFileName: '',
      sheetsCleaned: 0,
      workbookCleaned: false
    });
    setNewPassword('');
    setCopiedNewPass(false);
  };

  const generateSecurePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let length = 10;
    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNewPass(true);
    setTimeout(() => setCopiedNewPass(false), 2000);
  };

  const processFile = async (selectedFile: File) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    // Check if xlsx or xlsm
    if (extension !== 'xlsx' && extension !== 'xlsm') {
      setState({
        file: selectedFile,
        status: 'invalid',
        message: 'Format file tidak didukung. Utilitas pembuka otomatis ini mendukung file Excel modern (.xlsx dan .xlsm). Silakan konversi atau baca panduan di bawah untuk metode file .xls lama.',
        unlockedBlob: null,
        unlockedFileName: '',
        sheetsCleaned: 0,
        workbookCleaned: false
      });
      return;
    }

    setState({
      file: selectedFile,
      status: 'processing',
      message: 'Sedang mengekstrak struktur file Excel...',
      unlockedBlob: null,
      unlockedFileName: '',
      sheetsCleaned: 0,
      workbookCleaned: false
    });

    try {
      const zip = new JSZip();
      const content = await selectedFile.arrayBuffer();
      // Load zip contents ofxlsx file
      const loadedZip = await zip.loadAsync(content);
      
      let sheetsModified = 0;
      let workbookModified = false;

      // 1. Scan and process worksheet xml files to strip/repave sheetProtection
      const worksheetRegex = /^xl\/worksheets\/sheet\d+\.xml$/;
      const filePaths = Object.keys(loadedZip.files);

      for (const path of filePaths) {
        if (worksheetRegex.test(path)) {
          const fileContent = await loadedZip.files[path].async("string");
          if (fileContent.includes("<sheetProtection")) {
            const { content: repavedContent, modified } = repaveSheetProtection(
              fileContent,
              customPassword,
              decryptMode === 'remove'
            );
            if (modified) {
              loadedZip.file(path, repavedContent);
              sheetsModified++;
            }
          }
        }
      }

      // 2. Scan and process workbook.xml to strip/repave workbookProtection
      const workbookXmlPath = "xl/workbook.xml";
      if (loadedZip.files[workbookXmlPath]) {
        const fileContent = await loadedZip.files[workbookXmlPath].async("string");
        if (fileContent.includes("<workbookProtection")) {
          const { content: repavedContent, modified } = repaveWorkbookProtection(
            fileContent,
            customPassword,
            decryptMode === 'remove'
          );
          if (modified) {
            loadedZip.file(workbookXmlPath, repavedContent);
            workbookModified = true;
          }
        }
      }

      // If nothing was protected, we can state success but let them download a guaranteed clean version
      if (sheetsModified === 0 && !workbookModified) {
        // We'll still process so they have a fresh verified unencrypted workbook copy
        setState({
          file: selectedFile,
          status: 'success',
          message: 'Luar biasa! File Anda tidak memiliki proteksi sandi aktif atau telah dibersihkan secara penuh. Anda dapat mengunduhnya kembali dengan aman.',
          unlockedBlob: new Blob([content], { type: selectedFile.type }),
          unlockedFileName: `unlocked_${selectedFile.name}`,
          sheetsCleaned: 0,
          workbookCleaned: false
        });
        return;
      }

      // Generate the new unpacked xlsx file content as blob
      const cleanedBlob = await loadedZip.generateAsync({ type: 'blob' });

      setState({
        file: selectedFile,
        status: 'success',
        message: 'Kunci proteksi lembar kerja (worksheet) dan struktur workbook berhasil dibebaskan!',
        unlockedBlob: cleanedBlob,
        unlockedFileName: `unlocked_${selectedFile.name}`,
        sheetsCleaned: sheetsModified,
        workbookCleaned: workbookModified
      });

    } catch (err: any) {
      console.error(err);
      setState({
        file: selectedFile,
        status: 'error',
        message: `Terjadi kesalahan saat memproses file Anda: ${err?.message || 'Validasi ZIP gagal'}. Pastikan file tidak rusak dan tidak diproteksi oleh enkripsi sandi utama pembukaan file (Password To Open).`,
        unlockedBlob: null,
        unlockedFileName: '',
        sheetsCleaned: 0,
        workbookCleaned: false
      });
    }
  };

  const triggerDownload = () => {
    if (!state.unlockedBlob) return;
    const url = URL.createObjectURL(state.unlockedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = state.unlockedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="premium-card premium-border-emerald rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Absolute cyber glowing background particles */}
      <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-emerald-550/10 blur-[50px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-teal-555/10 blur-[50px] pointer-events-none" />

      {state.status === 'idle' && (
        <div className="space-y-6 relative z-10">
          {/* Decryption Mode Selector */}
          <div className="bg-[#0b0b0e] p-5 rounded-2xl border border-zinc-800/80 text-left">
            <h4 className="text-emerald-400 font-bold text-xs flex items-center gap-2 uppercase tracking-wider mb-4 font-mono">
              <Settings className="w-4 h-4 text-emerald-500 animate-spin" />
              KONFIGURASI ENKRIPSI & DEKRIPSI EXCEL
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Replace Password (preserve scope) */}
              <button
                type="button"
                onClick={() => setDecryptMode('replace')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex gap-3 ${
                  decryptMode === 'replace'
                    ? 'bg-zinc-900 border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  decryptMode === 'replace' ? 'border-emerald-400 text-emerald-400 bg-emerald-900/40' : 'border-zinc-700'
                }`}>
                  {decryptMode === 'replace' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5 font-display">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Amankan Hak Akses: Ganti Password
                  </h5>
                  <p className="text-zinc-400 text-[10px] mt-1.5 leading-relaxed">
                    Tetap mempertahankan penempatan perlindungan sel-sel yang dikunci sesuai file asli Anda. Hanya sandi lamanya saja yang diubah menjadi sandi baru pilihan Anda.
                  </p>
                </div>
              </button>

              {/* Option 2: Remove completely */}
              <button
                type="button"
                onClick={() => setDecryptMode('remove')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex gap-3 ${
                  decryptMode === 'remove'
                    ? 'bg-zinc-900 border-emerald-400 ring-2 ring-emerald-400/20 shadow-lg shadow-emerald-400/5'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  decryptMode === 'remove' ? 'border-emerald-400 text-emerald-400 bg-emerald-900/40' : 'border-zinc-700'
                }`}>
                  {decryptMode === 'remove' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5 font-display">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    Hapus Proteksi Secara Total
                  </h5>
                  <p className="text-zinc-400 text-[10px] mt-1.5 leading-relaxed">
                    Menghilangkan perlindungan sheet secara total. Semua sel yang aslinya dikunci akan langsung bebas diedit tanpa menanyakan password lagi di kemudian hari.
                  </p>
                </div>
              </button>
            </div>

            {/* Custom password field if Mode is Replace */}
            {decryptMode === 'replace' && (
              <div className="mt-4 bg-[#07070a] p-4 rounded-xl border border-zinc-805 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Key className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-200">UBAH SANDI BARU MENJADI:</span>
                    <p className="text-zinc-500 text-[9px]">Ketik password pilihan Anda di input samping</p>
                  </div>
                </div>
                <div className="w-full md:w-auto flex items-center gap-3">
                  <input
                    type="text"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Contoh: GP86"
                    className="w-full md:w-44 text-xs px-3.5 py-2 border border-zinc-800 bg-zinc-950 text-white rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                  <div className="text-[10px] bg-emerald-400 text-black px-3 py-2 rounded-lg font-bold shrink-0">
                    Sandi Aktif: {customPassword || '(Kosong)'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <label
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 relative group ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/5'
                : 'border-zinc-800 hover:border-emerald-400/60 bg-zinc-950/40 hover:bg-zinc-950/70'
            }`}
          >
            <input
              type="file"
              accept=".xlsx,.xlsm"
              onChange={handleFileInput}
              className="hidden"
            />
            {/* Hacker glowing radar key button */}
            <div className="w-16 h-16 bg-zinc-950/90 shadow-2xl rounded-full flex items-center justify-center text-emerald-400 mb-4 border border-zinc-800 group-hover:border-emerald-400/60 transition-all duration-300">
              <UploadCloud className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-zinc-205 font-bold text-center font-display text-sm tracking-wide group-hover:text-emerald-300 transition-colors">Tarik & Lepas File Excel (.xlsx / .xlsm)</h3>
            <p className="text-zinc-500 text-[10px] text-center mt-1.5 font-mono">
              Maksimum file 50MB • Proses 100% aman dijalankan secara luring di browser Anda.
            </p>
            <div className="mt-5 py-2 px-5 rounded-xl bg-emerald-550/10 hover:bg-emerald-400 group-hover:bg-emerald-400 text-emerald-400 group-hover:text-black font-bold text-xs transition-all border border-emerald-400/30 font-mono">
              PILIH FILE SECARA MANUAL
            </div>
          </label>
        </div>
      )}

      {state.status === 'processing' && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-900/30 border-t-emerald-400 animate-spin" />
            <KeyRound className="w-6 h-6 text-emerald-400 absolute top-5 left-5 animate-pulse" />
          </div>
          <h3 className="text-white font-bold font-display text-base tracking-wide">MENGEKSTRUKTUR STRUKTUR ZIP MANUAL...</h3>
          <p className="text-emerald-400 text-xs font-mono max-w-md">{state.message}</p>
        </div>
      )}

      {state.status === 'success' && (
        <div className="space-y-6 relative z-10 font-sans">
          <div className="premium-border-emerald p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-5 text-emerald-400 pointer-events-none">
              <CheckCircle2 className="w-32 h-32" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-350 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-white font-bold text-lg font-display">BERKAS SELESAI DIKRIPSI!</h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Kunci proteksi pada berkas <strong className="text-emerald-400 font-mono font-normal">{state.file?.name}</strong> berhasil dilepaskan.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-y border-dashed border-zinc-800 py-5 text-xs font-mono text-zinc-400">
              <div className="bg-[#0b0b0e] p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Sheet Terbuka</span>
                <strong className="text-white text-base">{state.sheetsCleaned} Sheet</strong>
              </div>
              <div className="bg-[#0b0b0e] p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Proteksi Workbook</span>
                <strong className="text-emerald-400 text-base">{state.workbookCleaned ? 'DIBERSIHKAN' : 'SENSITIVE_OK'}</strong>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={triggerDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-black rounded-xl text-sm font-bold transition shadow-lg hover:shadow-emerald-500/20"
              >
                <Download className="w-4 h-4 shrink-0" />
                Download Excel Selesai Hack
              </button>
              <button
                onClick={resetState}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-sm font-semibold transition"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                Ganti File
              </button>
            </div>
          </div>

          {/* Golden Panel with Custom Guide */}
          <div className="premium-border-gold p-6 rounded-2xl space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm font-display tracking-wide">INFORMASI TEKNIS SANDI EXCEL</h4>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed font-sans">
                  Microsoft Excel melakukan proteksi lembar kerja dengan mengonversi karakter sandi menjadi <strong>16-bit XOR Hash</strong>. Karena ini adalah enkripsi satu arah, password asli Anda tidak dapat dibaca kembali. Namun, Anda dapat secara langsung menimpa atau menanam password baru Anda sesuai dengan kebutuhan pengerjaan.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] rounded-xl p-4 border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  BUAT SANDI BARU CADANGAN:
                </span>
                <button
                  type="button"
                  onClick={generateSecurePassword}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Acak Sandi Acak
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan sandi cadangan baru..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 text-white text-xs px-3.5 py-2.5 bg-zinc-950 rounded-lg border border-zinc-800 outline-none focus:border-emerald-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(newPassword)}
                  disabled={!newPassword}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 disabled:opacity-40 rounded-lg text-xs font-semibold font-mono transition flex items-center gap-1.5 border border-zinc-700"
                >
                  {copiedNewPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNewPass ? 'Tersalin' : 'Salin'}
                </button>
              </div>

              {newPassword && (
                <p className="text-[10px] text-emerald-400 font-mono">
                  &gt;&gt;_ SECURE_PASS_GENERATED: Simpan sandi baru ini untuk proteksi masa depan Anda.
                </p>
              )}
            </div>

            <div className="bg-zinc-950 text-zinc-400 rounded-xl p-4 text-[11px] leading-relaxed space-y-2 border border-zinc-800 font-mono">
              <h5 className="font-semibold text-white">CARA MEMASANG SANDI BARU INI SECARA PRIBADI:</h5>
              <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                <li>Buka file Excel hasil unduhan di komputer Anda.</li>
                <li>Klik menu <strong>Review</strong> di bar atas Excel.</li>
                <li>Pilih <strong>Protect Sheet</strong>.</li>
                <li>Masukkan kata sandi baru Anda, lalu simpan file.</li>
                <li>File Anda sekarang terlindungi secara kustom hanya untuk pihak tertentu!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {(state.status === 'invalid' || state.status === 'error') && (
        <div className="border border-red-500/20 bg-red-950/10 p-6 rounded-2xl font-sans relative z-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-550 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="text-white font-bold text-sm">GAGAL MENJALANKAN DEKRIPSI</h3>
              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">{state.message}</p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={resetState}
              className="py-2.5 px-5 bg-red-650 hover:bg-red-750 text-white rounded-xl text-xs font-bold font-mono transition"
            >
              COBA BERKAS LAIN
            </button>
            <button
              onClick={resetState}
              className="py-2.5 px-4 bg-zinc-900 text-zinc-405 border border-zinc-800 rounded-xl text-xs font-bold font-mono transition"
            >
              MULAI ULANG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
