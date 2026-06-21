import React, { useState } from 'react';
import JSZip from 'jszip';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, Download, ShieldAlert, Key, Settings } from 'lucide-react';

interface WordUnlockState {
  file: File | null;
  status: 'idle' | 'processing' | 'success' | 'invalid' | 'error';
  message: string;
  unlockedBlob: Blob | null;
  unlockedFileName: string;
  isUnlocked: boolean;
}

export const WordProcessor: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [state, setState] = useState<WordUnlockState>({
    file: null,
    status: 'idle',
    message: '',
    unlockedBlob: null,
    unlockedFileName: '',
    isUnlocked: false,
  });

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
      isUnlocked: false,
    });
  };

  const processFile = async (selectedFile: File) => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (extension !== 'docx' && extension !== 'docm') {
      setState({
        file: selectedFile,
        status: 'invalid',
        message: 'Format file tidak didukung. Utilitas pembuka Word otomatis ini hanya mendukung file Word modern (.docx dan .docm).',
        unlockedBlob: null,
        unlockedFileName: '',
        isUnlocked: false,
      });
      return;
    }

    setState({
      file: selectedFile,
      status: 'processing',
      message: 'Sedang mengekstrak struktur arsip file Word...',
      unlockedBlob: null,
      unlockedFileName: '',
      isUnlocked: false,
    });

    try {
      const zip = new JSZip();
      const content = await selectedFile.arrayBuffer();
      const loadedZip = await zip.loadAsync(content);
      
      let documentProtectionRemoved = false;

      // In Word documents, protection is defined in word/settings.xml
      const settingsPath = "word/settings.xml";
      if (loadedZip.files[settingsPath]) {
        const fileContent = await loadedZip.files[settingsPath].async("string");
        
        // Match documentProtection tags
        if (fileContent.includes("<w:documentProtection")) {
          let strippedContent = fileContent;
          // Strip documentProtection tag
          strippedContent = strippedContent.replace(/<w:documentProtection[^>]*\/>/g, '');
          strippedContent = strippedContent.replace(/<w:documentProtection[^>]*>([\s\S]*?)<\/w:documentProtection>/g, '');
          
          loadedZip.file(settingsPath, strippedContent);
          documentProtectionRemoved = true;
        }
      }

      const cleanedBlob = await loadedZip.generateAsync({ type: 'blob' });

      setState({
        file: selectedFile,
        status: 'success',
        message: documentProtectionRemoved 
          ? 'Kunci batasan edit (Document Protection) pada file Word berhasil dihapus!'
          : 'File Word Anda tidak memiliki proteksi batasan edit aktif.',
        unlockedBlob: cleanedBlob,
        unlockedFileName: `unlocked_${selectedFile.name}`,
        isUnlocked: documentProtectionRemoved
      });

    } catch (err: any) {
      console.error(err);
      setState({
        file: selectedFile,
        status: 'error',
        message: `Gagal memproses dokumen Word Anda: ${err?.message || 'Format XML tidak valid.'}`,
        unlockedBlob: null,
        unlockedFileName: '',
        isUnlocked: false,
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
    <div className="premium-card premium-border-cyan rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-cyan-555/10 blur-[50px] pointer-events-none" />
      
      {state.status === 'idle' && (
        <div className="space-y-6">
          <div className="bg-[#0b0b0e] p-5 rounded-2xl border border-zinc-800/80 text-left">
            <h4 className="text-cyan-400 font-bold text-xs flex items-center gap-2 uppercase tracking-wider mb-2 font-mono">
              <Settings className="w-4 h-4 text-cyan-500 animate-spin" />
              DETEKTOR PROTEKSI DOKUMEN WORD
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Utilitas ini secara otomatis membedah file <code className="text-cyan-300">.docx</code> atau <code className="text-cyan-300">.docm</code>, mencari tag <code>&lt;w:documentProtection&gt;</code> di dalam <code>settings.xml</code> yang membatasi hak pengisian dokumen, dan melengserkannya seketika.
            </p>
          </div>

          <label
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 relative group ${
              dragActive
                ? 'border-cyan-400 bg-cyan-550/5'
                : 'border-zinc-800 hover:border-cyan-400/60 bg-zinc-950/40 hover:bg-zinc-950/70'
            }`}
          >
            <input type="file" accept=".docx,.docm" onChange={handleFileInput} className="hidden" />
            <div className="w-16 h-16 bg-zinc-950/90 shadow-2xl rounded-full flex items-center justify-center text-cyan-400 mb-4 border border-zinc-800 group-hover:border-cyan-400/60 transition-all duration-300">
              <UploadCloud className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-zinc-250 font-bold text-center font-display text-sm tracking-wide group-hover:text-cyan-300 transition-colors">
              Tarik & Lepas File Word (.docx / .docm)
            </h3>
            <p className="text-zinc-500 text-[10px] text-center mt-1.5 font-mono">
              Maksimum 50MB • Dekripsi aman luring tanpa lalu lintas server luar.
            </p>
            <div className="mt-5 py-2 px-5 rounded-xl bg-cyan-500/10 hover:bg-cyan-400 text-cyan-400 hover:text-black font-bold text-xs transition-colors border border-cyan-400/30 font-mono">
              PILIH FILE WORD
            </div>
          </label>
        </div>
      )}

      {state.status === 'processing' && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-900/30 border-t-cyan-400 animate-spin" />
            <FileText className="w-6 h-6 text-cyan-400 absolute top-5 left-5 animate-pulse" />
          </div>
          <h3 className="text-white font-bold font-display text-base tracking-wide">MEMBEDAH STRUKTUR DOKUMEN...</h3>
          <p className="text-cyan-400 text-xs font-mono max-w-md">{state.message}</p>
        </div>
      )}

      {state.status === 'success' && (
        <div className="space-y-6">
          <div className="premium-border-cyan p-6 md:p-8 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-350 flex items-center justify-center shrink-0 border border-cyan-500/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-white font-bold text-lg font-display">BERKAS WORD DEKRIPSI SELESAI!</h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Kunci modifikasi dokumen pada <strong className="text-cyan-400 font-mono">{state.file?.name}</strong> berhasil diatasi.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-[#0b0b0e] p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400">
              <div className="flex justify-between items-center">
                <span>STATUS_DOKUMEN_WORD:</span>
                <strong className={state.isUnlocked ? "text-cyan-400" : "text-zinc-400"}>
                  {state.isUnlocked ? "BATASAN_EDITAN_DIHAPUS" : "TIDAK_TERKUNCI"}
                </strong>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={triggerDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl text-sm font-bold transition shadow-lg hover:shadow-cyan-400/20"
              >
                <Download className="w-4 h-4 shrink-0" />
                Unduh Berkas Bebas Edit
              </button>
              <button
                onClick={resetState}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-zinc-900 text-zinc-350 hover:bg-zinc-800 rounded-xl text-sm font-semibold transition"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {(state.status === 'invalid' || state.status === 'error') && (
        <div className="border border-red-500/20 bg-red-950/10 p-6 rounded-2xl relative">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
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
              COBA LAGI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
