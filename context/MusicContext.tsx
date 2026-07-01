
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist, Episode, RecentlyPlayedItem } from '../types';
import { MOCK_TRACKS, MOCK_EPISODES, MOCK_PLAYLISTS } from '../constants';

interface MusicContextType {
  tracks: Track[];
  vaultTracks: Track[];
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
  createPlaylist: (name: string, track?: Track) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  episodes: Episode[];
  queue: Track[];
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  recentlyPlayed: RecentlyPlayedItem[];
  addRecentlyPlayed: (item: RecentlyPlayedItem) => void;
  clearRecentlyPlayed: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [vaultTracks, setVaultTracks] = useState<Track[]>(() => [
    {
      id: 'vault-1',
      title: 'Aetherial Drift',
      artist: 'Cortex User #09',
      album: 'Internal Resonance',
      coverUrl: 'https://picsum.photos/seed/vault1/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: 324,
      genre: 'Ambient',
      mood: 'Focus',
      bpm: 65,
    },
    {
      id: 'vault-2',
      title: 'Neon Catalyst',
      artist: 'Self Synthesis',
      album: 'Experimental Waves',
      coverUrl: 'https://picsum.photos/seed/vault2/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 215,
      genre: 'Electronic',
      mood: 'Energetic',
      bpm: 115,
    },
    {
      id: 'vault-3',
      title: 'Low-Fi Brainwave',
      artist: 'NeuroScaper',
      album: 'Lofi Sessions',
      coverUrl: 'https://picsum.photos/seed/vault3/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      duration: 182,
      genre: 'Hip Hop',
      mood: 'Chill',
      bpm: 78,
    },
    {
      id: 'vault-4',
      title: 'Abyssal Chords',
      artist: 'Sub-Cortex',
      album: 'Dark Horizon',
      coverUrl: 'https://picsum.photos/seed/vault4/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      duration: 298,
      genre: 'Ambient',
      mood: 'Dark',
      bpm: 90,
    }
  ]);
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(MOCK_TRACKS[0]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(() => [
    {
      id: 'recent-t1',
      type: 'track',
      title: MOCK_TRACKS[0].title,
      subtitle: MOCK_TRACKS[0].artist,
      coverUrl: MOCK_TRACKS[0].coverUrl,
      artistName: MOCK_TRACKS[0].artist,
      itemId: MOCK_TRACKS[0].id
    },
    {
      id: 'recent-a1',
      type: 'album',
      title: MOCK_TRACKS[1].album,
      subtitle: `Album • ${MOCK_TRACKS[1].artist}`,
      coverUrl: MOCK_TRACKS[1].coverUrl,
      artistName: MOCK_TRACKS[1].artist,
      itemId: MOCK_TRACKS[1].id
    },
    {
      id: 'recent-ar1',
      type: 'artist',
      title: MOCK_TRACKS[3].artist,
      subtitle: 'Artist',
      coverUrl: MOCK_TRACKS[3].coverUrl,
      artistName: MOCK_TRACKS[3].artist,
      itemId: MOCK_TRACKS[3].artist
    },
    {
      id: 'recent-ep1',
      type: 'episode',
      title: MOCK_EPISODES[0].title,
      subtitle: `Podcast • ${MOCK_EPISODES[0].showName}`,
      coverUrl: MOCK_EPISODES[0].coverUrl,
      itemId: MOCK_EPISODES[0].id
    },
    {
      id: 'recent-pl1',
      type: 'playlist',
      title: MOCK_PLAYLISTS[0].name,
      subtitle: 'Playlist',
      coverUrl: MOCK_PLAYLISTS[0].coverUrl,
      itemId: MOCK_PLAYLISTS[0].id
    }
  ]);

  const addRecentlyPlayed = (item: RecentlyPlayedItem) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(p => p.itemId !== item.itemId && p.title !== item.title);
      return [item, ...filtered].slice(0, 8);
    });
  };

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
  };

  const setCurrentTrack = (track: Track) => {
    setCurrentTrackState(track);
    const isEpisode = 'showName' in track;
    const item: RecentlyPlayedItem = {
      id: `recent-${track.id}`,
      type: isEpisode ? 'episode' : 'track',
      title: track.title,
      subtitle: isEpisode ? `Podcast • ${(track as Episode).showName}` : track.artist,
      coverUrl: track.coverUrl,
      artistName: track.artist,
      itemId: track.id
    };
    addRecentlyPlayed(item);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [likedTracks, setLikedTracks] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
  const [queue, setQueue] = useState<Track[]>([]);

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(t => t.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const addTrack = (track: Track) => {
    setTracks((prev) => [track, ...prev]);
    setVaultTracks((prev) => [track, ...prev]);
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTracks(prev => prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]);
  };

  const createPlaylist = (name: string, track?: Track) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description: 'Custom Playlist',
      coverUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      tracks: track ? [track] : [],
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
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      setCurrentTrack(next);
      setIsPlaying(true);
      return;
    }

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
      tracks, vaultTracks, addTrack, currentTrack, setCurrentTrack, isPlaying, setIsPlaying,
      nextTrack, prevTrack, toggleShuffle, toggleRepeat, isShuffling, repeatMode,
      likedTracks, toggleLikeTrack, playlists, createPlaylist, addTrackToPlaylist,
      episodes, queue, addToQueue, removeFromQueue, clearQueue,
      recentlyPlayed, addRecentlyPlayed, clearRecentlyPlayed
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
