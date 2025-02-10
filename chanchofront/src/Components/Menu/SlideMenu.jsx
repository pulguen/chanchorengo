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
  return (
    <div className="slide-menu">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => {
          // Cuando cambia el slide (por swipe/autoplay), actualizamos la sección
          const currentIndex = swiper.activeIndex;
          const currentSection = sections[currentIndex];
          if (currentSection) {
            onSelectSection(currentSection);
          }
        }}
      >
        {sections.map((section) => (
          <SwiperSlide
            key={section.id}
            // Además, si quieres permitir clic manual:
            onClick={() => onSelectSection(section)}
          >
            <div className="menu-section text-center">
              <h2>{section.nombre}</h2>
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
