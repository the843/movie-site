import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularSeries } from "../api";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      const newSeries = await getPopularSeries(page);
      if (newSeries.length === 0) setHasMore(false);
      setSeries(prev => [...prev, ...newSeries]);
      setLoading(false);
    };

    fetchSeries();
  }, [page]);

  return (
    <div className="page-container">
      <h1>أحدث المسلسلات</h1>
      <div className="movie-grid">
        {series.map((s) => (
          <Link to={`/series/${s.id}`} key={s.id} className="movie-card">
            <img
              src={s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : "/placeholder-poster.jpg"}
              alt={s.name}
              loading="lazy"
            />
            <div className="movie-card-info">
              <h3>{s.name}</h3>
              <p className="rating">{s.vote_average ? `⭐ ${s.vote_average.toFixed(1)}` : "N/A"}</p>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          className="load-more-btn"
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
        >
          {loading ? "جار التحميل..." : "المزيد"}
        </button>
      )}
    </div>
  );
}
