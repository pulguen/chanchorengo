import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  orden: { type: Number, default: 0 },
  visible: { type: Boolean, default: true }
});

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);
