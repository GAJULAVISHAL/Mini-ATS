
import { useCallback, useState } from "react";
import type { Application } from "../types";
import { apiUrl } from "../lib/api";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async (jobId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/jobs/${jobId}/applications`));
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load applicants");
      }

      const data = Array.isArray(result.data)
        ? result.data
        : result.data?.applications;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected applicants API response");
      }

      setApplications(data);
      return data as Application[];
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applicants"
      );
      setApplications([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(
    async (applicationId: string, jobId: string) => {
      setGeneratingId(applicationId);
      setError("");

      try {
        const response = await fetch(
          apiUrl(`/api/jobs/applications/${applicationId}/match-report`),
          { method: "POST" }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to generate match report"
          );
        }

        await fetchApplications(jobId);
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate match report"
        );
        return false;
      } finally {
        setGeneratingId(null);
      }
    },
    [fetchApplications]
  );

  return {
    applications,
    loading,
    error,
    generatingId,
    fetchApplications,
    generateReport,
  };
}
