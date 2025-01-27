import PropTypes from 'prop-types';
import NavBar from '../Nav/Navbar';
import Footer from '../Footer/Footer';

const GlobalLayout = ({ children }) => {
  return (
    <>
      {/* Siempre muestra el NavBar */}
      <NavBar />
      
      {/* Aquí va el contenido dinámico (páginas) */}
      <div className="content">{children}</div>

      {/* Siempre muestra el Footer */}
      <Footer />
    </>
  );
};

GlobalLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalLayout;
