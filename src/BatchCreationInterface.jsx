import React, { useState, useMemo, useRef, useEffect } from "react";
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
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  AddCircleOutline,
  CloudUpload,
  DeleteOutline,
  ErrorOutline,
  Groups,
  PersonOutline,
  School,
  SnippetFolder,
  TableChart,
  Topic,
  MenuBook,
  Event,
  FactCheck,
  Group,
  Edit as EditIcon,
  Class,
  CalendarMonth,
  PersonAdd,
  Email,
  Phone,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Constants ----------
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
const courses = ["Python", "Bash", "Linux", "Javascript", "Blender", "Git", "Advanced C"];
const invigilators = [
  "Devendra Kumar",
  "Shreya Yadav",
  "Neha Verma",
  "Aditya Singh",
  "Naman Shah",
];

const statusConfig = {
  Pending: { label: "Pending", color: "warning" },
  "In Process": { label: "In Process", color: "info" },
  Completed: { label: "Completed", color: "success" },
};

const classColors = {
  "6-A": { bg: "#e3f2fd", border: "#1976d2", chipBg: "#bbdefb", text: "#0d47a1" },
  "6-B": { bg: "#f3e5f5", border: "#8e24aa", chipBg: "#e1bee7", text: "#4a148c" },
  "7-A": { bg: "#e8f5e9", border: "#2e7d32", chipBg: "#c8e6c9", text: "#1b5e20" },
  "8-C": { bg: "#fff3e0", border: "#ef6c00", chipBg: "#ffe0b2", text: "#e65100" },
};

// ---------- Mock initial data ----------
const initialTrainingData = {
  "2025-26": [
    {
      id: "batch-1",
      batch: "Batch-6A-Foundation",
      className: "6",
      section: "A",
      classTeacher: "Meera Nair",
      totalStudents: 38,
      trainings: [
        {
          id: 1,
          course: "Python",
          startDate: "2026-04-05",
          endDate: "2026-04-20",
          status: "Completed",
          testDate: "2026-04-24",
          testStatus: "Completed",
          trainingAttendanceMarked: "38/38",
          testAttendanceMarked: "37/38",
          invigilator: "Devendra Kumar",
        },
        {
          id: 2,
          course: "Bash",
          startDate: "2026-05-01",
          endDate: "2026-05-14",
          status: "In Process",
          testDate: "2026-05-18",
          testStatus: "Pending",
          trainingAttendanceMarked: "31/38",
          testAttendanceMarked: "0/38",
          invigilator: "Shreya Yadav",
        },
      ],
    },
    {
      id: "batch-2",
      batch: "Batch-6B-Core",
      className: "6",
      section: "B",
      classTeacher: "Rohit Sharma",
      totalStudents: 41,
      trainings: [
        {
          id: 3,
          course: "JavaScript",
          startDate: "2026-04-07",
          endDate: "2026-04-25",
          status: "Completed",
          testDate: "2026-04-29",
          testStatus: "Completed",
          trainingAttendanceMarked: "40/41",
          testAttendanceMarked: "39/41",
          invigilator: "Neha Verma",
        },
      ],
    },
    {
      id: "batch-3",
      batch: "Batch-7A-Tech",
      className: "7",
      section: "A",
      classTeacher: "Anjali Verma",
      totalStudents: 35,
      trainings: [],
    },
  ],
  "2026-27": [],
};

// ---------- CSV error mock data ----------
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

// ---------- Utility Components ----------
function MotionBox({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
}

function StatusChip({ value }) {
  const cfg = statusConfig[value] || { label: value, color: "default" };
  return <Chip label={cfg.label} color={cfg.color} size="small" variant="filled" />;
}

function TrainingSummaryCard({ rows }) {
  const summary = useMemo(() => {
    const totalBatches = rows.length;
    const totalCourses = rows.reduce((acc, row) => acc + row.trainings.length, 0);
    const completed = rows.reduce(
      (acc, row) => acc + row.trainings.filter((t) => t.status === "Completed").length,
      0
    );
    const inProcess = rows.reduce(
      (acc, row) => acc + row.trainings.filter((t) => t.status === "In Process").length,
      0
    );
    return { totalBatches, totalCourses, completed, inProcess };
  }, [rows]);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <School />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Batches</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.totalBatches}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <MenuBook />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Trainings</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.totalCourses}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "success.main" }}>
                <FactCheck />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.completed}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "info.main" }}>
                <Event />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">In Process</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.inProcess}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ---------- Main Component ----------
export default function BatchManagementDashboard() {
  // ---------- State for display data ----------
  const [trainingData, setTrainingData] = useState(initialTrainingData);
  const [selectedSession, setSelectedSession] = useState("2025-26");

  // ---------- State for creation form ----------
  const [selectedClass, setSelectedClass] = useState("8");
  const [section, setSection] = useState("A");
  const [classTeacher, setClassTeacher] = useState("Ankita Sharma");
  const [fileName, setFileName] = useState("");
  const [trainingRows, setTrainingRows] = useState([]);
  const [showCsvErrors, setShowCsvErrors] = useState(false);

  // States for student count (CSV + individual entries)
  const [csvStudentCount, setCsvStudentCount] = useState(0);
  const [individualEntries, setIndividualEntries] = useState([]);
  const [individualDialogOpen, setIndividualDialogOpen] = useState(false);

  // Individual student form fields
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentClass, setNewStudentClass] = useState(selectedClass);
  const [newStudentSection, setNewStudentSection] = useState(section);
  const [newStudentClassTeacher, setNewStudentClassTeacher] = useState(classTeacher);

  // ---------- State for Add/Edit Training modal ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [editingTraining, setEditingTraining] = useState(null);
  const [formData, setFormData] = useState({
    course: "",
    startDate: "",
    endDate: "",
    testDate: "",
    invigilator: "",
  });

  const csvErrorRef = useRef(null);

  useEffect(() => {
    if (showCsvErrors && csvErrorRef.current) {
      csvErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showCsvErrors]);

  // Keep individual dialog fields in sync with batch creation defaults when they change
  useEffect(() => {
    setNewStudentClass(selectedClass);
    setNewStudentSection(section);
    setNewStudentClassTeacher(classTeacher);
  }, [selectedClass, section, classTeacher]);

  // Compute total students from CSV + individual entries
  const totalStudents = csvStudentCount + individualEntries.length;

  // ---------- Handlers for creation form ----------
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

  const handleCsvUpload = (file) => {
    setFileName(file.name);
    // Demo: set a mock count of 38 students from CSV
    setCsvStudentCount(38);
    setShowCsvErrors(true);
  };

  const handleAddIndividualStudent = () => {
    if (newStudentName.trim() && newStudentEmail.trim() && newStudentPhone.trim()) {
      setIndividualEntries([
        ...individualEntries,
        {
          name: newStudentName,
          email: newStudentEmail,
          phone: newStudentPhone,
          class: newStudentClass,
          section: newStudentSection,
          classTeacher: newStudentClassTeacher,
        },
      ]);
      // Reset form
      setNewStudentName("");
      setNewStudentEmail("");
      setNewStudentPhone("");
      // Class/section/teacher revert to batch defaults (handled by useEffect)
      setIndividualDialogOpen(false);
    }
  };

  const handleCreateBatch = () => {
    const validTrainings = trainingRows
      .filter((row) => row.course.trim() !== "")
      .map((row) => ({
        id: Date.now() + Math.random(),
        course: row.course,
        startDate: row.startDate,
        endDate: row.endDate,
        testDate: row.testDate,
        invigilator: row.invigilator,
        status: "Pending",
        testStatus: "Pending",
        trainingAttendanceMarked: `0/${totalStudents}`,
        testAttendanceMarked: `0/${totalStudents}`,
      }));

    const newBatch = {
      id: `batch-${Date.now()}`,
      batch: `Batch-${selectedClass}${section}-${Date.now()}`, // auto-generated
      className: selectedClass,
      section: section,
      classTeacher: classTeacher,
      totalStudents: totalStudents,
      trainings: validTrainings,
    };

    setTrainingData((prev) => ({
      ...prev,
      [selectedSession]: [...(prev[selectedSession] || []), newBatch],
    }));

    // Reset form
    setFileName("");
    setTrainingRows([]);
    setShowCsvErrors(false);
    setCsvStudentCount(0);
    setIndividualEntries([]);
  };

  // ---------- Handlers for Add/Edit Training modal ----------
  const handleOpenAddModal = (batch) => {
    setEditingBatch(batch);
    setEditingTraining(null);
    setFormData({
      course: "",
      startDate: "",
      endDate: "",
      testDate: "",
      invigilator: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (batch, training) => {
    setEditingBatch(batch);
    setEditingTraining(training);
    setFormData({
      course: training.course,
      startDate: training.startDate,
      endDate: training.endDate,
      testDate: training.testDate,
      invigilator: training.invigilator,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBatch(null);
    setEditingTraining(null);
  };

  const handleFormChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSaveTraining = () => {
    if (!editingBatch) return;

    const newTraining = {
      id: editingTraining ? editingTraining.id : Date.now(),
      course: formData.course,
      startDate: formData.startDate,
      endDate: formData.endDate,
      testDate: formData.testDate,
      invigilator: formData.invigilator,
      status: "Pending",
      testStatus: "Pending",
      trainingAttendanceMarked: `0/${editingBatch.totalStudents}`,
      testAttendanceMarked: `0/${editingBatch.totalStudents}`,
    };

    setTrainingData((prev) => {
      const sessionData = prev[selectedSession] || [];
      const updatedBatches = sessionData.map((batch) => {
        if (batch.id === editingBatch.id) {
          if (editingTraining) {
            const updatedTrainings = batch.trainings.map((t) =>
              t.id === editingTraining.id ? newTraining : t
            );
            return { ...batch, trainings: updatedTrainings };
          } else {
            return { ...batch, trainings: [...batch.trainings, newTraining] };
          }
        }
        return batch;
      });
      return { ...prev, [selectedSession]: updatedBatches };
    });

    handleCloseModal();
  };

  const displayedBatches = trainingData[selectedSession] || [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header with title and session selector (outside any card) */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} sx={{ mb: 4 }}>
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center" mb={1}>
              <Groups color="primary" />
              <Typography variant="h5" fontWeight={700}>
                Batch Management
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" mb={2}>
              Create new batches and view existing trainings in one place.
            </Typography>
             <FormControl sx={{ minWidth: 200 }} marginTop={8}>
            <InputLabel id="session-select-label">Session</InputLabel>
            <Select
              labelId="session-select-label"
              value={selectedSession}
              label="Session"
              onChange={(e) => setSelectedSession(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: "white" }}
            >
              {sessions.map((session) => (
                <MenuItem key={session} value={session}>
                  {session}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </Box>
         
        </Stack>

        {/* ---------- Create Batch Card ---------- */}
        <MotionBox>
          <Card variant="outlined" sx={{ borderRadius: 4, mb: 4, p: 3, borderColor: "primary.light" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Create New Batch
            </Typography>
            <Grid container spacing={3}>
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
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={700}>
                    Student Data
                  </Typography>
                  <Chip
                    label={`Total Students: ${totalStudents}`}
                    color="primary"
                    variant="outlined"
                    icon={<Group />}
                  />
                </Stack>
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
                    {/* CSV Upload Section */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <CloudUpload color="primary" />
                        <Box>
                          <Typography fontWeight={700}>Upload student CSV</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Accepted format: .csv | Demo: sets count to 38.
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
                                handleCsvUpload(file);
                              }
                            }}
                          />
                        </Button>
                      </Stack>
                    </Stack>

                    {fileName && (
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
                    )}

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

                    <Divider>or</Divider>

                    {/* Individual Entry Button */}
                    <Stack direction="row" justifyContent="center">
                      <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        onClick={() => setIndividualDialogOpen(true)}
                      >
                        Add Individual Student Entry
                      </Button>
                    </Stack>

                    {/* List of manually added students */}
                    {individualEntries.length > 0 && (
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Manually Added Students ({individualEntries.length})
                        </Typography>
                        <List dense>
                          {individualEntries.map((entry, idx) => (
                            <ListItem key={idx}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <PersonOutline fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={entry.name}
                                secondary={`${entry.email} | ${entry.phone} | Class ${entry.class}-${entry.section} | Teacher: ${entry.classTeacher}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              {/* Training Rows */}
              {trainingRows.length > 0 && (
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    {trainingRows.map((row, index) => (
                      <Paper key={row.id} variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography fontWeight={700}>Training Row {index + 1}</Typography>
                          <Tooltip title="Remove row">
                            <span>
                              <IconButton
                                color="error"
                                onClick={() => removeTrainingRow(row.id)}
                              >
                                <DeleteOutline />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                        <Grid container spacing={2} alignItems="center">
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
              )}

           
            </Grid>
               <Grid item xs={12} mt={2}>
                <Stack direction="row" spacing={2} justifyContent="flex-center">
                
                  <Button variant="contained" size="large" startIcon={<Groups />} onClick={handleCreateBatch}>
                    Create Batch
                  </Button>
                </Stack>
              </Grid>
          </Card>
        </MotionBox>

        {/* ---------- Batches Card ---------- */}
        <MotionBox>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              p: 3,
              bgcolor: "#f5f7fb",
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Batches
            </Typography>

            {displayedBatches.length > 0 ? (
              <>
                <TrainingSummaryCard rows={displayedBatches} />

                <Stack spacing={3}>
                  {displayedBatches.map((row) => {
                    const classKey = `${row.className}-${row.section}`;
                    const palette = classColors[classKey] || {
                      bg: "#f5f5f5",
                      border: "#757575",
                      chipBg: "#eeeeee",
                      text: "#212121",
                    };

                    return (
                      <Paper
                        key={row.id}
                        elevation={0}
                        sx={{
                          borderRadius: 4,
                          borderLeft: `8px solid ${palette.border}`,
                          bgcolor: palette.bg,
                          overflow: "hidden",
                          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                        }}
                      >
                        <Box sx={{ p: 2.5 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={7}>
                              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "flex-start", sm: "center" }}>
                                <Chip
                                  label={`Class ${row.className} - ${row.section}`}
                                  sx={{
                                    bgcolor: palette.chipBg,
                                    color: palette.text,
                                    fontWeight: 700,
                                  }}
                                />
                                <Typography variant="h6" fontWeight={800} color="text.primary">
                                  {row.batch}
                                </Typography>
                              </Stack>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={{ xs: 1, sm: 2.5 }}
                                mt={1.5}
                                flexWrap="wrap"
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PersonOutline fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    <strong>Class Teacher:</strong> {row.classTeacher}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Groups fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    <strong>Total Students:</strong> {row.totalStudents}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={5}>
                              <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }} flexWrap="wrap" useFlexGap>
                                {row.trainings.map((training) => (
                                  <Tooltip key={training.id} title={`${training.course} • ${training.status}`}>
                                    <Chip
                                      icon={<MenuBook />}
                                      label={training.course}
                                      variant="filled"
                                      sx={{
                                        bgcolor: "white",
                                        fontWeight: 600,
                                        border: `1px solid ${palette.border}`,
                                      }}
                                    />
                                  </Tooltip>
                                ))}
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<AddCircleOutline />}
                                  onClick={() => handleOpenAddModal(row)}
                                >
                                  Add Training
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>

                        <Divider />

                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.7)" }}>
                                <TableCell><strong>Course</strong></TableCell>
                                <TableCell><strong>Start Date</strong></TableCell>
                                <TableCell><strong>End Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Test Date</strong></TableCell>
                                <TableCell><strong>Test Status</strong></TableCell>
                                <TableCell><strong>Training Attendance</strong></TableCell>
                                <TableCell><strong>Test Attendance</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.trainings.length > 0 ? (
                                row.trainings.map((training) => (
                                  <TableRow key={training.id} hover>
                                    <TableCell>
                                      <Typography fontWeight={700}>{training.course}</Typography>
                                    </TableCell>
                                    <TableCell>{training.startDate}</TableCell>
                                    <TableCell>{training.endDate}</TableCell>
                                    <TableCell>
                                      <StatusChip value={training.status} />
                                    </TableCell>
                                    <TableCell>{training.testDate}</TableCell>
                                    <TableCell>
                                      <StatusChip value={training.testStatus} />
                                    </TableCell>
                                    <TableCell>{training.trainingAttendanceMarked}</TableCell>
                                    <TableCell>{training.testAttendanceMarked}</TableCell>
                                    <TableCell>
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenEditModal(row, training)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No trainings added yet. Click "Add Training" to create one.</Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    );
                  })}
                </Stack>
              </>
            ) : (
              <Paper
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "#fafafa",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  No batches found for this session
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try selecting another session or create a new batch above.
                </Typography>
              </Paper>
            )}
          </Card>
        </MotionBox>

        {/* Add/Edit Training Modal */}
        <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTraining ? "Edit Training" : "Add New Training"}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                label="Course"
                value={formData.course}
                onChange={handleFormChange("course")}
                fullWidth
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course} value={course}>
                    {course}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleFormChange("startDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleFormChange("endDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Test Date"
                type="date"
                value={formData.testDate}
                onChange={handleFormChange("testDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                select
                label="Invigilator"
                value={formData.invigilator}
                onChange={handleFormChange("invigilator")}
                fullWidth
                required
              >
                {invigilators.map((inv) => (
                  <MenuItem key={inv} value={inv}>
                    {inv}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleSaveTraining}
              variant="contained"
              disabled={!formData.course || !formData.startDate || !formData.endDate || !formData.testDate || !formData.invigilator}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Individual Student Entry Dialog */}
        <Dialog open={individualDialogOpen} onClose={() => setIndividualDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Individual Student</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Full Name"
                fullWidth
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone Number"
                fullWidth
                value={newStudentPhone}
                onChange={(e) => setNewStudentPhone(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
             
          
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIndividualDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddIndividualStudent}
              variant="contained"
              disabled={!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPhone.trim()}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}