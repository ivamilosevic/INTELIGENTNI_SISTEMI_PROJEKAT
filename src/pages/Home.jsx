import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', // ⬅ ovo stavlja elemente jedan ispod drugog
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      gap: '20px'
    }}>
      <button onClick={() => navigate("/page1")}>Želim da vidim koje su najbolje aviokompanije i koji su aspekti putnicima najznačajniji</button>
      <button onClick={() => navigate("/page2")}>Želim da na osnovu definisanih prioriteta aspekta izaberem odgovarajuću avikompaniju</button>
      <button onClick={() => navigate("/page3")}>Želim da vidim prosečne ocene na osnovu definisane avikompanije i tipa sedišta</button>
      <button onClick={() => navigate("/page4")}>Želim da vidim kratak opis izabranog aerodroma</button>
      <button onClick={() => navigate("/page5")}>Želim da uporedim aspekte dve odabrane aviokompanije</button>
    </div>
  );
}

export default Home;
