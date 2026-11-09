"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Look } from "@/lib/constants";
import { PhonePreview } from "@/components/PhonePreview";

export function LooksList({ looks }: { looks: Look[] }) {
  const router = useRouter();

  async function remove(id: string) {
    if (!confirm("Delete this look?")) return;
    await fetch(`/api/looks/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (looks.length === 0) {
    return (
      <div className="card p-8 text-center text-[color:var(--muted)]">
        No looks saved yet. <Link href="/looks/new" className="underline">Design your first one</Link>.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {looks.map((l) => (
        <div key={l.id} className="card p-4">
          <div className="flex justify-center mb-3"><PhonePreview look={l} width={200} /></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{l.name}</div>
              <div className="text-xs text-[color:var(--muted)]">{l.format} · {l.theme}</div>
            </div>
            <div className="flex gap-1">
              <Link href={`/looks/${l.id}`} className="chip">edit</Link>
              <button className="chip" onClick={() => remove(l.id)}>delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
