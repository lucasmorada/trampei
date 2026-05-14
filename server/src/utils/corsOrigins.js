const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const extraOrigins = (process.env.CLIENT_URLS_EXTRA || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const allowed = new Set([clientUrl, ...extraOrigins]);
  if (allowed.has(origin)) return true;
  if (origin.endsWith(".vercel.app")) return true;
  return false;
}

function corsOriginCallback(origin, callback) {
  callback(null, isAllowedOrigin(origin));
}

module.exports = { clientUrl, isAllowedOrigin, corsOriginCallback };
