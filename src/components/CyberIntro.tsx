import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Zap, Radio, ChevronRight, Play } from 'lucide-react';

interface CyberIntroProps {
  onComplete: () => void;
}

export function CyberIntro({ onComplete }: CyberIntroProps) {
  const TOTAL_DURATION_SECONDS = 5; // 5 detik (5 seconds)
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SECONDS);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isGlitched, setIsGlitched] = useState(false);

  // Dynamic log entries based on seconds remaining scaled to 300s
  const bootLogs = [
    { time: TOTAL_DURATION_SECONDS, msg: "⚡ INITIALIZING OMEGA TEACHER ENGINE v3.5..." },
    { time: TOTAL_DURATION_SECONDS * 0.88, msg: "📡 ESTABLISHING SECURE LURING LOCAL SANDBOX..." },
    { time: TOTAL_DURATION_SECONDS * 0.78, msg: "🔑 LOADING AES-256 DECRYPTION ALGORITHMS... OK" },
    { time: TOTAL_DURATION_SECONDS * 0.68, msg: "🧠 INJECTING ACADEMIC ENGINE INLINE (BSKAP 046/2025)..." },
    { time: TOTAL_DURATION_SECONDS * 0.55, msg: "📚 SYNCING MATRIKULATIF CAPAIAN PEMBELAJARAN PRESETS... VERIFIED" },
    { time: TOTAL_DURATION_SECONDS * 0.42, msg: "📄 INLINE PDF BUFFER SETTINGS OPTIMIZED" },
    { time: TOTAL_DURATION_SECONDS * 0.31, msg: "🛡️ DIRECT LOCAL IN-BROWSER PARSING SANITIZER ACTIVE" },
    { time: TOTAL_DURATION_SECONDS * 0.21, msg: "💻 SYSTEM ONLINE. LAUNCHING MULTI-MATRIX CONSOLE..." },
    { time: TOTAL_DURATION_SECONDS * 0.07, msg: "🚀 PREPARING FINAL INTERFACE DISPATCH..." }
  ];

  useEffect(() => {
    // Timer interval
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    // Progress percentage loader
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (TOTAL_DURATION_SECONDS * 10)); // 3000 steps of 100ms
      });
    }, 100);

    // Glitch trigger generator
    const glitchInterval = setInterval(() => {
      setIsGlitched(true);
      setTimeout(() => setIsGlitched(false), 150);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  // Safe callback transition outside of reducer / render loop
  useEffect(() => {
    if (timeLeft === 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onComplete]);

  // Feed logs dynamically based on countdown time
  useEffect(() => {
    const elapsed = TOTAL_DURATION_SECONDS - timeLeft;
    const currentLogs = bootLogs
      .filter(log => (TOTAL_DURATION_SECONDS - log.time) <= elapsed)
      .map(log => `[${(TOTAL_DURATION_SECONDS - log.time).toFixed(1)}s] ${log.msg}`);
    
    setLogs(currentLogs);
  }, [timeLeft]);

  const displaySeconds = Math.ceil(timeLeft);

  return (
    <div className="fixed inset-0 bg-[#020204] z-[9999] overflow-hidden flex flex-col items-center justify-between p-6 select-none font-mono">
      
      {/* 1. FUTURISTIC MATRIX BACKGROUND & SCANLINES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.012)_1px,transparent_1px),linear-gradient(to_right,rgba(6,182,212,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Laser Scanning Line */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 via-amber-400 via-blue-500 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5),0_0_25px_rgba(245,158,11,0.3)] pointer-events-none"
      />

      {/* Cybernetic glowing background circles */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/[0.045] rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-blue-600/[0.04] rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-0 left-10 w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* 2. TOP AUDIO & TELEMETRY HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 block leading-none">CORE ENGINE ACTIVE:</span>
            <span className="text-xs text-zinc-300 font-bold tracking-wider">CYBER_HYDRA_MASTER_V1</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>DECRYPT_SANDBOX: <strong className="text-cyan-400">ONLINE</strong></span>
          </div>
          <button 
            onClick={() => setTimeout(onComplete, 0)}
            className="px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/25 text-cyan-300 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            Lewati Intro <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* 3. CENTER: SPECTACULAR CHRONO INTRO SEQUENCE */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-12 max-w-4xl mx-auto w-full z-10">
        
        {/* Decorative corner brackets around central visual module */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-zinc-900 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-zinc-900 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-zinc-900 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-zinc-900 pointer-events-none" />

        {/* Dynamic Equalizer simulation on background */}
        <div className="absolute inset-0 flex items-center justify-around opacity-15 px-10 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: ["10%", "90%", "20%", "70%", "30%", "10%"] }}
              transition={{
                duration: 2 + (i % 3) * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15
              }}
              className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-cyan-500/40' : 'bg-amber-500/30'}`}
            />
          ))}
        </div>

        {/* Countdown Ring Gauge surrounding the skull */}
        <div className="relative mb-8 flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="66"
              className="stroke-cyan-950/40 fill-none"
              strokeWidth="4"
            />
            {/* Ambient Cyan glow back-ring */}
            <circle
              cx="72"
              cy="72"
              r="66"
              className="stroke-cyan-500/10 fill-none"
              strokeWidth="10"
              style={{ filter: "blur(4px)" }}
            />
            <motion.circle
              cx="72"
              cy="72"
              r="66"
              className="stroke-cyan-400 fill-none"
              strokeWidth="4"
              strokeDasharray={414}
              animate={{ strokeDashoffset: 414 - (414 * progress) / 100 }}
              transition={{ ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))" }}
            />
            {/* Inner Gold ring gauge tracking overall speed */}
            <motion.circle
              cx="72"
              cy="72"
              r="58"
              className="stroke-amber-500/60 fill-none"
              strokeWidth="2"
              strokeDasharray={364}
              animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
              transition={{ ease: "linear" }}
            />
          </svg>

          {/* Central Countdown Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-[9px] text-cyan-400/80 tracking-widest font-mono uppercase mb-1 font-semibold">LAUNCHING</span>
            <span className="text-4xl font-extrabold text-white tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">{displaySeconds}s</span>
            <span className="text-[9px] text-zinc-500 font-mono mt-1 uppercase tracking-wide">SECURE PLATFORM</span>
          </div>
        </div>

        {/* IMMERSIVE CYBER CRYPT GLITCH CHAMPION TITLE */}
        <div className="relative text-center flex flex-col items-center justify-center">
          {/* Super Premium Radial Backlight Flare */}
          <div className="absolute w-[280px] sm:w-[480px] h-[100px] sm:h-[180px] bg-gradient-to-r from-cyan-500/10 via-amber-500/15 to-blue-500/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute w-[200px] h-[60px] bg-yellow-400/10 rounded-full blur-[40px] pointer-events-none mix-blend-color-dodge animate-ping" style={{ animationDuration: '5s' }} />

          <h2 
            className={`text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.1em] sm:tracking-[0.15em] text-white select-none relative font-display text-center whitespace-normal sm:whitespace-nowrap ${
              isGlitched ? "animate-pulse scale-[1.01]" : ""
            }`}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              background: 'linear-gradient(135deg, #ffffff 20%, #ffedd5 50%, #e0f2fe 80%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: isGlitched 
                ? '0 0 40px rgba(245, 158, 11, 0.95), 0 0 20px rgba(6, 182, 212, 0.8), -3px 0px 0px rgba(6, 182, 212, 0.98), 3px 0px 0px rgba(245, 158, 11, 0.98)' 
                : '0 0 50px rgba(245, 158, 11, 0.55), 0 0 25px rgba(6, 182, 212, 0.35), 0px 0px 12px rgba(255, 255, 255, 0.45)'
            }}
          >
            OMEGA TEACHER ENGINE
          </h2>

          {/* Glitched scanning bar beneath title */}
          <div className="mt-4 flex items-center justify-center gap-1.5 w-full">
            <span className="h-1.5 w-12 bg-cyan-500 rounded-sm inline-block shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse" />
            <span className="h-1.5 w-4 bg-zinc-800 rounded-sm inline-block" />
            <span className="h-1.5 w-1.5 bg-zinc-850 rounded-sm inline-block" />
            <span className="h-1.5 w-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-500 rounded-sm inline-block shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse" />
          </div>

          <p className="text-[10px] md:text-xs text-amber-300 uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] font-mono mt-5 font-bold animate-pulse text-center" style={{ textShadow: '0 0 10px rgba(245,158,11,0.5)' }}>
            AUTOMATED CURRICULUM INTELLIGENCE SYSTEM
          </p>
        </div>

      </div>

      {/* 4. BOTTOM INTERACTIVE TERMINAL LOG DISPLAY */}
      <div className="max-w-4xl mx-auto w-full relative z-10">
        
        {/* Animated Cyber Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              SISTEM_BYPASS_BOOTLOADER_DECRYPT: {Math.round(progress)}%
            </span>
            <span className="text-cyan-400 font-semibold text-[10px]">DECRYPTOR_CORE_ONLINE</span>
          </div>
          <div className="w-full bg-[#050508] border border-zinc-900 p-0.5 rounded-lg h-3">
            <motion.div 
              className="bg-gradient-to-r from-cyan-500 via-blue-600 via-amber-500 to-yellow-400 h-full rounded-md shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Streamed dynamic logs showing bypass actions */}
        <div className="h-28 bg-black/60 border border-zinc-900 rounded-xl p-3 overflow-y-auto font-mono text-[9.5px] leading-relaxed text-left text-zinc-500 scrollbar-thin scrollbar-thumb-zinc-900">
          <AnimatePresence>
            {logs.slice(-5).map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${index === logs.slice(-5).length - 1 ? 'text-cyan-400 font-semibold' : 'text-zinc-500'}`}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="text-zinc-700 animate-pulse">Memuat modul BIOS luring...</div>
          )}
        </div>

        {/* Privacy verification details */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-[9px] text-zinc-600 gap-2 border-t border-zinc-900/40 pt-3">
          <span className="uppercase">AES STATE: ENCRYPTED_SANDBOX | DATA SECURITY: LOCAL_BROWSING</span>
          <span className="text-emerald-500/80 uppercase font-bold">● PRIVATING DIJAMIN 100% DI BROWSER</span>
        </div>

      </div>

    </div>
  );
}
