import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FaPhoneAlt, FaInfoCircle, FaUtensils } from 'react-icons/fa';
import '../../../../Styles/Footer.css';

const Footer = () => {
  const phoneNumber = "+542942430956"; // Número de teléfono

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mt-auto py-3 footer-navbar">
      <Container className="footer-top">
        <div className="footer-logo-container">
          <Navbar.Brand href="#">
            <img src="/logofooter.png" alt="Logo Footer" className="footer-logo" />
          </Navbar.Brand>
        </div>
        <div className="footer-nav-container">
          <Nav className="footer-nav">
            <Nav.Link href="#about">
              <FaInfoCircle className="footer-icon" /> Sobre Nosotros
            </Nav.Link>
            <Nav.Link href="#menu">
              <FaUtensils className="footer-icon" /> Menú
            </Nav.Link>
            <Nav.Link href={`tel:${phoneNumber}`} className="footer-phone">
              <FaPhoneAlt className="footer-phone-icon" /> Contacto
            </Nav.Link>
          </Nav>
        </div>
      </Container>
      <Container className="footer-bottom text-center text-white">
        <small>
          © {new Date().getFullYear()} El Chancho Rengo. Todos los derechos reservados.
          <br /> by: Taller de Otto
        </small>
      </Container>
    </Navbar>
  );
};

export default Footer;
