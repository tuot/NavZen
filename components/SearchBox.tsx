"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Clock, X, ArrowLeft } from "lucide-react";

const HISTORY_KEY = "search-history";
const ENGINE_KEY = "selected-engine";
const MAX_HISTORY = 500;

type SearchEngine = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

const searchEngines: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    url: "https://www.google.com/search?q=",
    icon: "https://www.google.com/favicon.ico",
  },
  {
    id: "bing",
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    icon: "https://www.bing.com/favicon.ico",
  },
  {
    id: "baidu",
    name: "Baidu",
    url: "https://www.baidu.com/s?wd=",
    icon: "https://www.baidu.com/favicon.ico",
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    icon: "https://duckduckgo.com/favicon.ico",
  },
  {
    id: "Dick.ai",
    name: "Dick.ai",
    url: "https://duck.ai/chat?duckai=1&q=",
    icon: "https://duck.ai/favicon.ico",
  },
  {
    id: "yahoo",
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
    icon: "https://www.yahoo.com/favicon.ico",
  },
  {
    id: "yandex",
    name: "Yandex",
    url: "https://yandex.com/search/?text=",
    icon: "https://yandex.com/favicon.ico",
  },
];

function MobileOverlay({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const scrollReset = () => window.scrollTo(0, 0);
    window.addEventListener("scroll", scrollReset);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scroll", scrollReset);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 flex flex-col md:hidden" style={{ height: "100dvh" }}>
      {children}
    </div>
  );
}

export function SearchBox() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const filteredHistory = searchQuery.trim()
    ? history.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;
  const [currentTime, setCurrentTime] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const engineDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Load history & saved engine from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
      const savedEngine = localStorage.getItem(ENGINE_KEY);
      if (savedEngine) {
        const engine = searchEngines.find((e) => e.id === savedEngine);
        if (engine) setSelectedEngine(engine);
      }
    } catch {}
  }, []);

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const addToHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      const next = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item !== query);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Close dropdowns on outside click (desktop only for history, since mobile uses overlay)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!isFocused) setShowHistory(false);
      }
      if (engineDropdownRef.current && !engineDropdownRef.current.contains(event.target as Node)) {
        setShowEngineDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query.trim());
      const searchUrl = `${selectedEngine.url}${encodeURIComponent(query)}`;
      setShowHistory(false);
      setIsFocused(false);
      window.open(searchUrl, "_blank");
    }
  };

  const handleEngineSelect = (engine: SearchEngine) => {
    setSelectedEngine(engine);
    setShowEngineDropdown(false);
    localStorage.setItem(ENGINE_KEY, engine.id);
  };

  return (
    <>
      {/* Mobile fullscreen search overlay - portaled to body */}
      {isFocused &&
        mounted &&
        createPortal(
          <MobileOverlay>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsFocused(false);
                  setShowHistory(false);
                }}
                className="p-2 text-gray-600 dark:text-gray-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (history.length > 0) setShowHistory(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search Anything..."
                className="flex-1 py-2 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  onClick={() => { setSearchQuery(""); if (history.length > 0) setShowHistory(true); }}
                  className="p-2 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => handleSearch(searchQuery)} className="p-2 text-blue-500">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {showHistory && filteredHistory.length > 0 && (
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="flex items-center justify-between px-6 py-2">
                  <span className="text-xs text-gray-400">Search History</span>
                  <button
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      setHistory([]);
                      localStorage.removeItem(HISTORY_KEY);
                      setShowHistory(false);
                    }}
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem(HISTORY_KEY);
                      setShowHistory(false);
                    }}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Clear
                  </button>
                </div>
                {filteredHistory.slice(0, 10).map((item) => (
                  <div
                    key={item}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left cursor-pointer"
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      addToHistory(item);
                      window.open(`${selectedEngine.url}${encodeURIComponent(item)}`, "_blank");
                    }}
                    onClick={() => {
                      addToHistory(item);
                      window.open(`${selectedEngine.url}${encodeURIComponent(item)}`, "_blank");
                    }}
                  >
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </MobileOverlay>,
          document.body,
        )}

      {/* Home view */}
      <div
        className={`fixed inset-0 flex flex-col items-center px-4 pt-[20vh] ${isFocused ? "hidden md:flex" : ""}`}
      >
        {mounted && (
          <div className="mb-8 text-6xl font-light text-gray-800 dark:text-gray-200 tabular-nums">
            {currentTime}
          </div>
        )}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-3 rounded-full transition-all duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-300" />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="w-full max-w-3xl relative" ref={dropdownRef}>
          <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="relative shrink-0" ref={engineDropdownRef}>
              <button
                onClick={() => setShowEngineDropdown(!showEngineDropdown)}
                className="flex items-center justify-center px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-full transition-colors"
              >
                <img
                  src={selectedEngine.icon}
                  alt={selectedEngine.name}
                  className="w-5 h-5"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='20' font-size='20'>${selectedEngine.name[0]}</text></svg>`;
                  }}
                />
              </button>
              {showEngineDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[160px]">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => handleEngineSelect(engine)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedEngine.id === engine.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <img
                        src={engine.icon}
                        alt={engine.name}
                        className="w-5 h-5"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='20' font-size='20'>${engine.name[0]}</text></svg>`;
                        }}
                      />
                      <span>{engine.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
            {/* Mobile: fake input that opens fullscreen overlay */}
            <div
              onClick={() => {
                window.scrollTo(0, 0);
                setIsFocused(true);
                if (history.length > 0) setShowHistory(true);
              }}
              className="flex-1 px-4 py-4 text-gray-400 dark:text-gray-500 cursor-text md:hidden"
            >
              {searchQuery || "Search Anything..."}
            </div>
            {/* Desktop: real input */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (history.length > 0) setShowHistory(true);
              }}
              onKeyDown={handleKeyDown}
              onClick={() => {
                if (history.length > 0) setShowHistory(true);
              }}
              placeholder="Search Anything..."
              className="hidden md:block flex-1 px-4 py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setSearchQuery(""); if (history.length > 0) setShowHistory(true); inputRef.current?.focus(); }}
                className="hidden md:block p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleSearch(searchQuery)}
              className="p-4 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          {/* Desktop history dropdown */}
          {showHistory && filteredHistory.length > 0 && (
            <div className="hidden md:block absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400">Search History</span>
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem(HISTORY_KEY);
                    setShowHistory(false);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>
              {filteredHistory.slice(0, 10).map((item) => (
                <div
                  key={item}
                  className="w-full flex items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 group"
                >
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  <button
                    className="flex-1 text-left text-gray-700 dark:text-gray-300 truncate"
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                  >
                    {item}
                  </button>
                  <button
                    onClick={() => removeFromHistory(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 shrink-0"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
