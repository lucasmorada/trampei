"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    city: "",
    state: "",
    instagram: "",
    whatsApp: "",
    email: "",
    password: "",
    profileImage: "",
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await register({
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      toast.success("Conta criada!");
      router.push("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
      toast.error(msg || "Erro ao cadastrar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Criar conta</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
            Entrar
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold">Nome</label>
            <input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Sobrenome</label>
            <input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Idade</label>
            <input type="number" min={14} value={form.age} onChange={(e) => set("age", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Cidade</label>
            <input value={form.city} onChange={(e) => set("city", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Estado (UF)</label>
            <input value={form.state} onChange={(e) => set("state", e.target.value)} maxLength={2} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Instagram</label>
            <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">WhatsApp</label>
            <input value={form.whatsApp} onChange={(e) => set("whatsApp", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">URL da foto (opcional)</label>
            <input value={form.profileImage} onChange={(e) => set("profileImage", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">E-mail</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div>
            <label className="text-xs font-semibold">Senha (mín. 6)</label>
            <input required type="password" minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="w-full rounded-full bg-[#0a1628] py-3 text-sm font-semibold text-white dark:bg-blue-600">
              {busy ? "Criando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </MainShell>
  );
}
