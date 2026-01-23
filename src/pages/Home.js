import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingMovies, getPopularMovies, getLatestMovies, getPopularSeries } from "../api";
import "./Home.css";

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestSeries, setLatestSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const trendingMovies = await getTrendingMovies();
      setTrending(trendingMovies.slice(0, 10)); // أول 10 trending
      setFeaturedMovie(trendingMovies[0]); // أول فيلم كـ Featured

      const latest = await getLatestMovies();
      setLatestMovies(latest.slice(0, 8));

      const series = await getPopularSeries();
      setLatestSeries(series.slice(0, 8));
    };

    fetchData();
  }, []);

  if (!featuredMovie) return <p style={{color:"white"}}>Loading...</p>;

  return (
    <div className="home">
      {/* Featured */}
      <div className="featured" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`}}>
        <div className="overlay">
          <h1>{featuredMovie.title}</h1>
          <p>{featuredMovie.overview}</p>
          <Link to={`/movie/${featuredMovie.id}`} className="watch-btn">▶ Watch Now</Link>
        </div>
      </div>

      {/* Trending */}
      <section>
        <h2>🔥 Trending Now</h2>
        <div className="movie-grid">
          {trending.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
              <h3>{movie.title}</h3>
              <p>⭐ {movie.vote_average}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Movies */}
      <section>
        <h2>🎬 Latest Movies</h2>
        <div className="movie-grid">
          {latestMovies.map(movie => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
              <h3>{movie.title}</h3>
              <p>⭐ {movie.vote_average}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest TV Series */}
      <section>
        <h2>📺 Latest TV Series</h2>
        <div className="movie-grid">
          {latestSeries.map(series => (
            <Link to={`/movie/${series.id}`} key={series.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${series.poster_path}`} alt={series.name}/>
              <h3>{series.name}</h3>
              <p>⭐ {series.vote_average}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
