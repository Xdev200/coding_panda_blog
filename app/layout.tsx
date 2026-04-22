import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coding Panda Blogs | Engineering Excellence",
    template: "%s | Coding Panda Blogs",
  },
  description:
    "Insights on modern web development, React, AI/ML, and design systems from the Coding Panda engineering team.",
  keywords: [
    "Software Engineering",
    "React Tutorial",
    "Next.js SEO",
    "AI Development",
    "Web Design",
    "Coding Panda",
  ],
  authors: [{ name: "Coding Panda Team", url: "https://codingpanda.taqnik.in" }],
  metadataBase: new URL("https://codingpanda.taqnik.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codingpanda.taqnik.in",
    siteName: "Coding Panda",
    title: "Coding Panda Blogs | Modern Engineering Insights",
    description: "Deep dives into React, web development, and AI/ML.",
    images: [
      {
        url: "/readme-banner.png",
        width: 1200,
        height: 630,
        alt: "Coding Panda Blogs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Panda Blogs | Modern Engineering Insights",
    description: "Articles on modern web development, Frontend, and AI/ML.",
    images: ["/readme-banner.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FDE047",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
