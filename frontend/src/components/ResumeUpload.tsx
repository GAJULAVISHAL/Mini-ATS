
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
    <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Upload Resume</h3>
      <p className="mt-1 text-sm text-slate-500">
        Add a candidate's PDF or DOCX resume to this job.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".pdf,.docx"
          disabled={uploading}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setValidationError("");
          }}
          className="block w-full rounded-lg border border-slate-300 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:font-medium file:text-indigo-700"
        />

        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={!file || uploading}
          className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {file && (
        <p className="mt-3 break-all text-sm text-slate-600">
          Selected: {file.name}
        </p>
      )}

      {(validationError || message) && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            validationError ? "text-red-600" : "text-slate-600"
          }`}
        >
          {validationError || message}
        </p>
      )}
    </section>
  );
}
