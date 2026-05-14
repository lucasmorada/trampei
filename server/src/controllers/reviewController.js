const Review = require("../models/Review");
const Service = require("../models/Service");
const User = require("../models/User");
const mongoose = require("mongoose");

async function create(req, res) {
  const { revieweeId, serviceId, rating, comment } = req.body;
  if (!revieweeId || !rating) {
    return res.status(400).json({ message: "revieweeId e nota são obrigatórios" });
  }
  if (String(revieweeId) === String(req.userId)) {
    return res.status(400).json({ message: "Não é possível avaliar a si mesmo" });
  }

  if (!serviceId) {
    return res.status(400).json({ message: "Informe o serviço concluído (serviceId)" });
  }
  const service = await Service.findById(serviceId);
  if (!service || service.status !== "completed") {
    return res.status(400).json({ message: "Serviço inválido ou ainda não concluído" });
  }
  const isAuthor = String(service.author) === String(req.userId);
  const isAssignee = service.assignedTo && String(service.assignedTo) === String(req.userId);
  if (!isAuthor && !isAssignee) {
    return res.status(403).json({ message: "Você não participou deste serviço" });
  }
  if (isAuthor) {
    if (!service.assignedTo || String(revieweeId) !== String(service.assignedTo)) {
      return res.status(400).json({ message: "Como cliente, avalie o profissional designado ao serviço" });
    }
  } else if (isAssignee) {
    if (String(revieweeId) !== String(service.author)) {
      return res.status(400).json({ message: "Como profissional, avalie o cliente do serviço" });
    }
  }

  const existing = await Review.findOne({
    reviewer: req.userId,
    reviewee: revieweeId,
    service: serviceId || null,
  });
  if (existing) {
    return res.status(400).json({ message: "Você já avaliou esta conclusão" });
  }

  const review = await Review.create({
    reviewer: req.userId,
    reviewee: revieweeId,
    service: serviceId || null,
    rating: Number(rating),
    comment: comment || "",
  });

  const agg = await Review.aggregate([
    { $match: { reviewee: new mongoose.Types.ObjectId(String(revieweeId)) } },
    { $group: { _id: "$reviewee", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await User.findByIdAndUpdate(revieweeId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });

  const populated = await Review.findById(review._id).populate("reviewer", "firstName lastName profileImage");
  return res.status(201).json({ review: populated });
}

async function listForUser(req, res) {
  const { userId } = req.params;
  const items = await Review.find({ reviewee: userId })
    .sort({ createdAt: -1 })
    .populate("reviewer", "firstName lastName profileImage")
    .limit(50);
  return res.json({ items });
}

module.exports = { create, listForUser };
