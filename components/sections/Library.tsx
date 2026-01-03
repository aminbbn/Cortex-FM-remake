
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 }
    }
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

        setTimeout(() => {
          const newTrack: Track = {
            id: `uploaded-${Date.now()}-${id}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Vault User",
            album: "Personal Synthesis",
            coverUrl: `https://picsum.photos/seed/${id}/400/400`,
            audioUrl: audioUrl,
            duration: 180,
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-full space-y-12"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".mp3,.flac,.wav,.m4a"
      />

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black mb-3 uppercase tracking-tighter">Your Vault</h1>
          <p className="text-text-secondary max-w-lg text-sm font-bold opacity-70">
            Manage your high-fidelity collection. Every byte analyzed by the Cortex Engine.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="md" className="gap-3">
            <Filter size={18} /> <span className="text-xs font-black uppercase tracking-widest">Filter</span>
          </Button>
          <Button size="md" className="gap-3 shadow-xl active:scale-95" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> <span className="text-xs font-black uppercase tracking-widest">Upload Music</span>
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex gap-10">
          {['All Songs', 'Albums', 'Artists'].map((tab, idx) => (
            <button key={tab} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${idx === 0 ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}>
              {tab}
              {idx === 0 && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 text-accent bg-accent/10 rounded-xl"><List size={18} /></button>
          <button className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-all"><GridIcon size={18} /></button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-text-secondary uppercase tracking-[3px] border-b border-white/5">
              <th className="pb-6 font-black w-12 text-center opacity-40">#</th>
              <th className="pb-6 font-black">Title</th>
              <th className="pb-6 font-black">Album</th>
              <th className="pb-6 font-black text-center">Analysis</th>
              <th className="pb-6 font-black text-right pr-6">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tracks.map((track, idx) => (
              <motion.tr 
                key={track.id} 
                variants={itemVariants}
                onClick={() => playTrack(track)} 
                className="group hover:bg-surface/50 transition-all cursor-pointer border-l-4 border-transparent hover:border-accent"
              >
                <td className="py-6 text-xs font-black text-text-secondary/40 text-center group-hover:text-accent">0{idx + 1}</td>
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <img src={track.coverUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                    <div>
                      <div className="text-sm font-black text-text-primary group-hover:text-accent transition-colors truncate max-w-[240px] tracking-tight uppercase">{track.title}</div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">{track.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-xs font-bold text-text-secondary opacity-70 uppercase tracking-tighter">{track.album}</td>
                <td className="py-6 text-center">
                  <span className="px-3 py-1.5 rounded-xl bg-accent/5 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/10 shadow-sm group-hover:bg-accent/10 transition-colors">
                    {track.bpm} BPM • {track.mood}
                  </span>
                </td>
                <td className="py-6 text-xs text-text-secondary text-right pr-6 font-mono opacity-60 font-bold">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};
