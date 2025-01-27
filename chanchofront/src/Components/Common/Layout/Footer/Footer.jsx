import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../../../../Styles/Footer.css';

const Footer = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mt-auto py-3">
      <Container>
        <Navbar.Brand href="#">El Chancho Rengo</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="#about">Sobre Nosotros</Nav.Link>
          <Nav.Link href="#menu">Menú</Nav.Link>
          <Nav.Link href="#contact">Contacto</Nav.Link>
        </Nav>
      </Container>
      <Container className="text-center text-white mt-3">
        <small>
          © {new Date().getFullYear()} El Chancho Rengo. Todos los derechos reservados. <br /> by: Taller de Otto
        </small>
      </Container>
    </Navbar>
  );
};

export default Footer;
