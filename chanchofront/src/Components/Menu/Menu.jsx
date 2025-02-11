import { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  collection as subCollection,
  onSnapshot as onSnapshotSub,
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

  // 1. Leer TODAS las secciones con orden establecido
  useEffect(() => {
    const q = query(collection(db, "secciones"), orderBy("orden", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      console.log("📌 Secciones cargadas en Home:", data); // Verifica si está trayendo datos
      setSections(data);
    });

    return () => unsubscribe();
  }, []);

  // 2. Cargar artículos cuando cambia la sección seleccionada
  useEffect(() => {
    if (!selectedSection) {
      setArticles([]);
      return;
    }

    const subRef = subCollection(db, "secciones", selectedSection.id, "articulos");
    const unsubscribe = onSnapshotSub(subRef, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setArticles(data);
    });

    return () => unsubscribe();
  }, [selectedSection]);

  return (
    <>
      {/* SlideMenu recibe las secciones ordenadas y avisa cuál se seleccionó */}
      <SlideMenu sections={sections} onSelectSection={setSelectedSection} />

      {/* MenuContent muestra los artículos de la sección seleccionada */}
      <MenuContent articles={articles} />
    </>
  );
};

export default Menu;
