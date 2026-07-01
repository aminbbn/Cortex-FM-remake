import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMusic } from "../../context/MusicContext";
import { RecentlyListened } from "./dashboard/RecentlyListened";
import { PersonalizedForYou } from "./dashboard/PersonalizedForYou";
import { CortexCharts } from "./dashboard/CortexCharts";
import { MusicInsights } from "./dashboard/MusicInsights";

interface DashboardProps {
  onNavigateToArtist?: (artist: string) => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToArtist,
  onNavigateToAlbum,
}) => {
  const {
    tracks,
    setCurrentTrack,
    setIsPlaying,
    playlists,
    recentlyPlayed: globalRecentlyPlayed,
    episodes,
  } = useMusic();
  const [recentlyPlayed] = useState(() => globalRecentlyPlayed);

  const handleRecentItemClick = (item: any) => {
    switch (item.type) {
      case 'track':
        const track = tracks.find(t => t.id === item.itemId);
        if (track) {
          if (onNavigateToAlbum && track.id) {
            onNavigateToAlbum(track.id);
          } else {
            window.dispatchEvent(new CustomEvent('nav:album', { detail: track.id }));
          }
        }
        break;
      case 'episode':
        window.dispatchEvent(new CustomEvent('nav:tab', { detail: 'episodes' }));
        break;
      case 'album':
        if (onNavigateToAlbum && item.itemId) {
          onNavigateToAlbum(item.itemId);
        } else {
          window.dispatchEvent(new CustomEvent('nav:album', { detail: item.itemId }));
        }
        break;
      case 'artist':
        if (onNavigateToArtist && item.itemId) {
          onNavigateToArtist(item.itemId);
        } else {
          window.dispatchEvent(new CustomEvent('nav:artist', { detail: item.itemId }));
        }
        break;
      case 'playlist':
        window.dispatchEvent(new CustomEvent('nav:playlist', { detail: item.itemId }));
        break;
    }
  };

  const handleRecentItemPlay = (item: any) => {
    switch (item.type) {
      case 'track':
        const track = tracks.find(t => t.id === item.itemId);
        if (track) {
          setCurrentTrack(track);
          setIsPlaying(true);
        }
        break;
      case 'episode':
        const ep = episodes.find(e => e.id === item.itemId);
        if (ep) {
          setCurrentTrack(ep);
          setIsPlaying(true);
        }
        break;
      case 'playlist':
        const pl = playlists.find(p => p.id === item.itemId);
        if (pl && pl.tracks && pl.tracks.length > 0) {
          setCurrentTrack(pl.tracks[0]);
          setIsPlaying(true);
        }
        break;
      case 'album':
        const albumTrack = tracks.find(t => t.album === item.title || t.id === item.itemId);
        if (albumTrack) {
          setCurrentTrack(albumTrack);
          setIsPlaying(true);
        }
        break;
      case 'artist':
        const artistTrack = tracks.find(t => t.artist === item.title || t.artist === item.itemId);
        if (artistTrack) {
          setCurrentTrack(artistTrack);
          setIsPlaying(true);
        }
        break;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 pt-12 px-8 md:px-20 lg:px-24"
    >
      <RecentlyListened
        recentlyPlayed={recentlyPlayed}
        itemVariants={itemVariants}
        handleRecentItemClick={handleRecentItemClick}
        handleRecentItemPlay={handleRecentItemPlay}
      />

      <PersonalizedForYou itemVariants={itemVariants} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <CortexCharts
          itemVariants={itemVariants}
          onNavigateToArtist={onNavigateToArtist}
        />

        <MusicInsights itemVariants={itemVariants} />
      </div>
    </motion.div>
  );
};
