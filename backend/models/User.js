import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  blocked: { type: Boolean, default: false },

  // ✅ Profile fields
  phone: { type: String },
  dob: { type: Date },
  address: { type: String },
  profilePic: { type: String } // Cloudinary URL
}, { timestamps: true });

export default mongoose.model("User", userSchema);
