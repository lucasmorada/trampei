const { Server } = require("socket.io");
const { verifyToken } = require("../utils/token");
const User = require("../models/User");

const { clientUrl } = require("../utils/corsOrigins");

let io;

function getIO() {
  return io;
}

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [clientUrl, /^https:\/\/[\w-]+\.vercel\.app$/],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Não autorizado"));
      const decoded = verifyToken(token);
      socket.userId = decoded.sub;
      return next();
    } catch {
      return next(new Error("Token inválido"));
    }
  });

  io.on("connection", async (socket) => {
    const uid = socket.userId;
    socket.join(`user:${uid}`);
    await User.findByIdAndUpdate(uid, { lastSeen: new Date(), availability: "available" });
    socket.broadcast.emit("presence:update", { userId: uid, status: "online" });

    socket.on("conv:join", (conversationId) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conv:${conversationId}`).emit("typing", {
        conversationId,
        userId: uid,
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(uid, { lastSeen: new Date(), availability: "offline" });
      socket.broadcast.emit("presence:update", { userId: uid, status: "offline" });
    });
  });

  return io;
}

module.exports = { initSocket, getIO };
