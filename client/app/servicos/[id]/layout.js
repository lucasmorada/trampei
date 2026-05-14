export async function generateStaticParams() {
  return [{ id: "demo" }];
}

export const dynamicParams = false;

export default function ServicoIdLayout({ children }) {
  return children;
}
