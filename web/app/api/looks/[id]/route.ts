import { NextResponse } from "next/server";
import { deleteBlob, getJson, LOOK_PATH, putJson } from "@/lib/blob";
import type { Look } from "@/lib/constants";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const look = await getJson<Look>(LOOK_PATH(id));
  if (!look) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ look });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const patch = await req.json();
  const existing = (await getJson<Look>(LOOK_PATH(id))) ?? { id, createdAt: new Date().toISOString() };
  const merged = { ...existing, ...patch, id } as Look;
  await putJson<Look>(LOOK_PATH(id), merged);
  return NextResponse.json({ look: merged });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteBlob(LOOK_PATH(id));
  return NextResponse.json({ ok: true });
}
