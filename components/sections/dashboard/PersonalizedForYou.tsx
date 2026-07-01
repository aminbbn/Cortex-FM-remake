import React from "react";
import { Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../ui/Card";
import { useMusic } from "../../../context/MusicContext";

interface PersonalizedForYouProps {
  itemVariants: any;
}

export const PersonalizedForYou: React.FC<PersonalizedForYouProps> = ({
  itemVariants,
}) => {
  const { playlists, setCurrentTrack, setIsPlaying } = useMusic();

  return (
    <motion.section variants={itemVariants}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Sparkles className="text-accent" size={20} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Personalized for You
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => document.getElementById('dashboard-playlists')?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={() => document.getElementById('dashboard-playlists')?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div 
        id="dashboard-playlists"
        className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.id}
            variants={itemVariants}
            className="min-w-[280px] w-[280px] shrink-0 snap-start flex flex-col"
          >
            <Card 
              onClick={() => window.dispatchEvent(new CustomEvent('nav:playlist', { detail: playlist.id }))}
              className="flex-1 flex flex-col p-0 overflow-hidden group cursor-pointer bg-surface/50 hover:bg-surface border border-white/5 hover:border-white/10 transition-all duration-300 relative"
            >
              <div className="relative overflow-hidden mb-4 aspect-square shadow-2xl shrink-0">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlist.tracks && playlist.tracks.length > 0) {
                        setCurrentTrack(playlist.tracks[0]);
                        setIsPlaying(true);
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-background shadow-[0_0_30px_rgba(191,193,194,0.4)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </motion.div>
                </div>
              </div>
              <div className="px-5 pb-5 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-text-primary mb-1 truncate tracking-tight">
                  {playlist.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed opacity-60 font-bold">
                  {playlist.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
