// src/Context/MongoDataContext.jsx
/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

const MongoDataContext = createContext();

export const MongoDataProvider = ({ children }) => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/secciones');
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      const visibleSections = data.filter(sec => sec.visible !== false);
      setSecciones(visibleSections);
    } catch (error) {
      console.error('Error al obtener secciones:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchSecciones();
  }, []);

  return (
    <MongoDataContext.Provider value={{ secciones, fetchSecciones, loading }}>
      {children}
    </MongoDataContext.Provider>
  );
};

MongoDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useMongoData = () => useContext(MongoDataContext);
