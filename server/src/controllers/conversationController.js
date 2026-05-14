const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

/** Dois ObjectIds ordenados para busca consistente */
function sortedParticipantIds(a, b) {
  const u1 = new mongoose.Types.ObjectId(String(a));
  const u2 = new mongoose.Types.ObjectId(String(b));
  return [u1, u2].sort((x, y) => String(x).localeCompare(String(y)));
}

async function getOrCreate(req, res) {
  const { participantId, serviceId } = req.body;
  if (!participantId) return res.status(400).json({ message: "participantId obrigatório" });
  if (String(participantId) === String(req.userId)) {
    return res.status(400).json({ message: "Não é possível conversar consigo mesmo" });
  }
  const other = await User.findById(participantId).select("-password");
  if (!other) return res.status(404).json({ message: "Usuário não encontrado" });

  const [p1, p2] = sortedParticipantIds(req.userId, participantId);
  let convo = await Conversation.findOne({
    participants: { $all: [p1, p2], $size: 2 },
  }).populate("participants", "-password");

  if (!convo) {
    convo = await Conversation.create({
      participants: [p1, p2],
      service: serviceId || null,
    });
    convo = await Conversation.findById(convo._id).populate("participants", "-password");
  }

  return res.json({ conversation: convo });
}

async function listMine(req, res) {
  const items = await Conversation.find({ participants: req.userId })
    .populate("participants", "-password")
    .sort({ updatedAt: -1 });
  return res.json({ items });
}

module.exports = { getOrCreate, listMine };
