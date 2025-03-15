// src/Components/Menu/Menu.jsx
import { useState, useEffect } from "react";
import CategoryDrawer from "./CategoryDrawer";
import SlideMenu from "./SlideMenu";
import MenuContent from "./MenuContent";

const Menu = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [articles, setArticles] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

  // Cargar secciones desde la API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("/api/secciones");
        if (!res.ok) throw new Error("Error al obtener secciones");
        const data = await res.json();
        // Filtrar solo las secciones visibles (si la propiedad visible es false se oculta)
        const visibleSections = data.filter((sec) => sec.visible !== false);
        setSections(visibleSections);
        if (!selectedSection && visibleSections.length > 0) {
          setSelectedSection(visibleSections[0]);
        }
      } catch (error) {
        console.error("Error al obtener secciones:", error);
      }
    };

    fetchSections();
  }, [selectedSection]);

  // Cargar artículos de la sección seleccionada
  useEffect(() => {
    if (!selectedSection) {
      setArticles([]);
      return;
    }
    const fetchArticles = async () => {
      try {
        const res = await fetch(`/api/secciones/${selectedSection.id}/articulos`);
        if (!res.ok) throw new Error("Error al obtener artículos");
        const data = await res.json();
        // Filtrar solo los artículos visibles
        const visibleArticles = data.filter((art) => art.visible !== false);
        setArticles(visibleArticles);
      } catch (error) {
        console.error("Error al obtener artículos:", error);
      }
    };

    fetchArticles();
  }, [selectedSection]);

  const openDrawer = () => setShowDrawer(true);
  const handleSelectSectionFromDrawer = (section) => {
    setSelectedSection(section);
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
