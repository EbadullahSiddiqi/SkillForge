import { NextRequest, NextResponse } from "next/server";

const RAG_URL =
  process.env.RAG_SERVICE_URL ||
  process.env.NEXT_PUBLIC_RAG_URL ||
  "http://localhost:5001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.question?.trim()) {
      return NextResponse.json(
        { success: false, message: "Question is required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${RAG_URL}/api/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: body.question }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "RAG service unavailable",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "AI Mentor is offline. Make sure the RAG service is running on port 5001.",
      },
      { status: 503 },
    );
  }
}
