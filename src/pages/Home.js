import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  getTrendingMovies, 
  getLatestMovies, 
  getPopularSeries, 
  searchMoviesAndSeries,
  getSearchSuggestions 
} from "../api";
import "./Home.css";

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestSeries, setLatestSeries] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const trendingMovies = await getTrendingMovies();
      setTrending(trendingMovies.slice(0, 10));
      setFeaturedMovie(trendingMovies[0] || null);

      const latest = await getLatestMovies();
      setLatestMovies(latest.slice(0, 8));

      const series = await getPopularSeries();
      setLatestSeries(series.slice(0, 8));
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(() => {
      if (searchQuery) fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    const results = await searchMoviesAndSeries(query);
    setSearchResults(results);
    setShowResults(true);
    setShowSuggestions(false);
    setIsSearching(false);
    
    localStorage.setItem("lastSearch", query);
  };

  const handleSelectSuggestion = (suggestion) => {
    const title = suggestion.title || suggestion.name || "";
    setSearchQuery(title);
    handleSearch(title);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setShowSuggestions(false);
    setSearchResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const getMediaIcon = (mediaType) => mediaType === "tv" ? "📺" : "🎬";

  if (!featuredMovie) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      {/* Search Bar */}
      <div className="search-container" ref={searchRef}>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="ابحث عن أفلام، مسلسلات، ممثلين..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
              className="search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={handleClearSearch} aria-label="Clear search">×</button>
            )}
            <button 
              className="search-btn"
              onClick={() => handleSearch()}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? <span className="spinner"></span> : <span className="search-icon">🔍</span>}
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown" ref={suggestionsRef}>
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <div className="suggestion-media-type">{getMediaIcon(item.media_type)}</div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{item.title || item.name}</div>
                    <div className="suggestion-meta">
                      <span className="suggestion-year">
                        {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "N/A"}
                      </span>
                      <span className="suggestion-type">{item.media_type === "tv" ? "مسلسل" : "فيلم"}</span>
                      {item.vote_average !== undefined && item.vote_average !== null && (
                        <span className="suggestion-rating">⭐ {item.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="suggestion-footer">
                اضغط <kbd>Enter</kbd> للبحث عن "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <section className="search-results-section">
          <div className="section-header">
            <h2>
              <span className="search-icon">🔍</span>
              نتائج البحث "{searchQuery}"
              <span className="results-count">({searchResults.length})</span>
            </h2>
            <button className="close-results" onClick={() => setShowResults(false)}>إغلاق النتائج</button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="movie-grid">
              {searchResults.map((item) => (
                <Link
                  to={`/${item.media_type === "tv" ? "series" : "movie"}/${item.id}`}
                  key={item.id}
                  className="movie-card"
                  onClick={() => setShowResults(false)}
                >
                  <div className="movie-card-image">
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/placeholder-poster.jpg"}
                      alt={item.title || item.name}
                      loading="lazy"
                    />
                    <div className="media-type-badge">
                      {item.media_type === "tv" ? "📺 مسلسل" : "🎬 فيلم"}
                    </div>
                  </div>
                  <div className="movie-card-info">
                    <h3>{item.title || item.name}</h3>
                    <div className="movie-card-meta">
                      {item.vote_average !== undefined && item.vote_average !== null ? (
                        <span className="rating">⭐ {item.vote_average.toFixed(1)}</span>
                      ) : <span className="rating">N/A</span>}
                      <span className="year">
                        {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "N/A"}
                      </span>
                    </div>
                    {item.overview && (
                      <p className="movie-card-overview">{item.overview.substring(0, 80)}...</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>لا توجد نتائج لـ "{searchQuery}"</h3>
              <p>حاول استخدام كلمات مفتاحية مختلفة أو تحقق من الإملاء</p>
              <button className="back-to-browse" onClick={() => setShowResults(false)}>↻ العودة للتصفح</button>
            </div>
          )}
        </section>
      )}

      {/* Featured */}
      {!showResults && (
        <>
          <div
            className="featured"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="overlay">
              <div className="featured-badge">🔥 الأكثر مشاهدة اليوم</div>
              <h1>{featuredMovie.title}</h1>
              <p className="featured-overview">{featuredMovie.overview}</p>
              <div className="featured-meta">
                {featuredMovie.vote_average !== undefined && featuredMovie.vote_average !== null ? (
                  <span className="rating">⭐ {featuredMovie.vote_average.toFixed(1)}</span>
                ) : <span className="rating">N/A</span>}
                <span className="year">{featuredMovie.release_date?.substring(0, 4) || "N/A"}</span>
                <span className="language">{featuredMovie.original_language?.toUpperCase() || "N/A"}</span>
              </div>
              <Link to={`/movie/${featuredMovie.id}`} className="watch-btn">
                <span className="play-icon">▶</span> مشاهدة الآن
              </Link>
            </div>
          </div>

          {/* Trending */}
          <section className="content-section">
            <div className="section-header">
              <h2><span className="section-icon">🔥</span> الأكثر مشاهدة الآن</h2>
              <Link to="/trending" className="view-all">عرض الكل →</Link>
            </div>
            <div className="movie-grid">
              {trending.map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                  <div className="movie-card-image">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-poster.jpg"}
                      alt={movie.title}
                      loading="lazy"
                    />
                    <div className="trending-badge">🔥</div>
                  </div>
                  <div className="movie-card-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-card-meta">
                      {movie.vote_average !== undefined && movie.vote_average !== null ? (
                        <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                      ) : <span className="rating">N/A</span>}
                      <span className="year">{movie.release_date?.substring(0, 4) || "N/A"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest Movies */}
          <section className="content-section">
            <div className="section-header">
              <h2><span className="section-icon">🎬</span> أحدث الأفلام</h2>
              <Link to="/movies" className="view-all">عرض الكل →</Link>
            </div>
            <div className="movie-grid">
              {latestMovies.map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-poster.jpg"}
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="movie-card-info">
                    <h3>{movie.title}</h3>
                    <p className="rating">{movie.vote_average !== undefined && movie.vote_average !== null ? `⭐ ${movie.vote_average.toFixed(1)}` : "N/A"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest TV Series */}
          <section className="content-section">
            <div className="section-header">
              <h2><span className="section-icon">📺</span> أحدث المسلسلات</h2>
              <Link to="/series" className="view-all">عرض الكل →</Link>
            </div>
            <div className="movie-grid">
              {latestSeries.map((series) => (
                <Link to={`/series/${series.id}`} key={series.id} className="movie-card">
                  <img
                    src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : "/placeholder-poster.jpg"}
                    alt={series.name}
                    loading="lazy"
                  />
                  <div className="movie-card-info">
                    <h3>{series.name}</h3>
                    <p className="rating">{series.vote_average !== undefined && series.vote_average !== null ? `⭐ ${series.vote_average.toFixed(1)}` : "N/A"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
