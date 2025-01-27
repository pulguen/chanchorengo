import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import '../../Styles/SlideMenu.css';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SlideMenu = () => {
    const menuSections = [
        { id: 1, title: 'Caferería', description: 'Variedad de cafés' },
        { id: 2, title: 'Tés', description: 'Variedad de tés' },
        { id: 3, title: 'Pasteles', description: 'Deliciosos pasteles' },
        { id: 4, title: 'Sandwiches', description: 'Sandwiches frescos' },
    ];

    return (
        <div className="slide-menu">
            <Swiper
                modules={[Navigation, Pagination]} // Agregar módulos necesarios
                navigation                     // Habilitar navegación (flechas)
                pagination={{ clickable: true }} // Habilitar paginación (puntos clicables)
                spaceBetween={50}               // Espacio entre slides
                slidesPerView={1}               // Número de slides visibles
            >
                {menuSections.map((section) => (
                    <SwiperSlide key={section.id}>
                        <div className="menu-section text-center">
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SlideMenu;
