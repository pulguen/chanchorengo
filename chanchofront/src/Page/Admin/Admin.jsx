import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";

// Importamos las funciones de Firestore que usaremos
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const Admin = () => {
  // ----------------- ESTADOS PARA SECCIONES -----------------
  const [secciones, setSecciones] = useState([]);      // Lista de secciones
  const [nuevaSeccion, setNuevaSeccion] = useState(""); // Para crear una sección

  // ----------------- SECCIÓN SELECCIONADA + SUS ARTÍCULOS -----------------
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [articulos, setArticulos] = useState([]);

  // ----------------- CREACIÓN DE UN NUEVO ARTÍCULO -----------------
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    ingredientes: "",
    adicional: { nombre: "", tamaño: "", precio: 0 },
    tamaño: { nombre: "", precio: 0 },
    precioTotal: 0,
  });

  // ----------------- EFECTO: OBTENER TODAS LAS SECCIONES EN TIEMPO REAL -----------------
  useEffect(() => {
    // Suscripción a la colección 'secciones'
    const unsubscribe = onSnapshot(collection(db, "secciones"), (snapshot) => {
      const dataSecciones = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSecciones(dataSecciones);
    });
    // Limpiamos la suscripción al desmontar
    return () => unsubscribe();
  }, []);

  // ----------------- EFECTO: CARGAR ARTÍCULOS DE LA SECCIÓN SELECCIONADA -----------------
  useEffect(() => {
    if (!seccionSeleccionada) return;

    const subCollectionRef = collection(
      db,
      "secciones",
      seccionSeleccionada.id,
      "articulos"
    );
    // Suscribimos a la subcolección 'articulos' de la sección actual
    const unsubscribe = onSnapshot(subCollectionRef, (snapshot) => {
      const dataArticulos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setArticulos(dataArticulos);
    });

    return () => unsubscribe();
  }, [seccionSeleccionada]);

  // ----------------- CERRAR SESIÓN -----------------
  const handleLogout = () => {
    signOut(auth);
  };

  // ----------------- CREAR UNA NUEVA SECCIÓN -----------------
  const createSeccion = async () => {
    if (!nuevaSeccion.trim()) {
      alert("Ingresa un nombre de sección");
      return;
    }
    try {
      await addDoc(collection(db, "secciones"), {
        nombre: nuevaSeccion,
      });
      setNuevaSeccion("");
    } catch (error) {
      console.error("Error al crear sección:", error);
    }
  };

  // ----------------- MANEJADOR DE CAMBIOS DE INPUT (ARTÍCULO) -----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // name puede ser 'nombre', 'ingredientes', 'adicional.nombre', etc.
    const parts = name.split(".");
    if (parts.length === 1) {
      // Campos directos como 'nombre', 'ingredientes'
      setNuevoArticulo((prev) => ({ ...prev, [name]: value }));
    } else if (parts.length === 2) {
      // Campos anidados como 'adicional.nombre'
      const [objKey, field] = parts; // ej: "adicional", "nombre"
      setNuevoArticulo((prev) => ({
        ...prev,
        [objKey]: {
          ...prev[objKey],
          [field]: value,
        },
      }));
    }
  };

  // ----------------- CREAR UN NUEVO ARTÍCULO EN LA SECCIÓN SELECCIONADA -----------------
  const createArticulo = async () => {
    if (!seccionSeleccionada) {
      alert("Selecciona una sección para añadir artículos");
      return;
    }
    if (!nuevoArticulo.nombre.trim()) {
      alert("El artículo necesita un nombre");
      return;
    }

    // Convertir en number los precios
    const precioBase = parseFloat(nuevoArticulo.tamaño.precio) || 0;
    const precioAdicional = parseFloat(nuevoArticulo.adicional.precio) || 0;
    const precioTotalCalc = precioBase + precioAdicional;

    // ingredientes -> array de strings, asumiendo que vienen separadas por comas
    const ingredientesArray = nuevoArticulo.ingredientes
      ? nuevoArticulo.ingredientes.split(",").map((i) => i.trim())
      : [];

    // Estructura final del artículo
    const articuloData = {
      nombre: nuevoArticulo.nombre,
      ingredientes: ingredientesArray,
      adicional: {
        nombre: nuevoArticulo.adicional.nombre,
        tamaño: nuevoArticulo.adicional.tamaño,
        precio: precioAdicional,
      },
      tamaño: {
        nombre: nuevoArticulo.tamaño.nombre,
        precio: precioBase,
      },
      precioTotal: precioTotalCalc,
    };

    try {
      await addDoc(
        collection(db, "secciones", seccionSeleccionada.id, "articulos"),
        articuloData
      );
      // Limpiar el formulario
      setNuevoArticulo({
        nombre: "",
        ingredientes: "",
        adicional: { nombre: "", tamaño: "", precio: 0 },
        tamaño: { nombre: "", precio: 0 },
        precioTotal: 0,
      });
    } catch (error) {
      console.error("Error al crear artículo:", error);
    }
  };

  // ----------------- ELIMINAR UN ARTÍCULO (OPCIONAL) -----------------
  const deleteArticulo = async (articuloId) => {
    if (!articuloId || !seccionSeleccionada) return;
    try {
      await deleteDoc(
        doc(db, "secciones", seccionSeleccionada.id, "articulos", articuloId)
      );
    } catch (error) {
      console.error("Error al eliminar artículo:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Panel de Administración</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      {/* CREAR SECCIÓN */}
      <div className="mb-4">
        <h2>Crear Sección</h2>
        <input
          value={nuevaSeccion}
          onChange={(e) => setNuevaSeccion(e.target.value)}
          placeholder="Ej: Entradas, Bebidas, Postres..."
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={createSeccion}>
          Agregar Sección
        </button>
      </div>
      <hr />

      <div className="row">
        {/* LISTADO DE SECCIONES */}
        <div className="col-4">
          <h3>Secciones</h3>
          <ul className="list-group">
            {secciones.map((sec) => (
              <li
                key={sec.id}
                className={`list-group-item ${
                  seccionSeleccionada?.id === sec.id ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSeccionSeleccionada(sec)}
              >
                {sec.nombre}
              </li>
            ))}
          </ul>
        </div>

        {/* ARTÍCULOS DE LA SECCIÓN SELECCIONADA */}
        <div className="col-8">
          {seccionSeleccionada ? (
            <>
              <h3>Artículos de la sección: {seccionSeleccionada.nombre}</h3>

              {/* FORMULARIO PARA CREAR ARTÍCULO */}
              <div className="mt-3">
                <h4>Crear Artículo</h4>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del artículo"
                  value={nuevoArticulo.nombre}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <textarea
                  name="ingredientes"
                  placeholder="Ingredientes separados por coma"
                  value={nuevoArticulo.ingredientes}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <h5>Adicional</h5>
                <input
                  type="text"
                  name="adicional.nombre"
                  placeholder="Nombre adicional"
                  value={nuevoArticulo.adicional.nombre}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="adicional.tamaño"
                  placeholder="Tamaño adicional"
                  value={nuevoArticulo.adicional.tamaño}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="number"
                  name="adicional.precio"
                  placeholder="Precio adicional"
                  value={nuevoArticulo.adicional.precio}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <h5>Tamaño Base</h5>
                <input
                  type="text"
                  name="tamaño.nombre"
                  placeholder="Nombre tamaño"
                  value={nuevoArticulo.tamaño.nombre}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <input
                  type="number"
                  name="tamaño.precio"
                  placeholder="Precio base"
                  value={nuevoArticulo.tamaño.precio}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                />
                <button className="btn btn-success" onClick={createArticulo}>
                  Agregar Artículo
                </button>
              </div>

              {/* LISTA DE ARTÍCULOS */}
              <h4 className="mt-4">Lista de Artículos</h4>
              <ul className="list-group">
                {articulos.map((art) => (
                  <li
                    key={art.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <div>
                      <strong>{art.nombre}</strong>
                      {Array.isArray(art.ingredientes) && art.ingredientes.length > 0 && (
                        <p>
                          <em>Ingredientes:</em> {art.ingredientes.join(", ")}
                        </p>
                      )}
                      {art.adicional && (
                        <>
                          <p>Adicional: {art.adicional.nombre}</p>
                          <p>Tamaño Adicional: {art.adicional.tamaño}</p>
                          <p>Precio Adicional: {art.adicional.precio}</p>
                        </>
                      )}
                      {art.tamaño && (
                        <>
                          <p>Tamaño Base: {art.tamaño.nombre}</p>
                          <p>Precio Base: {art.tamaño.precio}</p>
                        </>
                      )}
                      <p>
                        <strong>Precio Total: ${art.precioTotal}</strong>
                      </p>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteArticulo(art.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Selecciona una sección para ver y crear artículos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
