import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // إذا كان رابط فيلم
  if (pathname.startsWith("/movie/")) {
    const slug = pathname.replace("/movie/", "");
    // مسار الملف الفعلي
    url.pathname = `/movie/${slug}.html`;

    // Rewrite باش المستخدم يشوف نفس الرابط النظيف
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// نطبق فقط على روابط الأفلام
export const config = {
  matcher: ["/movie/:slug*"]
};
