import { NextResponse } from "next/server";
import { deleteBlob, getJson, JOB_PATH, putJson } from "@/lib/blob";
import type { Job } from "@/lib/constants";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await getJson<Job>(JOB_PATH(id));
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteBlob(JOB_PATH(id));
  return NextResponse.json({ ok: true });
}

// PATCH lets the user retry a failed job by resetting its status.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await getJson<Job>(JOB_PATH(id));
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  const patch = await req.json();
  const updated: Job = { ...job, ...patch, updatedAt: new Date().toISOString() };
  await putJson<Job>(JOB_PATH(id), updated);
  return NextResponse.json({ job: updated });
}
