export default function handler(req, res) {
    res.status(200).json({ message: `Recibido: ${req.query.slug}`, method: req.method });
  }
  