"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { MainShell } from "@/components/layout/MainShell";
import { ServiceCard, ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { buildWhatsAppLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export default function FeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const filters = {
    category: params.get("category") || "",
    city: params.get("city") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    urgent: params.get("urgent") || "",
    sort: params.get("sort") || "recent",
  };

  const fetchPage = useCallback(
    async (p, append) => {
      const qs = new URLSearchParams();
      qs.set("page", String(p));
      qs.set("limit", "9");
      if (filters.category) qs.set("category", filters.category);
      if (filters.city) qs.set("city", filters.city);
      if (filters.minPrice) qs.set("minPrice", filters.minPrice);
      if (filters.maxPrice) qs.set("maxPrice", filters.maxPrice);
      if (filters.urgent === "1") qs.set("urgent", "true");
      if (filters.sort) qs.set("sort", filters.sort);
      const { data } = await api.get(`/services?${qs.toString()}`);
      setPages(data.pages || 1);
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
    },
    [filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.urgent, filters.sort]
  );

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPage(1, false).finally(() => setLoading(false));
  }, [fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting || loadingMore || loading) return;
        if (page >= pages) return;
        setLoadingMore(true);
        const next = page + 1;
        fetchPage(next, true)
          .then(() => setPage(next))
          .finally(() => setLoadingMore(false));
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fetchPage, loading, loadingMore, page, pages]);

  function applyFilters(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const q = new URLSearchParams();
    for (const [k, v] of fd.entries()) {
      if (v) q.set(k, String(v));
    }
    router.push(`/feed?${q.toString()}`);
  }

  function onContact(service) {
    if (!user) {
      toast.error("Faça login para entrar em contato");
      router.push("/login");
      return;
    }
    const author = service.author;
    const phone = service.contactPhone || author?.whatsApp;
    const openChat = () =>
      router.push(`/chat?with=${author?._id}&service=${service._id}&name=${encodeURIComponent(`${author?.firstName || ""} ${author?.lastName || ""}`)}`);

    if (!phone) {
      openChat();
      return;
    }
    const goWa = window.confirm("Abrir conversa no WhatsApp? Cancelar para usar o chat interno.");
    if (goWa) {
      window.open(buildWhatsAppLink(phone, DEFAULT_WHATSAPP_MESSAGE), "_blank");
    } else {
      openChat();
    }
  }

  return (
    <MainShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Feed de oportunidades</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Freelances recentes, urgentes e filtrados para você. Concluídos somem automaticamente do feed principal.
            </p>
          </div>
        </div>

        <form
          onSubmit={applyFilters}
          className="mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2 lg:grid-cols-6"
        >
          <select name="category" defaultValue={filters.category} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="">Categoria</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input name="city" defaultValue={filters.city} placeholder="Cidade" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input name="minPrice" defaultValue={filters.minPrice} placeholder="Preço mín." type="number" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <input name="maxPrice" defaultValue={filters.maxPrice} placeholder="Preço máx." type="number" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
          <select name="urgent" defaultValue={filters.urgent} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="">Urgência</option>
            <option value="1">Somente urgentes</option>
          </select>
          <select name="sort" defaultValue={filters.sort} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
            <option value="recent">Mais recentes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
            <button type="submit" className="rounded-full bg-[#0a1628] px-5 py-2 text-sm font-semibold text-white dark:bg-blue-600">
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={() => router.push("/feed")}
              className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold dark:border-zinc-600"
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : items.map((s) => <ServiceCard key={s._id} service={s} onContact={onContact} />)}
        </div>
        <div ref={sentinelRef} className="h-8" />
        {loadingMore && <p className="py-6 text-center text-sm text-zinc-500">Carregando mais...</p>}
      </div>
    </MainShell>
  );
}
