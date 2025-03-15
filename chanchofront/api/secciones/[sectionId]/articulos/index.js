import { connectToDatabase } from "../../../../lib/mongoose.js";
import Articulo from "../../../../models/Articulo.js";

export default async function handler(req, res) {
  await connectToDatabase();
  const { sectionId } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const articulos = await Articulo.find({ seccionId: sectionId }).sort({ orden: 1 });
        const articulosWithId = articulos.map(art => ({
          ...art.toObject(),
          id: art._id.toString()
        }));
        res.status(200).json(articulosWithId);
      } catch (error) {
        console.error("Error al obtener artículos:", error);
        res.status(500).json({ error: "Error al obtener artículos" });
      }
      break;
    case 'POST':
      try {
        const { orden, ...rest } = req.body;
        const articulo = new Articulo({ ...rest, seccionId: sectionId, orden });
        await articulo.save();
        res.status(201).json({ id: articulo._id.toString() });
      } catch (error) {
        console.error("Error al crear artículo:", error);
        res.status(500).json({ error: "Error al crear artículo" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
