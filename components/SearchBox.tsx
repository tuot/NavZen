"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, ChevronDown, Clock, X } from "lucide-react";

const HISTORY_KEY = "search-history";
const MAX_HISTORY = 50;

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

export function SearchBox() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const engineDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 从 localStorage 加载历史
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
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

  // 获取搜索建议
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(searchQuery.trim())}`, {
          signal: controller.signal,
        });
        const data: string[] = await res.json();
        setSuggestions(data.slice(0, 8));
        setShowSuggestions(data.length > 0);
        setHighlightedIndex(-1);
      } catch {
        // 请求被取消或失败，忽略
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
      if (engineDropdownRef.current && !engineDropdownRef.current.contains(event.target as Node)) {
        setShowEngineDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSearch(suggestions[highlightedIndex]);
        } else {
          handleSearch(searchQuery);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query.trim());
      const searchUrl = `${selectedEngine.url}${encodeURIComponent(query)}`;
      window.open(searchUrl, "_blank");
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleEngineSelect = (engine: SearchEngine) => {
    setSelectedEngine(engine);
    setShowEngineDropdown(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-[30vh]">
      {/* 主题切换按钮 */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-3 rounded-full transition-all duration-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="切换主题"
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
      {/* 搜索框容器 */}
      <div className="w-full max-w-3xl relative" ref={dropdownRef}>
        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          {/* 搜索引擎选择器 */}
          <div className="relative shrink-0" ref={engineDropdownRef}>
            <button
              onClick={() => setShowEngineDropdown(!showEngineDropdown)}
              className="flex items-center justify-center px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-full transition-colors"
            >
              <img src={selectedEngine.icon} alt={selectedEngine.name} className="w-5 h-5" />
            </button>

            {/* 搜索引擎下拉菜单 */}
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
                    <img src={engine.icon} alt={engine.name} className="w-5 h-5" />
                    <span>{engine.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 分隔线 */}
          <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

          {/* 搜索输入框 */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowHistory(false);
            }}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (history.length > 0 && !searchQuery.trim()) {
                setShowHistory(true);
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="搜索任何内容..."
            className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* 搜索按钮 */}
          <button
            onClick={() => handleSearch(searchQuery)}
            className="p-4 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-r-full transition-colors"
            aria-label="搜索"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* 搜索建议下拉列表 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  highlightedIndex === index
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        {/* 搜索历史下拉列表 */}
        {showHistory && !showSuggestions && history.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40">
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400">搜索历史</span>
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem(HISTORY_KEY);
                  setShowHistory(false);
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                清空
              </button>
            </div>
            {history.slice(0, 10).map((item) => (
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
                  aria-label="删除"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
