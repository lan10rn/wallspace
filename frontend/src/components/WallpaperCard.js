import React, { useState } from 'react';
import { Eye, Heart, Download, Maximize2, ExternalLink } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export default function WallpaperCard({ wallpaper, onPreview }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const thumbUrl = wallpaper.thumbs?.small || wallpaper.thumbs?.original || wallpaper.path;
  const resolution = wallpaper.resolution || 'HD';
  const views = wallpaper.views ? wallpaper.views.toLocaleString() : 'N/A';
  const favorites = wallpaper.favorites ? wallpaper.favorites.toLocaleString() : 'N/A';

  return (
    <Card
      className="group relative flex flex-col bg-surface-container border border-border/40 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPreview(wallpaper)}
    >
      {/* Aspect Ratio Container for Image */}
      <div className="relative aspect-[16/10] w-full bg-surface-containerHighest overflow-hidden">
        {/* Placeholder Loader until Image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface-containerHighest animate-pulse flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Loading preview...</span>
          </div>
        )}

        <img
          src={thumbUrl}
          alt={wallpaper.id}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Resolution Badge Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="glow" className="text-[10px] font-bold tracking-wide">
            {resolution}
          </Badge>
        </div>

        {/* Category Pill Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white text-[10px]">
            {wallpaper.ratio || '16:9'}
          </Badge>
        </div>

        {/* Hover Overlay with Quick Action Buttons */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(wallpaper.path, '_blank');
              }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
              title="Open full image"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/90">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1 font-medium">
                  <Eye className="w-3.5 h-3.5 text-primary-foreground" />
                  <span>{views}</span>
                </span>
                <span className="flex items-center space-x-1 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>{favorites}</span>
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1 text-xs py-1.5 h-8 font-semibold shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(wallpaper);
                }}
                icon={Maximize2}
              >
                Quick View
              </Button>

              <a
                href={wallpaper.path}
                download
                onClick={(e) => e.stopPropagation()}
                className="shrink-0"
              >
                <Button
                  variant="secondary"
                  size="iconSm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  title="Download Wallpaper"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Footer */}
      <div className="p-3.5 bg-surface-container flex items-center justify-between border-t border-border/30">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-foreground/90 group-hover:text-primary transition-colors truncate max-w-[150px]">
            Wallhaven #{wallpaper.id}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-muted-foreground">
          <Eye className="w-3 h-3 text-muted-foreground" />
          <span>{views}</span>
        </div>
      </div>
    </Card>
  );
}
