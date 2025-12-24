
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
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[1]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addTrack = (track: Track) => {
    setTracks((prev) => [track, ...prev]);
  };

  return (
    <MusicContext.Provider value={{ tracks, addTrack, currentTrack, setCurrentTrack, isPlaying, setIsPlaying }}>
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
