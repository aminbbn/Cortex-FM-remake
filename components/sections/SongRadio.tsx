import React, { useMemo } from "react";
import { useMusic } from "../../context/MusicContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Radio, Clock, Sparkles, Heart, MoreHorizontal } from "lucide-react";
import { Track } from "../../types";
import { TrackDropdown } from "../ui/TrackDropdown";

const ambientCircleVariants = {
  playing: {
    scale: [1, 1.12, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }
  },
  paused: {
    scale: 1,
    opacity: 0.15,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    }
  }
};

const dotVariants = {
  playing: (index: number) => {
    const angle = (index / 64) * 2 * Math.PI;
    const delay = (index % 8) * 0.15;
    const duration = 0.6 + (index % 3) * 0.2;
    return {
      scale: [1, 1.8, 0.9, 1.8, 1],
      opacity: [0.5, 1, 0.6, 1, 0.5],
      x: [0, 12 * Math.cos(angle), -4 * Math.cos(angle), 15 * Math.cos(angle), 0],
      y: [0, 12 * Math.sin(angle), -4 * Math.sin(angle), 15 * Math.sin(angle), 0],
      transition: {
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }
    };
  },
  paused: {
    scale: 1,
    opacity: 0.35,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    }
  }
};

const outerGlowVariants = {
  playing: {
    scale: [1, 1.05, 1],
    opacity: [0.2, 0.45, 0.2],
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "easeInOut",
    }
  },
  paused: {
    scale: 1,
    opacity: 0.15,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    }
  }
};

const AudioWaveRing: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const dotCount = 64;
  return (
    <div className="absolute -inset-16 flex items-center justify-center pointer-events-none z-0 select-none">
      <svg className="w-full h-full" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="wave-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Soft pulsing ambient glow behind the record */}
        <motion.circle
          cx="200"
          cy="200"
          r="135"
          fill="url(#wave-glow)"
          variants={ambientCircleVariants}
          animate={isPlaying ? "playing" : "paused"}
        />

        {/* 1. Concentric Sonar Ripples (Elegantly propagating outward like sound waves) */}
        {isPlaying && [0, 1, 2].map((i) => (
          <motion.circle
            key={`ripple-${i}`}
            cx="200"
            cy="200"
            r={135}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: 1.6,
              opacity: 0,
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
          />
        ))}

        {/* 2. Static minimalist high-fidelity guidance rings */}
        <circle
          cx="200"
          cy="200"
          r="135"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity={isPlaying ? 0.25 : 0.12}
          className="transition-opacity duration-500"
        />
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 6"
          strokeOpacity={isPlaying ? 0.15 : 0.08}
          className="transition-opacity duration-500"
        />

        {/* 3. The Constellation Equalizer (Micro-dots dancing rhythmically, no virus spikes) */}
        {Array.from({ length: dotCount }).map((_, index) => {
          const angle = (index / dotCount) * 2 * Math.PI;
          
          // Base position of the micro-dot on the outer circle
          const baseRadius = 142;
          const x = 200 + baseRadius * Math.cos(angle);
          const y = 200 + baseRadius * Math.sin(angle);
          
          return (
            <motion.circle
              key={`dot-${index}`}
              cx={x}
              cy={y}
              r="2"
              fill="var(--color-accent)"
              custom={index}
              variants={dotVariants}
              animate={isPlaying ? "playing" : "paused"}
            />
          );
        })}
      </svg>
    </div>
  );
};

interface SongRadioProps {
  seedTrackId: string;
  onBack: () => void;
  onNavigateToArtist?: (artist: string) => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const SongRadio: React.FC<SongRadioProps> = ({
  seedTrackId,
  onBack,
  onNavigateToArtist,
  onNavigateToAlbum,
}) => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    likedTracks,
    toggleLikeTrack,
    addToQueue,
    clearQueue,
  } = useMusic();

  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(null);

  // Find the seed track
  const seedTrack = useMemo(() => {
    return tracks.find((t) => t.id === seedTrackId) || tracks[0];
  }, [tracks, seedTrackId]);

  // Generate recommendations based on the seed track's genre/mood
  const radioTracks = useMemo(() => {
    if (!seedTrack) return [];
    // Select other tracks of the same genre, or just random ones, shuffling them
    const filtered = tracks.filter((t) => t.id !== seedTrack.id && t.genre === seedTrack.genre);
    // If not enough, fill with other tracks
    const pool = filtered.length >= 5 ? filtered : tracks.filter((t) => t.id !== seedTrack.id);
    // Shuffle the pool and take 6 tracks
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [tracks, seedTrack]);

  // Check if this station is currently playing
  const isStationActive = useMemo(() => {
    return currentTrack?.id === seedTrack?.id && isPlaying;
  }, [currentTrack, isPlaying, seedTrack]);

  // Check if we are playing any track from this station (seed track or recommended queue matches)
  const isPlayingThisStation = useMemo(() => {
    if (!isPlaying || !currentTrack) return false;
    return currentTrack.id === seedTrack?.id || radioTracks.some((t) => t.id === currentTrack.id);
  }, [isPlaying, currentTrack, seedTrack, radioTracks]);

  // Launch the station
  const handleLaunchStation = () => {
    if (!seedTrack) return;

    if (isStationActive) {
      setIsPlaying(false);
    } else {
      // Clear queue, load seed track and recommendations, start playing
      clearQueue();
      setCurrentTrack(seedTrack);
      radioTracks.forEach((t) => addToQueue(t));
      setIsPlaying(true);
      window.dispatchEvent(new CustomEvent("app:toast", { detail: `Neural Station "${seedTrack.title} Radio" launched!` }));
    }
  };

  const handlePlayRecommendedTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-10 text-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-8 self-start"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* Hero section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        {/* Spinning holographic record */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Dynamic Audio Wave Ring */}
            <AudioWaveRing isPlaying={isPlayingThisStation} />

            {/* Pulsing neon outer rings */}
            <motion.div
              variants={outerGlowVariants}
              animate={isPlayingThisStation ? "playing" : "paused"}
              className="absolute -inset-6 rounded-full bg-accent/20 blur-2xl pointer-events-none z-0"
            />
            
            <div
              className="w-full h-full rounded-full bg-[#0d0d0d] border-4 border-white/10 p-2 shadow-2xl relative flex items-center justify-center overflow-hidden z-10"
              style={{
                animation: "spin 16s linear infinite",
                animationPlayState: isPlayingThisStation ? "running" : "paused",
              }}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="absolute inset-12 rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/5" />
              <div className="absolute inset-20 rounded-full border border-white/5" />
              <div className="absolute inset-24 rounded-full border border-white/5" />

              {/* Cover thumbnail in center */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden relative border-4 border-[#0d0d0d] z-10">
                <img
                  src={isPlayingThisStation && currentTrack ? currentTrack.coverUrl : seedTrack?.coverUrl}
                  alt={isPlayingThisStation && currentTrack ? currentTrack.title : seedTrack?.title}
                  className="w-full h-full object-cover"
                />
                {/* Vinyl center hole */}
                <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-[#0d0d0d] border border-white/20 shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
              </div>
            </div>

            {/* Neural antenna icon */}
            <div className="absolute -bottom-2 -right-2 bg-accent text-background p-3 rounded-2xl shadow-xl border border-accent/20 z-20">
              <Radio size={20} className={isPlayingThisStation ? "animate-pulse" : ""} />
            </div>
          </div>
        </div>

        {/* Station Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-black uppercase tracking-wider">
              <Sparkles size={10} /> Neural Algorithmic Stream
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
              {seedTrack?.title} <span className="text-accent font-light">Radio</span>
            </h1>
            <p className="text-white/60 text-sm font-bold tracking-wide">
              Station Seed: <span className="text-white hover:underline cursor-pointer" onClick={() => onNavigateToArtist?.(seedTrack?.artist)}>{seedTrack?.artist}</span> — {seedTrack?.album}
            </p>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
            The Cortex neural engine has synthesized a high-fidelity algorithmic transmission mapped to the sonic signature, tempo, and frequency spectrum of <strong className="text-white">{seedTrack?.title}</strong>. Expect dark, synthesized bass loops, warm analog pads, and cybernetic rhythmic structures.
          </p>

          <div className="flex flex-wrap gap-8 py-2 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-white/40 uppercase text-[9px] font-black">Base Frequency</div>
              <div className="text-white font-bold">{seedTrack?.genre}</div>
            </div>
            <div className="space-y-1">
              <div className="text-white/40 uppercase text-[9px] font-black">Pacing Rate</div>
              <div className="text-white font-bold">{seedTrack?.bpm} BPM</div>
            </div>
            <div className="space-y-1">
              <div className="text-white/40 uppercase text-[9px] font-black">Coherence Vector</div>
              <div className="text-white font-bold">98.2% Neural Match</div>
            </div>
          </div>

          {/* LAUNCH BUTTON */}
          <button
            onClick={handleLaunchStation}
            className={`px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all duration-300 ${
              isStationActive
                ? "bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30"
                : "bg-accent text-background hover:bg-accent/90 hover:scale-105"
            }`}
          >
            {isStationActive ? (
              <>
                <Pause fill="currentColor" size={16} /> Stop Station
              </>
            ) : (
              <>
                <Play fill="currentColor" size={16} /> Launch Neural Station
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommended Neural Queue */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
          <Sparkles size={18} className="text-accent" /> Algoridmic Matches
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {radioTracks.map((track) => {
            const isLiked = likedTracks.includes(track.id);
            const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

            return (
              <motion.div
                key={track.id}
                whileHover={{ y: -2 }}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group relative"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handlePlayRecommendedTrack(track)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                  >
                    {isCurrentlyPlaying ? (
                      <Pause size={16} className="text-accent fill-current" />
                    ) : (
                      <Play size={16} className="text-accent fill-current" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => handlePlayRecommendedTrack(track)}
                    className={`text-sm font-black truncate cursor-pointer hover:text-accent transition-colors ${
                      isCurrentlyPlaying ? "text-accent" : "text-white"
                    }`}
                  >
                    {track.title}
                  </h4>
                  <p
                    onClick={() => onNavigateToArtist?.(track.artist)}
                    className="text-xs text-white/40 font-bold truncate cursor-pointer hover:text-accent transition-all"
                  >
                    {track.artist}
                  </p>
                </div>

                <span className="text-xs text-white/30 font-mono shrink-0 hidden sm:block">
                  {Math.floor(track.duration / 60)}:
                  {String(track.duration % 60).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeTrack(track.id);
                    }}
                    className={`p-2 rounded-full hover:bg-white/5 transition-all ${
                      isLiked ? "text-accent" : "text-white/30 hover:text-white"
                    }`}
                  >
                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === track.id ? null : track.id);
                      }}
                      className="p-2 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    <AnimatePresence>
                      {activeDropdownId === track.id && (
                        <TrackDropdown
                          track={track}
                          currentArtistPage={track.artist}
                          onClose={() => setActiveDropdownId(null)}
                          align="right"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
