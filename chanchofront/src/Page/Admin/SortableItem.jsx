import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import "../../Styles/SortableItem.css";
import { TbDragDrop } from "react-icons/tb";

const SortableItem = ({ id, nombre, onDelete, onEdit, onClick, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit();
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`list-group-item section-item d-flex justify-content-between align-items-center ${isActive ? "active" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", display: "flex", alignItems: "center" }}
      >
        <TbDragDrop style={{ marginRight: "8px" }} />
        <span>{nombre}</span>
      </div>
      <div style={{ whiteSpace: "nowrap" }}>
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
  isActive: PropTypes.bool,
};

export default SortableItem;
