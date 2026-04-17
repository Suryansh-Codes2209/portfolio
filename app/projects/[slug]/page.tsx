import { redirect } from "next/navigation";

// Individual project detail pages are no longer used.
// All project links go to external URLs. Redirect to the projects listing.
export default function ProjectSlugPage() {
  redirect("/projects");
}
