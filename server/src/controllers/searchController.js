const Service = require("../models/Service");
const User = require("../models/User");

/** Busca unificada: serviços (texto) + profissionais (nome, bio, tags) */
async function unified(req, res) {
  const { q, limit = 10 } = req.query;
  if (!q || String(q).trim().length < 2) {
    return res.json({ services: [], users: [], suggestions: [] });
  }
  const term = String(q).trim();
  const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [services, users] = await Promise.all([
    Service.find({
      status: { $ne: "completed" },
      $or: [{ title: rx }, { description: rx }, { category: rx }],
    })
      .populate("author", "-password")
      .sort({ createdAt: -1 })
      .limit(Number(limit)),
    User.find({
      $or: [
        { firstName: rx },
        { lastName: rx },
        { bio: rx },
        { servicesOffered: rx },
        { skillTags: rx },
        { city: rx },
      ],
    })
      .select("-password")
      .limit(Number(limit)),
  ]);

  const suggestions = [
    ...new Set([
      ...services.map((s) => s.category).filter(Boolean),
      ...users.flatMap((u) => u.skillTags || []).slice(0, 5),
    ]),
  ].slice(0, 8);

  return res.json({
    services,
    users: users.map((u) => u.toPublicJSON()),
    suggestions,
  });
}

module.exports = { unified };
