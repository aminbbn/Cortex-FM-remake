
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Volume2, VolumeX, Maximize2, Minimize2, ListMusic } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export const PlayerBar: React.FC = () => {
  const { 
    currentTrack, isPlaying, setIsPlaying,
    nextTrack, prevTrack, toggleShuffle, toggleRepeat, isShuffling, repeatMode 
  } = useMusic();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
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

  // Handle document fullscreen change events
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

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
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
    <div className="fixed bottom-0 left-0 right-0 h-24 glass z-50 px-6 flex items-center justify-between border-t border-white/5 transition-all duration-300">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={handleEnded}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-14 h-14 rounded-lg object-cover shadow-lg border border-accent/10"
        />
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold truncate text-text-primary uppercase tracking-tight">{currentTrack.title}</h4>
          <p className="text-xs text-text-secondary truncate uppercase tracking-wider opacity-70">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleShuffle}
            className={`transition-all duration-300 hover:scale-110 ${isShuffling ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-text-primary'}`}
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>
          
          <button 
            onClick={prevTrack}
            className="text-text-secondary hover:text-text-primary transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack size={22} fill="currentColor" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-text-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <Pause size={22} className="text-background" fill="currentColor" />
            ) : (
              <Play size={22} className="text-background ml-1" fill="currentColor" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-text-secondary hover:text-text-primary transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward size={22} fill="currentColor" />
          </button>
          
          <button 
            onClick={toggleRepeat}
            className={`transition-all duration-300 hover:scale-110 ${repeatMode !== 'off' ? 'text-accent drop-shadow-[0_0_8px_rgba(191,193,194,0.5)]' : 'text-text-secondary hover:text-text-primary'}`}
            title={`Repeat ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] text-text-secondary font-bold w-10 text-right font-mono">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group h-4 flex items-center cursor-pointer">
            {/* Hit area increased to h-4 but visual line is h-1 */}
            <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-accent relative" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
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
              className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-transform scale-0 group-hover:scale-100" 
              style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }} 
            />
          </div>
          <span className="text-[10px] text-text-secondary font-bold w-10 font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Utils */}
      <div className="flex items-center justify-end gap-5 w-1/4 min-w-[200px]">
        <button className="text-text-secondary hover:text-text-primary transition-colors active:scale-95">
          <ListMusic size={20} />
        </button>
        
        <div className="flex items-center gap-3 group">
          <button onClick={toggleMute} className="text-text-secondary hover:text-text-primary transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="w-24 relative h-4 flex items-center cursor-pointer">
            <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
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
              className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none transition-transform scale-0 group-hover:scale-100" 
              style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }} 
            />
          </div>
        </div>
        
        <button 
          onClick={toggleFullscreen}
          className="text-text-secondary hover:text-text-primary transition-colors active:scale-95"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
};
