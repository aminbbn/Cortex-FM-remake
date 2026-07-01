import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedFiltersPanelProps {
  showFilters: boolean;
  subTab: string;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  selectedBpmRange: string;
  setSelectedBpmRange: (range: string) => void;
  selectedDurationRange: string;
  setSelectedDurationRange: (range: string) => void;
  availableGenres: string[];
  availableMoods: string[];
  isFiltered: boolean;
  resetFilters: () => void;
}

export const AdvancedFiltersPanel: React.FC<AdvancedFiltersPanelProps> = ({
  showFilters,
  subTab,
  selectedGenre,
  setSelectedGenre,
  selectedMood,
  setSelectedMood,
  selectedBpmRange,
  setSelectedBpmRange,
  selectedDurationRange,
  setSelectedDurationRange,
  availableGenres,
  availableMoods,
  isFiltered,
  resetFilters,
}) => {
  if (!showFilters || subTab === "playlists") return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="overflow-hidden border border-white/5 bg-white/[0.01] rounded-xl"
    >
      <div className="p-5 flex flex-wrap items-end gap-6 border-l-2 border-accent/40">
        {/* Genre Filter */}
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-xs font-semibold text-text-secondary">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-surface/50 border border-white/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-accent/40 w-full cursor-pointer text-text-primary"
          >
            <option value="All">All Genres</option>
            {availableGenres
              .filter((g) => g !== "All")
              .map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
          </select>
        </div>

        {/* Mood Filter */}
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-xs font-semibold text-text-secondary">
            Mood
          </label>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="bg-surface/50 border border-white/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-accent/40 w-full cursor-pointer text-text-primary"
          >
            <option value="All">All Vibes</option>
            {availableMoods
              .filter((m) => m !== "All")
              .map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>
        </div>

        {/* Tempo/BPM Selector */}
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-xs font-semibold text-text-secondary">
            Tempo
          </label>
          <select
            value={selectedBpmRange}
            onChange={(e) => setSelectedBpmRange(e.target.value)}
            className="bg-surface/50 border border-white/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-accent/40 w-full cursor-pointer text-text-primary"
          >
            <option value="All">All Tempos</option>
            <option value="Slow">Slow (&lt;80 BPM)</option>
            <option value="Medium">Medium (80-120 BPM)</option>
            <option value="Fast">Fast (&gt;120 BPM)</option>
          </select>
        </div>

        {/* Duration range */}
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
          <label className="text-xs font-semibold text-text-secondary">
            Length
          </label>
          <select
            value={selectedDurationRange}
            onChange={(e) => setSelectedDurationRange(e.target.value)}
            className="bg-surface/50 border border-white/5 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-accent/40 w-full cursor-pointer text-text-primary"
          >
            <option value="All">All Lengths</option>
            <option value="Short">Short (&lt;3 Min)</option>
            <option value="Medium">Medium (3-5 Min)</option>
            <option value="Long">Long (&gt;5 Min)</option>
          </select>
        </div>

        {/* Clear node */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-surface/50 hover:bg-white/5 rounded-xl text-sm font-medium flex items-center gap-2 text-text-secondary hover:text-white transition-colors shrink-0"
          >
            <X size={16} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface DesktopFilterRailProps {
  subTab: string;
  isFiltered: boolean;
  resetFilters: () => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedBpmRange: string;
  setSelectedBpmRange: (range: string) => void;
}

export const DesktopFilterRail: React.FC<DesktopFilterRailProps> = ({
  subTab,
  isFiltered,
  resetFilters,
  selectedMood,
  setSelectedMood,
  selectedGenre,
  setSelectedGenre,
  selectedBpmRange,
  setSelectedBpmRange,
}) => {
  if (subTab === "playlists") return null;

  return (
    <div className="hidden lg:flex flex-col gap-6 w-56 shrink-0 bg-surface/30 border border-white/5 rounded-2xl p-5 sticky top-28 text-left">
      <div className="text-sm font-bold border-b border-white/5 pb-3 flex justify-between items-center text-text-primary">
        <span>Quick Filters</span>
        {isFiltered && (
          <button
            onClick={resetFilters}
            title="Reset All"
            className="hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Vibe Category chips */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-text-secondary">Mood</span>
        <div className="flex flex-wrap gap-2">
          {["All", "Focus", "Chill", "Energetic", "Dark", "Euphoric"].map(
            (moodOption) => (
              <button
                key={moodOption}
                onClick={() => setSelectedMood(moodOption)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  selectedMood === moodOption
                    ? "bg-accent border-accent text-background font-semibold shadow-sm"
                    : "bg-surface/50 border-white/5 text-text-secondary hover:text-text-primary hover:border-white/10"
                }`}
              >
                {moodOption}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Genre quick selector */}
      <div className="flex flex-col gap-2.5 mt-2">
        <span className="text-xs font-semibold text-text-secondary font-sans">
          Genre
        </span>
        <div className="flex flex-col gap-1.5">
          {["All", "Electronic", "Ambient", "Hip Hop", "Rock", "Pop"].map(
            (gOption) => (
              <button
                key={gOption}
                onClick={() => setSelectedGenre(gOption)}
                className={`text-sm px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between group ${
                  selectedGenre === gOption
                    ? "bg-white/10 text-white font-semibold shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <span>{gOption}</span>
                <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-40 bg-accent transition-opacity" />
              </button>
            ),
          )}
        </div>
      </div>

      {/* Quick Speed selector */}
      <div className="flex flex-col gap-2.5 mt-2">
        <span className="text-xs font-semibold text-text-secondary font-sans">
          Tempo
        </span>
        <div className="flex flex-col gap-1">
          {[
            { label: "All Tempos", value: "All" },
            { label: "Slow (<80)", value: "Slow" },
            { label: "Medium (80-120)", value: "Medium" },
            { label: "Fast (>120)", value: "Fast" },
          ].map((tempo) => (
            <button
              key={tempo.value}
              onClick={() => setSelectedBpmRange(tempo.value)}
              className={`text-sm text-left py-1.5 px-3 rounded-lg transition-all ${
                selectedBpmRange === tempo.value
                  ? "text-accent font-semibold bg-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {tempo.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
