const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 8000 },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    serviceType: { type: String, trim: true, default: "Freelance" },
    urgency: {
      type: String,
      enum: ["baixa", "media", "alta"],
      default: "media",
    },
    deadline: { type: Date },
    contactPhone: { type: String, trim: true, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "urgent", "in_progress", "completed"],
      default: "open",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, createdAt: -1 });
serviceSchema.index({ category: 1, city: 1 });
serviceSchema.index({ title: "text", description: "text", category: "text" });

module.exports = mongoose.model("Service", serviceSchema);
