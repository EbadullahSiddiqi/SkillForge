const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:5001";

export async function askRAG(question: string) {
  const response = await fetch(`${RAG_SERVICE_URL}/api/ai/ask`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`RAG service failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
