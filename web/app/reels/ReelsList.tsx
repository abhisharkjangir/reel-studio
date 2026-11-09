"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/lib/constants";

export function ReelsList({ initial }: { initial: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initial);

  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch("/api/jobs", { cache: "no-store" });
        const data = await res.json();
        setJobs(data.jobs);
      } catch {}
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);

  if (jobs.length === 0) return <div className="card p-8 text-center text-[color:var(--muted)]">No reels yet. Make your first one.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((j) => <JobCard key={j.id} job={j} />)}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const label = job.input.topic || (job.input.ownScript?.slice(0, 60) + "…") || "untitled";
  async function retry() {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "pending", error: null }),
    });
  }
  async function del() {
    if (!confirm("Delete this reel?")) return;
    await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
  }
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">{label}</div>
          <div className="text-xs text-[color:var(--muted)]">{job.input.language} · {new Date(job.createdAt).toLocaleString()}</div>
        </div>
        <StatusChip status={job.status} />
      </div>

      {job.status === "done" && job.output ? (
        <>
          {job.output.mp4Url && (
            <video src={job.output.mp4Url} poster={job.output.coverUrl} controls className="w-full rounded-lg bg-black" style={{ aspectRatio: "9 / 16" }} />
          )}
          <div className="flex gap-2 flex-wrap text-xs">
            <button className="chip" onClick={() => copy(job.output!.caption)}>Copy caption</button>
            <button className="chip" onClick={() => copy(job.output!.hashtags.join(" "))}>Copy hashtags</button>
            <button className="chip" onClick={() => copy(job.output!.keywords.join(", "))}>Copy keywords</button>
            {job.output.mp4Url && <a className="chip" href={job.output.mp4Url} download>Download mp4</a>}
          </div>
        </>
      ) : job.status === "failed" ? (
        <div className="card p-3" style={{ borderColor: "#dc2626" }}>
          <div className="text-xs font-semibold text-red-300">Failed</div>
          <div className="text-xs text-[color:var(--muted)]">{job.error ?? "unknown error"}</div>
          <div className="flex gap-2 mt-2">
            <button className="chip" onClick={retry}>Retry</button>
            <button className="chip" onClick={del}>Delete</button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-[color:var(--muted)] flex items-center justify-between">
          <span>Updated {new Date(job.updatedAt).toLocaleTimeString()}</span>
          <button className="chip" onClick={del}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function StatusChip({ status }: { status: Job["status"] }) {
  const map: Record<Job["status"], { label: string; color: string }> = {
    pending:   { label: "pending",   color: "#64748b" },
    claimed:   { label: "claimed",   color: "#f59e0b" },
    rendering: { label: "rendering", color: "#8b5cf6" },
    done:      { label: "done",      color: "#22c55e" },
    failed:    { label: "failed",    color: "#dc2626" },
  };
  const s = map[status];
  return <span className="chip" style={{ background: s.color, color: "white", borderColor: s.color }}>{s.label}</span>;
}
