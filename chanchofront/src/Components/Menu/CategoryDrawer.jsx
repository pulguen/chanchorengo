import { useEffect } from "react";
import PropTypes from "prop-types";
import "../../Styles/CategoryDrawer.css";

const CategoryDrawer = ({ sections, onSelectSection, onClose }) => {
  // Bloqueamos el scroll del body mientras el drawer está abierto
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="category-drawer-overlay" onClick={onClose}>
      <div className="category-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">NUESTRO MENÚ</h3>
          <button className="drawer-close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <ul className="drawer-list">
          {sections.map((section) => (
            <li
              key={section.id}
              className="drawer-item"
              onClick={() => {
                onSelectSection(section);
                onClose(); // Cierra el drawer al seleccionar
              }}
            >
              {section.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

CategoryDrawer.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
    })
  ).isRequired,
  onSelectSection: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CategoryDrawer;
