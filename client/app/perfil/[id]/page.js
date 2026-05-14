"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function PerfilPublicoPage() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/reviews/user/${id}`).catch(() => ({ data: { items: [] } })),
    ]).then(([u, r]) => {
      setData(u.data);
      setReviews(r.data.items || []);
    });
  }, [id]);

  if (!data) {
    return (
      <MainShell>
        <div className="mx-auto max-w-3xl animate-pulse px-4 py-16">
          <div className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </MainShell>
    );
  }

  const { user, portfolios } = data;
  const isMine = me && String(me._id) === String(user._id);

  return (
    <MainShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                  {user.firstName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {user.availability}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {user.city} · {user.state} {user.age ? `· ${user.age} anos` : ""}
              </p>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{user.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.skillTags || []).map((t) => (
                  <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="font-semibold text-amber-500">★ {user.averageRating?.toFixed(1) || "0.0"}</span>
                <span className="text-zinc-500">({user.reviewCount || 0} avaliações)</span>
                <span className="text-zinc-500">{user.completedServicesCount || 0} trabalhos via plataforma</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isMine ? (
                <Link href="/perfil/editar" className="rounded-full bg-[#0a1628] px-4 py-2 text-center text-sm font-semibold text-white dark:bg-blue-600">
                  Editar perfil
                </Link>
              ) : (
                <Link
                  href={`/chat?with=${user._id}`}
                  className="rounded-full bg-[#0a1628] px-4 py-2 text-center text-sm font-semibold text-white dark:bg-blue-600"
                >
                  Enviar mensagem
                </Link>
              )}
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Portfólio</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(portfolios || []).map((p) => (
              <div key={p._id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(p.images || []).map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={img} src={img} alt="" className="h-24 w-24 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            ))}
            {(!portfolios || portfolios.length === 0) && <p className="text-sm text-zinc-500">Sem itens de portfólio.</p>}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Trabalhos realizados</h2>
          <ul className="mt-4 space-y-2">
            {(user.completedJobs || []).map((j) => (
              <li key={j._id} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-medium">{j.title}</p>
                <p className="text-zinc-600 dark:text-zinc-300">{j.description}</p>
              </li>
            ))}
            {(!user.completedJobs || user.completedJobs.length === 0) && (
              <p className="text-sm text-zinc-500">Nenhum trabalho listado ainda.</p>
            )}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Avaliações</h2>
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-amber-500">{"★".repeat(r.rating)}</p>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{r.comment}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {r.reviewer?.firstName} {r.reviewer?.lastName}
                </p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-zinc-500">Sem avaliações públicas.</p>}
          </div>
        </section>
      </div>
    </MainShell>
  );
}
