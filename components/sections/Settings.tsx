import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Sliders,
  Cpu,
  Palette,
  Database,
  Lock,
  Keyboard,
  Info,
  LogOut,
  RefreshCw,
  Trash2,
  FileJson,
  BookOpen,
  AlertCircle,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Volume2,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "../../context/MusicContext";

// Define settings interface
interface SettingsState {
  displayName: string;
  statusText: string;
  avatarUrl: string;
  accountTier: string;
  playbackQuality: "low" | "standard" | "high" | "lossless";
  crossfadeDuration: number;
  gaplessPlayback: boolean;
  volumeNormalization: boolean;
  autoplay: boolean;
  eqPreset: "flat" | "bass-boost" | "vocal" | "neural-custom";
  autoAnalyze: boolean;
  bpmSensitivity: "low" | "medium" | "high";
  moodModel: "fast" | "accurate" | "experimental";
  telemetrySync: boolean;
  themeVariant: "dark" | "deep-black" | "neural-fog" | "light-alabaster";
  accentColor: "white" | "cyan" | "purple" | "amber" | "green";
  sidebarState: "expanded" | "collapsed";
  visualizerStyle: "waveform" | "bars" | "none";
  defaultUploadFormat: "mp3" | "flac" | "wav" | "any";
  autoOrganize: boolean;
  listeningHistoryEnabled: boolean;
  shareListeningData: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  displayName: "Cortex Curator",
  statusText: "Connected",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  accountTier: "Neural Pro",
  playbackQuality: "lossless",
  crossfadeDuration: 4,
  gaplessPlayback: true,
  volumeNormalization: true,
  autoplay: false,
  eqPreset: "neural-custom",
  autoAnalyze: true,
  bpmSensitivity: "medium",
  moodModel: "accurate",
  telemetrySync: true,
  themeVariant: "dark",
  accentColor: "white",
  sidebarState: "expanded",
  visualizerStyle: "bars",
  defaultUploadFormat: "any",
  autoOrganize: true,
  listeningHistoryEnabled: true,
  shareListeningData: true,
};

// Custom generic toggle component - Just a sleek simple line with rounded corners that smoothly colors up & glows in theme accent color on click
const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onChange(!checked);
      }
    }}
    className="w-16 h-8 relative flex items-center justify-center outline-none border-0 focus:outline-none focus:ring-0 active:outline-none focus-visible:outline-none focus-visible:ring-0 select-none cursor-pointer shrink-0"
    style={{ outline: "none", border: "none", boxShadow: "none" }}
  >
    {/* Base line track (Inactive) - w-[58px] and h-[6px] with rounded corners */}
    <div className="w-[58px] h-[6px] rounded-full bg-white/15 relative overflow-visible pointer-events-none">
      {/* Glow effect behind the active line - smoothly animates with hardware-accelerated opacity */}
      <motion.div
        layout={false}
        className="absolute inset-0 rounded-full bg-accent filter blur-[8px]"
        initial={false}
        animate={{
          opacity: checked ? 0.8 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Active colored line on top */}
      <motion.div
        layout={false}
        className="absolute inset-0 rounded-full bg-accent"
        initial={false}
        animate={{
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const { clearRecentlyPlayed, clearQueue, setIsPlaying } = useMusic();

  // Load state from local storage or defaults
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("cortex_fm_settings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [activeCategory, setActiveCategory] = useState<
    "profile" | "playback" | "neural" | "appearance" | "library" | "privacy" | "shortcuts" | "about"
  >("profile");

  // Confirmation modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "signout" | "reanalyze" | "clearcache" | "clearhistory" | "";
    title: string;
    description: string;
    confirmText: string;
  }>({
    isOpen: false,
    type: "",
    title: "",
    description: "",
    confirmText: "",
  });

  // Toast notification state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "info" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Simulated long-running operation progress states
  const [operationState, setOperationState] = useState<{
    isRunning: boolean;
    type: "reanalyzing" | "purging" | "";
    progress: number;
    statusText: string;
  }>({
    isRunning: false,
    type: "",
    progress: 0,
    statusText: "",
  });

  const [activeShortcutKey, setActiveShortcutKey] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleShortcutTriggered = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      if (customEvent.detail && customEvent.detail.key) {
        setActiveShortcutKey(customEvent.detail.key);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setActiveShortcutKey(null);
        }, 800);
      }
    };
    window.addEventListener("cortex:shortcut-triggered", handleShortcutTriggered);
    return () => {
      window.removeEventListener("cortex:shortcut-triggered", handleShortcutTriggered);
      clearTimeout(timer);
    };
  }, []);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Save settings helper
  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    localStorage.setItem("cortex_fm_settings", JSON.stringify(nextSettings));
  };

  // Synchronize settings changes with App.tsx theme engine
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cortex_settings:change", { detail: settings }));
  }, [settings]);

  // Show dynamic toast helper
  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle avatar upload click and local base64 reader
  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("Image file must be under 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSetting("avatarUrl", event.target.result as string);
          triggerToast("Profile photo synchronized!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for confirmation modals
  const openConfirmModal = (type: "signout" | "reanalyze" | "clearcache" | "clearhistory") => {
    let title = "";
    let description = "";
    let confirmText = "";

    switch (type) {
      case "signout":
        title = "Sign Out of Account";
        description = "Are you sure you want to sign out? Your profile information and local session configurations will be reset to default.";
        confirmText = "Confirm Sign Out";
        break;
      case "reanalyze":
        title = "Re-analyze Music Library";
        description = "This will re-scan all tracks in your library to calculate BPM tempo, acoustic profiles, and energy traits. This is an intensive process.";
        confirmText = "Start Analysis";
        break;
      case "clearcache":
        title = "Clear Audio Cache";
        description = "Are you sure you want to clear your local audio cache? This will delete all cached song waves, preloaded audio buffers, and free up browser storage.";
        confirmText = "Clear Cache";
        break;
      case "clearhistory":
        title = "Delete Listening History";
        description = "This will permanently erase your local play history. This action cannot be undone, and your personalized recommendations will re-initialize.";
        confirmText = "Delete History";
        break;
    }

    setModalConfig({
      isOpen: true,
      type,
      title,
      description,
      confirmText,
    });
  };

  const executeModalAction = () => {
    const type = modalConfig.type;
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

    if (type === "signout") {
      updateSetting("displayName", "Cortex Curator");
      updateSetting("statusText", "Away");
      triggerToast("Signed out successfully.", "info");
    } else if (type === "reanalyze") {
      // Simulate analysis with progress bars
      setOperationState({
        isRunning: true,
        type: "reanalyzing",
        progress: 0,
        statusText: "Analyzing audio library catalog...",
      });

      let currentPrg = 0;
      const interval = setInterval(() => {
        currentPrg += Math.random() * 15 + 5;
        if (currentPrg >= 100) {
          clearInterval(interval);
          setOperationState({
            isRunning: false,
            type: "",
            progress: 100,
            statusText: "",
          });
          triggerToast("Acoustic library analysis completed", "success");
        } else {
          setOperationState((prev) => ({
            ...prev,
            progress: Math.floor(currentPrg),
            statusText: `Processing track files... ${
              currentPrg < 35
                ? "Calculating track frequency spectrum"
                : currentPrg < 75
                  ? "Evaluating timbre signatures & BPM"
                  : "Organizing vibe recommendations"
            }`,
          }));
        }
      }, 300);
    } else if (type === "clearcache") {
      setOperationState({
        isRunning: true,
        type: "purging",
        progress: 0,
        statusText: "Clearing cached track assets...",
      });

      let currentPrg = 0;
      const interval = setInterval(() => {
        currentPrg += 20;
        if (currentPrg >= 100) {
          clearInterval(interval);
          setOperationState({
            isRunning: false,
            type: "",
            progress: 100,
            statusText: "",
          });
          triggerToast("Storage cache cleared successfully", "success");
        } else {
          setOperationState((prev) => ({
            ...prev,
            progress: currentPrg,
            statusText: `Purging cached block ${currentPrg / 20}/5...`,
          }));
        }
      }, 200);
    } else if (type === "clearhistory") {
      clearRecentlyPlayed();
      clearQueue();
      setIsPlaying(false);
      triggerToast("Listening history log cleared.", "success");
    }
  };

  // Export Settings State as JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cortex-settings-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Backup settings downloaded!", "success");
  };

  // Equalizer 5-Band frequencies helper based on presets
  const eqBands = {
    "flat": [40, 40, 40, 40, 40],
    "bass-boost": [80, 70, 50, 35, 20],
    "vocal": [25, 40, 80, 75, 45],
    "neural-custom": [65, 35, 75, 55, 85],
  };

  return (
    <div className="min-h-screen text-text-primary pt-12 px-6 md:px-12 lg:px-16 pb-40 text-left font-sans">
      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 flex items-center gap-4 px-5 py-3.5 bg-[#1C1E1E] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                toast.type === "success"
                  ? "bg-emerald-400 animate-pulse"
                  : toast.type === "error"
                    ? "bg-rose-500"
                    : "bg-cyan-400"
              }`}
            />
            <span className="text-sm font-semibold text-white">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-analysis simulation progress overlay */}
      <AnimatePresence>
        {operationState.isRunning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1C1C] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-6 text-center"
            >
              <div className="relative w-16 h-16 mx-auto">
                <RefreshCw size={56} className="text-accent animate-spin opacity-85" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={22} className="text-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">
                  Processing Dynamic Task
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  {operationState.statusText}
                </p>
              </div>

              {/* Progress track */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold text-text-secondary">
                  <span>Progress Status</span>
                  <span className="text-accent font-bold">{operationState.progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-accent"
                    style={{ width: `${operationState.progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>

              <span className="text-xs block text-text-secondary/40 font-medium">
                Please keep this tab active while calculations proceed.
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#1C1E1E] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-start gap-5">
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl shrink-0">
                  <AlertCircle size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    {modalConfig.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {modalConfig.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-3">
                <button
                  onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={executeModalAction}
                  className="px-5 py-3 rounded-xl bg-accent hover:bg-white text-background text-sm font-bold transition-all active:scale-95 shadow-lg"
                >
                  {modalConfig.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header section with generous space and highly visible text */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-accent/15 rounded-2xl">
              <Sliders size={28} className="text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              System Settings
            </h1>
          </div>
          <p className="text-sm md:text-base text-text-secondary/80 font-medium leading-relaxed max-w-2xl pl-1 bg-gradient-to-r from-accent/10 to-transparent p-2 rounded-lg">
            Configure system audio parameters, crossfades, advanced acoustic metadata engines, personalized colors, and local storage caches.
          </p>
        </div>
      </div>

      {/* Two-Column layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Category Nav Rail - Made wider and fonts more legible */}
        <div className="w-full lg:w-64 shrink-0 bg-[#1A1C1C]/40 border border-white/5 rounded-3xl p-5 sticky top-28 space-y-5">
          <div className="text-xs font-extrabold text-text-secondary/60 tracking-wider px-3 uppercase">
            Control Categories
          </div>
          <ul className="space-y-2 w-full">
            {[
              { id: "profile", label: "Curator Profile", icon: User },
              { id: "playback", label: "Playback & Quality", icon: SlidersHorizontal },
              { id: "neural", label: "Acoustic Analysis", icon: Cpu },
              { id: "appearance", label: "Custom Theme", icon: Palette },
              { id: "library", label: "Library Management", icon: Database },
              { id: "privacy", label: "Privacy & Log Cache", icon: Lock },
              { id: "shortcuts", label: "Keyboard Controls", icon: Keyboard },
              { id: "about", label: "System Information", icon: Info },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group relative focus:outline-none text-left cursor-pointer ${
                      isActive
                        ? "text-accent font-bold"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Animated Background */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-bg-settings"
                        className="absolute inset-0 bg-white/[0.06] rounded-2xl border border-white/5 shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {/* Animated Left Accent Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator-settings"
                        className="absolute left-0 top-3.5 bottom-3.5 w-1.5 bg-accent rounded-r-lg"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <span className="relative flex items-center gap-4 z-10 w-full">
                      <cat.icon
                        size={19}
                        className={
                          isActive
                            ? "text-accent"
                            : "text-text-secondary group-hover:text-text-primary transition-colors"
                        }
                      />
                      <span className="text-sm font-semibold tracking-wide">
                        {cat.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Content Panel - Enlarged text sizes and padded forms */}
        <div className="flex-1 w-full min-w-0 bg-[#1A1C1C]/20 border border-white/5 rounded-3xl p-8 md:p-10 relative min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Category Profile */}
              {activeCategory === "profile" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest mb-6">
                      Curator Identity Settings
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white/[0.015] border border-white/5 rounded-3xl">
                      {/* Avatar with dynamic file upload triggers */}
                      <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                        <img
                          src={settings.avatarUrl}
                          alt="Curator Avatar"
                          className="w-28 h-28 rounded-2xl object-cover border-2 border-white/10 group-hover:border-accent transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-3">
                          <Palette size={18} className="text-accent mb-1 animate-pulse" />
                          <span className="text-xs text-white font-semibold leading-tight">
                            Update Photo
                          </span>
                        </div>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          onChange={handleAvatarFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      {/* Display name and status fields */}
                      <div className="flex-1 w-full space-y-7">
                        <div className="space-y-3">
                          <label className="text-xs font-black tracking-widest text-text-secondary uppercase ml-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={settings.displayName}
                            onChange={(e) => updateSetting("displayName", e.target.value)}
                            className="w-full sm:w-80 bg-white/5 border border-white/10 hover:border-white/20 focus:border-accent/50 focus:bg-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-0 transition-all duration-300 placeholder-white/30 shadow-inner"
                            placeholder="Enter your display name"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black tracking-widest text-text-secondary uppercase ml-1">
                            Custom Status message
                          </label>
                          <div className="flex items-center gap-4 w-full sm:w-[26rem] bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-accent/50 focus-within:bg-white/10 rounded-2xl px-5 py-3.5 transition-all duration-300 shadow-inner group">
                            <motion.span 
                              className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"
                              animate={{ 
                                opacity: [0.6, 1, 0.6], 
                                boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 10px rgba(16,185,129,0.7)", "0 0 0px rgba(16,185,129,0)"] 
                              }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <input
                              type="text"
                              value={settings.statusText}
                              onChange={(e) => updateSetting("statusText", e.target.value)}
                              className="w-full bg-transparent text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:ring-0 border-none p-0"
                              placeholder="What's your vibe?"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Tier Card */}
                  <div className="p-8 bg-surface-base border border-white/5 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden group/sub shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover/sub:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="space-y-3 relative z-10 pr-4">
                      <h4 className="text-xs font-black tracking-widest text-text-secondary uppercase">
                        Subscription Tier
                      </h4>
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                          {settings.accountTier}
                        </h3>
                        <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-md">
                          High fidelity audio stream active. Custom neural energy presets and infinite vibe matching unlocked.
                        </p>
                      </div>
                    </div>
                    <div className="relative z-10 shrink-0">
                      <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide shadow-xl backdrop-blur-md transition-colors cursor-pointer"
                      >
                        Active
                      </motion.button>
                    </div>
                  </div>

                  {/* Sign out Option */}
                  <div className="pt-6 border-t border-white/5">
                    <button
                      onClick={() => openConfirmModal("signout")}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 hover:border-rose-500/30 text-sm font-bold text-text-secondary hover:text-rose-400 hover:bg-rose-500/5 transition-all focus:outline-none cursor-pointer"
                    >
                      <LogOut size={16} />
                      Sign out of system
                    </button>
                  </div>
                </div>
              )}

              {/* Category Playback */}
              {activeCategory === "playback" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Audio Playback & Quality
                  </h2>

                  {/* Audio Quality Pills */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-text-secondary">
                      Streaming Quality Selection
                    </label>
                    <div className="flex flex-wrap gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5 max-w-lg">
                      {(["low", "standard", "high", "lossless"] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => updateSetting("playbackQuality", q)}
                          className={`flex-1 py-3 px-3 text-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            settings.playbackQuality === q
                              ? "bg-white/15 text-white shadow-sm border border-white/5"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          {q === "low" && "Low Rate"}
                          {q === "standard" && "Standard"}
                          {q === "high" && "High (HQ)"}
                          {q === "lossless" && "Hi-Fi Lossless"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slider: Crossfade */}
                  <div className="space-y-3 max-w-lg">
                    <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                      <span>Crossfade Transitions</span>
                      <span className="text-accent font-extrabold text-base">{settings.crossfadeDuration} seconds</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={settings.crossfadeDuration}
                      onChange={(e) => updateSetting("crossfadeDuration", parseInt(e.target.value))}
                      className="w-full accent-accent bg-white/10 h-2 rounded-full cursor-pointer focus:outline-none"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-5 max-w-2xl">
                    {[
                      {
                        key: "gaplessPlayback" as const,
                        label: "Gapless Playback Engine",
                        desc: "Pre-loads subsequent track buffers in advance for smooth, continuous gapless playback.",
                      },
                      {
                        key: "volumeNormalization" as const,
                        label: "Dynamic Volume Normalization",
                        desc: "Maintains consistent perceive loudness settings across varying audio tracks and compression types.",
                      },
                      {
                        key: "autoplay" as const,
                        label: "Autoplay Similar Vibes",
                        desc: "Keep playing related matching vibes and acoustic ratings when your manual play queue finishes.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="space-y-1.5 pr-6">
                          <span className="text-sm font-bold text-white">
                            {item.label}
                          </span>
                          <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings[item.key]}
                          onChange={(v) => updateSetting(item.key, v)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Visual Equalizer Section */}
                  <div className="space-y-5 max-w-lg border-t border-white/5 pt-8">
                    <div className="space-y-2.5">
                      <label className="text-sm font-bold text-text-secondary">
                        Equalizer Preset Selection
                      </label>
                      <select
                        value={settings.eqPreset}
                        onChange={(e) => updateSetting("eqPreset", e.target.value as any)}
                        className="bg-[#1A1C1C] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-accent/40 w-full cursor-pointer text-text-primary"
                      >
                        <option value="flat">Flat Response (Pure/Neutral)</option>
                        <option value="bass-boost">Bass Boost (High Impact)</option>
                        <option value="vocal">Vocal Enhance (Mid Boost)</option>
                        <option value="neural-custom">Neural Custom (Adaptive Smart Curve)</option>
                      </select>
                    </div>

                    {/* EQ Bar graph visualization - Expanded and made much clearer */}
                    <div className="p-6 bg-black/30 border border-white/5 rounded-3xl flex items-end justify-around h-40 gap-4">
                      {eqBands[settings.eqPreset].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3.5 h-full justify-end">
                          <div className="w-full bg-white/5 rounded-full h-full relative overflow-hidden">
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-accent"
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary/60 font-bold tracking-wider font-mono">
                            {["60Hz", "230Hz", "910Hz", "4kHz", "14kHz"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category Neural Analysis */}
              {activeCategory === "neural" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Acoustic & Vibe Analysis
                  </h2>

                  <div className="space-y-5 max-w-2xl">
                    {[
                      {
                        key: "autoAnalyze" as const,
                        label: "Auto-analyze newly uploaded music tracks",
                        desc: "Scans uploaded audio on-the-fly to calculate BPM, musical key scales, and sonic mood vectors.",
                      },
                      {
                        key: "telemetrySync" as const,
                        label: "Sync acoustic analysis metadata",
                        desc: "Backs up calculated musical profiles and energy ratings to your personal curator cloud profile.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="space-y-1.5 pr-6">
                          <span className="text-sm font-bold text-white">
                            {item.label}
                          </span>
                          <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings[item.key]}
                          onChange={(v) => updateSetting(item.key, v)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Selector: BPM Detection Sensitivity */}
                  <div className="space-y-3 max-w-lg">
                    <label className="text-sm font-bold text-text-secondary block">
                      BPM Rhythm Detection Model
                    </label>
                    <div className="flex flex-wrap gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                      {(["low", "medium", "high"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateSetting("bpmSensitivity", s)}
                          className={`flex-1 py-3 px-2 text-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            settings.bpmSensitivity === s
                              ? "bg-white/15 text-white shadow-sm border border-white/5"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          {s === "low" && "Standard Scan"}
                          {s === "medium" && "High Detail"}
                          {s === "high" && "Maximum Precision"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector: Mood Tagging Model */}
                  <div className="space-y-3 max-w-lg">
                    <label className="text-sm font-bold text-text-secondary block">
                      Vibe & Mood Evaluation Architecture
                    </label>
                    <div className="flex flex-wrap gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5">
                      {(["fast", "accurate", "experimental"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => updateSetting("moodModel", m)}
                          className={`flex-1 py-3 px-2 text-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            settings.moodModel === m
                              ? "bg-white/15 text-white shadow-sm border border-white/5"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          {m === "fast" && "Fast Scan"}
                          {m === "accurate" && "Accurate AI"}
                          {m === "experimental" && "Experimental Lab"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Re-analyze full library button */}
                  <div className="pt-8 border-t border-white/5 max-w-lg space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-sm font-bold text-white">
                        Recalculate complete audio signatures
                      </span>
                      <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                        Re-scans all tracks in your dynamic audio library to recalculate and overwrite raw BPM, musical key scales, and mood signatures.
                      </p>
                    </div>
                    <button
                      onClick={() => openConfirmModal("reanalyze")}
                      className="w-full flex items-center justify-center gap-3 h-12 px-6 font-bold text-sm rounded-xl border border-white/10 hover:border-accent hover:bg-accent hover:text-background text-text-secondary transition-all focus:outline-none cursor-pointer shadow-lg"
                    >
                      <RefreshCw size={16} className="animate-spin-slow" />
                      Re-analyze Entire Audio Library
                    </button>
                  </div>
                </div>
              )}

              {/* Category Appearance */}
              {activeCategory === "appearance" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Aesthetic & Theme Settings
                  </h2>

                  {/* Swatches Theme variant */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-text-secondary">
                      Choose Visual Mode
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl">
                      {[
                        {
                          id: "dark" as const,
                          name: "Slate Dark (Classic)",
                          bg: "bg-[#0D0D0F]",
                          surface: "bg-[#1A1A1C]",
                        },
                        {
                          id: "deep-black" as const,
                          name: "OLED Pitch Black",
                          bg: "bg-black",
                          surface: "bg-[#09090b]",
                        },
                        {
                          id: "neural-fog" as const,
                          name: "Neural Dusk Blue",
                          bg: "bg-[#0d0f16]",
                          surface: "bg-[#171a24]",
                        },
                        {
                          id: "light-alabaster" as const,
                          name: "Alabaster Light Mode",
                          bg: "bg-[#F8F9FA]",
                          surface: "bg-white",
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => updateSetting("themeVariant", t.id)}
                          className={`p-5 rounded-3xl border text-left transition-all cursor-pointer ${
                            settings.themeVariant === t.id
                              ? "bg-white/[0.05] border-accent shadow-accent"
                              : "bg-white/[0.015] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="flex gap-2 mb-3.5">
                            <span className={`w-6 h-6 rounded-lg ${t.bg} border border-white/15`} />
                            <span className={`w-6 h-6 rounded-lg ${t.surface} border border-white/15`} />
                          </div>
                          <span className="text-xs font-bold tracking-wide text-text-primary">
                            {t.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color picker */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-text-secondary">
                      Accent Color Theme
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-white/[0.015] border border-white/5 rounded-3xl max-w-md">
                      {[
                        { id: "white" as const, class: "bg-[#BFC1C2]" },
                        { id: "cyan" as const, class: "bg-cyan-400" },
                        { id: "purple" as const, class: "bg-purple-400" },
                        { id: "amber" as const, class: "bg-amber-500" },
                        { id: "green" as const, class: "bg-emerald-400" },
                      ].map((dot) => (
                        <button
                          key={dot.id}
                          onClick={() => updateSetting("accentColor", dot.id)}
                          className="relative flex items-center justify-center p-1.5 focus:outline-none"
                        >
                          <span className={`w-8 h-8 rounded-full ${dot.class} cursor-pointer transition-transform hover:scale-110 active:scale-95`} />
                          {settings.accentColor === dot.id && (
                            <motion.span
                              layoutId="accent-active-ring"
                              className="absolute inset-0 border-2 border-white/60 rounded-full scale-125"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar and visualizer toggles */}
                  <div className="space-y-5 max-w-2xl border-t border-white/5 pt-8">
                    <div className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl">
                      <div className="space-y-1.5 pr-6">
                        <span className="text-sm font-bold text-white">
                          Sidebar Layout default
                        </span>
                        <p className="text-sm text-text-secondary/70 font-medium leading-relaxed">
                          Keep primary control menus expanded or collapsed to maximize screen canvas.
                        </p>
                      </div>
                      <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
                        <button
                          onClick={() => updateSetting("sidebarState", "expanded")}
                          className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                            settings.sidebarState === "expanded"
                              ? "bg-white/10 text-white shadow-sm"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          Expanded
                        </button>
                        <button
                          onClick={() => updateSetting("sidebarState", "collapsed")}
                          className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                            settings.sidebarState === "collapsed"
                              ? "bg-white/10 text-white shadow-sm"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          Collapsed
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl">
                      <div className="space-y-1.5 pr-6">
                        <span className="text-sm font-bold text-white">
                          Audio Waveform Visualizer
                        </span>
                        <p className="text-sm text-text-secondary/70 font-medium leading-relaxed">
                          Select the default rendering style of active waveform rendering in footer players.
                        </p>
                      </div>
                      <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
                        {(["waveform", "bars", "none"] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateSetting("visualizerStyle", style)}
                            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                              settings.visualizerStyle === style
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-text-secondary hover:text-white"
                            }`}
                          >
                            {style === "waveform" && "Waveform"}
                            {style === "bars" && "Bars"}
                            {style === "none" && "None"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Library Settings */}
              {activeCategory === "library" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Library & Upload Preferences
                  </h2>

                  {/* Pills: upload format preference */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-text-secondary">
                      Preferred High-Fidelity Audio Format
                    </label>
                    <div className="flex flex-wrap gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5 max-w-md">
                      {(["mp3", "flac", "wav", "any"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => updateSetting("defaultUploadFormat", f)}
                          className={`flex-1 py-2 text-center rounded-xl text-sm font-bold transition-all cursor-pointer uppercase ${
                            settings.defaultUploadFormat === f
                              ? "bg-white/15 text-white shadow-sm border border-white/5"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl max-w-2xl">
                    <div className="space-y-1.5 pr-6">
                      <span className="text-sm font-bold text-white">
                        Auto-organize catalogs
                      </span>
                      <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                        Automatically parse, group, and sort upload track headers into beautiful nested artist/album folders.
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={settings.autoOrganize}
                      onChange={(v) => updateSetting("autoOrganize", v)}
                    />
                  </div>

                  {/* Storage Usage */}
                  <div className="p-6 bg-white/[0.015] border border-white/5 rounded-3xl max-w-lg space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                      <span>Cloud Allocation Storage</span>
                      <span className="text-white">2.4 GB of 10.0 GB utilized (24%)</span>
                    </div>

                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5 flex">
                      <div className="bg-accent h-full shadow-accent" style={{ width: "24%" }} />
                      <div className="bg-white/10 h-full" style={{ width: "76%" }} />
                    </div>

                    <p className="text-xs text-text-secondary/50 font-semibold tracking-wide uppercase">
                      Track buffers, cached FFT spectrogram profiles, and audio segment files.
                    </p>
                  </div>

                  {/* Clear Cache */}
                  <div className="pt-8 border-t border-white/5 max-w-lg space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-sm font-bold text-white">
                        Clear local browser audio cache
                      </span>
                      <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                        Purge temporary audio cache blocks, precalculated wave buffers, and local cookie track allocations.
                      </p>
                    </div>
                    <button
                      onClick={() => openConfirmModal("clearcache")}
                      className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 hover:border-rose-500/30 text-sm font-bold text-text-secondary hover:text-rose-400 hover:bg-rose-500/5 transition-all focus:outline-none cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Purge Local Audio Cache
                    </button>
                  </div>
                </div>
              )}

              {/* Category Privacy & Data */}
              {activeCategory === "privacy" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Privacy, Security & Backups
                  </h2>

                  <div className="space-y-5 max-w-2xl">
                    {[
                      {
                        key: "listeningHistoryEnabled" as const,
                        label: "Log curator listening history",
                        desc: "Enable persistent recording of recently parsed song structures to calculate personalized daily recommendation mixes.",
                      },
                      {
                        key: "shareListeningData" as const,
                        label: "Contribute anonymous diagnostic insights",
                        desc: "Participate in decentralized system analytics to elevate collaborative platform chart sorting.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-3xl hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="space-y-1.5 pr-6">
                          <span className="text-sm font-bold text-white">
                            {item.label}
                          </span>
                          <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={settings[item.key]}
                          onChange={(v) => updateSetting(item.key, v)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-8 border-t border-white/5 max-w-2xl space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-sm font-bold text-white">
                          Delete local listening log logs
                        </span>
                        <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                          Permanently delete saved listening records and clear active recommendation weights. This cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmModal("clearhistory")}
                        className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 hover:border-rose-500/30 text-sm font-bold text-text-secondary hover:text-rose-400 hover:bg-rose-500/5 transition-all focus:outline-none cursor-pointer"
                      >
                        <Trash2 size={16} />
                        Delete Local Play History
                      </button>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/[0.04]">
                      <div className="space-y-1.5">
                        <span className="text-sm font-bold text-white">
                          Export Settings State (JSON)
                        </span>
                        <p className="text-sm text-text-secondary/70 leading-relaxed font-medium">
                          Download a complete serialized offline file containing all configured preferences and accent calibrations.
                        </p>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 hover:border-accent hover:bg-white/5 text-text-secondary hover:text-white text-sm font-bold transition-all focus:outline-none cursor-pointer shadow-md"
                      >
                        <FileJson size={16} />
                        Export Backup Settings (JSON)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Keyboard Shortcuts */}
              {activeCategory === "shortcuts" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    System Keyboard Controls
                  </h2>

                  <div className="bg-white/[0.015] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-bold text-text-secondary/80 uppercase tracking-wider">
                          <th className="p-5 pl-7">System Operation</th>
                          <th className="p-5 pr-7 text-right">Keyboard Bind</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02] text-sm text-text-primary">
                        {[
                          { action: "Play / Pause Active Audio", key: "Space" },
                          { action: "Forward Track Skip", key: "Arrow Right" },
                          { action: "Previous Track Skip", key: "Arrow Left" },
                          { action: "Volume Amplitude Increment", key: "Arrow Up" },
                          { action: "Volume Amplitude Decrement", key: "Arrow Down" },
                          { action: "Focus Search Input Rails", key: "S   or   /" },
                          { action: "Close Overlays / Clear Context", key: "Escape" },
                        ].map((row, i) => {
                          const isActive = row.key === activeShortcutKey;
                          return (
                            <motion.tr
                              key={i}
                              animate={{
                                backgroundColor: isActive ? "rgba(var(--color-accent-rgb), 0.1)" : "transparent",
                              }}
                              transition={{ duration: 0.15 }}
                              className="hover:bg-white/[0.02] transition-colors group relative"
                            >
                              <td className="p-5 pl-7 text-text-secondary group-hover:text-white transition-colors font-semibold">
                                <div className="flex items-center gap-3">
                                  {isActive && (
                                    <motion.span
                                      layoutId="active-dot"
                                      className="w-2.5 h-2.5 rounded-full bg-accent"
                                      animate={{ scale: [0.8, 1.3, 1] }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                  <span className={isActive ? "text-accent font-black tracking-tight" : ""}>
                                    {row.action}
                                  </span>
                                </div>
                              </td>
                              <td className="p-5 pr-7 text-right">
                                <motion.span
                                  animate={{
                                    scale: isActive ? 1.15 : 1,
                                    borderColor: isActive ? "var(--color-accent)" : "rgba(255, 255, 255, 0.15)",
                                    boxShadow: isActive ? "0 0 20px rgba(var(--color-accent-rgb), 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: isActive ? "rgba(var(--color-accent-rgb), 0.2)" : "rgba(255, 255, 255, 0.05)",
                                    color: isActive ? "var(--color-accent)" : "#ffffff"
                                  }}
                                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                                  className="inline-block px-3.5 py-1.5 rounded-lg border text-white font-bold text-xs font-mono tracking-wide"
                                >
                                  {row.key}
                                </motion.span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Category About */}
              {activeCategory === "about" && (
                <div className="space-y-8">
                  <h2 className="text-xs font-extrabold text-text-secondary/70 uppercase tracking-widest">
                    Cortex System Information
                  </h2>

                  <div className="p-6 bg-white/[0.015] border border-white/5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-white">
                        Cortex Audio Engine
                      </h3>
                      <p className="text-sm text-text-secondary font-medium">
                        Build Core Version 2.4.0 • Channel: Production Stable
                      </p>
                      <p className="text-xs text-text-secondary/50 font-bold tracking-wider font-mono">
                        COMPILED STAGE DATE: 2026-07-01
                      </p>
                    </div>
                    <span className="text-xs px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold uppercase tracking-wider shrink-0">
                      SSL SECURE CONNECT
                    </span>
                  </div>

                  {/* Minimal Changelog */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block">
                      Release Log Records
                    </span>
                    <div className="p-5 bg-white/[0.015] border border-white/5 rounded-2xl space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 text-xs font-extrabold text-white">
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                          <span>Release v2.4.0 (Active Deployment)</span>
                        </div>
                        <p className="text-sm text-text-secondary/75 pl-5 leading-relaxed font-medium">
                          Introduced customizable dynamic FFT spectrogram options, multi-variant body theme presets, highly legible system dimensions, and improved accessibility.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-4 border-t border-white/[0.03]">
                        <div className="flex items-center gap-2.5 text-xs font-extrabold text-white/50">
                          <span className="w-2 h-2 rounded-full bg-white/20" />
                          <span>Release v2.3.5</span>
                        </div>
                        <p className="text-sm text-text-secondary/60 pl-5 leading-relaxed font-medium">
                          Refined FLAC stream segmentation, optimized audio canvas latency under heavy background processes, and smoothed slider physics.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documentation & links */}
                  <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                    <a
                      href="#docs"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerToast("Loading system documentation handbook...", "info");
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-accent hover:bg-white/5 text-xs font-bold text-text-secondary hover:text-white transition-all focus:outline-none cursor-pointer"
                    >
                      <BookOpen size={14} />
                      System User Manual
                    </a>
                    <a
                      href="#bug"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerToast("Telemetry ticket reporting initialized.", "info");
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-accent hover:bg-white/5 text-xs font-bold text-text-secondary hover:text-white transition-all focus:outline-none cursor-pointer"
                    >
                      <AlertCircle size={14} />
                      Report System Telemetry Ticket
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
