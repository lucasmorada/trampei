"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Início" },
  { href: "/feed", label: "Explorar" },
  { href: "/busca", label: "Busca" },
  { href: "/servicos/novo", label: "Publicar" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Painel" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-[#0a1628] px-2 py-1 text-sm font-bold tracking-tight text-white dark:bg-blue-600">
            Trampei
          </span>
          <span className="hidden text-xs text-zinc-500 sm:inline">talentos locais</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                pathname === l.href
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Alternar tema"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {theme === "dark" ? "Claro" : "Escuro"}
          </button>

          {!loading && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={`/perfil/${user._id}`}
                className="max-w-[140px] truncate text-sm font-medium text-zinc-800 dark:text-zinc-100"
              >
                {user.firstName}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Sair
              </button>
            </div>
          ) : (
            !loading && (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-full bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#132347] dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Criar conta
                </Link>
              </div>
            )
          )}

          <button
            type="button"
            className="inline-flex rounded-md p-2 text-zinc-700 md:hidden dark:text-zinc-200"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={`/perfil/${user._id}`} onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    Meu perfil
                  </Link>
                  <button type="button" onClick={() => logout()} className="px-3 py-2 text-left text-sm text-red-600">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    Entrar
                  </Link>
                  <Link href="/cadastro" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
