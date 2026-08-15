import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"; // Sahi CSS global path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FunnelForge Engine Studio",
  description: "High-Performance Campaign Ingestion Framework",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#f4f6f9] text-slate-800 m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}