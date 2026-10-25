import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, type } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY Vercel par missing hai." }, { status: 500 });
    }

    const isFunnel = type === "generate_funnel";

    const systemInstruction = isFunnel
      ? `You are a professional ClickFunnels designer. Based on the user's business idea, build a complete, long-form, high-converting funnel layout in JSON. 
      Use a variety of widget types from this list: "h1", "h2", "paragraph", "image", "video_embed", "feature_grid", "testimonial_card", "faq_accordion", "guarantee_box", and "button_primary". Provide relevant Unsplash image URLs for images.
      Return ONLY valid JSON matching this exact structure (no markdown tags):
      {
        "landing": [
          {
            "id": "row_1",
            "type": "layout_1",
            "columns": [
              {
                "id": "col_1",
                "widthPercent": 100,
                "widgets": [
                  { "id": "w1", "type": "h1", "content": "Catchy Headline", "styles": { "textAlign": "center", "fontSize": "42px", "fontWeight": "900", "color": "#0f172a" } },
                  { "id": "w2", "type": "paragraph", "content": "Persuasive subheadline.", "styles": { "textAlign": "center" } },
                  { "id": "w3", "type": "image", "content": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
                  { "id": "w4", "type": "h2", "content": "Why Choose Us?", "styles": { "textAlign": "center", "paddingTop": "20px" } }
                ]
              }
            ]
          }
        ],
        "checkout": [
          { "id": "row_2", "type": "layout_1", "columns": [{ "id": "col_2", "widthPercent": 100, "widgets": [{ "id": "c1", "type": "h2", "content": "Secure Checkout" }, { "id": "c2", "type": "form_checkout", "content": "Complete Order" }]}] }
        ],
        "thankyou": [
          { "id": "row_3", "type": "layout_1", "columns": [{ "id": "col_3", "widthPercent": 100, "widgets": [{ "id": "t1", "type": "confetti_trigger", "content": "Success" }, { "id": "t2", "type": "h2", "content": "Thank You!" }]}] }
        ]
      }
      Add as many rows and widgets in the landing array as needed to make it a detailed sales page.`
      : "You are an expert copywriter. Write a short, punchy marketing text based on the user's input. Do not use quotes or markdown. Max 2 sentences.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // ✅ Valid Groq Model
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        ...(isFunnel && { response_format: { type: "json_object" } }) // Forces Groq to output clean JSON
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq AI Error");
    }

    const generatedText = data.choices[0].message.content;
    
    if (isFunnel) {
      let cleanText = generatedText;
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      // JSON Parse karke bhejein taki frontend par direct object mile
      return NextResponse.json({ result: JSON.parse(cleanText) });
    } else {
      // Text generation (Enhance AI) ke liye
      return NextResponse.json({ result: generatedText.replace(/['"]+/g, '').trim() });
    }

  } catch (error) {
    console.error("AI Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
