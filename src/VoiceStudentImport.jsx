import React, { useRef, useState } from "react";

export default function VoiceStudentImport() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const startRecording = async () => {
    setMessage("");
    setPreview(null);
    setAudioBlob(null);

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

    const formData = new FormData();
    formData.append("file", audioBlob, "voice-input.webm");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/students/voice-upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPreview(data);

      if (!response.ok) {
        setMessage(data.error || "Upload failed.");
      }
    } catch (error) {
      setMessage("Network error while uploading audio.");
    } finally {
      setLoading(false);
    }
  };

  const confirmImport = async () => {
    if (!preview?.rows?.length) {
      setMessage("No valid rows to import.");
      return;
    }

    setConfirming(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/students/confirm-import/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: preview.rows }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Imported ${data.created_count} students successfully.`);
      } else {
        setMessage(data.error || "Import failed.");
      }
    } catch (error) {
      setMessage("Network error while confirming import.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>Voice to Student Import Demo</h2>

      <p>
        Speak in this format:
        <br />
        Riya Sharma, riya@gmail.com, female, 123456789012
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}

        <button onClick={uploadAudio} disabled={!audioBlob || loading}>
          {loading ? "Uploading..." : "Upload Audio"}
        </button>

        <button onClick={confirmImport} disabled={!preview?.rows?.length || confirming}>
          {confirming ? "Importing..." : "Confirm Import"}
        </button>
      </div>

      {message && <p><strong>{message}</strong></p>}

      {preview && (
        <div>
          <h3>Transcript</h3>
          <pre style={{ background: "#f4f4f4", padding: 12 }}>{preview.transcript}</pre>

          <h3>Valid Rows</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>APAAR ID</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows?.map((row, index) => (
                <tr key={index}>
                  <td>{row.full_name}</td>
                  <td>{row.email}</td>
                  <td>{row.gender}</td>
                  <td>{row.apaar_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 20 }}>Errors</h3>
          {preview.errors?.length ? (
            <pre style={{ background: "#fff3f3", padding: 12 }}>
              {JSON.stringify(preview.errors, null, 2)}
            </pre>
          ) : (
            <p>No errors</p>
          )}
        </div>
      )}
    </div>
  );
}