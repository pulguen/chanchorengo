import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";
import "../../Styles/SlideMenu.css";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const SlideMenu = ({ sections, onSelectSection }) => {
  if (!sections || sections.length === 0) {
    return <p className="text-center">No hay secciones disponibles.</p>;
  }

  return (
    <div className="slide-menu">
      <Swiper
        key={sections.length} // Forzamos actualización cuando cambie la lista
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,      // Activa los bullets dinámicos
          dynamicMainBullets: 3,     // Define cuántos bullets principales se muestran
        }}
        loop={true}  // Habilita el loop
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 20000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => {
          const realIndex = swiper.realIndex;
          if (sections[realIndex]) {
            onSelectSection(sections[realIndex]);
          }
        }}
      >
        {sections.map((section) => (
          <SwiperSlide key={section.id} onClick={() => onSelectSection(section)}>
            <div className="menu-section text-center p-3">
              <h2 className="mb-2">{section.nombre}</h2>
              {section.description && <p>{section.description}</p>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

SlideMenu.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  onSelectSection: PropTypes.func.isRequired,
};

export default SlideMenu;
