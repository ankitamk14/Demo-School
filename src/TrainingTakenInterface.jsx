import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
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
  Typography,
  Avatar,
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Event as EventIcon,
  FactCheck as FactCheckIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Constants
const sessions = ["2025-26", "2026-27"];
const coursesList = ["Python", "Bash", "Linux", "Javascript", "Blender", "Git", "Advanced C"];
const invigilatorsList = [
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

// Initial data with unique IDs for each training
const initialTrainingData = {
  "2025-26": [
    {
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
        },
        {
          id: 3,
          course: "Linux",
          startDate: "2026-05-20",
          endDate: "2026-06-05",
          status: "Pending",
          testDate: "2026-06-08",
          testStatus: "Pending",
          trainingAttendanceMarked: "0/38",
          testAttendanceMarked: "0/38",
        },
      ],
    },
    {
      batch: "Batch-6B-Core",
      className: "6",
      section: "B",
      classTeacher: "Rohit Sharma",
      totalStudents: 41,
      trainings: [
        {
          id: 4,
          course: "JavaScript",
          startDate: "2026-04-07",
          endDate: "2026-04-25",
          status: "Completed",
          testDate: "2026-04-29",
          testStatus: "Completed",
          trainingAttendanceMarked: "40/41",
          testAttendanceMarked: "39/41",
        },
        {
          id: 5,
          course: "Bash",
          startDate: "2026-05-03",
          endDate: "2026-05-17",
          status: "In Process",
          testDate: "2026-05-20",
          testStatus: "Pending",
          trainingAttendanceMarked: "28/41",
          testAttendanceMarked: "0/41",
        },
        {
          id: 6,
          course: "Linux",
          startDate: "2026-05-25",
          endDate: "2026-06-09",
          status: "Pending",
          testDate: "2026-06-12",
          testStatus: "Pending",
          trainingAttendanceMarked: "0/41",
          testAttendanceMarked: "0/41",
        },
      ],
    },
    {
      batch: "Batch-7A-Tech",
      className: "7",
      section: "A",
      classTeacher: "Anjali Verma",
      totalStudents: 35,
      trainings: [
        {
          id: 7,
          course: "Git",
          startDate: "2026-04-10",
          endDate: "2026-04-21",
          status: "Completed",
          testDate: "2026-04-26",
          testStatus: "Completed",
          trainingAttendanceMarked: "35/35",
          testAttendanceMarked: "34/35",
        },
        {
          id: 8,
          course: "Blender",
          startDate: "2026-05-02",
          endDate: "2026-05-22",
          status: "In Process",
          testDate: "2026-05-27",
          testStatus: "In Process",
          trainingAttendanceMarked: "24/35",
          testAttendanceMarked: "11/35",
        },
        {
          id: 9,
          course: "Linux",
          startDate: "2026-05-28",
          endDate: "2026-06-11",
          status: "Pending",
          testDate: "2026-06-15",
          testStatus: "Pending",
          trainingAttendanceMarked: "0/35",
          testAttendanceMarked: "0/35",
        },
      ],
    },
    {
      batch: "Batch-8C-Advanced",
      className: "8",
      section: "C",
      classTeacher: "Sonal Gupta",
      totalStudents: 29,
      trainings: [
        {
          id: 10,
          course: "Advanced C",
          startDate: "2026-04-12",
          endDate: "2026-05-05",
          status: "In Process",
          testDate: "2026-05-10",
          testStatus: "Pending",
          trainingAttendanceMarked: "19/29",
          testAttendanceMarked: "0/29",
        },
      ],
    },
  ],
  "2026-27": [],
};

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
                <SchoolIcon />
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
                <MenuBookIcon />
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
                <FactCheckIcon />
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
                <EventIcon />
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

export default function TrainingTakenInterface() {
  const [selectedSession, setSelectedSession] = useState("2025-26");
  const [trainingData, setTrainingData] = useState(initialTrainingData);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null); // batch object where training is added/edited
  const [editingTraining, setEditingTraining] = useState(null); // training object for edit mode (null for add)
  const [formData, setFormData] = useState({
    course: "",
    startDate: "",
    endDate: "",
    testDate: "",
    invigilator: "",
  });

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
      // Default values for new trainings
      status: "Pending",
      testStatus: "Pending",
      trainingAttendanceMarked: `0/${editingBatch.totalStudents}`,
      testAttendanceMarked: `0/${editingBatch.totalStudents}`,
    };

    setTrainingData((prev) => {
      // Find the session and batch to update
      const sessionData = prev[selectedSession];
      const updatedBatches = sessionData.map((batch) => {
        if (batch.batch === editingBatch.batch) {
          if (editingTraining) {
            // Edit existing training
            const updatedTrainings = batch.trainings.map((t) =>
              t.id === editingTraining.id ? newTraining : t
            );
            return { ...batch, trainings: updatedTrainings };
          } else {
            // Add new training
            return { ...batch, trainings: [...batch.trainings, newTraining] };
          }
        }
        return batch;
      });
      return { ...prev, [selectedSession]: updatedBatches };
    });

    handleCloseModal();
  };

  const selectedRows = trainingData[selectedSession] || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: { xs: 2.5, md: 3.5 },
            background: "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Training Taken Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Select a session to view batch-wise trainings, attendance, and test progress.
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
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
            </Grid>
          </Grid>

          {selectedRows.length > 0 ? (
            <>
              <TrainingSummaryCard rows={selectedRows} />

              <Stack spacing={3}>
                {selectedRows.map((row) => {
                  const classKey = `${row.className}-${row.section}`;
                  const palette = classColors[classKey] || {
                    bg: "#f5f5f5",
                    border: "#757575",
                    chipBg: "#eeeeee",
                    text: "#212121",
                  };

                  return (
                    <Paper
                      key={row.batch}
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
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  <strong>Class Teacher:</strong> {row.classTeacher}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <GroupsIcon fontSize="small" color="action" />
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
                                    icon={<MenuBookIcon />}
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
                                startIcon={<AddIcon />}
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
                            {row.trainings.map((training) => (
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
                            ))}
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
                No trainings found for this session
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting another session or load training data from the API.
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

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
              {coursesList.map((course) => (
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
              {invigilatorsList.map((inv) => (
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
    </Box>
  );
}