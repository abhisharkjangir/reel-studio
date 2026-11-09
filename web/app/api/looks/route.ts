import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { listJson, LOOK_PATH, putJson } from "@/lib/blob";
import { DEFAULT_LOOK, type Look } from "@/lib/constants";

export async function GET() {
  const looks = await listJson<Look>("looks/");
  looks.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return NextResponse.json({ looks });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.id ?? nanoid(10);
  const now = new Date().toISOString();
  const look: Look = {
    ...DEFAULT_LOOK,
    ...body,
    id,
    createdAt: body.createdAt ?? now,
  };
  await putJson<Look>(LOOK_PATH(id), look);
  return NextResponse.json({ look });
}
