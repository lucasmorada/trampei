const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getIO } = require("../sockets");

async function list(req, res) {
  const { conversationId } = req.params;
  const { page = 1, limit = 40 } = req.query;
  const convo = await Conversation.findById(conversationId);
  if (!convo) return res.status(404).json({ message: "Conversa não encontrada" });
  if (!convo.participants.map(String).includes(String(req.userId))) {
    return res.status(403).json({ message: "Sem permissão" });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("sender", "firstName lastName profileImage"),
    Message.countDocuments({ conversation: conversationId }),
  ]);

  return res.json({
    items: items.reverse(),
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
  });
}

async function send(req, res) {
  const { conversationId, text } = req.body;
  if (!conversationId || !text?.trim()) {
    return res.status(400).json({ message: "conversationId e texto são obrigatórios" });
  }
  const convo = await Conversation.findById(conversationId);
  if (!convo) return res.status(404).json({ message: "Conversa não encontrada" });
  if (!convo.participants.map(String).includes(String(req.userId))) {
    return res.status(403).json({ message: "Sem permissão" });
  }

  const msg = await Message.create({
    conversation: conversationId,
    sender: req.userId,
    text: text.trim(),
  });

  convo.lastMessage = {
    text: msg.text,
    sender: req.userId,
    createdAt: msg.createdAt,
  };
  convo.updatedAt = new Date();
  await convo.save();

  const populated = await Message.findById(msg._id).populate(
    "sender",
    "firstName lastName profileImage"
  );

  const io = getIO();
  if (io) {
    const other = convo.participants.find((p) => String(p) !== String(req.userId));
    if (other) {
      io.to(`user:${other}`).emit("message:new", {
        conversationId: String(conversationId),
        message: populated,
      });
    }
    io.to(`conv:${conversationId}`).emit("message:room", { message: populated });
  }

  return res.status(201).json({ message: populated });
}

async function markRead(req, res) {
  const { conversationId } = req.params;
  const convo = await Conversation.findById(conversationId);
  if (!convo || !convo.participants.map(String).includes(String(req.userId))) {
    return res.status(403).json({ message: "Sem permissão" });
  }
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: req.userId }, read: false },
    { read: true }
  );
  return res.json({ ok: true });
}

module.exports = { list, send, markRead };
