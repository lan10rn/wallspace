import React, { useEffect } from 'react';
import { X, ExternalLink, Download, Heart, Eye, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export function Modal({ isOpen, onClose, wallpaper }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !wallpaper) return null;

  const resolution = wallpaper.resolution || 'HD';
  const views = wallpaper.views ? wallpaper.views.toLocaleString() : 'N/A';
  const favorites = wallpaper.favorites ? wallpaper.favorites.toLocaleString() : 'N/A';
  const category = wallpaper.category || (wallpaper.category_id === 100 ? 'General' : wallpaper.category_id === 10 ? 'Anime' : 'Wallpapers');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-surface-container/95 border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview Container */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px] overflow-hidden group">
          <img
            src={wallpaper.path || wallpaper.thumbs?.large || wallpaper.thumbs?.original || wallpaper.thumbs?.small}
            alt={wallpaper.id}
            className="max-h-[85vh] w-full object-contain transition-transform duration-300"
          />
          <Badge
            variant="glow"
            className="absolute top-4 left-4"
          >
            {resolution}
          </Badge>
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-surface-containerHigh/50 border-t md:border-t-0 md:border-l border-border/40">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
                <span>WALLHAVEN ID</span>
                <span>•</span>
                <span>#{wallpaper.id}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground capitalize tracking-tight">
                {wallpaper.short_url || `Wallpaper #${wallpaper.id}`}
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 bg-surface-containerHighest/40 p-4 rounded-2xl border border-border/30">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Eye className="w-4 h-4 text-primary" />
                <span>{views} Views</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{favorites} Favs</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span>{wallpaper.ratio || '16:9'}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>{category}</span>
              </div>
            </div>

            {/* Tags if available */}
            {wallpaper.tags && wallpaper.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Tags</h4>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {wallpaper.tags.map((tag) => (
                    <Badge key={tag.id || tag.name} variant="secondary" className="text-xs">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-6">
            <a
              href={wallpaper.path}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="block w-full"
            >
              <Button variant="default" className="w-full" icon={Download}>
                Download Full Res
              </Button>
            </a>

            <a
              href={wallpaper.url || `https://wallhaven.cc/w/${wallpaper.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="outline" className="w-full" icon={ExternalLink}>
                View on Wallhaven
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
