import './App.css';

function App() {
  return (
    <>
      <header className="text-center my-4">
        <img src="/logo.png" alt="Logo de El Chancho Rengo" style={{ width: '150px', height: '150px' }} />
        <h1 className="mt-3">El Chancho Rengo</h1>
        <p>Comienzo App-Página/Menu Online</p>
      </header>
      <main className="text-center">
        <p>¡Síguenos en nuestras redes sociales o contáctanos por WhatsApp!</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          {/* Botón de Facebook */}
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <i className="bi bi-facebook"></i> Facebook
          </a>
          {/* Botón de Instagram */}
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="btn btn-danger">
            <i className="bi bi-instagram"></i> Instagram
          </a>
          {/* Botón de WhatsApp */}
          <a href="https://wa.me/5492942662709" target="_blank" rel="noopener noreferrer" className="btn btn-success">
            <i className="bi bi-whatsapp"></i> WhatsApp
          </a>
        </div>
        <h3 className="mt-3">Remeras</h3>
        <img src="/remeras.png" alt="remeras" style={{ width: '600px',}} />

      </main>
    </>
  );
}

export default App;
