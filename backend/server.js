const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`WallSpace backend server running on http://localhost:${PORT}`);
});
