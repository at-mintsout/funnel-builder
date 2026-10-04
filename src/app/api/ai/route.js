import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  return NextResponse.json({
    status: "AI Backend is LIVE! 🚀",
    isApiKeyFound: !!apiKey
  });
}

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Vercel Environment mein API Key missing hai." }, { status: 500 });
    }

    let systemInstruction = type === "generate_funnel"
      ? `You are a funnel builder. Return ONLY a JSON object: {"landing_headline":"...","landing_subheadline":"...","features_text":"...","cta_text":"...","checkout_title":"...","thankyou_message":"..."}`
      : "You are a copywriter. Write a short, high-converting marketing text. Max 2 sentences.";

    // 👇 YAHAN HUMNE SABSE STABLE MODEL 'gemini-pro' LAGA DIYA HAI
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Input: ${prompt}` }] }] })
    });

    const data = await response.json();

    if (!response.ok || !data.candidates) {
      const googleError = data.error?.message || "Google blocked the request or sent empty data.";
      throw new Error(`Google API Reject: ${googleError}`);
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Output se markdown formatting (```json) saaf karna
    let cleanText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ result: cleanText });

  } catch (error) {
    console.error("AI Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}