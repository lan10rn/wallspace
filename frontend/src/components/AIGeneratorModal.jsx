import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Wand2, X, Download, Plus, Server, CheckCircle2, AlertCircle, RefreshCw, Cpu } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function AIGeneratorModal({ isOpen, onClose, onSaveToGrid }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedModel, setSelectedModel] = useState('schnell');
  const [modelUrl, setModelUrl] = useState('http://127.0.0.1:8000');
  const [modelStatus, setModelStatus] = useState('checking');
  const [statusMessage, setStatusMessage] = useState('');
  const [showConfig, setShowConfig] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');

  const stylePresets = [
    { name: 'Cyberpunk', icon: '⚡' },
    { name: 'Minimalist', icon: '🎨' },
    { name: 'Photorealistic', icon: '📷' },
    { name: 'Anime', icon: '🌸' },
    { name: 'Fantasy', icon: '🐉' },
    { name: '3D Render', icon: '💎' },
    { name: 'Surrealism', icon: '🌌' },
  ];

  const modelPresets = [
    { id: 'schnell', name: 'FLUX.1 schnell (MLX Apple Silicon)', defaultPort: '8000' },
    { id: 'sdxl-turbo', name: 'SDXL Turbo', defaultPort: '7860' },
    { id: 'sd15', name: 'Stable Diffusion v1.5 / Draw Things', defaultPort: '7860' },
  ];

  const aspectRatios = [
    { label: '16:9 (Desktop)', value: '16:9' },
    { label: '9:16 (Mobile)', value: '9:16' },
    { label: '1:1 (Square)', value: '1:1' },
    { label: '21:9 (Ultrawide)', value: '21:9' },
  ];

  // Check local AI server status
  const checkStatus = useCallback(async (targetUrl = modelUrl) => {
    setModelStatus('checking');
    setStatusMessage('Probing local engine...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/status?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      if (data.status === 'online') {
        setModelStatus('online');
        setStatusMessage(data.message || 'Local AI Engine Active');
      } else {
        setModelStatus('offline');
        setStatusMessage(data.message || 'No active local server');
      }
    } catch {
      setModelStatus('offline');
      setStatusMessage('Backend unreachable');
    }
  }, [modelUrl]);

  useEffect(() => {
    if (isOpen) {
      checkStatus(modelUrl);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, modelUrl, checkStatus]);

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    const preset = modelPresets.find(m => m.id === modelId);
    if (preset && modelUrl.includes('7860') && preset.defaultPort !== '7860') {
      const updatedUrl = `http://127.0.0.1:${preset.defaultPort}`;
      setModelUrl(updatedUrl);
      checkStatus(updatedUrl);
    }
  };

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
          model: selectedModel,
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
    if (!generatedImage || !onSaveToGrid) return;
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
    onSaveToGrid(newWallpaper);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-surface-container/95 border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-surface-containerHigh/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">AI Wallpaper Studio</h2>
                <Badge variant="glow" className="text-[10px]">
                  <Cpu className="w-2.5 h-2.5 mr-1" /> Apple MLX / Local AI
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Generate custom wallpapers with MLX (FLUX.1 schnell), Draw Things, or SD.Next
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-full hover:bg-surface-containerHighest text-muted-foreground hover:text-foreground transition-colors"
              title="Local Model Settings"
            >
              <Server className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-containerHighest text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Local Server Config Bar (collapsible) */}
        {showConfig && (
          <div className="p-4 bg-surface-containerHighest/80 border-b border-border/40 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Model selection dropdown */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="font-semibold text-foreground shrink-0">Model Architecture:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="bg-surface-container px-3 py-1.5 rounded-lg border border-border/40 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {modelPresets.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Host & Port input */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="font-semibold text-foreground shrink-0">Local URL (Port):</span>
                <input
                  type="text"
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  className="bg-surface-container px-3 py-1.5 rounded-lg border border-border/40 text-foreground w-48 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="http://127.0.0.1:8000"
                />
                <Button variant="ghost" size="sm" onClick={() => checkStatus(modelUrl)} icon={RefreshCw}>
                  Ping
                </Button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 pt-1 border-t border-border/20 text-[11px]">
              <span className="text-muted-foreground">Status:</span>
              {modelStatus === 'online' ? (
                <Badge variant="success" icon={CheckCircle2}>
                  {statusMessage}
                </Badge>
              ) : (
                <Badge variant="secondary" icon={AlertCircle}>
                  {statusMessage} (Online Engine Standby)
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Form controls */}
            <div className="space-y-5">
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Prompt / Image Idea
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your wallpaper idea (e.g. Glowing neon cyberpunk city in rain, neon reflection, 4k ultra detailed)..."
                  className="w-full rounded-2xl bg-surface-containerHigh/80 p-3.5 text-sm text-foreground border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Style Preset
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {stylePresets.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedStyle(s.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
                <div className="grid grid-cols-2 gap-2">
                  {aspectRatios.map((ar) => (
                    <button
                      key={ar.value}
                      type="button"
                      onClick={() => setAspectRatio(ar.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-center border ${
                        aspectRatio === ar.value
                          ? 'bg-primary/20 border-primary text-primary font-bold'
                          : 'bg-surface-containerHigh border-border/40 text-muted-foreground hover:bg-surface-containerHighest'
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                variant="default"
                className="w-full py-3 h-12 text-base font-bold rounded-2xl shadow-xl shadow-primary/20"
                icon={Sparkles}
              >
                {generating ? 'Rendering AI Image...' : 'Generate Wallpaper'}
              </Button>
            </div>

            {/* Right Display Area */}
            <div className="flex flex-col justify-center items-center rounded-3xl bg-black/40 border border-border/40 p-4 min-h-[320px] relative overflow-hidden">
              {generating ? (
                <div className="flex flex-col items-center space-y-3 text-center p-6">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-foreground">Rendering Local AI Wallpaper...</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Running {selectedModel} model on {aspectRatio} canvas.
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-4 flex flex-col items-center">
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center max-h-[300px]">
                    <img
                      src={generatedImage.image}
                      alt="AI Generated"
                      className="max-h-[300px] w-full object-contain"
                    />
                    <Badge variant="glow" className="absolute top-3 left-3 text-[10px]">
                      {generatedImage.resolution}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 w-full">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveToGrid}
                      className="flex-1 text-xs"
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
                      <Button variant="secondary" size="iconSm" title="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-muted-foreground">
                  <Wand2 className="w-10 h-10 text-primary/40 mb-1" />
                  <p className="text-sm font-semibold text-foreground">Ready to Create</p>
                  <p className="text-xs max-w-xs">
                    Enter a prompt above and click generate to render a custom wallpaper.
                  </p>
                </div>
              )}

              {error && (
                <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-destructive/90 text-white text-xs font-medium text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
