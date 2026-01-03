
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
        return (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="text-2xl font-black uppercase tracking-widest italic"
            >
              Cortex Engine Under Maintenance
            </motion.div>
            <p className="text-xs uppercase tracking-[0.5em]">Module: {activeTab}</p>
          </div>
        );
    }
  };

  const enterApp = () => setView('app');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-text-primary font-sans selection:bg-accent selection:text-background">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage onEnter={enterApp} />
        ) : (
          <motion.div 
            key="app-main"
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full"
          >
            {/* Sidebar - Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-48 pt-12 px-8 md:px-20 lg:px-24">
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
