/** Rotas dinâmicas para export estático (GitHub Pages): só páginas pré-geradas existem. */
export async function generateStaticParams() {
  return [{ id: "demo" }];
}

export const dynamicParams = false;

export default function PerfilIdLayout({ children }) {
  return children;
}
