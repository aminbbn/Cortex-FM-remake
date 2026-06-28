import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Share2, Disc, Flame, Star, Volume2, Sparkles, MapPin, Compass, HelpCircle } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { Button } from '../ui/Button';

interface AlbumProfileProps {
  albumTrackId: string;
  onBack: () => void;
  onNavigateToArtist?: (artistName: string) => void;
}

export const AlbumProfile: React.FC<AlbumProfileProps> = ({ albumTrackId, onBack, onNavigateToArtist }) => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();
  const mainTrack = tracks.find(t => t.id === albumTrackId) || tracks[0];
  const albumTracks = tracks.filter(t => t.artist === mainTrack?.artist); // Mocking album tracks

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [immersivePreset, setImmersivePreset] = useState<'concert' | 'studio' | 'moshpit'>('concert');
  const [hypeLevel, setHypeLevel] = useState(78);
  const [showSecrets, setShowSecrets] = useState(false);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/album/${mainTrack?.id}`);
    alert(`Album link copied to clipboard! Share the fire with your friends! 🔥`);
  };

  const upvoteTrack = (trackId: string) => {
    setRatings(prev => ({
      ...prev,
      [trackId]: (prev[trackId] || 0) + 1
    }));
    setHypeLevel(prev => Math.min(100, prev + 3));
  };

  if (!mainTrack) return null;

  const getPresetColor = () => {
    switch (immersivePreset) {
      case 'concert':
        return 'from-purple-600 via-pink-600 to-black';
      case 'studio':
        return 'from-blue-600 via-indigo-900 to-black';
      case 'moshpit':
        return 'from-red-600 via-amber-600 to-black';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative overflow-x-hidden min-h-screen">
      {/* Dynamic Immersive Background Banner */}
      <div className="absolute top-0 left-0 right-0 h-[520px] mx-0 overflow-hidden pointer-events-none">
         <div 
           className={`absolute -inset-32 bg-gradient-to-br ${getPresetColor()} opacity-30 blur-[100px] saturate-200 transition-all duration-1000`}
         />
         {/* Dual layered gradient for maximum smooth transition with zero sharp lines */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-95" />
         
         {/* Animated Stage laser light beams */}
         <div className="absolute top-0 left-1/3 w-[1.5px] h-full bg-gradient-to-b from-accent/40 to-transparent rotate-[20deg] blur-[2px] animate-pulse" />
         <div className="absolute top-0 right-1/3 w-[1.5px] h-full bg-gradient-to-b from-accent/30 to-transparent -rotate-[15deg] blur-[3px] animate-pulse" style={{ animationDelay: '1.2s' }} />
      </div>

      <div className="relative z-10 pt-8 px-8 md:px-20 lg:px-24 space-y-10">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/5 transition-all text-xs font-black tracking-widest text-white uppercase group shadow-2xl">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Vault
        </button>

        {/* Hero Section - Minimal Perfection */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end w-full pb-4">
          <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.6)] border border-white/10 shrink-0 relative group">
            <img src={mainTrack.coverUrl} alt={mainTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl backdrop-blur-[2px]">
              <Disc className="text-white animate-spin-slow" size={44} />
            </div>
          </div>
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="text-[10px] font-black tracking-[0.3em] text-accent uppercase flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles size={12} className="animate-spin-slow" /> Ambient Album Release
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl leading-tight text-white">{mainTrack.album}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mainTrack.artist)}&background=random&size=64`} alt={mainTrack.artist} className="w-8 h-8 rounded-full border border-white/20" />
                <span 
                  onClick={() => onNavigateToArtist?.(mainTrack.artist)}
                  className="text-sm font-black tracking-tight text-white hover:text-accent hover:underline cursor-pointer transition-colors"
                >
                  {mainTrack.artist}
                </span>
                <span className="text-text-secondary text-sm font-black opacity-60">• {albumTracks.length} Premium Tracks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main interactive controls */}
        <div className="flex flex-wrap items-center gap-6 bg-surface/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md justify-between">
          <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">
            {/* Play Button - Perfectly centered layout */}
            <button 
              onClick={() => playTrack(albumTracks[0])} 
              className="w-20 h-20 rounded-full bg-white hover:bg-accent text-background flex items-center justify-center shadow-[0_12px_40px_rgba(255,255,255,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
            >
              <Play fill="currentColor" size={32} className="ml-1 text-background group-hover:scale-105 transition-transform" />
            </button>

            <div className="flex gap-3">
              <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all text-text-secondary hover:text-white shadow-xl">
                <Heart size={24} />
              </button>
              <button onClick={handleShare} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all text-text-secondary hover:text-white shadow-xl">
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Sound Presets */}
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
            <button 
              onClick={() => { setImmersivePreset('concert'); setHypeLevel(78); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${immersivePreset === 'concert' ? 'bg-purple-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
              Live Arena
            </button>
            <button 
              onClick={() => { setImmersivePreset('studio'); setHypeLevel(64); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${immersivePreset === 'studio' ? 'bg-indigo-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
              Remix Studio
            </button>
            <button 
              onClick={() => { setImmersivePreset('moshpit'); setHypeLevel(99); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${immersivePreset === 'moshpit' ? 'bg-red-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
              Moshpit Stage
            </button>
          </div>
        </div>

        {/* Content sections split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Immersive interactive Tracks List */}
          <div className="lg:col-span-2 bg-gradient-to-br from-surface to-background border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Disc className="text-accent animate-spin-slow" /> Official Tracklist
            </h3>
            <div className="space-y-3">
              {albumTracks.map((track, idx) => (
                <div 
                  key={track.id} 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                >
                  <div className="w-8 text-center text-xs font-black text-text-secondary/50 group-hover:text-accent transition-colors" onClick={() => playTrack(track)}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0" onClick={() => playTrack(track)}>
                    <div className="text-sm font-black tracking-tight text-white truncate">{track.title}</div>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToArtist?.(track.artist);
                      }}
                      className="text-xs text-text-secondary font-bold opacity-60 truncate hover:text-accent hover:underline transition-colors"
                    >
                      {track.artist}
                    </div>
                  </div>
                  
                  {/* Upvote & Rating fire badge */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); upvoteTrack(track.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-text-secondary hover:text-orange-400 border border-white/5 hover:border-orange-500/30 transition-all text-xs font-black"
                  >
                    <Flame size={14} className="group-hover:animate-bounce" />
                    <span>{ratings[track.id] || 0}</span>
                  </button>

                  <div className="text-xs font-mono font-bold text-text-secondary opacity-60">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Studio Behind-the-Scenes Secrets */}
          <div className="space-y-6">
            <div className="bg-surface/30 border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                <Volume2 className="text-accent" /> Live Audio Engine
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black tracking-wider uppercase text-text-secondary">
                    <span>Acoustic Warmth</span>
                    <span className="text-accent">96.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black tracking-wider uppercase text-text-secondary">
                    <span>Bass Alignment</span>
                    <span className="text-accent">88.1%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '88.1%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black tracking-wider uppercase text-text-secondary">
                    <span>Stereo Soundstage</span>
                    <span className="text-accent">100% WIDE</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Liner Notes Toggle and Panel */}
            <div className="bg-surface/30 border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight">Studio Secrets</h3>
                <button 
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="text-xs font-black tracking-wider text-accent uppercase hover:underline"
                >
                  {showSecrets ? "Hide" : "Reveal"}
                </button>
              </div>
              <p className="text-xs font-bold text-text-secondary leading-relaxed opacity-70">
                Unlock exclusive engineering insights, gear lists, and record room diaries directly from the studio session notes.
              </p>
              
              <AnimatePresence>
                {showSecrets && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-white/5 text-xs text-white space-y-4"
                  >
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="font-black text-accent mb-1 uppercase tracking-wider text-[9px]">Recording Secret #1</div>
                      <p className="font-medium opacity-80 leading-relaxed">The main synthesizer line was run through a retro tape deck that was slightly warped, giving it that classic unstable space glow.</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <div className="font-black text-accent mb-1 uppercase tracking-wider text-[9px]">Live Moshpit Vibe</div>
                      <p className="font-medium opacity-80 leading-relaxed">Recorded with real background crowd ambiance captured during a live warehouse performance in late October.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
    </motion.div>
  );
};
