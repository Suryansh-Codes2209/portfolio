import { getProofStats } from "@/app/data/stats";

export const revalidate = 86400;

export async function GET() {
  const stats = await getProofStats();
  return Response.json(stats);
}
