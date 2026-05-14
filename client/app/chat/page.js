"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ChatPage() {
  const { user, token, loading: authLoading } = useAuth();
  const params = useSearchParams();
  const withId = params.get("with");
  const serviceId = params.get("service");

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);
  const activeIdRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const loadConversations = useCallback(async () => {
    const { data } = await api.get("/conversations/mine");
    setConversations(data.items || []);
  }, []);

  useEffect(() => {
    if (!user || !token) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("message:new", ({ conversationId, message }) => {
      if (String(conversationId) === String(activeIdRef.current)) {
        setMessages((m) => [...m, message]);
      }
      loadConversations();
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      if (String(conversationId) === String(activeIdRef.current)) {
        setTyping(Boolean(isTyping));
      }
    });

    loadConversations().catch(() => {});

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, token, loadConversations]);

  useEffect(() => {
    if (!user || !token || !withId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.post("/conversations", {
          participantId: withId,
          serviceId: serviceId || undefined,
        });
        if (cancelled) return;
        setActiveId(data.conversation._id);
        await loadConversations();
      } catch (e) {
        if (!cancelled) toast.error(e.response?.data?.message || "Não foi possível abrir a conversa");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, token, withId, serviceId, loadConversations]);

  useEffect(() => {
    if (!activeId) return undefined;
    let cancelled = false;
    (async () => {
      const { data } = await api.get(`/messages/${activeId}`);
      if (cancelled) return;
      setMessages(data.items || []);
      socketRef.current?.emit("conv:join", activeId);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    try {
      const { data } = await api.post("/messages", { conversationId: activeId, text });
      setMessages((m) => [...m, data.message]);
      setText("");
      loadConversations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao enviar");
    }
  }

  const active = conversations.find((c) => String(c._id) === String(activeId));
  const otherUser = active?.participants?.find((p) => String(p._id) !== String(user?._id));

  if (authLoading) return null;

  if (!user) {
    return (
      <MainShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="text-lg font-semibold">Faça login para usar o chat.</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-[#0a1628] px-6 py-2 text-sm font-semibold text-white dark:bg-blue-600"
          >
            Entrar
          </Link>
        </div>
      </MainShell>
    );
  }

  return (
    <MainShell>
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl gap-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <aside className="hidden w-72 flex-col border-r border-zinc-200 dark:border-zinc-800 md:flex">
          <div className="border-b border-zinc-200 p-4 text-sm font-semibold dark:border-zinc-800">Conversas</div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const other = c.participants.find((p) => String(p._id) !== String(user._id));
              return (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setActiveId(c._id)}
                  className={`flex w-full items-center gap-3 border-b border-zinc-100 px-3 py-3 text-left text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 ${
                    String(c._id) === String(activeId) ? "bg-zinc-100 dark:bg-zinc-800" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {other?.firstName} {other?.lastName}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{c.lastMessage?.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <section className="flex flex-1 flex-col">
          <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-semibold">
              {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Selecione uma conversa"}
            </p>
            <p className="text-xs text-zinc-500">Mensagens em tempo real</p>
          </header>
          <div className="flex-1 space-y-2 overflow-y-auto bg-zinc-50 p-4 dark:bg-zinc-950">
            {messages.map((m) => {
              const mine = String(m.sender?._id || m.sender) === String(user._id);
              return (
                <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      mine ? "bg-blue-600 text-white" : "bg-white text-zinc-900 shadow dark:bg-zinc-800 dark:text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            {typing && <p className="text-xs text-zinc-500">Digitando...</p>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (activeId) socketRef.current?.emit("typing", { conversationId: activeId, isTyping: true });
              }}
              onBlur={() => activeId && socketRef.current?.emit("typing", { conversationId: activeId, isTyping: false })}
              placeholder="Escreva uma mensagem..."
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="submit"
              className="rounded-full bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white dark:bg-blue-600"
            >
              Enviar
            </button>
          </form>
        </section>
      </div>
    </MainShell>
  );
}
