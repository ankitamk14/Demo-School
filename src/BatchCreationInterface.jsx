import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddCircleOutline,
  AutoAwesome,
  CalendarMonth,
  Class,
  CloudUpload,
  DeleteOutline,
  ErrorOutline,
  Groups,
  PersonOutline,
  School,
  SnippetFolder,
  TableChart,
  Topic,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const sessions = ["2025-26", "2026-27", "2027-28"];
const classes = ["6", "7", "8", "9", "10"];
const sections = ["A", "B", "C", "D"];
const teachers = [
  "Ankita Sharma",
  "Rohit Mehta",
  "Pooja Nair",
  "Vivek Rao",
  "Sonal Gupta",
];
const courses = [
  "Python",
  "Bash",
  "Linux",
  "Javascript",
  "Blender",
];
const invigilators = [
  "Devendra Kumar",
  "Shreya Yadav",
  "Neha Verma",
  "Aditya Singh",
  "Naman Shah",
];

const initialTrainingRows = [
  { id: 1, course: "Astronomy Basics", startDate: "2026-04-10", endDate: "2026-04-24", testDate: "2026-04-27", invigilator: "Devendra Kumar" },
  { id: 2, course: "Physics Foundation", startDate: "2026-05-02", endDate: "2026-05-16", testDate: "2026-05-19", invigilator: "Shreya Yadav" },
  { id: 3, course: "Observation Skills", startDate: "2026-05-25", endDate: "2026-06-08", testDate: "2026-06-11", invigilator: "Neha Verma" },
  { id: 4, course: "", startDate: "", endDate: "", testDate: "", invigilator: "" },
  { id: 5, course: "", startDate: "", endDate: "", testDate: "", invigilator: "" },
];

const csvErrorRows = [
  {
    rowNumber: 4,
    studentName: "Riya Sharma",
    errorType: "Missing required value",
    field: "Phone Number",
    message: "Phone number is blank. This field is mandatory for student import.",
  },
  {
    rowNumber: 9,
    studentName: "Aditya Kumar",
    errorType: "Invalid format",
    field: "Email",
    message: "Email format is invalid. Expected something like name@example.com.",
  },
  {
    rowNumber: 14,
    studentName: "Sneha Patil",
    errorType: "Duplicate entry",
    field: "Admission Number",
    message: "Admission number already exists in the selected batch session.",
  },
];

function MotionBox({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
}

export default function BatchCreationInterface() {
  const [batchName, setBatchName] = useState("Grade 8 - Section A | Science Batch");
  const [session, setSession] = useState("2026-27");
  const [selectedClass, setSelectedClass] = useState("8");
  const [section, setSection] = useState("A");
  const [classTeacher, setClassTeacher] = useState("Ankita Sharma");
  const [fileName, setFileName] = useState("students_batch_8A.csv");
  const [trainingRows, setTrainingRows] = useState(initialTrainingRows);
  const [showCsvErrors, setShowCsvErrors] = useState(true);
  const csvErrorRef = useRef(null);

  useEffect(() => {
    if (showCsvErrors && csvErrorRef.current) {
      csvErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showCsvErrors]);

  const errorCount = useMemo(() => csvErrorRows.length, []);

  const handleTrainingChange = (id, field, value) => {
    setTrainingRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addTrainingRow = () => {
    setTrainingRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        course: "",
        startDate: "",
        endDate: "",
        testDate: "",
        invigilator: "",
      },
    ]);
  };

  const removeTrainingRow = (id) => {
    setTrainingRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <MotionBox>
          <Card sx={{ borderRadius: 4, boxShadow: 4, overflow: "hidden" }}>
            <Box
              sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 2.5, md: 3 },
                borderBottom: 1,
                borderColor: "divider",
                background: "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(156,39,176,0.08))",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
                <Box>
                  <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
                    <Groups color="primary" />
                    <Typography variant="h5" fontWeight={700}>
                      Create Batch
                    </Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    Configure batch details, upload students, and define training schedule in one place.
                  </Typography>
                </Box>

                {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip icon={<AutoAwesome />} label="Demo UI" color="secondary" variant="outlined" />
                  <Chip icon={<TableChart />} label={`${errorCount} CSV errors shown`} color="error" variant="outlined" />
                </Stack> */}
              </Stack>
            </Box>

            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                 <Typography variant="h6" fontWeight={700} gutterBottom>
                    Batch Information
                  </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                 
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Batch Name"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Topic fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Session"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <School fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {sessions.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Class fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {classes.map((item) => (
                      <MenuItem key={item} value={item}>
                        Class {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SnippetFolder fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {sections.map((item) => (
                      <MenuItem key={item} value={item}>
                        Section {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Class Teacher"
                    value={classTeacher}
                    onChange={(e) => setClassTeacher(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {teachers.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Student CSV Upload
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 4,
                      p: { xs: 2, md: 3 },
                      borderStyle: "dashed",
                      borderWidth: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CloudUpload color="primary" />
                          <Box>
                            <Typography fontWeight={700}>Upload student CSV</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Accepted format: .csv | Demo file uploaded successfully with a few row-level errors.
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                          <Button variant="outlined" startIcon={<TableChart />}>
                            Download sample CSV
                          </Button>
                          <Button variant="contained" component="label" startIcon={<CloudUpload />}>
                            Choose CSV
                            <input
                              hidden
                              type="file"
                              accept=".csv"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFileName(file.name);
                                  setShowCsvErrors(true);
                                }
                              }}
                            />
                          </Button>
                        </Stack>
                      </Stack>

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: "action.hover",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          width: "fit-content",
                        }}
                      >
                        <SnippetFolder fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={600}>
                          {fileName}
                        </Typography>
                      </Box>

                      <AnimatePresence>
                        {showCsvErrors && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                          >
                            <Box ref={csvErrorRef}>
                              <Alert
                                severity="error"
                                icon={<ErrorOutline />}
                                sx={{ mb: 2, borderRadius: 3 }}
                              >
                                3 rows failed during CSV validation. Please review the errors below and re-upload the corrected file.
                              </Alert>

                              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 700 }}>Row #</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Error Type</TableCell>
                                      <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {csvErrorRows.map((row) => (
                                      <TableRow key={row.rowNumber} hover>
                                        <TableCell>{row.rowNumber}</TableCell>
                                        <TableCell>{row.studentName}</TableCell>
                                        <TableCell>{row.field}</TableCell>
                                        <TableCell>
                                          <Chip
                                            size="small"
                                            label={row.errorType}
                                            color="error"
                                            variant="outlined"
                                          />
                                        </TableCell>
                                        <TableCell>{row.message}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Training Schedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add course timelines, test dates, and invigilators for this batch.
                      </Typography>
                    </Box>

                    <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={addTrainingRow}>
                      Add Row
                    </Button>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={2}>
                    {trainingRows.map((row, index) => (
                        
                      <Paper key={row.id} variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
                        <Box>
                            <Typography fontWeight={700}>Training Row {index + 1}

                                <Tooltip title="Remove row">
                                
                                <span>
                                  <IconButton
                                    color="error"
                                    onClick={() => removeTrainingRow(row.id)}
                                    disabled={trainingRows.length <= 1}
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Typography>
                             
                        </Box>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              
                             
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <TextField
                              select
                              fullWidth
                              label="Course"
                              value={row.course}
                              onChange={(e) => handleTrainingChange(row.id, "course", e.target.value)}
                            >
                              {courses.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={12} md={2.25}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Start Date"
                              value={row.startDate}
                              onChange={(e) => handleTrainingChange(row.id, "startDate", e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarMonth fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={2.25}>
                            <TextField
                              fullWidth
                              type="date"
                              label="End Date"
                              value={row.endDate}
                              onChange={(e) => handleTrainingChange(row.id, "endDate", e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarMonth fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={2.25}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Test Date"
                              value={row.testDate}
                              onChange={(e) => handleTrainingChange(row.id, "testDate", e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarMonth fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={2.25}>
                            <TextField
                              select
                              fullWidth
                              label="Invigilator"
                              value={row.invigilator}
                              onChange={(e) => handleTrainingChange(row.id, "invigilator", e.target.value)}
                            >
                              {invigilators.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
                    <Button variant="outlined" size="large">
                      Save as Draft
                    </Button>
                    <Button variant="contained" size="large" startIcon={<Groups />}>
                      Create Batch
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </MotionBox>
      </Box>
    </Box>
  );
}
