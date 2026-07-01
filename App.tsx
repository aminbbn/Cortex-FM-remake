
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerBar } from './components/layout/PlayerBar';
import { Dashboard } from './components/sections/Dashboard';
import { Library } from './components/sections/Library';
import { Discover } from './components/sections/Discover';
import { Stats } from './components/sections/Stats';
import { ArtistProfile } from './components/sections/ArtistProfile';
import { AlbumProfile } from './components/sections/AlbumProfile';
import { PlaylistProfile } from './components/sections/PlaylistProfile';
import { SongRadio } from './components/sections/SongRadio';
import { LandingPage } from './components/sections/LandingPage';
import { Settings } from './components/sections/Settings';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeArtist, setActiveArtist] = useState<string>('');
  const [activeAlbumTrackId, setActiveAlbumTrackId] = useState<string>('');
  const [activeRadioTrackId, setActiveRadioTrackId] = useState<string>('');
  const [activePlaylistId, setActivePlaylistId] = useState<string>('');
  const [view, setView] = useState<'landing' | 'app'>('landing');

  // Load theme settings from localStorage
  const [themeVariant, setThemeVariant] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("cortex_fm_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.themeVariant || "dark";
      }
    } catch (e) {}
    return "dark";
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("cortex_fm_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.accentColor || "white";
      }
    } catch (e) {}
    return "white";
  });

  // Mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for the spotlight to give it a "heavy", premium feel
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 0.8 });

  // Listen to live settings changes
  useEffect(() => {
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      if (customEvent.detail) {
        setThemeVariant(customEvent.detail.themeVariant || "dark");
        setAccentColor(customEvent.detail.accentColor || "white");
      }
    };

    window.addEventListener("cortex_settings:change", handleSettingsChange);
    return () => {
      window.removeEventListener("cortex_settings:change", handleSettingsChange);
    };
  }, []);

  // Inject Stylesheet according to Selected Theme & Accent
  useEffect(() => {
    let styleTag = document.getElementById("cortex-fm-settings-injector");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "cortex-fm-settings-injector";
      document.head.appendChild(styleTag);
    }

    // Determine Accent Colors RGB/Hex
    const rgbMap: Record<string, string> = {
      white: "191, 193, 194",
      cyan: "34, 211, 238",
      purple: "192, 132, 252",
      amber: "245, 158, 11",
      green: "52, 211, 153",
    };

    const hexMap: Record<string, string> = {
      white: "#BFC1C2",
      cyan: "#22D3EE",
      purple: "#C084FC",
      amber: "#F59E0B",
      green: "#34D399",
    };

    const accent = accentColor;
    const rgb = rgbMap[accent] || rgbMap.white;
    const hex = hexMap[accent] || hexMap.white;

    let themeCSS = "";
    if (themeVariant === "deep-black") {
      themeCSS = `
        body, .bg-background {
          background-color: #000000 !important;
        }
        .bg-surface, .bg-surface\\/35, .bg-surface\\/30, .bg-surface\\/50, .bg-white\\/5, .bg-white\\/\\[0\\.015\\], .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.04\\], .bg-white\\/\\[0\\.05\\], .bg-white\\/10, .bg-white\\/15, .bg-\\[\\#1A1C1C\\], .bg-\\[\\#1A1C1C\\]\\/40, .bg-\\[\\#1A1C1C\\]\\/20, .bg-\\[\\#1C1E1E\\], .bg-\\[\\#121212\\]\\/95, .bg-\\[\\#161616\\]\\/95, .bg-\\[\\#161616\\], .bg-\\[\\#1a1a1a\\], .bg-\\[\\#0e0e11\\], .bg-\\[\\#0d0d0d\\], .bg-\\[\\#050505\\] {
          background-color: rgba(10, 10, 12, 0.45) !important;
          -webkit-backdrop-filter: blur(16px) saturate(140%) !important;
          backdrop-filter: blur(16px) saturate(140%) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.05) !important;
        }
        .border-white\\/5, .border-white\\/10, .border-white\\/15, .border-white\\/20, .border-white\\/\\[0\\.02\\] {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        input, select, textarea {
          background-color: rgba(255, 255, 255, 0.03) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          backdrop-filter: blur(12px) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
          color: #F5F5F7 !important;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.01) !important;
        }
        input:focus, select:focus, textarea:focus {
          background-color: rgba(255, 255, 255, 0.07) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.25) !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11) {
          background-color: rgba(255, 255, 255, 0.02) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          color: #F5F5F7 !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11):hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.2) !important;
        }
      `;
    } else if (themeVariant === "neural-fog") {
      themeCSS = `
        body, .bg-background {
          background-color: #0e111a !important;
        }
        .bg-surface, .bg-surface\\/35, .bg-surface\\/30, .bg-surface\\/50, .bg-white\\/5, .bg-white\\/\\[0\\.015\\], .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.04\\], .bg-white\\/\\[0\\.05\\], .bg-white\\/10, .bg-white\\/15, .bg-\\[\\#1A1C1C\\], .bg-\\[\\#1A1C1C\\]\\/40, .bg-\\[\\#1A1C1C\\]\\/20, .bg-\\[\\#1C1E1E\\], .bg-\\[\\#121212\\]\\/95, .bg-\\[\\#161616\\]\\/95, .bg-\\[\\#161616\\], .bg-\\[\\#1a1a1a\\], .bg-\\[\\#0e0e11\\], .bg-\\[\\#0d0d0d\\], .bg-\\[\\#050505\\] {
          background-color: rgba(26, 30, 45, 0.45) !important;
          -webkit-backdrop-filter: blur(16px) saturate(145%) !important;
          backdrop-filter: blur(16px) saturate(145%) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.06) !important;
        }
        .border-white\\/5, .border-white\\/10, .border-white\\/15, .border-white\\/20, .border-white\\/\\[0\\.02\\] {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        input, select, textarea {
          background-color: rgba(255, 255, 255, 0.03) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          backdrop-filter: blur(12px) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: #F5F5F7 !important;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.01) !important;
        }
        input:focus, select:focus, textarea:focus {
          background-color: rgba(255, 255, 255, 0.07) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.25) !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11) {
          background-color: rgba(255, 255, 255, 0.03) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          color: #F5F5F7 !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11):hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.2) !important;
        }
      `;
    } else if (themeVariant === "light-alabaster") {
      themeCSS = `
        :root {
          --theme-mode: light;
          --color-background: #F8F9FA !important;
          --color-surface: rgba(255, 255, 255, 0.45) !important;
          --color-text-primary: #1A1D20 !important;
          --color-text-secondary: #5C6370 !important;
        }
        body, .bg-background {
          background-color: #F8F9FA !important;
          color: #1A1D20 !important;
        }
        .text-text-primary, .text-white\\/90, .text-white\\/80, .text-white\\/100, h1, h2, h3, h4, h5, h6 {
          color: #1A1D20 !important;
        }
        .text-text-secondary, .text-white\\/60, .text-white\\/70, .text-white\\/50, .text-text-secondary\\/80 {
          color: #5C6370 !important;
        }
        .bg-surface, .bg-surface\\/35, .bg-surface\\/30, .bg-surface\\/50, .bg-white\\/5, .bg-white\\/\\[0\\.015\\], .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.04\\], .bg-white\\/\\[0\\.05\\], .bg-white\\/10, .bg-white\\/15, .bg-\\[\\#1A1C1C\\], .bg-\\[\\#1A1C1C\\]\\/40, .bg-\\[\\#1A1C1C\\]\\/20, .bg-\\[\\#1C1E1E\\], .bg-\\[\\#121212\\]\\/95, .bg-\\[\\#161616\\]\\/95, .bg-\\[\\#161616\\], .bg-\\[\\#1a1a1a\\], .bg-\\[\\#0e0e11\\], .bg-\\[\\#0d0d0d\\], .bg-\\[\\#050505\\] {
          background-color: rgba(255, 255, 255, 0.45) !important;
          -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
          backdrop-filter: blur(16px) saturate(130%) !important;
          box-shadow: 0 8px 32px 0 rgba(15, 23, 42, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
        }
        .border-white\\/5, .border-white\\/10, .border-white\\/15, .border-white\\/20, .border-white\\/\\[0\\.02\\] {
          border-color: rgba(15, 23, 42, 0.08) !important;
        }
        input, select, textarea {
          background-color: rgba(255, 255, 255, 0.5) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          backdrop-filter: blur(12px) !important;
          color: #1A1D20 !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02) !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11) {
          background-color: rgba(255, 255, 255, 0.35) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(15, 23, 42, 0.06) !important;
          color: #1A1D20 !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11):hover {
          background-color: rgba(255, 255, 255, 0.6) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.1) !important;
        }
        .hover\\:bg-white\\/\\[0\\.04\\]:hover, .hover\\:bg-white\\/10:hover, .hover\\:bg-white\\/\\[0\\.02\\]:hover, .hover\\:bg-white\\/5:hover, .hover\\:bg-white\\/\\[0\\.05\\]:hover, .hover\\:bg-white\\/\\[0\\.06\\]:hover {
          background-color: rgba(255, 255, 255, 0.6) !important;
        }
        .hover\\:text-white:hover {
          color: #1A1D20 !important;
        }
        /* Scrollbar styling */
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1 !important;
        }
        /* Landing Page Specific overrides */
        .theme-light .bg-\\[radial-gradient\\(circle_at_center\\,transparent_0\\%\\,\\#0D0D0F_100\\%\\)\\] {
          background: radial-gradient(circle at center, transparent 0%, #F8F9FA 100%) !important;
        }
        .theme-light .bg-\\[\\#1A1C1C\\], .theme-light .bg-\\[\\#1A1C1C\\]\\/80, .theme-light .bg-\\[\\#1a1c1c\\], .theme-light .bg-\\[\\#1a1c1c\\]\\/80 {
          background-color: rgba(255, 255, 255, 0.45) !important;
          -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
          backdrop-filter: blur(16px) saturate(130%) !important;
          border-color: rgba(15, 23, 42, 0.08) !important;
        }
        .theme-light .text-transparent.bg-clip-text {
          background-image: linear-gradient(90deg, #1A1D20 0%, #64748B 20%, #1A1D20 40%, #64748B 60%, #1A1D20 80%, #64748B 100%) !important;
        }
        .theme-light [style*="WebkitTextStroke"] {
          -webkit-text-stroke: 2px rgba(15, 23, 42, 0.12) !important;
        }
        .theme-light .text-accent\\/50 {
          color: var(--color-accent) !important;
          opacity: 0.5;
        }
        .theme-light .text-accent {
          color: var(--color-accent) !important;
        }
        /* Ensure specific dark sections in Landing Page respect light background */
        .theme-light section.bg-\\[\\#0D0D0F\\] {
          background-color: #F8F9FA !important;
        }
        .theme-light footer {
          background-color: #F1F5F9 !important;
          border-top: 1px solid #E2E8F0 !important;
        }
        .theme-light .shadow-2xl, .theme-light .shadow-3xl {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
        }

        /* --- Kinetic Title (SONIC EVOLUTION) Light Gradient Override --- */
        .theme-light h1 span {
          background-image: linear-gradient(90deg, #0F172A 0%, #334155 25%, #1E293B 50%, #475569 75%, #0F172A 100%) !important;
          background-size: 200% auto !important;
          -webkit-text-fill-color: transparent !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          filter: drop-shadow(0 4px 12px rgba(15, 23, 42, 0.08)) !important;
        }

        /* --- Step Badges & Translucent Pills in Light Mode --- */
        .theme-light .bg-black\\/60 {
          background-color: rgba(255, 255, 255, 0.9) !important;
          border-color: #E2E8F0 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05) !important;
        }
        .theme-light .bg-black\\/60 p {
          color: #1A1D20 !important;
        }

        /* --- Hypercube 3D Glass Mode Override --- */
        .theme-light .perspective-\\[1200px\\] .border-white\\/10 {
          border-color: rgba(0, 0, 0, 0.1) !important;
        }
        .theme-light .perspective-\\[1200px\\] .bg-black\\/40 {
          background-color: rgba(255, 255, 255, 0.45) !important;
          backdrop-filter: blur(4px) !important;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.03) !important;
        }
        .theme-light .perspective-\\[1200px\\] .border-white\\/60 {
          border-color: rgba(15, 23, 42, 0.4) !important;
        }
        .theme-light .perspective-\\[1200px\\] [style*="rgba(255, 255, 255, 0.4)"] {
          background-image: linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px) !important;
        }
        .theme-light .perspective-\\[1200px\\] .border-dashed {
          border-color: rgba(15, 23, 42, 0.15) !important;
        }
        .theme-light .perspective-\\[1200px\\] .bg-white {
          background-color: var(--color-accent) !important;
        }

        /* Bento Cards Light Mode adaptations */
        .theme-light .group.bg-\\[\\#1A1C1C\\], .theme-light .group.bg-\\[\\#1a1c1c\\] {
          background-color: #FFFFFF !important;
          border-color: #E2E8F0 !important;
        }
        .theme-light .group.bg-\\[\\#1A1C1C\\]:hover, .theme-light .group.bg-\\[\\#1a1c1c\\]:hover {
          border-color: #CBD5E1 !important;
        }
        .theme-light .group.bg-\\[\\#1A1C1C\\] .bg-white\\/5, .theme-light .group.bg-\\[\\#1a1c1c\\] .bg-white\\/5 {
          background-color: rgba(0, 0, 0, 0.04) !important;
          border-color: rgba(0, 0, 0, 0.04) !important;
        }
        .theme-light .group.bg-\\[\\#1A1C1C\\] .bg-\\[\\#1A1C1C\\]\\/80,
        .theme-light .group.bg-\\[\\#1a1c1c\\] .bg-\\[\\#1a1c1c\\]\\/80,
        .theme-light .group.bg-\\[\\#1A1C1C\\] .bg-\\[\\#1a1c1c\\]\\/80,
        .theme-light .group.bg-\\[\\#1a1c1c\\] .bg-\\[\\#1A1C1C\\]\\/80 {
          background-color: rgba(248, 249, 250, 0.9) !important;
          border-color: #E2E8F0 !important;
        }
        .theme-light .group.bg-\\[\\#1A1C1C\\] h3.text-white\\/90, .theme-light .group.bg-\\[\\#1a1c1c\\] h3.text-white\\/90 {
          color: #1A1D20 !important;
        }

        /* Manifesto Hover and Text fixes */
        .theme-light .group-hover\:text-white:hover,
        .theme-light .group:hover .group-hover\:text-white {
          color: #1A1D20 !important;
        }
        .theme-light .group:hover .group-hover\:text-white\\/90 {
          color: #334155 !important;
        }

        /* --- Footer Light Mode Overrides --- */
        .theme-light footer h4, .theme-light footer span, .theme-light footer a {
          color: #1A1D20 !important;
        }
        .theme-light footer p, .theme-light footer .text-zinc-500, .theme-light footer .text-zinc-600 {
          color: #5C6370 !important;
        }
        .theme-light footer a:hover svg {
          color: var(--color-accent) !important;
        }

        /* --- Music Player Bar Light Mode Overrides --- */
        .theme-light .fixed.bottom-0 {
          border-top: 1px solid #E2E8F0 !important;
          background-color: rgba(248, 249, 250, 0.85) !important;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.04) !important;
        }
        .theme-light .fixed.bottom-0 .absolute.inset-0.pointer-events-none {
          border-top: none !important;
          box-shadow: none !important;
        }
        .theme-light .fixed.bottom-0 .absolute.inset-0.bg-background\\/85 {
          background-color: rgba(248, 249, 250, 0.85) !important;
        }
        .theme-light .fixed.bottom-0 .absolute.top-0.left-0.right-0.h-px {
          background-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.06), transparent) !important;
        }
        .theme-light .fixed.bottom-0 .border-white\\/5 {
          border-color: #E2E8F0 !important;
        }
        .theme-light .fixed.bottom-0 .border-white\\/10 {
          border-color: #E2E8F0 !important;
        }
        .theme-light .fixed.bottom-0 .bg-white\\/5 {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .theme-light .fixed.bottom-0 .hover\\:bg-white\\/5:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .theme-light .fixed.bottom-0 button:not(.bg-white):not(.bg-accent):not(.text-accent) {
          color: #5C6370 !important;
        }
        .theme-light .fixed.bottom-0 button:not(.bg-white):not(.bg-accent):not(.text-accent):hover {
          color: #1A1D20 !important;
        }
        .theme-light .fixed.bottom-0 button.text-accent {
          color: var(--color-accent) !important;
        }
        .theme-light .fixed.bottom-0 button.w-11.h-11 {
          background-color: #1A1D20 !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .theme-light .fixed.bottom-0 button.w-11.h-11:hover {
          background-color: var(--color-accent) !important;
          color: #FFFFFF !important;
        }
        .theme-light .fixed.bottom-0 button.w-11.h-11 svg {
          color: #FFFFFF !important;
          fill: #FFFFFF !important;
        }
        .theme-light .fixed.bottom-0 .text-white, 
        .theme-light .fixed.bottom-0 .text-white\\/90 {
          color: #1A1D20 !important;
        }
        /* Seekbar & Volume sliders */
        .theme-light .fixed.bottom-0 .bg-white\\/10 {
          background-color: rgba(0, 0, 0, 0.1) !important;
        }
        .theme-light .fixed.bottom-0 .bg-white {
          background-color: var(--color-accent) !important;
        }
        .theme-light .fixed.bottom-0 [style*="calc("] {
          background-color: var(--color-accent) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        /* In light mode, the white border-t etc of lists should adapt */
        .theme-light .fixed.bottom-0 .bg-white\\/5 {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }
        
        /* In light mode, white accent means charcoal black to maintain perfect contrast */
        ${accent === "white" ? `
          :root {
            --color-accent: #1A1D20 !important;
            --color-accent-rgb: 26, 29, 32 !important;
          }
          .text-accent {
            color: #1A1D20 !important;
          }
          .bg-accent {
            background-color: #1A1D20 !important;
            color: #FFFFFF !important;
          }
          .border-accent {
            border-color: #1A1D20 !important;
          }
          .bg-accent\\/10 {
            background-color: rgba(26, 29, 32, 0.1) !important;
          }
          .bg-accent\\/15 {
            background-color: rgba(26, 29, 32, 0.15) !important;
          }
          .bg-accent\\/20 {
            background-color: rgba(26, 29, 32, 0.2) !important;
          }
          .text-accent\\/80 {
            color: rgba(26, 29, 32, 0.8) !important;
          }
          .text-accent\\/60 {
            color: rgba(26, 29, 32, 0.6) !important;
          }
        ` : ""}
      `;
    } else {
      // Default Dark
      themeCSS = `
        body, .bg-background {
          background-color: #0D0D0F !important;
        }
        .bg-surface, .bg-surface\\/35, .bg-surface\\/30, .bg-surface\\/50, .bg-white\\/5, .bg-white\\/\\[0\\.015\\], .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.04\\], .bg-white\\/\\[0\\.05\\], .bg-white\\/10, .bg-white\\/15, .bg-\\[\\#1A1C1C\\], .bg-\\[\\#1A1C1C\\]\\/40, .bg-\\[\\#1A1C1C\\]\\/20, .bg-\\[\\#1C1E1E\\], .bg-\\[\\#121212\\]\\/95, .bg-\\[\\#161616\\]\\/95, .bg-\\[\\#161616\\], .bg-\\[\\#1a1a1a\\], .bg-\\[\\#0e0e11\\], .bg-\\[\\#0d0d0d\\], .bg-\\[\\#050505\\] {
          background-color: rgba(26, 26, 28, 0.45) !important;
          -webkit-backdrop-filter: blur(16px) saturate(125%) !important;
          backdrop-filter: blur(16px) saturate(125%) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.06) !important;
        }
        .border-white\\/5, .border-white\\/10, .border-white\\/15, .border-white\\/20, .border-white\\/\\[0\\.02\\] {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        input, select, textarea {
          background-color: rgba(255, 255, 255, 0.04) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          backdrop-filter: blur(12px) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: #F5F5F7 !important;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.01) !important;
        }
        input:focus, select:focus, textarea:focus {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.25) !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11) {
          background-color: rgba(255, 255, 255, 0.03) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #F5F5F7 !important;
        }
        button:not(.bg-accent):not(.bg-white):not(.w-11):hover {
          background-color: rgba(255, 255, 255, 0.07) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 12px rgba(var(--color-accent-rgb), 0.2) !important;
        }
      `;
    }

    styleTag.innerHTML = `
      :root {
        --color-accent: ${hex} !important;
        --color-accent-rgb: ${rgb} !important;
      }
      .text-accent {
        color: ${hex} !important;
      }
      .bg-accent {
        background-color: ${hex} !important;
      }
      .border-accent {
        border-color: ${hex} !important;
      }
      .bg-accent\\/10 {
        background-color: rgba(${rgb}, 0.1) !important;
      }
      .bg-accent\\/15 {
        background-color: rgba(${rgb}, 0.15) !important;
      }
      .bg-accent\\/20 {
        background-color: rgba(${rgb}, 0.2) !important;
      }
      .border-accent\\/25 {
        border-color: rgba(${rgb}, 0.25) !important;
      }
      .text-accent\\/80 {
        color: rgba(${rgb}, 0.8) !important;
      }
      .text-accent\\/60 {
        color: rgba(${rgb}, 0.6) !important;
      }
      .hover\\:text-accent:hover {
        color: ${hex} !important;
      }
      .hover\\:bg-accent:hover {
        background-color: ${hex} !important;
      }
      .hover\\:border-accent:hover {
        border-color: ${hex} !important;
      }
      .shadow-accent {
        box-shadow: 0 0 12px rgba(${rgb}, 0.15) !important;
      }
      ${themeCSS}
    `;

    // Notify any listening components
    window.dispatchEvent(new CustomEvent("accent:change", { detail: hex }));
  }, [themeVariant, accentColor]);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleNavTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveTab(customEvent.detail);
    };
    const handleNavRadio = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveRadioTrackId(customEvent.detail);
      setActiveTab('radio');
    };
    const handleNavArtist = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveArtist(customEvent.detail);
      setActiveTab('artist');
    };
    const handleNavAlbum = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveAlbumTrackId(customEvent.detail);
      setActiveTab('album');
    };
    const handleNavPlaylist = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActivePlaylistId(customEvent.detail);
      setActiveTab('playlist');
    };

    window.addEventListener('nav:tab', handleNavTab);
    window.addEventListener('nav:radio', handleNavRadio);
    window.addEventListener('nav:artist', handleNavArtist);
    window.addEventListener('nav:album', handleNavAlbum);
    window.addEventListener('nav:playlist', handleNavPlaylist);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('nav:tab', handleNavTab);
      window.removeEventListener('nav:radio', handleNavRadio);
      window.removeEventListener('nav:artist', handleNavArtist);
      window.removeEventListener('nav:album', handleNavAlbum);
      window.removeEventListener('nav:playlist', handleNavPlaylist);
    };
  }, [mouseX, mouseY]);

  // Dynamic background gradient (Dark Silver/Indigo Glow or Slate Shadow in Light Mode)
  const isLight = themeVariant === "light-alabaster";
  const spotlightBackground = useMotionTemplate`radial-gradient(
    800px circle at ${springX}px ${springY}px,
    ${isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(65, 65, 85, 0.15)"},
    transparent 80%
  )`;

  const handleNavigateToArtist = (artist: string) => {
    setActiveArtist(artist);
    setActiveTab('artist');
  };

  const handleNavigateToAlbum = (trackId: string) => {
    setActiveAlbumTrackId(trackId);
    setActiveTab('album');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard key="dashboard" onNavigateToArtist={handleNavigateToArtist} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'discover':
        return <Discover key="discover" onNavigateToArtist={handleNavigateToArtist} />;
      case 'stats':
        return <Stats key="stats" />;
      case 'library':
      case 'liked':
      case 'playlists':
      case 'episodes':
        return <Library key="library" activeTab={activeTab} setActiveTab={setActiveTab} onNavigateToArtist={handleNavigateToArtist} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'artist':
        return <ArtistProfile key="artist" artistName={activeArtist} onBack={() => setActiveTab('home')} onNavigateToAlbum={handleNavigateToAlbum} />;
      case 'album':
        return <AlbumProfile key="album" albumTrackId={activeAlbumTrackId} onBack={() => setActiveTab('home')} onNavigateToArtist={handleNavigateToArtist} />;
      case 'playlist':
        return <PlaylistProfile key="playlist" playlistId={activePlaylistId} onBack={() => setActiveTab('home')} onNavigateToArtist={handleNavigateToArtist} />;
      case 'radio':
        return (
          <SongRadio 
            key="radio" 
            seedTrackId={activeRadioTrackId} 
            onBack={() => setActiveTab('home')} 
            onNavigateToArtist={handleNavigateToArtist}
            onNavigateToAlbum={handleNavigateToAlbum}
          />
        );
      case 'settings':
        return <Settings key="settings" />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="text-2xl font-black tracking-widest italic"
            >
              Cortex Engine Under Maintenance
            </motion.div>
            <p className="text-xs tracking-[0.5em]">Module: {activeTab}</p>
          </div>
        );
    }
  };

  const enterApp = () => setView('app');

  return (
    <div className={`relative h-screen w-screen overflow-hidden bg-background text-text-primary font-sans selection:bg-accent selection:text-background ${themeVariant === 'light-alabaster' ? 'theme-light' : 'theme-dark'}`}>
      
      {/* --- GLOBAL EFFECTS LAYER --- */}
      
      {/* 1. Global Noise Overlay (5% Opacity) */}
      <div 
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* 2. Mouse Follow Spotlight */}
      <motion.div
        className={`fixed inset-0 z-0 pointer-events-none ${themeVariant === 'light-alabaster' ? 'mix-blend-multiply opacity-60' : 'mix-blend-screen'}`}
        style={{ background: spotlightBackground }}
      />

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingPage onEnter={enterApp} />
        ) : (
          <motion.div 
            key="app-main"
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full"
          >
            {/* Sidebar - Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-48 pt-0 px-0 relative grid min-h-0">
              <AnimatePresence>
                <motion.div
                  key={['library', 'liked', 'playlists', 'episodes'].includes(activeTab) ? 'library' : activeTab}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
                  className="col-start-1 row-start-1 flex flex-col min-h-0"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Music Player Bar */}
            <PlayerBar onNavigateToArtist={handleNavigateToArtist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
};

export default App;
