
const MapBar = () => {
  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>        
        <p className='parrafo'>
          Av. San Martín y Etcheluz - (8340) Zapala
          Neuquén, Patagonia Argentina.
        </p>
      <iframe
        title="Ubicación del Bar"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d776.2120977481683!2d-70.06476093037043!3d-38.90458215459428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960d9fef8c2ab66b%3A0xedd69530138d5b64!2sMart%C3%ADn%20Etcheluz%20490%2C%20Q8340%20Zapala%2C%20Neuqu%C3%A9n!5e0!3m2!1ses!2sar!4v1739583122210!5m2!1ses!2sar"        width="100%"
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