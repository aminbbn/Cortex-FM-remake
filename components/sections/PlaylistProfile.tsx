import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Share2, Disc, Flame, Volume2, Sparkles, MoreHorizontal, Layers, Clock, List } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { TrackDropdown } from '../ui/TrackDropdown';

interface PlaylistProfileProps {
  playlistId: string;
  onBack: () => void;
  onNavigateToArtist?: (artistName: string) => void;
}

export const PlaylistProfile: React.FC<PlaylistProfileProps> = ({ playlistId, onBack, onNavigateToArtist }) => {
  const { playlists, setCurrentTrack, setIsPlaying, isPlaying, currentTrack, likedTracks, toggleLikeTrack } = useMusic();
  const playlist = playlists.find(p => p.id === playlistId);
  const playlistTracks = playlist?.tracks || [];

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [headerVisible, setHeaderVisible] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPlaylistPlaying = isPlaying && playlistTracks.some(t => t.id === currentTrack?.id);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPlaylist = () => {
    if (isPlaylistPlaying) {
      setIsPlaying(false);
    } else if (playlistTracks.length > 0) {
      if (currentTrack && playlistTracks.some(t => t.id === currentTrack.id)) {
        setIsPlaying(true);
      } else {
        playTrack(playlistTracks[0]);
      }
    }
  };

  // Sticky mini-header on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHeaderVisible(el.scrollTop > 320);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null);
      setHeaderMenuOpen(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/playlist/${playlist?.id}`);
    setToastMessage("Link copied to clipboard");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const upvoteTrack = (trackId: string) => {
    setRatings(prev => ({
      ...prev,
      [trackId]: (prev[trackId] || 0) + 1
    }));
  };

  if (!playlist) return null;

  const bannerUrl = `https://picsum.photos/seed/${playlist.id}-banner/1600/600`;
  const playlistDuration = playlistTracks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div ref={scrollRef} className="relative overflow-y-auto overflow-x-hidden min-h-screen pb-36 scroll-smooth">
      {/* ─── TOAST NOTIFICATION ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STICKY MINI HEADER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {headerVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-white/5"
          >
            <button
              onClick={onBack}
              className="text-white/50 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase"
            >
              ← Back
            </button>
            <div className="w-px h-4 bg-white/10" />
            <img
              src={playlist.coverUrl}
              alt=""
              className="w-8 h-8 rounded-md object-cover"
            />
            <span className="text-sm font-black tracking-tight text-white flex-1 truncate">
              {playlist.name}
            </span>
            <button
              onClick={handlePlayPlaylist}
              className="w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center hover:scale-105 transition-transform shrink-0"
            >
              {isPlaylistPlaying ? (
                <Pause fill="currentColor" size={14} />
              ) : (
                <Play fill="currentColor" size={14} className="ml-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── BANNER + PLAYLIST HEADER ────────────────────────────────────── */}
      <div className="relative w-full">
        <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden">
          <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div className="absolute inset-0 bg-accent/10 mix-blend-color" />

          <button
            onClick={onBack}
            className="absolute top-5 left-5 md:top-6 md:left-8 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 transition-all text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">
              ←
            </span>{" "}
            Back
          </button>

          <div className="absolute top-5 right-5 md:top-6 md:right-8 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all text-white/70 hover:text-white"
            >
              <Share2 size={14} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHeaderMenuOpen(!headerMenuOpen);
                }}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all text-white/70 hover:text-white"
              >
                <MoreHorizontal size={14} />
              </button>
              <AnimatePresence>
                {headerMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                      transformOrigin: "top right",
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                  >
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                      Edit Details
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors">
                      Delete Playlist
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Profile section: cover + info + actions */}
        <div className="relative px-6 md:px-10 lg:px-16 -mt-16 md:-mt-20 pb-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-7">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden border-4 border-background shadow-2xl group cursor-pointer">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <List className="text-white" size={32} />
                </div>
              </div>
            </motion.div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pb-1 md:pb-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-1.5 text-accent text-[10px] font-black tracking-[0.3em] uppercase mb-2"
              >
                <Sparkles size={12} />
                Playlist
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15,
                }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-white mb-2 md:mb-4 drop-shadow-lg"
              >
                {playlist.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-white/60 font-medium mb-3 max-w-xl"
              >
                {playlist.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-white/50"
              >
                <span className="flex items-center gap-1.5">
                  <Layers size={12} className="text-accent" />
                  <span className="text-white">{playlistTracks.length}</span>
                  &nbsp;tracks
                </span>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-accent" />
                  <span className="text-white">
                    {Math.floor(playlistDuration / 60)} min {playlistDuration % 60} sec
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center gap-3 pb-1 md:pb-3"
            >
              {/* Big play */}
              <button
                onClick={handlePlayPlaylist}
                className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] aspect-square rounded-full bg-accent text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_24px_rgba(255,255,255,0.15)] shrink-0"
              >
                {isPlaylistPlaying ? (
                  <Pause fill="currentColor" size={22} />
                ) : (
                  <Play fill="currentColor" size={22} className="ml-1" />
                )}
              </button>

              {/* Like */}
              <button className="w-12 h-12 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <Heart size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
             <List className="text-accent" size={20} /> 
             <h3 className="text-2xl font-black tracking-tight">Tracklist</h3>
          </motion.div>

          <div className="flex flex-col gap-1">
            {playlistTracks.map((track, i) => {
              const isCurrentlyPlaying = isPlaying && currentTrack?.id === track.id;
              const isLiked = likedTracks.includes(track.id);

              return (
                <motion.div
                  key={track.id + '-' + i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  onClick={() => playTrack(track)}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer relative"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-8 text-center text-xs font-mono text-white/30 group-hover:text-white/70">
                      {isCurrentlyPlaying ? (
                        <div className="flex items-end justify-center gap-[2px] h-3">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[3px] bg-accent rounded-full" />
                          <motion.div animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-[3px] bg-accent rounded-full" />
                          <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-[3px] bg-accent rounded-full" />
                        </div>
                      ) : (
                        <>
                          <span className="group-hover:hidden">{i + 1}</span>
                          <Play fill="currentColor" size={12} className="mx-auto hidden group-hover:block ml-2.5" />
                        </>
                      )}
                    </div>

                    <img src={track.coverUrl} className="w-10 h-10 rounded-md object-cover" alt="" />

                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className={`text-sm font-bold truncate ${isCurrentlyPlaying ? "text-accent" : "text-white"}`}>
                        {track.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToArtist?.(track.artist);
                          }}
                          className="text-xs text-white/40 truncate hover:text-accent hover:underline transition-colors"
                        >
                          {track.artist}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Upvote & Rating fire badge */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); upvoteTrack(track.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-orange-500/20 text-white/50 hover:text-orange-400 transition-all text-xs font-black mr-2"
                    >
                      <Flame size={14} className="group-hover:animate-bounce" />
                      <span>{ratings[track.id] || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(track.id);
                      }}
                      className={`${isLiked ? "text-accent opacity-100 block" : "text-white/30 hover:text-white opacity-0 group-hover:opacity-100 hidden sm:block"} transition-colors`}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <span className="text-xs text-white/40 font-mono w-10 text-right">
                      {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === track.id ? null : track.id);
                        }}
                        className="text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <AnimatePresence>
                        {activeDropdownId === track.id && (
                          <TrackDropdown
                            track={track}
                            onClose={() => setActiveDropdownId(null)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {playlistTracks.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <p>This playlist is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
