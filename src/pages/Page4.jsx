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
  Button
} from "@mui/material";

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
      const response = await fetch(
        `http://localhost:5000/airport/${encodeURIComponent(airport)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Greška pri dohvatu podataka");
        return;
      }

      setSummary(data.summary);
    } catch {
      setError("Greška pri pozivu servera");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, rgb(210,197,197) 0%, rgb(89,6,104) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 8
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "white"
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          mb={3}
        >
          Pretraga po aerodromu
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >          
          <FormControl fullWidth required>
            <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
              Aerodrom
            </InputLabel>
            <Select
              value={airport}
              label="Aerodrom"
              onChange={(e) => setAirport(e.target.value)}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.4)"
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white"
                },
                ".MuiSvgIcon-root": {
                  color: "white"
                }
              }}
            >
              {airportsList.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            sx={{
              mt: 2,
              py: 1.4,
              fontSize: "1rem",
              fontWeight: 600,
              color: "white",
              border: "1px solid white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            Prikaži kratak opis
          </Button>
        </Box>
        
        {error && (
          <Typography mt={3} color="error" align="center">
            {error}
          </Typography>
        )}
        
        {summary && (
          <Box
            mt={4}
            p={3}
            border="1px solid rgba(255,255,255,0.3)"
            borderRadius={2}
          >
            <Typography fontWeight="bold" mb={1}>
              Opis aerodroma {airport}
            </Typography>
            <Typography
              sx={{
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.9)"
              }}
            >
              {summary}
            </Typography>
          </Box>
        )}

        {/* POVRATAK */}
        <Button
          fullWidth
          sx={{
            mt: 4,
            color: "rgba(255,255,255,0.7)",
            textTransform: "none",
            "&:hover": { color: "white" }
          }}
          onClick={() => navigate("/")}
        >
          ← Povratak na početnu
        </Button>
      </Paper>
    </Box>
  );
}

export default Page4;
