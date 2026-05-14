import { Suspense } from "react";

export default function FeedLayout({ children }) {
  return <Suspense fallback={<div className="p-10 text-center text-sm text-zinc-500">Carregando feed...</div>}>{children}</Suspense>;
}
