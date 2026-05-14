"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Se o e-mail existir, você receberá instruções.");
    } catch {
      toast.success("Se o e-mail existir, você receberá instruções.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Recuperar senha</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Informe seu e-mail cadastrado.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="seu@email.com"
          />
          <button type="submit" disabled={busy} className="w-full rounded-full bg-[#0a1628] py-2 text-sm font-semibold text-white dark:bg-blue-600">
            {busy ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      </div>
    </MainShell>
  );
}
