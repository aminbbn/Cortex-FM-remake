
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Mic, ArrowRight, Activity, Cpu, Fingerprint, 
  Waves, Layers, ShieldCheck, Zap, Globe, Database, 
  ChevronDown, Disc
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

const BentoCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  title: string;
  icon?: React.ReactNode;
  delay?: number;
}> = ({ children, className = "", title, icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:border-accent/30 transition-colors duration-500 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 text-accent/70">
        {icon}
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax & Opacity transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  // Scrollytelling State
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full bg-background text-text-primary selection:bg-accent selection:text-background font-sans overflow-y-auto overflow-x-hidden"
    >
      
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/5 rounded-full blur-[120px] animate-pulse duration-[4s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0D0D0F_100%)]" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              System Version 4.0.2 Live
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40"
          >
            SONIC<br />EVOLUTION
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto font-medium leading-relaxed"
          >
            The ultimate personal music vault. Cortex FM deconstructs your collection to curate the impossible, every single day.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary/50">Scroll to Explore</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="text-text-secondary/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- SECTION B: NEURAL PROCESS (SCROLLYTELLING) --- */}
      <section className="relative w-full bg-background py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left Column: Scrolling Text */}
            <div className="flex flex-col gap-[50vh] py-[20vh]">
              {[
                { title: "Ingestion", desc: "Drag and drop your audio files. Our secure vault accepts FLAC, WAV, and MP3, preserving every bit of data." },
                { title: "Decomposition", desc: "The engine breaks down tracks into 4,000+ vector points, analyzing BPM, key, timbre, and emotional density." },
                { title: "Curating", desc: "Neural networks reassemble your library into hyper-personalized flows that adapt to your circadian rhythm." }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  onViewportEnter={() => setActiveStep(idx)}
                  viewport={{ root: containerRef, margin: "-50% 0px -50% 0px" }}
                  className="relative pl-8 border-l-2 border-white/10"
                >
                   <motion.div 
                    animate={{ height: activeStep === idx ? "100%" : "0%" }}
                    className="absolute left-[-2px] top-0 w-[2px] bg-accent transition-all duration-500"
                  />
                  <h3 className={`text-6xl font-black mb-6 transition-colors duration-500 ${activeStep === idx ? 'text-white' : 'text-white/20'}`}>
                    0{idx + 1}.<br/>{step.title}
                  </h3>
                  <p className={`text-xl leading-relaxed max-w-md transition-colors duration-500 ${activeStep === idx ? 'text-text-secondary' : 'text-text-secondary/20'}`}>
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Sticky Visualization */}
            <div className="hidden lg:block relative h-full">
              <div className="sticky top-[20vh] h-[60vh] flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Step 1 Visual */}
                  <motion.div 
                    animate={{ opacity: activeStep === 0 ? 1 : 0, scale: activeStep === 0 ? 1 : 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Disc size={120} className="text-accent animate-spin-slow" />
                    <div className="absolute inset-0 bg-accent/20 blur-[60px]" />
                  </motion.div>

                  {/* Step 2 Visual */}
                  <motion.div 
                    animate={{ opacity: activeStep === 1 ? 1 : 0, scale: activeStep === 1 ? 1 : 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {[...Array(16)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [20, 40 + Math.random() * 40, 20] }}
                          transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                          className="w-4 bg-accent/50 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Step 3 Visual */}
                  <motion.div 
                    animate={{ opacity: activeStep === 2 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                     <div className="absolute w-[80%] h-[80%] border border-dashed border-accent/30 rounded-full animate-spin-reverse-slow" />
                     <div className="absolute w-[60%] h-[60%] border border-accent/50 rounded-full animate-pulse" />
                     <Mic size={64} className="text-white relative z-10" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION D: TECH MARQUEE --- */}
      <section className="py-20">
        <Marquee />
      </section>

      {/* --- SECTION C: BENTO GRID --- */}
      <section className="py-32 px-8 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ root: containerRef, once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">System Modules</h2>
          <p className="text-text-secondary uppercase tracking-widest text-sm">Engineered for perfection</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: Universal Sync (Large) */}
          <BentoCard title="Universal Sync" icon={<Globe size={18} />} className="md:col-span-2 relative group" delay={0.1}>
            <div className="h-full flex flex-col justify-between relative z-10">
              <h4 className="text-4xl font-bold max-w-md leading-tight mt-4">Seamlessly bridge your local files with the cloud.</h4>
              <div className="flex gap-4 mt-8">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ root: containerRef }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>
            <Globe className="absolute -right-10 -bottom-10 text-white/5 rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0" size={300} />
          </BentoCard>

          {/* Card 2: The Daily Mix (Tall) */}
          <BentoCard title="The Daily Mix" icon={<Activity size={18} />} className="md:row-span-2 bg-gradient-to-b from-white/5 to-accent/5" delay={0.2}>
            <div className="space-y-4 mt-6">
               {[1, 2, 3, 4, 5].map((item) => (
                 <div key={item} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md">
                   <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse" />
                   <div className="space-y-2 flex-1">
                     <div className="h-2 w-20 bg-white/20 rounded-full" />
                     <div className="h-2 w-12 bg-white/10 rounded-full" />
                   </div>
                 </div>
               ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#161618] to-transparent pointer-events-none" />
          </BentoCard>

          {/* Card 3: Lossless Audio */}
          <BentoCard title="Lossless Audio" icon={<Waves size={18} />} delay={0.3}>
            <div className="flex items-center justify-center h-full">
              <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                FLAC
              </span>
            </div>
          </BentoCard>

          {/* Card 4: Privacy Locked */}
          <BentoCard title="Privacy Locked" icon={<ShieldCheck size={18} />} delay={0.4}>
            <div className="flex flex-col justify-end h-full">
              <p className="text-text-secondary text-sm font-medium leading-relaxed">
                Your data never leaves the vault. Analysis happens locally or in an encrypted enclave.
              </p>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* --- SECTION E: MANIFESTO & CTA --- */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ root: containerRef }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl"
        >
          <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-16">
            THE ALGORITHM<br/>
            FOLLOWS THE CROWD.<br/>
            <span className="text-accent">CORTEX FOLLOWS YOU.</span>
          </h2>
          
          <div className="flex flex-col items-center gap-8">
            <Button 
              size="lg" 
              onClick={onEnter} 
              className="px-12 py-8 text-lg rounded-[1.5rem] bg-accent hover:bg-white text-background shadow-[0_0_80px_rgba(191,193,194,0.3)] hover:shadow-[0_0_120px_rgba(255,255,255,0.5)] transition-all duration-500 scale-100 hover:scale-105"
            >
              Initialize Vault <ArrowRight className="ml-3" />
            </Button>
            <span className="text-xs font-mono text-text-secondary/50 uppercase tracking-widest">
              Limited Access • V4.0.2 • Encrypted
            </span>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER SIMPLE --- */}
      <footer className="py-12 border-t border-white/5 bg-background text-center">
        <p className="text-[10px] text-text-secondary/30 uppercase tracking-[0.5em] font-bold">
          © 2025 Cortex FM • Crafted for the Future
        </p>
      </footer>
    </div>
  );
};
