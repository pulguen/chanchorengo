import { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import SlideMenu from "./SlideMenu";
import MenuContent from "./MenuContent";
import CategoryDrawer from "./CategoryDrawer";

const Menu = () => {
  // Secciones (solo las visibles)
  const [sections, setSections] = useState([]);
  // Sección seleccionada
  const [selectedSection, setSelectedSection] = useState(null);
  // Artículos de la sección seleccionada (solo los visibles)
  const [articles, setArticles] = useState([]);
  // Control para mostrar/ocultar el CategoryDrawer
  const [showDrawer, setShowDrawer] = useState(false);

  // 1. Cargar secciones (lectura única)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtramos solo secciones con visible !== false
        const visibleSections = data.filter((sec) => sec.visible !== false);

        setSections(visibleSections);
        // Si no hay sección seleccionada, escogemos la primera visible
        if (!selectedSection && visibleSections.length > 0) {
          setSelectedSection(visibleSections[0]);
        }
      } catch (err) {
        console.error("Error al obtener secciones:", err);
      }
    };

    fetchSections();
  }, [selectedSection]);

  // 2. Cargar artículos de la sección seleccionada (lectura única, filtrados por visible)
  useEffect(() => {
    if (!selectedSection) {
      setArticles([]);
      return;
    }
    const fetchArticles = async () => {
      try {
        const subRef = collection(db, "secciones", selectedSection.id, "articulos");
        const q = query(subRef, orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtramos artículos con visible !== false
        const visibleArticles = data.filter((art) => art.visible !== false);
        setArticles(visibleArticles);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchArticles();
  }, [selectedSection]);

  // Abre el CategoryDrawer (por ejemplo, en móviles)
  const openDrawer = () => {
    setShowDrawer(true);
  };

  // Cuando se selecciona una sección en el drawer, la asignamos y cerramos
  const handleSelectSectionFromDrawer = (sec) => {
    setSelectedSection(sec);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Slide con flechas, nombre centrado, etc. */}
      <SlideMenu
        sections={sections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        onOpenDrawer={openDrawer}
      />

      {/* Drawer de categorías (solo se ve si showDrawer === true) */}
      {showDrawer && (
        <CategoryDrawer
          sections={sections}
          onSelectSection={handleSelectSectionFromDrawer}
          onClose={() => setShowDrawer(false)}
        />
      )}

      {/* Lista de artículos de la sección seleccionada */}
      <MenuContent articles={articles} />
    </>
  );
};

export default Menu;
