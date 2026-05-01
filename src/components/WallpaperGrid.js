import WallpaperCard from './WallpaperCard';
import '../styles/WallpaperGrid.css';

function WallpaperGrid({ wallpapers, loading, wallpapersFound }) {
  return (
    <div className="wallpapers-container">
      {wallpapersFound && (
        <div className="wallpapers-grid">
          {wallpapers.map((wallpaper) => (
            <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
          ))}
        </div>
      )}

      {!loading && !wallpapersFound && (
        <div className="empty-state">
          <p>👈 Use the search form above to find wallpapers</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>⏳ Loading wallpapers...</p>
        </div>
      )}
    </div>
  );
}

export default WallpaperGrid;
