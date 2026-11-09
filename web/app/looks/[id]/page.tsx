import { notFound } from "next/navigation";
import { getJson, LOOK_PATH } from "@/lib/blob";
import type { Look } from "@/lib/constants";
import { LookDesigner } from "@/components/LookDesigner";

export const dynamic = "force-dynamic";

export default async function EditLookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const look = await getJson<Look>(LOOK_PATH(id));
  if (!look) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit look · {look.name}</h1>
      <LookDesigner initial={look} />
    </div>
  );
}
