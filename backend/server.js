const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Wallhaven Search Route
app.get('/api/wallpapers', async (req, res) => {
  try {
    const { q, categories, purity, sorting, order, per_page } = req.query;
    
    // Build Wallhaven API URL
    const wallhavenUrl = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q || 'abstract')}&categories=${categories || '111'}&purity=${purity || '100'}&sorting=${sorting || 'date_added'}&order=${order || 'desc'}&per_page=${per_page || '24'}`;
    
    // Fetch from Wallhaven API
    const response = await fetch(wallhavenUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `Wallhaven API Error: ${response.status}` });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from Wallhaven API:', err);
    res.status(500).json({ error: `Failed to fetch wallpapers: ${err.message}` });
  }
});

// Check Local AI Endpoint Status
app.get('/api/ai/status', async (req, res) => {
  const modelUrl = req.query.url || 'http://127.0.0.1:7860';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${modelUrl}/sdapi/v1/options`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      return res.json({ status: 'online', type: 'a1111', url: modelUrl });
    }

    return res.json({ status: 'offline', message: `No active local AI server detected at ${modelUrl}`, url: modelUrl });
  } catch (err) {
    return res.json({ status: 'offline', message: err.message, url: modelUrl });
  }
});

// Local AI Image Generation Endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, style, aspect_ratio = '16:9', model_url = 'http://127.0.0.1:7860' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Combine prompt with selected style preset
    let fullPrompt = prompt;
    if (style && style !== 'None') {
      fullPrompt = `${prompt}, ${style} style, masterpiece, high quality, 8k resolution`;
    }

    // Calculate dimensions based on aspect ratio
    let width = 1024;
    let height = 576; // 16:9
    if (aspect_ratio === '9:16') {
      width = 576;
      height = 1024;
    } else if (aspect_ratio === '1:1') {
      width = 768;
      height = 768;
    } else if (aspect_ratio === '21:9') {
      width = 1152;
      height = 492;
    }

    // Attempt AUTOMATIC1111 / SD.Next API
    const sdPayload = {
      prompt: fullPrompt,
      negative_prompt: 'blurry, low quality, distorted, bad anatomy, watermark, text',
      steps: 20,
      width,
      height,
      cfg_scale: 7,
      sampler_name: 'Euler a',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout for AI generation

      const aiResponse = await fetch(`${model_url}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sdPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        if (aiData.images && aiData.images.length > 0) {
          const imageBase64 = `data:image/png;base64,${aiData.images[0]}`;
          return res.json({
            success: true,
            image: imageBase64,
            prompt: fullPrompt,
            resolution: `${width}x${height}`,
            source: 'Local SD WebUI',
          });
        }
      }
    } catch (apiErr) {
      console.log('Local AI model server unreachable, serving high-res generative canvas placeholder:', apiErr.message);
    }

    // Fallback high-res generative canvas URL (Pollinations high-res engine)
    const encodedPrompt = encodeURIComponent(`${fullPrompt}, wallpaper, 8k, photorealistic`);
    const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${Math.floor(Math.random() * 999999)}&nologo=true`;

    return res.json({
      success: true,
      image: fallbackImageUrl,
      prompt: fullPrompt,
      resolution: `${width}x${height}`,
      source: 'Online Engine (Local Server Offline)',
      isFallback: true,
    });
  } catch (err) {
    console.error('AI Generation Error:', err);
    res.status(500).json({ error: `Failed to generate image: ${err.message}` });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`WallSpace backend server running on http://localhost:${PORT}`);
});
