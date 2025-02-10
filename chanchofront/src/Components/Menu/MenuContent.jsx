import React from "react";
import PropTypes from "prop-types";

const MenuContent = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p>Selecciona una sección para ver sus artículos.</p>;
  }

  return (
    <div className="menu-content">
      {articles.map((art) => (
        <div key={art.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem" }}>
          <h3>{art.nombre}</h3>
          {art.precioTotal && <p>Precio: ${art.precioTotal}</p>}
          {art.ingredientes && Array.isArray(art.ingredientes) && (
            <p>Ingredientes: {art.ingredientes.join(", ")}</p>
          )}
          {art.adicional && (
            <p>
              <strong>Adicional:</strong> {art.adicional.nombre} ({art.adicional.tamaño}), $
              {art.adicional.precio}
            </p>
          )}
          {art.tamaño && (
            <p>
              <strong>Tamaño:</strong> {art.tamaño.nombre}, ${art.tamaño.precio}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

MenuContent.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      precioTotal: PropTypes.number,
      ingredientes: PropTypes.arrayOf(PropTypes.string),
      adicional: PropTypes.shape({
        nombre: PropTypes.string,
        tamaño: PropTypes.string,
        precio: PropTypes.number,
      }),
      tamaño: PropTypes.shape({
        nombre: PropTypes.string,
        precio: PropTypes.number,
      }),
    })
  ),
};

MenuContent.defaultProps = {
  articles: [],
};

export default MenuContent;
