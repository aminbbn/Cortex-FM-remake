import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Share2, Disc, Flame, Users, Sparkles, MapPin, Calendar, Zap, Volume2, MessageSquare, Plus, Music, Radio, Sliders, RefreshCw, Layers, Radio as RadioIcon } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { Button } from '../ui/Button';

interface FloatingParticle {
  id: number;
  emoji: string;
  x: number;
  rotate: number;
  scale: number;
}

interface ArtistProfileProps {
  artistName: string;
  onBack: () => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const ArtistProfile: React.FC<ArtistProfileProps> = ({ artistName, onBack, onNavigateToAlbum }) => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();
  const artistTracks = tracks.filter(t => t.artist === artistName);

  const [hypeLevel, setHypeLevel] = useState(85);
  const [stageColor, setStageColor] = useState<'inferno' | 'cyber' | 'neon'>('inferno');
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [liked, setLiked] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'singles' | 'albums' | 'playlists' | 'radio'>('singles');
  const [chatMessages, setChatMessages] = useState<string[]>([
    "OMGGGG LIVE RIGHT NOW! 🔥",
    "This bass drop is insane!!! 🙌",
    "Are you seeing these laser lights?! ⚡",
    "BEST ALBUM OF THE YEAR!!",
  ]);
  const [newMsg, setNewMsg] = useState("");

  // Artist Radio Tab state
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioBpm, setRadioBpm] = useState(124);
  const [crowdCheerLevel, setCrowdCheerLevel] = useState(65);
  const [bassBoost, setBassBoost] = useState(true);
  const [reverbActive, setReverbActive] = useState(false);
  const [vibeSelected, setVibeSelected] = useState<'concert' | 'cyber-club' | 'lofi-dome'>('concert');
  const [frequencyBars, setFrequencyBars] = useState<number[]>([40, 60, 45, 80, 95, 70, 50, 65, 85, 45, 50, 75, 90, 60, 40]);

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    triggerReaction("🎵");
  };

  const triggerReaction = (emoji: string) => {
    setHypeLevel(prev => Math.min(100, prev + 2));
    const newParticle: FloatingParticle = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10, // percentage from left
      rotate: Math.random() * 60 - 30,
      scale: Math.random() * 0.5 + 0.8
    };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages(prev => [...prev, `You: ${newMsg}`]);
    setNewMsg("");
    setHypeLevel(prev => Math.min(100, prev + 5));
    // Trigger floating response
    triggerReaction("💬");
  };

  // Slowly decay hype level over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHypeLevel(prev => Math.max(60, prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update mock radio wave bars
  useEffect(() => {
    if (!radioPlaying) return;
    const interval = setInterval(() => {
      setFrequencyBars(prev => prev.map(bar => {
        const factor = radioBpm / 120;
        const randomness = Math.random() * 40 - 20;
        const target = Math.max(10, Math.min(100, bar + randomness * factor));
        return target;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [radioPlaying, radioBpm]);

  const getStageGradient = () => {
    switch (stageColor) {
      case 'inferno':
        return 'from-amber-600 via-red-600 to-purple-950';
      case 'cyber':
        return 'from-fuchsia-600 via-pink-600 to-indigo-950';
      case 'neon':
        return 'from-cyan-600 via-teal-600 to-blue-950';
    }
  };

  // Extract unique albums
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

  // Custom playlists containing artist tracks or curated Mixes
  const customPlaylists = [
    {
      id: `pl-${artistName}-essential`,
      name: `This Is ${artistName}`,
      description: `The absolute critical anthems and high-energy live selections of ${artistName}.`,
      coverUrl: artistTracks[0]?.coverUrl || `https://picsum.photos/seed/${artistName}p1/400/400`,
      tracksCount: artistTracks.length
    },
    {
      id: `pl-${artistName}-radio`,
      name: `${artistName} Radio Session`,
      description: `Immersive non-stop radio broadcasts curated around the unique spectrum of ${artistName}.`,
      coverUrl: `https://picsum.photos/seed/${artistName}radio/400/400`,
      tracksCount: artistTracks.length + 4
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 relative overflow-x-hidden min-h-screen">
      {/* Floating Reactions Canvas */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: "100%", x: `${p.x}%`, opacity: 0, scale: p.scale }}
              animate={{ y: "20%", opacity: [0, 1, 1, 0], scale: p.scale * 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ rotate: `${p.rotate}deg` }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Concert Stage Background Banner */}
      <div className="absolute top-0 left-0 right-0 h-[520px] mx-0 overflow-hidden pointer-events-none">
         <div 
           className={`absolute -inset-32 bg-gradient-to-br ${getStageGradient()} opacity-30 blur-[100px] saturate-200 transition-all duration-1000`}
         />
         {/* Dual layered gradient for maximum smooth transition with zero sharp lines */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-95" />
         
         {/* Glowing Laser Beams */}
         <div className="absolute top-0 left-1/4 w-[1.5px] h-full bg-gradient-to-b from-accent/40 to-transparent rotate-[35deg] blur-[2px] animate-pulse" />
         <div className="absolute top-0 right-1/4 w-[2.5px] h-full bg-gradient-to-b from-accent/30 to-transparent -rotate-[25deg] blur-[3px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 pt-8 px-8 md:px-20 lg:px-24 space-y-10">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/5 transition-all text-xs font-black tracking-widest text-white uppercase group shadow-2xl">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Vault
        </button>

        {/* Hero Section - Minimal Perfection */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end w-full">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,69,0,0.3)] border-2 border-white/10 shrink-0 relative group">
            <img src={artistTracks[0]?.coverUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=random&size=256`} alt={artistName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full backdrop-blur-[2px]">
              <Disc className="text-white animate-spin" size={40} />
            </div>
          </div>
          <div className="space-y-4 text-center md:text-left flex-1 pb-4">
            <div className="text-[10px] font-black tracking-[0.3em] text-accent uppercase flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_currentColor]" /> 
              Live Stage Venue
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-white">{artistName}</h1>
            <p className="text-white/60 font-medium text-sm tracking-widest flex items-center justify-center md:justify-start gap-2">
              <Users size={16} className="text-white/40" /> {artistTracks.length * 15324} Live Listeners Worldwide
            </p>
          </div>
        </div>

        {/* Live Audio & Crowd Reaction Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls Panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-surface to-background border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Stage Control Deck</h3>
                  <p className="text-xs font-bold text-text-secondary opacity-70">Direct the live show vibe.</p>
                </div>

                {/* Laser / Lighting Theme selectors */}
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setStageColor('inferno')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${stageColor === 'inferno' ? 'bg-red-500 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    Inferno
                  </button>
                  <button 
                    onClick={() => setStageColor('cyber')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${stageColor === 'cyber' ? 'bg-pink-500 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    Cyber
                  </button>
                  <button 
                    onClick={() => setStageColor('neon')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${stageColor === 'neon' ? 'bg-cyan-500 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    Laser
                  </button>
                </div>
              </div>

              {/* Main High-Energy Stage Buttons */}
              <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">
                {/* Perfectly centered Play Button (Fixes play button vision) */}
                <button 
                  onClick={() => artistTracks.length > 0 && playTrack(artistTracks[0])} 
                  className="w-20 h-20 rounded-full bg-accent hover:bg-white text-background flex items-center justify-center shadow-[0_12px_40px_rgba(255,255,255,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none shrink-0"
                >
                  <Play fill="currentColor" size={32} className="ml-1 text-background group-hover:scale-105 transition-transform" />
                </button>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => triggerReaction("🔥")}
                    className="px-5 py-3 rounded-2xl bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 hover:text-white text-red-400 font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 active:scale-95 shadow-xl"
                  >
                    🔥 Light Flare
                  </button>
                  <button 
                    onClick={() => triggerReaction("🙌")}
                    className="px-5 py-3 rounded-2xl bg-amber-600/10 hover:bg-amber-600 border border-amber-500/20 hover:border-amber-500 hover:text-white text-amber-400 font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 active:scale-95 shadow-xl"
                  >
                    🙌 Hands Up
                  </button>
                  <button 
                    onClick={() => triggerReaction("⚡")}
                    className="px-5 py-3 rounded-2xl bg-cyan-600/10 hover:bg-cyan-600 border border-cyan-500/20 hover:border-cyan-500 hover:text-white text-cyan-400 font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2 active:scale-95 shadow-xl"
                  >
                    ⚡ Laser Burst
                  </button>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY SUB NAVIGATION SUBSECTIONS */}
            <div className="space-y-6 pt-8 border-t border-white/5 flex-1 flex flex-col justify-between">
              {/* Vibe Tabs */}
              <div className="flex border-b border-white/5 pb-2 gap-6 overflow-x-auto">
                {(['singles', 'albums', 'playlists', 'radio'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`relative pb-3 text-xs font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${activeSubTab === tab ? 'text-accent' : 'text-text-secondary hover:text-white'}`}
                  >
                    {tab === 'singles' && '🎵 Singles'}
                    {tab === 'albums' && '💿 Albums'}
                    {tab === 'playlists' && '📋 Playlists'}
                    {tab === 'radio' && '📻 Artist Radio'}
                    
                    {activeSubTab === tab && (
                      <motion.div 
                        layoutId="subTabBorder" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Sub Tab Content Display */}
              <div className="flex-1 pt-4">
                <AnimatePresence mode="wait">
                  {activeSubTab === 'singles' && (
                    <motion.div 
                      key="singles"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2 max-h-[250px] overflow-y-auto pr-2"
                    >
                      {artistTracks.map((track, idx) => (
                        <div 
                          key={track.id} 
                          className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer" 
                          onClick={() => playTrack(track)}
                        >
                          <div className="w-8 text-center text-xs font-black text-text-secondary/50 group-hover:text-accent transition-colors">
                            {idx + 1}
                          </div>
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                            <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play size={16} fill="currentColor" className="text-white ml-0.5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-black tracking-tight truncate text-white group-hover:text-accent transition-colors">{track.title}</div>
                            <div className="text-[10px] font-bold text-text-secondary opacity-60 tracking-wider uppercase mt-0.5">{track.album || 'Single'}</div>
                          </div>
                          <div className="text-xs font-mono font-bold text-text-secondary opacity-60">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      ))}
                      {artistTracks.length === 0 && (
                        <div className="py-8 text-center text-text-secondary text-sm font-bold opacity-60">No singles registered for this artist.</div>
                      )}
                    </motion.div>
                  )}

                  {activeSubTab === 'albums' && (
                    <motion.div 
                      key="albums"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2"
                    >
                      {uniqueAlbums.map((album, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => onNavigateToAlbum?.(album.trackId)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-accent/30 transition-all group cursor-pointer"
                        >
                          <img src={album.coverUrl} className="w-14 h-14 rounded-xl object-cover shadow-lg shrink-0 group-hover:scale-105 transition-transform" alt="" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black tracking-tight truncate text-white group-hover:text-accent transition-colors">{album.name}</h4>
                            <p className="text-[10px] font-bold text-text-secondary opacity-60 tracking-widest mt-1 uppercase">{album.genre} • {album.year}</p>
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-accent/10 group-hover:bg-accent text-accent group-hover:text-background text-[9px] font-black uppercase tracking-widest transition-all">
                            View Album
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeSubTab === 'playlists' && (
                    <motion.div 
                      key="playlists"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2"
                    >
                      {customPlaylists.map((pl) => (
                        <div 
                          key={pl.id} 
                          onClick={() => artistTracks.length > 0 && playTrack(artistTracks[0])}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center overflow-hidden shrink-0">
                            <img src={pl.coverUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black tracking-tight truncate text-white">{pl.name}</h4>
                            <p className="text-[10px] font-bold text-text-secondary opacity-60 tracking-widest mt-1 uppercase">{pl.tracksCount} Tracks</p>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-accent/10 group-hover:bg-accent text-accent group-hover:text-background flex items-center justify-center transition-all">
                            <Play size={14} fill="currentColor" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeSubTab === 'radio' && (
                    <motion.div 
                      key="radio"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-black/30 border border-white/5 p-6 rounded-2xl space-y-6"
                    >
                      {/* Interactive Radio Header & Playback */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              setRadioPlaying(!radioPlaying);
                              setHypeLevel(prev => Math.min(100, prev + 10));
                              triggerReaction("📻");
                            }}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${radioPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-accent text-background hover:scale-105'}`}
                          >
                            {radioPlaying ? <Zap className="animate-spin-slow" size={24} /> : <Play fill="currentColor" className="ml-1" size={24} />}
                          </button>
                          <div>
                            <h4 className="text-sm font-black tracking-tight text-white uppercase">Cortex Radio Transmission</h4>
                            <p className="text-[10px] font-bold text-text-secondary opacity-75 mt-0.5">
                              {radioPlaying ? "🔴 Broadcasting live synthesis loop..." : "⚪ Ready for radio frequency beam..."}
                            </p>
                          </div>
                        </div>

                        {/* Sound Vibe Presets Selector */}
                        <div className="flex gap-2">
                          {(['concert', 'cyber-club', 'lofi-dome'] as const).map(v => (
                            <button
                              key={v}
                              onClick={() => {
                                setVibeSelected(v);
                                setRadioBpm(v === 'concert' ? 124 : v === 'cyber-club' ? 138 : 84);
                                triggerReaction("⚡");
                              }}
                              className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${vibeSelected === v ? 'bg-accent text-background font-extrabold' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                            >
                              {v === 'concert' && 'Moshpit'}
                              {v === 'cyber-club' && 'Cyber Club'}
                              {v === 'lofi-dome' && 'Lofi Dome'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Equalizer frequency bar visualizer */}
                      <div className="h-16 flex items-end gap-1.5 bg-black/20 p-3 rounded-xl border border-white/5 relative overflow-hidden">
                        {frequencyBars.map((barHeight, idx) => (
                          <motion.div 
                            key={idx}
                            animate={{ height: radioPlaying ? `${barHeight}%` : '20%' }}
                            transition={{ type: "spring", stiffness: 150, damping: 15 }}
                            className={`flex-1 rounded-t-md ${radioPlaying ? 'bg-accent' : 'bg-text-secondary/20'}`}
                            style={{ boxShadow: radioPlaying ? '0 0 10px rgba(191, 193, 194, 0.4)' : 'none' }}
                          />
                        ))}
                      </div>

                      {/* Controls Sliders */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {/* Radio BPM Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-text-secondary">
                            <span>Tuning Tempo</span>
                            <span className="text-accent">{radioBpm} BPM</span>
                          </div>
                          <input 
                            type="range" 
                            min="60" 
                            max="180" 
                            value={radioBpm}
                            onChange={(e) => setRadioBpm(parseInt(e.target.value))}
                            className="w-full accent-accent bg-white/10 rounded-lg appearance-none h-1.5"
                          />
                        </div>

                        {/* Crowd Noise Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-text-secondary">
                            <span>Crowd Cheer</span>
                            <span className="text-accent">{crowdCheerLevel}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={crowdCheerLevel}
                            onChange={(e) => {
                              setCrowdCheerLevel(parseInt(e.target.value));
                              if (parseInt(e.target.value) > 80) triggerReaction("🙌");
                            }}
                            className="w-full accent-accent bg-white/10 rounded-lg appearance-none h-1.5"
                          />
                        </div>

                        {/* Toggle Buttons */}
                        <div className="flex items-center justify-around gap-4 pt-1">
                          <button 
                            onClick={() => setBassBoost(!bassBoost)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${bassBoost ? 'bg-accent/10 border border-accent/30 text-accent font-extrabold' : 'bg-white/5 text-text-secondary'}`}
                          >
                            Bass Boost
                          </button>
                          <button 
                            onClick={() => {
                              setReverbActive(!reverbActive);
                              triggerReaction("⚡");
                            }}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${reverbActive ? 'bg-accent/10 border border-accent/30 text-accent font-extrabold' : 'bg-white/5 text-text-secondary'}`}
                          >
                            Reverb Delay
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Crowd Fan Feed Section */}
          <div className="bg-surface/30 border border-white/5 rounded-[2rem] p-6 flex flex-col h-[520px] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <MessageSquare className="text-accent animate-pulse" size={18} /> Live Crowd Feed
              </h3>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest animate-pulse">Online</span>
            </div>

            {/* Scrollable Chat Message List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-3 text-xs leading-relaxed">
                  <div className="font-black text-accent/80 mb-1 flex items-center justify-between">
                    <span>{msg.startsWith("You:") ? "You (Vibe Master)" : `Fan_${1000 + idx}`}</span>
                    <span className="text-[8px] opacity-40 font-mono">Just now</span>
                  </div>
                  <p className="font-medium text-white/95">{msg.replace("You:", "")}</p>
                </div>
              ))}
            </div>

            {/* Chat form input */}
            <form onSubmit={handleSendChat} className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Shout into the crowd..." 
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-accent transition-all"
              />
              <button type="submit" className="px-4 py-3 bg-accent text-background rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Live Tour Dates & Interactive Events Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="bg-gradient-to-br from-surface to-background border border-white/5 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-accent" /> Live Cyberpunk World Tour
            </h3>
            <div className="space-y-4">
              {[
                { city: "Neo-Tokyo, JP", venue: "Shibuya Cyberdome", date: "JUL 15", soldOut: true },
                { city: "Berlin, DE", venue: "Berghain Live Arena", date: "JUL 22", soldOut: true },
                { city: "London, UK", venue: "Wembley Hyperstage", date: "AUG 05", soldOut: false },
                { city: "New York, US", venue: "Brooklyn Neon Hangar", date: "AUG 18", soldOut: false }
              ].map((tour, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 hover:border-accent/20 rounded-2xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="text-center bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-xl font-black text-xs text-accent">
                      {tour.date}
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight">{tour.city}</h4>
                      <p className="text-[10px] font-bold text-text-secondary opacity-60 mt-0.5">{tour.venue}</p>
                    </div>
                  </div>
                  {tour.soldOut ? (
                    <span className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                  ) : (
                    <button onClick={() => alert("Redirecting to cyber ticket office...")} className="px-3 py-1.5 rounded-xl bg-accent text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                      Tickets
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Crowd Fan Wall & Shoutouts */}
          <div className="bg-gradient-to-br from-surface to-background border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Sparkles size={20} className="text-accent" /> Special Fan Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-black/20 border border-white/5 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-lg">🔥</div>
                <h4 className="text-xs font-black tracking-tight">Super Fan</h4>
                <p className="text-[9px] text-text-secondary font-bold opacity-60">Attended 15+ live stream sessions</p>
              </div>
              <div className="p-5 bg-black/20 border border-white/5 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-lg">👑</div>
                <h4 className="text-xs font-black tracking-tight">Vibe Controller</h4>
                <p className="text-[9px] text-text-secondary font-bold opacity-60">Overheated stage 5 times</p>
              </div>
              <div className="p-5 bg-black/20 border border-white/5 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto text-lg">⚡</div>
                <h4 className="text-xs font-black tracking-tight">Laser Master</h4>
                <p className="text-[9px] text-text-secondary font-bold opacity-60">Activated all stage colors</p>
              </div>
              <div className="p-5 bg-black/20 border border-white/5 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto text-lg">📣</div>
                <h4 className="text-xs font-black tracking-tight">Shoutouter</h4>
                <p className="text-[9px] text-text-secondary font-bold opacity-60">Wrote a live cheer feed comment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
