import '../styles/SearchForm.css';

function SearchForm({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  purity,
  setPurity,
  sorting,
  setSorting,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Search wallpapers (e.g., landscape, abstract, nature)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="111">All Categories</option>
            <option value="100">General</option>
            <option value="010">Anime</option>
            <option value="001">People</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Content:</label>
          <select value={purity} onChange={(e) => setPurity(e.target.value)}>
            <option value="100">SFW Only</option>
            <option value="110">SFW + Sketchy</option>
            <option value="111">All (including NSFW)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
            <option value="date_added">Newest</option>
            <option value="relevance">Relevance</option>
            <option value="random">Random</option>
            <option value="views">Most Viewed</option>
            <option value="favorites">Most Favorited</option>
          </select>
        </div>
      </div>

      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? 'Searching...' : 'Search Wallpapers'}
      </button>
    </form>
  );
}

export default SearchForm;
