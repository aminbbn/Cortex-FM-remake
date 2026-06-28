import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Sparkles, Flame, Radio } from 'lucide-react';
import { Card } from '../ui/Card';
import { useMusic } from '../../context/MusicContext';
import { Play } from 'lucide-react';

interface DiscoverProps {
  onNavigateToArtist?: (artist: string) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ onNavigateToArtist }) => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const genres = ['Electronic', 'Ambient', 'Hip Hop', 'Jazz', 'Classical', 'Rock', 'Pop'];
  const moods = ['Focus', 'Chill', 'Energetic', 'Euphoric', 'Dark'];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 pt-12 h-full pb-32 px-8 md:px-20 lg:px-24">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="p-3 bg-accent/10 rounded-2xl">
          <Compass className="text-accent" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Discover</h1>
          <p className="text-text-secondary font-bold opacity-70">Expand your sonic horizons.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input 
          type="text" 
          placeholder="Search genres, artists, or moods..." 
          className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-accent/50 transition-colors shadow-2xl"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-black tracking-[0.2em] uppercase text-text-secondary mb-6 flex items-center gap-3">
            <Sparkles size={16} /> Top Genres
          </h2>
          <div className="flex flex-wrap gap-3">
            {genres.map(g => (
              <button key={g} className="px-6 py-3 rounded-xl bg-surface/40 hover:bg-accent/10 hover:text-accent border border-white/5 hover:border-accent/20 transition-all font-bold tracking-tight shadow-lg">
                {g}
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-black tracking-[0.2em] uppercase text-text-secondary mb-6 flex items-center gap-3">
            <Flame size={16} /> Moods
          </h2>
          <div className="flex flex-wrap gap-3">
            {moods.map(m => (
              <button key={m} className="px-6 py-3 rounded-xl bg-surface/40 hover:bg-accent/10 hover:text-accent border border-white/5 hover:border-accent/20 transition-all font-bold tracking-tight shadow-lg">
                {m}
              </button>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section variants={itemVariants} className="pt-8 border-t border-white/5">
        <h2 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-3">
          <Radio className="text-accent" size={24} /> Recommended For You
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {tracks.slice(0, 10).map((track) => (
            <div key={track.id} className="group cursor-pointer" onClick={() => playTrack(track)}>
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square shadow-xl border border-white/5">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-background shadow-[0_0_20px_rgba(191,193,194,0.4)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-black truncate text-text-primary tracking-tight">{track.title}</h3>
              <p 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToArtist?.(track.artist);
                }} 
                className="text-xs text-text-secondary font-bold opacity-60 truncate hover:text-accent hover:underline cursor-pointer transition-all"
              >
                {track.artist}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};
