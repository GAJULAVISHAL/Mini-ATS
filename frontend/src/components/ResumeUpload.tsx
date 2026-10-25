
import { useState } from "react";

type ResumeUploadProps = {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  message: string;
};

export default function ResumeUpload({
  onUpload,
  uploading,
  message,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState("");

  async function handleUpload() {
    setValidationError("");

    if (!file) {
      setValidationError("Please select a resume first.");
      return;
    }

    const validExtension = /\.(pdf|docx)$/i.test(file.name);

    if (!validExtension) {
      setValidationError("Please select a PDF or DOCX file.");
      return;
    }

    await onUpload(file);
    setFile(null);
  }

  return (
    <section className="panel upload-panel">
      <h3 className="panel-title">Add candidate material</h3>
      <p className="panel-subtitle">
        Upload a PDF or DOCX resume to this role.
      </p>

      <div className="upload-row">
        <input
          type="file"
          accept=".pdf,.docx"
          disabled={uploading}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setValidationError("");
          }}
          className="file-input"
        />

        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={!file || uploading}
          className="primary-button"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {file && (
        <p className="form-help">
          Selected: {file.name}
        </p>
      )}

      {(validationError || message) && (
        <p
          role="status"
          className={`form-help ${
            validationError ? "text-red-400" : ""
          }`}
        >
          {validationError || message}
        </p>
      )}
    </section>
  );
}
