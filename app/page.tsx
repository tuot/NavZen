"use client";

import { SearchBox } from "@/components/SearchBox";
import { BackgroundBlobs, useBgTheme } from "@/components/BackgroundBlobs";

export default function Page() {
  const { current, setBgTheme, themeId } = useBgTheme();

  return (
    <div className="relative size-full min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <BackgroundBlobs theme={current} />
      <div className="relative z-10">
        <SearchBox bgThemeId={themeId} onBgThemeChange={setBgTheme} />
      </div>
    </div>
  );
}
