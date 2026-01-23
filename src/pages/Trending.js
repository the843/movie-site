import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingMovies } from "../api";
import "./Home.css";

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);       // صفحة البداية
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const data = await getTrendingMovies(page); // لازم تعدل getTrendingMovies باش تاخد page
      if (data.length === 0) setHasMore(false);
      setTrending(prev => [...prev, ...data]);
      setLoading(false);
    };

    fetchTrending();
  }, [page]);

  return (
    <div className="home">
      <section className="content-section">
        <div className="section-header">
          <h2><span className="section-icon">🔥</span> الأكثر مشاهدة الآن</h2>
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

        {/* زر المزيد */}
        {hasMore && (
          <button
            className="load-more-btn"
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
          >
            {loading ? "جار التحميل..." : "المزيد"}
          </button>
        )}
      </section>
    </div>
  );
}
