import { useState, useEffect, useRef } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import SlideMenu from "./SlideMenu";
import MenuContent from "./MenuContent";
import CategoryDrawer from "./CategoryDrawer";

const Menu = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [articles, setArticles] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

  // *** Nuevo: cache en memoria (referencia mutable) ***
  const articlesCache = useRef({}); // { [sectionId]: [artículos] }

  // 1. Cargar secciones solo una vez al montar
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const visibleSections = data.filter((sec) => sec.visible !== false);
        setSections(visibleSections);
        // Si no hay sección seleccionada, escoger la primera visible
        if (!selectedSection && visibleSections.length > 0) {
          setSelectedSection(visibleSections[0]);
        }
      } catch (err) {
        console.error("Error al obtener secciones:", err);
      }
    };
    fetchSections();
    // eslint-disable-next-line
  }, []);

  // 2. Cargar artículos de la sección seleccionada, pero solo si no están en cache
  useEffect(() => {
    if (!selectedSection) {
      setArticles([]);
      return;
    }

    // Si ya están en cache, úsalos
    if (articlesCache.current[selectedSection.id]) {
      setArticles(articlesCache.current[selectedSection.id]);
      return;
    }

    // Si NO están en cache, consulta y guarda
    const fetchArticles = async () => {
      try {
        const subRef = collection(db, "secciones", selectedSection.id, "articulos");
        const q = query(subRef, orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const visibleArticles = data.filter((art) => art.visible !== false);
        articlesCache.current[selectedSection.id] = visibleArticles; // Guardar en cache
        setArticles(visibleArticles);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchArticles();
  }, [selectedSection]);

  // Drawer para categorías
  const openDrawer = () => setShowDrawer(true);
  const handleSelectSectionFromDrawer = (sec) => {
    setSelectedSection(sec);
    setShowDrawer(false);
  };

  return (
    <>
      <SlideMenu
        sections={sections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        onOpenDrawer={openDrawer}
      />
      {showDrawer && (
        <CategoryDrawer
          sections={sections}
          onSelectSection={handleSelectSectionFromDrawer}
          onClose={() => setShowDrawer(false)}
        />
      )}
      <MenuContent articles={articles} />
    </>
  );
};

export default Menu;
