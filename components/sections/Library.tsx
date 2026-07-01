import React, { useState, useRef, useMemo, useEffect } from "react";
import { useMusic } from "../../context/MusicContext";
import { motion, AnimatePresence } from "framer-motion";
import { Track, Episode, Playlist } from "../../types";

// Import modular sub-components
import { LibraryHeader } from "./library/LibraryHeader";
import { LibraryToolbar } from "./library/LibraryToolbar";
import { AdvancedFiltersPanel, DesktopFilterRail } from "./library/FilterSystem";
import { PlaylistInspector, PlaylistsDirectory } from "./library/PlaylistView";
import { TracksListView, TracksGridView, EpisodesDirectory } from "./library/TrackView";
import { PlaylistCreateModal } from "./library/PlaylistCreateModal";

interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "analyzing" | "completed" | "error";
  size: string;
}

interface LibraryProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToArtist?: (artist: string) => void;
  onNavigateToAlbum?: (trackId: string) => void;
}

export const Library: React.FC<LibraryProps> = ({
  activeTab,
  setActiveTab,
  onNavigateToArtist,
  onNavigateToAlbum,
}) => {
  const {
    tracks,
    vaultTracks,
    addTrack,
    setCurrentTrack,
    setIsPlaying,
    likedTracks,
    playlists,
    createPlaylist,
    episodes,
  } = useMusic();

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-tabs management
  const [subTab, setSubTab] = useState<'vault' | 'liked' | 'playlists' | 'episodes'>(() => {
    if (activeTab === 'liked') return 'liked';
    if (activeTab === 'playlists') return 'playlists';
    if (activeTab === 'episodes') return 'episodes';
    return 'vault';
  });

  // Track the active expanded playlist
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // View style toggle: 'list' (compact table) vs 'grid' (visual cards)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [selectedBpmRange, setSelectedBpmRange] = useState("All"); // All, Slow, Medium, Fast
  const [selectedDurationRange, setSelectedDurationRange] = useState("All"); // All, Short, Medium, Long
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'bpm' | 'duration' | 'publishDate' | null>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // UI state
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Sync sub-tab if parent activeTab changes
  useEffect(() => {
    if (activeTab === 'liked') {
      setSubTab('liked');
      setSelectedPlaylistId(null);
    } else if (activeTab === 'playlists') {
      setSubTab('playlists');
    } else if (activeTab === 'episodes') {
      setSubTab('episodes');
      setSelectedPlaylistId(null);
    } else if (activeTab === 'library') {
      setSubTab('vault');
      setSelectedPlaylistId(null);
    }
  }, [activeTab]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Simulate File Upload Flow
  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const audioUrl = URL.createObjectURL(file);

    const newUpload: UploadItem = {
      id,
      name: file.name,
      progress: 0,
      status: "uploading",
      size: formatFileSize(file.size),
    };

    setUploads((prev) => [newUpload, ...prev]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20 + 5;

      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploads((prev) =>
          prev.map((up) =>
            up.id === id ? { ...up, progress: 100, status: "analyzing" } : up,
          ),
        );

        // Mock sound analysis
        setTimeout(() => {
          const tempAudio = new Audio(audioUrl);
          const handleLoaded = () => {
            const newTrack: Track = {
              id: `uploaded-${Date.now()}-${id}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              artist: "Vault Owner",
              album: "Imported Frequencies",
              coverUrl: `https://picsum.photos/seed/${id}/400/400`,
              audioUrl: audioUrl,
              duration: tempAudio.duration || 192,
              genre: ["Liquid D&B", "Synthwave", "Ambient", "Indie", "Electronic"][
                Math.floor(Math.random() * 5)
              ],
              mood: ["Energetic", "Calm", "Euphoric", "Focus", "Chill", "Dark"][
                Math.floor(Math.random() * 6)
              ],
              bpm: 70 + Math.floor(Math.random() * 95),
            };

            addTrack(newTrack);
            setUploads((prev) =>
              prev.map((up) =>
                up.id === id ? { ...up, status: "completed" } : up,
              ),
            );
            
            // Auto remove completion toast after 3s
            setTimeout(() => {
              setUploads((prev) => prev.filter((up) => up.id !== id));
            }, 3000);
          };

          tempAudio.addEventListener("loadedmetadata", handleLoaded);
          // Fallback if metadata fails
          setTimeout(() => {
            if (tempAudio.duration === 0 || isNaN(tempAudio.duration)) {
              handleLoaded();
            }
          }, 1500);
        }, 1000);

      } else {
        setUploads((prev) =>
          prev.map((up) =>
            up.id === id
              ? { ...up, progress: Math.floor(currentProgress) }
              : up,
          ),
        );
      }
    }, 200);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => simulateUpload(file));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Get current dataset based on Active Tab & Selected Playlist
  const rawDataset = useMemo(() => {
    if (subTab === 'playlists') {
      if (selectedPlaylistId) {
        const foundPl = playlists.find(p => p.id === selectedPlaylistId);
        return foundPl ? foundPl.tracks : [];
      }
      return [];
    }
    if (subTab === 'liked') {
      return tracks.filter((t) => likedTracks.includes(t.id));
    }
    if (subTab === 'episodes') {
      return episodes;
    }
    // Default Vault
    return vaultTracks;
  }, [subTab, selectedPlaylistId, vaultTracks, tracks, likedTracks, playlists, episodes]);

  // Apply search query & custom metadata filters
  const filteredDataset = useMemo(() => {
    return rawDataset.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesArtist = item.artist.toLowerCase().includes(q);
        const matchesAlbum = item.album.toLowerCase().includes(q);
        const matchesShow = 'showName' in item ? (item as Episode).showName.toLowerCase().includes(q) : false;
        const matchesDesc = 'description' in item ? (item as Episode).description.toLowerCase().includes(q) : false;
        
        if (!matchesTitle && !matchesArtist && !matchesAlbum && !matchesShow && !matchesDesc) {
          return false;
        }
      }

      // 2. Genre Filter
      if (selectedGenre !== "All" && item.genre !== selectedGenre) {
        return false;
      }

      // 3. Mood Filter
      if (selectedMood !== "All" && item.mood !== selectedMood) {
        return false;
      }

      // 4. BPM Filter
      if (selectedBpmRange !== "All") {
        const bpm = item.bpm;
        if (selectedBpmRange === "Slow" && bpm >= 80) return false;
        if (selectedBpmRange === "Medium" && (bpm < 80 || bpm > 120)) return false;
        if (selectedBpmRange === "Fast" && bpm <= 120) return false;
      }

      // 5. Duration Filter
      if (selectedDurationRange !== "All") {
        const dur = item.duration;
        if (selectedDurationRange === "Short" && dur >= 180) return false; // < 3 mins
        if (selectedDurationRange === "Medium" && (dur < 180 || dur > 300)) return false; // 3-5 mins
        if (selectedDurationRange === "Long" && dur <= 300) return false; // > 5 mins
      }

      return true;
    });
  }, [rawDataset, searchQuery, selectedGenre, selectedMood, selectedBpmRange, selectedDurationRange]);

  // Sort filtered dataset
  const sortedDataset = useMemo(() => {
    const result = [...filteredDataset];
    if (!sortBy) return result;

    result.sort((a, b) => {
      let valA = a[sortBy as keyof typeof a];
      let valB = b[sortBy as keyof typeof b];

      // Handle missing or undefined fields
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
    return result;
  }, [filteredDataset, sortBy, sortOrder]);

  // Available filters from the current raw dataset (to populate dropdowns dynamically)
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    rawDataset.forEach(t => { if (t.genre) genres.add(t.genre); });
    return ["All", ...Array.from(genres)];
  }, [rawDataset]);

  const availableMoods = useMemo(() => {
    const moods = new Set<string>();
    rawDataset.forEach(t => { if (t.mood) moods.add(t.mood); });
    return ["All", ...Array.from(moods)];
  }, [rawDataset]);

  // Reset Filters helper
  const isFiltered = selectedGenre !== "All" || selectedMood !== "All" || selectedBpmRange !== "All" || selectedDurationRange !== "All" || searchQuery !== "";
  const resetFilters = () => {
    setSelectedGenre("All");
    setSelectedMood("All");
    setSelectedBpmRange("All");
    setSelectedDurationRange("All");
    setSearchQuery("");
  };

  // Header playlist target info
  const activePlaylist = useMemo(() => {
    if (subTab === 'playlists' && selectedPlaylistId) {
      return playlists.find(p => p.id === selectedPlaylistId);
    }
    return null;
  }, [subTab, selectedPlaylistId, playlists]);

  return (
    <div className="relative min-h-screen bg-background text-text-primary pt-10 px-6 md:px-12 lg:px-16 pb-36">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".mp3,.flac,.wav,.m4a"
      />

      <LibraryHeader
        subTab={subTab}
        activePlaylist={activePlaylist}
        uploads={uploads}
      />

      <LibraryToolbar
        subTab={subTab}
        setSubTab={setSubTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSortBy={setSortBy}
        setSelectedPlaylistId={setSelectedPlaylistId}
        activePlaylist={activePlaylist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isFiltered={isFiltered}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onUploadClick={() => fileInputRef.current?.click()}
        onCreatePlaylistClick={() => setShowCreateModal(true)}
      />

      <AnimatePresence>
        {showFilters && subTab !== 'playlists' && (
          <AdvancedFiltersPanel
            showFilters={showFilters}
            subTab={subTab}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            selectedBpmRange={selectedBpmRange}
            setSelectedBpmRange={setSelectedBpmRange}
            selectedDurationRange={selectedDurationRange}
            setSelectedDurationRange={setSelectedDurationRange}
            availableGenres={availableGenres}
            availableMoods={availableMoods}
            isFiltered={isFiltered}
            resetFilters={resetFilters}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <DesktopFilterRail
          subTab={subTab}
          isFiltered={isFiltered}
          resetFilters={resetFilters}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedBpmRange={selectedBpmRange}
          setSelectedBpmRange={setSelectedBpmRange}
        />

        <div className="relative grid flex-1 min-w-0">
          <AnimatePresence>
            <motion.div
              key={subTab + (activePlaylist ? `-${activePlaylist.id}` : '') + viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="col-start-1 row-start-1 flex-1 w-full min-w-0"
            >
            {subTab === 'playlists' && activePlaylist && (
              <PlaylistInspector
                activePlaylist={activePlaylist}
                setSelectedPlaylistId={setSelectedPlaylistId}
                playTrack={playTrack}
                activeMenuTrackId={activeMenuTrackId}
                setActiveMenuTrackId={setActiveMenuTrackId}
              />
            )}

            {subTab === 'playlists' && !activePlaylist && (
              <PlaylistsDirectory
                playlists={playlists}
                setSelectedPlaylistId={setSelectedPlaylistId}
                setShowCreateModal={setShowCreateModal}
              />
            )}

            {(subTab === 'vault' || subTab === 'liked') && viewMode === 'list' && (
              <TracksListView
                sortedDataset={sortedDataset as Track[]}
                subTab={subTab}
                playTrack={playTrack}
                activeMenuTrackId={activeMenuTrackId}
                setActiveMenuTrackId={setActiveMenuTrackId}
                isFiltered={isFiltered}
                resetFilters={resetFilters}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            )}

            {(subTab === 'vault' || subTab === 'liked') && viewMode === 'grid' && (
              <TracksGridView
                sortedDataset={sortedDataset as Track[]}
                subTab={subTab}
                playTrack={playTrack}
                isFiltered={isFiltered}
                resetFilters={resetFilters}
              />
            )}

            {subTab === 'episodes' && (
              <EpisodesDirectory
                sortedDataset={sortedDataset as Episode[]}
                playTrack={playTrack}
                isFiltered={isFiltered}
                resetFilters={resetFilters}
              />
            )}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <PlaylistCreateModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        createPlaylist={createPlaylist}
      />
    </div>
  );
};
