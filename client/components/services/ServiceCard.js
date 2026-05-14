"use client";

import { motion } from "framer-motion";

export function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mt-3 h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="mt-4 flex gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function ServiceCard({ service, onContact }) {
  const author = service.author;
  const urgent = service.status === "urgent" || service.urgency === "alta";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{service.title}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {service.category} · {service.city}
          </p>
        </div>
        {urgent && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
            Urgente
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{service.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            {author?.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={author.profileImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-600">
                {(author?.firstName || "?")[0]}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              {author?.firstName} {author?.lastName}
            </p>
            <p className="text-xs text-zinc-500">
              R$ {Number(service.price).toFixed(0)} · {service.serviceType || "Freelance"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onContact?.(service)}
          className="rounded-full bg-[#0a1628] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#132347] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Entrar em contato
        </button>
      </div>
    </motion.article>
  );
}
