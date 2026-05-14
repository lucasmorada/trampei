"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MainShell } from "@/components/layout/MainShell";
import { CATEGORIES, SLOGAN } from "@/lib/constants";
import { api } from "@/lib/api";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/users/professionals", { params: { available: "true", limit: 6 } })
      .then((r) => setFeatured(r.data.items || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <MainShell>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#dbeafe_0,_transparent_55%)] opacity-70 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a33_0,_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:py-28">
          <div className="flex-1 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Freelancers locais em um só lugar
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-bold tracking-tight text-[#0a1628] sm:text-5xl dark:text-white"
            >
              Conecte talentos e oportunidades na sua região.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-lg text-zinc-600 dark:text-zinc-300"
            >
              {SLOGAN} Publique ou encontre serviços, converse em tempo real e construa reputação com avaliações
              transparentes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/cadastro"
                className="rounded-full bg-[#0a1628] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-[#132347] dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Começar agora
              </Link>
              <Link
                href="/feed"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Explorar oportunidades
              </Link>
            </motion.div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-zinc-500 dark:text-zinc-400">
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">+10</p>
                <p>categorias de serviço</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">Chat</p>
                <p>tempo real com Socket.io</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">100%</p>
                <p>foco no mercado brasileiro</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex-1"
          >
            <div className="relative mx-auto max-w-md rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-6 shadow-2xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Painel rápido</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  ao vivo
                </span>
              </div>
              <div className="space-y-3">
                {["Designer gráfico", "Aulas de violão", "Suporte técnico"].map((t, i) => (
                  <div
                    key={t}
                    className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm dark:bg-zinc-900/80"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{t}</p>
                      <p className="text-xs text-zinc-500">São Paulo · aberto</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">R$ {120 + i * 40}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Equipe colaborando"
                  width={800}
                  height={520}
                  className="h-48 w-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Como funciona</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Três passos para transformar sua habilidade em oportunidade — ou encontrar quem resolve o seu problema.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Crie seu perfil",
              body: "Mostre quem você é, suas tags, portfólio e disponibilidade em tempo real.",
            },
            {
              step: "02",
              title: "Publique ou busque",
              body: "Anuncie um serviço ou explore o feed com filtros inteligentes e busca avançada.",
            },
            {
              step: "03",
              title: "Feche pelo chat",
              body: "Converse na plataforma ou abra o WhatsApp com mensagem pronta para agilizar.",
            },
          ].map((c) => (
            <motion.div
              key={c.step}
              {...fade}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{c.step}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.h2 {...fade} className="text-center text-3xl font-bold text-zinc-900 dark:text-white">
            Categorias em destaque
          </motion.h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={{ pathname: "/feed", query: { category: cat } }}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Freelancers em destaque</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Profissionais com disponibilidade marcada como &quot;disponível&quot; agora.
            </p>
          </div>
          <Link href="/feed" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
            Ver todos
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                />
              ))
            : featured.map((u) => (
                <motion.div
                  key={u._id}
                  {...fade}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      {u.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.profileImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                          {u.firstName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {u.city} · {u.state}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{u.bio || u.servicesOffered}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {(u.skillTags || []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/perfil/${u._id}`}
                    className="mt-4 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300"
                  >
                    Ver perfil
                  </Link>
                </motion.div>
              ))}
        </div>
      </section>
    </MainShell>
  );
}
