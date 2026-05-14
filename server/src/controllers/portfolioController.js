const Portfolio = require("../models/Portfolio");
const { uploadBuffer, configureCloudinary } = require("../utils/cloudinaryUpload");

async function listMine(req, res) {
  const items = await Portfolio.find({ user: req.userId }).sort({ order: 1, createdAt: -1 });
  return res.json({ items });
}

async function create(req, res) {
  const { title, description, order } = req.body;
  if (!title) return res.status(400).json({ message: "Título obrigatório" });

  const images = [];
  if (req.files?.length) {
    if (!configureCloudinary()) {
      return res.status(503).json({ message: "Cloudinary não configurado no servidor" });
    }
    for (const file of req.files) {
      // eslint-disable-next-line no-await-in-loop
      const url = await uploadBuffer(file.buffer, "trampei/portfolio");
      images.push(url);
    }
  }

  const item = await Portfolio.create({
    user: req.userId,
    title,
    description: description || "",
    images,
    order: Number(order) || 0,
  });
  return res.status(201).json({ item });
}

async function remove(req, res) {
  const item = await Portfolio.findOne({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: "Item não encontrado" });
  await item.deleteOne();
  return res.json({ message: "Removido" });
}

module.exports = { listMine, create, remove };
