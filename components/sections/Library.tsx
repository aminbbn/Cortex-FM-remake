
import React, { useState, useRef } from 'react';
import { Upload, Filter, List, Grid as GridIcon, Music2, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
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

export const Library: React.FC = () => {
  const { tracks, addTrack, setCurrentTrack, setIsPlaying } = useMusic();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Create a local URL for playback
    const audioUrl = URL.createObjectURL(file);

    const newUpload: UploadItem = {
      id,
      name: file.name,
      progress: 0,
      status: 'uploading',
      size: formatFileSize(file.size),
    };

    setUploads((prev) => [newUpload, ...prev]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploads((prev) =>
          prev.map((up) =>
            up.id === id ? { ...up, progress: 100, status: 'analyzing' } : up
          )
        );

        // Simulate Cortex AI Analysis
        setTimeout(() => {
          const newTrack: Track = {
            id: `uploaded-${Date.now()}-${id}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Vault User",
            album: "Personal Synthesis",
            coverUrl: `https://picsum.photos/seed/${id}/400/400`,
            audioUrl: audioUrl, // STORES REAL BLOB URL
            duration: 180, // Default duration, updated by audio element later if needed
            genre: ["Liquid D&B", "Synthwave", "Ambient", "Indie"][Math.floor(Math.random() * 4)],
            mood: ["Energetic", "Calm", "Euphoric", "Focus"][Math.floor(Math.random() * 4)],
            bpm: 80 + Math.floor(Math.random() * 80),
          };

          addTrack(newTrack);

          setUploads((prev) =>
            prev.map((up) =>
              up.id === id ? { ...up, status: 'completed' } : up
            )
          );

          // Auto-remove after 3 seconds
          setTimeout(() => {
            setUploads((prev) => prev.filter((up) => up.id !== id));
          }, 3000);
        }, 1500);
      } else {
        setUploads((prev) =>
          prev.map((up) =>
            up.id === id ? { ...up, progress: Math.floor(currentProgress) } : up
          )
        );
      }
    }, 300);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        simulateUpload(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="relative min-h-full space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".mp3,.flac,.wav,.m4a"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Vault</h1>
          <p className="text-text-secondary max-w-lg text-sm">
            Manage your high-fidelity collection. Any file uploaded here will be processed by the Cortex Engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" className="gap-2">
            <Filter size={18} /> Filter
          </Button>
          <Button size="md" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Upload Music
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-accent/5 pb-4">
        <div className="flex gap-8">
          {['All Songs', 'Albums', 'Artists'].map((tab, idx) => (
            <button key={tab} className={`text-sm font-semibold transition-colors ${idx === 0 ? 'text-accent border-b-2 border-accent pb-4 -mb-[18px]' : 'text-text-secondary hover:text-text-primary'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-accent bg-accent/10 rounded-lg"><List size={18} /></button>
          <button className="p-2 text-text-secondary hover:text-text-primary"><GridIcon size={18} /></button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-text-secondary uppercase tracking-[2px] border-b border-accent/5">
              <th className="pb-4 font-bold w-12 text-center">#</th>
              <th className="pb-4 font-bold">Title</th>
              <th className="pb-4 font-bold">Album</th>
              <th className="pb-4 font-bold text-center">Analysis</th>
              <th className="pb-4 font-bold text-right pr-4">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/5">
            {tracks.map((track, idx) => (
              <tr key={track.id} onClick={() => playTrack(track)} className="group hover:bg-surface transition-colors cursor-pointer">
                <td className="py-4 text-sm text-text-secondary text-center group-hover:text-accent"><Music2 size={14} className="mx-auto" /></td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img src={track.coverUrl} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate max-w-[200px]">{track.title}</div>
                      <div className="text-xs text-text-secondary">{track.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-text-secondary">{track.album}</td>
                <td className="py-4 text-center">
                  <span className="px-2 py-1 rounded-full bg-accent/5 text-[10px] font-bold text-accent border border-accent/10">
                    {track.bpm} BPM • {track.mood}
                  </span>
                </td>
                <td className="py-4 text-sm text-text-secondary text-right pr-4 font-medium">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-28 right-8 z-[60] w-80 space-y-2 pointer-events-none">
        <AnimatePresence>
          {uploads.map((upload) => (
            <motion.div key={upload.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="pointer-events-auto glass rounded-xl p-4 border border-accent/20">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${upload.status === 'completed' ? 'bg-success/20 text-success' : 'bg-accent/10 text-accent'}`}>
                    {upload.status === 'completed' ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-text-primary truncate">{upload.name}</h5>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">{upload.status}</p>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: `${upload.progress}%` }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
