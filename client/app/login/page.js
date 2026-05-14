"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Não foi possível entrar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MainShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Entrar</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Novo por aqui?{" "}
          <Link href="/cadastro" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
            Criar conta
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[#0a1628] py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-blue-600"
          >
            {busy ? "Entrando..." : "Entrar"}
          </button>
          <Link href="/recuperar-senha" className="block text-center text-xs text-blue-700 hover:underline dark:text-blue-300">
            Esqueci minha senha
          </Link>
        </form>
      </div>
    </MainShell>
  );
}
