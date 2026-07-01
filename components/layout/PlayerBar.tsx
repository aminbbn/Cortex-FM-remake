
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
    likedTracks, toggleLikeTrack, playlists, addTrackToPlaylist,
    queue, removeFromQueue, clearQueue
  } = useMusic();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showQueueMenu, setShowQueueMenu] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setShowPlaylistMenu(false);
        setShowQueueMenu(false);
      }
    };
    if (showPlaylistMenu || showQueueMenu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showPlaylistMenu, showQueueMenu]);

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
    const audio = audioRef.current;
    if (!audio) return;

    let isSubscribed = true;

    const handlePlayback = async () => {
      if (isPlaying) {
        if (!currentTrack.audioUrl) {
          console.error("Playback failed: No audio URL for this track.");
          if (isSubscribed) setIsPlaying(false);
          return;
        }

        try {
          await audio.play();
        } catch (e: any) {
          if (isSubscribed && e.name !== 'AbortError') {
            console.error("Playback failed:", e);
            setIsPlaying(false);
          } else {
            console.log("Playback play() promise handled/ignored:", e.message || e);
          }
        }
      } else {
        try {
          audio.pause();
        } catch (e) {
          console.error("Pause failed:", e);
        }
      }
    };

    handlePlayback();

    return () => {
      isSubscribed = false;
    };
  }, [isPlaying, currentTrack, setIsPlaying]);

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

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      let shortcutKey: string | null = null;

      switch (e.key) {
        case " ": {
          e.preventDefault();
          setIsPlaying(!isPlaying);
          shortcutKey = "Space";
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          nextTrack();
          shortcutKey = "Arrow Right";
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          prevTrack();
          shortcutKey = "Arrow Left";
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setVolume((v) => {
            const nextVol = Math.min(1, v + 0.1);
            if (isMuted && nextVol > 0) setIsMuted(false);
            return parseFloat(nextVol.toFixed(2));
          });
          shortcutKey = "Arrow Up";
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          setVolume((v) => {
            const nextVol = Math.max(0, v - 0.1);
            return parseFloat(nextVol.toFixed(2));
          });
          shortcutKey = "Arrow Down";
          break;
        }
        case "s":
        case "S":
        case "/": {
          e.preventDefault();
          shortcutKey = "S   or   /";
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          shortcutKey = "Escape";
          setShowPlaylistMenu(false);
          setShowQueueMenu(false);
          break;
        }
        default:
          break;
      }

      if (shortcutKey) {
        window.dispatchEvent(
          new CustomEvent("cortex:shortcut-triggered", {
            detail: { key: shortcutKey },
          })
        );
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isPlaying, setIsPlaying, nextTrack, prevTrack, isMuted, setIsMuted]);

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
          if (e.name !== 'AbortError') {
            console.error("Playback failed on repeat", e);
            setIsPlaying(false);
          }
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
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 h-24 z-50 transition-all duration-500">
      {/* Blurred Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div 
          className="absolute inset-[-100px] bg-cover bg-center opacity-[0.12] blur-[50px] saturate-200 transition-all duration-1000"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative h-full px-6 lg:px-8 w-full grid grid-cols-12 items-center gap-4">
        <audio 
          ref={audioRef} 
          src={currentTrack.audioUrl}
          onTimeUpdate={onTimeUpdate} 
          onLoadedMetadata={onLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Left Zone: Track Info + Like Button */}
        <div className="col-span-3 flex items-center gap-4 min-w-0" key={currentTrack.id}>
          <div className="relative group/cover shrink-0">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/5 transition-transform duration-300 group-hover/cover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer">
              <Maximize2 size={12} className="text-white" />
            </div>
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate text-text-primary tracking-tight hover:underline cursor-pointer">
              {currentTrack.title}
            </h4>
            <p 
              onClick={() => onNavigateToArtist?.(currentTrack.artist)}
              className="text-xs text-text-secondary truncate tracking-wider opacity-80 mt-0.5 hover:underline cursor-pointer hover:text-accent transition-colors"
            >
              {currentTrack.artist}
            </p>
          </div>
          
          <button 
            onClick={() => toggleLikeTrack(currentTrack.id)}
            className="p-1.5 rounded-full hover:bg-white/5 transition-colors active:scale-95 shrink-0"
            title={likedTracks.includes(currentTrack.id) ? "Unlike track" : "Like track"}
          >
            <Heart 
              size={16} 
              className={likedTracks.includes(currentTrack.id) ? "fill-accent text-accent" : "text-text-secondary hover:text-white"} 
            />
          </button>
        </div>

        {/* Center Zone: Playback Controls & Progress Bar */}
        <div className="col-span-6 flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
          {/* Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleShuffle}
              className={`transition-all duration-300 hover:scale-110 ${isShuffling ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-white'}`}
              title="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            
            <button 
              onClick={prevTrack}
              className="text-text-secondary hover:text-white transition-colors hover:scale-110 active:scale-95"
              title="Previous"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-accent transition-all active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.15)] group"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" className="group-hover:scale-95 transition-transform" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5 group-hover:scale-95 transition-transform" />
              )}
            </button>
            
            <button 
              onClick={nextTrack}
              className="text-text-secondary hover:text-white transition-colors hover:scale-110 active:scale-95"
              title="Next"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`transition-all duration-300 hover:scale-110 ${repeatMode !== 'off' ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-white'}`}
              title={`Repeat ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
          
          {/* Progress Bar Row */}
          <div className="w-full flex items-center gap-3">
            {currentTrack.isRadio ? (
              <div className="flex-1 flex items-center justify-center gap-2 h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_10px_rgba(255,51,51,0.6)]" />
                <span className="text-[9px] font-black text-[#ff3333] tracking-widest uppercase">LIVE</span>
              </div>
            ) : (
              <>
                <span className="text-[10px] text-text-secondary font-bold w-10 text-right font-mono opacity-80 select-none shrink-0">
                  {formatTime(currentTime)}
                </span>
                
                <div className="flex-1 relative group h-4 flex items-center cursor-pointer">
                  {/* Background Track */}
                  <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden transition-all group-hover:h-1.5">
                     {/* Fill */}
                     <div 
                       className="h-full bg-white relative flex items-center justify-end" 
                       style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                     >
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
                  {/* Thumb (visual only) */}
                  <div 
                    className="absolute h-2.5 w-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none transition-transform scale-0 group-hover:scale-100" 
                    style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 5px)` }} 
                  />
                </div>
                
                <span className="text-[10px] text-text-secondary font-bold w-10 font-mono opacity-80 select-none shrink-0">
                  {formatTime(duration)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Zone: Playlist, Queue, Volume, Fullscreen */}
        <div ref={menuContainerRef} className="col-span-3 flex items-center justify-end gap-3.5 min-w-0">
          {/* Add to Playlist button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowPlaylistMenu(!showPlaylistMenu);
                setShowQueueMenu(false);
              }}
              className={`p-2 rounded-full transition-colors active:scale-95 ${showPlaylistMenu ? "text-accent bg-white/5" : "text-text-secondary hover:text-white hover:bg-white/5"}`}
              title="Add to Playlist"
            >
              <Plus size={18} />
            </button>
            <AnimatePresence>
              {showPlaylistMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-[120%] right-0 mb-4 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 min-w-[200px]"
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
                          onClick={() => { addTrackToPlaylist(pl.id, currentTrack); setShowPlaylistMenu(false); }} 
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

          {/* Active Play Queue button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowQueueMenu(!showQueueMenu);
                setShowPlaylistMenu(false);
              }}
              className={`p-2 rounded-full transition-colors active:scale-95 ${showQueueMenu ? "text-accent bg-white/5" : "text-text-secondary hover:text-white hover:bg-white/5"}`}
              title="Play Queue"
            >
              <ListMusic size={18} />
              {queue.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-background font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-surface shadow-md">
                  {queue.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showQueueMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-[120%] right-0 mb-4 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 z-50 min-w-[280px]"
                >
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="text-[10px] font-black text-accent tracking-widest uppercase">Up Next ({queue.length})</div>
                    {queue.length > 0 && (
                      <button 
                        onClick={clearQueue}
                        className="text-[9px] font-black text-text-secondary hover:text-red-400 uppercase tracking-wider transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="w-full h-px bg-white/5 my-1" />
                  {queue.length === 0 ? (
                    <div className="px-3 py-6 text-xs text-center text-text-secondary opacity-60 italic">Queue is empty</div>
                  ) : (
                    <div className="max-h-[250px] overflow-y-auto space-y-1 pr-1">
                      {queue.map((track, qidx) => (
                        <div 
                          key={`${track.id}-${qidx}`}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 group transition-colors"
                        >
                          <img src={track.coverUrl} className="w-9 h-9 rounded-md object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-black truncate text-white">{track.title}</div>
                            <div className="text-[10px] font-bold truncate text-text-secondary">{track.artist}</div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(track.id);
                            }}
                            className="p-1 rounded text-text-secondary hover:text-red-400 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                            title="Remove from queue"
                          >
                            <Plus size={14} className="rotate-45" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Volume Control */}
          <div className="flex items-center gap-2 group shrink-0">
            <button onClick={toggleMute} className="text-text-secondary hover:text-white transition-colors active:scale-95 p-1.5 rounded-full hover:bg-white/5">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="w-20 relative h-4 flex items-center cursor-pointer">
              <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden transition-all group-hover:h-1.5">
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
                className="absolute h-2.5 w-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none transition-transform scale-0 group-hover:scale-100" 
                style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 5px)` }} 
              />
            </div>
          </div>
          
          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Fullscreen control */}
          <button 
            onClick={toggleFullscreen}
            className="text-text-secondary hover:text-white transition-colors active:scale-95 p-2 rounded-full hover:bg-white/5 shrink-0"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
