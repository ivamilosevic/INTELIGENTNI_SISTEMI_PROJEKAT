import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page4.css";

function Page4() {
  const [airport, setAirport] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [airportsList, setAirportsList] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch("http://localhost:5000/airports"); 
        const data = await res.json();
        setAirportsList(data.airports);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAirports();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSummary(null);

    try {
      const response = await fetch(`http://localhost:5000/airport/${encodeURIComponent(airport)}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Greška pri dohvatu podataka");
        return;
      }
      const data = await response.json();
      setSummary(data.summary); 
    } catch (err) {
      setError("Greška pri pozivu servera");
      console.error(err);
    }
  };

  return (
    <div className="page4-container">
      <h1 className="text-xl font-bold mb-4">Pretraga po aerodromu</h1>

      <form onSubmit={handleSubmit} className="weights-form">
        <div className="weight-row">
          <label>Aerodrom:</label>
          <select
            value={airport}
            onChange={(e) => setAirport(e.target.value)}
            required
          >
            <option value="">Izaberi aerodrom</option>
            {airportsList.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="calculate-btn">Prikaži kratak opis</button>
      </form>

      {error && <div className="result-box" style={{ color: "red" }}>{error}</div>}

      {summary && (
        <div className="result-box">
          <h2>Opis aviokompanije {airport}:</h2>
          <p>{summary}</p>
        </div>
      )}

      <button
        className="calculate-btn back-btn"
        onClick={() => navigate("/")}
      >
        Povratak na početnu
      </button>
    </div>
  );
}

export default Page4;
