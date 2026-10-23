// Career history — rendered by the home page timeline and the Remotion
// "Timeline" scene, so edit it here once.

export type Experience = {
  role: string;
  company: string;
  period: string;
  type: string;
  desc: string;
  tech: string[];
};

export const experience: Experience[] = [
  {
    role: "Full Stack AI Engineer",
    company: "Spiral Kite Labs",
    period: "2024 – Present",
    type: "Full-time",
    desc: "Own the full product stack of an early-stage AI startup — LangGraph agent architecture, LangChain tool integrations, FastAPI backend, Google Cloud Run infrastructure, and the React frontend. Building a financial research AI agent that autonomously retrieves market data, reasons across sources, and produces structured analyst-grade reports.",
    tech: ["LangGraph", "LangChain", "FastAPI", "Python", "React", "Google Cloud Run", "Docker"],
  },
  {
    role: "Software Developer",
    company: "AutoText",
    period: "2023 – 2024",
    type: "Full-time",
    desc: "Shipped production features across the full stack — React frontend, Django / FastAPI backend, PostgreSQL. Owned API integrations and refactored the core data pipeline for high-frequency workloads.",
    tech: ["Django", "FastAPI", "React", "PostgreSQL", "REST APIs"],
  },
  {
    role: "Intern — Databases & Algorithms",
    company: "NITI Aayog (Government of India)",
    period: "2022 – 2023",
    type: "Part-time · 1.5 yrs",
    desc: "Worked on data pipelines and database systems supporting policy research. Applied algorithms and data-structure techniques to large-scale government datasets.",
    tech: ["Python", "Databases", "Algorithms", "Data Analysis"],
  },
  {
    role: "Summer Intern",
    company: "OnGraph Technologies",
    period: "2021",
    type: "Internship",
    desc: "Contributed to product work using NoSQL databases, wrote technical documentation, and participated in agile sprints and code reviews.",
    tech: ["NoSQL", "Technical Writing", "Agile"],
  },
];

export const education = [
  {
    degree: "B.Tech — Computer Science (AI)",
    institution: "Poornima Group",
    period: "2019 – 2023",
  },
];

export const coreStrengths = ["System Design", "API Architecture", "Performance Optimisation", "TypeScript", "CI/CD", "Agile / Scrum"];
