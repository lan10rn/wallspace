import { useParams, useNavigate } from 'react-router-dom';
import '../styles/WallpaperDetail.css';

function WallpaperDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const wallpaper = {
    id,
    short_url: `Sample Wallpaper ${id}`,
    path: 'https://via.placeholder.com/1200x675?text=Wallpaper+Preview',
    resolution: '1920x1080',
    ratio: '16:9',
    file_size: 2 * 1024 * 1024,
    date_added: Math.floor(Date.now() / 1000),
    views: 12345,
    favorites: 678,
    category_id: 100,
    purity: 'sfw',
    tags: [
      { id: 'sample-1', name: 'sample' },
      { id: 'sample-2', name: 'frontend-only' },
    ],
    thumbs: {
      small: 'https://via.placeholder.com/320x180?text=Small+Thumb',
      original: 'https://via.placeholder.com/640x360?text=Original+Thumb',
    },
    url: '#',
  };

  return (
    <div className="detail-page">
      <button onClick={() => navigate('/')} className="back-btn-header">
        ← Back
      </button>

      <div className="detail-container">
        <div className="detail-image-container">
          <img
            src={wallpaper.path}
            alt={wallpaper.short_url}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <h1>{wallpaper.short_url}</h1>

          <div className="detail-section">
            <h2>Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Resolution</label>
                <p>{wallpaper.resolution}</p>
              </div>
              <div className="detail-item">
                <label>Ratio</label>
                <p>{wallpaper.ratio}</p>
              </div>
              <div className="detail-item">
                <label>File Size</label>
                <p>{(wallpaper.file_size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="detail-item">
                <label>Uploaded</label>
                <p>{new Date(wallpaper.date_added * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Statistics</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Views</label>
                <p>👁️ {wallpaper.views.toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <label>Favorites</label>
                <p>❤️ {wallpaper.favorites.toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <label>Category</label>
                <p>{wallpaper.category_id === 100 ? 'General' : wallpaper.category_id === 10 ? 'Anime' : 'People'}</p>
              </div>
              <div className="detail-item">
                <label>Purity</label>
                <p>{wallpaper.purity === 'sfw' ? '✅ SFW' : '⚠️ NSFW'}</p>
              </div>
            </div>
          </div>

          {wallpaper.tags && wallpaper.tags.length > 0 && (
            <div className="detail-section">
              <h2>Tags</h2>
              <div className="tags-container">
                {wallpaper.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h2>Thumbnails</h2>
            <div className="thumbnails-container">
              {wallpaper.thumbs && (
                <>
                  <div className="thumb-item">
                    <img src={wallpaper.thumbs.small} alt="Small thumbnail" />
                    <p>Small</p>
                  </div>
                  <div className="thumb-item">
                    <img src={wallpaper.thumbs.original} alt="Original thumbnail" />
                    <p>Original</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="detail-actions">
            <a
              href={wallpaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn primary-btn"
            >
              View on Wallhaven
            </a>
            <a
              href={wallpaper.path}
              download
              className="action-btn download-btn"
            >
              Download Full Resolution
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WallpaperDetailPage;
