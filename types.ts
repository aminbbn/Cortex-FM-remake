
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

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  type: 'daily' | 'weekly' | 'custom' | 'mood';
}
