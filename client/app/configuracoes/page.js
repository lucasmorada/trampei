"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ConfiguracoesPage() {
  const { user, loading, refreshMe, logout } = useAuth();
  const [availability, setAvailability] = useState("offline");

  useEffect(() => {
    if (user?.availability) setAvailability(user.availability);
  }, [user]);

  async function saveAvailability() {
    try {
      await api.patch("/users/me/availability", { availability });
      await refreshMe();
      toast.success("Disponibilidade atualizada");
    } catch (e) {
      toast.error(e.response?.data?.message || "Erro");
    }
  }

  if (loading) return null;
  if (!user) {
    return (
      <MainShell>
        <div className="p-16 text-center text-sm">Faça login.</div>
      </MainShell>
    );
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Configurações</h1>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-semibold">Disponibilidade no perfil</p>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="mt-3 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="available">Disponível</option>
            <option value="busy">Ocupado</option>
            <option value="offline">Offline</option>
          </select>
          <button type="button" onClick={saveAvailability} className="mt-4 rounded-full bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white dark:bg-blue-600">
            Salvar disponibilidade
          </button>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-8 w-full rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
        >
          Sair da conta
        </button>
      </div>
    </MainShell>
  );
}
