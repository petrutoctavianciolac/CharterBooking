import mongoose from 'mongoose';

const charterProviderSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash_password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("CharterProvider", charterProviderSchema);
