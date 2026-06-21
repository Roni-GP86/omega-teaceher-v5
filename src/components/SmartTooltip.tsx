import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, Sparkles, BookOpen, Clock, Layers, Award, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type TooltipContextType =
  | "kktp-target"
  | "kktp-weight-tugas"
  | "kktp-weight-sumatif"
  | "kktp-weight-sts-sas"
  | "atp-fase"
  | "atp-mapel"
  | "atp-jp"
  | "atp-cp";

interface SmartTooltipProps {
  type: TooltipContextType;
  children: React.ReactNode;
  className?: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const TOOLTIP_DATA: Record<
  TooltipContextType,
  {
    title: string;
    regulation: string;
    content: string;
    bgColor: string;
    textColor: string;
    icon: React.ComponentType<any>;
    borderColor: string;
  }
> = {
  "kktp-target": {
    title: "Target KKTP",
    regulation: "Aturan BSKAP No. 046/2025",
    content: "Bukan lagi KKM tunggal yang kaku! Berdasarkan panduan terbaru, KKTP dirumuskan menggunakan interval nilai (misalnya: 0-40% intervensi penuh, 41-65% remedial sebagian, 66-85% layak, 86-100% mahir). Nilai tuntas dianjurkan di angka 70 secara fleksibel berdasarkan otonomi pembelajaran dan kompleksitas TP.",
    bgColor: "bg-[#0b0f19]/95",
    textColor: "text-amber-400",
    icon: Sparkles,
    borderColor: "border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.15)]",
  },
  "kktp-weight-tugas": {
    title: "Bobot Nilai Formatif",
    regulation: "Kepanduan Asesmen Kemendikdasmen",
    content: "Penilaian harian / Formatif (tugas/kuis) mengukur kemajuan proses belajar guru secara luring. Disarankan memiliki bobot proporsional (contoh: 30% - 40%) agar tidak membebani murid di atas penilaian sumatif utama.",
    bgColor: "bg-[#080f14]/95",
    textColor: "text-emerald-400",
    icon: FileText,
    borderColor: "border-emerald-500/30 shadow-[0_10px_30px_rgba(16,185,129,0.12)]",
  },
  "kktp-weight-sumatif": {
    title: "Bobot Nilai Sumatif",
    regulation: "Standar Ketuntasan Komparatif",
    content: "Asesmen Sumatif Lingkup Materi mengukur pembuktian akhir ketercapaian TP. Sesuai aturan BSKAP 046/2025, sumatif ini memegang peran krusial dengan bobot saran lebih besar (misal: 60% - 70%) untuk melahirkan potret ketuntasan murni.",
    bgColor: "bg-[#0c0d16]/95",
    textColor: "text-blue-400",
    icon: Award,
    borderColor: "border-blue-500/30 shadow-[0_10px_30px_rgba(59,130,246,0.12)]",
  },
  "kktp-weight-sts-sas": {
    title: "STS & SAS Semester",
    regulation: "Keputusan Rubrik Penilaian",
    content: "Sumatif Tengah Semester (STS) bersifat opsional untuk memberikan umpan balik interim, sedangkan Sumatif Akhir Semester (SAS) wajib diselenggarakan untuk mengukur akumulasi kompetensi secara utuh luring.",
    bgColor: "bg-[#0c0a10]/95",
    textColor: "text-purple-400",
    icon: Award,
    borderColor: "border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.12)]",
  },
  "atp-fase": {
    title: "Penentuan Fase Kelompok",
    regulation: "Regulasi Kompetensi BSKAP 046",
    content: "Sasaran pembelajaran dikonstruksi per Fase usia tumbuh kembang (SD: Fase A-C, SMP: Fase D, SMA: Fase E-F). ATP merentang fleksibel sepanjang fase agar guru leluasa melakukan pembelajaran berdiferensiasi luring.",
    bgColor: "bg-[#110c14]/95",
    textColor: "text-fuchsia-400",
    icon: Layers,
    borderColor: "border-fuchsia-500/30 shadow-[0_10px_30px_rgba(217,70,239,0.15)]",
  },
  "atp-mapel": {
    title: "Perencanaan Mapel",
    regulation: "Panduan Struktur Kurikulum",
    content: "Pilihan mata pelajaran resmi atau muatan lokal. Mengunggah atau memilih mapel tertentu akan mensinkronkan asisten cerdas AI untuk berlandaskan murni kurikulum BSKAP No. 046 Tahun 2025 yang sah.",
    bgColor: "bg-[#0b100e]/95",
    textColor: "text-teal-400",
    icon: BookOpen,
    borderColor: "border-teal-500/30 shadow-[0_10px_30px_rgba(20,184,166,0.12)]",
  },
  "atp-jp": {
    title: "Alokasi JP per Minggu",
    regulation: "Distribusi Jam Belajar Efektif",
    content: "Jumlah Jam Pelajaran harus diatur sedemikian rupa agar memenuhi kuota beban kurikulum per mata pelajaran (misalnya Matematika kelas 4 = 4 JP/Minggu) terbagi rata dalam 36 Minggu efektif luring setahun.",
    bgColor: "bg-[#13110a]/95",
    textColor: "text-amber-500",
    icon: Clock,
    borderColor: "border-amber-600/30 shadow-[0_10px_30px_rgba(245,158,11,0.12)]",
  },
  "atp-cp": {
    title: "Naskah CP BSKAP 046/2025",
    regulation: "Standar Esensial Kompetensi",
    content: "Teks Capaian Pembelajaran (CP) harus memuat utuh Kompetensi KKO Tindakan (misal: menganalisis, memecahkan) dan Lingkup Materi esensial agar rumusan butir TP dan ATP linear terpotong secara komparatif tanpa tumpang tindih.",
    bgColor: "bg-[#160a0d]/95",
    textColor: "text-rose-400",
    icon: FileText,
    borderColor: "border-rose-500/30 shadow-[0_10px_30px_rgba(244,63,94,0.15)]",
  },
};

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  type,
  children,
  className = "",
  placement = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const data = TOOLTIP_DATA[type];
  const IconComponent = data.icon;

  // Global click handler to close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPlacementClass = () => {
    switch (placement) {
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  const getArrowClass = () => {
    switch (placement) {
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 border-x-transparent border-t-transparent mt-[2px]";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-l-zinc-900 border-y-transparent border-r-transparent ml-[2px]";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-r-zinc-900 border-y-transparent border-l-transparent mr-[2px]";
      case "top":
      default:
        return "top-full left-1/2 -translate-x-1/2 border-t-zinc-900 border-x-transparent border-b-transparent mb-[2px]";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 group/tooltip ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Label or elements wrapped inside SmartTooltip */}
      <span className="cursor-help flex items-center gap-1 hover:text-zinc-200 transition-colors">
        {children}
        <HelpCircle className="w-3 h-3 text-zinc-500 hover:text-zinc-300 transition duration-150 shrink-0" />
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: placement === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: placement === "top" ? 4 : -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-9999 w-76 p-4 rounded-xl border border-zinc-900 shadow-2xl backdrop-blur-md ${data.bgColor} ${data.borderColor} ${getPlacementClass()} pointer-events-none md:pointer-events-auto`}
          >
            {/* Header segment card */}
            <div className="flex items-start gap-2.5 border-b border-zinc-900 pb-2 mb-2">
              <div className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 ${data.textColor}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <h5 className="font-sans font-extrabold text-[11px] text-zinc-100 uppercase tracking-wider leading-none">
                  {data.title}
                </h5>
                <span className="text-[9px] font-mono font-semibold text-zinc-500 mt-0.5 block leading-none">
                  {data.regulation}
                </span>
              </div>
            </div>

            {/* Content paragraph */}
            <p className="text-[10.5px] font-sans text-zinc-300 leading-relaxed text-left font-normal whitespace-normal select-text">
              {data.content}
            </p>

            {/* Glowing Accent line inside tooltip bottom */}
            <div className="absolute bottom-0 inset-x-5 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffd000] to-transparent opacity-35" />
            
            {/* Tooltip Arrow */}
            <div className={`absolute w-0 h-0 border-4 ${getArrowClass()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
