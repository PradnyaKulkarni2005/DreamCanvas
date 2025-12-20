"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, MessageCircle, Zap, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CareerChatbot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi 👋 I'm your AI Career Coach. Ask me about jobs, skills, or how to prepare for your role.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: {
            targetRole: "Frontend Developer",
            currentSkills: ["HTML", "CSS", "JavaScript"],
            roadmap: ["TypeScript", "React", "Next.js"],
            jobAuthenticity: "Real",
          },
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error("No reply from AI");
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const quickPrompts = [
    "What skills should I learn?",
    "Review my roadmap",
    "Job interview tips",
    "Career advice",
  ];

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl shadow-2xl border border-slate-800/50 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 group border border-slate-700/50 hover:border-slate-600"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </motion.button>
            </Link>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-600 p-3 rounded-2xl shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                AI Career Coach
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">Always here to help you grow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400 font-medium">Online</span>
            </div>
            
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : "bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex flex-col max-w-[75%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`relative px-5 py-3.5 rounded-2xl shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-tr-md"
                    : "bg-gradient-to-br from-slate-800 to-slate-900 text-gray-100 border border-slate-700/50 rounded-tl-md"
                }`}
              >
                {/* Message content with better formatting */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </div>

                {/* Message tail */}
                <div
                  className={`absolute top-0 w-4 h-4 ${
                    msg.role === "user"
                      ? "right-0 -mr-2"
                      : "left-0 -ml-2"
                  }`}
                >
                  <svg viewBox="0 0 8 13" className={msg.role === "user" ? "text-emerald-600" : "text-slate-800"}>
                    <path
                      fill="currentColor"
                      d={msg.role === "user" 
                        ? "M0,0 L8,0 L8,13 Q8,6 0,0 Z"
                        : "M8,0 L0,0 L0,13 Q0,6 8,0 Z"
                      }
                    />
                  </svg>
                </div>
              </div>
              
              {/* Timestamp */}
              <span className="text-xs text-slate-500 mt-1.5 px-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 items-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 px-5 py-3 rounded-2xl rounded-tl-md shadow-lg">
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 pb-4"
        >
          <p className="text-xs text-slate-400 mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Quick suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInput(prompt);
                  inputRef.current?.focus();
                }}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-xs text-slate-300 hover:text-emerald-400 transition-all duration-200"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-t border-slate-700/50 p-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition duration-300"></div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything about your career..."
              disabled={loading}
              className="relative w-full bg-slate-900/80 text-gray-100 border border-slate-700 hover:border-slate-600 focus:border-emerald-500/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
            {input && (
              <div className="absolute right-3 bottom-3 text-xs text-slate-500">
                Press Enter
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="relative group bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white p-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <p className="text-xs text-slate-500 mt-3 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}