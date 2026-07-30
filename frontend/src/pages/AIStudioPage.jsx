import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Sparkles, Wand2, ArrowLeft, Download, Plus, Server, 
  CheckCircle2, AlertCircle, RefreshCw, Smartphone, 
  Laptop, Monitor, Image as ImageIcon, Sun, Moon, CloudFog, Flame
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AIStudioPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [lightingMood, setLightingMood] = useState('Default');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [deviceMockup, setDeviceMockup] = useState('raw'); // 'raw', 'iphone', 'macbook', 'desktop'
  const [modelUrl, setModelUrl] = useState('http://127.0.0.1:7860');
  const [modelStatus, setModelStatus] = useState('checking');
  const [showConfig, setShowConfig] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
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

  const lightingPresets = [
    { name: 'Default', label: 'Balanced', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { name: 'Golden Hour', label: 'Sunset Glow', icon: <Sun className="w-3.5 h-3.5 text-orange-400" /> },
    { name: 'Cyber Sunset', label: 'Neon Twilight', icon: <Flame className="w-3.5 h-3.5 text-pink-400" /> },
    { name: 'Midnight Neon', label: 'OLED Dark', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
    { name: 'Moody Fog', label: 'Atmospheric', icon: <CloudFog className="w-3.5 h-3.5 text-slate-300" /> },
  ];

  const resolutionPresets = [
    { value: '4k_uhd', label: '4K Ultra HD', res: '3840×2160', ratio: '16:9', mockup: 'desktop' },
    { value: '2k_qhd', label: '2K Quad HD', res: '2560×1440', ratio: '16:9', mockup: 'desktop' },
    { value: 'fhd_1080p', label: 'Full HD 1080p', res: '1920×1080', ratio: '16:9', mockup: 'desktop' },
    { value: 'macbook', label: 'MacBook Retina', res: '3024×1964', ratio: '16:10', mockup: 'macbook' },
    { value: 'ultrawide', label: 'Ultrawide 1440p', res: '3440×1440', ratio: '21:9', mockup: 'desktop' },
    { value: 'super_ultrawide', label: 'Super Ultrawide', res: '5120×1440', ratio: '32:9', mockup: 'desktop' },
    { value: 'mobile_oled', label: 'Mobile OLED', res: '1290×2796', ratio: '9:16', mockup: 'iphone' },
    { value: 'square', label: 'Square HD', res: '2048×2048', ratio: '1:1', mockup: 'raw' },
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
    setImageLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          lighting_mood: lightingMood,
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
        setImageLoading(true);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(err.message || 'Error generating image');
      setImageLoading(false);
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
              Generate wallpapers with custom lighting moods & preview live inside interactive iPhone, MacBook, or Desktop device frames.
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
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your wallpaper idea (e.g. Cyberpunk samurai overlooking futuristic Tokyo city at night, neon lights)..."
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
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

            {/* Dynamic Lighting Mood Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Dynamic Lighting Mood
                </label>
                <span className="text-[10px] text-primary font-semibold">AI Prompt Lighting</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {lightingPresets.map((lp) => (
                  <button
                    key={lp.name}
                    type="button"
                    onClick={() => setLightingMood(lp.name)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      lightingMood === lp.name
                        ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface-containerHigh border-border/40 text-muted-foreground hover:bg-surface-containerHighest'
                    }`}
                  >
                    {lp.icon}
                    <div className="text-left">
                      <div className="leading-none">{lp.name}</div>
                      <span className="text-[9px] text-muted-foreground font-normal">{lp.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Resolution & Aspect Ratio Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Target Resolution & Format
                </label>
                <span className="text-[10px] text-primary font-semibold">Mainstream Displays</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {resolutionPresets.map((rp) => (
                  <button
                    key={rp.value}
                    type="button"
                    onClick={() => {
                      setAspectRatio(rp.value);
                      if (rp.mockup) setDeviceMockup(rp.mockup);
                    }}
                    className={`flex flex-col items-start px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
                      aspectRatio === rp.value
                        ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface-containerHigh border-border/40 text-muted-foreground hover:bg-surface-containerHighest'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="leading-none">{rp.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{rp.ratio}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground font-normal pt-1">{rp.res}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <Button
              onClick={handleGenerate}
              disabled={generating || imageLoading || !prompt.trim()}
              variant="default"
              className="w-full py-3.5 h-12 text-base font-bold rounded-2xl shadow-xl shadow-primary/25"
              icon={Sparkles}
            >
              {(generating || imageLoading) ? 'Generating Wallpaper...' : 'Generate Wallpaper'}
            </Button>
          </div>

          {/* Canvas & Mockup Viewport (Right Column) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Device Mockup Toggle Header Tabs */}
            <div className="flex items-center justify-between bg-surface-container/60 border border-border/40 rounded-2xl p-2 text-xs">
              <span className="font-bold text-muted-foreground px-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-primary" /> Preview Mode:
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setDeviceMockup('raw')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    deviceMockup === 'raw'
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-containerHigh'
                  }`}
                >
                  Raw Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMockup('iphone')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    deviceMockup === 'iphone'
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-containerHigh'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> iPhone 16
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMockup('macbook')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    deviceMockup === 'macbook'
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-containerHigh'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> MacBook
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMockup('desktop')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    deviceMockup === 'desktop'
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-containerHigh'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
              </div>
            </div>

            {/* Display Viewport Box */}
            <div className="flex flex-col justify-center items-center rounded-3xl bg-black/50 border border-border/40 p-6 min-h-[480px] relative overflow-hidden shadow-2xl">
              {(generating || imageLoading) ? (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 animate-fade-in z-20">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <Wand2 className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-foreground">Rendering AI Wallpaper...</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      {generating
                        ? `Generating artwork in ${selectedStyle} style with ${lightingMood} lighting...`
                        : 'Transferring high-resolution wallpaper pixels...'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>Processing {aspectRatio} Resolution</span>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-6 flex flex-col items-center">
                  {/* --- DEVICE FRAME MOCKUPS --- */}

                  {/* Mode 1: RAW Canvas */}
                  {deviceMockup === 'raw' && (
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center min-h-[360px] max-h-[500px]">
                      <img
                        src={generatedImage.image}
                        alt="AI Generated Wallpaper"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
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
                  )}

                  {/* Mode 2: iPhone 16 Pro Mockup */}
                  {deviceMockup === 'iphone' && (
                    <div className="relative w-[270px] h-[520px] bg-slate-950 border-[6px] border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col select-none ring-1 ring-white/10">
                      {/* Wallpaper Background */}
                      <img
                        src={generatedImage.image}
                        alt="iPhone Mockup"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Dynamic Island */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-end px-2.5 space-x-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                      </div>
                      {/* Lockscreen Time & Date */}
                      <div className="relative z-10 pt-16 flex flex-col items-center text-white drop-shadow-md">
                        <span className="text-[11px] font-semibold tracking-wide uppercase opacity-90">Sunday, July 26</span>
                        <span className="text-5xl font-black tracking-tight leading-none">09:41</span>
                      </div>
                      {/* Lockscreen Widgets / Home Bar */}
                      <div className="mt-auto relative z-10 pb-4 px-6 flex items-center justify-between text-white/90">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold">
                          🔦
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-bold">
                          📷
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20" />
                    </div>
                  )}

                  {/* Mode 3: MacBook Pro Mockup */}
                  {deviceMockup === 'macbook' && (
                    <div className="w-full max-w-[560px] flex flex-col items-center select-none">
                      <div className="relative w-full aspect-[16/10] bg-slate-900 border-[7px] border-slate-800 rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
                        <img
                          src={generatedImage.image}
                          alt="MacBook Mockup"
                          onLoad={() => setImageLoading(false)}
                          onError={() => setImageLoading(false)}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* macOS Menu Bar */}
                        <div className="relative z-10 w-full h-5 bg-black/40 backdrop-blur-md text-[10px] text-white/90 px-3 flex items-center justify-between border-b border-white/10">
                          <div className="flex items-center space-x-3 font-semibold">
                            <span></span>
                            <span className="font-bold">Finder</span>
                            <span className="hidden sm:inline">File</span>
                            <span className="hidden sm:inline">Edit</span>
                            <span className="hidden sm:inline">View</span>
                          </div>
                          <div className="flex items-center space-x-2 font-medium text-[9px]">
                            <span>100% ⚡</span>
                            <span>Jul 26 9:41 AM</span>
                          </div>
                        </div>
                        {/* macOS Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-md z-20" />
                        {/* macOS Floating Dock */}
                        <div className="mt-auto relative z-10 mb-2 self-center px-3 py-1.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center space-x-2 shadow-xl">
                          {['📁', '🌐', '💬', '🖼️', '🎵', '⚙️'].map((icon, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center text-xs hover:scale-125 transition-transform">
                              {icon}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Laptop Base Hinge */}
                      <div className="w-[108%] h-2.5 bg-slate-700 rounded-b-xl border-t border-slate-600 shadow-md flex justify-center">
                        <div className="w-16 h-1 bg-slate-800 rounded-b-sm" />
                      </div>
                    </div>
                  )}

                  {/* Mode 4: Desktop Setup Mockup */}
                  {deviceMockup === 'desktop' && (
                    <div className="w-full max-w-[560px] flex flex-col items-center select-none relative">
                      <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl pointer-events-none" />
                      <div className="relative z-10 w-full aspect-[16/9] bg-zinc-950 border-[6px] border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                        <img
                          src={generatedImage.image}
                          alt="Desktop Mockup"
                          onLoad={() => setImageLoading(false)}
                          onError={() => setImageLoading(false)}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Monitor Power LED */}
                        <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 z-20 shadow-sm shadow-emerald-400" />
                      </div>
                      {/* Monitor Stand */}
                      <div className="w-16 h-5 bg-zinc-800 border-x border-zinc-700 z-10" />
                      <div className="w-32 h-2 bg-zinc-700 rounded-t-md shadow-lg border-t border-zinc-600 z-10" />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center space-x-3 w-full max-w-md pt-2">
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
                    Enter your prompt, pick a lighting mood, and preview live on iPhone, MacBook, or Desktop device frames.
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
        </div>
      </main>
    </div>
  );
}
