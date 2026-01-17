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
  Grid,
  Divider
} from "@mui/material";

function Page5() {
  const [airline1, setAirline1] = useState("");
  const [airline2, setAirline2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [airlinesList, setAirlinesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/all-airlines")
      .then(res => res.json())
      .then(setAirlinesList);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (airline1 === airline2) {
      setError("Izaberite dve različite kompanije");
      return;
    }

    const res = await fetch("http://localhost:5000/compare-airlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ airline1, airline2 })
    });

    const data = await res.json();
    setResult(data);
  };

  const aspects = ["seat_comfort", "cabin_staff", "food_beverages", "value_money"];
  const aspectNamesSR = {
    seat_comfort: "Udobnost sedišta",
    cabin_staff: "Osoblje u kabini",
    food_beverages: "Hrana i piće",
    value_money: "Odnos cene i kvaliteta"
  };

  const getWinner = (c1, c2, aspect) => {
    if (c1[aspect] > c2[aspect]) return c1.airline_name;
    if (c2[aspect] > c1[aspect]) return c2.airline_name;
    return "Isti";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #d2c5c5, #590668)",
        display: "flex",
        justifyContent: "center",
        py: 8,
        px: 2,
        fontFamily: "'Inter', 'Poppins', sans-serif"
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 760,
          p: 5,
          borderRadius: 4,
          backgroundColor: "#0f0f0f",
          color: "#ffffff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)"
        }}
      >
        <Typography variant="h4" fontWeight={700} align="center" mb={4}>
          Uporedi dve avio-kompanije
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[airline1, airline2].map((value, index) => (
            <FormControl fullWidth required key={index}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.6)" }}>
                Kompanija {index + 1}
              </InputLabel>
              <Select
                value={value}
                onChange={(e) => index === 0 ? setAirline1(e.target.value) : setAirline2(e.target.value)}
                sx={{
                  color: "#fff",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.4)"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff"
                  },
                  ".MuiSvgIcon-root": { color: "#fff" }
                }}
              >
                {airlinesList.map(a => (
                  <MenuItem key={a} value={a}>{a}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

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
          >
            Uporedi
          </Button>
        </Box>

        {error && (
          <Typography mt={3} color="error" align="center">
            {error}
          </Typography>
        )}

        {result && (
          <Box mt={6}>
            <Grid container spacing={3}>
              {[result[0], result[1]].map(company => (
                <Grid item xs={12} sm={6} key={company.airline_name}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "#1a1a1a",
                      border: "1px solid rgba(255, 255, 255, 0.89)"
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} mb={2} sx={{ color: "#ffffff" }}>
                      {company.airline_name}
                    </Typography>

                    {aspects.map(aspect => (
                      <Box
                        key={aspect}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                          color:
                            getWinner(result[0], result[1], aspect) === company.airline_name
                              ? "#88e89d"
                              : "rgba(255,255,255,0.85)"
                        }}
                      >
                        <Typography variant="body2"
                        sx={{ color: "#ffffff" }}
                        >
                          {aspectNamesSR[aspect]}
                        </Typography>

                        <Typography variant="body2" fontWeight={600}>
                          {Number(company[aspect]).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}

                    <Divider sx={{ my: 1.5, borderColor: "rgba(255, 255, 255, 0.95)" }} />

                    <Typography fontWeight={700}
                    sx={{ color: "#ffffff" }}
                    >
                      Ukupno:{" "}
                      {(
                        aspects.reduce((acc, a) => acc + company[a], 0) /
                        aspects.length
                      ).toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography
              mt={4}
              align="center"
              fontWeight={700}
              fontSize="1.1rem"
            >
              {(() => {
                const avg1 = aspects.reduce((a, b) => a + result[0][b], 0) / aspects.length;
                const avg2 = aspects.reduce((a, b) => a + result[1][b], 0) / aspects.length;
                if (avg1 > avg2) return `${result[0].airline_name} ima bolje ukupne ocene.`;
                if (avg2 > avg1) return `${result[1].airline_name} ima bolje ukupne ocene.`;
                return "Obe kompanije imaju iste ukupne ocene.";
              })()}
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          sx={{
            mt: 4,
            color: "rgba(255,255,255,0.7)",
            "&:hover": { color: "#fff" }
          }}
          onClick={() => navigate("/")}
        >
          ← Povratak na početnu
        </Button>
      </Paper>
    </Box>
  );
}

export default Page5;
