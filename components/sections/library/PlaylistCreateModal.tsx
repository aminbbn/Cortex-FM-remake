import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaylistCreateModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  newPlaylistName: string;
  setNewPlaylistName: (name: string) => void;
  createPlaylist: (name: string) => void;
}

export const PlaylistCreateModal: React.FC<PlaylistCreateModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  newPlaylistName,
  setNewPlaylistName,
  createPlaylist,
}) => {
  return (
    <AnimatePresence>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-[#0e0e11] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-5 font-mono text-left"
          >
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-white font-mono">
                Initialize New Container
              </h3>
              <p className="text-[11px] text-text-secondary/75 font-bold mt-1">
                Specify details to establish a new discrete audio partition bin.
              </p>
            </div>

            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Container Tag Name... (e.g. FOCUS WAVE)"
              className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-accent/40 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-white/20 focus:outline-none focus:bg-white/[0.04] transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newPlaylistName.trim()) {
                  createPlaylist(newPlaylistName.trim());
                  setNewPlaylistName("");
                  setShowCreateModal(false);
                } else if (e.key === "Escape") {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }
              }}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider transition-colors text-white"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  if (newPlaylistName.trim()) {
                    createPlaylist(newPlaylistName.trim());
                    setNewPlaylistName("");
                    setShowCreateModal(false);
                  }
                }}
                disabled={!newPlaylistName.trim()}
                className="px-4 py-2 rounded-lg bg-accent text-background disabled:opacity-40 disabled:hover:bg-accent text-[10px] font-black uppercase tracking-wider hover:bg-accent/90 transition-all active:scale-95"
              >
                Confirm Bin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
