import Link from "next/link";
import { listJson } from "@/lib/blob";
import type { Look } from "@/lib/constants";
import { LooksList } from "./LooksList";

export const dynamic = "force-dynamic";

export default async function LooksPage() {
  const looks = await listJson<Look>("looks/");
  looks.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Looks</h1>
        <Link href="/looks/new" className="btn btn-primary">+ Design a new look</Link>
      </div>
      <LooksList looks={looks} />
    </div>
  );
}
