import type { RagResponse } from "./types";

export async function askMentor(question: string): Promise<RagResponse> {
  const response = await fetch("/api/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get mentor response");
  }

  return data;
}
