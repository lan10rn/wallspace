import { Link } from 'react-router-dom';
import '../styles/WallpaperCard.css';

function WallpaperCard({ wallpaper }) {
  return (
    <div className="wallpaper-card">
      <Link to={`/wallpaper/${wallpaper.id}`}>
        <img
          src={wallpaper.thumbs.small}
          alt={wallpaper.short_url}
          className="wallpaper-thumb"
        />
      </Link>
      <div className="wallpaper-info">
        <p className="resolution">{wallpaper.resolution}</p>
        <div className="wallpaper-stats">
          <span>❤️ {wallpaper.favorites}</span>
          <span>👁️ {wallpaper.views}</span>
        </div>
        <Link
          to={`/wallpaper/${wallpaper.id}`}
          className="view-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default WallpaperCard;
