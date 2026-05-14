"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { SKILL_SUGGESTIONS } from "@/lib/constants";

export default function BuscaPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [data, setData] = useState({ services: [], users: [], suggestions: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (debounced.length < 2) {
      setData({ services: [], users: [], suggestions: [] });
      return;
    }
    setLoading(true);
    api
      .get("/search", { params: { q: debounced, limit: 12 } })
      .then((r) => setData(r.data))
      .catch(() => setData({ services: [], users: [], suggestions: [] }))
      .finally(() => setLoading(false));
  }, [debounced]);

  const chips = useMemo(() => [...SKILL_SUGGESTIONS.slice(0, 6), ...data.suggestions].slice(0, 10), [data.suggestions]);

  return (
    <MainShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Busca inteligente</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Encontre serviços, profissionais e categorias. Experimente: “Designer”, “React”, “aula de inglês”.
        </p>
        <div className="mt-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite palavras-chave..."
            className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg shadow-sm outline-none ring-blue-500/30 focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQ(c)}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="mt-8 text-sm text-zinc-500">Buscando...</p>}

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Serviços</h2>
            <ul className="mt-4 space-y-3">
              {data.services.map((s) => (
                <li key={s._id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Link href={`/servicos/${s._id}`} className="font-medium text-blue-700 hover:underline dark:text-blue-300">
                    {s.title}
                  </Link>
                  <p className="text-xs text-zinc-500">
                    {s.category} · {s.city}
                  </p>
                </li>
              ))}
              {!loading && debounced.length >= 2 && data.services.length === 0 && (
                <p className="text-sm text-zinc-500">Nenhum serviço encontrado.</p>
              )}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Profissionais</h2>
            <ul className="mt-4 space-y-3">
              {data.users.map((u) => (
                <li key={u._id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Link href={`/perfil/${u._id}`} className="font-medium text-blue-700 hover:underline dark:text-blue-300">
                    {u.firstName} {u.lastName}
                  </Link>
                  <p className="text-xs text-zinc-500">{u.city}</p>
                </li>
              ))}
              {!loading && debounced.length >= 2 && data.users.length === 0 && (
                <p className="text-sm text-zinc-500">Nenhum profissional encontrado.</p>
              )}
            </ul>
          </section>
        </div>
      </div>
    </MainShell>
  );
}
