export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Vi seu anúncio no Trampei e gostaria de conversar sobre o serviço.";

/** Monta link wa.me com código do país (55) quando faltar. */
export function buildWhatsAppLink(rawNumber, message = DEFAULT_WHATSAPP_MESSAGE) {
  let digits = String(rawNumber || "").replace(/\D/g, "");
  if (digits.length <= 10) digits = `55${digits}`;
  else if (!digits.startsWith("55") && digits.length === 11) digits = `55${digits}`;
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
