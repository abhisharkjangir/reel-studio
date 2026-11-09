import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { JOB_PATH, listJson, putJson } from "@/lib/blob";
import { DEFAULT_LOOK, type Job, type Look } from "@/lib/constants";
import { getJson, LOOK_PATH } from "@/lib/blob";

export async function GET() {
  const jobs = await listJson<Job>("queue/");
  jobs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.topic?.trim() && !body.ownScript?.trim()) {
    return NextResponse.json({ error: "Provide a topic or your own script." }, { status: 400 });
  }

  let lookId: string | undefined = body.lookId;
  if (!lookId) {
    // Auto-create a default look if the user never designed one.
    const defaultId = "default";
    const existing = await getJson<Look>(LOOK_PATH(defaultId));
    if (!existing) {
      const now = new Date().toISOString();
      await putJson<Look>(LOOK_PATH(defaultId), { ...DEFAULT_LOOK, id: defaultId, createdAt: now });
    }
    lookId = defaultId;
  }

  const id = nanoid(12);
  const now = new Date().toISOString();
  const job: Job = {
    id,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    input: {
      topic: body.topic ?? "",
      ownScript: body.ownScript ?? "",
      language: body.language ?? "hinglish",
      hookStyle: body.hookStyle ?? "auto",
      cta: body.cta ?? "auto",
      notes: body.notes ?? "",
      lookId,
    },
    output: null,
    error: null,
  };

  await putJson<Job>(JOB_PATH(id), job);
  return NextResponse.json({ job });
}
