import React from "react";
import { Disc, Play, MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/Button";
import { TrackDropdown } from "../../ui/TrackDropdown";
import { Track, Episode } from "../../../types";

const getMoodDotColor = (mood: string) => {
  const m = mood.toLowerCase();
  if (m.includes("focus"))
    return "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]";
  if (m.includes("chill"))
    return "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]";
  if (m.includes("energetic"))
    return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
  if (m.includes("euphoric"))
    return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]";
  if (m.includes("dark"))
    return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]";
  return "bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.5)]";
};

interface TracksListViewProps {
  sortedDataset: Track[];
  subTab: "vault" | "liked";
  playTrack: (track: Track) => void;
  activeMenuTrackId: string | null;
  setActiveMenuTrackId: (id: string | null) => void;
  isFiltered: boolean;
  resetFilters: () => void;
  onUploadClick: () => void;
}

export const TracksListView: React.FC<TracksListViewProps> = ({
  sortedDataset,
  subTab,
  playTrack,
  activeMenuTrackId,
  setActiveMenuTrackId,
  isFiltered,
  resetFilters,
  onUploadClick,
}) => {
  return (
    <div className="space-y-2 text-left">
      {sortedDataset.map((track, idx) => (
        <div
          key={track.id}
          onClick={() => playTrack(track)}
          className="flex items-center gap-5 p-3.5 rounded-2xl hover:bg-surface transition-all duration-300 group border border-transparent hover:border-white/5 relative cursor-pointer"
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
            alt={track.title}
            className="w-12 h-12 rounded-xl object-cover shadow-sm"
          />

          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-4">
            <div className="md:col-span-2 lg:col-span-2 min-w-0">
              <h4 className="text-base font-bold truncate group-hover:text-accent transition-colors tracking-tight">
                {track.title}
              </h4>
              <p className="text-sm text-text-secondary font-medium opacity-60 truncate">
                {track.artist}
              </p>
            </div>

            <div className="hidden md:block lg:col-span-1 text-sm text-text-secondary/80 font-medium truncate">
              {track.album}
            </div>

            <div className="hidden lg:flex items-center gap-3 lg:col-span-2">
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-white/5 text-xs text-text-secondary/80 font-medium shadow-sm">
                {track.bpm} BPM
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-white/5 text-xs font-medium text-text-secondary shadow-sm">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${getMoodDotColor(
                    track.mood,
                  )}`}
                />
                {track.mood}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="text-sm text-text-secondary/70 font-medium w-10 text-right font-mono">
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
                className={`p-2 rounded-lg text-text-secondary hover:text-white transition-colors hover:bg-white/5 ${
                  activeMenuTrackId === track.id
                    ? "opacity-100 bg-white/5"
                    : "opacity-0 group-hover:opacity-100"
                }`}
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

      {sortedDataset.length === 0 && (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-white/5 rounded-full">
            <Disc size={32} className="text-text-secondary/40 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-text-primary text-lg font-bold">
              {subTab === "liked" ? "No Liked Tracks" : "Your Library is Empty"}
            </p>
            <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
              {isFiltered
                ? "No tracks match your current filter criteria."
                : subTab === "liked"
                  ? "Like tracks around the app to see them here."
                  : "Upload your local audio files to build your collection."}
            </p>
          </div>
          {isFiltered ? (
            <Button
              onClick={resetFilters}
              size="sm"
              className="mt-2 text-sm font-semibold rounded-xl bg-surface/80"
            >
              Reset filters
            </Button>
          ) : subTab === "vault" ? (
            <Button
              onClick={onUploadClick}
              size="sm"
              className="mt-2 text-sm font-semibold rounded-xl"
            >
              Upload Audio
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

interface TracksGridViewProps {
  sortedDataset: Track[];
  subTab: "vault" | "liked";
  playTrack: (track: Track) => void;
  isFiltered: boolean;
  resetFilters: () => void;
}

export const TracksGridView: React.FC<TracksGridViewProps> = ({
  sortedDataset,
  subTab,
  playTrack,
  isFiltered,
  resetFilters,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 text-left">
      {sortedDataset.map((track) => (
        <div
          key={track.id}
          onClick={() => playTrack(track)}
          className="bg-white/[0.01] border border-white/5 hover:border-accent/25 hover:bg-white/[0.025] transition-all duration-200 rounded-xl p-3.5 group cursor-pointer relative"
        >
          {/* Square cover box with hover play button */}
          <div className="relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-white/5 mb-3 shadow-sm">
            <img
              src={track.coverUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt=""
            />
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-background shadow-lg transition-transform hover:scale-105 active:scale-95">
                <Play
                  size={16}
                  fill="currentColor"
                  className="ml-0.5 text-background"
                />
              </div>
            </div>
          </div>

          {/* Meta tags overlay in grid */}
          <div className="flex items-center gap-1 mb-1.5 justify-between">
            <span className="text-[9px] font-mono text-text-secondary/60">
              {track.bpm} BPM
            </span>
            <span className="text-[8px] font-mono border border-white/5 px-1.5 py-0.5 rounded uppercase text-text-secondary/50">
              {track.mood}
            </span>
          </div>

          <h4 className="text-xs font-black tracking-tight group-hover:text-accent transition-colors truncate uppercase">
            {track.title}
          </h4>
          <p className="text-[10px] text-text-secondary/55 font-bold truncate tracking-wide mt-0.5">
            {track.artist}
          </p>
        </div>
      ))}

      {sortedDataset.length === 0 && (
        <div className="col-span-full py-24 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.005]">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-text-secondary text-sm font-bold">
              No Records Mounted
            </p>
            <p className="text-text-secondary/55 text-xs">
              Try clearing active search or filters.
            </p>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-accent uppercase tracking-wider font-black hover:underline mt-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface EpisodesDirectoryProps {
  sortedDataset: Episode[];
  playTrack: (episode: Episode) => void;
  isFiltered: boolean;
  resetFilters: () => void;
}

export const EpisodesDirectory: React.FC<EpisodesDirectoryProps> = ({
  sortedDataset,
  playTrack,
  isFiltered,
  resetFilters,
}) => {
  return (
    <div className="space-y-4 text-left">
      {sortedDataset.map((episode) => (
        <div
          key={episode.id}
          className="bg-white/[0.015] border border-white/5 hover:border-accent/15 hover:bg-white/[0.03] rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row gap-5 group font-mono relative"
        >
          {/* Episode thumbnail */}
          <div className="relative w-full md:w-28 h-28 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/5 bg-white/5">
            <img
              src={episode.coverUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt=""
            />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <button
                onClick={() => playTrack(episode)}
                className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-background shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                <Play
                  size={16}
                  fill="currentColor"
                  className="ml-0.5 text-background"
                />
              </button>
            </div>
          </div>

          {/* Details section */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap text-[9px] font-bold text-text-secondary/65 uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-black">
                  {episode.showName}
                </span>
                <span>•</span>
                <span>{episode.publishDate}</span>
              </div>
              <h3
                onClick={() => playTrack(episode)}
                className="text-base font-black text-text-primary group-hover:text-accent transition-colors tracking-tight truncate uppercase cursor-pointer"
              >
                {episode.title}
              </h3>
              <p className="text-[10px] text-text-secondary/70 font-bold mt-1">
                Host: <span className="text-text-primary">{episode.artist}</span>
              </p>
              <p className="text-xs text-text-secondary/70 leading-relaxed mt-2.5 line-clamp-2">
                {episode.description}
              </p>
            </div>

            {/* Footer analysis & Play Trigger */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.04] flex-wrap gap-4">
              <div className="flex items-center gap-3.5 text-[10px] text-text-secondary/50 font-bold">
                <span>
                  BPM:{" "}
                  <strong className="text-text-primary/80">
                    {episode.bpm}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  VIBE:{" "}
                  <strong className="text-text-primary/80 uppercase">
                    {episode.mood}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  LENGTH:{" "}
                  <strong className="text-text-primary/80">
                    {(episode.duration / 60).toFixed(0)} MIN
                  </strong>
                </span>
              </div>

              <button
                onClick={() => playTrack(episode)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-white text-background text-[10px] font-black uppercase tracking-wider rounded-lg active:scale-95 transition-all"
              >
                <Play size={10} fill="currentColor" /> Play Episode
              </button>
            </div>
          </div>
        </div>
      ))}

      {sortedDataset.length === 0 && (
        <div className="py-24 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.005]">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-text-secondary text-sm font-bold">
              No Episodes Loaded
            </p>
            <p className="text-text-secondary/55 text-xs">
              No records correspond to the active filter search.
            </p>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-accent uppercase tracking-wider font-black hover:underline mt-1"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
