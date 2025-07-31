import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalLayout from './Components/Common/Layout/GlobalLayout/GlobalLayout';
import Home from './Page/Home/Home';
import Login from './Page/Login/Login'; // Página de login
import Admin from './Page/Admin/Admin'; // Página de administrador
import ProtectedRoute from './Components/Common/ProtectedRoute/ProtectedRoute'; // Ruta protegida
import { MenuProvider } from "./Context/MenuProvider";


function App() {
  return (
    <Router>
      <MenuProvider>
        <GlobalLayout>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Página principal */}
            <Route path="/login" element={<Login />} /> {/* Página de login */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            /> {/* Ruta protegida */}
          </Routes>
        </GlobalLayout>
      </MenuProvider>
    </Router>
  );
}

export default App;
