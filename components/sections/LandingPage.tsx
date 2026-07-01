
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, MotionValue } from 'framer-motion';
import { 
  Mic, ArrowRight, Activity, Cpu, Fingerprint, 
  Waves, Layers, ShieldCheck, Zap, Globe, Database, 
  ChevronDown, Disc, Lock, Terminal, Twitter, Github
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingPageProps {
  onEnter: () => void;
}

// --- SUB-COMPONENTS ---

const Marquee: React.FC = () => {
  return (
    <div className="relative flex overflow-hidden border-y border-white/5 py-6 bg-surface/30 backdrop-blur-sm w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <motion.div 
        className="flex whitespace-nowrap min-w-fit"
        animate={{ x: "-50%" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex gap-12 pr-12 text-xs font-mono font-bold text-accent/50 tracking-[0.2em]">
            <span>SPECTRAL GATING</span>
            <span>•</span>
            <span>LIBROSA ENGINE</span>
            <span>•</span>
            <span>24-BIT AUDIO</span>
            <span>•</span>
            <span>VECTOR EMBEDDINGS</span>
            <span>•</span>
            <span>REAL-TIME ANALYSIS</span>
            <span>•</span>
            <span>NEURAL NETWORKS</span>
            <span>•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const GiantMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-transparent pointer-events-none select-none z-10 opacity-30 mix-blend-overlay">
      <motion.div 
        className="flex whitespace-nowrap min-w-fit"
        animate={{ x: "-50%" }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className="text-[12rem] md:text-[20rem] font-black leading-none text-transparent pr-20"
            style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.4)" }}
          >
            NEURAL ARCHITECTURE // ATOMIC ANALYSIS // SONIC EVOLUTION //
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- LIVE DASHBOARD VISUALS ---

const PulseVisual: React.FC = () => {
  const generateOrbitKeyframes = (rx: number, ry: number, pointsCount = 32, startAngleOffset = 0) => {
    const xValues = [];
    const yValues = [];
    for (let i = 0; i <= pointsCount; i++) {
      const angle = startAngleOffset + (i / pointsCount) * 2 * Math.PI;
      xValues.push(200 + rx * Math.cos(angle));
      yValues.push(110 + ry * Math.sin(angle));
    }
    return { xValues, yValues };
  };

  const orbit1 = generateOrbitKeyframes(140, 55, 32, 0);
  const orbit2 = generateOrbitKeyframes(90, 35, 32, Math.PI * 0.65);
  const orbit3 = generateOrbitKeyframes(50, 20, 32, Math.PI * 1.3);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {/* Background soft ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
      
      <svg viewBox="0 0 400 220" className="w-full h-full max-w-[480px] opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Telemetry / Grid elements */}
        <line x1="40" y1="110" x2="360" y2="110" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        <line x1="200" y1="20" x2="200" y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

        {/* 2. Concentric Orbit Lines (3D tilted perspective) */}
        <ellipse 
          cx="200" 
          cy="110" 
          rx="140" 
          ry="55" 
          fill="none" 
          stroke="rgba(255,255,255,0.04)" 
          strokeWidth="1" 
          strokeDasharray="4 6" 
        />
        <ellipse 
          cx="200" 
          cy="110" 
          rx="90" 
          ry="35" 
          fill="none" 
          stroke="rgba(255,255,255,0.06)" 
          strokeWidth="1" 
          strokeDasharray="3 4" 
        />
        <ellipse 
          cx="200" 
          cy="110" 
          rx="50" 
          ry="20" 
          fill="none" 
          stroke="var(--color-accent)" 
          strokeWidth="1" 
          strokeOpacity="0.12"
          strokeDasharray="2 2" 
        />

        {/* 3. Radial Data Beams / Connecting Streams */}
        <line x1="200" y1="110" x2="110" y2="70" stroke="var(--color-accent)" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="2 4" />
        <line x1="200" y1="110" x2="290" y2="150" stroke="var(--color-accent)" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="2 4" />
        
        {/* Dynamic connection line to show active sync stream */}
        <motion.line
          x1="200"
          y1="110"
          x2="200"
          y2="110"
          animate={{
            x2: [200, 60, 200],
            y2: [110, 110, 110],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="3 3"
        />

        {/* 4. Active Traveling Sync Signals (Data packets orbiting core) */}
        {/* Orbit 1 Node */}
        <g>
          <motion.circle
            r="4"
            fill="var(--color-accent)"
            animate={{ cx: orbit1.xValues, cy: orbit1.yValues }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 6px var(--color-accent))" }}
          />
          <motion.circle
            r="12"
            fill="var(--color-accent)"
            animate={{ 
              cx: orbit1.xValues, 
              cy: orbit1.yValues,
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{ 
              cx: { duration: 10, repeat: Infinity, ease: "linear" },
              cy: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </g>

        {/* Orbit 2 Node */}
        <g>
          <motion.circle
            r="3.5"
            fill="var(--color-accent)"
            animate={{ cx: orbit2.xValues, cy: orbit2.yValues }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 5px var(--color-accent))" }}
            opacity="0.9"
          />
          <motion.circle
            r="9"
            fill="var(--color-accent)"
            animate={{ 
              cx: orbit2.xValues, 
              cy: orbit2.yValues,
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              cx: { duration: 7, repeat: Infinity, ease: "linear" },
              cy: { duration: 7, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </g>

        {/* Orbit 3 Node */}
        <g>
          <motion.circle
            r="3"
            fill="var(--color-accent)"
            animate={{ cx: orbit3.xValues, cy: orbit3.yValues }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 4px var(--color-accent))" }}
            opacity="0.85"
          />
        </g>

        {/* 5. Central Vault Core Hub (Focal point of sync) */}
        <motion.circle
          cx="200"
          cy="110"
          r="24"
          fill="url(#hubGlow)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle
          cx="200"
          cy="110"
          r="5.5"
          fill="var(--color-accent)"
          style={{ filter: "drop-shadow(0 0 8px var(--color-accent))" }}
        />
        <motion.circle
          cx="200"
          cy="110"
          r="14"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          animate={{ scale: [0.8, 1.8], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};


const DailyMixVisual: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
    <svg viewBox="0 0 400 200" className="absolute w-[200%] h-full max-w-none mix-blend-screen opacity-50" preserveAspectRatio="none">
      {[...Array(3)].map((_, i) => {
        const amp1 = 20 + i * 15;
        const amp2 = -20 - i * 15;
        return (
          <motion.path
            key={i}
            fill="transparent"
            stroke="var(--color-accent)"
            strokeWidth={1.5 + i * 0.5}
            strokeOpacity={0.3 + i * 0.2}
            animate={{
              d: [
                `M 0 100 Q 100 ${100 - amp1}, 200 100 T 400 100 T 600 100 T 800 100`,
                `M 0 100 Q 100 ${100 - amp2}, 200 100 T 400 100 T 600 100 T 800 100`,
                `M 0 100 Q 100 ${100 - amp1}, 200 100 T 400 100 T 600 100 T 800 100`
              ],
              x: [0, -400]
            }}
            transition={{
              d: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 3 + i * 1.5, repeat: Infinity, ease: "linear" }
            }}
          />
        );
      })}
    </svg>
    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
  </div>
);

const SpectrumVisual: React.FC = () => (
  <div className="absolute inset-0 flex items-end justify-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pb-20">
    {[...Array(12)].map((_, i) => {
      const maxH = 45 + Math.sin(i * 0.8) * 25 + Math.cos(i * 1.5) * 15;
      const minH = 15 + Math.sin(i * 0.5) * 5;
      
      return (
        <motion.div 
          key={i}
          className="w-3 bg-accent rounded-t-sm opacity-60"
          style={{ boxShadow: "0 0 10px var(--color-accent)" }}
          animate={{ height: [`${minH}%`, `${maxH}%`, `${minH}%`] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: i * 0.12,
            ease: "easeInOut" 
          }}
        />
      );
    })}
  </div>
);

const ScannerVisual: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
     <Lock size={60} className="text-accent/30 mb-4" />
     <motion.div 
       className="absolute w-full h-[2px] bg-accent shadow-[0_0_20px_var(--color-accent)]"
       animate={{ top: ["0%", "100%", "0%"] }}
       transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
     />
     {/* Grid background to make scanning look cool */}
     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
  </div>
);

const BentoCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  title: string;
  icon?: React.ReactNode;
  delay?: number;
  visual?: React.ReactNode;
}> = ({ children, className = "", title, icon, delay = 0, visual }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative overflow-hidden rounded-3xl bg-surface border border-white/10 hover:border-white/20 transition-all duration-500 shadow-xl ${className}`}
  >
    {visual}
    {/* Content overlay */}
    <div className="relative z-10 p-6 h-full flex flex-col justify-end pointer-events-none">
       <div className="mb-auto p-3 bg-white/10 w-fit rounded-xl border border-white/10 backdrop-blur-md text-accent">
          {icon}
       </div>
       <div className="mt-8 bg-black/25 dark:bg-black/45 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg">
          <h3 className="text-sm font-black uppercase tracking-[0.1em] text-white/95 mb-2">{title}</h3>
          <div className="text-xs text-text-secondary leading-relaxed font-semibold">{children}</div>
       </div>
    </div>
    
    {/* Hover glow */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
  </motion.div>
);

const CubeFace: React.FC<{ transform: string; opacity?: number }> = ({ transform, opacity = 1 }) => (
  <div 
      className="absolute inset-0 border border-white/10 bg-black/40 backdrop-blur-[4px] shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] overflow-hidden" 
      style={{ transform, opacity }} 
  >
      {/* Structural Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
           backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
           backgroundSize: '30px 30px'
        }}
      />
      
      {/* Machined Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-sm" />

      {/* Center Detail */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
           <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
        </div>
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      </div>
      
      {/* ENHANCED SCANNER EFFECT (Infinite Loop, EaseInOut) */}
      <motion.div 
        className="absolute left-0 right-0 h-full pointer-events-none"
        initial={{ top: '-100%' }}
        animate={{ top: '100%' }}
        transition={{ 
          duration: 3.5, 
          repeat: Infinity, 
          ease: "easeInOut",
        }}
      >
         {/* The bright scan line */}
         <div 
           className="absolute bottom-0 w-full h-[2px] bg-accent z-20" 
           style={{ boxShadow: '0 0 30px var(--color-accent)' }}
         />
         
         {/* The light ray trail */}
         <div className="absolute bottom-[2px] w-full h-40 bg-gradient-to-t from-accent/30 to-transparent z-10" />
      </motion.div>
  </div>
);

const Hypercube: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const rotateX = useTransform(progress, [0, 1], [0, 360]);
  const rotateY = useTransform(progress, [0, 1], [0, 180]);
  
  return (
    <div className="perspective-[1200px] w-full h-full flex items-center justify-center z-10">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[300px] h-[300px]"
      >
        {/* --- OUTER SHELL (300px) --- */}
        {[
            { transform: "translateZ(150px)" }, 
            { transform: "rotateY(180deg) translateZ(150px)" }, 
            { transform: "rotateY(90deg) translateZ(150px)" }, 
            { transform: "rotateY(-90deg) translateZ(150px)" }, 
            { transform: "rotateX(90deg) translateZ(150px)" }, 
            { transform: "rotateX(-90deg) translateZ(150px)" }, 
        ].map((style, i) => (
            <CubeFace key={`outer-${i}`} transform={style.transform} />
        ))}

        {/* --- MIDDLE SHELL (200px - Wireframe) --- */}
        <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -ml-[100px] -mt-[100px] pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
             {[
                { transform: "translateZ(100px)" },
                { transform: "rotateY(180deg) translateZ(100px)" },
                { transform: "rotateY(90deg) translateZ(100px)" },
                { transform: "rotateY(-90deg) translateZ(100px)" },
                { transform: "rotateX(90deg) translateZ(100px)" },
                { transform: "rotateX(-90deg) translateZ(100px)" },
            ].map((style, i) => (
                <div 
                    key={`mid-${i}`}
                    className="absolute inset-0 border border-dashed border-white/20 opacity-50" 
                    style={style} 
                />
            ))}
        </div>

        {/* --- INNER CORE (100px - Solid Light) --- */}
        <div className="absolute top-1/2 left-1/2 w-[80px] h-[80px] -ml-[40px] -mt-[40px]" style={{ transformStyle: "preserve-3d" }}>
            <div 
              className="absolute inset-0 bg-accent rounded-lg animate-pulse" 
              style={{ boxShadow: '0 0 100px var(--color-accent)' }}
            />
             {[
                { transform: "translateZ(40px)" },
                { transform: "rotateY(180deg) translateZ(40px)" },
                { transform: "rotateY(90deg) translateZ(40px)" },
                { transform: "rotateY(-90deg) translateZ(40px)" },
                { transform: "rotateX(90deg) translateZ(40px)" },
                { transform: "rotateX(-90deg) translateZ(40px)" },
            ].map((style, i) => (
                <div 
                    key={`inner-${i}`}
                    className="absolute inset-0 bg-accent border border-accent opacity-90" 
                    style={style} 
                />
            ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  
  // Main scroll tracking for the container
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax & Opacity transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Hero Text Parallax
  const titleXLeft = useTransform(scrollYProgress, [0, 0.3], [0, -200]);
  const titleXRight = useTransform(scrollYProgress, [0, 0.3], [0, 200]);

  // Core Section Transforms (Extended for 400vh)
  // CRITICAL FIX: Added `container: containerRef` to track the custom scroll container instead of window
  const { scrollYProgress: coreProgress } = useScroll({
    target: coreRef,
    container: containerRef,
    offset: ["start start", "end end"]
  });

  // Precise timing for 3 stages (High Visibility Ranges)
  // Step 1: 0 - 0.35
  const step1Opacity = useTransform(coreProgress, [0, 0.05, 0.25, 0.35], [0, 1, 1, 0]);
  const step1Scale = useTransform(coreProgress, [0, 0.05, 0.25, 0.35], [0.95, 1, 1, 1.05]);
  const step1Y = useTransform(coreProgress, [0, 0.35], [20, -20]);
  
  // Step 2: 0.35 - 0.70
  const step2Opacity = useTransform(coreProgress, [0.35, 0.40, 0.60, 0.70], [0, 1, 1, 0]);
  const step2Scale = useTransform(coreProgress, [0.35, 0.40, 0.60, 0.70], [0.95, 1, 1, 1.05]);
  const step2Y = useTransform(coreProgress, [0.35, 0.70], [20, -20]);

  // Step 3: 0.70 - 1.0
  const step3Opacity = useTransform(coreProgress, [0.70, 0.75, 0.95, 1], [0, 1, 1, 0]);
  const step3Scale = useTransform(coreProgress, [0.70, 0.75, 0.95, 1], [0.95, 1, 1, 1.05]);
  const step3Y = useTransform(coreProgress, [0.70, 1], [20, -20]);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full bg-transparent text-text-primary selection:bg-accent selection:text-background font-sans overflow-y-auto overflow-x-hidden"
    >
      
      {/* Progress Bar */}
      <motion.div style={{ scaleX: smoothProgress }} className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[90] px-8 py-6 flex justify-between items-center bg-background/0 backdrop-blur-sm border-b border-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-[10px] flex items-center justify-center shadow-[0_0_15px_rgba(191,193,194,0.2)]">
            <Mic size={16} className="text-background" />
          </div>
          <span className="text-sm font-black tracking-tighter uppercase hidden sm:block">Cortex FM</span>
        </div>
        <Button size="sm" onClick={onEnter} className="shadow-2xl shadow-accent/20">Launch App</Button>
      </nav>

      {/* --- SECTION A: HERO --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y: bgY, opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
          
          {/* Base Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/5 rounded-full blur-[120px] animate-pulse duration-[4s]" />
          
          {/* Moving Fog (Indigo/Purple drift) */}
          <motion.div 
            animate={{ 
                x: [-50, 50, -50],
                y: [-20, 20, -20],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen"
          />
          <motion.div 
            animate={{ 
                x: [50, -50, 50],
                y: [20, -20, 20],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen"
          />

          {/* Tech Grid Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }} 
          />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0D0D0F_100%)]" />
        </motion.div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex justify-center"
          >
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              System Version 4.0.2 Live
            </span>
          </motion.div>

          {/* KINETIC TYPOGRAPHY */}
          <div className="w-full flex flex-col items-center justify-center">
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full pointer-events-none select-none"
            >
                <motion.span 
                  style={{ x: titleXLeft }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-[15vw] md:text-[16vw] font-black tracking-tighter leading-[0.75] text-transparent bg-clip-text bg-[linear-gradient(90deg,#FFF_0%,#888_20%,#FFF_40%,#888_60%,#FFF_80%,#888_100%)] bg-[length:200%_auto] whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  SONIC
                </motion.span>
                <motion.span 
                  style={{ x: titleXRight }}
                  animate={{ backgroundPosition: ["100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-[15vw] md:text-[16vw] font-black tracking-tighter leading-[0.75] text-transparent bg-clip-text bg-[linear-gradient(90deg,#FFF_0%,#888_20%,#FFF_40%,#888_60%,#FFF_80%,#888_100%)] bg-[length:200%_auto] whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  EVOLUTION
                </motion.span>
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-16 text-lg md:text-xl text-text-secondary max-w-xl mx-auto font-medium leading-relaxed tracking-normal text-center"
          >
            The ultimate personal music vault. Cortex FM deconstructs your collection to curate the impossible, every single day.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="text-text-secondary/50" />
          </motion.div>
        </motion.div>

        {/* HUD Status Bar */}
        <div className="absolute bottom-6 w-full px-12 flex justify-between items-end z-20 pointer-events-none mix-blend-plus-lighter">
            <div className="flex gap-8 text-[10px] font-mono text-accent/60 font-bold tracking-[0.2em] uppercase">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(48,209,88,0.8)]" />
                    <span>SYS: ONLINE</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                     <Activity size={10} />
                     <span>LATENCY: 4MS</span>
                </div>
            </div>
            <div className="text-[10px] font-mono text-accent/60 font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                 <div className="w-2 h-2 border border-accent/40 rounded-sm animate-spin" />
                 V.4.0.2
            </div>
        </div>
      </section>

      {/* --- SECTION B: CARDS --- */}
      <section className="relative z-20 px-8 max-w-[1400px] mx-auto pb-32 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {/* Card 1: Universal Sync (Large) */}
          <BentoCard 
            title="Universal Sync" 
            icon={<Globe size={18} />} 
            className="md:col-span-2" 
            delay={0.1}
            visual={<PulseVisual />}
          >
            Seamlessly bridge your local files with the cloud. Real-time node synchronization active.
          </BentoCard>

          {/* Card 2: The Daily Mix (Tall) */}
          <BentoCard 
            title="The Daily Mix" 
            icon={<Activity size={18} />} 
            className="md:row-span-2" 
            delay={0.2}
            visual={<DailyMixVisual />}
          >
            Hyper-personalized flows adapting to your circadian rhythm.
          </BentoCard>

          {/* Card 3: Lossless Audio */}
          <BentoCard 
            title="Lossless Audio" 
            icon={<Waves size={18} />} 
            delay={0.3}
            visual={<SpectrumVisual />}
          >
            Native FLAC support with 24-bit depth processing.
          </BentoCard>

          {/* Card 4: Privacy Locked */}
          <BentoCard 
            title="Privacy Locked" 
            icon={<ShieldCheck size={18} />} 
            delay={0.4}
            visual={<ScannerVisual />}
          >
            Your data never leaves the vault. Local analysis only.
          </BentoCard>
        </div>
      </section>

      {/* --- SECTION D: TECH MARQUEE --- */}
      <section className="py-20">
        <Marquee />
      </section>

      {/* --- SECTION C: CENTRAL CORE (HYPERCUBE) - REBUILT --- */}
      <section ref={coreRef} className="relative h-[400vh] bg-[#0D0D0F]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* 1. Background Detail: Crosshairs & Grid */}
          <div className="absolute inset-0 pointer-events-none">
             {/* Crosshairs */}
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/20" />
             <div className="absolute left-1/2 top-0 h-full w-[1px] bg-accent/20" />
             
             {/* Subtle Radial Gradient */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          </div>

          {/* 2. The 3D Hypercube */}
          <Hypercube progress={coreProgress} />

          {/* 3. Scrolling Titles (Absolute Center, High Visibility, Z-50) */}
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            
            {/* Step 01 */}
            <motion.div 
              style={{ opacity: step1Opacity, scale: step1Scale, y: step1Y }} 
              className="absolute text-center w-full"
            >
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
                01. INGESTION
              </h2>
              <div className="mt-4 px-6 py-2 bg-black/75 backdrop-blur-md border border-accent/35 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-accent tracking-[0.3em] uppercase font-bold">
                  RAW DATA ACQUISITION
                </p>
              </div>
            </motion.div>

            {/* Step 02 */}
            <motion.div 
              style={{ opacity: step2Opacity, scale: step2Scale, y: step2Y }} 
              className="absolute text-center w-full"
            >
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
                02. DECODE
              </h2>
               <div className="mt-4 px-6 py-2 bg-black/75 backdrop-blur-md border border-accent/35 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-accent tracking-[0.3em] uppercase font-bold">
                  VECTOR ANALYSIS
                </p>
              </div>
            </motion.div>

            {/* Step 03 */}
            <motion.div 
              style={{ opacity: step3Opacity, scale: step3Scale, y: step3Y }} 
              className="absolute text-center w-full"
            >
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
                03. SYNTHESIS
              </h2>
               <div className="mt-4 px-6 py-2 bg-black/75 backdrop-blur-md border border-accent/35 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-accent tracking-[0.3em] uppercase font-bold">
                  ADAPTIVE FLOW
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* --- SECTION E: PHILOSOPHY GRID (THE CORTEX STANDARD) --- */}
      <section className="relative py-40 bg-background z-20">
        <div className="max-w-[1400px] mx-auto px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24 border-b border-white/10 pb-8 flex items-end justify-between"
            >
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">
                  The Cortex Standard
                </h2>
                <span className="hidden md:block text-xs font-mono text-accent/40 uppercase tracking-widest mb-2">
                    Manifesto v.1.0
                </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  {
                    title: "ANTI-ALGORITHM",
                    body: "Mainstream streaming traps you in echo chambers. Cortex breaks the loop, prioritizing your taste over engagement metrics."
                  },
                  {
                    title: "SONIC SOVEREIGNTY",
                    body: "You don't rent your music here. You own it. Your library is a permanent vault, not a temporary license."
                  },
                  {
                    title: "UNCOMPRESSED TRUTH",
                    body: "Hear the track exactly as the artist intended. Bit-perfect playback for the discerning ear."
                  }
                ].map((item, i) => (
                    <div key={i} className="group relative pl-8 cursor-default">
                        {/* Vertical Line Interaction */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 group-hover:bg-accent transition-colors duration-500">
                             <div className="absolute inset-0 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                        </div>

                        <h3 className="text-3xl font-black text-zinc-500 group-hover:text-white transition-colors duration-500 mb-6 tracking-tight uppercase">
                            {item.title}
                        </h3>
                        <p className="text-zinc-400 group-hover:text-white/90 leading-relaxed transition-colors duration-500 text-lg font-medium">
                            {item.body}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- NEW GIANT MARQUEE SECTION --- */}
      <section className="py-0">
        <GiantMarquee />
      </section>

      {/* --- THE PORTAL (CTA) --- */}
      <section className="relative h-[60vh] w-full flex flex-col items-center justify-center bg-background border-t border-white/5">
        <div className="flex flex-col items-center gap-8 z-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em]"
            >
              Ready to reclaim your library?
            </motion.span>
            
            <button 
              onClick={onEnter}
              className="group relative w-80 h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-700 ease-out hover:bg-white hover:scale-105 hover:shadow-[0_0_100px_rgba(255,255,255,0.3)] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
               <span className="text-sm font-black text-accent tracking-[0.3em] group-hover:text-black transition-colors duration-500 flex items-center gap-3">
                 ENTER THE VAULT <ArrowRight className="w-4 h-4" />
               </span>
            </button>
        </div>
      </section>

      {/* --- NEW STRUCTURED FOOTER --- */}
      <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                {/* Col 1: Brand */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                         <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                            <Mic size={14} className="text-black" />
                         </div>
                         <span className="text-xl font-black tracking-tighter text-white">CORTEX FM</span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                        Engineered for the future of sound. <br />
                        Your personal audio vault, evolved.
                    </p>
                </div>

                {/* Col 2: Product */}
                <div className="flex flex-col gap-6">
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Product</h4>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Download</a>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Changelog</a>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Roadmap</a>
                </div>

                {/* Col 3: Legal */}
                <div className="flex flex-col gap-6">
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Legal</h4>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</a>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</a>
                    <a href="#" className="text-zinc-500 hover:text-white text-sm font-medium transition-colors">EULA</a>
                </div>

                {/* Col 4: Social */}
                 <div className="flex flex-col gap-6">
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Social</h4>
                    <div className="flex gap-6">
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github size={20} /></a>
                         {/* Using Disc for Discord as generic placeholder if Discord icon unavailable */}
                         <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Disc size={20} /></a> 
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">© 2025 Cortex FM. All Systems Operational.</span>
                <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">System Normal</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};
