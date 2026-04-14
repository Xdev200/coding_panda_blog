import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coding Panda Blogs",
    template: "%s | Coding Panda Blogs",
  },
  description:
    "Articles on modern web development, React components, and design systems from the Coding Panda team.",
  keywords: ["react", "webdev", "javascript", "design systems"],
  authors: [{ name: "Coding Panda Team", url: "https://codingpanda.dev" }],
  metadataBase: new URL("https://codingpanda.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codingpanda.dev/blogs",
    siteName: "Coding Panda",
    title: "Coding Panda Blogs",
    description: "Deep dives into React, web development, and AI/ML.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Panda Blogs",
    description: "Articles on modern web development,Frontend and AI/ML.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
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
