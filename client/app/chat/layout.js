import { Suspense } from "react";

export default function ChatLayout({ children }) {
  return <Suspense fallback={<div className="p-10 text-center text-sm">Carregando chat...</div>}>{children}</Suspense>;
}
