// A skills page that is only a wall of logos gives Google nothing to index.
// Every entry here carries the sentence that says what was actually built with
// it — that prose is the part that can rank for a long-tail query.

export type Skill = { name: string; note: string };
export type SkillGroup = {
	slug: string;
	label: string;
	blurb: string;
	skills: Skill[];
};

export const SKILL_GROUPS: SkillGroup[] = [
	{
		slug: "ai-agents",
		label: "AI agents & LLM engineering",
		blurb:
			"The core of the day job: multi-agent research systems that have to survive contact with real users and real money. Explicit state, small nodes, narrow tool boundaries, and gates on the decisions a model should not be making.",
		skills: [
			{
				name: "LangGraph",
				note: "Control plane for a multi-agent financial research desk — conditional routing, explicit graph state, and supervisor nodes that decide which specialist runs next.",
			},
			{
				name: "LangChain",
				note: "Tool integrations and model adapters around the graph, including cost-aware routing between model tiers for different nodes.",
			},
			{
				name: "Agentic RAG",
				note: "Retrieval that plans, checks its own evidence, and only then answers — built on Vertex AI's managed multimodal RAG Engine so charts and tables in filings survive ingestion.",
			},
			{
				name: "Prompt-injection defence",
				note: "Layered guardrails: deterministic hard gates for the non-negotiables plus an LLM-as-judge soft gate for ambiguity, after finding the refusal message itself was leaking the system prompt.",
			},
			{
				name: "Gemini API",
				note: "Multimodal generation and image pipelines, including the script that generates every cover image on this blog.",
			},
			{
				name: "OpenAI API",
				note: "Streaming completions and tool calling behind a provider-agnostic interface.",
			},
			{
				name: "Model Context Protocol (MCP)",
				note: "Server and payload design — closed vocabularies and schema-constrained returns, because the payload is the real integration surface.",
			},
			{
				name: "Vector search & embeddings",
				note: "Chunking strategy, retrieval evaluation, and groundedness scoring on financial documents.",
			},
		],
	},
	{
		slug: "backend",
		label: "Backend & APIs",
		blurb:
			"Treating the model as an unreliable, expensive network call, and building everything around it to be fast, cheap and boring.",
		skills: [
			{ name: "Python", note: "Primary backend language for agent services and data pipelines." },
			{
				name: "FastAPI",
				note: "Streaming LLM responses, background jobs, and the API layer the agent frontend talks to.",
			},
			{ name: "Django", note: "Conventional CRUD products where batteries-included wins." },
			{
				name: "Node.js",
				note: "CLI tooling and realtime services — Signal Boy is a zero-dependency Node CLI with per-OS radio backends.",
			},
			{
				name: "Socket.IO",
				note: "Oratora's realtime tier, scaled separately from the app and load-tested at 1,000 simultaneous joins.",
			},
			{ name: "REST & GraphQL", note: "Versioned APIs, typed SDKs, and error contracts that clients can rely on." },
		],
	},
	{
		slug: "frontend",
		label: "Frontend",
		blurb:
			"Interfaces for systems that stream, fail partway, and change their answer mid-render.",
		skills: [
			{ name: "React", note: "Component architecture and state management for agent-driven UIs." },
			{
				name: "Next.js",
				note: "App Router, server components, route-level metadata and static generation — this site and Oratora both run on it.",
			},
			{ name: "TypeScript", note: "Strict types end to end, including shared contracts between backend and client." },
			{ name: "Tailwind CSS", note: "Token-driven design systems rather than ad-hoc utility soup." },
			{ name: "Framer Motion", note: "Scroll-linked and gesture animation that respects reduced-motion." },
		],
	},
	{
		slug: "macos",
		label: "macOS & Swift",
		blurb:
			"MacGet is the proving ground — a native download manager where concurrency bugs show up as a stalled progress bar rather than a stack trace.",
		skills: [
			{ name: "Swift", note: "An actor-based download engine handling chunked parallel HTTP transfers." },
			{ name: "SwiftUI", note: "The full MacGet interface, including queue management and live transfer state." },
			{
				name: "Swift concurrency",
				note: "Actors and structured concurrency to keep chunk writers, the UI, and the scheduler from fighting over shared state.",
			},
			{
				name: "Native Messaging",
				note: "Browser-extension capture that hands downloads from Chrome and Safari to the app.",
			},
			{ name: "BitTorrent & yt-dlp", note: "Torrent transfers and bundled yt-dlp for one-click video downloads." },
		],
	},
	{
		slug: "data",
		label: "Data",
		blurb: "Storage picked for the access pattern rather than the résumé.",
		skills: [
			{ name: "PostgreSQL", note: "Relational core for Oratora and the blog's subscriber and likes data." },
			{ name: "MongoDB", note: "Document storage for semi-structured agent traces and run history." },
			{ name: "Redis", note: "Pub/sub fan-out for realtime, plus caching and rate limiting in front of expensive model calls." },
		],
	},
	{
		slug: "cloud",
		label: "Cloud & DevOps",
		blurb:
			"Shipping and paying for AI workloads — the part that decides whether a demo becomes a product.",
		skills: [
			{ name: "Google Cloud Run", note: "Containerised agent services with request-scoped scaling." },
			{ name: "Vertex AI", note: "Managed multimodal RAG Engine as the data plane under LangGraph." },
			{ name: "Docker", note: "Reproducible builds for Python services and CI." },
			{ name: "GitHub Actions", note: "CI/CD, release automation, and macOS build and notarisation for MacGet." },
			{ name: "Vercel", note: "Edge hosting for this site and Oratora's web tier." },
			{ name: "Linux", note: "Day-to-day server work and per-OS backends for Signal Boy." },
		],
	},
];
