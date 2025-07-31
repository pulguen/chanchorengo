import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { MenuContext } from "./MenuContext";

export function MenuProvider({ children }) {
  const [sections, setSections] = useState([]);
  const [articlesBySection, setArticlesBySection] = useState({}); // { [sectionId]: [articulos] }
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState({}); // { [sectionId]: boolean }

  // Cargar SOLO las secciones al montar
  useEffect(() => {
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const visibleSections = data.filter((sec) => sec.visible !== false);
        setSections(visibleSections);
      } catch (err) {
        console.error("Error al obtener secciones:", err);
      }
      setLoadingSections(false);
    };
    fetchSections();
  }, []);

  // Función para cargar artículos de una sección (solo si no están cacheados)
  const loadArticlesForSection = async (sectionId) => {
    if (!sectionId || articlesBySection[sectionId]) return; // Ya cargados
    setLoadingArticles((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const subRef = collection(db, "secciones", sectionId, "articulos");
      const q = query(subRef, orderBy("orden", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const visibleArticles = data.filter((art) => art.visible !== false);
      setArticlesBySection((prev) => ({ ...prev, [sectionId]: visibleArticles }));
    } catch (err) {
      console.error("Error al obtener artículos de la sección:", err);
    }
    setLoadingArticles((prev) => ({ ...prev, [sectionId]: false }));
  };

  return (
    <MenuContext.Provider
      value={{
        sections,
        loadingSections,
        articlesBySection,
        loadingArticles,
        loadArticlesForSection,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

MenuProvider.propTypes = {
  children: PropTypes.node,
};
