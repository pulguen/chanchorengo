import { connectToDatabase } from "../lib/mongoose.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { db } = await connectToDatabase();
    await db.dropDatabase();
    res.status(200).json({ message: "Base de datos reseteada con éxito" });
  } catch (error) {
    console.error("Error al resetear la DB:", error);
    res.status(500).json({ error: "Error al resetear la base de datos" });
  }
}
