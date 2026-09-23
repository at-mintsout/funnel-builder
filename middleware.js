import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const isLocal = hostname.includes("localhost");
  const isVercel = hostname.includes("vercel.app");

  // Agar request custom domain ki hai
  if (!isLocal && !isVercel) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // 1. Check karo ki ye custom domain kis user_settings mein registered hai
      const { data: settingData } = await supabase
        .from("user_settings")
        .select("user_id")
        .eq("custom_domain", hostname)
        .maybeSingle();

      if (settingData) {
        // 2. Us user ka sabse pehla funnel uthao taaki direct render ho sake
        const { data: funnelData } = await supabase
          .from("funnels")
          .select("id")
          .eq("user_id", settingData.user_id)
          .limit(1)
          .maybeSingle();

        if (funnelData) {
          url.pathname = '/preview';
          url.searchParams.set("id", funnelData.id);
          return NextResponse.rewrite(url);
        }
      }
    }

    // Fallback agar koi direct match na mile
    url.pathname = '/preview';
    url.searchParams.set("domain", hostname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};