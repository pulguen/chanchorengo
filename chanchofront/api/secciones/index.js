// api/secciones/index.js
import { connectToDatabase } from "../lib/mongoose.js";
import Section from "../models/Section.js";

export default async function handler(req, res) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const secciones = await Section.find().sort({ orden: 1 });
        // Convertir cada documento a objeto plano y agregar la propiedad 'id'
        const seccionesWithId = secciones.map(sec => ({
          ...sec.toObject(),
          id: sec._id.toString()
        }));
        res.status(200).json(seccionesWithId);
      } catch (error) {
        console.error("Error al obtener secciones:", error);
        res.status(500).json({ error: "Error al obtener secciones" });
      }
      break;
    case 'POST':
      try {
        const { nombre, orden = 0, visible = true } = req.body;
        const section = new Section({ nombre, orden, visible });
        await section.save();
        res.status(201).json({ id: section._id.toString() });
      } catch (error) {
        console.error("Error al crear sección:", error);
        res.status(500).json({ error: "Error al crear sección" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
