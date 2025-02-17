import { FaPhone } from "react-icons/fa";
import "../../Styles/CallButton.css";

const CallButton = () => {
  // Coloca aquí el número de teléfono del bar
  const phoneNumber = "+542942430956"; 

  return (
    <a href={`tel:${phoneNumber}`} className="call-button">
      <FaPhone className="call-icon" />
      <span>¡Hacenos tu pedido y vení a retirarlo!</span>
    </a>
  );
};

export default CallButton;
