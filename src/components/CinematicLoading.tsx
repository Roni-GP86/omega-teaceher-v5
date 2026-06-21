import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, Shield, Cpu } from "lucide-react";

interface CinematicLoadingProps {
  title: string;
  subtitle?: string;
  progressMsg: string;
}

export const CinematicLoading: React.FC<CinematicLoadingProps> = ({
  title,
  subtitle = "Proses penataan dokumen sedang berlangsung luring",
  progressMsg,
}) => {
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);

  useEffect(() => {
    // Increment progress smoothly
    const intervalTime = 120; // ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          // Fast start
          return prev + Math.floor(Math.random() * 4) + 2;
        } else if (prev < 75) {
          // Mid-level steady progress
          return prev + Math.floor(Math.random() * 2) + 1;
        } else if (prev < 98) {
          // Crawling towards completion
          return prev + (Math.random() > 0.6 ? 1 : 0);
        }
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Update animated logs based on progressMsg
  useEffect(() => {
    if (progressMsg) {
      setLogLines((prev) => {
        const withNew = [...prev, `[${new Date().toLocaleTimeString()}] ${progressMsg}`];
        return withNew.slice(-4); // Keep last 4 logs
      });
    }
  }, [progressMsg]);

  // Calculate coordinates for the sleek circular progress ring
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center animate-fade-in relative overflow-hidden bg-zinc-950/70 rounded-3xl border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
      {/* Background ambient rainbow pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-500/5 to-amber-500/5 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Cybernetic delicate grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        {/* Glow-ring Circular Percentage Progress with Spinning Rainbow Aura */}
        <div className="relative mb-10 flex items-center justify-center">
          
          {/* 1. Outer spinning rainbow blur aura */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-xl animate-[spin_4s_linear_infinite]" />

          {/* 2. Secondary rotating sharp rainbow circle ring */}
          <div className="absolute w-40 h-40 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite]" />

          {/* 3. The SVG Progress Indicator with dual rainbow gradients */}
          <svg className="w-40 h-40 transform -rotate-90 relative z-10">
            {/* Background Ring */}
            <circle
              className="text-zinc-900/90"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
            {/* Glowing blur underlayer to create high-class glow */}
            <circle
              className="transition-all duration-300"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="url(#rainbowGradient)"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
              style={{ filter: "blur(5px)", opacity: 0.7 }}
            />
            {/* Ultra-precise foreground rainbow progress dial */}
            <circle
              className="transition-all duration-300"
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="url(#rainbowGradient)"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
            <defs>
              <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />   {/* Red */}
                <stop offset="17%" stopColor="#f97316" />  {/* Orange */}
                <stop offset="34%" stopColor="#eab308" />  {/* Yellow */}
                <stop offset="51%" stopColor="#10b981" />  {/* Green/Emerald */}
                <stop offset="68%" stopColor="#06b6d4" />  {/* Cyan */}
                <stop offset="85%" stopColor="#3b82f6" />  {/* Electric Blue */}
                <stop offset="100%" stopColor="#a855f7" /> {/* Violet/Purple */}
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Large elegant percentage text wrapped with shifting color glow */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span 
              className="text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #3b82f6, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {progress}%
            </span>
            <span className="text-[8.5px] font-mono tracking-widest text-cyan-300 font-bold uppercase mt-1 animate-pulse">
              MEMPROSES DATA
            </span>
          </div>
        </div>

        {/* Cinematic Titles with Modern Cyan accents */}
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9.5px] font-mono font-bold text-cyan-400 tracking-wider uppercase shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <Cpu className="w-3 h-3 text-cyan-400 animate-spin" />
            ENGINE_KOGNITIF_AKTIF
          </div>
          <h3 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
            {title}
          </h3>
          <p className="text-[10px] text-zinc-450 leading-relaxed max-w-sm mx-auto font-sans">
            {subtitle}
          </p>
        </div>

        {/* Cinematic Sub-Terminal Interface Ticker */}
        <div className="w-full max-w-sm bg-black/90 rounded-xl border border-zinc-900/80 p-3.5 font-mono text-[10px] text-zinc-400 text-left space-y-1.5 shadow-2xl relative">
          <div className="absolute top-2 right-3 flex items-center gap-1 text-[8px] text-zinc-500">
            <Shield className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
            SECURE LURING
          </div>
          <div className="flex items-center gap-1.5 border-b border-zinc-900/90 pb-1.5 mb-1.5 text-zinc-500">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>KONSOL LOG AKTIVITAS:</span>
          </div>
          {logLines.length === 0 ? (
            <div className="text-zinc-600 animate-pulse">[Menunggu stimulasi parameter...]</div>
          ) : (
            logLines.map((line, idx) => {
              const isLast = idx === logLines.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-1 transition-all duration-300 ${
                    isLast ? "text-cyan-300 animate-fade-in font-bold font-mono" : "text-zinc-650"
                  }`}
                >
                  <span className="text-[9px] font-black">{">"}</span>
                  <span className="break-all leading-tight">{line}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Warning safety text with flashing red/cyan alert */}
        <div className="mt-6 w-full max-w-sm bg-rose-950/45 border border-rose-600/60 rounded-xl p-3.5 flex items-start gap-3 text-left shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-[pulse_1.5s_infinite] relative overflow-hidden">
          {/* Pulsing hazard lights background badge */}
          <div className="flex-shrink-0 relative flex items-center justify-center w-6 h-6">
            <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500/20 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-900/50 border border-rose-500 items-center justify-center text-rose-300 font-bold text-xs">
              ⚠️
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-extrabold text-rose-400 font-mono tracking-wider uppercase mb-0.5">
              ALARM PERINGATAN GURU:
            </h4>
            <p className="text-[10.5px] text-rose-100 font-medium font-sans leading-relaxed">
              💡 Mohon tidak menutup jendela atau beranjak selama sistem menata struktur data Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
