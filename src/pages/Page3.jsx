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

function Page3() {
  const [airline, setAirline] = useState("");
  const [cabin, setCabin] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [airlinesList, setAirlinesList] = useState([]);
  const [cabinsList, setCabinsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const resAirlines = await fetch("http://localhost:5000/all-airlines");
        setAirlinesList(await resAirlines.json());

        const resCabins = await fetch("http://localhost:5000/all-cabins");
        setCabinsList(await resCabins.json());
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
      const response = await fetch(
        "http://localhost:5000/airline-cabin-score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            airline_name: airline,
            cabin_flown: cabin
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Greška prilikom dohvata");
        return;
      }

      setResult(data);
    } catch {
      setError("Greška prilikom poziva servera");
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
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.75)",
          color: "white"
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} align="center">
          Pretraga po tipu sedišta
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* AVIO KOMPANIJA */}
          <FormControl fullWidth required>
            <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
              Avio-kompanija
            </InputLabel>
            <Select
              value={airline}
              label="Avio-kompanija"
              onChange={(e) => setAirline(e.target.value)}
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
              {airlinesList.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* TIP KABINE */}
          <FormControl fullWidth required>
            <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
              Tip kabine
            </InputLabel>
            <Select
              value={cabin}
              label="Tip kabine"
              onChange={(e) => setCabin(e.target.value)}
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
              {cabinsList.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* DUGME PRETRAZI */}
          <Button
            type="submit"
            sx={{
              mt: 2,
              py: 1.4,
              fontSize: "1rem",
              fontWeight: "bold",
              color: "white",
              border: "1px solid white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            Pretraži
          </Button>
        </Box>

        {/* ERROR */}
        {error && (
          <Typography mt={3} color="error" align="center">
            {error}
          </Typography>
        )}

        {/* REZULTAT */}
        {result && (
          <Box
            mt={4}
            p={3}
            border="1px solid rgba(255,255,255,0.3)"
            borderRadius={2}
          >
            <Typography fontWeight="bold" mb={1}>
              Rezultati
            </Typography>
            <Typography>
              <strong>Ukupna ocena:</strong> {result.overall_score}
            </Typography>
            <Typography>
              <strong>Ukupni sentiment:</strong>{" "}
              {result.overall_sentiment}
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

export default Page3;
