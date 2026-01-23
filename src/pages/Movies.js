import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestMovies } from "../api";
import "./Home.css";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);         // صفحة البداية
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // هل مازال كاين المزيد من الأفلام

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const data = await getLatestMovies(page); // لازم تعدل getLatestMovies باش تاخد page
      if (data.length === 0) setHasMore(false);
      setMovies(prev => [...prev, ...data]);
      setLoading(false);
    };

    fetchMovies();
  }, [page]);

  return (
    <div className="home">
      <section className="content-section">
        <div className="section-header">
          <h2><span className="section-icon">🎬</span> أحدث الأفلام</h2>
        </div>

        <div className="movie-grid">
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-poster.jpg"}
                alt={movie.title}
                loading="lazy"
              />
              <div className="movie-card-info">
                <h3>{movie.title}</h3>
                <p className="rating">
                  {movie.vote_average !== undefined && movie.vote_average !== null ? `⭐ ${movie.vote_average.toFixed(1)}` : "N/A"}
                </p>
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
