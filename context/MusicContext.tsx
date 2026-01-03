
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../constants';

interface MusicContextType {
  tracks: Track[];
  addTrack: (track: Track) => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  // New features
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isShuffling: boolean;
  repeatMode: 'off' | 'all' | 'one';
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const addTrack = (track: Track) => {
    setTracks((prev) => [track, ...prev]);
  };

  const getRandomIndex = (excludeIndex: number) => {
    if (tracks.length <= 1) return 0;
    let next = Math.floor(Math.random() * tracks.length);
    while (next === excludeIndex) {
      next = Math.floor(Math.random() * tracks.length);
    }
    return next;
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    let nextIndex;
    
    if (isShuffling) {
      nextIndex = getRandomIndex(currentIndex);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= tracks.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          // End of playlist, stop playing or stay on last?
          // Usually loop to start but pause if not repeating.
          // Let's loop to start but stop if not repeating.
          nextIndex = 0;
          if (repeatMode === 'off') {
            setCurrentTrack(tracks[0]);
            setIsPlaying(false);
            return;
          }
        }
      }
    }
    
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    let prevIndex;
    if (isShuffling) {
      // In shuffle, prev usually goes to history, but for simple logic:
      prevIndex = getRandomIndex(currentIndex);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = tracks.length - 1;
      }
    }
    
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);
  
  const toggleRepeat = () => {
    setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
  };

  return (
    <MusicContext.Provider value={{ 
      tracks, addTrack, currentTrack, setCurrentTrack, isPlaying, setIsPlaying,
      nextTrack, prevTrack, toggleShuffle, toggleRepeat, isShuffling, repeatMode
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
