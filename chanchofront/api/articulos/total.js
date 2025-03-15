import { connectToDatabase } from "../lib/mongoose.js";
import Articulo from "../models/Articulo.js";

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== 'GET') {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const total = await Articulo.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    console.error("Error al obtener total de artículos:", error);
    res.status(500).json({ error: "Error al obtener total de artículos" });
  }
}
