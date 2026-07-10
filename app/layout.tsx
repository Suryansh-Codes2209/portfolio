import type React from "react";
import "../global.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import type { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { ScrollProgress } from "./components/scroll-progress";
import { CursorGlow } from "./components/cursor-glow";
import { BackToTop } from "./components/back-to-top";

export const metadata: Metadata = {
  metadataBase: new URL("https://suryansh.work"),
  title: {
    default: "Suryansh Chaudhary | Builds & ships products in public",
    template: "%s | Suryansh Chaudhary",
  },
  description:
    "Suryansh Chaudhary builds and ships products in public — creator of MacGet (open-source macOS download manager) and AI agents in production.",
  keywords: [
    "Suryansh Chaudhary",
    "build in public",
    "MacGet",
    "macOS download manager",
    "open source",
    "indie hacker",
    "AI agents",
    "LangGraph",
    "Full Stack AI Engineer",
    "yt-dlp GUI Mac",
  ],
  creator: "Suryansh Chaudhary",
  openGraph: {
    title: "Suryansh Chaudhary | Builds & ships products in public",
    description:
      "Suryansh Chaudhary builds and ships products in public — creator of MacGet (open-source macOS download manager) and AI agents in production.",
    url: "https://suryansh.work",
    siteName: "Suryansh Chaudhary's Portfolio",
    images: [
      {
        url: "https://suryansh.work/og.png",
        width: 1920,
        height: 1080,
        alt: "Suryansh Chaudhary — builds and ships products in public",
      },
    ],
    locale: "en-US",
    type: "website",
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
  twitter: {
    title: "Suryansh Chaudhary | Builds & ships products in public",
    card: "summary_large_image",
    description:
      "Creator of MacGet (open-source macOS download manager). I build and ship products in public — open-source tools + AI systems.",
    images: ["https://suryansh.work/og.png"],
    creator: "@Suryansh_2001",
  },
  icons: {
    shortcut: "/favicon.png",
  },
  alternates: {
    canonical: "https://suryansh.work",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable, jetbrainsMono.variable].join(" ")}>
      <head>
        <Analytics />
        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Suryansh Chaudhary",
              url: "https://suryansh.work",
              jobTitle: "Software Engineer & Indie Builder",
              description:
                "Builds and ships products in public — creator of MacGet (open-source macOS download manager) and AI agents in production.",
              sameAs: [
                "https://github.com/Suryansh-Codes2209",
                "https://www.linkedin.com/in/suryansh-chaudhary-2209/",
                "https://x.com/Suryansh_2001",
              ],
              knowsAbout: [
                "Build in Public",
                "Open Source Software",
                "macOS Development",
                "Swift",
                "AI Agents",
                "LangGraph",
                "Full Stack Development",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`grain bg-black ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <ScrollProgress />
        <CursorGlow />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
