
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, ListMusic } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export const PlayerBar: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass z-50 px-6 flex items-center justify-between border-t border-white/5">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-14 h-14 rounded-lg object-cover shadow-lg border border-accent/10"
        />
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold truncate text-text-primary">{currentTrack.title}</h4>
          <p className="text-xs text-text-secondary truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
        <div className="flex items-center gap-6">
          <button className="text-text-secondary hover:text-accent transition-colors"><Shuffle size={18} /></button>
          <button className="text-text-secondary hover:text-text-primary transition-colors"><SkipBack size={22} fill="currentColor" /></button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-text-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg"
          >
            {isPlaying ? (
              <Pause size={20} className="text-background" fill="currentColor" />
            ) : (
              <Play size={20} className="text-background ml-1" fill="currentColor" />
            )}
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-colors"><SkipForward size={22} fill="currentColor" /></button>
          <button className="text-text-secondary hover:text-accent transition-colors"><Repeat size={18} /></button>
        </div>
        
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] text-text-secondary font-bold w-10 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group h-1 bg-accent/10 rounded-full cursor-pointer">
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-0 left-0 h-full bg-accent rounded-full pointer-events-none" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}>
              <div className="absolute -right-1.5 -top-1 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>
          <span className="text-[10px] text-text-secondary font-bold w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Utils */}
      <div className="flex items-center justify-end gap-5 w-1/4">
        <button className="text-text-secondary hover:text-text-primary transition-colors"><ListMusic size={20} /></button>
        <div className="flex items-center gap-3 group">
          <Volume2 size={20} className="text-text-secondary group-hover:text-text-primary" />
          <div className="w-24 relative h-1 bg-accent/10 rounded-full overflow-hidden">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
        <button className="text-text-secondary hover:text-text-primary transition-colors"><Maximize2 size={18} /></button>
      </div>
    </div>
  );
};
