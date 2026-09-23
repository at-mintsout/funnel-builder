import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { domain } = await req.json();
    
    // Vercel dashboard > Settings > Environment Variables se ye keys aayengi
    const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

    // 1. Check if keys exist
    if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
      return NextResponse.json({ 
        error: { message: "Vercel keys missing! Please add VERCEL_API_TOKEN and VERCEL_PROJECT_ID in Vercel settings and REDEPLOY your project." } 
      }, { status: 500 });
    }

    // 2. Call Vercel API
    const response = await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: domain })
    });

    const data = await response.json();

    // 3. Handle Vercel API Errors safely
    if (!response.ok) {
       return NextResponse.json({ 
         error: { message: data.error?.message || "Vercel API rejected the domain request." } 
       }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}