import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Page2.css";


const seatLabels = {
  seat_legroom: "Prostor za noge",
  seat_recline: "Nagib sedišta",
  seat_width: "Širina sedišta",
  aisle_space: "Prostor do prolaza",
  viewing_tv: "Ekran i zabava"
};

const loungeLabels = {
  comfort: "Komfor",
  cleanliness: "Čistoća",
  bar_beverages: "Bar i pića",
  catering: "Ketering",
  washrooms: "Toaleti",
  wifi_connectivity: "Wi-Fi konekcija",
  staff_service: "Usluga osoblja"
};

const airlineLabels = {
  seat_comfort: "Komfor sedišta",
  cabin_staff: "Osoblje u kabini",
  food_beverages: "Hrana i piće",
  value_money: "Odnos cene i kvaliteta"
};

function Page2() {
  const navigate = useNavigate();

  const [seatWeights, setSeatWeights] = useState({
    seat_legroom: 0.3,
    seat_recline: 0.2,
    seat_width: 0.2,
    aisle_space: 0.2,
    viewing_tv: 0.1
  });

  const [loungeWeights, setLoungeWeights] = useState({
    comfort: 0.2,
    cleanliness: 0.2,
    bar_beverages: 0.1,
    catering: 0.2,
    washrooms: 0.1,
    wifi_connectivity: 0.1,
    staff_service: 0.1
  });

  const [airlineWeights, setAirlineWeights] = useState({
    seat_comfort: 0.3,
    cabin_staff: 0.3,
    food_beverages: 0.2,
    value_money: 0.2
  });

  const [seatResult, setSeatResult] = useState(null);
  const [loungeResult, setLoungeResult] = useState(null);
  const [airlineResult, setAirlineResult] = useState(null);

  const handleSeatChange = (e) =>
    setSeatWeights({ ...seatWeights, [e.target.name]: Number(e.target.value) });

  const handleLoungeChange = (e) =>
    setLoungeWeights({ ...loungeWeights, [e.target.name]: Number(e.target.value) });

  const handleAirlineChange = (e) =>
    setAirlineWeights({ ...airlineWeights, [e.target.name]: Number(e.target.value) });

 
  const handleSeatSubmit = async () => {
    const res = await fetch("http://localhost:5000/best-airline-seat-by-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(seatWeights)
    });
    setSeatResult(await res.json());
  };

  const handleLoungeSubmit = async () => {
    const res = await fetch("http://localhost:5000/best-airline-lounge-by-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loungeWeights)
    });
    setLoungeResult(await res.json());
  };

  const handleAirlineSubmit = async () => {
    const res = await fetch("http://localhost:5000/best-airline-main-by-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(airlineWeights)
    });
    setAirlineResult(await res.json());
  };

 
  return (
    <div className="page2-container">
      <h2>Unos težina prema ličnim preferencama</h2>

      {/* deo za unos težina aspekata vezanih za sedište */}
      <h3>Sedišta – važnost aspekata</h3>
      <div className="weights-form">
        {Object.keys(seatWeights).map((key) => (
          <div className="weight-row" key={key}>
            <label>{seatLabels[key]}</label>
            <input
              type="number"
              step="0.1"
              name={key}
              value={seatWeights[key]}
              onChange={handleSeatChange}
            />
          </div>
        ))}
      </div>
      <button className="calculate-btn" onClick={handleSeatSubmit}>
        Izračunaj
      </button>

      {seatResult && (
        <div className="result-box">
          <h3>Sedišta – najbolja aviokompanija</h3>
          <p><b>{seatResult.airline_name}</b></p>
          <p>Ukupna ocena: {Number(seatResult.total_score).toFixed(2)}</p>
        </div>
      )}

      {/* deo za unos težina aspekata vezanih za lounge */}
      <h3>Saloni (Lounge) – važnost aspekata</h3>
      <div className="weights-form">
        {Object.keys(loungeWeights).map((key) => (
          <div className="weight-row" key={key}>
            <label>{loungeLabels[key]}</label>
            <input
              type="number"
              step="0.1"
              name={key}
              value={loungeWeights[key]}
              onChange={handleLoungeChange}
            />
          </div>
        ))}
      </div>
      <button className="calculate-btn" onClick={handleLoungeSubmit}>
        Izračunaj
      </button>

      {loungeResult && (
        <div className="result-box">
          <h3>Saloni (Lounge) – najbolja aviokompanija</h3>
          <p><b>{loungeResult.airline_name}</b></p>
          <p>Ukupna ocena: {Number(loungeResult.total_score).toFixed(2)}</p>
        </div>
      )}

      {/* deo za unos težina aspekata vezanih za generalno iskustvo*/}
      <h3> Važnost glavnih aspekata aviokompanija</h3>
      <div className="weights-form">
        {Object.keys(airlineWeights).map((key) => (
          <div className="weight-row" key={key}>
            <label>{airlineLabels[key]}</label>
            <input
              type="number"
              step="0.1"
              name={key}
              value={airlineWeights[key]}
              onChange={handleAirlineChange}
            />
          </div>
        ))}
      </div>

      <button className="calculate-btn" onClick={handleAirlineSubmit}>
        Izračunaj
      </button>

      {/*prikaz rezultata*/}
      {airlineResult && (
        <div className="result-box">
          <h3>Najbolja aviokompanija po glavnim aspektima</h3>
          <p><b>{airlineResult.airline_name}</b></p>
          <p>Ukupna ocena: {Number(airlineResult.total_score).toFixed(2)}</p>
        </div>
      )}

      {/* dugme za vraćanje na početnu stranu */}
      <button
        className="calculate-btn"
        style={{ marginTop: "1rem", backgroundColor: "#ccc", color: "#000" }}
        onClick={() => navigate("/")}
      >
        Povratak na početnu
      </button>
    </div>
  );
}

export default Page2;
