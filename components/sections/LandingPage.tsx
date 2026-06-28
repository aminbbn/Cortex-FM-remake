
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
    <div className="relative flex overflow-hidden border-y border-white/5 py-6 bg-surface/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <motion.div 
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex gap-12 text-xs font-mono font-bold text-accent/50 tracking-[0.2em]">
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
        className="flex whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className="text-[12rem] md:text-[20rem] font-black leading-none text-transparent px-10"
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

const PulseVisual: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
     {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute border border-accent/20 rounded-full"
        initial={{ width: 0, height: 0, opacity: 0.8 }}
        animate={{ width: 400, height: 400, opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
      />
    ))}
    <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_20px_rgba(191,193,194,1)] z-10 animate-pulse" />
  </div>
);

const GhostScrollVisual: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1A1C1C] to-transparent z-10" />
    <motion.div 
      className="flex flex-col gap-3 p-6"
      animate={{ y: ["0%", "-50%"] }} 
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      {[...Array(2)].map((_, setIndex) => (
        <React.Fragment key={setIndex}>
          {[...Array(6)].map((_, i) => (
            <div key={`${setIndex}-${i}`} className="flex items-center gap-3">
               <div className="w-8 h-8 rounded bg-white/10 shrink-0" />
               <div className="flex-1 space-y-2">
                 <div className="h-1.5 bg-white/10 rounded w-2/3" />
                 <div className="h-1.5 bg-white/5 rounded w-1/2" />
               </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1A1C1C] to-transparent z-10" />
  </div>
);

const SpectrumVisual: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
    {[...Array(8)].map((_, i) => (
      <motion.div 
        key={i}
        className="w-4 bg-accent/40 rounded-t-sm backdrop-blur-md"
        animate={{ height: ["20%", "80%", "30%", "90%", "20%"] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          repeatType: "reverse", 
          delay: i * 0.1,
          ease: "easeInOut" 
        }}
      />
    ))}
  </div>
);

const ScannerVisual: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
     <Lock size={80} className="text-white/[0.03]" />
     <motion.div 
       className="absolute w-full h-[1px] bg-accent/50 shadow-[0_0_15px_rgba(191,193,194,0.5)]"
       animate={{ top: ["0%", "100%", "0%"] }}
       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
     />
     <div className="absolute inset-0 bg-accent/[0.02] animate-pulse" />
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
    className={`group relative overflow-hidden rounded-3xl bg-[#1A1C1C] border border-white/5 hover:border-white/10 transition-colors duration-500 ${className}`}
  >
    {visual}
    {/* Content overlay */}
    <div className="relative z-10 p-6 h-full flex flex-col justify-end pointer-events-none">
       <div className="mb-auto p-3 bg-white/5 w-fit rounded-xl border border-white/5 backdrop-blur-md">
         {icon}
       </div>
       <div className="mt-8 bg-[#1A1C1C]/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
         <h3 className="text-sm font-black uppercase tracking-[0.1em] text-white/90 mb-2">{title}</h3>
         <div className="text-xs text-text-secondary leading-relaxed font-medium">{children}</div>
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
           <div className="w-1 h-1 bg-white/50 rounded-full" />
        </div>
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
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
         <div className="absolute bottom-0 w-full h-[2px] bg-white shadow-[0_0_30px_rgba(255,255,255,1)] z-20" />
         
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
            <div className="absolute inset-0 bg-white rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.8)] animate-pulse" />
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
                    className="absolute inset-0 bg-white border border-white" 
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
            visual={<GhostScrollVisual />}
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
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
             <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/10" />
             
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
              <div className="mt-4 px-6 py-2 bg-black/60 backdrop-blur-md border border-white/20 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-white tracking-[0.3em] uppercase font-bold">
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
               <div className="mt-4 px-6 py-2 bg-black/60 backdrop-blur-md border border-white/20 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-white tracking-[0.3em] uppercase font-bold">
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
               <div className="mt-4 px-6 py-2 bg-black/60 backdrop-blur-md border border-white/20 inline-block rounded-full shadow-2xl">
                <p className="text-sm md:text-base font-mono text-white tracking-[0.3em] uppercase font-bold">
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
