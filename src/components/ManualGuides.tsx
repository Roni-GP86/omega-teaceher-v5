import React from 'react';
import { FileCode, ShieldAlert, Layers, ExternalLink, Sparkles, Terminal, Copy, Check, Info } from 'lucide-react';

interface ManualGuidesProps {
  onCopyVba: (text: string) => void;
  vbaCode: string;
  hasCopied: boolean;
}

export const ManualGuides: React.FC<ManualGuidesProps> = ({ onCopyVba, vbaCode, hasCopied }) => {
  return (
    <div className="space-y-8 font-sans">
      <div className="premium-border-gold p-5 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="font-semibold text-amber-350 text-xs font-mono uppercase tracking-wider">Pemberitahuan Etis & Teknis</h4>
          <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
            Metode ini bertujuan khusus untuk memulihkan akses pengerjaan formula atau modifikasi data milik Anda sendiri pada lembar kerja (Worksheet) yang terkunci oleh sistem sandi standard Microsoft Excel. Metode ini menembus file biner tanpa brute-force password eksternal pembukaan file (Password to Open).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: ZIP Trick */}
        <div className="premium-card premium-border-emerald p-6 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Metode 1: Ubah Jadi ZIP</h3>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Teknik paling populer untuk membongkar proteksi sheet secara manual lewat manipulasi kompresi ZIP.
            </p>
            <ol className="mt-5 space-y-3.5 text-xs text-zinc-300">
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">1</span>
                <span>Ubah ekstensi file lama Anda dari <strong>.xlsx</strong> menjadi <strong>.zip</strong>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">2</span>
                <span>Masuk ke arsip ZIP tersebut, buka direktorat internal <code>xl/worksheets/</code>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">3</span>
                <span>Gunakan editor teks untuk menghapus seluruh blok tag <code>&lt;sheetProtection ... /&gt;</code>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">4</span>
                <span>Simpan file, kunci kembali arsip ZIP, dan ganti nama ekstensi balik menjadi <strong>.xlsx</strong>.</span>
              </li>
            </ol>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-900 text-[11px] text-amber-400 font-mono">
            💡 Mesin di tab "Pelepas Kunci Berkas" melakukan skema canggih ini secara otomatis.
          </div>
        </div>

        {/* Card 2: Google Sheets Shortcut */}
        <div className="premium-card premium-border-cyan p-6 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <ExternalLink className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Metode 2: Google Sheets</h3>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Trik cerdas memanfaatkan cloud suite Google Drive untuk melewati kunci lembaran proteksi Excel Anda.
            </p>
            <ol className="mt-5 space-y-3.5 text-xs text-zinc-300">
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">1</span>
                <span>Gunakan browser dan buka laman Cloud Utama <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-medium hover:text-amber-300">Google Sheets</a>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">2</span>
                <span>Buka dokumen baru, pilih menu <strong>File &gt; Impor (Import File)</strong>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">3</span>
                <span>Unggah biner dokumen Anda. Google akan mengaburkan atribut lock protection lembar kerja.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 bg-amber-400 text-black font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono">4</span>
                <span>Simpan balik dokumen sebagai Excel dengan mengklik <strong>File &gt; Download &gt; Microsoft Excel (.xlsx)</strong>.</span>
              </li>
            </ol>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-900 text-[11px] text-amber-400 font-mono">
            🚀 Solusi terbaik untuk penanganan cepat dokumen beresolusi kecil.
          </div>
        </div>

        {/* Card 3: VBA Script */}
        <div className="premium-card premium-border-amber p-6 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Metode 3: Makro VBA</h3>
            <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
              Tanam makro terenkripsi bawaan sandi lokal untuk memaksa pembebasan penulisan sel aktif.
            </p>
            <ul className="mt-5 space-y-3.5 text-xs text-zinc-300">
              <li className="flex gap-2 items-start">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span>Buka file Excel Anda, jalankan <code>ALT + F11</code> untuk membuka konsol VBA.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span>Klik <code>Insert &gt; Module</code> pada bar atas guna membuka berkas kontainer.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span>Salin Script fungsional makro yang sudah kami sediakan di bawah ini.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span>Jalankan instruksi makro dengan mengklik tombol <code>Run (F5)</code>. Selesai!</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-900">
            <button
              onClick={() => onCopyVba(vbaCode)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-black rounded-xl text-xs font-bold transition font-mono tracking-wider"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 shrink-0 text-zinc-900" />
                  KODE DISALIN!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  SALIN SKRIP VBA
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VBA Code Section */}
      <div className="premium-border-gold rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#0a0a0d] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
            </div>
            <span className="text-xs font-mono text-zinc-400 ml-2">vba_unprotect_sheet_script.bas</span>
          </div>
          <button
            onClick={() => onCopyVba(vbaCode)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-black hover:bg-amber-400 text-xs bg-zinc-900 py-1.5 px-3.5 rounded-lg border border-zinc-800 transition"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {hasCopied ? 'Tersalin' : 'Salin Kode'}
          </button>
        </div>
        <div className="p-5 font-mono text-[11px] text-zinc-250 overflow-x-auto leading-relaxed max-h-72 bg-[#050507]">
          <pre>{vbaCode}</pre>
        </div>
      </div>
    </div>
  );
};
