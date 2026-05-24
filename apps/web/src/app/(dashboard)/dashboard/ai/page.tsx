'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export default function AiTutorPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function loadConversations() {
    try {
      const { data } = await api.get('/ai/conversations');
      setConversations(data);
    } finally {
      setLoadingConvs(false);
    }
  }

  async function createConversation() {
    const { data } = await api.post('/ai/conversations', { title: 'Nova conversa' });
    setConversations((prev) => [data, ...prev]);
    setActiveConversation(data.id);
    setMessages([]);
  }

  async function loadConversation(id: string) {
    setActiveConversation(id);
    const { data } = await api.get(`/ai/conversations/${id}`);
    setMessages(data.messages);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeConversation || loading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/conversations/${activeConversation}/messages`, { content: userMessage.content });
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <aside className="w-56 flex flex-col gap-2">
        <button onClick={createConversation} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Nova conversa
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {loadingConvs ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">Nenhuma conversa ainda</p>
          ) : (
            conversations.map((conv) => (
              <button key={conv.id} onClick={() => loadConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${activeConversation === conv.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                {conv.title}
              </button>
            ))
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-gray-900">EduTutor IA</h1>
          <p className="text-xs text-gray-500">Assistente educacional powered by Claude</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!activeConversation ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 text-sm font-medium">Inicie uma conversa com o EduTutor</p>
              <button onClick={createConversation} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Iniciar conversa
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-400 text-sm">Envie uma mensagem para começar</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">AI</div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold ml-2 shrink-0 mt-1">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">AI</div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="px-4 py-3 border-t border-gray-100 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={!activeConversation || loading}
            placeholder={activeConversation ? 'Pergunte algo...' : 'Crie uma conversa primeiro'}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
          <button type="submit" disabled={!input.trim() || !activeConversation || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
