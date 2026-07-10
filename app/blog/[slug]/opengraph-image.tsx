import { ImageResponse } from "next/og";
import { allBlogs } from "contentlayer/generated";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Suryansh Chaudhary — build log";

export default async function OgImage({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  const title = post?.title ?? "Build log";
  const tag = post?.tags?.[0] ?? "build in public";

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#08070a", padding: 80, color: "#f5f4f2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#d97757", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          suryansh.work · {tag}
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "#a1a1aa" }}>
          <span>Suryansh Chaudhary</span>
          <span style={{ color: "#d97757" }}>Building in public</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
