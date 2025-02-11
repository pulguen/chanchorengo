import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

const SortableItem = ({ id, nombre, onDelete, onEdit, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handler para el botón de eliminar
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  // Handler para el botón de editar
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit();
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={onClick} // Permite que, al hacer clic en el ítem, se seleccione la sección (en el listado de secciones)
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      {/* Área de "drag handle" */}
      <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
        {nombre}
      </div>
      <div>
        <button className="btn btn-secondary btn-sm me-2" onClick={handleEdit}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </li>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
};

export default SortableItem;
