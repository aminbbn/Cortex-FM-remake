
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
        delayChildren: 0.5,
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
    { id: 'liked', icon: Heart, label: 'Liked Songs' },
    { id: 'playlists', icon: PlusSquare, label: 'Playlists' },
  ];

  return (
    <motion.aside 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-72 h-full bg-surface/30 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 hidden lg:flex"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-14">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-xl">
          <Mic size={22} className="text-background" />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-text-primary">Cortex FM</h1>
      </motion.div>

      <nav className="flex-1 space-y-12">
        <motion.div variants={itemVariants}>
          <h2 className="text-[10px] font-black text-text-secondary tracking-[0.4em] mb-6 px-4 opacity-40">Menu</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li key={item.id} variants={itemVariants}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[13px] transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-accent' : 'group-hover:text-text-primary transition-colors'} />
                  <span className="text-sm font-black tracking-widest">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-[10px] font-black text-text-secondary tracking-[0.4em] mb-6 px-4 opacity-40">Library</h2>
          <ul className="space-y-2">
            {libraryItems.map((item) => (
              <motion.li key={item.id} variants={itemVariants}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-[13px] transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border border-transparent'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-accent' : 'group-hover:text-text-primary transition-colors'} />
                  <span className="text-sm font-black tracking-widest">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </nav>

      <motion.div variants={itemVariants} className="mt-auto border-t border-white/5 pt-8">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-[13px] text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-all duration-300 group border border-transparent"
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-sm font-black tracking-widest">Settings</span>
        </button>
      </motion.div>
    </motion.aside>
  );
};
