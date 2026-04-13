// import './App.css'

import { Routes, Route, Link } from "react-router";
import BatchCreationInterface from "./BatchCreationInterface"
import TrainingTakenInterface from "./TrainingTakenInterface"
import StudentTraining  from "./StudentTraining"
import { Container, Typography } from "@mui/material";
import VoiceStudentImport from "./VoiceStudentImport";
import VStudentImport from "./VStudentImport";


function Home() {
  return <h2>Home Page</h2>;
}


function App() {


  return (
    <Container>
       <nav>
        <Link to="/"><Typography variant="small">Batch Training  </Typography></Link> | 
        <Link to="/student-training"><Typography variant="small">   Student Training</Typography></Link>
        
        <Link to="/voice-csv-upload"><Typography variant="small">   Voice upload</Typography></Link>
        {/* <Link to="/voice-csv-upload"><Typography variant="small">   Voice upload</Typography></Link> */}


        
      </nav>
      {/* <BatchCreationInterface/> */}
      {/* <TrainingTakenInterface batches={batches}/> */}
      
      
      <Routes>
        <Route path="/" element={<BatchCreationInterface/>}></Route>
        <Route path="/student-training" element={<StudentTraining/>}></Route>
        {/* <Route path="/voice-csv-upload" element={<VoiceStudentImport/>}></Route> */}
        <Route path="/voice-csv-upload" element={<VStudentImport/>}></Route>
        
      </Routes>
    </Container>

  )
}

export default App
