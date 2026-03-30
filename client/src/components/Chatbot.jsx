import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const QUICK_REPLIES = [
  "What's my total income?",
  "How much am I saving?",
  "What's my biggest expense?",
  "Give me a budget tip",
  "What's my financial score?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "👋 Hi! I'm **FinBot**, your personal finance assistant. Ask me about your income, expenses, savings, or for budget tips!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chat', { message: msg });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: "❌ Sorry, I couldn't connect to the server. Please make sure the backend is running.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  function renderText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-500 hover:bg-brand-400 rounded-full shadow-2xl shadow-brand-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        title="Open FinBot"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
              AI
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
          style={{ height: '520px', background: '#0d1526', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
            style={{ background: 'linear-gradient(135deg, #0d1526, #111c33)' }}>
            <div className="w-9 h-9 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">FinBot</p>
              <p className="text-xs text-brand-400">● Online · Finance Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'bot' ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-blue-500/20 border border-blue-500/30'
                }`}>
                  {msg.role === 'bot' ? <Bot className="w-3.5 h-3.5 text-brand-400" /> : <User className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'bot'
                      ? 'bg-white/5 text-slate-200 rounded-tl-sm'
                      : 'bg-brand-500 text-white rounded-tr-sm'
                  }`}
                    dangerouslySetInnerHTML={{ __html: renderText(msg.text).replace(/\n/g, '<br/>') }}
                  />
                  <span className="text-[10px] text-slate-500 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-white/5 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />
                  <span className="text-xs text-slate-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t border-white/5">
            <div className="flex gap-1 overflow-x-auto pb-1.5 mb-2 scrollbar-hide">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about your finances..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
