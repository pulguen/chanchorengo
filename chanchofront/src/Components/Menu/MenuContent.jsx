import PropTypes from "prop-types";
import "../../Styles/MenuContent.css";

const MenuContent = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-center">Selecciona una sección para ver sus artículos.</p>;
  }

  return (
    <div className="menu-content">
      {articles.map((art) => {
        // Convertimos precios a número, o 0 si no se puede parsear
        const precioTotal = parseFloat(art.precioTotal) || 0;
        const adicionalPrecio = art.adicional ? parseFloat(art.adicional.precio) || 0 : 0;
        const tamañoPrecio = art.tamaño ? parseFloat(art.tamaño.precio) || 0 : 0;

        // Verificamos si hay datos en adicional
        const hayAdicional =
          art.adicional &&
          (art.adicional.nombre || art.adicional.tamaño || adicionalPrecio > 0);

        // Verificamos si hay datos en tamaño
        const hayTamaño =
          art.tamaño &&
          (art.tamaño.nombre || tamañoPrecio > 0);

        return (
          <div key={art.id} className="article-card">
            <div className="article-header">
              <h5 className="article-title">{art.nombre}</h5>
              {/* Mostramos precioTotal solo si es > 0 */}
              {precioTotal > 0 && (
                <span className="article-price">${precioTotal}</span>
              )}
            </div>

            {/* Ingredientes: solo si hay un array con longitud > 0 */}
            {art.ingredientes &&
              Array.isArray(art.ingredientes) &&
              art.ingredientes.length > 0 && (
                <p className="article-ingredientes">
                  Ingredientes: {art.ingredientes.join(", ")}
                </p>
              )}

            <div className="article-extra">
              {/* Adicional: solo si hay alguno de los campos con datos */}
              {hayAdicional && (
                <span className="article-adicional">
                  Adicional:
                  {art.adicional.nombre ? ` ${art.adicional.nombre}` : ""}
                  {art.adicional.tamaño ? ` (${art.adicional.tamaño})` : ""}
                  {adicionalPrecio > 0 ? ` - $${adicionalPrecio}` : ""}
                </span>
              )}
              {/* Tamaño: solo si hay alguno de los campos con datos */}
              {hayTamaño && (
                <span className="article-size">
                  Tamaño:
                  {art.tamaño.nombre ? ` ${art.tamaño.nombre}` : ""}
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
      ingredientes: PropTypes.arrayOf(PropTypes.string),
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
