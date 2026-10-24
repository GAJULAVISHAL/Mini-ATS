
import { useState } from "react";

export function useResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function uploadResume(jobId: string, file: File) {
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resumes", file);

      const response = await fetch(`/api/jobs/${jobId}/resumes`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Resume upload failed");
      }

      setMessage("Resume uploaded successfully.");
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Resume upload failed"
      );
      return false;
    } finally {
      setUploading(false);
    }
  }

  return { uploading, message, error, uploadResume };
}
