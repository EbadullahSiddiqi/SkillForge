"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { askMentor } from "@/lib/rag";
import { MENTOR_SUGGESTIONS } from "@/lib/constants";
import type { RagSource } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { BrainCircuit, Send, Terminal, FileText, Sparkles } from "lucide-react";

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

  if (loading) return;

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
        <div className="mb-6 pb-4 border-b border-zinc-850">
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">AI MENTOR CONSOLE</p>
          <h1 className="text-2xl font-mono font-bold uppercase mt-1">RAG-Powered Career Assistant</h1>
          <p className="text-xs text-zinc-500 mt-1 font-mono uppercase">
            ANSWERS GROUNDED IN CURATED SYSTEM RESEARCH
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pb-4 px-1">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-sm p-4 font-mono text-xs ${
                    msg.role === "user"
                      ? "bg-cyan-950/20 border border-cyan-800/40 text-cyan-400"
                      : "bg-[#101012] border border-zinc-850 text-zinc-300"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                      <BrainCircuit className="w-3.5 h-3.5" /> SYSTEM MENTOR LOG
                    </span>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-900">
                      <p className="text-[10px] text-zinc-500 uppercase mb-2 tracking-widest font-bold">SOURCE VERIFICATION FILE:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-1 bg-zinc-950 border border-zinc-900 text-zinc-400 flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            {source.file.replace(".md", "")}
                            <span className="text-cyan-400/60 font-bold ml-1">
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
              <div className="bg-[#101012] border border-zinc-850 rounded-sm p-4">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-400 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-cyan-400 animate-bounce"
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
                className="text-[10px] font-mono uppercase tracking-wide px-3 py-2 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors rounded-sm"
              >
                &gt; {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, learning paths, project criteria..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-sm bg-zinc-950 border border-zinc-850 outline-none focus:border-cyan-500 font-mono text-xs text-zinc-300 placeholder:text-zinc-750 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/10"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
