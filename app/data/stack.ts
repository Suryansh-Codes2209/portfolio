// The toolkit, grouped. Rendered by the home page stack section and the
// Remotion "Stack" scene. `color` is the brand hue used on hover/stickers.
import type { ComponentType, CSSProperties } from "react";
import { Boxes, Cloud, Code2, Infinity as InfinityIcon, MessagesSquare, Network, Sparkles } from "lucide-react";
import {
  SiDjango, SiDocker, SiFastapi, SiFigma, SiFramer, SiGit, SiGithubactions, SiGooglecloud,
  SiGooglegemini, SiGraphql, SiLangchain, SiLinux, SiMongodb, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPostman, SiPython, SiReact, SiRedis, SiTailwindcss, SiTypescript,
} from "react-icons/si";

export type Tech = { name: string; Icon: ComponentType<{ className?: string; style?: CSSProperties }>; color: string };
export type Category = { label: string; items: Tech[] };

// `color` is the brand hue used on hover; `null`-ish brands fall back to the accent token.
const ACCENT = "var(--accent)";

export const categories: Category[] = [
  {
    label: "AI & Agents",
    items: [
      { name: "LangGraph", Icon: SiLangchain, color: "#1C3C3C" },
      { name: "LangChain", Icon: SiLangchain, color: "#1C3C3C" },
      { name: "Gemini API", Icon: SiGooglegemini, color: "#8E75B2" },
      { name: "OpenAI API", Icon: Sparkles, color: ACCENT },
      { name: "RAG / Vector Search", Icon: Boxes, color: ACCENT },
      { name: "Prompt Engineering", Icon: MessagesSquare, color: ACCENT },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Python", Icon: SiPython, color: "#3776AB" },
      { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
      { name: "Django", Icon: SiDjango, color: "#44B78B" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
      { name: "REST APIs", Icon: Network, color: ACCENT },
      { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: ACCENT },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
    ],
  },
  {
    label: "Database",
    items: [
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
      { name: "Redis", Icon: SiRedis, color: "#FF4438" },
    ],
  },
  {
    label: "DevOps & Cloud",
    items: [
      { name: "Google Cloud Run", Icon: SiGooglecloud, color: "#4285F4" },
      { name: "Docker", Icon: SiDocker, color: "#2496ED" },
      { name: "AWS", Icon: Cloud, color: "#FF9900" },
      { name: "CI/CD", Icon: InfinityIcon, color: ACCENT },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "VS Code", Icon: Code2, color: "#3B82F6" },
      { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { name: "Linux", Icon: SiLinux, color: "#FCC624" },
      { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
    ],
  },
];
