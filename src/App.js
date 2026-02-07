import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Trending from "./pages/Trending";
import Movies from "./pages/Movies";
import Series from "./pages/Series";

function App() {
  useEffect(() => {
    // دمج Monetag Multitag
    const script = document.createElement("script");
    script.src = "https://quge5.com/88/tag.min.js";  // الكود اللي عطاك Monetag
    script.async = true;
    script.setAttribute("data-zone", "204828");
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    // تنظيف الكود إذا تم إزالة Component
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/series" element={<Series />} />
    </Routes>
  );
}

export default App;
