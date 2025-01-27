import { useState, useEffect } from 'react';
import '../../../../Styles/Navbar.css';

const Navbar = () => {
    const [city, setCity] = useState('Cargando...');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        setCity(data.address.city || data.address.town || 'Ubicación desconocida');
                    } catch {
                        setCity('Error al obtener ubicación');
                    }
                },
                () => {
                    setCity('Ubicación no disponible. Permita el acceso a su ubicación');
                }
            );
        } else {
            setCity('Geolocalización no soportada');
        }
    }, []);

    return (
        <nav className="navbar">
            <img src="/logo.png" alt="Logo El Chancho Rengo" className="navbar-logo" />
            <div className="navbar-center">
                <h2 className="navbar-city">{city}</h2>
            </div>
            <h1 className="navbar-title">Café Bar</h1>
        </nav>
    );
};

export default Navbar;
