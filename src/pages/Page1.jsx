import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider
} from "@mui/material";

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
    fetch("http://localhost:5000/airline-overall-score")
      .then(res => res.json())
      .then(setAirlineRatings)
      .catch(console.error);

    fetch("http://localhost:5000/lounge-overall-score")
      .then(res => res.json())
      .then(setLoungeRatings)
      .catch(console.error);

    fetch("http://localhost:5000/seat-overall-score")
      .then(res => res.json())
      .then(setSeatRatings)
      .catch(console.error);

    fetch("http://localhost:5000/aspect-description/airline")
      .then(res => res.json())
      .then(data =>
        setDescriptions(p => ({ ...p, airline: data.description }))
      );

    fetch("http://localhost:5000/aspect-description/lounge")
      .then(res => res.json())
      .then(data =>
        setDescriptions(p => ({ ...p, lounge: data.description }))
      );

    fetch("http://localhost:5000/aspect-description/seat")
      .then(res => res.json())
      .then(data =>
        setDescriptions(p => ({ ...p, seat: data.description }))
      );
  }, []);

  const RatingCard = ({ title, description, data }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.6)",
          fontStyle: "italic",
          mb: 2
        }}
      >
        {description}
      </Typography>

      <Stack spacing={1}>
        {data.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography sx={{ color: "#e0e0e0" }}>
              {item.airline_name}
            </Typography>

            <Typography sx={{ color: "#ffffff", fontWeight: 600 }}>
              {Number(item.overall_rating).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgb(210,197,197) 0%, rgb(89,6,104) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4
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
        <Stack spacing={4}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={700}
            sx={{ color: "#f5f5f5" }}
          >
            ✈️ Najbolje aviokompanije
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

          <Stack spacing={3}>
            <RatingCard
              title="Ukupne ocene aviokompanija"
              description={descriptions.airline}
              data={airlineRatings}
            />

            <RatingCard
              title="Ukupne ocene lounge usluge"
              description={descriptions.lounge}
              data={loungeRatings}
            />

            <RatingCard
              title="Ukupne ocene kvaliteta sedišta"
              description={descriptions.seat}
              data={seatRatings}
            />
          </Stack>

          <Button
            onClick={() => navigate("/")}
            sx={{
              alignSelf: "center",
              px: 4,
              py: 1.2,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#fff",
              background:
                "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)"
              }
            }}
          >
            Povratak na početnu
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Page1;
