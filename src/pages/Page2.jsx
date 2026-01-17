import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button
} from "@mui/material";

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

  const handleSubmit = async (url, data, setter) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setter(await res.json());
  };

  const renderSection = (title, labels, values, setValues) => (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#121212"
      }}
    >
      <Typography variant="h6" sx={{ color: "#fff", mb: 3 }}>
        {title}
      </Typography>

      <Grid container spacing={3}>
        {Object.keys(values).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              fullWidth
              type="number"
              step="0.1"
              label={labels[key]}
              value={values[key]}
              onChange={(e) =>
                setValues({ ...values, [key]: Number(e.target.value) })
              }
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#181818",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#6a1b9a" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#9c27b0",
                    borderWidth: 2
                  }
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderResult = (result) =>
    result && (
      <Paper
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 2,
          backgroundColor: "#1e1e1e",
          textAlign: "center"
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff" }}>
          {result.airline_name}
        </Typography>
        <Typography sx={{ color: "#b0b0b0" }}>
          Ukupna ocena: {Number(result.total_score).toFixed(2)}
        </Typography>
      </Paper>
    );

  const outlinedButtonStyle = {
    py: 1.4,
    fontWeight: 600,
    letterSpacing: "0.4px",
    borderRadius: 2,
    color: "#e1bee7",
    border: "2px solid #6a1b9a",
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(106,27,154,0.15)",
      boxShadow: "0 0 12px rgba(156,39,176,0.6)",
      borderColor: "#9c27b0",
      transform: "translateY(-1px)"
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgb(210,197,197) 0%, rgb(89,6,104) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        insert: 0
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 5,
          borderRadius: 4,
          backgroundColor: "#0f0f0f",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 5,
            textAlign: "center"
          }}
        >
          ✈️ Personalizovane AI preporuke
        </Typography>

        {renderSection(
          "Sedišta – važnost aspekata",
          seatLabels,
          seatWeights,
          setSeatWeights
        )}
        <Button
          fullWidth
          sx={{ ...outlinedButtonStyle, mb: 4 }}
          onClick={() =>
            handleSubmit(
              "http://localhost:5000/best-airline-seat-by-preference",
              seatWeights,
              setSeatResult
            )
          }
        >
          Izračunaj sedišta
        </Button>
        {renderResult(seatResult)}

        {renderSection(
          "Saloni (Lounge)",
          loungeLabels,
          loungeWeights,
          setLoungeWeights
        )}
        <Button
          fullWidth
          sx={{ ...outlinedButtonStyle, mb: 4 }}
          onClick={() =>
            handleSubmit(
              "http://localhost:5000/best-airline-lounge-by-preference",
              loungeWeights,
              setLoungeResult
            )
          }
        >
          Izračunaj lounge
        </Button>
        {renderResult(loungeResult)}

        {renderSection(
          "Glavni aspekti aviokompanija",
          airlineLabels,
          airlineWeights,
          setAirlineWeights
        )}
        <Button
          fullWidth
          sx={outlinedButtonStyle}
          onClick={() =>
            handleSubmit(
              "http://localhost:5000/best-airline-main-by-preference",
              airlineWeights,
              setAirlineResult
            )
          }
        >
          Izračunaj aviokompaniju
        </Button>
        {renderResult(airlineResult)}

        <Button
          fullWidth
          sx={{
            mt: 4,
            py: 1.2,
            borderRadius: 2,
            color: "#bbb",
            border: "1px solid #444",
            backgroundColor: "transparent",
            "&:hover": {
              borderColor: "#6a1b9a",
              color: "#fff",
              backgroundColor: "rgba(106,27,154,0.08)"
            }
          }}
          onClick={() => navigate("/")}
        >
          Povratak na početnu
        </Button>
      </Paper>
    </Box>
  );
}

export default Page2;
