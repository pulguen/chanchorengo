import { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import SlideMenu from "./SlideMenu";
import MenuContent from "./MenuContent";

const Menu = () => {
  // Estado para guardar TODAS las secciones ordenadas
  const [sections, setSections] = useState([]);

  // Sección actualmente seleccionada
  const [selectedSection, setSelectedSection] = useState(null);

  // Artículos de la sección seleccionada
  const [articles, setArticles] = useState([]);

  // 1. Leer TODAS las secciones (lectura única)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        console.log("📌 Secciones cargadas en Home:", data);
        setSections(data);
      } catch (err) {
        console.error("Error al obtener secciones:", err);
      }
    };

    fetchSections();
  }, []);

  // 2. Leer los artículos de la sección seleccionada (lectura única)
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
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setArticles(data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchArticles();
  }, [selectedSection]);

  return (
    <>
      {/* SlideMenu recibe las secciones ordenadas y notifica la selección */}
      <SlideMenu sections={sections} onSelectSection={setSelectedSection} />

      {/* MenuContent muestra los artículos de la sección seleccionada */}
      <MenuContent articles={articles} />
    </>
  );
};

export default Menu;
