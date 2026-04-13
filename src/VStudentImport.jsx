import React, { useRef, useState, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function normalizePreviewRows(preview) {
  if (!preview) return [];

  const validRows = (preview.rows || []).map((row, index) => ({
    id: `valid-${index + 1}`,
    sourceType: "valid",
    row_number: index + 1,
    full_name: row.full_name || "",
    email: row.email || "",
    gender: row.gender || "",
    apaar_id: row.apaar_id || "",
    status: "Valid",
    error_message: "",
  }));

  const errorRows = (preview.errors || []).map((item, index) => {
    const input = item.input || {};
    const rawErrors = item.errors || {};

    const errorText = Object.entries(rawErrors)
      .map(([field, msgs]) => {
        if (Array.isArray(msgs)) {
          return `${field}: ${msgs.join(", ")}`;
        }
        if (typeof msgs === "object" && msgs !== null) {
          return `${field}: ${JSON.stringify(msgs)}`;
        }
        return `${field}: ${String(msgs)}`;
      })
      .join(" | ");

    return {
      id: `error-${index + 1}`,
      sourceType: "error",
      row_number: item.row_number || "",
      full_name: input.full_name || "",
      email: input.email || "",
      gender: input.gender || "",
      apaar_id: input.apaar_id || "",
      status: "Needs Review",
      error_message: errorText || "Validation issue",
    };
  });

  return [...validRows, ...errorRows];
}

function validateRowLocally(row) {
  const errors = {};

  const fullName = (row.full_name || "").trim();
  const email = (row.email || "").trim();
  const gender = (row.gender || "").trim();
  const apaarId = String(row.apaar_id || "").replace(/\D/g, "");

  if (!fullName) {
    errors.full_name = "Full name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }
  }

  const allowedGenders = ["Male", "Female", "Other"];
  if (!gender) {
    errors.gender = "Gender is required.";
  } else if (!allowedGenders.includes(gender)) {
    errors.gender = "Gender must be Male, Female, or Other.";
  }

  if (!apaarId) {
    errors.apaar_id = "APAAR ID is required.";
  } else if (apaarId.length !== 12) {
    errors.apaar_id = "APAAR ID must be exactly 12 digits.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedRow: {
      ...row,
      full_name: fullName,
      email,
      gender,
      apaar_id: apaarId,
    },
  };
}

export default function VStudentImport() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [preview, setPreview] = useState(null);
  const [gridRows, setGridRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const [importResult, setImportResult] = useState(null);

  const startRecording = async () => {
    setMessage("");
    setPreview(null);
    setGridRows([]);
    setAudioBlob(null);
    setImportResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setMessage("Microphone access failed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      setMessage("Please record audio first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", audioBlob, "voice-input.webm");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/students/voice-upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Upload failed.");
        setPreview(null);
        setGridRows([]);
        return;
      }

      setPreview(data);
      setGridRows(normalizePreviewRows(data));
      setMessage("Preview generated. You can edit rows below before import.");
    } catch (error) {
      setMessage("Network error while uploading audio.");
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = (newRow) => {
    const checked = validateRowLocally(newRow);

    const updatedRow = {
      ...checked.cleanedRow,
      status: checked.isValid ? "Valid" : "Needs Review",
      error_message: checked.isValid
        ? ""
        : Object.entries(checked.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(" | "),
    };

    setGridRows((prev) =>
      prev.map((row) => (row.id === newRow.id ? updatedRow : row))
    );

    return updatedRow;
  };

  const handleProcessRowUpdateError = (error) => {
    console.error("Row update error:", error);
    setMessage("Some row update failed.");
  };

  const validEditedRows = useMemo(() => {
    return gridRows
      .map((row) => validateRowLocally(row))
      .filter((result) => result.isValid)
      .map((result) => ({
        full_name: result.cleanedRow.full_name,
        email: result.cleanedRow.email,
        gender: result.cleanedRow.gender,
        apaar_id: result.cleanedRow.apaar_id,
      }));
  }, [gridRows]);

  const invalidEditedRowsCount = useMemo(() => {
    return gridRows.filter((row) => !validateRowLocally(row).isValid).length;
  }, [gridRows]);

  const confirmImport = async () => {
    if (!validEditedRows.length) {
      setMessage("No valid rows available for import.");
      return;
    }

    setConfirming(true);
    setMessage("");
    setImportResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/students/confirm-import/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: validEditedRows }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Import failed.");
        return;
      }

      setImportResult(data);
      setMessage(`Imported ${data.created_count} students successfully.`);
    } catch (error) {
      setMessage("Network error while confirming import.");
    } finally {
      setConfirming(false);
    }
  };

  const columns = [
    {
      field: "row_number",
      headerName: "Original Row",
      width: 110,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      editable: false,
    },
    {
      field: "full_name",
      headerName: "Full Name",
      flex: 1.2,
      minWidth: 180,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.3,
      minWidth: 220,
      editable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Male", "Female", "Other"],
    },
    {
      field: "apaar_id",
      headerName: "APAAR ID",
      flex: 1,
      minWidth: 180,
      editable: true,
    },
   {
  field: "error_message",
  headerName: "Errors / Notes",
  flex: 1.8,
  minWidth: 260,
  editable: false,
  renderCell: (params) => (
    <Box
      sx={{
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: 1.3,
        py: 1,
      }}
    >
      {params.value}
    </Box>
  ),
},
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5">Voice to Student Import</Typography>

          <Typography variant="body2" color="text.secondary">
            Speak in a clear format like:
            <br />
            Riya Sharma, riya@gmail.com, Female, 123456789012
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {!isRecording ? (
              <Button variant="contained" onClick={startRecording}>
                Start Recording
              </Button>
            ) : (
              <Button variant="contained" color="warning" onClick={stopRecording}>
                Stop Recording
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={uploadAudio}
              disabled={!audioBlob || loading}
            >
              {loading ? "Uploading..." : "Upload Audio"}
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={confirmImport}
              disabled={!gridRows.length || !validEditedRows.length || confirming}
            >
              {confirming ? "Importing..." : "Confirm Import"}
            </Button>
          </Stack>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2">Processing audio...</Typography>
            </Stack>
          )}

          {message && <Alert severity="info">{message}</Alert>}

          {preview?.transcript && (
            <>
              <Divider />
              <Typography variant="h6">Transcript</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {preview.transcript}
                </Typography>
              </Paper>
            </>
          )}

          {gridRows.length > 0 && (
            <>
              <Divider />

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Alert severity="success">
                  Valid rows ready: <strong>{validEditedRows.length}</strong>
                </Alert>
                <Alert severity={invalidEditedRowsCount ? "warning" : "success"}>
                  Needs review: <strong>{invalidEditedRowsCount}</strong>
                </Alert>
              </Stack>

              <Typography variant="h6">
                Editable Preview
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Both clean rows and problematic rows are shown below. Edit any row.
                Rows automatically move to <strong>Valid</strong> once corrected.
              </Typography>

              <Box sx={{ height: 520, width: "100%" }}>
                <DataGrid
                  rows={gridRows}
                  columns={columns}
                  editMode="row"
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  getRowClassName={(params) =>
                    params.row.status === "Needs Review" ? "row-error" : "row-valid"
                  }
                  sx={{
                    "& .row-error": {
                      bgcolor: "#fff7e6",
                    },
                    "& .row-valid": {
                      bgcolor: "#f6ffed",
                    },
                  }}
                  getRowHeight={() => "auto"}
                />
              </Box>
            </>
          )}

          {importResult && (
            <>
              <Divider />
              <Typography variant="h6">Import Result</Typography>

              <Alert severity="success">
                Imported <strong>{importResult.created_count}</strong> students successfully.
              </Alert>

              {importResult.errors?.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fff7f7" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Backend Import Errors
                  </Typography>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(importResult.errors, null, 2)}
                  </pre>
                </Paper>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}