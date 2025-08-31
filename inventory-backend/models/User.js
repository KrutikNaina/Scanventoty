import mongoose from "mongoose";
import crypto from "crypto";

function pbkdf2Hash(password, salt) {
  // Use PBKDF2 with SHA-256, 100,000 iterations, 64-byte key
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  passwordSalt: { type: String, select: false },
  googleId: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  // Generate a new salt for each password
  const salt = crypto.randomBytes(16).toString("hex");
  this.passwordSalt = salt;
  this.password = pbkdf2Hash(this.password, salt);
  next();
});

userSchema.methods.verifyPassword = function(candidatePassword) {
  if (!this.passwordSalt || !this.password) return false;
  const hash = pbkdf2Hash(candidatePassword, this.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(this.password, 'hex'));
};

export default mongoose.model("User", userSchema);
