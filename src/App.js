import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WallpaperDetailPage from './pages/WallpaperDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wallpaper/:id" element={<WallpaperDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;