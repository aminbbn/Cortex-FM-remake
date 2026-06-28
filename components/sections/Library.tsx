
import React, { useState, useRef, useMemo } from 'react';
import { Upload, Filter, List, Grid as GridIcon, Search, MoreHorizontal, Play, Heart, Plus, FolderPlus, User, Disc, Share2, ListPlus, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useMusic } from '../../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Track } from '../../types';

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  size: string;
}

interface LibraryProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToArtist?: (artist: string) => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ activeTab, setActiveTab, onNavigateToArtist, onNavigateToAlbum }) => {
  const { tracks, addTrack, setCurrentTrack, setIsPlaying, likedTracks, toggleLikeTrack, playlists, createPlaylist, addTrackToPlaylist } = useMusic();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const audioUrl = URL.createObjectURL(file);

    const newUpload: UploadItem = {
      id, name: file.name, progress: 0, status: 'uploading', size: formatFileSize(file.size),
    };

    setUploads((prev) => [newUpload, ...prev]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploads((prev) => prev.map((up) => up.id === id ? { ...up, progress: 100, status: 'analyzing' } : up));

        const tempAudio = new Audio(audioUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
          const newTrack: Track = {
            id: `uploaded-${Date.now()}-${id}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Vault User",
            album: "Personal Synthesis",
            coverUrl: `https://picsum.photos/seed/${id}/400/400`,
            audioUrl: audioUrl,
            duration: tempAudio.duration || 180,
            genre: ["Liquid D&B", "Synthwave", "Ambient", "Indie"][Math.floor(Math.random() * 4)],
            mood: ["Energetic", "Calm", "Euphoric", "Focus"][Math.floor(Math.random() * 4)],
            bpm: 80 + Math.floor(Math.random() * 80),
          };

          addTrack(newTrack);
          setUploads((prev) => prev.map((up) => up.id === id ? { ...up, status: 'completed' } : up));
          setTimeout(() => setUploads((prev) => prev.filter((up) => up.id !== id)), 3000);
        });
        
        tempAudio.addEventListener('error', () => {
           setUploads((prev) => prev.map((up) => up.id === id ? { ...up, status: 'error' } : up));
        });
      } else {
        setUploads((prev) => prev.map((up) => up.id === id ? { ...up, progress: Math.floor(currentProgress) } : up));
      }
    }, 300);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => simulateUpload(file));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const displayedTracks = useMemo(() => {
    let result = tracks;
    if (activeTab === 'liked') {
      result = result.filter(t => likedTracks.includes(t.id));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q));
    }
    if (selectedGenre !== 'All') result = result.filter(t => t.genre === selectedGenre);
    if (selectedMood !== 'All') result = result.filter(t => t.mood === selectedMood);
    return result;
  }, [tracks, likedTracks, activeTab, searchQuery, selectedGenre, selectedMood]);

  const allGenres = ['All', ...Array.from(new Set(tracks.map(t => t.genre)))];
  const allMoods = ['All', ...Array.from(new Set(tracks.map(t => t.mood)))];

  const handleCreatePlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) {
      createPlaylist(name);
      setActiveTab('library');
    }
  };

  const handleShare = (track: any) => {
    navigator.clipboard.writeText(`${window.location.origin}/track/${track.id}`);
    alert(`Link for ${track.title} copied to clipboard!`);
    setActiveMenuTrackId(null);
  };

  if (activeTab === 'playlists') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col h-full space-y-8 pt-12 px-8 md:px-20 lg:px-24">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">Your Playlists</h2>
            <p className="text-text-secondary max-w-lg text-sm font-bold opacity-70">Curate and organize your vault.</p>
          </div>
          <Button onClick={handleCreatePlaylist} className="gap-3 shadow-xl active:scale-95">
            <Plus size={18} /> <span className="text-xs font-black tracking-widest">New</span>
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-surface/50 p-5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-surface transition-all group cursor-pointer">
              <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center">
                <List size={48} className="text-text-secondary/30 group-hover:text-accent/50 transition-colors" />
              </div>
              <h3 className="text-lg font-black tracking-tight truncate">{playlist.name}</h3>
              <p className="text-xs font-bold text-text-secondary tracking-widest opacity-60 mt-1">{playlist.tracks.length} Tracks</p>
            </div>
          ))}
          {playlists.length === 0 && (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center gap-4">
              <FolderPlus size={48} className="text-text-secondary/30" />
              <p className="text-text-secondary text-sm font-bold opacity-60">No playlists created yet.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative min-h-full space-y-12 pt-12 px-8 md:px-20 lg:px-24">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".mp3,.flac,.wav,.m4a" />

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black mb-3 tracking-tighter">
            {activeTab === 'liked' ? 'Liked Songs' : 'Your Vault'}
          </h1>
          <p className="text-text-secondary max-w-lg text-sm font-bold opacity-70">
            {activeTab === 'liked' 
              ? 'Tracks you have saved to your collection.' 
              : 'Manage your high-fidelity collection. Every byte analyzed by the Cortex Engine.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-accent/50 transition-colors w-48 focus:w-64"
            />
          </div>
          <Button variant="secondary" size="md" className="gap-3" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} /> <span className="text-xs font-black tracking-widest">Filter</span>
          </Button>
          <Button size="md" className="gap-3 shadow-xl active:scale-95" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> <span className="text-xs font-black tracking-widest">Upload Music</span>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-6 items-center bg-surface/30 p-4 rounded-2xl border border-white/5"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-text-secondary tracking-widest">Genre</label>
              <select 
                value={selectedGenre} 
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              >
                {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-text-secondary tracking-widest">Mood</label>
              <select 
                value={selectedMood} 
                onChange={e => setSelectedMood(e.target.value)}
                className="bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
              >
                {allMoods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {uploads.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-2">
          {uploads.map((upload) => (
            <div key={upload.id} className="bg-surface/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Loader2 className="animate-spin text-accent" size={18} />
                <span className="text-sm font-bold tracking-tight">{upload.name}</span>
              </div>
              <span className="text-xs text-text-secondary font-mono">{upload.progress}%</span>
            </div>
          ))}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-text-secondary tracking-[3px] border-b border-white/5">
              <th className="pb-6 font-black w-12 text-center opacity-40">#</th>
              <th className="pb-6 font-black">Title</th>
              <th className="pb-6 font-black">Album</th>
              <th className="pb-6 font-black text-center">Analysis</th>
              <th className="pb-6 font-black text-right pr-6">Time</th>
              <th className="pb-6 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedTracks.map((track, idx) => (
              <motion.tr 
                key={track.id} 
                variants={itemVariants}
                className="group hover:bg-surface/50 transition-all border-l-4 border-transparent hover:border-accent relative"
              >
                <td className="py-4 text-xs font-black text-text-secondary/40 text-center group-hover:text-accent cursor-pointer" onClick={() => playTrack(track)}>
                  <span className="group-hover:hidden">0{idx + 1}</span>
                  <Play size={14} className="hidden group-hover:inline-block fill-current" />
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <img src={track.coverUrl} className="w-10 h-10 rounded-xl object-cover shadow-lg cursor-pointer" alt="" onClick={() => playTrack(track)} />
                    <div>
                      <div className="text-sm font-black text-text-primary group-hover:text-accent transition-colors truncate max-w-[240px] tracking-tight cursor-pointer" onClick={() => playTrack(track)}>{track.title}</div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToArtist?.(track.artist);
                        }}
                        className="text-[10px] font-bold text-text-secondary tracking-widest opacity-60 hover:text-accent hover:underline cursor-pointer transition-colors"
                      >
                        {track.artist}
                      </div>
                    </div>
                  </div>
                </td>
                <td 
                  className="py-4 text-xs font-bold text-text-secondary opacity-70 tracking-tighter cursor-pointer hover:text-accent hover:underline transition-colors" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToAlbum?.(track.id);
                  }}
                >
                  {track.album}
                </td>
                <td className="py-4 text-center cursor-pointer" onClick={() => playTrack(track)}>
                  <span className="px-3 py-1.5 rounded-xl bg-accent/5 text-[9px] font-black tracking-widest text-accent border border-accent/10 shadow-sm group-hover:bg-accent/10 transition-colors">
                    {track.bpm} BPM • {track.mood}
                  </span>
                </td>
                <td className="py-4 text-xs text-text-secondary text-right pr-6 font-mono opacity-60 font-bold cursor-pointer" onClick={() => playTrack(track)}>
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </td>
                <td className="py-4 relative">
                  <button onClick={(e) => { e.stopPropagation(); setActiveMenuTrackId(activeMenuTrackId === track.id ? null : track.id); }} className={`p-2 rounded-full transition-colors ${activeMenuTrackId === track.id ? 'opacity-100 bg-white/5 text-white' : 'text-text-secondary hover:text-white opacity-0 group-hover:opacity-100'}`}>
                    <MoreHorizontal size={18} />
                  </button>
                  <AnimatePresence>
                    {activeMenuTrackId === track.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 bg-surface border border-white/10 rounded-xl shadow-2xl p-2 z-50 min-w-[160px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => { playTrack(track); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Play size={14} /> Play
                        </button>
                        <button onClick={() => { setActiveMenuTrackId(null); alert("Added to queue!"); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <ListPlus size={14} /> Add to Queue
                        </button>
                        <button onClick={() => { toggleLikeTrack(track.id); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                          <Heart size={14} className={likedTracks.includes(track.id) ? "fill-accent text-accent" : ""} /> {likedTracks.includes(track.id) ? 'Unlike' : 'Like'}
                        </button>
                        <div className="w-full h-px bg-white/5 my-1" />
                        <button onClick={() => { onNavigateToArtist?.(track.artist); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <User size={14} /> View Artist
                        </button>
                        <button onClick={() => { onNavigateToAlbum?.(track.id); setActiveMenuTrackId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <Disc size={14} /> View Album
                        </button>
                        <button onClick={() => handleShare(track)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors text-text-secondary hover:text-white">
                          <Share2 size={14} /> Share
                        </button>
                        <div className="w-full h-px bg-white/5 my-1" />
                        <div className="px-3 py-1 text-[9px] font-black text-text-secondary tracking-widest uppercase">Add to Playlist</div>
                        {playlists.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-text-secondary opacity-60">No playlists available</div>
                        ) : (
                          playlists.map(pl => (
                            <button key={pl.id} onClick={() => { addTrackToPlaylist(pl.id, track); setActiveMenuTrackId(null); alert(`Added to ${pl.name}`); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold hover:bg-white/5 rounded-lg text-left transition-colors">
                              <Plus size={14} /> {pl.name}
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </motion.tr>
            ))}
            {displayedTracks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text-secondary text-sm font-bold opacity-60">
                  No tracks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};
