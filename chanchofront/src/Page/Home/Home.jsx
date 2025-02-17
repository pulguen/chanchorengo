import Menu from '../../Components/Menu/Menu';
import Mapbar from '../../Components/Mapbar/Mapbar';
import CallButton from '../../Components/CallButton/CallButton';
import LocalInfo from '../../Components/LocalInfo/LocalInfo';
import '../../Styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        {/* Logo agregado */}
        <img src="/logohome.png" alt="Logo Home" className="home-logo" />
        <h2 className="home-title">Un espacio para compartir, reír y disfrutar 🎉✨</h2>
        <h3 className="home-title"><strong>NUESTRO MENÚ:</strong></h3>
        <Menu />
      </header>
      <main className="home-main">
        <LocalInfo />
        <h3 className="home-title">Llámanos al 2942-430956</h3>
        <p>Comunícate con nosotros haciendo clic en el siguiente botón</p>
        <CallButton />
        <h3 className="home-title">¿DÓNDE ESTAMOS?</h3>
        <Mapbar />
      </main>
    </div>
  );
};

export default Home;
