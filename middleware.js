import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Redirect clean movie URL to the actual HTML file
  if (pathname.startsWith("/movie/")) {
    // Get the slug
    const slug = pathname.replace("/movie/", "");
    // Construct the path to the HTML file
    url.pathname = `/movie/${slug}.html`;
    return NextResponse.rewrite(url);
  }

  // Let everything else continue
  return NextResponse.next();
}

// Apply middleware only to /movie paths
export const config = {
  matcher: ["/movie/:slug*"]
};
