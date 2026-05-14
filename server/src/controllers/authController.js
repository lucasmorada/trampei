const crypto = require("crypto");
const User = require("../models/User");
const { signToken } = require("../utils/token");
const { validationResult } = require("express-validator");
const { sendResetEmail } = require("../utils/mailer");

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    firstName,
    lastName,
    age,
    city,
    state,
    instagram,
    whatsApp,
    email,
    password,
    profileImage,
  } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ message: "E-mail já cadastrado" });
  }

  const user = await User.create({
    firstName,
    lastName,
    age: Number(age),
    city,
    state,
    instagram: instagram || "",
    whatsApp: whatsApp || "",
    email,
    password,
    profileImage: profileImage || "",
    availability: "offline",
  });

  const token = signToken(user._id);
  res.cookie("token", token, COOKIE_OPTS);
  const populated = await User.findById(user._id).select("-password");
  return res.status(201).json({ user: populated.toPublicJSON(), token });
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
  user.lastSeen = new Date();
  await user.save();
  const token = signToken(user._id);
  res.cookie("token", token, COOKIE_OPTS);
  const safe = await User.findById(user._id).select("-password");
  return res.json({ user: safe.toPublicJSON(), token });
}

function logout(req, res) {
  res.clearCookie("token", { ...COOKIE_OPTS, maxAge: 0 });
  return res.json({ message: "Logout realizado" });
}

async function me(req, res) {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  return res.json({ user: user.toPublicJSON() });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Informe o e-mail" });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  /** Sempre mesma resposta para não expor e-mails cadastrados */
  const generic = { message: "Se o e-mail existir, enviaremos instruções." };
  if (!user) {
    return res.json(generic);
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  const link = `${clientUrl}/redefinir-senha?token=${resetToken}`;

  try {
    await sendResetEmail(user.email, link);
  } catch (e) {
    console.error("E-mail de recuperação:", e.message);
    if (process.env.NODE_ENV !== "production") {
      console.log("[DEV] Link de redefinição:", link);
    }
  }
  return res.json(generic);
}

async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password || password.length < 6) {
    return res.status(400).json({ message: "Token e senha válidos são obrigatórios (mín. 6 caracteres)" });
  }
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password +resetPasswordToken +resetPasswordExpire");

  if (!user) {
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return res.json({ message: "Senha atualizada com sucesso" });
}

module.exports = {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  COOKIE_OPTS,
};
