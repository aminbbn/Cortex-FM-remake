import React from "react";
import {
  Search,
  X,
  Filter,
  List,
  Grid as GridIcon,
  Disc,
  Heart,
  Mic,
  Upload,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../ui/Button";

interface LibraryToolbarProps {
  subTab: "vault" | "liked" | "playlists" | "episodes";
  setSubTab: (tab: "vault" | "liked" | "playlists" | "episodes") => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSortBy: (field: any) => void;
  setSelectedPlaylistId: (id: string | null) => void;
  activePlaylist: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isFiltered: boolean;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  onUploadClick: () => void;
  onCreatePlaylistClick: () => void;
}

export const LibraryToolbar: React.FC<LibraryToolbarProps> = ({
  subTab,
  setSubTab,
  activeTab,
  setActiveTab,
  setSortBy,
  setSelectedPlaylistId,
  activePlaylist,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  isFiltered,
  viewMode,
  setViewMode,
  onUploadClick,
  onCreatePlaylistClick,
}) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-8 items-stretch xl:items-center justify-between border-b border-white/5 pb-6">
      {/* Core Sub Tabs switcher */}
      <div className="flex flex-wrap items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/5 shrink-0 self-start backdrop-blur-xl shadow-inner">
        <button
          onClick={() => {
            setSubTab("vault");
            setSelectedPlaylistId(null);
            setActiveTab("library");
            setSortBy("title");
          }}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 ${
            subTab === "vault"
              ? "bg-white/10 text-white shadow-md"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <Disc size={16} /> Library
        </button>

        <button
          onClick={() => {
            setSubTab("liked");
            setSelectedPlaylistId(null);
            setActiveTab("liked");
            setSortBy("title");
          }}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 ${
            subTab === "liked"
              ? "bg-white/10 text-white shadow-md"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <Heart size={16} /> Liked Songs
        </button>

        <button
          onClick={() => {
            setSubTab("playlists");
            setActiveTab("playlists");
            setSortBy("title");
          }}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 ${
            subTab === "playlists"
              ? "bg-white/10 text-white shadow-md"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <List size={16} /> Playlists
        </button>

        <button
          onClick={() => {
            setSubTab("episodes");
            setSelectedPlaylistId(null);
            setActiveTab("episodes");
            setSortBy("title");
          }}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 ${
            subTab === "episodes"
              ? "bg-white/10 text-white shadow-md"
              : "text-text-secondary hover:text-white hover:bg-white/5"
          }`}
        >
          <Mic size={16} /> Episodes
        </button>
      </div>

      {/* Global Toolbar Controllers: Search, Filters Panel toggle, View Toggle, Upload */}
      <div className="flex flex-wrap items-center gap-3 justify-between xl:justify-end">
        {/* Active Search Field */}
        {(!activePlaylist || subTab !== "playlists") && (
          <div className="relative flex-1 sm:flex-none">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-full py-2.5 pl-11 pr-10 text-sm font-medium focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all w-full sm:w-56 focus:sm:w-72 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Collapsible Filters Toggle */}
        {subTab !== "playlists" && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-2.5 rounded-full border text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
              showFilters || isFiltered
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-white/[0.03] border-white/5 text-text-secondary hover:text-white hover:border-white/10 hover:bg-white/5 shadow-inner"
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
            {isFiltered && (
              <span className="w-1.5 h-1.5 bg-current rounded-full ml-1" />
            )}
          </button>
        )}

        {/* View Mode Toggle (List vs Grid) */}
        {subTab !== "playlists" && (
          <div className="flex bg-white/[0.03] p-1.5 rounded-full border border-white/5 items-center backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              title="Table List Mode"
              className={`p-2 rounded-full transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-text-secondary/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Cover Grid Mode"
              className={`p-2 rounded-full transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-text-secondary/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <GridIcon size={16} />
            </button>
          </div>
        )}

        {/* Tab Specific Primary Actions */}
        {subTab === "vault" && (
          <div>
            <Button
              className="gap-2 h-11 px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all font-semibold text-sm rounded-full bg-white text-black hover:bg-white/90"
              onClick={onUploadClick}
            >
              <Upload size={18} />
              <span>Upload Audio</span>
            </Button>
          </div>
        )}

        {subTab === "playlists" && !activePlaylist && (
          <div>
            <Button
              className="gap-2 h-11 px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all font-semibold text-sm rounded-full bg-white text-black hover:bg-white/90"
              onClick={onCreatePlaylistClick}
            >
              <PlusCircle size={18} />
              <span>New Playlist</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
