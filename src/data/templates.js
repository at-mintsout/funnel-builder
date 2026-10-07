// File: src/data/templates.js

export const PREBUILT_TEMPLATES = [
  {
    id: "tpl_digital_product",
    name: "Digital Product Website",
    icon: "💻",
    description: "Sell e-books, courses, or digital templates. Includes VSL & Checkout.",
    data: {
      landing: [
        { id: "r1", columns: [{ id: "c1", widthPercent: 100, widgets: [
          { id: "w1", type: "h1", content: "Master The Art of Digital Scaling", styles: { textAlign: "center", color: "#0f172a", fontSize: "42px", fontWeight: "900", paddingBottom: "20px" } },
          { id: "w2", type: "paragraph", content: "Learn the exact blueprint we used to scale our online business to 7 figures.", styles: { textAlign: "center", fontSize: "18px", color: "#475569" } },
          { id: "w3", type: "video_embed", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", styles: { paddingTop: "30px", paddingBottom: "30px" } },
          { id: "w4", type: "button_primary", content: "Buy Now for $49", styles: { backgroundColor: "#ef4444", color: "#ffffff", padding: "15px 30px", fontSize: "20px", borderRadius: "8px", textAlign: "center" } }
        ]}]}
      ],
      checkout: [
        { id: "r2", columns: [{ id: "c2", widthPercent: 100, widgets: [
          { id: "w5", type: "h2", content: "Secure Checkout", styles: { textAlign: "center", paddingBottom: "20px" } },
          { id: "w6", type: "form_checkout", content: "Complete Order" },
          { id: "w7", type: "trust_badges", content: "SSL | Stripe | Secure", styles: { textAlign: "center", paddingTop: "20px" } }
        ]}]}
      ],
      thankyou: [
        { id: "r3", columns: [{ id: "c3", widthPercent: 100, widgets: [
          { id: "w8", type: "confetti_trigger", content: "Success" },
          { id: "w9", type: "h2", content: "Payment Successful! 🎉", styles: { textAlign: "center", color: "#10b981", paddingTop: "50px" } },
          { id: "w10", type: "button_outline", content: "Download Your Product Here", styles: { textAlign: "center", color: "#4f46e5" } }
        ]}]}
      ]
    }
  },
  {
    id: "tpl_webinar",
    name: "Webinar Registration",
    icon: "🎥",
    description: "Capture leads and register attendees for automated webinars.",
    data: {
      landing: [
        { id: "r1", columns: [{ id: "c1", widthPercent: 100, widgets: [
          { id: "w1", type: "urgency_text", content: "Live Training: 300 Seats Capacity", styles: { textAlign: "center", color: "#ef4444" } },
          { id: "w2", type: "h1", content: "How to Build SaaS Without Coding", styles: { textAlign: "center", fontSize: "38px" } },
          { id: "w3", type: "countdown_timer", content: "Starting in 15:00", styles: { textAlign: "center", paddingTop: "20px", paddingBottom: "20px" } },
          { id: "w4", type: "form_optin", content: "Reserve My Seat Now", fields: [{ label: "Email Address", type: "email" }] }
        ]}]}
      ]
    }
  }
];
