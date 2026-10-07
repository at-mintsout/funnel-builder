// File: src/app/(dashboard)/builder/data/templates.js

export const PREBUILT_TEMPLATES = [
  // ==========================================
  // 1. SAAS & SOFTWARE SUBSCRIPTION FUNNEL
  // ==========================================
  {
    id: "tpl_saas_pro",
    name: "SaaS Launchpad",
    icon: "🚀",
    description: "High-converting funnel for software tools. Includes VSL, Feature Grid, and 2-column checkout.",
    data: {
      landing: [
        { id: "t1_r1", columns: [{ id: "t1_c1", widthPercent: 100, widgets: [
          { id: "t1_w1", type: "urgency_text", content: "🚨 Limited Beta Release: Only 50 Spots Available!", styles: { textAlign: "center", backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px", borderRadius: "5px" } },
          { id: "t1_w2", type: "h1", content: "Automate Your Workflows in 3 Clicks", styles: { textAlign: "center", color: "#0f172a", fontSize: "48px", fontWeight: "900", paddingTop: "30px" } },
          { id: "t1_w3", type: "paragraph", content: "Stop wasting hours on manual tasks. Our AI-driven software does the heavy lifting for you.", styles: { textAlign: "center", fontSize: "18px", color: "#475569" } },
          { id: "t1_w4", type: "video_embed", content: "https://www.youtube.com/embed/dQw4w9WgXcQ", styles: { paddingTop: "20px", paddingBottom: "20px" } },
          { id: "t1_w5", type: "button_animated", content: "Start Your 14-Day Free Trial", styles: { backgroundColor: "#4f46e5", color: "#fff", fontSize: "20px", padding: "15px 30px", borderRadius: "8px", textAlign: "center" } }
        ]}]},
        { id: "t1_r2", columns: [{ id: "t1_c2", widthPercent: 100, widgets: [
          { id: "t1_w6", type: "h2", content: "Everything you need to scale", styles: { textAlign: "center", paddingTop: "40px", paddingBottom: "20px" } },
          { id: "t1_w7", type: "feature_grid", content: "AI Automation|CRM Sync|1-Click Export|24/7 Support" }
        ]}]}
      ],
      checkout: [
        { id: "t1_r3", columns: [
          { id: "t1_c3", widthPercent: 60, widgets: [
            { id: "t1_w8", type: "h2", content: "Complete Your Registration", styles: { paddingBottom: "10px" } },
            { id: "t1_w9", type: "razorpay_btn", content: "Pay ₹1999/month", pricing: { rate: "2999", discount: "33", finalPrice: "1999" } },
            { id: "t1_w10", type: "guarantee_box", content: "14-Day Money Back Guarantee" }
          ]},
          { id: "t1_c4", widthPercent: 40, widgets: [
            { id: "t1_w11", type: "testimonial_card", content: "'This software saved me 20 hours a week! Highly recommended.' - Rohan M.", styles: { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "10px" } },
            { id: "t1_w12", type: "trust_badges", content: "Bank-Grade Security | 256-bit Encryption" }
          ]}
        ]}
      ],
      thankyou: [
        { id: "t1_r4", columns: [{ id: "t1_c5", widthPercent: 100, widgets: [
          { id: "t1_w13", type: "confetti_trigger", content: "Success" },
          { id: "t1_w14", type: "h1", content: "Welcome Aboard! 🎉", styles: { textAlign: "center", color: "#10b981", paddingTop: "50px" } },
          { id: "t1_w15", type: "paragraph", content: "Your account is active. Click below to access your dashboard and watch the onboarding video.", styles: { textAlign: "center", fontSize: "16px" } },
          { id: "t1_w16", type: "button_primary", content: "Login to Dashboard", styles: { backgroundColor: "#0f172a" } }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 2. HIGH-TICKET COACHING / CONSULTING
  // ==========================================
  {
    id: "tpl_high_ticket",
    name: "High-Ticket Coach",
    icon: "📈",
    description: "Built for consultants. Features authority building, scarcity, and strategy call booking.",
    data: {
      landing: [
        { id: "t2_r1", columns: [{ id: "t2_c1", widthPercent: 100, widgets: [
          { id: "t2_w1", type: "h1", content: "How I Scaled My Agency to ₹1CR/Year", styles: { textAlign: "center", fontSize: "40px", fontWeight: "900", color: "#111827" } },
          { id: "t2_w2", type: "h3", content: "(Without spending a rupee on Ads)", styles: { textAlign: "center", color: "#6b7280", fontStyle: "italic", paddingBottom: "20px" } },
          { id: "t2_w3", type: "video_sales_letter", content: "Watch this private training before it's taken down." },
          { id: "t2_w4", type: "button_animated", content: "Apply For A 1-on-1 Strategy Session", styles: { backgroundColor: "#b91c1c", color: "#fff", padding: "18px", borderRadius: "50px" } }
        ]}]},
        { id: "t2_r2", columns: [{ id: "t2_c2", widthPercent: 100, widgets: [
          { id: "t2_w5", type: "testimonial_slider", content: "Client Results Carousel", styles: { paddingTop: "30px" } },
          { id: "t2_w6", type: "trust_badges", content: "Featured in: Forbes | Entrepreneur | YourStory" }
        ]}]}
      ],
      checkout: [
        { id: "t2_r3", columns: [
          { id: "t2_c3", widthPercent: 50, widgets: [
            { id: "t2_w7", type: "h2", content: "Secure Your Audit Slot", styles: { paddingBottom: "10px" } },
            { id: "t2_w8", type: "paragraph", content: "A refundable deposit of ₹999 is required to eliminate no-shows." },
            { id: "t2_w9", type: "razorpay_btn", content: "Pay Deposit Now", pricing: { rate: "999", discount: "0", finalPrice: "999" } }
          ]},
          { id: "t2_c4", widthPercent: 50, widgets: [
            { id: "t2_w10", type: "avatar", content: "Consultant Image" },
            { id: "t2_w11", type: "bullet_list", content: "What you get:\nCustom 90-Day Roadmap\nCompetitor Analysis\nDirect Q&A with me" }
          ]}
        ]}
      ],
      thankyou: [
        { id: "t2_r4", columns: [{ id: "t2_c5", widthPercent: 100, widgets: [
          { id: "t2_w12", type: "h1", content: "Application Received! 🤝", styles: { textAlign: "center" } },
          { id: "t2_w13", type: "paragraph", content: "Please pick a date and time for our call using the calendar below.", styles: { textAlign: "center" } },
          { id: "t2_w14", type: "custom_html", content: "<!-- Embed Calendly Here -->", styles: { padding: "20px", backgroundColor: "#f3f4f6", textAlign: "center" } }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 3. E-COMMERCE PHYSICAL PRODUCT DROP
  // ==========================================
  {
    id: "tpl_ecom_physical",
    name: "E-Com Product Drop",
    icon: "📦",
    description: "Direct response e-commerce page. Perfect for single-product drops with order bumps.",
    data: {
      landing: [
        { id: "t3_r1", columns: [
          { id: "t3_c1", widthPercent: 50, widgets: [
            { id: "t3_w1", type: "image", content: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
            { id: "t3_w2", type: "image_gallery", content: "Thumbnails" }
          ]},
          { id: "t3_c2", widthPercent: 50, widgets: [
            { id: "t3_w3", type: "scarcity_ribbon", content: "🔥 Flash Sale: 50% OFF Ends Today!" },
            { id: "t3_w4", type: "h1", content: "Pro Noise-Cancelling Headphones", styles: { fontSize: "36px", paddingTop: "10px" } },
            { id: "t3_w5", type: "product_rating", content: "4.9/5 (2,450 Reviews)", styles: { paddingBottom: "15px" } },
            { id: "t3_w6", type: "paragraph", content: "Experience studio-quality sound with 40-hour battery life and ultra-soft memory foam earcups." },
            { id: "t3_w7", type: "h2", content: "₹2,499", styles: { color: "#b91c1c" } },
            { id: "t3_w8", type: "button_primary", content: "Buy Now & Save 50%", styles: { backgroundColor: "#10b981", fontSize: "18px", padding: "15px" } }
          ]}
        ]}
      ],
      checkout: [
        { id: "t3_r2", columns: [
          { id: "t3_c3", widthPercent: 100, widgets: [
            { id: "t3_w9", type: "h2", content: "Secure Checkout", styles: { textAlign: "center", paddingBottom: "20px" } },
            { id: "t3_w10", type: "order_bump", content: "Add 2-Year VIP Warranty for just ₹299!" },
            { id: "t3_w11", type: "razorpay_btn", content: "Pay Securely via UPI/Cards", pricing: { rate: "4999", discount: "50", finalPrice: "2499" } }
          ]}
        ]}
      ],
      thankyou: [
        { id: "t3_r3", columns: [{ id: "t3_c4", widthPercent: 100, widgets: [
          { id: "t3_w12", type: "confetti_trigger", content: "Success" },
          { id: "t3_w13", type: "h2", content: "Your Order is Confirmed! 📦", styles: { textAlign: "center", color: "#10b981" } },
          { id: "t3_w14", type: "paragraph", content: "Your order #10294 is being packed. You will receive tracking details on your email shortly.", styles: { textAlign: "center" } },
          { id: "t3_w15", type: "social_share", content: "Share your purchase and win cashback!" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 4. REAL ESTATE / PROPERTY LEAD GEN
  // ==========================================
  {
    id: "tpl_real_estate",
    name: "Luxury Real Estate",
    icon: "🏢",
    description: "Generate high-quality leads for properties. Features image sliders and site visit booking.",
    data: {
      landing: [
        { id: "t4_r1", columns: [{ id: "t4_c1", widthPercent: 100, widgets: [
          { id: "t4_w1", type: "carousel", content: "Luxury Villa Images Slider" },
          { id: "t4_w2", type: "h1", content: "Own a Piece of Paradise in Goa", styles: { textAlign: "center", paddingTop: "20px" } },
          { id: "t4_w3", type: "check_list", content: "Private Pool\nSea Facing\nFully Furnished\nHigh ROI", styles: { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "8px" } },
          { id: "t4_w4", type: "button_primary", content: "Download Brochure", styles: { backgroundColor: "#0ea5e9" } }
        ]}]}
      ],
      checkout: [
        { id: "t4_r2", columns: [{ id: "t4_c2", widthPercent: 100, widgets: [
          { id: "t4_w5", type: "h2", content: "Book a Virtual Site Visit", styles: { textAlign: "center" } },
          { id: "t4_w6", type: "paragraph", content: "Lock your price with a refundable token amount.", styles: { textAlign: "center" } },
          { id: "t4_w7", type: "razorpay_btn", content: "Pay ₹5000 Token Amount", pricing: { rate: "5000", discount: "0", finalPrice: "5000" } }
        ]}]}
      ],
      thankyou: [
        { id: "t4_r3", columns: [{ id: "t4_c3", widthPercent: 100, widgets: [
          { id: "t4_w8", type: "h1", content: "Congratulations! 🏡", styles: { textAlign: "center", color: "#0ea5e9" } },
          { id: "t4_w9", type: "paragraph", content: "Our property expert will call you within 24 hours.", styles: { textAlign: "center" } },
          { id: "t4_w10", type: "google_map", content: "Goa Property Location" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 5. FITNESS & HEALTH PROGRAM
  // ==========================================
  {
    id: "tpl_fitness",
    name: "90-Day Fitness Challenge",
    icon: "🏋️",
    description: "High-energy funnel for diet plans and fitness coaching.",
    data: {
      landing: [
        { id: "t5_r1", columns: [{ id: "t5_c1", widthPercent: 100, widgets: [
          { id: "t5_w1", type: "gradient_text", content: "Transform Your Body in 90 Days", styles: { textAlign: "center", fontSize: "45px" } },
          { id: "t5_w2", type: "before_after", content: "Before & After Image Slider", styles: { paddingTop: "20px", paddingBottom: "20px" } },
          { id: "t5_w3", type: "paragraph", content: "Get custom diet plans, daily home workouts, and 24/7 WhatsApp support.", styles: { textAlign: "center" } },
          { id: "t5_w4", type: "countdown_timer", content: "Next Batch Starts In:", styles: { textAlign: "center" } },
          { id: "t5_w5", type: "button_animated", content: "Join The Challenge Now", styles: { backgroundColor: "#f97316" } }
        ]}]}
      ],
      checkout: [
        { id: "t5_r2", columns: [
          { id: "t5_c2", widthPercent: 60, widgets: [
            { id: "t5_w6", type: "h2", content: "Join the Warrior Batch" },
            { id: "t5_w7", type: "razorpay_btn", content: "Pay ₹1499", pricing: { rate: "3000", discount: "50", finalPrice: "1499" } }
          ]},
          { id: "t5_c3", widthPercent: 40, widgets: [
            { id: "t5_w8", type: "testimonial_card", content: "Lost 10kgs in 3 months! Best decision ever." }
          ]}
        ]}
      ],
      thankyou: [
        { id: "t5_r3", columns: [{ id: "t5_c4", widthPercent: 100, widgets: [
          { id: "t5_w9", type: "h1", content: "You're In! 💪", styles: { textAlign: "center", color: "#f97316" } },
          { id: "t5_w10", type: "paragraph", content: "Step 1: Download our app. Step 2: Join the private WhatsApp group.", styles: { textAlign: "center" } },
          { id: "t5_w11", type: "whatsapp_float", content: "Join VIP Group" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 6. CRYPTO / FINANCE COURSE
  // ==========================================
  {
    id: "tpl_finance",
    name: "Trading Blueprint",
    icon: "📈",
    description: "Finance course funnel with data charts, urgency, and premium feel.",
    data: {
      landing: [
        { id: "t6_r1", columns: [{ id: "t6_c1", widthPercent: 100, widgets: [
          { id: "t6_w1", type: "h1", content: "Master Options Trading in 2026", styles: { textAlign: "center", color: "#1e293b", fontWeight: "900" } },
          { id: "t6_w2", type: "chart_bar", content: "Student Profit Graph Placeholder", styles: { padding: "20px" } },
          { id: "t6_w3", type: "bullet_list", content: "Live Daily Trading\nRisk Management Strategies\nProprietary Indicators" },
          { id: "t6_w4", type: "button_primary", content: "Get Instant Access", styles: { backgroundColor: "#059669" } }
        ]}]}
      ],
      checkout: [
        { id: "t6_r2", columns: [{ id: "t6_c2", widthPercent: 100, widgets: [
          { id: "t6_w5", type: "h2", content: "Secure Your Spot", styles: { textAlign: "center" } },
          { id: "t6_w6", type: "trust_badges", content: "100% Secure Checkout", styles: { textAlign: "center" } },
          { id: "t6_w7", type: "razorpay_btn", content: "Pay ₹4999 (Lifetime Access)", pricing: { rate: "9999", discount: "50", finalPrice: "4999" } }
        ]}]}
      ],
      thankyou: [
        { id: "t6_r3", columns: [{ id: "t6_c3", widthPercent: 100, widgets: [
          { id: "t6_w8", type: "h1", content: "Payment Successful 🚀", styles: { textAlign: "center", color: "#059669" } },
          { id: "t6_w9", type: "telegram_chat", content: "Join Premium Telegram Channel" },
          { id: "t6_w10", type: "button_outline", content: "Go to Course Portal" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 7. FREELANCE / DIGITAL AGENCY
  // ==========================================
  {
    id: "tpl_agency_services",
    name: "Agency Service Booking",
    icon: "💼",
    description: "Sell audits, SEO packages, or graphic design services directly.",
    data: {
      landing: [
        { id: "t7_r1", columns: [{ id: "t7_c1", widthPercent: 100, widgets: [
          { id: "t7_w1", type: "h1", content: "Rank #1 on Google in 90 Days", styles: { textAlign: "center", fontSize: "40px" } },
          { id: "t7_w2", type: "paragraph", content: "We help local businesses dominate search results. Stop losing clients to competitors.", styles: { textAlign: "center" } },
          { id: "t7_w3", type: "comparison_table", content: "Our Agency vs Traditional Agencies" },
          { id: "t7_w4", type: "button_primary", content: "Get a Free SEO Audit", styles: { backgroundColor: "#2563eb" } }
        ]}]}
      ],
      checkout: [
        { id: "t7_r2", columns: [{ id: "t7_c2", widthPercent: 100, widgets: [
          { id: "t7_w5", type: "h2", content: "Book Advanced SEO Setup", styles: { textAlign: "center" } },
          { id: "t7_w6", type: "razorpay_btn", content: "Pay Setup Fee ₹9999", pricing: { rate: "15000", discount: "33", finalPrice: "9999" } }
        ]}]}
      ],
      thankyou: [
        { id: "t7_r3", columns: [{ id: "t7_c3", widthPercent: 100, widgets: [
          { id: "t7_w7", type: "h1", content: "Welcome to the Family! 🤝", styles: { textAlign: "center" } },
          { id: "t7_w8", type: "paragraph", content: "Please fill out the onboarding form below so our team can start analyzing your website.", styles: { textAlign: "center" } },
          { id: "t7_w9", type: "button_animated", content: "Start Onboarding Form" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 8. LIVE EVENT / VIRTUAL WORKSHOP
  // ==========================================
  {
    id: "tpl_event_summit",
    name: "Live Event Summit",
    icon: "🎪",
    description: "Sell tickets to virtual or physical events. Includes countdowns and schedules.",
    data: {
      landing: [
        { id: "t8_r1", columns: [{ id: "t8_c1", widthPercent: 100, widgets: [
          { id: "t8_w1", type: "text_highlight", content: "📅 October 20-21 | Live in Mumbai & Online", styles: { textAlign: "center" } },
          { id: "t8_w2", type: "h1", content: "The Future of AI Marketing Summit", styles: { textAlign: "center", fontSize: "44px" } },
          { id: "t8_w3", type: "timeline", content: "Day 1: Fundamentals | Day 2: Advanced Scaling" },
          { id: "t8_w4", type: "pricing_table", content: "General: ₹999 | VIP: ₹4999 (Inc. Dinner)" },
          { id: "t8_w5", type: "button_animated", content: "Grab Your Ticket Now" }
        ]}]}
      ],
      checkout: [
        { id: "t8_r2", columns: [{ id: "t8_c2", widthPercent: 100, widgets: [
          { id: "t8_w6", type: "h2", content: "Select Your Ticket", styles: { textAlign: "center" } },
          { id: "t8_w7", type: "razorpay_btn", content: "Pay for VIP Ticket ₹4999", pricing: { rate: "4999", discount: "0", finalPrice: "4999" } }
        ]}]}
      ],
      thankyou: [
        { id: "t8_r3", columns: [{ id: "t8_c3", widthPercent: 100, widgets: [
          { id: "t8_w8", type: "confetti_trigger", content: "Success" },
          { id: "t8_w9", type: "h1", content: "Ticket Confirmed! 🎟️", styles: { textAlign: "center" } },
          { id: "t8_w10", type: "qr_code", content: "Event Entry QR Code", styles: { textAlign: "center", padding: "20px" } },
          { id: "t8_w11", type: "button_outline", content: "Add to Google Calendar" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 9. MEMBERSHIP / CREATOR CLUB
  // ==========================================
  {
    id: "tpl_membership",
    name: "Exclusive Creator Club",
    icon: "💎",
    description: "Monthly subscription funnel for creators, newsletters, or exclusive content.",
    data: {
      landing: [
        { id: "t9_r1", columns: [{ id: "t9_c1", widthPercent: 100, widgets: [
          { id: "t9_w1", type: "h1", content: "Join The Elite Creators Inner Circle", styles: { textAlign: "center", fontSize: "40px" } },
          { id: "t9_w2", type: "paragraph", content: "Get weekly templates, monthly group coaching, and network with top creators.", styles: { textAlign: "center" } },
          { id: "t9_w3", type: "video_embed", content: "Promo Video Link" },
          { id: "t9_w4", type: "subscription_toggle", content: "Monthly vs Annual Toggle" },
          { id: "t9_w5", type: "button_primary", content: "Become a Member", styles: { backgroundColor: "#8b5cf6" } }
        ]}]}
      ],
      checkout: [
        { id: "t9_r2", columns: [{ id: "t9_c2", widthPercent: 100, widgets: [
          { id: "t9_w6", type: "h2", content: "Membership Checkout", styles: { textAlign: "center" } },
          { id: "t9_w7", type: "razorpay_btn", content: "Subscribe for ₹499/mo", pricing: { rate: "999", discount: "50", finalPrice: "499" } },
          { id: "t9_w8", type: "faq_accordion", content: "Can I cancel anytime? Yes." }
        ]}]}
      ],
      thankyou: [
        { id: "t9_r3", columns: [{ id: "t9_c3", widthPercent: 100, widgets: [
          { id: "t9_w9", type: "h1", content: "Welcome to the Club! 🥂", styles: { textAlign: "center", color: "#8b5cf6" } },
          { id: "t9_w10", type: "discord_invite", content: "Join our private Discord Server" },
          { id: "t9_w11", type: "button_primary", content: "Access Resource Vault" }
        ]}]}
      ]
    }
  },

  // ==========================================
  // 10. LOCAL CLINIC / APPOINTMENT
  // ==========================================
  {
    id: "tpl_local_business",
    name: "Local Clinic Offer",
    icon: "🏥",
    description: "Lead generation for local businesses. Maps, contact forms, and booking fees.",
    data: {
      landing: [
        { id: "t10_r1", columns: [
          { id: "t10_c1", widthPercent: 50, widgets: [
            { id: "t10_w1", type: "h1", content: "Free Dental Implant Consultation", styles: { fontSize: "38px" } },
            { id: "t10_w2", type: "paragraph", content: "Get your perfect smile back. Limited to the first 20 patients this month." },
            { id: "t10_w3", type: "bullet_list", content: "Free 3D Scan\n0% EMI Available\nExpert Doctors" }
          ]},
          { id: "t10_c2", widthPercent: 50, widgets: [
            { id: "t10_w4", type: "form_optin", content: "Claim Your Free Voucher" }
          ]}
        ]},
        { id: "t10_r2", columns: [{ id: "t10_c3", widthPercent: 100, widgets: [
          { id: "t10_w5", type: "google_map", content: "Clinic Location" },
          { id: "t10_w6", type: "testimonial_card", content: "Best dental experience ever!" }
        ]}]}
      ],
      checkout: [
        { id: "t10_r3", columns: [{ id: "t10_c4", widthPercent: 100, widgets: [
          { id: "t10_w7", type: "h2", content: "Confirm Your Appointment", styles: { textAlign: "center" } },
          { id: "t10_w8", type: "paragraph", content: "Pay a ₹200 refundable registration fee to confirm your slot.", styles: { textAlign: "center" } },
          { id: "t10_w9", type: "razorpay_btn", content: "Pay ₹200 Registration", pricing: { rate: "200", discount: "0", finalPrice: "200" } }
        ]}]}
      ],
      thankyou: [
        { id: "t10_r4", columns: [{ id: "t10_c5", widthPercent: 100, widgets: [
          { id: "t10_w10", type: "h1", content: "Appointment Confirmed! 🩺", styles: { textAlign: "center", color: "#059669" } },
          { id: "t10_w11", type: "paragraph", content: "Please arrive 10 minutes early. Our clinic address is sent to your WhatsApp.", styles: { textAlign: "center" } },
          { id: "t10_w12", type: "button_primary", content: "Get Directions on Google Maps" }
        ]}]}
      ]
    }
  }
];
