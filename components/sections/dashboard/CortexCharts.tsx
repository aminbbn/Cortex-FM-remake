import React, { useState } from "react";
import { TrendingUp, Play, Clock, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrackDropdown } from "../../ui/TrackDropdown";
import { useMusic } from "../../../context/MusicContext";
import { Track } from "../../../types";

interface CortexChartsProps {
  itemVariants: any;
  onNavigateToArtist?: (artist: string) => void;
}

export const CortexCharts: React.FC<CortexChartsProps> = ({
  itemVariants,
  onNavigateToArtist,
}) => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <motion.section variants={itemVariants} className="xl:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-accent/10 rounded-xl">
            <TrendingUp className="text-accent" size={20} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">
            Cortex Charts
          </h2>
        </div>
        <div className="flex gap-4">
          <button className="px-5 py-2 text-[10px] font-black tracking-widest rounded-[13px] bg-accent text-background">
            Global
          </button>
          <button className="px-5 py-2 text-[10px] font-black tracking-widest rounded-[13px] bg-surface text-text-secondary hover:text-text-primary border border-white/5">
            Local
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tracks.slice(0, 5).map((track, idx) => (
          <motion.div
            key={track.id}
            variants={itemVariants}
            className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-all duration-300 group border border-transparent hover:border-white/5 relative"
          >
            <div
              className="w-6 flex justify-center cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <span className="text-xs font-black text-text-secondary/30 group-hover:hidden transition-all">
                0{idx + 1}
              </span>
              <Play
                size={14}
                className="hidden group-hover:block fill-current text-accent"
              />
            </div>
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-14 h-14 rounded-xl object-cover shadow-lg cursor-pointer"
              onClick={() => playTrack(track)}
            />
            <div className="flex-1 min-w-0">
              <h4
                className="text-base font-black truncate hover:text-accent transition-colors tracking-tight cursor-pointer"
                onClick={() => playTrack(track)}
              >
                {track.title}
              </h4>
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToArtist?.(track.artist);
                }}
                className="text-xs text-text-secondary font-bold tracking-wide opacity-60 hover:text-accent hover:underline cursor-pointer transition-all"
              >
                {track.artist}
              </p>
            </div>
            <div
              className="hidden md:block text-[10px] font-black tracking-widest text-text-secondary/50 px-4 cursor-pointer"
              onClick={() => playTrack(track)}
            >
              {track.genre}
            </div>
            <div
              className="flex items-center gap-2 text-xs text-text-secondary font-mono min-w-[60px] font-bold cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <Clock size={12} className="opacity-40" />
              {Math.floor(track.duration / 60)}:
              {(track.duration % 60).toString().padStart(2, "0")}
            </div>

            {/* 3-dot menu on the right */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuTrackId(
                    activeMenuTrackId === track.id ? null : track.id,
                  );
                }}
                className={`p-3 rounded-full text-text-secondary hover:text-white transition-all duration-300 ${activeMenuTrackId === track.id ? "opacity-100 bg-white/5 text-white" : "opacity-0 group-hover:opacity-100"}`}
              >
                <MoreHorizontal size={18} />
              </button>
              <AnimatePresence>
                {activeMenuTrackId === track.id && (
                  <TrackDropdown
                    track={track}
                    onClose={() => setActiveMenuTrackId(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
