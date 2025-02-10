import { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  onSnapshot,
  collection as subCollection,
  onSnapshot as onSnapshotSub,
} from "firebase/firestore";

import SlideMenu from "./SlideMenu";
import MenuContent from "./MenuContent";

const Menu = () => {
  // Estado para guardar TODAS las secciones
  const [sections, setSections] = useState([]);

  // Sección actualmente seleccionada
  const [selectedSection, setSelectedSection] = useState(null);

  // Artículos de la sección seleccionada
  const [articles, setArticles] = useState([]);

  // 1. Leer TODAS las secciones al montar el componente
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "secciones"), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSections(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. Cada vez que 'selectedSection' cambie, leer artículos de su subcolección
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
      {/* SlideMenu recibe las secciones y avisa cuál se seleccionó */}
      <SlideMenu sections={sections} onSelectSection={setSelectedSection} />

      {/* MenuContent muestra los artículos de la sección seleccionada */}
      <MenuContent articles={articles} />
    </>
  );
};

export default Menu;
