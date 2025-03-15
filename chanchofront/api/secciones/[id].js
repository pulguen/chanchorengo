import { connectToDatabase } from "../lib/mongoose.js";
import Section from "../models/Section.js";

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;
  console.log("Parámetros de query:", req.query);
  switch (req.method) {
    case 'PUT':
      try {
        const data = req.body;
        const updated = await Section.findByIdAndUpdate(id, data, { new: true });
        if (!updated) return res.status(404).json({ error: "Sección no encontrada" });
        res.status(200).json({ message: "Sección actualizada" });
      } catch (error) {
        console.error("Error al actualizar la sección:", error);
        res.status(500).json({ error: "Error al actualizar la sección" });
      }
      break;
    case 'DELETE':
      try {
        const deleted = await Section.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Sección no encontrada" });
        res.status(200).json({ message: "Sección eliminada" });
      } catch (error) {
        console.error("Error al eliminar la sección:", error);
        res.status(500).json({ error: "Error al eliminar la sección" });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
