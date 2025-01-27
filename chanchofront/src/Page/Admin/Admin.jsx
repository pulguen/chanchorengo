import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

const Admin = () => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="container mt-5">
      <h1>Panel de Administración</h1>
      <button className="btn btn-danger" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      {/* Aquí puedes agregar el editor del menú */}
    </div>
  );
};

export default Admin;
