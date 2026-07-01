import React from "react";
import { History, Play } from "lucide-react";
import { motion } from "framer-motion";
import { RecentlyPlayedItem } from "../../../types";

interface RecentlyListenedProps {
  recentlyPlayed: RecentlyPlayedItem[];
  itemVariants: any;
  handleRecentItemClick: (item: RecentlyPlayedItem) => void;
  handleRecentItemPlay: (item: RecentlyPlayedItem) => void;
}

export const RecentlyListened: React.FC<RecentlyListenedProps> = ({
  recentlyPlayed,
  itemVariants,
  handleRecentItemClick,
  handleRecentItemPlay,
}) => {
  if (!recentlyPlayed || recentlyPlayed.length === 0) return null;

  return (
    <motion.section variants={itemVariants}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 bg-accent/10 rounded-xl">
          <History className="text-accent" size={20} />
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          Recently Listened
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentlyPlayed.map((item) => (
          <motion.div
            layout
            key={item.id}
            variants={itemVariants}
            onClick={() => handleRecentItemClick(item)}
            className="flex items-center gap-4 p-2 bg-surface/40 hover:bg-surface border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden h-20 w-full"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md shrink-0">
              <img
                src={item.coverUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-1 right-1 bg-background/80 text-[8px] font-black px-1 rounded uppercase text-accent">
                {item.type}
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-12">
              <h4 className="text-sm font-black text-text-primary truncate group-hover:text-accent transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-text-secondary opacity-60 truncate font-bold mt-1">
                {item.subtitle}
              </p>
            </div>
            
            <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecentItemPlay(item);
                }}
                className="w-10 h-10 bg-accent hover:scale-105 active:scale-95 rounded-full flex items-center justify-center text-background shadow-lg transition-all"
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
