const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api/wallpapers', async (req, res) => {
  try {
    const { q, categories, purity, sorting, order, per_page } = req.query;
    
    const wallhavenUrl = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q || 'abstract')}&categories=${categories || '111'}&purity=${purity || '100'}&sorting=${sorting || 'date_added'}&order=${order || 'desc'}&per_page=${per_page || '24'}`;
    
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

// Check Local AI Endpoint Status (supports AUTOMATIC1111, MLX Server, OpenAI local format, Ollama)
app.get('/api/ai/status', async (req, res) => {
  const modelUrl = req.query.url || 'http://127.0.0.1:7860';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // 1. Probe AUTOMATIC1111 / Draw Things
    let response = await fetch(`${modelUrl}/sdapi/v1/options`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);

    if (response && response.ok) {
      clearTimeout(timeoutId);
      return res.json({ status: 'online', type: 'a1111', message: 'Stable Diffusion / Draw Things Server Active', url: modelUrl });
    }

    // 2. Probe MLX / OpenAI compatible local endpoint (/v1/models or root)
    const mlxController = new AbortController();
    const mlxTimeoutId = setTimeout(() => mlxController.abort(), 2000);
    
    response = await fetch(`${modelUrl}/v1/models`, {
      method: 'GET',
      signal: mlxController.signal,
    }).catch(() => null);

    if (!response) {
      response = await fetch(`${modelUrl}/`, {
        method: 'GET',
        signal: mlxController.signal,
      }).catch(() => null);
    }

    clearTimeout(timeoutId);
    clearTimeout(mlxTimeoutId);

    if (response && (response.ok || response.status === 404 || response.status === 405)) {
      return res.json({ status: 'online', type: 'mlx', message: 'MLX / Local Engine Active', url: modelUrl });
    }

    return res.json({ status: 'offline', message: `No active local AI server detected at ${modelUrl}`, url: modelUrl });
  } catch (err) {
    return res.json({ status: 'offline', message: err.message, url: modelUrl });
  }
});

// Local AI Image Generation Endpoint (multi-engine support: MLX FLUX.1-schnell, SD.Next, A1111, Draw Things)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const {
      prompt,
      style,
      lighting_mood,
      aspect_ratio = '16:9',
      model_url = 'http://127.0.0.1:7860',
      model = 'schnell'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let fullPrompt = prompt;
    if (style && style !== 'None') {
      fullPrompt += `, ${style} style`;
    }
    if (lighting_mood && lighting_mood !== 'Default') {
      fullPrompt += `, ${lighting_mood} lighting`;
    }
    fullPrompt += `, masterpiece, high quality, 8k resolution`;

    let width = 1024;
    let height = 576;
    let targetResolutionLabel = '2560x1440 (2K QHD)';

    if (aspect_ratio === '4k_uhd') {
      width = 1280;
      height = 720;
      targetResolutionLabel = '3840x2160 (4K UHD)';
    } else if (aspect_ratio === '2k_qhd') {
      width = 1024;
      height = 576;
      targetResolutionLabel = '2560x1440 (2K QHD)';
    } else if (aspect_ratio === 'fhd_1080p') {
      width = 1024;
      height = 576;
      targetResolutionLabel = '1920x1080 (Full HD)';
    } else if (aspect_ratio === 'macbook' || aspect_ratio === '16:10') {
      width = 1152;
      height = 720;
      targetResolutionLabel = '3024x1964 (MacBook Retina)';
    } else if (aspect_ratio === 'ultrawide' || aspect_ratio === '21:9') {
      width = 1280;
      height = 540;
      targetResolutionLabel = '3440x1440 (21:9 Ultrawide)';
    } else if (aspect_ratio === 'super_ultrawide' || aspect_ratio === '32:9') {
      width = 1344;
      height = 384;
      targetResolutionLabel = '5120x1440 (32:9 Super Ultrawide)';
    } else if (aspect_ratio === 'mobile_oled' || aspect_ratio === '9:16') {
      width = 576;
      height = 1024;
      targetResolutionLabel = '1290x2796 (Mobile OLED)';
    } else if (aspect_ratio === 'square' || aspect_ratio === '1:1') {
      width = 768;
      height = 768;
      targetResolutionLabel = '2048x2048 (Square HD)';
    }

    // 1. Try MLX / OpenAI Image Generations endpoint (/v1/images/generations)
    try {
      const mlxController = new AbortController();
      const mlxTimeoutId = setTimeout(() => mlxController.abort(), 120000);

      const mlxPayload = {
        prompt: fullPrompt,
        model: model || 'schnell',
        n: 1,
        size: `${width}x${height}`,
        response_format: 'b64_json'
      };

      const mlxRes = await fetch(`${model_url}/v1/images/generations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlxPayload),
        signal: mlxController.signal,
      }).catch(() => null);

      clearTimeout(mlxTimeoutId);

      if (mlxRes && mlxRes.ok) {
        const mlxData = await mlxRes.json();
        if (mlxData.data && mlxData.data.length > 0) {
          const imgItem = mlxData.data[0];
          const imageUri = imgItem.b64_json
            ? `data:image/png;base64,${imgItem.b64_json}`
            : imgItem.url;

          return res.json({
            success: true,
            image: imageUri,
            prompt: fullPrompt,
            resolution: targetResolutionLabel,
            source: `Local MLX (${model})`,
          });
        }
      }
    } catch (err) {
      console.log('MLX endpoint attempt:', err.message);
    }

    // 2. Try AUTOMATIC1111 / Draw Things / SD.Next API (/sdapi/v1/txt2img)
    const sdPayload = {
      prompt: fullPrompt,
      model: model || 'Stable Diffusion v1.5',
      negative_prompt: 'blurry, low quality, distorted, bad anatomy, watermark, text',
      steps: 20,
      width,
      height,
      cfg_scale: 7,
      sampler_name: 'Euler a',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const aiResponse = await fetch(`${model_url}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sdPayload),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (aiResponse && aiResponse.ok) {
        const aiData = await aiResponse.json();
        if (aiData.images && aiData.images.length > 0) {
          const imageBase64 = `data:image/png;base64,${aiData.images[0]}`;
          return res.json({
            success: true,
            image: imageBase64,
            prompt: fullPrompt,
            resolution: targetResolutionLabel,
            source: 'Local SD WebUI',
          });
        }
      }
    } catch (apiErr) {
      console.log('Local A1111 AI model server unreachable:', apiErr.message);
    }

    // 3. Fallback High-Res Generative Engine
    const encodedPrompt = encodeURIComponent(`${fullPrompt}, wallpaper, 8k resolution, highly detailed, masterpiece`);
    const seed = Math.floor(Math.random() * 9999999);
    const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    return res.json({
      success: true,
      image: fallbackImageUrl,
      prompt: fullPrompt,
      resolution: targetResolutionLabel,
      source: 'Online Engine (Local SD/MLX Offline)',
      isFallback: true,
    });
  } catch (err) {
    console.error('AI Generation Error:', err);
    res.status(500).json({ error: `Failed to generate image: ${err.message}` });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`WallSpace backend server running on http://localhost:${PORT}`);
});
