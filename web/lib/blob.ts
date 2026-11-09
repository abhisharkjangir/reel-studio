// Vercel Blob helpers. Jobs and looks are stored as JSON files keyed by UUID.
// The notebook on Kaggle reads/writes the same blobs via the Blob REST API.

import { put, list, del, head } from "@vercel/blob";

const COMMON_PUT_OPTS = {
  access: "public" as const,
  allowOverwrite: true,
  addRandomSuffix: false,
  contentType: "application/json",
};

export async function putJson<T>(path: string, data: T): Promise<string> {
  const body = JSON.stringify(data, null, 2);
  const { url } = await put(path, body, COMMON_PUT_OPTS);
  return url;
}

export async function getJson<T>(path: string): Promise<T | null> {
  try {
    const meta = await head(path);
    const res = await fetch(meta.downloadUrl, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function listJson<T>(prefix: string): Promise<T[]> {
  const { blobs } = await list({ prefix, limit: 1000 });
  const results = await Promise.all(
    blobs
      .filter((b) => b.pathname.endsWith(".json"))
      .map(async (b) => {
        try {
          const res = await fetch(b.downloadUrl, { cache: "no-store" });
          return (await res.json()) as T;
        } catch {
          return null;
        }
      }),
  );
  return results.filter((r) => r !== null) as T[];
}

export async function deleteBlob(path: string): Promise<void> {
  await del(path);
}

export const JOB_PATH = (id: string) => `queue/${id}.json`;
export const LOOK_PATH = (id: string) => `looks/${id}.json`;
