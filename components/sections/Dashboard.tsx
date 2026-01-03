
import React from 'react';
import { Card } from '../ui/Card';
import { MOCK_PLAYLISTS } from '../../constants';
import { Play, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { Track } from '../../types';

export const Dashboard: React.FC = () => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Sparkles className="text-accent" size={20} />
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Personalized for You</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">View all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PLAYLISTS.map((playlist, idx) => (
            <motion.div key={playlist.id} variants={itemVariants}>
              <Card className="relative group p-0 overflow-hidden !bg-transparent border-none">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square shadow-2xl">
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-background shadow-[0_0_30px_rgba(191,193,194,0.4)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </motion.div>
                  </div>
                </div>
                <h3 className="text-lg font-black text-text-primary mb-1 truncate tracking-tight uppercase">{playlist.name}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed opacity-60 font-bold">
                  {playlist.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* New Charts & Trending */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <motion.section variants={itemVariants} className="xl:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-xl">
                <TrendingUp className="text-accent" size={20} />
              </div>
              <h2 className="text-3xl font-black tracking-tight uppercase">Cortex Charts</h2>
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-[13px] bg-accent text-background">Global</button>
              <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-[13px] bg-surface text-text-secondary hover:text-text-primary border border-white/5">Local</button>
            </div>
          </div>
          
          <div className="space-y-3">
            {tracks.slice(0, 5).map((track, idx) => (
              <motion.div
                key={track.id}
                variants={itemVariants}
                onClick={() => playTrack(track)}
                className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/5"
              >
                <span className="text-xs font-black text-text-secondary/30 w-6 group-hover:text-accent group-hover:scale-110 transition-all">0{idx + 1}</span>
                <img src={track.coverUrl} alt={track.title} className="w-14 h-14 rounded-xl object-cover shadow-lg" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black truncate group-hover:text-accent transition-colors tracking-tight uppercase">{track.title}</h4>
                  <p className="text-xs text-text-secondary font-bold tracking-wide uppercase opacity-60">{track.artist}</p>
                </div>
                <div className="hidden md:block text-[10px] font-black uppercase tracking-widest text-text-secondary/50 px-4">
                  {track.genre}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary font-mono min-w-[60px] font-bold">
                  <Clock size={12} className="opacity-40" />
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
                <button className="p-3 rounded-full bg-accent/5 text-text-secondary hover:text-accent hover:bg-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <Play size={18} fill="currentColor" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Sparkles className="text-accent" size={20} />
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Insights</h2>
          </div>
          <Card className="bg-gradient-to-br from-surface to-accent/5 p-8 border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <p className="text-sm text-text-secondary mb-8 leading-relaxed font-bold">
              Your sonic profile is evolving. Based on <span className="text-text-primary font-black">{tracks.length} tracks</span> analyzed in your vault.
            </p>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="opacity-50">Cohesion</span>
                  <span className="text-accent">84%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 1 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="opacity-50">Discovery Range</span>
                  <span className="text-accent">72%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 1.2 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>
            <button className="w-full mt-10 py-4 bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] rounded-[13px] transition-all border border-accent/20 active:scale-95">
              Sync Model
            </button>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
};
