import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const isLocal = hostname.includes("localhost");
  const isVercel = hostname.includes("vercel.app");

  // Agar request Vercel default ya Localhost ki nahi hai, toh matlab wo CUSTOM DOMAIN hai!
  if (!isLocal && !isVercel) {
    // Traffic ko chup-chap Preview page par bhej do, aur domain naam param me daal do
    url.pathname = '/preview';
    url.searchParams.set("domain", hostname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Middleware ko sirf pages par chalana hai, static files/images par nahi
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};