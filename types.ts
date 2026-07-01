
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl?: string; // Real URL for playback
  duration: number; // in seconds
  genre: string;
  mood: string;
  bpm: number;
  isRadio?: boolean;
}

export interface Episode extends Track {
  showName: string;
  publishDate: string;
  description: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  type: 'daily' | 'weekly' | 'custom' | 'mood';
}

export interface RecentlyPlayedItem {
  id: string;
  type: 'track' | 'album' | 'artist' | 'episode' | 'playlist';
  title: string;
  subtitle: string;
  coverUrl: string;
  artistName?: string;
  itemId?: string; // ID used for navigation, e.g., seed track ID for album or show ID
}

