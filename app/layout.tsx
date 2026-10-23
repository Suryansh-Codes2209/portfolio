import type React from "react";
import "../global.css";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import type { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { GoogleAnalytics } from "./components/google-analytics";
import { ScrollProgress } from "./components/scroll-progress";
import { BackToTop } from "./components/back-to-top";
import { MotionProvider } from "./components/motion-provider";
import { ThemeProvider } from "./components/theme-provider";
import { PRODUCTS, SAME_AS } from "./data/site";

const SITE_TITLE =
  "Suryansh Chaudhary — Full-Stack AI Engineer & creator of MacGet";
const SITE_DESCRIPTION =
  "Suryansh Chaudhary is a Full-Stack AI Engineer building LangGraph agents in production and MacGet, a free open-source download manager for macOS. Build logs, projects, and engineering notes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://suryansh.work"),
  title: {
    default: SITE_TITLE,
    template: "%s | Suryansh Chaudhary",
  },
  description: SITE_DESCRIPTION,
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
  applicationName: "Suryansh Chaudhary",
  authors: [{ name: "Suryansh Chaudhary", url: "https://suryansh.work" }],
  creator: "Suryansh Chaudhary",
  publisher: "Suryansh Chaudhary",
  category: "technology",
  // Set GOOGLE_SITE_VERIFICATION in Vercel to emit the Search Console meta tag.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://suryansh.work",
    siteName: "Suryansh Chaudhary",
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
    title: SITE_TITLE,
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
    images: ["https://suryansh.work/og.png"],
    creator: "@Suryansh_2001",
    site: "@Suryansh_2001",
  },
  // Google only shows a favicon in Search when it is square AND a multiple of
  // 48px, so every icon here sits on the 48px grid. /favicon.ico (16/32/48) is
  // the path Google probes even when no <link> points at it — keep it in place.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-480.png", sizes: "480x480", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: "https://suryansh.work",
    types: { "application/rss+xml": "https://suryansh.work/rss.xml" },
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

// Vox-style headline serif.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
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
    <html lang="en" suppressHydrationWarning className={[inter.variable, calSans.variable, instrumentSerif.variable, jetbrainsMono.variable].join(" ")}>
      <head>
        <Analytics />
        {/* JSON-LD entity graph — one stable @id per entity so Google can
            disambiguate this Suryansh Chaudhary from the many others. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://suryansh.work/#person",
                  name: "Suryansh Chaudhary",
                  url: "https://suryansh.work",
                  image: "https://suryansh.work/Profile.png",
                  jobTitle: "Full-Stack AI Engineer",
                  description: SITE_DESCRIPTION,
                  email: "mailto:suryansh.codes2001@gmail.com",
                  // The single strongest disambiguation signal on the page:
                  // states which Suryansh Chaudhary this is by what he built.
                  mainEntityOfPage: { "@id": "https://suryansh.work/#profilepage" },
                  worksFor: {
                    "@type": "Organization",
                    name: "Spiral Kite Labs",
                  },
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "Poornima Group",
                  },
                  sameAs: SAME_AS,
                  knowsAbout: [
                    "Build in Public",
                    "Open Source Software",
                    "macOS Development",
                    "Swift",
                    "AI Agents",
                    "LangGraph",
                    "LangChain",
                    "Retrieval-Augmented Generation",
                    "FastAPI",
                    "Next.js",
                    "Full Stack Development",
                  ],
                  knowsLanguage: "en",
                },
                {
                  // Names the product as its own entity and hangs it off the
                  // Person, so "creator of MacGet" is a stated fact rather than
                  // something Google has to infer from prose.
                  "@type": "SoftwareApplication",
                  "@id": "https://suryansh.work/#macget",
                  name: "MacGet",
                  url: "https://macget.suryansh.work",
                  applicationCategory: "UtilitiesApplication",
                  operatingSystem: "macOS",
                  description:
                    "A free, open-source download manager for macOS — chunked parallel downloads, browser capture, BitTorrent, and bundled yt-dlp for video.",
                  image: "https://suryansh.work/macget-og.png",
                  author: { "@id": "https://suryansh.work/#person" },
                  creator: { "@id": "https://suryansh.work/#person" },
                  // The Product Hunt listing is a second, independent page about
                  // the same product — naming it here links the two entities.
                  sameAs: [PRODUCTS.macget.productHunt, PRODUCTS.macget.github],
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://suryansh.work/#oratora",
                  name: "Oratora",
                  url: PRODUCTS.oratora.url,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Any (web browser)",
                  browserRequirements: "Requires JavaScript",
                  description:
                    "Live audience engagement for talks, classes and events — polls, word clouds, Q&A and quizzes the room joins from a phone browser with a code. No app, no account.",
                  author: { "@id": "https://suryansh.work/#person" },
                  creator: { "@id": "https://suryansh.work/#person" },
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://suryansh.work/#website",
                  url: "https://suryansh.work",
                  name: "Suryansh Chaudhary",
                  description: SITE_DESCRIPTION,
                  inLanguage: "en-US",
                  publisher: { "@id": "https://suryansh.work/#person" },
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://suryansh.work/#profilepage",
                  url: "https://suryansh.work",
                  name: SITE_TITLE,
                  isPartOf: { "@id": "https://suryansh.work/#website" },
                  mainEntity: { "@id": "https://suryansh.work/#person" },
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`grain bg-bg text-fg ${
          process.env.NODE_ENV === "development" ? "debug-screens" : ""
        }`}
      >
        <GoogleAnalytics />
        <ThemeProvider>
          <ScrollProgress />
          <MotionProvider>{children}</MotionProvider>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
