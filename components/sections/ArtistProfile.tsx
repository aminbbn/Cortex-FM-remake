import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Heart, Share2, Disc, Users, Sparkles, Zap,
  MessageSquare, Music, Radio as RadioIcon, Layers,
  Verified, TrendingUp, Clock, ChevronRight, Pause,
  MoreHorizontal, ListPlus, User, Info
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

interface ArtistProfileProps {
  artistName: string;
  onBack: () => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const ArtistProfile: React.FC<ArtistProfileProps> = ({ artistName, onBack, onNavigateToAlbum }) => {
  const { tracks, setCurrentTrack, setIsPlaying, isPlaying, currentTrack } = useMusic();
  const artistTracks = tracks.filter(t => t.artist === artistName);
  const meterBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [isRadioActive, setIsRadioActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { likedTracks, toggleLikeTrack } = useMusic();

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const isArtistPlaying = isPlaying && artistTracks.some(t => t.id === currentTrack?.id);

  const toggleArtistPlay = () => {
    if (isArtistPlaying) {
      setIsPlaying(false);
    } else if (artistTracks.length > 0) {
      playTrack(artistTracks[0]);
    }
  };

  // Sticky mini-header on scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHeaderVisible(el.scrollTop > 320);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null);
      setHeaderMenuOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Link copied to clipboard");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleRadio = () => {
    if (isRadioActive) {
      setIsRadioActive(false);
      setIsPlaying(false);
    } else {
      setIsRadioActive(true);
      setCurrentTrack({
        id: 'radio-lazerhawk',
        title: `Non-Stop ${artistName}`,
        artist: artistName,
        album: 'Live Stream',
        coverUrl: bannerUrl,
        duration: 0,
        genre: artistTracks[0]?.genre || 'Electronic',
        mood: 'High Energy',
        bpm: 120,
        audioUrl: artistTracks[0]?.audioUrl, // Mock with an actual valid audio URL
        isRadio: true
      });
      setIsPlaying(true);
    }
  };

  const isCortexMixPlaying = isPlaying && currentTrack?.id === 'cortex-mix';

  const toggleCortexMix = () => {
    if (isCortexMixPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack({
        id: 'cortex-mix',
        title: `${artistName} Signature Mix`,
        artist: 'Cortex Intelligence',
        album: 'Curated Mix',
        coverUrl: artistAvatarUrl,
        duration: 3840, // 1h 4m
        genre: artistTracks[0]?.genre || 'Electronic',
        mood: 'Focus',
        bpm: 100,
        audioUrl: artistTracks[0]?.audioUrl
      });
      setIsPlaying(true);
    }
  };

  // Audio meter
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    let currentData = new Uint8Array(32);

    const handleMeterUpdate = (e: Event) => {
      currentData = (e as CustomEvent).detail as Uint8Array;
    };

    const renderMeter = () => {
      const bars = meterBarsRef.current;
      const numBars = 40;
      
      for (let i = 0; i < numBars; i++) {
        const bar = bars[i];
        if (!bar) continue;
        
        let heightPercent = 8;
        let opacity = 0.2;
        
        if (isPlaying && currentData && currentData.length > 0) {
          const dataIndex = Math.floor((i / numBars) * currentData.length);
          const value = currentData[dataIndex] || 0;
          heightPercent = Math.max(8, (value / 255) * 100);
          opacity = Math.max(0.25, value / 255);
        } else {
          // Idle dynamic wave animation
          const wave = Math.sin(time + i * 0.3) * 0.5 + 0.5;
          heightPercent = 8 + wave * 25; // 8% to 33% height
          opacity = 0.15 + wave * 0.25;
        }
        
        bar.style.height = `${heightPercent}%`;
        bar.style.opacity = `${opacity}`;
      }
      
      if (!isPlaying) {
         time += 0.05;
      }
      animationFrameId = requestAnimationFrame(renderMeter);
    };

    window.addEventListener('audioMeterUpdate', handleMeterUpdate);
    animationFrameId = requestAnimationFrame(renderMeter);

    return () => {
      window.removeEventListener('audioMeterUpdate', handleMeterUpdate);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const uniqueAlbums = Array.from(new Set(artistTracks.map(t => t.album))).map(albumName => {
    const trackForAlbum = artistTracks.find(t => t.album === albumName) || artistTracks[0];
    return {
      name: albumName,
      trackId: trackForAlbum?.id || '1',
      coverUrl: trackForAlbum?.coverUrl || `https://picsum.photos/seed/${albumName}/400/400`,
      genre: trackForAlbum?.genre || 'Electronic',
      year: '2024'
    };
  });

  const customPlaylists = [
    {
      id: `pl-${artistName}-essential`,
      name: `This Is ${artistName}`,
      description: `The critical anthems and high-energy live selections.`,
      coverUrl: artistTracks[0]?.coverUrl || `https://picsum.photos/seed/${artistName}p1/400/400`,
      tracksCount: artistTracks.length
    },
    {
      id: `pl-${artistName}-radio`,
      name: `${artistName} Radio Session`,
      description: `Non-stop radio broadcasts curated around the unique spectrum.`,
      coverUrl: `https://picsum.photos/seed/${artistName}radio/400/400`,
      tracksCount: artistTracks.length + 4
    }
  ];

  const comments = [
    { id: 1, user: "NeonRider", text: "This artist literally rewired my brain.", likes: 124 },
    { id: 2, user: "SynthWave_99", text: "The production on the latest album is out of this world.", likes: 89 },
    { id: 3, user: "CyberPunk_2077", text: "Listening to this on a late night drive is an experience.", likes: 56 },
  ];

  const fansAlsoLike = [
    { name: "Kavinsky", coverUrl: `https://ui-avatars.com/api/?name=Kavinsky&background=random&size=256` },
    { name: "Daft Punk", coverUrl: `https://ui-avatars.com/api/?name=Daft+Punk&background=random&size=256` },
    { name: "Justice", coverUrl: `https://ui-avatars.com/api/?name=Justice&background=random&size=256` },
  ];

  const artistAvatarUrl = artistTracks[0]?.coverUrl
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=random&size=512`;
  const bannerUrl = `https://picsum.photos/seed/${artistName}-banner/1600/600`;
  const listenerCount = (artistTracks.length * 15324).toLocaleString();

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
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-3 bg-background/80 backdrop-blur-xl border-b border-white/5"
          >
            <button onClick={onBack} className="text-white/50 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">
              ← Back
            </button>
            <div className="w-px h-4 bg-white/10" />
            <img src={artistAvatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-black tracking-tight text-white flex-1">{artistName}</span>
            <button
              onClick={toggleArtistPlay}
              className="w-9 h-9 rounded-full bg-accent text-background flex items-center justify-center hover:scale-105 transition-transform shrink-0"
            >
              {isArtistPlaying
                ? <Pause fill="currentColor" size={14} />
                : <Play fill="currentColor" size={14} className="ml-0.5" />
              }
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── BANNER + PROFILE HEADER ────────────────────────────────────── */}
      <div className="relative w-full">
        {/* Banner image */}
        <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden">
          <img
            src={bannerUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark scrim — stronger at bottom so profile info stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          {/* Accent tint layer */}
          <div className="absolute inset-0 bg-accent/10 mix-blend-color" />

          {/* Back button — lives inside banner */}
          <button
            onClick={onBack}
            className="absolute top-5 left-5 md:top-6 md:left-8 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 transition-all text-[10px] font-black tracking-[0.2em] uppercase text-white/80 hover:text-white group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span> Back
          </button>

          {/* Share / More — top right */}
          <div className="absolute top-5 right-5 md:top-6 md:right-8 flex items-center gap-2">
            <button onClick={handleShare} className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all text-white/70 hover:text-white">
              <Share2 size={14} />
            </button>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setHeaderMenuOpen(!headerMenuOpen); }}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all text-white/70 hover:text-white"
              >
                <MoreHorizontal size={14} />
              </button>
              <AnimatePresence>
                {headerMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, transformOrigin: 'top right' }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                  >
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors">Report</button>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors">Block</button>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors">View Credits</button>
                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors">Pin to Home</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Profile section: avatar + info + actions */}
        <div className="relative px-6 md:px-10 lg:px-16 -mt-16 md:-mt-20 pb-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-7">

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-2xl">
                <img src={artistAvatarUrl} alt={artistName} className="w-full h-full object-cover" />
              </div>
              {/* Live / online badge */}
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-background text-[10px] font-black tracking-widest uppercase shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
                Live
              </div>
            </motion.div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pb-1 md:pb-3">
              {/* Verified label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-1.5 text-accent text-[10px] font-black tracking-[0.3em] uppercase mb-2"
              >
                <Verified size={12} />
                Verified Artist
              </motion.div>

              {/* Artist name */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white mb-4"
              >
                {artistName}
              </motion.h1>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-white/50"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-accent" />
                  <span className="text-white">{listenerCount}</span>&nbsp;monthly listeners
                </span>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Disc size={12} className="text-accent" />
                  <span className="text-white">{uniqueAlbums.length}</span>&nbsp;albums
                </span>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Layers size={12} className="text-accent" />
                  <span className="text-white">{artistTracks.length}</span>&nbsp;tracks
                </span>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-accent" />
                  Genre: <span className="text-white ml-1">{artistTracks[0]?.genre || 'Electronic'}</span>
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
                onClick={toggleArtistPlay}
                className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] aspect-square rounded-full bg-accent text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_24px_rgba(255,255,255,0.15)] shrink-0"
              >
                {isArtistPlaying
                  ? <Pause fill="currentColor" size={22} />
                  : <Play fill="currentColor" size={22} className="ml-1" />
                }
              </button>

              {/* Follow */}
              <button
                onClick={() => setIsFollowing(f => !f)}
                className={`px-5 py-2.5 rounded-full border font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  isFollowing
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              {/* Like */}
              <button className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all">
                <Heart size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full">

        {/* ─── THE VAULT (Track List) ────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Popular</h2>
              <p className="text-xs font-bold text-white/30 tracking-widest uppercase">Decoded Frequencies</p>
            </div>
            <span className="hidden md:flex items-center gap-1.5 text-xs font-mono text-white/25">
              <Layers size={12} /> {artistTracks.length} tracks
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 mt-2">
            {artistTracks.map((track, i) => {
              const isCurrentlyPlaying = isPlaying && currentTrack?.id === track.id;
              // Synthesize a realistic-looking play count
              const playCount = (Math.floor(8000000 / (i + 1.2)) + 3421).toLocaleString('en-US');
              const isLiked = likedTracks.includes(track.id);
              
              return (
                <motion.div
                  key={track.id}
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
                    
                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 relative">
                       <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                       <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                       <h3 className={`text-sm font-bold truncate ${isCurrentlyPlaying ? 'text-accent' : 'text-white'}`}>
                         {track.title}
                       </h3>
                       <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-xs text-white/40 truncate">{playCount} plays</span>
                         <span className="w-1 h-1 rounded-full bg-white/20" />
                         <span className="text-[10px] text-white/30 uppercase tracking-widest">{track.genre}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleLikeTrack(track.id); }}
                       className={`${isLiked ? 'text-accent opacity-100 block' : 'text-white/30 hover:text-white opacity-0 group-hover:opacity-100 hidden sm:block'} transition-colors`}
                     >
                       <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                     </button>
                     <span className="text-xs text-white/40 font-mono w-10 text-right">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
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
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             transition={{ duration: 0.15 }}
                             className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                           >
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Added to playlist'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4">+</div> Add to playlist <ChevronRight size={14} className="ml-auto opacity-50"/></button>
                             <button onClick={(e) => { e.stopPropagation(); toggleLikeTrack(track.id); setToastMessage(isLiked ? 'Removed from Liked Songs' : 'Saved to your Liked Songs'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><Heart size={14} /></div> {isLiked ? 'Remove from Liked Songs' : 'Save to your Liked Songs'}</button>
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Added to queue'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><ListPlus size={14} /></div> Add to queue</button>
                             <div className="w-full h-px bg-white/10 my-1" />
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Starting song radio'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><RadioIcon size={14} /></div> Go to song radio</button>
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Going to artist'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><User size={14} /></div> Go to artist</button>
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Going to album'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><Disc size={14} /></div> Go to album</button>
                             <button onClick={(e) => { e.stopPropagation(); setToastMessage('Viewing credits'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><Info size={14} /></div> View credits</button>
                             <div className="w-full h-px bg-white/10 my-1" />
                             <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); setToastMessage('Link copied to clipboard'); setActiveDropdownId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"><div className="w-4"><Share2 size={14} /></div> Share <ChevronRight size={14} className="ml-auto opacity-50"/></button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── CORTEX SIGNATURE MIX ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-16"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/8 bg-black/40 backdrop-blur-2xl flex flex-col md:flex-row">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/8">
              <div>
                <div className="flex items-center gap-2 text-accent text-[10px] font-black tracking-[0.3em] uppercase mb-3">
                  <Sparkles size={12} className="animate-pulse" /> Cortex Intelligence
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight mb-3">
                  {artistName} <br />
                  <span className="text-white/35">Signature Mix</span>
                </h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  An hour of seamless algorithmically-blended audio — deepest cuts fused with your exact sonic taste.
                </p>
              </div>
              <div className="mt-7 flex items-center gap-4">
                <button
                  onClick={toggleCortexMix}
                  className="w-12 h-12 min-w-[3rem] min-h-[3rem] aspect-square rounded-full bg-accent text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
                >
                  {isCortexMixPlaying ? (
                    <Pause fill="currentColor" size={18} />
                  ) : (
                    <Play fill="currentColor" size={18} className="ml-0.5" />
                  )}
                </button>
                <div>
                  <div className="text-xs font-black tracking-widest uppercase text-white">{isCortexMixPlaying ? 'Playing' : 'Play Mix'}</div>
                  <div className="text-[10px] font-mono text-white/40 mt-0.5">1H 04M · SEAMLESS</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-3/5 p-8 md:p-10 flex items-end justify-center overflow-hidden">
              <div className="w-full flex items-end gap-1 h-24 mix-blend-screen">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    ref={el => meterBarsRef.current[i] = el}
                    className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-full transition-[height] duration-75"
                    style={{ height: '8%', opacity: 0.2 }}
                  />
                ))}
              </div>
              <div className="absolute bottom-6 right-8 text-[9px] font-mono text-white/20 tracking-[0.2em]">
                CORTEX_AI · GENERATED
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── ALBUMS ───────────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <Disc size={20} className="text-accent" /> Albums
            </h2>
            <button onClick={() => setShowAllAlbums(!showAllAlbums)} className="flex items-center gap-1 text-xs font-bold text-white/40 hover:text-white transition-colors">
              {showAllAlbums ? 'Collapse' : 'See all'} <ChevronRight size={14} className={`transition-transform duration-300 ${showAllAlbums ? 'rotate-90' : ''}`} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(showAllAlbums ? uniqueAlbums : uniqueAlbums.slice(0, 4)).map((album, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onNavigateToAlbum?.(album.trackId)}
                className="group cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-xl bg-white/5">
                  <img src={album.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-accent text-background flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-200">
                      <Play fill="currentColor" className="ml-0.5" size={18} />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-black tracking-tight truncate group-hover:text-accent transition-colors">{album.name}</h3>
                <p className="text-[10px] font-bold text-white/35 tracking-widest uppercase mt-1">{album.genre} · {album.year}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── CURATED MIXES + RADIO ─────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5 mb-6 shrink-0">
              <Music size={20} className="text-accent" /> Curated Mixes
            </h2>
            <div className="space-y-3 flex-1">
              {customPlaylists.map((pl, idx) => {
                const isMixPlaying = isPlaying && currentTrack?.album === pl.name;
                return (
                  <motion.div
                    key={pl.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    onClick={() => {
                      setCurrentTrack({
                        id: pl.id,
                        title: pl.name,
                        artist: artistName,
                        album: pl.name,
                        coverUrl: pl.coverUrl,
                        duration: 3600,
                        genre: 'Mix',
                        mood: 'Continuous',
                        bpm: 120,
                        audioUrl: artistTracks[0]?.audioUrl
                      });
                      setIsPlaying(true);
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.2] transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative shadow-md">
                      <img src={pl.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play fill="currentColor" size={14} className="ml-0.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black tracking-tight truncate">{pl.name}</h3>
                      <p className="text-xs text-white/45 mt-0.5 truncate">{pl.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px] font-bold text-accent tracking-widest uppercase">{pl.tracksCount} Tracks</p>
                        {isMixPlaying && (
                          <div className="flex items-end justify-center gap-[2px] h-2">
                            <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-accent rounded-full" />
                            <motion.div animate={{ height: [6, 3, 6] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-0.5 bg-accent rounded-full" />
                            <motion.div animate={{ height: [3, 5, 3] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-accent rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5 mb-6 shrink-0">
              <RadioIcon size={20} className="text-accent" /> Live Radio
            </h2>
            <div className={`flex-1 bg-gradient-to-br ${isRadioActive ? 'from-accent/20 to-accent/5 border-accent/30' : 'from-white/8 to-white/[0.02] border-white/8'} p-7 rounded-3xl border relative overflow-hidden group flex flex-col justify-between min-h-[220px] transition-colors duration-500`}>
              <div className="absolute top-0 right-0 p-6 opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Zap size={80} className={isRadioActive ? 'text-accent drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight mb-1.5">Non-Stop {artistName}</h3>
                <p className="text-sm text-white/45 max-w-xs leading-relaxed">Continuous algorithmic mix exploring similar frequencies, influences, and deep cuts.</p>
              </div>
              <button 
                onClick={toggleRadio}
                className={`mt-6 self-start px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 ${isRadioActive ? 'bg-accent text-background' : 'bg-white text-black'}`}
              >
                {isRadioActive ? (
                  <>
                    <Pause size={13} fill="currentColor" /> Stop Station
                  </>
                ) : (
                  <>
                    <RadioIcon size={13} /> Launch Station
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── FANS ALSO LIKE + COMMENTS ─────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-white/[0.05]">

          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5 mb-6 shrink-0">
              <Users size={20} className="text-accent" /> Fans Also Listen To
            </h2>
            <div className="grid grid-cols-3 gap-4 flex-1 content-start">
              {[
                { name: "Kavinsky", img: "https://picsum.photos/seed/kav/400/400", time: "2h ago" },
                { name: "Daft Punk", img: "https://picsum.photos/seed/daft/400/400", time: "5h ago" },
                { name: "Justice", img: "https://picsum.photos/seed/justice/400/400", time: "1d ago" },
              ].map((artist, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer group text-center"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent/60 shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-1 transition-all duration-500">
                    <img src={artist.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={artist.name} />
                  </div>
                  <h3 className="text-xs font-black tracking-tight truncate w-full group-hover:text-accent transition-colors">{artist.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5 mb-6 shrink-0">
              <MessageSquare size={20} className="text-accent" /> Top Comments
            </h2>
            <div className="space-y-3 flex-1">
              {[
                { id: 1, user: "NeonRider", text: "This artist literally rewired my brain.", likes: 124, time: "2h ago" },
                { id: 2, user: "SynthWave_99", text: "The production on the latest album is out of this world.", likes: 89, time: "5h ago" },
                { id: 3, user: "CyberPunk_2077", text: "Listening to this on a late night drive is an experience.", likes: 56, time: "1d ago" },
              ].map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-black text-accent">
                        {comment.user.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white/60 mr-2">{comment.user}</span>
                        <span className="text-[10px] text-white/30 font-mono">{comment.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-[10px] font-bold text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100">
                        Reply
                      </button>
                      <button className="flex items-center gap-1.5 text-white/25 hover:text-accent transition-colors">
                        <Heart size={12} />
                        <span className="text-[10px] font-mono">{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed">{comment.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};