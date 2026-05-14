"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { buildWhatsAppLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp";

export default function ServicoDetalhePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/services/${id}`).then((r) => setService(r.data.service));
  }, [id]);

  async function patchStatus(status) {
    try {
      const { data } = await api.patch(`/services/${id}/status`, { status });
      setService(data.service);
      toast.success("Status atualizado");
    } catch (e) {
      toast.error(e.response?.data?.message || "Erro");
    }
  }

  async function submitReview(revieweeId) {
    try {
      await api.post("/reviews", {
        revieweeId,
        serviceId: id,
        rating,
        comment,
      });
      toast.success("Avaliação enviada");
    } catch (e) {
      toast.error(e.response?.data?.message || "Não foi possível avaliar");
    }
  }

  if (!service) {
    return (
      <MainShell>
        <div className="p-16 text-center text-sm">Carregando...</div>
      </MainShell>
    );
  }

  const author = service.author;
  const authorId = author?._id || author;
  const isAuthor = user && String(authorId) === String(user._id);
  const phone = service.contactPhone || author?.whatsApp;

  return (
    <MainShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">{service.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{service.title}</h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">{service.description}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
            <span>
              <strong className="text-zinc-900 dark:text-white">R$ {Number(service.price).toFixed(2)}</strong>
            </span>
            <span>{service.city}</span>
            <span className="capitalize">{service.urgency}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold dark:bg-zinc-800">{service.status}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {user && (
              <button
                type="button"
                onClick={() => router.push(`/chat?with=${author?._id}&service=${service._id}`)}
                className="rounded-full bg-[#0a1628] px-5 py-2 text-sm font-semibold text-white dark:bg-blue-600"
              >
                Chat interno
              </button>
            )}
            {phone && (
              <a
                href={buildWhatsAppLink(phone, DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
              >
                WhatsApp
              </a>
            )}
          </div>

          {isAuthor && (
            <div className="mt-10 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
              <p className="text-sm font-semibold">Gerenciar status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => patchStatus("in_progress")} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold dark:bg-zinc-800">
                  Em andamento
                </button>
                <button type="button" onClick={() => patchStatus("completed")} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Concluído
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Ao concluir, o anúncio some do feed principal. Avalie a outra parte após concluir.
              </p>
            </div>
          )}

          {user && service.status === "completed" && (
            <div className="mt-10 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
              <p className="text-sm font-semibold">Deixar avaliação</p>
              <p className="text-xs text-zinc-500">Cliente avalia o profissional designado, e vice-versa.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-lg border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} estrelas
                    </option>
                  ))}
                </select>
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentário" className="flex-1 rounded-lg border border-zinc-200 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {String(user._id) === String(service.author) && service.assignedTo && (
                  <button type="button" onClick={() => submitReview(service.assignedTo)} className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white">
                    Avaliar profissional
                  </button>
                )}
                {service.assignedTo && String(user._id) === String(service.assignedTo) && (
                  <button type="button" onClick={() => submitReview(service.author)} className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white">
                    Avaliar cliente
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <Link href="/feed" className="mt-6 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
          ← Voltar ao feed
        </Link>
      </div>
    </MainShell>
  );
}
