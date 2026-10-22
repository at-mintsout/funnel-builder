"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PREBUILT_TEMPLATES } from "@/app/(dashboard)/builder/data/templates";

// =========================================================================
// 🌐 CONFIG MASTER DATA WIDGET REGISTRY SYSTEMS (150 PROFESSIONAL ELEMENTS)
// =========================================================================
const ELEMENTOR_WIDGET_CATALOG = [
  // --- 📐 1. STRUCTURAL LAYOUTS (10) ---
  { type: "layout_1", name: "1 Column Row", category: "layout", icon: "⚃", defaultContent: "Empty Section" },
  { type: "layout_2", name: "2 Column Split", category: "layout", icon: "⚄", defaultContent: "50/50 Grid" },
  { type: "layout_3", name: "3 Column Grid", category: "layout", icon: "⚅", defaultContent: "33/33/33 Grid" },
  { type: "layout_4", name: "4 Column Grid", category: "layout", icon: "⚂", defaultContent: "25x4 Grid" },
  { type: "layout_5", name: "5 Column Row", category: "layout", icon: "☷", defaultContent: "20x5 Grid" },
  { type: "layout_6", name: "6 Column Grid", category: "layout", icon: "☷", defaultContent: "16x6 Grid" },
  { type: "layout_left_sidebar", name: "Left Sidebar", category: "layout", icon: "◧", defaultContent: "30/70 Split" },
  { type: "layout_right_sidebar", name: "Right Sidebar", category: "layout", icon: "◨", defaultContent: "70/30 Split" },
  { type: "spacer", name: "Empty Spacer", category: "layout", icon: "⇳", defaultContent: "Spacer", styles: { verticalSpace: "40px" } },
  { type: "divider", name: "Divider Line", category: "layout", icon: "―", defaultContent: "", styles: { thickness: "2px", color: "#e2e8f0", verticalMargin: "24px" } },

  // --- 📝 2. TYPOGRAPHY & TEXT (20) ---
  { type: "h1", name: "Heading 1 (Hero)", category: "text", icon: "H1", defaultContent: "Main Hero Headline", styles: { color: "#0f172a", fontSize: "42px", fontWeight: "900" } },
  { type: "h2", name: "Heading 2 (Section)", category: "text", icon: "H2", defaultContent: "Section Title", styles: { color: "#1e293b", fontSize: "32px", fontWeight: "800" } },
  { type: "h3", name: "Heading 3", category: "text", icon: "H3", defaultContent: "Sub Title", styles: { color: "#334155", fontSize: "24px", fontWeight: "700" } },
  { type: "h4", name: "Heading 4", category: "text", icon: "H4", defaultContent: "Card Title", styles: { color: "#475569", fontSize: "20px", fontWeight: "600" } },
  { type: "h5", name: "Heading 5", category: "text", icon: "H5", defaultContent: "Small Header", styles: { color: "#64748b", fontSize: "16px", fontWeight: "600" } },
  { type: "h6", name: "Heading 6", category: "text", icon: "H6", defaultContent: "Tiny Header", styles: { color: "#94a3b8", fontSize: "14px", fontWeight: "500" } },
  { type: "paragraph", name: "Paragraph Text", category: "text", icon: "▤", defaultContent: "Your descriptive text goes here.", styles: { color: "#475569", fontSize: "15px", lineHeight: "1.6" } },
  { type: "blockquote", name: "Blockquote", category: "text", icon: "❝", defaultContent: "Innovation distinguishes between a leader and a follower.", styles: { color: "#0f172a", fontSize: "18px", fontStyle: "italic" } },
  { type: "text_highlight", name: "Highlighted Text", category: "text", icon: "🖍️", defaultContent: "Limited Time Offer", styles: { backgroundColor: "#fef08a", color: "#854d0e" } },
  { type: "animated_typing", name: "Typing Effect", category: "text", icon: "⌨️", defaultContent: "Boost Sales|Generate Leads|Scale Business" },
  { type: "gradient_text", name: "Gradient Headline", category: "text", icon: "🌈", defaultContent: "Next Generation Tech", styles: { fontSize: "36px", fontWeight: "900" } },
  { type: "dropcap", name: "Dropcap Text", category: "text", icon: "A", defaultContent: "Once upon a time in a digital world..." },
  { type: "tooltip_text", name: "Tooltip Hover", category: "text", icon: "💬", defaultContent: "Hover over me for details" },
  { type: "marquee", name: "Scrolling Marquee", category: "text", icon: "↔️", defaultContent: "Special Discount! 50% OFF All Plans • Limited Time •" },
  { type: "text_outline", name: "Outline Text", category: "text", icon: "🔲", defaultContent: "HOLLOW FONT" },
  { type: "code_block", name: "Code Snippet", category: "text", icon: "💻", defaultContent: "console.log('Hello World');", styles: { backgroundColor: "#1e293b", color: "#10b981" } },
  { type: "bullet_list", name: "Standard List", category: "text", icon: "•", defaultContent: "Feature One\nFeature Two\nFeature Three" },
  { type: "check_list", name: "Checkmark List", category: "text", icon: "✓", defaultContent: "High Speed\nSecure\nReliable" },
  { type: "cross_list", name: "Cross List", category: "text", icon: "✗", defaultContent: "No Hidden Fees\nNo Setup Cost" },
  { type: "numbered_list", name: "Numbered List", category: "text", icon: "🔢", defaultContent: "Step 1: Sign up\nStep 2: Connect\nStep 3: Profit" },

  // --- 📸 3. MEDIA & VISUALS (15) ---
  { type: "image", name: "Single Image", category: "media", icon: "🖼", defaultContent: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", imageSourceMode: "url" },
  { type: "video_embed", name: "YouTube/Vimeo", category: "media", icon: "▷", defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { type: "audio_player", name: "Audio/Podcast", category: "media", icon: "♬", defaultContent: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { type: "lottie_anim", name: "Lottie Animation", category: "media", icon: "✨", defaultContent: "https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json" },
  { type: "svg_icon", name: "SVG Icon Block", category: "media", icon: "⭐", defaultContent: "🚀" },
  { type: "image_gallery", name: "Grid Gallery", category: "media", icon: "🗂️", defaultContent: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300|https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300|https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300" },
  { type: "carousel", name: "Image Slider", category: "media", icon: "🎠", defaultContent: "Slide 1: High Conversion|Slide 2: AI Powered|Slide 3: Cloud Sync" },
  { type: "before_after", name: "Before/After Slider", category: "media", icon: "🌗", defaultContent: "Before Optimization (2% Conv.) | After Optimization (18% Conv.)" },
  { type: "pdf_viewer", name: "PDF Document", category: "media", icon: "📄", defaultContent: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { type: "3d_model", name: "3D Viewer", category: "media", icon: "🧊", defaultContent: "Interactive 3D Product Render" },
  { type: "avatar", name: "User Avatar", category: "media", icon: "👤", defaultContent: "Sandeep C." },
  { type: "gif_player", name: "Giphy Embed", category: "media", icon: "🎬", defaultContent: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif" },
  { type: "qr_code", name: "QR Code Generator", category: "media", icon: "📱", defaultContent: "https://funnel-builder-pael.vercel.app" },
  { type: "chart_bar", name: "Bar Chart", category: "media", icon: "📊", defaultContent: "Q1: 40%|Q2: 65%|Q3: 85%|Q4: 100%" },
  { type: "chart_pie", name: "Pie Chart", category: "media", icon: "🍩", defaultContent: "Organic: 55% | Paid Ads: 30% | Affiliates: 15%" },

  // --- ⚡ 4. FORMS & LEAD CAPTURE (25) ---
  { type: "form_optin", name: "Email Opt-in", category: "forms", icon: "✉", defaultContent: "Subscribe Now", fields: [{ label: "Email Address", type: "email" }] },
  { type: "form_contact", name: "Contact Form", category: "forms", icon: "📝", defaultContent: "Send Message", fields: [{ label: "Name", type: "text" }, { label: "Email", type: "email" }, { label: "Message", type: "textarea" }] },
  { type: "form_checkout", name: "2-Step Checkout", category: "forms", icon: "💳", defaultContent: "Complete Order", pricing: { finalPrice: "999" } },
  { type: "form_survey", name: "Survey/Quiz", category: "forms", icon: "📋", defaultContent: "Start Assessment", fields: [{ label: "What is your main goal?", type: "text" }, { label: "Your Best Email", type: "email" }] },
  { type: "phone_input", name: "SMS Capture", category: "forms", icon: "📞", defaultContent: "Get SMS Alerts", fields: [{ label: "Mobile Number (+91)", type: "tel" }] },
  { type: "dropdown_input", name: "Dropdown Select", category: "forms", icon: "▾", defaultContent: "Starter Plan|Pro Business Plan|Enterprise Plan" },
  { type: "radio_buttons", name: "Radio Selection", category: "forms", icon: "🔘", defaultContent: "Pay Monthly ($29/mo)|Pay Annually ($19/mo - Save 35%)" },
  { type: "checkboxes", name: "Multi-Checkbox", category: "forms", icon: "☑", defaultContent: "Include Source Code|Include Priority Support|Include White-Label Rights" },
  { type: "date_picker", name: "Date Selector", category: "forms", icon: "📅", defaultContent: "Schedule Consultation Date" },
  { type: "time_picker", name: "Time Selector", category: "forms", icon: "⏰", defaultContent: "Select Preferred Time Slot" },
  { type: "file_upload", name: "File Uploader", category: "forms", icon: "📤", defaultContent: "Upload Documents (.pdf, .png, .zip)" },
  { type: "signature_pad", name: "Digital Signature", category: "forms", icon: "✍", defaultContent: "Sign Digitally Above" },
  { type: "rating_input", name: "Star Rating Input", category: "forms", icon: "⭐", defaultContent: "Rate Your Experience (1 to 5 Stars)" },
  { type: "range_slider", name: "Range Slider", category: "forms", icon: "🎚️", defaultContent: "Monthly Ad Budget: ₹10,000 - ₹5,00,000" },
  { type: "color_picker", name: "Color Picker", category: "forms", icon: "🎨", defaultContent: "Choose Custom Brand Color" },
  { type: "toggle_switch", name: "Toggle Switch", category: "forms", icon: "🎛️", defaultContent: "Enable Instant WhatsApp Notifications" },
  { type: "captcha", name: "Anti-Spam Captcha", category: "forms", icon: "🤖", defaultContent: "I am not a robot (Cloudflare Turnstile Verified)" },
  { type: "hidden_field", name: "Hidden Tracking Field", category: "forms", icon: "👁️‍🗨️", defaultContent: "utm_source=facebook_ads" },
  { type: "autocomplete", name: "Address Autocomplete", category: "forms", icon: "📍", defaultContent: "Enter Billing Street Address, City, PIN..." },
  { type: "password_input", name: "Password Setup", category: "forms", icon: "🔑", defaultContent: "Create Account Password" },
  { type: "login_form", name: "Login Portal", category: "forms", icon: "🔓", defaultContent: "Access Dashboard", fields: [{ label: "Email / Details", type: "email" }] },
  { type: "multi_step", name: "Multi-Step Form", category: "forms", icon: "📑", defaultContent: "Step 1: Profile -> Step 2: Preferences -> Step 3: Finish" },
  { type: "gdpr_box", name: "GDPR Consent", category: "forms", icon: "⚖️", defaultContent: "I agree to the Terms of Service & Privacy Policy." },
  { type: "coupon_input", name: "Promo Code Field", category: "forms", icon: "🎟", defaultContent: "LAUNCH50" },
  { type: "order_bump", name: "Order Bump Checkbox", category: "forms", icon: "⚡", defaultContent: "Yes! Add VIP 1-on-1 Coaching Call for just ₹499" },

  // --- 🎯 5. MARKETING & CONVERSION (30) ---
  { type: "button_primary", name: "Primary CTA", category: "marketing", icon: "🔥", defaultContent: "Get Started Now", styles: { backgroundColor: "#4f46e5", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "button_outline", name: "Outline Button", category: "marketing", icon: "🔳", defaultContent: "Learn More", styles: { color: "#4f46e5", backgroundColor: "transparent", padding: "14px 28px", borderRadius: "8px", border: "2px solid #4f46e5" } },
  { type: "button_animated", name: "Pulsing Button", category: "marketing", icon: "💓", defaultContent: "Claim Special Offer Now!", styles: { backgroundColor: "#ef4444", color: "#ffffff", padding: "16px 32px", borderRadius: "10px" } },
  { type: "countdown_timer", name: "Scarcity Countdown", category: "marketing", icon: "⏳", defaultContent: "00 : 14 : 59" },
  { type: "evergreen_timer", name: "Evergreen Timer", category: "marketing", icon: "⏱️", defaultContent: "23 : 59 : 45" },
  { type: "pricing_table", name: "Pricing Tiers", category: "marketing", icon: "💲", defaultContent: "Starter: ₹499/mo | Pro: ₹1,499/mo | Agency: ₹4,999/mo" },
  { type: "testimonial_card", name: "Review Card", category: "marketing", icon: "💬", defaultContent: "'This funnel builder tripled our conversion rate in 7 days!' - Rahul S., Founder" },
  { type: "testimonial_slider", name: "Review Carousel", category: "marketing", icon: "🎡", defaultContent: "★★★★★ 'Best tool ever!' | ★★★★★ '10x ROI in 2 weeks!'" },
  { type: "trust_badges", name: "Secure Badges", category: "marketing", icon: "🛡", defaultContent: "256-Bit SSL Encrypted • Razorpay Verified • 100% Money Back" },
  { type: "social_proof_toast", name: "Live Sales Popup", category: "marketing", icon: "🔔", defaultContent: "Amit from Mumbai just purchased the Pro Funnel Bundle (2 mins ago)" },
  { type: "exit_intent", name: "Exit Intent Popup", category: "marketing", icon: "🚪", defaultContent: "WAIT! Don't leave empty-handed. Grab your 20% discount voucher!" },
  { type: "progress_bar", name: "Completion Bar", category: "marketing", icon: "▰", defaultContent: "Step 2 of 2: 85% Complete - Almost Ready!" },
  { type: "scarcity_ribbon", name: "Alert Ribbon", category: "marketing", icon: "🎗️", defaultContent: "🔥 HURRY! Only 3 spots left at this discounted price!" },
  { type: "feature_grid", name: "Benefit Grid", category: "marketing", icon: "🎛", defaultContent: "⚡ Ultra Fast|🔒 Bank-Grade Security|🤖 AI Copywriter|📈 Live CRM" },
  { type: "faq_accordion", name: "FAQ Dropdowns", category: "marketing", icon: "❓", defaultContent: "Do I need coding skills? No, 100% drag & drop.|Can I use my own domain? Yes, full custom domain support.|Is there a refund policy? Yes, 30-day money-back guarantee." },
  { type: "timeline", name: "Process Timeline", category: "marketing", icon: "📈", defaultContent: "Phase 1: Choose Template -> Phase 2: Customize with AI -> Phase 3: Publish & Profit" },
  { type: "comparison_table", name: "Us vs Them", category: "marketing", icon: "⚖️", defaultContent: "Our AI Builder (₹499, All-in-One) vs Expensive Competitors (₹8,000/mo)" },
  { type: "guarantee_box", name: "Money-Back Guarantee", category: "marketing", icon: "🏆", defaultContent: "30-Day 100% Iron-Clad No Questions Asked Money-Back Guarantee" },
  { type: "video_sales_letter", name: "VSL Wrapper", category: "marketing", icon: "🎬", defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { type: "animated_headline", name: "Attention Headline", category: "marketing", icon: "🚨", defaultContent: "ATTENTION MARKETERS: Stop Paying For 10 Different Tools!" },
  { type: "step_indicator", name: "Step Counter", category: "marketing", icon: "🔢", defaultContent: "1. Account Details  ➔  2. Payment  ➔  3. Instant Access" },
  { type: "urgency_text", name: "Urgency Blinker", category: "marketing", icon: "🔴", defaultContent: "Live Now: 231 people are viewing this offer right now." },
  { type: "confetti_trigger", name: "Confetti Success", category: "marketing", icon: "🎊", defaultContent: "🎉 Congratulations! Your Order Is Confirmed! 🎊" },
  { type: "scratch_card", name: "Digital Scratch Card", category: "marketing", icon: "🎫", defaultContent: "🎁 BONUS UNLOCKED: Use Code VIP50 for 50% OFF!" },
  { type: "wheel_of_fortune", name: "Spin the Wheel", category: "marketing", icon: "🎡", defaultContent: "Spin the Lucky Wheel to Win Up to 70% Discount!" },
  { type: "audio_testimonial", name: "Voice Note Review", category: "marketing", icon: "🎙️", defaultContent: "Listen toVerified Customer Audio Review (0:42)" },
  { type: "notification_bar", name: "Sticky Top Bar", category: "marketing", icon: "🔝", defaultContent: "⚡ Special Launch Offer: Get Lifetime Access Today!" },
  { type: "popup_trigger", name: "Modal Button", category: "marketing", icon: "🪟", defaultContent: "Click to Open Instant Free Training Popup" },
  { type: "scroll_indicator", name: "Scroll Progress", category: "marketing", icon: "📜", defaultContent: "Scroll Down to Discover the Secret ⇩" },
  { type: "locked_content", name: "Content Locker", category: "marketing", icon: "🔒", defaultContent: "Enter your email or share on WhatsApp to unlock the secret blueprint." },

  // --- 🛒 6. E-COMMERCE & WEB3 (20) ---
  { type: "product_card", name: "Product Card", category: "ecommerce", icon: "🛍️", defaultContent: "Digital Marketing Mastery Bundle | ₹999", pricing: { finalPrice: "999" } },
  { type: "add_to_cart", name: "Add to Cart Btn", category: "ecommerce", icon: "🛒", defaultContent: "Add to Cart - ₹499", styles: { backgroundColor: "#10b981", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" }, pricing: { finalPrice: "499" } },
  { type: "cart_summary", name: "Order Summary", category: "ecommerce", icon: "🧾", defaultContent: "Product: Funnel OS Pro (₹999) | Discount: -₹500 | Total Payable: ₹499" },
  { type: "stripe_element", name: "Stripe Payment", category: "ecommerce", icon: "💳", defaultContent: "Pay via International Credit / Debit Card (Stripe)" },
  { type: "paypal_btn", name: "PayPal Express", category: "ecommerce", icon: "🅿️", defaultContent: "Checkout with PayPal Express" },
  { type: "razorpay_btn", name: "Razorpay Checkout", category: "ecommerce", icon: "₹", defaultContent: "Pay Now (UPI / GPay / PhonePe / Cards)", pricing: { rate: "999", discount: "500", finalPrice: "499" } },
  { type: "crypto_pay", name: "Web3 Wallet Pay", category: "ecommerce", icon: "🪙", defaultContent: "Pay with Crypto (USDT / ETH / Polygon via MetaMask)" },
  { type: "mini_cart", name: "Floating Mini Cart", category: "ecommerce", icon: "👜", defaultContent: "🛒 1 Item in Cart (₹499) - Proceed to Checkout" },
  { type: "product_rating", name: "Aggregate Rating", category: "ecommerce", icon: "🌟", defaultContent: "⭐⭐⭐⭐⭐ 4.9/5 Rating (Based on 1,420+ Verified Buyers)" },
  { type: "sku_display", name: "Product SKU", category: "ecommerce", icon: "🏷️", defaultContent: "SKU: SAAS-PRO-2026 | Instant Digital Delivery" },
  { type: "inventory_status", name: "Stock Status", category: "ecommerce", icon: "📦", defaultContent: "⚡ In Stock: Only 4 Licenses Remaining at Launch Price!" },
  { type: "currency_switcher", name: "Currency Selector", category: "ecommerce", icon: "💱", defaultContent: "🇮🇳 INR (₹) | 🇺🇸 USD ($) | 🇪🇺 EUR (€) | 🇬🇧 GBP (£)" },
  { type: "shipping_calc", name: "Shipping Calculator", category: "ecommerce", icon: "🚚", defaultContent: "Enter Area PIN Code to Check Delivery Availability" },
  { type: "tax_calc", name: "Dynamic Tax", category: "ecommerce", icon: "🏛️", defaultContent: "18% GST Included in Final Price (GST Invoice Provided)" },
  { type: "upsell_grid", name: "You May Also Like", category: "ecommerce", icon: "🎁", defaultContent: "Add 50+ Done-For-You Funnel Templates (+₹299) | Add AI Copy Pack (+₹199)" },
  { type: "variant_selector", name: "Color/Size Variants", category: "ecommerce", icon: "👕", defaultContent: "License Tier: Single Site | 5 Sites | Unlimited Agency" },
  { type: "subscription_toggle", name: "Subscribe & Save", category: "ecommerce", icon: "🔁", defaultContent: "One-Time Purchase: ₹1,999 | Monthly Subscription: ₹499/mo" },
  { type: "donation_meter", name: "Fundraising Goal", category: "ecommerce", icon: "💖", defaultContent: "₹85,000 Raised of ₹1,00,000 Community Goal (85%)" },
  { type: "tip_jar", name: "Creator Tip Jar", category: "ecommerce", icon: "☕", defaultContent: "Support the Creator: Buy Me a Chai ☕ (₹99)" },
  { type: "invoice_download", name: "Download Receipt", category: "ecommerce", icon: "📥", defaultContent: "Download Official Tax Invoice & Product Access PDF" },

  // --- 🌐 7. SOCIAL & COMMUNITY (15) ---
  { type: "social_share", name: "Share Buttons", category: "social", icon: "🔗", defaultContent: "Share on: WhatsApp | Facebook | X (Twitter) | LinkedIn" },
  { type: "fb_comments", name: "Facebook Comments", category: "social", icon: "📘", defaultContent: "142 Comments • Sort by: Top" },
  { type: "twitter_feed", name: "X/Twitter Feed", category: "social", icon: "🐦", defaultContent: "@USBullishVista: Just launched the most powerful AI Funnel Builder of 2026! 🚀🔥" },
  { type: "insta_grid", name: "Instagram Grid", category: "social", icon: "📸", defaultContent: "@OurBrand • Follow us on Instagram for daily growth hacks" },
  { type: "discord_invite", name: "Discord Embed", category: "social", icon: "👾", defaultContent: "Join Our VIP Founders Discord Server (640+ Members Online)" },
  { type: "telegram_chat", name: "Telegram Button", category: "social", icon: "✈️", defaultContent: "Join Official Telegram Broadcast Channel ➔" },
  { type: "whatsapp_float", name: "WhatsApp Float", category: "social", icon: "💬", defaultContent: "Chat with Support on WhatsApp (+91)" },
  { type: "linkedin_badge", name: "LinkedIn Profile", category: "social", icon: "👔", defaultContent: "Connect with Founder on LinkedIn" },
  { type: "tiktok_embed", name: "Short Video Embed", category: "social", icon: "🎵", defaultContent: "Watch 60-Second Product Demo Reel" },
  { type: "disqus_forum", name: "Community Thread", category: "social", icon: "🗣️", defaultContent: "Community Q&A Discussion Board" },
  { type: "youtube_subscribe", name: "YT Subscribe Btn", category: "social", icon: "▶️", defaultContent: "Subscribe on YouTube (US Bullish Vista)" },
  { type: "pinterest_pin", name: "Pinterest Save", category: "social", icon: "📌", defaultContent: "Save Infographic to Pinterest" },
  { type: "github_repo", name: "GitHub Repo Card", category: "social", icon: "🐙", defaultContent: "⭐ Star Our Open-Source SDK on GitHub" },
  { type: "reddit_embed", name: "Reddit Thread", category: "social", icon: "🤖", defaultContent: "Trending Discussion on r/SaaS & r/Entrepreneur" },
  { type: "medium_blog", name: "Medium Article", category: "social", icon: "📰", defaultContent: "Read Our Case Study: How Funnels Beat Traditional Websites" },

  // --- 🛠️ 8. ADVANCED & UTILITIES (15) ---
  { type: "custom_html", name: "HTML Snippet", category: "advanced", icon: "🧬", defaultContent: "<div style='padding:12px;background:#eef2ff;border-radius:8px;color:#312e81;font-weight:bold;'>Custom HTML Block Active</div>" },
  { type: "custom_css", name: "CSS Injector", category: "advanced", icon: "🎨", defaultContent: "/* Custom Page CSS Active */" },
  { type: "custom_js", name: "JS Script", category: "advanced", icon: "⚙️", defaultContent: "// Facebook Pixel / Google Analytics Tag Active" },
  { type: "iframe_embed", name: "Iframe Embed", category: "advanced", icon: "🪟", defaultContent: "https://example.com" },
  { type: "google_maps", name: "Google Map", category: "advanced", icon: "🗺️", defaultContent: "Bhopal, Madhya Pradesh, India" },
  { type: "calendly_embed", name: "Calendly Booking", category: "advanced", icon: "📆", defaultContent: "Book a 15-Minute Discovery Call on Calendly" },
  { type: "webhook_trigger", name: "Webhook Trigger", category: "advanced", icon: "🪝", defaultContent: "https://hooks.zapier.com/hooks/catch/123456/abcdef/" },
  { type: "ab_test_split", name: "A/B Split Test", category: "advanced", icon: "🔀", defaultContent: "Variant A (50% Traffic) vs Variant B (50% Traffic)" },
  { type: "seo_meta_block", name: "SEO Meta Tags", category: "advanced", icon: "🔍", defaultContent: "Title: High-Converting Funnel | Meta Description: Powered by Free AI Funnel Builder" },
  { type: "cookie_banner", name: "Cookie Consent", category: "advanced", icon: "🍪", defaultContent: "We use cookies to improve your experience. [Accept]" },
  { type: "live_chat_widget", name: "AI Live Chat", category: "advanced", icon: "💬", defaultContent: "👋 Hi! Have a question? Ask our AI Assistant!" },
  { type: "breadcrumbs", name: "Breadcrumbs Nav", category: "advanced", icon: "🧭", defaultContent: "Home  /  Products  /  Special Offer" },
  { type: "search_bar", name: "Site Search Bar", category: "advanced", icon: "🔎", defaultContent: "Search articles, products, FAQs..." },
  { type: "dark_mode_switch", name: "Theme Switcher", category: "advanced", icon: "🌓", defaultContent: "Toggle Light / Dark Page Theme" },
  { type: "back_to_top", name: "Back to Top Btn", category: "advanced", icon: "⬆️", defaultContent: "↑ Back to Top" },
];

const CATEGORIES = [
  { id: "layout", label: "📐 STRUCTURE" },
  { id: "text", label: "📝 TYPOGRAPHY" },
  { id: "media", label: "📸 MEDIA ITEMS" },
  { id: "forms", label: "⚡ FORMS & GEN" },
  { id: "marketing", label: "🎯 CONVERSION" },
  { id: "ecommerce", label: "🛒 E-COMMERCE" },
  { id: "social", label: "🌐 COMMUNITY" },
  { id: "advanced", label: "🛠️ ADVANCED" },
];

export default function WebsiteBuilderPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1536] text-white flex items-center justify-center font-black tracking-widest text-xs uppercase animate-pulse">Loading Builder OS...</div>}>
      <FunnelBuilderCoreEngine />
    </Suspense>
  );
}

function FunnelBuilderCoreEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFunnelId = searchParams.get("id");

  // =========================================================================
  // 🧠 MASTER STATES (MULTI-STEP, UI, DB, AI, RESPONSIVE)
  // =========================================================================
  const [funnelId, setFunnelId] = useState(urlFunnelId || null);
  const [funnelName, setFunnelName] = useState("My High-Converting Funnel");
  const [funnelSteps, setFunnelSteps] = useState(["landing", "checkout", "thankyou"]);
  const [activeStep, setActiveStep] = useState("landing");

  // Multi-page canvas state: { landing: [...rows], checkout: [...rows], thankyou: [...rows] }
  const [pagesState, setPagesState] = useState({
    landing: [],
    checkout: [],
    thankyou: [],
  });

  // UI & Workspace Controls
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Collapsible Left Sidebar
  const [openCategories, setOpenCategories] = useState(["layout", "text", "forms"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop"); // desktop | tablet | mobile

  // Right Editor Controls
  const [selectedWidgetLoc, setSelectedWidgetLoc] = useState(null); // { rowId, colId, widgetId }
  const [activeEditorTab, setActiveEditorTab] = useState("content"); // content | style | spacing

  // Modals & Loaders
  const [isDatabasePushLoading, setIsDatabasePushLoading] = useState(false);
  const [isPrePublishModalOpen, setIsPrePublishModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState("All changes saved");

  const currentCanvasRows = pagesState[activeStep] || [];

  // Find currently selected widget object from canvas
  const selectedWidget = React.useMemo(() => {
    if (!selectedWidgetLoc) return null;
    const rows = pagesState[activeStep] || [];
    for (const r of rows) {
      if (r.id === selectedWidgetLoc.rowId) {
        for (const c of r.columns) {
          if (c.id === selectedWidgetLoc.colId) {
            return c.widgets.find((w) => w.id === selectedWidgetLoc.widgetId) || null;
          }
        }
      }
    }
    return null;
  }, [selectedWidgetLoc, pagesState, activeStep]);

  // =========================================================================
  // 🔄 LOAD EXISTING FUNNEL FROM SUPABASE OR LOCALSTORAGE
  // =========================================================================
  useEffect(() => {
    const loadFunnelData = async () => {
      if (urlFunnelId) {
        try {
          const { data, error } = await supabase
            .from("funnels")
            .select("*")
            .eq("id", urlFunnelId)
            .maybeSingle();

          if (!error && data) {
            setFunnelId(data.id);
            setFunnelName(data.name || "Untitled Funnel");
            if (data.canvas_state && typeof data.canvas_state === "object") {
              setPagesState((prev) => ({ ...prev, ...data.canvas_state }));
              const loadedSteps = Object.keys(data.canvas_state);
              if (loadedSteps.length > 0) setFunnelSteps(loadedSteps);
            }
            return;
          }
        } catch (err) {
          console.error("Supabase load error:", err.message);
        }
      }

      // Fallback to localStorage draft
      const savedDraft = localStorage.getItem("free_ai_funnel_draft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.pagesState) setPagesState(parsed.pagesState);
          if (parsed.funnelName) setFunnelName(parsed.funnelName);
          if (parsed.funnelId && !urlFunnelId) setFunnelId(parsed.funnelId);
        } catch (e) {
          console.error("Draft parse error:", e);
        }
      }
    };

    loadFunnelData();
  }, [urlFunnelId]);

  // Auto-save to localStorage every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(
        "free_ai_funnel_draft",
        JSON.stringify({ funnelId, funnelName, pagesState })
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [funnelId, funnelName, pagesState]);

  // =========================================================================
  // 🔐 TOP HEADER ACTIONS (LOGOUT, MANUAL SAVE, PUBLISH)
  // =========================================================================
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  // Fixes ReferenceError: handleManualSave is not defined
  const handleManualSave = async () => {
    setSaveStatusText("Saving...");
    localStorage.setItem(
      "free_ai_funnel_draft",
      JSON.stringify({ funnelId, funnelName, pagesState })
    );

    if (funnelId) {
      try {
        await supabase
          .from("funnels")
          .update({ name: funnelName, canvas_state: pagesState })
          .eq("id", funnelId);
      } catch (e) {
        console.error("Auto DB update error:", e);
      }
    }
    setSaveStatusText("✅ Saved!");
    setTimeout(() => setSaveStatusText("All changes saved"), 2500);
  };

  const handlePublishToSupabase = async () => {
    setIsDatabasePushLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;

      if (funnelId) {
        const { error } = await supabase
          .from("funnels")
          .update({
            name: funnelName,
            canvas_state: pagesState,
            status: "Published",
          })
          .eq("id", funnelId);

        if (error) throw error;
      } else {
        const payload = {
          name: funnelName,
          canvas_state: pagesState,
          status: "Published",
        };
        if (userId) payload.user_id = userId;

        const { data, error } = await supabase
          .from("funnels")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data?.id) {
          setFunnelId(data.id);
          window.history.replaceState(null, "", `/builder?id=${data.id}`);
        }
      }

      setIsPrePublishModalOpen(false);
      alert("🚀 Funnel Published Successfully! Opening live preview...");
    } catch (err) {
      alert("Error publishing to database: " + err.message);
    } finally {
      setIsDatabasePushLoading(false);
    }
  };

  // =========================================================================
  // 📐 ROW & WIDGET MANIPULATION FUNCTIONS
  // =========================================================================
  const updateCurrentStepRows = (updaterFn) => {
    setPagesState((prev) => ({
      ...prev,
      [activeStep]: updaterFn(prev[activeStep] || []),
    }));
  };

  const createColumnsForLayout = (layoutType) => {
    const ts = Date.now();
    if (layoutType === "layout_2") return [{ id: `col_${ts}_1`, widthPercent: 50, widgets: [] }, { id: `col_${ts}_2`, widthPercent: 50, widgets: [] }];
    if (layoutType === "layout_3") return [{ id: `col_${ts}_1`, widthPercent: 33.33, widgets: [] }, { id: `col_${ts}_2`, widthPercent: 33.33, widgets: [] }, { id: `col_${ts}_3`, widthPercent: 33.33, widgets: [] }];
    if (layoutType === "layout_4") return [1, 2, 3, 4].map((n) => ({ id: `col_${ts}_${n}`, widthPercent: 25, widgets: [] }));
    if (layoutType === "layout_5") return [1, 2, 3, 4, 5].map((n) => ({ id: `col_${ts}_${n}`, widthPercent: 20, widgets: [] }));
    if (layoutType === "layout_6") return [1, 2, 3, 4, 5, 6].map((n) => ({ id: `col_${ts}_${n}`, widthPercent: 16.66, widgets: [] }));
    if (layoutType === "layout_left_sidebar") return [{ id: `col_${ts}_1`, widthPercent: 30, widgets: [] }, { id: `col_${ts}_2`, widthPercent: 70, widgets: [] }];
    if (layoutType === "layout_right_sidebar") return [{ id: `col_${ts}_1`, widthPercent: 70, widgets: [] }, { id: `col_${ts}_2`, widthPercent: 30, widgets: [] }];
    return [{ id: `col_${ts}_1`, widthPercent: 100, widgets: [] }];
  };

  const addSectionRow = (layoutType = "layout_1") => {
    const newRow = {
      id: `row_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: layoutType,
      columns: createColumnsForLayout(layoutType),
    };
    updateCurrentStepRows((rows) => [...rows, newRow]);
  };

  const createWidgetInstance = (template) => ({
    id: `widget_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: template.type,
    name: template.name,
    category: template.category,
    icon: template.icon,
    content: template.defaultContent || "",
    redirectUrl: "",
    fields: template.fields ? [...template.fields] : undefined,
    pricing: template.pricing ? { ...template.pricing } : { rate: "999", discount: "500", finalPrice: "499" },
    styles: {
      color: template.styles?.color || "#0f172a",
      backgroundColor: template.styles?.backgroundColor || "transparent",
      fontSize: template.styles?.fontSize || "16px",
      fontWeight: template.styles?.fontWeight || "normal",
      textAlign: template.styles?.textAlign || "left",
      borderRadius: template.styles?.borderRadius || "8px",
      paddingTop: template.styles?.paddingTop || "8px",
      paddingBottom: template.styles?.paddingBottom || "8px",
      paddingLeft: template.styles?.paddingLeft || "12px",
      paddingRight: template.styles?.paddingRight || "12px",
      verticalSpace: template.styles?.verticalSpace || "40px",
      thickness: template.styles?.thickness || "2px",
      verticalMargin: template.styles?.verticalMargin || "20px",
    },
  });

  // Click-to-add OR Drag-and-Drop support
  const handleAddWidgetDirectly = (template) => {
    if (template.category === "layout" && template.type.startsWith("layout_")) {
      addSectionRow(template.type);
      return;
    }

    const newWidget = createWidgetInstance(template);
    updateCurrentStepRows((rows) => {
      if (rows.length === 0) {
        const defaultRow = {
          id: `row_${Date.now()}`,
          type: "layout_1",
          columns: [{ id: `col_${Date.now()}_1`, widthPercent: 100, widgets: [newWidget] }],
        };
        setSelectedWidgetLoc({ rowId: defaultRow.id, colId: defaultRow.columns[0].id, widgetId: newWidget.id });
        return [defaultRow];
      }
      const updated = [...rows];
      const lastRow = { ...updated[updated.length - 1] };
      const firstCol = { ...lastRow.columns[0], widgets: [...lastRow.columns[0].widgets, newWidget] };
      lastRow.columns = [firstCol, ...lastRow.columns.slice(1)];
      updated[updated.length - 1] = lastRow;
      setSelectedWidgetLoc({ rowId: lastRow.id, colId: firstCol.id, widgetId: newWidget.id });
      return updated;
    });
  };

  const handleDragStart = (e, template) => {
    e.dataTransfer.setData("widgetTemplate", JSON.stringify(template));
  };

  const handleDrop = (e, targetRowId, targetColId) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("widgetTemplate");
    if (!raw) return;
    const template = JSON.parse(raw);

    if (template.category === "layout" && template.type.startsWith("layout_")) {
      addSectionRow(template.type);
      return;
    }

    const newWidget = createWidgetInstance(template);

    if (!targetRowId || !targetColId) {
      handleAddWidgetDirectly(template);
      return;
    }

    updateCurrentStepRows((rows) =>
      rows.map((r) => {
        if (r.id !== targetRowId) return r;
        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id !== targetColId) return c;
            return { ...c, widgets: [...c.widgets, newWidget] };
          }),
        };
      })
    );
    setSelectedWidgetLoc({ rowId: targetRowId, colId: targetColId, widgetId: newWidget.id });
  };

  const moveWidget = (rowId, colId, widgetId, direction) => {
    updateCurrentStepRows((rows) =>
      rows.map((r) => {
        if (r.id !== rowId) return r;
        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id !== colId) return c;
            const idx = c.widgets.findIndex((w) => w.id === widgetId);
            if (idx === -1) return c;
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= c.widgets.length) return c;
            const copy = [...c.widgets];
            const [item] = copy.splice(idx, 1);
            copy.splice(targetIdx, 0, item);
            return { ...c, widgets: copy };
          }),
        };
      })
    );
  };

  const deleteWidget = (rowId, colId, widgetId) => {
    updateCurrentStepRows((rows) =>
      rows.map((r) => {
        if (r.id !== rowId) return r;
        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id !== colId) return c;
            return { ...c, widgets: c.widgets.filter((w) => w.id !== widgetId) };
          }),
        };
      })
    );
    if (selectedWidgetLoc?.widgetId === widgetId) setSelectedWidgetLoc(null);
  };

  const updateSelectedWidget = (mutatorFn) => {
    if (!selectedWidgetLoc) return;
    updateCurrentStepRows((rows) =>
      rows.map((r) => {
        if (r.id !== selectedWidgetLoc.rowId) return r;
        return {
          ...r,
          columns: r.columns.map((c) => {
            if (c.id !== selectedWidgetLoc.colId) return c;
            return {
              ...c,
              widgets: c.widgets.map((w) =>
                w.id === selectedWidgetLoc.widgetId ? mutatorFn(w) : w
              ),
            };
          }),
        };
      })
    );
  };

  // =========================================================================
  // 🤖 AI ENHANCER & AUTO-BUILDER
  // =========================================================================
  const handleEnhanceWithAI = async () => {
    if (!selectedWidget) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Rewrite and enhance this marketing copy to be ultra high-converting and persuasive. Return ONLY the enhanced text without quotes: "${selectedWidget.content}"`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const enhanced = data.result || data.text || data.content;
        if (enhanced) {
          updateSelectedWidget((w) => ({ ...w, content: enhanced.trim() }));
          setIsAiGenerating(false);
          return;
        }
      }
      // Smart instant fallback if API route isn't configured
      updateSelectedWidget((w) => ({
        ...w,
        content: `🔥 ${w.content} — Unlock 10x Faster Results Today (100% Risk-Free!)`,
      }));
    } catch {
      updateSelectedWidget((w) => ({
        ...w,
        content: `🚀 ${w.content} (Limited Time VIP Access)`,
      }));
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAutoBuildFunnelWithAI = () => {
    const topic = aiPrompt.trim() || "Digital Marketing & SaaS Automation";
    const ts = Date.now();
    const generatedLanding = [
      {
        id: `row_${ts}_1`,
        type: "layout_1",
        columns: [
          {
            id: `col_${ts}_1`,
            widthPercent: 100,
            widgets: [
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "urgency_text")), content: `🔥 Special Live Training on ${topic} — Limited Spots Available!` },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "h1")), content: `How To Master ${topic} & Scale Your Revenue In 30 Days`, styles: { color: "#0f172a", fontSize: "40px", fontWeight: "900", textAlign: "center", paddingTop: "12px", paddingBottom: "12px" } },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "paragraph")), content: `Stop guessing and start scaling. Use our proven step-by-step system for ${topic} without technical headaches.`, styles: { color: "#475569", fontSize: "18px", textAlign: "center", paddingBottom: "16px" } },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "form_contact")), name: `Claim Your ${topic} Blueprint`, content: "Get Instant Access ➔" },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "trust_badges")) },
            ],
          },
        ],
      },
    ];

    const generatedCheckout = [
      {
        id: `row_${ts}_2`,
        type: "layout_1",
        columns: [
          {
            id: `col_${ts}_2`,
            widthPercent: 100,
            widgets: [
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "h2")), content: `Complete Your Enrollment: ${topic} Pro`, styles: { color: "#0f172a", fontSize: "30px", fontWeight: "900", textAlign: "center" } },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "check_list")), content: "Instant Lifetime Access\nDone-For-You Templates Included\n30-Day Money-Back Guarantee" },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "razorpay_btn")), pricing: { rate: "1999", discount: "1500", finalPrice: "499" } },
            ],
          },
        ],
      },
    ];

    const generatedThankYou = [
      {
        id: `row_${ts}_3`,
        type: "layout_1",
        columns: [
          {
            id: `col_${ts}_3`,
            widthPercent: 100,
            widgets: [
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "confetti_trigger")) },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "h1")), content: "Welcome Aboard! Your Access Is Ready", styles: { color: "#10b981", fontSize: "36px", fontWeight: "900", textAlign: "center" } },
              { ...createWidgetInstance(ELEMENTOR_WIDGET_CATALOG.find((w) => w.type === "invoice_download")) },
            ],
          },
        ],
      },
    ];

    setPagesState((prev) => ({
      ...prev,
      landing: generatedLanding,
      checkout: generatedCheckout,
      thankyou: generatedThankYou,
    }));
    setActiveStep("landing");
    setIsAiModalOpen(false);
    setAiPrompt("");
  };

  // =========================================================================
  // 🎨 MASTER 150-WIDGET INTERACTIVE CANVAS RENDERER
  // =========================================================================
  const renderCanvasWidget = (widget) => {
    const wType = widget.type;
    const s = widget.styles || {};
    const wrapStyle = {
      color: s.color || "#0f172a",
      backgroundColor: s.backgroundColor || "transparent",
      fontSize: s.fontSize || "16px",
      fontWeight: s.fontWeight || "normal",
      textAlign: s.textAlign || "left",
      paddingTop: s.paddingTop || "8px",
      paddingBottom: s.paddingBottom || "8px",
      paddingLeft: s.paddingLeft || "12px",
      paddingRight: s.paddingRight || "12px",
      borderRadius: s.borderRadius || "8px",
    };

    // --- 1. STRUCTURAL UTILITIES ---
    if (wType === "spacer") {
      return (
        <div style={{ height: s.verticalSpace || "40px" }} className="w-full border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-mono">
          ↕ Spacer ({s.verticalSpace || "40px"})
        </div>
      );
    }
    if (wType === "divider") {
      return (
        <div style={{ padding: `${s.verticalMargin || "20px"} 0` }} className="w-full">
          <div style={{ borderTop: `${s.thickness || "2px"} solid ${s.color || "#e2e8f0"}` }} />
        </div>
      );
    }

    // --- 2. TYPOGRAPHY & TEXT (ALL 20) ---
    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(wType)) {
      return <div style={wrapStyle} className="m-0 leading-tight tracking-tight">{widget.content}</div>;
    }
    if (wType === "paragraph") {
      return <p style={wrapStyle} className="m-0 leading-relaxed">{widget.content}</p>;
    }
    if (wType === "blockquote") {
      return <blockquote style={wrapStyle} className="border-l-4 border-indigo-600 pl-4 italic bg-slate-50 rounded-r-lg">{widget.content}</blockquote>;
    }
    if (wType === "text_highlight") {
      return <div style={{ textAlign: s.textAlign }} className="p-2"><span style={wrapStyle} className="inline-block px-3 py-1 rounded font-bold shadow-sm">{widget.content}</span></div>;
    }
    if (wType === "gradient_text") {
      return (
        <h2 style={{ ...wrapStyle, background: "linear-gradient(90deg, #4f46e5, #ec4899, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} className="font-black leading-tight">
          {widget.content}
        </h2>
      );
    }
    if (wType === "text_outline") {
      return (
        <div className="p-3 border border-slate-200 rounded bg-slate-50/50">
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Outline Text Component</span>
          <div style={{ ...wrapStyle, WebkitTextStroke: `1.5px ${s.color || "#0f172a"}`, color: "transparent" }} className="font-black text-2xl tracking-wider uppercase">
            {widget.content}
          </div>
        </div>
      );
    }
    if (wType === "animated_typing") {
      const words = (widget.content || "").split("|");
      return (
        <div style={wrapStyle} className="font-black text-xl">
          <span>We Help You </span>
          <span className="text-indigo-600 underline decoration-wavy">{words[0] || "Scale"}</span>
          <span className="animate-pulse text-indigo-600">|</span>
        </div>
      );
    }
    if (wType === "dropcap") {
      const text = widget.content || "Once upon a time...";
      return (
        <p style={wrapStyle} className="leading-relaxed">
          <span className="float-left text-4xl font-black text-indigo-600 mr-3 leading-none bg-indigo-50 px-2.5 py-1.5 rounded-lg">{text.charAt(0)}</span>
          {text.slice(1)}
        </p>
      );
    }
    if (wType === "tooltip_text") {
      return (
        <div style={wrapStyle} className="inline-flex items-center gap-2">
          <span className="underline decoration-dotted cursor-help font-semibold">{widget.content}</span>
          <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">💬 Tooltip Active</span>
        </div>
      );
    }
    if (wType === "marquee") {
      return (
        <div style={wrapStyle} className="bg-indigo-950 text-white py-2.5 px-4 rounded-lg overflow-hidden whitespace-nowrap font-bold text-xs tracking-wider uppercase">
          ↔️ {widget.content} &nbsp; • &nbsp; {widget.content}
        </div>
      );
    }
    if (wType === "code_block") {
      return <pre style={wrapStyle} className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto">{widget.content}</pre>;
    }
    if (["bullet_list", "check_list", "cross_list", "numbered_list"].includes(wType)) {
      const items = (widget.content || "").split("\n").filter(Boolean);
      return (
        <ul style={wrapStyle} className="space-y-1.5 m-0 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="font-bold text-indigo-600 shrink-0">
                {wType === "check_list" ? "✅" : wType === "cross_list" ? "❌" : wType === "numbered_list" ? `${idx + 1}.` : "•"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    // --- 3. MEDIA & VISUALS (ALL 15) ---
    if (wType === "image" || wType === "gif_player") {
      return (
        <div style={wrapStyle} className="flex justify-center">
          <img src={widget.content} alt={widget.name} className="max-w-full h-auto rounded-xl shadow-sm max-h-96 object-cover" />
        </div>
      );
    }
    if (wType === "video_embed" || wType === "video_sales_letter" || wType === "tiktok_embed") {
      return (
        <div style={wrapStyle}>
          <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <iframe src={widget.content} className="w-full h-full border-0" allowFullScreen title={widget.name} />
          </div>
        </div>
      );
    }
    if (wType === "audio_player" || wType === "audio_testimonial") {
      return (
        <div style={wrapStyle} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <span className="text-2xl">🎙️</span>
          <audio controls src={widget.content} className="w-full h-9" />
        </div>
      );
    }
    if (wType === "image_gallery" || wType === "carousel") {
      const imgs = (widget.content || "").split("|");
      return (
        <div style={wrapStyle} className="grid grid-cols-3 gap-2">
          {imgs.map((item, i) =>
            item.startsWith("http") ? (
              <img key={i} src={item.trim()} className="w-full h-28 object-cover rounded-lg border" alt="Gallery" />
            ) : (
              <div key={i} className="bg-slate-100 h-24 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600 p-2 text-center border">{item}</div>
            )
          )}
        </div>
      );
    }
    if (wType === "qr_code") {
      return (
        <div style={wrapStyle} className="flex flex-col items-center p-4 bg-white border rounded-xl shadow-sm">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(widget.content || "https://vercel.com")}`} alt="QR Code" className="w-32 h-32 rounded border p-1" />
          <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Scan QR Code</span>
        </div>
      );
    }
    if (wType === "chart_bar" || wType === "chart_pie") {
      const bars = (widget.content || "Q1: 40%|Q2: 75%|Q3: 95%").split("|");
      return (
        <div style={wrapStyle} className="p-4 bg-white border rounded-xl space-y-2">
          <div className="text-xs font-black uppercase text-slate-500 mb-2">{widget.name}</div>
          {bars.map((b, i) => {
            const pct = parseInt(b.replace(/[^0-9]/g, "")) || 60;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700"><span>{b}</span></div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // --- 4. ALL FORMS & LEAD CAPTURE WIDGETS (ALL 25) ---
    if (
      wType.includes("form") ||
      [
        "phone_input", "dropdown_input", "radio_buttons", "checkboxes",
        "date_picker", "time_picker", "file_upload", "signature_pad",
        "rating_input", "range_slider", "color_picker", "toggle_switch",
        "captcha", "hidden_field", "autocomplete", "password_input",
        "multi_step", "gdpr_box", "coupon_input", "order_bump",
      ].includes(wType)
    ) {
      return (
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm w-full text-left space-y-3" style={wrapStyle}>
          <h3 className="font-bold text-base text-slate-800 text-center mb-3">{widget.name}</h3>

          {/* Contact / Opt-in / Survey / Login custom fields */}
          {widget.fields ? (
            widget.fields.map((f, i) =>
              f.type === "textarea" ? (
                <textarea key={i} readOnly placeholder={f.label} rows={3} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-xs outline-none" />
              ) : (
                <input key={i} type={f.type} readOnly placeholder={f.label} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-xs outline-none" />
              )
            )
          ) : wType === "dropdown_input" ? (
            <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-xs font-semibold">
              {(widget.content || "Option 1|Option 2").split("|").map((opt, idx) => (
                <option key={idx}>{opt.trim()}</option>
              ))}
            </select>
          ) : wType === "radio_buttons" || wType === "checkboxes" ? (
            <div className="space-y-2">
              {(widget.content || "Option A|Option B").split("|").map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border">
                  <input type={wType === "radio_buttons" ? "radio" : "checkbox"} readOnly checked={idx === 0} className="accent-indigo-600" />
                  <span>{opt.trim()}</span>
                </label>
              ))}
            </div>
          ) : wType === "date_picker" || wType === "time_picker" ? (
            <input type={wType === "date_picker" ? "date" : "time"} readOnly className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-xs" />
          ) : wType === "file_upload" ? (
            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-5 text-center bg-indigo-50/30 text-xs font-bold text-indigo-600">
              📤 {widget.content || "Click or Drag File to Upload"}
            </div>
          ) : wType === "range_slider" ? (
            <div>
              <div className="text-xs font-bold text-slate-600 mb-1">{widget.content}</div>
              <input type="range" readOnly className="w-full accent-indigo-600" />
            </div>
          ) : wType === "rating_input" ? (
            <div className="text-center space-y-1">
              <div className="text-2xl text-amber-400 tracking-widest">★★★★★</div>
              <div className="text-xs text-slate-500">{widget.content}</div>
            </div>
          ) : wType === "order_bump" || wType === "gdpr_box" || wType === "captcha" ? (
            <label className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-slate-800">
              <input type="checkbox" checked readOnly className="w-4 h-4 accent-indigo-600" />
              <span>{widget.content}</span>
            </label>
          ) : (
            <input type="text" readOnly placeholder={widget.content || "Enter details..."} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-xs outline-none" />
          )}

          <button type="button" className="w-full bg-[#0f172a] text-white font-black py-3 rounded-lg text-xs uppercase tracking-wider shadow">
            {widget.content && widget.fields ? widget.content : "SUBMIT DETAILS"}
          </button>
        </div>
      );
    }

    // --- 5. E-COMMERCE & PAYMENTS (ALL 20) ---
    if (wType === "razorpay_btn" || wType === "stripe_element" || wType === "paypal_btn" || wType === "crypto_pay") {
      const price = widget.pricing?.finalPrice || "499";
      return (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/30 shadow-md w-full text-center space-y-3" style={wrapStyle}>
          <div className="flex justify-between items-center border-b pb-2 text-xs font-bold text-slate-600">
            <span>{widget.name}</span>
            <span className="text-emerald-600 text-base font-black">₹{price}</span>
          </div>
          <button type="button" className="w-full bg-emerald-600 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg">
            🔒 {widget.content || `Pay ₹${price} Now`}
          </button>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">100% Secure Encrypted Checkout</div>
        </div>
      );
    }

    // --- 6. BUTTONS & CTAs ---
    if (wType.includes("button") || wType === "add_to_cart" || wType === "popup_trigger" || wType === "telegram_chat" || wType === "whatsapp_float" || wType === "youtube_subscribe" || wType === "invoice_download") {
      return (
        <div style={{ textAlign: s.textAlign || "center" }} className="py-2">
          <button
            type="button"
            style={{
              backgroundColor: s.backgroundColor === "transparent" ? "#4f46e5" : s.backgroundColor,
              color: s.color === "#0f172a" ? "#ffffff" : s.color,
              borderRadius: s.borderRadius || "8px",
              padding: "14px 28px",
              fontSize: s.fontSize || "15px",
            }}
            className={`font-black uppercase tracking-wider shadow-lg transition-transform ${wType === "button_animated" ? "animate-pulse" : ""}`}
          >
            {widget.icon} {widget.content}
          </button>
        </div>
      );
    }

    // --- 7. MARKETING, TIMERS, FAQ, TESTIMONIALS ---
    if (wType === "countdown_timer" || wType === "evergreen_timer") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center" style={wrapStyle}>
          <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">⏳ Limited Time Offer Ends In</div>
          <div className="font-mono font-black text-2xl text-red-600">{widget.content}</div>
        </div>
      );
    }
    if (wType === "faq_accordion") {
      const faqs = (widget.content || "").split("|");
      return (
        <div style={wrapStyle} className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 flex justify-between">
              <span>❓ {f.trim()}</span>
              <span className="text-indigo-600">+</span>
            </div>
          ))}
        </div>
      );
    }

    // --- 8. UNIVERSAL STYLED CARD FALLBACK FOR REMAINING SPECIALTY WIDGETS ---
    return (
      <div style={wrapStyle} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl bg-white p-2 rounded-lg shadow-sm border">{widget.icon}</span>
          <div>
            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{widget.name}</div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">{widget.content}</div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 🖥️ MAIN BUILDER WORKSPACE RENDER
  // =========================================================================
  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans select-none ${isDarkMode ? "bg-slate-950 text-white" : "bg-[#f1f5f9] text-slate-800"}`}>
      
      {/* =====================================================================
          1. TOP HEADER BAR (WITH STEPS, DARK MODE, UPDATE, PUBLISH & LOGOUT)
      ===================================================================== */}
      <header className="h-14 bg-[#0B1536] border-b border-slate-800 flex items-center justify-between px-3 md:px-5 text-white z-50 shrink-0 shadow-lg">
        {/* Left Brand & Dark Mode */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white w-7 h-7 rounded flex items-center justify-center text-xs font-black shadow transition-all"
            title={isSidebarOpen ? "Hide Elements Sidebar" : "Show Elements Sidebar"}
          >
            {isSidebarOpen ? "◀" : "☰"}
          </button>

          <div className="bg-indigo-600 text-white font-black text-[11px] px-2 py-1 rounded shadow">WB</div>
          <span className="font-black tracking-wider text-xs md:text-sm uppercase hidden sm:inline">Website Builder</span>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="ml-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-black uppercase px-2.5 py-1 rounded flex items-center gap-1 text-amber-400 transition-all"
          >
            {isDarkMode ? "☀️ LIGHT" : "🌙 DARK"}
          </button>
        </div>

        {/* Center Funnel Steps (LANDING | CHECKOUT | THANKYOU | + ADD PAGE) */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-[42vw] sm:max-w-none">
          {funnelSteps.map((step) => (
            <button
              key={step}
              onClick={() => {
                setActiveStep(step);
                setSelectedWidgetLoc(null);
              }}
              className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeStep === step
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {step}
            </button>
          ))}
          <button
            onClick={() => {
              const newStepName = prompt("Enter new page step name (e.g. upsell, bonus):");
              if (newStepName) {
                const clean = newStepName.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (clean && !funnelSteps.includes(clean)) {
                  setFunnelSteps([...funnelSteps, clean]);
                  setPagesState((prev) => ({ ...prev, [clean]: [] }));
                  setActiveStep(clean);
                }
              }
            }}
            className="px-2.5 py-1 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 whitespace-nowrap"
          >
            + ADD PAGE
          </button>
        </div>

        {/* Right Actions: Save, Publish & Top Logout */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono hidden lg:inline mr-1">{saveStatusText}</span>

          <button
            onClick={handleManualSave}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
          >
            💾 Update
          </button>

          <button
            onClick={() => setIsPrePublishModalOpen(true)}
            disabled={isDatabasePushLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            {isDatabasePushLoading ? "Syncing..." : "🚀 Publish"}
          </button>

          {/* 🚪 TOP LOGOUT BUTTON (Always Visible) */}
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all"
            title="Logout from Workspace"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* =====================================================================
          2. MAIN WORKSPACE AREA (LEFT ELEMENTS + CENTER CANVAS + RIGHT EDITOR)
      ===================================================================== */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Floating Re-open Button when Left Sidebar is Hidden */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-40 bg-[#0B1536] hover:bg-indigo-600 text-white px-3 py-2 rounded-r-xl shadow-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-slate-700"
          >
            <span>▶</span> Elements
          </button>
        )}

        {/* =================================================================
            LEFT SIDEBAR (COLLAPSIBLE, 150 ELEMENTS + AI & TEMPLATES)
        ================================================================= */}
        <aside
          className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
            isSidebarOpen ? "w-64" : "w-0 overflow-hidden opacity-0 border-none"
          }`}
        >
          {/* Top Navigation & Search */}
          <div className="p-2.5 border-b border-slate-200 space-y-2 bg-slate-50">
            <div className="flex gap-1.5">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-[#0B1536] hover:bg-slate-800 text-white py-2 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-black"
                title="Hide Sidebar"
              >
                ◀
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 150+ tools..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md outline-none focus:border-indigo-500 text-slate-800"
            />
          </div>

          {/* Accordion Categories (All 150 Elements) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {CATEGORIES.map((cat) => {
              const filteredWidgets = ELEMENTOR_WIDGET_CATALOG.filter(
                (w) =>
                  w.category === cat.id &&
                  w.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (searchQuery && filteredWidgets.length === 0) return null;
              const isOpen = openCategories.includes(cat.id) || searchQuery.length > 0;

              return (
                <div key={cat.id} className="border border-slate-200 rounded-md overflow-hidden bg-white">
                  <button
                    onClick={() =>
                      setOpenCategories((prev) =>
                        prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex justify-between items-center text-[10px] font-black text-slate-700 uppercase tracking-wider"
                  >
                    <span>{cat.label}</span>
                    <span className="text-slate-400">{isOpen ? "▾" : "▸"}</span>
                  </button>

                  {isOpen && (
                    <div className="p-1.5 space-y-1 bg-white">
                      {filteredWidgets.map((w) => (
                        <div
                          key={w.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, w)}
                          onClick={() => handleAddWidgetDirectly(w)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/40 cursor-pointer transition-all text-slate-700"
                        >
                          <span className="text-xs font-bold w-5 text-center text-indigo-600">{w.icon}</span>
                          <span className="text-[11px] font-semibold truncate">{w.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Fixed Buttons: BUILD WITH AI & TEMPLATES */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow flex items-center justify-center gap-1.5"
            >
              🤖 Build With AI
            </button>
            <button
              onClick={() => setIsTemplatesModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow flex items-center justify-center gap-1.5"
            >
              ✨ Templates
            </button>
          </div>
        </aside>

        {/* =================================================================
            CENTER INTERACTIVE CANVAS
        ================================================================= */}
        <main
          className="flex-1 flex flex-col items-center overflow-y-auto p-4 md:p-8 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, null, null)}
        >
          {/* Device Viewport Switcher (Desktop / Tablet / Mobile) */}
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-1 shadow-sm mb-5 shrink-0">
            {[
              { id: "desktop", icon: "💻", width: "max-w-4xl" },
              { id: "tablet", icon: "📱", width: "max-w-xl" },
              { id: "mobile", icon: "📲", width: "max-w-sm" },
            ].map((dev) => (
              <button
                key={dev.id}
                onClick={() => setDeviceView(dev.id)}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  deviceView === dev.id ? "bg-indigo-100 text-indigo-700 font-bold" : "opacity-60 hover:opacity-100"
                }`}
              >
                {dev.icon}
              </button>
            ))}
          </div>

          {/* Canvas Sheet */}
          <div
            className={`w-full transition-all duration-300 min-h-[780px] rounded-xl shadow-2xl border p-4 md:p-6 ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
            } ${
              deviceView === "mobile"
                ? "max-w-[390px]"
                : deviceView === "tablet"
                ? "max-w-[720px]"
                : "max-w-4xl"
            }`}
          >
            {currentCanvasRows.length === 0 ? (
              <div className="h-[650px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="text-4xl mb-3">✨</div>
                <h2 className="text-lg font-black">Start Building Your Website</h2>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  Click or drag any of the 150+ widgets from the left panel.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => addSectionRow("layout_1")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow"
                  >
                    Add Section Row
                  </button>
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow"
                  >
                    🤖 Auto-Build With AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentCanvasRows.map((row) => (
                  <div
                    key={row.id}
                    className="border border-slate-200 rounded-xl p-3 relative group hover:border-indigo-300 transition-all"
                  >
                    {/* Row Delete Control */}
                    <div className="absolute -top-2.5 right-3 hidden group-hover:flex items-center gap-1 bg-[#0B1536] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-20">
                      <span>Row</span>
                      <button
                        onClick={() => updateCurrentStepRows((rows) => rows.filter((r) => r.id !== row.id))}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ✖
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      {row.columns.map((col) => (
                        <div
                          key={col.id}
                          style={{ flexBasis: `${col.widthPercent}%`, flexGrow: 1 }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.stopPropagation();
                            handleDrop(e, row.id, col.id);
                          }}
                          className="min-h-[80px] rounded-lg p-2 space-y-3 border border-dashed border-slate-200"
                        >
                          {col.widgets.map((widget) => {
                            const isSelected = selectedWidgetLoc?.widgetId === widget.id;
                            return (
                              <div
                                key={widget.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedWidgetLoc({ rowId: row.id, colId: col.id, widgetId: widget.id });
                                }}
                                className={`relative rounded-lg cursor-pointer transition-all ${
                                  isSelected
                                    ? "ring-2 ring-indigo-600 bg-indigo-50/10"
                                    : "hover:ring-1 hover:ring-slate-300"
                                }`}
                              >
                                {/* Widget Action Bar (↑ ↓ ✖) matching screenshot */}
                                {isSelected && (
                                  <div className="absolute -top-3 right-2 flex items-center bg-[#0B1536] text-white rounded shadow-md overflow-hidden z-30 text-[10px]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveWidget(row.id, col.id, widget.id, "up");
                                      }}
                                      className="px-2 py-1 hover:bg-slate-700"
                                      title="Move Up"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        moveWidget(row.id, col.id, widget.id, "down");
                                      }}
                                      className="px-2 py-1 hover:bg-slate-700"
                                      title="Move Down"
                                    >
                                      ↓
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteWidget(row.id, col.id, widget.id);
                                      }}
                                      className="px-2 py-1 bg-red-600 hover:bg-red-500 font-bold"
                                      title="Delete Widget"
                                    >
                                      ✖
                                    </button>
                                  </div>
                                )}

                                {renderCanvasWidget(widget)}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 text-center">
                  <button
                    onClick={() => addSectionRow("layout_1")}
                    className="border border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider"
                  >
                    + Add New Row Section
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* =================================================================
            RIGHT SIDEBAR: POWERFUL WIDGET INSPECTOR (CONTENT | STYLE | SPACING)
        ================================================================= */}
        {selectedWidget && (
          <aside className="w-72 md:w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 shrink-0 text-slate-800">
            {/* Top Header */}
            <div className="p-3.5 bg-[#0B1536] text-white flex justify-between items-center">
              <div>
                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Editing Widget</p>
                <h3 className="font-bold text-xs mt-0.5">{selectedWidget.name}</h3>
              </div>
              <button
                onClick={() => setSelectedWidgetLoc(null)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
              >
                ✖
              </button>
            </div>

            {/* 3 Tabs: CONTENT | STYLE | SPACING */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider">
              {["content", "style", "spacing"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveEditorTab(tab)}
                  className={`py-2.5 border-b-2 transition-all ${
                    activeEditorTab === tab
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeEditorTab === "content" && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Redirect URL / Link
                    </label>
                    <input
                      type="text"
                      value={selectedWidget.redirectUrl || ""}
                      onChange={(e) =>
                        updateSelectedWidget((w) => ({ ...w, redirectUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Primary Content / Value
                    </label>
                    <textarea
                      rows={4}
                      value={selectedWidget.content || ""}
                      onChange={(e) =>
                        updateSelectedWidget((w) => ({ ...w, content: e.target.value }))
                      }
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Dynamic Form Fields Editor */}
                  {selectedWidget.fields && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-600">Form Input Fields</span>
                        <button
                          onClick={() =>
                            updateSelectedWidget((w) => ({
                              ...w,
                              fields: [...(w.fields || []), { label: "New Field", type: "text" }],
                            }))
                          }
                          className="text-[10px] font-bold text-indigo-600"
                        >
                          + Add Field
                        </button>
                      </div>
                      {selectedWidget.fields.map((fld, idx) => (
                        <div key={idx} className="flex gap-1.5">
                          <input
                            type="text"
                            value={fld.label}
                            onChange={(e) =>
                              updateSelectedWidget((w) => {
                                const updated = [...w.fields];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                return { ...w, fields: updated };
                              })
                            }
                            className="flex-1 border rounded px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() =>
                              updateSelectedWidget((w) => ({
                                ...w,
                                fields: w.fields.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-red-500 text-xs px-1.5"
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Pricing Editor for E-Commerce / Checkout Widgets */}
                  {(selectedWidget.category === "ecommerce" || selectedWidget.type.includes("checkout")) && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                      <span className="text-[10px] font-black uppercase text-emerald-800 block">
                        ₹ Razorpay / Checkout Price
                      </span>
                      <input
                        type="number"
                        value={selectedWidget.pricing?.finalPrice || "499"}
                        onChange={(e) =>
                          updateSelectedWidget((w) => ({
                            ...w,
                            pricing: { ...(w.pricing || {}), finalPrice: e.target.value },
                          }))
                        }
                        className="w-full border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-bold bg-white"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleEnhanceWithAI}
                    disabled={isAiGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    ✨ {isAiGenerating ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </>
              )}

              {activeEditorTab === "style" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Text Color</label>
                      <input
                        type="color"
                        value={selectedWidget.styles?.color || "#0f172a"}
                        onChange={(e) =>
                          updateSelectedWidget((w) => ({
                            ...w,
                            styles: { ...w.styles, color: e.target.value },
                          }))
                        }
                        className="w-full h-9 rounded border cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Background</label>
                      <input
                        type="color"
                        value={
                          selectedWidget.styles?.backgroundColor === "transparent"
                            ? "#ffffff"
                            : selectedWidget.styles?.backgroundColor || "#ffffff"
                        }
                        onChange={(e) =>
                          updateSelectedWidget((w) => ({
                            ...w,
                            styles: { ...w.styles, backgroundColor: e.target.value },
                          }))
                        }
                        className="w-full h-9 rounded border cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">
                      Font Size ({selectedWidget.styles?.fontSize || "16px"})
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={parseInt(selectedWidget.styles?.fontSize) || 16}
                      onChange={(e) =>
                        updateSelectedWidget((w) => ({
                          ...w,
                          styles: { ...w.styles, fontSize: `${e.target.value}px` },
                        }))
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Text Alignment</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["left", "center", "right"].map((align) => (
                        <button
                          key={align}
                          onClick={() =>
                            updateSelectedWidget((w) => ({
                              ...w,
                              styles: { ...w.styles, textAlign: align },
                            }))
                          }
                          className={`py-1.5 border rounded text-[10px] font-bold uppercase ${
                            selectedWidget.styles?.textAlign === align
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeEditorTab === "spacing" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "paddingTop", label: "Padding Top" },
                    { key: "paddingBottom", label: "Padding Bottom" },
                    { key: "paddingLeft", label: "Padding Left" },
                    { key: "paddingRight", label: "Padding Right" },
                  ].map((pad) => (
                    <div key={pad.key}>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">{pad.label}</label>
                      <input
                        type="text"
                        value={selectedWidget.styles?.[pad.key] || "8px"}
                        onChange={(e) =>
                          updateSelectedWidget((w) => ({
                            ...w,
                            styles: { ...w.styles, [pad.key]: e.target.value },
                          }))
                        }
                        className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* =====================================================================
          3. MODALS: PUBLISH, AI AUTO-BUILDER & PREBUILT TEMPLATES
      ===================================================================== */}
            {isPrePublishModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-slate-800 shadow-2xl border border-slate-100 animate-fadeIn">
            
            <div className="text-center">
              <div className="mx-auto h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl font-black mb-3">
                🚀
              </div>
              <h3 className="text-xl font-black text-[#0B1536] uppercase tracking-tight">Funnel Live & Published!</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Your marketing funnel is successfully deployed to the cloud.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Funnel Project Name</label>
              <input
                type="text"
                value={funnelName}
                onChange={(e) => setFunnelName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {funnelId && (
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest block">Live Public URL:</span>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-indigo-200">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/preview?id=${funnelId}`} 
                    className="w-full bg-transparent text-xs text-slate-600 font-mono outline-none px-1"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/preview?id=${funnelId}`);
                      alert("📋 Link copied to clipboard!");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 transition-all shadow-md"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              {funnelId && (
                <a
                  href={`/preview?id=${funnelId}&step=${activeStep}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-all flex items-center justify-center gap-1.5"
                >
                  👁️ Preview
                </a>
              )}
              <button
                onClick={() => setIsPrePublishModalOpen(false)}
                className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-[#0B1536] hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all ${!funnelId ? 'col-span-2' : ''}`}
              >
                Done / Close ✖
              </button>
            </div>

            {!funnelId && (
              <button
                onClick={handlePublishToSupabase}
                disabled={isDatabasePushLoading}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all"
              >
                {isDatabasePushLoading ? "Generating Link..." : "Generate Live Link ➔"}
              </button>
                      </div>
        </div>
      )}
    </div>
  );
}
