import { Box, Button, FormControl, InputLabel, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {Drawer} from "@mui/material";
import { useState } from "react";
import Select from "@mui/material/Select";
import { students } from "./students";
import { DateField } from "@mui/x-date-pickers/DateField";
import dayjs from "dayjs";


const columns = [
    { field: "id", headerName: "ID", width: 90},
    { field: "name", headerName: "Training", width: 90},
    { field: "date", headerName: "Training Start Date", width: 90},
    { field: "test_date", headerName: "Test Date", width: 90},
    { field: "test_attendance", headerName: "Count", width: 90},
]

const rows = [
    {id: 1, name: "Python", date: "26 April, 2026", test_date: "10 June, 2026", test_attendance: "35/50"},
    {id: 2, name: "Bash", date: "12 May, 2026", test_date: "20 June, 2026", test_attendance: "15/30"},
    {id: 3, name: "Linux", date: "16 March, 2026", test_date: "1 April, 2026", test_attendance: "25/25"},
    {id: 4, name: "Javascript", date: "26 April, 2026", test_date: "10 June, 2026", test_attendance: "35/50"},
    {id: 5, name: "React", date: "26 April, 2026", test_date: "10 June, 2026", test_attendance: "35/50"},
]

const student_columns = [
    {field: "id", headerName: "ID"},
    {field: "name", headerName: "Name"},
    {field: "class", headerName: "Class"},
]

const student_rows = students


export default function StudentTraining() {
     const [classVal, setClassVal] = useState("");
    const [section, setSection] = useState("");
    const [listStudents, setListStudents] = useState(student_rows)
    const [value, setValue] = useState(dayjs());


  const handleChange = (event) => {
    setClassVal(event.target.value);
    // alert(event.target.value)
    const class_students = students.filter((student) => student.class === Number(event.target.value))
    console.log(class_students)
    setListStudents(class_students)

  };

  const handleSearch = (event) => {
    console.log("inside handleSearch")
    const search = event.target.value
    console.log("search: ",search)
    const search_students = students.filter((student) => student.name.toLowerCase().includes(search.toLowerCase()))
    console.log(listStudents)
    setListStudents(search_students)

  }

//   const handleSecChange = (event) => {
//     setSection(event.target.value);
//   };


    const [open, setOpen] = useState(false);
  return (
    <>
    <Typography variant="h6">Create Student Training</Typography>
    <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2}}>+ Add Training</Button>
    
    <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        
        />
    <Drawer 
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        >
        <Box sx={{ width: 750, p:2}}>
         <Box sx={{ mb: 2}}>
            <FormControl fullWidth sx={{ mb: 2}}>
                <InputLabel id="class-label">Course</InputLabel>
                <Select 
                labelId="class-label"
                id="class-select"
                // value={classVal}
                label="Select Course"
                // onChange={handleChange}
                >
                    <MenuItem value={1}>Bash</MenuItem>
                    <MenuItem value={4}>Javascript</MenuItem>
                    <MenuItem value={2}>Linux</MenuItem>
                    <MenuItem value={3}>Python</MenuItem>
                    <MenuItem value={5}>React</MenuItem>

                </Select>
            </FormControl>
             <DateField
                label="Training start date "
                value={value}
                onChange={(newValue) => setValue(newValue)}
                />
        </Box>
        <hr />
        <Box sx={{p: 2}}>
            <Typography variant="small" >Select students for training:</Typography>
        </Box>

        <Box sx={{ mb: 2, mt: 2}}>
            <FormControl fullWidth>
                <InputLabel id="class-label">Class</InputLabel>
                <Select 
                labelId="class-label"
                id="class-select"
                value={classVal}
                label="Select Class"
                onChange={handleChange}
                >
                    <MenuItem value={1}>Class 1</MenuItem>
                    <MenuItem value={2}>Class 2</MenuItem>
                    <MenuItem value={3}>Class 3</MenuItem>
                    <MenuItem value={4}>Class 4</MenuItem>
                    <MenuItem value={5}>Class 5</MenuItem>

                </Select>
            </FormControl>
        </Box>
        <Box>
            {/* <FormControl fullWidth>
                <InputLabel id="class-label">Section</InputLabel>
                <Select 
                labelId="class-label"
                id="class-select"
                value={section}
                label="Select Section"
                onChange={handleSecChange}
                >
                    <MenuItem value={1}>A</MenuItem>
                    <MenuItem value={2}>B</MenuItem>
                    <MenuItem value={3}>C</MenuItem>
                    <MenuItem value={4}>D</MenuItem>
                    <MenuItem value={5}>E</MenuItem>

                </Select>
            </FormControl> */}
        </Box>
        <h4>OR</h4>
        <div>
        <TextField fullWidth label="Search by name / email / apaar id" onChange={handleSearch}/>
        </div>

        <div>
             <DataGrid
            rows={listStudents}
            columns={student_columns}
            pageSize={10}
            checkboxSelection
        
        />
         
        </div>
    </Box>
    </Drawer>
    
    </>
  )
}