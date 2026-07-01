import React from "react";
import { Sparkles, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface CategorySelectorsProps {
  genres: string[];
  moods: string[];
  selectedGenres: string[];
  selectedMoods: string[];
  toggleGenre: (genre: string) => void;
  toggleMood: (mood: string) => void;
  itemVariants: any;
}

export const CategorySelectors: React.FC<CategorySelectorsProps> = ({
  genres,
  moods,
  selectedGenres,
  selectedMoods,
  toggleGenre,
  toggleMood,
  itemVariants,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Genres Selector */}
      <motion.section variants={itemVariants}>
        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-text-secondary mb-6 flex items-center gap-3">
          <Sparkles size={16} /> Top Genres
        </h2>
        <div className="flex flex-wrap gap-3">
          {genres.map(g => {
            const isSelected = selectedGenres.includes(g);
            return (
              <button 
                key={g} 
                onClick={() => toggleGenre(g)}
                className={`px-6 py-3 rounded-xl border font-bold tracking-tight shadow-lg transition-all duration-300 active:scale-95 ${
                  isSelected 
                    ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(255,255,255,0.15)] font-black' 
                    : 'bg-surface/40 hover:bg-accent/10 hover:text-accent border-white/5 hover:border-accent/20 text-text-primary'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Moods Selector */}
      <motion.section variants={itemVariants}>
        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-text-secondary mb-6 flex items-center gap-3">
          <Flame size={16} /> Moods
        </h2>
        <div className="flex flex-wrap gap-3">
          {moods.map(m => {
            const isSelected = selectedMoods.includes(m);
            return (
              <button 
                key={m} 
                onClick={() => toggleMood(m)}
                className={`px-6 py-3 rounded-xl border font-bold tracking-tight shadow-lg transition-all duration-300 active:scale-95 ${
                  isSelected 
                    ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(255,255,255,0.15)] font-black' 
                    : 'bg-surface/40 hover:bg-accent/10 hover:text-accent border-white/5 hover:border-accent/20 text-text-primary'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};
