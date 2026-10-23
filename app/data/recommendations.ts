// Recommendations — rendered on the home page and in the Remotion "Receipts"
// scene. `highlight` is the phrase that gets the marker swipe.

export type Recommendation = {
  name: string;
  initials: string;
  tagline: string;
  relation: string;
  date: string;
  source: string;
  sourceUrl: string;
  paragraphs: string[];
  highlight: string;
};

export const recommendations: Recommendation[] = [
  {
    name: "Prem Ranjan",
    initials: "PR",
    tagline: "Developer · Mentor · Interviewer · Java · React · Microservices · AWS · Python · AI/ML · LLM",
    relation: "Worked with Suryansh on the same team",
    date: "January 16, 2025",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/in/suryansh-chaudhary-2209/details/recommendations/",
    paragraphs: [
      "I had the privilege of mentoring Suryansh, and I've been genuinely impressed by his technical expertise and problem-solving abilities. He's highly skilled in web development, with a strong grasp of Next.js, React.js, and JavaScript frameworks, and he has hands-on experience working with OpenAI technologies and AI/ML applications.",
      "Suryansh approaches challenges with a clear, analytical mindset, consistently delivering thoughtful and effective solutions. His dedication to learning, coupled with his ability to share knowledge and collaborate, makes him a standout professional. I'm confident he'll excel in any role he takes on.",
    ],
    highlight: "makes him a standout professional",
  },
];
