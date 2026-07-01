import React from "react";
import {
  List,
  FolderPlus,
  Play,
  MoreHorizontal,
  Music,
  Plus,
} from "lucide-react";
import { Button } from "../../ui/Button";
import { TrackDropdown } from "../../ui/TrackDropdown";
import { Track, Playlist } from "../../../types";

interface PlaylistInspectorProps {
  activePlaylist: Playlist;
  setSelectedPlaylistId: (id: string | null) => void;
  playTrack: (track: Track) => void;
  activeMenuTrackId: string | null;
  setActiveMenuTrackId: (id: string | null) => void;
}

export const PlaylistInspector: React.FC<PlaylistInspectorProps> = ({
  activePlaylist,
  setSelectedPlaylistId,
  playTrack,
  activeMenuTrackId,
  setActiveMenuTrackId,
}) => {
  return (
    <div className="space-y-6 text-left">
      {/* Back breadcrumb */}
      <button
        onClick={() => setSelectedPlaylistId(null)}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
      >
        &larr; Back to playlists
      </button>

      {/* Playlist banner layout */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
        <img
          src={activePlaylist.coverUrl}
          className="w-40 h-40 rounded-xl object-cover shadow-2xl border border-white/5"
          alt=""
        />
        <div className="text-center md:text-left space-y-2 flex-1">
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
            Playlist
          </span>
          <h2 className="text-3xl font-black tracking-tight">
            {activePlaylist.name}
          </h2>
          <p className="text-text-secondary text-sm font-medium max-w-lg leading-relaxed opacity-80">
            {activePlaylist.description}
          </p>
          <p className="text-sm text-text-secondary/60 font-medium pt-1">
            {activePlaylist.tracks.length} tracks • Created by you
          </p>
        </div>
        {activePlaylist.tracks.length > 0 && (
          <Button
            onClick={() => playTrack(activePlaylist.tracks[0])}
            className="gap-2 shrink-0 h-10 px-6 active:scale-95 text-sm font-semibold shadow-lg shadow-accent/10 rounded-xl"
          >
            <Play size={16} fill="currentColor" /> Play All
          </Button>
        )}
      </div>

      {/* Tracks list inside playlist */}
      {activePlaylist.tracks.length > 0 ? (
        <div className="space-y-2 mt-8">
          {activePlaylist.tracks.map((track, idx) => (
            <div
              key={track.id}
              className="flex items-center gap-5 p-3 rounded-2xl hover:bg-surface transition-all duration-300 group border border-transparent hover:border-white/5 relative cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <div className="w-6 flex justify-center shrink-0">
                <span className="text-sm font-bold text-text-secondary/40 group-hover:hidden transition-all">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <Play
                  size={14}
                  className="hidden group-hover:block fill-current text-accent"
                />
              </div>

              <img
                src={track.coverUrl}
                className="w-12 h-12 rounded-xl object-cover shadow-sm"
                alt=""
              />

              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="min-w-0">
                  <h4 className="text-base font-bold group-hover:text-accent transition-colors truncate tracking-tight">
                    {track.title}
                  </h4>
                  <p className="text-sm text-text-secondary font-medium truncate mt-0.5 opacity-60">
                    {track.artist}
                  </p>
                </div>
                <div className="hidden md:block text-sm text-text-secondary/80 font-medium truncate">
                  {track.album}
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-sm text-right text-text-secondary/70 font-medium w-12 font-mono">
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, "0")}
                </div>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() =>
                      setActiveMenuTrackId(
                        activeMenuTrackId === track.id ? null : track.id,
                      )
                    }
                    className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {activeMenuTrackId === track.id && (
                    <TrackDropdown
                      track={track}
                      onClose={() => setActiveMenuTrackId(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 bg-surface/30 mt-8">
          <Music size={32} className="text-text-secondary/40" />
          <p className="text-text-secondary text-sm font-medium">
            This playlist is currently empty.
          </p>
        </div>
      )}
    </div>
  );
};

interface PlaylistsDirectoryProps {
  playlists: Playlist[];
  setSelectedPlaylistId: (id: string | null) => void;
  setShowCreateModal: (show: boolean) => void;
}

export const PlaylistsDirectory: React.FC<PlaylistsDirectoryProps> = ({
  playlists,
  setSelectedPlaylistId,
  setShowCreateModal,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => setSelectedPlaylistId(playlist.id)}
          className="bg-white/[0.015] border border-white/5 hover:border-accent/20 hover:bg-white/[0.03] transition-all rounded-2xl p-5 group cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
          <div className="flex justify-between items-start gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <List
                size={20}
                className="text-accent group-hover:text-white transition-colors"
              />
            </div>
            <span className="text-xs font-semibold bg-white/5 px-2.5 py-1 rounded-full text-text-secondary">
              {playlist.tracks.length} tracks
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight group-hover:text-accent transition-colors line-clamp-1">
              {playlist.name}
            </h3>
            <p className="text-sm text-text-secondary/60 font-medium leading-relaxed line-clamp-2">
              {playlist.description || "Custom curated playlist"}
            </p>
          </div>
        </div>
      ))}
      {playlists.length === 0 && (
        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl gap-5">
          <div className="p-4 bg-white/5 rounded-full">
            <FolderPlus size={36} className="text-text-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              No playlists created
            </h3>
            <p className="text-sm text-text-secondary font-medium max-w-sm mx-auto opacity-70">
              Create a playlist to organize your favorite tracks.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-2 active:scale-95 shadow-md text-sm font-semibold rounded-xl"
          >
            <Plus size={14} /> Create Playlist
          </Button>
        </div>
      )}
    </div>
  );
};
