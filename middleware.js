// middleware.js
import { NextResponse } from "next/server";

const PRERENDER_TOKEN = "هنا حط التوكن ديالك من Prerender.io";

export function middleware(req) {
  const userAgent = req.headers.get("user-agent") || "";

  // إذا جاء Bot
  if (/bot|googlebot|bingbot|yahoo|baiduspider|facebookexternalhit/i.test(userAgent)) {
    const url = req.url;
    const prerenderURL = `https://service.prerender.io/${url}`;
    const response = NextResponse.redirect(prerenderURL);
    response.headers.set("X-Prerender-Token", PRERENDER_TOKEN);
    return response;
  }

  return NextResponse.next();
}
