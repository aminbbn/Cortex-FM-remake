import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { DiscoverHeader } from './discover/DiscoverHeader';
import { CategorySelectors } from './discover/CategorySelectors';
import { DiscoverResults } from './discover/DiscoverResults';

interface DiscoverProps {
  onNavigateToArtist?: (artist: string) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ onNavigateToArtist }) => {
  const { tracks, setCurrentTrack, setIsPlaying } = useMusic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const genres = ['Electronic', 'Ambient', 'Hip Hop', 'Jazz', 'Classical', 'Rock', 'Pop'];
  const moods = ['Focus', 'Chill', 'Energetic', 'Euphoric', 'Dark'];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood) 
        : [...prev, mood]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedMoods([]);
  };

  // Perform multi-filtering
  const filteredTracks = tracks.filter(track => {
    // 1. Genre filter (Union of selected genres)
    if (selectedGenres.length > 0) {
      if (!selectedGenres.some(g => track.genre.toLowerCase() === g.toLowerCase())) {
        return false;
      }
    }

    // 2. Mood filter (Union of selected moods)
    if (selectedMoods.length > 0) {
      if (!selectedMoods.some(m => track.mood.toLowerCase() === m.toLowerCase())) {
        return false;
      }
    }

    // 3. Search query filter (matches title, artist, album, genre, mood)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const matchesTitle = track.title.toLowerCase().includes(query);
      const matchesArtist = track.artist.toLowerCase().includes(query);
      const matchesAlbum = track.album?.toLowerCase().includes(query);
      const matchesGenre = track.genre.toLowerCase().includes(query);
      const matchesMood = track.mood.toLowerCase().includes(query);

      if (!matchesTitle && !matchesArtist && !matchesAlbum && !matchesGenre && !matchesMood) {
        return false;
      }
    }

    return true;
  });

  const showReset = selectedGenres.length > 0 || selectedMoods.length > 0 || searchQuery.trim() !== '';

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 pt-12 h-full pb-32 px-8 md:px-20 lg:px-24">
      <DiscoverHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={resetFilters}
        showReset={showReset}
        itemVariants={itemVariants}
      />

      <CategorySelectors
        genres={genres}
        moods={moods}
        selectedGenres={selectedGenres}
        selectedMoods={selectedMoods}
        toggleGenre={toggleGenre}
        toggleMood={toggleMood}
        itemVariants={itemVariants}
      />

      <DiscoverResults
        filteredTracks={filteredTracks}
        selectedGenres={selectedGenres}
        selectedMoods={selectedMoods}
        searchQuery={searchQuery}
        toggleGenre={toggleGenre}
        toggleMood={toggleMood}
        resetFilters={resetFilters}
        playTrack={playTrack}
        onNavigateToArtist={onNavigateToArtist}
        itemVariants={itemVariants}
      />
    </motion.div>
  );
};
