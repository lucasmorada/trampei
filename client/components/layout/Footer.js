import Link from "next/link";
import { SLOGAN } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <p className="text-lg font-bold text-[#0a1628] dark:text-white">Trampei</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{SLOGAN}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Plataforma</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/feed" className="hover:text-zinc-900 dark:hover:text-white">
                Feed
              </Link>
            </li>
            <li>
              <Link href="/busca" className="hover:text-zinc-900 dark:hover:text-white">
                Busca
              </Link>
            </li>
            <li>
              <Link href="/servicos/novo" className="hover:text-zinc-900 dark:hover:text-white">
                Anunciar serviço
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Conta</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/cadastro" className="hover:text-zinc-900 dark:hover:text-white">
                Cadastro
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link href="/configuracoes" className="hover:text-zinc-900 dark:hover:text-white">
                Configurações
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Contato</p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Dúvidas sobre a plataforma? Fale com o suporte pelo painel após criar sua conta.
          </p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Trampei. Feito para o mercado brasileiro.
      </p>
    </footer>
  );
}
