import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";
import "../../Styles/SlideMenu.css";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const SlideMenu = ({ sections, selectedSection, onSelectSection, onOpenDrawer }) => {
  const swiperRef = useRef(null);

  // Reposicionar el slider al índice de la sección seleccionada
  useEffect(() => {
    if (selectedSection && swiperRef.current) {
      const index = sections.findIndex((sec) => sec.id === selectedSection.id);
      if (index >= 0) {
        // Usamos slideToLoop para mover el slider al índice correspondiente
        swiperRef.current.slideToLoop(index);
      }
    }
  }, [selectedSection, sections]);

  if (!sections || sections.length === 0) {
    return <p className="text-center">No hay secciones disponibles.</p>;
  }

  return (
    <div className="slide-menu">
      <Swiper
        key={sections.length}
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 20000,
          disableOnInteraction: false,
        }}
        // Guardamos la instancia del swiper en un ref para reposicionar
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const realIndex = swiper.realIndex;
          if (sections[realIndex]) {
            // Actualizamos la sección seleccionada al cambiar de slide
            onSelectSection(sections[realIndex]);
          }
        }}
      >
        {sections.map((section) => (
          <SwiperSlide key={section.id}>
            <div className="menu-section text-center p-3">
              {/* Nombre de la sección en grande, clickable para abrir el Drawer */}
              <h2
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDrawer();
                }}
              >
                {section.nombre}
              </h2>
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
  selectedSection: PropTypes.object,
  onSelectSection: PropTypes.func.isRequired,
  onOpenDrawer: PropTypes.func.isRequired,
};

export default SlideMenu;
