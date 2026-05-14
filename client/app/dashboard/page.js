"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [mine, setMine] = useState([]);
  const [reco, setReco] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get("/services/mine"),
      api.get("/recommendations/for-you").catch(() => ({ data: null })),
      api.get(`/reviews/user/${user._id}`).catch(() => ({ data: { items: [] } })),
    ]).then(([a, b, c]) => {
      setMine(a.data.items || []);
      setReco(b.data);
      setReviews(c.data.items || []);
    });
  }, [user]);

  const stats = useMemo(() => {
    const active = mine.filter((s) => ["open", "urgent", "in_progress"].includes(s.status)).length;
    const done = mine.filter((s) => s.status === "completed").length;
    return { active, done, total: mine.length };
  }, [mine]);

  if (loading) return null;

  if (!user) {
    return (
      <MainShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="text-lg font-semibold">Acesse o painel fazendo login.</p>
          <Link href="/login" className="mt-4 inline-block rounded-full bg-[#0a1628] px-6 py-2 text-sm font-semibold text-white dark:bg-blue-600">
            Entrar
          </Link>
        </div>
      </MainShell>
    );
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Olá, {user.firstName}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Visão geral dos seus serviços, recomendações e reputação.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/servicos/novo" className="rounded-full bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white dark:bg-blue-600">
              Novo serviço
            </Link>
            <Link href="/perfil/editar" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-600">
              Editar perfil
            </Link>
            <Link href="/chat" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-600">
              Mensagens
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Serviços ativos", value: stats.active },
            { label: "Concluídos", value: stats.done },
            { label: "Avaliações recebidas", value: user.reviewCount || 0 },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{s.label}</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Seus anúncios</h2>
            <ul className="mt-4 space-y-3">
              {mine.slice(0, 8).map((s) => (
                <li key={s._id} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div>
                    <Link href={`/servicos/${s._id}`} className="font-medium text-blue-700 hover:underline dark:text-blue-300">
                      {s.title}
                    </Link>
                    <p className="text-xs text-zinc-500">
                      {s.status} · R$ {s.price}
                    </p>
                  </div>
                </li>
              ))}
              {mine.length === 0 && <p className="text-sm text-zinc-500">Nenhum serviço ainda.</p>}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recomendado para você</h2>
            <div className="mt-4 space-y-3">
              {(reco?.nearServices || []).slice(0, 4).map((s) => (
                <div key={s._id} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-zinc-500">{s.city}</p>
                  <Link href={`/servicos/${s._id}`} className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-300">
                    Ver detalhes
                  </Link>
                </div>
              ))}
              {!reco && <p className="text-sm text-zinc-500">Carregando recomendações...</p>}
              {reco && (!reco.nearServices || reco.nearServices.length === 0) && (
                <p className="text-sm text-zinc-500">Complete seu perfil com cidade e tags para ver recomendações.</p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Últimas avaliações</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {reviews.slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-semibold text-amber-500">{"★".repeat(r.rating)}</p>
                <p className="mt-2 text-zinc-700 dark:text-zinc-200">{r.comment || "Sem comentário"}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {r.reviewer?.firstName} {r.reviewer?.lastName}
                </p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-zinc-500">Você ainda não recebeu avaliações.</p>}
          </div>
        </section>
      </div>
    </MainShell>
  );
}
