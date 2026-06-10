import { NextResponse } from "next/server";
import { Resend } from "resend";

// 🔐 Securely picking API key from Environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { customerEmail, customerName, productName, thanksMessage } = await request.json();

    // 📧 Sending automated transactional email via Resend
    const data = await resend.emails.send({
      from: "FunnelCraft <onboarding@resend.dev>", // Free testing tier domain
      to: [customerEmail],
      subject: `🎉 Access Granted: ${productName}!`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded-xl: 12px; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 5px;">Hey ${customerName}! 👋</h2>
          <p style="color: #71717a; font-size: 14px; margin-top: 0;">Your registration is successfully processed.</p>
          
          <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong style="display: block; color: #18181b; font-size: 15px;">Product/Service:</strong>
            <span style="color: #27272a; font-size: 14px;">${productName}</span>
            
            <strong style="display: block; color: #18181b; font-size: 15px; margin-top: 12px;">Important Instructions:</strong>
            <p style="color: #27272a; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">${thanksMessage}</p>
          </div>
          
          <p style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: 30px;">
            Powered by FunnelCraft Automation Engine Engine 🚀
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend API Crash:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}