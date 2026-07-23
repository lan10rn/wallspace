import React from 'react';
import { Sparkles, Sun, Moon, Image as ImageIcon, Globe, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';

export default function Navbar({ isDarkMode, toggleTheme, onOpenAIStudio }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-accent to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                WallSpace
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                <Sparkles className="w-2.5 h-2.5 mr-1" /> M3
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium hidden sm:block">
              Discover Wallpapers in Material & Shadcn Aesthetic
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* AI Generator Studio Trigger */}
          <Button
            variant="default"
            size="sm"
            onClick={onOpenAIStudio}
            icon={Wand2}
            className="shadow-md shadow-primary/20 text-xs px-4 rounded-full font-bold"
          >
            AI Studio
          </Button>

          <a
            href="https://wallhaven.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button variant="ghost" size="icon" aria-label="Wallhaven website">
              <Globe className="w-4 h-4" />
            </Button>
          </a>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className="relative"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 transition-transform hover:-rotate-12" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
