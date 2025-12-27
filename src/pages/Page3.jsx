import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page3.css";

function Page3() {
  const [airline, setAirline] = useState("");
  const [cabin, setCabin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  //liste za dropdown opcije
  const [airlinesList, setAirlinesList] = useState([]);
  const [cabinsList, setCabinsList] = useState([]);

  // akcije prilikom učitavanja stranice
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const resAirlines = await fetch("http://localhost:5000/all-airlines");
        const dataAirlines = await resAirlines.json();
        setAirlinesList(dataAirlines);

        const resCabins = await fetch("http://localhost:5000/all-cabins");
        const dataCabins = await resCabins.json();
        setCabinsList(dataCabins);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/airline-cabin-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airline_name: airline, cabin_flown: cabin })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Greška prilikom dohvata");
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Greška prilikom poziva servera");
      console.error(err);
    }
  };

  return (
  <div className="page3-container">
    <h1 className="text-xl font-bold mb-4">Pretraga po tipu sedišta</h1>

    <form onSubmit={handleSubmit} className="weights-form">

      <div className="weight-row">
        <label>Avio-kompanija:</label>
        <select
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          required
        >
          <option value="">Izaberi avio-kompaniju</option>
          {airlinesList.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="weight-row">
        <label>Tip kabine:</label>
        <select
          value={cabin}
          onChange={(e) => setCabin(e.target.value)}
          required
        >
          <option value="">Izaberi tip kabine</option>
          {cabinsList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="calculate-btn">
        Pretraži
      </button>
    </form>

    {error && (
      <div className="result-box" style={{ color: "red" }}>
        {error}
      </div>
    )}

    {result && (
      <div className="result-box">
        <h2>Rezultati</h2>

        <p><strong>Ukupna ocena:</strong> {result.overall_score}</p>
        <p><strong>Ukupni sentiment:</strong> {result.overall_sentiment}</p>
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
export default Page3;