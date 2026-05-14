const Service = require("../models/Service");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const MIN_MS_BETWEEN_POSTS = Number(process.env.MIN_MS_BETWEEN_SERVICE_POSTS) || 120_000;

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = await User.findById(req.userId);
  if (user.lastServicePostAt && Date.now() - user.lastServicePostAt.getTime() < MIN_MS_BETWEEN_POSTS) {
    return res.status(429).json({
      message: "Aguarde alguns instantes antes de publicar outro serviço (proteção anti-spam).",
    });
  }

  const {
    title,
    description,
    category,
    price,
    city,
    serviceType,
    urgency,
    deadline,
    contactPhone,
  } = req.body;

  let status = "open";
  if (urgency === "alta") status = "urgent";

  const service = await Service.create({
    title,
    description,
    category,
    price: Number(price),
    city,
    serviceType: serviceType || "Freelance",
    urgency: urgency || "media",
    deadline: deadline ? new Date(deadline) : undefined,
    contactPhone: contactPhone || "",
    author: req.userId,
    status,
  });

  user.lastServicePostAt = new Date();
  await user.save();

  const populated = await Service.findById(service._id).populate("author", "-password");
  return res.status(201).json({ service: populated });
}

function buildListQuery(query) {
  const {
    category,
    city,
    minPrice,
    maxPrice,
    urgent,
    status,
    q,
    excludeCompleted = "true",
  } = query;

  const filter = {};
  if (status && ["open", "urgent", "in_progress", "completed"].includes(status)) {
    filter.status = status;
  } else if (excludeCompleted === "true") {
    filter.status = { $ne: "completed" };
  }
  if (category) filter.category = new RegExp(`^${category}$`, "i");
  if (city) filter.city = new RegExp(city, "i");
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  if (urgent === "true") {
    filter.$and = filter.$and || [];
    filter.$and.push({ $or: [{ status: "urgent" }, { urgency: "alta" }] });
  }
  if (q) {
    filter.$text = { $search: q };
  }
  return filter;
}

async function list(req, res) {
  const { page = 1, limit = 12, sort = "recent" } = req.query;
  const filter = buildListQuery(req.query);
  const skip = (Number(page) - 1) * Number(limit);

  let sortOpt = { createdAt: -1 };
  if (sort === "price_asc") sortOpt = { price: 1 };
  if (sort === "price_desc") sortOpt = { price: -1 };

  const [items, total] = await Promise.all([
    Service.find(filter)
      .populate("author", "-password")
      .sort(sortOpt)
      .skip(skip)
      .limit(Number(limit)),
    Service.countDocuments(filter),
  ]);

  return res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
  });
}

async function getOne(req, res) {
  const service = await Service.findById(req.params.id).populate("author", "-password");
  if (!service) return res.status(404).json({ message: "Serviço não encontrado" });
  return res.json({ service });
}

async function update(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Serviço não encontrado" });
  if (String(service.author) !== req.userId) {
    return res.status(403).json({ message: "Sem permissão" });
  }

  const allowed = [
    "title",
    "description",
    "category",
    "price",
    "city",
    "serviceType",
    "urgency",
    "deadline",
    "contactPhone",
    "status",
  ];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) service[k] = req.body[k];
  });
  if (req.body.price !== undefined) service.price = Number(req.body.price);
  if (req.body.deadline !== undefined) service.deadline = req.body.deadline ? new Date(req.body.deadline) : null;

  if (req.body.urgency === "alta" && req.body.status === undefined) {
    service.status = "urgent";
  }

  await service.save();
  const populated = await Service.findById(service._id).populate("author", "-password");
  return res.json({ service: populated });
}

/** Cliente ou freelancer pode marcar andamento / concluído em fluxo simples */
async function updateStatus(req, res) {
  const { status, assignedTo } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Serviço não encontrado" });

  const isAuthor = String(service.author) === req.userId;
  const isAssignee = service.assignedTo && String(service.assignedTo) === req.userId;
  if (!isAuthor && !isAssignee) {
    return res.status(403).json({ message: "Sem permissão" });
  }

  const prevStatus = service.status;
  if (status && ["open", "urgent", "in_progress", "completed"].includes(status)) {
    service.status = status;
  }
  if (assignedTo && isAuthor) {
    service.assignedTo = assignedTo;
  }
  await service.save();

  if (service.status === "completed" && prevStatus !== "completed" && service.assignedTo) {
    await User.findByIdAndUpdate(service.assignedTo, { $inc: { completedServicesCount: 1 } });
  }

  const populated = await Service.findById(service._id).populate("author", "-password");
  return res.json({ service: populated });
}

async function remove(req, res) {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Serviço não encontrado" });
  if (String(service.author) !== req.userId) {
    return res.status(403).json({ message: "Sem permissão" });
  }
  await service.deleteOne();
  return res.json({ message: "Removido" });
}

/** Dashboard: meus serviços */
async function mine(req, res) {
  const { status } = req.query;
  const q = { author: req.userId };
  if (status) q.status = status;
  const items = await Service.find(q).sort({ updatedAt: -1 }).populate("author", "-password");
  return res.json({ items });
}

module.exports = {
  create,
  list,
  getOne,
  update,
  updateStatus,
  remove,
  mine,
};
