import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import { TbDragDrop } from "react-icons/tb";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import "../../Styles/SortableItem.css";

const SortableItem = ({
  id,
  nombre,
  visible,
  onDelete,
  onEdit,
  onClick,
  isActive,
  onToggleVisibility,
}) => {
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

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleVisibility && onToggleVisibility();
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
      <div className="d-flex align-items-center">
        <button className="btn btn-secondary btn-sm me-2" onClick={handleEdit}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm me-2" onClick={handleDelete}>
          Eliminar
        </button>
        <button className="btn btn-info btn-sm" onClick={handleToggle}>
          {visible ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>
    </li>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  onToggleVisibility: PropTypes.func,
};

export default SortableItem;
