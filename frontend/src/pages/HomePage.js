import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SearchForm from '../components/SearchForm';
import WallpaperGrid from '../components/WallpaperGrid';
import { Modal } from '../components/ui/Modal';
import { Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('111');
  const [purity, setPurity] = useState('100');
  const [sorting, setSorting] = useState('date_added');
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Theme (Dark/Light)
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      return newMode;
    });
  };

  useEffect(() => {
    // Set default dark mode on mount
    document.documentElement.classList.add('dark');
  }, []);

  // Fetch wallpapers from backend API
  const fetchWallpapers = useCallback(async (queryText = searchQuery) => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams({
        q: queryText || 'abstract',
        categories: category,
        purity: purity,
        sorting: sorting,
        order: 'desc',
        per_page: '24',
      });

      const response = await fetch(`${API_BASE_URL}/api/wallpapers?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const result = await response.json();
      if (result.data) {
        setWallpapers(result.data);
      } else {
        setWallpapers([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(`Unable to fetch wallpapers. Ensure backend server is running on ${API_BASE_URL}. (${err.message})`);
    } finally {
      setLoading(false);
    }
  }, [category, purity, sorting, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchWallpapers('abstract');
  }, [fetchWallpapers]);

  const handleSearchSubmit = (e, customQuery) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    fetchWallpapers(queryToUse);
  };

  const handleResetSearch = () => {
    setSearchQuery('abstract');
    setCategory('111');
    setPurity('100');
    setSorting('date_added');
    fetchWallpapers('abstract');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Navbar Header */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center">
        {/* Hero Banner Centered with Material Design Gradient */}
        <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-primary-container via-surface-containerHigh to-surface-container p-8 sm:p-12 border border-border/40 shadow-xl text-center flex flex-col items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wallhaven API Backend Connected</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-foreground text-center">
              Discover High Resolution{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent">
                Wallpapers
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl text-center">
              Browse thousands of ultra-high-definition wallpapers curated from Wallhaven. Filter by categories, purity rating, and resolution with sleek Material UI cards.
            </p>

            {/* Search Form component */}
            <div className="pt-4 w-full max-w-3xl mx-auto">
              <SearchForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                category={category}
                setCategory={setCategory}
                purity={purity}
                setPurity={setPurity}
                sorting={sorting}
                setSorting={setSorting}
                onSubmit={handleSearchSubmit}
                loading={loading}
              />
            </div>
          </div>
        </section>

        {/* Error Alert if backend issue occurs */}
        {error && (
          <div className="w-full max-w-3xl p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-between mx-auto">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium text-center">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWallpapers()}
              icon={RefreshCw}
              className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Wallpaper Grid Section */}
        <section className="w-full space-y-4">
          <WallpaperGrid
            wallpapers={wallpapers}
            loading={loading}
            wallpapersFound={wallpapers.length > 0}
            onPreview={(wp) => setSelectedWallpaper(wp)}
            onResetSearch={handleResetSearch}
          />
        </section>
      </main>

      {/* Footer Centered */}
      <footer className="border-t border-border/40 py-8 bg-surface-container w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground text-center">
          <div className="flex items-center space-x-2 justify-center">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">WallSpace</span>
            <span>— Designed with Shadcn & Material UI principles</span>
          </div>
          <div className="text-center">
            Powered by <a href="https://wallhaven.cc" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Wallhaven API</a>
          </div>
        </div>
      </footer>

      {/* Lightbox Preview Modal */}
      <Modal
        isOpen={Boolean(selectedWallpaper)}
        onClose={() => setSelectedWallpaper(null)}
        wallpaper={selectedWallpaper}
      />
    </div>
  );
}
