import React from "react";
import { Search, Compass, RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";

interface DiscoverHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onReset: () => void;
  showReset: boolean;
  itemVariants: any;
}

export const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onReset,
  showReset,
  itemVariants,
}) => {
  return (
    <>
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-2xl">
            <Compass className="text-accent" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Discover</h1>
            <p className="text-text-secondary font-bold opacity-70">Expand your sonic horizons.</p>
          </div>
        </div>
        
        {showReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-accent border border-accent/20 hover:border-accent bg-accent/5 rounded-xl transition-all active:scale-95"
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        )}
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tracks, genres, artists, or moods..." 
          className="w-full bg-surface/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-accent/50 transition-colors shadow-2xl"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>
    </>
  );
};
