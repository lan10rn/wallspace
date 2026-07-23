import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Tag } from 'lucide-react';
import { Select } from './ui/Input';
import { Button } from './ui/Button';

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  purity,
  setPurity,
  sorting,
  setSorting,
  onSubmit,
  loading,
}) {
  const categoriesList = [
    { label: 'All Categories', value: '111' },
    { label: 'General', value: '100' },
    { label: 'Anime', value: '010' },
    { label: 'People', value: '001' },
  ];

  const quickTags = ['Abstract', 'Cyberpunk', 'Nature', 'Minimalist', 'Neon', 'Sci-Fi', 'Space', 'Cars'];

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    onSubmit(null, tag);
  };

  return (
    <form onSubmit={(e) => onSubmit(e, searchQuery)} className="w-full space-y-5 flex flex-col items-center">
      {/* Search Input Bar Centered */}
      <div className="relative flex items-center w-full max-w-2xl shadow-lg rounded-full bg-surface-containerHigh p-1.5 border border-border/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/20 transition-all mx-auto">
        <Search className="w-5 h-5 ml-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search wallpapers (e.g. Cyberpunk, Minimalist, Space)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent px-4 py-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none text-center sm:text-left"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1.5 rounded-full hover:bg-surface-containerHighest text-muted-foreground hover:text-foreground mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Button
          type="submit"
          disabled={loading}
          variant="default"
          size="default"
          className="px-6 rounded-full shrink-0 font-medium shadow-md"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Searching...</span>
            </span>
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {/* Category Pills & Filters Centered */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-1">
        {/* Category Pills Centered */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-1 scrollbar-none flex-wrap gap-y-2">
          <span className="text-xs font-semibold text-muted-foreground shrink-0 uppercase tracking-wider hidden sm:inline mr-1">
            Category:
          </span>
          {categoriesList.map((cat) => {
            const isSelected = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105 font-bold'
                    : 'bg-surface-containerHigh text-muted-foreground hover:bg-surface-containerHighest hover:text-foreground border border-border/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Controls dropdowns Centered */}
        <div className="flex items-center justify-center space-x-2 w-full sm:w-auto">
          {/* Purity selector */}
          <div className="w-36">
            <Select
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              icon={SlidersHorizontal}
              className="text-xs"
            >
              <option value="100">SFW Only</option>
              <option value="110">SFW + Sketchy</option>
              <option value="111">All Content</option>
            </Select>
          </div>

          {/* Sort dropdown */}
          <div className="w-36">
            <Select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              icon={ArrowUpDown}
              className="text-xs"
            >
              <option value="date_added">Newest</option>
              <option value="relevance">Relevance</option>
              <option value="views">Most Viewed</option>
              <option value="favorites">Most Favorited</option>
              <option value="random">Random</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Tag Recommendations Centered */}
      <div className="flex items-center justify-center space-x-2 pt-1 flex-wrap gap-y-2 text-xs w-full">
        <div className="flex items-center space-x-1 justify-center shrink-0">
          <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-muted-foreground font-medium shrink-0">Popular:</span>
        </div>
        <div className="flex items-center justify-center space-x-1.5 overflow-x-auto flex-wrap gap-y-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-lg bg-surface-container/60 hover:bg-surface-containerHighest text-muted-foreground hover:text-primary transition-colors border border-border/30 text-xs shrink-0"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
