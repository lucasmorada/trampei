const { verifyToken } = require("../utils/token");

function protect(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    const decoded = verifyToken(token);
    req.userId = decoded.sub;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      req.userId = decoded.sub;
    }
  } catch {
    req.userId = null;
  }
  next();
}

module.exports = { protect, optionalAuth };
