import type React from "react";
import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import type { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { ScrollProgress } from "./components/scroll-progress";
import { CursorGlow } from "./components/cursor-glow";
import { BackToTop } from "./components/back-to-top";

export const metadata: Metadata = {
  title: {
    default: "Suryansh Chaudhary | Full Stack Developer",
    template: "%s | Suryansh Chaudhary - Full Stack Developer",
  },
  description:
    "Full Stack Developer with 1+ year of startup experience, specializing in modern web development with React, Node.js, and cloud technologies. Open to new opportunities and collaborations.",
  keywords: [
    "Suryansh Chaudhary",
    "Full Stack Developer",
    "Web Developer",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "TypeScript",
    "Frontend Development",
    "Backend Development",
  ],
  creator: "Suryansh Chaudhary",
  openGraph: {
    title: "Suryansh Chaudhary | Full Stack Developer",
    description:
      "Full Stack Developer with 1+ year of startup experience, specializing in modern web development with Nextjs, Node.js, and cloud technologies. Open to new opportunities and collaborations.",
    url: "https://suryansh.work",
    siteName: "Suryansh Chaudhary's Portfolio",
    images: [
      {
        url: "https://suryansh.work/og.png",
        width: 1920,
        height: 1080,
        alt: "Suryansh Chaudhary - Full Stack Developer Portfolio",
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
    title: "Suryansh Chaudhary - Full Stack Developer",
    card: "summary_large_image",
    description:
      "Full Stack Developer specializing in modern web technologies. View my portfolio and let's connect!",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
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
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer with expertise in modern web technologies",
              sameAs: [
                "https://github.com/Suryansh-Codes2209",
                "https://www.linkedin.com/in/suryansh-chaudhary-2209/",
                "https://x.com/Suryansh_2001",
              ],
              skills: [
                "React",
                "Node.js",
                "TypeScript",
                "JavaScript",
                "Full Stack Development",
                "Web Development",
                "Cloud Technologies",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`bg-black ${
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
