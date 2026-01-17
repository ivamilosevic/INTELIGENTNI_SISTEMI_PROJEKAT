import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightIcon from '@mui/icons-material/Flight';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const choices = [
  { title: "Najbolje aviokompanije i aspekti putnika", path: "/page1", icon: <FlightTakeoffIcon /> },
  { title: "Izbor aviokompanije po preferencama", path: "/page2", icon: <FlightIcon /> },
  { title: "Ocene po kompaniji i tipu sedišta", path: "/page3", icon: <AirlineSeatReclineExtraIcon /> },
  { title: "Opis aerodroma", path: "/page4", icon: <AirportShuttleIcon /> },
  { title: "Upoređivanje dve aviokompanije", path: "/page5", icon: <CompareArrowsIcon /> },
];

export default function Home() {
  const navigate = useNavigate();

return (
<Box
  sx={{
    position: "fixed",          
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,rgb(210, 197, 197) 0%,rgb(89, 6, 104) 100%)", 
    margin: 0,
    padding: 0,
    overflow: "hidden",
    fontFamily: "'Roboto', sans-serif", 
  }}
>
  <Typography variant="h3" sx={{ 
      color: "#ffffff", 
      fontWeight: 700, 
      mb: 5, 
      textAlign: "center",
      textShadow: "2px 2px 8px rgba(0,0,0,0.5)" 
  }}>
    🤖 Avio AI Agent
  </Typography>

  <Box sx={{ 
      width: "100%", 
      maxWidth: 800, 
      display: "flex", 
      flexDirection: "column", 
      gap: 2 
  }}>
    {choices.map((choice, index) => (
      <Button
        key={index}
        onClick={() => navigate(choice.path)}
        startIcon={choice.icon}
        variant="contained"
        sx={{
          justifyContent: "flex-start",
          p: 2,
          backgroundColor: "#111",
          color: "#fff",
          "&:hover": { backgroundColor: "#222" },
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          borderRadius: 2, 
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", 
        }}
        fullWidth
      >
        {choice.title}
      </Button>
    ))}
  </Box>
</Box>
  );
}
