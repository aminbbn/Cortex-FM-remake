
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { MOCK_PLAYLISTS } from '../../constants';
import { Play, TrendingUp, Sparkles, Clock, MoreHorizontal, Heart, Plus, User, Disc, Share2, ListPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { Track } from '../../types';

interface DashboardProps {
  onNavigateToArtist?: (artist: string) => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToArtist, onNavigateToAlbum }) => {
  const { tracks, setCurrentTrack, setIsPlaying, likedTracks, toggleLikeTrack, playlists, addTrackToPlaylist } = useMusic();
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleShare = (track: Track) => {
    navigator.clipboard.writeText(`${window.location.origin}/track/${track.id}`);
    alert(`Link for ${track.title} copied to clipboard!`);
    setActiveMenuTrackId(null);
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
      className="space-y-16 pt-12 px-8 md:px-20 lg:px-24"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Sparkles className="text-accent" size={20} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Personalized for You</h2>
          </div>
          <button className="text-[10px] font-black tracking-widest text-text-secondary hover:text-accent transition-colors">View all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PLAYLISTS.map((playlist, idx) => (
            <motion.div key={playlist.id} variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col p-0 overflow-hidden group cursor-pointer bg-surface/50 hover:bg-surface border border-white/5 hover:border-white/10 transition-all duration-300 relative">
                <div className="relative overflow-hidden mb-4 aspect-square shadow-2xl shrink-0">
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
                <div className="px-5 pb-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-text-primary mb-1 truncate tracking-tight">{playlist.name}</h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed opacity-60 font-bold">
                    {playlist.description}
                  </p>
                </div>
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
              <h2 className="text-3xl font-black tracking-tight">Cortex Charts</h2>
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-2 text-[10px] font-black tracking-widest rounded-[13px] bg-accent text-background">Global</button>
              <button className="px-5 py-2 text-[10px] font-black tracking-widest rounded-[13px] bg-surface text-text-secondary hover:text-text-primary border border-white/5">Local</button>
            </div>
          </div>
          
          <div className="space-y-3">
            {tracks.slice(0, 5).map((track, idx) => (
              <motion.div
                key={track.id}
                variants={itemVariants}
                className="flex items-center gap-6 p-4 rounded-2xl hover:bg-surface transition-all duration-300 group border border-transparent hover:border-white/5 relative"
              >
                <div className="w-6 flex justify-center cursor-pointer" onClick={() => playTrack(track)}>
                  <span className="text-xs font-black text-text-secondary/30 group-hover:hidden transition-all">0{idx + 1}</span>
                  <Play size={14} className="hidden group-hover:block fill-current text-accent" />
                </div>
                <img src={track.coverUrl} alt={track.title} className="w-14 h-14 rounded-xl object-cover shadow-lg cursor-pointer" onClick={() => playTrack(track)} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black truncate hover:text-accent transition-colors tracking-tight cursor-pointer" onClick={() => playTrack(track)}>{track.title}</h4>
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
                <div className="hidden md:block text-[10px] font-black tracking-widest text-text-secondary/50 px-4 cursor-pointer" onClick={() => playTrack(track)}>
                  {track.genre}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary font-mono min-w-[60px] font-bold cursor-pointer" onClick={() => playTrack(track)}>
                  <Clock size={12} className="opacity-40" />
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
                
                {/* 3-dot menu on the right */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuTrackId(activeMenuTrackId === track.id ? null : track.id);
                    }} 
                    className={`p-3 rounded-full text-text-secondary hover:text-white transition-all duration-300 ${activeMenuTrackId === track.id ? 'opacity-100 bg-white/5 text-white' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <AnimatePresence>
                    {activeMenuTrackId === track.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 bg-surface border border-white/10 rounded-xl shadow-2xl p-2 z-50 min-w-[160px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => { playTrack(track); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Play size={14} /> Play
                        </button>
                        <button onClick={() => { setActiveMenuTrackId(null); alert("Added to queue!"); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <ListPlus size={14} /> Add to Queue
                        </button>
                        <button onClick={() => { toggleLikeTrack(track.id); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Heart size={14} className={likedTracks.includes(track.id) ? "fill-accent text-accent" : ""} /> {likedTracks.includes(track.id) ? 'Unlike' : 'Like'}
                        </button>
                        <div className="w-full h-px bg-white/5 my-1" />
                        <button onClick={() => { onNavigateToArtist?.(track.artist); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <User size={14} /> View Artist
                        </button>
                        <button onClick={() => { onNavigateToAlbum?.(track.id); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <Disc size={14} /> View Album
                        </button>
                        <button onClick={() => handleShare(track)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <Share2 size={14} /> Share
                        </button>
                        <div className="w-full h-px bg-white/5 my-1" />
                        <div className="px-3 py-1 text-[9px] font-black text-text-secondary tracking-widest uppercase">Add to Playlist</div>
                        {playlists.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-text-secondary opacity-60">No playlists available</div>
                        ) : (
                          playlists.map(pl => (
                            <button key={pl.id} onClick={() => { addTrackToPlaylist(pl.id, track); setActiveMenuTrackId(null); alert(`Added to ${pl.name}`); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                              <Plus size={14} /> {pl.name}
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Sparkles className="text-accent" size={20} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Insights</h2>
          </div>
          <Card className="bg-gradient-to-br from-surface to-accent/5 p-8 border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <p className="text-sm text-text-secondary mb-8 leading-relaxed font-bold">
              Your sonic profile is evolving. Based on <span className="text-text-primary font-black">{tracks.length} tracks</span> analyzed in your vault.
            </p>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
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
                <div className="flex justify-between text-[10px] font-black tracking-[0.2em]">
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
            <button className="w-full mt-10 py-4 bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-black tracking-[0.3em] rounded-[13px] transition-all border border-accent/20 active:scale-95">
              Sync Model
            </button>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
};
