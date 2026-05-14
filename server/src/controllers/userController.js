const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const { validationResult } = require("express-validator");
const { uploadBuffer, configureCloudinary } = require("../utils/cloudinaryUpload");

async function getById(req, res) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  const portfolios = await Portfolio.find({ user: user._id }).sort({ order: 1, createdAt: -1 });
  return res.json({ user: user.toPublicJSON(), portfolios });
}

async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const allowed = [
    "firstName",
    "lastName",
    "age",
    "city",
    "state",
    "instagram",
    "whatsApp",
    "bio",
    "servicesOffered",
    "skillTags",
    "profileImage",
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  if (updates.skillTags && !Array.isArray(updates.skillTags)) {
    updates.skillTags = String(updates.skillTags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  return res.json({ user: user.toPublicJSON() });
}

async function updateAvailability(req, res) {
  const { availability } = req.body;
  if (!["available", "busy", "offline"].includes(availability)) {
    return res.status(400).json({ message: "Disponibilidade inválida" });
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    { availability },
    { new: true }
  ).select("-password");
  return res.json({ user: user.toPublicJSON() });
}

async function addCompletedJob(req, res) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Título obrigatório" });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  user.completedJobs.push({ title, description: description || "", completedAt: new Date() });
  await user.save();
  const fresh = await User.findById(req.userId).select("-password");
  return res.status(201).json({ user: fresh.toPublicJSON() });
}

async function uploadProfilePhoto(req, res) {
  if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado" });
  if (!configureCloudinary()) {
    return res.status(503).json({
      message:
        "Upload indisponível: configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no servidor.",
    });
  }
  try {
    const url = await uploadBuffer(req.file.buffer, "trampei/profiles");
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: url },
      { new: true }
    ).select("-password");
    return res.json({ profileImage: url, user: user.toPublicJSON() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Falha no upload" });
  }
}

/** Lista profissionais para feed (disponíveis / todos) */
async function listProfessionals(req, res) {
  const { city, state, tag, available, page = 1, limit = 12 } = req.query;
  const q = {};
  if (city) q.city = new RegExp(city, "i");
  if (state) q.state = new RegExp(state, "i");
  if (tag) q.skillTags = new RegExp(tag, "i");
  if (available === "true") q.availability = "available";

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(q).select("-password").sort({ averageRating: -1, reviewCount: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(q),
  ]);
  return res.json({
    items: items.map((u) => u.toPublicJSON()),
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
  });
}

module.exports = {
  getById,
  updateProfile,
  updateAvailability,
  addCompletedJob,
  uploadProfilePhoto,
  listProfessionals,
};
