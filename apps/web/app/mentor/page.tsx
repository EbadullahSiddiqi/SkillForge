"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askMentor } from "@/lib/rag";
import { MENTOR_SUGGESTIONS } from "@/lib/constants";
import type { RagSource } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
};

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm your SkillForge AI Mentor. I search our curated knowledge base to give you grounded career advice. Ask me anything about skills, learning paths, projects, or career transitions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askMentor(question);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Sorry, I couldn't process your question. Make sure the RAG service is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function askSuggestion(suggestion: string) {
    setInput(suggestion);
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col h-[calc(100vh-4rem)]">
        <div className="mb-4">
          <p className="text-sm text-cyan-400 tracking-widest">AI MENTOR</p>
          <h1 className="text-2xl font-black">RAG-Powered Career Assistant</h1>
          <p className="text-sm text-muted mt-1">
            Answers grounded in SkillForge&apos;s curated knowledge base
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-cyan-500/20 border border-cyan-500/30"
                      : "glass"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-xs text-violet-400 mb-2 block">
                      🧠 SkillForge Mentor
                    </span>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-xs text-muted mb-2">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-lg bg-white/5 text-muted"
                          >
                            📄 {source.file.replace(".md", "")}
                            <span className="text-cyan-400/60 ml-1">
                              ({Math.round(source.similarity * 100)}%)
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl p-4">
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {MENTOR_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => askSuggestion(s)}
                className="text-xs px-3 py-2 rounded-full glass glass-hover transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, learning paths, projects..."
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-2xl glass outline-none focus:border-cyan-500/30 placeholder:text-muted/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-semibold disabled:opacity-40 transition-all hover:from-cyan-400 hover:to-cyan-300"
          >
            Send
          </button>
        </form>
      </div>
    </AppShell>
  );
}
