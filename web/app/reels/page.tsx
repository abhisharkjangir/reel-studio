import { listJson } from "@/lib/blob";
import type { Job } from "@/lib/constants";
import { ReelsList } from "./ReelsList";

export const dynamic = "force-dynamic";

export default async function ReelsPage() {
  const jobs = await listJson<Job>("queue/");
  jobs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = {
    done: jobs.filter((j) => j.status === "done").length,
    inProgress: jobs.filter((j) => j.status === "rendering" || j.status === "claimed" || j.status === "pending").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your reels</h1>
          <p className="text-sm text-[color:var(--muted)]">{counts.done} ready · {counts.inProgress} in progress{counts.failed ? ` · ${counts.failed} failed` : ""}</p>
        </div>
      </div>
      <ReelsList initial={jobs} />
    </div>
  );
}
