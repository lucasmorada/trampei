import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";

export default function NotFound() {
  return (
    <MainShell>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <p className="text-6xl font-black text-zinc-200 dark:text-zinc-800">404</p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Página não encontrada</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">O link pode estar incorreto ou o conteúdo foi removido.</p>
        <Link href="/" className="mt-8 rounded-full bg-[#0a1628] px-6 py-3 text-sm font-semibold text-white dark:bg-blue-600">
          Voltar ao início
        </Link>
      </div>
    </MainShell>
  );
}
