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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setWallpapers([]);
    setLoading(false);
    setError('Search API is currently disabled in frontend-only mode.');
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
          onSubmit={handleSearchSubmit}
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
