
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Volume2, VolumeX, Maximize2, Minimize2, ListMusic, Heart, Plus, MoreHorizontal } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerBarProps {
  onNavigateToArtist?: (artist: string) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ onNavigateToArtist }) => {
  const { 
    currentTrack, isPlaying, setIsPlaying,
    nextTrack, prevTrack, toggleShuffle, toggleRepeat, isShuffling, repeatMode,
    likedTracks, toggleLikeTrack, playlists, addTrackToPlaylist
  } = useMusic();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const updateMeter = () => {
      const dataArray = new Uint8Array(32);
      if (isPlaying) {
         for (let i = 0; i < 32; i++) {
            // Procedural generation of realistic-looking frequency data
            const val = Math.sin(time * 15 + i * 0.5) * 60 + Math.cos(time * 8 + i * 2) * 40 + 120;
            const noise = Math.random() * 30;
            dataArray[i] = Math.max(0, Math.min(255, val + noise));
         }
         time += 0.03;
      }
      window.dispatchEvent(new CustomEvent('audioMeterUpdate', { detail: dataArray }));
      animationFrameId = requestAnimationFrame(updateMeter);
    };

    updateMeter();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        if (!currentTrack.audioUrl) {
           console.error("Playback failed: No audio URL for this track.");
           setIsPlaying(false);
           return;
        }
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
          console.error("Playback failed on repeat", e);
          setIsPlaying(false);
        });
      }
    } else {
      nextTrack();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
    if (newVol === 0) setIsMuted(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Blurred Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div 
          className="absolute inset-[-100px] bg-cover bg-center opacity-[0.15] blur-[50px] saturate-200 transition-all duration-1000"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative h-[110px] px-8 flex items-center justify-between">
        <audio 
          ref={audioRef} 
          src={currentTrack.audioUrl}
          onTimeUpdate={onTimeUpdate} 
          onLoadedMetadata={onLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Track Info */}
        <div className="flex items-center gap-6 w-1/4 min-w-[280px]">
          <div className="relative group/cover">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/10 group-hover/cover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer">
              <Maximize2 size={16} className="text-white" />
            </div>
          </div>
          <div className="overflow-hidden flex-1 flex flex-col justify-center">
            <h4 className="text-base font-bold truncate text-text-primary tracking-tight hover:underline cursor-pointer drop-shadow-md">{currentTrack.title}</h4>
            <p 
              onClick={() => onNavigateToArtist?.(currentTrack.artist)}
              className="text-xs text-text-secondary truncate tracking-wider opacity-80 mt-1 hover:underline cursor-pointer hover:text-accent transition-colors"
            >
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3 flex-1 max-w-2xl px-8">
          <div className="flex items-center gap-8">
            <button 
              onClick={toggleShuffle}
              className={`transition-all duration-300 hover:scale-110 ${isShuffling ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-white'}`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            
            <button 
              onClick={prevTrack}
              className="text-text-secondary hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipBack size={22} fill="currentColor" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-accent transition-all active:scale-95 shadow-[0_8px_32px_rgba(255,255,255,0.2)] group"
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" className="group-hover:scale-95 transition-transform" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-1 group-hover:scale-95 transition-transform" />
              )}
            </button>
            
            <button 
              onClick={nextTrack}
              className="text-text-secondary hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipForward size={22} fill="currentColor" />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`transition-all duration-300 hover:scale-110 ${repeatMode !== 'off' ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-white'}`}
              title={`Repeat ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-4">
            {currentTrack.isRadio ? (
              <div className="flex-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_10px_rgba(255,51,51,0.6)]" />
                <span className="text-[10px] font-black text-[#ff3333] tracking-widest uppercase">LIVE</span>
              </div>
            ) : (
              <>
                <span className="text-[10px] text-text-secondary font-bold w-10 text-right font-mono opacity-80">{formatTime(currentTime)}</span>
                <div className="flex-1 relative group h-5 flex items-center cursor-pointer">
                  {/* Background Track */}
                  <div className="absolute inset-x-0 h-1.5 bg-white/10 rounded-full overflow-hidden transition-all group-hover:h-2">
                     {/* Fill */}
                     <div className="h-full bg-white relative flex items-center justify-end" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
                       <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent to-white/30" />
                     </div>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {/* Thumb indicator (visual only) */}
                  <div 
                    className="absolute h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-transform scale-0 group-hover:scale-100" 
                    style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }} 
                  />
                </div>
                <span className="text-[10px] text-text-secondary font-bold w-10 font-mono opacity-80">{formatTime(duration)}</span>
              </>
            )}
          </div>
        </div>

        {/* Utils */}
        <div className="flex items-center justify-end gap-5 w-1/4 min-w-[320px]">
          <button 
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors active:scale-95"
          >
            <Heart size={18} className={likedTracks.includes(currentTrack.id) ? "fill-accent text-accent" : "text-text-secondary hover:text-white"} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors active:scale-95 text-text-secondary hover:text-white"
            >
              <Plus size={20} />
            </button>
            <AnimatePresence>
              {showPlaylistMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 min-w-[200px]"
                >
                  <div className="px-3 py-2 text-[10px] font-black text-text-secondary tracking-widest uppercase">Add to Playlist</div>
                  <div className="w-full h-px bg-white/5 my-1" />
                  {playlists.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-center text-text-secondary opacity-60">No playlists yet</div>
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto">
                      {playlists.map(pl => (
                        <button 
                          key={pl.id} 
                          onClick={() => { addTrackToPlaylist(pl.id, currentTrack); setShowPlaylistMenu(false); alert(`Added to ${pl.name}`); }} 
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold hover:bg-white/5 rounded-xl text-left transition-colors"
                        >
                          <ListMusic size={14} className="text-accent" /> {pl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <div className="flex items-center gap-3 group">
            <button onClick={toggleMute} className="text-text-secondary hover:text-white transition-colors active:scale-95">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="w-24 relative h-5 flex items-center cursor-pointer">
              <div className="absolute inset-x-0 h-1.5 bg-white/10 rounded-full overflow-hidden transition-all group-hover:h-2">
                <div className="h-full bg-white group-hover:bg-accent transition-colors" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-transform scale-0 group-hover:scale-100" 
                style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }} 
              />
            </div>
          </div>
          
          <div className="w-px h-6 bg-white/10 mx-1" />

          <button 
            onClick={toggleFullscreen}
            className="text-text-secondary hover:text-white transition-colors active:scale-95 p-2 rounded-full hover:bg-white/5"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
