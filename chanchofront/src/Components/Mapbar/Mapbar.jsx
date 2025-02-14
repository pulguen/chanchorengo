
const MapBar = () => {
  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
        <h3 className='titulo'>¿Dónde estamos? vení a conocernos!.</h3>
        
        <p className='parrafo'>
                   Av San Martín y Etcheluz - Zapala
        </p>
      <iframe
        title="Ubicación del Bar"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13310.344421777654!2d-70.968!3d-38.906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689f9f9f9f9f9f9%3A0x123456789abcdef!2sEtcheluz%20490%2C%20Zapala%2C%20Neuqu%C3%A9n!5e0!3m2!1ses!2sar!4v1681789412345!5m2!1ses!2sar"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapBar;
