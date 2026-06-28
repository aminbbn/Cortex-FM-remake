
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerBar } from './components/layout/PlayerBar';
import { Dashboard } from './components/sections/Dashboard';
import { Library } from './components/sections/Library';
import { Discover } from './components/sections/Discover';
import { Stats } from './components/sections/Stats';
import { ArtistProfile } from './components/sections/ArtistProfile';
import { AlbumProfile } from './components/sections/AlbumProfile';
import { LandingPage } from './components/sections/LandingPage';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeArtist, setActiveArtist] = useState<string>('');
  const [activeAlbumTrackId, setActiveAlbumTrackId] = useState<string>('');
  const [view, setView] = useState<'landing' | 'app'>('landing');

  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for the spotlight to give it a "heavy", premium feel
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 0.8 });

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Dynamic background gradient (Dark Silver/Indigo Glow)
  const spotlightBackground = useMotionTemplate`radial-gradient(
    800px circle at ${springX}px ${springY}px,
    rgba(65, 65, 85, 0.15),
    transparent 80%
  )`;

  const handleNavigateToArtist = (artist: string) => {
    setActiveArtist(artist);
    setActiveTab('artist');
  };

  const handleNavigateToAlbum = (trackId: string) => {
    setActiveAlbumTrackId(trackId);
    setActiveTab('album');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard key="dashboard" onNavigateToArtist={handleNavigateToArtist} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'discover':
        return <Discover key="discover" onNavigateToArtist={handleNavigateToArtist} />;
      case 'stats':
        return <Stats key="stats" />;
      case 'library':
      case 'liked':
      case 'playlists':
        return <Library key={`library-${activeTab}`} activeTab={activeTab} setActiveTab={setActiveTab} onNavigateToArtist={handleNavigateToArtist} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'artist':
        return <ArtistProfile key="artist" artistName={activeArtist} onBack={() => setActiveTab('home')} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'album':
        return <AlbumProfile key="album" albumTrackId={activeAlbumTrackId} onBack={() => setActiveTab('home')} onNavigateToArtist={handleNavigateToArtist} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="text-2xl font-black tracking-widest italic"
            >
              Cortex Engine Under Maintenance
            </motion.div>
            <p className="text-xs tracking-[0.5em]">Module: {activeTab}</p>
          </div>
        );
    }
  };

  const enterApp = () => setView('app');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-text-primary font-sans selection:bg-accent selection:text-background">
      
      {/* --- GLOBAL EFFECTS LAYER --- */}
      
      {/* 1. Global Noise Overlay (5% Opacity) */}
      <div 
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* 2. Mouse Follow Spotlight */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none mix-blend-screen"
        style={{ background: spotlightBackground }}
      />

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage onEnter={enterApp} />
        ) : (
          <motion.div 
            key="app-main"
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full"
          >
            {/* Sidebar - Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-48 pt-0 px-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Music Player Bar */}
            <PlayerBar onNavigateToArtist={handleNavigateToArtist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
};

export default App;
