import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
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
import SortableItem from "./SortableItem"; // Componente de elementos ordenables
import Swal from "sweetalert2";

const Admin = () => {
  // Estados para secciones
  const [secciones, setSecciones] = useState([]);
  const [nuevaSeccion, setNuevaSeccion] = useState("");
  const [editSeccionId, setEditSeccionId] = useState(null);
  const [editNombreSeccion, setEditNombreSeccion] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [articulos, setArticulos] = useState([]);

  // Estados para artículos  
  // Actualizamos el estado inicial con la nueva estructura
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    ingredientes: "",
    precio: 0, // precio base
    adicional: {
      nombre: "",
      tamaño: "",
      precio: 0,
    },
    tamaño: {
      nombre: "",
      precio: 0,
    },
    precioTotal: 0,
  });
  const [editArticuloId, setEditArticuloId] = useState(null);

  // Declaramos los sensores para secciones y artículos (siempre llamados en el mismo orden)
  const sensorsSecciones = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sensorsArticulos = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Cargar secciones en tiempo real (ordenadas por "orden")
  useEffect(() => {
    const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSecciones(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, []);

  // Cargar artículos de la sección seleccionada (ordenados)
  useEffect(() => {
    if (!seccionSeleccionada) {
      setArticulos([]);
      return;
    }
    const q = query(
      collection(db, "secciones", seccionSeleccionada.id, "articulos"),
      orderBy("orden", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticulos(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsubscribe();
  }, [seccionSeleccionada]);

  // Función para agregar o editar una sección
  const saveSeccion = async () => {
    if (editSeccionId ? !editNombreSeccion.trim() : !nuevaSeccion.trim()) {
      return Swal.fire({
        title: "Atención",
        text: "Ingresa un nombre de sección.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
    try {
      if (editSeccionId) {
        await updateDoc(doc(db, "secciones", editSeccionId), {
          nombre: editNombreSeccion,
        });
        Swal.fire({
          title: "¡Actualizado!",
          text: "La sección ha sido actualizada correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setEditSeccionId(null);
      } else {
        const orden = secciones.length;
        await addDoc(collection(db, "secciones"), { nombre: nuevaSeccion, orden });
        Swal.fire({
          title: "¡Agregado!",
          text: "La sección ha sido agregada correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setNuevaSeccion("");
      setEditNombreSeccion("");
    } catch (error) {
      console.error("🚨 Error al guardar sección:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la sección.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Función para eliminar una sección
  const deleteSeccion = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción eliminará la sección y todos sus artículos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteDoc(doc(db, "secciones", id));
      setSecciones((prev) => prev.filter((sec) => sec.id !== id));
      if (seccionSeleccionada?.id === id) {
        setSeccionSeleccionada(null);
        setArticulos([]);
      }
      Swal.fire({
        title: "Eliminado",
        text: "La sección ha sido eliminada.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("🚨 Error al eliminar sección:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al eliminar la sección.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Inicia el proceso de edición de una sección (carga el nombre en el formulario)
  const startEditSeccion = (id, nombre) => {
    setEditSeccionId(id);
    setEditNombreSeccion(nombre);
  };

  // Reordenar secciones con dnd-kit
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = secciones.findIndex((s) => s.id === active.id);
    const newIndex = secciones.findIndex((s) => s.id === over.id);
    const newSecciones = arrayMove(secciones, oldIndex, newIndex);
    setSecciones(newSecciones);
    try {
      const batchUpdates = newSecciones.map((sec, index) =>
        updateDoc(doc(db, "secciones", sec.id), { orden: index })
      );
      await Promise.all(batchUpdates);
    } catch (error) {
      console.error("🚨 Error al actualizar el orden:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el orden de las secciones.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // --- Funciones para los artículos ---
  const saveArticulo = async () => {
    if (!seccionSeleccionada) {
      return Swal.fire({
        title: "Atención",
        text: "Selecciona una sección.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
    if (!nuevoArticulo.nombre.trim()) {
      return Swal.fire({
        title: "Atención",
        text: "El artículo debe tener un nombre.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
    try {
      // Calculamos el precioTotal como precio base + precio del adicional
      const precioTotal =
        Number(nuevoArticulo.precio) +
        Number(nuevoArticulo.adicional.precio);
      const articuloData = {
        ...nuevoArticulo,
        precioTotal,
      };
      if (editArticuloId) {
        await updateDoc(
          doc(db, "secciones", seccionSeleccionada.id, "articulos", editArticuloId),
          articuloData
        );
        Swal.fire({
          title: "¡Actualizado!",
          text: "El artículo ha sido actualizado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setEditArticuloId(null);
      } else {
        const orden = articulos.length;
        await addDoc(
          collection(db, "secciones", seccionSeleccionada.id, "articulos"),
          { ...articuloData, orden }
        );
        Swal.fire({
          title: "¡Agregado!",
          text: "El artículo ha sido agregado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      // Reiniciamos el formulario del artículo con la nueva estructura
      setNuevoArticulo({
        nombre: "",
        ingredientes: "",
        precio: 0,
        adicional: { nombre: "", tamaño: "", precio: 0 },
        tamaño: { nombre: "", precio: 0 },
        precioTotal: 0,
      });
    } catch (error) {
      console.error("🚨 Error al guardar artículo:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el artículo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Inicia la edición de un artículo (carga sus datos en el formulario)
  const startEditArticulo = (articulo) => {
    setEditArticuloId(articulo.id);
    setNuevoArticulo({
      nombre: articulo.nombre,
      ingredientes: articulo.ingredientes,
      precio: articulo.precio,
      adicional: articulo.adicional || { nombre: "", tamaño: "", precio: 0 },
      tamaño: articulo.tamaño || { nombre: "", precio: 0 },
      precioTotal:
        articulo.precioTotal ||
        Number(articulo.precio) + Number(articulo.adicional?.precio || 0),
    });
  };

  // Eliminar un artículo
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
      await deleteDoc(
        doc(db, "secciones", seccionSeleccionada.id, "articulos", articuloId)
      );
      Swal.fire({
        title: "Eliminado",
        text: "El artículo ha sido eliminado.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("🚨 Error al eliminar artículo:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el artículo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Reordenar artículos con dnd-kit
  const handleDragEndArticulo = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = articulos.findIndex((a) => a.id === active.id);
    const newIndex = articulos.findIndex((a) => a.id === over.id);
    const newArticulos = arrayMove(articulos, oldIndex, newIndex);
    setArticulos(newArticulos);
    try {
      const batchUpdates = newArticulos.map((art, index) =>
        updateDoc(
          doc(db, "secciones", seccionSeleccionada.id, "articulos", art.id),
          { orden: index }
        )
      );
      await Promise.all(batchUpdates);
    } catch (error) {
      console.error("🚨 Error al actualizar el orden de los artículos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el orden de los artículos.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Panel de Administración</h1>
      <button className="btn btn-danger mb-3" onClick={() => signOut(auth)}>
        Cerrar Sesión
      </button>

      {/* CREAR O EDITAR SECCIÓN */}
      <div className="mb-4">
        <h2>{editSeccionId ? "Editar Sección" : "Crear Sección"}</h2>
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
        <button className="btn btn-primary" onClick={saveSeccion}>
          {editSeccionId ? "Guardar Cambios" : "Agregar Sección"}
        </button>
      </div>

      {/* LISTADO DE SECCIONES */}
      <DndContext
        sensors={sensorsSecciones}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={secciones} strategy={verticalListSortingStrategy}>
          <ul className="list-group">
            {secciones.map((sec) => (
              <SortableItem
                key={sec.id}
                id={sec.id}
                nombre={sec.nombre}
                onDelete={() => deleteSeccion(sec.id)}
                onEdit={() => startEditSeccion(sec.id, sec.nombre)}
                onClick={() => setSeccionSeleccionada(sec)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* PANEL DE ARTÍCULOS (solo si se ha seleccionado una sección) */}
      {seccionSeleccionada && (
        <div className="mt-4">
          <h3>Artículos en {seccionSeleccionada.nombre}</h3>
          <button
            className="btn btn-secondary mb-3"
            onClick={() => setSeccionSeleccionada(null)}
          >
            Volver
          </button>

          {/* Formulario para agregar/editar artículo */}
          <div className="mb-4">
            <h4>{editArticuloId ? "Editar Artículo" : "Agregar Artículo"}</h4>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nombre del artículo"
              value={nuevoArticulo.nombre}
              onChange={(e) =>
                setNuevoArticulo({ ...nuevoArticulo, nombre: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingredientes"
              value={nuevoArticulo.ingredientes}
              onChange={(e) =>
                setNuevoArticulo({ ...nuevoArticulo, ingredientes: e.target.value })
              }
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Precio base"
              value={nuevoArticulo.precio}
              onChange={(e) =>
                setNuevoArticulo({
                  ...nuevoArticulo,
                  precio: parseFloat(e.target.value) || 0,
                })
              }
            />
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
              className="form-control mb-2"
              placeholder="Precio del adicional"
              value={nuevoArticulo.adicional.precio}
              onChange={(e) =>
                setNuevoArticulo((prev) => ({
                  ...prev,
                  adicional: {
                    ...prev.adicional,
                    precio: parseFloat(e.target.value) || 0,
                  },
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
              className="form-control mb-2"
              placeholder="Precio del tamaño"
              value={nuevoArticulo.tamaño.precio}
              onChange={(e) =>
                setNuevoArticulo((prev) => ({
                  ...prev,
                  tamaño: {
                    ...prev.tamaño,
                    precio: parseFloat(e.target.value) || 0,
                  },
                }))
              }
            />
            <button className="btn btn-primary" onClick={saveArticulo}>
              {editArticuloId ? "Guardar Cambios" : "Agregar Artículo"}
            </button>
          </div>

          {/* Listado y ordenamiento de artículos */}
          <div>
            <h4>Lista de Artículos</h4>
            <DndContext
              sensors={sensorsArticulos}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndArticulo}
            >
              <SortableContext items={articulos} strategy={verticalListSortingStrategy}>
                <ul className="list-group">
                  {articulos.map((art) => (
                    <SortableItem
                      key={art.id}
                      id={art.id}
                      nombre={art.nombre}
                      onDelete={() => deleteArticulo(art.id)}
                      onEdit={() => startEditArticulo(art)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
