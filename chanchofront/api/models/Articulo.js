import mongoose from 'mongoose';

const ArticuloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ingredientes: { type: String },
  precio: { type: Number, required: true },
  adicional: {
    nombre: String,
    tamaño: String,
    precio: Number,
  },
  tamaño: {
    nombre: String,
    precio: Number,
  },
  precioTotal: { type: Number },
  visible: { type: Boolean, default: true },
  seccionId: { type: String, required: true },
  orden: { type: Number, default: 0 }
});

export default mongoose.models.Articulo || mongoose.model('Articulo', ArticuloSchema);
