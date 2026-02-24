import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "NavZen - Smart Search Hub",
  description:
    "A clean, fast search hub with multiple search engines, real-time suggestions, search history, and dark mode. Your minimal new tab page.",
  keywords: [
    "search engine",
    "new tab",
    "start page",
    "search hub",
    "google search",
    "bing search",
    "dark mode",
    "search suggestions",
  ],
  openGraph: {
    title: "NavZen - Smart Search Hub",
    description:
      "A clean, fast search hub with multiple search engines, real-time suggestions, and dark mode.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NavZen - Smart Search Hub",
    description:
      "A clean, fast search hub with multiple search engines, real-time suggestions, and dark mode.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
