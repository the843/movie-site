import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer"; // تأكد من المسار الصحيح
import "./MovieDetails.css"; // ستايل الصفحة

const API_KEY = "4228896b45212df64cecd5a44dd5541d";
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [server, setServer] = useState("vidlink"); // السيرفر الافتراضي
  const [movieIdForPlayer, setMovieIdForPlayer] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: "en-US" }
      })
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Placeholder: generate movieId for iframe player
  useEffect(() => {
    if (movie) {
      setMovieIdForPlayer(movie.id); // هنا كتبغينا أي حاجة باش نرسل للفيديو
    }
  }, [movie]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details-container">
      {/* Back button */}
      <div className="back-link">
        <Link to="/">⬅ Back</Link>
      </div>

      <div className="movie-details">
        {/* Poster */}
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>

        {/* Info */}
        <div className="info">
          <h1>{movie.title}</h1>
          <p className="rating">⭐ {movie.vote_average}</p>
          <p className="release">Release: {movie.release_date}</p>
          <p className="overview">{movie.overview}</p>

          {/* Extra details */}
          <div className="extra-details">
            <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
            <p><strong>Country:</strong> {movie.production_countries.map(c => c.name).join(", ") || "N/A"}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <p className="views">16058 Views</p> {/* Placeholder */}
          </div>

          {/* Servers buttons */}
          <div className="servers">
            <button onClick={() => setServer("vidlink")}>VidSrc</button>
            <button onClick={() => setServer("filemoon")}>Filemoon</button>
            <button onClick={() => setServer("vidplay")}>VidPlay</button>
            <button onClick={() => setServer("carryon")}>Carry-On</button>
          </div>

          {/* Video Player */}
          {movieIdForPlayer && server === "filemoon" && (
            <VideoPlayer movieId={movieIdForPlayer} />
          )}
          {/* لو بغينا نضيف سيرفرات آخرين، نقدر نعمل if لكل واحد */}

          {/* Watch Now button */}
          <button className="watch-btn">▶ Watch Now</button>
        </div>
      </div>
    </div>
  );
}
