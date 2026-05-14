const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "trampei-dev-secret-change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken, JWT_SECRET };
