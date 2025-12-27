import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Page1.css";

function Page1() {
  const navigate = useNavigate();
  const [airlineRatings, setAirlineRatings] = useState([]);
  const [loungeRatings, setLoungeRatings] = useState([]);
  const [seatRatings, setSeatRatings] = useState([]);
  const [descriptions, setDescriptions] = useState({
    airline: "",
    lounge: "",
    seat: ""
  });

  useEffect(() => {
    // upiti za prikaz ocena
    fetch("http://localhost:5000/airline-overall-score")
      .then((res) => res.json())
      .then((data) => setAirlineRatings(data))
      .catch((err) => console.error("Airline error:", err));

    fetch("http://localhost:5000/lounge-overall-score")
      .then((res) => res.json())
      .then((data) => setLoungeRatings(data))
      .catch((err) => console.error("Lounge error:", err));

    fetch("http://localhost:5000/seat-overall-score")
      .then((res) => res.json())
      .then((data) => setSeatRatings(data))
      .catch((err) => console.error("Seat error:", err));

    // upiti za opis važnosti aspekata
    fetch("http://localhost:5000/aspect-description/airline")
      .then((res) => res.json())
      .then((data) => setDescriptions(prev => ({ ...prev, airline: data.description })))
      .catch((err) => console.error("Airline description error:", err));

    fetch("http://localhost:5000/aspect-description/lounge")
      .then((res) => res.json())
      .then((data) => setDescriptions(prev => ({ ...prev, lounge: data.description })))
      .catch((err) => console.error("Lounge description error:", err));

    fetch("http://localhost:5000/aspect-description/seat")
      .then((res) => res.json())
      .then((data) => setDescriptions(prev => ({ ...prev, seat: data.description })))
      .catch((err) => console.error("Seat description error:", err));

  }, []);

  return (
    <div className="page1-container">
      <h1>Najbolje Aviokompanije</h1>

      <div className="ratings-box">
        <h2>Ukupne ocene aviokompanija</h2>
        <p><em>{descriptions.airline}</em></p>
        <ul>
          {airlineRatings.map((item, idx) => (
            <li key={idx}>
              {item.airline_name} – Ocena: {Number(item.overall_rating).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="ratings-box">
        <h2>Ukupne ocene lounge usluge</h2>
        <p><em>{descriptions.lounge}</em></p>
        <ul>
          {loungeRatings.map((item, idx) => (
            <li key={idx}>
              {item.airline_name} – Ocena: {Number(item.overall_rating).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="ratings-box">
        <h2>Ukupne ocene kvaliteta sedišta</h2>
        <p><em>{descriptions.seat}</em></p>
        <ul>
          {seatRatings.map((item, idx) => (
            <li key={idx}>
              {item.airline_name} – Ocena: {Number(item.overall_rating).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        Povratak na početnu
      </button>
    </div>
  );
}

export default Page1;
