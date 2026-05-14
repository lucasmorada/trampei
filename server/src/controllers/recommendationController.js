const mongoose = require("mongoose");
const Service = require("../models/Service");
const User = require("../models/User");

async function forYou(req, res) {
  const me = await User.findById(req.userId).select("city state skillTags");
  if (!me) return res.status(404).json({ message: "Usuário não encontrado" });

  const myId = new mongoose.Types.ObjectId(String(req.userId));
  const base = {
    status: { $ne: "completed" },
    author: { $ne: myId },
  };

  const tagRegex =
    me.skillTags?.length > 0
      ? new RegExp(me.skillTags.slice(0, 8).join("|"), "i")
      : null;

  const nearQuery = { ...base };
  if (me.city) nearQuery.city = new RegExp(me.city, "i");

  const relatedQuery = { ...base };
  if (tagRegex) {
    relatedQuery.$or = [
      { title: tagRegex },
      { description: tagRegex },
      { category: tagRegex },
    ];
  }

  const [nearServices, relatedServices, similarProfessionals] = await Promise.all([
    Service.find(nearQuery).populate("author", "-password").sort({ createdAt: -1 }).limit(8),
    Service.find(relatedQuery).populate("author", "-password").sort({ createdAt: -1 }).limit(8),
    User.find({
      _id: { $ne: myId },
      availability: "available",
      ...(me.state ? { state: new RegExp(me.state, "i") } : {}),
      ...(me.skillTags?.length ? { skillTags: { $in: me.skillTags } } : {}),
    })
      .select("-password")
      .limit(8),
  ]);

  return res.json({
    nearServices,
    relatedServices,
    similarProfessionals: similarProfessionals.map((u) => u.toPublicJSON()),
  });
}

module.exports = { forYou };
