// src/Page/Admin/Admin.jsx
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useMongoData } from "../../Context/MongoDataContext";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import Swal from "sweetalert2";
import "../../Styles/Admin.css";

const Admin = () => {
  // Obtención desde el contexto de Mongo
  const { secciones, fetchSecciones, loading } = useMongoData();
  // Estados para secciones
  const [nuevaSeccion, setNuevaSeccion] = useState("");
  const [editSeccionId, setEditSeccionId] = useState(null);
  const [editNombreSeccion, setEditNombreSeccion] = useState("");
  const [editSeccionVisible, setEditSeccionVisible] = useState(true);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  // Estados para artículos
  const [articulos, setArticulos] = useState([]);
  const [totalArticulos, setTotalArticulos] = useState(0);

  const initialArticuloState = {
    nombre: "",
    ingredientes: "",
    precio: "",
    adicional: { nombre: "", tamaño: "", precio: "" },
    tamaño: { nombre: "", precio: "" },
    precioTotal: 0,
    visible: true,
  };
  const [nuevoArticulo, setNuevoArticulo] = useState(initialArticuloState);
  const [editArticuloId, setEditArticuloId] = useState(null);
  const [mostrarFormularioArticulo, setMostrarFormularioArticulo] = useState(false);

  // Estado para el buscador de secciones
  const [searchTerm, setSearchTerm] = useState("");

  // Sensores para DnD
  const sensorsSecciones = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sensorsArticulos = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Cargar artículos de la sección seleccionada
  useEffect(() => {
    if (!seccionSeleccionada) {
      setArticulos([]);
      return;
    }
    const fetchArticles = async () => {
      try {
        const res = await fetch(`/api/secciones/${seccionSeleccionada.id}/articulos`);
        if (!res.ok) throw new Error("Error al obtener artículos");
        const data = await res.json();
        // Filtramos artículos visibles
        setArticulos(data.filter((art) => art.visible !== false));
      } catch (error) {
        console.error("Error al obtener artículos:", error);
      }
    };
    fetchArticles();
  }, [seccionSeleccionada]);

  // Cargar total de artículos
  useEffect(() => {
    const fetchTotalArticles = async () => {
      try {
        const res = await fetch("/api/articulos/total");
        if (!res.ok) throw new Error("Error al obtener total de artículos");
        const data = await res.json();
        setTotalArticulos(data.total);
      } catch (error) {
        console.error("Error al obtener total de artículos:", error);
      }
    };
    fetchTotalArticles();
  }, []);

  // --- CRUD PARA SECCIONES ---
  const createSection = async () => {
    if (!nuevaSeccion.trim()) {
      Swal.fire("Atención", "El nombre de la sección es requerido", "warning");
      return;
    }
    const orden = secciones.length;
    try {
      const res = await fetch("/api/secciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaSeccion, orden, visible: true }),
      });
      if (res.ok) {
        Swal.fire("¡Agregado!", "La sección se ha agregado correctamente.", "success");
        setNuevaSeccion("");
        fetchSecciones();
      } else {
        Swal.fire("Error", "No se pudo agregar la sección", "error");
      }
    } catch (error) {
      console.error("Error creando sección:", error);
      Swal.fire("Error", "No se pudo agregar la sección", "error");
    }
  };

  const updateSection = async (id, data) => {
    try {
      const res = await fetch(`/api/secciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error en actualización");
    } catch (error) {
      console.error("Error actualizando sección:", error);
      Swal.fire("Error", "No se pudo actualizar la sección.", "error");
    }
  };

  const saveEditSection = async () => {
    if (!editNombreSeccion.trim()) {
      Swal.fire("Atención", "Ingresa un nombre de sección.", "warning");
      return;
    }
    await updateSection(editSeccionId, { nombre: editNombreSeccion, visible: editSeccionVisible });
    Swal.fire("¡Actualizado!", "La sección se ha actualizado correctamente.", "success");
    cancelEditSection();
    fetchSecciones();
  };

  const cancelEditSection = () => {
    setEditSeccionId(null);
    setEditNombreSeccion("");
  };

  const handleSaveSection = () => {
    if (editSeccionId) {
      saveEditSection();
    } else {
      createSection();
    }
  };

  // **Función para eliminar una sección**
  const deleteSection = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción eliminará la sección y todos sus artículos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      console.log(id)
      const res = await fetch(`/api/secciones/${id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Eliminado", "La sección ha sido eliminada.", "success");
        // Actualizamos el listado de secciones
        fetchSecciones();
        // Si la sección eliminada era la seleccionada, la limpiamos junto con sus artículos
        if (seccionSeleccionada?.id === id) {
          setSeccionSeleccionada(null);
          setArticulos([]);
        }
      } else {
        Swal.fire("Error", "No se pudo eliminar la sección.", "error");
      }
    } catch (error) {
      console.error("Error eliminando sección:", error);
      Swal.fire("Error", "Ocurrió un error al eliminar la sección.", "error");
    }
  };

  const toggleSectionVisibility = async (section) => {
    try {
      await updateSection(section.id, { visible: !section.visible });
      Swal.fire("¡Actualizado!", "La visibilidad se ha actualizado.", "success");
      fetchSecciones();
    } catch (error) {
      console.error("Error cambiando visibilidad de la sección:", error);
      Swal.fire("Error", "No se pudo actualizar la visibilidad.", "error");
    }
  };

  // Función para iniciar la edición de una sección
  const startEditSeccion = (id, nombre, visible) => {
    setEditSeccionId(id);
    setEditNombreSeccion(nombre);
    setEditSeccionVisible(visible !== undefined ? visible : true);
  };

  // Función para reordenar secciones mediante DnD
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = secciones.findIndex((s) => s.id === active.id);
    const newIndex = secciones.findIndex((s) => s.id === over.id);
    const newSecciones = arrayMove(secciones, oldIndex, newIndex);
    try {
      await Promise.all(
        newSecciones.map((sec, index) =>
          updateSection(sec.id, { orden: index })
        )
      );
      Swal.fire("¡Orden actualizado!", "", "success");
      fetchSecciones();
    } catch (error) {
      console.error("Error al actualizar el orden:", error);
      Swal.fire("Error", "No se pudo actualizar el orden de las secciones.", "error");
    }
  };

  // --- CRUD PARA ARTÍCULOS ---
  const toggleArticleVisibility = async (article) => {
    try {
      const res = await fetch(
        `/api/secciones/${seccionSeleccionada.id}/articulos/${article.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visible: !article.visible }),
        }
      );
      if (res.ok) {
        Swal.fire({
          title: "¡Actualizado!",
          text: `El artículo se ha ${article.visible ? "desactivado" : "activado"} correctamente.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        // Refrescar artículos
        const res2 = await fetch(`/api/secciones/${seccionSeleccionada.id}/articulos`);
        const data = await res2.json();
        setArticulos(data.filter((art) => art.visible !== false));
      } else {
        Swal.fire("Error", "No se pudo actualizar la visibilidad del artículo.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar la visibilidad del artículo:", error);
      Swal.fire("Error", "No se pudo actualizar la visibilidad del artículo.", "error");
    }
  };

  const saveArticulo = async () => {
    if (!seccionSeleccionada) {
      return Swal.fire("Atención", "Selecciona una sección.", "warning");
    }
    if (!nuevoArticulo.nombre.trim()) {
      return Swal.fire("Atención", "El artículo debe tener un nombre.", "warning");
    }
    try {
      const precioTotal =
        Number(nuevoArticulo.precio) +
        Number(nuevoArticulo.tamaño.precio) +
        Number(nuevoArticulo.adicional.precio);
      const articuloData = { ...nuevoArticulo, precioTotal };

      if (editArticuloId) {
        const res = await fetch(
          `/api/secciones/${seccionSeleccionada.id}/articulos/${editArticuloId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(articuloData),
          }
        );
        if (res.ok) {
          Swal.fire("¡Actualizado!", "El artículo ha sido actualizado correctamente.", "success");
          cancelEditArticulo();
        } else {
          Swal.fire("Error", "No se pudo actualizar el artículo.", "error");
        }
      } else {
        const orden = articulos.length;
        const res = await fetch(
          `/api/secciones/${seccionSeleccionada.id}/articulos`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...articuloData, orden, visible: true }),
          }
        );
        if (res.ok) {
          Swal.fire("¡Agregado!", "El artículo ha sido agregado correctamente.", "success");
        } else {
          Swal.fire("Error", "No se pudo agregar el artículo.", "error");
        }
      }
      setNuevoArticulo(initialArticuloState);
      setMostrarFormularioArticulo(false);
      // Refrescar artículos
      const res = await fetch(`/api/secciones/${seccionSeleccionada.id}/articulos`);
      const data = await res.json();
      setArticulos(data.filter((art) => art.visible !== false));
    } catch (error) {
      console.error("Error al guardar artículo:", error);
      Swal.fire("Error", "No se pudo guardar el artículo.", "error");
    }
  };

  const cancelEditArticulo = () => {
    setEditArticuloId(null);
    setNuevoArticulo(initialArticuloState);
    setMostrarFormularioArticulo(false);
  };

  const startEditArticulo = (articulo) => {
    setEditArticuloId(articulo.id);
    setNuevoArticulo({
      nombre: articulo.nombre,
      ingredientes: articulo.ingredientes,
      precio: articulo.precio,
      adicional: articulo.adicional || { nombre: "", tamaño: "", precio: "" },
      tamaño: articulo.tamaño || { nombre: "", precio: "" },
      precioTotal:
        articulo.precioTotal ||
        (Number(articulo.precio) +
          Number(articulo.tamaño?.precio || 0) +
          Number(articulo.adicional?.precio || 0)),
      visible: articulo.visible !== undefined ? articulo.visible : true,
    });
    setMostrarFormularioArticulo(true);
  };

  const deleteArticulo = async (articuloId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción eliminará el artículo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(
        `/api/secciones/${seccionSeleccionada.id}/articulos/${articuloId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        Swal.fire("Eliminado", "El artículo ha sido eliminado.", "success");
        const res2 = await fetch(`/api/secciones/${seccionSeleccionada.id}/articulos`);
        const data = await res2.json();
        setArticulos(data.filter((art) => art.visible !== false));
      } else {
        Swal.fire("Error", "No se pudo eliminar el artículo.", "error");
      }
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
      Swal.fire("Error", "No se pudo eliminar el artículo.", "error");
    }
  };

  const handleDragEndArticulo = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = articulos.findIndex((a) => a.id === active.id);
    const newIndex = articulos.findIndex((a) => a.id === over.id);
    const newArticulos = arrayMove(articulos, oldIndex, newIndex);
    setArticulos(newArticulos);
    try {
      const batchUpdates = newArticulos.map((art, index) =>
        fetch(`/api/secciones/${seccionSeleccionada.id}/articulos/${art.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orden: index }),
        })
      );
      await Promise.all(batchUpdates);
      Swal.fire("¡Orden actualizado!", "", "success");
      const res = await fetch(`/api/secciones/${seccionSeleccionada.id}/articulos`);
      const data = await res.json();
      setArticulos(data.filter((art) => art.visible !== false));
    } catch (error) {
      console.error("Error al actualizar el orden de los artículos:", error);
      Swal.fire("Error", "No se pudo actualizar el orden de los artículos.", "error");
    }
  };

  if (loading) return <p>Cargando datos de Mongo...</p>;

  return (
    <div className="container mt-5">
      <h1>Panel de Administración</h1>
      <button className="btn btn-danger mb-3" onClick={() => signOut(auth)}>
        Cerrar Sesión
      </button>

      <div className="counter-info mb-4">
        <p>Total de secciones: {secciones.length}</p>
        <p>Total de artículos: {totalArticulos}</p>
        <p>
          {seccionSeleccionada
            ? `Artículos en la sección seleccionada: ${articulos.length}`
            : "Selecciona una sección para ver sus artículos"}
        </p>
      </div>

      {secciones.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No hay secciones. ¡Empieza a crear el menú!
        </div>
      )}

      {/* CREAR / EDITAR SECCIÓN */}
      <div className="mb-4">
        <h2>{editSeccionId ? "Editar Sección" : "Crear Nueva Sección"}</h2>
        <input
          value={editSeccionId ? editNombreSeccion : nuevaSeccion}
          onChange={(e) =>
            editSeccionId
              ? setEditNombreSeccion(e.target.value)
              : setNuevaSeccion(e.target.value)
          }
          placeholder="Nombre de la sección"
          className="form-control mb-2"
        />
        {editSeccionId && (
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="sectionVisible"
              checked={editSeccionVisible}
              onChange={(e) => setEditSeccionVisible(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="sectionVisible">
              Visible
            </label>
          </div>
        )}
        <div>
          <button className="btn btn-primary me-2" onClick={handleSaveSection}>
            {editSeccionId ? "Guardar Cambios" : "Agregar Sección"}
          </button>
          {editSeccionId && (
            <button className="btn btn-warning" onClick={cancelEditSection}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h3>Listado de Secciones del Menú</h3>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar sección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm("")}>
          Borrar
        </button>
      </div>

      <DndContext sensors={sensorsSecciones} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={secciones.map((sec) => sec.id)} strategy={verticalListSortingStrategy}>
          <ul className="list-group">
            {secciones
              .filter((sec) => sec.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((sec) => (
                <SortableItem
                  key={sec.id}
                  id={sec.id}
                  nombre={sec.nombre}
                  visible={sec.visible !== false}
                  onDelete={() => deleteSection(sec.id)}
                  onEdit={() => startEditSeccion(sec.id, sec.nombre, sec.visible)}
                  onClick={() => setSeccionSeleccionada(sec)}
                  isActive={seccionSeleccionada && sec.id === seccionSeleccionada.id}
                  onToggleVisibility={() => toggleSectionVisibility(sec)}
                />
              ))}
          </ul>
        </SortableContext>
      </DndContext>

      {seccionSeleccionada && (
        <div className="articles-card card p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="card-title">Artículos en {seccionSeleccionada.nombre}</h3>
            <button className="btn btn-secondary" onClick={() => setSeccionSeleccionada(null)}>
              Cerrar
            </button>
          </div>

          <div className="mb-4">
            <h4>Lista de Artículos</h4>
            <DndContext sensors={sensorsArticulos} collisionDetection={closestCenter} onDragEnd={handleDragEndArticulo}>
              <SortableContext items={articulos.map((art) => art.id)} strategy={verticalListSortingStrategy}>
                <ul className="list-group">
                  {articulos.map((art) => (
                    <SortableItem
                      key={art.id}
                      id={art.id}
                      nombre={art.nombre}
                      visible={art.visible !== false}
                      onDelete={() => deleteArticulo(art.id)}
                      onEdit={() => startEditArticulo(art)}
                      onToggleVisibility={() => toggleArticleVisibility(art)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>

          {mostrarFormularioArticulo || editArticuloId ? (
            <div className="mb-4">
              <h4>{editArticuloId ? "Editar Artículo" : "Agregar Artículo"}</h4>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre del artículo"
                value={nuevoArticulo.nombre}
                onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ingredientes"
                value={nuevoArticulo.ingredientes}
                onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, ingredientes: e.target.value })}
              />
              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Agregar precio base..."
                value={nuevoArticulo.precio}
                onChange={(e) =>
                  setNuevoArticulo({
                    ...nuevoArticulo,
                    precio: parseFloat(e.target.value) || "",
                  })
                }
              />
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="articleVisible"
                  checked={nuevoArticulo.visible !== false}
                  onChange={(e) => setNuevoArticulo({ ...nuevoArticulo, visible: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="articleVisible">
                  Visible
                </label>
              </div>
              <hr />
              <h5>Adicional</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre del adicional"
                value={nuevoArticulo.adicional.nombre}
                onChange={(e) =>
                  setNuevoArticulo((prev) => ({
                    ...prev,
                    adicional: { ...prev.adicional, nombre: e.target.value },
                  }))
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Tamaño del adicional"
                value={nuevoArticulo.adicional.tamaño}
                onChange={(e) =>
                  setNuevoArticulo((prev) => ({
                    ...prev,
                    adicional: { ...prev.adicional, tamaño: e.target.value },
                  }))
                }
              />
              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Agregar precio del adicional..."
                value={nuevoArticulo.adicional.precio}
                onChange={(e) =>
                  setNuevoArticulo((prev) => ({
                    ...prev,
                    adicional: { ...prev.adicional, precio: parseFloat(e.target.value) || "" },
                  }))
                }
              />
              <hr />
              <h5>Tamaño</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre del tamaño"
                value={nuevoArticulo.tamaño.nombre}
                onChange={(e) =>
                  setNuevoArticulo((prev) => ({
                    ...prev,
                    tamaño: { ...prev.tamaño, nombre: e.target.value },
                  }))
                }
              />
              <input
                type="number"
                min="0"
                className="form-control mb-2"
                placeholder="Agregar precio del tamaño..."
                value={nuevoArticulo.tamaño.precio}
                onChange={(e) =>
                  setNuevoArticulo((prev) => ({
                    ...prev,
                    tamaño: { ...prev.tamaño, precio: parseFloat(e.target.value) || "" },
                  }))
                }
              />
              <div>
                <button className="btn btn-primary me-2" onClick={saveArticulo}>
                  {editArticuloId ? "Guardar Cambios" : "Agregar Artículo"}
                </button>
                <button className="btn btn-warning" onClick={cancelEditArticulo}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <button className="btn btn-primary" onClick={() => setMostrarFormularioArticulo(true)}>
                Nuevo Artículo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
