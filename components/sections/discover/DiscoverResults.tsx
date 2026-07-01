import React from "react";
import { Radio, Search, Play, X } from "lucide-react";
import { motion } from "framer-motion";
import { Track } from "../../../types";

interface DiscoverResultsProps {
  filteredTracks: Track[];
  selectedGenres: string[];
  selectedMoods: string[];
  searchQuery: string;
  toggleGenre: (genre: string) => void;
  toggleMood: (mood: string) => void;
  resetFilters: () => void;
  playTrack: (track: Track) => void;
  onNavigateToArtist?: (artist: string) => void;
  itemVariants: any;
}

export const DiscoverResults: React.FC<DiscoverResultsProps> = ({
  filteredTracks,
  selectedGenres,
  selectedMoods,
  searchQuery,
  toggleGenre,
  toggleMood,
  resetFilters,
  playTrack,
  onNavigateToArtist,
  itemVariants,
}) => {
  const hasActiveFilters = selectedGenres.length > 0 || selectedMoods.length > 0 || searchQuery;

  return (
    <motion.section variants={itemVariants} className="pt-8 border-t border-white/5">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <Radio className="text-accent animate-pulse" size={24} /> 
          {hasActiveFilters 
            ? `Matching Results (${filteredTracks.length})` 
            : 'Recommended For You'
          }
        </h2>
        
        {(selectedGenres.length > 0 || selectedMoods.length > 0) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary mr-1">Active:</span>
            {selectedGenres.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs flex items-center gap-1.5 border border-accent/20">
                {g}
                <button 
                  onClick={() => toggleGenre(g)} 
                  className="hover:text-white p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {selectedMoods.map(m => (
              <span key={m} className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-bold text-xs flex items-center gap-1.5 border border-accent/20">
                {m}
                <button 
                  onClick={() => toggleMood(m)} 
                  className="hover:text-white p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Display (Empty State vs. Track Grid) */}
      {filteredTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface/20 rounded-2xl border border-white/5 text-center">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <Search size={32} className="text-text-secondary opacity-60 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold mb-2">No tracks found</h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            We couldn't find any tracks matching your active filters or search query. Try choosing other categories or clearing your search.
          </p>
          <button 
            onClick={resetFilters}
            className="px-6 py-2.5 bg-accent text-background font-black text-xs uppercase tracking-widest rounded-xl hover:bg-accent/90 transition-all active:scale-95"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredTracks.map((track) => (
            <div key={track.id} className="group cursor-pointer" onClick={() => playTrack(track)}>
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square shadow-xl border border-white/5">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-background shadow-[0_0_20px_rgba(191,193,194,0.4)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-black truncate text-text-primary tracking-tight group-hover:text-accent transition-colors">
                {track.title}
              </h3>
              <p 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToArtist?.(track.artist);
                }} 
                className="text-xs text-text-secondary font-bold opacity-60 truncate hover:text-accent hover:underline cursor-pointer transition-all mt-0.5"
              >
                {track.artist}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};
