"use client";

import { useState, useEffect } from "react";

const BG_THEME_KEY = "bg-theme";

export type BgTheme = {
  id: string;
  name: string;
  preview: string; // CSS gradient for the preview dot
  light: string[]; // 4 blob color classes
  dark: string[];  // 4 blob color classes
};

export const bgThemes: BgTheme[] = [
  {
    id: "aurora",
    name: "极光",
    preview: "linear-gradient(135deg, #93c5fd, #c084fc, #f9a8d4)",
    light: [
      "bg-blue-200/60",
      "bg-purple-200/60",
      "bg-pink-200/50",
      "bg-amber-100/40",
    ],
    dark: [
      "bg-indigo-900/30",
      "bg-violet-900/25",
      "bg-cyan-900/20",
      "bg-fuchsia-900/15",
    ],
  },
  {
    id: "ocean",
    name: "海洋",
    preview: "linear-gradient(135deg, #67e8f9, #38bdf8, #6366f1)",
    light: [
      "bg-cyan-200/60",
      "bg-sky-200/55",
      "bg-blue-200/50",
      "bg-teal-100/40",
    ],
    dark: [
      "bg-blue-900/30",
      "bg-slate-800/25",
      "bg-cyan-900/20",
      "bg-indigo-900/15",
    ],
  },
  {
    id: "sunset",
    name: "日落",
    preview: "linear-gradient(135deg, #fdba74, #fb7185, #f59e0b)",
    light: [
      "bg-orange-200/60",
      "bg-rose-200/55",
      "bg-amber-200/50",
      "bg-red-100/40",
    ],
    dark: [
      "bg-orange-900/30",
      "bg-red-900/25",
      "bg-rose-900/20",
      "bg-amber-900/15",
    ],
  },
  {
    id: "forest",
    name: "森林",
    preview: "linear-gradient(135deg, #6ee7b7, #34d399, #2dd4bf)",
    light: [
      "bg-emerald-200/60",
      "bg-green-200/55",
      "bg-lime-200/50",
      "bg-teal-100/40",
    ],
    dark: [
      "bg-emerald-900/30",
      "bg-green-900/25",
      "bg-teal-900/20",
      "bg-cyan-900/15",
    ],
  },
  {
    id: "lavender",
    name: "薰衣草",
    preview: "linear-gradient(135deg, #c4b5fd, #a78bfa, #f0abfc)",
    light: [
      "bg-violet-200/60",
      "bg-purple-200/55",
      "bg-fuchsia-200/50",
      "bg-pink-100/40",
    ],
    dark: [
      "bg-purple-900/30",
      "bg-violet-900/25",
      "bg-fuchsia-900/20",
      "bg-indigo-900/15",
    ],
  },
  {
    id: "mono",
    name: "素白",
    preview: "linear-gradient(135deg, #e5e7eb, #d1d5db, #9ca3af)",
    light: [
      "bg-gray-200/40",
      "bg-slate-200/35",
      "bg-zinc-200/30",
      "bg-stone-100/25",
    ],
    dark: [
      "bg-gray-800/30",
      "bg-slate-800/25",
      "bg-zinc-800/20",
      "bg-neutral-800/15",
    ],
  },
];

// Blob layout positions
const blobPositions = {
  light: [
    "absolute top-[-10%] left-[-5%] w-[40%] h-[40%]",
    "absolute top-[20%] right-[-5%] w-[35%] h-[35%]",
    "absolute bottom-[-5%] left-[20%] w-[35%] h-[35%]",
    "absolute top-[50%] left-[50%] w-[30%] h-[30%]",
  ],
  dark: [
    "absolute top-[-15%] left-[-10%] w-[45%] h-[45%]",
    "absolute top-[15%] right-[-10%] w-[40%] h-[40%]",
    "absolute bottom-[-10%] left-[15%] w-[40%] h-[40%]",
    "absolute top-[45%] left-[45%] w-[35%] h-[35%]",
  ],
};

const delays = ["", "animation-delay-2000", "animation-delay-4000", "animation-delay-3000"];

export function useBgTheme() {
  const [themeId, setThemeId] = useState("aurora");

  useEffect(() => {
    const saved = localStorage.getItem(BG_THEME_KEY);
    if (saved && bgThemes.some((t) => t.id === saved)) {
      setThemeId(saved);
    }
  }, []);

  const setBgTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem(BG_THEME_KEY, id);
  };

  const current = bgThemes.find((t) => t.id === themeId) || bgThemes[0];
  return { current, setBgTheme, themeId };
}

export function BackgroundBlobs({ theme }: { theme: BgTheme }) {
  return (
    <>
      {/* Light mode blobs */}
      <div className="absolute inset-0 dark:hidden pointer-events-none">
        {theme.light.map((color, i) => (
          <div
            key={`light-${i}`}
            className={`${blobPositions.light[i]} rounded-full ${color} blur-2xl md:blur-3xl will-change-transform md:animate-blob ${delays[i]}`}
          />
        ))}
      </div>
      {/* Dark mode blobs */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        {theme.dark.map((color, i) => (
          <div
            key={`dark-${i}`}
            className={`${blobPositions.dark[i]} rounded-full ${color} blur-2xl md:blur-3xl will-change-transform md:animate-blob ${delays[i]}`}
          />
        ))}
      </div>
    </>
  );
}
