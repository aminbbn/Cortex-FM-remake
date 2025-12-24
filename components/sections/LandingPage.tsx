
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Mic, ArrowRight, Sparkles, ShieldCheck, Zap, Globe, 
  Layers, Cpu, Database, Share2, Activity,
  PlayCircle, Fingerprint, Waves
} from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0.9]);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const discoveryItems = [...Array(8)].map((_, i) => ({
    id: i,
    title: `Synthesis ${i + 1}`,
    seed: `mix-${i}`
  }));
  const duplicatedItems = [...discoveryItems, ...discoveryItems];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(30px)' }}
      className="relative h-full w-full overflow-y-auto scroll-smooth overflow-x-hidden bg-background flex flex-col items-center selection:bg-accent selection:text-background"
    >
      {/* --- NEURAL FIELD BACKGROUND --- */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[150px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #BFC1C2 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -60, 0],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bg-accent/20 rounded-full blur-3xl"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 30) % 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* --- NAVIGATION --- */}
      <motion.header style={{ opacity: navOpacity }} className="fixed z-[100] top-0 w-full px-8 py-6 flex justify-between items-center bg-background/30 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(191,193,194,0.3)]">
            <Mic size={22} className="text-background" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Cortex FM</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {['Vision', 'Engine', 'Docs'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary hover:text-accent transition-all">{link}</a>
          ))}
          <Button variant="primary" size="sm" onClick={onEnter} className="rounded-full px-8">Launch App</Button>
        </div>
      </motion.header>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full max-w-6xl px-8 pt-64 pb-48 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-10">
          <span className="px-6 py-2.5 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] font-black tracking-[0.4em] uppercase flex items-center gap-4 shadow-[0_0_40px_rgba(191,193,194,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Neural Synthesis Active
          </span>
        </motion.div>
        <motion.h1 variants={itemVariants} initial="hidden" animate="visible" className="text-8xl md:text-[11rem] font-black tracking-tighter mb-10 leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-text-primary via-text-primary to-text-secondary/20">
          SONIC<br />EVOLUTION.
        </motion.h1>
        <motion.p variants={itemVariants} initial="hidden" animate="visible" className="text-lg md:text-2xl text-text-secondary max-w-2xl mb-16 leading-relaxed font-medium opacity-80">
          The ultimate personal music vault. Cortex FM deconstructs your collection to curate the impossible, every single day.
        </motion.p>
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-8">
          <Button size="lg" className="group px-16 py-7 rounded-full shadow-[0_0_60px_rgba(191,193,194,0.1)]" onClick={onEnter}>
            Enter the Vault <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </Button>
          <Button variant="ghost" size="lg" className="rounded-full px-16 border border-accent/10 hover:border-accent/30">Whitepaper</Button>
        </motion.div>
      </section>

      {/* --- THE ENGINE SECTION --- */}
      <section id="engine" className="relative z-10 w-full max-w-7xl px-8 pb-56">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -50 }} viewport={{ once: true }} className="space-y-12">
            <div className="inline-flex p-5 bg-accent/10 rounded-3xl text-accent border border-accent/20"><Cpu size={48} /></div>
            <h2 className="text-7xl font-black tracking-tight leading-none">Atomic<br /><span className="text-text-secondary opacity-30">Analysis.</span></h2>
            <p className="text-text-secondary text-xl leading-relaxed max-w-md">Our engine identifies thousands of hidden attributes in your tracks, from harmonic tension to spectral resonance.</p>
            <div className="space-y-6">
              {[
                { icon: <Fingerprint />, label: "Audio DNA", value: "Locked" },
                { icon: <Waves />, label: "Spectral Mapping", value: "24-bit" },
                { icon: <Activity />, label: "Mood Topology", value: "Active" }
              ].map((spec, i) => (
                <div key={i} className="flex items-center justify-between p-6 glass rounded-3xl border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.3em]"><span className="text-accent">{spec.icon}</span>{spec.label}</div>
                  <span className="text-accent font-mono text-xs">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.9 }} viewport={{ once: true }} className="relative aspect-square glass rounded-[5rem] flex items-center justify-center p-20 shadow-[0_0_100px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent/5" />
            <div className="absolute w-[85%] h-[85%] border border-dashed border-accent/20 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-[60%] h-[60%] border border-dashed border-accent/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="relative z-10 p-10 rounded-full bg-background/80 border border-accent/20 shadow-[0_0_50px_rgba(191,193,194,0.15)]">
              <Mic size={64} className="text-accent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- DAILY SYNTHESIS (FIXED INFINITE SCROLL) --- */}
      <section className="relative z-10 w-full overflow-hidden pb-56">
        <div className="max-w-7xl mx-auto px-8 mb-24 text-center">
          <h2 className="text-7xl font-black mb-6 tracking-tighter">The Daily Synthesis.</h2>
          <p className="text-text-secondary uppercase tracking-[0.6em] text-[10px] font-black opacity-60">Infinite variations based on your core vault.</p>
        </div>
        
        <div className="relative w-full overflow-hidden py-10" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <motion.div animate={{ x: [0, -discoveryItems.length * 352] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex gap-8 px-4">
            {duplicatedItems.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <div className="aspect-[4/5] glass rounded-[3rem] p-10 border-white/5 hover:border-accent/30 transition-all duration-700 group relative overflow-hidden">
                  <img src={`https://picsum.photos/seed/${item.seed}/500/600`} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000" />
                  <div className="relative z-20 h-full flex flex-col justify-end">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4 opacity-0 group-hover:opacity-100 transition-all">Match: 99%</p>
                      <h4 className="text-3xl font-black tracking-tight">{item.title}</h4>
                      <div className="h-1 w-12 bg-accent mt-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full py-32 px-8 border-t border-white/5 bg-background/50 backdrop-blur-3xl text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-6">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-2xl mb-4"><Mic size={28} className="text-background" /></div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Cortex FM</h3>
            <p className="text-text-secondary text-xs font-black uppercase tracking-[0.5em] opacity-40">Designed for Discerning Listeners.</p>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">
            <a href="#" className="hover:text-accent transition-all">Privacy</a>
            <a href="#" className="hover:text-accent transition-all">Terms</a>
            <a href="#" className="hover:text-accent transition-all">Security</a>
          </div>
          <p className="text-text-secondary/20 text-[10px] uppercase font-black tracking-[1em]">© 2025 • Cortex FM Global</p>
        </div>
      </footer>
    </motion.div>
  );
};
