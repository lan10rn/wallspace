import React from 'react';
import WallpaperCard from './WallpaperCard';
import { Skeleton } from './ui/Skeleton';
import { ImageOff, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export default function WallpaperGrid({
  wallpapers,
  loading,
  wallpapersFound,
  onPreview,
  onResetSearch,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 justify-items-center">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-3 w-full max-w-sm">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="flex justify-between items-center px-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!wallpapersFound || wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-surface-containerHighest flex items-center justify-center text-muted-foreground shadow-inner">
          <ImageOff className="w-8 h-8 text-muted-foreground/70" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground">No Wallpapers Found</h3>
          <p className="text-sm text-muted-foreground">
            We couldn't find any wallpapers matching your search criteria. Try a different query or adjust your category and purity filters.
          </p>
        </div>
        {onResetSearch && (
          <Button variant="outline" size="sm" onClick={onResetSearch} icon={Sparkles}>
            Explore Abstract Wallpapers
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex items-center justify-center text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Showing {wallpapers.length} Wallpapers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
        {wallpapers.map((wallpaper, index) => (
          <div
            key={wallpaper.id}
            className="animate-fade-in w-full max-w-sm"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <WallpaperCard wallpaper={wallpaper} onPreview={onPreview} />
          </div>
        ))}
      </div>
    </div>
  );
}
