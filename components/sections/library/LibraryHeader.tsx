import React from "react";
import { List } from "lucide-react";

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "analyzing" | "completed" | "error";
  size: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: any[];
}

interface LibraryHeaderProps {
  subTab: "vault" | "liked" | "playlists" | "episodes";
  activePlaylist: Playlist | null | undefined;
  uploads: UploadItem[];
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  subTab,
  activePlaylist,
  uploads,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4">
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <List size={20} className="text-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            {subTab === "vault"
              ? "My Library"
              : subTab === "liked"
                ? "Liked Tracks"
                : subTab === "playlists"
                  ? activePlaylist
                    ? activePlaylist.name
                    : "Playlists"
                  : "Episodes"}
          </h1>
        </div>
        <p className="text-sm text-text-secondary font-medium opacity-60 max-w-xl pl-14">
          {subTab === "vault" &&
            "All your saved tracks in one place. Upload and manage your personal collection."}
          {subTab === "liked" &&
            "Your favorite tracks. Keep track of what you love."}
          {subTab === "playlists" &&
            (activePlaylist
              ? activePlaylist.description
              : "Create and manage custom playlists for any mood.")}
          {subTab === "episodes" && "Your favorite podcasts and audio shows."}
        </p>
      </div>

      {/* Upload active progress overlay */}
      {uploads.length > 0 && (
        <div className="flex flex-col gap-2 max-w-sm w-full bg-surface/50 border border-white/5 p-3.5 rounded-xl shadow-lg">
          {uploads.map((up) => (
            <div key={up.id} className="text-[10px] flex flex-col gap-1">
              <div className="flex justify-between font-bold">
                <span className="truncate max-w-[180px] text-text-primary">
                  {up.name}
                </span>
                <span className="text-accent uppercase">
                  {up.status === "uploading" && `${up.progress}%`}
                  {up.status === "analyzing" && "analysing..."}
                  {up.status === "completed" && "loaded"}
                  {up.status === "error" && "err"}
                </span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    up.status === "error" ? "bg-rose-500" : "bg-accent"
                  }`}
                  style={{ width: `${up.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
