import { useState } from 'react';
import '../styles/HomePage.css';
import SearchForm from '../components/SearchForm';
import WallpaperGrid from '../components/WallpaperGrid';

function HomePage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('111');
  const [purity, setPurity] = useState('100');
  const [sorting, setSorting] = useState('date_added');

  const fetchWallpapers = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWallpapers([]);
    console.log("Getting Called >> ");
    try {
      const query = searchQuery.trim() || 'abstract';
      const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=${category}&purity=${purity}&sorting=${sorting}&order=desc&per_page=24`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.data && data.data.length > 0) {
        setWallpapers(data.data);
      } else {
        setError('No wallpapers found. Try a different search query.');
      }
    } catch (err) {
      setError(`Failed to fetch wallpapers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>🎨 WallSpace</h1>
        <p>Discover beautiful wallpapers from Wallhaven</p>
      </header>

      <div className="search-container">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          category={category}
          setCategory={setCategory}
          purity={purity}
          setPurity={setPurity}
          sorting={sorting}
          setSorting={setSorting}
          onSubmit={fetchWallpapers}
          loading={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <WallpaperGrid
        wallpapers={wallpapers}
        loading={loading}
        wallpapersFound={wallpapers.length > 0}
      />
    </div>
  );
}

export default HomePage;
