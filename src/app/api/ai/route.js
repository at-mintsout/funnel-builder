import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Check if API Key exists
    if (!apiKey) {
      return NextResponse.json({ error: "Vercel Environment mein GEMINI_API_KEY missing hai." }, { status: 500 });
    }

    let systemInstruction = "";
    if (type === "generate_funnel") {
      systemInstruction = `You are an expert marketer and funnel builder. The user will give a business idea. You MUST return ONLY a valid JSON object with the following exact keys, containing high-converting marketing copy for their funnel. Do not include markdown code blocks (\`\`\`json).
      {
        "landing_headline": "Punchy main headline (max 8 words)",
        "landing_subheadline": "Persuasive subheadline explaining the benefit (max 20 words)",
        "features_text": "Benefit 1 | Benefit 2 | Benefit 3",
        "cta_text": "Action-driven button text (e.g., Get Started Now)",
        "checkout_title": "Reassuring checkout headline",
        "thankyou_message": "Congratulatory thank you message"
      }`;
    } else {
      systemInstruction = type === "h1" || type === "h2" || type === "h3"
        ? "You are a world-class copywriter. Write a short, punchy, high-converting marketing headline based on the user's input. Max 10 words. Return only the raw text."
        : "You are an expert marketer. Expand the user's input into a persuasive, conversion-focused paragraph. Max 3 sentences. Return only the raw text.";
    }

    const fullPrompt = `${systemInstruction}\n\nUser Input: ${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    const data = await response.json();

    // 2. BULLETPROOF CHECK: Agar answer missing hai toh crash mat karo, actual error return karo
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error("Google AI Error Response:", JSON.stringify(data, null, 2));
      
      // Agar API key galat hai ya quota khatam hai, toh Google ka asli message bhej do
      const googleErrMsg = data.error?.message || "Google Gemini Safety Block or Empty Response";
      throw new Error(googleErrMsg);
    }

    // 3. Sab theek hai toh text extract karo
    const generatedText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: generatedText.replace(/\*/g, '').trim() });

  } catch (error) {
    console.error("AI Error Triggered:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}