import { connectToDatabase } from "../../../../../lib/mongoose.js";
import Articulo from "../../../../../models/Articulo.js";

export default async function handler(req, res) {
  await connectToDatabase();
  const { sectionId, id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const data = req.body;
        const updated = await Articulo.findOneAndUpdate(
          { _id: id, seccionId: sectionId },
          { $set: data },
          { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Artículo no encontrado" });
        res.status(200).json({ message: "Artículo actualizado" });
      } catch (error) {
        console.error("Error al actualizar artículo:", error);
        res.status(500).json({ error: "Error al actualizar artículo" });
      }
      break;
    case 'DELETE':
      try {
        const deleted = await Articulo.findOneAndDelete({ _id: id, seccionId: sectionId });
        if (!deleted) return res.status(404).json({ error: "Artículo no encontrado" });
        res.status(200).json({ message: "Artículo eliminado" });
      } catch (error) {
        console.error("Error al eliminar artículo:", error);
        res.status(500).json({ error: "Error al eliminar artículo" });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
