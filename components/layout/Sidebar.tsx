import React from 'react';
import { Home, Library, BarChart2, Settings, Search, Mic, PlusSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'stats', icon: BarChart2, label: 'Cortex Stats' },
  ];

  const libraryItems = [
    { id: 'library', icon: Library, label: 'Your Library' },
  ];

  return (
    <motion.aside 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-72 h-full bg-surface/35 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 hidden lg:flex shrink-0 select-none z-40"
    >
      {/* Brand Header */}
      <motion.div variants={itemVariants} className="flex flex-col mb-8">
        <div className="flex items-center gap-3.5 pt-4 pb-6">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_4px_24px_rgba(255,255,255,0.12)] shrink-0">
            <Mic size={20} className="text-background" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider uppercase text-text-primary">Cortex FM</h1>
            <p className="text-[9px] font-mono tracking-widest text-text-secondary opacity-50 uppercase mt-0.5">Neural Audio Suite</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full" />
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-8">
        {/* Menu Section */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h2 className="text-[10px] font-black uppercase text-text-secondary/50 tracking-[0.25em] px-3.5">Menu</h2>
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.li key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative focus:outline-none ${
                      isActive 
                        ? 'text-accent' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Animated Background */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-bg"
                        className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/5 shadow-md"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {/* Animated Left Accent Bar */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-3 bottom-3 w-0.75 bg-accent rounded-r"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    <span className="relative flex items-center gap-3 z-10 w-full">
                      <item.icon size={18} className={isActive ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary transition-colors'} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* Library Section */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h2 className="text-[10px] font-black uppercase text-text-secondary/50 tracking-[0.25em] px-3.5">Library</h2>
          <ul className="space-y-1.5">
            {libraryItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'library' && ['liked', 'playlists', 'episodes'].includes(activeTab));
              return (
                <motion.li key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative focus:outline-none ${
                      isActive 
                        ? 'text-accent' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Animated Background */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-bg"
                        className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/5 shadow-md"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {/* Animated Left Accent Bar */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-3 bottom-3 w-0.75 bg-accent rounded-r"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    <span className="relative flex items-center gap-3 z-10 w-full">
                      <item.icon size={18} className={isActive ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary transition-colors'} />
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </nav>

      {/* User Account / Settings Row Pinned to Bottom */}
      <motion.div variants={itemVariants} className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="User Avatar" 
              className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wide uppercase text-white">Cortex Curator</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[9px] font-mono tracking-widest text-text-secondary opacity-60 uppercase">Connected</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2.5 rounded-xl transition-all duration-300 group focus:outline-none border ${
              activeTab === 'settings'
                ? 'bg-accent/15 text-accent border-accent/25'
                : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-transparent'
            }`}
            title="System Settings"
          >
            <Settings size={18} className={`${activeTab === 'settings' ? '' : 'group-hover:rotate-45'} transition-transform duration-500`} />
          </button>
        </div>
      </motion.div>
    </motion.aside>
  );
};
