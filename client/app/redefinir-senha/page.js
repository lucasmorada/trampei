"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";

export default function RedefinirSenhaPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Senha atualizada! Faça login.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Token inválido");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Nova senha</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <input type="hidden" name="token" value={token} readOnly />
          <p className="text-xs text-zinc-500 break-all">Token: {token ? "presente" : "ausente — use o link do e-mail"}</p>
          <input
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="Nova senha"
          />
          <button type="submit" disabled={busy || !token} className="w-full rounded-full bg-[#0a1628] py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-blue-600">
            {busy ? "Salvando..." : "Redefinir"}
          </button>
        </form>
      </div>
    </MainShell>
  );
}
