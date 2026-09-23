import { NextResponse } from "next/server";
import { Resend } from "resend";

// 🔐 Securely picking API key from Environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Upgraded: Added 'webhookUrl' to capture the CRM setting dynamically
    const { customerEmail, customerName, productName, thanksMessage, webhookUrl } = await request.json();

    // 🛡️ Basic Security Validation (Prevents API crashing on empty submissions)
    if (!customerEmail || !customerName) {
      return NextResponse.json({ success: false, error: "Missing required contact fields." }, { status: 400 });
    }

    // 1. 📧 Sending automated transactional email via Resend (ORIGINAL CORE PRESERVED)
    const emailPromise = resend.emails.send({
      from: "FunnelCraft <onboarding@resend.dev>", // Free testing tier domain
      to: [customerEmail],
      subject: `🎉 Access Granted: ${productName}!`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #4f46e5; margin-bottom: 5px;">Hey ${customerName}! 👋</h2>
          <p style="color: #71717a; font-size: 14px; margin-top: 0;">Your registration is successfully processed.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <strong style="display: block; color: #1e293b; font-size: 15px;">Product/Service:</strong>
            <span style="color: #334155; font-size: 14px;">${productName}</span>
            
            <strong style="display: block; color: #1e293b; font-size: 15px; margin-top: 12px;">Important Instructions:</strong>
            <p style="color: #334155; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">${thanksMessage}</p>
          </div>
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px;">
            Powered by FunnelCraft Automation Engine 🚀
          </p>
        </div>
      `,
    });

    // 2. 🔗 CRM Webhook Automation Engine (NEW SILENT UPGRADE)
    let webhookPromise = null;
    if (webhookUrl) {
       webhookPromise = fetch(webhookUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           event: "new_funnel_lead",
           customerName,
           customerEmail,
           productName,
           timestamp: new Date().toISOString()
         })
       }).catch(err => console.error("Silent Webhook Warning:", err)); // Doesn't break email if webhook fails
    }

    // ⚡ Execute Email & CRM Webhook parallelly for maximum speed
    const [emailData] = await Promise.all([emailPromise, webhookPromise]);

    return NextResponse.json({ success: true, data: emailData });
    
  } catch (error) {
    console.error("Resend/API Crash:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}