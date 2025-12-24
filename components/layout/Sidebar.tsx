
import React from 'react';
import { Home, Library, BarChart2, Settings, Search, Mic, PlusSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'discover', icon: Search, label: 'Discover' },
    { id: 'stats', icon: BarChart2, label: 'Cortex Stats' },
  ];

  const libraryItems = [
    { id: 'library', icon: Library, label: 'Your Library' },
    { id: 'liked', icon: Heart, label: 'Liked Songs' },
    { id: 'create', icon: PlusSquare, label: 'Create Playlist' },
  ];

  return (
    <aside className="w-64 h-full bg-surface/50 border-r border-accent/5 flex flex-col p-6 hidden lg:flex">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Mic size={18} className="text-background" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase">Cortex FM</h1>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4 px-3">Menu</h2>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    activeTab === item.id ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-accent' : 'group-hover:text-text-primary'} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4 px-3">Library</h2>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    activeTab === item.id ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-accent' : 'group-hover:text-text-primary'} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto border-t border-accent/5 pt-6">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-200"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
