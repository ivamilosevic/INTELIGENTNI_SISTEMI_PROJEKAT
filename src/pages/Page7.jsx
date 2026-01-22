import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from "@mui/material";

export default function Page7() {
  const [airline, setAirline] = useState("");
  const [review, setReview] = useState("");
  const [airlinesList, setAirlinesList] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // fetch liste aviokompanija
  useEffect(() => {
    fetch("http://localhost:5000/all-airlines")
      .then(res => res.json())
      .then(setAirlinesList)
      .catch(() => setAirlinesList([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:5000/add-lounge-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airline_name: airline, content: review }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Došlo je do greške pri slanju recenzije" });
    } finally {
      setLoading(false);
    }
  };

    const aspectNamesEN = {
    cleanliness: "Čistoća",
    bar_beverages: "Pića u baru",
    catering: "Hrana",
    washrooms: "Kupatila",
    wifi_connectivity: "Wifi konekcija",
    staff_service: "Usluga osoblja"
   };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #d2c5c5, #590668)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        px: 2,
        fontFamily: "'Inter', 'Poppins', sans-serif"
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 5,
          borderRadius: 4,
          backgroundColor: "#1a1a1a",
          color: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)"
        }}
      >
        <Typography variant="h4" fontWeight={700} align="center" mb={4}>
          Dodaj recenziju salona na aerodromu
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* --- Dropdown aviokompanije --- */}
          <FormControl fullWidth required>
            <InputLabel sx={{ color: "rgba(255,255,255,0.6)" }}>Aviokompanija</InputLabel>
            <Select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              sx={{
                color: "#fff",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
                ".MuiSvgIcon-root": { color: "#fff" }
              }}
              required
            >
              <MenuItem value="">
                <em>-- Izaberi aviokompaniju --</em>
              </MenuItem>
              {airlinesList.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* --- Tekst recenzije --- */}
          <TextField
            label="Recenzija"
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            variant="outlined"
            fullWidth
           InputLabelProps={{
                sx: {
                color: "#fff",              // label bela
                "&.Mui-focused": { color: "#fff" } // label ostaje bela kada je fokus
                }
            }}
            InputProps={{
                sx: {
                color: "#fff",                 // tekst koji korisnik upisuje
                backgroundColor: "#1a1a1a",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" }
                }
            }}
            required
          />

          <Button
            type="submit"
            sx={{
              py: 1.4,
              fontWeight: 600,
              border: "2px solid white",
              color: "white",
              borderRadius: 2,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
            }}
            disabled={loading}
          >
            {loading ? "Slanje..." : "Dodaj recenziju"}
          </Button>
        </Box>

        {response && response.scores && (
        <Box mt={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ color: "#ffffff" }}>
              Recenzija uspešno unešena!
            </Typography>
            <Typography variant="body1" mb={2} sx={{ color: "#ffffff" }}>
              Nove prosečne ocene ove aviokompanije su:
            </Typography>
            {Object.entries(response.scores).map(([aspect, value]) => (
              <Box
                key={aspect}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1
                }}
              >
                <Typography variant="body2" sx={{ color: "#ffffff" }}>
                  {aspectNamesEN[aspect]}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: "#ffffff" }}>
                  {Number(value).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
        )}



        <Button
          fullWidth
          sx={{ mt: 4, color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}
          onClick={() => navigate("/")}
        >
          ← Povratak na početnu
        </Button>
      </Paper>
    </Box>
  );
}
