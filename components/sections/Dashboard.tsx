
import React from 'react';
import { Card } from '../ui/Card';
import { MOCK_PLAYLISTS } from '../../constants';
import { Play, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { Track } from '../../types';

export const Dashboard: React.FC = () => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-accent" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">Personalized for You</h2>
          </div>
          <button className="text-sm font-medium text-accent hover:underline">View all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PLAYLISTS.map((playlist, idx) => (
            <Card key={playlist.id} className="relative group">
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-background shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </motion.div>
                </div>
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1 truncate">{playlist.name}</h3>
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {playlist.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* New Charts & Trending */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <section className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-accent" size={24} />
              <h2 className="text-2xl font-bold tracking-tight">Cortex Charts</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-background">Global</button>
              <button className="px-3 py-1 text-xs font-semibold rounded-full bg-surface text-text-secondary hover:text-text-primary">Local</button>
            </div>
          </div>
          
          <div className="space-y-2">
            {tracks.slice(0, 5).map((track, idx) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors group cursor-pointer"
              >
                <span className="text-sm font-medium text-text-secondary w-4">{idx + 1}</span>
                <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate group-hover:text-accent transition-colors">{track.title}</h4>
                  <p className="text-xs text-text-secondary truncate">{track.artist}</p>
                </div>
                <div className="hidden md:block text-xs text-text-secondary font-medium px-4">
                  {track.genre}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary font-medium min-w-[60px]">
                  <Clock size={12} />
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
                <button className="p-2 text-text-secondary hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-accent" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">AI Insights</h2>
          </div>
          <Card className="bg-gradient-to-br from-surface to-accent/5 p-6 border border-accent/10">
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Based on your library of <span className="text-text-primary font-bold">{tracks.length} tracks</span>, your sonic profile is shifting.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Library Cohesion</span>
                  <span>84%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '84%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Discovery Range</span>
                  <span>Moderate</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-accent/10 hover:bg-accent/20 text-accent text-sm font-bold rounded-lg transition-colors border border-accent/20">
              Update Cortex Model
            </button>
          </Card>
        </section>
      </div>
    </div>
  );
};
