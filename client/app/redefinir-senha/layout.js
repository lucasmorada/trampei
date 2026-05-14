import { Suspense } from "react";

export default function RedefinirLayout({ children }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
