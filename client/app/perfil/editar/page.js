"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SKILL_SUGGESTIONS } from "@/lib/constants";

export default function EditarPerfilPage() {
  const { user, loading, refreshMe } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age || "",
      city: user.city || "",
      state: user.state || "",
      instagram: user.instagram || "",
      whatsApp: user.whatsApp || "",
      bio: user.bio || "",
      servicesOffered: user.servicesOffered || "",
      profileImage: user.profileImage || "",
    });
    setTags((user.skillTags || []).join(", "));
  }, [user]);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch("/users/me", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        skillTags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      await refreshMe();
      toast.success("Perfil atualizado");
      router.push(`/perfil/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar");
    } finally {
      setBusy(false);
    }
  }

  async function addJob(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = fd.get("title");
    const description = fd.get("description");
    try {
      await api.post("/users/me/completed-jobs", { title, description });
      e.target.reset();
      await refreshMe();
      toast.success("Trabalho adicionado");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro");
    }
  }

  async function uploadPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    try {
      await api.post("/users/me/photo", body, { headers: { "Content-Type": "multipart/form-data" } });
      await refreshMe();
      toast.success("Foto atualizada");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload indisponível (Cloudinary)");
    }
  }

  if (loading || !user) {
    return (
      <MainShell>
        <div className="p-16 text-center text-sm">Carregando...</div>
      </MainShell>
    );
  }

  if (!form) return null;

  return (
    <MainShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Editar perfil</h1>
        <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <label className="text-xs font-semibold">Nova foto (Cloudinary no servidor)</label>
            <input type="file" accept="image/*" onChange={uploadPhoto} className="mt-1 block w-full text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">Nome</label>
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">Sobrenome</label>
              <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">Idade</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">Cidade</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">Estado</label>
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">Instagram</label>
              <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div>
              <label className="text-xs font-semibold">WhatsApp</label>
              <input value={form.whatsApp} onChange={(e) => setForm({ ...form, whatsApp: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">URL da foto (alternativa)</label>
              <input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Biografia</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Serviços oferecidos</label>
              <textarea value={form.servicesOffered} onChange={(e) => setForm({ ...form, servicesOffered: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Tags (separadas por vírgula)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
              <p className="mt-1 text-xs text-zinc-500">Sugestões: {SKILL_SUGGESTIONS.join(", ")}</p>
            </div>
          </div>
          <button type="submit" disabled={busy} className="rounded-full bg-[#0a1628] px-6 py-2 text-sm font-semibold text-white dark:bg-blue-600">
            {busy ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Adicionar trabalho realizado</h2>
          <form onSubmit={addJob} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input name="title" required placeholder="Título" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <input name="description" placeholder="Descrição" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              Adicionar
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Portfólio (imagens)</h2>
          <PortfolioUploader onDone={refreshMe} />
        </div>
      </div>
    </MainShell>
  );
}

function PortfolioUploader({ onDone }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!title || !files?.length) {
      toast.error("Informe título e imagens");
      return;
    }
    setBusy(true);
    const fd = new FormData();
    fd.append("title", title);
    for (const f of files) fd.append("images", f);
    try {
      await api.post("/portfolio/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setTitle("");
      setFiles(null);
      await onDone();
      toast.success("Portfólio atualizado");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro no upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do projeto" className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
      <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="block w-full text-sm" />
      <button type="submit" disabled={busy} className="rounded-full bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white dark:bg-blue-600">
        {busy ? "Enviando..." : "Enviar projeto"}
      </button>
    </form>
  );
}
