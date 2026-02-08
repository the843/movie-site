import { NavLink } from "react-router-dom";
import { FaHome, FaFilm, FaTv, FaFire } from "react-icons/fa"; // أيقونات احترافية
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      {/* Logo الموقع */}
      <NavLink to="/" className="logo-box">
        <img src="/logo.png" alt="MovieFree" className="site-logo" />
        <span className="site-name">MovieFree</span>
      </NavLink>

      {/* Navigation مع أيقونات SVG */}
      <nav className="main-nav">
        <NavLink to="/" end className="nav-link">
          <FaHome className="nav-icon" /> الرئيسية
        </NavLink>
        <NavLink to="/movies" className="nav-link">
          <FaFilm className="nav-icon" /> أفلام
        </NavLink>
        <NavLink to="/series" className="nav-link">
          <FaTv className="nav-icon" /> مسلسلات
        </NavLink>
        <NavLink to="/trending" className="nav-link">
          <FaFire className="nav-icon" /> الأكثر مشاهدة
        </NavLink>
      </nav>
    </header>
  );
}
