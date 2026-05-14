"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/constants";

export default function NovoServicoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    payload.price = Number(payload.price);
    setBusy(true);
    try {
      const { data } = await api.post("/services", payload);
      toast.success("Serviço publicado!");
      router.push(`/servicos/${data.service._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao publicar");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;
  if (!user) {
    return (
      <MainShell>
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-sm">Faça login para publicar.</div>
      </MainShell>
    );
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Nova solicitação de freelance</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <input name="title" required placeholder="Título" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <textarea name="description" required rows={5} placeholder="Descreva o que você precisa" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <select name="category" required className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="">Categoria</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="price" type="number" min={0} step="0.01" required placeholder="Preço (R$)" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <input name="city" required placeholder="Cidade" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <input name="serviceType" placeholder="Tipo (ex.: projeto único)" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <select name="urgency" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <option value="baixa">Urgência baixa</option>
              <option value="media">Urgência média</option>
              <option value="alta">Urgência alta</option>
            </select>
            <input name="deadline" type="date" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <input name="contactPhone" placeholder="Telefone / WhatsApp" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <button type="submit" disabled={busy} className="rounded-full bg-[#0a1628] py-3 text-sm font-semibold text-white dark:bg-blue-600">
            {busy ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </MainShell>
  );
}
