import { FaClock, FaUtensils, FaPhoneAlt } from "react-icons/fa";
import "../../Styles/LocalInfo.css";

const LocalInfo = () => {
  return (
    <div className="local-info text-center my-4">
      <p>
        <FaClock className="icon" /> <strong>Horario de Atención:</strong> 08:00 - 24:00
      </p>
      <p>
        <FaUtensils className="icon" /> <strong>Horario de Cocina:</strong> 08:00 - 23:15
      </p>
      <p>
        <FaPhoneAlt className="icon" /> <strong>Pedidos:</strong> Por teléfono y take away <em>(sin delivery)</em>
      </p>
    </div>
  );
};

export default LocalInfo;
