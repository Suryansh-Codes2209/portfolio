import type React from "react";
import "../global.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import type { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { ScrollProgress } from "./components/scroll-progress";
import { CursorGlow } from "./components/cursor-glow";
import { BackToTop } from "./components/back-to-top";
import { MotionProvider } from "./components/motion-provider";
import { ThemeProvider } from "./components/theme-provider";

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
  icons: {
    shortcut: "/favicon.png",
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
    <html lang="en" suppressHydrationWarning className={[inter.variable, calSans.variable, jetbrainsMono.variable].join(" ")}>
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
                  worksFor: {
                    "@type": "Organization",
                    name: "Spiral Kite Labs",
                  },
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "Poornima Group",
                  },
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
                    "LangChain",
                    "Retrieval-Augmented Generation",
                    "FastAPI",
                    "Next.js",
                    "Full Stack Development",
                  ],
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
                  about: { "@id": "https://suryansh.work/#person" },
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`grain bg-bg text-fg ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <ThemeProvider>
          <ScrollProgress />
          <CursorGlow />
          <MotionProvider>{children}</MotionProvider>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
