import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Activity, Clock, Zap } from 'lucide-react';
import { Card } from '../ui/Card';
import { useMusic } from '../../context/MusicContext';

export const Stats: React.FC = () => {
  const { tracks } = useMusic();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const totalDuration = tracks.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 pt-12 h-full pb-32 px-8 md:px-20 lg:px-24">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="p-3 bg-accent/10 rounded-2xl">
          <BarChart2 className="text-accent" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Cortex Stats</h1>
          <p className="text-text-secondary font-bold opacity-70">Analytics on your listening habits.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-surface/50 border border-white/5 p-6 hover:bg-surface transition-colors cursor-default">
            <div className="flex items-center gap-4 mb-4 text-text-secondary">
              <Activity size={20} className="text-accent" />
              <span className="text-xs font-black tracking-widest uppercase">Total Tracks</span>
            </div>
            <div className="text-5xl font-black tracking-tighter">{tracks.length}</div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-surface/50 border border-white/5 p-6 hover:bg-surface transition-colors cursor-default">
            <div className="flex items-center gap-4 mb-4 text-text-secondary">
              <Clock size={20} className="text-accent" />
              <span className="text-xs font-black tracking-widest uppercase">Total Playtime</span>
            </div>
            <div className="text-5xl font-black tracking-tighter">
              {Math.floor(totalDuration / 60)}<span className="text-2xl text-text-secondary">m</span>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-surface/50 border border-white/5 p-6 hover:bg-surface transition-colors cursor-default">
            <div className="flex items-center gap-4 mb-4 text-text-secondary">
              <TrendingUp size={20} className="text-accent" />
              <span className="text-xs font-black tracking-widest uppercase">Top Mood</span>
            </div>
            <div className="text-5xl font-black tracking-tighter text-accent drop-shadow-[0_0_10px_rgba(191,193,194,0.3)]">Energetic</div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="bg-gradient-to-br from-surface to-accent/5 p-8 border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
            <Zap size={20} className="text-accent" /> Synergy Matrix
          </h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="opacity-50">Electronic</span>
                <span className="text-accent">40%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1 }} className="h-full bg-accent" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="opacity-50">Ambient</span>
                <span className="text-accent">35%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-accent" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black tracking-[0.2em] uppercase">
                <span className="opacity-50">Classical</span>
                <span className="text-accent">25%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-accent" />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <h3 className="text-sm font-black tracking-[0.2em] uppercase text-text-secondary mb-4 ml-2">Recent Activity</h3>
          {tracks.slice(0, 4).map((track, i) => (
            <div key={track.id} className="flex items-center gap-4 bg-surface/30 p-4 rounded-2xl border border-white/5 hover:bg-surface/50 transition-colors">
              <img src={track.coverUrl} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-black tracking-tight">{track.title}</h4>
                <p className="text-xs text-text-secondary font-bold opacity-60">{track.artist}</p>
              </div>
              <div className="text-[10px] font-mono font-bold text-text-secondary opacity-40">
                {i + 1}h ago
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
