import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Download, ExternalLink, Eye, Heart, Maximize2, Shield, Calendar, HardDrive } from 'lucide-react';

export default function WallpaperDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Demo / API details loader
    setLoading(true);
    const mockData = {
      id: id || '9m5yox',
      short_url: `Wallpaper #${id || '9m5yox'}`,
      path: 'https://w.wallhaven.cc/full/9m/wallhaven-9m5yox.png',
      resolution: '3840x2160',
      ratio: '16:9',
      file_size: 4.2 * 1024 * 1024,
      date_added: Math.floor(Date.now() / 1000),
      views: 24590,
      favorites: 1840,
      category: 'General',
      purity: 'sfw',
      tags: [
        { id: '1', name: 'abstract' },
        { id: '2', name: 'digital art' },
        { id: '3', name: 'minimalism' },
        { id: '4', name: '4k' },
      ],
      thumbs: {
        small: 'https://th.wallhaven.cc/small/9m/9m5yox.jpg',
        original: 'https://th.wallhaven.cc/lg/9m/9m5yox.jpg',
      },
      url: `https://wallhaven.cc/w/${id || '9m5yox'}`,
    };

    setWallpaper(mockData);
    setLoading(false);
  }, [id]);

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

  if (loading || !wallpaper) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/')}
          icon={ArrowLeft}
          className="rounded-full"
        >
          Back to Wallpapers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Hero Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl bg-black overflow-hidden border border-border/40 shadow-2xl flex items-center justify-center min-h-[400px]">
              <img
                src={wallpaper.path}
                alt={wallpaper.id}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <Badge variant="glow" className="absolute top-4 left-4">
                {wallpaper.resolution}
              </Badge>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6 bg-surface-container p-6 rounded-3xl border border-border/40 shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-foreground">
                  {wallpaper.short_url}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Wallhaven Wallpaper Record</p>
              </div>

              {/* Material Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 bg-surface-containerHighest/50 p-4 rounded-2xl border border-border/30">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{wallpaper.views.toLocaleString()} Views</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>{wallpaper.favorites.toLocaleString()} Favs</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>{wallpaper.ratio}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="uppercase">{wallpaper.purity}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  <span>{(wallpaper.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(wallpaper.date_added * 1000).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tags section */}
              {wallpaper.tags && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        #{tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <a href={wallpaper.path} download target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" className="w-full" icon={Download}>
                  Download Full Image
                </Button>
              </a>

              <a href={wallpaper.url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full" icon={ExternalLink}>
                  Open Wallhaven Page
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
