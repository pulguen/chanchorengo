// src/Components/Menu/MenuContent.jsx
import PropTypes from "prop-types";
import "../../Styles/MenuContent.css";

const MenuContent = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-center">Selecciona una sección para ver sus artículos.</p>;
  }

  return (
    <div className="menu-content">
      {articles.map((art) => {
        // Convertir valores a número (o 0 si falla)
        const precioTotal = parseFloat(art.precioTotal) || 0;
        const adicionalPrecio = art.adicional ? parseFloat(art.adicional.precio) || 0 : 0;
        const tamañoPrecio = art.tamaño ? parseFloat(art.tamaño.precio) || 0 : 0;

        // Si ingredientes es un string, lo convertimos a array
        const ingredientes = art.ingredientes
          ? Array.isArray(art.ingredientes)
            ? art.ingredientes
            : [art.ingredientes]
          : [];

        const hayAdicional =
          art.adicional &&
          (art.adicional.nombre || art.adicional.tamaño || adicionalPrecio > 0);
        const hayTamaño =
          art.tamaño &&
          (art.tamaño.nombre || tamañoPrecio > 0);

        return (
          <div key={art.id} className="article-card">
            <div className="article-header">
              <h5 className="article-title">{art.nombre}</h5>
              {precioTotal > 0 && (
                <span className="article-price">${precioTotal}</span>
              )}
            </div>
            {ingredientes.length > 0 && (
              <p className="article-ingredientes">{ingredientes.join(", ")}</p>
            )}
            <div className="article-extra">
              {hayAdicional && (
                <span className="article-adicional">
                  Adicional: {art.adicional.nombre || ""}
                  {art.adicional.tamaño ? ` (${art.adicional.tamaño})` : ""}
                  {adicionalPrecio > 0 ? ` - $${adicionalPrecio}` : ""}
                </span>
              )}
              {hayTamaño && (
                <span className="article-size">
                  Tamaño: {art.tamaño.nombre || ""}
                  {tamañoPrecio > 0 ? ` - $${tamañoPrecio}` : ""}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

MenuContent.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      precioTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ingredientes: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
      ]),
      adicional: PropTypes.shape({
        nombre: PropTypes.string,
        tamaño: PropTypes.string,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      tamaño: PropTypes.shape({
        nombre: PropTypes.string,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    })
  ),
};

export default MenuContent;
