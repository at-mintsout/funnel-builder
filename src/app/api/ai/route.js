import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();
    const apiKey = process.env.GROQ_API_KEY; // Nayi API Key

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY Vercel par missing hai." }, { status: 500 });
    }

    // AI ko instruction dena
    let systemInstruction = type === "generate_funnel"
      ? `You are an expert funnel builder. Return ONLY a valid JSON object without any markdown tags. Required keys: {"landing_headline":"...","landing_subheadline":"...","features_text":"...","cta_text":"...","checkout_title":"...","thankyou_message":"..."}`
      : "You are an expert copywriter. Write a short, punchy marketing text based on the user's input. Do not use quotes or markdown. Max 2 sentences.";

    // Llama 3 ko Groq ke zariye call karna
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // 100% Free aur Super Fast Meta Model
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Llama 3 API Error");
    }

    // Llama 3 ka answer nikalna
    const generatedText = data.choices[0].message.content;
    
    // JSON formatting saaf karna
    let cleanText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ result: cleanText });

  } catch (error) {
    console.error("AI Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}