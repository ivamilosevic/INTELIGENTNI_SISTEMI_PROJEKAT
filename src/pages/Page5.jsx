import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Page5.css"; // novi CSS fajl

function Page5() {
  const [airline1, setAirline1] = useState("");
  const [airline2, setAirline2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [airlinesList, setAirlinesList] = useState([]);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const res = await fetch("http://localhost:5000/all-airlines");
        const data = await res.json();
        setAirlinesList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAirlines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (airline1 === airline2) {
      setError("Izaberite dve različite kompanije");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/compare-airlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airline1, airline2 }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Greška pri dohvatu podataka");
        return;
      }

      const data = await response.json();
      const [company1, company2] = data;

      // Aspekti za poređenje
      const aspects = ["seat_comfort", "cabin_staff", "food_beverages", "value_money"];

      // Mapiranje na srpske nazive
      const aspectNamesSR = {
        seat_comfort: "udobnosti sedišta",
        cabin_staff: "osoblju u kabini",
        food_beverages: "hrani i piću",
        value_money: "odnosu cene i kvaliteta"
      };

      // Kreiranje liste pobednika po aspektima
      const winnerMap = {};
      aspects.forEach((aspect) => {
        if (company1[aspect] > company2[aspect]) {
          if (!winnerMap[company1.airline_name]) winnerMap[company1.airline_name] = [];
          winnerMap[company1.airline_name].push(aspectNamesSR[aspect]);
        } else if (company2[aspect] > company1[aspect]) {
          if (!winnerMap[company2.airline_name]) winnerMap[company2.airline_name] = [];
          winnerMap[company2.airline_name].push(aspectNamesSR[aspect]);
        }
      });

      // Generisanje tekstualnih rečenica
      const aspectTextComparison = Object.entries(winnerMap).map(([airline, aspectsList]) => {
        if (aspectsList.length === aspects.length) {
          
          return `Aviokompanija ${airline} je bolja po ${aspectsList.join(", ")}.`;
        } else {
          
          return `Aviokompanija ${airline} je bolja po ${aspectsList.join(", ")}.`;
        }
      });



      // Ukupna prosečna ocena
      const total1 = aspects.reduce((acc, a) => acc + company1[a], 0) / aspects.length;
      const total2 = aspects.reduce((acc, a) => acc + company2[a], 0) / aspects.length;

      let overallText;
      if (total1 > total2) {
        overallText = `${company1.airline_name} je bolja po ukupnim ocenama.`;
      } else if (total2 > total1) {
        overallText = `${company2.airline_name} je bolja po ukupnim ocenama.`;
      } else {
        overallText = "Obe kompanije imaju iste ukupne ocene.";
      }


      setResult({ company1, company2, aspectTextComparison, overallText });

    } catch (err) {
      setError("Greška pri pozivu servera");
      console.error(err);
    }
  };

  return (
    <div className="page5-container">
      <h1 className="text-xl font-bold mb-4">Uporedi dve avio-kompanije</h1>

      <form onSubmit={handleSubmit} className="weights-form">
        <div className="weight-row">
          <label>Kompanija 1:</label>
          <select
            value={airline1}
            onChange={(e) => setAirline1(e.target.value)}
            required
          >
            <option value="">Izaberi kompaniju</option>
            {airlinesList.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="weight-row">
          <label>Kompanija 2:</label>
          <select
            value={airline2}
            onChange={(e) => setAirline2(e.target.value)}
            required
          >
            <option value="">Izaberi kompaniju</option>
            {airlinesList.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="calculate-btn">Uporedi</button>
      </form>

      {error && <div className="result-box" style={{ color: "red" }}>{error}</div>}

      {result && (
        <div className="result-box">
          <h2>Rezultati poređenja:</h2>

          <h3>{result.company1.airline_name}</h3>
          <ul>
            <li>Seat Comfort: {result.company1.seat_comfort}</li>
            <li>Cabin Staff: {result.company1.cabin_staff}</li>
            <li>Food & Beverages: {result.company1.food_beverages}</li>
            <li>Value for Money: {result.company1.value_money}</li>
          </ul>

          <h3>{result.company2.airline_name}</h3>
          <ul>
            <li>Seat Comfort: {result.company2.seat_comfort}</li>
            <li>Cabin Staff: {result.company2.cabin_staff}</li>
            <li>Food & Beverages: {result.company2.food_beverages}</li>
            <li>Value for Money: {result.company2.value_money}</li>
          </ul>

          <h3>Koja kompanija je bolja po aspektima:</h3>
          <ul>
            {result.aspectTextComparison.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>

          <h3>{result.overallText}</h3>
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

export default Page5;
