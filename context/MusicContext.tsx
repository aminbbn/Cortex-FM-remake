
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist } from '../types';
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
  likedTracks: string[];
  toggleLikeTrack: (trackId: string) => void;
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const addTrack = (track: Track) => {
    setTracks((prev) => [track, ...prev]);
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTracks(prev => prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]);
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description: 'Custom Playlist',
      coverUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      tracks: [],
      type: 'custom'
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId && !pl.tracks.find(t => t.id === track.id)) {
        return { ...pl, tracks: [...pl.tracks, track] };
      }
      return pl;
    }));
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
      nextTrack, prevTrack, toggleShuffle, toggleRepeat, isShuffling, repeatMode,
      likedTracks, toggleLikeTrack, playlists, createPlaylist, addTrackToPlaylist
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
