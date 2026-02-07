const fs = require('fs');
const path = require('path');

// 1. مسار مجلد الأفلام
const moviesDir = path.join(__dirname, 'public', 'movie');

// 2. اسم الموقع ديالك
const baseUrl = 'https://moviefree.live/movie';

// 3. اقرأ جميع ملفات html فالمجلد
const files = fs.readdirSync(moviesDir).filter(file => file.endsWith('.html'));

// 4. بناء محتوى الـ sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

files.forEach(file => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${baseUrl}/${file}</loc>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
  sitemap += `  </url>\n`;
});

sitemap += `</urlset>`;

// 5. احفظ الملف فـ public/sitemap.xml
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);

console.log(`✅ Sitemap تم إنشاؤه! عدد الصفحات: ${files.length}`);
