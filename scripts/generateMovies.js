// generate-seo-movies-advanced.js
import fs from "fs";
import axios from "axios";
import path from "path";

// TMDB API
const API_KEY = "4228896b45212df64cecd5a44dd5541d";
const BASE_URL = "https://api.themoviedb.org/3";

// فولدر الخرج
const OUTPUT_DIR = "./public/movie";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// تحويل عنوان الفيلم لاسم ملف صالح للـ URL
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")  // كل شي غير الحروف والأرقام يتحول ل-
    .replace(/(^-|-$)/g, "");     // إزالة - من البداية والنهاية
}

// دالة توليد صفحة HTML SEO لفيلم واحد
async function generateSEOPage(movie) {
  try {
    const slug = slugify(movie.title);
    const filename = path.join(OUTPUT_DIR, `${slug}.html`);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${movie.title} | MovieFree</title>
  <meta name="description" content="${movie.overview || "Watch movie online"}" />
  <meta property="og:title" content="${movie.title}" />
  <meta property="og:description" content="${movie.overview || ""}" />
  <meta property="og:image" content="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
  <meta name="robots" content="index, follow" />
</head>
<body>
  <h1>${movie.title}</h1>
  <p>${movie.overview || ""}</p>
  <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
  <br/>
  <a href="/movie/${movie.id}">▶ Watch on site</a>

  <script>
    // إعادة توجيه المستخدمين للـ React SPA
    window.location.href = "/movie/${movie.id}";
  </script>
</body>
</html>
    `;

    fs.writeFileSync(filename, html);
    console.log(`✅ Page created: ${slug}.html`);
  } catch (err) {
    console.error("Error creating page:", err.message);
  }
}

// جلب أفلام مشهورة من TMDB
async function getPopularMovies(limit = 500) {
  let movies = [];
  let page = 1;

  while (movies.length < limit) {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, page }
    });

    movies.push(...res.data.results);
    page++;

    if (!res.data.results.length) break;
  }

  return movies.slice(0, limit);
}

// توليد صفحات SEO لكل الأفلام
async function generateAllPages() {
  console.log("⏳ Fetching popular movies...");
  const movies = await getPopularMovies(500);

  for (const movie of movies) {
    await generateSEOPage(movie);
  }

  console.log("🎉 500 SEO pages generated in public/movie!");
}

// تشغيل السكريبت
generateAllPages();
