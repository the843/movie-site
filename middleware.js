import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // أي رابط كيبدا بـ /movie/
  if (pathname.startsWith('/movie/')) {
    const slug = pathname.replace('/movie/', '');
    // Rewrite داخلي لملف HTML المقابل فـ public/movie
    url.pathname = `/movie/${slug}.html`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/movie/:slug*'], // مهم جداً باش middleware يخدم غير على هاد المسارات
};
