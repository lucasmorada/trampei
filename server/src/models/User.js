const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const completedJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, min: 14, max: 120 },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    profileImage: { type: String, default: "" },
    instagram: { type: String, trim: true, default: "" },
    whatsApp: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    bio: { type: String, maxlength: 2000, default: "" },
    servicesOffered: { type: String, maxlength: 2000, default: "" },
    skillTags: [{ type: String, trim: true }],
    completedJobs: [completedJobSchema],
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
    },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    completedServicesCount: { type: Number, default: 0 },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    lastSeen: { type: Date },
    /** Anti-spam: última criação de serviço */
    lastServicePostAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

userSchema.virtual("fullName").get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

module.exports = mongoose.model("User", userSchema);
