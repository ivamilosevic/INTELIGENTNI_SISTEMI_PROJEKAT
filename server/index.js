const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL konekcija
const pool = new Pool({
  user: "postgres",          
  host: "localhost",
  database: "airline_recommendations_db",
  password: "postgres",      
  port: 5432,
});

//--------------------------------------PRVA STRANICA-----------------------------------------------------------

//upit za prikaz prvih 5 aviokompanija sa najboljim rating-om
app.get("/airline-overall-score", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM airline_ratings_simple ORDER BY overall_rating DESC LIMIT 5;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu airline ocena" });
  }
});

//upit za prikaz prvih 5 aviokompanija sa najboljim rating-om za karatkeristike lounge-a
app.get("/lounge-overall-score", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lounge_ratings_simple ORDER BY overall_rating DESC LIMIT 5;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu lounge ocena" });
  }
});

//upit za prikaz prvih 5 aviokompanija sa najboljim rating-om za karatkeristike sedišta
app.get("/seat-overall-score", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seat_ratings_simple ORDER BY overall_rating DESC LIMIT 5;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu seat ocena" });
  }
});

// index.js (Express server)

app.get("/aspect-description/:dataset", async (req, res) => {
  const dataset = req.params.dataset; // 'airline', 'lounge' ili 'seat'

  // Mapa dataset naziva na odgovarajuće ime u bazi
  const datasetMap = {
    airline: "airline",
    lounge: "lounge",
    seat: "seat"
  };

  const tableName = datasetMap[dataset];
  if (!tableName) {
    return res.status(400).json({ error: "Nepoznat dataset" });
  }

  try {
    const query = `
      SELECT description 
      FROM aspect_importance_airline
      WHERE dataset = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [tableName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Opis nije pronađen" });
    }

    res.json({ description: result.rows[0].description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu opisa" });
  }
});


//--------------------------------------DRUGA STRANICA-----------------------------------------------------------

//upit koji sabira ocene različitih aspekata sedišta za svaku aviokompaniju i vraća onu sa najvećim ukupnim skorom
app.post("/best-airline-seat-by-preference", async (req, res) => {
  const { seat_legroom, seat_recline, seat_width, aisle_space, viewing_tv } = req.body;

  try {
    const query = `
      SELECT
        airline_name,
        (
          seat_legroom * $1 +
          seat_recline * $2 +
          seat_width   * $3 +
          aisle_space  * $4 +
          viewing_tv   * $5
        ) AS total_score
      FROM seat_sentiment_summary
      ORDER BY total_score DESC
      LIMIT 1;
    `;
    const values = [seat_legroom, seat_recline, seat_width, aisle_space, viewing_tv];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška u upitu" });
  }
});

//upit koji sabira ocene različitih aspekata lounge-a za svaku aviokompaniju i vraća onu sa najvećim ukupnim skorom
app.post("/best-airline-lounge-by-preference", async (req, res) => {
  const { comfort, cleanliness, bar_beverages, catering, washrooms, wifi_connectivity, staff_service } = req.body;

  try {
    const query = `
      SELECT
        airline_name,
        (
          comfort          * $1 +
          cleanliness      * $2 +
          bar_beverages    * $3 +
          catering         * $4 +
          washrooms        * $5 +
          wifi_connectivity * $6 +
          staff_service    * $7
        ) AS total_score
      FROM lounge_sentiment_summary
      ORDER BY total_score DESC
      LIMIT 1;
    `;
    const values = [comfort, cleanliness, bar_beverages, catering, washrooms, wifi_connectivity, staff_service];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška u upitu" });
  }
});

//upit koji sabira ocene različitih aspekata za svaku aviokompaniju iz glavnog dataset-a i vraća onu sa najvećim ukupnim skorom
app.post("/best-airline-main-by-preference", async (req, res) => {
  const { seat_comfort, cabin_staff, food_beverages, value_money } = req.body;

  try {
    const query = `
      SELECT
        airline_name,
        (
          seat_comfort * $1 +
          cabin_staff  * $2 +
          food_beverages * $3 +
          value_money  * $4
        ) AS total_score
      FROM airline_sentiment_summary
      ORDER BY total_score DESC
      LIMIT 1;
    `;
    const values = [seat_comfort, cabin_staff, food_beverages, value_money];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška u upitu" });
  }
});

//--------------------------------------TREĆA STRANICA-----------------------------------------------------------

//upit koji vraća sumarnu ocenu sentimenta na osnovu definisane aviokompanije i njenog tipa sedišta
app.post("/airline-cabin-score", async (req, res) => {
  const { airline_name, cabin_flown } = req.body;

  try {
    const query = `
      SELECT overall_score,
        overall_sentiment
      FROM airline_cabin_sentiment_summary
      WHERE airline_name = $1
        AND cabin_flown = $2
      LIMIT 1;
    `;
    const values = [airline_name, cabin_flown];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Nema podataka za ovu kombinaciju" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška u upitu" });
  }
});

//upit koji vraća sve jedinstvene nazive aviokompanija
app.get("/all-airlines", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT airline_name FROM airline_cabin_sentiment_summary ORDER BY airline_name;");
    const airlines = result.rows.map(r => r.airline_name);
    res.json(airlines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu avio-kompanija" });
  }
});

//upit koji vraća sve jedinstvene tipove sedišta koji se nude
app.get("/all-cabins", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT cabin_flown FROM airline_cabin_sentiment_summary ORDER BY cabin_flown;");
    const cabins = result.rows.map(r => r.cabin_flown);
    res.json(cabins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatu kabina" });
  }
});

//--------------------------------------ČETVRTA STRANICA-----------------------------------------------------------

// ruta koja vraća sve nazive aerodroma
app.get('/airports', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT airport_name FROM airport_sentiment_summary_serbian');
        const airports = result.rows.map(row => row.airport_name);
        res.json({ airports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Greška pri dohvaćanju aerodroma' });
    }
});

// ruta koja vraća sumarni tekst za dati aerodrom
app.get('/airport/:name', async (req, res) => {
    const airportName = req.params.name;
    try {
        const result = await pool.query(
            'SELECT summary_sentence FROM airport_sentiment_summary_serbian WHERE airport_name = $1',
            [airportName]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aerodrom nije pronađen' });
        }
        res.json({ airport: airportName, summary: result.rows[0].summary_sentence });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Greška pri dohvaćanju sumarnog teksta' });
    }
});


//--------------------------------------PETA STRANICA-----------------------------------------------------------

//app.get("/all-airlines2", async (req, res) => {
//  try {
//    const result = await pool.query("SELECT DISTINCT airline_name FROM airline_ratings_simple  ORDER BY airline_name;");
//    const airlines = result.rows.map(r => r.airline_name);
//    res.json(airlines);
//  } catch (err) {
//    console.error(err);
//    res.status(500).json({ error: "Greška pri dohvatu avio-kompanija" });
//  }
//});

// upit koji vraća podatke o izabranoj aviokompaniji
app.post("/compare-airlines", async (req, res) => {
  const { airline1, airline2 } = req.body;

  try {
    const query = `
      SELECT airline_name, seat_comfort, cabin_staff, food_beverages, value_money
      FROM airline_sentiment_summary
      WHERE airline_name = ANY($1)
    `;
    const values = [[airline1, airline2]];
    const result = await pool.query(query, values);

    if (result.rows.length < 2) {
      return res.status(404).json({ error: "Jedna ili obe kompanije nisu pronađene" });
    }

    res.json(result.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška u upitu" });
  }
});


app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});
