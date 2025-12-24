
import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerBar } from './components/layout/PlayerBar';
import { Dashboard } from './components/sections/Dashboard';
import { Library } from './components/sections/Library';
import { LandingPage } from './components/sections/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState<'landing' | 'app'>('landing');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard key="dashboard" />;
      case 'library':
        return <Library key="library" />;
      default:
        return <Dashboard key="dashboard" />;
    }
  };

  const enterApp = () => setView('app');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-text-primary font-sans">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage onEnter={enterApp} />
        ) : (
          <motion.div 
            key="app-main"
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full"
          >
            {/* Sidebar - Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-32 pt-8 px-6 md:px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Music Player Bar */}
            <PlayerBar />
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
