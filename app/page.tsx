import { Hero } from "./components/hero";
import { AboutSection } from "./components/sections/about";
import { BlogSection } from "./components/sections/blog";
import { ContactSection } from "./components/sections/contact";
import { HomeNav } from "./components/sections/home-nav";
import { NowSection } from "./components/sections/now";
import { ProjectsSection } from "./components/sections/projects";
import { RecommendationsSection } from "./components/sections/recommendations";
import { ResumeSection } from "./components/sections/resume";
import { SiteFooter } from "./components/site-footer";
import { TechStack } from "./components/tech-stack";
import { JourneyBoard } from "./components/vox/journey-board";

// The home page reads as one Vox-style explainer: a cold open, then eight
// numbered chapters laid out as full-screen panels on a board. Scrolling
// moves the camera across it in a snake — left, down, right, down — and
// settles on each chapter. Each section owns its own data and interactivity.
const CHAPTERS = ["Cold open", "Now", "About", "Toolkit", "Work", "Receipts", "Writing", "Career", "Say hello"];

export default function Home() {
  return (
    // overflow-x-clip, not -hidden: hidden makes a scroll container and breaks
    // the board's sticky viewport.
    <div className="overflow-x-clip">
      <HomeNav />
      <main>
        <JourneyBoard labels={CHAPTERS}>
          <Hero />
          <NowSection />
          <AboutSection />
          <TechStack />
          <ProjectsSection />
          <RecommendationsSection />
          <BlogSection />
          <ResumeSection />
          <ContactSection />
        </JourneyBoard>
      </main>
      <SiteFooter />
    </div>
  );
}
