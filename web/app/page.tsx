import { listJson } from "@/lib/blob";
import type { Look } from "@/lib/constants";
import { TopicForm } from "@/components/TopicForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const looks = await listJson<Look>("looks/");
  looks.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">
        Make a <span className="text-[color:var(--accent)]">reel</span>
      </h1>
      <p className="text-sm text-[color:var(--muted)] mb-8">
        Type a topic. The Kaggle worker builds the reel. Comes back with mp4 + caption + hashtags.
      </p>
      <TopicForm looks={looks} />
    </div>
  );
}
