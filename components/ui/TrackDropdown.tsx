import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ListPlus, Radio, User, Disc, Info, Share2, 
  Plus, ChevronRight, Link2, Code, ShieldAlert, Check, Music
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { Track } from '../../types';

interface TrackDropdownProps {
  track: Track;
  currentArtistPage?: string;
  onClose: () => void;
  align?: 'right' | 'left';
}

export const TrackDropdown: React.FC<TrackDropdownProps> = ({ 
  track, 
  currentArtistPage = '', 
  onClose,
  align = 'right'
}) => {
  const { 
    likedTracks, 
    toggleLikeTrack, 
    playlists, 
    createPlaylist, 
    addTrackToPlaylist,
    addToQueue 
  } = useMusic();

  const [hoveredItem, setHoveredItem] = useState<'playlist' | 'share' | null>(null);
  const [showCredits, setShowCredits] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const [position, setPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0, isUpwards: false });
  const triggerRef = useRef<HTMLDivElement>(null);

  const isLiked = likedTracks.includes(track.id);

  useEffect(() => {
    if (triggerRef.current) {
      const parent = triggerRef.current.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        
        // Ensure dropdown doesn't go off bottom of screen
        const spaceBelow = window.innerHeight - rect.bottom;
        const isUpwards = spaceBelow < 400; // If less than 400px below, open upwards

        setPosition({
          top: rect.bottom,
          bottom: window.innerHeight - rect.top,
          left: rect.left,
          right: window.innerWidth - rect.right,
          isUpwards
        });
      }
    }
    
    const handleScroll = () => onClose();
    window.addEventListener('scroll', handleScroll, true);
    
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [onClose]);

  const showToast = (message: string) => {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: message }));
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeTrack(track.id);
    showToast(isLiked ? 'Removed from Liked Songs' : 'Saved to Liked Songs');
    onClose();
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    showToast(`Added "${track.title}" to Queue`);
    onClose();
  };

  const handleGoToRadio = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('nav:tab', { detail: 'radio' }));
    // Also dispatch the specific track we want to create radio for
    window.dispatchEvent(new CustomEvent('nav:radio', { detail: track.id }));
    onClose();
  };

  const handleGoToArtist = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('nav:artist', { detail: track.artist }));
    onClose();
  };

  const handleGoToAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('nav:album', { detail: track.id }));
    onClose();
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    createPlaylist(newPlaylistName.trim(), track);
    showToast(`Created playlist "${newPlaylistName.trim()}" and added "${track.title}"`);
    setNewPlaylistName('');
    setIsCreatingPlaylist(false);
    onClose();
  };

  const handleAddTrackToPlaylist = (playlistId: string, playlistName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addTrackToPlaylist(playlistId, track);
    showToast(`Added "${track.title}" to "${playlistName}"`);
    onClose();
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/track/${track.id}`;
    navigator.clipboard.writeText(link);
    showToast('Song link copied to clipboard!');
    onClose();
  };

  const handleCopyEmbed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const embedCode = `<iframe src="${window.location.origin}/embed/${track.id}" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media" style="border-radius: 8px; background: #000;"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    showToast('Embed link copied to clipboard!');
    onClose();
  };

  const dropdownContent = (
    <div className="fixed inset-0 z-[9999]" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        style={{
          ...(position.isUpwards ? { bottom: position.bottom + 8 } : { top: position.top + 8 }),
          ...(align === 'right' ? { right: position.right } : { left: position.left }),
        }}
        className="fixed w-56 bg-[#121212]/95 border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl p-1 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Play/Queue */}
        <button 
          onClick={handleAddToQueue}
          className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
        >
          <ListPlus size={14} className="opacity-70" />
          <span>Add to queue</span>
        </button>

        {/* Like */}
        <button 
          onClick={handleToggleLike}
          className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
        >
          <Heart size={14} className={`opacity-70 ${isLiked ? 'fill-accent text-accent opacity-100' : ''}`} />
          <span>{isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
        </button>

        <div className="h-px bg-white/10 my-1 mx-1" />

        {/* Add to Playlist Submenu Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredItem('playlist')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-full px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Plus size={14} className="opacity-70" />
              <span>Add to playlist</span>
            </div>
            
            <ChevronRight size={12} className="opacity-40" />
          </div>

          {/* Playlist Submenu Panel */}
          <AnimatePresence>
            {hoveredItem === 'playlist' && (
              <motion.div 
                initial={{ opacity: 0, x: 10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.98 }}
                className="absolute right-full top-0 mr-1.5 w-48 bg-[#161616]/95 border border-white/10 rounded-xl shadow-2xl p-1.5 max-h-64 overflow-y-auto"
              >
                {isCreatingPlaylist ? (
                  <form onSubmit={handleCreatePlaylistSubmit} className="p-1.5 space-y-2">
                    <div className="text-[10px] font-black tracking-widest uppercase text-accent">New Playlist</div>
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="Enter name..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button 
                        type="button" 
                        onClick={() => setIsCreatingPlaylist(false)}
                        className="px-2 py-1 rounded text-[10px] text-white/50 hover:bg-white/5 font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-2 py-1 rounded bg-accent text-background text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCreatingPlaylist(true);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs font-black text-accent hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-2 mb-1 border border-accent/20"
                    >
                      <Plus size={12} />
                      <span>Create New Playlist</span>
                    </button>

                    <div className="text-[9px] font-black text-white/40 tracking-wider uppercase px-2 py-1">Your Playlists</div>
                    {playlists.length === 0 ? (
                      <div className="text-[10px] text-white/40 italic px-2 py-2">No playlists yet</div>
                    ) : (
                      playlists.map(pl => (
                        <button 
                          key={pl.id}
                          onClick={(e) => handleAddTrackToPlaylist(pl.id, pl.name, e)}
                          className="w-full text-left px-2 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2 truncate"
                        >
                          <Music size={12} className="opacity-50 shrink-0" />
                          <span className="truncate">{pl.name}</span>
                        </button>
                      ))
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Go to song radio */}
        <button 
          onClick={handleGoToRadio}
          className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
        >
          <Radio size={14} className="opacity-70" />
          <span>Go to song radio</span>
        </button>

        {/* Go to artist (visible only when user is NOT on that artist page) */}
        {currentArtistPage !== track.artist && (
          <button 
            onClick={handleGoToArtist}
            className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
          >
            <User size={14} className="opacity-70" />
            <span>Go to artist</span>
          </button>
        )}

        {/* Go to album */}
        <button 
          onClick={handleGoToAlbum}
          className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
        >
          <Disc size={14} className="opacity-70" />
          <span>Go to album</span>
        </button>

        {/* View credits */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowCredits(true); }}
          className="w-full text-left px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2.5"
        >
          <Info size={14} className="opacity-70" />
          <span>View credits</span>
        </button>

        <div className="h-px bg-white/10 my-1 mx-1" />

        {/* Share Submenu Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredItem('share')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="w-full px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Share2 size={14} className="opacity-70" />
              <span>Share</span>
            </div>
            <ChevronRight size={12} className="opacity-40" />
          </div>

          <AnimatePresence>
            {hoveredItem === 'share' && (
              <motion.div 
                initial={{ opacity: 0, x: 10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.98 }}
                className="absolute right-full top-0 mr-1.5 w-44 bg-[#161616]/95 border border-white/10 rounded-xl shadow-2xl p-1"
              >
                <button 
                  onClick={handleCopyLink}
                  className="w-full text-left px-2.5 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Link2 size={12} />
                  <span>Copy Song Link</span>
                </button>
                <button 
                  onClick={handleCopyEmbed}
                  className="w-full text-left px-2.5 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Code size={12} />
                  <span>Embed Link</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* CREDITS OVERLAY DIALOG */}
      <AnimatePresence>
        {showCredits && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={(e) => { e.stopPropagation(); setShowCredits(false); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <img src={track.coverUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-2xl" />
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">{track.title}</h3>
                  <p className="text-xs text-text-secondary font-bold opacity-80">{track.artist} • {track.album}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black tracking-[0.2em] text-accent uppercase pb-1.5 border-b border-white/10">Production Credits</h4>
                
                <div className="grid grid-cols-3 gap-y-4 text-xs">
                  <span className="text-text-secondary font-bold">Performers</span>
                  <span className="col-span-2 text-white font-medium">{track.artist}</span>

                  <span className="text-text-secondary font-bold">Composers</span>
                  <span className="col-span-2 text-white font-medium">{track.artist}, Cortex AI Synthesis Engine</span>

                  <span className="text-text-secondary font-bold">Producers</span>
                  <span className="col-span-2 text-white font-medium">Cortex Intelligence Music Suite</span>

                  <span className="text-text-secondary font-bold">Mixing Eng.</span>
                  <span className="col-span-2 text-white font-medium">DeepMind Audio DSP Engine</span>

                  <span className="text-text-secondary font-bold">Mastering Eng.</span>
                  <span className="col-span-2 text-white font-medium">Antigravity Waves Lab v4</span>

                  <span className="text-text-secondary font-bold">Record Label</span>
                  <span className="col-span-2 text-accent font-black tracking-wider uppercase">Cortex Records Intl.</span>
                </div>

                <h4 className="text-[10px] font-black tracking-[0.2em] text-accent uppercase pt-4 pb-1.5 border-b border-white/10">Audio Metadata</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">BPM Rate</div>
                    <div className="text-white font-black text-sm mt-0.5">{track.bpm} BPM</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <div className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">Energy Key</div>
                    <div className="text-white font-black text-sm mt-0.5">{track.mood}</div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowCredits(false)}
                className="mt-6 w-full py-2.5 bg-white text-black font-black tracking-widest uppercase text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
              >
                Close Credits
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div ref={triggerRef} className="absolute w-px h-px pointer-events-none" />
      {createPortal(dropdownContent, document.body)}
    </>
  );
};
