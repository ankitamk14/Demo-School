// import './App.css'

// import { Routes, Route, Link } from "react-router";
import BatchCreationInterface from "./BatchCreationInterface"
import TrainingTakenInterface from "./TrainingTakenInterface"
import StudentTraining  from "./StudentTraining"
// import { Container, Typography } from "@mui/material";
import VoiceStudentImport from "./VoiceStudentImport";
import VStudentImport from "./VStudentImport";


import { Container, Typography, Box, Button } from "@mui/material";
import { NavLink, Route, Routes } from "react-router-dom";

const navButtonSx = {
  textTransform: "none",
  borderRadius: 2,
  px: 2,
  py: 1,
  color: "text.primary",
  "&.active": {
    backgroundColor: "primary.main",
    color: "#fff",
  },
  "&:hover": {
    backgroundColor: "primary.light",
    color: "#fff",
  },
};

export default function App() {
  return (
    <Container maxWidth="lg">
      <Box
        component="nav"
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          p: 2,
          mt: 2,
          mb: 4,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Button component={NavLink} to="/" sx={navButtonSx}>
          <Typography variant="body2">CSV Upload - Speech to Text</Typography>
        </Button>

        <Button component={NavLink} to="/batch-training" sx={navButtonSx}>
          <Typography variant="body2">Batch Training</Typography>
        </Button>

        <Button component={NavLink} to="/student-training" sx={navButtonSx}>
          <Typography variant="body2">Student Training</Typography>
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<VStudentImport />} />
        <Route path="/batch-training" element={<BatchCreationInterface />} />
        <Route path="/student-training" element={<StudentTraining />} />
      </Routes>
    </Container>
  );
}