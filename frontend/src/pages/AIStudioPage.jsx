import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, Wand2, ArrowLeft, Download, Plus, Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AIStudioPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [modelUrl, setModelUrl] = useState('http://127.0.0.1:7860');
  const [modelStatus, setModelStatus] = useState('checking');
  const [showConfig, setShowConfig] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    document.documentElement.classList.add('dark');
  }, []);

  const stylePresets = [
    { name: 'Cyberpunk', icon: '⚡' },
    { name: 'Minimalist', icon: '🎨' },
    { name: 'Photorealistic', icon: '📷' },
    { name: 'Anime', icon: '🌸' },
    { name: 'Fantasy', icon: '🐉' },
    { name: '3D Render', icon: '💎' },
    { name: 'Surrealism', icon: '🌌' },
  ];

  const aspectRatios = [
    { label: '16:9 (Desktop)', value: '16:9' },
    { label: '9:16 (Mobile)', value: '9:16' },
    { label: '1:1 (Square)', value: '1:1' },
    { label: '21:9 (Ultrawide)', value: '21:9' },
  ];

  const checkStatus = useCallback(async () => {
    setModelStatus('checking');
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/status?url=${encodeURIComponent(modelUrl)}`);
      const data = await res.json();
      if (data.status === 'online') {
        setModelStatus('online');
      } else {
        setModelStatus('offline');
      }
    } catch {
      setModelStatus('offline');
    }
  }, [modelUrl]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    setError('');
    setGeneratedImage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          aspect_ratio: aspectRatio,
          model_url: modelUrl,
        }),
      });

      if (!res.ok) {
        throw new Error(`Generation failed (${res.status})`);
      }

      const data = await res.json();
      if (data.success && data.image) {
        setGeneratedImage(data);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(err.message || 'Error generating image');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToGrid = () => {
    if (!generatedImage) return;
    const newWallpaper = {
      id: `ai-${Date.now()}`,
      short_url: prompt.slice(0, 24) || 'AI Generated',
      path: generatedImage.image,
      resolution: generatedImage.resolution || '3840x2160',
      ratio: aspectRatio,
      file_size: 2.5 * 1024 * 1024,
      date_added: Math.floor(Date.now() / 1000),
      views: 1,
      favorites: 1,
      category: 'AI Generated',
      purity: 'sfw',
      thumbs: {
        small: generatedImage.image,
        original: generatedImage.image,
      },
    };
    navigate('/', { state: { newWallpaper } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Navigation & Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" size="sm" icon={ArrowLeft} className="mr-2">
                  Gallery
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Wand2 className="w-7 h-7 text-primary" />
                AI Wallpaper Studio
              </h1>
              <Badge variant="glow" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Local AI Engine
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground pl-1">
              Generate ultra high-resolution wallpapers using your local Stable Diffusion model or cloud fallback engine.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            icon={Server}
            className="shrink-0"
          >
            {showConfig ? 'Hide Server Settings' : 'Server Settings'}
          </Button>
        </div>

        {/* Local Server Config Drawer */}
        {showConfig && (
          <div className="p-4 bg-surface-containerHighest/80 border border-border/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs animate-fade-in">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-semibold text-foreground">Local Model Endpoint:</span>
              <input
                type="text"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                className="bg-surface-container px-3 py-1.5 rounded-lg border border-border/40 text-foreground w-64 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="http://127.0.0.1:7860"
              />
              <Button variant="ghost" size="sm" onClick={checkStatus} icon={RefreshCw}>
                Test
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Status:</span>
              {modelStatus === 'online' ? (
                <Badge variant="success" icon={CheckCircle2}>SD WebUI Active</Badge>
              ) : (
                <Badge variant="secondary" icon={AlertCircle}>Online Fallback Active</Badge>
              )}
            </div>
          </div>
        )}

        {/* Main Generator Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Controls Form (Left Column) */}
          <div className="lg:col-span-5 bg-surface-container/60 border border-border/40 rounded-3xl p-6 space-y-6 shadow-xl">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Prompt / Image Idea
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your wallpaper idea (e.g. Cyberpunk samurai overlooking futuristic Tokyo city at night, neon lights, 8k resolution)..."
                className="w-full rounded-2xl bg-surface-containerHigh/80 p-4 text-sm text-foreground border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Style Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Style Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {stylePresets.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedStyle(s.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedStyle === s.name
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold scale-105'
                        : 'bg-surface-containerHigh text-muted-foreground hover:bg-surface-containerHighest hover:text-foreground border border-border/30'
                    }`}
                  >
                    <span>{s.icon}</span> <span className="ml-1">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    type="button"
                    onClick={() => setAspectRatio(ar.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-center border ${
                      aspectRatio === ar.value
                        ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface-containerHigh border-border/40 text-muted-foreground hover:bg-surface-containerHighest'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <Button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              variant="default"
              className="w-full py-3.5 h-12 text-base font-bold rounded-2xl shadow-xl shadow-primary/25"
              icon={Sparkles}
            >
              {generating ? 'Generating Wallpaper...' : 'Generate Wallpaper'}
            </Button>
          </div>

          {/* Canvas Display Viewport (Right Column) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center rounded-3xl bg-black/40 border border-border/40 p-6 min-h-[480px] relative overflow-hidden shadow-2xl">
            {generating ? (
              <div className="flex flex-col items-center space-y-4 text-center p-8">
                <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-base font-bold text-foreground">Rendering AI Wallpaper...</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Generating custom artwork with {selectedStyle} styling in {aspectRatio} format.
                </p>
              </div>
            ) : generatedImage ? (
              <div className="w-full space-y-6 flex flex-col items-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center min-h-[360px] max-h-[500px]">
                  <img
                    src={generatedImage.image}
                    alt="AI Generated Wallpaper"
                    className="max-h-[500px] w-full object-contain"
                  />
                  <Badge variant="glow" className="absolute top-4 left-4 text-xs">
                    {generatedImage.resolution}
                  </Badge>
                  {generatedImage.source && (
                    <Badge variant="secondary" className="absolute top-4 right-4 text-xs">
                      {generatedImage.source}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full max-w-md">
                  <Button
                    variant="default"
                    size="md"
                    onClick={handleSaveToGrid}
                    className="flex-1 text-xs font-bold rounded-xl py-3"
                    icon={Plus}
                  >
                    Add to Collection Grid
                  </Button>
                  <a
                    href={generatedImage.image}
                    download={`ai-wallpaper-${Date.now()}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="secondary" size="md" title="Download Wallpaper" icon={Download} className="rounded-xl">
                      Download
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Wand2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">Ready to Create Artwork</p>
                <p className="text-xs max-w-sm text-muted-foreground">
                  Enter your prompt in the form on the left and hit generate to create a custom wallpaper.
                </p>
              </div>
            )}

            {error && (
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-destructive/95 text-white text-xs font-medium text-center shadow-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
