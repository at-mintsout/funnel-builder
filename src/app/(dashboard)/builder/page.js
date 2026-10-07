"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 
import { PREBUILT_TEMPLATES } from "@/app/(dashboard)/builder/data/templates"; // Verified absolute path

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
  { type: "dropcap", name: "Dropcap Text", category: "text", icon: "A", defaultContent: "O nce upon a time in a digital world..." },
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
  { type: "lottie_anim", name: "Lottie Animation", category: "media", icon: "✨", defaultContent: "Paste Lottie JSON URL" },
  { type: "svg_icon", name: "SVG Icon Block", category: "media", icon: "⭐", defaultContent: "Rocket" },
  { type: "image_gallery", name: "Grid Gallery", category: "media", icon: "🗂️", defaultContent: "Img1|Img2|Img3" },
  { type: "carousel", name: "Image Slider", category: "media", icon: "🎠", defaultContent: "Slide 1|Slide 2" },
  { type: "before_after", name: "Before/After Slider", category: "media", icon: "🌗", defaultContent: "Before.jpg|After.jpg" },
  { type: "pdf_viewer", name: "PDF Document", category: "media", icon: "📄", defaultContent: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { type: "3d_model", name: "3D Viewer", category: "media", icon: "🧊", defaultContent: "3D Asset URL" },
  { type: "avatar", name: "User Avatar", category: "media", icon: "👤", defaultContent: "Initials: JD" },
  { type: "gif_player", name: "Giphy Embed", category: "media", icon: "🎬", defaultContent: "Funny Meme GIF" },
  { type: "qr_code", name: "QR Code Generator", category: "media", icon: "📱", defaultContent: "https://website.com" },
  { type: "chart_bar", name: "Bar Chart", category: "media", icon: "📊", defaultContent: "Sales Data Growth" },
  { type: "chart_pie", name: "Pie Chart", category: "media", icon: "🍩", defaultContent: "Market Share Metrics" },

  // --- ⚡ 4. FORMS & LEAD CAPTURE (25) ---
  { type: "form_optin", name: "Email Opt-in", category: "forms", icon: "✉", defaultContent: "Subscribe Now", fields: [{ label: "Email Address", type: "email" }] },
  { type: "form_contact", name: "Contact Form", category: "forms", icon: "📝", defaultContent: "Send Message", fields: [{ label: "Name", type: "text" }, { label: "Email", type: "email" }, { label: "Message", type: "textarea" }] },
  { type: "form_checkout", name: "2-Step Checkout", category: "forms", icon: "💳", defaultContent: "Complete Order" },
  { type: "form_survey", name: "Survey/Quiz", category: "forms", icon: "📋", defaultContent: "Start Assessment" },
  { type: "phone_input", name: "SMS Capture", category: "forms", icon: "📞", defaultContent: "Get SMS Alerts" },
  { type: "dropdown_input", name: "Dropdown Select", category: "forms", icon: "▾", defaultContent: "Option A|Option B|Option C" },
  { type: "radio_buttons", name: "Radio Selection", category: "forms", icon: "🔘", defaultContent: "Choice 1|Choice 2" },
  { type: "checkboxes", name: "Multi-Checkbox", category: "forms", icon: "☑", defaultContent: "Feature X|Feature Y" },
  { type: "date_picker", name: "Date Selector", category: "forms", icon: "📅", defaultContent: "Pick a date" },
  { type: "time_picker", name: "Time Selector", category: "forms", icon: "⏰", defaultContent: "Select meeting time" },
  { type: "file_upload", name: "File Uploader", category: "forms", icon: "📤", defaultContent: "Upload Documents (.pdf, .png)" },
  { type: "signature_pad", name: "Digital Signature", category: "forms", icon: "✍", defaultContent: "Sign here" },
  { type: "rating_input", name: "Star Rating Input", category: "forms", icon: "⭐", defaultContent: "Rate us 1 to 5" },
  { type: "range_slider", name: "Range Slider", category: "forms", icon: "🎚️", defaultContent: "Budget Selection" },
  { type: "color_picker", name: "Color Picker", category: "forms", icon: "🎨", defaultContent: "Choose Brand Color" },
  { type: "toggle_switch", name: "Toggle Switch", category: "forms", icon: "🎛️", defaultContent: "Enable Notifications" },
  { type: "captcha", name: "Anti-Spam Captcha", category: "forms", icon: "🤖", defaultContent: "I am not a robot" },
  { type: "hidden_field", name: "Hidden Tracking Field", category: "forms", icon: "👁️‍🗨️", defaultContent: "UTM_Source_Code" },
  { type: "autocomplete", name: "Address Autocomplete", category: "forms", icon: "📍", defaultContent: "Start typing address..." },
  { type: "password_input", name: "Password Setup", category: "forms", icon: "🔑", defaultContent: "Create secure password" },
  { type: "login_form", name: "Login Portal", category: "forms", icon: "🔓", defaultContent: "Access Dashboard" },
  { type: "multi_step", name: "Multi-Step Form", category: "forms", icon: "📑", defaultContent: "Step 1 of 3" },
  { type: "gdpr_box", name: "GDPR Consent", category: "forms", icon: "⚖️", defaultContent: "I agree to the privacy policy." },
  { type: "coupon_input", name: "Promo Code Field", category: "forms", icon: "🎟", defaultContent: "Apply Discount Code" },
  { type: "order_bump", name: "Order Bump Checkbox", category: "forms", icon: "⚡", defaultContent: "Yes! Add VIP Support for $19" },

  // --- 🎯 5. MARKETING & CONVERSION (30) ---
  { type: "button_primary", name: "Primary CTA", category: "marketing", icon: "🔥", defaultContent: "Get Started Now", styles: { backgroundColor: "#4f46e5", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "button_outline", name: "Outline Button", category: "marketing", icon: "🔳", defaultContent: "Learn More", styles: { color: "#4f46e5", backgroundColor: "transparent", padding: "14px 28px", borderRadius: "8px", border: "2px solid #4f46e5" } },
  { type: "button_animated", name: "Pulsing Button", category: "marketing", icon: "💓", defaultContent: "Claim Offer", styles: { backgroundColor: "#ef4444", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "countdown_timer", name: "Scarcity Countdown", category: "marketing", icon: "⏳", defaultContent: "Offer ends in 15:00 minutes" },
  { type: "evergreen_timer", name: "Evergreen Timer", category: "marketing", icon: "⏱️", defaultContent: "Resets every 24 hours for user" },
  { type: "pricing_table", name: "Pricing Tiers", category: "marketing", icon: "💲", defaultContent: "Basic: $9 | Pro: $29 | Elite: $99" },
  { type: "testimonial_card", name: "Review Card", category: "marketing", icon: "💬", defaultContent: "'This changed my life!' - Sarah J." },
  { type: "testimonial_slider", name: "Review Carousel", category: "marketing", icon: "🎡", defaultContent: "Swipe for more reviews" },
  { type: "trust_badges", name: "Secure Badges", category: "marketing", icon: "🛡", defaultContent: "SSL | Stripe | McAfee Secure" },
  { type: "social_proof_toast", name: "Live Sales Popup", category: "marketing", icon: "🔔", defaultContent: "John from NY just purchased Pro Plan!" },
  { type: "exit_intent", name: "Exit Intent Popup", category: "marketing", icon: "🚪", defaultContent: "Wait! Don't leave without your 20% discount." },
  { type: "progress_bar", name: "Completion Bar", category: "marketing", icon: "▰", defaultContent: "Almost Done! 80% Completed." },
  { type: "scarcity_ribbon", name: "Alert Ribbon", category: "marketing", icon: "🎗️", defaultContent: "Only 3 seats left at this price!" },
  { type: "feature_grid", name: "Benefit Grid", category: "marketing", icon: "🎛", defaultContent: "Fast|Secure|Cheap|Reliable" },
  { type: "faq_accordion", name: "FAQ Dropdowns", category: "marketing", icon: "❓", defaultContent: "Question 1|Question 2|Question 3" },
  { type: "timeline", name: "Process Timeline", category: "marketing", icon: "📈", defaultContent: "Step 1 -> Step 2 -> Step 3" },
  { type: "comparison_table", name: "Us vs Them", category: "marketing", icon: "⚖️", defaultContent: "Our Website vs Competitors" },
  { type: "guarantee_box", name: "Money-Back Guarantee", category: "marketing", icon: "🏆", defaultContent: "30-Day No Questions Asked Guarantee" },
  { type: "video_sales_letter", name: "VSL Wrapper", category: "marketing", icon: "🎬", defaultContent: "Watch this short video before it's taken down." },
  { type: "animated_headline", name: "Attention Headline", category: "marketing", icon: "🚨", defaultContent: "STOP: Read this now!" },
  { type: "step_indicator", name: "Step Counter", category: "marketing", icon: "🔢", defaultContent: "Step 1 of 4" },
  { type: "urgency_text", name: "Urgency Blinker", category: "marketing", icon: "🔴", defaultContent: "Live Now: 231 people are viewing this page." },
  { type: "confetti_trigger", name: "Confetti Success", category: "marketing", icon: "🎊", defaultContent: "Triggers on Purchase" },
  { type: "scratch_card", name: "Digital Scratch Card", category: "marketing", icon: "🎫", defaultContent: "Scratch here to reveal discount" },
  { type: "wheel_of_fortune", name: "Spin the Wheel", category: "marketing", icon: "🎡", defaultContent: "Enter email to spin for prizes!" },
  { type: "audio_testimonial", name: "Voice Note Review", category: "marketing", icon: "🎙️", defaultContent: "Play customer voice review" },
  { type: "notification_bar", name: "Sticky Top Bar", category: "marketing", icon: "🔝", defaultContent: "Free shipping on orders over $50!" },
  { type: "popup_trigger", name: "Modal Button", category: "marketing", icon: "🪟", defaultContent: "Click to open hidden form" },
  { type: "scroll_indicator", name: "Scroll Progress", category: "marketing", icon: "📜", defaultContent: "Reading progress..." },
  { type: "locked_content", name: "Content Locker", category: "marketing", icon: "🔒", defaultContent: "Share on Facebook to unlock video" },

  // --- 🛒 6. E-COMMERCE & WEB3 (20) ---
  { type: "product_card", name: "Product Card", category: "ecommerce", icon: "🛍️", defaultContent: "T-Shirt - $20" },
  { type: "add_to_cart", name: "Add to Cart Btn", category: "ecommerce", icon: "🛒", defaultContent: "Add to Cart - $19.99", styles: { backgroundColor: "#10b981", color: "#ffffff", padding: "14px 28px", borderRadius: "8px" } },
  { type: "cart_summary", name: "Order Summary", category: "ecommerce", icon: "🧾", defaultContent: "Subtotal: $19.99 | Tax: $2.00 | Total: $21.99" },
  { type: "stripe_element", name: "Stripe Payment", category: "ecommerce", icon: "💳", defaultContent: "Credit Card Gateway (Stripe)" },
  { type: "paypal_btn", name: "PayPal Express", category: "ecommerce", icon: "🅿️", defaultContent: "Pay with PayPal" },
  { type: "razorpay_btn", name: "Razorpay Checkout", category: "ecommerce", icon: "₹", defaultContent: "Pay Now (UPI/Cards)", pricing: { rate: "", discount: "", finalPrice: "" } },
  { type: "crypto_pay", name: "Web3 Wallet Pay", category: "ecommerce", icon: "🪙", defaultContent: "Connect MetaMask (ETH/USDT)" },
  { type: "mini_cart", name: "Floating Mini Cart", category: "ecommerce", icon: "👜", defaultContent: "2 Items in Cart" },
  { type: "product_rating", name: "Aggregate Rating", category: "ecommerce", icon: "🌟", defaultContent: "4.8/5 based on 2,000 reviews" },
  { type: "sku_display", name: "Product SKU", category: "ecommerce", icon: "🏷️", defaultContent: "SKU: WEB-1001" },
  { type: "inventory_status", name: "Stock Status", category: "ecommerce", icon: "📦", defaultContent: "In Stock (Only 4 left!)" },
  { type: "currency_switcher", name: "Currency Selector", category: "ecommerce", icon: "💱", defaultContent: "USD | EUR | INR | GBP" },
  { type: "shipping_calc", name: "Shipping Calculator", category: "ecommerce", icon: "🚚", defaultContent: "Enter zip code for shipping cost" },
  { type: "tax_calc", name: "Dynamic Tax", category: "ecommerce", icon: "🏛️", defaultContent: "Tax calculated at checkout" },
  { type: "upsell_grid", name: "You May Also Like", category: "ecommerce", icon: "🎁", defaultContent: "Related Product 1 | Related Product 2" },
  { type: "variant_selector", name: "Color/Size Variants", category: "ecommerce", icon: "👕", defaultContent: "Size: S, M, L | Color: Red, Blue" },
  { type: "subscription_toggle", name: "Subscribe & Save", category: "ecommerce", icon: "🔁", defaultContent: "One-time: $50 | Subscribe: $40/mo" },
  { type: "donation_meter", name: "Fundraising Goal", category: "ecommerce", icon: "💖", defaultContent: "$5,000 raised of $10,000 goal" },
  { type: "tip_jar", name: "Creator Tip Jar", category: "ecommerce", icon: "☕", defaultContent: "Buy me a coffee ($5)" },
  { type: "invoice_download", name: "Download Receipt", category: "ecommerce", icon: "📥", defaultContent: "Click to download PDF Invoice" },

  // --- 🌐 7. SOCIAL & COMMUNITY (15) ---
  { type: "social_share", name: "Share Buttons", category: "social", icon: "🔗", defaultContent: "Share on: Facebook | Twitter | LinkedIn" },
  { type: "fb_comments", name: "Facebook Comments", category: "social", icon: "📘", defaultContent: "Load FB Comments Plugin" },
  { type: "twitter_feed", name: "X/Twitter Feed", category: "social", icon: "🐦", defaultContent: "Latest Tweets from @OurWebsite" },
  { type: "insta_grid", name: "Instagram Grid", category: "social", icon: "📸", defaultContent: "Recent Instagram Posts" },
  { type: "discord_invite", name: "Discord Embed", category: "social", icon: "👾", defaultContent: "Join our Discord Community (500 online)" },
  { type: "telegram_chat", name: "Telegram Button", category: "social", icon: "✈️", defaultContent: "Chat with us on Telegram" },
  { type: "whatsapp_float", name: "WhatsApp Float", category: "social", icon: "💬", defaultContent: "Message us on WhatsApp" },
  { type: "linkedin_badge", name: "LinkedIn Profile", category: "social", icon: "👔", defaultContent: "Connect with Founder" },
  { type: "tiktok_embed", name: "TikTok Video", category: "social", icon: "🎵", defaultContent: "Viral TikTok Embed" },
  { type: "disqus_forum", name: "Disqus Thread", category: "social", icon: "🗣️", defaultContent: "Community Discussion Board" },
  { type: "youtube_subscribe", name: "YT Subscribe Btn", category: "social", icon: "▶️", defaultContent: "Subscribe to Channel" },
  { type: "pinterest_pin", name: "Pinterest Save", category: "social", icon: "📌", defaultContent: "Pin this image" },
  { type: "github_repo", name: "GitHub Repo Card", category: "social", icon: "🐙", defaultContent: "Star us on GitHub" },
  { type: "reddit_embed", name: "Reddit Thread", category: "social", icon: "🤖", defaultContent: "Trending on r/marketing" },
  { type: "medium_blog", name: "Medium Article", category: "social", icon: "📰", defaultContent: "Read full post on Medium" },

  // --- 🛠️ 8. ADVANCED & UTILITIES (15) ---
  { type: "custom_html", name: "HTML Snippet", category: "advanced", icon: "🧬", defaultContent: "<!-- Custom HTML Goes Here -->" },
  { type: "custom_css", name: "CSS Injector", category: "advanced", icon: "🎨", defaultContent: "/* Target elements via class */" },
  { type: "custom_js", name: "JS Script", category: "advanced", icon: "⚙️", defaultContent: "<script>alert('Loaded');</script>" },
  { type: "iframe_embed", name: "Iframe Viewer", category: "advanced", icon: "🪟", defaultContent: "Embed external site/tool" },
  { type: "google_map", name: "Google Map", category: "advanced", icon: "📍", defaultContent: "New York, USA" },
  { type: "weather_widget", name: "Live Weather", category: "advanced", icon: "⛅", defaultContent: "72°F, Sunny in California" },
  { type: "calculator", name: "ROI Calculator", category: "advanced", icon: "🧮", defaultContent: "Calculate your profits" },
  { type: "data_table", name: "Pricing/Data Table", category: "advanced", icon: "📊", defaultContent: "Row 1 | Row 2 | Row 3" },
  { type: "breadcrumbs", name: "Breadcrumbs Nav", category: "advanced", icon: "🛤️", defaultContent: "Home > Products > Software" },
  { type: "scroll_to_top", name: "Scroll to Top Btn", category: "advanced", icon: "⬆️", defaultContent: "Back to Top" },
  { type: "search_bar", name: "Site Search", category: "advanced", icon: "🔍", defaultContent: "Search blog posts..." },
  { type: "language_switcher", name: "Translate Site", category: "advanced", icon: "🌍", defaultContent: "English | Español | Hindi" },
  { type: "cookie_banner", name: "Cookie Consent", category: "advanced", icon: "🍪", defaultContent: "We use cookies to improve experience." },
  { type: "lorem_ipsum", name: "Dummy Text Gen", category: "advanced", icon: "📝", defaultContent: "Lorem ipsum dolor sit amet..." },
  { type: "webbook_trigger", name: "Zapier/Webhook", category: "advanced", icon: "🔗", defaultContent: "Send data payload to endpoint" }
];

export default function WebsiteBuilderCanvas() {
  const router = useRouter();

  // =========================================================================
  // 🧭 PRESERVED DATABASE PIPELINE PATHS
  // =========================================================================
  const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_ANON_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const TARGET_TABLE_NAME = "funnels";

  // =========================================================================
  // 🧭 GLOBAL STATES
  // =========================================================================
  const [funnelPageStepsTabs, setFunnelPageStepsTabs] = useState(["landing", "checkout", "thankyou"]);
  const [activePageStep, setActivePageStep] = useState("landing"); 
  const [activeDeviceViewMode, setActiveDeviceViewMode] = useState("desktop"); 
  const [lastSystemUpdateTimeStamp, setLastSystemUpdateTimeStamp] = useState("Never updated");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPrePublishModalOpen, setIsPrePublishModalOpen] = useState(false);
  const [generatedClientFunnelLink, setGeneratedClientFunnelLink] = useState("");
  const [isDatabasePushLoading, setIsDatabasePushLoading] = useState(false);
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isAIFunnelModalOpen, setIsAIFunnelModalOpen] = useState(false);
  const [isBuildingFullFunnel, setIsBuildingFullFunnel] = useState(false);
  
  // UI Appearance States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true); // NEW: Full Screen toggle state

  const [aiForm, setAiForm] = useState({
    businessCategory: "", productName: "", targetLocation: "India", productCategories: "", rate: "", discount: "", finalPrice: "", description: ""
  });

  const [funnelPagesDataStore, setFunnelPagesDataStore] = useState({
    landing: [], checkout: [], thankyou: []
  });

  const canvasRows = funnelPagesDataStore[activePageStep] || [];
  
  const [expandedCategory, setExpandedCategory] = useState("layout"); 
  const [activeInspectorTab, setActiveInspectorTab] = useState("content"); 
  const [selectedWidgetNode, setSelectedWidgetNode] = useState(null);
  const [activeWidgetSearchTerm, setActiveWidgetSearchTerm] = useState("");
  const [isCurrentlyDraggingWidget, setIsCurrentlyDraggingWidget] = useState(false);
  const internalDraggedWidgetTypeRef = useRef(null);

  const setCanvasRows = (mutatorArgumentPayload) => {
    setFunnelPagesDataStore(previousMasterStore => {
      const activeRowsBuffer = previousMasterStore[activePageStep] || [];
      const newlyComputedRows = typeof mutatorArgumentPayload === "function" ? mutatorArgumentPayload(activeRowsBuffer) : mutatorArgumentPayload;
      return { ...previousMasterStore, [activePageStep]: newlyComputedRows };
    });
  };

  // =========================================================================
  // 🤖 FULL WEBSITE AI BUILDER ENGINE
  // =========================================================================
  const handleGenerateFullFunnelWithAI = async (e) => {
    e.preventDefault();
    if(!aiForm.productName.trim()) return alert("Please enter a Product Name!");
    
    setIsBuildingFullFunnel(true);
    try {
      const compiledPrompt = `
        Build a high-converting 3-page website (Landing, Checkout, Thank You) for:
        Product Name: ${aiForm.productName}
        Business Category: ${aiForm.businessCategory}
        Product Categories: ${aiForm.productCategories}
        Target Location: ${aiForm.targetLocation}
        Pricing: Base Rate ${aiForm.rate}, Discount ${aiForm.discount}%, Final Selling Price ${aiForm.finalPrice}.
        Description: ${aiForm.description}
      `.trim();

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt, type: "generate_funnel" })
      });
      
      const data = await res.json();
      if (!data.result) throw new Error(data.error || "AI returned empty.");

      let parsedAI;
      try {
        const cleanJSONString = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedAI = JSON.parse(cleanJSONString);
      } catch(e) { throw new Error("AI returned invalid data format. Please try again."); }

      if(parsedAI.landing) {
        setFunnelPageStepsTabs(["landing", "checkout", "thankyou"]);
        setFunnelPagesDataStore({
          landing: parsedAI.landing,
          checkout: parsedAI.checkout || [],
          thankyou: parsedAI.thankyou || []
        });
        setActivePageStep("landing");
        setIsAIFunnelModalOpen(false);
        setAiForm({ businessCategory: "", productName: "", targetLocation: "India", productCategories: "", rate: "", discount: "", finalPrice: "", description: "" });
        triggerManualHotUpdateCommit();
      } else {
        throw new Error("AI did not generate the correct page structure.");
      }
    } catch (error) {
      alert("AI Generation Error: " + error.message);
    } finally {
      setIsBuildingFullFunnel(false);
    }
  };

  // =========================================================================
  // 🌟 TEMPLATE INJECTION FUNCTION
  // =========================================================================
  const handleLoadTemplate = (templateId) => {
    const template = PREBUILT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    if(!confirm("Loading a template will overwrite your current website design. Continue?")) return;

    setFunnelPageStepsTabs(Object.keys(template.data));
    setFunnelPagesDataStore(template.data);
    setActivePageStep("landing");
    setSelectedWidgetNode(null);
    setIsTemplateModalOpen(false);
    triggerManualHotUpdateCommit();
  };

  // =========================================================================
  // ⚙️ ROUTE & PAGE ACTIONS
  // =========================================================================
  const instantiateDynamicNewPageChannelTab = () => {
    const rawPageNameInput = prompt("Enter Unique Custom Page Name (e.g., upsell, pricing):");
    if (!rawPageNameInput) return;
    const formattedPageKeyId = rawPageNameInput.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    if (!formattedPageKeyId || funnelPageStepsTabs.includes(formattedPageKeyId)) return alert("Invalid or duplicate page identifier.");
    
    setFunnelPageStepsTabs(prev => [...prev, formattedPageKeyId]);
    setFunnelPagesDataStore(prev => ({ ...prev, [formattedPageKeyId]: [] }));
    setActivePageStep(formattedPageKeyId);
    setSelectedWidgetNode(null);
  };

  const deleteDynamicPageTab = (pageKeyToDelete, eventObj) => {
    eventObj.stopPropagation(); 
    if (["landing", "checkout", "thankyou"].includes(pageKeyToDelete)) return alert("System default pages cannot be deleted!");
    if (!confirm(`Are you sure you want to delete the "${pageKeyToDelete}" page?`)) return;

    setFunnelPageStepsTabs(prev => prev.filter(step => step !== pageKeyToDelete));
    setFunnelPagesDataStore(prev => {
      const updatedStore = { ...prev };
      delete updatedStore[pageKeyToDelete];
      return updatedStore;
    });

    if (activePageStep === pageKeyToDelete) {
      setActivePageStep("landing");
      setSelectedWidgetNode(null);
    }
  };

  // =========================================================================
  // ⚙️ WIDGET ENGINE MUTATION HOOKS
  // =========================================================================
  const addNewSectionRowLayout = (columnCountConfig) => {
    const calculatedWidth = Math.floor(100 / columnCountConfig);
    const newRow = {
      id: `row_vector_${Date.now()}`,
      columns: Array.from({ length: columnCountConfig }).map((_, idx) => ({ id: `col_gen_${Date.now()}_${idx}`, widthPercent: calculatedWidth, widgets: [] }))
    };
    setCanvasRows(prev => [...prev, newRow]);
  };

  const appendWidgetToColumn = (targetRowId, targetColumnId, elementWidgetType) => {
    if (elementWidgetType.startsWith("layout_")) {
      let cols = 1;
      if (elementWidgetType === "layout_2") cols = 2;
      if (elementWidgetType === "layout_3") cols = 3;
      if (elementWidgetType === "layout_4") cols = 4;
      if (elementWidgetType === "layout_5") cols = 5;
      if (elementWidgetType === "layout_6") cols = 6;
      addNewSectionRowLayout(cols);
      return;
    }

    const sysItem = ELEMENTOR_WIDGET_CATALOG.find(w => w.type === elementWidgetType);
    if (!sysItem) return;

    const freshWidgetInstance = {
      id: `wdgt_node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: elementWidgetType,
      name: sysItem.name,
      content: sysItem.defaultContent,
      redirectUrl: sysItem.redirectUrl !== undefined ? "" : undefined,
      pricing: sysItem.pricing ? { ...sysItem.pricing } : undefined,
      styles: sysItem.styles ? { ...sysItem.styles } : { color: "#1e293b", textAlign: "left", fontSize: "14px" },
      fields: sysItem.fields ? [...sysItem.fields] : undefined
    };

    setCanvasRows(prev => prev.map(row => {
      if (row.id !== targetRowId) return row;
      return { ...row, columns: row.columns.map(col => {
          if (col.id !== targetColumnId) return col;
          return { ...col, widgets: [...col.widgets, freshWidgetInstance] };
        })
      };
    }));
    setSelectedWidgetNode({ widget: freshWidgetInstance, rowId: targetRowId, columnId: targetColumnId });
    setActiveInspectorTab("content");
  };

  const updateSelectedWidgetAttributes = (modifiedProperties, modifiedStyleFields = {}) => {
    if (!selectedWidgetNode) return;
    const { id: targetWidgetId } = selectedWidgetNode.widget;

    setCanvasRows(prev => prev.map(row => {
      if (row.id !== selectedWidgetNode.rowId) return row;
      return { ...row, columns: row.columns.map(col => {
          if (col.id !== selectedWidgetNode.columnId) return col;
          return { ...col, widgets: col.widgets.map(w => {
              if (w.id !== targetWidgetId) return w;
              const consolidatedWidget = { ...w, ...modifiedProperties, styles: { ...w.styles, ...modifiedStyleFields } };
              setSelectedWidgetNode(prevRef => ({ ...prevRef, widget: consolidatedWidget }));
              return consolidatedWidget;
            })
          };
        })
      };
    }));
  };

  const shiftWidgetVerticalOrder = (rIdx, cIdx, wIdx, dir) => {
    const rows = JSON.parse(JSON.stringify(canvasRows));
    const widgets = rows[rIdx].columns[cIdx].widgets;
    const dest = wIdx + dir;
    if (dest < 0 || dest >= widgets.length) return;
    [widgets[wIdx], widgets[dest]] = [widgets[dest], widgets[wIdx]];
    setCanvasRows(rows);
  };

  const dropWidgetInstanceFromTree = (rId, cId, wId, e) => {
    e.stopPropagation();
    setCanvasRows(prev => prev.map(row => row.id !== rId ? row : { ...row, columns: row.columns.map(col => col.id !== cId ? col : { ...col, widgets: col.widgets.filter(w => w.id !== wId) }) }));
    if (selectedWidgetNode?.widget.id === wId) setSelectedWidgetNode(null);
  };

  const purgeWholeSectionRowNode = (rId, e) => {
    e.stopPropagation();
    setCanvasRows(prev => prev.filter(r => r.id !== rId));
    if (selectedWidgetNode?.rowId === rId) setSelectedWidgetNode(null);
  };

  const triggerManualHotUpdateCommit = () => setLastSystemUpdateTimeStamp(new Date().toLocaleTimeString());

  // =========================================================================
  // 🤖 WIDGET AI ENGINE HOOK
  // =========================================================================
  const handleMagicAI = async () => {
    if (!selectedWidgetNode || !selectedWidgetNode.widget.content) return;
    
    setIsAIGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: selectedWidgetNode.widget.content, type: selectedWidgetNode.widget.type })
      });
      const data = await res.json();
      if (data.result) updateSelectedWidgetAttributes({ content: data.result });
      else alert("AI failed: " + data.error);
    } catch (error) {
      alert("Network error connecting to AI.");
    } finally {
      setIsAIGenerating(false);
    }
  };

  // =========================================================================
  // 🔄 AUTO-SAVE ENGINE 
  // =========================================================================
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_PUBLIC_KEY || Object.keys(funnelPagesDataStore).length === 0) return;
      try {
        await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/${TARGET_TABLE_NAME}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_PUBLIC_KEY, "Authorization": `Bearer ${SUPABASE_ANON_PUBLIC_KEY}`, "Prefer": "resolution=merge-duplicates" },
          body: JSON.stringify({ id: "draft_site_id_001", name: "My Auto-Saved Website", canvas_state: funnelPagesDataStore, updated_at: new Date().toISOString() })
        });
        triggerManualHotUpdateCommit(); 
      } catch (error) {}
    }, 3000); 
    return () => clearTimeout(delayDebounceFn); 
  }, [funnelPagesDataStore]); 

  // =========================================================================
  // 📥 PUBLISH ENGINE
  // =========================================================================
  const handleCompileAndPublishFunnel = async (isPreviewMode = false) => {
    setIsDatabasePushLoading(true);
    try {
      if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_PUBLIC_KEY) throw new Error("Supabase Keys missing in Vercel Environment Variables.");
      
      const uniqueClientUrlTokenId = crypto.randomUUID();
      const verifiedPublicClientLiveRouterLink = `${window.location.origin}/preview?id=${uniqueClientUrlTokenId}`;
      
      const dbResponseStream = await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/${TARGET_TABLE_NAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_PUBLIC_KEY, "Authorization": `Bearer ${SUPABASE_ANON_PUBLIC_KEY}`, "Prefer": "resolution=merge-duplicates" },
        body: JSON.stringify({ 
          id: uniqueClientUrlTokenId, 
          name: isPreviewMode ? `Preview Draft - ${new Date().toLocaleTimeString()}` : `Website - ${new Date().toLocaleDateString()}`, 
          canvas_state: funnelPagesDataStore, 
          updated_at: new Date().toISOString() 
        })
      });
      
      if (!dbResponseStream.ok) throw new Error(`Database Error (${dbResponseStream.status}): ${await dbResponseStream.text()}`);
      
      if (isPreviewMode) {
        window.open(verifiedPublicClientLiveRouterLink, '_blank');
        setIsPrePublishModalOpen(false);
      } else {
        setGeneratedClientFunnelLink(verifiedPublicClientLiveRouterLink.trim());
        setIsPrePublishModalOpen(false);
        setIsPublishModalOpen(true);
      }
      triggerManualHotUpdateCommit(); 
   } catch (err) {
      alert("❌ Publish Error: " + err.message); 
      setIsPublishModalOpen(false); 
      setIsPrePublishModalOpen(false);
    } finally {
      setIsDatabasePushLoading(false);
    }
  };

  // =========================================================================
  // 📁 LOCAL FILE UPLOAD HANDLER
  // =========================================================================
  const handleLocalFileUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      const fileUrl = URL.createObjectURL(file);
      updateSelectedWidgetAttributes({ content: fileUrl });
    }
  };

  // =========================================================================
  // 🖥️ UI RENDER
  // =========================================================================
  const categoriesDef = [
    { id: "layout", name: "Structure", icon: "📐" },
    { id: "text", name: "Typography", icon: "📝" },
    { id: "media", name: "Media Items", icon: "📸" },
    { id: "forms", name: "Forms & Gen", icon: "⚡" },
    { id: "marketing", name: "Conversion", icon: "🎯" },
    { id: "ecommerce", name: "E-Commerce", icon: "🛒" },
    { id: "social", name: "Community", icon: "🌐" },
    { id: "advanced", name: "Advanced", icon: "🛠️" }
  ];

  return (
    // FIX: Using isFullScreen toggle to control whether builder overlays dashboard or sits inside it
    <div className={`flex flex-col ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f8fafc] text-slate-800'} font-sans overflow-hidden transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative h-[85vh] rounded-xl shadow-2xl border border-slate-300 mt-2'}`}>
      
      {/* 🛸 PREMIUM FLUSH HEADER */}
      <header className={`h-14 ${isDarkMode ? 'bg-black border-b border-slate-800' : 'bg-[#0f172a]'} text-white px-4 flex items-center justify-between shrink-0 shadow-md z-40 transition-colors`}>
        <div className="flex items-center gap-4">
          
          {/* FULL SCREEN TOGGLE BUTTON (NEW) */}
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)} 
            className="p-1.5 hover:bg-slate-700 rounded text-xl transition-colors flex items-center justify-center leading-none"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? '↙️' : '☰'}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <div className="h-7 w-7 bg-indigo-500 rounded flex items-center justify-center font-black text-xs shadow-lg">WB</div>
            <span className="font-black text-sm tracking-widest uppercase hidden md:block">Website Builder</span>
          </div>
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600 text-[10px] font-bold uppercase transition-all">
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-1"></div>
          
          <div className="flex items-center bg-slate-800 p-1 rounded border border-slate-700 overflow-x-auto no-scrollbar">
            {funnelPageStepsTabs.map((step) => (
              <div key={step} className="relative flex items-center group">
                <button
                  onClick={() => { setActivePageStep(step); setSelectedWidgetNode(null); }}
                  className={`px-4 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${activePageStep === step ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                >
                  {step}
                </button>
                {!["landing", "checkout", "thankyou"].includes(step) && (
                  <button onClick={(e) => deleteDynamicPageTab(step, e)} className="absolute -top-1 -right-1 text-[9px] w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                )}
              </div>
            ))}
            <button onClick={instantiateDynamicNewPageChannelTab} className="px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider text-indigo-400 hover:text-white ml-2 transition-all">+ Add Page</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-mono hidden lg:block">Synced: {lastSystemUpdateTimeStamp}</span>
          <button 
            onClick={() => setIsPrePublishModalOpen(true)} disabled={isDatabasePushLoading}
            className={`bg-slate-700 hover:bg-slate-600 text-white px-5 py-1.5 rounded text-xs font-black uppercase tracking-wider shadow transition-all active:scale-95 ${isDatabasePushLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            {isDatabasePushLoading ? "Syncing DB..." : "🚀 Publish"}
          </button>
        </div>
      </header>

      {/* 🏗 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ⬅️ LEFT SIDEBAR (Always flex now, hiding logic removed) */}
        <aside className={`flex w-[200px] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-r flex-col shrink-0 shadow-sm z-30 select-none transition-colors`}>
          <div className={`p-2 border-b ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
            <button onClick={() => router.push("/dashboard")} className="w-full flex justify-center items-center gap-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow transition-all">
              📊 Dashboard
            </button>
            <input type="text" placeholder="Search tools..." value={activeWidgetSearchTerm} onChange={(e) => setActiveWidgetSearchTerm(e.target.value)} className={`w-full mt-2 border text-[10px] px-2 py-1.5 rounded outline-none focus:border-indigo-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-200'}`} />
          </div>
          
          <div className="flex-1 overflow-y-auto content-scrollbar p-1.5">
            {categoriesDef.map(cat => {
              const items = ELEMENTOR_WIDGET_CATALOG.filter(w => w.category === cat.id && w.name.toLowerCase().includes(activeWidgetSearchTerm.toLowerCase()));
              if (items.length === 0) return null;
              
              return (
                <div key={cat.id} className="mb-1">
                  <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? "" : cat.id)} className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                    <span>{cat.icon} {cat.name}</span>
                    <span className="text-[8px] opacity-50">{expandedCategory === cat.id ? "▼" : "▶"}</span>
                  </button>
                  
                  {expandedCategory === cat.id && (
                    <div className="flex flex-col gap-1 mt-1 p-0.5">
                      {items.map(widget => (
                        <div
                          key={widget.type} draggable
                          onDragStart={() => { setIsCurrentlyDraggingWidget(true); internalDraggedWidgetTypeRef.current = widget.type; }}
                          onDragEnd={() => setIsCurrentlyDraggingWidget(false)}
                          onClick={() => {
                            if(canvasRows.length > 0) appendWidgetToColumn(canvasRows[canvasRows.length - 1].id, canvasRows[canvasRows.length - 1].columns[0].id, widget.type);
                            else addNewSectionRowLayout(1);
                          }}
                          className={`border rounded p-1.5 flex items-center gap-2 cursor-grab transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-xs'}`}
                        >
                          <span className="text-sm text-indigo-500 w-5 text-center">{widget.icon}</span>
                          <span className={`text-[9px] font-bold leading-tight flex-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{widget.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`p-3 border-t flex flex-col gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
             <button onClick={() => setIsAIFunnelModalOpen(true)} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2">
               🤖 Build with AI
             </button>
             <button onClick={() => setIsTemplateModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2">
               ✨ Templates
             </button>
          </div>
        </aside>

        {/* ⬜ CENTER: CANVAS */}
        <main className={`flex-1 overflow-y-auto relative content-scrollbar flex justify-center p-6 bg-dot-matrix-mesh ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}>
          
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow border flex gap-1 z-20 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            {[{ id: "desktop", icon: "💻" }, { id: "tablet", icon: "🎴" }, { id: "mobile", icon: "📱" }].map(dev => (
              <button key={dev.id} onClick={() => setActiveDeviceViewMode(dev.id)} className={`p-1 rounded transition-colors ${activeDeviceViewMode === dev.id ? "bg-indigo-100 text-indigo-700" : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700")}`}>{dev.icon}</button>
            ))}
          </div>

          <div className={`mt-10 bg-white shadow-xl rounded border border-slate-200 min-h-[85vh] flex flex-col pb-20 transition-all duration-300 ${activeDeviceViewMode === "mobile" ? "w-[400px]" : activeDeviceViewMode === "tablet" ? "w-[768px]" : "w-full max-w-5xl"}`}>
            
            {canvasRows.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="text-4xl mb-4 text-indigo-300">✨</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Start Building Your Website</h2>
                <p className="text-sm text-slate-500 mb-6">Drag and drop any of the 150+ widgets from the left panel.</p>
                <div className="flex gap-4">
                  <button onClick={() => addNewSectionRowLayout(1)} className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase rounded shadow">Add Section Row</button>
                  <button onClick={() => setIsAIFunnelModalOpen(true)} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase rounded shadow border border-indigo-400/50 flex gap-2"><span>🤖</span> Auto-Build with AI</button>
                </div>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {canvasRows.map((row, rIdx) => (
                  <div key={row.id} className="relative group/row rounded border-2 border-transparent hover:border-indigo-200 bg-white transition-all p-1 text-slate-800">
                    
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/row:opacity-100 bg-slate-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-30 flex gap-2 items-center transition-opacity">
                      <span>Row Area</span>
                      <button onClick={(e) => purgeWholeSectionRowNode(row.id, e)} className="text-red-400 hover:text-red-300 ml-1">✕ Delete</button>
                    </div>

                    <div className={`flex gap-3 ${activeDeviceViewMode === "mobile" ? "flex-col" : ""}`}>
                      {row.columns.map((column, cIdx) => (
                        <div
                          key={column.id} style={{ width: activeDeviceViewMode === "mobile" ? "100%" : `${column.widthPercent}%` }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={() => { if (isCurrentlyDraggingWidget && internalDraggedWidgetTypeRef.current) appendWidgetToColumn(row.id, column.id, internalDraggedWidgetTypeRef.current); }}
                          className="border border-dashed border-slate-200 bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-300 rounded p-3 min-h-[80px] flex flex-col gap-2"
                        >
                          {column.widgets.length === 0 && (
                            <div className="flex-1 flex items-center justify-center opacity-30 font-bold text-[10px] uppercase text-slate-400">Drag Widget Here</div>
                          )}
                          
                          {column.widgets.map((widget, wIdx) => {
                            const isActive = selectedWidgetNode?.widget.id === widget.id;
                            const globalStyles = {
                              color: widget.styles?.color || "inherit",
                              fontSize: widget.styles?.fontSize || "inherit",
                              textAlign: widget.styles?.textAlign || "left",
                              fontWeight: widget.styles?.fontWeight || "normal",
                              backgroundColor: widget.styles?.backgroundColor || "transparent",
                              paddingTop: widget.styles?.paddingTop || "0px",
                              paddingBottom: widget.styles?.paddingBottom || "0px",
                              paddingLeft: widget.styles?.paddingLeft || "0px",
                              paddingRight: widget.styles?.paddingRight || "0px",
                            };

                            return (
                              <div
                                key={widget.id} onClick={(e) => { e.stopPropagation(); setSelectedWidgetNode({ widget, rowId: row.id, columnId: column.id }); setActiveInspectorTab("content"); }}
                                className={`relative rounded transition-all cursor-pointer border-2 ${isActive ? "border-indigo-500 shadow-md z-10" : "border-transparent hover:border-slate-300"}`}
                              >
                                {isActive && (
                                  <div className="absolute -top-3 -right-2 bg-slate-900 text-white rounded p-0.5 shadow-lg flex gap-0.5 z-30 text-[10px] font-bold">
                                    <button onClick={(e) => { e.stopPropagation(); shiftWidgetVerticalOrder(rIdx, cIdx, wIdx, -1); }} className="w-5 h-5 hover:bg-slate-700 rounded flex items-center justify-center">↑</button>
                                    <button onClick={(e) => { e.stopPropagation(); shiftWidgetVerticalOrder(rIdx, cIdx, wIdx, 1); }} className="w-5 h-5 hover:bg-slate-700 rounded flex items-center justify-center">↓</button>
                                    <button onClick={(e) => dropWidgetInstanceFromTree(row.id, column.id, widget.id, e)} className="w-5 h-5 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center ml-0.5">✕</button>
                                  </div>
                                )}

                                <div style={globalStyles} className="w-full">
                                  {(() => {
                                    const wType = widget.type;
                                    
                                    // Text Nodes
                                    if (["h1","h2","h3","h4","h5","h6","heading","sub_heading"].includes(wType)) return <h2 className="m-0 leading-tight">{widget.content}</h2>;
                                    if (wType === "paragraph") return <p className="m-0 leading-relaxed">{widget.content}</p>;
                                    if (wType === "blockquote") return <blockquote className="border-l-4 border-indigo-500 pl-4 italic m-0">{widget.content}</blockquote>;
                                    if (wType === "bullet_list") return <ul className="list-disc pl-5 m-0 text-left">{widget.content.split('\n').map((item, i) => <li key={i}>{item}</li>)}</ul>;
                                    if (wType === "check_list") return <ul className="pl-5 m-0 text-left">{widget.content.split('\n').map((item, i) => <li key={i}>✅ {item}</li>)}</ul>;
                                    if (wType === "numbered_list") return <ol className="list-decimal pl-5 m-0 text-left">{widget.content.split('\n').map((item, i) => <li key={i}>{item}</li>)}</ol>;
                                    
                                    // Media & Real Files
                                    if (wType === "image") return <div className="flex justify-center w-full overflow-hidden"><img src={widget.content} className="max-w-full h-auto rounded shadow-sm object-contain" alt="Visual" /></div>;
                                    if (wType === "pdf_viewer") return <iframe src={widget.content} className="w-full h-[500px] border rounded shadow-sm" />;
                                    if (wType === "video_embed" || wType === "video") {
                                      if(widget.content.includes("youtube") || widget.content.includes("vimeo")) {
                                        return <iframe src={widget.content} className="w-full aspect-video rounded shadow-sm border-0" allowFullScreen />;
                                      }
                                      return <video src={widget.content} controls className="w-full aspect-video rounded shadow-sm" />;
                                    }
                                    if (wType === "audio_player") return <audio src={widget.content} controls className="w-full mt-2" />;
                                    
                                    // Charts Fake Rendering
                                    if (wType.includes("chart")) return (
                                      <div className="w-full h-40 bg-slate-50 border flex items-end justify-around p-4 rounded gap-2 shadow-inner">
                                        <div className="w-full bg-indigo-300 h-[40%] rounded-t"></div>
                                        <div className="w-full bg-indigo-500 h-[70%] rounded-t"></div>
                                        <div className="w-full bg-indigo-700 h-[100%] rounded-t"></div>
                                      </div>
                                    );

                                    // Forms & E-comm
                                    if (wType === "razorpay_btn") return <button className="w-full bg-[#3395ff] text-white font-bold py-3 rounded text-xs uppercase shadow-sm">Pay {widget.pricing?.finalPrice ? `₹${widget.pricing.finalPrice}` : 'Now'} via Razorpay</button>;
                                    if (wType.includes("button") || wType === "add_to_cart") return <div className="w-full max-w-full overflow-hidden"><button className="font-bold border-none w-full shadow-sm" style={{...widget.styles, borderRadius: widget.styles?.borderRadius || '4px'}}>{widget.content}</button></div>;
                                    
                                    if (wType.includes("form") || wType === "file_upload") return (
                                      <div className="border p-6 rounded-lg bg-slate-50 w-full max-w-sm mx-auto flex flex-col gap-3 shadow-sm text-left">
                                        <span className="font-bold text-sm text-slate-700 text-center mb-2">{widget.name}</span>
                                        {widget.fields?.map((f, i) => <input key={i} type={f.type} placeholder={f.label} className="w-full border p-2.5 text-xs rounded bg-white" disabled/>) || <input type="text" placeholder="Email / Details" className="w-full border p-2.5 text-xs rounded bg-white" disabled/>}
                                        <button className="bg-slate-800 text-white font-bold p-3 rounded text-xs mt-2 uppercase tracking-wide">Submit Details</button>
                                      </div>
                                    );

                                    // Catch-all placeholder
                                    return (
                                      <div className="w-full flex flex-col text-left border p-3 bg-slate-50/50 rounded shadow-sm">
                                        <span className="text-[10px] font-black uppercase text-indigo-500 mb-1 opacity-70">{widget.name} Component</span>
                                        <div className="w-full leading-relaxed">{widget.content}</div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ➡️ RIGHT: SMART INSPECTOR PANEL */}
        {selectedWidgetNode && (
          <aside className={`w-[300px] border-l shadow-xl z-30 flex flex-col shrink-0 animate-fadeIn transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-0.5">Editing Widget</span>
                <span className="text-xs font-bold">{selectedWidgetNode.widget.name}</span>
              </div>
              <button onClick={() => setSelectedWidgetNode(null)} className="h-6 w-6 bg-slate-800 hover:bg-red-500 rounded flex items-center justify-center text-[10px]">✕</button>
            </div>

            <div className={`flex p-1 border-b ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
              {["content", "style", "spacing"].map(tab => (
                <button 
                  key={tab} onClick={() => setActiveInspectorTab(tab)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${activeInspectorTab === tab ? (isDarkMode ? "bg-slate-800 text-indigo-400 shadow-sm" : "bg-white text-indigo-600 shadow-sm") : (isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700")}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 content-scrollbar space-y-5">
              
              {/* CONTENT TAB */}
              {activeInspectorTab === "content" && (
                <div className={`space-y-4 text-left ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase">Redirect URL / Link</label>
                    <input type="url" placeholder="https://..." value={selectedWidgetNode.widget.redirectUrl || ""} onChange={(e) => updateSelectedWidgetAttributes({ redirectUrl: e.target.value })} className={`w-full text-xs p-2 border rounded focus:border-indigo-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase">Primary Content / Value</label>
                    <textarea rows={4} value={selectedWidgetNode.widget.content} onChange={(e) => updateSelectedWidgetAttributes({ content: e.target.value })} className={`w-full text-xs p-2 border rounded outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}`} />
                    
                    {!["divider", "spacer", "layout"].some(t => selectedWidgetNode.widget.type.includes(t)) && (
                      <button onClick={handleMagicAI} disabled={isAIGenerating} className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all">
                        {isAIGenerating ? "🤖 AI is writing..." : "✨ Enhance with AI"}
                      </button>
                    )}
                  </div>

                  {["image", "pdf_viewer", "video_embed", "audio_player", "file_upload"].includes(selectedWidgetNode.widget.type) && (
                    <div className="mt-4 p-4 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-center relative cursor-pointer transition-colors">
                      <input type="file" onChange={handleLocalFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center gap-1.5">
                         <span className="text-2xl">📁</span>
                         <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Upload Local File</span>
                         <span className="text-[9px] text-indigo-400 font-medium">Replaces the URL above</span>
                      </div>
                    </div>
                  )}

                  {selectedWidgetNode.widget.type === "razorpay_btn" && (
                    <div className={`space-y-2 mt-4 p-3 border rounded ${isDarkMode ? 'bg-slate-700 border-indigo-900' : 'bg-slate-50 border-indigo-100'}`}>
                      <label className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Checkout Pricing Config (₹)</label>
                      <div className="space-y-2">
                        <input type="number" placeholder="Original Rate (e.g., 5000)" value={selectedWidgetNode.widget.pricing?.rate || ""} onChange={(e) => updateSelectedWidgetAttributes({ pricing: { ...selectedWidgetNode.widget.pricing, rate: e.target.value } })} className={`w-full text-xs p-2 border rounded outline-none ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : ''}`} />
                        <input type="number" placeholder="Discount % (e.g., 20)" value={selectedWidgetNode.widget.pricing?.discount || ""} onChange={(e) => updateSelectedWidgetAttributes({ pricing: { ...selectedWidgetNode.widget.pricing, discount: e.target.value } })} className={`w-full text-xs p-2 border rounded outline-none ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : ''}`} />
                        <input type="number" placeholder="Final Selling Price" value={selectedWidgetNode.widget.pricing?.finalPrice || ""} onChange={(e) => updateSelectedWidgetAttributes({ pricing: { ...selectedWidgetNode.widget.pricing, finalPrice: e.target.value } })} className={`w-full text-xs p-2 border border-indigo-300 rounded outline-none ${isDarkMode ? 'bg-indigo-900 text-white' : 'bg-indigo-50 text-black'}`} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STYLE TAB */}
              {activeInspectorTab === "style" && (
                <div className={`space-y-4 text-left ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase">Text Color</label>
                      <input type="color" value={selectedWidgetNode.widget.styles?.color || "#000000"} onChange={(e) => updateSelectedWidgetAttributes({}, { color: e.target.value })} className="w-full h-8 cursor-pointer border rounded" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase">Background</label>
                      <input type="color" value={selectedWidgetNode.widget.styles?.backgroundColor || "#ffffff"} onChange={(e) => updateSelectedWidgetAttributes({}, { backgroundColor: e.target.value })} className="w-full h-8 cursor-pointer border rounded" />
                    </div>
                  </div>

                  <div className={`space-y-1 p-2 border rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50'}`}>
                    <label className="text-[9px] font-bold uppercase flex justify-between"><span>Font Size</span> <span className="text-indigo-500">{parseInt(selectedWidgetNode.widget.styles?.fontSize || "14")}px</span></label>
                    <input type="range" min="10" max="72" value={parseInt(selectedWidgetNode.widget.styles?.fontSize || "14")} onChange={(e) => updateSelectedWidgetAttributes({}, { fontSize: `${e.target.value}px` })} className="w-full accent-indigo-500" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase">Alignment</label>
                    <div className={`flex rounded p-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      {["left", "center", "right"].map(pos => (
                        <button key={pos} onClick={() => updateSelectedWidgetAttributes({}, { textAlign: pos })} className={`flex-1 py-1 text-xs rounded ${selectedWidgetNode.widget.styles?.textAlign === pos ? (isDarkMode ? "bg-slate-600 text-indigo-400 shadow" : "bg-white text-indigo-600 shadow") : ""}`}>
                           {pos === 'left' ? '⫷' : pos === 'center' ? '☰' : '⫸'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SPACING TAB */}
              {activeInspectorTab === "spacing" && (
                <div className={`space-y-4 text-left ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className={`p-3 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="text-[9px] font-bold uppercase mb-2 block">Inner Padding (px)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[9px] font-bold">Vertical (Y)</span>
                        <input type="range" min="0" max="100" value={parseInt(selectedWidgetNode.widget.styles?.paddingTop || "0")} onChange={(e) => updateSelectedWidgetAttributes({}, { paddingTop: `${e.target.value}px`, paddingBottom: `${e.target.value}px` })} className="w-full accent-indigo-500" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold">Horizontal (X)</span>
                        <input type="range" min="0" max="100" value={parseInt(selectedWidgetNode.widget.styles?.paddingLeft || "0")} onChange={(e) => updateSelectedWidgetAttributes({}, { paddingLeft: `${e.target.value}px`, paddingRight: `${e.target.value}px` })} className="w-full accent-emerald-500" />
                      </div>
                    </div>
                  </div>
                  
                  {selectedWidgetNode.widget.type === "spacer" && (
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase">Spacer Height</label>
                       <input type="range" min="10" max="200" onChange={(e) => updateSelectedWidgetAttributes({}, { verticalSpace: `${e.target.value}px` })} className="w-full accent-indigo-500" />
                    </div>
                  )}
                </div>
              )}

            </div>
          </aside>
        )}
      </div>

      {/* =========================================================================
          🌟 NEW: ADVANCED AI WEBSITE BUILDER MODAL UI
         ========================================================================= */}
      {isAIFunnelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className={`rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fadeIn border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-200'}`}>
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider m-0">Auto-Build Website</h3>
                  <p className="text-xs text-indigo-100 font-medium m-0">Give us the details, AI does the rest.</p>
                </div>
              </div>
              <button onClick={() => setIsAIFunnelModalOpen(false)} className="hover:text-indigo-200 font-black text-xl">✕</button>
            </div>

            <div className={`p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto content-scrollbar ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-800'}`}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Product Name</label>
                  <input type="text" value={aiForm.productName} onChange={(e) => setAiForm({...aiForm, productName: e.target.value})} className={`w-full p-2.5 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="e.g. Next.js Kit" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Target Location</label>
                  <select value={aiForm.targetLocation} onChange={(e) => setAiForm({...aiForm, targetLocation: e.target.value})} className={`w-full p-2.5 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`}>
                    <option value="India">India</option>
                    <option value="Abroad">Abroad / International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Business Category</label>
                  <input type="text" value={aiForm.businessCategory} onChange={(e) => setAiForm({...aiForm, businessCategory: e.target.value})} className={`w-full p-2.5 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="e.g. Software, Fitness" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Product Category</label>
                  <input type="text" value={aiForm.productCategories} onChange={(e) => setAiForm({...aiForm, productCategories: e.target.value})} className={`w-full p-2.5 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="e.g. SaaS, E-book" />
                </div>
              </div>

              <div className={`grid grid-cols-3 gap-2 p-3 border rounded shadow-sm ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'}`}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Rate</label>
                  <input type="number" value={aiForm.rate} onChange={(e) => setAiForm({...aiForm, rate: e.target.value})} className={`w-full p-2 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="₹999" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase opacity-70">Discount (%)</label>
                  <input type="number" value={aiForm.discount} onChange={(e) => setAiForm({...aiForm, discount: e.target.value})} className={`w-full p-2 rounded border text-sm outline-none ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-500 uppercase">Final Price</label>
                  <input type="number" value={aiForm.finalPrice} onChange={(e) => setAiForm({...aiForm, finalPrice: e.target.value})} className={`w-full p-2 rounded border border-indigo-400 text-sm outline-none ${isDarkMode ? 'bg-indigo-900 text-white' : 'bg-indigo-50'}`} placeholder="₹799" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase opacity-70">Additional Details</label>
                <textarea rows="3" value={aiForm.description} onChange={(e) => setAiForm({...aiForm, description: e.target.value})} className={`w-full p-2.5 rounded border text-sm resize-none outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}`} placeholder="Targeting busy founders..."></textarea>
              </div>

              <button onClick={handleGenerateFullFunnelWithAI} disabled={isBuildingFullFunnel || !aiForm.productName.trim()} className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black text-sm uppercase py-4 rounded-xl transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2">
                {isBuildingFullFunnel ? "Analyzing & Building..." : "✨ Generate My Website"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          🌟 TEMPLATE GALLERY MODAL UI 
         ========================================================================= */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider m-0">Template Gallery</h3>
                  <p className="text-[10px] text-slate-400 font-mono m-0">Load pre-built structural blueprints.</p>
                </div>
              </div>
              <button onClick={() => setIsTemplateModalOpen(false)} className="hover:text-red-400 font-black text-xl">✕</button>
            </div>
            <div className="p-6 bg-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
              {PREBUILT_TEMPLATES?.map((template) => (
                <div key={template.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer group" onClick={() => handleLoadTemplate(template.id)}>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{template.icon}</div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{template.name}</h4>
                  <p className="text-[11px] text-slate-500 flex-1 leading-relaxed">{template.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-1">
                      {Object.keys(template.data).map((pageName, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{pageName}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider group-hover:text-indigo-800">Load ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          👁️ PREVIEW OR PUBLISH SELECTION MODAL
         ========================================================================= */}
      {isPrePublishModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className={`rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 animate-fadeIn ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-black text-center uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Choose Action</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleCompileAndPublishFunnel(true)}
                className="w-full py-3 rounded-lg font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 uppercase text-xs tracking-wide shadow-sm"
              >
                👁️ Preview Website
              </button>
              <button
                onClick={() => handleCompileAndPublishFunnel(false)}
                className="w-full py-3 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-500 uppercase text-xs tracking-wide shadow-sm"
              >
                🚀 Publish to Live
              </button>
            </div>
            <button onClick={() => setIsPrePublishModalOpen(false)} className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-400 text-center mt-2 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* =========================================================================
          🎨 LIVE PUBLISH SUCCESS MODAL
         ========================================================================= */}
      {isPublishModalOpen && generatedClientFunnelLink && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className={`rounded-xl shadow-2xl border w-full max-w-lg overflow-hidden flex flex-col animate-fadeIn ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            <div className="bg-gradient-to-r from-[#0f172a] to-slate-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider m-0">Website Live Deployment</h3>
                  <p className="text-[10px] text-slate-300 font-mono m-0">URL successfully generated</p>
                </div>
              </div>
              <button onClick={() => setIsPublishModalOpen(false)} className="hover:text-red-400 font-black text-xl">✕</button>
            </div>

            <div className={`p-6 space-y-5 text-left font-sans ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded flex items-center gap-2 shadow-sm">
                <span>⚡</span>
                <span>Success: Website is now live!</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🔗 Your Live Website URL:</span>
                <div className={`flex gap-2 items-center p-3 border rounded-lg shadow-inner ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'}`}>
                  <input type="text" readOnly value={generatedClientFunnelLink.trim()} className={`flex-1 text-xs font-mono font-bold bg-transparent outline-none select-all ${isDarkMode ? 'text-indigo-300' : 'text-[#1e3a8a]'}`} />
                </div>

                <div className="flex gap-2 mt-4 pt-2">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(generatedClientFunnelLink.trim()); alert("📋 Link copied!"); }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-[10px] uppercase tracking-wider py-3 rounded-lg transition-transform active:scale-95"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => window.open(generatedClientFunnelLink.trim(), '_blank')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-lg transition-transform active:scale-95 shadow-md shadow-indigo-500/20"
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'My Website', url: generatedClientFunnelLink.trim() });
                      } else { alert("Share option not supported on this browser."); }
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-lg transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style jsx global>{`
        .content-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .content-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .content-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .bg-dot-matrix-mesh { background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 16px 16px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
}
