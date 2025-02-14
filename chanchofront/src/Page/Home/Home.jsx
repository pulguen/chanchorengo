import Menu from '../../Components/Menu/Menu';
import Mapbar from '../../Components/Mapbar/Mapbar';

const Home = () => {
  return (
    <>
      <header className="text-center my-4">
        <h2>Un espacio para compartir, reír y disfrutar 🎉✨</h2>
        <Menu />
      </header>
      <main className="text-center">
        <Mapbar/>
      </main>
    </>
  );
};

export default Home;